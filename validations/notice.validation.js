const { z } = require('zod');

const noticeSchema = z.object({
  body: z.object({
    title: z.object({
      en: z.string().min(3, 'English title must be at least 3 characters'),
      bn: z.string().min(3, 'Bengali title must be at least 3 characters'),
    }),
    content: z.object({
      en: z.string().min(5, 'English content is required'),
      bn: z.string().min(5, 'Bengali content is required'),
    }),
    priority: z.enum(['high', 'medium', 'low']).optional(),
    isSticky: z.boolean().optional(),
    isPublished: z.boolean().optional(),
  }),
});

module.exports = {
  noticeSchema,
};
