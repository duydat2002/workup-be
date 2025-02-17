import { z } from 'zod'

export const labelSchema = z.object({
  name: z.string(),
  color: z
    .string()
    .refine((value) => /^#([A-F0-9]{3,4}|[A-F0-9]{6}|[A-F0-9]{8})$/i.test(value ?? ''), 'Invalid hex color')
})
