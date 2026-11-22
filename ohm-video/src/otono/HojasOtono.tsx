import narracion from "../../guion/otono/narracion.json";
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
  Gancho,
  Pigmentos,
  Revela,
  Rojo,
  T,
} from "./Escenas";

export const DURACION_OTONO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const HojasOtono: React.FC = () => (
  <Short
    carpeta="otono"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.otono, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.otono, hasta: T.clorofila, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Pigmentos", desde: T.clorofila, hasta: T.acortan, render: (t0) => <Pigmentos t0={t0} /> },
      { nombre: "Revela", desde: T.acortan, hasta: T.rojo2, render: (t0) => <Revela t0={t0} /> },
      { nombre: "Rojo", desde: T.rojo2, hasta: T.ahi, render: (t0) => <Rojo t0={t0} /> },
      { nombre: "Cierre", desde: T.ahi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Carotenoides", T.carotenoides, T.acortan, C.yellow],
      ["Antocianinas", T.antocianinas, T.ahi, C.orange],
    ]}
    tics={[0.6, T.carotenoides, T.antocianinas]}
  />
);
