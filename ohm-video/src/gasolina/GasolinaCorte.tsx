import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Aire, Cierre, Clac, Gancho, Partes, T, Toquecitos } from "./Escenas";

export const INICIO_LOGO_GAS = T.fin + 0.5;
export const DURACION_GAS_S = INICIO_LOGO_GAS + 6.5;
const D = INICIO_LOGO_GAS - 61.5;

export const GasolinaCorte: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: sin electrónica" desde={0} hasta={T.secreto}>{(t0) => <Gancho t0={t0} />}</Escena>
      <Escena nombre="Agujerito, tubo y Venturi" desde={T.secreto} hasta={T.succion}>{(t0) => <Partes t0={t0} />}</Escena>
      <Escena nombre="Aire y llenado" desde={T.succion} hasta={T.membrana}>{(t0) => <Aire t0={t0} />}</Escena>
      <Escena nombre="Clac" desde={T.membrana} hasta={T.porEso}>{(t0) => <Clac t0={t0} />}</Escena>
      <Escena nombre="Toquecitos" desde={T.porEso} hasta={T.noEs}>{(t0) => <Toquecitos t0={t0} />}</Escena>
      <Escena nombre="Cierre" desde={T.noEs} hasta={INICIO_LOGO_GAS}>{(t0) => <Cierre t0={t0} />}</Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_GAS} hasta={DURACION_GAS_S}>{(t0) => <Logo t0={t0} inicio={INICIO_LOGO_GAS} />}</Escena>

      <Etiqueta texto="Ni un solo sensor" desde={0.15} hasta={T.sabe - 0.1} y={1560} color={C.red} tamano={56} />
      <Etiqueta texto="Y sabe cuándo parar" desde={T.sabe} hasta={T.secreto - 0.1} y={1560} color={C.yellow} tamano={56} />
      <Etiqueta texto="Un agujerito en la punta" desde={T.agujerito} hasta={T.tubo - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Un tubo finísimo" desde={T.tubo} hasta={T.mientras - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Un estrechamiento" desde={T.estrecho} hasta={T.presion - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Baja la presión" desde={T.presion} hasta={T.venturi - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="Efecto Venturi" desde={T.venturi} hasta={T.succion - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Succiona aire" desde={T.succion} hasta={T.pero - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="El tanque se llena" desde={T.pero} hasta={T.tapa - 0.1} y={1560} color={C.orange} />
      <Etiqueta texto="Tapa el agujerito" desde={T.tapa} hasta={T.yaNo - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Ya no entra aire" desde={T.yaNo} hasta={T.camara - 0.1} y={1560} color={C.red} />
      <Etiqueta texto="Cámara con membrana" desde={T.camara} hasta={T.membrana - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="La membrana se hunde" desde={T.membrana} hasta={T.pestillo - 0.1} y={1560} color={C.orange} />
      <Etiqueta texto="Suelta el pestillo" desde={T.pestillo} hasta={T.clac - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="¡Clac!" desde={T.clac} hasta={T.todo - 0.05} y={1560} color={C.yellow} tamano={72} />
      <Etiqueta texto="Sin un solo cable" desde={T.todo} hasta={T.porEso - 0.1} y={1560} color={C.cyan} />
      <Etiqueta texto="No sigas a toquecitos" desde={T.porEso} hasta={T.derramar - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Puedes derramar" desde={T.derramar} hasta={T.noEs - 0.1} y={1560} color={C.red} />
      <Etiqueta texto="No es electrónica" desde={T.noEs} hasta={T.fisica - 0.1} y={1560} color={C.white} />
      <Etiqueta texto="Es pura física" desde={T.fisica} hasta={T.fin + 0.4} y={1560} color={C.yellow} tamano={60} />

      <Audio src={staticFile("audio/gasolina/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_GAS - 0.3, INICIO_LOGO_GAS + 0.7, DURACION_GAS_S - 1.5, DURACION_GAS_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.sensor, T.venturi, T.tapa, T.clac, T.noEs].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc === T.clac ? 0.7 : 0.45} />
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
