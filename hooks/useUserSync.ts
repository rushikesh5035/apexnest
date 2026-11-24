import { useSupabase } from "@/hooks/useSupabase";
import { querykeys } from "@/lib/query/keys";
import { useAuth, useUser } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";

export function useUserSync() {
  const { user, isLoaded } = useUser();
  const { isSignedIn, userId, sessionClaims } = useAuth();
  const client = useSupabase();
  return useQuery({
    queryKey: querykeys.onboarding(user?.id),
    enabled: isLoaded && !!isSignedIn && !!user && user.id === userId,
    staleTime: Infinity,
    queryFn: async () => {
      if (!user) throw new Error("Sign in required");
      const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
      if (!email) throw new Error("This account needs an email address to finish setup.");
      const { data, error, status } = await client.rpc("sync_onboarding", {
        profile_email: email,
        profile_name: user.fullName ?? "",
        profile_image: user.imageUrl,
      });
      if (error) {
        const reference = error.code || (status ? `HTTP ${status}` : "NETWORK");
        if (__DEV__ && error.code === "42501") {
          const role = sessionClaims?.role;
          const sessionRole = typeof role === "string" ? role : "missing";
          throw new Error(`Account sync failed (42501, HTTP ${status}): ${error.message}. Clerk session role: ${sessionRole}.`);
        }
        throw new Error(`Account sync failed (${reference}).`);
      }
      if (typeof data !== "boolean")
        throw new Error("Could not load onboarding status");
      return data;
    },
  });
}
