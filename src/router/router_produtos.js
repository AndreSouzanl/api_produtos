import express from 'express';
import {obterProdutos, cadastrarProduto} from '../servicos/servico_produto.js';
import {validaProduto} from '../validacao/valida_produto.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const produtos =  await obterProdutos();
    res.json(produtos);
  } catch (erro) {
    console.error("Erro ao obter produtos:", erro);
    res.status(500).json({mensagem: "Erro interno do servidor"});
  }
});

router.post('/', async (req, res) => {
  const {nome, descricao, quantidade, unidade, criado_por} = req.body;
  const ProdutoValido = validaProduto(nome, descricao, quantidade, unidade, criado_por);
  
  if (!ProdutoValido.status) {
    await cadastrarProduto(nome, descricao, quantidade, unidade, criado_por);
    res.status(204).end();
  }else{
    res.status(400).json({mensagem: ProdutoValido.mensagem});
  }
});

export default router;