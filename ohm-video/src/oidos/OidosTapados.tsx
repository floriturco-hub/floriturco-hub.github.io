import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import {
  Alberca,
  Camara,
  Cierre,
  Estirado,
  Gancho,
  T,
  Trompa,
  Vuelo,
} from "./Escenas";

export const DURACION_OIDOS_S = duracionShort(T.fin);

export const OidosTapados: React.FC = () => (
  <Short
    carpeta="oidos"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: tímpano",
        desde: 0,
        hasta: T.detras,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "Oído medio",
        desde: T.detras,
        hasta: T.sube,
        render: (t0) => <Camara t0={t0} />,
      },
      {
        nombre: "Avión",
        desde: T.sube,
        hasta: T.alberca,
        render: (t0) => <Vuelo t0={t0} />,
      },
      {
        nombre: "Alberca",
        desde: T.alberca,
        hasta: T.estirado,
        render: (t0) => <Alberca t0={t0} />,
      },
      {
        nombre: "Estirado",
        desde: T.estirado,
        hasta: T.solucion,
        render: (t0) => <Estirado t0={t0} />,
      },
      {
        nombre: "Trompa",
        desde: T.solucion,
        hasta: T.equilibrio,
        render: (t0) => <Trompa t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.equilibrio,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡Tu tímpano se está doblando!", 0, T.detras, C.yellow, 54],
      ["Oído medio: cámara de aire", T.medio, T.iguales, C.white],
      ["Misma presión a cada lado", T.iguales, T.sube, C.cyan],
      ["Al subir: tímpano fuera", T.expande, T.aterrizar, C.yellow],
      ["Al bajar: tímpano dentro", T.dentro, T.doler, C.orange],
      ["Duele más al aterrizar", T.doler, T.alberca, C.red],
      ["2 m de agua: +20 % presión", T.veinte, T.estirado, C.yellow],
      ["Trompa de Eustaquio", T.eustaquio, T.bostezar, C.cyan],
      ["Bostezar la abre", T.bostezar, T.pop, C.yellow],
      ["¡Pop! Presiones iguales", T.pop, T.equilibrio, C.yellow],
      [
        "Tu oído recupera el equilibrio",
        T.equilibrio,
        T.fin + 0.5,
        C.yellow,
        42,
      ],
    ]}
    tics={[1.0, T.expande, T.dentro, T.veinte, T.pop]}
  />
);
