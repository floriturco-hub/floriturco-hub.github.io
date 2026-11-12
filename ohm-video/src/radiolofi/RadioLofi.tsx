import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import {
  Constantes,
  Dormir,
  Estudiar,
  Estudio,
  Gancho,
  Lofi,
  Radio,
  T,
} from "./Escenas";

export const DURACION_RADIOLOFI_S = duracionShort(T.fin);

// Short de ciencia que presenta con discreción la Radio Lofi del canal.
// Música de fondo: una de nuestras pistas lo-fi (study-1) en lugar de la habitual.
export const RadioLofi: React.FC = () => (
  <Short
    carpeta="radiolofi"
    musica="audio/radiolofi/musica.mp3"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: dopamina",
        desde: 0,
        hasta: T.estudio,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "Estudio 2011",
        desde: T.estudio,
        hasta: T.pero,
        render: (t0) => <Estudio t0={t0} />,
      },
      {
        nombre: "Estudiar",
        desde: T.pero,
        hasta: T.dormir,
        render: (t0) => <Estudiar t0={t0} />,
      },
      {
        nombre: "Dormir",
        desde: T.dormir,
        hasta: T.constantes,
        render: (t0) => <Dormir t0={t0} />,
      },
      {
        nombre: "Constantes",
        desde: T.constantes,
        hasta: T.lofi,
        render: (t0) => <Constantes t0={t0} />,
      },
      {
        nombre: "Lo-fi",
        desde: T.lofi,
        hasta: T.radio,
        render: (t0) => <Lofi t0={t0} />,
      },
      {
        nombre: "Radio Lofi",
        desde: T.radio,
        hasta: T.fin,
        render: (t0) => <Radio t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡Tu cerebro libera dopamina!", 0, T.estudio, C.yellow, 52],
      ["Escalofríos = dopamina", T.dopamina, T.pero, C.yellow],
      ["La letra compite al leer", T.estorba, T.sinletra, C.orange],
      ["Sin letra: menos distracción", T.sinletra, T.dormir, C.cyan],
      ["60-80 BPM para dormir", T.bpm, T.constantes, C.cyan],
      ["Ruido constante = foco", T.tapan, T.lofi, C.yellow],
      ["Sin letra, lento, constante", T.lofi, T.radio, C.white],
      ["Toca el video relacionado", T.toca, T.fin + 0.5, C.yellow],
    ]}
    tics={[1.0, T.dopamina, T.sinletra, T.bpm, T.tapan, T.asi]}
  />
);
