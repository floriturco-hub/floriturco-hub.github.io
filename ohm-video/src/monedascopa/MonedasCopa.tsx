import narracion from "../../guion/monedascopa/narracion.json";
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
  Domo,
  Gancho,
  Jabon,
  Tension,
  T,
} from "./Escenas";

export const DURACION_MONEDASCOPA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const MonedasCopa: React.FC = () => (
  <Short
    carpeta="monedascopa"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.llenas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.llenas, hasta: T.atraen, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Tension", desde: T.atraen, hasta: T.moneda2, render: (t0) => <Tension t0={t0} /> },
      { nombre: "Domo", desde: T.moneda2, hasta: T.jabon, render: (t0) => <Domo t0={t0} /> },
      { nombre: "Jabon", desde: T.jabon, hasta: T.porEso, render: (t0) => <Jabon t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Tensión superficial", T.tension, T.desborda, C.yellow],
    ]}
    tics={[0.6, T.tension, T.golpe]}
  />
);
