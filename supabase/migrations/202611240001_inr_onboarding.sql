begin;

alter table public.users add column onboarding_complete boolean not null default false;
-- Preserve the previous onboarding decision for existing profiles.
update public.users u set onboarding_complete = true
where currency is not null or exists (
  select 1 from public.transactions t where t.user_id = u.clerk_id
);
alter table public.users alter column currency set default 'INR';

-- A preference alone can be retired. Recorded money needs an explicit conversion decision.
do $$
begin
  if exists (
    select 1 from public.users u
    where upper(trim(u.currency)) <> 'INR' and (
      exists (select 1 from public.transactions t where t.user_id = u.clerk_id) or
      exists (select 1 from public.accounts a where a.user_id = u.clerk_id and a.balance <> 0) or
      exists (select 1 from public.budgets b where b.user_id = u.clerk_id and b.amount <> 0)
    )
  ) then
    raise exception 'Review legacy non-INR balances, transactions and budgets before switching to INR';
  end if;
end;
$$;
update public.users set currency = 'INR' where currency is distinct from 'INR';
alter table public.users alter column currency set not null;
alter table public.users add constraint users_currency_inr check (currency = 'INR');

create function public.sync_onboarding(profile_email text, profile_name text, profile_image text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare
  subject text := auth.jwt()->>'sub';
  completed boolean;
begin
  if subject is null then raise exception 'Sign in required'; end if;
  insert into public.users (clerk_id, email, name, image_url, currency)
    values (subject, profile_email, profile_name, profile_image, 'INR')
    on conflict (clerk_id) do nothing;
  select onboarding_complete into strict completed from public.users
    where clerk_id = subject for update;
  if not exists (select 1 from public.accounts where user_id = subject and is_default) then
    insert into public.accounts (user_id, name, type, balance, is_default)
      values (subject, 'Cash', 'CASH', 0, true);
  end if;
  return completed;
end;
$$;

create function public.complete_onboarding(opening_amount numeric)
returns void language plpgsql security invoker set search_path = '' as $$
declare
  subject text := auth.jwt()->>'sub';
  completed boolean;
  cash_account uuid;
begin
  select onboarding_complete into strict completed from public.users
    where clerk_id = subject for update;
  if completed then return; end if;
  if opening_amount is null or not (opening_amount > 0 and opening_amount <= 90071992547409.91)
    or opening_amount <> round(opening_amount, 2) then
    raise exception 'Enter a positive rupee amount with at most two decimal places';
  end if;
  select id into strict cash_account from public.accounts
    where user_id = subject and is_default for update;
  insert into public.transactions (user_id, account_id, type, amount, category, description, input_method, date)
    values (subject, cash_account, 'INCOME', opening_amount, 'other_income', 'Starting balance', 'MANUAL', now());
  update public.accounts set balance = coalesce(balance, 0) + opening_amount
    where id = cash_account;
  if not found then raise exception 'Account balance update failed'; end if;
  update public.users set onboarding_complete = true, currency = 'INR' where clerk_id = subject;
  if not found then raise exception 'Onboarding update failed'; end if;
end;
$$;

revoke all on function public.sync_onboarding(text,text,text), public.complete_onboarding(numeric) from public, anon;
grant execute on function public.sync_onboarding(text,text,text), public.complete_onboarding(numeric) to authenticated;
commit;
