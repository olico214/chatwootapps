import mysql from "mysql2/promise";

let pool;

//  user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     server: process.env.DB_SERVER,
//     port: parseInt(process.env.DB_PORT, 10), // 👈 Agrega esto
//     database: process.env.DB_NAME,
//     dotenv.config({ path: '.env.locale' });

try {
  pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "", // deja vacío si no pusiste contraseña
    database: "finiquito",
    multipleStatements: true,
    namedPlaceholders: true,
  });
} catch (err) {
  console.error("Error al conectar con la base de datos:", err);
}

export default pool;
