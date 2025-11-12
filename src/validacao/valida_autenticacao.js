import pool from "../conexao/conexao.js";
import bcrypt from "bcryptjs";

export async function validaDadosAutenticacao(email, senha) {
  const conexao = await pool.getConnection();
  try {
    const [resposta] = await conexao.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    conexao.release();
    if (resposta.length === 0) {
      return { status: false, mensagem: "Usuário não encontrado." };
    }
    const usuario = resposta[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return { status: false, mensagem: "Senha Incorreta." };
    }

    return { status: true, usuario };
  } catch (erro) {
    conexao.release();
    console.error("Erro na validação de autenticação:", erro);
    return { status: false, mensagem: "Erro interno ao autenticar." };
  }
}
