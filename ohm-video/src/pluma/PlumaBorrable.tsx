import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import {
  Auto,
  Calor,
  Capsulas,
  Cierre,
  Congelador,
  Gancho,
  Normal,
  T,
} from "./Escenas";

export const DURACION_PLUMA_S = duracionShort(T.fin);

export const PlumaBorrable: React.FC = () => (
  <Short
    carpeta="pluma"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: tarea",
        desde: 0,
        hasta: T.invisible,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "Cápsulas",
        desde: T.invisible,
        hasta: T.normal,
        render: (t0) => <Capsulas t0={t0} />,
      },
      {
        nombre: "Normal",
        desde: T.normal,
        hasta: T.frotar,
        render: (t0) => <Normal t0={t0} />,
      },
      {
        nombre: "Calor",
        desde: T.frotar,
        hasta: T.auto,
        render: (t0) => <Calor t0={t0} />,
      },
      {
        nombre: "Auto",
        desde: T.auto,
        hasta: T.revertir,
        render: (t0) => <Auto t0={t0} />,
      },
      {
        nombre: "Congelador",
        desde: T.revertir,
        hasta: T.escondio,
        render: (t0) => <Congelador t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.escondio,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡Tu tarea desaparece con calor!", 0, T.invisible, C.yellow, 50],
      ["Tinta en microcápsulas", T.capsulas, T.tres, C.white],
      ["Tres ingredientes", T.tres, T.normal, C.white],
      ["Unidos: se ve el color", T.normal, T.frotar, C.cyan],
      ["La goma calienta: 60 °C", T.sesenta, T.transparente, C.orange],
      ["El colorante, transparente", T.transparente, T.auto, C.white],
      ["Auto al sol: se borra", T.sola, T.revertir, C.red],
      ["Congelador: vuelve", T.vuelve, T.escondio, C.cyan],
      ["No se fue: se escondió", T.escondio, T.fin + 0.5, C.yellow],
    ]}
    tics={[1.0, T.capsulas, T.sesenta, T.sola, T.vuelve]}
  />
);
