import { Composition } from "remotion";
import {
  JazzCafe,
  JazzClub,
  StudyAtardecer,
  StudyEscritorio,
} from "./EscenasCafe";
import {
  CityAzotea,
  CitySkyline,
  NatureBosque,
  NatureLago,
} from "./EscenasExterior";
import {
  RainyCalle,
  RainyVentana,
  SleepyAurora,
  SleepyPueblo,
} from "./EscenasNoche";

// Animaciones lo-fi horizontales en bucle perfecto (2 por estilo).
// La duración de cada una es un número entero de compases de su música
// (ver scratchpad/lofi en la sesión: tempo detectado con librosa).
// El audio (música + ambiente) se monta aparte con ffmpeg a la misma duración.
const LOFI = [
  {
    id: "LofiRainy1",
    nombre: "rainy-night-1",
    componente: RainyVentana,
    frames: 3281,
  },
  {
    id: "LofiRainy2",
    nombre: "rainy-night-2",
    componente: RainyCalle,
    frames: 3334,
  },
  {
    id: "LofiSleepy1",
    nombre: "sleepy-ambient-1",
    componente: SleepyAurora,
    frames: 3240,
  },
  {
    id: "LofiSleepy2",
    nombre: "sleepy-ambient-2",
    componente: SleepyPueblo,
    frames: 3120,
  },
  { id: "LofiJazz1", nombre: "jazzhop-1", componente: JazzCafe, frames: 3219 },
  { id: "LofiJazz2", nombre: "jazzhop-2", componente: JazzClub, frames: 3240 },
  {
    id: "LofiStudy1",
    nombre: "study-1",
    componente: StudyEscritorio,
    frames: 3337,
  },
  {
    id: "LofiStudy2",
    nombre: "study-2",
    componente: StudyAtardecer,
    frames: 3310,
  },
  {
    id: "LofiCity1",
    nombre: "night-city-1",
    componente: CitySkyline,
    frames: 3200,
  },
  {
    id: "LofiCity2",
    nombre: "night-city-2",
    componente: CityAzotea,
    frames: 3345,
  },
  {
    id: "LofiNature1",
    nombre: "nature-1",
    componente: NatureBosque,
    frames: 3233,
  },
  {
    id: "LofiNature2",
    nombre: "nature-2",
    componente: NatureLago,
    frames: 3315,
  },
] as const;

export const ComposicionesLoFi: React.FC = () => (
  <>
    {LOFI.map((l) => (
      <Composition
        key={l.id}
        id={l.id}
        component={l.componente}
        durationInFrames={l.frames}
        fps={30}
        width={1920}
        height={1080}
      />
    ))}
  </>
);
