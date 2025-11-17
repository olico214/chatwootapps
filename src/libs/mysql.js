import mysql from "mysql2/promise";

let pool;


// dotenv.config({ path: '.env.locale' });


try {
  pool = mysql.createPool({
    user: "u835880732_chatwootapps",
    password: "P*aXvWvu&2",
    host: "srv650.hstgr.io",
    database: "u835880732_chatwootapps",
    multipleStatements: true,
    namedPlaceholders: true,
  });
} catch (err) {
  console.error("Error al conectar con la base de datos:", err);
}

export default pool;
