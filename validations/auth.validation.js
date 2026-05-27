const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters').optional(),
    phone: z.string().min(5, 'Phone number is too short').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    identifier: z.string().min(1, 'Email, Username or Phone number is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
