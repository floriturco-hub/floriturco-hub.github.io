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
import { Atrapa, Cierre, Escape, Flota, Gancho, Licua, T } from "./Escenas";

export const INICIO_LOGO_ARENAS = T.fin + 0.5;
export const DURACION_ARENAS_S = INICIO_LOGO_ARENAS + 6.5;
const D = INICIO_LOGO_ARENAS - 61.5;

export const ArenasMovedizas: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: no te traga" desde={0} hasta={T.mezclada}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Se licua" desde={T.mezclada} hasta={T.densa}>
        {(t0) => <Licua t0={t0} />}
      </Escena>
      <Escena nombre="Flotas" desde={T.densa} hasta={T.peligro}>
        {(t0) => <Flota t0={t0} />}
      </Escena>
      <Escena nombre="Te atrapa" desde={T.peligro} hasta={T.sale}>
        {(t0) => <Atrapa t0={t0} />}
      </Escena>
      <Escena nombre="Cómo salir" desde={T.sale} hasta={T.traga}>
        {(t0) => <Escape t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.traga} hasta={INICIO_LOGO_ARENAS}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena
        nombre="Logo"
        desde={INICIO_LOGO_ARENAS}
        hasta={DURACION_ARENAS_S}
      >
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_ARENAS} />}
      </Escena>

      <Etiqueta
        texto="¡Las arenas movedizas no te tragan!"
        desde={0}
        hasta={T.cine - 0.1}
        y={1560}
        color={C.yellow}
        tamano={46}
      />
      <Etiqueta
        texto="El cine te engañó"
        desde={T.cine}
        hasta={T.mezclada - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Arena + agua"
        desde={T.mezclada}
        hasta={T.vibracion - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Al moverte, se licua"
        desde={T.vibracion}
        hasta={T.densa - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="El doble de densa que tú"
        desde={T.densa}
        hasta={T.corcho - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Flotas como un corcho"
        desde={T.corcho}
        hasta={T.cintura - 0.1}
        y={1560}
        color="#C8905A"
      />
      <Etiqueta
        texto="Hasta la cintura, no más"
        desde={T.cintura}
        hasta={T.peligro - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="El peligro: te atrapa"
        desde={T.peligro}
        hasta={T.fuerza - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="Como levantar un auto"
        desde={T.fuerza}
        hasta={T.sale - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="Piernas despacio"
        desde={T.piernas}
        hasta={T.atras - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Hacia atrás y flota"
        desde={T.atras}
        hasta={T.traga - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="No te traga. Te retiene."
        desde={T.traga}
        hasta={T.fin + 0.4}
        y={1560}
        color={C.yellow}
        tamano={52}
      />

      <Audio src={staticFile("audio/arenas/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [
              0,
              1.5,
              INICIO_LOGO_ARENAS - 0.3,
              INICIO_LOGO_ARENAS + 0.7,
              DURACION_ARENAS_S - 1.5,
              DURACION_ARENAS_S,
            ],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[0.6, T.liquido, T.corcho, T.cemento, T.flota, T.retiene].map((tc) => (
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
