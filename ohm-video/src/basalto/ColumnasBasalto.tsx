import narracion from "../../guion/basalto/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Angulos,
  Avanza,
  Bucle,
  Cierre,
  Cocina,
  Gancho,
  Grieta,
  T,
} from "./Escenas";

export const DURACION_BASALTO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const ColumnasBasalto: React.FC = () => (
  <Short
    carpeta="basalto"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.calzada, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.calzada, hasta: T.lava, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Grieta", desde: T.lava, hasta: T.angulos, render: (t0) => <Grieta t0={t0} /> },
      { nombre: "Angulos", desde: T.angulos, hasta: T.frio, render: (t0) => <Angulos t0={t0} /> },
      { nombre: "Avanza", desde: T.frio, hasta: T.fecula, render: (t0) => <Avanza t0={t0} /> },
      { nombre: "Cocina", desde: T.fecula, hasta: T.nadie, render: (t0) => <Cocina t0={t0} /> },
      { nombre: "Cierre", desde: T.nadie, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Disyunción columnar", T.forman, T.fecula, C.yellow],
    ]}
    tics={[0.6, T.agrieta, T.hexagonos]}
  />
);
