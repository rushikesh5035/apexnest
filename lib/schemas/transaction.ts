import { CategoryKey } from "@/constants/categories";
import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["EXPENSE", "INCOME"]),
  amount: z
    .string()
    .min(1, "Enter an amount")
    .refine((value) => {
      const parsedValue = parseFloat(value.replace(/,/g, ""));
      return !Number.isNaN(parsedValue) && parsedValue > 0;
    }, "Enter a valid amount."),
  category: z.custom<CategoryKey>((value) => typeof value === "string"),
  accountId: z.string().min(1, "Select an account"),
  description: z.string().optional(),
  date: z.date(),
});

export type TransactionFormSchemaType = z.infer<typeof transactionSchema>;
