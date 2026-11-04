import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { MoretonMundo } from "./Moreton";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_MORETON = T.fin + 0.5;
export const DURACION_MORETON_S = INICIO_LOGO_MORETON + 6.5;
const D = INICIO_LOGO_MORETON - 61.5;

// Una sola escena-mundo (piel desde arriba con el calendario de colores, piel en corte y macrófago) recorrida con la cámara
export const MoretonVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Piel y macrófago" desde={0} hasta={INICIO_LOGO_MORETON}>
        {(t0) => (
          <>
            <MoretonMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_MORETON} hasta={DURACION_MORETON_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_MORETON} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Tu moretón es un arcoíris químico!" desde={-0.4} hasta={T.golpe - 0.1} y={1660} color={C.yellow} tamano={44} />
      <Etiqueta texto="Un golpe" desde={T.golpe} hasta={T.vasos - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Vasos rotos" desde={T.vasos} hasta={T.sangre - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="La sangre se escapa" desde={T.sangre} hasta={T.roja - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Rojo: con oxígeno" desde={T.roja} hasta={T.horas - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Pierde el oxígeno" desde={T.horas} hasta={T.morada - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Morado, casi azul" desde={T.morada} hasta={T.macrofagos - 0.1} y={1660} color={C.purpleLight} />
      <Etiqueta texto="Llegan los macrófagos" desde={T.macrofagos} hasta={T.comen - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Se comen la sangre" desde={T.comen} hasta={T.primero - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Se rompe el hemo" desde={T.primero} hasta={T.biliverdina - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Biliverdina: verde" desde={T.biliverdina} hasta={T.luego - 0.1} y={1660} color="#6AC84A" />
      <Etiqueta texto="Bilirrubina: amarilla" desde={T.luego} hasta={T.hierro - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Hierro: pigmento marrón" desde={T.hierro} hasta={T.recicla - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Todo se recicla" desde={T.recicla} hasta={T.cada - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Cada color, una etapa" desde={T.cada} hasta={T.dice - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Te dice cuánto falta" desde={T.dice} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/moreton-colores/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_MORETON - 0.3, INICIO_LOGO_MORETON + 0.7, DURACION_MORETON_S - 1.5, DURACION_MORETON_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.golpe + 0.25, T.verde, T.amarilla].map((tc) => (
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
