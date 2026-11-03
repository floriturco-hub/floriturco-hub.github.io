import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Mano } from "./Mano";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_DEDOS = T.fin + 0.5;
export const DURACION_DEDOS_S = INICIO_LOGO_DEDOS + 6.5;
const D = INICIO_LOGO_DEDOS - 61.5;

// Una sola escena-mundo (mano en el agua, corte de la yema y neumático) recorrida con la cámara
export const DedosVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Mano en el agua" desde={0} hasta={INICIO_LOGO_DEDOS}>
        {(t0) => (
          <>
            <Mano t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_DEDOS} hasta={DURACION_DEDOS_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_DEDOS} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera ya está en el primer fotograma (gancho) */}
      <Etiqueta texto="¿Agua? No: nervios" desde={-0.4} hasta={T.parece - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="¿Como una esponja?" desde={T.esponja - 0.3} hasta={T.pista - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Nervio dañado: lisa" desde={T.noArruga} hasta={T.medicos - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Prueba médica" desde={T.medicos + 0.3} hasta={T.pasa - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Unos 5 minutos" desde={T.cinco} hasta={T.nervioso - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Vasos más estrechos" desde={T.estrecha} hasta={T.volumen - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Menos volumen" desde={T.volumen} hasta={T.arrugas - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="La piel se pliega" desde={T.arrugas} hasta={T.manos - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Solo manos y pies" desde={T.gruesa} hasta={T.sirve - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Como un neumático" desde={T.neumatico + 0.6} hasta={T.experimentos - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Se discute" desde={T.discute - 0.2} hasta={T.curioso - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Siempre el mismo patrón" desde={T.patron} hasta={T.final - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="No es piel empapada" desde={T.final} hasta={T.preparandose - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Preparándose para el agua" desde={T.preparandose} hasta={T.fin + 0.4} y={1660} color={C.yellow} tamano={48} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/dedos-arrugados/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_DEDOS - 0.3, INICIO_LOGO_DEDOS + 0.7, DURACION_DEDOS_S - 1.5, DURACION_DEDOS_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.nervios, T.noArruga, T.estrecha, T.arrugas, T.preparandose].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc === T.nervios ? 0.6 : 0.4} />
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
