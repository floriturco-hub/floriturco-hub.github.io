import narracion from "../../guion/cronostasis/narracion.json";
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
  Relleno,
  Sacada,
  Suma,
  T,
} from "./Escenas";

export const DURACION_CRONOSTASIS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const Cronostasis: React.FC = () => (
  <Short
    carpeta="cronostasis"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.miras, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.miras, hasta: T.mirar, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Sacada", desde: T.mirar, hasta: T.hueco, render: (t0) => <Sacada t0={t0} /> },
      { nombre: "Relleno", desde: T.hueco, hasta: T.mente, render: (t0) => <Relleno t0={t0} /> },
      { nombre: "Suma", desde: T.mente, hasta: T.porEso, render: (t0) => <Suma t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Supresión sacádica", T.apaga, T.hueco, C.white],
      ["Cronostasis", T.alarga, T.porEso, C.red],
    ]}
    tics={[0.7, T.alarga]}
  />
);
