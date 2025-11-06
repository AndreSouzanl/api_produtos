import mysql from  'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'usuariosead',
  password: 'useread',
  database: 'banco_ead_db'
})

export default pool