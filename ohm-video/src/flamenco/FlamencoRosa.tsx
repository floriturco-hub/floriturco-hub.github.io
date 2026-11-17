import narracion from "../../guion/flamenco/narracion.json";
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
  Comida,
  Gancho,
  Higado,
  Plumas,
  Polluelos,
  SinPigmento,
  T,
} from "./Escenas";

export const DURACION_FLAMENCO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const FlamencoRosa: React.FC = () => (
  <Short
    carpeta="flamenco"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.flamencos, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.flamencos, hasta: T.comen2, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Dieta", desde: T.comen2, hasta: T.digerirlos, render: (t0) => <Comida t0={t0} /> },
      { nombre: "Hígado", desde: T.digerirlos, hasta: T.llegan, render: (t0) => <Higado t0={t0} /> },
      { nombre: "Plumas", desde: T.llegan, hasta: T.polluelos, render: (t0) => <Plumas t0={t0} /> },
      { nombre: "Polluelos", desde: T.polluelos, hasta: T.sin, render: (t0) => <Polluelos t0={t0} /> },
      { nombre: "Sin pigmento", desde: T.sin, hasta: T.porEso, render: (t0) => <SinPigmento t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Carotenoides", T.carotenoides, T.digerirlos, C.yellow],
      ["Pigmento en las plumas", T.tinen, T.polluelos, C.white],
    ]}
    tics={[0.6, T.carotenoides, T.tinen]}
  />
);
