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
  Fotos,
  Gancho,
  Hipocampo,
  LineaTiempo,
  Llave_,
  Neuronas,
  SinPalabras,
  SiRecuerdan,
  T,
} from "./Escenas";

export const INICIO_LOGO_AMNESIA = T.fin + 0.5;
export const DURACION_AMNESIA_S = INICIO_LOGO_AMNESIA + 6.5;
const D = INICIO_LOGO_AMNESIA - 61.5;

export const AmnesiaInfantil: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: cero recuerdos" desde={0} hasta={T.amnesia}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Línea de tiempo" desde={T.amnesia} hasta={T.curioso}>
        {(t0) => <LineaTiempo t0={t0} />}
      </Escena>
      <Escena nombre="Sí recuerdan" desde={T.curioso} hasta={T.hipocampo}>
        {(t0) => <SiRecuerdan t0={t0} />}
      </Escena>
      <Escena nombre="Hipocampo" desde={T.hipocampo} hasta={T.nacen}>
        {(t0) => <Hipocampo t0={t0} />}
      </Escena>
      <Escena nombre="Neuronas nuevas" desde={T.nacen} hasta={T.suma}>
        {(t0) => <Neuronas t0={t0} />}
      </Escena>
      <Escena nombre="Sin palabras" desde={T.suma} hasta={T.reconstruye}>
        {(t0) => <SinPalabras t0={t0} />}
      </Escena>
      <Escena nombre="Fotos" desde={T.reconstruye} hasta={T.sorprendente}>
        {(t0) => <Fotos t0={t0} />}
      </Escena>
      <Escena
        nombre="Ratones y llave"
        desde={T.sorprendente}
        hasta={INICIO_LOGO_AMNESIA}
      >
        {(t0) => <Llave_ t0={t0} />}
      </Escena>
      <Escena
        nombre="Logo"
        desde={INICIO_LOGO_AMNESIA}
        hasta={DURACION_AMNESIA_S}
      >
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_AMNESIA} />}
      </Escena>

      <Etiqueta
        texto="Tu primer año de vida"
        desde={0.15}
        hasta={T.recuerdas - 0.1}
        y={1560}
        color={C.white}
        tamano={52}
      />
      <Etiqueta
        texto="Ni un solo recuerdo"
        desde={T.recuerdas}
        hasta={T.noEs - 0.1}
        y={1560}
        color={C.red}
        tamano={56}
      />
      <Etiqueta
        texto="Cerebro en obras"
        desde={T.cerebro}
        hasta={T.amnesia - 0.1}
        y={1560}
        color={C.orange}
        tamano={56}
      />
      <Etiqueta
        texto="Nada antes de los 3 años"
        desde={T.tres}
        hasta={T.curioso - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Los bebés sí recuerdan"
        desde={T.recuerdan}
        hasta={T.problema - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Guardar sí, conservar no"
        desde={T.problema}
        hasta={T.hipocampo - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="Se organizan en el hipocampo"
        desde={T.hipocampo}
        hasta={T.nacen - 0.1}
        y={1560}
        color={C.yellow}
        tamano={42}
      />
      <Etiqueta
        texto="Nacen neuronas nuevas"
        desde={T.nacen}
        hasta={T.cada - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Reorganizan los circuitos"
        desde={T.cada}
        hasta={T.inaccesibles - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="El recuerdo queda inaccesible"
        desde={T.inaccesibles}
        hasta={T.suma - 0.1}
        y={1560}
        color={C.red}
        tamano={42}
      />
      <Etiqueta
        texto="Sin palabras ni idea de yo"
        desde={T.sinPalabras}
        hasta={T.reconstruye - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Fotos e historias"
        desde={T.fotos}
        hasta={T.sorprendente - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="En ratones, se reactivan"
        desde={T.reactivar}
        hasta={T.quiza - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Quizá no se borran"
        desde={T.quiza}
        hasta={T.llave - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Perdimos la llave"
        desde={T.llave}
        hasta={T.fin + 0.4}
        y={1560}
        color={C.yellow}
        tamano={60}
      />

      <Audio src={staticFile("audio/amnesia/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [
              0,
              1.5,
              INICIO_LOGO_AMNESIA - 0.3,
              INICIO_LOGO_AMNESIA + 0.7,
              DURACION_AMNESIA_S - 1.5,
              DURACION_AMNESIA_S,
            ],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[
        T.recuerdas,
        T.tres,
        T.conservar,
        T.inaccesibles,
        T.reactivar + 0.6,
        T.llave,
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
