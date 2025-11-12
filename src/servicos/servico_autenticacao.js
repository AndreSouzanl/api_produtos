import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../env/env.js";

// gera um token JWT para o usuário autenticado (logado)
export function gerarToken(usuario) {
  const payload = {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
  return token;
}

export function validarToken(token) {
  try {
    const dados = jwt.verify(token, JWT_SECRET);
    return { status: true, codigo: 200, dados };
  } catch (erro) {
    return {
      status: false,
      codigo: 401,
      mensagem: "Token inválido ou expirado.",
    };
  }
}
