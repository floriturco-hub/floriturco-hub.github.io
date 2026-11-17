import narracion from "../../guion/lecheuht/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bacterias,
  Bucle,
  Calor,
  Cierre,
  Envase,
  Gancho,
  Sellada,
  T,
} from "./Escenas";

export const DURACION_LECHEUHT_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const LecheUht: React.FC = () => (
  <Short
    carpeta="lecheuht"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.leche, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.leche, hasta: T.uht, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "UHT", desde: T.uht, hasta: T.calor, render: (t0) => <Calor t0={t0} /> },
      { nombre: "Esterilización", desde: T.calor, hasta: T.luego, render: (t0) => <Bacterias t0={t0} /> },
      { nombre: "Envase", desde: T.luego, hasta: T.microbios, render: (t0) => <Envase t0={t0} /> },
      { nombre: "Sellada", desde: T.microbios, hasta: T.asi, render: (t0) => <Sellada t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Ultrapasteurización", T.calientan, T.luego, C.red],
      ["Envasado aséptico", T.esteril, T.microbios, C.cyan],
    ]}
    tics={[0.7, T.bacterias, T.aluminio]}
  />
);
