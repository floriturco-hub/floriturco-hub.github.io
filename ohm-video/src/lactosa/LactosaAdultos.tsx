import narracion from "../../guion/lactosa/narracion.json";
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
  Enzima,
  Fermenta,
  Gancho,
  Mapa,
  Mutacion,
  T,
} from "./Escenas";

export const DURACION_LACTOSA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const LactosaAdultos: React.FC = () => (
  <Short
    carpeta="lactosa"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.bebes, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.bebes, hasta: T.azucar, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Enzima", desde: T.azucar, hasta: T.intestino, render: (t0) => <Enzima t0={t0} /> },
      { nombre: "Fermenta", desde: T.intestino, hasta: T.pueblos, render: (t0) => <Fermenta t0={t0} /> },
      { nombre: "Mutacion", desde: T.pueblos, hasta: T.europa, render: (t0) => <Mutacion t0={t0} /> },
      { nombre: "Mapa", desde: T.europa, hasta: T.porEso, render: (t0) => <Mapa t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Lactasa", T.enzima, T.intestino, C.yellow],
      ["Persistencia de la lactasa", T.mutacion, T.europa, C.orange],
    ]}
    tics={[0.6, T.lactasa, T.gases]}
  />
);
