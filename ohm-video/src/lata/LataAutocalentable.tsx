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
  Corte,
  Gancho,
  Militar,
  Obra,
  Reaccion,
  Sesenta,
  T,
} from "./Escenas";

export const INICIO_LOGO_LATA = T.fin + 0.5;
export const DURACION_LATA_S = INICIO_LOGO_LATA + 6.5;
const D = INICIO_LOGO_LATA - 61.5;

export const LataAutocalentable: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: se calienta sola" desde={0} hasta={T.secreto}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Por dentro" desde={T.secreto} hasta={T.presionar}>
        {(t0) => <Corte t0={t0} />}
      </Escena>
      <Escena nombre="Reacción" desde={T.presionar} hasta={T.obra}>
        {(t0) => <Reaccion t0={t0} />}
      </Escena>
      <Escena nombre="Obra" desde={T.obra} hasta={T.atraviesa}>
        {(t0) => <Obra t0={t0} />}
      </Escena>
      <Escena nombre="60 grados" desde={T.atraviesa} hasta={T.militares}>
        {(t0) => <Sesenta t0={t0} />}
      </Escena>
      <Escena nombre="Ración militar" desde={T.militares} hasta={T.quimica}>
        {(t0) => <Militar t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.quimica} hasta={INICIO_LOGO_LATA}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_LATA} hasta={DURACION_LATA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_LATA} />}
      </Escena>

      <Etiqueta
        texto="¡Esta lata se calienta sola!"
        desde={0}
        hasta={T.fuego - 0.1}
        y={1560}
        color={C.orange}
        tamano={56}
      />
      <Etiqueta
        texto="Sin fuego ni enchufe"
        desde={T.fuego}
        hasta={T.boton - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Solo un botón"
        desde={T.boton}
        hasta={T.secreto - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Dos compartimentos"
        desde={T.compartimentos}
        hasta={T.cal - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Cal viva + agua"
        desde={T.cal}
        hasta={T.presionar - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="El punzón rompe la membrana"
        desde={T.punzon}
        hasta={T.reaccionan - 0.1}
        y={1560}
        color={C.white}
        tamano={42}
      />
      <Etiqueta
        texto="¡Reacción que da calor!"
        desde={T.reaccionan}
        hasta={T.obra - 0.1}
        y={1560}
        color={C.orange}
      />
      <Etiqueta
        texto="Como la cal en una obra"
        desde={T.obra}
        hasta={T.atraviesa - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Hasta unos 60 °C"
        desde={T.sesenta}
        hasta={T.militares - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="Magnesio + agua salada"
        desde={T.magnesio}
        hasta={T.quimica - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Química de bolsillo"
        desde={T.quimica}
        hasta={T.fin + 0.4}
        y={1560}
        color={C.yellow}
        tamano={58}
      />

      <Audio src={staticFile("audio/lata/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [
              0,
              1.5,
              INICIO_LOGO_LATA - 0.3,
              INICIO_LOGO_LATA + 0.7,
              DURACION_LATA_S - 1.5,
              DURACION_LATA_S,
            ],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[0.2, T.punzon + 0.6, T.calor, T.sesenta, T.oxida, T.quimica].map(
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
