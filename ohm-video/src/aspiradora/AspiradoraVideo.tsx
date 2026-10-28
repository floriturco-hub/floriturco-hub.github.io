import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Sala } from "./Sala";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_ASPIRADORA = T.fin + 0.5;
export const DURACION_ASPIRADORA_S = INICIO_LOGO_ASPIRADORA + 6.5;
const D = INICIO_LOGO_ASPIRADORA - 61.5;

// Una sola escena-mundo (la habitación con la aspiradora en corte) recorrida con la cámara
export const AspiradoraVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Habitación y aspiradora" desde={0} hasta={INICIO_LOGO_ASPIRADORA}>
        {(t0) => (
          <>
            <Sala t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_ASPIRADORA} hasta={DURACION_ASPIRADORA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_ASPIRADORA} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="¿Qué la empuja?" desde={T.empuja - 0.6} hasta={T.parece - 0.1} y={1500} color={C.yellow} tamano={60} />
      <Etiqueta texto="El aire no tira" desde={T.noPuede} hasta={T.soloEmpuja - 0.1} y={1500} />
      <Etiqueta texto="Solo empuja" desde={T.soloEmpuja} hasta={T.columna - 0.1} y={1500} color={C.yellow} />
      <Etiqueta texto="Presión atmosférica" desde={T.atmosferica - 0.2} hasta={T.ventilador - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Menos aire dentro" desde={T.menosAire} hasta={T.fuera - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Entra a empujones" desde={T.empujones} hasta={T.chorro - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Arrastra el polvo" desde={T.polvo - 0.3} hasta={T.tapa - 0.1} y={1560} />
      <Etiqueta texto="La diferencia aprieta" desde={T.diferencia} hasta={T.calcetin - 0.1} y={1620} color={C.yellow} />
      <Etiqueta texto="Se queda pegado" desde={T.calcetin} hasta={T.mano - 0.1} y={1620} />
      <Etiqueta texto="La atmósfera aprieta" desde={T.atmosferaMano} hasta={T.noChupa - 0.1} y={1620} color={C.yellow} />
      <Etiqueta texto="La atmósfera empuja" desde={T.atmosferaEmpuja} hasta={T.fin + 0.4} y={1500} color={C.yellow} tamano={60} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/aspiradora/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_ASPIRADORA - 0.3, INICIO_LOGO_ASPIRADORA + 0.7, DURACION_ASPIRADORA_S - 1.5, DURACION_ASPIRADORA_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {/* Zumbido del motor: arranca con el vídeo y vuelve cuando se ve el ventilador */}
      <Sequence name="Motor" durationInFrames={Math.round(T.parece * fps)}>
        <Audio
          src={staticFile("audio/aspiradora/motor.wav")}
          volume={(f) => interpolate(f / fps, [0, 0.3, T.parece - 1, T.parece], [0, 0.12, 0.12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      </Sequence>
      <Sequence name="Motor (ventilador)" from={Math.round((T.ventilador - 0.3) * fps)} durationInFrames={Math.round((T.fuera - T.ventilador + 0.3) * fps)}>
        <Audio
          src={staticFile("audio/aspiradora/motor.wav")}
          volume={(f) => interpolate(f / fps, [0, 0.5, T.fuera - T.ventilador - 0.7, T.fuera - T.ventilador + 0.3], [0, 0.09, 0.09, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      </Sequence>
      {[T.kilo, T.veinte, T.dosKilos, T.calcetin].map((tc) => (
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
