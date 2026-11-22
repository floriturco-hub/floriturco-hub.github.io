import narracion from "../../guion/mareo/narracion.json";
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
  Conductor,
  Conflicto,
  Gancho,
  Senales,
  Truco,
  T,
} from "./Escenas";

export const DURACION_MAREO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const MareoAuto: React.FC = () => (
  <Short
    carpeta="mareo"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.asiento, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.asiento, hasta: T.oido, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Señales", desde: T.oido, hasta: T.cerebro, render: (t0) => <Senales t0={t0} /> },
      { nombre: "Conflicto", desde: T.cerebro, hasta: T.conductor2, render: (t0) => <Conflicto t0={t0} /> },
      { nombre: "Conductor", desde: T.conductor2, hasta: T.truco, render: (t0) => <Conductor t0={t0} /> },
      { nombre: "Truco", desde: T.truco, hasta: T.porEso, render: (t0) => <Truco t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Conflicto sensorial", T.coinciden, T.conductor2, C.yellow],
      ["Mira el horizonte", T.horizonte, T.porEso, C.white],
    ]}
    tics={[0.6, T.coinciden, T.truco]}
  />
);
