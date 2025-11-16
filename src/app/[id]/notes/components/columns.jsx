// ./Column.jsx
import React from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Button } from "@nextui-org/react";

// Componente de Tarjeta de Nota (Draggable)
import NoteCard from "./NoteCard";
import { CircleFadingPlus } from "lucide-react";

export default function Column({ id, title, tasks, onAddTask, onEditTask }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col bg-default-100/50 rounded-lg p-4 h-full"
    >
      {/* Título de la Columna */}
      <h2 className="text-lg font-semibold mb-4 text-default-700">{title}</h2>

      {/* Contenedor de las tareas (scrollable) */}
      <SortableContext
        id={id}
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3 flex-grow min-h-[100px] overflow-y-auto">
          {tasks.map((task) => (
            <NoteCard 
              key={task.id} 
              task={task} 
              onEditTask={() => onEditTask(task)}
            />
          ))}
        </div>
      </SortableContext>

      {/* Botón de Añadir Tarea */}
      <Button
        className="mt-4"
        color="primary"
        variant="light"
        onPress={onAddTask}
        startContent={<CircleFadingPlus />}
      >
        Añadir nota
      </Button>
    </div>
  );
}