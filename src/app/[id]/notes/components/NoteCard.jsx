// ./NoteCard.jsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardBody, Chip, Button } from "@nextui-org/react";
import { GripVertical } from "lucide-react";

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

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      isPressable
      onPress={onEditTask} // Esto maneja el clic en el Card
      className="shadow-md"
    >
      <CardHeader className="pb-0 pt-3 flex-row justify-between items-start">
        <h4 className="font-bold text-large flex-1 mr-2">{task.titulo}</h4>

        <Button
          isIconOnly
          size="sm"
          variant="light"
          {...listeners} // Los listeners de dnd-kit
          className="cursor-grab active:cursor-grabbing text-default-500"

          // --- LA CORRECCIÓN CLAVE ---
          // Reemplazamos 'onClick' por 'onPointerDown'.
          // Esto detiene el evento "clic" antes de que el 
          // 'onPress' del <Card> pueda capturarlo.
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
        >
          <GripVertical size={18} />
        </Button>
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

// (La función formatDate se queda igual)
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