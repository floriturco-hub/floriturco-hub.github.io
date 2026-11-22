import narracion from "../../guion/tigo/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Antena,
  Bucle,
  Cierre,
  Fibra,
  Gancho,
  Medicion,
  Tigo,
  T,
} from "./Escenas";

export const DURACION_TIGO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const TigoVelocidad: React.FC = () => (
  <Short
    carpeta="tigo"
    fondo="azul"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.play, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.play, hasta: T.pulsos, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Fibra óptica", desde: T.pulsos, hasta: T.antena, render: (t0) => <Fibra t0={t0} /> },
      { nombre: "Antena 5G", desde: T.antena, hasta: T.velocidad, render: (t0) => <Antena t0={t0} /> },
      { nombre: "Medición", desde: T.velocidad, hasta: T.segun, render: (t0) => <Medicion t0={t0} /> },
      { nombre: "Tigo", desde: T.segun, hasta: T.asi, render: (t0) => <Tigo t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Fibra óptica", T.fibra, T.antena, C.cyan],
      ["Red 5G", T.antena, T.velocidad, C.yellow],
      ["Ookla 2026", T.segun, T.asi, C.white],
    ]}
    tics={[0.6, T.fibra, T.tigo]}
  />
);
