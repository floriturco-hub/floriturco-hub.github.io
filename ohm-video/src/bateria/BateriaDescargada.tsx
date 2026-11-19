import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Celda } from "./Celda";
import { ChipMide, MEDIDAS } from "./ChipMide";
import { Curva } from "./Curva";
import { Telefono } from "./Telefono";

// Tiempos en segundos de public/audio/bateria/narracion.wav (voz ×1,1)
export const DURACION_BATERIA_S = 68;

export const BateriaDescargada: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Celular 1 %" desde={0} hasta={10.16}>
        {(t0) => <Telefono t0={t0} fase="intro" />}
      </Escena>
      <Escena nombre="Dentro de la celda" desde={10.16} hasta={34.3}>
        {(t0) => <Celda t0={t0} />}
      </Escena>
      <Escena nombre="Curva de descarga" desde={34.3} hasta={41.5}>
        {(t0) => <Curva t0={t0} fase="descarga" />}
      </Escena>
      <Escena nombre="El chip mide" desde={41.5} hasta={48.3}>
        {(t0) => <ChipMide t0={t0} />}
      </Escena>
      <Escena nombre="Apagado protector" desde={48.3} hasta={55.95}>
        {(t0) => <Curva t0={t0} fase="apagado" />}
      </Escena>
      <Escena nombre="Celular final" desde={55.95} hasta={61.5}>
        {(t0) => <Telefono t0={t0} fase="final" />}
      </Escena>
      <Escena nombre="Logo" desde={61.5} hasta={DURACION_BATERIA_S}>
        {(t0) => <Logo t0={t0} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="¿Qué significa?" desde={1.66} hasta={4.3} y={1500} color={C.yellow} tamano={64} />
      <Etiqueta texto="La batería no sabe" desde={5.18} hasta={7.5} y={1450} />
      <Etiqueta texto="Chip medidor" desde={8.42} hasta={10.0} y={1300} color={C.yellow} />
      <Etiqueta texto="Grafito" desde={11.7} hasta={14.9} x={285} y={700} />
      <Etiqueta texto="Óxido metálico" desde={12.56} hasta={14.9} x={795} y={700} />
      <Etiqueta texto="Iones de litio" desde={16.92} hasta={19.0} y={1620} color={C.yellow} />
      <Etiqueta texto="Los iones cruzan" desde={19.18} hasta={22.9} y={1620} color={C.yellow} />
      <Etiqueta texto="Corriente" desde={23.26} hasta={25.7} y={500} color={C.cyan} />
      <Etiqueta texto="Energía = diferencia" desde={26.02} hasta={30.4} y={1620} color={C.yellow} />
      <Etiqueta texto="El voltaje baja" desde={30.56} hasta={34.1} y={1620} />
      <Etiqueta texto="Cae en picado" desde={39.9} hasta={41.4} y={1500} color={C.red} />
      <Etiqueta texto="Estima cuánto queda" desde={47.0} hasta={48.2} y={1600} color={C.yellow} />
      <Etiqueta texto="1 % no es vacía" desde={48.42} hasta={50.6} y={1500} color={C.yellow} />
      <Etiqueta texto="Apagado a propósito" desde={50.74} hasta={53.7} y={1500} color={C.red} />
      <Etiqueta texto="Protege la química" desde={53.78} hasta={55.9} y={1500} />
      <Etiqueta texto="Antes de protegerla" desde={59.16} hasta={61.4} y={1420} color={C.yellow} />

      {/* Sonido: mismo esquema aprobado que el vídeo de la ley de Ohm */}
      <Audio src={staticFile("audio/bateria/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, 61.2, 62.2, 66.5, DURACION_BATERIA_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[7.64, ...MEDIDAS.map((m) => m.t), 50.74].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={0.4} />
        </Sequence>
      ))}
      <Sequence name="SFX logo" from={Math.round(62.35 * fps)} durationInFrames={Math.round(2.9 * fps)}>
        <Audio src={staticFile("audio/sfx_logo.wav")} volume={0.7} />
      </Sequence>
      <Sequence name="Voz: Frecuencia Cero" from={Math.round(63.75 * fps)} durationInFrames={Math.round(1.7 * fps)}>
        <Audio src={staticFile("audio/frecuencia_cero.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};
