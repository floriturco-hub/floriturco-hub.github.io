import narracion from "../../guion/parabrisas/narracion.json";
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
  Escobilla,
  Gancho,
  Gota,
  Rebota,
  Sensor,
  T,
} from "./Escenas";

export const DURACION_PARABRISAS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const Limpiaparabrisas: React.FC = () => (
  <Short
    carpeta="parabrisas"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.cae, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.cae, hasta: T.detras, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Sensor", desde: T.detras, hasta: T.con, render: (t0) => <Sensor t0={t0} /> },
      { nombre: "Rebota", desde: T.con, hasta: T.pero, render: (t0) => <Rebota t0={t0} /> },
      { nombre: "Gota", desde: T.pero, hasta: T.escobilla, render: (t0) => <Gota t0={t0} /> },
      { nombre: "Escobilla", desde: T.escobilla, hasta: T.asi, render: (t0) => <Escobilla t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Reflexión total interna", T.rebota, T.pero, C.cyan],
      ["Sensor de lluvia", T.menos, T.escobilla, C.white],
      ["Dureza: goma < vidrio", T.blanda, T.arena, C.cyan],
    ]}
    tics={[0.7, T.llueve, T.arena]}
  />
);
