import narracion from "../../guion/cloro/narracion.json";
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
  Color,
  Gancho,
  Rompe,
  Tintes,
  Transparente,
  T,
} from "./Escenas";

export const DURACION_CLORO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CloroManchas: React.FC = () => (
  <Short
    carpeta="cloro"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.echas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.echas, hasta: T.moleculas, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Color", desde: T.moleculas, hasta: T.hipoclorito, render: (t0) => <Color t0={t0} /> },
      { nombre: "Oxidación", desde: T.hipoclorito, hasta: T.pegada, render: (t0) => <Rompe t0={t0} /> },
      { nombre: "Transparente", desde: T.pegada, hasta: T.problema, render: (t0) => <Transparente t0={t0} /> },
      { nombre: "Tintes", desde: T.problema, hasta: T.asi, render: (t0) => <Tintes t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Cromóforos", T.enlaces, T.hipoclorito, C.yellow],
      ["Oxidación", T.oxidante, T.pegada, C.white],
      ["Decoloración", T.tintes, T.asi, C.cyan],
    ]}
    tics={[0.7, T.rompe, T.decolora]}
  />
);
