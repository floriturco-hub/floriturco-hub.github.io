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
import { Cierre, Cinco, Gancho, Gripe, Prueba, Ruta, T } from "./Escenas";

export const INICIO_LOGO_GRIPE = T.fin + 0.5;
export const DURACION_GRIPE_S = INICIO_LOGO_GRIPE + 6.5;
const D = INICIO_LOGO_GRIPE - 61.5;

export const GripeSabor: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: no sabe a pizza" desde={0} hasta={T.cinco}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Cinco sabores" desde={T.cinco} hasta={T.masticas}>
        {(t0) => <Cinco t0={t0} />}
      </Escena>
      <Escena nombre="Ruta de los aromas" desde={T.masticas} hasta={T.gripe}>
        {(t0) => <Ruta t0={t0} />}
      </Escena>
      <Escena nombre="Gripe" desde={T.gripe} hasta={T.prueba}>
        {(t0) => <Gripe t0={t0} />}
      </Escena>
      <Escena nombre="Prueba" desde={T.prueba} hasta={T.mayor}>
        {(t0) => <Prueba t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.mayor} hasta={INICIO_LOGO_GRIPE}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_GRIPE} hasta={DURACION_GRIPE_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_GRIPE} />}
      </Escena>

      <Etiqueta
        texto="¡Tu lengua no sabe a pizza!"
        desde={0}
        hasta={T.cinco - 0.1}
        y={1560}
        color={C.yellow}
        tamano={56}
      />
      <Etiqueta
        texto="Solo 5 sabores básicos"
        desde={T.cinco}
        hasta={T.nariz - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="El resto, la nariz"
        desde={T.nariz}
        hasta={T.masticas - 0.1}
        y={1560}
        color={C.orange}
      />
      <Etiqueta
        texto="Los aromas suben por detrás"
        desde={T.suben}
        hasta={T.estampilla - 0.1}
        y={1560}
        color={C.orange}
        tamano={42}
      />
      <Etiqueta
        texto="Zona olfativa"
        desde={T.estampilla}
        hasta={T.cerebro - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Lengua + olfato = sabor"
        desde={T.cerebro}
        hasta={T.gripe - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Con gripe: nariz tapada"
        desde={T.gripe}
        hasta={T.aire - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Los aromas no llegan"
        desde={T.aire}
        hasta={T.prueba - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="Haz la prueba"
        desde={T.prueba}
        hasta={T.soloDulce - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Tapada: solo dulce"
        desde={T.soloDulce}
        hasta={T.fresa - 0.1}
        y={1560}
        color={C.grey}
      />
      <Etiqueta
        texto="Destapada: ¡fresa!"
        desde={T.fresa}
        hasta={T.mayor - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="El sabor es casi todo olfato"
        desde={T.olfato}
        hasta={T.poco - 0.1}
        y={1560}
        color={C.orange}
        tamano={42}
      />
      <Etiqueta
        texto="Tu nariz sabe a todo"
        desde={T.poco}
        hasta={T.fin + 0.4}
        y={1560}
        color={C.yellow}
        tamano={56}
      />

      <Audio src={staticFile("audio/gripe/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [
              0,
              1.5,
              INICIO_LOGO_GRIPE - 0.3,
              INICIO_LOGO_GRIPE + 0.7,
              DURACION_GRIPE_S - 1.5,
              DURACION_GRIPE_S,
            ],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[0.3, T.nariz, T.estampilla, T.gripe + 0.4, T.fresa, T.todo].map(
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
