import narracion from "../../guion/cafeola/narracion.json";
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
  Resonancia,
  Ritmo,
  Truco,
  T,
} from "./Escenas";

export const DURACION_CAFEOLA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CafeDerrama: React.FC = () => (
  <Short
    carpeta="cafeola"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.caminas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.caminas, hasta: T.ritmo, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Ritmo", desde: T.ritmo, hasta: T.empuja, render: (t0) => <Ritmo t0={t0} /> },
      { nombre: "Resonancia", desde: T.empuja, hasta: T.truco, render: (t0) => <Resonancia t0={t0} /> },
      { nombre: "Truco", desde: T.truco, hasta: T.porEso, render: (t0) => <Truco t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Frecuencia natural", T.frecuencia, T.empuja, C.yellow],
      ["Resonancia", T.resonancia, T.truco, C.white],
    ]}
    tics={[0.6, T.resonancia, T.truco]}
  />
);
