"use client";

import { redirect } from "next/navigation";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { signUp } from "@/lib/auth-client";

// const formSchema = z
//   .object({
//     name: z
//       .string()
//       .min(3, "Nome deve ter no mínimo 3 caracteres")
//       .max(50, "Nome deve ter no máximo 50 caracteres"),
//     email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
//     password: z
//       .string()
//       .min(8, "Senha deve ter no mínimo 8 caracteres")
//       .regex(/[A-Z]/, "Senha deve conter ao menos uma letra maiúscula")
//       .regex(/[0-9]/, "Senha deve conter ao menos um número"),
//     confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "As senhas não coincidem",
//     path: ["confirmPassword"],
//   });

// type FormData = z.infer<typeof formSchema>;

// export default function SignupPage() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const form = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   const onSubmit = async (data: FormData) => {
//     setIsLoading(true);
//     setError("");

//     try {
//       await signUp.email({
//         name: data.name,
//         email: data.email,
//         password: data.password,
//       });
//       // biome-ignore lint/suspicious/noExplicitAny: _
//     } catch (err: any) {
//       setError(err?.message || "Erro ao criar conta. Tente novamente.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a]">
//       {/* Animated blood cells background */}
//       <div className="absolute inset-0 opacity-20">
//         {[
//           { delay: "0s", duration: "9s", x: "15%", y: "25%" },
//           { delay: "1.5s", duration: "13s", x: "75%", y: "55%" },
//           { delay: "3.5s", duration: "11s", x: "25%", y: "75%" },
//           { delay: "0.5s", duration: "14s", x: "90%", y: "35%" },
//           { delay: "2.5s", duration: "10s", x: "45%", y: "60%" },
//           { delay: "4s", duration: "12s", x: "60%", y: "15%" },
//         ].map((cell, i) => (
//           <div
//             // biome-ignore lint/suspicious/noArrayIndexKey: _
//             key={i}
//             className="absolute w-16 h-16 rounded-full bg-linear-to-br from-red-500/80 to-red-900/40 blur-2xl animate-float"
//             style={{
//               animationDelay: cell.delay,
//               animationDuration: cell.duration,
//               left: cell.x,
//               top: cell.y,
//             }}
//           />
//         ))}
//       </div>

//       {/* Gradient overlay */}
//       <div className="absolute inset-0 bg-linear-to-br from-red-950/20 via-transparent to-red-900/10 pointer-events-none" />

//       {/* Main content */}
//       <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 py-12">
//         {/* Logo and branding */}
//         <div className="text-center mb-6 animate-fade-in">
//           <div className="inline-flex items-center justify-center mb-3">
//             <div className="relative">
//               <div className="w-16 h-16 rounded-full bg-linear-to-br from-red-600 to-red-800 flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.6)] animate-pulse-slow">
//                 {/** biome-ignore lint/a11y/noSvgWithoutTitle: _ */}
//                 <svg
//                   className="w-8 h-8 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                   />
//                 </svg>
//               </div>
//               <div className="absolute -inset-2 bg-red-500/20 rounded-full blur-xl animate-pulse" />
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold bg-linear-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent mb-1 tracking-tight">
//             Blood Tracker
//           </h1>
//         </div>

//         {/* Signup form */}
//         <div className="w-full max-w-sm">
//           <div className="bg-zinc-900/80 backdrop-blur-xl border border-red-900/30 rounded-2xl p-8 shadow-2xl animate-slide-up">
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-5"
//               >
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-red-100 text-sm font-medium">
//                         Nome Completo
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="text"
//                           placeholder="Seu nome"
//                           className="bg-zinc-950/50 border-red-900/40 text-white placeholder:text-zinc-500 focus-visible:border-red-500 focus-visible:ring-red-500/20 transition-all duration-300 h-11"
//                           disabled={isLoading}
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-400 text-xs" />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-red-100 text-sm font-medium">
//                         Email
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="email"
//                           placeholder="seu@email.com"
//                           className="bg-zinc-950/50 border-red-900/40 text-white placeholder:text-zinc-500 focus-visible:border-red-500 focus-visible:ring-red-500/20 transition-all duration-300 h-11"
//                           disabled={isLoading}
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-400 text-xs" />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-red-100 text-sm font-medium">
//                         Senha
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="password"
//                           placeholder="••••••••"
//                           className="bg-zinc-950/50 border-red-900/40 text-white placeholder:text-zinc-500 focus-visible:border-red-500 focus-visible:ring-red-500/20 transition-all duration-300 h-11"
//                           disabled={isLoading}
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-400 text-xs" />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="confirmPassword"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-red-100 text-sm font-medium">
//                         Confirmar Senha
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="password"
//                           placeholder="••••••••"
//                           className="bg-zinc-950/50 border-red-900/40 text-white placeholder:text-zinc-500 focus-visible:border-red-500 focus-visible:ring-red-500/20 transition-all duration-300 h-11"
//                           disabled={isLoading}
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-400 text-xs" />
//                     </FormItem>
//                   )}
//                 />

//                 {error && (
//                   <div className="bg-red-950/50 border border-red-800/50 rounded-lg p-3 animate-shake">
//                     <p className="text-red-200 text-sm text-center">{error}</p>
//                   </div>
//                 )}

//                 <Button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full h-11 bg-linear-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 transition-all duration-300 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//                 >
//                   {isLoading ? (
//                     <div className="flex items-center justify-center gap-2">
//                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                       <span>Criando conta...</span>
//                     </div>
//                   ) : (
//                     "Criar Conta"
//                   )}
//                 </Button>

//                 {/* <p className="text-zinc-400 text-xs text-center leading-relaxed">
//                   Ao criar uma conta, você concorda com nossos{" "}
//                   <a
//                     href="/terms"
//                     className="text-red-400 hover:text-red-300 underline underline-offset-2"
//                   >
//                     Termos de Uso
//                   </a>{" "}
//                   e{" "}
//                   <a
//                     href="/privacy"
//                     className="text-red-400 hover:text-red-300 underline underline-offset-2"
//                   >
//                     Política de Privacidade
//                   </a>
//                 </p> */}
//               </form>
//             </Form>
//           </div>

//           <p className="text-center mt-6 text-zinc-400 text-sm">
//             Já tem uma conta?{" "}
//             <a
//               href="/login"
//               className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200 hover:underline underline-offset-4"
//             >
//               Faça login
//             </a>
//           </p>
//         </div>

//         {/* Footer */}
//         <div className="mt-8 text-center text-zinc-600 text-xs">
//           <p>Seus dados de saúde, seguros e protegidos</p>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes float {
//           0%,
//           100% {
//             transform: translate(0, 0) scale(1);
//           }
//           33% {
//             transform: translate(30px, -30px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//         }

//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(-20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes slide-up {
//           from {
//             opacity: 0;
//             transform: translateY(40px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes shake {
//           0%,
//           100% {
//             transform: translateX(0);
//           }
//           25% {
//             transform: translateX(-5px);
//           }
//           75% {
//             transform: translateX(5px);
//           }
//         }

//         .animate-float {
//           animation: float var(--tw-animation-duration, 10s) ease-in-out
//             infinite;
//         }

//         .animate-fade-in {
//           animation: fade-in 0.8s ease-out;
//         }

//         .animate-slide-up {
//           animation: slide-up 0.8s ease-out 0.2s both;
//         }

//         .animate-pulse-slow {
//           animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }

//         .animate-shake {
//           animation: shake 0.4s ease-in-out;
//         }
//       `}</style>
//     </div>
//   );
// }

export default function Page() {
  redirect("/")
}