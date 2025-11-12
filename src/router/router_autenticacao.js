import express from 'express';
import { validaDadosAutenticacao } from '../validacao/valida_autenticacao.js';
import { gerarToken } from '../servicos/servico_autenticacao.js';

const router = express.Router();

// rota para autenticação do usuário (login)
router.post('/', async (req, res) => {
  const { email, senha } = req.body;
  const validacao = await validaDadosAutenticacao(email, senha);

  if (!validacao.status) {
    return res.status(401).json(validacao);
  }
  //gera o token JWT com os dados do usuario autenticado
  const token = gerarToken(validacao.usuario);

  return res.status(200).json({
    status: true,
    mensagem: 'Autenticação realizada com sucesso.',
    token,
    usuario: validacao.usuario,
  });
});

export default router;