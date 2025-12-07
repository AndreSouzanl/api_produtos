import express from "express";
import {
  obterProdutos,
  cadastrarProduto,
  atualizarProduto,
} from "../servicos/servico_produto.js";
import {
  validaProduto,
  validaProdutoAtualizacao,
} from "../validacao/valida_produto.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const produtos = await obterProdutos();
    res.json(produtos);
  } catch (erro) {
    console.error("Erro ao obter produtos:", erro);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
});

router.post("/", async (req, res) => {
  const { nome, descricao, quantidade, unidade, criado_por } = req.body;
  const ProdutoValido = validaProduto(
    nome,
    descricao,
    quantidade,
    unidade,
    criado_por
  );

  if (!ProdutoValido.status) {
     res.status(400).json({ mensagem: ProdutoValido.mensagem });
  } 

  const produtoCriado = await cadastrarProduto(nome, descricao, quantidade, unidade, criado_por);
  
  res.status(201).json({mensagem: "Produto cadastrado com sucesso!", produto: produtoCriado});
  
});

router.put("/:id", async (req, res) => {
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

export default router;
