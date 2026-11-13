import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useFetch } from "#/hooks/useFetch"
import { Button, buttonVariants } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field"
import { cn } from "#/lib/utils"
import { LoaderIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

const schema = z
    .object({
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Confirm your password")
    })
    .refine((values) => values.password === values.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    })

type ResetValues = z.infer<typeof schema>

export const Route = createFileRoute("/auth/reset-password")({
    validateSearch: (search: Record<string, unknown>) => ({
        token: String(search.token ?? "")
    }),
    component: ResetPassword
})

function ResetPassword() {
    const { token } = Route.useSearch()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ResetValues>({
        resolver: zodResolver(schema),
        defaultValues: { password: "", confirmPassword: "" }
    })

    const [isPending, reset] = useFetch<{ token: string; password: string }>(
        "/auth/reset-password",
        "POST",
        () => navigate({ to: "/auth/login" })
    )

    return (
        <div className="flex min-h-svh items-center justify-center p-4">
            <form
                onSubmit={handleSubmit(({ password }) => reset({ token, password }))}
                className="w-full max-w-sm"
            >
                <FieldGroup>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">Reset password</h1>
                        <p className="text-sm text-muted-foreground">Choose a new password for your account</p>
                    </div>

                    <Field data-invalid={!!errors.password}>
                        <FieldLabel htmlFor="password">New password</FieldLabel>
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

                    <Button type="submit" disabled={isPending || !token}>
                        {isPending ? <HugeiconsIcon icon={LoaderIcon} className="animate-spin" /> : "Reset password"}
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