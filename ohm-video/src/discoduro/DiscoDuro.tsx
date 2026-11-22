import narracion from "../../guion/discoduro/narracion.json";
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
  Gancho,
  Lectura,
  Magnetico,
  Rampa,
  Vuelo,
  T,
} from "./Escenas";

export const DURACION_DISCODURO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const DiscoDuro: React.FC = () => (
  <Short
    carpeta="discoduro"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.archivos, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.archivos, hasta: T.capa, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Magnetico", desde: T.capa, hasta: T.cabeza, render: (t0) => <Magnetico t0={t0} /> },
      { nombre: "Vuelo", desde: T.cabeza, hasta: T.pasar, render: (t0) => <Vuelo t0={t0} /> },
      { nombre: "Lectura", desde: T.pasar, hasta: T.apagarlo, render: (t0) => <Lectura t0={t0} /> },
      { nombre: "Rampa", desde: T.apagarlo, hasta: T.asi, render: (t0) => <Rampa t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Grabación magnética", T.zonas, T.cabeza, C.cyan],
      ["Lectura magnética", T.senales, T.apagarlo, C.yellow],
    ]}
    tics={[0.6, T.levanta, T.rampa]}
  />
);
