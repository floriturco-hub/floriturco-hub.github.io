import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Bano } from "./Bano";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_GFCI = T.fin + 0.5;
export const DURACION_GFCI_S = INICIO_LOGO_GFCI + 6.5;
const D = INICIO_LOGO_GFCI - 61.5;

// Una sola escena-mundo (baño con enchufe GFCI, esquema interno y tablero) recorrida con la cámara
export const GfciVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Baño y enchufe" desde={0} hasta={INICIO_LOGO_GFCI}>
        {(t0) => (
          <>
            <Bano t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_GFCI} hasta={DURACION_GFCI_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_GFCI} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera ya está en el primer fotograma (gancho) */}
      <Etiqueta texto="0,025 s para salvarte" desde={-0.4} hasta={T.cae - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="¿Nota el agua?" desde={T.parece} hasta={T.peroNo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Solo cuenta corriente" desde={T.cuenta} hasta={T.unCable - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Lo que va, vuelve" desde={T.normalmente} hasta={T.dentro - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Anillo con bobina" desde={T.anillo} hasta={T.iguales - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Se anulan" desde={T.anulan} hasta={T.pero - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="No vuelve" desde={T.noVuelve} hasta={T.diferencia - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Solo 5 mA" desde={T.cinco} hasta={T.detecta - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Corta la luz" desde={T.rele + 0.3} hasta={T.todo - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Corta antes del daño" desde={T.alcanza} hasta={T.paises - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Diferencial: 30 mA" desde={T.diferencial} hasta={T.truco - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Prueba cada mes" desde={T.prueba} hasta={T.cambialo - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Si no salta, cámbialo" desde={T.cambialo} hasta={T.final - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="No detecta el agua" desde={T.final} hasta={T.noVuelveFinal - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Detecta lo que no vuelve" desde={T.noVuelveFinal} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={46} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/enchufe-gfci/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_GFCI - 0.3, INICIO_LOGO_GFCI + 0.7, DURACION_GFCI_S - 1.5, DURACION_GFCI_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[1.1, T.noVuelve, T.rele, T.treinta + 0.4, T.prueba + 0.2].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc === 1.1 ? 0.6 : 0.4} />
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
