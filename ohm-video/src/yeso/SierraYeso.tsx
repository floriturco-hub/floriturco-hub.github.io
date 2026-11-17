import narracion from "../../guion/yeso/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Calor,
  Cierre,
  Elastica,
  Gancho,
  Rigido,
  Vibra,
  T,
} from "./Escenas";

export const DURACION_YESO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const SierraYeso: React.FC = () => (
  <Short
    carpeta="yeso"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.sierra, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.sierra, hasta: T.truco, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Oscilación", desde: T.truco, hasta: T.rigido, render: (t0) => <Vibra t0={t0} /> },
      { nombre: "Yeso rígido", desde: T.rigido, hasta: T.elastica, render: (t0) => <Rigido t0={t0} /> },
      { nombre: "Piel elástica", desde: T.elastica, hasta: T.friccion, render: (t0) => <Elastica t0={t0} /> },
      { nombre: "Calor", desde: T.friccion, hasta: T.porEso, render: (t0) => <Calor t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Sierra oscilante", T.vibra, T.rigido, C.yellow],
      ["Calor por fricción", T.calienta, T.porEso, C.white],
    ]}
    tics={[0.6, T.vibra, T.cortarla, T.quemar]}
  />
);
