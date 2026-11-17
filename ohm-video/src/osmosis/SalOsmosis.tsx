import narracion from "../../guion/osmosis/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Carne,
  CelulasEsc,
  Cierre,
  Gancho,
  Osmosis,
  T,
} from "./Escenas";

export const DURACION_OSMOSIS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const SalOsmosis: React.FC = () => (
  <Short
    carpeta="osmosis"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.echas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.echas, hasta: T.celulas, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Células", desde: T.celulas, hasta: T.moverse, render: (t0) => <CelulasEsc t0={t0} /> },
      { nombre: "Ósmosis", desde: T.moverse, hasta: T.carne, render: (t0) => <Osmosis t0={t0} /> },
      { nombre: "Carne", desde: T.carne, hasta: T.porEso, render: (t0) => <Carne t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Ósmosis", T.osmosis, T.carne, C.yellow],
      ["Salado en seco", T.salmuera, T.porEso, C.white],
    ]}
    tics={[0.6, T.osmosis, T.sazona]}
  />
);
