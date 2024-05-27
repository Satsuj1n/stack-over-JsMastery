import { z } from "zod";

export const QuestionsSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(130, "Title must be at most 130 characters long"),
  explanation: z.string().min(10),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});
