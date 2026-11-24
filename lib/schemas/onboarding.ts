import { z } from "zod";

export const onboardingSchema = z.object({
  startingBalance: z
    .string()
    .trim()
    .min(1, "Please enter a starting balance.")
    .refine((v) => {
      if (
        !/^(?:\d+|\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})*,\d{3})(?:\.\d{1,2})?$/.test(
          v,
        )
      )
        return false;
      const parsed = Number(v.replace(/,/g, ""));
      return Number.isSafeInteger(Math.round(parsed * 100)) && parsed > 0;
    }, "Please enter a valid starting balance."),
});

export type OnboardingFormSchemaType = z.infer<typeof onboardingSchema>;
