import narracion from "../../guion/stilson/narracion.json";
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
  Cuna,
  Gancho,
  Mandibula,
  Pinza,
  Sentido,
  T,
} from "./Escenas";

export const DURACION_STILSON_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const LlaveStilson: React.FC = () => (
  <Short
    carpeta="stilson"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.stilson, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.stilson, hasta: T.mandibula, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Mandíbula", desde: T.mandibula, hasta: T.jalas, render: (t0) => <Mandibula t0={t0} /> },
      { nombre: "Cuña", desde: T.jalas, hasta: T.sentido, render: (t0) => <Cuna t0={t0} /> },
      { nombre: "Un sentido", desde: T.sentido, hasta: T.pinza, render: (t0) => <Sentido t0={t0} /> },
      { nombre: "Pinza de presión", desde: T.pinza, hasta: T.porEso, render: (t0) => <Pinza t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Efecto cuña", T.cuna, T.sentido, C.yellow],
      ["Mecanismo de punto muerto", T.traban, T.porEso, C.white],
    ]}
    tics={[0.6, T.cuna, T.traban]}
  />
);
