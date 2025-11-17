import CalendarDataComponent from "./components/calendario/data";
export default async function CalendarPage({ params }) {
  const { id } = await params
  return (
    <div>
      <CalendarDataComponent id={id} />
    </div>
  )
} 