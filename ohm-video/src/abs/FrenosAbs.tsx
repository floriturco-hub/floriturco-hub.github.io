import narracion from "../../guion/abs/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bloqueo,
  Bucle,
  Cierre,
  Esquiva,
  Gancho,
  Pisalo,
  Sensor,
  Valvula,
  T,
} from "./Escenas";

export const DURACION_ABS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const FrenosAbs: React.FC = () => (
  <Short
    carpeta="abs"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.frenas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.frenas, hasta: T.bloquea, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Bloqueo", desde: T.bloquea, hasta: T.sensor, render: (t0) => <Bloqueo t0={t0} /> },
      { nombre: "Sensor", desde: T.sensor, hasta: T.frena, render: (t0) => <Sensor t0={t0} /> },
      { nombre: "Válvula", desde: T.frena, hasta: T.borde, render: (t0) => <Valvula t0={t0} /> },
      { nombre: "Esquivar", desde: T.borde, hasta: T.sueltes, render: (t0) => <Esquiva t0={t0} /> },
      { nombre: "Pisa a fondo", desde: T.sueltes, hasta: T.porEso, render: (t0) => <Pisalo t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Sistema antibloqueo (ABS)", T.sensor, T.borde, C.yellow],
      ["Mantén el pedal pisado", T.fondo, T.porEso, C.white],
    ]}
    tics={[0.6, T.valvula, T.sueltes]}
  />
);
