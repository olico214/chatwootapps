"use client"

import { useEffect, useState } from "react";
import CalendarComponent from "./calendario"

export default function CalendarDataComponent({ id }) {

  return (
    <div>
      <CalendarComponent id={id} />
    </div>
  )
} 