import narracion from "../../guion/nerf/narracion.json";
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
  Endereza,
  Gancho,
  Peso,
  Suave,
  T,
} from "./Escenas";

export const DURACION_NERF_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const DardoNerf: React.FC = () => (
  <Short
    carpeta="nerf"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.dardo, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.dardo, hasta: T.esSuave, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Suave", desde: T.esSuave, hasta: T.pero, render: (t0) => <Suave t0={t0} /> },
      { nombre: "Peso", desde: T.pero, hasta: T.si, render: (t0) => <Peso t0={t0} /> },
      { nombre: "Estabilidad", desde: T.si, hasta: T.porEso, render: (t0) => <Endereza t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Centro de gravedad adelante", T.adelante, T.si, C.yellow],
      ["Estabilidad aerodinámica", T.endereza, T.porEso, C.white],
    ]}
    tics={[0.6, T.adelante]}
  />
);
