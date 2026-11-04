import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { PastillaMundo } from "./Pastilla";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_PASTILLA = T.fin + 0.5;
export const DURACION_PASTILLA_S = INICIO_LOGO_PASTILLA + 6.5;
const D = INICIO_LOGO_PASTILLA - 61.5;

// Una sola escena-mundo (persona con los vasos en rayos X, célula irritada y pie contra cabeza) recorrida con la cámara
export const PastillaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Cuerpo y célula" desde={0} hasta={INICIO_LOGO_PASTILLA}>
        {(t0) => (
          <>
            <PastillaMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_PASTILLA} hasta={DURACION_PASTILLA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_PASTILLA} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Tu pastilla no sabe dónde duele!" desde={-0.4} hasta={T.tomas - 0.1} y={1660} color={C.yellow} tamano={46} />
      <Etiqueta texto="Tomas un ibuprofeno" desde={T.tomas} hasta={T.estomago - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Se disuelve" desde={T.estomago} hasta={T.sangre - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="A la sangre" desde={T.sangre} hasta={T.viaja - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Por todo tu cuerpo" desde={T.viaja} hasta={T.pie - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Pie, mano, hígado…" desde={T.pie} hasta={T.cabeza - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="…y la cabeza" desde={T.cabeza} hasta={T.entonces - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="¿Por qué solo ahí?" desde={T.entonces} hasta={T.donde - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Donde algo se irrita" desde={T.donde} hasta={T.prosta - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Prostaglandinas" desde={T.prosta} hasta={T.sensibles - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Nervios más sensibles" desde={T.sensibles} hasta={T.griten - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="¡Gritan más fuerte!" desde={T.griten} hasta={T.fabricarlas - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="La enzima COX" desde={T.fabricarlas} hasta={T.ibu - 0.1} y={1660} color={C.purpleLight} />
      <Etiqueta texto="El ibuprofeno la tapa" desde={T.ibu} hasta={T.chicle - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Chicle en la cerradura" desde={T.chicle} hasta={T.resto - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Resto: nada que tapar" desde={T.resto} hasta={T.duele - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Donde duele: silencio" desde={T.duele} hasta={T.noApunta - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="No apunta" desde={T.noApunta} hasta={T.todas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Está en todas partes" desde={T.todas} hasta={T.soloNota - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Se nota donde duele" desde={T.soloNota} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/pastilla-dolor/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_PASTILLA - 0.3, INICIO_LOGO_PASTILLA + 0.7, DURACION_PASTILLA_S - 1.5, DURACION_PASTILLA_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[0.3, T.bloquea, T.volumen].map((tc) => (
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
