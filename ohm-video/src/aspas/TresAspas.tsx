import narracion from "../../guion/aspas/narracion.json";
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
  Dos,
  Energia,
  Existen,
  Gancho,
  Tres,
  T,
} from "./Escenas";

export const DURACION_ASPAS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const TresAspas: React.FC = () => (
  <Short
    carpeta="aspas"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.aerogeneradores, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.aerogeneradores, hasta: T.energia, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Energia", desde: T.energia, hasta: T.equilibrio, render: (t0) => <Energia t0={t0} /> },
      { nombre: "Dos", desde: T.equilibrio, hasta: T.reparten, render: (t0) => <Dos t0={t0} /> },
      { nombre: "Tres", desde: T.reparten, hasta: T.existen, render: (t0) => <Tres t0={t0} /> },
      { nombre: "Existen", desde: T.existen, hasta: T.porEso, render: (t0) => <Existen t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Límite de Betz", T.aprovecha, T.equilibrio, C.yellow],
      ["Equilibrio del rotor", T.equilibrio, T.reparten, C.white],
    ]}
    tics={[0.6, T.sacude, T.suave]}
  />
);
