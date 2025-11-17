import mysql from "mysql2/promise";

let pool;


// dotenv.config({ path: '.env.locale' });

console.log("Conectando a la base de datos con los siguientes parámetros:");
console.log("Usuario:", process.env.DB_USER);
console.log("Servidor:", process.env.DB_SERVER);
console.log("Base de datos:", process.env.DB_NAME);

try {
  pool = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    multipleStatements: true,
    namedPlaceholders: true,
  });
} catch (err) {
  console.error("Error al conectar con la base de datos:", err);
}

export default pool;
