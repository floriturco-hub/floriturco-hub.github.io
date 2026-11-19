import narracion from "../../guion/aire/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Cabeza,
  Calor,
  Cierre,
  Gancho,
  Hierve,
  Liquido,
  Vapor,
  T,
} from "./Escenas";

export const DURACION_AIRE_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const LataAire: React.FC = () => (
  <Short
    carpeta="aire"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.dices, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.dices, hasta: T.adentro, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Líquido", desde: T.adentro, hasta: T.encima, render: (t0) => <Liquido t0={t0} /> },
      { nombre: "Vapor", desde: T.encima, hasta: T.entonces, render: (t0) => <Vapor t0={t0} /> },
      { nombre: "Hierve", desde: T.entonces, hasta: T.pero, render: (t0) => <Hierve t0={t0} /> },
      { nombre: "Calor", desde: T.pero, hasta: T.si, render: (t0) => <Calor t0={t0} /> },
      { nombre: "De cabeza", desde: T.si, hasta: T.porEso, render: (t0) => <Cabeza t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Gas licuado", T.liquido, T.encima, C.cyan],
      ["Ebullición", T.hierve, T.pero, C.white],
      ["Enfriamiento por evaporación", T.calor, T.si, C.cyan],
    ]}
    tics={[0.7, T.disparado, T.enfria, T.congela]}
  />
);
