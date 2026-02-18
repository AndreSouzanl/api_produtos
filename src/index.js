import dotenv from "dotenv";
dotenv.config({ quiet: true });


import express from "express";
import cors from "cors";

import rotaUsuario from "./router/router.usuario.js";
import rotaAutenticacao from "./router/router_autenticacao.js";
import rotaProduto from "./router/router_produtos.js";
// import rotaAtualizarProduto from './router/router.usuario.js';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use(
  cors({
    origin: "https://lista-compras-frontend-cu31.vercel.app",
    credentials: true,
  }),
);

app.use(express.json());
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

app.use("/usuarios", rotaUsuario);
app.use("/login", rotaAutenticacao);
app.use("/produtos", rotaProduto);
// app.use('/produtos', rotaAtualizarProduto);

app.listen(PORT, () => {
  console.log("Servidor rodando na porta: ", PORT);
});
