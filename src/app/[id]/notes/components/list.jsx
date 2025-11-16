"use client"; // Necesario para Next.js 13+ App Router y los hooks de React

import React, { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardBody,
  Spacer,
  Chip,
} from "@nextui-org/react";

// Componente de Columna (Droppable)
import Column from "./columns";

// Componente de Modal (Crear/Editar)
import NoteModal from "./NoteModal"; // Asumiremos que creas este archivo (ver abajo)

// Definimos las columnas que queremos
const COLUMN_IDS = {
  NUEVO: "nuevo",
  URGENTE: "urgente",
  EN_PROCESO: "enProceso",
  FINALIZADO: "finalizado",
  CANCELADO: "cancelado",
};

const columnTitles = {
  [COLUMN_IDS.NUEVO]: "Nuevo",
  [COLUMN_IDS.URGENTE]: "Urgente",
  [COLUMN_IDS.EN_PROCESO]: "En proceso",
  [COLUMN_IDS.FINALIZADO]: "Finalizado",
  [COLUMN_IDS.CANCELADO]: "Cancelado",
};

// Datos iniciales de ejemplo
const initialTasks = {
  [COLUMN_IDS.NUEVO]: [
    {
      id: uuidv4(),
      titulo: "Revisar el bug de login",
      comentario: "El bug ocurre solo en Safari.",
      fechaInicio: "2025-11-16T10:00",
      fechaFin: "2025-11-16T12:00",
    },
  ],
  [COLUMN_IDS.URGENTE]: [
    {
      id: uuidv4(),
      titulo: "Desplegar a producción",
      comentario: "¡Urgente! El cliente está esperando.",
      fechaInicio: "2025-11-16T09:00",
      fechaFin: "2025-11-16T09:30",
    },
  ],
  [COLUMN_IDS.EN_PROCESO]: [],
  [COLUMN_IDS.FINALIZADO]: [],
  [COLUMN_IDS.CANCELADO]: [],
};

export default function NotesPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  // Estado para saber qué nota editar o en qué columna crear una nueva
  const [editingNote, setEditingNote] = useState(null); // Objeto de la nota
  const [targetColumn, setTargetColumn] = useState(null); // ID de la columna

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Función para encontrar en qué columna está una tarea
  const findTaskColumn = (taskId) => {
    return Object.keys(tasks).find((columnId) =>
      tasks[columnId].some((task) => task.id === taskId)
    );
  };

  // Lógica principal de Drag and Drop
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return; // Se soltó fuera de un contenedor

    const activeId = active.id;
    const overId = over.id;

    // IDs de los contenedores (columnas)
    const activeContainerId = findTaskColumn(activeId);
    
    // 'over.id' puede ser un item o un contenedor. 
    // Si 'over' es un item, 'over.data.current.sortable.containerId' es su columna.
    // Si 'over' es un contenedor, 'over.id' es la columna.
    const overContainerId = tasks[overId] ? overId : findTaskColumn(overId);


    if (!activeContainerId || !overContainerId) return;

    const activeTask = tasks[activeContainerId].find(t => t.id === activeId);
    if (!activeTask) return;

    setTasks((prev) => {
      const newTasks = { ...prev };

      // Quitar la tarea de la columna original
      const activeColumnTasks = newTasks[activeContainerId].filter(
        (task) => task.id !== activeId
      );

      // Añadir la tarea a la nueva columna
      const overColumnTasks = [...newTasks[overContainerId]];
      
      // Encontrar el índice donde se soltó
      const overIndex = overColumnTasks.findIndex(t => t.id === overId);
      
      if (overIndex !== -1) {
         // Se soltó sobre otra tarea
        overColumnTasks.splice(overIndex, 0, activeTask);
      } else {
         // Se soltó sobre la columna (área vacía)
        overColumnTasks.push(activeTask);
      }

      newTasks[activeContainerId] = activeColumnTasks;
      newTasks[overContainerId] = overColumnTasks;

      return newTasks;
    });
  };
  
  // --- Manejo del Modal ---

  const handleOpenModal = (columnId) => {
    setTargetColumn(columnId);
    setEditingNote(null);
    onOpen();
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setTargetColumn(null); // No estamos creando una nueva
    onOpen();
  };

  const handleSubmitNote = (noteData) => {
    if (editingNote) {
      // Estamos editando
      const columnId = findTaskColumn(editingNote.id);
      setTasks((prev) => ({
        ...prev,
        [columnId]: prev[columnId].map((task) =>
          task.id === editingNote.id ? { ...task, ...noteData } : task
        ),
      }));
    } else {
      // Estamos creando
      const newNote = {
        id: uuidv4(),
        ...noteData,
      };
      setTasks((prev) => ({
        ...prev,
        [targetColumn]: [...prev[targetColumn], newNote],
      }));
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Tablero de Notas</h1>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 flex-grow">
          {Object.entries(columnTitles).map(([columnId, title]) => (
            <Column
              key={columnId}
              id={columnId}
              title={title}
              tasks={tasks[columnId]}
              onAddTask={() => handleOpenModal(columnId)}
              onEditTask={handleEditNote}
            />
          ))}
        </div>
      </DndContext>

      <NoteModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSubmit={handleSubmitNote}
        noteToEdit={editingNote}
      />
    </div>
  );
}