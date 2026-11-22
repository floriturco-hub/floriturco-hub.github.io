import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Cierre, DosCaminos, Estudio, Gancho, Graves, Microfono_, Prueba, T } from "./Escenas";

export const INICIO_LOGO_VOZ = T.fin + 0.5;
export const DURACION_VOZ_S = INICIO_LOGO_VOZ + 6.5;
const D = INICIO_LOGO_VOZ - 61.5;

export const VozGrabada: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Gancho: tu voz real" desde={0} hasta={T.cuando}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Dos caminos" desde={T.cuando} hasta={T.refuerza}>
        {(t0) => <DosCaminos t0={t0} />}
      </Escena>
      <Escena nombre="Graves" desde={T.refuerza} hasta={T.micro}>
        {(t0) => <Graves t0={t0} />}
      </Escena>
      <Escena nombre="Micrófono" desde={T.micro} hasta={T.prueba}>
        {(t0) => <Microfono_ t0={t0} />}
      </Escena>
      <Escena nombre="Prueba" desde={T.prueba} hasta={T.curioso}>
        {(t0) => <Prueba t0={t0} />}
      </Escena>
      <Escena nombre="Estudio" desde={T.curioso} hasta={T.asiQue}>
        {(t0) => <Estudio t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.asiQue} hasta={INICIO_LOGO_VOZ}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_VOZ} hasta={DURACION_VOZ_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_VOZ} />}
      </Escena>

      <Etiqueta texto="¿Odias tu voz en audios?" desde={0.15} hasta={T.esaEs - 0.1} y={1560} color={C.white} tamano={52} />
      <Etiqueta texto="Esa es tu voz real" desde={T.esaEs} hasta={T.cuando - 0.1} y={1560} color={C.yellow} tamano={60} />
      <Etiqueta texto="Dos caminos" desde={T.dos} hasta={T.aire - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Por el aire" desde={T.aire} hasta={T.otro - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Por los huesos" desde={T.otro} hasta={T.interno - 0.1} y={1560} color={C.orange} />
      <Etiqueta texto="Directo al oído interno" desde={T.interno} hasta={T.refuerza - 0.1} y={1560} color={C.orange} />
      <Etiqueta texto="Refuerza los graves" desde={T.graves} hasta={T.micro - 0.1} y={1560} color={C.orange} />
      <Etiqueta texto="Solo capta el aire" desde={T.capta} hasta={T.aguda - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Más aguda y más fina" desde={T.aguda} hasta={T.noSeParece - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="No es la que conoces" desde={T.noSeParece} hasta={T.prueba - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Tápate los oídos" desde={T.tapate} hasta={T.casi - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Casi todo, por dentro" desde={T.casi} hasta={T.curioso - 0.1} y={1560} color={C.orange} />
      <Etiqueta texto="Un estudio" desde={T.estudio} hasta={T.noSabia - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Mejor si no sabían" desde={T.noSabia} hasta={T.asiQue - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="La que oyen todos" desde={T.asiQue} hasta={T.rara - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="La rara es la tuya" desde={T.rara} hasta={T.fin + 0.4} y={1560} color={C.yellow} tamano={60} />

      <Audio src={staticFile("audio/voz/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_VOZ - 0.3, INICIO_LOGO_VOZ + 0.7, DURACION_VOZ_S - 1.5, DURACION_VOZ_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.esaEs, T.otro, T.graves, T.tapate, T.noSabia, T.rara].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={0.45} />
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
