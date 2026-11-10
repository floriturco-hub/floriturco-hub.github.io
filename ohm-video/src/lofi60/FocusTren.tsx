import React from "react";
import { random } from "remotion";
import {
  Acabado,
  Capa,
  ciclos,
  frac,
  golpe,
  H,
  Luz,
  Marca,
  osc,
  TAU,
  useBucle,
  Vapor,
  Vertical,
  W,
} from "./Kit";

// ───────── Estudio 2: tren al atardecer ─────────
// Mesa de estudio junto a la ventanilla. El paisaje pasa en varios planos y los
// postes de la catenaria cruzan a compás de la música (uno cada dos tiempos),
// barriendo su sombra por la mesa.

const PULSOS = 160; // 40 compases a 90 BPM

// Ventanilla
const GX = 150;
const GY = 96;
const GW = 1620;
const GH = 594;
const SOL = { x: 1190, y: 452 };
const T = 1800; // ancho de las baldosas de paisaje

// Relieves periódicos (se repiten cada T)
const lejos = (x: number) =>
  476 -
  58 * (0.5 + 0.5 * Math.sin((TAU * 2 * x) / T + 1)) -
  40 * (0.5 + 0.5 * Math.sin((TAU * 5 * x) / T + 2.2)) -
  12 * Math.sin((TAU * 11 * x) / T + 0.7);
const medio = (x: number) =>
  566 -
  30 * (0.5 + 0.5 * Math.sin((TAU * 3 * x) / T + 0.4)) -
  18 * (0.5 + 0.5 * Math.sin((TAU * 7 * x) / T + 1.9));
const cerca = (x: number) =>
  648 -
  14 * (0.5 + 0.5 * Math.sin((TAU * 2 * x) / T)) -
  7 * Math.sin((TAU * 9 * x) / T + 1);

const camino = (f: (x: number) => number, fondo: number, paso: number) => {
  let d = `M -6 ${fondo}`;
  for (let x = -6; x <= T + 6; x += paso) d += ` L ${x} ${f(x).toFixed(1)}`;
  return `${d} L ${T + 6} ${f(T + 6).toFixed(1)} L ${T + 6} ${fondo} Z`;
};
const D_LEJOS = camino(lejos, 700, 20);
const D_MEDIO = camino(medio, 700, 20);
const D_CERCA = camino(cerca, 700, 20);

const ARBOLES = new Array(30).fill(0).map((_, k) => {
  const x = random(`ft-ax${k}`) * T;
  return {
    x,
    y: medio(x) + 4,
    s: 0.6 + random(`ft-as${k}`) * 0.8,
    pino: random(`ft-ap${k}`) > 0.5,
  };
});
const MOLINOS = [260, 900, 1420].map((x, k) => ({
  x,
  y: medio(x) + 2,
  s: 0.8 + 0.25 * k,
}));
const MATAS = new Array(22).fill(0).map((_, k) => {
  const x = random(`ft-mx${k}`) * T;
  return {
    x,
    y: cerca(x) + 6,
    w: 50 + random(`ft-mw${k}`) * 90,
    h: 14 + random(`ft-mh${k}`) * 26,
  };
});

// ── capa fija: cielo y sol ──
const Cielo = React.memo(() => (
  <Capa fija>
    <defs>
      <Vertical
        id="ft-cielo"
        paradas={[
          [0, "#27286A"],
          [0.28, "#5A3C8E"],
          [0.5, "#B8558C"],
          [0.66, "#F0806A"],
          [0.78, "#FFB868"],
          [0.86, "#FFDC9A"],
          [1, "#FFDC9A"],
        ]}
      />
      <clipPath id="ft-vent0">
        <rect x={GX} y={GY} width={GW} height={GH} rx={46} />
      </clipPath>
    </defs>
    <g clipPath="url(#ft-vent0)">
      <rect x={GX} y={GY} width={GW} height={GH} fill="url(#ft-cielo)" />
      {new Array(40).fill(0).map((_, k) => (
        <circle
          key={k}
          cx={GX + random(`ft-ex${k}`) * GW}
          cy={GY + random(`ft-ey${k}`) ** 2 * 170}
          r={0.7 + random(`ft-er${k}`) * 1.2}
          fill="#FFF0FF"
          opacity={0.25 + random(`ft-eo${k}`) * 0.4}
        />
      ))}
      <Luz
        id="ft-halo-sol"
        cx={SOL.x}
        cy={SOL.y + 30}
        r={0}
        rx={760}
        ry={420}
        color="#FFE2A0"
        op={0.95}
      />
      <circle cx={SOL.x} cy={SOL.y} r={66} fill="#FFF6D8" />
      <circle cx={SOL.x} cy={SOL.y} r={90} fill="#FFF0C0" opacity={0.35} />
    </g>
  </Capa>
));

const Pajaro: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly ala: number;
}> = ({ x, y, s, ala }) => (
  <path
    d={`M ${x - 11 * s} ${y - ala * 5 * s} Q ${x - 5 * s} ${y - 4 * s} ${x} ${y} Q ${x + 5 * s} ${y - 4 * s} ${x + 11 * s} ${y - ala * 5 * s}`}
    fill="none"
    stroke="#3A2450"
    strokeWidth={2.2 * s}
    strokeLinecap="round"
  />
);

// ── capa viva: el paisaje que pasa ──
const Paisaje: React.FC = () => {
  const { fase, L } = useBucle();
  const b = fase * PULSOS;
  const dLejos = frac(fase) * T;
  const dMedio = frac(4 * fase) * T;
  const dCerca = frac(36 * fase) * T;
  const dNubes = frac(fase) * GW;
  // poste: cruza por delante del sol justo en los tiempos 1 y 3 de cada compás
  const SEP = 3200;
  const p = frac(b / 2 + (GX + GW + 200 - SOL.x) / SEP);
  const xPoste = GX + GW + 200 - p * SEP;
  const cable = (y0: number, caida: number) => {
    let d = "";
    for (let x = GX - 20; x <= GX + GW + 20; x += 54) {
      const u = frac((x - xPoste) / SEP);
      d += `${d ? "L" : "M"} ${x} ${(y0 + caida * 4 * u * (1 - u)).toFixed(1)} `;
    }
    return d;
  };
  const giro = 360 * frac(ciclos(L, 5.2) * fase);
  return (
    <Capa>
      <defs>
        <clipPath id="ft-vent1">
          <rect x={GX} y={GY} width={GW} height={GH} rx={46} />
        </clipPath>
        <Vertical
          id="ft-nube"
          paradas={[
            [0, "#8A4E96", 0.9],
            [0.55, "#E87A7A", 0.9],
            [1, "#FFC078", 0.95],
          ]}
        />
        <Vertical
          id="ft-mlejos"
          paradas={[
            [0, "#7A4E98"],
            [1, "#C0688C"],
          ]}
        />
        <Vertical
          id="ft-agua"
          paradas={[
            [0, "#FFC078"],
            [1, "#B85C8A"],
          ]}
        />
        <Vertical
          id="ft-mmedio"
          paradas={[
            [0, "#4A2C68"],
            [1, "#3A2258"],
          ]}
        />
        <Vertical
          id="ft-mcerca"
          paradas={[
            [0, "#2A1838"],
            [1, "#1C1028"],
          ]}
        />
        <linearGradient id="ft-poste" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1A1020" stopOpacity="0" />
          <stop offset="0.5" stopColor="#1A1020" stopOpacity="0.9" />
          <stop offset="1" stopColor="#1A1020" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g clipPath="url(#ft-vent1)">
        {/* nubes largas encendidas por abajo */}
        {[-1, 0].map((rep) => (
          <g key={rep} transform={`translate(${GX + dNubes + rep * GW} 0)`}>
            {[
              [200, 180, 300, 15],
              [560, 236, 240, 12],
              [980, 160, 340, 17],
              [1320, 268, 260, 12],
              [760, 320, 200, 9],
              [1500, 340, 180, 8],
            ].map(([x, y, rx, ry]) => (
              <ellipse
                key={`${x}-${y}`}
                cx={x}
                cy={y}
                rx={rx}
                ry={ry}
                fill="url(#ft-nube)"
                opacity={0.75}
              />
            ))}
          </g>
        ))}
        {/* bandada lejana */}
        {new Array(7).fill(0).map((_, k) => {
          const u = frac(fase + 0.55);
          const x =
            GX + GW + 80 - u * (GW + 200) + (k % 4) * 34 - (k > 3 ? 60 : 0);
          const y =
            250 +
            (k % 4) * 15 +
            (k > 3 ? 44 : 0) +
            6 * osc(fase, ciclos(L, 7), k / 7);
          return (
            <Pajaro
              key={k}
              x={x}
              y={y}
              s={0.8 + (k % 3) * 0.15}
              ala={osc(fase, ciclos(L, 0.7), k / 7)}
            />
          );
        })}
        {/* montañas lejanas */}
        {[0, 1].map((rep) => (
          <path
            key={rep}
            d={D_LEJOS}
            fill="url(#ft-mlejos)"
            transform={`translate(${GX - dLejos + rep * T} 0)`}
          />
        ))}
        {/* agua con el reflejo del sol */}
        <rect x={GX} y={548} width={GW} height={70} fill="url(#ft-agua)" />
        {new Array(12).fill(0).map((_, k) => {
          const ancho =
            (26 + k * 9) * (0.65 + 0.35 * osc(fase, 9 + (k % 5), k / 12));
          return (
            <rect
              key={k}
              x={SOL.x + 9 * osc(fase, 7 + (k % 4), k / 5) - ancho / 2}
              y={552 + k * 5.4}
              width={ancho}
              height={2.6}
              rx={1.3}
              fill="#FFF6D8"
              opacity={0.85 - k * 0.05}
            />
          );
        })}
        {/* colinas con árboles y molinos de viento */}
        {[0, 1].map((rep) => (
          <g key={rep} transform={`translate(${GX - dMedio + rep * T} 0)`}>
            <path d={D_MEDIO} fill="url(#ft-mmedio)" />
            {ARBOLES.map((a, k) =>
              a.pino ? (
                <path
                  key={k}
                  d={`M ${a.x} ${a.y - 46 * a.s} L ${a.x + 13 * a.s} ${a.y} L ${a.x - 13 * a.s} ${a.y} Z`}
                  fill="#34204E"
                />
              ) : (
                <g key={k} fill="#34204E">
                  <ellipse
                    cx={a.x}
                    cy={a.y - 22 * a.s}
                    rx={17 * a.s}
                    ry={20 * a.s}
                  />
                  <rect
                    x={a.x - 2}
                    y={a.y - 8 * a.s}
                    width={4}
                    height={10 * a.s}
                  />
                </g>
              ),
            )}
            {MOLINOS.map((m, k) => (
              <g key={k} transform={`translate(${m.x} ${m.y}) scale(${m.s})`}>
                <path
                  d="M -3 0 L -1.5 -92 L 1.5 -92 L 3 0 Z"
                  fill="#E8D8E8"
                  opacity={0.85}
                />
                <g
                  transform={`translate(0 -92) rotate(${giro + k * 40})`}
                  fill="#F4E8F0"
                  opacity={0.9}
                >
                  {[0, 120, 240].map((a) => (
                    <path
                      key={a}
                      d="M 0 0 L 3.4 -12 L 1.2 -48 L -1.6 -12 Z"
                      transform={`rotate(${a})`}
                    />
                  ))}
                  <circle r={3.2} />
                </g>
              </g>
            ))}
          </g>
        ))}
        {/* campo cercano: pasa rápido */}
        {[0, 1].map((rep) => (
          <g key={rep} transform={`translate(${GX - dCerca + rep * T} 0)`}>
            <path d={D_CERCA} fill="url(#ft-mcerca)" />
            {MATAS.map((m, k) => (
              <ellipse
                key={k}
                cx={m.x}
                cy={m.y}
                rx={m.w}
                ry={m.h}
                fill="#241430"
              />
            ))}
          </g>
        ))}
        {/* cables de la catenaria y poste con desenfoque de movimiento */}
        <path
          d={cable(GY + 78, 70)}
          fill="none"
          stroke="#2A1830"
          strokeWidth={2.4}
          opacity={0.75}
        />
        <path
          d={cable(GY + 122, 26)}
          fill="none"
          stroke="#2A1830"
          strokeWidth={2}
          opacity={0.6}
        />
        <g transform={`translate(${xPoste} 0)`}>
          <rect
            x={-34}
            y={GY + 40}
            width={68}
            height={GH}
            fill="url(#ft-poste)"
          />
          <rect
            x={-150}
            y={GY + 66}
            width={170}
            height={20}
            fill="url(#ft-poste)"
            opacity={0.7}
          />
        </g>
      </g>
    </Capa>
  );
};

// ── capa fija: interior del vagón ──
const Interior = React.memo(() => (
  <Capa fija>
    <defs>
      <Vertical
        id="ft-pared"
        paradas={[
          [0, "#241826"],
          [0.6, "#2E1E2C"],
          [1, "#1E1420"],
        ]}
      />
      <Vertical
        id="ft-mesa"
        paradas={[
          [0, "#B87650"],
          [0.5, "#8A5640"],
          [1, "#5E3A30"],
        ]}
      />
      <linearGradient id="ft-brillo-mesa" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFD890" stopOpacity="0.6" />
        <stop offset="1" stopColor="#FFD890" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="ft-reflejo" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.1" />
        <stop offset="0.3" stopColor="#FFFFFF" stopOpacity="0" />
        <stop offset="0.6" stopColor="#FFFFFF" stopOpacity="0.05" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <filter id="ft-b10" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="10" />
      </filter>
      <filter id="ft-b6" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>
    {/* reflejo del vidrio */}
    <rect
      x={GX}
      y={GY}
      width={GW}
      height={GH}
      rx={46}
      fill="url(#ft-reflejo)"
    />
    {/* pared con el hueco de la ventanilla */}
    <path
      fillRule="evenodd"
      fill="url(#ft-pared)"
      d={`M 0 0 H ${W} V ${H} H 0 Z M ${GX + 46} ${GY} H ${GX + GW - 46} Q ${GX + GW} ${GY} ${GX + GW} ${GY + 46} V ${GY + GH - 46} Q ${GX + GW} ${GY + GH} ${GX + GW - 46} ${GY + GH} H ${GX + 46} Q ${GX} ${GY + GH} ${GX} ${GY + GH - 46} V ${GY + 46} Q ${GX} ${GY} ${GX + 46} ${GY} Z`}
    />
    <Luz
      id="ft-luz-atardecer"
      cx={SOL.x}
      cy={620}
      r={0}
      rx={1300}
      ry={560}
      color="#FF9A5A"
      op={0.22}
    />
    {/* junta de goma y bisel de la ventanilla */}
    <rect
      x={GX - 10}
      y={GY - 10}
      width={GW + 20}
      height={GH + 20}
      rx={54}
      fill="none"
      stroke="#120C16"
      strokeWidth={20}
    />
    <rect
      x={GX - 24}
      y={GY - 24}
      width={GW + 48}
      height={GH + 48}
      rx={66}
      fill="none"
      stroke="#4A3444"
      strokeWidth={8}
    />
    <rect
      x={GX - 22}
      y={GY - 22}
      width={GW + 44}
      height={GH + 44}
      rx={64}
      fill="none"
      stroke="#FFB078"
      strokeWidth={2}
      opacity={0.35}
    />
    {/* portaequipajes y luz de lectura */}
    <rect x={0} y={22} width={W} height={18} fill="#3A2A38" />
    <rect x={0} y={40} width={W} height={5} fill="#120C16" />
    {[260, 700, 1220, 1660].map((x) => (
      <rect key={x} x={x} y={0} width={14} height={26} fill="#4A3646" />
    ))}
    <ellipse cx={420} cy={56} rx={38} ry={9} fill="#FFE2A8" opacity={0.8} />
    <Luz id="ft-lectura" cx={420} cy={60} r={170} color="#FFD08A" op={0.3} />

    {/* repisa bajo la ventanilla */}
    <rect
      x={GX - 40}
      y={GY + GH + 26}
      width={GW + 80}
      height={22}
      rx={8}
      fill="#3A2836"
    />
    <rect
      x={GX - 40}
      y={GY + GH + 26}
      width={GW + 80}
      height={3}
      fill="#FFB078"
      opacity={0.4}
    />
    <rect
      x={GX - 40}
      y={GY + GH + 48}
      width={GW + 80}
      height={46}
      fill="#160E18"
      opacity={0.6}
    />

    {/* asiento de la derecha, en primer plano y desenfocado */}
    <g filter="url(#ft-b6)">
      <path
        d="M 1790 1100 V 620 Q 1790 540 1870 540 H 1960 V 1100 Z"
        fill="#3A2440"
      />
      <path
        d="M 1790 1100 V 620 Q 1790 540 1870 540"
        fill="none"
        stroke="#FF9A6A"
        strokeWidth={5}
        opacity={0.45}
      />
      <rect x={1800} y={560} width={140} height={70} rx={24} fill="#4A3052" />
    </g>

    {/* mesa plegable */}
    <ellipse cx={960} cy={1010} rx={900} ry={60} fill="#0C0810" opacity={0.6} />
    <path d="M 300 800 H 1620 L 1770 968 H 150 Z" fill="url(#ft-mesa)" />
    <path
      d="M 150 968 H 1770 V 996 Q 1770 1004 1760 1004 H 160 Q 150 1004 150 996 Z"
      fill="#3E2622"
    />
    <path
      d="M 300 800 H 1620 L 1680 866 H 240 Z"
      fill="url(#ft-brillo-mesa)"
      opacity={0.55}
    />
    <line
      x1={300}
      y1={801}
      x2={1620}
      y2={801}
      stroke="#FFE0B0"
      strokeWidth={2.5}
      opacity={0.6}
    />
    <rect x={880} y={1004} width={160} height={90} fill="#1A1016" />

    {/* portátil */}
    <g>
      <path d="M 410 936 L 470 846 H 930 L 980 936 Z" fill="#2E2C40" />
      <path
        d="M 410 936 H 980 V 948 Q 980 954 972 954 H 418 Q 410 954 410 948 Z"
        fill="#1E1C2E"
      />
      <path d="M 486 860 H 916 L 946 916 H 450 Z" fill="#1A1828" />
      {[0, 1, 2, 3].map((r) => (
        <path
          key={r}
          d={`M ${480 - r * 9} ${872 + r * 13} H ${922 + r * 7}`}
          stroke="#3A3852"
          strokeWidth={7}
          strokeDasharray="20 6"
        />
      ))}
      <rect x={452} y={596} width={496} height={256} rx={12} fill="#16141F" />
      <rect
        x={452}
        y={596}
        width={496}
        height={256}
        rx={12}
        fill="none"
        stroke="#FFB078"
        strokeWidth={2}
        opacity={0.4}
      />
    </g>

    {/* cuaderno y lápiz */}
    <g transform="translate(1160 900)">
      <ellipse cx={0} cy={30} rx={190} ry={16} fill="#2A1614" opacity={0.5} />
      <path d="M -170 26 L -140 -44 L 0 -40 L 0 34 Z" fill="#E8DCC8" />
      <path d="M 170 26 L 140 -44 L 0 -40 L 0 34 Z" fill="#D8CAB4" />
      <path d="M 0 -40 L 0 34" stroke="#A89880" strokeWidth={3} />
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <path
          key={k}
          d={`M ${-136 - k * 4} ${-30 + k * 10} L -14 ${-27 + k * 10}`}
          stroke="#6A6078"
          strokeWidth={2.4}
          opacity={0.6}
        />
      ))}
      {[0, 1, 2].map((k) => (
        <path
          key={k}
          d={`M 14 ${-27 + k * 10} L ${120 - k * 26} ${-30 + k * 10}`}
          stroke="#6A6078"
          strokeWidth={2.4}
          opacity={0.6}
        />
      ))}
      <path
        d="M 40 30 L 150 -6"
        stroke="#F0B040"
        strokeWidth={9}
        strokeLinecap="round"
      />
      <path
        d="M 150 -6 l 12 -4"
        stroke="#F0D8B0"
        strokeWidth={9}
        strokeLinecap="round"
      />
      <path
        d="M 160 -9 l 6 -2"
        stroke="#2A2030"
        strokeWidth={5}
        strokeLinecap="round"
      />
    </g>

    {/* vaso de café */}
    <g transform="translate(1470 892)">
      <ellipse cx={4} cy={4} rx={60} ry={12} fill="#2A1614" opacity={0.55} />
      <path d="M -38 0 L -46 -112 H 46 L 38 0 Z" fill="#F0E4D4" />
      <path d="M -43 -76 H 43 L 40 -34 H -40 Z" fill="#B8704A" />
      <path
        d="M -50 -112 H 50 V -126 Q 50 -134 42 -134 H -42 Q -50 -134 -50 -126 Z"
        fill="#3A2830"
      />
      <path
        d="M -38 0 L -46 -112 H -30 L -24 0 Z"
        fill="#FFFFFF"
        opacity={0.25}
      />
      <path d="M 28 0 L 34 -112 H 46 L 38 0 Z" fill="#FF9A5A" opacity={0.4} />
    </g>

    {/* cactus en la repisa */}
    <g transform={`translate(1640 ${GY + GH + 28})`}>
      <path d="M -30 0 h 60 l -6 -40 h -48 Z" fill="#7A4A44" />
      <path
        d="M -12 -40 V -92 Q -12 -108 0 -108 Q 12 -108 12 -92 V -40 Z"
        fill="#3E6A50"
      />
      <path
        d="M 12 -64 h 12 q 10 0 10 -10 v -14"
        fill="none"
        stroke="#3E6A50"
        strokeWidth={11}
        strokeLinecap="round"
      />
      <path
        d="M -12 -56 h -10 q -9 0 -9 -9 v -8"
        fill="none"
        stroke="#3E6A50"
        strokeWidth={10}
        strokeLinecap="round"
      />
      <path d="M -6 -96 V -44" stroke="#FFB078" strokeWidth={2} opacity={0.5} />
    </g>
    <Marca color="#F0D8C8" op={0.16} />
  </Capa>
));

// ── capa viva: pantalla, vapor, cortina, cordón y sombra del poste ──
const Vida: React.FC = () => {
  const { fase, L } = useBucle();
  const b = fase * PULSOS;
  const SEP = 3200;
  const p = frac(b / 2 + (GX + GW + 200 - SOL.x) / SEP);
  const xPoste = GX + GW + 200 - p * SEP;
  // traqueteo: el cordón y la cortina se mecen; un golpecito de junta de raíl cada compás
  const junta = golpe(b / 4, 9) - 0.6 * golpe(b / 4 - 0.07, 9);
  const mece =
    4 * osc(fase, ciclos(L, 2.9)) +
    2 * osc(fase, ciclos(L, 1.3), 0.3) +
    3 * junta;
  const cortina =
    0.5 * osc(fase, ciclos(L, 4.1)) +
    0.25 * osc(fase, ciclos(L, 1.7), 0.2) +
    0.5 * junta;
  const cursor = osc(fase, ciclos(L, 1.1)) > 0;
  // el sol queda tapado un instante cuando pasa el poste
  const tapa = Math.exp(-(((xPoste - SOL.x) / 70) ** 2));
  return (
    <Capa>
      <defs>
        <clipPath id="ft-pant">
          <rect x={464} y={608} width={472} height={232} rx={4} />
        </clipPath>
        <clipPath id="ft-mesa-clip">
          <path d="M 300 800 H 1620 L 1770 968 H 150 Z" />
        </clipPath>
        <Vertical
          id="ft-pantalla"
          paradas={[
            [0, "#1C1E3E"],
            [1, "#12142C"],
          ]}
        />
        <linearGradient id="ft-sombra" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2A1020" stopOpacity="0" />
          <stop offset="0.5" stopColor="#2A1020" stopOpacity="1" />
          <stop offset="1" stopColor="#2A1020" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ft-barra" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#FFB868" />
          <stop offset="1" stopColor="#FF7AA8" />
        </linearGradient>
        <linearGradient id="ft-cort" x1="0" y1="0" x2="1" y2="0">
          {[0, 1, 2, 3, 4].map((k) => (
            <React.Fragment key={k}>
              <stop offset={k / 5} stopColor="#5A3550" />
              <stop offset={(k + 0.45) / 5} stopColor="#8A5068" />
              <stop offset={(k + 0.8) / 5} stopColor="#402438" />
            </React.Fragment>
          ))}
        </linearGradient>
      </defs>

      {/* cortina recogida a la izquierda */}
      <g transform={`translate(${GX - 30} ${GY - 30}) skewX(${cortina})`}>
        <path
          d="M 0 0 H 150 C 150 200 96 300 84 360 C 96 440 138 560 150 660 H 0 Z"
          fill="url(#ft-cort)"
        />
        <path
          d="M 60 0 H 150 C 150 200 96 300 84 360 C 96 440 138 560 150 660 H 110 C 100 560 60 440 52 360 C 60 300 100 200 60 0 Z"
          fill="#FFB078"
          opacity={0.16}
        />
        <rect x={-6} y={344} width={104} height={30} rx={12} fill="#D89A5A" />
        <rect
          x={-6}
          y={344}
          width={104}
          height={8}
          rx={4}
          fill="#FFD8A0"
          opacity={0.5}
        />
      </g>

      {/* cordón del estor: péndulo */}
      <g transform={`rotate(${mece} 1716 ${GY - 20})`}>
        <line
          x1={1716}
          y1={GY - 20}
          x2={1716}
          y2={GY + 170}
          stroke="#E8D8C8"
          strokeWidth={2.5}
          opacity={0.8}
        />
        <circle cx={1716} cy={GY + 180} r={11} fill="#E8B070" />
        <circle cx={1712} cy={GY + 176} r={4} fill="#FFF0D0" opacity={0.7} />
      </g>

      {/* pantalla del portátil: apuntes y ecualizador al compás */}
      <g clipPath="url(#ft-pant)">
        <rect
          x={464}
          y={608}
          width={472}
          height={232}
          fill="url(#ft-pantalla)"
        />
        <rect x={464} y={608} width={472} height={22} fill="#262850" />
        {[0, 1, 2].map((k) => (
          <circle
            key={k}
            cx={480 + k * 16}
            cy={619}
            r={4.5}
            fill={["#FF6A6A", "#FFC85A", "#6AE08A"][k]}
            opacity={0.85}
          />
        ))}
        {[
          [220, "#FFB868"],
          [300, "#D8D4F0"],
          [264, "#D8D4F0"],
          [180, "#D8D4F0"],
          [286, "#D8D4F0"],
          [140, "#8AD0F0"],
          [244, "#D8D4F0"],
          [96, "#D8D4F0"],
        ].map(([w, c], k) => (
          <rect
            key={k}
            x={486}
            y={646 + k * 22}
            width={w as number}
            height={8}
            rx={4}
            fill={c as string}
            opacity={k === 0 ? 0.95 : 0.6}
          />
        ))}
        {cursor ? (
          <rect
            x={590}
            y={797}
            width={3}
            height={14}
            fill="#FFFFFF"
            opacity={0.9}
          />
        ) : null}
        <rect x={812} y={646} width={108} height={108} rx={10} fill="#22244A" />
        {new Array(8).fill(0).map((_, k) => {
          const base =
            0.5 +
            0.5 *
              Math.sin(
                TAU * ((24 + ((k * 5) % 17)) * fase + random(`ft-eq${k}`)),
              );
          const pulso = golpe(b * (k % 2 === 0 ? 1 : 2), 4 + (k % 3));
          const h = 8 + 62 * (0.3 + 0.7 * base) * (0.45 + 0.55 * pulso);
          return (
            <rect
              key={k}
              x={824 + k * 11}
              y={736 - h}
              width={7}
              height={h}
              rx={2.5}
              fill="url(#ft-barra)"
            />
          );
        })}
        <rect
          x={812}
          y={768}
          width={108}
          height={7}
          rx={3.5}
          fill="#5A5C98"
          opacity={0.6}
        />
        <rect
          x={812}
          y={784}
          width={70}
          height={7}
          rx={3.5}
          fill="#5A5C98"
          opacity={0.45}
        />
        <rect
          x={464}
          y={608}
          width={472}
          height={232}
          fill="#FFB078"
          opacity={0.07 * (1 - tapa)}
        />
      </g>

      {/* la sombra del poste barre la mesa a compás */}
      <g clipPath="url(#ft-mesa-clip)">
        <rect
          x={xPoste - 150}
          y={780}
          width={220}
          height={220}
          fill="url(#ft-sombra)"
          opacity={0.3}
          transform={`skewX(-18)`}
        />
      </g>
      {/* el poste tapa el sol un instante: baja un punto la luz de dentro */}
      <rect
        x={0}
        y={0}
        width={W}
        height={H}
        fill="#1A0C18"
        opacity={0.085 * tapa}
      />

      <Vapor
        fase={fase}
        L={L}
        x={1470}
        y={756}
        s={1}
        op={0.34}
        color="#FFF0E0"
        semilla="ft-v"
      />
    </Capa>
  );
};

export const FocusTren: React.FC = () => (
  <div
    style={{ position: "absolute", width: W, height: H, background: "#1E1420" }}
  >
    <Cielo />
    <Paisaje />
    <Interior />
    <Vida />
    <Acabado vineta={0.5} grano={0.07} color={[14, 6, 12]} />
  </div>
);
