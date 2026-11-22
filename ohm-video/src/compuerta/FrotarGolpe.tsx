import narracion from "../../guion/compuerta/narracion.json";
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
  Compuerta,
  Frotar,
  Gancho,
  Nervios,
  Real,
  T,
} from "./Escenas";

export const DURACION_COMPUERTA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const FrotarGolpe: React.FC = () => (
  <Short
    carpeta="compuerta"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.te, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.te, hasta: T.el, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Nervios", desde: T.el, hasta: T.los, render: (t0) => <Nervios t0={t0} /> },
      { nombre: "Médula", desde: T.los, hasta: T.cuando, render: (t0) => <Compuerta t0={t0} /> },
      { nombre: "Frotar", desde: T.cuando, hasta: T.no, render: (t0) => <Frotar t0={t0} /> },
      { nombre: "Filtro real", desde: T.no, hasta: T.porEso, render: (t0) => <Real t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Teoría de la compuerta", T.compuerta, T.cuando, C.yellow],
      ["Menos dolor", T.sube, T.no, C.white],
      ["TENS", T.aparatos + 1, T.porEso, C.cyan],
    ]}
    tics={[0.3, T.gruesos, T.compuerta, T.cierran, T.filtro, T.corrientes]}
  />
);
