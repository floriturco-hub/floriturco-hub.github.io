import narracion from "../../guion/detectorco/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  CeldaEsc,
  Chip,
  Cierre,
  Corriente,
  Gancho,
  Humo,
  Reaccion,
  T,
} from "./Escenas";

export const DURACION_DETECTORCO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const DetectorCO: React.FC = () => (
  <Short
    carpeta="detectorco"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.monoxido, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.monoxido, hasta: T.detector, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Celda", desde: T.detector, hasta: T.entra, render: (t0) => <CeldaEsc t0={t0} /> },
      { nombre: "Reacción", desde: T.entra, hasta: T.esos, render: (t0) => <Reaccion t0={t0} /> },
      { nombre: "Corriente", desde: T.esos, hasta: T.chip, render: (t0) => <Corriente t0={t0} /> },
      { nombre: "Alarma", desde: T.chip, hasta: T.humo, render: (t0) => <Chip t0={t0} /> },
      { nombre: "Humo", desde: T.humo, hasta: T.asi, render: (t0) => <Humo t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Celda electroquímica", T.celda, T.entra, C.yellow],
      ["CO → CO₂ + electrones", T.dioxido, T.esos, C.yellow],
    ]}
    tics={[0.6, T.soltando]}
  />
);
