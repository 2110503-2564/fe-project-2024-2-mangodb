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
      event.currentTarget.classList.remove("shadow-lg");
      event.currentTarget.classList.add("shadow-xl");
    } else {
      event.currentTarget.classList.remove("shadow-xl");
      event.currentTarget.classList.add("shadow-lg");
    }
  }

  return (
    <div
      className="w-1/5 h-[300px] rounded-2xl shadow-2xl cursor-pointer transition-all duration-300 overflow-hidden"
      onMouseOver={(e) => onCardMouseAction(e)}
      onMouseOut={(e) => onCardMouseAction(e)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
