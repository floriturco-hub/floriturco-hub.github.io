import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "./components/Escena";
import { Etiqueta } from "./components/Etiqueta";
import { Fondo } from "./components/Fondo";
import { Calor } from "./scenes/Calor";
import { Circuito } from "./scenes/Circuito";
import { Clave } from "./scenes/Clave";
import { CHOQUES, Cobre } from "./scenes/Cobre";
import { Logo } from "./scenes/Logo";
import { Resistencia } from "./scenes/Resistencia";
import { C } from "./theme";

// Todos los tiempos en segundos de la narración (narracion.wav, voz acelerada ×1,1)
export const DURACION_S = 68;

export const LeyDeOhm: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Circuito" desde={0} hasta={7.05}>
        {(t0) => <Circuito t0={t0} fase="intro" />}
      </Escena>
      <Escena nombre="Dentro del cobre" desde={7.05} hasta={35.15}>
        {(t0) => <Cobre t0={t0} />}
      </Escena>
      <Escena nombre="La clave" desde={35.15} hasta={44.15}>
        {(t0) => <Clave t0={t0} />}
      </Escena>
      <Escena nombre="Resistencia" desde={44.15} hasta={50.73}>
        {(t0) => <Resistencia t0={t0} />}
      </Escena>
      <Escena nombre="Calor" desde={50.73} hasta={58.0}>
        {(t0) => <Calor t0={t0} />}
      </Escena>
      <Escena nombre="Tráfico" desde={58.0} hasta={61.5}>
        {(t0) => <Circuito t0={t0} fase="final" />}
      </Escena>
      <Escena nombre="Logo" desde={61.5} hasta={DURACION_S}>
        {(t0) => <Logo t0={t0} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras, ancladas a lo que nombran */}
      <Etiqueta texto="V = I · R" desde={0.3} hasta={4.2} y={1420} color={C.yellow} tamano={64} />
      <Etiqueta texto="¿Por qué?" desde={4.31} hasta={6.6} y={1420} color={C.yellow} tamano={64} />
      <Etiqueta texto="Red de átomos" desde={9.07} hasta={13.9} y={660} />
      <Etiqueta texto="Electrones al azar" desde={11.55} hasta={14.6} y={1300} color={C.cyan} />
      <Etiqueta texto="Campo eléctrico" desde={16.45} hasta={20.9} y={900} color={C.cyan} />
      <Etiqueta texto="Acelera y choca" desde={21.76} hasta={29.3} y={1460} />
      <Etiqueta texto="Deriva: mm/s" desde={32.24} hasta={34.9} y={1460} color={C.yellow} />
      <Etiqueta texto="Empuje ×2" desde={36.53} hasta={40.2} y={1450} color={C.white} />
      <Etiqueta texto="Doble deriva" desde={40.47} hasta={42.4} y={1450} color={C.cyan} />
      <Etiqueta texto="Ley de Ohm" desde={42.69} hasta={44.1} y={1440} color={C.yellow} tamano={56} />
      <Etiqueta texto="R = choques" desde={44.22} hasta={46.2} y={1400} color={C.yellow} />
      <Etiqueta texto="Más largo: más R" desde={46.38} hasta={48.0} y={1400} />
      <Etiqueta texto="Más grueso: menos R" desde={48.09} hasta={50.6} y={1400} />
      <Etiqueta texto="No es universal" desde={50.73} hasta={52.7} y={1640} />
      <Etiqueta texto="Calor: más choques" desde={52.8} hasta={57.9} y={1640} color={C.orange} />
      <Etiqueta texto="V = I · R" desde={58.04} hasta={61.3} y={1420} color={C.yellow} tamano={64} />
      <Etiqueta texto="Tráfico con choques" desde={59.78} hasta={61.4} y={1560} color={C.white} />

      {/* Sonido: voz, música ~14 dB por debajo, choques y sello del logo */}
      <Audio src={staticFile("audio/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, 61.2, 62.2, 66.5, DURACION_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {CHOQUES.map((tc) => (
        <Sequence key={tc} name="Choque" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={0.45} />
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
