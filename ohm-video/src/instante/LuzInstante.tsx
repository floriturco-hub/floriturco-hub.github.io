import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Circuito } from "./Circuito";
import { Manguera } from "./Manguera";
import { T } from "./tiempos";

export const INICIO_LOGO_INSTANTE = T.fin + 0.5;
export const DURACION_INSTANTE_S = INICIO_LOGO_INSTANTE + 6.5;
const D = INICIO_LOGO_INSTANTE - 61.5;

export const LuzInstante: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Circuito: deriva y empujón" desde={0} hasta={T.manguera}>
        {(t0) => <Circuito t0={t0} />}
      </Escena>
      <Escena nombre="Manguera" desde={T.manguera} hasta={T.alterna}>
        {(t0) => <Manguera t0={t0} />}
      </Escena>
      <Escena nombre="Circuito: alterna y campo" desde={T.alterna} hasta={INICIO_LOGO_INSTANTE}>
        {(t0) => <Circuito t0={t0} />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_INSTANTE} hasta={DURACION_INSTANTE_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_INSTANTE} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="¿Al instante?" desde={T.porQue} hasta={T.fraccion - 0.2} y={1640} color={C.yellow} tamano={60} />
      <Etiqueta texto="Más lentos que un caracol" desde={T.fraccion} hasta={T.horas - 0.1} y={1500} color={C.cyan} />
      <Etiqueta texto="Ya están dentro" desde={T.lleno + 0.6} hasta={T.pulsar - 0.1} y={1640} color={C.yellow} />
      <Etiqueta texto="Viaja el empujón" desde={T.pulsar + 0.2} hasta={T.todos - 0.1} y={1640} color={C.yellow} />
      <Etiqueta texto="Todos a la vez" desde={T.todos} hasta={T.manguera - 0.1} y={1640} color={C.cyan} />
      <Etiqueta texto="Sale al instante" desde={T.grifo + 0.2} hasta={T.misma - 0.1} y={1400} color={C.cyan} />
      <Etiqueta texto="No es la misma" desde={T.misma} hasta={T.alterna - 0.1} y={1400} color={C.yellow} />
      <Etiqueta texto="Adelante y atrás" desde={T.balancean} hasta={T.nunca - 0.1} y={1500} color={C.cyan} />
      <Etiqueta texto="Nunca llegan" desde={T.nunca} hasta={T.energia - 0.1} y={1500} color={C.yellow} />
      <Etiqueta texto="La energía va por el campo" desde={T.alrededor - 0.6} hasta={T.final - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Viaja el empujón" desde={T.final + 1.2} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={60} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/instante/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_INSTANTE - 0.3, INICIO_LOGO_INSTANTE + 0.7, DURACION_INSTANTE_S - 1.5, DURACION_INSTANTE_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.interruptor, T.pulsar, T.grifo].map((tc) => (
        <Sequence key={tc} name="Clic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={0.5} />
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
