"use client"
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // (npm install uuid)

// Importaciones de Dnd-Kit
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Datos Iniciales de Ejemplo (LOS MISMOS DE ANTES) ---
const tasksFromBackend = [
  { id: 'task-1', content: 'Revisar el bug del login' },
  { id: 'task-2', content: 'Desarrollar la nueva landing page' },
  { id: 'task-3', content: 'Llamar al cliente X' },
  { id: 'task-4', content: 'Optimizar la consulta SQL' }
];

const columnsFromBackend = {
  'col-1': {
    name: 'Urgente',
    items: [tasksFromBackend[2]] // task-3
  },
  'col-2': {
    name: 'Nuevo',
    items: [tasksFromBackend[0], tasksFromBackend[1]] // task-1, task-2
  },
  'col-3': {
    name: 'En proceso',
    items: [tasksFromBackend[3]] // task-4
  },
  'col-4': {
    name: 'Cancelado',
    items: []
  },
  'col-5': {
    name: 'Finalizado',
    items: []
  }
};
// ---------------------------------

// --- Estilos (LOS MISMOS DE ANTES) ---
const styles = {
  boardContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
    gap: '16px', // Espacio entre columnas
  },
  column: {
    backgroundColor: '#eceff1',
    borderRadius: '8px',
    width: '250px',
    minHeight: '500px',
    padding: '16px 8px',
    display: 'flex',
    flexDirection: 'column',
  },
  columnTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    padding: '0 8px 16px 8px',
    color: '#333'
  },
  taskCard: {
    userSelect: 'none',
    padding: '16px',
    margin: '0 0 8px 0',
    minHeight: '50px',
    backgroundColor: '#ffffff',
    color: '#111',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    cursor: 'grab', // Cursor para arrastrar
  },
  taskCardDragging: { // Estilo para la tarjeta mientras se arrastra
    opacity: 0.8,
    transform: 'rotate(3deg)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  }
};
// ---------------------------

// --- Componente Task (Draggable) ---
function TaskCard({ task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id }); // Usa el ID de la tarea

  const style = {
    ...styles.taskCard,
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? styles.taskCardDragging : {}),
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {task.content}
    </div>
  );
}

// --- Componente Column (Droppable) ---
// Dentro de tu componente 'Column'

function Column({ columnId, name, tasks }) {
  return (
    <div style={styles.column}>

      {/* 1. El título está solo en su <h2> y se cierra */}
      <h2 style={styles.columnTitle}>{name}</h2>

      {/* 2. La lista de tareas es HERMANA del h2, no hija */}
      <SortableContext
        items={tasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        {/* ... aquí van las TaskCard ... */}
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </SortableContext>

    </div>
  );
}

// --- Componente Principal Kanban ---
function NotesPage() {
  const [columns, setColumns] = useState(columnsFromBackend);
  const [activeTask, setActiveTask] = useState(null); // Para el DragOverlay

  // Define los sensores (mouse, touch, teclado)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --- Lógica de Dnd-Kit ---

  // Encuentra la columna a la que pertenece una tarea
  const findColumn = (taskId) => {
    return Object.entries(columns).find(([columnId, col]) =>
      col.items.some(item => item.id === taskId)
    );
  };

  // Se dispara cuando se empieza a arrastrar
  function handleDragStart(event) {
    const { active } = event;
    const task = findColumn(active.id)[1].items.find(item => item.id === active.id);
    setActiveTask(task);
  }

  // Se dispara cuando se suelta el elemento
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }

    const originalColumnEntry = findColumn(active.id);
    const overColumnEntry = findColumn(over.id);

    // Si no se encuentra columna de destino (p.ej. soltando sobre la misma tarea)
    // o si soltamos sobre un área no válida.
    // Dnd-kit es más granular, 'over' puede ser una tarea o una columna.
    // Para este ejemplo, simplificamos y asumimos que 'over' nos da una pista.

    const activeColumnId = originalColumnEntry[0];
    const activeTask = originalColumnEntry[1].items.find(item => item.id === active.id);

    // Dnd-kit puede soltar "sobre" una tarea o "sobre" una columna.
    // Primero, encontramos la columna destino (targetColumnId)
    let targetColumnId = null;
    let overIndex = -1;

    // Buscamos si 'over.id' es una columna
    if (columns[over.id]) {
      targetColumnId = over.id;
      overIndex = columns[over.id].items.length; // Poner al final
    } else {
      // Si no, 'over.id' es una tarea. Encontramos la columna de esa tarea.
      const overColumnPair = findColumn(over.id);
      if (overColumnPair) {
        targetColumnId = overColumnPair[0];
        overIndex = overColumnPair[1].items.findIndex(item => item.id === over.id);
      }
    }

    if (!targetColumnId) {
      setActiveTask(null);
      return; // No se pudo determinar el destino
    }

    // --- Lógica de Mover ---
    setColumns(prev => {
      const newColumns = { ...prev };
      const sourceCol = newColumns[activeColumnId];
      const destCol = newColumns[targetColumnId];

      // Quitar de la columna origen
      const taskIndex = sourceCol.items.findIndex(item => item.id === active.id);
      const [removedTask] = sourceCol.items.splice(taskIndex, 1);

      if (activeColumnId === targetColumnId) {
        // --- Mover en la misma columna ---
        // 'arrayMove' es una utilidad de @dnd-kit/sortable
        destCol.items = arrayMove(destCol.items, taskIndex, overIndex > -1 ? overIndex : destCol.items.length);
      } else {
        // --- Mover a una columna diferente ---
        destCol.items.splice(overIndex > -1 ? overIndex : destCol.items.length, 0, removedTask);
      }

      return newColumns;
    });

    setActiveTask(null);
  }

  return (
    // DndContext envuelve todo
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div style={styles.boardContainer}>
        {Object.entries(columns).map(([columnId, column]) => (
          <Column
            key={columnId}
            columnId={columnId}
            name={column.name}
            tasks={column.items}
          />
        ))}
      </div>

      {/* DragOverlay muestra un 'fantasma' del elemento mientras se arrastra */}
      <DragOverlay>
        {activeTask ? (
          <div style={{ ...styles.taskCard, ...styles.taskCardDragging }}>
            {activeTask.content}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default NotesPage;