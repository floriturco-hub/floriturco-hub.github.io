import narracion from "../../guion/huesosbebe/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Cadera,
  Cierre,
  Clavicula,
  CraneoEsc,
  Fusion,
  Gancho,
  Largos,
  T,
} from "./Escenas";

export const DURACION_HUESOSBEBE_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const HuesosBebe: React.FC = () => (
  <Short
    carpeta="huesosbebe"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.bebe, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.bebe, hasta: T.pierden, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Fusion", desde: T.pierden, hasta: T.craneo, render: (t0) => <Fusion t0={t0} /> },
      { nombre: "CraneoEsc", desde: T.craneo, hasta: T.cadera, render: (t0) => <CraneoEsc t0={t0} /> },
      { nombre: "Cadera", desde: T.cadera, hasta: T.largos, render: (t0) => <Cadera t0={t0} /> },
      { nombre: "Largos", desde: T.largos, hasta: T.clavicula, render: (t0) => <Largos t0={t0} /> },
      { nombre: "Clavicula", desde: T.clavicula, hasta: T.ahi, render: (t0) => <Clavicula t0={t0} /> },
      { nombre: "Cierre", desde: T.ahi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Osificación", T.vuelve, T.craneo, C.white],
      ["Placa epifisaria", T.crecimiento, T.clavicula, C.cyan],
    ]}
    tics={[0.6, T.fusionan, T.clavicula]}
  />
);
