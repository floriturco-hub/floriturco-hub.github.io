import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import {
  Cierre,
  Desodorante,
  Gancho,
  Noche,
  Olor,
  T,
  Tapon,
  Temporal,
} from "./Escenas";

export const DURACION_ANTI_S = duracionShort(T.fin);

export const Antitranspirante: React.FC = () => (
  <Short
    carpeta="antitranspirante"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: tapones",
        desde: 0,
        hasta: T.huele,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "Olor",
        desde: T.huele,
        hasta: T.desodorante,
        render: (t0) => <Olor t0={t0} />,
      },
      {
        nombre: "Desodorante",
        desde: T.desodorante,
        hasta: T.anti,
        render: (t0) => <Desodorante t0={t0} />,
      },
      {
        nombre: "Tapón",
        desde: T.anti,
        hasta: T.permanente,
        render: (t0) => <Tapon t0={t0} />,
      },
      {
        nombre: "Temporal",
        desde: T.permanente,
        hasta: T.noche,
        render: (t0) => <Temporal t0={t0} />,
      },
      {
        nombre: "Noche",
        desde: T.noche,
        hasta: T.final,
        render: (t0) => <Noche t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.final,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡Le pones tapones a tu sudor!", 0, T.huele, C.yellow, 52],
      ["El sudor casi no huele", T.huele, T.bacterias, C.white],
      ["El olor: las bacterias", T.apestosos, T.desodorante, C.yellow],
      ["Desodorante: tapa el olor", T.perfume, T.anti, C.white],
      ["Sales de aluminio", T.aluminio, T.tapon, C.white],
      ["Un tapón de gel", T.tapon, T.permanente, C.yellow],
      ["Dura unos días", T.renueva, T.noche, C.white],
      ["Mejor de noche", T.noche, T.final, C.cyan],
      ["Antitranspirante: cierra la llave", T.llave, T.fin + 0.5, C.yellow, 40],
    ]}
    tics={[1.0, T.apestosos, T.tapon, T.noche, T.llave]}
  />
);
