import { Link, createFileRoute } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useFetch } from "#/hooks/useFetch"
import { Button, buttonVariants } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field"
import { cn } from "#/lib/utils"

const schema = z.object({
  email: z.email("Enter a valid email")
})

type ForgotValues = z.infer<typeof schema>

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPassword
})

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" }
  })

  const [isPending, forgot] = useFetch<ForgotValues>("/auth/forgot-password", "POST")

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <form onSubmit={handleSubmit(forgot)} className="w-full max-w-sm">
        <FieldGroup>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Forgot password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Sending..." : "Send reset link"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Remembered your password?{" "}
            <Link
              to="/auth/login"
              className={cn(buttonVariants({ variant: "link" }), "h-auto p-0")}
            >
              Login
            </Link>
          </p>
        </FieldGroup>
      </form>
    </div>
  )
}