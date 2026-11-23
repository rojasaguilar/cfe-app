import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { Pencil, X } from "lucide-react";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const maxDate18 = dayjs().subtract(18, "year");

function formatDateInput(value) {
  if (!value) return "";
  const str = String(value);
  return str.length >= 10 ? str.slice(0, 10) : str;
}

function toNullableString(value) {
  if (value === undefined || value === null) return null;
  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}

export const EditEmpleadoModal = ({ open, empleado, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    rfc: "",
    curp: "",
    fechaNacimiento: "",
    estadoCivil: "",
    domicilio: "",
    telefono: "",
    correo: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!open || !empleado) return;

    setFormError(null);
    setFormData({
      nombres: empleado.nombres ?? "",
      apellidos: empleado.apellidos ?? "",
      rfc: empleado.rfc ?? "",
      curp: empleado.curp ?? "",
      fechaNacimiento: formatDateInput(
        empleado.fechaNacimiento ?? empleado.fechanacimiento,
      ),
      estadoCivil: empleado.estadoCivil ?? empleado.estadocivil ?? "",
      domicilio: empleado.domicilio ?? "",
      telefono: empleado.telefono ?? "",
      correo: empleado.correo ?? "",
    });
  }, [open, empleado]);

  const handleChange = (field) => (event) => {
    setFormError(null);
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!empleado) return;

    setFormError(null);

    const payload = {
      nombres: formData.nombres.trim(),
      apellidos: formData.apellidos.trim(),
      rfc: formData.rfc.trim().toUpperCase(),
      curp: formData.curp.trim().toUpperCase(),
      fechaNacimiento: toNullableString(formData.fechaNacimiento),
      estadoCivil:
        toNullableString(formData.estadoCivil)?.toUpperCase() ?? null,
      domicilio: toNullableString(formData.domicilio),
      telefono: toNullableString(formData.telefono),
      correo: toNullableString(formData.correo)?.toLowerCase() ?? null,
    };

    try {
      setSubmitting(true);
      const id = empleado.empleadoid ?? empleado.empleadoId ?? empleado.id;
      await onSubmit(id, payload);
    } catch (err) {
      setFormError(
        err?.message || "No fue posible actualizar los datos del empleado.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getMaxFechaNacimiento18 = () => {
    const hoy = new Date();
    const year = hoy.getFullYear() - 18;
    const month = String(hoy.getMonth() + 1).padStart(2, "0");
    const day = String(hoy.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const maxFechaNacimiento = getMaxFechaNacimiento18();

  return (
    <Dialog
      open={Boolean(open && empleado)}
      onClose={submitting ? undefined : onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "14px" },
      }}
    >
      <DialogTitle className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <Pencil size={18} className="text-emerald-600" />
          Editar datos del empleado
        </span>
        <Button
          onClick={onClose}
          disabled={submitting}
          sx={{ minWidth: "auto", p: 0.5, color: "text.secondary" }}
          aria-label="Cerrar"
        >
          <X size={18} />
        </Button>
      </DialogTitle>

      <Box component="form" id="edit-empleado-form" onSubmit={handleSubmit}>
        <DialogContent className="space-y-4 pt-5">
          {formError && (
            <Alert severity="error" onClose={() => setFormError(null)}>
              {formError}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombres"
                value={formData.nombres}
                onChange={handleChange("nombres")}
                fullWidth
                required
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Apellidos"
                value={formData.apellidos}
                onChange={handleChange("apellidos")}
                fullWidth
                required
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="RFC"
                value={formData.rfc}
                onChange={handleChange("rfc")}
                fullWidth
                required
                size="small"
                inputProps={{
                  maxLength: 13,
                  style: { textTransform: "uppercase" },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="CURP"
                value={formData.curp}
                onChange={handleChange("curp")}
                fullWidth
                required
                size="small"
                inputProps={{
                  maxLength: 18,
                  style: { textTransform: "uppercase" },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              {/* <TextField
                label="Fecha de nacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={(event) => {
                  const val = event.target.value;
                  if (val && val > maxFechaNacimiento) {
                    setFormError(
                      "El empleado debe tener al menos 18 años cumplidos.",
                    );
                    return;
                  }
                  handleChange("fechaNacimiento")(event);
                }}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  max: maxFechaNacimiento,
                }}
              /> */}

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha de nacimiento"
                  value={
                    formData.fechaNacimiento
                      ? dayjs(formData.fechaNacimiento)
                      : null
                  }
                  maxDate={maxDate18}
                  shouldDisableYear={(yearValue) =>
                    yearValue.year() > maxDate18.year()
                  }
                  onChange={(newValue) => {
                    const formatted =
                      newValue && newValue.isValid()
                        ? newValue.format("YYYY-MM-DD")
                        : "";
                    setFormError(null);
                    setFormData((prev) => ({
                      ...prev,
                      fechaNacimiento: formatted,
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Estado civil"
                value={formData.estadoCivil}
                onChange={handleChange("estadoCivil")}
                fullWidth
                size="small"
                inputProps={{ maxLength: 10 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Teléfono"
                value={formData.telefono}
                onChange={handleChange("telefono")}
                fullWidth
                size="small"
                inputProps={{ maxLength: 20 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Correo electrónico"
                type="email"
                value={formData.correo}
                onChange={handleChange("correo")}
                fullWidth
                size="small"
                inputProps={{ maxLength: 120 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Domicilio"
                value={formData.domicilio}
                onChange={handleChange("domicilio")}
                fullWidth
                multiline
                rows={2}
                size="small"
                inputProps={{ maxLength: 255 }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className="border-t border-slate-100 px-6 py-3">
          <Button
            type="button"
            variant="outlined"
            onClick={onClose}
            disabled={submitting}
            sx={{ textTransform: "none", borderRadius: "10px" }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
            }}
          >
            {submitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
