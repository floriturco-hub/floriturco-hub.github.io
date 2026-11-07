import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Artesania, Automatico, Comparacion, Cuarzo, Diferencia } from "./Escenas";
import { ORO } from "./Piezas";
import { T } from "./tiempos";

export const INICIO_LOGO_RELOJ = T.fin + 0.5;
export const DURACION_RELOJ_S = INICIO_LOGO_RELOJ + 6.5;
const D = INICIO_LOGO_RELOJ - 61.5;

export const RelojCuarzo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Cuarzo vs automático" desde={0} hasta={T.cuarzo}>
        {(t0) => <Comparacion t0={t0} fase="intro" />}
      </Escena>
      <Escena nombre="Movimiento de cuarzo" desde={T.cuarzo} hasta={T.rolex}>
        {(t0) => <Cuarzo t0={t0} />}
      </Escena>
      <Escena nombre="Movimiento automático" desde={T.rolex} hasta={T.diferencia}>
        {(t0) => <Automatico t0={t0} />}
      </Escena>
      <Escena nombre="La diferencia" desde={T.diferencia} hasta={T.cuesta}>
        {(t0) => <Diferencia t0={t0} />}
      </Escena>
      <Escena nombre="Por qué cuesta tanto" desde={T.cuesta} hasta={T.final}>
        {(t0) => <Artesania t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.final} hasta={INICIO_LOGO_RELOJ}>
        {(t0) => <Comparacion t0={t0} fase="final" />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_RELOJ} hasta={DURACION_RELOJ_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_RELOJ} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="¿El barato, más preciso?" desde={T.preciso + 0.4} hasta={T.cuarzo - 0.2} y={1500} color={C.yellow} />
      <Etiqueta texto="Pila y circuito" desde={T.pila} hasta={T.cristal - 0.1} y={1640} color={C.cyan} />
      <Etiqueta texto="Cristal de cuarzo" desde={T.cristal} hasta={T.vibra - 0.1} y={1640} />
      <Etiqueta texto="Vibra al recibir corriente" desde={T.vibra} hasta={T.cuenta - 0.1} y={1640} color={C.cyan} />
      <Etiqueta texto="Un pulso por segundo" desde={T.pulso} hasta={T.tic + 0.6} y={1640} color={C.yellow} />
      <Etiqueta texto="Sin pila" desde={T.rolex + 0.6} hasta={T.muneca - 0.1} y={1640} color={ORO} />
      <Etiqueta texto="La pesa tensa el muelle" desde={T.pesa} hasta={T.golpe - 0.1} y={1640} color={ORO} />
      <Etiqueta texto="El escape lo frena" desde={T.escape} hasta={T.cuatro - 0.1} y={1640} color={C.cyan} />
      <Etiqueta texto="Avanza poco a poco" desde={T.engranajes} hasta={T.desliza - 0.1} y={1640} />
      <Etiqueta texto="El segundero se desliza" desde={T.desliza} hasta={T.diferencia - 0.1} y={1640} color={ORO} />
      <Etiqueta texto="Más rápido, más estable" desde={T.late + 0.4} hasta={T.golpes - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Golpes, calor, posición" desde={T.golpes} hasta={T.desvia - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Ajustada a mano" desde={T.maquina + 0.6} hasta={T.sinPila - 0.1} y={1600} color={ORO} />
      <Etiqueta texto="Sin una sola pila" desde={T.sinPila} hasta={T.final - 0.1} y={1600} color={ORO} />
      <Etiqueta texto="Pagas mecánica" desde={T.final + 1.0} hasta={T.fin + 0.4} y={1500} color={C.yellow} tamano={64} />

      {/* Sonido: esquema aprobado + tic del segundero */}
      <Audio src={staticFile("audio/reloj/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_RELOJ - 0.3, INICIO_LOGO_RELOJ + 0.7, DURACION_RELOJ_S - 1.5, DURACION_RELOJ_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[0, 1].map((k) => T.salto + k * 1.1).map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={0.5} />
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
