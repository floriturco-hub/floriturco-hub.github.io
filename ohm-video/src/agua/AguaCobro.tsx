import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Casa, Cobro, Interior } from "./Escenas";
import { T } from "./tiempos";

export const INICIO_LOGO_AGUA = T.fin + 0.5;
export const DURACION_AGUA_S = INICIO_LOGO_AGUA + 6.5;
const D = INICIO_LOGO_AGUA - 61.5;

export const AguaCobro: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Grifo y tubería" desde={0} hasta={T.medidor}>
        {(t0) => <Casa t0={t0} fase="intro" />}
      </Escena>
      <Escena nombre="Dentro del medidor" desde={T.medidor} hasta={T.mes}>
        {(t0) => <Interior t0={t0} fase="medidor" />}
      </Escena>
      <Escena nombre="Lectura, tramos y factura" desde={T.mes} hasta={T.truco}>
        {(t0) => <Cobro t0={t0} />}
      </Escena>
      <Escena nombre="Fuga" desde={T.truco} hasta={T.final}>
        {(t0) => <Casa t0={t0} fase="fuga" />}
      </Escena>
      <Escena nombre="Cierre" desde={T.final} hasta={INICIO_LOGO_AGUA}>
        {(t0) => <Interior t0={t0} fase="final" />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_AGUA} hasta={DURACION_AGUA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_AGUA} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="¿Quién cuenta?" desde={T.quien} hasta={T.aparato - 0.1} y={1640} color={C.yellow} tamano={60} />
      <Etiqueta texto="El medidor" desde={T.aparato + 0.9} hasta={T.medidor + 0.9} y={1700} color={C.yellow} />
      <Etiqueta texto="Turbina" desde={T.turbina + 0.4} hasta={T.vuelta - 0.1} y={1640} color={C.cyan} />
      <Etiqueta texto="Engranajes" desde={T.engranajes} hasta={T.cuenta - 0.1} y={1640} color={C.yellow} />
      <Etiqueta texto="Como un cuentakilómetros" desde={T.cuenta} hasta={T.mil - 0.1} y={1640} />
      <Etiqueta texto="Actual − anterior" desde={T.resta} hasta={T.ejemplo - 0.1} y={1500} color={C.yellow} />
      <Etiqueta texto="Precio por m³" desde={T.precio} hasta={T.tramos - 0.1} y={1660} />
      <Etiqueta texto="Por tramos" desde={T.tramos} hasta={T.baratos - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Más gastas, más caro" desde={T.caro} hasta={T.fijo - 0.5} y={1660} color={C.red} />
      <Etiqueta texto="Cierra todos los grifos" desde={T.cierra} hasta={T.ruedita - 0.1} y={1700} />
      <Etiqueta texto="¿Sigue girando?" desde={T.ruedita} hasta={T.fuga - 0.1} y={1700} color={C.yellow} />
      <Etiqueta texto="Tienes una fuga" desde={T.fuga} hasta={T.final - 0.1} y={1700} color={C.red} />
      <Etiqueta texto="Pagas por cada vuelta" desde={T.final + 1.2} hasta={T.fin + 0.4} y={1700} color={C.yellow} tamano={56} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/agua/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_AGUA - 0.3, INICIO_LOGO_AGUA + 0.7, DURACION_AGUA_S - 1.5, DURACION_AGUA_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.dieciocho, T.impuestos + 0.5, T.fuga].map((tc) => (
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
