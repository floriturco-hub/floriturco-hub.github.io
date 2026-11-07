import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Cierre, Debil, Gancho, Hox, Manos, Media, Resultado, T } from "./Escenas";

export const INICIO_LOGO_PIE = T.fin + 0.5;
export const DURACION_PIE_S = INICIO_LOGO_PIE + 6.5;
const D = INICIO_LOGO_PIE - 61.5;

export const PieMito: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: 104 hombres" desde={0} hasta={T.resultado}>{(t0) => <Gancho t0={t0} />}</Escena>
      <Escena nombre="Sin relación" desde={T.resultado} hasta={T.manos}>{(t0) => <Resultado t0={t0} />}</Escena>
      <Escena nombre="Manos" desde={T.manos} hasta={T.debil}>{(t0) => <Manos t0={t0} />}</Escena>
      <Escena nombre="Débil" desde={T.debil} hasta={T.rumor}>{(t0) => <Debil t0={t0} />}</Escena>
      <Escena nombre="Genes Hox" desde={T.rumor} hasta={T.cierto}>{(t0) => <Hox t0={t0} />}</Escena>
      <Escena nombre="Media" desde={T.cierto} hasta={T.asi}>{(t0) => <Media t0={t0} />}</Escena>
      <Escena nombre="Cierre" desde={T.asi} hasta={INICIO_LOGO_PIE}>{(t0) => <Cierre t0={t0} />}</Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_PIE} hasta={DURACION_PIE_S}>{(t0) => <Logo t0={t0} inicio={INICIO_LOGO_PIE} />}</Escena>

      <Etiqueta texto="Midieron a 104 hombres" desde={0.15} hasta={T.pieGrande - 0.1} y={1560} color={C.yellow} tamano={52} />
      <Etiqueta texto="¿Pie grande...?" desde={T.pieGrande} hasta={T.resultado - 0.1} y={1560} color={C.white} tamano={56} />
      <Etiqueta texto="Ninguna relación" desde={T.ninguna} hasta={T.saber - 0.1} y={1560} color={C.red} tamano={56} />
      <Etiqueta texto="La talla no dice nada" desde={T.saber} hasta={T.manos - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="¿Y las manos?" desde={T.manos} hasta={T.corea - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Índice vs anular" desde={T.indice} hasta={T.anularLargo - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Un poco más largo" desde={T.anularLargo} hasta={T.testosterona - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Testosterona antes de nacer" desde={T.testosterona} hasta={T.debil - 0.1} y={1560} color={C.orange} />
      <Etiqueta texto="Relación débil" desde={T.debil} hasta={T.sirve - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="No sirve para adivinar" desde={T.sirve} hasta={T.rumor - 0.1} y={1560} color={C.red} />
      <Etiqueta texto="¿De dónde sale?" desde={T.rumor} hasta={T.hox - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Mismos genes de desarrollo" desde={T.hox} hasta={T.origen - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Mismo origen, no tamaño" desde={T.origen} hasta={T.cierto - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Media: unos 13 cm" desde={T.trece} hasta={T.menos - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Menos de lo que crees" desde={T.menos} hasta={T.asi - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="No mires los zapatos" desde={T.asi} hasta={T.fin + 0.4} y={1560} color={C.yellow} tamano={60} />

      <Audio src={staticFile("audio/pie/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_PIE - 0.3, INICIO_LOGO_PIE + 0.7, DURACION_PIE_S - 1.5, DURACION_PIE_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.ninguna, T.anularLargo, T.debil, T.hox, T.trece, T.no].map((tc) => (
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
