import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Conclusion, Contacto, Experimento, Factores, Gancho, T } from "./Escenas";

export const INICIO_LOGO_CINCO = T.fin + 0.5;
export const DURACION_CINCO_S = INICIO_LOGO_CINCO + 6.5;
const D = INICIO_LOGO_CINCO - 61.5;

export const ReglaCinco: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="La galleta cae" desde={0} hasta={T.rutgers}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="El experimento" desde={T.rutgers} hasta={T.resultado}>
        {(t0) => <Experimento t0={t0} />}
      </Escena>
      <Escena nombre="Menos de un segundo" desde={T.resultado} hasta={T.tiempo}>
        {(t0) => <Contacto t0={t0} />}
      </Escena>
      <Escena nombre="Tiempo, humedad y superficie" desde={T.tiempo} hasta={T.asi}>
        {(t0) => <Factores t0={t0} />}
      </Escena>
      <Escena nombre="Conclusión" desde={T.asi} hasta={INICIO_LOGO_CINCO}>
        {(t0) => <Conclusion t0={t0} />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_CINCO} hasta={DURACION_CINCO_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_CINCO} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="¿Regla de 5 segundos?" desde={T.regla} hasta={T.rutgers - 0.1} y={1580} color={C.yellow} tamano={56} />
      <Etiqueta texto="Superficies con bacterias" desde={T.contaminaron} hasta={T.sandia - 0.1} y={1480} color={C.white} />
      <Etiqueta texto="4 alimentos, 4 tiempos" desde={T.t1} hasta={T.resultado - 0.1} y={1480} color={C.cyan} />
      <Etiqueta texto="Menos de 1 segundo" desde={T.saltan} hasta={T.cuentes - 0.1} y={1580} color={C.yellow} />
      <Etiqueta texto="No esperan a que cuentes" desde={T.cuentes} hasta={T.tiempo - 0.1} y={1580} color={C.red} />
      <Etiqueta texto="La humedad manda" desde={T.humedad} hasta={T.sandiaMas - 0.1} y={1640} color={C.yellow} />
      <Etiqueta texto="Sandía: la que más" desde={T.sandiaMas + 0.4} hasta={T.gomitasMenos - 0.1} y={1640} color={C.red} />
      <Etiqueta texto="Gomitas: las que menos" desde={T.gomitasMenos + 0.3} hasta={T.piso - 0.1} y={1640} color={C.cyan} />
      <Etiqueta texto="El piso también cuenta" desde={T.piso} hasta={T.alfombra - 0.1} y={1560} />
      <Etiqueta texto="Contar no te protege" desde={T.contar} hasta={T.decide - 0.1} y={1400} color={C.red} />
      <Etiqueta texto="Mejor una galleta" desde={T.galleta + 0.6} hasta={T.fin + 0.4} y={1560} color={C.yellow} tamano={60} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/cinco/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_CINCO - 0.3, INICIO_LOGO_CINCO + 0.7, DURACION_CINCO_S - 1.5, DURACION_CINCO_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[0.8, T.resultado + 0.9, T.contar].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={0.5} />
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
