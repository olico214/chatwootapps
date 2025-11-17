"use client";
import React, { useState, useEffect } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Spinner, useDisclosure } from '@nextui-org/react';
import ModalCrearEvento from '../modalEventos/crear';

// --- 1. Constante de Colores ---
const STATUS_COLORS = {
  Nuevo: {
    backgroundColor: '#3498db', // Azul
    borderColor: '#2980b9'
  },
  Reagenda: {
    backgroundColor: '#f39c12', // Naranja
    borderColor: '#d35400'
  },
  Finalizado: {
    backgroundColor: '#2ecc71', // Verde
    borderColor: '#27ae60'
  },
  cancelado: {
    backgroundColor: '#e74c3c', // Rojo
    borderColor: '#c0392b'
  },
  default: {
    backgroundColor: '#95a5a6', // Gris
    borderColor: '#7f8c8d'
  }
};

export default function CalendarComponent({ id }) {

  const [selectedEventData, setSelectedEventData] = useState(null);
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange
  } = useDisclosure();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);


  // --- 2. CORRECCIÓN PRINCIPAL (useEffect) ---
  // Se movió la lógica de 'fetchEvents' DENTRO del 'useEffect'.
  // Esto soluciona el error "Cannot access 'fetchEvents' before initialization".
  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setLoadError("No se proporcionó un ID de usuario.");
      return;
    }

    const fetchEvents = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const response = await fetch(`/api/${id}/calendar`);
        if (!response.ok) {
          throw new Error('Error al cargar las citas del servidor.');
        }

        const data = await response.json();

        // --- 3. ACTUALIZACIÓN: Aplicar colores por estatus ---
        const formattedEvents = data.map(cita => {
          // Asigna 'Nuevo' si el estatus es null o vacío
          const status = cita.status || 'Nuevo';
          // Obtiene el par de colores o usa el default
          const colors = STATUS_COLORS[status] || STATUS_COLORS.default;
          const newDate = cita.date.split("T")
          return {
            id: cita.id,
            title: cita.name,
            start: `${newDate[0]}T${cita.hour}`,
            extendedProps: {
              telefono: cita.phone,
              comentary: cita.comentary,
              status: status // <-- Guardamos el estatus aquí
            },
            backgroundColor: colors.backgroundColor, // <-- Color aplicado
            borderColor: colors.borderColor       // <-- Color aplicado
          };
        });

        console.log("Eventos formateados:", formattedEvents); // Revisa la consola de tu navegador
        setEvents(formattedEvents);

      } catch (err) {
        setLoadError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Llamamos a la función que acabamos de definir
    fetchEvents();

  }, [id]); // El 'useEffect' se ejecuta cada vez que el 'id' cambia


  // Clic en un día (para Crear)
  const handleDateClick = (arg) => {
    // ... (sin cambios)
    const d = arg.date;
    const date = d.toISOString().split('T')[0];
    const time = arg.allDay ? "09:00" : d.toTimeString().split(' ')[0].substring(0, 5);
    setSelectedEventData({ date: date, hour: time });
    onCreateOpen();
  };

  // Clic en un evento (para Editar)
  const handleEventClick = (arg) => {
    // ... (sin cambios)
    const event = arg.event;
    const isoStart = event.start.toISOString();
    const date = isoStart.split('T')[0];
    const hour = isoStart.split('T')[1].substring(0, 5);

    const eventData = {
      id: event.id,
      name: event.title,
      phone: event.extendedProps.telefono || '',
      comentary: event.extendedProps.comentary || '',
      status: event.extendedProps.status || 'Nuevo', // <-- Pasa el estatus al modal
      date: date,
      hour: hour,
    };
    setSelectedEventData(eventData);
    onCreateOpen();
  };


  // --- 4. ACTUALIZACIÓN: Asignar color al CREAR y ACTUALIZAR ---
  const handleCreateSuccess = (eventData, mode) => {

    if (mode === 'create') {
      const colors = STATUS_COLORS['Nuevo']; // Los nuevos siempre son 'Nuevo'
      const formattedEvent = {
        id: eventData.id,
        title: eventData.name,
        start: `${eventData.date}T${eventData.hour}`,
        extendedProps: {
          telefono: eventData.phone,
          comentary: eventData.comentary,
          status: 'Nuevo' // <-- Asignar estatus
        },
        backgroundColor: colors.backgroundColor, // <-- Asignar color
        borderColor: colors.borderColor
      };
      setEvents(prev => [...prev, formattedEvent]);

    } else if (mode === 'update') {
      // Al actualizar, debemos encontrar el estatus original (ya que el modal aún no lo edita)
      // y re-aplicar el color correcto.
      setEvents(prevEvents => prevEvents.map(event => {
        if (event.id.toString() === eventData.id.toString()) {
          // Mantenemos el estatus que ya tenía
          const status = event.extendedProps.status || 'Nuevo';
          const colors = STATUS_COLORS[status] || STATUS_COLORS.default;
          return {
            id: eventData.id,
            title: eventData.name,
            start: `${eventData.date}T${eventData.hour}`,
            end: `${eventData.date}T${eventData.hour}`,
            extendedProps: {
              telefono: eventData.phone,
              comentary: eventData.comentary,
              status: status // <-- Preservar estatus
            },
            backgroundColor: colors.backgroundColor, // <-- Re-aplicar color
            borderColor: colors.borderColor
          };
        }
        return event; // Devuelve los otros eventos sin cambios
      }));

    } else if (mode === 'delete') {
      setEvents(prevEvents => prevEvents.filter(event =>
        event.id.toString() !== eventData.id.toString()
      ));
    }

    onOpenChange();
    setSelectedEventData(null);
  };


  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className='flex justify-between items-center mb-6'>
        {/* ... (título y modal) ... */}
        <h1 className="text-3xl font-bold text-gray-800">Calendario de Citas</h1>
        <ModalCrearEvento
          id={id} // id_user
          isOpen={isCreateOpen}
          onOpenChange={() => {
            onOpenChange();
            if (isCreateOpen) {
              setSelectedEventData(null);
            }
          }}
          eventData={selectedEventData}
          onSuccess={handleCreateSuccess}
        />

      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          // ... (resto de las props de FullCalendar están bien) ...
          locale={esLocale}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          // ...
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          selectable={true}
          dayMaxEvents={true}
          height="auto"
          eventDataUpdated={(info) => info.event}
        />
      </div>
    </div>
  );
}