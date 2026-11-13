import { createFileRoute, redirect } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { HugeiconsIcon } from "@hugeicons/react"
import { LoaderIcon } from "@hugeicons/core-free-icons"
import { useFetch } from "#/hooks/useFetch"
import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Badge } from "#/components/ui/badge"
import { Field, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "#/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "#/components/ui/table"

type Application = {
  id: number
  nom: string
  webhookUrl: string | null
  entrepriseId: number | null
  statut: "ACTIVE" | "INACTIVE"
}

type ApplicationPayload = {
  nom: string
  webhookUrl: string | null
  entrepriseId?: number | null
}

const schema = z.object({
  nom: z.string().trim().min(1, "Name is required"),
  webhookUrl: z.union([z.literal(""), z.url("Enter a valid URL")]),
  entrepriseId: z.string().regex(/^\d*$/, "Numbers only")
})

type ApplicationValues = z.infer<typeof schema>

export const Route = createFileRoute("/applications")({
  beforeLoad: () => {
    if (!localStorage.getItem("AUTH_TOKEN")) throw redirect({ to: "/auth/login" })
  },
  component: Applications
})

function Applications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [dialog, setDialog] = useState<{ open: boolean; application: Application | null }>({
    open: false,
    application: null
  })

  const [isLoading, load] = useFetch<void>(
    "/applications",
    "GET",
    (res) => setApplications(res),
    { showSonner: false }
  )

  useEffect(() => {
    load()
  }, [])

  const closeDialog = () => setDialog({ open: false, application: null })

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Applications</h1>
          <p className="text-sm text-muted-foreground">Manage your applications</p>
        </div>
        <Button onClick={() => setDialog({ open: true, application: null })}>
          New application
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Webhook URL</TableHead>
              <TableHead>Company ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <HugeiconsIcon icon={LoaderIcon} className="mx-auto animate-spin" />
                </TableCell>
              </TableRow>
            ) : applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No applications yet. Create your first one.
                </TableCell>
              </TableRow>
            ) : (
              applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.nom}</TableCell>
                  <TableCell className="max-w-64 truncate text-muted-foreground">
                    {application.webhookUrl ?? "-"}
                  </TableCell>
                  <TableCell>{application.entrepriseId ?? "-"}</TableCell>
                  <TableCell>
                    <Badge variant={application.statut === "ACTIVE" ? "default" : "secondary"}>
                      {application.statut === "ACTIVE" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDialog({ open: true, application })}
                    >
                      Edit
                    </Button>
                    <StatusButton application={application} onDone={load} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {dialog.open && (
        <ApplicationDialog
          application={dialog.application}
          onClose={closeDialog}
          onSaved={() => {
            closeDialog()
            load()
          }}
        />
      )}
    </div>
  )
}

function StatusButton({ application, onDone }: { application: Application; onDone: () => void }) {
  const isActive = application.statut === "ACTIVE"

  const [isPending, toggle] = useFetch<void>(
    isActive ? `/applications/${application.id}` : `/applications/${application.id}/reactiver`,
    isActive ? "DELETE" : "PUT",
    () => onDone()
  )

  return (
    <Button
      variant={isActive ? "destructive" : "secondary"}
      size="sm"
      disabled={isPending}
      onClick={() => toggle()}
    >
      {isPending ? (
        <HugeiconsIcon icon={LoaderIcon} className="animate-spin" />
      ) : isActive ? (
        "Deactivate"
      ) : (
        "Reactivate"
      )}
    </Button>
  )
}

function ApplicationDialog({
  application,
  onClose,
  onSaved
}: {
  application: Application | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = application !== null

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ApplicationValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom: application?.nom ?? "",
      webhookUrl: application?.webhookUrl ?? "",
      entrepriseId: application?.entrepriseId?.toString() ?? ""
    }
  })

  const [isPending, save] = useFetch<ApplicationPayload>(
    isEdit ? `/applications/${application.id}` : "/applications",
    isEdit ? "PUT" : "POST",
    () => onSaved()
  )

  const onSubmit = (values: ApplicationValues) => {
    const payload: ApplicationPayload = {
      nom: values.nom,
      webhookUrl: values.webhookUrl || null
    }
    if (!isEdit) payload.entrepriseId = values.entrepriseId ? Number(values.entrepriseId) : null
    save(payload as any)
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <DialogHeader>
              <DialogTitle>{isEdit ? "Edit application" : "New application"}</DialogTitle>
              <DialogDescription>
                {isEdit
                  ? "Update the name or webhook of this application"
                  : "Fill in the details of your application"}
              </DialogDescription>
            </DialogHeader>

            <Field data-invalid={!!errors.nom}>
              <FieldLabel htmlFor="nom">Name</FieldLabel>
              <Input id="nom" aria-invalid={!!errors.nom} {...register("nom")} />
              <FieldError errors={[errors.nom]} />
            </Field>

            <Field data-invalid={!!errors.webhookUrl}>
              <FieldLabel htmlFor="webhookUrl">Webhook URL</FieldLabel>
              <Input
                id="webhookUrl"
                placeholder="https://example.com/webhook"
                aria-invalid={!!errors.webhookUrl}
                {...register("webhookUrl")}
              />
              <FieldError errors={[errors.webhookUrl]} />
            </Field>

            {!isEdit && (
              <Field data-invalid={!!errors.entrepriseId}>
                <FieldLabel htmlFor="entrepriseId">Company ID</FieldLabel>
                <Input
                  id="entrepriseId"
                  inputMode="numeric"
                  aria-invalid={!!errors.entrepriseId}
                  {...register("entrepriseId")}
                />
                <FieldError errors={[errors.entrepriseId]} />
              </Field>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <HugeiconsIcon icon={LoaderIcon} className="animate-spin" /> : "Save"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}

