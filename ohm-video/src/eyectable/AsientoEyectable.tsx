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
  Cohete,
  Doce,
  Empuje,
  Gancho,
  Secuencia,
  Separa,
  T,
} from "./Escenas";

export const INICIO_LOGO_EYECT = T.fin + 0.5;
export const DURACION_EYECT_S = INICIO_LOGO_EYECT + 6.5;
const D = INICIO_LOGO_EYECT - 61.5;

export const AsientoEyectable: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: disparado" desde={0} hasta={T.cabina}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Secuencia" desde={T.cabina} hasta={T.patada}>
        {(t0) => <Secuencia t0={t0} />}
      </Escena>
      <Escena nombre="Empuje progresivo" desde={T.patada} hasta={T.sale}>
        {(t0) => <Empuje t0={t0} />}
      </Escena>
      <Escena nombre="Cohete" desde={T.sale} hasta={T.paracaidas}>
        {(t0) => <Cohete t0={t0} />}
      </Escena>
      <Escena nombre="Paracaídas" desde={T.paracaidas} hasta={T.doce}>
        {(t0) => <Separa t0={t0} />}
      </Escena>
      <Escena nombre="12 G" desde={T.doce} hasta={T.medio2}>
        {(t0) => <Doce t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.medio2} hasta={INICIO_LOGO_EYECT}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_EYECT} hasta={DURACION_EYECT_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_EYECT} />}
      </Escena>

      <Etiqueta
        texto="¡Te disparan fuera del avión!"
        desde={0}
        hasta={T.manija - 0.1}
        y={1560}
        color={C.yellow}
        tamano={52}
      />
      <Etiqueta
        texto="Fuera en medio segundo"
        desde={T.manija}
        hasta={T.cabina - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="1. Cabina fuera"
        desde={T.carga}
        hasta={T.cartucho - 0.1}
        y={1560}
        color={C.orange}
      />
      <Etiqueta
        texto="2. Cartucho de gas"
        desde={T.cartucho}
        hasta={T.patada - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Un golpe seco rompe la columna"
        desde={T.columna}
        hasta={T.progresiva - 0.1}
        y={1560}
        color={C.red}
        tamano={42}
      />
      <Etiqueta
        texto="Empuje progresivo"
        desde={T.progresiva}
        hasta={T.sale - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="3. Cohete"
        desde={T.cohete}
        hasta={T.sensores - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Sensores deciden el paracaídas"
        desde={T.sensores}
        hasta={T.paracaidas - 0.1}
        y={1560}
        color={C.cyan}
        tamano={42}
      />
      <Etiqueta
        texto="4. Paracaídas"
        desde={T.paracaidas}
        hasta={T.doce - 0.1}
        y={1560}
        color={C.orange}
      />
      <Etiqueta
        texto="Más de 12 G"
        desde={T.doce}
        hasta={T.recto - 0.1}
        y={1560}
        color={C.red}
        tamano={56}
      />
      <Etiqueta
        texto="Espalda recta"
        desde={T.recto}
        hasta={T.medio2 - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Medio segundo entre la vida y la muerte"
        desde={T.medio2}
        hasta={T.fin + 0.4}
        y={1560}
        color={C.yellow}
        tamano={40}
      />

      <Audio src={staticFile("audio/eyectable/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [
              0,
              1.5,
              INICIO_LOGO_EYECT - 0.3,
              INICIO_LOGO_EYECT + 0.7,
              DURACION_EYECT_S - 1.5,
              DURACION_EYECT_S,
            ],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[0.3, T.carga, T.progresiva, T.cohete, T.paracaidas, T.doce].map(
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
