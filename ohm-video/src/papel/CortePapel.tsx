import narracion from "../../guion/papel/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Borde,
  Bucle,
  Cierre,
  Expuesta,
  Gancho,
  Superficial,
  Yemas,
  T,
} from "./Escenas";

export const DURACION_PAPEL_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CortePapel: React.FC = () => (
  <Short
    carpeta="papel"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.hoja, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.hoja, hasta: T.yemas, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Yemas", desde: T.yemas, hasta: T.borde, render: (t0) => <Yemas t0={t0} /> },
      { nombre: "Borde", desde: T.borde, hasta: T.superficial, render: (t0) => <Borde t0={t0} /> },
      { nombre: "Superficial", desde: T.superficial, hasta: T.expuestas, render: (t0) => <Superficial t0={t0} /> },
      { nombre: "Expuesta", desde: T.expuestas, hasta: T.porEso, render: (t0) => <Expuesta t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Nociceptores", T.terminaciones, T.borde, C.yellow],
      ["Corte superficial", T.superficial, T.porEso, C.red],
    ]}
    tics={[0.7, T.desgarra, T.abre]}
  />
);
