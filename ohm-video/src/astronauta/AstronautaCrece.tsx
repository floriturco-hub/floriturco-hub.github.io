import narracion from "../../guion/astronauta/narracion.json";
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
  Discos,
  Estira,
  Gancho,
  Noche,
  T,
} from "./Escenas";

export const DURACION_ASTRONAUTA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const AstronautaCrece: React.FC = () => (
  <Short
    carpeta="astronauta"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.meses, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.meses, hasta: T.columna, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Discos", desde: T.columna, hasta: T.peso, render: (t0) => <Discos t0={t0} /> },
      { nombre: "Estira", desde: T.peso, hasta: T.volver, render: (t0) => <Estira t0={t0} /> },
      { nombre: "Noche", desde: T.volver, hasta: T.porEso, render: (t0) => <Noche t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Discos intervertebrales", T.discos, T.peso, C.yellow],
    ]}
    tics={[0.6, T.estira, T.manana]}
  />
);
