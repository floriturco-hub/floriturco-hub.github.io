import narracion from "../../guion/nubepesa/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Caida,
  Cierre,
  Corriente,
  Gancho,
  Gotas,
  Lluvia,
  Reparto,
  T,
} from "./Escenas";

export const DURACION_NUBEPESA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const NubePesa: React.FC = () => (
  <Short
    carpeta="nubepesa"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.verano, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.verano, hasta: T.gotas, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Gotas", desde: T.gotas, hasta: T.repartido, render: (t0) => <Gotas t0={t0} /> },
      { nombre: "Reparto", desde: T.repartido, hasta: T.pequena, render: (t0) => <Reparto t0={t0} /> },
      { nombre: "Caida", desde: T.pequena, hasta: T.tibio, render: (t0) => <Caida t0={t0} /> },
      { nombre: "Corriente", desde: T.tibio, hasta: T.chocan, render: (t0) => <Corriente t0={t0} /> },
      { nombre: "Lluvia", desde: T.chocan, hasta: T.asi, render: (t0) => <Lluvia t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Velocidad terminal", T.lentisimo, T.tibio, C.cyan],
    ]}
    tics={[0.6, T.diminutas, T.lluvia2]}
  />
);
