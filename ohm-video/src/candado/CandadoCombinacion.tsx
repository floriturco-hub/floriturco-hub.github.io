import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import {
  Abre,
  Arrastre,
  Cierre,
  Combinacion,
  Dentro,
  Gancho,
  T,
} from "./Escenas";

export const DURACION_CANDADO_S = duracionShort(T.fin);

export const CandadoCombinacion: React.FC = () => (
  <Short
    carpeta="candado"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: tres ruedas",
        desde: 0,
        hasta: T.fuera,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "Por dentro",
        desde: T.fuera,
        hasta: T.dientes,
        render: (t0) => <Dentro t0={t0} />,
      },
      {
        nombre: "Arrastre",
        desde: T.dientes,
        hasta: T.derecha,
        render: (t0) => <Arrastre t0={t0} />,
      },
      {
        nombre: "Combinación",
        desde: T.derecha,
        hasta: T.alineadas,
        render: (t0) => <Combinacion t0={t0} />,
      },
      {
        nombre: "Abre",
        desde: T.alineadas,
        hasta: T.tres,
        render: (t0) => <Abre t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.tres,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡Tu candado esconde 3 ruedas!", 0, T.fuera, C.yellow, 52],
      ["Tres discos con muesca", T.discos, T.dientes, C.white],
      ["Arrastre en cadena", T.medio, T.derecha, C.cyan],
      ["Derecha: el disco lejano", T.primero, T.izquierda, C.orange],
      ["Izquierda: el del medio", T.segundo, T.final, C.yellow],
      ["Derecha: el cercano", T.tercero, T.alineadas, C.cyan],
      ["Muescas alineadas", T.alineadas, T.abre, C.yellow],
      ["¡Se abre!", T.abre, T.tres, C.yellow],
      ["Tres discos, una sola rueda", T.tres, T.fin + 0.5, C.yellow],
    ]}
    tics={[1.0, T.discos, T.primero, T.segundo, T.tercero, T.abre]}
  />
);
