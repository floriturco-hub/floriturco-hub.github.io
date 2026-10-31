import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import { Bombeo, Conclusion, Gancho, Microbios, Pestanas, Piston, QueHacer, SecaTubo, T } from "./Escenas";

export const INICIO_LOGO_RIMEL = T.fin + 0.5;
export const DURACION_RIMEL_S = INICIO_LOGO_RIMEL + 6.5;
const D = INICIO_LOGO_RIMEL - 61.5;

export const RimelBombeo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena nombre="Bombear seca" desde={0} hasta={T.tubo}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="Como un émbolo" desde={T.tubo} hasta={T.cada}>
        {(t0) => <Piston t0={t0} />}
      </Escena>
      <Escena nombre="Aire nuevo" desde={T.cada} hasta={T.hecho}>
        {(t0) => <Bombeo t0={t0} />}
      </Escena>
      <Escena nombre="Se seca al aire" desde={T.hecho} hasta={T.siLeDas}>
        {(t0) => <Pestanas t0={t0} />}
      </Escena>
      <Escena nombre="Se seca en el tubo" desde={T.siLeDas} hasta={T.ademas}>
        {(t0) => <SecaTubo t0={t0} />}
      </Escena>
      <Escena nombre="Microbios" desde={T.ademas} hasta={T.que}>
        {(t0) => <Microbios t0={t0} />}
      </Escena>
      <Escena nombre="Qué hacer" desde={T.que} hasta={T.bombear}>
        {(t0) => <QueHacer t0={t0} />}
      </Escena>
      <Escena nombre="Conclusión" desde={T.bombear} hasta={INICIO_LOGO_RIMEL}>
        {(t0) => <Conclusion t0={t0} />}
      </Escena>
      <Escena nombre="Logo" desde={INICIO_LOGO_RIMEL} hasta={DURACION_RIMEL_S}>
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_RIMEL} />}
      </Escena>

      {/* Etiquetas-clave: 2–4 palabras */}
      <Etiqueta texto="¿Bombear para cargar?" desde={0.15} hasta={T.secando - 0.1} y={1560} color={C.yellow} tamano={54} />
      <Etiqueta texto="Lo estás secando" desde={T.secando} hasta={T.tubo - 0.1} y={1560} color={C.red} tamano={64} />
      <Etiqueta texto="Encaja casi justo" desde={T.encaja} hasta={T.jeringa - 0.1} y={1520} color={C.yellow} />
      <Etiqueta texto="Como una jeringa" desde={T.jeringa} hasta={T.cada - 0.1} y={1520} />
      <Etiqueta texto="Empujas aire dentro" desde={T.empujas} hasta={T.bombea - 0.1} y={1500} color={C.white} />
      <Etiqueta texto="Hecho para secarse" desde={T.secarse} hasta={T.agua - 0.1} y={1420} color={C.yellow} />
      <Etiqueta texto="Agua o disolventes" desde={T.agua} hasta={T.evaporan - 0.1} y={1420} color={C.cyan} />
      <Etiqueta texto="Se evaporan y fija" desde={T.evaporan} hasta={T.siLeDas - 0.1} y={1420} color={C.cyan} />
      <Etiqueta texto="Se seca en el tubo" desde={T.empieza} hasta={T.espeso - 0.1} y={1560} color={C.orange} />
      <Etiqueta texto="Espeso y con grumos" desde={T.espeso} hasta={T.dura - 0.1} y={1560} color={C.orange} />
      <Etiqueta texto="Dura menos" desde={T.dura} hasta={T.ademas - 0.1} y={1560} color={C.red} />
      <Etiqueta texto="Pueden entrar microbios" desde={T.entrar} hasta={T.oscuro - 0.1} y={1500} color={C.white} />
      <Etiqueta texto="Oscuro y húmedo" desde={T.oscuro + 0.4} hasta={T.ojos - 0.1} y={1500} color={C.cyan} />
      <Etiqueta texto="Cerca de tus ojos" desde={T.ojos + 0.2} hasta={T.que - 0.1} y={1500} color={C.red} />
      <Etiqueta texto="Más aire al tubo" desde={T.aire} hasta={T.fin + 0.4} y={1460} color={C.yellow} tamano={64} />

      {/* Sonido: esquema aprobado */}
      <Audio src={staticFile("audio/rimel/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, INICIO_LOGO_RIMEL - 0.3, INICIO_LOGO_RIMEL + 0.7, DURACION_RIMEL_S - 1.5, DURACION_RIMEL_S],
            [0, 0.2, 0.2, 0.45, 0.45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.secando, T.diez, T.cierra, T.aire].map((tc) => (
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
