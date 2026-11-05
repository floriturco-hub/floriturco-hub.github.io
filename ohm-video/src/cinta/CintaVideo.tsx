import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { CintaMundo } from "./Cinta";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_CINTA = T.fin + 0.5;
export const DURACION_CINTA_S = INICIO_LOGO_CINTA + 6.5;
const D = INICIO_LOGO_CINTA - 61.5;

// Una sola escena-mundo (caja con la cinta, corte sobre una superficie rugosa y tirar rápido o despacio) recorrida con la cámara
export const CintaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Caja y corte" desde={0} hasta={INICIO_LOGO_CINTA}>
        {(t0) => (
          <>
            <CintaMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_CINTA} hasta={DURACION_CINTA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_CINTA} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Esta cinta nunca se seca!" desde={-0.4} hasta={T.pegamento - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="Su pegamento…" desde={T.pegamento} hasta={T.noReacciona - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="No reacciona ni endurece" desde={T.noReacciona} hasta={T.raro - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Un material raro" desde={T.raro} hasta={T.medio - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Entre sólido y líquido" desde={T.medio} hasta={T.miel - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Como miel espesísima" desde={T.miel} hasta={T.aprietas - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Al apretarla…" desde={T.aprietas} hasta={T.rugosidades - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Rellena cada rugosidad" desde={T.rugosidades} hasta={T.lisa - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Aunque parezca lisa" desde={T.lisa} hasta={T.fuerzas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Fuerzas pequeñísimas" desde={T.fuerzas} hasta={T.vdw - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Van der Waals" desde={T.vdw} hasta={T.atracciones - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Atracciones entre moléculas" desde={T.atracciones} hasta={T.debil - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Cada una es débil" desde={T.debil} hasta={T.millones - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Miles de millones" desde={T.millones} hasta={T.rapido - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Rápido: resiste" desde={T.rapido} hasta={T.despacio - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Despacio: se suelta" desde={T.despacio} hasta={T.americana - 0.1} y={1660} color="#48C878" />
      <Etiqueta texto="Cinta americana" desde={T.americana} hasta={T.malla - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Tela + caucho" desde={T.malla} hasta={T.contacto - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Pega por contacto" desde={T.contacto} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/cinta-adhesiva/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_CINTA - 0.3, INICIO_LOGO_CINTA + 0.7, DURACION_CINTA_S - 1.5, DURACION_CINTA_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[0.85, T.aprietas, T.solido].map((tc) => (
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
