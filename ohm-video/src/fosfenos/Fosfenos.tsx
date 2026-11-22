import narracion from "../../guion/fosfenos/narracion.json";
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
  Cuidado,
  Formas,
  Gancho,
  Luz,
  Nombre,
  Retina,
  Senales,
  T,
} from "./Escenas";

export const DURACION_FOSFENOS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const Fosfenos: React.FC = () => (
  <Short
    carpeta="fosfenos"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.frotas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.frotas, hasta: T.llaman, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Fosfenos", desde: T.llaman, hasta: T.presionar, render: (t0) => <Nombre t0={t0} /> },
      { nombre: "Retina", desde: T.presionar, hasta: T.presion, render: (t0) => <Retina t0={t0} /> },
      { nombre: "Señales", desde: T.presion, hasta: T.tu, render: (t0) => <Senales t0={t0} /> },
      { nombre: "Luz", desde: T.tu, hasta: T.formas, render: (t0) => <Luz t0={t0} /> },
      { nombre: "Formas", desde: T.formas, hasta: T.pero, render: (t0) => <Formas t0={t0} /> },
      { nombre: "Cuidado", desde: T.pero, hasta: T.eso, render: (t0) => <Cuidado t0={t0} /> },
      { nombre: "Cierre", desde: T.eso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Fosfenos", T.fosfenos, T.presionar, C.yellow],
      ["Estimulación mecánica de la retina", T.estimula, T.tu, C.white],
      ["Organización de la corteza visual", T.organizadas, T.pero, C.yellow],
    ]}
    tics={[0.6, T.fosfenos, T.luz, T.fuerte]}
  />
);
