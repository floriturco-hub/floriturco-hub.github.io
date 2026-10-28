import { random } from "remotion";

// Montón de burbujas de espuma: `cantidad` de 0 a 1 decide cuántas se ven; deterministas por `semilla`
const MAX = 46;

export const Espuma: React.FC<{ readonly x: number; readonly y: number; readonly ancho: number; readonly alto: number; readonly cantidad: number; readonly semilla: string; readonly t: number }> = ({
  x,
  y,
  ancho,
  alto,
  cantidad,
  semilla,
  t,
}) => {
  const n = Math.round(Math.max(0, Math.min(1, cantidad)) * MAX);
  return (
    <g>
      {new Array(n).fill(0).map((_, i) => {
        const a = random(`${semilla}a${i}`) * Math.PI;
        const r = Math.sqrt(random(`${semilla}r${i}`));
        const bx = x + Math.cos(a) * r * ancho * 0.5 * (random(`${semilla}s${i}`) > 0.5 ? 1 : -1);
        const by = y - Math.sin(a) * r * alto;
        const radio = 5 + random(`${semilla}d${i}`) * 11;
        const latido = 1 + 0.04 * Math.sin(t * 3 + i);
        return (
          <g key={i}>
            <circle cx={bx} cy={by} r={radio * latido} fill="#FFFFFF" opacity={0.82} />
            <circle cx={bx} cy={by} r={radio * latido} fill="none" stroke="#C8C0E0" strokeWidth={1.2} />
            <circle cx={bx - radio * 0.35} cy={by - radio * 0.35} r={radio * 0.22} fill="#FFFFFF" />
          </g>
        );
      })}
    </g>
  );
};
