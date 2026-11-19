import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Australia, Bioequivalencia, Conclusion, Gancho, Mecanismo, Patente, QueCambia, T, Truco } from "./Escenas";

export const INICIO_LOGO_IBU = T.fin + 0.5;
export const DURACION_IBU_S = INICIO_LOGO_IBU + 6.5;
const D = INICIO_LOGO_IBU - 61.5;

export const IbuprofenoGenerico: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Marca vs genérico" desde={0} hasta={5.84}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Bloquea la COX" desde={5.84} hasta={T.para}>
        {(t0) => <Mecanismo t0={t0} />}
      </Escena>
      <Escena nombre="Bioequivalencia" desde={T.para} hasta={T.entonces}>
        {(t0) => <Bioequivalencia t0={t0} />}
      </Escena>
      <Escena nombre="Qué cambia" desde={T.entonces} hasta={T.invento}>
        {(t0) => <QueCambia t0={t0} />}
      </Escena>
      <Escena nombre="Patente" desde={T.invento} hasta={T.australia}>
        {(t0) => <Patente t0={t0} />}
      </Escena>
      <Escena nombre="Australia" desde={T.australia} hasta={T.truco}>
        {(t0) => <Australia t0={t0} />}
      </Escena>
      <Escena nombre="Truco" desde={T.truco} hasta={T.noPagas}>
        {(t0) => <Truco t0={t0} />}
      </Escena>
      <Escena nombre="Conclusión" desde={T.noPagas} hasta={INICIO_LOGO_IBU}>
        {(t0) => <Conclusion t0={t0} />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_IBU} hasta={DURACION_IBU_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_IBU} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="¿Marca o genérico?" desde={0.15} hasta={T.misma - 0.1} y={1560} color={C.white} tamano={56} />
      <Etiqueta texto="Misma molécula" desde={T.misma} hasta={5.9} y={1560} color={C.yellow} tamano={64} />
      <Etiqueta texto="Bloquea la COX" desde={T.bloquea + 0.3} hasta={T.prosta - 0.1} y={1560} color={C.yellow} />
      <Etiqueta texto="Menos prostaglandinas" desde={T.prosta} hasta={T.dolor - 0.1} y={1560} color={C.orange} />
      <Etiqueta texto="Llega igual a la sangre" desde={T.demostrar} hasta={T.tres - 0.1} y={1440} color={C.cyan} />
      <Etiqueta texto="Patente caducada" desde={T.caduco + 0.3} hasta={T.cualquiera - 0.1} y={1440} color={C.cyan} />
      <Etiqueta texto="Sin repetir ensayos" desde={T.sinRepetir} hasta={T.australia - 0.1} y={1500} color={C.yellow} />
      <Etiqueta texto="Mira la etiqueta" desde={T.etiqueta} hasta={T.rapido - 0.1} y={1600} color={C.yellow} />
      <Etiqueta texto="Más rápido" desde={T.rapido + 0.3} hasta={T.noPagas - 0.1} y={1600} color={C.cyan} />
      <Etiqueta texto="Pagas la caja" desde={T.pagas} hasta={T.fin + 0.4} y={1260} color={C.yellow} tamano={72} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/ibuprofeno/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_IBU - 0.3, INICIO_LOGO_IBU + 0.7, DURACION_IBU_S - 1.5, DURACION_IBU_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[0.05, T.son, T.bloquea + 0.5, T.tres, T.tribunal + 0.55, T.pagas].map((tc) => (
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
