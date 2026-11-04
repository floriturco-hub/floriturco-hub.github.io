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
  Carrete,
  Centrifuga,
  Cierre,
  Frenazo,
  Gancho,
  Tiron,
  T,
} from "./Escenas";

export const INICIO_LOGO_CINTURON = T.fin + 0.5;
export const DURACION_CINTURON_S = INICIO_LOGO_CINTURON + 6.5;
const D = INICIO_LOGO_CINTURON - 61.5;

export const CinturonBloqueo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: una bolita" desde={0} hasta={T.carrete}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Carrete" desde={T.carrete} hasta={T.frenazo}>
        {(t0) => <Carrete t0={t0} />}
      </Escena>
      <Escena nombre="Frenazo" desde={T.frenazo} hasta={T.segundo}>
        {(t0) => <Frenazo t0={t0} />}
      </Escena>
      <Escena nombre="Centrífuga" desde={T.segundo} hasta={T.tiron}>
        {(t0) => <Centrifuga t0={t0} />}
      </Escena>
      <Escena nombre="Tirón" desde={T.tiron} hasta={T.newton}>
        {(t0) => <Tiron t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.newton} hasta={INICIO_LOGO_CINTURON}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena
        nombre="Logo"
        desde={INICIO_LOGO_CINTURON}
        hasta={DURACION_CINTURON_S}
      >
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_CINTURON} />}
      </Escena>

      <Etiqueta
        texto="¡Una bolita te salva la vida!"
        desde={0}
        hasta={T.despacio - 0.1}
        y={1560}
        color={C.yellow}
        tamano={52}
      />
      <Etiqueta
        texto="Despacio: sale"
        desde={T.despacio}
        hasta={T.frena - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Frenazo: se bloquea"
        desde={T.frena}
        hasta={T.cables - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="Sin cables ni sensores"
        desde={T.cables}
        hasta={T.carrete - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Rueda dentada"
        desde={T.rueda}
        hasta={T.bolita - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Una bolita de acero"
        desde={T.bolita}
        hasta={T.frenazo - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Por inercia, sigue"
        desde={T.inercia}
        hasta={T.palanquita - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Empuja la palanca"
        desde={T.palanquita}
        hasta={T.trabado - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Carrete trabado"
        desde={T.trabado}
        hasta={T.segundo - 0.1}
        y={1560}
        color={C.red}
        tamano={56}
      />
      <Etiqueta
        texto="Segundo seguro"
        desde={T.segundo}
        hasta={T.centrifuga - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Fuerza centrífuga"
        desde={T.centrifuga}
        hasta={T.tiron - 0.1}
        y={1560}
        color={C.orange}
      />
      <Etiqueta
        texto="Un tirón brusco lo traba"
        desde={T.tiron}
        hasta={T.newton - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Newton, en tu hombro"
        desde={T.newton}
        hasta={T.fin + 0.4}
        y={1560}
        color={C.yellow}
        tamano={56}
      />

      <Audio src={staticFile("audio/cinturon/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [
              0,
              1.5,
              INICIO_LOGO_CINTURON - 0.3,
              INICIO_LOGO_CINTURON + 0.7,
              DURACION_CINTURON_S - 1.5,
              DURACION_CINTURON_S,
            ],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[
        T.bloquea,
        T.bolita,
        T.trabado,
        T.centrifuga,
        T.tiron + 0.6,
        T.newton,
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
