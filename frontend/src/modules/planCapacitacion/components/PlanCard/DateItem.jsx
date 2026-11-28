export const DateItem = ({ icon: Icon, label, date }) => {
  const dateFormatter = new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formatDate = (date) => {
    if (!date || Number.isNaN(new Date(date).getTime())) {
      return "Sin definir";
    }

    return dateFormatter.format(new Date(date));
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-white text-slate-500">
        <Icon size={18} strokeWidth={1.8} />
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>

        <p className="mt-0.5 text-sm font-semibold text-slate-700">
          {formatDate(date)}
        </p>
      </div>
    </div>
  );
};
