import pool from "../conexao/conexao.js";

export async function obterProdutos() {
  const conexao = await pool.getConnection();

  const resposta = await conexao.query("SELECT * FROM produtos");
  const produtos = resposta[0];
  conexao.release();
  return produtos;
}

export async function cadastrarProduto(nome, descricao, quantidade, unidade, criado_por) {
  const conexao = await pool.getConnection();

  const resposta = await conexao.query(
    "INSERT INTO produtos (nome, descricao, quantidade, unidade, criado_por) VALUES (?, ?, ?, ?, ?)",[nome, descricao, quantidade, unidade, criado_por]
  )
  conexao.release();
  console.log(resposta[0]);
}

export async function atualizarProduto(id, nome, descricao, quantidade, unidade, atualizado_por, status) {
  const conexao = await pool.getConnection(); 
  const resposta = await conexao.query(
    "UPDATE produtos SET nome = ?, descricao = ?, quantidade = ?, unidade = ?, atualizado_por = ?, status = ? WHERE id = ?",[nome, descricao, quantidade, unidade, atualizado_por, status, id]
  )
  conexao.release();
  console.log(resposta[0]);
}
