import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { Logo } from "../scenes/Logo";
import { C, clamp, H, mono, W } from "../theme";
import { Escena } from "./Escena";
import { Etiqueta } from "./Etiqueta";
import { Fondo } from "./Fondo";

// Piezas comunes de los Shorts a partir de oro/inmune/oidos/humo/moneda.
// Los vídeos anteriores conservan sus copias locales de estas funciones.

export const aparece = (t: number, d: number) =>
  interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);

export const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

export const Lienzo: React.FC<{
  readonly children: React.ReactNode;
  readonly zoom?: number;
  readonly cy?: number;
}> = ({ children, zoom = 1, cy = 960 }) => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    <g
      transform={`translate(${540 - 540 * zoom} ${cy - cy * zoom}) scale(${zoom})`}
    >
      {children}
    </g>
  </svg>
);

export const Texto: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly children: React.ReactNode;
  readonly color?: string;
  readonly op?: number;
  readonly size?: number;
  readonly anchor?: "start" | "middle" | "end";
}> = ({
  x,
  y,
  children,
  color = C.white,
  op = 1,
  size = 36,
  anchor = "middle",
}) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    fill={color}
    fontFamily={mono}
    fontSize={size}
    fontWeight={700}
    opacity={op}
  >
    {children}
  </text>
);

export const Flash: React.FC<{
  readonly t: number;
  readonly d: number;
  readonly color?: string;
}> = ({ t, d, color = C.white }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: color,
      opacity: interpolate(t, [d, d + 0.08, d + 0.45], [0, 0.25, 0], clamp),
    }}
  />
);

// Tarjeta oscura redondeada (§4 del estilo)
export const Tarjeta: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly op?: number;
  readonly children?: React.ReactNode;
}> = ({ x, y, w, h, op = 1, children }) => (
  <g opacity={op}>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={24}
      fill={C.card}
      stroke={C.cardBorder}
      strokeWidth={2}
    />
    {children}
  </g>
);

export type EscenaDef = {
  readonly nombre: string;
  readonly desde: number;
  readonly hasta: number;
  readonly render: (t0: number) => React.ReactNode;
};

// [texto, desde, hasta, color, tamaño]
export type EtiquetaDef = readonly [string, number, number, string, number?];

export const duracionShort = (fin: number) => fin + 0.5 + 6.5;

// Plantilla de composición: escenas + etiquetas + narración + música + tics + logo
export const Short: React.FC<{
  readonly carpeta: string;
  readonly fin: number;
  readonly escenas: readonly EscenaDef[];
  readonly etiquetas: readonly EtiquetaDef[];
  readonly tics: readonly number[];
  readonly musica?: string;
}> = ({
  carpeta,
  fin,
  escenas,
  etiquetas,
  tics,
  musica = "audio/musica.mp3",
}) => {
  const { fps } = useVideoConfig();
  const inicio = fin + 0.5;
  const dur = duracionShort(fin);
  const D = inicio - 61.5;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      {escenas.map((e, k) => (
        <Escena
          key={e.nombre}
          nombre={e.nombre}
          desde={e.desde}
          hasta={k === escenas.length - 1 ? inicio : e.hasta}
        >
          {e.render}
        </Escena>
      ))}
      <Escena nombre="Logo" desde={inicio} hasta={dur}>
        {(t0) => <Logo t0={t0} inicio={inicio} />}
      </Escena>

      {etiquetas.map(([texto, desde, hasta, color, tamano]) => (
        <Etiqueta
          key={texto}
          texto={texto}
          desde={desde}
          hasta={hasta - 0.1}
          y={1560}
          color={color}
          tamano={tamano ?? 44}
        />
      ))}

      <Audio src={staticFile(`audio/${carpeta}/narracion.wav`)} />
      <Audio
        src={staticFile(musica)}
        volume={(f) =>
          interpolate(
            f / fps,
            [0, 1.5, inicio - 0.3, inicio + 0.7, dur - 1.5, dur],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            clamp,
          )
        }
      />
      {tics.map((tc) => (
        <Sequence
          key={tc}
          name="Tic"
          from={Math.round(tc * fps)}
          durationInFrames={Math.round(0.3 * fps)}
        >
          <Audio src={staticFile("audio/choque.wav")} volume={0.45} />
        </Sequence>
      ))}
      <Sequence
        name="SFX logo"
        from={Math.round((62.35 + D) * fps)}
        durationInFrames={Math.round(2.9 * fps)}
      >
        <Audio src={staticFile("audio/sfx_logo.wav")} volume={0.7} />
      </Sequence>
      <Sequence
        name="Voz: Frecuencia Cero"
        from={Math.round((63.75 + D) * fps)}
        durationInFrames={Math.round(1.7 * fps)}
      >
        <Audio src={staticFile("audio/frecuencia_cero.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};
