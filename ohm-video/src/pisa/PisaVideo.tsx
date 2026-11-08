import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { PisaMundo } from "./Pisa";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_PISA = T.fin + 0.5;
export const DURACION_PISA_S = INICIO_LOGO_PISA + 6.5;
const D = INICIO_LOGO_PISA - 61.5;

// Una sola escena-mundo (torre de Pisa sobre el suelo en corte con su centro de gravedad y un bloque que vuelca) recorrida con la cámara
export const PisaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Torre y suelo" desde={0} hasta={INICIO_LOGO_PISA}>
        {(t0) => (
          <>
            <PisaMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_PISA} hasta={DURACION_PISA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_PISA} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Esta torre debería haberse caído!" desde={-0.4} hasta={T.torre - 0.1} y={1660} color={C.yellow} tamano={46} />
      <Etiqueta texto="Torre de Pisa" desde={T.torre} hasta={T.anio - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="1178: solo 3 pisos" desde={T.anio} hasta={T.suelo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Arcilla blanda: cedió" desde={T.suelo} hasta={T.guerras - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Obra parada ≈ 100 años" desde={T.guerras} hasta={T.pausa - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="La pausa la salvó" desde={T.pausa} hasta={T.compacto - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="La tierra se compactó" desde={T.compacto} hasta={T.seguir - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Pisos corregidos" desde={T.seguir} hasta={T.curvada - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Curvada como un plátano" desde={T.curvada} hasta={T.vuelca - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="¿Por qué no vuelca?" desde={T.vuelca} hasta={T.vertical - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Centro de gravedad" desde={T.vertical} hasta={T.base - 0.1} y={1660} color="#48C878" />
      <Etiqueta texto="Dentro de la base" desde={T.base} hasta={T.saliera - 0.1} y={1660} color="#48C878" />
      <Etiqueta texto="Si sale… se cae" desde={T.saliera} hasta={T.anio1990 - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="1990: al límite" desde={T.anio1990} hasta={T.ingenieros - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Sacan tierra al norte" desde={T.ingenieros} hasta={T.enderezo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Se endereza 40 cm" desde={T.enderezo} hasta={T.hoy - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Estable dos siglos" desde={T.hoy} hasta={T.final - 0.1} y={1660} color="#48C878" />
      <Etiqueta texto="Centro de gravedad: dentro" desde={T.final} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={48} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/torre-pisa/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_PISA - 0.3, INICIO_LOGO_PISA + 0.7, DURACION_PISA_S - 1.5, DURACION_PISA_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.cedio, T.caeria, T.enderezo].map((tc) => (
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
