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
  Antena,
  Cerca,
  Cierre,
  Codigo,
  Enciende,
  Gancho,
  Induccion,
  Respuesta,
  T,
} from "./Escenas";

export const INICIO_LOGO_CONTACTLESS = T.fin + 0.5;
export const DURACION_CONTACTLESS_S = INICIO_LOGO_CONTACTLESS + 6.5;
const D = INICIO_LOGO_CONTACTLESS - 61.5;

export const TarjetaContactless: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: sin batería" desde={0} hasta={T.alumbras}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Antena" desde={T.alumbras} hasta={T.datafono}>
        {(t0) => <Antena t0={t0} />}
      </Escena>
      <Escena nombre="Inducción" desde={T.datafono} hasta={T.enciende}>
        {(t0) => <Induccion t0={t0} />}
      </Escena>
      <Escena nombre="Chip enciende" desde={T.enciende} hasta={T.responde}>
        {(t0) => <Enciende t0={t0} />}
      </Escena>
      <Escena nombre="Respuesta" desde={T.responde} hasta={T.centimetros}>
        {(t0) => <Respuesta t0={t0} />}
      </Escena>
      <Escena nombre="Distancia" desde={T.centimetros} hasta={T.codigo}>
        {(t0) => <Cerca t0={t0} />}
      </Escena>
      <Escena nombre="Código único" desde={T.codigo} hasta={T.sin}>
        {(t0) => <Codigo t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.sin} hasta={INICIO_LOGO_CONTACTLESS}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena
        nombre="Logo"
        desde={INICIO_LOGO_CONTACTLESS}
        hasta={DURACION_CONTACTLESS_S}
      >
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_CONTACTLESS} />}
      </Escena>

      <Etiqueta
        texto="Un computador en tu tarjeta"
        desde={0.15}
        hasta={T.bateria - 0.1}
        y={1560}
        color={C.white}
        tamano={48}
      />
      <Etiqueta
        texto="Ninguna batería"
        desde={T.bateria}
        hasta={T.energia - 0.1}
        y={1560}
        color={C.red}
        tamano={56}
      />
      <Etiqueta
        texto="Energía del aire"
        desde={T.energia}
        hasta={T.alumbras - 0.1}
        y={1560}
        color={C.yellow}
        tamano={56}
      />
      <Etiqueta
        texto="Con luz muy fuerte"
        desde={T.alumbras}
        hasta={T.borde - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Una antena en el borde"
        desde={T.borde}
        hasta={T.datafono - 0.1}
        y={1560}
        color="#E8A050"
      />
      <Etiqueta
        texto="Campo magnético"
        desde={T.campo}
        hasta={T.millones - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="13,56 millones por segundo"
        desde={T.millones}
        hasta={T.cuando - 0.1}
        y={1560}
        color={C.cyan}
        tamano={44}
      />
      <Etiqueta
        texto="Inducción: corriente"
        desde={T.induccion}
        hasta={T.enciende - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="El chip se enciende"
        desde={T.enciende}
        hasta={T.responde - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="¿Cómo responde?"
        desde={T.responde}
        hasta={T.conecta - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Absorbe más o menos"
        desde={T.conecta}
        hasta={T.unos - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Unos y ceros"
        desde={T.unos}
        hasta={T.centimetros - 0.1}
        y={1560}
        color={C.yellow}
        tamano={56}
      />
      <Etiqueta
        texto="Solo a pocos centímetros"
        desde={T.centimetros}
        hasta={T.codigo - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Código único por pago"
        desde={T.codigo}
        hasta={T.copie - 0.1}
        y={1560}
        color={C.cyan}
      />
      <Etiqueta
        texto="Copiarlo no sirve"
        desde={T.copie}
        hasta={T.sin - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="Sin batería"
        desde={T.sin}
        hasta={T.induccionFin - 0.1}
        y={1560}
        color={C.white}
        tamano={56}
      />
      <Etiqueta
        texto="Solo inducción"
        desde={T.induccionFin}
        hasta={T.fin + 0.4}
        y={1560}
        color={C.yellow}
        tamano={64}
      />

      <Audio src={staticFile("audio/contactless/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [
              0,
              1.5,
              INICIO_LOGO_CONTACTLESS - 0.3,
              INICIO_LOGO_CONTACTLESS + 0.7,
              DURACION_CONTACTLESS_S - 1.5,
              DURACION_CONTACTLESS_S,
            ],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[
        T.bateria,
        T.acercas,
        T.induccion + 0.4,
        T.enciende + 1.4,
        T.cobro,
        T.induccionFin,
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
