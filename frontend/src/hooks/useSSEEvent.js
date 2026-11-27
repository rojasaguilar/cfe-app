import { useEffect } from "react";
import { useSSE } from "../context/SSEContext";

export const useSSEEvent = (event, callback) => {
  const eventSource = useSSE();

  useEffect(() => {
    if (!eventSource) return;

    const handler = (message) => {
      callback(JSON.parse(message.data));
    };

    eventSource.addEventListener(event, handler);

    return () => {
      eventSource.removeEventListener(event, handler);
    };
  }, [eventSource, event, callback]);
};