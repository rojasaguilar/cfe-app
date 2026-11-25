import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBateriaByEmpleado,
  getEmpleado,
  updateEmpleado,
  getKardexEmpleado,
} from "../services/empleado.service";
import { DatosGeneralesCard } from "../components/DatosGeneralesCard";
import { BateriasCard } from "../components/BateriasCard";
import { ExpedienteTabsCard } from "../components/ExpedienteTabsCard";
import { EditEmpleadoModal } from "../components/EditEmpleadoModal";
import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { ArrowLeft, Pencil } from "lucide-react";

export const EmpleadoViewPage = () => {
  const { empleadoid } = useParams();
  const navigate = useNavigate();

  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [baterias, setBaterias] = useState({});
  const [kardex, setKardex] = useState({});
  const [bateriasError, setBateriasError] = useState(null);
  const [kardexError, setKardexError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchEmpleado = useCallback(
    async (showSpinner = true) => {
      try {
        if (showSpinner) {
          setLoading(true);
        }
        setError(null);
        const response = await getEmpleado(empleadoid);
        const data = response?.data ?? response;
        setEmpleado(data);

        const bateriasResponse = await getBateriaByEmpleado(empleadoid);
        const bateriasData = bateriasResponse?.data ?? bateriasResponse;
        setBaterias(bateriasData);

        const kardexResponse = await getKardexEmpleado(empleadoid);
        const kardexData = kardexResponse?.data ?? kardexResponse;
        setKardex(kardexData);
        // } catch (bateriaErr) {
      } catch (err) {
        console.log(err.statusCode);
        console.warn("Baterías no disponibles para el empleado:", err);
        if (err.comingFrom === "bateria_service") {
          setBaterias({});
          setBateriasError(
            err?.message || "Batería no disponible para este empleado.",
          );
        }
        if (err.comingFrom === "kardex_service") {
          setKardex([]);
          setKardexError(
            err?.message || "Kardex no disponible para este empleado.",
          );
        }
      } finally {
        if (showSpinner) {
          setLoading(false);
        }
      }
    },
    [empleadoid],
  );

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!empleadoid) {
        setLoading(false);
        setError("No se especificó el identificador del empleado.");
        return;
      }
      if (active) {
        await fetchEmpleado(true);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [empleadoid, fetchEmpleado]);

  const handleUpdateEmpleado = async (id, payload) => {
    await updateEmpleado(id, payload);
    setIsEditOpen(false);
    await fetchEmpleado(false);
  };

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
    <main className="max-w-8xl mx-auto p-4 sm:p-6 space-y-6">
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

        <Button
          startIcon={<Pencil size={16} />}
          variant="contained"
          onClick={() => setIsEditOpen(true)}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "10px",
            alignSelf: { xs: "flex-start", sm: "auto" },
          }}
        >
          Editar
        </Button>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <DatosGeneralesCard empleado={empleado} />
        <BateriasCard
          bateriaActual={baterias?.bateriaActual ?? null}
          bateriaSuperior={baterias?.bateriaSuperior ?? null}
          errorMessage={bateriasError}
        />
      </section>

      <ExpedienteTabsCard empleado={empleado} kardex={kardex} />

      <EditEmpleadoModal
        open={isEditOpen}
        empleado={empleado}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleUpdateEmpleado}
      />
    </main>
  );
};
