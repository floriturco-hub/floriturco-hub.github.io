import narracion from "../../guion/queso/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Anejado,
  Bucle,
  Cerebro,
  Cierre,
  Derrite,
  Gancho,
  RedEsc,
  T,
} from "./Escenas";

export const DURACION_QUESO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const QuesoDerretido: React.FC = () => (
  <Short
    carpeta="queso"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.estirarse, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.estirarse, hasta: T.red, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Caseínas", desde: T.red, hasta: T.calentarse, render: (t0) => <RedEsc t0={t0} /> },
      { nombre: "Hilos", desde: T.calentarse, hasta: T.cerebro, render: (t0) => <Derrite t0={t0} /> },
      { nombre: "Cerebro", desde: T.cerebro, hasta: T.anejado, render: (t0) => <Cerebro t0={t0} /> },
      { nombre: "Añejado", desde: T.anejado, hasta: T.porEso, render: (t0) => <Anejado t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Red de caseínas", T.caseinas, T.calentarse, C.yellow],
      ["Proteínas rotas", T.rotas, T.porEso, C.white],
    ]}
    tics={[0.6, T.hilos, T.rotas]}
  />
);
