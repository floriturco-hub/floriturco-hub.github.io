import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import { Caida, Cierre, Gancho, Gel, Grafica, Oxido, T } from "./Escenas";

export const DURACION_PILAS_S = duracionShort(T.fin);

export const PilasRebote: React.FC = () => (
  <Short
    carpeta="pilas"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: rebote",
        desde: 0,
        hasta: T.deja,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "Caída",
        desde: T.deja,
        hasta: T.dentro,
        render: (t0) => <Caida t0={t0} />,
      },
      {
        nombre: "Gel",
        desde: T.dentro,
        hasta: T.usar,
        render: (t0) => <Gel t0={t0} />,
      },
      {
        nombre: "Óxido",
        desde: T.usar,
        hasta: T.princeton,
        render: (t0) => <Oxido t0={t0} />,
      },
      {
        nombre: "Gráfica",
        desde: T.princeton,
        hasta: T.trabajo,
        render: (t0) => <Grafica t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.trabajo,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡Tu pila gastada rebota!", 0, T.deja, C.yellow, 54],
      ["Nueva: se queda quieta", T.tac, T.gastada, C.white],
      ["Gastada: rebota", T.gastada, T.dentro, C.red],
      ["Gel con polvo de zinc", T.gel, T.arena, C.cyan],
      ["Absorbe el golpe", T.arena, T.usar, C.white],
      ["Se forma óxido de zinc", T.oxido, T.amortigua, C.white],
      ["Interior rígido: rebota", T.amortigua, T.princeton, C.red],
      ["Crece hasta la mitad", T.mitad, T.usada, C.yellow],
      ["No mide la carga exacta", T.usada, T.trabajo, C.orange],
      ["Pila que rebota: ya trabajó", T.trabajo, T.fin + 0.5, C.yellow],
    ]}
    tics={[1.0, T.tac, T.oxido, T.mitad, T.trabajo]}
  />
);
