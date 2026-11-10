import React from "react";
import { random } from "remotion";
import { mono } from "../theme";
import {
  Acabado,
  avance,
  bulto,
  Capa,
  ciclos,
  frac,
  golpe,
  H,
  Luz,
  Marca,
  Motas,
  osc,
  ruido,
  suave,
  TAU,
  useBucle,
  Vapor,
  Vertical,
  W,
} from "./Kit";

// ───────── Estudio 1: escritorio de noche frente a la ciudad ─────────
// Alguien estudia de espaldas con auriculares y mueve la cabeza al compás.
// Fuera, la ciudad de neón con luna, un tren elevado y un avión; dentro,
// flexo cálido, monitor con ecualizador, altavoz que late y un gato en el alféizar.

const PULSOS = 160; // 40 compases a 84 BPM

// Vidrio
const GX = 270;
const GY = 74;
const GW = 1380;
const GH = 560;
const BASE = GY + GH; // línea del suelo de la ciudad

const LUCES = [
  "#FFD08A",
  "#FFB06A",
  "#7CE0FF",
  "#FF7AB8",
  "#C8A0FF",
  "#FFF0C8",
];

type Edificio = { x: number; w: number; h: number };
const fila = (
  semilla: string,
  n: number,
  wMin: number,
  wMax: number,
  hMin: number,
  hMax: number,
) => {
  const out: Edificio[] = [];
  let x = GX - 40;
  for (let k = 0; k < n && x < GX + GW + 40; k++) {
    const w = wMin + random(`${semilla}w${k}`) * (wMax - wMin);
    out.push({
      x,
      w,
      h: hMin + random(`${semilla}h${k}`) ** 1.4 * (hMax - hMin),
    });
    x += w + random(`${semilla}g${k}`) * 10;
  }
  return out;
};
const LEJOS = fila("se-l", 40, 36, 80, 150, 330);
const MEDIO = fila("se-m", 30, 60, 120, 170, 400);

// ── capa fija: cielo, luna y ciudad ──
const Ciudad = React.memo(() => (
  <Capa fija>
    <defs>
      <Vertical
        id="se-cielo"
        paradas={[
          [0, "#0A0926"],
          [0.35, "#1A1552"],
          [0.62, "#3A2A7C"],
          [0.82, "#6C3F92"],
          [1, "#9A4E8E"],
        ]}
      />
      <clipPath id="se-vidrio0">
        <rect x={GX} y={GY} width={GW} height={GH} />
      </clipPath>
      <radialGradient id="se-luna" cx="0.42" cy="0.4" r="0.7">
        <stop offset="0" stopColor="#FFF6E0" />
        <stop offset="1" stopColor="#FFD6B8" />
      </radialGradient>
    </defs>
    <g clipPath="url(#se-vidrio0)">
      <rect x={GX} y={GY} width={GW} height={GH} fill="url(#se-cielo)" />
      {new Array(90).fill(0).map((_, k) => (
        <circle
          key={k}
          cx={GX + random(`se-ex${k}`) * GW}
          cy={GY + random(`se-ey${k}`) ** 1.6 * 300}
          r={0.6 + random(`se-er${k}`) ** 3 * 1.6}
          fill="#E8E4FF"
          opacity={0.3 + random(`se-eo${k}`) * 0.5}
        />
      ))}
      <Luz
        id="se-halo-luna"
        cx={1190}
        cy={246}
        r={380}
        color="#FFC8D8"
        op={0.55}
      />
      <circle cx={1190} cy={246} r={88} fill="url(#se-luna)" />
      <g fill="#E8B8B0" opacity={0.3}>
        <circle cx={1160} cy={224} r={15} />
        <circle cx={1218} cy={268} r={20} />
        <circle cx={1180} cy={288} r={9} />
        <circle cx={1226} cy={214} r={8} />
      </g>
      {/* ciudad lejana, velada */}
      {LEJOS.map((b, k) => (
        <g key={k}>
          <rect
            x={b.x}
            y={BASE - b.h}
            width={b.w}
            height={b.h}
            fill="#4A3486"
          />
          {new Array(Math.floor(b.h / 22))
            .fill(0)
            .map((_, j) =>
              random(`se-lv${k}-${j}`) > 0.6 ? (
                <rect
                  key={j}
                  x={b.x + 5 + random(`se-lx${k}-${j}`) * (b.w - 14)}
                  y={BASE - b.h + 10 + j * 22}
                  width={4}
                  height={6}
                  fill="#FFD9A8"
                  opacity={0.55}
                />
              ) : null,
            )}
        </g>
      ))}
      <rect
        x={GX}
        y={BASE - 260}
        width={GW}
        height={260}
        fill="#B05A98"
        opacity={0.12}
      />
      {/* ciudad media con ventanas */}
      {MEDIO.map((b, k) => (
        <g key={k}>
          <rect
            x={b.x}
            y={BASE - b.h}
            width={b.w}
            height={b.h}
            fill="#1E1850"
          />
          <rect
            x={b.x}
            y={BASE - b.h}
            width={3}
            height={b.h}
            fill="#8A6AD8"
            opacity={0.35}
          />
          {random(`se-ant${k}`) > 0.55 ? (
            <rect
              x={b.x + b.w / 2 - 1.5}
              y={BASE - b.h - 34}
              width={3}
              height={34}
              fill="#1E1850"
            />
          ) : null}
          {random(`se-dep${k}`) > 0.7 ? (
            <g>
              <rect
                x={b.x + 8}
                y={BASE - b.h - 26}
                width={26}
                height={20}
                rx={3}
                fill="#1E1850"
              />
              <path
                d={`M ${b.x + 10} ${BASE - b.h - 6} v 8 M ${b.x + 32} ${BASE - b.h - 6} v 8`}
                stroke="#1E1850"
                strokeWidth={3}
              />
            </g>
          ) : null}
          {new Array(Math.floor((b.h - 16) / 20))
            .fill(0)
            .map((_, j) =>
              new Array(Math.floor((b.w - 10) / 16))
                .fill(0)
                .map((__, i) =>
                  random(`se-mv${k}-${j}-${i}`) > 0.62 ? (
                    <rect
                      key={`${j}-${i}`}
                      x={b.x + 8 + i * 16}
                      y={BASE - b.h + 12 + j * 20}
                      width={8}
                      height={10}
                      fill={
                        LUCES[
                          Math.floor(
                            random(`se-mc${k}-${j}-${i}`) * LUCES.length,
                          )
                        ]
                      }
                      opacity={0.5 + random(`se-mo${k}-${j}-${i}`) * 0.45}
                    />
                  ) : null,
                ),
            )}
        </g>
      ))}
      {/* vía del tren elevado */}
      <rect x={GX} y={BASE - 112} width={GW} height={8} fill="#141040" />
      {new Array(18).fill(0).map((_, k) => (
        <rect
          key={k}
          x={GX + 30 + k * 80}
          y={BASE - 104}
          width={10}
          height={104}
          fill="#141040"
        />
      ))}
    </g>
  </Capa>
));

// ── capa viva: lo que se mueve fuera ──
const Fuera: React.FC = () => {
  const { fase, L } = useBucle();
  const b = fase * PULSOS;
  const trenes = [
    { c: 0.14, sentido: -1 },
    { c: 0.61, sentido: 1 },
  ];
  const neon = 0.86 + 0.1 * osc(fase, ciclos(L, 3.1)) + 0.06 * golpe(b / 2, 3);
  return (
    <Capa>
      <defs>
        <clipPath id="se-vidrio1">
          <rect x={GX} y={GY} width={GW} height={GH} />
        </clipPath>
        <linearGradient id="se-nube" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A2A70" stopOpacity="0" />
          <stop offset="0.5" stopColor="#3A2A70" stopOpacity="0.85" />
          <stop offset="1" stopColor="#3A2A70" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g clipPath="url(#se-vidrio1)">
        {/* nubes finas que cruzan la luna (un ancho de ventana por bucle) */}
        {[-1, 0, 1].map((rep) => (
          <g key={rep} transform={`translate(${(rep + fase) * GW} 0)`}>
            <ellipse
              cx={GX + 300}
              cy={230}
              rx={300}
              ry={16}
              fill="url(#se-nube)"
            />
            <ellipse
              cx={GX + 520}
              cy={262}
              rx={220}
              ry={11}
              fill="url(#se-nube)"
            />
            <ellipse
              cx={GX + 1040}
              cy={200}
              rx={260}
              ry={13}
              fill="url(#se-nube)"
            />
            <ellipse
              cx={GX + 1180}
              cy={292}
              rx={200}
              ry={10}
              fill="url(#se-nube)"
              opacity={0.8}
            />
          </g>
        ))}
        {/* avión */}
        <g
          transform={`translate(${GX - 40 + frac(fase + 0.3) * (GW + 80)} ${150 - frac(fase + 0.3) * 50})`}
        >
          <circle r={2.2} fill="#FFFFFF" opacity={0.9} />
          <circle
            cx={-7}
            r={2.6}
            fill="#FF4A5A"
            opacity={osc(fase, ciclos(L, 1.2)) > 0.6 ? 1 : 0.1}
          />
        </g>
        {/* ventanas que se encienden y se apagan */}
        {MEDIO.map((ed, k) =>
          [0, 1].map((j) => {
            const c = random(`se-on${k}-${j}`);
            const on =
              bulto(fase, c, 0.3 + 0.3 * random(`se-ow${k}-${j}`)) > 0.4
                ? 1
                : 0;
            const fila2 = Math.floor(
              random(`se-oj${k}-${j}`) * Math.max(1, (ed.h - 16) / 20),
            );
            const col = Math.floor(
              random(`se-oi${k}-${j}`) * Math.max(1, (ed.w - 10) / 16),
            );
            return (
              <rect
                key={`${k}-${j}`}
                x={ed.x + 8 + col * 16}
                y={BASE - ed.h + 12 + fila2 * 20}
                width={8}
                height={10}
                fill={on ? LUCES[(k + j) % LUCES.length] : "#1E1850"}
                opacity={on ? 0.95 : 1}
              />
            );
          }),
        )}
        {/* balizas rojas de las antenas */}
        {MEDIO.map((ed, k) =>
          random(`se-ant${k}`) > 0.55 ? (
            <g
              key={k}
              opacity={
                0.25 +
                0.75 *
                  Math.max(0, osc(fase, ciclos(L, 2.4), random(`se-bz${k}`))) **
                    3
              }
            >
              <circle
                cx={ed.x + ed.w / 2}
                cy={BASE - ed.h - 36}
                r={9}
                fill="#FF4A5A"
                opacity={0.3}
              />
              <circle
                cx={ed.x + ed.w / 2}
                cy={BASE - ed.h - 36}
                r={3}
                fill="#FF7080"
              />
            </g>
          ) : null,
        )}
        {/* tren elevado: dos pasadas por bucle */}
        {trenes.map((t, k) => {
          const op = bulto(fase, t.c, 0.1) > 0 ? 1 : 0;
          if (!op) return null;
          const u = avance(fase, t.c, 0.1);
          const x =
            t.sentido > 0
              ? GX - 760 + u * (GW + 800)
              : GX + GW + 40 - u * (GW + 800);
          return (
            <g key={k} transform={`translate(${x} ${BASE - 142})`}>
              {[0, 1, 2, 3, 4].map((v) => (
                <g key={v} transform={`translate(${v * 146} 0)`}>
                  <rect
                    x={0}
                    y={0}
                    width={140}
                    height={30}
                    rx={7}
                    fill="#2A2460"
                  />
                  <rect
                    x={6}
                    y={6}
                    width={128}
                    height={11}
                    rx={2}
                    fill="#FFE2A8"
                    opacity={0.92}
                  />
                  {[1, 2, 3, 4, 5].map((m) => (
                    <rect
                      key={m}
                      x={6 + m * 21}
                      y={6}
                      width={3}
                      height={11}
                      fill="#2A2460"
                    />
                  ))}
                  <rect
                    x={0}
                    y={24}
                    width={140}
                    height={3}
                    fill="#FF7AB8"
                    opacity={0.7}
                  />
                </g>
              ))}
            </g>
          );
        })}
        {/* edificios cercanos con rótulos de neón */}
        <rect
          x={GX - 10}
          y={BASE - 470}
          width={250}
          height={470}
          fill="#0E0C2E"
        />
        <rect
          x={GX + 240}
          y={BASE - 250}
          width={90}
          height={250}
          fill="#110F34"
        />
        <rect
          x={GX + GW - 300}
          y={BASE - 420}
          width={310}
          height={420}
          fill="#0E0C2E"
        />
        {new Array(9).fill(0).map((_, j) =>
          [0, 1, 2, 3].map((i) => {
            const on = random(`se-nv${j}-${i}`) > 0.55;
            return (
              <rect
                key={`${j}-${i}`}
                x={GX + 22 + i * 50}
                y={BASE - 440 + j * 48}
                width={30}
                height={30}
                fill={on ? "#FFCE8A" : "#17143C"}
                opacity={on ? 0.75 : 1}
              />
            );
          }),
        )}
        {new Array(8).fill(0).map((_, j) =>
          [0, 1, 2, 3].map((i) => {
            const on = random(`se-nw${j}-${i}`) > 0.6;
            return (
              <rect
                key={`${j}-${i}`}
                x={GX + GW - 276 + i * 56}
                y={BASE - 392 + j * 48}
                width={34}
                height={30}
                fill={on ? (i % 2 ? "#8AE0FF" : "#FFCE8A") : "#17143C"}
                opacity={on ? 0.7 : 1}
              />
            );
          }),
        )}
        {/* rótulo vertical rosa */}
        <g opacity={neon}>
          <rect
            x={GX + 238}
            y={BASE - 420}
            width={44}
            height={170}
            rx={6}
            fill="#1A1240"
            stroke="#FF6AB0"
            strokeWidth={3}
          />
          <rect
            x={GX + 226}
            y={BASE - 432}
            width={68}
            height={194}
            rx={12}
            fill="#FF4AA0"
            opacity={0.14}
          />
          {["C", "A", "F", "É"].map((ch, k) => (
            <text
              key={ch}
              x={GX + 260}
              y={BASE - 386 + k * 38}
              textAnchor="middle"
              fontFamily={mono}
              fontWeight={700}
              fontSize={30}
              fill="#FFB0DC"
            >
              {ch}
            </text>
          ))}
        </g>
        {/* rótulo cian */}
        <g opacity={0.8 + 0.2 * osc(fase, ciclos(L, 4.3), 0.4)}>
          <rect
            x={GX + GW - 236}
            y={BASE - 468}
            width={150}
            height={44}
            rx={8}
            fill="#0E1A40"
            stroke="#6AE0FF"
            strokeWidth={3}
          />
          <rect
            x={GX + GW - 248}
            y={BASE - 480}
            width={174}
            height={68}
            rx={14}
            fill="#4AD0FF"
            opacity={0.14}
          />
          <text
            x={GX + GW - 161}
            y={BASE - 436}
            textAnchor="middle"
            fontFamily={mono}
            fontWeight={700}
            fontSize={28}
            fill="#B8F0FF"
          >
            24 H
          </text>
        </g>
      </g>
    </Capa>
  );
};

// ── capa fija: cuarto, escritorio y objetos ──
const Cuarto = React.memo(() => (
  <Capa fija>
    <defs>
      <Vertical
        id="se-pared"
        paradas={[
          [0, "#12122A"],
          [1, "#1A1A38"],
        ]}
      />
      <Vertical
        id="se-mesa"
        paradas={[
          [0, "#5A3C52"],
          [1, "#3C2840"],
        ]}
      />
      <linearGradient id="se-cono" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFC470" stopOpacity="0.42" />
        <stop offset="1" stopColor="#FFC470" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="se-reflejo" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.07" />
        <stop offset="0.3" stopColor="#FFFFFF" stopOpacity="0" />
        <stop offset="0.62" stopColor="#FFFFFF" stopOpacity="0.035" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <filter id="se-b6" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>
    {/* reflejo del vidrio */}
    <rect x={GX} y={GY} width={GW} height={GH} fill="url(#se-reflejo)" />
    {/* pared con el hueco de la ventana */}
    <path
      fillRule="evenodd"
      fill="url(#se-pared)"
      d={`M 0 0 H ${W} V ${H} H 0 Z M ${GX} ${GY} V ${GY + GH} H ${GX + GW} V ${GY} Z`}
    />
    <Luz
      id="se-luz-ciudad"
      cx={960}
      cy={380}
      r={0}
      rx={1100}
      ry={620}
      color="#7A4AC8"
      op={0.2}
    />
    <Luz
      id="se-luz-flexo"
      cx={430}
      cy={700}
      r={520}
      color="#FFB060"
      op={0.26}
    />

    {/* marco y parteluces */}
    <g fill="#24243F">
      <rect x={GX - 24} y={GY - 24} width={GW + 48} height={24} />
      <rect x={GX - 24} y={GY + GH} width={GW + 48} height={30} />
      <rect x={GX - 24} y={GY - 24} width={24} height={GH + 54} />
      <rect x={GX + GW} y={GY - 24} width={24} height={GH + 54} />
      {[1, 2, 3].map((k) => (
        <rect key={k} x={GX + (k * GW) / 4 - 6} y={GY} width={12} height={GH} />
      ))}
      <rect x={GX} y={GY + 196} width={GW} height={12} />
    </g>
    <g stroke="#9A7AE0" strokeWidth={2} opacity={0.4}>
      <line x1={GX} y1={GY} x2={GX + GW} y2={GY} />
      <line x1={GX} y1={GY} x2={GX} y2={GY + GH} />
      {[1, 2, 3].map((k) => (
        <line
          key={k}
          x1={GX + (k * GW) / 4 + 6}
          y1={GY}
          x2={GX + (k * GW) / 4 + 6}
          y2={GY + GH}
        />
      ))}
      <line x1={GX} y1={GY + 208} x2={GX + GW} y2={GY + 208} />
    </g>
    <rect
      x={GX - 40}
      y={GY + GH + 30}
      width={GW + 80}
      height={14}
      fill="#2E2E50"
    />
    <line
      x1={GX - 40}
      y1={GY + GH + 31}
      x2={GX + GW + 40}
      y2={GY + GH + 31}
      stroke="#B090F0"
      strokeWidth={2}
      opacity={0.45}
    />

    {/* pared izquierda: repisa, discos y póster */}
    <rect x={30} y={300} width={200} height={10} rx={3} fill="#2E2E50" />
    {[
      [44, 86, "#5A3A6E"],
      [66, 100, "#2E5670"],
      [86, 74, "#7A4A50"],
      [110, 92, "#3A6258"],
      [132, 80, "#6A5A8A"],
    ].map(([x, h, c]) => (
      <rect
        key={x as number}
        x={x as number}
        y={300 - (h as number)}
        width={18}
        height={h as number}
        rx={2}
        fill={c as string}
      />
    ))}
    <g transform="translate(184 300)">
      <path d="M -18 0 h 36 l -5 -30 h -26 Z" fill="#6A4650" />
      <path
        d="M 0 -30 q -30 -30 -22 -66 q 16 26 22 66 M 0 -30 q 28 -24 30 -58 q -22 20 -30 58 M 0 -30 q -4 -40 6 -74 q 8 34 -6 74"
        fill="#2E6A58"
      />
    </g>
    <rect
      x={52}
      y={380}
      width={150}
      height={196}
      rx={4}
      fill="#1C1C3A"
      stroke="#3A3A62"
      strokeWidth={4}
    />
    <circle cx={127} cy={452} r={36} fill="#FF9A7A" opacity={0.55} />
    <path
      d="M 56 540 L 100 480 L 130 516 L 160 470 L 198 540 Z"
      fill="#3A3470"
    />
    <path d="M 56 572 L 56 540 L 198 540 L 198 572 Z" fill="#2A2656" />

    {/* pared derecha: corcho con notas y guitarra */}
    <rect
      x={1700}
      y={150}
      width={196}
      height={250}
      rx={4}
      fill="#3A2C36"
      stroke="#52404A"
      strokeWidth={5}
    />
    {[
      [1716, 168, "#F4D06A", -4],
      [1790, 172, "#7ACCE8", 3],
      [1840, 236, "#F08AA8", -2],
      [1722, 250, "#A8E08A", 5],
      [1786, 316, "#F4D06A", -5],
      [1728, 330, "#C8A0F0", 2],
    ].map(([x, y, c, a]) => (
      <g
        key={`${x}-${y}`}
        transform={`rotate(${a} ${(x as number) + 24} ${(y as number) + 24})`}
      >
        <rect
          x={x as number}
          y={y as number}
          width={48}
          height={48}
          fill={c as string}
          opacity={0.5}
        />
        <path
          d={`M ${(x as number) + 8} ${(y as number) + 16} h 30 M ${(x as number) + 8} ${(y as number) + 26} h 24`}
          stroke="#1A1A30"
          strokeWidth={2}
          opacity={0.5}
        />
        <circle
          cx={(x as number) + 24}
          cy={(y as number) + 5}
          r={3}
          fill="#E8505A"
        />
      </g>
    ))}
    <g transform="translate(1812 760) rotate(9)">
      <rect x={-9} y={-330} width={18} height={250} fill="#3A2630" />
      <rect x={-13} y={-372} width={26} height={46} rx={5} fill="#2A1C26" />
      <ellipse cx={0} cy={-36} rx={66} ry={58} fill="#8A5238" />
      <ellipse cx={0} cy={-104} rx={50} ry={44} fill="#8A5238" />
      <ellipse cx={-18} cy={-60} rx={40} ry={62} fill="#B87850" opacity={0.3} />
      <circle cx={0} cy={-80} r={18} fill="#2A1820" />
      <rect x={-18} y={-26} width={36} height={8} rx={2} fill="#2A1820" />
      <path
        d="M -4 -326 V -24 M 0 -326 V -24 M 4 -326 V -24"
        stroke="#D8C8B0"
        strokeWidth={0.8}
        opacity={0.6}
      />
    </g>

    {/* escritorio */}
    <path d="M 120 716 H 1800 L 1900 800 H 20 Z" fill="url(#se-mesa)" />
    <rect x={20} y={800} width={1880} height={30} fill="#2A1C30" />
    <rect x={20} y={830} width={1880} height={250} fill="#100E22" />
    <line
      x1={120}
      y1={717}
      x2={1800}
      y2={717}
      stroke="#C0A0E8"
      strokeWidth={2}
      opacity={0.3}
    />
    {[
      [60, 0],
      [60, 1],
      [1500, 0],
      [1500, 1],
    ].map(([x, r]) => (
      <g key={`${x}-${r}`}>
        <rect
          x={x}
          y={846 + r * 112}
          width={360}
          height={98}
          rx={8}
          fill="#161430"
          stroke="#2A2850"
          strokeWidth={2}
        />
        <rect
          x={x + 150}
          y={888 + r * 112}
          width={60}
          height={8}
          rx={4}
          fill="#3A3868"
        />
      </g>
    ))}
    <ellipse
      cx={450}
      cy={762}
      rx={330}
      ry={46}
      fill="#FFB866"
      opacity={0.3}
      filter="url(#se-b6)"
    />
    <ellipse
      cx={980}
      cy={742}
      rx={330}
      ry={26}
      fill="#7AB8FF"
      opacity={0.16}
      filter="url(#se-b6)"
    />

    {/* flexo */}
    <path
      d="M 352 548 L 236 770 L 700 792 L 470 520 Z"
      fill="url(#se-cono)"
      opacity={0.5}
    />
    <ellipse cx={318} cy={748} rx={52} ry={12} fill="#1E1A30" />
    <path
      d="M 318 744 L 282 600 L 384 498"
      fill="none"
      stroke="#2A2540"
      strokeWidth={9}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx={282} cy={600} r={9} fill="#3A3458" />
    <g transform="translate(392 492) rotate(22)">
      <path d="M -20 -10 L 20 -10 L 60 44 L -60 44 Z" fill="#D8663E" />
      <path
        d="M -20 -10 L -4 -10 L -22 44 L -60 44 Z"
        fill="#FF9A6A"
        opacity={0.55}
      />
      <ellipse cx={0} cy={44} rx={60} ry={9} fill="#FFE8B8" />
      <rect x={-9} y={-20} width={18} height={12} rx={4} fill="#3A3458" />
    </g>

    {/* libros y suculenta */}
    <g transform="translate(596 752)">
      <rect x={-70} y={-22} width={140} height={22} rx={3} fill="#35506C" />
      <rect x={-60} y={-42} width={124} height={20} rx={3} fill="#7A4A50" />
      <rect x={-66} y={-60} width={130} height={18} rx={3} fill="#5B4A7A" />
      <rect
        x={-70}
        y={-22}
        width={140}
        height={3}
        fill="#FFD9A0"
        opacity={0.3}
      />
      <rect
        x={-60}
        y={-42}
        width={124}
        height={3}
        fill="#FFD9A0"
        opacity={0.3}
      />
      <rect
        x={-66}
        y={-60}
        width={130}
        height={3}
        fill="#FFD9A0"
        opacity={0.35}
      />
      <path d="M -18 -60 h 36 l -4 -24 h -28 Z" fill="#C8B4A8" />
      <path
        d="M 0 -84 q -22 -8 -24 -26 q 18 4 24 26 M 0 -84 q 22 -8 24 -26 q -18 4 -24 26 M 0 -84 q -8 -18 0 -36 q 8 18 0 36"
        fill="#4A8A6A"
      />
    </g>
    {/* taza */}
    <g transform="translate(742 764)">
      <ellipse cx={0} cy={2} rx={30} ry={6} fill="#1A1228" opacity={0.6} />
      <path d="M -22 0 L -20 -44 L 20 -44 L 22 0 Z" fill="#D8C6B8" />
      <path
        d="M 21 -36 q 20 2 16 16 q -3 10 -17 10"
        fill="none"
        stroke="#D8C6B8"
        strokeWidth={5}
      />
      <path
        d="M -22 0 L -20 -44 L -8 -44 L -10 0 Z"
        fill="#FFD9A0"
        opacity={0.3}
      />
      <ellipse cx={0} cy={-44} rx={20} ry={4} fill="#4A3028" />
    </g>

    {/* monitor */}
    <ellipse cx={980} cy={740} rx={110} ry={14} fill="#161430" />
    <rect x={964} y={676} width={32} height={66} fill="#1C1A38" />
    <rect x={756} y={416} width={448} height={278} rx={12} fill="#131228" />
    <rect
      x={756}
      y={416}
      width={448}
      height={278}
      rx={12}
      fill="none"
      stroke="#3A3A62"
      strokeWidth={2}
    />

    {/* cuaderno */}
    <g transform="translate(1310 770)">
      <path
        d="M -108 14 L -90 -34 L 0 -30 L 0 22 Z"
        fill="#CFC8DE"
        opacity={0.72}
      />
      <path
        d="M 108 14 L 90 -34 L 0 -30 L 0 22 Z"
        fill="#BDB6D0"
        opacity={0.72}
      />
      {[0, 1, 2, 3, 4].map((k) => (
        <path
          key={k}
          d={`M ${-88 + k * 2} ${-24 + k * 9} L -10 ${-21 + k * 9}`}
          stroke="#3A3A60"
          strokeWidth={2}
          opacity={0.5}
        />
      ))}
      {[0, 1].map((k) => (
        <path
          key={k}
          d={`M 10 ${-21 + k * 9} L ${86 - k * 30} ${-24 + k * 9}`}
          stroke="#3A3A60"
          strokeWidth={2}
          opacity={0.5}
        />
      ))}
    </g>

    {/* altavoz (cuerpo) */}
    <rect x={1476} y={642} width={104} height={118} rx={10} fill="#262442" />
    <rect
      x={1476}
      y={642}
      width={104}
      height={118}
      rx={10}
      fill="none"
      stroke="#4A4878"
      strokeWidth={2}
    />
    {/* maceta */}
    <path d="M 1642 760 h 84 l -9 -62 h -66 Z" fill="#6A4650" />
    <rect x={1638} y={692} width={92} height={12} rx={4} fill="#7A525A" />
  </Capa>
));

// Gato sentado de espaldas en el alféizar, mirando la ciudad
const GatoSentado: React.FC<{
  readonly cola: number;
  readonly oreja: number;
}> = ({ cola, oreja }) => (
  <g>
    <path
      d={`M 26 -6 C 60 10 ${70 + cola * 22} 60 ${52 + cola * 46} ${104 + Math.abs(cola) * -6}`}
      fill="none"
      stroke="#0D0B20"
      strokeWidth={15}
      strokeLinecap="round"
    />
    <path
      d="M -44 0 C -52 -60 -34 -104 0 -108 C 34 -104 52 -60 44 0 Z"
      fill="#0D0B20"
    />
    <circle cx={0} cy={-126} r={34} fill="#0D0B20" />
    <g transform={`rotate(${oreja * 8} -22 -150)`}>
      <path d="M -32 -140 L -30 -178 L -6 -154 Z" fill="#0D0B20" />
    </g>
    <path d="M 32 -140 L 30 -178 L 6 -154 Z" fill="#0D0B20" />
    {/* contraluz de la ciudad */}
    <path
      d="M -30 -176 L -8 -154 M 30 -176 L 8 -154"
      stroke="#C890F0"
      strokeWidth={2.5}
      opacity={0.7}
      strokeLinecap="round"
    />
    <path
      d="M -34 -128 C -36 -108 -50 -70 -45 -8"
      fill="none"
      stroke="#B080F0"
      strokeWidth={3}
      opacity={0.55}
      strokeLinecap="round"
    />
    <path
      d="M 34 -128 C 36 -108 50 -70 45 -8"
      fill="none"
      stroke="#FF90C8"
      strokeWidth={3}
      opacity={0.45}
      strokeLinecap="round"
    />
  </g>
);

// ── capa viva: pantalla, objetos que laten y la persona ──
const Vida: React.FC = () => {
  const { fase, L } = useBucle();
  const b = fase * PULSOS;
  // cabeceo: baja en cada pulso, más marcado en los pares
  const cabeceo = 3 * Math.cos(TAU * b) + 2.2 * Math.cos(TAU * (b / 2));
  const ladeo = 1.1 * Math.sin(TAU * (b / 8));
  const escribe = ruido(fase, "se-mano", ciclos(L, 0.55), 4);
  const escribe2 = ruido(fase, "se-mano2", ciclos(L, 0.8), 3);
  // la mano avanza por el renglón y vuelve suave al principio
  const r9 = frac(fase * ciclos(L, 9));
  const renglon = r9 < 0.86 ? r9 / 0.86 : 1 - suave((r9 - 0.86) / 0.14);
  const cono = 1 + 0.07 * golpe(b, 6);
  const cola = osc(fase, PULSOS / 8);
  const oreja =
    bulto(fase, 0.33, 0.006) * Math.sin(fase * TAU * 800) +
    bulto(fase, 0.77, 0.006) * Math.sin(fase * TAU * 800);
  const neonMuro =
    0.82 + 0.12 * golpe(b / 4, 2.5) + 0.06 * osc(fase, ciclos(L, 2.3));
  return (
    <Capa>
      <defs>
        <clipPath id="se-pantalla">
          <rect x={770} y={430} width={420} height={250} rx={4} />
        </clipPath>
        <Vertical
          id="se-pant"
          paradas={[
            [0, "#141A44"],
            [1, "#0E1030"],
          ]}
        />
        <linearGradient id="se-album" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF8A7A" />
          <stop offset="1" stopColor="#7A4AE0" />
        </linearGradient>
        <linearGradient id="se-barra" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#5AD0FF" />
          <stop offset="1" stopColor="#FF7AC8" />
        </linearGradient>
        <linearGradient id="se-sudadera" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4A3A52" />
          <stop offset="0.3" stopColor="#2C2C54" />
          <stop offset="1" stopColor="#23234A" />
        </linearGradient>
        <radialGradient id="se-pelo" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#3A2A40" />
          <stop offset="1" stopColor="#17121F" />
        </radialGradient>
        <radialGradient id="se-halo-neon">
          <stop offset="0" stopColor="#FF6AC0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FF6AC0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* neón de la pared: una luna que late suave con la música */}
      <g opacity={neonMuro}>
        <circle cx={1798} cy={520} r={150} fill="url(#se-halo-neon)" />
        <path
          d="M 1826 468 A 58 58 0 1 0 1826 572 A 44 44 0 1 1 1826 468 Z"
          fill="none"
          stroke="#FF8AD0"
          strokeWidth={7}
          strokeLinejoin="round"
        />
        <path
          d="M 1826 468 A 58 58 0 1 0 1826 572 A 44 44 0 1 1 1826 468 Z"
          fill="none"
          stroke="#FFE0F4"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <path
          d="M 1846 500 l 5 12 l 12 5 l -12 5 l -5 12 l -5 -12 l -12 -5 l 12 -5 Z"
          fill="#FFE0F4"
        />
      </g>

      {/* pantalla: reproductor con ecualizador al compás */}
      <g clipPath="url(#se-pantalla)">
        <rect x={770} y={430} width={420} height={250} fill="url(#se-pant)" />
        <rect
          x={788}
          y={448}
          width={118}
          height={118}
          rx={8}
          fill="url(#se-album)"
        />
        <circle cx={868} cy={488} r={20} fill="#FFE9C8" opacity={0.9} />
        <path
          d="M 788 546 q 30 -22 60 -4 q 30 16 58 -8 v 32 h -118 Z"
          fill="#2A1C60"
          opacity={0.8}
        />
        <rect
          x={924}
          y={452}
          width={150}
          height={12}
          rx={6}
          fill="#E8E6F8"
          opacity={0.85}
        />
        <rect
          x={924}
          y={474}
          width={96}
          height={8}
          rx={4}
          fill="#9A98C8"
          opacity={0.7}
        />
        {new Array(16).fill(0).map((_, k) => {
          const base =
            0.5 +
            0.5 *
              Math.sin(
                TAU * ((20 + ((k * 7) % 23)) * fase + random(`se-eq${k}`)),
              );
          const pulso = golpe(b * (k % 3 === 0 ? 1 : 2), 4 + (k % 4));
          const h = 8 + 64 * (0.25 + 0.75 * base) * (0.45 + 0.55 * pulso);
          return (
            <rect
              key={k}
              x={924 + k * 16}
              y={566 - h}
              width={11}
              height={h}
              rx={3}
              fill="url(#se-barra)"
              opacity={0.92}
            />
          );
        })}
        <rect x={788} y={592} width={384} height={5} rx={2.5} fill="#2A2C60" />
        <rect x={788} y={592} width={150} height={5} rx={2.5} fill="#FF7AC8" />
        <circle cx={938} cy={594.5} r={6} fill="#FFE0F4" />
        <rect
          x={788}
          y={612}
          width={250}
          height={7}
          rx={3.5}
          fill="#5A5C98"
          opacity={0.6}
        />
        <rect
          x={788}
          y={630}
          width={190}
          height={7}
          rx={3.5}
          fill="#5A5C98"
          opacity={0.45}
        />
        <rect
          x={770}
          y={430}
          width={420}
          height={250}
          fill="#9AC8FF"
          opacity={0.04 + 0.03 * golpe(b, 5)}
        />
      </g>

      {/* vapor de la taza y polvo en la luz del flexo */}
      <Vapor
        fase={fase}
        L={L}
        x={742}
        y={716}
        s={0.85}
        op={0.3}
        semilla="se-v"
      />
      <Motas
        fase={fase}
        cuantas={26}
        x0={240}
        y0={520}
        w={460}
        h={240}
        color="#FFE2B0"
        semilla="se-m"
        r={1.6}
        op={0.5}
      />

      {/* altavoz: los conos laten con el bombo */}
      <g>
        <circle
          cx={1528}
          cy={678}
          r={18 * cono}
          fill="#16142C"
          stroke="#5A5890"
          strokeWidth={3}
        />
        <circle cx={1528} cy={678} r={6 * cono} fill="#3A3862" />
        <circle
          cx={1528}
          cy={724}
          r={26 * cono}
          fill="#16142C"
          stroke="#5A5890"
          strokeWidth={3}
        />
        <circle cx={1528} cy={724} r={9 * cono} fill="#3A3862" />
        <circle
          cx={1562}
          cy={652}
          r={3}
          fill="#7AF0B0"
          opacity={0.5 + 0.5 * golpe(b, 3)}
        />
      </g>

      {/* planta: hojas que se mecen */}
      <g transform="translate(1684 694)">
        {[
          [-30, 120, -24],
          [-10, 160, -9],
          [10, 150, 8],
          [30, 116, 22],
          [0, 96, -36],
          [4, 90, 34],
        ].map(([x0, h, a], k) => (
          <g
            key={k}
            transform={`translate(${x0} 0) rotate(${a + 1.2 * osc(fase, ciclos(L, 6 + k), k / 6)})`}
          >
            <path
              d={`M 0 0 Q -30 ${-h * 0.55} 0 ${-h} Q 30 ${-h * 0.55} 0 0 Z`}
              fill="#2A5E52"
            />
            <path
              d={`M 0 0 L 0 ${-h * 0.92}`}
              stroke="#5EA088"
              strokeWidth={2.2}
              opacity={0.7}
            />
            <path
              d={`M 6 ${-h * 0.14} Q 24 ${-h * 0.55} 3 ${-h * 0.92}`}
              fill="none"
              stroke="#FF90C8"
              strokeWidth={2}
              opacity={0.3}
            />
          </g>
        ))}
      </g>

      {/* gato en el alféizar: la cola se mece cada dos compases */}
      <g transform={`translate(1404 ${GY + GH + 32}) scale(0.92)`}>
        <GatoSentado cola={cola} oreja={oreja} />
      </g>

      {/* persona de espaldas */}
      <g>
        {/* brazo que escribe */}
        <g
          transform={`translate(${escribe * 5 + renglon * 26 - 10} ${escribe2 * 3})`}
        >
          <path
            d="M 1150 1000 C 1200 900 1250 836 1296 792"
            fill="none"
            stroke="#2A2A52"
            strokeWidth={66}
            strokeLinecap="round"
          />
          <path
            d="M 1166 964 C 1210 888 1252 838 1290 800"
            fill="none"
            stroke="#6A7AD8"
            strokeWidth={4}
            opacity={0.4}
            strokeLinecap="round"
          />
          <ellipse
            cx={1304}
            cy={782}
            rx={26}
            ry={20}
            fill="#B88878"
            transform="rotate(-40 1304 782)"
          />
          <path
            d="M 1322 760 L 1290 808"
            stroke="#F4D06A"
            strokeWidth={6}
            strokeLinecap="round"
          />
          <path
            d="M 1290 808 l -4 8"
            stroke="#2A2A40"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>
        {/* silla */}
        <rect x={792} y={820} width={376} height={300} rx={56} fill="#17152E" />
        <rect
          x={792}
          y={820}
          width={376}
          height={300}
          rx={56}
          fill="none"
          stroke="#5A6AC8"
          strokeWidth={3}
          opacity={0.4}
        />
        {/* torso */}
        <g transform={`translate(0 ${cabeceo * 0.25})`}>
          <path
            d="M 748 1100 C 752 960 790 872 880 846 C 930 832 1030 832 1080 846 C 1170 872 1208 960 1212 1100 Z"
            fill="url(#se-sudadera)"
          />
          <path
            d="M 880 846 C 930 832 1030 832 1080 846 C 1170 872 1208 960 1212 1100"
            fill="none"
            stroke="#7AA8FF"
            strokeWidth={4}
            opacity={0.5}
            strokeLinecap="round"
          />
          <path
            d="M 752 1090 C 756 960 792 876 880 846"
            fill="none"
            stroke="#FFB870"
            strokeWidth={5}
            opacity={0.5}
            strokeLinecap="round"
          />
          {/* capucha recogida */}
          <path
            d="M 862 852 C 880 800 1080 800 1098 852 C 1060 884 900 884 862 852 Z"
            fill="#33335E"
          />
          <path
            d="M 870 846 C 890 806 1070 806 1090 846"
            fill="none"
            stroke="#8AB0FF"
            strokeWidth={3}
            opacity={0.45}
          />
        </g>
        {/* cabeza con auriculares: se mueve al compás */}
        <g transform={`translate(0 ${cabeceo}) rotate(${ladeo} 980 800)`}>
          <rect x={950} y={770} width={60} height={50} rx={18} fill="#A87868" />
          <path
            d="M 886 716 C 878 620 924 570 980 568 C 1036 570 1082 620 1074 716 C 1070 770 1040 800 980 802 C 920 800 890 770 886 716 Z"
            fill="url(#se-pelo)"
          />
          {/* mechones */}
          <path
            d="M 930 584 l -10 -20 l 22 12 Z M 968 570 l 2 -24 l 16 20 Z M 1012 574 l 14 -18 l 4 24 Z M 1046 596 l 20 -8 l -8 22 Z"
            fill="#17121F"
          />
          <path
            d="M 900 760 q -10 22 4 40 q 4 -22 -4 -40 M 1060 760 q 10 22 -4 40 q -4 -22 4 -40"
            fill="#17121F"
          />
          {/* luz del monitor en el contorno y del flexo a la izquierda */}
          <path
            d="M 932 584 C 960 568 1004 566 1034 584"
            fill="none"
            stroke="#8AC0FF"
            strokeWidth={4}
            opacity={0.5}
            strokeLinecap="round"
          />
          <path
            d="M 888 700 C 884 640 904 600 930 584"
            fill="none"
            stroke="#FFB870"
            strokeWidth={4}
            opacity={0.5}
            strokeLinecap="round"
          />
          {/* auriculares */}
          <path
            d="M 880 700 C 864 560 1096 560 1080 700"
            fill="none"
            stroke="#E8DCD0"
            strokeWidth={15}
            strokeLinecap="round"
          />
          <path
            d="M 880 700 C 864 560 1096 560 1080 700"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={3}
            opacity={0.5}
            strokeLinecap="round"
            transform="translate(0 -4)"
          />
          <rect x={856} y={668} width={46} height={92} rx={22} fill="#E8705E" />
          <rect
            x={1058}
            y={668}
            width={46}
            height={92}
            rx={22}
            fill="#D0604E"
          />
          <rect
            x={862}
            y={676}
            width={14}
            height={76}
            rx={7}
            fill="#FFB0A0"
            opacity={0.6}
          />
          <circle
            cx={1092}
            cy={744}
            r={3.5}
            fill="#7AF0B0"
            opacity={0.5 + 0.5 * (osc(fase, ciclos(L, 2)) > 0 ? 1 : 0)}
          />
        </g>
      </g>
      <Marca op={0.14} />
    </Capa>
  );
};

export const StudyEscritorio: React.FC = () => (
  <div
    style={{ position: "absolute", width: W, height: H, background: "#0A0926" }}
  >
    <Ciudad />
    <Fuera />
    <Cuarto />
    <Vida />
    <Acabado vineta={0.55} grano={0.075} color={[6, 5, 20]} />
  </div>
);
