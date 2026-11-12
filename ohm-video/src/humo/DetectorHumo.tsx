import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import {
  Americio,
  Cierre,
  Gancho,
  Humo,
  Ionizacion,
  Otros,
  Seguro,
  T,
} from "./Escenas";

export const DURACION_HUMO_S = duracionShort(T.fin);

export const DetectorHumo: React.FC = () => (
  <Short
    carpeta="humo"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: radiactivo",
        desde: 0,
        hasta: T.muchos,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "Americio",
        desde: T.muchos,
        hasta: T.alfa,
        render: (t0) => <Americio t0={t0} />,
      },
      {
        nombre: "Ionización",
        desde: T.alfa,
        hasta: T.tostada,
        render: (t0) => <Ionizacion t0={t0} />,
      },
      {
        nombre: "Humo",
        desde: T.tostada,
        hasta: T.peligroso,
        render: (t0) => <Humo t0={t0} />,
      },
      {
        nombre: "Seguro",
        desde: T.peligroso,
        hasta: T.otros,
        render: (t0) => <Seguro t0={t0} />,
      },
      {
        nombre: "Otros",
        desde: T.otros,
        hasta: T.sueno,
        render: (t0) => <Otros t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.sueno,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡Hay algo radiactivo en tu techo!", 0, T.muchos, C.yellow, 48],
      ["Americio-241", T.americio, T.millonesima, C.yellow],
      ["Una pizca mínima", T.millonesima, T.alfa, C.white],
      ["Partículas alfa", T.alfa, T.iones, C.yellow],
      ["El aire se llena de iones", T.iones, T.corriente, C.cyan],
      ["Corriente constante", T.corriente, T.tostada, C.cyan],
      ["El humo atrapa los iones", T.pegan, T.cae, C.white],
      ["Cae la corriente: ¡alarma!", T.cae, T.peligroso, C.red],
      ["Un papel frena las alfa", T.papel, T.otros, C.yellow],
      ["Otros usan luz", T.luz, T.vidas, C.white],
      ["La radiación vigila tu sueño", T.sueno, T.fin + 0.5, C.yellow],
    ]}
    tics={[1.0, T.americio, T.iones, T.alarma, T.papel]}
  />
);
