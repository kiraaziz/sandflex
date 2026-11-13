import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useFetch } from "#/hooks/useFetch"
import { Button, buttonVariants } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field"
import { cn } from "#/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { LoaderIcon } from "@hugeicons/core-free-icons"

const schema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
})

type LoginValues = z.infer<typeof schema>

export const Route = createFileRoute("/auth/login")({
  component: Login
})

function Login() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" }
  })

  const [isPending, login] = useFetch<LoginValues>("/auth/login", "POST", (res) => {
    localStorage.setItem("AUTH_TOKEN", res.token)
    navigate({ to: "/auth/me" })
  })

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <form onSubmit={handleSubmit(login as any)} className="w-full max-w-sm">
        <FieldGroup>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Login</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
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

          <Field data-invalid={!!errors.password}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link
                to="/auth/forgot-password"
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <FieldError errors={[errors.password]} />
          </Field>

          <Button type="submit" disabled={isPending}>
            {isPending ? <HugeiconsIcon icon={LoaderIcon} className="animate-spin" /> : "Login"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className={cn(buttonVariants({ variant: "link" }), "h-auto p-0")}
            >
              Register
            </Link>
          </p>
        </FieldGroup>
      </form>
    </div>
  )
}