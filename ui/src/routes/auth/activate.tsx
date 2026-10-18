import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useFetch } from "#/hooks/useFetch"
import { Button, buttonVariants } from "#/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "#/components/ui/input-otp"
import { Field, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field"
import { cn } from "#/lib/utils"

const schema = z.object({
  code: z.string().length(6, "Enter the 6-digit code")
})

type ActivateValues = z.infer<typeof schema>

export const Route = createFileRoute("/auth/activate")({
  component: Activate
})

function Activate() {
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ActivateValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: "" }
  })

  const [isActivating, activate] = useFetch<ActivateValues>("/auth/activate", "POST", (res) => {
    localStorage.setItem("AUTH_TOKEN", res.token)
    navigate({ to: "/auth/me" })
  })

  const [isResending, resend] = useFetch<Record<string, never>>("/auth/resend-activation", "POST")

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <form onSubmit={handleSubmit(activate)} className="w-full max-w-sm">
        <FieldGroup>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Activate account</h1>
            <p className="text-sm text-muted-foreground">Enter the code we sent to your email</p>
          </div>

          <Field data-invalid={!!errors.code}>
            <FieldLabel htmlFor="code">Verification code</FieldLabel>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <InputOTP
                  id="code"
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  autoFocus
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            <FieldError errors={[errors.code]} />
          </Field>

          <Button type="submit" disabled={isActivating}>
            {isActivating ? "Activating..." : "Activate"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Didn't get a code?{" "}
            <button
              type="button"
              disabled={isResending}
              onClick={() => resend({})}
              className={cn(buttonVariants({ variant: "link" }), "h-auto p-0")}
            >
              {isResending ? "Sending..." : "Resend code"}
            </button>
          </p>
        </FieldGroup>
      </form>
    </div>
  )
}