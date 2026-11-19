import narracion from "../../guion/catalizador/narracion.json";
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
  Gancho,
  Gases,
  Oro,
  Panal,
  Reaccion,
  Salida,
  T,
} from "./Escenas";

export const DURACION_CATALIZADOR_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const ConvertidorCatalitico: React.FC = () => (
  <Short
    carpeta="catalizador"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.va, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.va, hasta: T.el, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Gases", desde: T.el, hasta: T.convertidor, render: (t0) => <Gases t0={t0} /> },
      { nombre: "Panal", desde: T.convertidor, hasta: T.al, render: (t0) => <Panal t0={t0} /> },
      { nombre: "Reacción", desde: T.al, hasta: T.asi, render: (t0) => <Reaccion t0={t0} /> },
      { nombre: "Salida", desde: T.asi, hasta: T.y, render: (t0) => <Salida t0={t0} /> },
      { nombre: "Precio", desde: T.y, hasta: T.porEso, render: (t0) => <Oro t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Metales catalizadores", T.metales, T.al, C.white],
      ["Catálisis", T.aceleran, T.asi, C.yellow],
      ["Robo de catalizadores", T.oro, T.porEso, C.red],
    ]}
    tics={[0.72, T.monoxido, T.platino, T.tocan, T.co2 + 0.6, T.gramo]}
  />
);
