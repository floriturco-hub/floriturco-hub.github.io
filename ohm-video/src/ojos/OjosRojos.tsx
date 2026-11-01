import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Cierre, Coroides, DestelloPrevio, Flash, Gancho, OjoBlanco, OjosGato, PupilaNoche, T } from "./Escenas";

export const INICIO_LOGO_OJOS = T.fin + 0.5;
export const DURACION_OJOS_S = INICIO_LOGO_OJOS + 6.5;
const D = INICIO_LOGO_OJOS - 61.5;

export const OjosRojos: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Gancho: foto con flash" desde={0} hasta={T.noche}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Pupila de noche" desde={T.noche} hasta={T.entonces}>
        {(t0) => <PupilaNoche t0={t0} />}
      </Escena>
      <Escena nombre="Flash" desde={T.entonces} hasta={T.ahi}>
        {(t0) => <Flash t0={t0} />}
      </Escena>
      <Escena nombre="Coroides" desde={T.ahi} hasta={T.porEso}>
        {(t0) => <Coroides t0={t0} />}
      </Escena>
      <Escena nombre="Destello previo" desde={T.porEso} hasta={T.gato}>
        {(t0) => <DestelloPrevio t0={t0} />}
      </Escena>
      <Escena nombre="Gato" desde={T.gato} hasta={T.dato}>
        {(t0) => <OjosGato t0={t0} />}
      </Escena>
      <Escena nombre="Ojo blanco" desde={T.dato} hasta={T.final}>
        {(t0) => <OjoBlanco t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.final} hasta={INICIO_LOGO_OJOS}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_OJOS} hasta={DURACION_OJOS_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_OJOS} />}
      </Escena>

      {/* Etiquetas-clave: 2-4 palabras */}
      <Etiqueta texto="¿Ojos rojos?" desde={0.15} hasta={T.fondo - 0.1} y={1560} color={C.red} tamano={60} />
      <Etiqueta texto="Es el fondo de tu ojo" desde={T.fondo} hasta={T.noche - 0.1} y={1560} color={C.yellow} tamano={56} />
      <Etiqueta texto="Pupila al máximo" desde={T.abre} hasta={T.entonces - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Más rápido que tu pupila" desde={T.dura} hasta={T.entra - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Hasta el fondo del ojo" desde={T.entra} hasta={T.ahi - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Capa de vasos sanguíneos" desde={T.capa} hasta={T.rebota - 0.1} y={1560} color={C.red} />
      <Etiqueta texto="Vuelve por el mismo camino" desde={T.rebota} hasta={T.junto - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Objetivo junto al flash" desde={T.junto} hasta={T.roja - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Vuelve roja" desde={T.roja} hasta={T.porEso - 0.1} y={1560} color={C.red} tamano={60} />
      <Etiqueta texto="Destello previo" desde={T.destello} hasta={T.cierra - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="La pupila se cierra" desde={T.cierra} hasta={T.gato - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="¿Y tu gato?" desde={T.gato} hasta={T.espejo - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Un espejo tras la retina" desde={T.espejo} hasta={T.dato - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Un dato útil" desde={T.dato} hasta={T.soloOjo - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Ojo blanco: al oftalmólogo" desde={T.soloOjo} hasta={T.final - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="No es un fallo" desde={T.final + 0.4} hasta={T.porDentro - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Es tu ojo por dentro" desde={T.porDentro} hasta={T.fin + 0.4} y={1560} color={C.yellow} tamano={60} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/ojos/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_OJOS - 0.3, INICIO_LOGO_OJOS + 0.7, DURACION_OJOS_S - 1.5, DURACION_OJOS_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.fondo, T.flash, T.roja, T.soloOjo, T.porDentro].map((tc) => (
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
