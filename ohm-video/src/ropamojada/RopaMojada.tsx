import narracion from "../../guion/ropamojada/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Calor,
  Cierre,
  Cuarto,
  Gancho,
  Litro,
  Molecula,
  Sudor,
  T,
} from "./Escenas";

export const DURACION_ROPAMOJADA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const RopaMojada: React.FC = () => (
  <Short
    carpeta="ropamojada"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.cuelgas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.cuelgas, hasta: T.evaporarse, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Evaporación", desde: T.evaporarse, hasta: T.toma, render: (t0) => <Molecula t0={t0} /> },
      { nombre: "Calor", desde: T.toma, hasta: T.seca, render: (t0) => <Calor t0={t0} /> },
      { nombre: "Cuarto", desde: T.seca, hasta: T.sudor, render: (t0) => <Cuarto t0={t0} /> },
      { nombre: "Sudor", desde: T.sudor, hasta: T.litro, render: (t0) => <Sudor t0={t0} /> },
      { nombre: "Un litro", desde: T.litro, hasta: T.porEso, render: (t0) => <Litro t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Calor latente de evaporación", T.toma, T.seca, C.yellow],
      ["Enfriamiento por evaporación", T.enfria, T.litro, C.white],
    ]}
    tics={[0.6, T.seiscientos]}
  />
);
