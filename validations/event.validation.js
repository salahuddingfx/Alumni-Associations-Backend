const { z } = require('zod');

const eventSchema = z.object({
  body: z.object({
    title: z.object({
      en: z.string().min(3, 'English title must be at least 3 characters'),
      bn: z.string().min(3, 'Bengali title must be at least 3 characters'),
    }),
    description: z.object({
      en: z.string().min(5, 'English description is required'),
      bn: z.string().min(5, 'Bengali description is required'),
    }),
    date: z.string().transform((val) => new Date(val)),
    location: z.object({
      en: z.string().min(3, 'English location is required'),
      bn: z.string().min(3, 'Bengali location is required'),
    }),
    category: z.enum(['reunion', 'seminar', 'sports', 'cultural', 'social', 'other']).optional(),
    capacity: z.number().nonnegative().optional(),
    isFeatured: z.boolean().optional(),
  }),
});

module.exports = {
  eventSchema,
};
