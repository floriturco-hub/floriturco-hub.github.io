import narracion from "../../guion/rubor/narracion.json";
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
  Darwin,
  Gancho,
  Senal,
  Venas,
  T,
} from "./Escenas";

export const DURACION_RUBOR_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const RuborHumano: React.FC = () => (
  <Short
    carpeta="rubor"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.rojos, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.rojos, hasta: T.avergz, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Venas", desde: T.avergz, hasta: T.evitarlo, render: (t0) => <Venas t0={t0} /> },
      { nombre: "Senal", desde: T.evitarlo, hasta: T.darwin2, render: (t0) => <Senal t0={t0} /> },
      { nombre: "Darwin", desde: T.darwin2, hasta: T.porEso, render: (t0) => <Darwin t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Vasodilatación", T.abren, T.evitarlo, C.orange],
    ]}
    tics={[0.6, T.abren, T.humana]}
  />
);
