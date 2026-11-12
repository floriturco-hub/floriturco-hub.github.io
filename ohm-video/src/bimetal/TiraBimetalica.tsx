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
  Contacto,
  Curva,
  DilatacionEscena,
  Gancho,
  Perilla,
  T,
  Termostato,
  TiraEscena,
} from "./Escenas";
import { LATON } from "./Piezas";

export const INICIO_LOGO_BIMETAL = T.fin + 0.5;
export const DURACION_BIMETAL_S = INICIO_LOGO_BIMETAL + 6.5;
const D = INICIO_LOGO_BIMETAL - 61.5;

export const TiraBimetalica: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: sin chip" desde={0} hasta={T.tira}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Tira bimetálica" desde={T.tira} hasta={T.calor}>
        {(t0) => <TiraEscena t0={t0} />}
      </Escena>
      <Escena nombre="Dilatación" desde={T.calor} hasta={T.pegados}>
        {(t0) => <DilatacionEscena t0={t0} />}
      </Escena>
      <Escena nombre="Se curva" desde={T.pegados} hasta={T.plancha}>
        {(t0) => <Curva t0={t0} />}
      </Escena>
      <Escena nombre="Contacto" desde={T.plancha} hasta={T.perilla}>
        {(t0) => <Contacto t0={t0} />}
      </Escena>
      <Escena nombre="Perilla" desde={T.perilla} hasta={T.termostatos}>
        {(t0) => <Perilla t0={t0} />}
      </Escena>
      <Escena nombre="Termostato" desde={T.termostatos} hasta={T.sin}>
        {(t0) => <Termostato t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.sin} hasta={INICIO_LOGO_BIMETAL}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena
        nombre="Logo"
        desde={INICIO_LOGO_BIMETAL}
        hasta={DURACION_BIMETAL_S}
      >
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_BIMETAL} />}
      </Escena>

      <Etiqueta
        texto="Ni un solo chip"
        desde={T.chip}
        hasta={T.apagarse - 0.1}
        y={1560}
        color={C.white}
        tamano={54}
      />
      <Etiqueta
        texto="Y sabe cuándo apagarse"
        desde={T.apagarse}
        hasta={T.dos - 0.1}
        y={1560}
        color={C.yellow}
        tamano={52}
      />
      <Etiqueta
        texto="Dos metales que se pelean"
        desde={T.dos}
        hasta={T.tira - 0.1}
        y={1560}
        color={C.orange}
      />
      <Etiqueta
        texto="Tira bimetálica"
        desde={T.tira}
        hasta={T.laton - 0.1}
        y={1560}
        color={C.yellow}
        tamano={56}
      />
      <Etiqueta
        texto="Latón + acero"
        desde={T.laton}
        hasta={T.calor - 0.1}
        y={1560}
        color={LATON}
      />
      <Etiqueta
        texto="El calor los dilata"
        desde={T.calor}
        hasta={T.crece - 0.1}
        y={1560}
        color={C.orange}
      />
      <Etiqueta
        texto="El latón crece más"
        desde={T.crece}
        hasta={T.pegados - 0.1}
        y={1560}
        color={LATON}
      />
      <Etiqueta
        texto="Están pegados"
        desde={T.pegados}
        hasta={T.curva - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Se curva"
        desde={T.curva}
        hasta={T.plancha - 0.1}
        y={1560}
        color={C.yellow}
        tamano={60}
      />
      <Etiqueta
        texto="La corriente pasa por la tira"
        desde={T.corriente}
        hasta={T.dobla - 0.1}
        y={1560}
        color={C.cyan}
        tamano={42}
      />
      <Etiqueta
        texto="Se dobla y suelta"
        desde={T.dobla}
        hasta={T.click - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Clic: se apaga"
        desde={T.click}
        hasta={T.enfriarse - 0.1}
        y={1560}
        color={C.red}
        tamano={56}
      />
      <Etiqueta
        texto="Se enfría y vuelve"
        desde={T.enfriarse}
        hasta={T.click2 - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Ese clic que oyes"
        desde={T.click2}
        hasta={T.perilla - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="La perilla mueve el contacto"
        desde={T.perilla}
        hasta={T.lejos - 0.1}
        y={1560}
        color={C.white}
        tamano={42}
      />
      <Etiqueta
        texto="Más lejos, más calor"
        desde={T.lejos}
        hasta={T.termostatos - 0.1}
        y={1560}
        color={C.orange}
      />
      <Etiqueta
        texto="Mismo truco en espiral"
        desde={T.espiral}
        hasta={T.sin - 0.1}
        y={1560}
        color={LATON}
      />
      <Etiqueta
        texto="Sin electrónica"
        desde={T.sin}
        hasta={T.fisica - 0.1}
        y={1560}
        color={C.white}
        tamano={56}
      />
      <Etiqueta
        texto="Solo física"
        desde={T.fisica}
        hasta={T.fin + 0.4}
        y={1560}
        color={C.yellow}
        tamano={64}
      />

      <Audio src={staticFile("audio/bimetal/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [
              0,
              1.5,
              INICIO_LOGO_BIMETAL - 0.3,
              INICIO_LOGO_BIMETAL + 0.7,
              DURACION_BIMETAL_S - 1.5,
              DURACION_BIMETAL_S,
            ],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[
        T.apagarse + 0.4,
        T.pelean,
        T.curva,
        T.click,
        T.click2 + 0.3,
        T.fisica,
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
