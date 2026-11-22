import narracion from "../../guion/cafebano/narracion.json";
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
  ColonEsc,
  Decaf,
  Gancho,
  Hormonas,
  Personas,
  Reflejo,
  T,
} from "./Escenas";

export const DURACION_CAFEBANO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CafeBano: React.FC = () => (
  <Short
    carpeta="cafebano"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.tomas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.tomas, hasta: T.cafeina, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Reflejo", desde: T.cafeina, hasta: T.estomago, render: (t0) => <Reflejo t0={t0} /> },
      { nombre: "Hormonas", desde: T.estomago, hasta: T.colon, render: (t0) => <Hormonas t0={t0} /> },
      { nombre: "ColonEsc", desde: T.colon, hasta: T.normal, render: (t0) => <ColonEsc t0={t0} /> },
      { nombre: "Decaf", desde: T.normal, hasta: T.todos, render: (t0) => <Decaf t0={t0} /> },
      { nombre: "Personas", desde: T.todos, hasta: T.porEso, render: (t0) => <Personas t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Reflejo gastrocólico", T.reflejo, T.colon, C.yellow],
    ]}
    tics={[0.6, T.hormonas, T.descafeinado2]}
  />
);
