import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { SuperpMundo } from "./Superp";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_SUPERP = T.fin + 0.5;
export const DURACION_SUPERP_S = INICIO_LOGO_SUPERP + 6.5;
const D = INICIO_LOGO_SUPERP - 61.5;

// Una sola escena-mundo (bote en corte, reacción en cadena con el agua y cómo despegarlo) recorrida con la cámara
export const SuperpVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Bote y cadena" desde={0} hasta={INICIO_LOGO_SUPERP}>
        {(t0) => (
          <>
            <SuperpMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_SUPERP} hasta={DURACION_SUPERP_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_SUPERP} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Tu propia piel lo hace pegar!" desde={-0.4} hasta={T.cianoacrilato - 0.1} y={1660} color={C.yellow} tamano={48} />
      <Etiqueta texto="Cianoacrilato" desde={T.cianoacrilato} hasta={T.moleculas - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Moléculas sueltas" desde={T.moleculas} hasta={T.eslabones - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Eslabones sin unir" desde={T.eslabones} hasta={T.bote - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="En el bote, nada" desde={T.bote} hasta={T.acido - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Un poco de ácido" desde={T.acido} hasta={T.humedad - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Basta una pizca de humedad" desde={T.humedad} hasta={T.piel - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="…y tu piel" desde={T.piel} hasta={T.dispara - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="¡Se dispara!" desde={T.dispara} hasta={T.engancha - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Una se engancha a otra" desde={T.engancha} hasta={T.cadena - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Una cadena larguísima" desde={T.cadena} hasta={T.plastico - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Plástico sólido" desde={T.plastico} hasta={T.grieta - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="En cada grieta" desde={T.grieta} hasta={T.dedos - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Tus dedos están húmedos" desde={T.dedos} hasta={T.hospitales - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Cierra heridas" desde={T.hospitales} hasta={T.despegar - 0.1} y={1660} color="#48C878" />
      <Etiqueta texto="Despegar: agua o acetona" desde={T.despegar} hasta={T.activa - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Lo activa el agua" desde={T.activa} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/superpegamento/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_SUPERP - 0.3, INICIO_LOGO_SUPERP + 0.7, DURACION_SUPERP_S - 1.5, DURACION_SUPERP_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[1.6, T.dispara, T.cadena].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
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
