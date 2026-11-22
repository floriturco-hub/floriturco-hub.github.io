import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import {
  Cierre,
  Enfriar,
  Fuera,
  Gancho,
  Nevera,
  T,
  Toxinas,
  Zona,
} from "./Escenas";

export const DURACION_NEVERA_S = duracionShort(T.fin);

export const ComidaTibia: React.FC = () => (
  <Short
    carpeta="nevera"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: incubadora",
        desde: 0,
        hasta: T.zona,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "Zona de peligro",
        desde: T.zona,
        hasta: T.peligrosa,
        render: (t0) => <Zona t0={t0} />,
      },
      {
        nombre: "Enfriar",
        desde: T.peligrosa,
        hasta: T.nevera,
        render: (t0) => <Enfriar t0={t0} />,
      },
      {
        nombre: "Nevera",
        desde: T.nevera,
        hasta: T.recalentar,
        render: (t0) => <Nevera t0={t0} />,
      },
      {
        nombre: "Toxinas",
        desde: T.recalentar,
        hasta: T.frio,
        render: (t0) => <Toxinas t0={t0} />,
      },
      {
        nombre: "Fuera del frío",
        desde: T.frio,
        hasta: T.cierre,
        render: (t0) => <Fuera t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.cierre,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡Tu comida tibia es una incubadora!", 0, T.zona, C.yellow, 46],
      ["Peligro: entre 4 y 60 °C", T.entre, T.una, C.red],
      ["1 bacteria: 2 millones en 7 h", T.millones, T.peligrosa, C.yellow, 42],
      ["No esperes a que se enfríe", T.error, T.horas, C.red],
      ["A la nevera antes de 2 h", T.horas, T.nevera, C.cyan],
      ["La nevera solo las frena", T.frena, T.sobras, C.cyan],
      ["Sobras: 3-4 días", T.sobras, T.recalentar, C.white],
      ["Toxinas que resisten el calor", T.toxinas, T.frio, C.orange, 42],
      [
        "Fuera de la nevera: tomate, pan, papa",
        T.tomate,
        T.cierre,
        C.white,
        38,
      ],
      ["Frío frena, calor mata", T.cierre, T.tibio, C.yellow],
      ["Lo tibio, nunca", T.tibio, T.fin + 0.5, C.red],
    ]}
    tics={[1.0, T.entre, T.millones, T.error, T.frena, T.toxinas, T.tibio]}
  />
);
