import narracion from "../../guion/desierto/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Baja,
  Bateria,
  Bucle,
  Cierre,
  Cobija,
  Gancho,
  T,
} from "./Escenas";

export const DURACION_DESIERTO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const DesiertoNoche: React.FC = () => (
  <Short
    carpeta="desierto"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.mediodia, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.mediodia, hasta: T.arena, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Bateria", desde: T.arena, hasta: T.humedo, render: (t0) => <Bateria t0={t0} /> },
      { nombre: "Cobija", desde: T.humedo, hasta: T.desiertos, render: (t0) => <Cobija t0={t0} /> },
      { nombre: "Baja", desde: T.desiertos, hasta: T.porEso, render: (t0) => <Baja t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Calor específico", T.mar, T.humedo, C.yellow],
      ["Radiación al espacio", T.espacio, T.desiertos, C.orange],
    ]}
    tics={[0.6, T.mar, T.espacio]}
  />
);
