import {
  GraduationCap,
  Clock3,
  Award,
  BookOpen,
  CalendarDays,
  FileBadge,
} from "lucide-react";

const formatDate = (date) => {
  if (!date) return "Pendiente";

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
};

const getStatusStyles = (status) => {
  const styles = {
    INSCRITO: "bg-blue-50 text-blue-700 ring-blue-600/20",
    APROBADO: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    REPROBADO: "bg-red-50 text-red-700 ring-red-600/20",
    CANCELADO: "bg-gray-100 text-gray-600 ring-gray-500/20",
  };

  return styles[status] || "bg-amber-50 text-amber-700 ring-amber-600/20";
};

const StatCard = ({ label, value, icon: Icon, iconColor }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{label}</p>

      <div className={`rounded-lg p-2 ${iconColor}`}>
        <Icon size={18} />
      </div>
    </div>

    <p className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
      {value}
    </p>
  </div>
);

export default function KardexTable({ cursos = [] }) {
  const totalHoras = cursos.reduce(
    (total, curso) =>
      total + (curso.horaspracticas || 0) + (curso.horasteoria || 0),
    0,
  );

  const cursosAprobados = cursos.filter(
    (curso) => curso.estadocurso === "APROBADO",
  ).length;

  const cursosInscritos = cursos.filter(
    (curso) => curso.estadocurso === "INSCRITO",
  ).length;

  return (
    <section className="space-y-5">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-gray-900">
            Historial de capacitación
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Registro histórico de formación y desarrollo profesional.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
          <GraduationCap size={17} className="text-gray-500" />

          <span className="text-sm font-medium text-gray-700">
            Kardex académico
          </span>
        </div>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Cursos registrados"
          value={cursos.length}
          icon={BookOpen}
          iconColor="bg-blue-50 text-blue-600"
        />

        <StatCard
          label="Cursos aprobados"
          value={cursosAprobados}
          icon={Award}
          iconColor="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          label="En capacitación"
          value={cursosInscritos}
          icon={GraduationCap}
          iconColor="bg-amber-50 text-amber-600"
        />

        <StatCard
          label="Horas acumuladas"
          value={`${totalHoras} h`}
          icon={Clock3}
          iconColor="bg-violet-50 text-violet-600"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* Cabecera de tabla */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Cursos registrados
            </h3>

            <p className="mt-0.5 text-xs text-gray-500">
              Detalle de actividades de capacitación del empleado.
            </p>
          </div>

          <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            {cursos.length} registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Curso
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Tipo
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Duración
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Modalidad
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Periodo
                </th>

                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Calificación
                </th>

                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  DC-3
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Estado
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {cursos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <GraduationCap size={23} className="text-gray-400" />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-gray-800">
                      Sin registros de capacitación
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Este empleado todavía no tiene cursos registrados.
                    </p>
                  </td>
                </tr>
              ) : (
                cursos.map((curso) => (
                  <tr
                    key={curso.cursoid}
                    className="transition-colors hover:bg-gray-50/80"
                  >
                    {/* Curso */}
                    <td className="max-w-[340px] px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold leading-5 text-gray-800">
                          {curso.nombrecurso}
                        </span>

                        <span className="font-mono text-xs text-gray-500">
                          {curso.codigocurso}
                        </span>
                      </div>
                    </td>

                    {/* Tipo */}
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600">
                        {curso.tipocurso}
                      </span>
                    </td>

                    {/* Duración */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-gray-800">
                          {(curso.horaspracticas || 0) +
                            (curso.horasteoria || 0)}{" "}
                          h
                        </span>

                        <span className="whitespace-nowrap text-xs text-gray-500">
                          {curso.horasteoria} T · {curso.horaspracticas} P
                        </span>
                      </div>
                    </td>

                    {/* Modalidad */}
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">
                        {curso.modalidad || "No especificada"}
                      </span>
                    </td>

                    {/* Periodo */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-700">
                          {formatDate(curso.fechainiciocurso)}
                        </span>

                        <span className="text-xs text-gray-500">
                          Hasta {formatDate(curso.fechaterminocurso)}
                        </span>
                      </div>
                    </td>

                    {/* Calificación */}
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`text-sm font-semibold ${
                          curso.calificacion === null
                            ? "text-gray-400"
                            : "text-gray-800"
                        }`}
                      >
                        {curso.calificacion ?? "—"}
                      </span>
                    </td>

                    {/* DC-3 */}
                    <td className="px-4 py-4 text-center">
                      {curso.generadc3 ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                          <FileBadge size={14} />
                          Sí
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No</span>
                      )}
                    </td>

                    {/* Estado */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusStyles(
                          curso.estadocurso,
                        )}`}
                      >
                        {curso.estadocurso}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pie */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-gray-50/50 px-5 py-3">
          <span className="text-xs text-gray-500">
            Mostrando {cursos.length} registros
          </span>

          <span className="text-xs text-gray-500">
            T = Horas teóricas · P = Horas prácticas
          </span>
        </div>
      </div>
    </section>
  );
}
