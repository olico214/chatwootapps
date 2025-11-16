"use client";
import React, { useState, useEffect } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // Necesario para vistas de semana y día
import interactionPlugin from '@fullcalendar/interaction'; // Necesario para dateClick
import esLocale from '@fullcalendar/core/locales/es'; // Importar el idioma español
import { Button } from '@nextui-org/react';
import ModalCalendario from '../modalEventos/modal';
const EventModal = ({ modalInfo, onClose }) => {
  if (!modalInfo) return null;

  const { title, content } = modalInfo;

  return (
    
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
      onClick={onClose} // Cierra el modal al hacer clic en el fondo
    >
      {/* Contenedor del Modal */}
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50 m-4"
        onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal cierre el modal
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>
        <div className="text-gray-700 whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
};


// --- Componente Principal del Calendario ---
export default function CalendarComponent() {
  
  // Estado para guardar los eventos
  const [events, setEvents] = useState([]);
  
  // Estado para controlar la visibilidad y el contenido del modal
  const [modalInfo, setModalInfo] = useState(null);

  // Simulación de carga de API al montar el componente
  useEffect(() => {
    // Tus datos de la API irían aquí
    const mockApiEvents = [
      {
        id: '1',
        // 'title' es lo que FullCalendar usa para el 'nombre'
        title: 'Cita: Juan Pérez', 
        // Combinamos 'fecha' y 'hora' en el formato ISO 'start'
        start: '2025-11-10T10:30:00', 
        end: '2025-11-10T11:30:00',
        // Usamos 'extendedProps' para datos adicionales
        extendedProps: {
          telefono: '555-1234'
        },
        backgroundColor: '#3498db', // Azul
        borderColor: '#2980b9'
      },
      {
        id: '2',
        title: 'Cita: María López',
        start: '2025-11-12T09:00:00',
        end: '2025-11-12T10:00:00',
        extendedProps: {
          telefono: '555-8765'
        },
        backgroundColor: '#2ecc71', // Verde
        borderColor: '#27ae60'
      },
      {
        id: '3',
        title: 'Reunión de Equipo',
        start: '2025-11-12T14:00:00',
        end: '2025-11-12T15:30:00',
        extendedProps: {
          telefono: 'N/A'
        },
        backgroundColor: '#f39c12', // Naranja
        borderColor: '#d35400'
      }
    ];

    setEvents(mockApiEvents);
  }, []);

  // Manejador para clic en un DÍA VACÍO
  const handleDateClick = (arg) => {
    // Formateamos la fecha seleccionada
    const formattedDate = new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'full', 
      timeStyle: 'short'
    }).format(arg.date);

    setModalInfo({
      title: 'Fecha Seleccionada',
      content: `Has hecho clic en: ${formattedDate}\n\nAquí podrías abrir un formulario para crear un nuevo evento.`
    });
  }

  // Manejador para clic en un EVENTO EXISTENTE
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    
    // Formateamos la hora del evento
    const startTime = new Intl.DateTimeFormat('es-ES', { timeStyle: 'short' }).format(event.start);
    
    // Extraemos los datos
    const title = event.title;
    const telefono = event.extendedProps.telefono || 'No especificado';
    const fecha = new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(event.start);

    // Preparamos el contenido del modal
    const modalContent = `Fecha: ${fecha}\nHora: ${startTime}\nTeléfono: ${telefono}`;

    setModalInfo({
      title: title,
      content: modalContent
    });
  }

  return (
    // Envolvemos el calendario en un contenedor con padding y fondo
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">

<div className='flex justify-between'>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Calendario de Citas</h1>
    <Button>Crear Evento</Button>
    </div>      
      <div className="bg-white rounded-lg shadow-lg p-4">
        
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          
          // --- Barra de Herramientas (Navegación y Vistas) ---
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay' // Botones de vistas
          }}
          
          locale={esLocale} // Poner en español
          
          events={events} // Cargar los eventos desde el estado
          
          dateClick={handleDateClick} // Clic en un día
          eventClick={handleEventClick} // Clic en un evento
          selectable={true} // Permite seleccionar rangos de días/horas
          
          // --- Apariencia ---
          dayMaxEvents={true} // Muestra un enlace "+ más" si hay muchos eventos
          height="auto" // Ajusta la altura al contenido
        />
      </div>

      {/* --- Renderizar el Modal --- */}
      <EventModal 
        modalInfo={modalInfo}
        onClose={() => setModalInfo(null)}
      />
    </div>
  );
}