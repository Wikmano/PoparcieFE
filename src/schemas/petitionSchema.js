import { z } from 'zod';

export const petitionSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Temat petycji jest wymagany')
      .max(100, 'Temat petycji może mieć maksymalnie 100 znaków'),
    shortDescription: z
      .string()
      .min(1, 'Krótki opis jest wymagany')
      .max(100, 'Krótki opis nie może być dłuższy niż 100 znaków'),
    longDescription: z
      .string()
      .min(1, 'Opis jest wymagany')
      .max(1000, 'Opis nie może być dłuższy niż 1000 znaków'),
    category: z.string().min(1, 'Kategoria petycji jest wymagana'),
    goal: z
      .number({ invalid_type_error: 'Cel musi być liczbą' })
      .min(100, 'Cel musi wynosić co najmniej 100')
      .max(100000, 'Cel nie może przekraczać 100 000'),
    deadline: z.string().min(1, 'Termin zakończenia petycji jest wymagany'),
  })
  .strict();
