import { Easing, interpolate } from "remotion";
import { C, clamp, mono } from "../theme";

// Utilidades de los mundos recorridos con cámara: claves [tiempo, centro x, centro y, zoom], etiquetas y píldoras
export type ClaveCamara = [number, number, number, number];

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

export const camaraEn = (K: ClaveCamara[], t: number) => {
  let k = 0;
  while (k < K.length - 1 && K[k + 1][0] <= t) {
    k++;
  }
  const a = K[k];
  const b = K[Math.min(k + 1, K.length - 1)];
  const p = b[0] === a[0] ? 0 : interpolate(t, [a[0], b[0]], [0, 1], suave);
  return { cx: a[1] + (b[1] - a[1]) * p, cy: a[2] + (b[2] - a[2]) * p, zoom: a[3] + (b[3] - a[3]) * p };
};

// Etiqueta anclada a un punto del mundo, con tamaño constante en pantalla
export const Tag: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly color: string; readonly o: number; readonly dx?: number; readonly dy?: number }> = ({
  x,
  y,
  texto,
  color,
  o,
  dx = 0,
  dy = -90,
}) => {
  if (o <= 0) {
    return null;
  }
  const ancho = texto.length * 22 + 36;
  return (
    <g opacity={o}>
      <line x1={x} y1={y} x2={x + dx} y2={y + dy + (dy < 0 ? 26 : -30)} stroke={color} strokeWidth={2} opacity={0.7} />
      <circle cx={x} cy={y} r={6} fill={color} />
      <rect x={x + dx - ancho / 2} y={y + dy - 30} width={ancho} height={56} rx={14} fill={C.pill} stroke={color} strokeWidth={2} />
      <text x={x + dx} y={y + dy + 10} textAnchor="middle" fill={color} fontFamily={mono} fontSize={36} fontWeight={700}>
        {texto}
      </text>
    </g>
  );
};

// Píldora de texto grande en el mundo
export const Pildora: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly color: string; readonly o: number; readonly tam?: number }> = ({
  x,
  y,
  texto,
  color,
  o,
  tam = 50,
}) =>
  o > 0 ? (
    <g opacity={o}>
      <rect x={x - (texto.length * tam * 0.62 + 50) / 2} y={y - tam * 0.95} width={texto.length * tam * 0.62 + 50} height={tam * 1.6} rx={20} fill="#1A1430" stroke={color} strokeWidth={4} />
      <text x={x} y={y + tam * 0.3} textAnchor="middle" fill={color} fontFamily={mono} fontSize={tam} fontWeight={700}>
        {texto}
      </text>
    </g>
  ) : null;

// Panel oscuro de fondo
export const Panel: React.FC<{ readonly x0: number; readonly y0: number; readonly x1: number; readonly y1: number; readonly fill?: string }> = ({ x0, y0, x1, y1, fill = "#14102A" }) => (
  <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} rx={40} fill={fill} stroke="#3A3360" strokeWidth={4} />
);

// Ventana de aparición: sube en `entra`, se mantiene y baja en `sale`
export const ventanaEn = (t: number, a: number, b: number, entra = 0.4, sale = 0.4) => interpolate(t, [a, a + entra, b - sale, b], [0, 1, 1, 0], clamp);
