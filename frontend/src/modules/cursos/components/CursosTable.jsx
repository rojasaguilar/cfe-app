export const CursosTable = ({ cursos = [] }) => {
  const listaCursos = Array.isArray(cursos) ? cursos : [];

  if (listaCursos.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm font-medium text-slate-600">
          No hay cursos registrados para mostrar.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600">
          <tr>
            <th scope="col" className="px-4 py-3 whitespace-nowrap">
              Código
            </th>
            <th scope="col" className="px-4 py-3">
              Nombre del curso
            </th>
            <th scope="col" className="px-4 py-3 text-right whitespace-nowrap">
              Prácticas
            </th>
            <th scope="col" className="px-4 py-3 text-right whitespace-nowrap">
              Teoría
            </th>
            <th scope="col" className="px-4 py-3 text-right whitespace-nowrap">
              Total hrs
            </th>
            <th scope="col" className="px-4 py-3 text-center whitespace-nowrap">
              Genera DC-3
            </th>
            <th scope="col" className="px-4 py-3 text-center whitespace-nowrap">
              Estado
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 text-slate-700">
          {listaCursos.map((curso, index) => {
            const practicas = Number(curso?.horaspracticas) || 0;
            const teoria = Number(curso?.horasteoria) || 0;
            const totalHoras = practicas + teoria;
            const generaDc3 = Boolean(curso?.generadc3);
            const isActivo = Boolean(curso?.activo);
            const rowKey = curso?.cursoid ?? `${curso?.codigocurso ?? "curso"}-${index}`;

            return (
              <tr
                key={rowKey}
                className="transition-colors hover:bg-slate-50/90"
              >
                <td className="px-4 py-3.5 font-mono text-xs font-medium text-slate-700 whitespace-nowrap">
                  {curso?.codigocurso ?? "—"}
                </td>

                <td className="px-4 py-3.5 font-medium text-slate-900">
                  {curso?.nombre ?? "Sin nombre"}
                </td>

                <td className="px-4 py-3.5 text-right tabular-nums text-slate-600 whitespace-nowrap">
                  {practicas} h
                </td>

                <td className="px-4 py-3.5 text-right tabular-nums text-slate-600 whitespace-nowrap">
                  {teoria} h
                </td>

                <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-blue-700 whitespace-nowrap">
                  {totalHoras} h
                </td>

                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      generaDc3
                        ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                        : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20"
                    }`}
                  >
                    {generaDc3 ? "Sí" : "No"}
                  </span>
                </td>

                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      isActivo
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                        : "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isActivo ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    {isActivo ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};