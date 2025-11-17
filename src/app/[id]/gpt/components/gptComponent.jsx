"use client"
import { useState } from 'react';
// Importaciones actualizadas de NextUI
import { Input, Button, Card, CardHeader, CardBody, CardFooter, Textarea } from "@nextui-org/react";
// Importar 'motion' para animaciones
import { motion } from "framer-motion";

export default function GptComponent({ id }) {

    const [formData, setFormData] = useState({
        nombre: '',
        personalidad: '',
        exclusiones: '',
        contexto: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // 1. Manejador para el botón de guardar (por ahora solo muestra en consola)
    const handleSave = async () => {
        const response = await fetch(`/api/${id}/chatbot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.nombre,
                personality: formData.personalidad,
                exlcusion: formData.exclusiones,
                context: formData.contexto,
                id_client: 1 // Puedes ajustar este valor según sea necesario
            })
        });
    }
    // 2. Manejador para cargar información (simulado)
    const handleLoad = async () => {
        const response = await fetch(`/api/${id}/chatbot`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const res = await response.json();
        if (res.error) {
            console.error("Error loading data:", data.error);
            return;
        }
        if (response.ok) {
            const data = await res.result;

            setFormData({
                nombre: data.name || '',
                personalidad: data.personality || '',
                exclusiones: data.exlcusion || '',
                contexto: data.context || ''
            });
        }
    };

    return (
        // Contenedor general con padding
        <div className="flex justify-center w-full p-4">

            {/* 3. Contenedor de animación con Framer Motion */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} // Inicia invisible y 20px abajo
                animate={{ opacity: 1, y: 0 }}    // Anima a opacidad 1 y posición 0
                transition={{ duration: 0.5 }}     // Duración de la animación
                className="w-full max-w-lg" // Ancho máximo aumentado a 'lg'
            >
                {/* 4. Uso de Card para un diseño más limpio y encapsulado */}
                <Card className="w-full shadow-xl">
                    <CardHeader className="pb-0">
                        <h2 className="text-2xl font-bold">Configuración del Asistente</h2>
                    </CardHeader>

                    <CardBody className="gap-4">
                        {/* 5. Inputs organizados dentro del CardBody */}
                        <Input
                            label="Nombre del Asistente"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            variant="bordered"
                        />
                        {/* 6. Uso de Textarea para campos más largos */}
                        <Textarea
                            label="Personalidad"
                            name="personalidad"
                            value={formData.personalidad}
                            onChange={handleInputChange}
                            variant="bordered"
                            placeholder="Ej: Amable, directo, profesional..."
                        />
                        <Input
                            label="Exclusiones (temas a evitar)"
                            name="exclusiones"
                            value={formData.exclusiones}
                            onChange={handleInputChange}
                            variant="bordered"
                            placeholder="Ej: Política, religión..."
                        />
                        <Textarea
                            label="Contexto"
                            name="contexto"
                            value={formData.contexto}
                            onChange={handleInputChange}
                            variant="bordered"
                            placeholder="Información adicional relevante..."
                            minRows={4} // Darle más espacio
                        />
                    </CardBody>

                    <CardFooter className="justify-end gap-3">
                        {/* 7. Botones de acción en el CardFooter */}
                        <Button
                            variant="flat"
                            color="secondary"
                            onPress={handleLoad}
                        >
                            Cargar Información
                        </Button>
                        <Button
                            color="primary"
                            variant="shadow" // Variante con sombra para destacar
                            onPress={handleSave}
                        >
                            Guardar Cambios
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}