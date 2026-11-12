import narracion from "../../guion/polar/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Cierre,
  Desaparece,
  Deslumbra,
  Filtro,
  Gancho,
  Luz,
  Pasa,
  Prueba,
  Rebote,
  T,
} from "./Escenas";

export const DURACION_POLAR_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const LentesPolarizados: React.FC = () => (
  <Short
    carpeta="polar"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho: lentes", desde: 0, hasta: T.y, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.y, hasta: T.luz, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Luz", desde: T.luz, hasta: T.pero, render: (t0) => <Luz t0={t0} /> },
      { nombre: "Rebote", desde: T.pero, hasta: T.ese, render: (t0) => <Rebote t0={t0} /> },
      { nombre: "Deslumbra", desde: T.ese, hasta: T.lentes, render: (t0) => <Deslumbra t0={t0} /> },
      { nombre: "Filtro", desde: T.lentes, hasta: T.esa, render: (t0) => <Filtro t0={t0} /> },
      { nombre: "Pasa", desde: T.esa, hasta: T.asi, render: (t0) => <Pasa t0={t0} /> },
      { nombre: "Desaparece", desde: T.asi, hasta: T.prueba, render: (t0) => <Desaparece t0={t0} /> },
      { nombre: "Prueba", desde: T.prueba, hasta: T.porque, render: (t0) => <Prueba t0={t0} /> },
      { nombre: "Cierre", desde: T.porque, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Luz polarizada", T.horizontal, T.ese, C.white],
      ["Polarizador", T.alineadas, T.esa, C.cyan],
      ["Pruébalo en casa", T.mira, T.porque, C.yellow],
    ]}
    tics={[0.94, T.reja, T.horizontal, T.alineadas, T.desaparece, T.negra]}
  />
);
