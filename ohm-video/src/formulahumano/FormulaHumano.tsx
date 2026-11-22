import narracion from "../../guion/formulahumano/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Atomos,
  Bucle,
  Cierre,
  Cobalto,
  Formula,
  Gancho,
  Peso,
  T,
} from "./Escenas";

export const DURACION_FORMULA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const FormulaHumano: React.FC = () => (
  <Short
    carpeta="formulahumano"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.escribir, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.escribir, hasta: T.peso, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Peso", desde: T.peso, hasta: T.contando, render: (t0) => <Peso t0={t0} /> },
      { nombre: "Atomos", desde: T.contando, hasta: T.cientificos, render: (t0) => <Atomos t0={t0} /> },
      { nombre: "Formula", desde: T.cientificos, hasta: T.cobalto, render: (t0) => <Formula t0={t0} /> },
      { nombre: "Cobalto", desde: T.cobalto, hasta: T.esa, render: (t0) => <Cobalto t0={t0} /> },
      { nombre: "Cierre", desde: T.esa, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Fórmula empírica", T.proporcion, T.molecula, C.yellow],
    ]}
    tics={[0.6, T.gana, T.cobalto]}
  />
);
