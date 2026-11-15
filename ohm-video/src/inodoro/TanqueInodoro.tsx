import narracion from "../../guion/inodoro/narracion.json";
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
  Cierre,
  Dentro,
  Descarga,
  Falla,
  Gancho,
  Llena,
  T,
} from "./Escenas";

export const DURACION_INODORO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const TanqueInodoro: React.FC = () => (
  <Short
    carpeta="inodoro"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.se, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.se, hasta: T.dentro, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Piezas", desde: T.dentro, hasta: T.cuando, render: (t0) => <Dentro t0={t0} /> },
      { nombre: "Descarga", desde: T.cuando, hasta: T.alBajar, render: (t0) => <Descarga t0={t0} /> },
      { nombre: "Abre", desde: T.alBajar, hasta: T.llena, render: (t0) => <Abre t0={t0} /> },
      { nombre: "Llena", desde: T.llena, hasta: T.si, render: (t0) => <Llena t0={t0} /> },
      { nombre: "Falla", desde: T.si, hasta: T.porEso, render: (t0) => <Falla t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Válvula de flotador", T.valvula, T.cuando, C.white],
      ["Sin electricidad", T.simple, T.si, C.yellow],
      ["Seguridad: rebose", T.rebose, T.porEso, C.cyan],
    ]}
    tics={[0.52, T.tapon, T.abre, T.cierra, T.empuja, T.rebose]}
  />
);
