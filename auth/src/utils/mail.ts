import "dotenv/config"
import nodemailer from "nodemailer"

const from = process.env["SMTP_FROM"]

const transporter = nodemailer.createTransport({
    host: process.env["SMTP_HOST"] ?? "localhost",
    port: Number(process.env["SMTP_PORT"] ?? 1025),
    secure: false
})

export async function sendActivationEmail(to: string, name: string, code: string) {
    console.log(`Sending activation email to ${to} with code ${code}`)
    await transporter.sendMail({
        from,
        to,
        subject: "Activate your account",
        text: `Hi ${name},\n\nYour activation code is ${code}\nIt expires in 10 minutes.`
    })
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
    const link = `${process.env.UI_URL}/auth/reset-password?token=${token}`
    await transporter.sendMail({
        from,
        to,
        subject: "Reset your password",
        text: `Hi ${name},\n\nReset your password using this link:\n${link}\n\nIt expires in 1 hour. If you did not ask for this, ignore this email.`
    })
}