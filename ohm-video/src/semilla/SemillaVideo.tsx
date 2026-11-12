import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import narracion from "../../guion/semilla-gravedad/narracion.json";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Progreso, Subtitulos } from "../components/Retencion";
import { C } from "../theme";
import { SemillaMundo } from "./Semilla";
import { T } from "./tiempos";

// Retención (estilo §10): 37 s, bucle abierto, subtítulos arriba, barra de progreso y SIN logo: termina con «Porque solo en la Tierra…» y empalma con «¡Las raíces sienten la gravedad!»
export const DURACION_SEMILLA_S = T.fin + 0.3;

export const SemillaVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />

      <Escena sinEntrada nombre="Semilla, células y auxina" desde={0} hasta={DURACION_SEMILLA_S}>
        {(t0) => <SemillaMundo t0={t0} />}
      </Escena>

      <Subtitulos palabras={narracion.words} fin={T.fin} />
      <Progreso fin={DURACION_SEMILLA_S} />

      {/* Etiquetas-clave: 2–4 palabras. La primera (gancho) repite la frase de choque desde el primer fotograma */}
      <Etiqueta texto="¡Sienten la gravedad!" desde={-0.4} hasta={T.final - 0.1} y={1660} color={C.yellow} tamano={50} />
      <Etiqueta texto="¿Y en el espacio?" desde={T.final} hasta={T.punta - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Punta de la raíz" desde={T.punta} hasta={T.estatolitos - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Estatolitos" desde={T.estatolitos} hasta={T.piedras - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Caen como piedras" desde={T.piedras} hasta={T.presionan - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Presionan: ¡abajo!" desde={T.presionan} hasta={T.giras - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Si giras la semilla" desde={T.giras} hasta={T.curva - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="La raíz se curva" desde={T.curva} hasta={T.curvarse - 0.1} y={1660} color={C.white} />
      <Etiqueta texto="Hormona: auxina" desde={T.curvarse} hasta={T.raiz - 0.1} y={1660} color={C.orange} />
      <Etiqueta texto="Raíz: frena" desde={T.raiz} hasta={T.tallo - 0.1} y={1660} color={C.red} />
      <Etiqueta texto="Tallo: acelera" desde={T.tallo} hasta={T.asi - 0.1} y={1660} color={"#48C878"} />
      <Etiqueta texto="Raíz baja, tallo sube" desde={T.asi} hasta={T.espacio - 0.1} y={1660} color={C.yellow} />
      <Etiqueta texto="Espacio: cualquier lado" desde={T.espacio} hasta={T.porque - 0.1} y={1660} color={C.cyan} />
      <Etiqueta texto="En la Tierra… ¡gravedad!" desde={T.porque} hasta={DURACION_SEMILLA_S + 0.1} y={1660} color={C.yellow} tamano={50} />

      {/* Sonido: música a 0,1 bajo la voz, sin subida final (no hay logo); se funde en el último medio segundo */}
      <Audio src={staticFile("audio/semilla-gravedad/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) => interpolate(f / fps, [0, 1.2, DURACION_SEMILLA_S - 0.5, DURACION_SEMILLA_S], [0, 0.1, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {[1.0, T.granitos, 19.4, T.curvarse, T.espacio].map((tc) => (
        <Sequence key={tc} name="Tic" from={Math.round(tc * fps)} durationInFrames={Math.round(0.3 * fps)}>
          <Audio src={staticFile("audio/choque.wav")} volume={tc < 2 ? 0.6 : 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
