import { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from "@mui/material";

import { UserRound, UserPlus, X, IdCard } from "lucide-react";

import { getEmpleados } from "../services/empleado.service.js";

export const EmpleadosList = ({ onAssign, onSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmpleados = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getEmpleados();

      setEmpleados(response.data);
    } catch (err) {
      console.error("Error al obtener empleados:", err);
      setError("No fue posible cargar los empleados.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEmpleados();
  }, []);

  // Abrir modal con el empleado seleccionado
  const handleSelectEmpleado = (empleado) => {
    setSelectedEmpleado(empleado);
    setError(null);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleClose = () => {
    if (isAssigning) return;

    setIsModalOpen(false);
    setSelectedEmpleado(null);
    setError(null);
  };

  // Confirmar asignación
  const handleConfirm = async () => {
    if (!selectedEmpleado || !onAssign) return;

    try {
      setIsAssigning(true);
      setError(null);

      await onAssign(selectedEmpleado);

      setIsModalOpen(false);
      setSelectedEmpleado(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error al asignar empleado:", error);

      setError(error.message || "No fue posible asignar al empleado.");
    } finally {
      setIsAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <CircularProgress />
      </div>
    );
  }

  if (error && empleados.length === 0) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!empleados.length) {
    return (
      <p className="text-gray-500 text-center p-8">
        No hay empleados disponibles.
      </p>
    );
  }

  return (
    <>
      {/* LISTA DE EMPLEADOS */}
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
        {empleados
          .filter((e) => e.plazaid === null)
          .map((empleado, index) => {
            const foto =
              empleado.fotoUrl || empleado.foto || empleado.fotografia || "";

            return (
              <div
                key={empleado.id || empleado.empleadoid || index}
                className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <Avatar
                    src={foto || undefined}
                    alt={`${empleado.nombres} ${empleado.apellidos}`}
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: "#dbeafe",
                      color: "#2563eb",
                    }}
                  >
                    <UserRound size={24} />
                  </Avatar>

                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-gray-800 uppercase truncate">
                      {empleado.nombres} {empleado.apellidos}
                    </span>

                    <span className="text-xs text-gray-400 mt-1">
                      {empleado.rpe
                        ? `RPE: ${empleado.rpe}`
                        : empleado.rtt
                          ? `RTT: ${empleado.rtt}`
                          : "Sin identificador"}
                    </span>
                  </div>
                </div>

                <Tooltip title="Seleccionar empleado">
                  <IconButton
                    onClick={() => handleSelectEmpleado(empleado)}
                    size="medium"
                    className="text-blue-600 hover:bg-blue-50 shrink-0"
                  >
                    <UserPlus size={21} />
                  </IconButton>
                </Tooltip>
              </div>
            );
          })}
      </div>

      {/* MODAL DE ASIGNACIÓN */}
      <Dialog
        open={isModalOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        disableEscapeKeyDown={isAssigning}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: 0,
          },
        }}
      >
        {/* HEADER */}
        <DialogTitle className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Asignar empleado
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Confirma la información del empleado seleccionado.
            </p>
          </div>

          <IconButton onClick={handleClose} disabled={isAssigning} size="small">
            <X size={20} />
          </IconButton>
        </DialogTitle>

        {/* CONTENIDO */}
        <DialogContent className="!p-6">
          {selectedEmpleado && (
            <div className="space-y-6">
              {/* FOTO Y NOMBRE */}
              <div className="flex flex-col items-center gap-3 py-3">
                <Avatar
                  src={
                    selectedEmpleado.fotoUrl ||
                    selectedEmpleado.foto ||
                    selectedEmpleado.fotografia ||
                    undefined
                  }
                  alt={selectedEmpleado.nombres}
                  sx={{
                    width: 110,
                    height: 110,
                    bgcolor: "#dbeafe",
                    color: "#2563eb",
                    border: "4px solid #eff6ff",
                    fontSize: 40,
                  }}
                >
                  <UserRound size={48} />
                </Avatar>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 uppercase">
                    {selectedEmpleado.nombres}
                  </h3>

                  <p className="text-lg text-gray-600 uppercase">
                    {selectedEmpleado.apellidos}
                  </p>

                  <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                    <IdCard size={14} />
                    Información del empleado
                  </span>
                </div>
              </div>

              {/* DATOS DEL EMPLEADO */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Identificadores
                  </h4>
                </div>

                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs text-gray-400 mb-1">
                      RPE
                    </span>

                    <span className="font-semibold text-gray-800">
                      {selectedEmpleado.rpe || "No disponible"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs text-gray-400 mb-1">
                      RTT
                    </span>

                    <span className="font-semibold text-gray-800">
                      {selectedEmpleado.rtt || "No disponible"}
                    </span>
                  </div>
                </div>
              </div>

              {/* NOMBRE COMPLETO */}
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                <p className="text-xs text-blue-500 font-semibold uppercase mb-1">
                  Empleado que será asignado
                </p>

                <p className="text-sm font-semibold text-blue-900">
                  {selectedEmpleado.nombres} {selectedEmpleado.apellidos}
                </p>
              </div>

              {/* ERROR */}
              {error && <Alert severity="error">{error}</Alert>}
            </div>
          )}
        </DialogContent>

        {/* FOOTER */}
        <DialogActions className="!px-6 !py-4 border-t border-gray-100">
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleClose}
            disabled={isAssigning}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            disabled={isAssigning || !onAssign}
            startIcon={
              isAssigning ? (
                <CircularProgress size={17} color="inherit" />
              ) : (
                <UserPlus size={17} />
              )
            }
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              paddingX: 3,
            }}
          >
            {isAssigning ? "Asignando..." : "Confirmar asignación"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
