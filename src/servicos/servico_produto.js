import pool from "../conexao/conexao.js";

// LISTAR PRODUTOS
export async function obterProdutos(usuarioID) {
  const { rows } = await pool.query(
    `SELECT *
     FROM produtos
     WHERE criado_por = $1
       AND status = 'ativo'`,
    [usuarioID]
  );

  return rows;
}

// CADASTRAR PRODUTO
export async function cadastrarProduto(
  nome,
  descricao,
  quantidade,
  unidade,
  criado_por
) {
  const { rows } = await pool.query(
    `INSERT INTO produtos
     (nome, descricao, quantidade, unidade, criado_por)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [nome, descricao, quantidade, unidade, criado_por]
  );

  return rows[0]; // PostgreSQL retorna o registro inserido
}

// BUSCAR POR NOME
export async function obterProdutoPorNome(nome, usuarioID) {
  const { rows } = await pool.query(
    `SELECT *
     FROM produtos
     WHERE nome = $1
       AND criado_por = $2
     LIMIT 1`,
    [nome, usuarioID]
  );

  return rows.length ? rows[0] : null;
}

// ATUALIZAR PRODUTO
export async function atualizarProduto(
  id,
  nome,
  descricao,
  quantidade,
  unidade,
  atualizado_por,
  status
) {
  await pool.query(
    `UPDATE produtos
     SET nome = $1,
         descricao = $2,
         quantidade = $3,
         unidade = $4,
         atualizado_por = $5,
         status = $6
     WHERE id = $7`,
    [nome, descricao, quantidade, unidade, atualizado_por, status, id]
  );
}

// REMOVER PRODUTO (soft delete)
export async function removerProduto(id, removido_por) {
  const { rowCount } = await pool.query(
    `UPDATE produtos
     SET status = 'removido',
         removido_por = $1
     WHERE id = $2
       AND status != 'removido'`,
    [removido_por, id]
  );

  if (rowCount === 0) {
    return { sucesso: false };
  }

  const { rows } = await pool.query(
    `SELECT nome FROM produtos WHERE id = $1`,
    [id]
  );

  return { sucesso: true, nome: rows[0].nome };
}
