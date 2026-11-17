import narracion from "../../guion/ampolla/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Capas,
  Cierre,
  Drenar,
  Gancho,
  Liquido,
  Revienta,
  Vendaje,
  T,
} from "./Escenas";

export const DURACION_AMPOLLA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const Ampollas: React.FC = () => (
  <Short
    carpeta="ampolla"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.zapatos, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.zapatos, hasta: T.piel, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Capas", desde: T.piel, hasta: T.hueco, render: (t0) => <Capas t0={t0} /> },
      { nombre: "Líquido", desde: T.hueco, hasta: T.vendaje, render: (t0) => <Liquido t0={t0} /> },
      { nombre: "Vendaje", desde: T.vendaje, hasta: T.revientas, render: (t0) => <Vendaje t0={t0} /> },
      { nombre: "Reventar", desde: T.revientas, hasta: T.grande, render: (t0) => <Revienta t0={t0} /> },
      { nombre: "Drenar", desde: T.grande, hasta: T.porEso, render: (t0) => <Drenar t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Ampolla por fricción", T.separan, T.vendaje, C.yellow],
      ["Drenaje estéril", T.aguja, T.porEso, C.white],
    ]}
    tics={[0.6, T.vendaje, T.revientas]}
  />
);
