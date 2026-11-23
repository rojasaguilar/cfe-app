import { useState } from "react";
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

import { createEmpleadoSchema } from "./../dtos/create.empleado.dto.js";

const STEPS = ["Datos obligatorios", "Datos complementarios (opcional)"];

const initialFormData = {
  rpe: "",
  rtt: "",
  nombres: "",
  apellidos: "",
  rfc: "",
  curp: "",
  fechaNacimiento: "",
  estadoCivil: "",
  domicilio: "",
  telefono: "",
  correo: "",
};

const STEP_1_FIELDS = ["rpe", "rtt", "nombres", "apellidos", "rfc", "curp"];

const getMaxFechaNacimiento18 = () => {
  const hoy = new Date();
  const year = hoy.getFullYear() - 18;
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildPayloadToValidate = (formData) => ({
  rpe: formData.rpe.trim() || undefined,
  rtt: formData.rtt.trim() || undefined,
  nombres: formData.nombres,
  apellidos: formData.apellidos,
  rfc: formData.rfc,
  curp: formData.curp,
  fechaNacimiento: formData.fechaNacimiento.trim()
    ? formData.fechaNacimiento.trim()
    : null,
  estadoCivil: formData.estadoCivil.trim() ? formData.estadoCivil.trim() : null,
  domicilio: formData.domicilio.trim() ? formData.domicilio.trim() : null,
  telefono: formData.telefono.trim() ? formData.telefono.trim() : null,
  correo: formData.correo.trim() ? formData.correo.trim() : null,
});

export const CreateEmpleadoForm = ({ onSubmit, onCancel }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const maxFechaNacimiento = getMaxFechaNacimiento18();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      rtt: name === "rpe" || name === "rtt" ? undefined : prev.rtt,
      rpe: name === "rpe" || name === "rtt" ? undefined : prev.rpe,
    }));

    setServerError(null);
  };

  const validateAndExtractErrors = () => {
    const payload = buildPayloadToValidate(formData);
    const result = createEmpleadoSchema.safeParse(payload);

    if (result.success) {
      return { success: true, data: result.data, fieldErrors: {} };
    }

    const fieldErrors = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0];
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    });

    return { success: false, data: null, fieldErrors };
  };

  const handleNextStep = (e) => {
  e.preventDefault();
  e.stopPropagation();

  setServerError(null);

  const { success, fieldErrors } = validateAndExtractErrors();

  if (!success) {
    const step1Errors = {};

    STEP_1_FIELDS.forEach((field) => {
      if (fieldErrors[field]) {
        step1Errors[field] = fieldErrors[field];
      }
    });

    // Si hay errores en los campos obligatorios, no avanzar.
    if (Object.keys(step1Errors).length > 0) {
      setErrors(step1Errors);
      return;
    }
  }

  // Los errores de campos complementarios no impiden avanzar.
  setErrors({});
  setActiveStep(1);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setServerError(null);

    const { success, data, fieldErrors } = validateAndExtractErrors();

    if (!success) {
      setErrors(fieldErrors);

      const hasStep1Error = STEP_1_FIELDS.some((field) =>
        Boolean(fieldErrors[field]),
      );
      if (hasStep1Error) {
        setActiveStep(0);
      }
      return;
    }

    try {
      setLoading(true);
      await onSubmit(data);
      setFormData(initialFormData);
      setErrors({});
      setActiveStep(0);
    } catch (error) {
      setServerError(error.message || "No fue posible registrar el empleado.");
    } finally {
      setLoading(false);
    }
  };

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
              Completa los datos obligatorios y, si deseas, omite o llena los
              datos complementarios.
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

        {/* Stepper */}
        <div className="border-b border-gray-100 px-6 pt-4 pb-3">
          <Stepper activeStep={activeStep} alternativeLabel>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && activeStep === 0) {
              e.preventDefault();
            }
          }}
          className="p-6"
        >
          {activeStep === 0 && (
            <>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <TextField
                  name="rpe"
                  label="RPE"
                  value={formData.rpe}
                  onChange={handleChange}
                  error={Boolean(errors.rpe)}
                  helperText={errors.rpe || " "}
                  fullWidth
                  size="small"
                  disabled={loading}
                  slotProps={{ htmlInput: { maxLength: 5 } }}
                />

                <TextField
                  name="rtt"
                  label="RTT"
                  value={formData.rtt}
                  onChange={handleChange}
                  error={Boolean(errors.rtt)}
                  helperText={errors.rtt || " "}
                  fullWidth
                  size="small"
                  disabled={loading}
                  slotProps={{ htmlInput: { maxLength: 5 } }}
                />

                <TextField
                  name="nombres"
                  label="Nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  error={Boolean(errors.nombres)}
                  helperText={errors.nombres || " "}
                  required
                  fullWidth
                  size="small"
                  disabled={loading}
                  slotProps={{ htmlInput: { maxLength: 56 } }}
                />

                <TextField
                  name="apellidos"
                  label="Apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  error={Boolean(errors.apellidos)}
                  helperText={errors.apellidos || " "}
                  required
                  fullWidth
                  size="small"
                  disabled={loading}
                  slotProps={{ htmlInput: { maxLength: 56 } }}
                />

                <TextField
                  name="rfc"
                  label="RFC"
                  value={formData.rfc}
                  onChange={handleChange}
                  error={Boolean(errors.rfc)}
                  helperText={errors.rfc || " "}
                  required
                  fullWidth
                  size="small"
                  disabled={loading}
                  slotProps={{ htmlInput: { maxLength: 13 } }}
                />

                <TextField
                  name="curp"
                  label="CURP"
                  value={formData.curp}
                  onChange={handleChange}
                  error={Boolean(errors.curp)}
                  helperText={errors.curp || " "}
                  required
                  fullWidth
                  size="small"
                  disabled={loading}
                  slotProps={{ htmlInput: { maxLength: 18 } }}
                />
              </div>

              <div className="mt-2 mb-5 rounded-lg bg-blue-50 p-3">
                <p className="text-xs leading-relaxed text-blue-800">
                  <strong>Nota:</strong> Debes proporcionar RPE o RTT, pero no
                  ambos.
                </p>
              </div>
            </>
          )}

          {activeStep === 1 && (
            <>
              <div className="mb-4 rounded-lg bg-slate-50 p-3">
                <p className="text-xs leading-relaxed text-slate-600">
                  Todos los campos de este paso son opcionales. Puedes
                  completarlos o enviar el registro directamente.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <TextField
                  name="fechaNacimiento"
                  label="Fecha de nacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  error={Boolean(errors.fechaNacimiento)}
                  helperText={errors.fechaNacimiento || " "}
                  fullWidth
                  size="small"
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max: maxFechaNacimiento }}
                />

                <TextField
                  name="estadoCivil"
                  label="Estado civil"
                  value={formData.estadoCivil}
                  onChange={handleChange}
                  error={Boolean(errors.estadoCivil)}
                  helperText={errors.estadoCivil || " "}
                  fullWidth
                  size="small"
                  disabled={loading}
                  slotProps={{ htmlInput: { maxLength: 10 } }}
                />

                <TextField
                  name="telefono"
                  label="Teléfono"
                  value={formData.telefono}
                  onChange={handleChange}
                  error={Boolean(errors.telefono)}
                  helperText={errors.telefono || " "}
                  fullWidth
                  size="small"
                  disabled={loading}
                  slotProps={{ htmlInput: { maxLength: 20 } }}
                />

                <TextField
                  name="correo"
                  label="Correo electrónico"
                  type="email"
                  value={formData.correo}
                  onChange={handleChange}
                  error={Boolean(errors.correo)}
                  helperText={errors.correo || " "}
                  fullWidth
                  size="small"
                  disabled={loading}
                  slotProps={{ htmlInput: { maxLength: 120 } }}
                />

                <div className="md:col-span-2">
                  <TextField
                    name="domicilio"
                    label="Domicilio"
                    value={formData.domicilio}
                    onChange={handleChange}
                    error={Boolean(errors.domicilio)}
                    helperText={errors.domicilio || " "}
                    fullWidth
                    size="small"
                    disabled={loading}
                    slotProps={{ htmlInput: { maxLength: 255 } }}
                  />
                </div>
              </div>
            </>
          )}

          {serverError && (
            <Alert severity="error" className="mb-5">
              {serverError}
            </Alert>
          )}

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
            <div>
              {activeStep === 1 && (
                <Button
                  type="button"
                  variant="outlined"
                  color="inherit"
                  onClick={() => {
                    setErrors({});
                    setActiveStep(0);
                  }}
                  disabled={loading}
                >
                  Anterior
                </Button>
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="outlined"
                color="inherit"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </Button>

              {activeStep === 0 ? (
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleNextStep}
                  disabled={loading}
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  className="min-w-40"
                >
                  {loading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    "Registrar empleado"
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
