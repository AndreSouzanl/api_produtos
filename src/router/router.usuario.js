import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  obterUsuario,
  cadastrarUsuario,
  obterUsuarioPorEmail,
  salvarTokenReset,
  obterUsuarioPorToken,
  atualizarSenha
} from "../servicos/servico_usuario.js";
import { enviarEmailReset } from "../servicos/servico_email.js";
import { validaUsuario } from "../validacao/valida_usuario.js";


const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const resposta = await obterUsuario();
    return res.status(200).json(resposta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      mensagem: "Erro ao obter usuários.",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // valida dados
    const usuarioValido = validaUsuario(nome, email, senha);
    if (!usuarioValido.status) {
      return res.status(400).json({
        mensagem: usuarioValido.mensagem,
      });
    }

    // verifica se email já existe
    const usuarioExistente = await obterUsuarioPorEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({
        mensagem: "Email já cadastrado",
      });
    }

    // hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    await cadastrarUsuario(nome, email, senhaHash);

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return res.status(500).json({
      mensagem: "Erro interno do servidor",
    });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ mensagem: "Email é obrigatório" });
    }

    const usuario = await obterUsuarioPorEmail(email);

    if (usuario) {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

      await salvarTokenReset(usuario.id, token, expires);

      // envia email para o usuário correto
      await enviarEmailReset(usuario.email, token);
      console.log(`TOKEN RESET enviado para: ${usuario.email}`);
    }

    return res.status(200).json({
      mensagem: "Se o email existir, enviaremos instruções para redefinir a senha.",
    });
  } catch (error) {
    console.error("Erro no forgot-password:", error);
    return res.status(500).json({
      mensagem: "Erro interno do servidor",
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) {
      return res.status(400).json({
        mensagem: "Token e nova senha são obrigatórios",
      });
    }

    const usuario = await obterUsuarioPorToken(token);

    if (!usuario) {
      return res.status(400).json({
        mensagem: "Token inválido ou expirado",
      });
    }

    await atualizarSenha(usuario.id, novaSenha);

    return res.status(200).json({
      mensagem: "Senha alterada com sucesso",
    });
  } catch (error) {
    console.error("Erro no reset-password:", error);
    return res.status(500).json({
      mensagem: "Erro interno do servidor",
    });
  }
});




export default router;



