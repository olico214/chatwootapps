// modalEventos/crear.js

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea
} from "@nextui-org/react";

const initialState = {
  phone: "",
  name: "",
  date: "",
  hour: "",
  comentary: ""
};

export default function ModalCrearEvento({
  id, // id_user (para crear)
  isOpen,
  onOpenChange,
  eventData, // (para editar)
  onSuccess
}) {

  const [formData, setFormData] = useState(initialState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (eventData && eventData.id) {
        // MODO EDICIÓN
        setFormData({
          name: eventData.name || '',
          phone: eventData.phone || '',
          date: eventData.date || '',
          hour: eventData.hour || '',
          comentary: eventData.comentary || ''
        });
        setIsEditMode(true);
      } else if (eventData) {
        // MODO CREAR (con fecha)
        setFormData(prev => ({
          ...initialState,
          date: eventData.date || '',
          hour: eventData.hour || ''
        }));
        setIsEditMode(false);
      } else {
        // MODO CREAR (con botón)
        setFormData(initialState);
        setIsEditMode(false);
      }
    } else {
      // Al cerrar, resetear
      setFormData(initialState);
      setIsEditMode(false);
      setError(null);
    }
  }, [isOpen, eventData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // --- 1. MANEJADOR DE SUBMIT (CREAR O EDITAR) ---
  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    const dataToSend = { ...formData };

    try {
      let response;
      let mode;

      if (isEditMode) {
        // --- LÓGICA DE ACTUALIZACIÓN (PUT) ---
        const cita_id = eventData.id;
        const url = `/api/citas/${cita_id}`;
        mode = 'update';

        response = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });

      } else {
        // --- LÓGICA DE CREACIÓN (POST) ---
        const url = `/api/${id}/calendar`; // id = id_user
        mode = 'create';

        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });
      }

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Error al ${mode === 'update' ? 'actualizar' : 'crear'} la cita.`);
      }

      const resultData = await response.json();

      const successData = mode === 'create'
        ? { ...resultData, id: resultData.id_cita }
        : resultData;

      onSuccess(successData, mode);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. MANEJADOR DE ELIMINAR ---
  const handleDelete = async () => {
    if (!isEditMode || !eventData.id) return;

    if (!window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    const cita_id = eventData.id;
    const url = `/api/${cita_id}/calendar`;

    try {
      const response = await fetch(url, { method: 'DELETE' });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Error al eliminar la cita.');
      }

      // Avisamos al padre que se eliminó
      onSuccess({ id: cita_id }, 'delete');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <Button onPress={onOpenChange} color="primary">Crear Cita</Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isEditMode ? 'Editar Cita' : 'Crear Nueva Cita'}
              </ModalHeader>

              <ModalBody>
                {error && (
                  <p className="text-danger text-small pb-2">{error}</p>
                )}

                <form className="flex flex-col gap-4">
                  <Input isRequired label="Nombre" name="name" value={formData.name} onChange={handleChange} variant="bordered" />
                  <Input isRequired label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} variant="bordered" />
                  <div className="flex gap-4">
                    <Input isRequired label="Fecha" name="date" type="date" value={formData.date} onChange={handleChange} variant="bordered" />
                    <Input isRequired label="Hora" name="hour" type="time" value={formData.hour} onChange={handleChange} variant="bordered" />
                  </div>
                  <Textarea label="Comentario" name="comentary" value={formData.comentary} onChange={handleChange} variant="bordered" />
                </form>
              </ModalBody>

              {/* --- 3. FOOTER CON BOTÓN DE ELIMINAR --- */}
              <ModalFooter>
                {isEditMode && (
                  <Button
                    color="danger"
                    variant="ghost"
                    onPress={handleDelete}
                    disabled={isLoading}
                    className="mr-auto" // Alinea a la izquierda
                  >
                    Eliminar
                  </Button>
                )}
                <Button color="danger" variant="light" onPress={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={isLoading}
                >
                  {isLoading
                    ? (isEditMode ? 'Actualizando...' : 'Guardando...')
                    : (isEditMode ? 'Actualizar Cita' : 'Guardar Cita')
                  }
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}