import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { ConcretoMundo } from "./Concreto";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_CONCRETO = T.fin + 0.5;
export const DURACION_CONCRETO_S = INICIO_LOGO_CONCRETO + 6.5;
const D = INICIO_LOGO_CONCRETO - 61.5;

// Una sola escena-mundo (edificio con esqueleto, laboratorio, bloque con grietas y viga con varillas) recorrida con la cámara
export const ConcretoVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Edificio y viga" desde={0} hasta={INICIO_LOGO_CONCRETO}>
        {(t0) => (
          <>
            <ConcretoMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_CONCRETO} hasta={DURACION_CONCRETO_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_CONCRETO} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Tu edificio esconde un esqueleto!" desde={-0.4} hasta={T.aplastas - 0.1} y={1660} color={C.yellow} tamano={44} />
      <Etiqueta texto="Aplastado: brutal" desde={T.aplastas} hasta={T.cubito - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Aguanta un coche" desde={T.cubito} hasta={T.estiras - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Estirado: se rompe" desde={T.estiras} hasta={T.diez - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="10 veces más débil" desde={T.diez} hasta={T.porQue - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Grietas diminutas" desde={T.porQue} hasta={T.apretar - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Apretar: se cierran" desde={T.apretar} hasta={T.estirar - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Estirar: se abren" desde={T.estirar} hasta={T.crece - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Una crece… ¡crac!" desde={T.crece} hasta={T.dobla - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Todo se dobla" desde={T.dobla} hasta={T.viga - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Arriba: se aplasta" desde={T.viga} hasta={T.abajo - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Abajo: se estira" desde={T.abajo} hasta={T.acero - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Entra el acero" desde={T.acero} hasta={T.tirones - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Aguanta tirones" desde={T.tirones} hasta={T.relieves - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Relieves que agarran" desde={T.relieves} hasta={T.dilatan - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Se dilatan igual" desde={T.dilatan} hasta={T.oxido - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Protegido del óxido" desde={T.oxido} hasta={T.uno - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Apretones + tirones" desde={T.uno} hasta={T.juntos - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Concreto armado" desde={T.juntos} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/concreto-acero/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_CONCRETO - 0.3, INICIO_LOGO_CONCRETO + 0.7, DURACION_CONCRETO_S - 1.5, DURACION_CONCRETO_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.diez, T.crece + 0.6, T.acero].map((tc) => (
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
