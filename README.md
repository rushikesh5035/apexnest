<div align="center">
  <img src="./assets/images/apexnest-light.png" alt="ApexNest Logo" width="220"/>
  <h1>ApexNest</h1>
  <p><strong>AI-Powered Personal Finance & Expense Tracking</strong></p>
  <p>Log transactions with your voice, a receipt photo, or manually — then let AI do the thinking.</p>

![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
</div>

---

## ✨ What is ApexNest?

**ApexNest** is a premium mobile personal finance app that removes the friction from expense tracking. Instead of manually typing every transaction, you can:

- 📸 **Snap a receipt** — AI reads the total, merchant, date, and category automatically
- 🎙️ **Say it out loud** — _"Spent 450 on dinner yesterday"_ and the transaction is filled in
- ⌨️ **Type it manually** — classic form with smart category pills and a date picker
- 🤖 **Ask your AI assistant** — _"How much did I spend on food this month?"_ and get a real answer grounded in your actual data

---

## 🚀 Core Features

| Feature                    | Description                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| **AI Receipt Scanning**    | Captures a receipt photo and uses Gemini Vision to extract amount, category, date, and merchant |
| **AI Voice Logging**       | Records a short voice note and uses Gemini Audio to transcribe and extract the transaction      |
| **Manual Entry**           | Full form with type toggle, category pills, account selector, and calendar date picker          |
| **Multi-Account Tracking** | Cash, Bank, Credit Card, and Savings accounts with auto-balance updates                         |
| **Dashboard Analytics**    | Real-time net balance, monthly income/expense summary, pie chart breakdowns                     |
| **Monthly Budget**         | Set a budget goal and track progress with a live color-coded progress bar                       |
| **Transaction History**    | Full searchable list with type/account filters and a daily income-vs-expense bar chart          |
| **AI Financial Assistant** | Conversational chatbot using last-30-day spending context for personalized answers              |
| **CSV Export**             | Export your transaction history to a CSV file and share it natively                             |
| **Weekly AI Email Digest** | Automated weekly summary email with AI-generated personalized saving tips                       |
| **Multi-Currency Support** | Pick your primary currency during onboarding; change it anytime from Profile                    |
| **Profile & Avatar**       | Edit profile picture (synced to Clerk), manage accounts, and control preferences                |

---

## 🛠️ Tech Stack

| Layer                  | Technology                                                              |
| ---------------------- | ----------------------------------------------------------------------- |
| **Framework**          | [Expo](https://expo.dev) SDK 54 + React Native 0.81                     |
| **Language**           | TypeScript 5.9                                                          |
| **Routing**            | [Expo Router](https://expo.github.io/router) v6 (file-based)            |
| **Styling**            | [NativeWind](https://nativewind.dev) v4 (Tailwind CSS for React Native) |
| **Authentication**     | [Clerk](https://clerk.com) (`@clerk/expo`)                              |
| **Database & Backend** | [Supabase](https://supabase.com) (PostgreSQL + Edge Functions)          |
| **AI / LLM**           | [Google Gemini](https://ai.google.dev) `gemini-3.1-flash-lite`          |
| **Server State**       | [TanStack React Query](https://tanstack.com/query) v5                   |
| **Client State**       | [Zustand](https://zustand-demo.pmnd.rs) v5                              |
| **Forms & Validation** | React Hook Form + Zod                                                   |
| **Charts**             | react-native-gifted-charts                                              |
| **Animations**         | React Native Reanimated 4                                               |
| **Email**              | Resend (via Supabase Edge Function)                                     |

---

## 📁 Project Structure

```
ApexNest/
├── app/                          # File-based routing (Expo Router)
│   ├── _layout.tsx               # Root layout: Clerk + QueryClient + GestureHandler
│   ├── (auth)/                   # Public auth screens (sign-in, sign-up)
│   └── (root)/                   # Protected screens (requires auth)
│       ├── onboarding.tsx        # First-launch currency setup
│       └── (tabs)/               # Bottom tab navigator
│           ├── index.tsx         # Home dashboard
│           ├── transactions.tsx  # Full transaction list + charts
│           ├── add-transaction.tsx # Add transaction (manual/voice/scan)
│           ├── assistant.tsx     # AI chat assistant
│           └── profile.tsx       # Profile, accounts, preferences
│
├── components/                   # Reusable UI components
│   ├── common/                   # Budget modal, form sheet wrappers
│   ├── onboarding/               # Currency picker
│   └── tabs/                     # Screen-specific components
│       ├── add-transaction/      # ReceiptScannerModal, VoiceRecorderModal, PillGroup…
│       ├── home/                 # TransactionRow
│       └── profile/              # AccountModal
│
├── constants/
│   ├── categories.ts             # 15 expense + 6 income categories with colors & icons
│   └── theme.ts                  # Brand colors, gradients, design tokens
│
├── hooks/
│   ├── useSupabase.ts            # Authenticated Supabase client hook
│   ├── useUserSync.ts            # Clerk → Supabase user sync on login
│   ├── mutations/                # useTransactionMutation, useAccountMutation, useBudgetMutations
│   └── queries/                  # useTransactionsQuery, useAccountsQuery, useBudgetQuery
│
├── lib/
│   ├── supabase.ts               # Supabase client factory (Clerk JWT integration)
│   ├── schemas/                  # Zod validation schemas
│   ├── services/                 # Business logic (accounts, transactions, budgets, AI)
│   ├── query/                    # React Query client & key registry
│   └── utils/                    # formatPrice, CSV export helpers
│
├── store/
│   └── userStore.ts              # Zustand global store (currency, onboarding state)
│
└── supabase/
    └── functions/
        └── weekly-tips/          # Deno Edge Function: AI digest email sent weekly
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Expo Go](https://expo.dev/go) on your device, or an Android/iOS simulator

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/apexnest.git
cd apexnest
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Clerk Authentication
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your-anon-public-key

# Google Gemini AI
EXPO_PUBLIC_GEMINI_API_KEY=AIza...
```

> **Where to get keys:**
>
> - **Clerk** → [clerk.com](https://clerk.com) → Create app → API Keys
> - **Supabase** → [supabase.com](https://supabase.com) → Project Settings → API
> - **Gemini** → [aistudio.google.com](https://aistudio.google.com) → Get API Key

### 4. Set Up Supabase Database

Run the following SQL in your Supabase SQL Editor:

```sql
-- Users table (synced from Clerk)
create table users (
  clerk_id text primary key,
  email text,
  name text,
  image_url text,
  currency text default 'INR',
  created_at timestamptz default now()
);

-- Accounts table
create table accounts (
  id uuid primary key default gen_random_uuid(),
  user_id text references users(clerk_id) on delete cascade,
  name text not null,
  type text check (type in ('CASH','BANK','CREDIT_CARD','SAVINGS')) not null,
  balance numeric default 0,
  is_default boolean default false,
  created_at timestamptz default now()
);

-- Transactions table
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id text references users(clerk_id) on delete cascade,
  account_id uuid references accounts(id) on delete cascade,
  type text check (type in ('INCOME','EXPENSE')) not null,
  amount numeric not null,
  category text not null,
  description text,
  date timestamptz not null,
  status text default 'completed',
  input_method text check (input_method in ('MANUAL','RECEIPT_SCAN','VOICE')) default 'MANUAL',
  voice_transcript text,
  is_flagged boolean default false,
  flag_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Budgets table
create table budgets (
  id uuid primary key default gen_random_uuid(),
  user_id text unique references users(clerk_id) on delete cascade,
  amount numeric not null,
  last_alert_sent timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

> Enable **Row Level Security (RLS)** on all tables and add policies so users can only access their own data.

### 5. Run the App

```bash
# Start Expo dev server
npx expo start

# Open on Android
npx expo start --android

# Open on iOS
npx expo start --ios
```

---

## 🤖 AI Features In Depth

### Receipt Scanner

Uses `expo-camera` to capture a photo, converts it to base64, and sends it directly to **Gemini's vision model**. The response is schema-validated JSON, guaranteeing parseable output:

```json
{
  "type": "EXPENSE",
  "amount": 349,
  "category": "food",
  "description": "Swiggy",
  "date": "2026-08-27"
}
```

### Voice Logger

Uses `expo-audio` to record a high-quality `.m4a` clip. The base64 audio is sent to Gemini with a natural language prompt that includes today's date for relative date resolution (e.g., _"yesterday"_ → `2026-08-26`).

### Financial Assistant

The chatbot injects a structured context string (last 30 days of transactions, category breakdown, and budget status) into every Gemini prompt — ensuring answers are grounded in real user data, not hallucinated.

### Weekly Email Digest

A Deno edge function deployed on Supabase, triggered weekly. It:

1. Fetches all users with activity in the last 7 days
2. Builds a per-user spending summary by category
3. Asks Gemini for 2–4 personalized, actionable saving tips
4. Delivers a branded HTML email via [Resend](https://resend.com)

---

## 🏗️ Key Architectural Decisions

- **Clerk + Supabase JWT** — The Supabase client is initialized with `accessToken: () => clerk.getToken()` so every query runs under the user's Clerk identity, enabling Supabase RLS to enforce strict data isolation between users.
- **React Query for server state** — All Supabase reads go through `useQuery` hooks with a centralized key registry. Mutations immediately invalidate the relevant caches so the UI is always consistent.
- **Zustand for client state** — Only two values live in global state: `currency` (avoids prop-drilling into formatters) and `needsOnboarding` (routing guard). Everything else is colocated at the component level.
- **Gemini structured output** — All AI extraction calls use `generationConfig.responseSchema` to guarantee JSON-parseable responses, eliminating brittle text parsing.
- **Balance updates are sequential** — Creating/deleting transactions updates account balances via two guarded sequential calls. A future improvement is to migrate these to a Postgres RPC for true atomicity.

---

## 📜 License

This project is private and proprietary.

---

<div align="center">
  Built with ❤️ using Expo, Supabase & Gemini AI
</div>
