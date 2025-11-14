import express from "express";
import cors from "cors";

import rotaUsuario from './router/router.usuario.js';
import rotaAutenticacao from './router/router_autenticacao.js';
import rotaProduto from './router/router_produtos.js';


const app = express();
const PORT = 9000;

app.use(cors());
app.use(express.json());

app.use('/usuarios', rotaUsuario);
app.use('/login', rotaAutenticacao);
app.use('/produtos', rotaProduto);


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}...`);
});
