import narracion from "../../guion/hieloflota/narracion.json";
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
  Encoge,
  Gancho,
  Hexagonos,
  Lago,
  T,
} from "./Escenas";

export const DURACION_HIELOFLOTA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const HieloFlota: React.FC = () => (
  <Short
    carpeta="hieloflota"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.sustancias, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.sustancias, hasta: T.encoge, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Encoge", desde: T.encoge, hasta: T.rara, render: (t0) => <Encoge t0={t0} /> },
      { nombre: "Hexagonos", desde: T.rara, hasta: T.lagos, render: (t0) => <Hexagonos t0={t0} /> },
      { nombre: "Lago", desde: T.lagos, hasta: T.porEso, render: (t0) => <Lago t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Puentes de hidrógeno", T.atraen, T.hexagonos, C.orange],
      ["Densidad", T.espacio, T.lagos, C.yellow],
    ]}
    tics={[0.6, T.hexagonos, T.sobreviven]}
  />
);
