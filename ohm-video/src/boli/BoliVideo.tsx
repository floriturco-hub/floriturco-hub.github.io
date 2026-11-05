import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { BoliMundo } from "./Boli";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_BOLI = T.fin + 0.5;
export const DURACION_BOLI_S = INICIO_LOGO_BOLI + 6.5;
const D = INICIO_LOGO_BOLI - 61.5;

// Una sola escena-mundo (punta del bolígrafo en corte, agua contra tinta espesa y el bolígrafo entero) recorrida con la cámara
export const BoliVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Punta y papel" desde={0} hasta={INICIO_LOGO_BOLI}>
        {(t0) => (
          <>
            <BoliMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_BOLI} hasta={DURACION_BOLI_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_BOLI} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Tu bolígrafo esconde una bola!" desde={-0.4} hasta={T.punta - 0.1} y={1660} color={C.yellow} tamano={46} />
      <Etiqueta texto="Una esfera de metal" desde={T.punta} hasta={T.sujeta - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Sujeta pero gira" desde={T.sujeta} hasta={T.tapon - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="La bola es un tapón" desde={T.tapon} hasta={T.tinta - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Tinta espesa" desde={T.tinta} hasta={T.pasta - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Pasta que no gotea" desde={T.pasta} hasta={T.escribir - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Al escribir, rueda" desde={T.escribir} hasta={T.arriba - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Se moja arriba" desde={T.arriba} hasta={T.gira - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Gira y la deja" desde={T.gira} hasta={T.desodorante - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Como un roll-on" desde={T.desodorante} hasta={T.noRueda - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Sin rodar, sin tinta" desde={T.noRueda} hasta={T.bolsillo - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="No chorrea" desde={T.bolsillo} hasta={T.agujerito - 0.1} y={1660} color="#48C878" />
      <Etiqueta texto="Un agujerito" desde={T.agujerito} hasta={T.aire - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Entra aire" desde={T.aire} hasta={T.biro - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="László Bíró, 1938" desde={T.biro} hasta={T.periodicos - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Tinta de periódico" desde={T.periodicos} hasta={T.final - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Una bola que escribe" desde={T.final} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/boligrafo-bola/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_BOLI - 0.3, INICIO_LOGO_BOLI + 0.7, DURACION_BOLI_S - 1.5, DURACION_BOLI_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.tapon, T.noRueda, T.anio].map((tc) => (
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
