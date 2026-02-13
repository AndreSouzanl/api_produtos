import pool from "../conexao/conexao.js";
import bcrypt from "bcryptjs";

export async function validaDadosAutenticacao(email, senha) {
  try {
    email = email.toLowerCase();

    // Consulta o usuário pelo email
    const { rows } = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1 LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return { status: false, mensagem: "Usuário não encontrado." };
    }

    const usuario = rows[0];

    // Verifica se a senha bate com o hash
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return { status: false, mensagem: "Senha incorreta." };
    }

    return { status: true, usuario };

  } catch (erro) {
    console.error("Erro na validação de autenticação:", erro);
    return { status: false, mensagem: "Erro interno ao autenticar." };
  }
}
