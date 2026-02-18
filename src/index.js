import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import cors from "cors";


import rotaUsuario from './router/router.usuario.js';
import rotaAutenticacao from './router/router_autenticacao.js';
import rotaProduto from './router/router_produtos.js';
import rotaAtualizarProduto from './router/router.usuario.js';

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = process.env.FRONTEND_URL?.split(",") || ["http://localhost:3000"];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});



app.use('/usuarios', rotaUsuario);
app.use('/login', rotaAutenticacao);
app.use('/produtos', rotaProduto);
 app.use('/produtos', rotaAtualizarProduto);

app.listen(PORT, () => {
 console.log("Servidor rodando na porta: ", PORT);
});

