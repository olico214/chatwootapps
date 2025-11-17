import { NextResponse } from "next/server";
import pool from "@/libs/mysql";
export async function POST(req, { params }) {
    const { id } = await params;
    const body = await req.json();
    const { name, personality, exlcusion, context, id_client } = body

    try {
        // 1. Obtener el ID de los parámetros (sin await)
        const { id } = await params;

        const connection = await pool.getConnection();


        const sql = `SELECT * FROM chatbot_personality WHERE id = ?`;
        const [rows] = await connection.query(sql, [id]);

        if (rows.length === 0) {

            const sqlInsert = `insert chatbot_personality (name, personality, exlcusion, context, id_client) values(?,?,?,?,?)`;
            const [resultInsert] = await connection.query(sqlInsert, [name, personality, exlcusion, context, id_client]);
        } else {
            const sqlUpdate = `update chatbot_personality set name=?, personality=?, exlcusion=?, context=? where id=?`;
            const [resultUpdate] = await connection.query(sqlUpdate, [name, personality, exlcusion, context, rows[0].id]);
        }

        // 5. Devolver el primer (y único) resultado
        // console.log(rows[0]); // El objeto de la sesión
        return NextResponse.json(rows[0]);

    } catch (error) {
        // 6. Manejar cualquier error que ocurra
        console.error("Error fetching session:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

    }
}


export async function GET(req, { params }) {


    try {
        // 1. Obtener el ID de los parámetros (sin await)
        const { id } = await params;

        const connection = await pool.getConnection();

        // 3. Ejecutar la consulta
        // Usamos destructuring [rows] para obtener solo el array de resultados
        const sql = `SELECT * FROM chatbot_personality WHERE id = ?`;
        const [rows] = await connection.query(sql, [id]);
        // 4. Verificar si se encontró un resultado
        if (rows.length === 0) {
            // Si no hay resultados, es bueno devolver un 404 (No Encontrado)
            return NextResponse.json({ result: [] });
        }


        return NextResponse.json({ result: rows[0] });

    } catch (error) {
        // 6. Manejar cualquier error que ocurra
        console.error("Error fetching session:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

    }
}