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
  Casco,
  Comparacion,
  Dano,
  Gancho,
  Recta,
  Superlenta,
  T,
  Tamano,
  Tolera,
} from "./Escenas";

export const INICIO_LOGO_CARPINTERO = T.fin + 0.5;
export const DURACION_CARPINTERO_S = INICIO_LOGO_CARPINTERO + 6.5;
const D = INICIO_LOGO_CARPINTERO - 61.5;

export const CarpinteroG: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: 1.200 G" desde={0} hasta={T.frenazo}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Comparación" desde={T.frenazo} hasta={T.durante}>
        {(t0) => <Comparacion t0={t0} />}
      </Escena>
      <Escena nombre="Casco" desde={T.durante} hasta={T.pero}>
        {(t0) => <Casco t0={t0} />}
      </Escena>
      <Escena nombre="Superlenta" desde={T.pero} hasta={T.sobrevive}>
        {(t0) => <Superlenta t0={t0} />}
      </Escena>
      <Escena nombre="Tamaño" desde={T.sobrevive} hasta={T.pequeno}>
        {(t0) => <Tamano t0={t0} />}
      </Escena>
      <Escena nombre="Tolera" desde={T.pequeno} hasta={T.recta}>
        {(t0) => <Tolera t0={t0} />}
      </Escena>
      <Escena nombre="Línea recta" desde={T.recta} hasta={T.aunAsi}>
        {(t0) => <Recta t0={t0} />}
      </Escena>
      <Escena nombre="Daño" desde={T.aunAsi} hasta={INICIO_LOGO_CARPINTERO}>
        {(t0) => <Dano t0={t0} />}
      </Escena>
      <Escena
        nombre="Logo"
        desde={INICIO_LOGO_CARPINTERO}
        hasta={DURACION_CARPINTERO_S}
      >
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_CARPINTERO} />}
      </Escena>

      <Etiqueta
        texto="¡Su cerebro aguanta 1.200 G!"
        desde={0}
        hasta={T.carpintero - 0.1}
        y={1560}
        color={C.yellow}
        tamano={56}
      />
      <Etiqueta
        texto="20 golpes por segundo"
        desde={T.veinte}
        hasta={T.frenazo - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Cada frenazo: 1.200 G"
        desde={T.frenazo}
        hasta={T.persona - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="Conmoción humana: ~100 G"
        desde={T.persona}
        hasta={T.durante - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="¿Casco amortiguador?"
        desde={T.casco}
        hasta={T.pero - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Filmado en superlenta"
        desde={T.filmaron}
        hasta={T.noAmortigua - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="No amortigua nada"
        desde={T.noAmortigua}
        hasta={T.martillo - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="Es un martillo rígido"
        desde={T.martillo}
        hasta={T.sobrevive - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="La clave: su tamaño"
        desde={T.tamano}
        hasta={T.ajustado - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Cerebro bien ajustado"
        desde={T.ajustado}
        hasta={T.pequeno - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Más pequeño, más aguante"
        desde={T.pequeno}
        hasta={T.recta - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Golpe recto, sin girar"
        desde={T.recta}
        hasta={T.milisegundo - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Menos de un milisegundo"
        desde={T.milisegundo}
        hasta={T.aunAsi - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Posibles señales de daño"
        desde={T.dano}
        hasta={T.quiza - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="¿Tan ileso como parece?"
        desde={T.quiza}
        hasta={T.fin + 0.4}
        y={1560}
        color={C.yellow}
        tamano={52}
      />

      <Audio src={staticFile("audio/carpintero/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [
              0,
              1.5,
              INICIO_LOGO_CARPINTERO - 0.3,
              INICIO_LOGO_CARPINTERO + 0.7,
              DURACION_CARPINTERO_S - 1.5,
              DURACION_CARPINTERO_S,
            ],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.g1200, T.cien, T.noAmortigua, T.martillo, T.ti, T.milisegundo].map(
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
