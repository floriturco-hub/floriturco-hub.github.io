import narracion from "../../guion/lagrimas/narracion.json";
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
  Drenaje,
  Gancho,
  Llanto,
  Nariz,
  Puntos,
  T,
} from "./Escenas";

export const DURACION_LAGRIMAS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const LlorarNariz: React.FC = () => (
  <Short
    carpeta="lagrimas"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.tristeza, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.tristeza, hasta: T.esquina, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Puntos lagrimales", desde: T.esquina, hasta: T.normalmente, render: (t0) => <Puntos t0={t0} /> },
      { nombre: "Drenaje", desde: T.normalmente, hasta: T.cuando, render: (t0) => <Drenaje t0={t0} /> },
      { nombre: "Llanto", desde: T.cuando, hasta: T.llega, render: (t0) => <Llanto t0={t0} /> },
      { nombre: "Nariz", desde: T.llega, hasta: T.porEso, render: (t0) => <Nariz t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Puntos lagrimales", T.puntos, T.normalmente, C.yellow],
      ["Conducto nasolagrimal", T.tubito, T.llega, C.cyan],
    ]}
    tics={[0.7, T.muchas, T.lagrima]}
  />
);
