import narracion from "../../guion/naranja/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Balanza,
  Bucle,
  Cierre,
  Culpable,
  Evitar,
  Gancho,
  Receptores,
  T,
} from "./Escenas";

export const DURACION_NARANJA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const JugoNaranja: React.FC = () => (
  <Short
    carpeta="naranja"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.lavas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.lavas, hasta: T.culpable, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Laurilsulfato", desde: T.culpable, hasta: T.primero, render: (t0) => <Culpable t0={t0} /> },
      { nombre: "Receptores", desde: T.primero, hasta: T.dulzor, render: (t0) => <Receptores t0={t0} /> },
      { nombre: "Balanza", desde: T.dulzor, hasta: T.evitarlo, render: (t0) => <Balanza t0={t0} /> },
      { nombre: "Evitarlo", desde: T.evitarlo, hasta: T.porEso, render: (t0) => <Evitar t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Laurilsulfato de sodio (SLS)", T.lauril, T.primero, C.cyan],
      ["Receptores del gusto", T.receptores, T.dulzor, C.white],
    ]}
    tics={[0.7, T.amargo2]}
  />
);
