import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Caida, Centro, Cierre, Cuerdas, Gancho, Gravedad, Oscila, Realidad, T } from "./Escenas";

export const INICIO_LOGO_TUNEL = T.fin + 0.5;
export const DURACION_TUNEL_S = INICIO_LOGO_TUNEL + 6.5;
const D = INICIO_LOGO_TUNEL - 61.5;

export const TunelTierra: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Gancho: 42 minutos" desde={0} hasta={T.imagina}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Caída" desde={T.imagina} hasta={T.pero}>
        {(t0) => <Caida t0={t0} />}
      </Escena>
      <Escena nombre="Gravedad que se debilita" desde={T.pero} hasta={T.ahi}>
        {(t0) => <Gravedad t0={t0} />}
      </Escena>
      <Escena nombre="Centro" desde={T.ahi} hasta={T.desde}>
        {(t0) => <Centro t0={t0} />}
      </Escena>
      <Escena nombre="Oscilación" desde={T.desde} hasta={T.loco}>
        {(t0) => <Oscila t0={t0} />}
      </Escena>
      <Escena nombre="Cualquier túnel" desde={T.loco} hasta={T.claro}>
        {(t0) => <Cuerdas t0={t0} />}
      </Escena>
      <Escena nombre="Realidad" desde={T.claro} hasta={T.papel}>
        {(t0) => <Realidad t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.papel} hasta={INICIO_LOGO_TUNEL}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_TUNEL} hasta={DURACION_TUNEL_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_TUNEL} />}
      </Escena>

      {/* Etiquetas-clave: 2-4 palabras */}
      <Etiqueta texto="¿Y si saltas?" desde={0.15} hasta={T.cuarenta - 0.1} y={1600} color={C.white} tamano={56} />
      <Etiqueta texto="42 minutos" desde={T.cuarenta} hasta={T.luego - 0.1} y={1600} color={C.yellow} tamano={64} />
      <Etiqueta texto="Y luego vuelves" desde={T.luego} hasta={T.imagina - 0.1} y={1600} color={C.cyan} tamano={60} />
      <Etiqueta texto="Cada vez más rápido" desde={T.saltas} hasta={T.pero - 0.1} y={1600} color={C.cyan} />
      <Etiqueta texto="Menos Tierra debajo" desde={T.menos} hasta={T.gravedad - 0.1} y={1600} color={C.cyan} />
      <Etiqueta texto="La gravedad se debilita" desde={T.gravedad} hasta={T.centro - 0.1} y={1600} color={C.white} />
      <Etiqueta texto="En el centro: cero" desde={T.centro} hasta={T.ahi - 0.1} y={1600} color={C.yellow} />
      <Etiqueta texto="Velocidad máxima" desde={T.ahi} hasta={T.desde - 0.1} y={1600} color={C.yellow} />
      <Etiqueta texto="La gravedad te frena" desde={T.frena} hasta={T.llegas2 - 0.1} y={1600} color={C.white} />
      <Etiqueta texto="Justo al otro lado" desde={T.llegas2} hasta={T.vuelves - 0.1} y={1600} color={C.cyan} />
      <Etiqueta texto="Y vuelves a caer" desde={T.vuelves} hasta={T.ciclo - 0.1} y={1600} color={C.white} />
      <Etiqueta texto="84 minutos por ciclo" desde={T.ciclo} hasta={T.flotando - 0.1} y={1600} color={C.orange} />
      <Etiqueta texto="Flotando todo el viaje" desde={T.flotando} hasta={T.loco - 0.1} y={1600} color={C.cyan} />
      <Etiqueta texto="Cualquier túnel recto" desde={T.cualquier} hasta={T.tarda - 0.1} y={1600} color={C.white} />
      <Etiqueta texto="También 42 minutos" desde={T.tarda} hasta={T.claro - 0.1} y={1600} color={C.yellow} />
      <Etiqueta texto="En la realidad" desde={T.claro} hasta={T.aire - 0.1} y={1600} color={C.white} />
      <Etiqueta texto="Aire y 5.000 grados" desde={T.aire} hasta={T.papel - 0.1} y={1600} color={C.red} />
      <Etiqueta texto="Sobre el papel" desde={T.papel} hasta={T.ciudad - 0.1} y={1600} color={C.white} />
      <Etiqueta texto="Cualquier ciudad, 42 min" desde={T.ciudad} hasta={T.sinMotor - 0.1} y={1600} color={C.yellow} />
      <Etiqueta texto="Sin motor" desde={T.sinMotor} hasta={T.fin + 0.4} y={1600} color={C.yellow} tamano={64} />

      {/* Sonido: música 6 dB más baja (estilo.md, sección 9) */}
      <Audio src={staticFile("audio/tunel/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_TUNEL - 0.3, INICIO_LOGO_TUNEL + 0.7, DURACION_TUNEL_S - 1.5, DURACION_TUNEL_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.cuarenta, T.luego, T.centro, T.ciclo, T.tarda, T.sinMotor].map((tc) => (
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
