import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import {
  Cierre,
  Corazon,
  Ejercicio,
  Flota,
  Gancho,
  Perdida,
  T,
  Tierra,
  Vuelta,
} from "./Escenas";

export const DURACION_ASTRO_S = duracionShort(T.fin);

export const MusculosEspacio: React.FC = () => (
  <Short
    carpeta="astronautas"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: músculos",
        desde: 0,
        hasta: T.tierra,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "En la Tierra",
        desde: T.tierra,
        hasta: T.estacion,
        render: (t0) => <Tierra t0={t0} />,
      },
      {
        nombre: "Flotar",
        desde: T.estacion,
        hasta: T.misiones,
        render: (t0) => <Flota t0={t0} />,
      },
      {
        nombre: "Pérdida",
        desde: T.misiones,
        hasta: T.corazon,
        render: (t0) => <Perdida t0={t0} />,
      },
      {
        nombre: "Corazón",
        desde: T.corazon,
        hasta: T.solucion,
        render: (t0) => <Corazon t0={t0} />,
      },
      {
        nombre: "Ejercicio",
        desde: T.solucion,
        hasta: T.volver,
        render: (t0) => <Ejercicio t0={t0} />,
      },
      {
        nombre: "Vuelta",
        desde: T.volver,
        hasta: T.gravedad2,
        render: (t0) => <Vuelta t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.gravedad2,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡El espacio se come tus músculos!", 0, T.tierra, C.yellow, 48],
      ["Cada paso es un entrenamiento", T.paso, T.estacion, C.white, 42],
      ["Sin gravedad, no trabajan", T.dejan, T.misiones, C.cyan],
      ["Hasta -20 % de músculo", T.veinte, T.huesos, C.orange],
      ["Huesos: -1 % al mes", T.uno, T.corazon, C.white],
      ["Hasta el corazón se encoge", T.encoge, T.solucion, C.red],
      ["2 horas de ejercicio al día", T.horas, T.cinta, C.yellow],
      ["Arneses en la cinta", T.arneses, T.volver, C.cyan],
      ["Al volver, cuesta caminar", T.caminar, T.gravedad2, C.white],
      [
        "Gravedad: entrenador invisible",
        T.gravedad2,
        T.fin + 0.5,
        C.yellow,
        42,
      ],
    ]}
    tics={[1.0, T.dejan, T.veinte, T.encoge, T.kilos, T.caminar]}
  />
);
