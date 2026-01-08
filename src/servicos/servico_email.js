// servico_email.js
import nodemailer from "nodemailer";

// Configure seu email e a senha de app gerada no Gmail
const EMAIL_USER = "devsouzasouza@gmail.com"; // seu Gmail
const EMAIL_PASS = "josq nwil ohbf dosy"; // senha de app gerada

// Criando o transporte do Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Função para enviar email de reset
export async function enviarEmailReset(destinatario, token) {
  const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

  const mailOptions = {
    from: EMAIL_USER,
    to: destinatario, // aqui é dinâmico!
    subject: "Redefinição de senha",
    html: `
      <p>Você solicitou a redefinição de senha.</p>
      <p>Clique no link abaixo para criar uma nova senha:</p>
      <a href="${resetUrl}">Redefinir senha</a>
      <p>O link expira em 1 hora.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}