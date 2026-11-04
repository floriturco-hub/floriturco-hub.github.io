import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { CamaronMundo } from "./Camaron";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_CAMARON = T.fin + 0.5;
export const DURACION_CAMARON_S = INICIO_LOGO_CAMARON + 6.5;
const D = INICIO_LOGO_CAMARON - 61.5;

// Una sola escena-mundo (arrecife, brazo por dentro, cavitación y gráfica de los dos golpes) recorrida con la cámara
export const CamaronVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Arrecife y brazo" desde={0} hasta={INICIO_LOGO_CAMARON}>
        {(t0) => (
          <>
            <CamaronMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_CAMARON} hasta={DURACION_CAMARON_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_CAMARON} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Este camarón hace hervir el agua!" desde={-0.4} hasta={T.mantis - 0.1} y={1660} color={C.yellow} tamano={46} />
      <Etiqueta texto="Camarón mantis" desde={T.mantis} hasta={T.dedo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Como tu dedo" desde={T.dedo} hasta={T.golpe - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Acelera como una bala" desde={T.golpe} hasta={T.ochenta - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="80 km/h bajo el agua" desde={T.ochenta} hasta={T.menos - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="En 0,003 s" desde={T.menos} hasta={T.como - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Músculos lentos" desde={T.como} hasta={T.trampa - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Hace trampa" desde={T.trampa} hasta={T.carga - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Carga un resorte" desde={T.carga} hasta={T.pestillo - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Un pestillo lo bloquea" desde={T.pestillo} hasta={T.soltar - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Al soltarlo: ¡pum!" desde={T.soltar} hasta={T.catapulta - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Como una catapulta" desde={T.catapulta} hasta={T.mazo - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Mazo ultrarrápido" desde={T.mazo} hasta={T.presion - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Presión muy baja" desde={T.presion} hasta={T.hierve - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Hierve sin calentarse" desde={T.hierve} hasta={T.burbuja - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Burbuja de vapor" desde={T.burbuja} hasta={T.revienta - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="La burbuja revienta" desde={T.revienta} hasta={T.luz - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Destello de luz" desde={T.luz} hasta={T.miles - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Miles de grados" desde={T.miles} hasta={T.dos - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Dos golpes" desde={T.dos} hasta={T.mazo2 - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Mazo + burbuja" desde={T.mazo2} hasta={T.vidrio - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="¡Rompe vidrio!" desde={T.vidrio} hasta={T.fin + 0.4} y={1660} color={C.red} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/camaron-mantis/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_CAMARON - 0.3, INICIO_LOGO_CAMARON + 0.7, DURACION_CAMARON_S - 1.5, DURACION_CAMARON_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[0.35, 1.35, T.pum, T.revienta, T.vidrio + 0.3].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.7 : 0.5} />
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
