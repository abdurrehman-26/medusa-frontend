"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { sdk } from "@/lib/sdk";
import { FetchError } from "@medusajs/js-sdk";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ✅ Centralized validation schema
const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

// ✅ Auto-inferred form type
type SignUpFormValues = z.infer<typeof schema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormValues>({
    resolver: zodResolver(schema), // ✅ Use Zod for validation
  });

  const handleRegistration = async (data: SignUpFormValues) => {
    const {firstName, lastName, email, password} = data
    // obtain registration JWT token
    try {
      await sdk.auth.register("customer", "emailpass", {
        email,
        password,
      })
    } catch (error) {
      const fetchError = error as FetchError

      if (fetchError.message === "Identity with email already exists") {
        toast.error("Account with email already exists")
        return
      }
      
      if (fetchError.statusText !== "Unauthorized") {
        toast.error("Failed to create account")
        return
      }
    }

    // create customer
    try {
      await sdk.store.customer.create({
        first_name: firstName,
        last_name: lastName,
        email,
      })

      router.push("login")
    } catch {
      toast.error("Failed to create account")
      return
    }
  }


  return (
    <form onSubmit={handleSubmit(handleRegistration)}
          className={cn("flex flex-col gap-6", className)} {...props}>
      
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Signup for new account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details below to Signup for new account
        </p>
      </div>

      <div className="grid gap-6">
        {/* First Name */}
        <div className="grid gap-3">
          <Label htmlFor="firstName">First name</Label>
          <div>
            <Input id="firstName" {...register("firstName")} />
            <p className="text-xs text-red-600">{errors.firstName?.message}</p>
          </div>
        </div>

        {/* Last Name */}
        <div className="grid gap-3">
          <Label htmlFor="lastName">Last name</Label>
          <div>
            <Input id="lastName" {...register("lastName")} />
            <p className="text-xs text-red-600">{errors.lastName?.message}</p>
          </div>
        </div>

        {/* Email */}
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <div>
            <Input id="email" type="email" {...register("email")} />
            <p className="text-xs text-red-600">{errors.email?.message}</p>
          </div>
        </div>

        {/* Password */}
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <div>
            <Input id="password" type="password" {...register("password")} />
            <p className="text-xs text-red-600">{errors.password?.message}</p>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Re-enter Password</Label>
          <div>
            <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
            <p className="text-xs text-red-600">{errors.confirmPassword?.message}</p>
          </div>
        </div>

        <Button type="submit" className="w-full">Signup</Button>

        {/* Google Signup */}
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full">
          {/* Google Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          Signup with Google
        </Button>
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}
