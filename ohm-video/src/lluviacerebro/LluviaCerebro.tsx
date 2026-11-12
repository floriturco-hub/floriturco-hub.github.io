import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import {
  Alerta,
  Busca,
  Constante,
  Estudio,
  Gancho,
  Lofi,
  Rosa,
  T,
} from "./Escenas";

export const DURACION_LLUVIACEREBRO_S = duracionShort(T.fin);

// Short de ciencia que invita a buscar "Frecuencia Cero LoFi" en YouTube.
// Música de fondo: nuestra pista lo-fi Rainy Night 1 (lleva lluvia).
export const LluviaCerebro: React.FC = () => (
  <Short
    carpeta="lluviacerebro"
    musica="audio/lluviacerebro/musica.mp3"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: lluvia",
        desde: 0,
        hasta: T.porque,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "Constante",
        desde: T.porque,
        hasta: T.vigilar,
        render: (t0) => <Constante t0={t0} />,
      },
      {
        nombre: "Alerta",
        desde: T.vigilar,
        hasta: T.rosa,
        render: (t0) => <Alerta t0={t0} />,
      },
      {
        nombre: "Ruido rosa",
        desde: T.rosa,
        hasta: T.estudio,
        render: (t0) => <Rosa t0={t0} />,
      },
      {
        nombre: "Estudio 2017",
        desde: T.estudio,
        hasta: T.junta,
        render: (t0) => <Estudio t0={t0} />,
      },
      {
        nombre: "Lo-fi",
        desde: T.junta,
        hasta: T.busca,
        render: (t0) => <Lofi t0={t0} />,
      },
      {
        nombre: "Busca",
        desde: T.busca,
        hasta: T.fin,
        render: (t0) => <Busca t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡La lluvia hackea tu cerebro!", 0, T.porque, C.yellow, 52],
      ["Ruido constante, sin sorpresas", T.constante, T.vigilar, C.white, 42],
      ["Tu cerebro vigila lo repentino", T.golpe, T.rosa, C.red, 42],
      ["La lluvia: ruido rosa", T.rosa, T.manta, C.white],
      ["Una manta de sonido", T.manta, T.estudio, C.yellow],
      ["Más sueño profundo", T.profundo, T.recordaban, C.cyan],
      ["Y mejor memoria", T.recordaban, T.junta, C.cyan],
      ["Lluvia + música lenta = lo-fi", T.lofi, T.busca, C.yellow, 42],
      ["Frecuencia Cero LoFi", T.frase + 1.5, T.fin + 0.5, C.yellow],
    ]}
    tics={[1.0, T.golpe, T.voz, T.puerta, T.manta, T.lofi]}
  />
);
