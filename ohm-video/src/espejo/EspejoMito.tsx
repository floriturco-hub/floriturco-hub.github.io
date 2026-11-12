import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Cierre, Gancho, MediaVuelta, MismoLado, Profundidad, Prueba, Retrovisor, T } from "./Escenas";

export const INICIO_LOGO_ESPEJO = T.fin + 0.5;
export const DURACION_ESPEJO_S = INICIO_LOGO_ESPEJO + 6.5;
const D = INICIO_LOGO_ESPEJO - 61.5;

export const EspejoMito: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Gancho: adelante por atrás" desde={0} hasta={T.levanta}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Mismo lado" desde={T.levanta} hasta={T.invierte}>
        {(t0) => <MismoLado t0={t0} />}
      </Escena>
      <Escena nombre="Profundidad" desde={T.invierte} hasta={T.entonces}>
        {(t0) => <Profundidad t0={t0} />}
      </Escena>
      <Escena nombre="Media vuelta" desde={T.entonces} hasta={T.prueba}>
        {(t0) => <MediaVuelta t0={t0} />}
      </Escena>
      <Escena nombre="Prueba del plástico" desde={T.prueba} hasta={T.ambulancias}>
        {(t0) => <Prueba t0={t0} />}
      </Escena>
      <Escena nombre="Ambulancia" desde={T.ambulancias} hasta={T.final}>
        {(t0) => <Retrovisor t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.final} hasta={INICIO_LOGO_ESPEJO}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_ESPEJO} hasta={DURACION_ESPEJO_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_ESPEJO} />}
      </Escena>

      {/* Etiquetas-clave: 2-4 palabras */}
      <Etiqueta texto="¿Izquierda por derecha?" desde={0.15} hasta={T.adelante - 0.1} y={1600} x={600} color={C.white} tamano={48} />
      <Etiqueta texto="Adelante por atrás" desde={T.adelante} hasta={T.levanta - 0.1} y={1600} x={600} color={C.yellow} tamano={60} />
      <Etiqueta texto="Mismo lado" desde={T.mismo} hasta={T.cabeza - 0.1} y={1600} x={600} color={C.yellow} />
      <Etiqueta texto="Arriba sigue arriba" desde={T.cabeza} hasta={T.invierte - 0.1} y={1600} x={600} color={C.cyan} />
      <Etiqueta texto="Se invierte la profundidad" desde={T.invierte + 0.3} hasta={T.entonces - 0.1} y={1600} color={C.cyan} />
      <Etiqueta texto="¿Por qué parece que cambia?" desde={T.entonces + 0.8} hasta={T.porque - 0.1} y={1600} color={C.white} />
      <Etiqueta texto="Media vuelta" desde={T.vuelta} hasta={T.suDerecha - 0.1} y={1600} color={C.orange} />
      <Etiqueta texto="El giro lo pone tu cerebro" desde={T.giro} hasta={T.prueba - 0.1} y={1600} color={C.yellow} />
      <Etiqueta texto="Se lee perfecto" desde={T.lee} hasta={T.papel - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="El giro invierte las letras" desde={T.invierteLetras} hasta={T.ambulancias - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Escrita al revés" desde={T.reves} hasta={T.retrovisor - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Se lee en el retrovisor" desde={T.retrovisor} hasta={T.final - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="No cambia tus lados" desde={T.lados} hasta={T.miras - 0.1} y={1600} color={C.white} />
      <Etiqueta texto="Cambia hacia dónde miras" desde={T.miras} hasta={T.fin + 0.4} y={1600} color={C.yellow} tamano={60} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/espejo/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_ESPEJO - 0.3, INICIO_LOGO_ESPEJO + 0.7, DURACION_ESPEJO_S - 1.5, DURACION_ESPEJO_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.adelante, T.mismo, T.vuelta + 0.5, T.invierteLetras, T.miras].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={0.45} />
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
