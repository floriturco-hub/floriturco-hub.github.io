import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { BracketsMundo } from "./Brackets";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_BRACKETS = T.fin + 0.5;
export const DURACION_BRACKETS_S = INICIO_LOGO_BRACKETS + 6.5;
const D = INICIO_LOGO_BRACKETS - 61.5;

// Una sola escena-mundo (dientes con brackets de frente y un diente en corte dentro del hueso) recorrida con la cámara
export const BracketsVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Dientes y hueso" desde={0} hasta={INICIO_LOGO_BRACKETS}>
        {(t0) => (
          <>
            <BracketsMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_BRACKETS} hasta={DURACION_BRACKETS_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_BRACKETS} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Tus dientes atraviesan hueso sólido!" desde={-0.4} hasta={T.noCaen - 0.1} y={1660} color={C.yellow} tamano={44} />
      <Etiqueta texto="Y no se caen" desde={T.noCaen} hasta={T.secreto - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¿El secreto?" desde={T.secreto} hasta={T.noPegados - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="No están pegados" desde={T.noPegados} hasta={T.cuelga - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Cuelgan en su hueco" desde={T.cuelga} hasta={T.fibras - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Miles de fibras" desde={T.fibras} hasta={T.ligamento - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Ligamento periodontal" desde={T.ligamento} hasta={T.hamaca - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Como una hamaca" desde={T.hamaca} hasta={T.brackets - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Brackets: agarraderas" desde={T.brackets} hasta={T.alambre - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="El alambre trabaja" desde={T.alambre} hasta={T.empuja - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Empuja el diente" desde={T.empuja} hasta={T.suave - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Suave, sin parar" desde={T.suave} hasta={T.unLado - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Un lado se aprieta" desde={T.unLado} hasta={T.osteoclastos - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Osteoclastos" desde={T.osteoclastos} hasta={T.disuelven - 0.1} y={1660} color={C.purpleLight} />
      <Etiqueta texto="Disuelven hueso" desde={T.disuelven} hasta={T.otroLado - 0.1} y={1660} color={C.purpleLight} />
      <Etiqueta texto="El otro se estira" desde={T.otroLado} hasta={T.osteoblastos - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Osteoblastos" desde={T.osteoblastos} hasta={T.nuevo - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Hueso nuevo detrás" desde={T.nuevo} hasta={T.avanza - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="≈ 1 mm al mes" desde={T.avanza} hasta={T.hueco - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="El hueco viaja" desde={T.hueco} hasta={T.retenedor - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Por eso, retenedor" desde={T.retenedor} hasta={T.endureciendo - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Hueso aún blando" desde={T.endureciendo} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/brackets-hueso/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_BRACKETS - 0.3, INICIO_LOGO_BRACKETS + 0.7, DURACION_BRACKETS_S - 1.5, DURACION_BRACKETS_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.empuja, T.disuelven, T.nuevo].map((tc) => (
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
