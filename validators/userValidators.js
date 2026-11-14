const {z} = require("zod")

const registerSchema = z.object({
    ism: z.string().min(2),
    yosh: z.number().min(6).optional(),
    email: z.string().email().transform((email) => email.toLowerCase()),
    password: z.string().min(8),
    role: z.string()
})

const loginSchema = z.object({
    email: z.string().email().transform((email) => email.toLowerCase()),
    password: z.string().min(8)
})

module.exports = {registerSchema, loginSchema}