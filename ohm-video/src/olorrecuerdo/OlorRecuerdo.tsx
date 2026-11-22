import narracion from "../../guion/olorrecuerdo/narracion.json";
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
  Infancia,
  Ruta,
  T,
} from "./Escenas";

export const DURACION_OLORREC_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const OlorRecuerdo: React.FC = () => (
  <Short
    carpeta="olorrecuerdo"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.perfume, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.perfume, hasta: T.ves, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Ruta", desde: T.ves, hasta: T.sentias, render: (t0) => <Ruta t0={t0} /> },
      { nombre: "Infancia", desde: T.sentias, hasta: T.porEso, render: (t0) => <Infancia t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Sistema límbico", T.amigdala, T.sentias, C.yellow],
    ]}
    tics={[0.6, T.olfato, T.amigdala]}
  />
);
