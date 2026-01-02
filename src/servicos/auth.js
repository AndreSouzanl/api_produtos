import { validarToken } from "./servico_autenticacao.js";

export function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Espera "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ mensagem: "Token não fornecido" });
  }

  const resultado = validarToken(token);

  if (!resultado.status) {
    return res.status(401).json({ mensagem: resultado.mensagem });
  }

  // Define req.user para as rotas que usam o middleware
  req.user = resultado.dados;
  next();
}
