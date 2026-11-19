import narracion from "../../guion/reversores/narracion.json";
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
  Compuertas,
  Desliza,
  Desvio,
  Frenos,
  Gancho,
  Reversores,
  T,
} from "./Escenas";

export const DURACION_REVERSORES_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const ReversoresEmpuje: React.FC = () => (
  <Short
    carpeta="reversores"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.avion, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.avion, hasta: T.tocar, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Rejillas", desde: T.tocar, hasta: T.compuertas, render: (t0) => <Desliza t0={t0} /> },
      { nombre: "Compuertas", desde: T.compuertas, hasta: T.ese, render: (t0) => <Compuertas t0={t0} /> },
      { nombre: "Empuje inverso", desde: T.ese, hasta: T.son, render: (t0) => <Desvio t0={t0} /> },
      { nombre: "Reversores", desde: T.son, hasta: T.pero, render: (t0) => <Reversores t0={t0} /> },
      { nombre: "Frenos", desde: T.pero, hasta: T.asi, render: (t0) => <Frenos t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Empuje inverso", T.empuja, T.son, C.yellow],
      ["Frenos + spoilers", T.frenos, T.asi, C.white],
    ]}
    tics={[0.6, T.empuja, T.reversores]}
  />
);
