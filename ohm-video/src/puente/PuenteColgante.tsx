import narracion from "../../guion/puente/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Anclaje,
  Bucle,
  Cierre,
  Cuelga,
  Gancho,
  Seccion,
  T,
} from "./Escenas";

export const DURACION_PUENTE_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const PuenteColgante: React.FC = () => (
  <Short
    carpeta="puente"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.golden, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.golden, hasta: T.metro, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Cable", desde: T.metro, hasta: T.calzada, render: (t0) => <Seccion t0={t0} /> },
      { nombre: "Tensión", desde: T.calzada, hasta: T.extremo, render: (t0) => <Cuelga t0={t0} /> },
      { nombre: "Anclaje", desde: T.extremo, hasta: T.asi, render: (t0) => <Anclaje t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Redundancia", T.reparten, T.calzada, C.white],
      ["Tracción", T.estirados, T.extremo, C.yellow],
    ]}
    tics={[0.6, T.alambres, T.concreto]}
  />
);
