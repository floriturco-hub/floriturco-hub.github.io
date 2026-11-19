import { interpolateColors, random } from "remotion";
import { C, H, W } from "../theme";

export const PASO = 180;
export const R_ION = 30;
export const R_ELECTRON = 9;

export const ionX = (i: number) => 90 + i * PASO;
export const ionY = (j: number) => 120 + j * PASO;

const IONES = (() => {
  const lista: { i: number; j: number; fase: number }[] = [];
  for (let i = -1; i <= 6; i++) {
    for (let j = 0; j <= 10; j++) {
      lista.push({ i, j, fase: random(`ion${i}-${j}`) * Math.PI * 2 });
    }
  }
  return lista;
})();

type RedProps = {
  readonly t: number;
  readonly calor: number; // 0 = frío, 1 = caliente
  readonly opacidad?: number;
};

// Red cristalina de iones de cobre (+). Con calor vibran más y se tiñen de naranja.
export const Red: React.FC<RedProps> = ({ t, calor, opacidad = 1 }) => {
  const amplitud = 3 + 15 * calor;
  const relleno = interpolateColors(calor, [0, 1], [C.purple, "#A8402C"]);
  const borde = interpolateColors(calor, [0, 1], [C.purpleLight, C.orange]);
  return (
    <g opacity={opacidad}>
      {IONES.map(({ i, j, fase }) => {
        const dx = amplitud * Math.sin(t * (9 + 6 * calor) + fase);
        const dy = amplitud * Math.cos(t * (11 + 5 * calor) + fase * 1.7);
        const x = ionX(i) + dx;
        const y = ionY(j) + dy;
        return (
          <g key={`${i}-${j}`}>
            {calor > 0.05 ? (
              <circle cx={x} cy={y} r={R_ION * 1.9} fill={C.orange} opacity={0.12 * calor} />
            ) : null}
            <circle cx={x} cy={y} r={R_ION} fill={relleno} stroke={borde} strokeWidth={4} />
            <text
              x={x}
              y={y + 11}
              textAnchor="middle"
              fill="#FFFFFF"
              opacity={0.6}
              fontSize={32}
              fontWeight={700}
            >
              +
            </text>
          </g>
        );
      })}
    </g>
  );
};

// Movimiento térmico: tramos rectos de 0,35 s en direcciones aleatorias (camino aleatorio)
const DT = 0.35;
const VEL_TERMICA = 260;
const N_ELECTRONES = 70;
const N_TRAMOS = 200;

const CAMINOS = new Array(N_ELECTRONES).fill(0).map((_, e) => {
  const x0 = random(`x${e}`) * W;
  const y0 = random(`y${e}`) * H;
  const acumX = [x0];
  const acumY = [y0];
  const vx: number[] = [];
  const vy: number[] = [];
  for (let k = 0; k < N_TRAMOS; k++) {
    const ang = random(`a${e}-${k}`) * Math.PI * 2;
    vx.push(Math.cos(ang) * VEL_TERMICA);
    vy.push(Math.sin(ang) * VEL_TERMICA);
    acumX.push(acumX[k] + vx[k] * DT);
    acumY.push(acumY[k] + vy[k] * DT);
  }
  return { acumX, acumY, vx, vy };
});

const envolver = (v: number, max: number) => ((v % max) + max) % max;

type ElectronesProps = {
  readonly tau: number; // segundos desde que empieza el movimiento
  readonly deriva: number; // desplazamiento acumulado por el campo (px)
  readonly opacidad?: number;
};

export const Electrones: React.FC<ElectronesProps> = ({
  tau,
  deriva,
  opacidad = 1,
}) => {
  const k = Math.min(N_TRAMOS - 1, Math.max(0, Math.floor(tau / DT)));
  const resto = Math.max(0, tau - k * DT);
  return (
    <g opacity={opacidad}>
      {CAMINOS.map((c, e) => {
        const x = envolver(c.acumX[k] + c.vx[k] * resto + deriva, W + 60) - 30;
        const y = envolver(c.acumY[k] + c.vy[k] * resto, H);
        return (
          <g key={e}>
            <circle cx={x} cy={y} r={R_ELECTRON * 2.2} fill={C.cyan} opacity={0.18} />
            <circle cx={x} cy={y} r={R_ELECTRON} fill={C.cyan} />
          </g>
        );
      })}
    </g>
  );
};
