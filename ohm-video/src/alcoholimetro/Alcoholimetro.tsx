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
  Boca,
  Cierre,
  Gancho,
  Largo,
  PilaEscena,
  Proporcion_,
  Pulmon,
  T,
} from "./Escenas";

export const INICIO_LOGO_ALCOHOL = T.fin + 0.5;
export const DURACION_ALCOHOL_S = INICIO_LOGO_ALCOHOL + 6.5;
const D = INICIO_LOGO_ALCOHOL - 61.5;

export const Alcoholimetro: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: tu aliento" desde={0} hasta={T.pulmones}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Pulmón" desde={T.pulmones} hasta={T.proporcion}>
        {(t0) => <Pulmon t0={t0} />}
      </Escena>
      <Escena nombre="Proporción" desde={T.proporcion} hasta={T.largo}>
        {(t0) => <Proporcion_ t0={t0} />}
      </Escena>
      <Escena nombre="Soplido largo" desde={T.largo} hasta={T.pila}>
        {(t0) => <Largo t0={t0} />}
      </Escena>
      <Escena nombre="Pila" desde={T.pila} hasta={T.ojo}>
        {(t0) => <PilaEscena t0={t0} />}
      </Escena>
      <Escena nombre="Alcohol en la boca" desde={T.ojo} hasta={T.habla}>
        {(t0) => <Boca t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.habla} hasta={INICIO_LOGO_ALCOHOL}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena
        nombre="Logo"
        desde={INICIO_LOGO_ALCOHOL}
        hasta={DURACION_ALCOHOL_S}
      >
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_ALCOHOL} />}
      </Escena>

      <Etiqueta
        texto="¡Tu aliento te delata!"
        desde={0}
        hasta={T.soplas - 0.1}
        y={1560}
        color={C.yellow}
        tamano={60}
      />
      <Etiqueta
        texto="Sabe tu alcohol en sangre"
        desde={T.soplas}
        hasta={T.pulmones - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="El truco: tus pulmones"
        desde={T.pulmones}
        hasta={T.evapora - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="El alcohol pasa al aire"
        desde={T.evapora}
        hasta={T.proporcion - 0.1}
        y={1560}
        color="#C8E048"
      />
      <Etiqueta
        texto="Siempre 1 a 2100"
        desde={T.proporcion}
        hasta={T.largo - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Soplido largo"
        desde={T.largo}
        hasta={T.pila - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Pila de combustible"
        desde={T.pila}
        hasta={T.corriente - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Más alcohol, más corriente"
        desde={T.corriente}
        hasta={T.ojo - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Ojo: el enjuague engaña"
        desde={T.ojo}
        hasta={T.esperan - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="Esperan antes de medir"
        desde={T.esperan}
        hasta={T.habla - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Tu aliento habla por tu sangre"
        desde={T.habla}
        hasta={T.fin + 0.4}
        y={1560}
        color={C.yellow}
        tamano={46}
      />

      <Audio src={staticFile("audio/alcoholimetro/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [
              0,
              1.5,
              INICIO_LOGO_ALCOHOL - 0.3,
              INICIO_LOGO_ALCOHOL + 0.7,
              DURACION_ALCOHOL_S - 1.5,
              DURACION_ALCOHOL_S,
            ],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[1.6, T.evapora, T.dosmil, T.corriente, T.boca, T.habla].map((tc) => (
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
