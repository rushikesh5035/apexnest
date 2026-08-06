import { z } from "zod";

export const onboardingSchema = z.object({
  startingBalance: z
    .string()
    .min(1, "Please enter a starting balance")
    .refine((value) => {
      const parsedValue = parseFloat(value.replace(/,/g, ""));
      return !Number.isNaN(parsedValue) && parsedValue >= 0;
    }, "Please enter a valid starting balance"),
});

export type OnboardingFormSchemaType = z.infer<typeof onboardingSchema>;
