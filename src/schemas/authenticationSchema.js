import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string()
        .min(3, "Nazwa użytkownika musi mieć minimum 3 znaki")
        .max(16, "Nazwa użytkownika może mieć maksymalnie 16 znaków"),

    password: z.string()
        .min(12, "Hasło musi mieć mininum 12 znaków")
        .max(100, "Hasło może mieć maksymalnie 100 znaków"),
   
    confirmPassword: z.string()
        .min(1, "Potwierdzenie hasła jest wymagane"),

    name: z.string()
        .min(2, "Imię musi mieć minimum 2 znaki")
        .max(20, "Imię może mieć maksymalnie 20 znaków"),
    
    surname: z.string()
    .min(2, "Naziwsko musi mieć minimum 2 znaki")
    .max(40, "Naziwsko może mieć maksymalnie 40 znaków"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą być identyczne",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    username: z.string().min(1, "Nazwa użytkownika jest wymagana"),
    password: z.string().min(1, "Hasło jest wymagane"),
});