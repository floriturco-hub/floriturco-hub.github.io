import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import {
  Camaras,
  Cierre,
  Db,
  Gancho,
  Gases,
  NoBorra,
  Suprime,
  T,
} from "./Escenas";

export const INICIO_LOGO_SILEN = T.fin + 0.5;
export const DURACION_SILEN_S = INICIO_LOGO_SILEN + 6.5;
const D = INICIO_LOGO_SILEN - 61.5;

export const Silenciador: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: piu" desde={0} hasta={T.disparo}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Decibelios" desde={T.disparo} hasta={T.dentro}>
        {(t0) => <Db t0={t0} />}
      </Escena>
      <Escena nombre="Gases" desde={T.dentro} hasta={T.tubo}>
        {(t0) => <Gases t0={t0} />}
      </Escena>
      <Escena nombre="Cámaras" desde={T.tubo} hasta={T.dos}>
        {(t0) => <Camaras t0={t0} />}
      </Escena>
      <Escena nombre="Lo que no borra" desde={T.dos} hasta={T.supresor}>
        {(t0) => <NoBorra t0={t0} />}
      </Escena>
      <Escena nombre="Supresor" desde={T.supresor} hasta={T.susurro}>
        {(t0) => <Suprime t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.susurro} hasta={INICIO_LOGO_SILEN}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_SILEN} hasta={DURACION_SILEN_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_SILEN} />}
      </Escena>

      <Etiqueta
        texto="¡El piu del cine es mentira!"
        desde={0}
        hasta={T.disparo - 0.1}
        y={1560}
        color={C.yellow}
        tamano={54}
      />
      <Etiqueta
        texto="Sin supresor: ~160 dB"
        desde={T.ciento60}
        hasta={T.ciento30 - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="Con supresor: ~130 dB"
        desde={T.ciento30}
        hasta={T.dentro - 0.1}
        y={1560}
        color={C.orange}
      />
      <Etiqueta
        texto="El ruido: los gases"
        desde={T.gases}
        hasta={T.tubo - 0.1}
        y={1560}
        color={C.orange}
      />
      <Etiqueta
        texto="Cámaras que frenan el gas"
        desde={T.camaras}
        hasta={T.menos - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Menos presión, menos ruido"
        desde={T.menos}
        hasta={T.dos - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Chasquido supersónico"
        desde={T.supersonico}
        hasta={T.mecanismo - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Y el mecanismo"
        desde={T.mecanismo}
        hasta={T.supresor - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="No silencia: suprime"
        desde={T.suprime}
        hasta={T.susurro - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="No es un susurro: es un trueno"
        desde={T.susurro}
        hasta={T.fin + 0.4}
        y={1560}
        color={C.orange}
        tamano={46}
      />

      <Audio src={staticFile("audio/silenciador/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [
              0,
              1.5,
              INICIO_LOGO_SILEN - 0.3,
              INICIO_LOGO_SILEN + 0.7,
              DURACION_SILEN_S - 1.5,
              DURACION_SILEN_S,
            ],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[1.0, T.ciento60, T.gases, T.menos, T.chasquido, T.trueno].map((tc) => (
        <Sequence
          key={tc}
          name="Tic"
          from={Math.round(tc * fps)}
          durationInFrames={Math.round(0.3 * fps)}
        >
          <Audio src={staticFile("audio/choque.wav")} volume={0.45} />
        </Sequence>
      ))}
      <Sequence
        name="SFX logo"
        from={Math.round((62.35 + D) * fps)}
        durationInFrames={Math.round(2.9 * fps)}
      >
        <Audio src={staticFile("audio/sfx_logo.wav")} volume={0.7} />
      </Sequence>
      <Sequence
        name="Voz: Frecuencia Cero"
        from={Math.round((63.75 + D) * fps)}
        durationInFrames={Math.round(1.7 * fps)}
      >
        <Audio src={staticFile("audio/frecuencia_cero.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};
