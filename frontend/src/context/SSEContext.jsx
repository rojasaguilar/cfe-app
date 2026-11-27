import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const SSEContext = createContext(null);

export const SSEProvider = ({ children }) => {
  const { user } = useAuth();
  const [eventSource, setEventSource] = useState(null);

  //   if (!user) console.log("no user");

  console.log("provider sse", user);

  const userId = user?.user.usuarioid;

  useEffect(() => {
    if (!userId) return;

    const connection = new EventSource("http://localhost:3000/api/v1/events/", {
      withCredentials: true,
    });

    setEventSource(connection);

    connection.onopen = () => {
      console.log("SSE conectado");
    };

    connection.onerror = (error) => {
      console.error("SSE error:", error);
    };

    return () => {
      connection.close();
      setEventSource(null);
    };
  }, [userId]);

  return (
    <SSEContext.Provider value={eventSource}>{children}</SSEContext.Provider>
  );
};

export const useSSE = () => useContext(SSEContext);
