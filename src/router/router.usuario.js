import express from "express";
import bcrypt from "bcryptjs";
import {
  obterUsuario,
  cadastrarUsuario,
  obterUsuarioPorEmail,
} from "../servicos/servico_usuario.js";
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

export default router;



