import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Agua } from "./Agua";
import { Penetracion, Plato, Rejilla } from "./Calentado";
import { Corte } from "./Corte";
import { Microondas } from "./Microondas";
import { T } from "./tiempos";

const INICIO_LOGO = 60.9;
export const DURACION_MICROONDAS_S = INICIO_LOGO + 6.5;
const D = INICIO_LOGO - 61.5;

export const MicroondasVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Microondas" desde={0} hasta={T.magnetron}>
        {(t0) => <Microondas t0={t0} fase="intro" />}
      </Escena>
      <Escena nombre="Magnetrón y rebotes" desde={T.magnetron} hasta={T.agua}>
        {(t0) => <Corte t0={t0} />}
      </Escena>
      <Escena nombre="Moléculas de agua" desde={T.agua} hasta={T.entran}>
        {(t0) => <Agua t0={t0} />}
      </Escena>
      <Escena nombre="Penetración" desde={T.entran} hasta={T.zonas}>
        {(t0) => <Penetracion t0={t0} />}
      </Escena>
      <Escena nombre="Plato giratorio" desde={T.zonas} hasta={T.salen}>
        {(t0) => <Plato t0={t0} />}
      </Escena>
      <Escena nombre="Rejilla" desde={T.salen} hasta={T.final}>
        {(t0) => <Rejilla t0={t0} />}
      </Escena>
      <Escena nombre="Microondas final" desde={T.final} hasta={INICIO_LOGO}>
        {(t0) => <Microondas t0={t0} fase="final" />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO} hasta={DURACION_MICROONDAS_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="Sin fuego" desde={4.42} hasta={7.6} y={1460} color={C.yellow} tamano={64} />
      <Etiqueta texto="Magnetrón" desde={9.02} hasta={12.5} y={1450} color={C.yellow} />
      <Etiqueta texto="Electricidad a ondas" desde={10.88} hasta={12.6} y={1560} color={C.cyan} />
      <Etiqueta texto="Guía de ondas" desde={18.68} hasta={21.5} y={1450} />
      <Etiqueta texto="Rebotan en el metal" desde={21.72} hasta={23.7} y={1450} color={C.yellow} />
      <Etiqueta texto="El agua es la clave" desde={24.08} hasta={27.4} y={1500} color={C.yellow} />
      <Etiqueta texto="Como un imán" desde={29.5} hasta={30.6} y={1500} />
      <Etiqueta texto="Intentan girar" desde={35.42} hasta={37.3} y={1650} color={C.cyan} />
      <Etiqueta texto="Chocan con vecinas" desde={38.08} hasta={39.5} y={1650} />
      <Etiqueta texto="Roce = calor" desde={39.58} hasta={41.0} y={1650} color={C.orange} />
      <Etiqueta texto="Solo unos centímetros" desde={41.52} hasta={43.3} y={1500} color={C.cyan} />
      <Etiqueta texto="El centro, por contacto" desde={43.48} hasta={45.8} y={1500} color={C.orange} />
      <Etiqueta texto="Zonas fuertes y débiles" desde={46.94} hasta={48.3} y={1560} color={C.orange} />
      <Etiqueta texto="El plato gira" desde={48.5} hasta={50.4} y={1560} color={C.yellow} />
      <Etiqueta texto="Agujeros diminutos" desde={53.16} hasta={55.3} y={1700} />
      <Etiqueta texto="Luz sí, microondas no" desde={55.4} hasta={57.7} y={1700} color={C.yellow} />
      <Etiqueta texto="Agua que baila" desde={58.8} hasta={60.7} y={1460} color={C.yellow} tamano={64} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/microondas/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO - 0.3, INICIO_LOGO + 0.7, DURACION_MICROONDAS_S - 1.5, DURACION_MICROONDAS_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.electricidad, T.rebotan, T.chocan, T.luz].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={0.4} />
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
