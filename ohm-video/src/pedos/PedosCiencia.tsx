import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Aguantar, Azufre, Cierre, Composicion, Gancho, Origen, Ruido, T } from "./Escenas";
import { VERDE_OLOR } from "./Piezas";

export const INICIO_LOGO_PEDOS = T.fin + 0.5;
export const DURACION_PEDOS_S = INICIO_LOGO_PEDOS + 6.5;
const D = INICIO_LOGO_PEDOS - 61.5;

export const PedosCiencia: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Gancho: 99 %" desde={0} hasta={T.unPedo}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Composición" desde={T.unPedo} hasta={T.deDonde}>
        {(t0) => <Composicion t0={t0} />}
      </Escena>
      <Escena nombre="Origen" desde={T.deDonde} hasta={T.malOlor}>
        {(t0) => <Origen t0={t0} />}
      </Escena>
      <Escena nombre="Azufre" desde={T.malOlor} hasta={T.ruido}>
        {(t0) => <Azufre t0={t0} />}
      </Escena>
      <Escena nombre="Ruido" desde={T.ruido} hasta={T.persona}>
        {(t0) => <Ruido t0={t0} />}
      </Escena>
      <Escena nombre="Aguantar" desde={T.persona} hasta={T.asiQueSi}>
        {(t0) => <Aguantar t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.asiQueSi} hasta={INICIO_LOGO_PEDOS}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_PEDOS} hasta={DURACION_PEDOS_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_PEDOS} />}
      </Escena>

      {/* Etiquetas-clave: 2-4 palabras */}
      <Etiqueta texto="99 %: sin olor" desde={0.15} hasta={T.problema - 0.1} y={1560} color={C.cyan} tamano={56} />
      <Etiqueta texto="El 1 % restante" desde={T.problema} hasta={T.unPedo - 0.1} y={1560} color={VERDE_OLOR} tamano={60} />
      <Etiqueta texto="¿De qué está hecho?" desde={T.unPedo} hasta={T.sinOlor - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Todos sin olor" desde={T.sinOlor} hasta={T.deDonde - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Aire que tragas" desde={T.aire} hasta={T.otra - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Bacterias que fermentan" desde={T.bacterias} hasta={T.frijoles - 0.1} y={1560} color="#7CC84A" />
      <Etiqueta texto="Fibra de los frijoles" desde={T.frijoles} hasta={T.malOlor - 0.1} y={1560} color={C.orange} />
      <Etiqueta texto="Gases con azufre" desde={T.azufre} hasta={T.huevo - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Huevo podrido" desde={T.huevo} hasta={T.porEso - 0.1} y={1560} color={VERDE_OLOR} />
      <Etiqueta texto="Más azufre, más olor" desde={T.porEso} hasta={T.ruido - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="¿Y el ruido?" desde={T.ruido} hasta={T.vibrar - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="La salida vibra" desde={T.vibrar} hasta={T.persona - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="10 a 20 veces al día" desde={T.veces} hasta={T.aguantas - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Si lo aguantas" desde={T.aguantas} hasta={T.sangre - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Pasa a la sangre" desde={T.sangre} hasta={T.exhalas - 0.1} y={1560} color={C.red} />
      <Etiqueta texto="Y lo exhalas" desde={T.exhalas} hasta={T.asiQueSi - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Así que sí" desde={T.asiQueSi} hasta={T.aliento - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Un poquito de pedo" desde={T.aliento} hasta={T.fin + 0.4} y={1560} color={C.yellow} tamano={60} />

      {/* Sonido: música 6 dB más baja (estilo.md, sección 9) */}
      <Audio src={staticFile("audio/pedos/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_PEDOS - 0.3, INICIO_LOGO_PEDOS + 0.7, DURACION_PEDOS_S - 1.5, DURACION_PEDOS_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.uno, T.sinOlor, T.huevo, T.vibrar, T.sangre, T.aliento].map((tc) => (
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
