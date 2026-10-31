import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Linea } from "./Linea";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_PAJARO = T.fin + 0.5;
export const DURACION_PAJARO_S = INICIO_LOGO_PAJARO + 6.5;
const D = INICIO_LOGO_PAJARO - 61.5;

// Una sola escena-mundo (el tendido eléctrico) recorrida con la cámara, como la referencia
export const PajaroCable: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Tendido eléctrico" desde={0} hasta={INICIO_LOGO_PAJARO}>
        {(t0) => (
          <>
            <Linea t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_PAJARO} hasta={DURACION_PAJARO_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_PAJARO} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="¿No se electrocuta?" desde={T.porQue} hasta={T.voltaje - 0.1} y={1500} color={C.yellow} tamano={60} />
      <Etiqueta texto="Importa la diferencia" desde={T.diferencia} hasta={T.patas - 0.2} y={1500} color={C.yellow} />
      <Etiqueta texto="Mismo cable" desde={T.patas} hasta={T.diezMil - 0.1} y={1500} />
      <Etiqueta texto="Casi nada de corriente" desde={T.casiNada} hasta={T.facil - 0.2} y={1600} color={C.cyan} />
      <Etiqueta texto="El camino fácil" desde={T.facil} hasta={T.millones - 0.1} y={1500} color={C.cyan} />
      <Etiqueta texto="Pasa de largo" desde={T.pasaDeLargo} hasta={T.peligro - 0.1} y={1500} color={C.cyan} />
      <Etiqueta texto="Distinto voltaje" desde={T.peligro} hasta={T.atraviesa - 0.1} y={1600} color={C.red} />
      <Etiqueta texto="Atraviesa el cuerpo" desde={T.atraviesa} hasta={T.aguilas - 0.1} y={1600} color={C.red} />
      <Etiqueta texto="Aves grandes" desde={T.aguilas} hasta={T.protectores - 0.1} y={1450} />
      <Etiqueta texto="Protectores" desde={T.protectores} hasta={T.mismo - 0.1} y={1450} color={C.orange} />
      <Etiqueta texto="Es la diferencia" desde={T.diferenciaFinal} hasta={T.fin + 0.4} y={1500} color={C.yellow} tamano={60} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/pajaro/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_PAJARO - 0.3, INICIO_LOGO_PAJARO + 0.7, DURACION_PAJARO_S - 1.5, DURACION_PAJARO_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[1.6, T.diezMil, T.milesimas, T.protectores].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={0.4} />
        </Sequence>
      ))}
      <Sequence name="Chispazo" from={Math.round((T.atraviesa - 0.3) * fps)} durationInFrames={Math.round(1.5 * fps)}>
        <Audio src={staticFile("audio/pajaro/chispazo.wav")} volume={0.5} />
      </Sequence>
      <Sequence name="SFX logo" from={Math.round((62.35 + D) * fps)} durationInFrames={Math.round(2.9 * fps)}>
        <Audio src={staticFile("audio/sfx_logo.wav")} volume={0.7} />
      </Sequence>
      <Sequence name="Voz: Frecuencia Cero" from={Math.round((63.75 + D) * fps)} durationInFrames={Math.round(1.7 * fps)}>
        <Audio src={staticFile("audio/frecuencia_cero.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};
