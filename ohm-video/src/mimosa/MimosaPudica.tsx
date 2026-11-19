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
  Cierre,
  Defensa,
  Demo,
  Desinfla,
  Experimento,
  Gancho,
  Pulvinulos,
  Reabre,
  Senal,
  T,
} from "./Escenas";

export const INICIO_LOGO_MIMOSA = T.fin + 0.5;
export const DURACION_MIMOSA_S = INICIO_LOGO_MIMOSA + 6.5;
const D = INICIO_LOGO_MIMOSA - 61.5;

export const MimosaPudica: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: se desmaya" desde={0} hasta={T.roza}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Demostración" desde={T.roza} hasta={T.musculos}>
        {(t0) => <Demo t0={t0} />}
      </Escena>
      <Escena nombre="Pulvínulos" desde={T.musculos} hasta={T.cuando}>
        {(t0) => <Pulvinulos t0={t0} />}
      </Escena>
      <Escena nombre="Señal eléctrica" desde={T.cuando} hasta={T.llegar}>
        {(t0) => <Senal t0={t0} />}
      </Escena>
      <Escena nombre="Se desinflan" desde={T.llegar} hasta={T.despues}>
        {(t0) => <Desinfla t0={t0} />}
      </Escena>
      <Escena nombre="Se reabre" desde={T.despues} hasta={T.paraQue}>
        {(t0) => <Reabre t0={t0} />}
      </Escena>
      <Escena nombre="Defensa" desde={T.paraQue} hasta={T.loco}>
        {(t0) => <Defensa t0={t0} />}
      </Escena>
      <Escena nombre="Experimento" desde={T.loco} hasta={T.sinCerebro}>
        {(t0) => <Experimento t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.sinCerebro} hasta={INICIO_LOGO_MIMOSA}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena
        nombre="Logo"
        desde={INICIO_LOGO_MIMOSA}
        hasta={DURACION_MIMOSA_S}
      >
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_MIMOSA} />}
      </Escena>

      <Etiqueta
        texto="¡Se desmaya si la tocas!"
        desde={0}
        hasta={T.mimosa - 0.1}
        y={1560}
        color={C.yellow}
        tamano={60}
      />
      <Etiqueta
        texto="Mimosa pudica"
        desde={T.mimosa}
        hasta={T.roza - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Pliega todas sus hojas"
        desde={T.pliega}
        hasta={T.rama - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Y la rama cae"
        desde={T.rama}
        hasta={T.musculos - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="No tiene músculos"
        desde={T.musculos}
        hasta={T.pulvinulos - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="Pulvínulos"
        desde={T.pulvinulos}
        hasta={T.globos - 0.1}
        y={1560}
        color={C.yellow}
        tamano={56}
      />
      <Etiqueta
        texto="Células como globos"
        desde={T.globos}
        hasta={T.cuando - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Una señal eléctrica"
        desde={T.senal}
        hasta={T.llegar - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Sale el potasio"
        desde={T.potasio}
        hasta={T.agua - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="El agua sale detrás"
        desde={T.agua}
        hasta={T.desinflan - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Se desinflan y se dobla"
        desde={T.desinflan}
        hasta={T.despues - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="En minutos se abre"
        desde={T.abre}
        hasta={T.paraQue - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="¿Para qué?"
        desde={T.paraQue}
        hasta={T.marchita - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Parece marchita y con espinas"
        desde={T.espinas}
        hasta={T.loco - 0.1}
        y={1560}
        color="#E8705A"
        tamano={42}
      />
      <Etiqueta
        texto="La dejaban caer sin daño"
        desde={T.caer}
        hasta={T.cerrarse - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Dejó de cerrarse"
        desde={T.cerrarse}
        hasta={T.semanas - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Y lo recordó semanas"
        desde={T.semanas}
        hasta={T.sinCerebro - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Sin cerebro, y aprende"
        desde={T.sinCerebro}
        hasta={T.fin + 0.4}
        y={1560}
        color={C.yellow}
        tamano={56}
      />

      <Audio src={staticFile("audio/mimosa/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [
              0,
              1.5,
              INICIO_LOGO_MIMOSA - 0.3,
              INICIO_LOGO_MIMOSA + 0.7,
              DURACION_MIMOSA_S - 1.5,
              DURACION_MIMOSA_S,
            ],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[0.35, T.pliega, T.senal, T.desinflan, T.cerrarse, T.aprende].map(
        (tc) => (
          <Sequence
            key={tc}
            name="Tic"
            from={Math.round(tc * fps)}
            durationInFrames={Math.round(0.3 * fps)}
          >
            <Audio src={staticFile("audio/choque.wav")} volume={0.45} />
          </Sequence>
        ),
      )}
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
