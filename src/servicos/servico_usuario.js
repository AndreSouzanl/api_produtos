import pool from '../conexao/conexao.js';
import bcrypt from 'bcryptjs';

export async function obterUsuario(){
  const conexao = await pool.getConnection();
  
  const resposta = await conexao.query('SELECT nome, email FROM usuarios');
  const usuarios = resposta[0];
  conexao.release();
  return usuarios;
}

export async function cadastrarUsuario(nome, email, senha){
  const conexao = await pool.getConnection();

  const senha_hash = await bcrypt.hash(senha, 6);

  const resposta = await conexao.query(
    'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, senha_hash]
  );

  conexao.release();
  console.log(resposta[0]);

}

export async function obterUsuarioPorEmail(email) {
  const conexao = await pool.getConnection();

  const [rows] = await conexao.query(
    "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
    [email]
  );

  conexao.release();

  // se não encontrar usuário
  if (rows.length === 0) {
    return null;
  }

  // retorna o usuário encontrado
  return rows[0];
}

// salva token no banco
export async function salvarTokenReset(usuarioId, token, expires) {
  const conexao = await pool.getConnection();

  await conexao.query(
    'UPDATE usuarios SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
    [token, expires, usuarioId]
  );

  conexao.release();
}

// busca usuário pelo token
export async function obterUsuarioPorToken(token) {
  const conexao = await pool.getConnection();

  const [rows] = await conexao.query(
    `SELECT * FROM usuarios
     WHERE reset_token = ?
       AND reset_token_expires > NOW()
     LIMIT 1`,
    [token]
  );

  conexao.release();
  return rows.length ? rows[0] : null;
}

// atualiza senha e remove token
export async function atualizarSenha(usuarioId, novaSenha) {
  const conexao = await pool.getConnection();

  const senhaHash = await bcrypt.hash(novaSenha, 6);

  await conexao.query(
    `UPDATE usuarios
     SET senha = ?,
         reset_token = NULL,
         reset_token_expires = NULL
     WHERE id = ?`,
    [senhaHash, usuarioId]
  );

  conexao.release();
}

