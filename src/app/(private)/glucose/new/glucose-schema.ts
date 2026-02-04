import * as z from "zod";

export const formSchema = z.object({
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Hora é obrigatória"),
  glucose: z
    .string()
    .min(1, "Medição de glicemia é obrigatória")
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
      message: "Valor deve ser um número positivo",
    })
    .refine((val) => Number(val) <= 600, {
      message: "Valor muito alto. Verifique a medição",
    }),
});

export type FormData = z.infer<typeof formSchema>;
