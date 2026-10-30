import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Composicion, Evidencia, Gancho, Influye, Origen, Sabor, T } from "./Escenas";

export const INICIO_LOGO_PINA = T.fin + 0.5;
export const DURACION_PINA_S = INICIO_LOGO_PINA + 6.5;
const D = INICIO_LOGO_PINA - 61.5;

export const PinaMito: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="La piña y la pregunta" desde={0} hasta={T.empecemos}>
        {(t0) => <Gancho t0={t0} fase="intro" />}
      </Escena>
      <Escena nombre="Composición" desde={T.empecemos} hasta={T.noViene}>
        {(t0) => <Composicion t0={t0} />}
      </Escena>
      <Escena nombre="De dónde sale la fructosa" desde={T.noViene} hasta={T.alcalino}>
        {(t0) => <Origen t0={t0} />}
      </Escena>
      <Escena nombre="pH y sabor" desde={T.alcalino} hasta={T.pina}>
        {(t0) => <Sabor t0={t0} />}
      </Escena>
      <Escena nombre="Evidencia" desde={T.pina} hasta={T.influye}>
        {(t0) => <Evidencia t0={t0} />}
      </Escena>
      <Escena nombre="Lo que sí influye" desde={T.influye} hasta={T.magia}>
        {(t0) => <Influye t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.magia} hasta={INICIO_LOGO_PINA}>
        {(t0) => <Gancho t0={t0} fase="final" />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_PINA} hasta={DURACION_PINA_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_PINA} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="¿Mito o verdad?" desde={T.mito} hasta={T.empecemos - 0.1} y={1500} color={C.yellow} tamano={60} />
      <Etiqueta texto="Energía para los espermatozoides" desde={T.energia} hasta={T.noViene - 0.1} y={1720} color={C.yellow} tamano={38} />
      <Etiqueta texto="No viene de la fruta" desde={T.noViene + 0.6} hasta={T.glandulas - 0.1} y={1500} color={C.red} />
      <Etiqueta texto="Se fabrica de la glucosa" desde={T.glucosa} hasta={T.estable - 0.1} y={1780} color={C.yellow} />
      <Etiqueta texto="Ligeramente alcalino" desde={T.alcalino + 0.5} hasta={T.salado - 0.1} y={1640} />
      <Etiqueta texto="Varía entre personas" desde={T.persona + 0.5} hasta={T.pina - 0.1} y={1640} color={C.yellow} />
      <Etiqueta texto="Sin pruebas" desde={T.estudio + 0.6} hasta={T.anecdotas - 0.1} y={1640} color={C.red} />
      <Etiqueta texto="Lo que sí influye" desde={T.influye + 0.4} hasta={T.beber - 0.1} y={1400} color={C.cyan} />
      <Etiqueta texto="Ante dudas, al médico" desde={T.consulta} hasta={T.magia - 0.1} y={1440} color={C.red} />
      <Etiqueta texto="No hace magia" desde={T.magia + 1.4} hasta={T.fin + 0.4} y={1560} color={C.yellow} tamano={64} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/pina/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_PINA - 0.3, INICIO_LOGO_PINA + 0.7, DURACION_PINA_S - 1.5, DURACION_PINA_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.noViene + 0.6, T.anecdotas + 1.2].map((tc) => (
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
