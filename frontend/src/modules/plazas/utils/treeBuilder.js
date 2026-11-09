export const buildPlazaTree = (plazas) => {
  const plazaMap = {};
  const roots = [];

  // 1. Inicializar el mapa con un arreglo vacío de hijos
  plazas.forEach((plaza) => {
    plazaMap[plaza.plazaid] = { ...plaza, children: [] };
  });

  // 2. Anidar cada plaza dentro de su padre
  plazas.forEach((plaza) => {
    if (plaza.plazapadreid && plazaMap[plaza.plazapadreid]) {
      plazaMap[plaza.plazapadreid].children.push(plazaMap[plaza.plazaid]);
    } else {
      // Si no tiene padre, es un nodo raíz (la cabeza del departamento)
      roots.push(plazaMap[plaza.plazaid]);
    }
  });

  return roots;
};