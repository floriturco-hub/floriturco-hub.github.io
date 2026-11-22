import narracion from "../../guion/barbilla/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Cerebro,
  Cierre,
  Gancho,
  Giro,
  Palanca,
  Tronco,
  T,
} from "./Escenas";

export const DURACION_BARBILLA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const GolpeBarbilla: React.FC = () => (
  <Short
    carpeta="barbilla"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.barbilla, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.barbilla, hasta: T.palanca, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Palanca", desde: T.palanca, hasta: T.cerebro, render: (t0) => <Palanca t0={t0} /> },
      { nombre: "Cerebro", desde: T.cerebro, hasta: T.torsion, render: (t0) => <Cerebro t0={t0} /> },
      { nombre: "Tronco cerebral", desde: T.torsion, hasta: T.importa, render: (t0) => <Tronco t0={t0} /> },
      { nombre: "Giro", desde: T.importa, hasta: T.porEso, render: (t0) => <Giro t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Aceleración rotacional", T.girar, T.cerebro, C.cyan],
      ["Sistema reticular activador", T.alerta, T.importa, C.yellow],
    ]}
    tics={[0.7, T.tuerce, T.giro]}
  />
);
