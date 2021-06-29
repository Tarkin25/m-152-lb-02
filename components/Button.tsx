import React, { ReactNode } from "react";
import { EventDispatcher } from "../three/systems/events";

type DispatchedEvent = Parameters<typeof EventDispatcher.dispatchEvent>[0];

type EventCreator = () => DispatchedEvent;

export interface ButtonProps {
  children?: ReactNode;
  eventCreator: EventCreator;
}

const Button = (props: ButtonProps) => {
  const { children, eventCreator } = props;

  const onClick = () => {
    EventDispatcher.dispatchEvent(eventCreator());
  };

  return (
    <button
      className="shadow mx-2 px-4 py-2 text-white rounded-lg bg-blue-800 focus:outline-none active:bg-blue-900"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
