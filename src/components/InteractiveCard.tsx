"use client";

import React from "react";

export default function InteractiveCard({ 
  children, 
  onClick 
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
}) {
  function onCardMouseAction(event: React.SyntheticEvent) {
    if (event.type === "mouseover") {
      event.currentTarget.classList.remove("shadow-lg", "bg-white");
      event.currentTarget.classList.add("shadow-xl", "bg-neutral-200");
    } else {
      event.currentTarget.classList.remove("shadow-xl", "bg-neutral-200");
      event.currentTarget.classList.add("shadow-lg", "bg-white");
    }
  }

  return (
    <div
      className="rounded-2xl shadow-2xl bg-white cursor-pointer transition-all duration-300 overflow-hidden"
      onMouseOver={(e) => onCardMouseAction(e)}
      onMouseOut={(e) => onCardMouseAction(e)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
