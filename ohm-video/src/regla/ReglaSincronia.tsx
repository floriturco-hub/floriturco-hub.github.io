import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { App2016, Azar, Cierre, Deriva, Estudio1971, Gancho, Repeticion, T } from "./Escenas";
import { ROSA } from "./Piezas";

export const INICIO_LOGO_REGLA = T.fin + 0.5;
export const DURACION_REGLA_S = INICIO_LOGO_REGLA + 6.5;
const D = INICIO_LOGO_REGLA - 61.5;

export const ReglaSincronia: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Gancho: a la vez que tu amiga" desde={0} hasta={T.idea}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="1971" desde={T.idea} hasta={T.pero}>
        {(t0) => <Estudio1971 t0={t0} />}
      </Escena>
      <Escena nombre="Repetición" desde={T.pero} hasta={T.app}>
        {(t0) => <Repeticion t0={t0} />}
      </Escena>
      <Escena nombre="App 2016" desde={T.app} hasta={T.entonces}>
        {(t0) => <App2016 t0={t0} />}
      </Escena>
      <Escena nombre="Azar" desde={T.entonces} hasta={T.ciclos}>
        {(t0) => <Azar t0={t0} />}
      </Escena>
      <Escena nombre="Deriva" desde={T.ciclos} hasta={T.ovarios}>
        {(t0) => <Deriva t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.ovarios} hasta={INICIO_LOGO_REGLA}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_REGLA} hasta={DURACION_REGLA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_REGLA} />}
      </Escena>

      {/* Etiquetas-clave: 2-4 palabras */}
      <Etiqueta texto="¿A la vez que tu amiga?" desde={0.15} hasta={T.noTe - 0.1} y={1560} color={ROSA} tamano={50} />
      <Etiqueta texto="No te lo imaginas" desde={T.noTe} hasta={T.sincronia - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Pero no es sincronía" desde={T.sincronia} hasta={T.idea - 0.1} y={1560} color={C.red} tamano={56} />
      <Etiqueta texto="Así nació la idea" desde={T.idea} hasta={T.acercaban - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Ciclos que se acercaban" desde={T.acercaban} hasta={T.pero - 0.1} y={1560} color={ROSA} />
      <Etiqueta texto="Al repetirlo" desde={T.pero} hasta={T.desaparecia - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="La sincronía desaparece" desde={T.desaparecia} hasta={T.app - 0.1} y={1560} color={C.red} />
      <Etiqueta texto="Datos de una app" desde={T.app + 0.5} hasta={T.mayoria - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="La mayoría se alejaban" desde={T.mayoria} hasta={T.entonces - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Por matemáticas" desde={T.matematicas} hasta={T.cinco - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="5 días de cada 28" desde={T.cinco} hasta={T.azar - 0.1} y={1560} color={ROSA} />
      <Etiqueta texto="Solo por azar" desde={T.azar} hasta={T.tercio - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Más de 1/3 coinciden" desde={T.tercio} hasta={T.ciclos - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="No miden lo mismo" desde={T.ciclos} hasta={T.coinciden - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Coinciden y se separan" desde={T.coinciden} hasta={T.recordamos - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Recordamos las coincidencias" desde={T.recordamos} hasta={T.ovarios - 0.1} y={1560} color={ROSA} />
      <Etiqueta texto="Tus ovarios no hablan" desde={T.ovarios} hasta={T.calendario - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="El calendario hace trampas" desde={T.calendario} hasta={T.fin + 0.4} y={1560} color={C.yellow} tamano={54} />

      {/* Sonido: música 6 dB más baja (estilo.md, sección 9) */}
      <Audio src={staticFile("audio/regla/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_REGLA - 0.3, INICIO_LOGO_REGLA + 0.7, DURACION_REGLA_S - 1.5, DURACION_REGLA_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.sincronia, T.desaparecia, T.mayoria, T.tercio, T.calendario].map((tc) => (
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
