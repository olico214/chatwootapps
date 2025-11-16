// ./NoteModal.jsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";

export default function NoteModal({ isOpen, onOpenChange, onSubmit, noteToEdit }) {
  const [formData, setFormData] = useState({
    titulo: "",
    comentario: "",
    fechaInicio: "",
    fechaFin: "",
  });

  // Rellenar el formulario si estamos editando
  useEffect(() => {
    if (noteToEdit) {
      setFormData({
        titulo: noteToEdit.titulo || "",
        comentario: noteToEdit.comentario || "",
        // Formatear para <input type="datetime-local">
        fechaInicio: noteToEdit.fechaInicio || "",
        fechaFin: noteToEdit.fechaFin || "",
      });
    } else {
      // Limpiar formulario si es una nota nueva
      setFormData({
        titulo: "",
        comentario: "",
        fechaInicio: "",
        fechaFin: "",
      });
    }
  }, [noteToEdit, isOpen]); // Se actualiza cuando la nota o el modal cambian

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (onClose) => {
    onSubmit(formData);
    onClose(); // Cierra el modal
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {noteToEdit ? "Editar Nota" : "Crear Nueva Nota"}
            </ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="Título"
                placeholder="Escribe el título"
                variant="bordered"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
              />
              <Textarea
                label="Comentario"
                placeholder="Escribe tu comentario"
                variant="bordered"
                name="comentario"
                value={formData.comentario}
                onChange={handleChange}
              />
              <Input
                type="datetime-local"
                label="Fecha y Hora de Inicio"
                placeholder=" "
                variant="bordered"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
              />
              <Input
                type="datetime-local"
                label="Fecha y Hora de Fin"
                placeholder=" "
                variant="bordered"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onPress={() => handleSubmit(onClose)}>
                {noteToEdit ? "Guardar Cambios" : "Crear"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}