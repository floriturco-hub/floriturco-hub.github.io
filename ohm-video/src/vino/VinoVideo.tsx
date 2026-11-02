import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Bodega } from "./Bodega";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_VINO = T.fin + 0.5;
export const DURACION_VINO_S = INICIO_LOGO_VINO + 6.5;
const D = INICIO_LOGO_VINO - 61.5;

// Una sola escena-mundo (bodega con barra, catador, botellas y caja de vino) recorrida con la cámara
export const VinoVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Bodega" desde={0} hasta={INICIO_LOGO_VINO}>
        {(t0) => (
          <>
            <Bodega t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_VINO} hasta={DURACION_VINO_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_VINO} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera ya está en el primer fotograma (gancho) */}
      <Etiqueta texto="¿Tinto? Es blanco teñido" desde={-0.4} hasta={T.burdeos - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Lo llamaron tinto" desde={T.tinto} hasta={T.parece - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Está en tu cerebro" desde={T.pero + 0.4} hasta={T.antes - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Rojo = tinto" desde={T.rojoTinto} hasta={T.ajusta - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="El cerebro ajusta" desde={T.ajusta} hasta={T.etiqueta - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Mismo vino" desde={T.mismo} hasta={T.primero - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Complejo y equilibrado" desde={T.complejo} hasta={T.segundo - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Plano y débil" desde={T.plano} hasta={T.estudio - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Más placer a 90 $" desde={T.placer} hasta={T.ciegas - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Ganan los baratos" desde={T.baratos} hasta={T.asi - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Caja en botella elegante" desde={T.caja} hasta={T.truco - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Cata a ciegas" desde={T.cata} hasta={T.paga - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="No por la etiqueta" desde={T.noEtiqueta} hasta={T.final - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="No bebes vino" desde={T.final} hasta={T.expectativas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Bebes expectativas" desde={T.expectativas} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={56} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/vino/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_VINO - 0.3, INICIO_LOGO_VINO + 0.7, DURACION_VINO_S - 1.5, DURACION_VINO_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.engano, T.tinto, T.plano, T.baratos, T.expectativas].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc === T.engano ? 0.6 : 0.4} />
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
