import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEmpleado } from "../services/empleado.service";
import { DatosGeneralesCard } from "../components/DatosGeneralesCard";
import { BateriasCard } from "../components/BateriasCard";
import { ExpedienteTabsCard } from "../components/ExpedienteTabsCard";
import { Alert, Avatar, Box, Button, CircularProgress } from "@mui/material";
import { ArrowLeft, IdCard } from "lucide-react";

export const EmpleadoViewPage = () => {
  const { empleadoid } = useParams();
  const navigate = useNavigate();

  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchEmpleado = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getEmpleado(empleadoid);
        const data = response?.data ?? response;
        if (active) {
          setEmpleado(data);
        }
      } catch (err) {
        console.error("Error al obtener empleado:", err);
        if (active) {
          setError(
            err?.message ||
              "No fue posible cargar la información del empleado.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (empleadoid) {
      fetchEmpleado();
    } else {
      setLoading(false);
      setError("No se especificó el identificador del empleado.");
    }

    return () => {
      active = false;
    };
  }, [empleadoid]);

  const fullName =
    [empleado?.nombres, empleado?.apellidos].filter(Boolean).join(" ") ||
    "Empleado";

  if (loading) {
    return (
      <Box className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <CircularProgress size={36} />
        <p className="text-sm text-slate-500">Cargando expediente...</p>
      </Box>
    );
  }

  if (error || !empleado) {
    return (
      <main className="max-w-4xl mx-auto p-6 space-y-4">
        <Alert severity="error">
          {error || "No se encontró el empleado solicitado."}
        </Alert>
        <Button
          startIcon={<ArrowLeft size={16} />}
          variant="outlined"
          onClick={() => navigate("/empleados")}
        >
          Volver a empleados
        </Button>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button
          startIcon={<ArrowLeft size={16} />}
          variant="outlined"
          onClick={() => navigate("/empleados")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "10px",
            alignSelf: { xs: "flex-start", sm: "auto" },
          }}
        >
          Volver al listado
        </Button>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <DatosGeneralesCard empleado={empleado} />
        <BateriasCard
          bateriaActual={empleado.bateriaActual}
          bateriaSuperior={empleado.bateriaSuperior}
        />
      </section>

      <ExpedienteTabsCard empleado={empleado} />
    </main>
  );
};