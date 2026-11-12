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
  Celulas,
  Cicatrices,
  Donacion,
  Forma,
  Freno,
  Gancho,
  Prometeo,
  T,
} from "./Escenas";

export const INICIO_LOGO_HIGADO = T.fin + 0.5;
export const DURACION_HIGADO_S = INICIO_LOGO_HIGADO + 6.5;
const D = INICIO_LOGO_HIGADO - 61.5;

export const HigadoRegenera: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: 2/3 fuera" desde={0} hasta={T.pero}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="No de la forma que crees" desde={T.pero} hasta={T.tus}>
        {(t0) => <Forma t0={t0} />}
      </Escena>
      <Escena nombre="Hepatocitos" desde={T.tus} hasta={T.curioso}>
        {(t0) => <Celulas t0={t0} />}
      </Escena>
      <Escena nombre="Saben parar" desde={T.curioso} hasta={T.donacion}>
        {(t0) => <Freno t0={t0} />}
      </Escena>
      <Escena nombre="Donación en vida" desde={T.donacion} hasta={T.griegos}>
        {(t0) => <Donacion t0={t0} />}
      </Escena>
      <Escena nombre="Prometeo" desde={T.griegos} hasta={T.eso}>
        {(t0) => <Prometeo t0={t0} />}
      </Escena>
      <Escena nombre="Cicatrices" desde={T.eso} hasta={INICIO_LOGO_HIGADO}>
        {(t0) => <Cicatrices t0={t0} />}
      </Escena>
      <Escena
        nombre="Logo"
        desde={INICIO_LOGO_HIGADO}
        hasta={DURACION_HIGADO_S}
      >
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_HIGADO} />}
      </Escena>

      <Etiqueta
        texto="Te quitan 2/3 del hígado"
        desde={0.15}
        hasta={T.semanas - 0.1}
        y={1560}
        color={C.white}
        tamano={50}
      />
      <Etiqueta
        texto="Y vuelve a su tamaño"
        desde={T.semanas}
        hasta={T.pero - 0.1}
        y={1560}
        color={C.yellow}
        tamano={56}
      />
      <Etiqueta
        texto="Pero no como crees"
        desde={T.pero}
        hasta={T.trozo - 0.1}
        y={1560}
        color={C.red}
        tamano={56}
      />
      <Etiqueta
        texto="Lo cortado no vuelve"
        desde={T.trozo}
        hasta={T.queda - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Lo que queda crece"
        desde={T.queda}
        hasta={T.tus - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Hepatocitos en reposo"
        desde={T.hepatocitos}
        hasta={T.falta - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Señales de alarma"
        desde={T.alarma}
        hasta={T.despiertan - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Despiertan"
        desde={T.despiertan}
        hasta={T.copian - 0.1}
        y={1560}
        color={C.orange}
      />
      <Etiqueta
        texto="Copian su ADN y se dividen"
        desde={T.copian}
        hasta={T.basta - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Una o dos veces basta"
        desde={T.basta}
        hasta={T.curioso - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Saben cuándo parar"
        desde={T.parar}
        hasta={T.frenan - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Ni un gramo de más"
        desde={T.gramo}
        hasta={T.donacion - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Donación en vida"
        desde={T.donacion}
        hasta={T.meses - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Dos hígados completos"
        desde={T.tanto}
        hasta={T.griegos - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="De día se lo comía"
        desde={T.prometeo}
        hasta={T.noche - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="De noche volvía a crecer"
        desde={T.noche}
        hasta={T.eso - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Con cicatrices, no"
        desde={T.cicatrices}
        hasta={T.pierde - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="Pierde el superpoder"
        desde={T.pierde}
        hasta={T.fin + 0.4}
        y={1560}
        color={C.red}
        tamano={52}
      />

      <Audio src={staticFile("audio/higado/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [
              0,
              1.5,
              INICIO_LOGO_HIGADO - 0.3,
              INICIO_LOGO_HIGADO + 0.7,
              DURACION_HIGADO_S - 1.5,
              DURACION_HIGADO_S,
            ],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[
        T.dos + 0.5,
        T.trozo + 1.3,
        T.despiertan,
        T.frenan,
        T.noche,
        T.pierde,
      ].map((tc) => (
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
