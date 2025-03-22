"use client";

import React from "react";

export default function InteractiveCard({ 
  children,
  className,
  onClick 
}: { 
  children: React.ReactNode;
  className?: string;
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
      className={`${className} rounded-3xl shadow-2xl cursor-pointer transition-all duration-300 overflow-hidden`}
      onMouseOver={(e) => onCardMouseAction(e)}
      onMouseOut={(e) => onCardMouseAction(e)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
