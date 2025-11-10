import express from 'express';
import { obterUsuario, cadastrarUsuario} from '../servicos/servico_usuario.js';
import { validaUsuario } from '../validacao/valida_usuario.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const resposta = await obterUsuario();
    res.status(200).json(resposta);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao obter usuários.' });
  }
});

router.post('/', async (req, res) => {
  const {nome , email, senha} = req.body;
   const usuarioValido = validaUsuario(nome, email, senha);
   if(usuarioValido.status){
    await cadastrarUsuario(nome, email, senha);
    res.status(204).end();
   }else{
    res.status(400).json({ mensagem: usuarioValido.mensagem });
   }

});
export default router;

