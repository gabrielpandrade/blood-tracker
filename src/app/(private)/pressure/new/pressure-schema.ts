import * as z from "zod";

export const formSchema = z
  .object({
    date: z.string().min(1, "Data é obrigatória"),
    time: z.string().min(1, "Hora é obrigatória"),
    systolic: z
      .string()
      .min(1, "Pressão sistólica é obrigatória")
      .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
        message: "Valor deve ser um número positivo",
      })
      .refine((val) => Number(val) <= 300, {
        message: "Valor muito alto. Verifique a medição",
      }),
    diastolic: z
      .string()
      .min(1, "Pressão diastólica é obrigatória")
      .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
        message: "Valor deve ser um número positivo",
      })
      .refine((val) => Number(val) <= 200, {
        message: "Valor muito alto. Verifique a medição",
      }),
  })
  .refine((data) => Number(data.systolic) > Number(data.diastolic), {
    message: "Pressão sistólica deve ser maior que a diastólica",
    path: ["systolic"],
  });

export type FormData = z.infer<typeof formSchema>;
