import express from "express";
import {
  obterProdutos,
  cadastrarProduto,
  obterProdutoPorNome,
  atualizarProduto,
  removerProduto,
} from "../servicos/servico_produto.js";
import {
  validaProduto,
  validaProdutoAtualizacao,
  validaRemocao,
} from "../validacao/valida_produto.js";

import { autenticarToken } from "../servicos/auth.js";

const router = express.Router();

router.get("/", autenticarToken, async (req, res) => {
  try {
    const usuarioID = req.user.id;
    const produtos = await obterProdutos(usuarioID);
    res.json(produtos);
  } catch (erro) {
    console.error("Erro ao obter produtos:", erro);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
});

router.post("/", autenticarToken, async (req, res) => {
  try {
    const { nome, descricao, quantidade, unidade} = req.body;
    const criado_por = req.user.id; // pega do token

    // 1. validação
    const ProdutoValido = validaProduto(
      nome,
      descricao,
      quantidade,
      unidade,
      criado_por
    );

    if (!ProdutoValido.status) {
      return res.status(400).json({ mensagem: ProdutoValido.mensagem });
    }

    // 2. duplicidade
    const produtoExistente = await obterProdutoPorNome(nome, criado_por);
    if (produtoExistente) {
      if (produtoExistente.status === "removido") {
        // Produto existe mas está removido: reativa
        await atualizarProduto(
          produtoExistente.id,
          nome,
          descricao,
          quantidade,
          unidade,
          criado_por,
          "ativo"
        );
        const produtoAtualizado = await obterProdutoPorNome(nome, criado_por);

        return res.status(200).json({
          mensagem: "Produto reativado com sucesso!",
          produto: produtoAtualizado,
        });
      } else {
        // Produto já ativo: não pode cadastrar duplicado
        return res.status(400).json({
          mensagem: "Produto já cadastrado",
        });
      }
    }

    // 3. cadastrar
    const produtoCriado = await cadastrarProduto(
      nome,
      descricao,
      quantidade,
      unidade,
      criado_por
    );

    // 4. sucesso
    return res.status(201).json({
      mensagem: "Produto cadastrado com sucesso!",
      produto: produtoCriado,
    });
  } catch (erro) {
    console.error("Erro ao cadastrar produto:", erro);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
});

router.put("/:id", autenticarToken, async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, quantidade, unidade, atualizado_por, status } =
    req.body;
  // 1. validação
  const ProdutoValido = validaProdutoAtualizacao(
    nome,
    descricao,
    quantidade,
    unidade,
    atualizado_por,
    status
  );

  if (!ProdutoValido.status) {
    return res.status(400).json({ mensagem: ProdutoValido.mensagem });
  }

  try {
    // 2. CHAMAR A FUNÇÃO QUE ATUALIZA NO BANCO
    await atualizarProduto(
      id,
      nome,
      descricao,
      quantidade,
      unidade,
      atualizado_por,
      status
    );

    // 3. Sucesso
    res.status(200).json({ mensagem: "Produto atualizado com sucesso!" });
  } catch (erro) {
    console.error("Erro ao atualizar produto:", erro);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
});

router.delete("/:id", autenticarToken, async (req, res) => {
  const { id } = req.params;
  const usuarioID = req.user.id;

  const valida = validaRemocao(usuarioID);
  if (!valida.status) {
    return res.status(400).json({ mensagem: valida.mensagem });
  }

  try {
    const resultado = await removerProduto(id, usuarioID);

    if (!resultado.sucesso) {
      return res.status(404).json({ mensagem: "Produto não encontrado." });
    }

    res.status(200).json({ mensagem: "Produto deletado com sucesso!"});
  } catch (erro) {
    console.error("Erro ao deletar produto:", erro);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
});

export default router;
