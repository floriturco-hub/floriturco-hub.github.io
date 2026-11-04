import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Burbujas, Cierre, Fabrica, Gancho, Mito, Pop, T } from "./Escenas";

export const INICIO_LOGO_PETA = T.fin + 0.5;
export const DURACION_PETA_S = INICIO_LOGO_PETA + 6.5;
const D = INICIO_LOGO_PETA - 61.5;

export const PetaZetas: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: explota" desde={0} hasta={T.fabricarlos}>{(t0) => <Gancho t0={t0} />}</Escena>
      <Escena nombre="Fabricación" desde={T.fabricarlos} hasta={T.trocito}>{(t0) => <Fabrica t0={t0} />}</Escena>
      <Escena nombre="Burbujas" desde={T.trocito} hasta={T.boca}>{(t0) => <Burbujas t0={t0} />}</Escena>
      <Escena nombre="Pop" desde={T.boca} hasta={T.mito}>{(t0) => <Pop t0={t0} />}</Escena>
      <Escena nombre="Mito" desde={T.mito} hasta={T.fisica}>{(t0) => <Mito t0={t0} />}</Escena>
      <Escena nombre="Cierre" desde={T.fisica} hasta={INICIO_LOGO_PETA}>{(t0) => <Cierre t0={t0} />}</Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_PETA} hasta={DURACION_PETA_S}>{(t0) => <Logo t0={t0} inicio={INICIO_LOGO_PETA} />}</Escena>

      <Etiqueta texto="¡Este dulce explota en tu boca!" desde={0} hasta={T.bicarbonato - 0.1} y={1560} color={C.yellow} tamano={52} />
      <Etiqueta texto="Sin efervescentes" desde={T.bicarbonato} hasta={T.gas - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Gas a presión" desde={T.gas} hasta={T.fabricarlos - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Jarabe de azúcar" desde={T.jarabe} hasta={T.dioxido - 0.1} y={1560} color={C.orange} />
      <Etiqueta texto="CO2 a 40 atmósferas" desde={T.dioxido} hasta={T.pedacitos - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Se rompe en trocitos" desde={T.pedacitos} hasta={T.trocito - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Burbujas encerradas" desde={T.burbujitas} hasta={T.boca - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="La saliva disuelve" desde={T.saliva} hasta={T.pop - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="¡Pop!" desde={T.pop} hasta={T.mito - 0.1} y={1560} color={C.yellow} tamano={64} />
      <Etiqueta texto="¿Estómago que explota?" desde={T.mito} hasta={T.falso - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Falso" desde={T.falso} hasta={T.media - 0.1} y={1560} color={C.red} tamano={60} />
      <Etiqueta texto="Menos gas que media lata" desde={T.media} hasta={T.fisica - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Física pura, en un dulce" desde={T.fisica} hasta={T.fin + 0.4} y={1560} color={C.yellow} tamano={52} />

      <Audio src={staticFile("audio/petazetas/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_PETA - 0.3, INICIO_LOGO_PETA + 0.7, DURACION_PETA_S - 1.5, DURACION_PETA_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[0.2, T.cuarenta, T.pedacitos, T.pop, T.falso, T.fisica].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={0.45} />
        </Sequence>
      ))}
      <Sequence name="SFX logo" from={Math.round((62.35 + D) * fps)} durationInFrames={Math.round(2.9 * fps)}>
        <Audio src={staticFile("audio/sfx_logo.wav")} volume={0.7} />
      </Sequence>
      <Sequence name="Voz: Frecuencia Cero" from={Math.round((63.75 + D) * fps)} durationInFrames={Math.round(1.7 * fps)}>
        <Audio src={staticFile("audio/frecuencia_cero.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};
