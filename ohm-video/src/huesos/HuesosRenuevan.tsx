import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Astronautas, Calcio, Cierre, Ciclo, Gancho, ParaQue, Renueva, T, Vivo } from "./Escenas";

export const INICIO_LOGO_HUESOS = T.fin + 0.5;
export const DURACION_HUESOS_S = INICIO_LOGO_HUESOS + 6.5;
const D = INICIO_LOGO_HUESOS - 61.5;
const MORADO = "#C89AE8";

export const HuesosRenuevan: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: otro esqueleto" desde={0} hasta={T.vivos}>{(t0) => <Gancho t0={t0} />}</Escena>
      <Escena nombre="Vivo" desde={T.vivos} hasta={T.osteoclastos}>{(t0) => <Vivo t0={t0} />}</Escena>
      <Escena nombre="Excavar y rellenar" desde={T.osteoclastos} hasta={T.ciclo}>{(t0) => <Ciclo t0={t0} />}</Escena>
      <Escena nombre="10 % al año" desde={T.ciclo} hasta={T.para}>{(t0) => <Renueva t0={t0} />}</Escena>
      <Escena nombre="Para qué" desde={T.para} hasta={T.astronautas}>{(t0) => <ParaQue t0={t0} />}</Escena>
      <Escena nombre="Astronautas" desde={T.astronautas} hasta={T.ademas}>{(t0) => <Astronautas t0={t0} />}</Escena>
      <Escena nombre="Calcio" desde={T.ademas} hasta={T.asi}>{(t0) => <Calcio t0={t0} />}</Escena>
      <Escena nombre="Cierre" desde={T.asi} hasta={INICIO_LOGO_HUESOS}>{(t0) => <Cierre t0={t0} />}</Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_HUESOS} hasta={DURACION_HUESOS_S}>{(t0) => <Logo t0={t0} inicio={INICIO_LOGO_HUESOS} />}</Escena>

      <Etiqueta texto="No es el mismo esqueleto" desde={0.15} hasta={T.cambiado - 0.1} y={1560} color={C.white} tamano={52} />
      <Etiqueta texto="Cambiado entero" desde={T.cambiado} hasta={T.vivos - 0.1} y={1560} color={C.yellow} tamano={60} />
      <Etiqueta texto="Tus huesos están vivos" desde={T.vivos} hasta={T.dos - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Dos equipos de células" desde={T.dos} hasta={T.osteoclastos - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Osteoclastos: demoledoras" desde={T.osteoclastos} hasta={T.disuelven - 0.1} y={1560} color={MORADO} />
      <Etiqueta texto="Disuelven con ácido" desde={T.disuelven} hasta={T.osteoblastos - 0.1} y={1560} color={MORADO} />
      <Etiqueta texto="Osteoblastos: constructoras" desde={T.osteoblastos} hasta={T.rellenan - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Colágeno y calcio nuevos" desde={T.rellenan} hasta={T.ciclo - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Millones de puntos" desde={T.ciclo} hasta={T.cada - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Cada año, un 10 %" desde={T.cada} hasta={T.para - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="¿Para qué?" desde={T.para} hasta={T.reparar - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Repara microgrietas" desde={T.reparar} hasta={T.carga - 0.1} y={1560} color={C.red} />
      <Etiqueta texto="Más carga, más hueso" desde={T.carga} hasta={T.adelgaza - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Sin carga, se adelgaza" desde={T.adelgaza} hasta={T.astronautas - 0.1} y={1560} color={C.orange} />
      <Etiqueta texto="Astronautas" desde={T.astronautas} hasta={T.pierden - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="~1 % de hueso al mes" desde={T.pierden} hasta={T.ademas - 0.1} y={1560} color={C.red} />
      <Etiqueta texto="Reserva de calcio" desde={T.calcio} hasta={T.sangre - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Se lo presta a la sangre" desde={T.sangre} hasta={T.asi - 0.1} y={1560} color={C.red} />
      <Etiqueta texto="Muévete" desde={T.muevete} hasta={T.construye - 0.1} y={1560} color={C.yellow} tamano={64} />
      <Etiqueta texto="Se construye moviéndote" desde={T.construye} hasta={T.fin + 0.4} y={1560} color={C.yellow} tamano={56} />

      <Audio src={staticFile("audio/huesos/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_HUESOS - 0.3, INICIO_LOGO_HUESOS + 0.7, DURACION_HUESOS_S - 1.5, DURACION_HUESOS_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.cambiado, T.osteoclastos, T.osteoblastos, T.diez, T.pierden, T.muevete].map((tc) => (
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
