import narracion from "../../guion/fluxometro/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Abre,
  Bucle,
  Casa,
  Cerrado,
  Cierra,
  Cierre,
  Gancho,
  T,
} from "./Escenas";

export const DURACION_FLUXOMETRO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const Fluxometro: React.FC = () => (
  <Short
    carpeta="fluxometro"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.publicos, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.publicos, hasta: T.diafragma, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Cerrado", desde: T.diafragma, hasta: T.palanca2, render: (t0) => <Cerrado t0={t0} /> },
      { nombre: "Abre", desde: T.palanca2, hasta: T.agujerito2, render: (t0) => <Abre t0={t0} /> },
      { nombre: "Cierra", desde: T.agujerito2, hasta: T.tubos, render: (t0) => <Cierra t0={t0} /> },
      { nombre: "Casa", desde: T.tubos, hasta: T.asi, render: (t0) => <Casa t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Diferencia de presión", T.empuja, T.agujerito2, C.cyan],
    ]}
    tics={[0.6, T.chorro, T.cierra]}
  />
);
