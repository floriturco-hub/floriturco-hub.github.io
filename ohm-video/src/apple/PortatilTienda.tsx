import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Angulo, Detalles, Propiedad, T, Tienda } from "./Escenas";

export const INICIO_LOGO_APPLE = T.fin + 0.5;
export const DURACION_APPLE_S = INICIO_LOGO_APPLE + 6.5;
const D = INICIO_LOGO_APPLE - 61.5;

export const PortatilTienda: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="La tienda" desde={0} hasta={T.setenta}>
        {(t0) => <Tienda t0={t0} />}
      </Escena>
      <Escena nombre="El ángulo" desde={T.setenta} hasta={T.gesto}>
        {(t0) => <Angulo t0={t0} fase="angulo" />}
      </Escena>
      <Escena nombre="Tocar y propiedad" desde={T.gesto} hasta={T.tienda}>
        {(t0) => <Propiedad t0={t0} />}
      </Escena>
      <Escena nombre="Detalles y explicación" desde={T.tienda} hasta={T.resistirte}>
        {(t0) => <Detalles t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.resistirte} hasta={INICIO_LOGO_APPLE}>
        {(t0) => <Angulo t0={t0} fase="final" />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_APPLE} hasta={DURACION_APPLE_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_APPLE} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="¿Medio cerrados?" desde={T.medio} hasta={T.proposito - 0.1} y={1500} color={C.yellow} tamano={60} />
      <Etiqueta texto="Es a propósito" desde={T.proposito} hasta={T.setenta - 0.1} y={1500} color={C.yellow} />
      <Etiqueta texto="No se ve bien" desde={T.noSeVe + 0.6} hasta={T.tocas - 0.1} y={1500} />
      <Etiqueta texto="La tocas y la abres" desde={T.tocas} hasta={T.gesto - 0.1} y={1500} color={C.yellow} />
      <Etiqueta texto="Ese gesto es la clave" desde={T.gesto} hasta={T.manos - 0.1} y={1500} color={C.yellow} />
      <Etiqueta texto="Ya lo estás usando" desde={T.manos} hasta={T.ciencia - 0.1} y={1500} color={C.cyan} />
      <Etiqueta texto="Tocar = sentirlo tuyo" desde={T.tocan + 1.4} hasta={T.tienda - 0.1} y={1580} color={C.yellow} />
      <Etiqueta texto="Nada es casual" desde={T.tienda + 0.3} hasta={T.angulo - 0.1} y={1580} />
      <Etiqueta texto="Sin confirmación oficial" desde={T.oficial + 0.4} hasta={T.idea - 0.1} y={1500} />
      <Etiqueta texto="No ajustes la pantalla" desde={T.noAjustes} hasta={T.fin + 0.4} y={1560} color={C.red} tamano={56} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/apple/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_APPLE - 0.3, INICIO_LOGO_APPLE + 0.7, DURACION_APPLE_S - 1.5, DURACION_APPLE_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.abres, T.noAjustes].map((tc) => (
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
