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

