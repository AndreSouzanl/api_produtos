import pool from "../conexao/conexao.js";

export async function obterProdutos(usuarioID) {
  const conexao = await pool.getConnection();

  // Filtra os produtos pelo usuário logado
  const [produtos] = await conexao.query(
    "SELECT * FROM produtos WHERE criado_por = ?",
    [usuarioID] // substitui o ? pelo ID do usuário
  );

  conexao.release();
  return produtos;
}

export async function cadastrarProduto(nome, descricao, quantidade, unidade, criado_por) {
  const conexao = await pool.getConnection();

  const [resposta] = await conexao.query(
    "INSERT INTO produtos (nome, descricao, quantidade, unidade, criado_por) VALUES (?, ?, ?, ?, ?)",[nome, descricao, quantidade, unidade, criado_por]
  )
  conexao.release();
  console.log("Resultado do INSERT:", resposta); 

  // Retornar o produto inserido
  return {
    id: resposta.insertId,
    nome,
    descricao,
    quantidade,
    unidade,
    criado_por,
  };

}

// busca pelo nome
export async function obterProdutoPorNome(nome, usuarioID) {
  const conexao = await pool.getConnection();

  const [resposta] = await conexao.query(
     "SELECT * FROM produtos WHERE nome = ? AND criado_por = ? LIMIT 1",
    [nome, usuarioID]
  );

  conexao.release();

  return resposta.length > 0 ? resposta[0] : null;
}

export async function atualizarProduto(id, nome, descricao, quantidade, unidade, atualizado_por, status) {
  const conexao = await pool.getConnection(); 
  const resposta = await conexao.query(
    "UPDATE produtos SET nome = ?, descricao = ?, quantidade = ?, unidade = ?, atualizado_por = ?, status = ? WHERE id = ?",[nome, descricao, quantidade, unidade, atualizado_por, status, id]
  )
  conexao.release();
  console.log(resposta[0]);
}
export async function removerProduto(id, removido_por) {
  const conexao = await pool.getConnection();

  try {
    // Atualiza o produto para marcar como removido
    const [resposta] = await conexao.query(
      `UPDATE produtos
       SET status = 'removido', removido_por = ?
       WHERE id = ? AND status != 'removido'`,
      [removido_por, id]
    );

    conexao.release();

    if (resposta.affectedRows === 0) {
      return { sucesso: false };
    }

    // Retorna o nome do produto para a mensagem
    const [produto] = await conexao.query(
      "SELECT nome FROM produtos WHERE id = ?",
      [id]
    );

    return { sucesso: true, nome: produto[0].nome };
  } catch (erro) {
    conexao.release();
    throw erro;
  }
}


