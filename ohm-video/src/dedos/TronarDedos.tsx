import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import {
  Artritis,
  Cavitacion,
  Cierre,
  Espera,
  Gancho,
  Nudillo,
  Resonancia,
  T,
} from "./Escenas";

export const DURACION_DEDOS_S = duracionShort(T.fin);

export const TronarDedos: React.FC = () => (
  <Short
    carpeta="dedos"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: burbuja",
        desde: 0,
        hasta: T.nudillo,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "Nudillo",
        desde: T.nudillo,
        hasta: T.estiras,
        render: (t0) => <Nudillo t0={t0} />,
      },
      {
        nombre: "Cavitación",
        desde: T.estiras,
        hasta: T.quince,
        render: (t0) => <Cavitacion t0={t0} />,
      },
      {
        nombre: "Resonancia",
        desde: T.quince,
        hasta: T.enseguida,
        render: (t0) => <Resonancia t0={t0} />,
      },
      {
        nombre: "Espera",
        desde: T.enseguida,
        hasta: T.artritis,
        render: (t0) => <Espera t0={t0} />,
      },
      {
        nombre: "Artritis",
        desde: T.artritis,
        hasta: T.fisica,
        render: (t0) => <Artritis t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.fisica,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡Ese crac es una burbuja!", 0, T.nudillo, C.yellow, 54],
      ["Líquido con gas disuelto", T.sinovial, T.estiras, C.white],
      ["Cae la presión", T.presion, T.cavidad, C.cyan],
      ["Se forma una burbuja", T.cavidad, T.quince, C.yellow],
      ["Filmado en resonancia", T.resonancia, T.debate, C.white],
      ["Aún hay debate", T.debate, T.enseguida, C.orange],
      ["20 min para recargar", T.veinte, T.artritis, C.yellow],
      ["60 años: sin artritis", T.ninguna, T.fisica, C.cyan],
      ["Es física, no huesos rotos", T.fisica, T.fin + 0.5, C.yellow],
    ]}
    tics={[1.0, T.cavidad, T.quince, T.veinte, T.ninguna]}
  />
);
