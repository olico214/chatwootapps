"use client"
import { useState } from 'react'; // 1. Importar useState
import { Input } from "@nextui-org/react";

export default function GptComponent() {

    // 2. Definir el estado para el formulario
    const [formData, setFormData] = useState({
        nombre: '',
        personalidad: '',
        exclusiones: '',
        contexto: ''
    });

    // 3. Crear un manejador de cambios
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        // 4. Contenedor para centrar (puedes ajustar 'h-screen' si es necesario)
        <div className="flex items-center justify-center w-full p-4">

            {/* 5. Contenedor del formulario con un ancho máximo */}
            <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                <Input
                    label="Cual es mi nombre"
                    name="nombre" // Atributo 'name' para el manejador
                    value={formData.nombre} // Conectar valor al estado
                    onChange={handleInputChange} // Conectar manejador
                />
                <Input
                    label="Personalidad"
                    name="personalidad"
                    value={formData.personalidad}
                    onChange={handleInputChange}
                />
                <Input
                    label="exclusiones"
                    name="exclusiones"
                    value={formData.exclusiones}
                    onChange={handleInputChange}
                />
                <Input
                    label="Contexto"
                    name="contexto"
                    value={formData.contexto}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    )
}