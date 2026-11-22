import narracion from "../../guion/periscopio/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Acostar,
  Bucle,
  Camino,
  Cierre,
  Gancho,
  Submarino,
  T,
} from "./Escenas";

export const DURACION_PERISCOPIO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const ZoomPeriscopio: React.FC = () => (
  <Short
    carpeta="periscopio"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.aumentos, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.aumentos, hasta: T.truco, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Acostar", desde: T.truco, hasta: T.luz, render: (t0) => <Acostar t0={t0} /> },
      { nombre: "Camino de la luz", desde: T.luz, hasta: T.periscopio, render: (t0) => <Camino t0={t0} /> },
      { nombre: "Periscopio", desde: T.periscopio, hasta: T.ahi, render: (t0) => <Submarino t0={t0} /> },
      { nombre: "Cierre", desde: T.ahi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Distancia focal", T.lentes, T.truco, C.red],
      ["Prisma a 90°", T.desvia, T.atraviesa, C.cyan],
      ["Cámara periscópica", T.periscopio, T.ahi, C.yellow],
    ]}
    tics={[0.7, T.desvia, T.acostado]}
  />
);
