import pool from '../conexao/conexao.js';
import bcrypt from 'bcryptjs';

// LISTAR USUÁRIOS
export async function obterUsuario() {
  const { rows } = await pool.query(
    'SELECT nome, email FROM usuarios'
  );

  return rows;
}

// CADASTRAR USUÁRIO
export async function cadastrarUsuario(nome, email, senha) {
  const senha_hash = await bcrypt.hash(senha, 6);

  const { rows } = await pool.query(
    'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
    [nome, email, senha_hash]
  );

  return rows[0];
}

// BUSCAR POR EMAIL
export async function obterUsuarioPorEmail(email) {
  const { rows } = await pool.query(
    'SELECT * FROM usuarios WHERE email = $1 LIMIT 1',
    [email]
  );

  return rows.length ? rows[0] : null;
}

// SALVAR TOKEN RESET
export async function salvarTokenReset(usuarioId, token, expires) {
  await pool.query(
    'UPDATE usuarios SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
    [token, expires, usuarioId]
  );
}

// BUSCAR USUÁRIO POR TOKEN
export async function obterUsuarioPorToken(token) {
  const { rows } = await pool.query(
    `SELECT * FROM usuarios
     WHERE reset_token = $1
       AND reset_token_expires > CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
     LIMIT 1`,
    [token]
  );

  return rows.length ? rows[0] : null;
}


// ATUALIZAR SENHA
export async function atualizarSenha(usuarioId, novaSenha) {
  const senhaHash = await bcrypt.hash(novaSenha, 6);

  await pool.query(
    `UPDATE usuarios
     SET senha = $1,
         reset_token = NULL,
         reset_token_expires = NULL
     WHERE id = $2`,
    [senhaHash, usuarioId]
  );
}
