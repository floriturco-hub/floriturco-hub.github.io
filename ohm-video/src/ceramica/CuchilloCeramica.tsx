import narracion from "../../guion/ceramica/narracion.json";
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
  Consejo,
  Duro,
  Gancho,
  Grieta,
  Metal,
  Oxido,
  T,
} from "./Escenas";

export const DURACION_CERAMICA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CuchilloCeramica: React.FC = () => (
  <Short
    carpeta="ceramica"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.ceramica, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.ceramica, hasta: T.circonio, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Oxido", desde: T.circonio, hasta: T.duro, render: (t0) => <Oxido t0={t0} /> },
      { nombre: "Duro", desde: T.duro, hasta: T.metal, render: (t0) => <Duro t0={t0} /> },
      { nombre: "Metal", desde: T.metal, hasta: T.enlaces, render: (t0) => <Metal t0={t0} /> },
      { nombre: "Grieta", desde: T.enlaces, hasta: T.huesos, render: (t0) => <Grieta t0={t0} /> },
      { nombre: "Consejo", desde: T.huesos, hasta: T.porEso, render: (t0) => <Consejo t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Deformación plástica", T.deslizan, T.enlaces, C.cyan],
      ["Fractura frágil", T.corre, T.huesos, C.yellow],
    ]}
    tics={[0.6, T.parte, T.corre]}
  />
);
