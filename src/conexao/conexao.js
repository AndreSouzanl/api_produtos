import mysql from  'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'userProduto',
  password: 'produto',
  database: 'produtosdb',
})

export default pool