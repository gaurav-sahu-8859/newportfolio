const { z } = require("zod");
//createing an object schema
const signupSchema = z.object({
    username: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(3, { message: "Name must be at least of 3 chars." })
        .max(255, { message: "Name must be at least of 255 chars." }),
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email({ message: "invalid email address" })
        .min(3, { message: "Email must be at least of 3 chars." })
        .max(255, { message: "Email must be at least of 255 chars." }),
    phone: z
        .string({ required_error: "Phone is required" })
        .trim()
        .min(10, { message: "Phone must be at least of 10 chars." })
        .max(20, { message: "Phone must be at least of 20 chars." }),
    password: z
        .string({ required_error: "Password is required" })
        .trim()
        .min(7, { message: "Password must be at least of 3 chars." })
        .max(255, { message: "Password must be at least of 255 chars." }),
});
module.exports = signupSchema;