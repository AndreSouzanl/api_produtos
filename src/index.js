import express from "express";
import cors from "cors";

import rotaUsuario from './router/router.usuario.js';
import rotaAutenticacao from './router/router_autenticacao.js';
import rotaProduto from './router/router_produtos.js';
import rotaAtualizarProduto from './router/router.usuario.js';

const app = express();
const PORT = 9000;

app.use(cors());
app.use(express.json());

app.use('/usuarios', rotaUsuario);
app.use('/login', rotaAutenticacao);
app.use('/produtos', rotaProduto);
app.use('/produtos', rotaAtualizarProduto);

// criar router para editarProdutos  e separar a logica da camada de servico criando
// a funcao atualizarProduto no servico_produto.js em outro arquivo. 

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}...`);
});
