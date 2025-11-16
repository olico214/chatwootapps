// ./NoteCard.jsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardBody, Chip } from "@nextui-org/react";

export default function NoteCard({ task, onEditTask }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 0,
  };

  // Función simple para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      isPressable
      onPress={onEditTask}
      className="shadow-md"
    >
      <CardHeader className="pb-0 pt-3 flex-col items-start">
        <h4 className="font-bold text-large">{task.titulo}</h4>
      </CardHeader>
      <CardBody className="pt-2">
        <p className="text-default-600 text-sm mb-3">{task.comentario}</p>
        <div className="flex gap-2 text-xs text-default-500">
          <Chip color="success" variant="flat" size="sm">
            Inicio: {formatDate(task.fechaInicio)}
          </Chip>
          <Chip color="danger" variant="flat" size="sm">
            Fin: {formatDate(task.fechaFin)}
          </Chip>
        </div>
      </CardBody>
    </Card>
  );
}