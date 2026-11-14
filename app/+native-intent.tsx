type NativeIntentEvent = {
  path: string;
  initial: boolean;
};

export function redirectSystemPath({ path }: NativeIntentEvent) {
  // Clerk's browser auth session handles this callback; it is not an app route.
  if (path.includes("hosted-auth-callback")) {
    return null;
  }

  return path;
}
