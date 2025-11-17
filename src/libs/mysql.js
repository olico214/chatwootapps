import mysql from "mysql2/promise";

let pool;


// dotenv.config({ path: '.env.locale' });

console.log("Conectando a la base de datos con los siguientes parámetros:");
console.log("Usuario:", process.env.DB_USER);
console.log("Servidor:", process.env.DB_SERVER);
console.log("Base de datos:", process.env.DB_NAME);

try {
  pool = mysql.createPool({
    user: "u835880732_chatwootapps",
    password: "Y0SQE~i~",
    server: "srv650.hstgr.io",
    database: "u835880732_chatwootapps",
    multipleStatements: true,
    namedPlaceholders: true,
  });
} catch (err) {
  console.error("Error al conectar con la base de datos:", err);
}

export default pool;
