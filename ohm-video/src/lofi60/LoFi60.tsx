import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { FocusTren } from "./FocusTren";
import { SleepLluvia } from "./SleepLluvia";
import { SleepNieve } from "./SleepNieve";
import { StudyEscritorio } from "./StudyEscritorio";

// Lo-fi horizontales a 60 fps en bucle perfecto (2 para dormir, 2 para estudiar).
// Las escenas se dibujan en un lienzo de 1920×1080 y la composición las amplía
// a 2560×1440 (vectorial, sin pérdida). Para 4K basta renderizar con --scale=1.5.
// `frames` es un número entero de compases de la música de cada uno
// (ver scripts/lofi60/bucle.py); `pulsos` son los tiempos que caben en el bucle.
const ANCHO = 2560;
const ALTO = 1440;

const ampliada = (Escena: React.FC): React.FC => {
  const Ampliada: React.FC = () => (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div
        style={{
          position: "absolute",
          width: 1920,
          height: 1080,
          transformOrigin: "0 0",
          transform: `scale(${ANCHO / 1920})`,
        }}
      >
        <Escena />
      </div>
    </AbsoluteFill>
  );
  return Ampliada;
};

export const LOFI60 = [
  {
    id: "Lofi60SleepLluvia",
    nombre: "dormir-lluvia-ventana",
    componente: ampliada(SleepLluvia),
    frames: 7432, // 32 compases a 62 BPM
  },
  {
    id: "Lofi60SleepNieve",
    nombre: "dormir-cabana-nieve",
    componente: ampliada(SleepNieve),
    frames: 6982, // 32 compases a 66 BPM
  },
  {
    id: "Lofi60StudyEscritorio",
    nombre: "estudio-escritorio-noche",
    componente: ampliada(StudyEscritorio),
    frames: 6857, // 40 compases a 84 BPM
  },
  {
    id: "Lofi60FocusTren",
    nombre: "estudio-tren-atardecer",
    componente: ampliada(FocusTren),
    frames: 6400, // 40 compases a 90 BPM
  },
] as const;

export const ComposicionesLoFi60: React.FC = () => (
  <>
    {LOFI60.map((l) => (
      <Composition
        key={l.id}
        id={l.id}
        component={l.componente}
        durationInFrames={l.frames}
        fps={60}
        width={ANCHO}
        height={ALTO}
      />
    ))}
  </>
);
