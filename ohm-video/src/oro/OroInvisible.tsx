import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import {
  Carbon,
  Cianuro,
  Cierre,
  Gancho,
  Microscopico,
  Molienda,
  T,
  Toxico,
} from "./Escenas";

export const DURACION_ORO_S = duracionShort(T.fin);

export const OroInvisible: React.FC = () => (
  <Short
    carpeta="oro"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: anillo",
        desde: 0,
        hasta: T.pepitas,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "Microscópico",
        desde: T.pepitas,
        hasta: T.sacan,
        render: (t0) => <Microscopico t0={t0} />,
      },
      {
        nombre: "Molienda",
        desde: T.sacan,
        hasta: T.agua,
        render: (t0) => <Molienda t0={t0} />,
      },
      {
        nombre: "Cianuro",
        desde: T.agua,
        hasta: T.carbon,
        render: (t0) => <Cianuro t0={t0} />,
      },
      {
        nombre: "Carbón",
        desde: T.carbon,
        hasta: T.toxico,
        render: (t0) => <Carbon t0={t0} />,
      },
      {
        nombre: "Tóxico",
        desde: T.toxico,
        hasta: T.brillo,
        render: (t0) => <Toxico t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.brillo,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡Toneladas de roca por un anillo!", 0, T.pepitas, C.yellow, 48],
      ["Oro microscópico", T.micro, T.gramos, C.yellow],
      ["Unos gramos por tonelada", T.gramos, T.sacan, C.white],
      ["Molido como harina", T.harina, T.agua, C.white],
      ["El cianuro disuelve el oro", T.disuelve, T.carbon, C.yellow],
      ["Carbón: esponja de oro", T.poros, T.lavan, C.yellow],
      ["Fundido a 1064 °C", T.mil, T.toxico, C.orange],
      ["Cianuro: muy tóxico", T.toxico, T.brillo, C.red],
      ["De roca gris a oro", T.brillo, T.fin + 0.5, C.yellow],
    ]}
    tics={[1.0, T.micro, T.harina, T.disuelve, T.lingote, T.toxico]}
  />
);
