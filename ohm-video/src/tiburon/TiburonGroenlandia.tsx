import narracion from "../../guion/tiburon/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bomba,
  Bucle,
  Cierre,
  Edad,
  Gancho,
  Ojo,
  T,
} from "./Escenas";

export const DURACION_TIBURON_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const TiburonGroenlandia: React.FC = () => (
  <Short
    carpeta="tiburon"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.groenlandia, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.groenlandia, hasta: T.ojos, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Ojo", desde: T.ojos, hasta: T.calibrar, render: (t0) => <Ojo t0={t0} /> },
      { nombre: "Bomba", desde: T.calibrar, hasta: T.grande, render: (t0) => <Bomba t0={t0} /> },
      { nombre: "Edad", desde: T.grande, hasta: T.asi, render: (t0) => <Edad t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Datación por radiocarbono", T.radiocarbono, T.calibrar, C.cyan],
      ["Pulso de las bombas", T.pico, T.grande, C.yellow],
    ]}
    tics={[0.6, T.cristalino, T.pico]}
  />
);
