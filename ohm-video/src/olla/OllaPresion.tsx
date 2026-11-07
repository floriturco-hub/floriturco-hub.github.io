import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Olla } from "./Olla";
import { Rapidez } from "./Rapidez";

// Tiempos en segundos de public/audio/olla/narracion.wav (voz ×1,1, termina a los 55,5 s)
const INICIO_LOGO = 56.0;
export const DURACION_OLLA_S = INICIO_LOGO + 6.5;
const D = INICIO_LOGO - 61.5; // desplazamiento respecto al cierre original

export const OllaPresion: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Olla: ebullición y presión" desde={0} hasta={23.82}>
        {(t0) => <Olla t0={t0} />}
      </Escena>
      <Escena nombre="Más rápido" desde={23.82} hasta={28.28}>
        {(t0) => <Rapidez t0={t0} />}
      </Escena>
      <Escena nombre="Olla: cierre y válvulas" desde={28.28} hasta={52.28}>
        {(t0) => <Olla t0={t0} />}
      </Escena>
      <Escena nombre="Resumen" desde={52.28} hasta={INICIO_LOGO}>
        {(t0) => <Olla t0={t0} />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO} hasta={DURACION_OLLA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="¿Más de 100 °C?" desde={1.48} hasta={3.75} y={1560} color={C.yellow} tamano={64} />
      <Etiqueta texto="Tope: 100 °C" desde={5.0} hasta={7.4} y={1560} color={C.yellow} />
      <Etiqueta texto="Las moléculas escapan" desde={8.28} hasta={11.3} y={1500} />
      <Etiqueta texto="Olla cerrada" desde={12.08} hasta={15.2} y={1560} />
      <Etiqueta texto="Presión casi ×2" desde={16.28} hasta={18.2} y={1560} color={C.cyan} />
      <Etiqueta texto="Cuesta más escapar" desde={19.54} hasta={22.0} y={1500} />
      <Etiqueta texto="Hierve a 120 °C" desde={22.1} hasta={23.7} y={1500} color={C.orange} />
      <Etiqueta texto="3 veces más rápido" desde={27.04} hasta={28.2} y={1400} color={C.yellow} />
      <Etiqueta texto="Encaje giratorio" desde={30.38} hasta={32.3} y={1300} />
      <Etiqueta texto="Goma de empaque" desde={32.42} hasta={34.3} y={1300} color={C.orange} />
      <Etiqueta texto="Más presión, más sello" desde={34.9} hasta={37.2} y={1300} color={C.yellow} />
      <Etiqueta texto="Válvula de peso" desde={38.0} hasta={42.2} y={1350} />
      <Etiqueta texto="Sale vapor" desde={43.12} hasta={45.3} y={1350} />
      <Etiqueta texto="Por eso silba" desde={45.42} hasta={46.5} y={1350} color={C.yellow} />
      <Etiqueta texto="Válvula de seguridad" desde={47.32} hasta={48.9} y={1350} color={C.red} />
      <Etiqueta texto="Seguro de tapa" desde={49.26} hasta={52.0} y={1350} color={C.yellow} />

      {/* Sonido: esquema aprobado + efectos de la olla */}
      <Audio src={staticFile("audio/olla/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO - 0.3, INICIO_LOGO + 0.7, DURACION_OLLA_S - 1.5, DURACION_OLLA_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[12.9, 31.3, 49.8].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={0.4} />
        </Sequence>
      ))}
      {[
        { t: 43.1, v: 0.5 },
        { t: 44.9, v: 0.45 },
        { t: 47.45, v: 0.35 },
      ].map((s) => (
        <Sequence key={s.t} name="Silbido" from={Math.round(s.t * fps)} durationInFrames={Math.round(2.0 * fps)}>
          <Audio src={staticFile("audio/olla/silbido.wav")} volume={s.v} />
        </Sequence>
      ))}
      <Sequence name="SFX logo" from={Math.round((62.35 + D) * fps)} durationInFrames={Math.round(2.9 * fps)}>
        <Audio src={staticFile("audio/sfx_logo.wav")} volume={0.7} />
      </Sequence>
      <Sequence name="Voz: Frecuencia Cero" from={Math.round((63.75 + D) * fps)} durationInFrames={Math.round(1.7 * fps)}>
        <Audio src={staticFile("audio/frecuencia_cero.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};
