import narracion from "../../guion/obturador/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Antigua,
  Bucle,
  Cierre,
  Electronico,
  Gancho,
  Grabacion,
  Paises,
  T,
} from "./Escenas";

export const DURACION_OBTURADOR_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CamaraClic: React.FC = () => (
  <Short
    carpeta="obturador"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.tomas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.tomas, hasta: T.antigua, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Cámara antigua", desde: T.antigua, hasta: T.electronico, render: (t0) => <Antigua t0={t0} /> },
      { nombre: "Obturador electrónico", desde: T.electronico, hasta: T.grabacion, render: (t0) => <Electronico t0={t0} /> },
      { nombre: "Grabación", desde: T.grabacion, hasta: T.japon, render: (t0) => <Grabacion t0={t0} /> },
      { nombre: "Japón y Corea", desde: T.japon, hasta: T.ahi, render: (t0) => <Paises t0={t0} /> },
      { nombre: "Cierre", desde: T.ahi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Obturador mecánico", T.cortinilla, T.electronico, C.white],
      ["Obturador electrónico", T.electronico, T.grabacion, C.yellow],
    ]}
    tics={[0.6, T.grabacion, T.japon]}
  />
);
