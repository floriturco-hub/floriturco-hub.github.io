import narracion from "../../guion/puentehielo/narracion.json";
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
  DosCaras,
  Gancho,
  Senal,
  Suelo,
  T,
} from "./Escenas";

export const DURACION_PUENTEHIELO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const PuenteCongela: React.FC = () => (
  <Short
    carpeta="puentehielo"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.noche, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.noche, hasta: T.carretera2, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Suelo", desde: T.carretera2, hasta: T.abajo, render: (t0) => <Suelo t0={t0} /> },
      { nombre: "DosCaras", desde: T.abajo, hasta: T.cero, render: (t0) => <DosCaras t0={t0} /> },
      { nombre: "Senal", desde: T.cero, hasta: T.porEso, render: (t0) => <Senal t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Pérdida de calor", T.caras, T.cero, C.yellow],
    ]}
    tics={[0.6, T.suelta, T.congelan]}
  />
);
