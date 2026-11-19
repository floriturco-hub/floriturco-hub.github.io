import narracion from "../../guion/sawstop/narracion.json";
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
  Deteccion,
  Freno,
  Gancho,
  Rasguno,
  T,
} from "./Escenas";

export const DURACION_SAWSTOP_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const SierraSawstop: React.FC = () => (
  <Short
    carpeta="sawstop"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.tocas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.tocas, hasta: T.senal, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Detección", desde: T.senal, hasta: T.entonces, render: (t0) => <Deteccion t0={t0} /> },
      { nombre: "Freno", desde: T.entonces, hasta: T.rasguno, render: (t0) => <Freno t0={t0} /> },
      { nombre: "Rasguño", desde: T.rasguno, hasta: T.asi, render: (t0) => <Rasguno t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Detección capacitiva", T.absorbe, T.entonces, C.yellow],
      ["Freno de emergencia", T.bloque, T.rasguno, C.white],
    ]}
    tics={[0.7, T.instante, T.clavan]}
  />
);
