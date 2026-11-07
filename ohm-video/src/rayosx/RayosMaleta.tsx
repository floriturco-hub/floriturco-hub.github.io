import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import {
  Atraviesan,
  Cierre,
  Colores,
  Energias,
  Gancho,
  Negro,
  Pantalla,
  T,
} from "./Escenas";

export const DURACION_RAYOSX_S = duracionShort(T.fin);

export const RayosMaleta: React.FC = () => (
  <Short
    carpeta="rayosx"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: maleta",
        desde: 0,
        hasta: T.pantalla,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "Pantalla",
        desde: T.pantalla,
        hasta: T.atraviesan,
        render: (t0) => <Pantalla t0={t0} />,
      },
      {
        nombre: "Atraviesan",
        desde: T.atraviesan,
        hasta: T.energias,
        render: (t0) => <Atraviesan t0={t0} />,
      },
      {
        nombre: "Dos energías",
        desde: T.energias,
        hasta: T.color,
        render: (t0) => <Energias t0={t0} />,
      },
      {
        nombre: "Colores",
        desde: T.color,
        hasta: T.negro,
        render: (t0) => <Colores t0={t0} />,
      },
      {
        nombre: "Negro",
        desde: T.negro,
        hasta: T.traducida,
        render: (t0) => <Negro t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.traducida,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡Tu maleta no tiene secretos!", 0, T.pantalla, C.yellow, 52],
      ["Los rayos X no tienen color", T.sincolor, T.atraviesan, C.white],
      ["Más denso, más oscuro", T.oscuro, T.energias, C.white],
      ["Dos energías a la vez", T.energias, T.comparando, C.cyan],
      ["Así sabe qué átomos hay", T.atomos, T.color, C.yellow],
      ["Naranja: orgánico", T.naranja, T.verde, C.orange],
      ["Verde: intermedio", T.verde, T.azul, C.white],
      ["Azul: metal", T.azul, T.negro, C.cyan],
      ["Negro: revisión a mano", T.negro, T.traducida, C.red],
      [
        "Tu maleta, traducida a colores",
        T.traducida,
        T.fin + 0.5,
        C.yellow,
        42,
      ],
    ]}
    tics={[1.0, T.oscuro, T.energias, T.naranja, T.verde, T.azul, T.mano]}
  />
);
