import narracion from "../../guion/hielo/narracion.json";
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
  Friccion,
  Gancho,
  Lubricante,
  Presion,
  Superficie,
  Vidrio,
  T,
} from "./Escenas";

export const DURACION_HIELO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const HieloResbala: React.FC = () => (
  <Short
    carpeta="hielo"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.el, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.el, hasta: T.durante, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Presión", desde: T.durante, hasta: T.hoy, render: (t0) => <Presion t0={t0} /> },
      { nombre: "Superficie", desde: T.hoy, hasta: T.ademas, render: (t0) => <Superficie t0={t0} /> },
      { nombre: "Fricción", desde: T.ademas, hasta: T.esa, render: (t0) => <Friccion t0={t0} /> },
      { nombre: "Lubricante", desde: T.esa, hasta: T.al, render: (t0) => <Lubricante t0={t0} /> },
      { nombre: "Vidrio", desde: T.al, hasta: T.porEso, render: (t0) => <Vidrio t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Teoría antigua: presión", T.presion, T.pero, C.white],
      ["Capa casi líquida", T.liquidas, T.ademas, C.cyan],
      ["Calor por fricción", T.friccion, T.esa, C.yellow],
    ]}
    tics={[0.7, T.pero, T.vecinas, T.derrite, T.lubricante, T.al]}
  />
);
