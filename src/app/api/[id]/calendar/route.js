import { NextResponse } from "next/server";
import pool from "@/libs/mysql";



export async function GET(req, { params }) {
    try {
        // 1. Obtener el ID del usuario desde la URL
        const { id: id_user } = await params;

        if (!id_user) {
            return NextResponse.json({ error: 'Falta el ID de usuario' }, { status: 400 });
        }

        // 2. Conectar y buscar todas las citas de ESE usuario
        const connection = await pool.getConnection();
        const sql = "SELECT * FROM citas WHERE id_user = ?";
        const [rows] = await connection.query(sql, [id_user]);

        connection.release();

        // 3. Devolver los resultados
        return NextResponse.json(rows);

    } catch (error) {
        console.error("Error al obtener las citas:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}



export async function POST(req, { params }) {
    try {
        // 1. Obtener el ID de la URL (lo usaremos como id_user)
        // Renombramos 'id' a 'id_user' para mayor claridad
        const { id } = await params;

        // 2. Obtener los datos de la cita desde el body
        const body = await req.json();
        const { phone, name, date, hour, comentary } = body;

        // 3. Validación simple de los datos recibidos
        if (!phone || !name || !date || !hour) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos: phone, name, date, hour' },
                { status: 400 } // 400 Bad Request
            );
        }

        // 4. Conectar a la base de datos
        const connection = await pool.getConnection();

        // 5. Preparar el SQL para insertar en la tabla 'citas'
        const sqlInsert = `
            INSERT INTO citas (phone, name, date, hour, comentary, id_user) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        // 6. Ejecutar la consulta con los datos
        const [result] = await connection.query(sqlInsert, [
            phone,
            name,
            date,
            hour,
            comentary,
            id
        ]);

        // 7. Liberar la conexión
        connection.release();

        // 8. Devolver una respuesta exitosa (201 Created)
        // result.insertId contendrá el ID de la cita recién creada
        return NextResponse.json({
            message: 'Cita creada exitosamente',
            id_cita: result.insertId,
            id_user: id,
            ...body // Devuelve los mismos datos que se enviaron
        }, { status: 201 });

    } catch (error) {
        // 9. Manejar cualquier error que ocurra
        console.error("Error al guardar la cita:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


// --- FUNCIÓN PUT (ACTUALIZAR) ---
export async function PUT(req, { params }) {
    try {
        // 1. Obtener el ID de la cita desde la URL
        const { id } = await params;

        // 2. Obtener los nuevos datos desde el body
        const body = await req.json();
        const { phone, name, date, hour, comentary } = body;

        // 3. Validación
        if (!id || !phone || !name || !date || !hour) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos o ID' },
                { status: 400 }
            );
        }

        // 4. Conectar y preparar SQL
        const connection = await pool.getConnection();
        const sqlUpdate = `
            UPDATE citas 
            SET phone = ?, name = ?, date = ?, hour = ?, comentary = ?
            WHERE id = ?
        `;

        // 5. Ejecutar
        const [result] = await connection.query(sqlUpdate, [
            phone,
            name,
            date,
            hour,
            comentary,
            id // El id de la cita
        ]);

        connection.release();

        // 6. Verificar si se actualizó algo
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: 'Cita no encontrada o los datos son idénticos' },
                { status: 404 }
            );
        }

        // 7. Devolver éxito
        return NextResponse.json({
            message: 'Cita actualizada exitosamente',
            id: id,
            ...body
        });

    } catch (error) {
        console.error("Error al actualizar la cita:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


// --- FUNCIÓN DELETE (ELIMINAR) ---
export async function DELETE(req, { params }) {
    try {
        // 1. Obtener el ID de la cita desde la URL
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Falta el ID de la cita' }, { status: 400 });
        }

        // 2. Conectar y ejecutar SQL
        const connection = await pool.getConnection();
        const sqlDelete = "DELETE FROM citas WHERE id = ?";
        const [result] = await connection.query(sqlDelete, [id]);

        connection.release();

        // 3. Verificar si se eliminó algo
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: 'Cita no encontrada' },
                { status: 404 }
            );
        }

        // 4. Devolver éxito
        return NextResponse.json({ message: 'Cita eliminada exitosamente' });

    } catch (error) {
        console.error("Error al eliminar la cita:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}