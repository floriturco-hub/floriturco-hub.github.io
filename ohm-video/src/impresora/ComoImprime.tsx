import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import {
  Burbuja,
  Cabezal,
  Cierre,
  Gancho,
  Laser,
  Puntos,
  T,
  Toner,
} from "./Escenas";

export const DURACION_IMPRESORA_S = duracionShort(T.fin);

export const ComoImprime: React.FC = () => (
  <Short
    carpeta="impresora"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: hierve tinta",
        desde: 0,
        hasta: T.inyeccion,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "Cabezal",
        desde: T.inyeccion,
        hasta: T.calienta,
        render: (t0) => <Cabezal t0={t0} />,
      },
      {
        nombre: "Burbuja",
        desde: T.calienta,
        hasta: T.cuatro,
        render: (t0) => <Burbuja t0={t0} />,
      },
      {
        nombre: "Puntos CMYK",
        desde: T.cuatro,
        hasta: T.laser,
        render: (t0) => <Puntos t0={t0} />,
      },
      {
        nombre: "Láser",
        desde: T.laser,
        hasta: T.toner,
        render: (t0) => <Laser t0={t0} />,
      },
      {
        nombre: "Tóner",
        desde: T.toner,
        hasta: T.una,
        render: (t0) => <Toner t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.una,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡Tu impresora hierve tinta!", 0, T.inyeccion, C.yellow, 54],
      ["Miles de boquillas", T.agujeros, T.resistencia, C.white],
      ["300 °C en microsegundos", T.trescientos, T.burbuja, C.red],
      ["Una burbuja dispara la gota", T.burbuja, T.cuatro, C.cyan],
      ["Solo 4 tintas: CMYK", T.cuatro, T.puntitos, C.white],
      ["Puntos que tu ojo mezcla", T.mezcla, T.laser, C.yellow],
      ["Láser: electricidad estática", T.estatica, T.toner, C.cyan],
      ["El tóner se pega a las letras", T.pega, T.rodillo, C.white],
      ["Rodillo a 200 °C", T.doscientos, T.una, C.orange],
      ["Tinta hervida o luz y estática", T.una, T.fin + 0.5, C.yellow, 42],
    ]}
    tics={[1.0, T.hierve, T.cian, T.borra, T.doscientos, T.otra]}
  />
);
