import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useFetch } from "#/hooks/useFetch"
import { Button, buttonVariants } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field"
import { cn } from "#/lib/utils"
import { Loader, LoaderIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

const schema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Enter a valid email"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Confirm your password")
    })
    .refine((values) => values.password === values.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    })

type RegisterValues = z.infer<typeof schema>

export const Route = createFileRoute("/auth/register")({
    component: Register
})

function Register() {
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterValues>({
        resolver: zodResolver(schema),
        defaultValues: { name: "", email: "", password: "", confirmPassword: "" }
    })

    const [isPending, signUp] = useFetch<Omit<RegisterValues, "confirmPassword">>(
        "/auth/register",
        "POST",
        (res) => {
            localStorage.setItem("AUTH_TOKEN", res.token)
            navigate({ to: "/auth/activate" })
        }
    )

    return (
        <div className="flex min-h-svh items-center justify-center p-4">
            <form
                onSubmit={handleSubmit(({ name, email, password }) => signUp({ name, email, password }))}
                className="w-full max-w-sm"
            >
                <FieldGroup>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">Register</h1>
                        <p className="text-sm text-muted-foreground">Create an account to get started</p>
                    </div>

                    <Field data-invalid={!!errors.name}>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <Input
                            id="name"
                            type="text"
                            autoComplete="name"
                            placeholder="John Doe"
                            aria-invalid={!!errors.name}
                            {...register("name")}
                        />
                        <FieldError errors={[errors.name]} />
                    </Field>

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
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            aria-invalid={!!errors.password}
                            {...register("password")}
                        />
                        <FieldError errors={[errors.password]} />
                    </Field>

                    <Field data-invalid={!!errors.confirmPassword}>
                        <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                        <Input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            aria-invalid={!!errors.confirmPassword}
                            {...register("confirmPassword")}
                        />
                        <FieldError errors={[errors.confirmPassword]} />
                    </Field>

                    <Button type="submit" disabled={isPending}>
                        {isPending ? <HugeiconsIcon icon={LoaderIcon} className="animate-spin" /> : "Register"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
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