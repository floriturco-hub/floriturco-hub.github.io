import narracion from "../../guion/espejismo/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Aire,
  Bucle,
  Cerebro,
  Cierre,
  Curva,
  Gancho,
  T,
} from "./Escenas";

export const DURACION_ESPEJISMO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const EspejismoCarretera: React.FC = () => (
  <Short
    carpeta="espejismo"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.calor, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.calor, hasta: T.asfalto, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Aire caliente", desde: T.asfalto, hasta: T.luz, render: (t0) => <Aire t0={t0} /> },
      { nombre: "Rayo curvo", desde: T.luz, hasta: T.cerebro, render: (t0) => <Curva t0={t0} /> },
      { nombre: "Cielo", desde: T.cerebro, hasta: T.porEso, render: (t0) => <Cerebro t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Refracción", T.rapido, T.rayo, C.yellow],
      ["Espejismo inferior", T.ojos, T.porEso, C.cyan],
    ]}
    tics={[0.7, T.dobla]}
  />
);
