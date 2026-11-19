import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import {
  Bobinas,
  Cierre,
  Compara,
  Compuerta,
  Gancho,
  Mide,
  T,
  Tamano,
} from "./Escenas";

export const DURACION_MONEDA_S = duracionShort(T.fin);

export const MonedaFalsa: React.FC = () => (
  <Short
    carpeta="moneda"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: falsa",
        desde: 0,
        hasta: T.metes,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "La mide",
        desde: T.metes,
        hasta: T.tamano,
        render: (t0) => <Mide t0={t0} />,
      },
      {
        nombre: "Tamaño",
        desde: T.tamano,
        hasta: T.pero,
        render: (t0) => <Tamano t0={t0} />,
      },
      {
        nombre: "Bobinas",
        desde: T.pero,
        hasta: T.compara,
        render: (t0) => <Bobinas t0={t0} />,
      },
      {
        nombre: "Compara",
        desde: T.compara,
        hasta: T.coincide,
        render: (t0) => <Compara t0={t0} />,
      },
      {
        nombre: "Compuerta",
        desde: T.coincide,
        hasta: T.examen,
        render: (t0) => <Compuerta t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.examen,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡La máquina sabe que es falsa!", 0, T.metes, C.yellow, 52],
      ["No la mira: la mide", T.mide, T.tamano, C.yellow],
      ["Diámetro y grosor", T.grosor, T.pero, C.white],
      ["Bobinas: campo magnético", T.bobinas, T.remolinos, C.cyan],
      ["Remolinos de corriente", T.remolinos, T.distinto, C.cyan],
      ["Cada metal deja su huella", T.distinto, T.compara, C.yellow],
      ["Compara con la guardada", T.compara, T.iman, C.white],
      ["Antes: un imán", T.iman, T.coincide, C.red],
      ["Pasa o se devuelve", T.compuerta, T.examen, C.white],
      ["Examen de física aprobado", T.examen, T.fin + 0.5, C.yellow],
    ]}
    tics={[1.0, T.mide, T.remolinos, T.hierro, T.compuerta]}
  />
);
