import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Estufa } from "./Estufa";
import { Tarjetas } from "./Tarjetas";
import { T } from "./tiempos";

export const INICIO_LOGO_INDUCCION = T.fin + 0.5;
export const DURACION_INDUCCION_S = INICIO_LOGO_INDUCCION + 6.5;
const D = INICIO_LOGO_INDUCCION - 61.5;

// Una sola escena-mundo (placa de inducción, corte ampliado y prueba del imán) recorrida con la cámara
export const InduccionVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Estufa y corte" desde={0} hasta={INICIO_LOGO_INDUCCION}>
        {(t0) => (
          <>
            <Estufa t0={t0} />
            <Tarjetas t0={t0} />
          </>
        )}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_INDUCCION} hasta={DURACION_INDUCCION_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_INDUCCION} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras. La primera ya está en el primer fotograma (gancho) */}
      <Etiqueta texto="¿Hielo sin derretir?" desde={-0.4} hasta={T.vidrio - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Vidrio casi frío" desde={T.vidrio} hasta={T.parece - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="¿Una resistencia?" desde={T.parece} hasta={T.peroNo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Nada caliente" desde={T.peroNo} hasta={T.bobina - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Bobina de cobre" desde={T.bobina} hasta={T.corriente - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Corriente alterna" desde={T.corriente} hasta={T.decenas - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Miles de veces/s" desde={T.decenas} hasta={T.campo - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Campo magnético" desde={T.campo} hasta={T.atraviesa - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Atraviesa el vidrio" desde={T.atraviesa} hasta={T.sarten - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Entra en la sartén" desde={T.sarten} hasta={T.metal - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Electrones en remolino" desde={T.metal} hasta={T.inducidas - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Corrientes inducidas" desde={T.inducidas} hasta={T.resiste - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Resistencia → calor" desde={T.resiste} hasta={T.calor - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Se calienta sola" desde={T.calor} hasta={T.vidrioNo - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="El vidrio no conduce" desde={T.vidrioNo} hasta={T.entibia - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="Tibio por contacto" desde={T.entibia} hasta={T.noToques - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="No lo toques" desde={T.noToques} hasta={T.ollas - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Hierro o acero" desde={T.ollas} hasta={T.iman - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="¿Se pega el imán?" desde={T.iman} hasta={T.final - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="No calienta la estufa" desde={T.final} hasta={T.sartenFinal - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Calienta la sartén" desde={T.sartenFinal} hasta={T.fin + 0.4} y={1660} color={C.orange} tamano={50} />

      {/* Sonido: música 6 dB más baja (0,1 bajo la voz, 0,225 en el cierre) */}
      <Audio src={staticFile("audio/induccion/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_INDUCCION - 0.3, INICIO_LOGO_INDUCCION + 0.7, DURACION_INDUCCION_S - 1.5, DURACION_INDUCCION_S],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[0.3, T.peroNo, T.cambia, T.calor, T.sirve].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc === 0.3 ? 0.6 : 0.4} />
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
