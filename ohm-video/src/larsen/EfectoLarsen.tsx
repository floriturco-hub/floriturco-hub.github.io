import narracion from "../../guion/larsen/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Cadena,
  Cierre,
  Conciertos,
  Frecuencias,
  Gancho,
  Lazo,
  T,
} from "./Escenas";

export const DURACION_LARSEN_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const EfectoLarsen: React.FC = () => (
  <Short
    carpeta="larsen"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.acercas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.acercas, hasta: T.el, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Cadena", desde: T.el, hasta: T.si, render: (t0) => <Cadena t0={t0} /> },
      { nombre: "Realimentación", desde: T.si, hasta: T.frecuencias, render: (t0) => <Lazo t0={t0} /> },
      { nombre: "Larsen", desde: T.frecuencias, hasta: T.conciertos, render: (t0) => <Frecuencias t0={t0} /> },
      { nombre: "Conciertos", desde: T.conciertos, hasta: T.porEso, render: (t0) => <Conciertos t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Realimentación acústica", T.vuelve, T.frecuencias, C.yellow],
      ["Efecto Larsen", T.larsen, T.conciertos, C.yellow],
    ]}
    tics={[0.05, T.pitido, T.larsen]}
  />
);
