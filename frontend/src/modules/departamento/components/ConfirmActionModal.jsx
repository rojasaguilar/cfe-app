import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export const ConfirmActionModal = ({
  isOpen,
  onClose,
  onConfirm,
  departmentName,
  isActivating,
  isLoading,
  entity,
}) => {
  const [confirmText, setConfirmText] = useState("");

  // Limpiar el input cada vez que se abre el modal
  useEffect(() => {
    if (isOpen) setConfirmText("");
  }, [isOpen]);

  if (!isOpen) return null;

  const actionText = isActivating ? "activar" : "desactivar";
  const actionColor = isActivating
    ? "bg-green-600 hover:bg-green-700"
    : "bg-red-600 hover:bg-red-700";

  // Validamos que escriba exactamente "confirmar" (ignorando mayúsculas/espacios)
  const isButtonEnabled = confirmText.trim().toLowerCase() === "confirmar";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center mb-6 mt-2">
          <div
            className={`p-3 rounded-full mb-4 ${isActivating ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
          >
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">¿Estás seguro?</h2>
          <p className="text-gray-600 mt-2 text-sm">
            Estás a punto de <strong>{actionText} {entity}</strong> {" "}
            <br />
            <span className="font-semibold text-gray-900 uppercase">
              "{departmentName}"
            </span>
            .
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-700 text-center mb-2">
            Para continuar, escribe la palabra <strong>confirmar</strong>
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="confirmar"
            className="w-full p-2.5 text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={!isButtonEnabled || isLoading}
            className={`flex-1 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${actionColor}`}
          >
            {isLoading ? "Procesando..." : `Sí, ${actionText}`}
          </button>
        </div>
      </div>
    </div>
  );
};
