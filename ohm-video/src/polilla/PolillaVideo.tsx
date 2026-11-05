import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { PolillaMundo } from "./Polilla";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_POLILLA = T.fin + 0.5;
export const DURACION_POLILLA_S = INICIO_LOGO_POLILLA + 6.5;
const D = INICIO_LOGO_POLILLA - 61.5;

// Una sola escena-mundo (bosque de noche con la polilla, borde aire-vidrio, ojo al microscopio y paneles solares) recorrida con la cámara
export const PolillaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Bosque y microscopio" desde={0} hasta={INICIO_LOGO_POLILLA}>
        {(t0) => (
          <>
            <PolillaMundo t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_POLILLA} hasta={DURACION_POLILLA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_POLILLA} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Estos ojos no reflejan nada!" desde={-0.4} hasta={T.luz - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="Del aire al vidrio…" desde={T.luz} hasta={T.rebota - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Una parte rebota" desde={T.rebota} hasta={T.ventanas - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Reflejos en ventanas" desde={T.ventanas} hasta={T.polillas - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Ojos de polilla" desde={T.polillas} hasta={T.casiNo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Casi no reflejan" desde={T.casiNo} hasta={T.microscopio - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Al microscopio" desde={T.microscopio} hasta={T.bultitos - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Bultitos diminutos" desde={T.bultitos} hasta={T.pequenos - 0.1} y={1660} color={C.purpleLight} />
      <Etiqueta texto="Menores que la onda" desde={T.pequenos} hasta={T.paraLuz - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="No hay borde brusco" desde={T.paraLuz} hasta={T.rampa - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Una rampa suave" desde={T.rampa} hasta={T.sinBorde - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Casi sin reflejo" desde={T.sinBorde} hasta={T.gana - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Gana dos veces" desde={T.gana} hasta={T.atrapa - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Más luz para ver" desde={T.atrapa} hasta={T.noBrillan - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Ojos que no la delatan" desde={T.noBrillan} hasta={T.hoy - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Lo copiamos" desde={T.hoy} hasta={T.paneles - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Paneles y pantallas" desde={T.paneles} hasta={T.final - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Invisibles a la luz" desde={T.final} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/polilla-antirreflejo/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_POLILLA - 0.3, INICIO_LOGO_POLILLA + 0.7, DURACION_POLILLA_S - 1.5, DURACION_POLILLA_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.rebota, T.rampa, T.absorban].map((tc) => (
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
