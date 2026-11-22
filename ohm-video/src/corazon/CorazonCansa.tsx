import narracion from "../../guion/corazon/narracion.json";
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
  Combustible,
  Descanso,
  Gancho,
  Mitocondrias,
  Piernas,
  T,
} from "./Escenas";

export const DURACION_CORAZON_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CorazonCansa: React.FC = () => (
  <Short
    carpeta="corazon"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.corres, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.corres, hasta: T.esforzarse, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Piernas", desde: T.esforzarse, hasta: T.mitocondrias, render: (t0) => <Piernas t0={t0} /> },
      { nombre: "Mitocondrias", desde: T.mitocondrias, hasta: T.arterias, render: (t0) => <Mitocondrias t0={t0} /> },
      { nombre: "Combustible", desde: T.arterias, hasta: T.latido, render: (t0) => <Combustible t0={t0} /> },
      { nombre: "Descanso", desde: T.latido, hasta: T.porEso, render: (t0) => <Descanso t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Metabolismo anaerobio", T.azucar, T.mitocondrias, C.white],
      ["Diástole", T.relaja, T.porEso, C.yellow],
    ]}
    tics={[0.6, T.mitocondrias, T.relaja]}
  />
);
