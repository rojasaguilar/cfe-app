import { useState } from "react";
import { z } from "zod";

import {
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";

import { createEmpleadoSchema } from "./../dtos/create.empleado.dto.js";

const initialFormData = {
  rpe: "",
  rtt: "",
  nombres: "",
  apellidos: "",
  rfc: "",
  curp: "",
};

export const CreateEmpleadoForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo al modificarlo
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      rtt: name === "rpe" || name === "rtt" ? undefined : prev.rtt,
      rpe: name === "rpe" || name === "rtt" ? undefined : prev.rpe,
    }));

    setServerError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setServerError(null);

    // Los campos opcionales vacíos deben convertirse en undefined
    const dataToValidate = {
      ...formData,
      rpe: formData.rpe.trim() || undefined,
      rtt: formData.rtt.trim() || undefined,
    };

    const result = createEmpleadoSchema.safeParse(dataToValidate);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);

      await onSubmit(result.data);

      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      setServerError(error.message || "No fue posible registrar el empleado.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "rpe",
      label: "RPE",
      maxLength: 5,
      required: false,
    },
    {
      name: "rtt",
      label: "RTT",
      maxLength: 5,
      required: false,
    },
    {
      name: "nombres",
      label: "Nombres",
      maxLength: 56,
      required: true,
    },
    {
      name: "apellidos",
      label: "Apellidos",
      maxLength: 56,
      required: true,
    },
    {
      name: "rfc",
      label: "RFC",
      maxLength: 13,
      required: true,
    },
    {
      name: "curp",
      label: "CURP",
      maxLength: 18,
      required: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Registrar empleado
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Introduce la información del nuevo empleado.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {fields.map((field) => (
              <TextField
                key={field.name}
                name={field.name}
                label={field.label}
                value={formData[field.name]}
                onChange={handleChange}
                error={Boolean(errors[field.name])}
                helperText={errors[field.name] || " "}
                required={field.required}
                fullWidth
                size="small"
                disabled={loading}
                slotProps={{
                  htmlInput: {
                    maxLength: field.maxLength,
                  },
                }}
              />
            ))}
          </div>

          <div className="mt-2 mb-5 rounded-lg bg-blue-50 p-3">
            <p className="text-xs leading-relaxed text-blue-800">
              <strong>Nota:</strong> Debes proporcionar RPE o RTT, pero no
              ambos.
            </p>
          </div>

          {serverError && (
            <Alert severity="error" className="mb-5">
              {serverError}
            </Alert>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <Button
              variant="outlined"
              color="inherit"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              className="min-w-36"
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Registrar empleado"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
