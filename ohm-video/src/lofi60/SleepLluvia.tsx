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
  H,
  limita,
  Lluvia,
  Luz,
  Marca,
  Motas,
  osc,
  ruido,
  TAU,
  useBucle,
  Vapor,
  Vertical,
  W,
} from "./Kit";

// ───────── Dormir 1: lluvia en la ventana, gato dormido ─────────
// Cuarto a oscuras, ciudad desenfocada tras el vidrio mojado, guirnalda cálida,
// vela, lámpara de lava y un gato que respira despacio en el alféizar.

// Vidrio de la ventana
const GX = 466;
const GY = 116;
const GW = 988;
const GH = 588;
const ALF = 730; // alféizar

const BOKEH = [
  "#FFB869",
  "#FF8A5C",
  "#FFD9A0",
  "#6FD3FF",
  "#C49BFF",
  "#FF6FA3",
];

// ── capa fija: cielo y ciudad muy desenfocada ──
const Exterior = React.memo(() => {
  const lejos = new Array(30).fill(0).map((_, k) => {
    const w = 34 + random(`sl-lw${k}`) * 46;
    return {
      x: GX - 30 + (k / 30) * (GW + 60) + random(`sl-lx${k}`) * 16,
      w,
      h: 110 + random(`sl-lh${k}`) ** 1.5 * 250,
    };
  });
  const cerca = new Array(11).fill(0).map((_, k) => {
    const w = 80 + random(`sl-cw${k}`) * 90;
    return {
      x: GX - 60 + (k / 11) * (GW + 120) + random(`sl-cx${k}`) * 30,
      w,
      h: 90 + random(`sl-ch${k}`) ** 1.3 * 230,
    };
  });
  return (
    <Capa fija>
      <defs>
        <Vertical
          id="sl-cielo"
          paradas={[
            [0, "#070A22"],
            [0.4, "#111845"],
            [0.75, "#262460"],
            [1, "#41306A"],
          ]}
        />
        <clipPath id="sl-vidrio0">
          <rect x={GX} y={GY} width={GW} height={GH} />
        </clipPath>
        <filter id="sl-b6" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="sl-b4" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
      </defs>
      <g clipPath="url(#sl-vidrio0)">
        <rect x={GX} y={GY} width={GW} height={GH} fill="url(#sl-cielo)" />
        <Luz
          id="sl-resplandor"
          cx={GX + GW * 0.56}
          cy={GY + GH * 1.02}
          r={0}
          rx={760}
          ry={330}
          color="#D0627E"
          op={0.5}
        />
        <Luz
          id="sl-resplandor2"
          cx={GX + GW * 0.18}
          cy={GY + GH * 0.98}
          r={0}
          rx={520}
          ry={300}
          color="#4E78E0"
          op={0.38}
        />
        <g filter="url(#sl-b6)">
          {lejos.map((b, k) => (
            <g key={k}>
              <rect
                x={b.x}
                y={GY + GH - b.h}
                width={b.w}
                height={b.h + 20}
                fill="#1C2156"
              />
              {new Array(Math.floor(b.h / 26))
                .fill(0)
                .map((_, j) =>
                  random(`sl-lv${k}-${j}`) > 0.55 ? (
                    <rect
                      key={j}
                      x={b.x + 6 + random(`sl-lvx${k}-${j}`) * (b.w - 18)}
                      y={GY + GH - b.h + 12 + j * 26}
                      width={7}
                      height={9}
                      fill={BOKEH[Math.floor(random(`sl-lc${k}-${j}`) * 3)]}
                      opacity={0.75}
                    />
                  ) : null,
                )}
            </g>
          ))}
        </g>
        <g filter="url(#sl-b4)">
          {cerca.map((b, k) => (
            <g key={k}>
              <rect
                x={b.x}
                y={GY + GH - b.h}
                width={b.w}
                height={b.h + 20}
                fill="#0C1030"
              />
              {new Array(Math.floor(b.h / 30))
                .fill(0)
                .map((_, j) =>
                  new Array(Math.floor(b.w / 26))
                    .fill(0)
                    .map((__, i) =>
                      random(`sl-cv${k}-${j}-${i}`) > 0.72 ? (
                        <rect
                          key={`${j}-${i}`}
                          x={b.x + 10 + i * 26}
                          y={GY + GH - b.h + 14 + j * 30}
                          width={11}
                          height={13}
                          fill={
                            BOKEH[Math.floor(random(`sl-cc${k}-${j}-${i}`) * 4)]
                          }
                          opacity={0.85}
                        />
                      ) : null,
                    ),
                )}
            </g>
          ))}
        </g>
      </g>
    </Capa>
  );
});

// Recorrido de una gota que resbala: quieta casi todo el rato y luego acelera
const baja = (u: number) =>
  u < 0.55 ? 0.12 * (u / 0.55) : 0.12 + 0.88 * ((u - 0.55) / 0.45) ** 2.2;

const GotasQueResbalan: React.FC<{
  readonly sombra?: boolean;
}> = ({ sombra = false }) => {
  const { fase } = useBucle();
  return (
    <g>
      {new Array(30).fill(0).map((_, k) => {
        const n = 2 + Math.floor(random(`sl-rn${k}`) * 4);
        const u = frac(random(`sl-ru${k}`) + n * fase);
        const p = baja(u);
        const x0 = GX + 24 + random(`sl-rx${k}`) * (GW - 48);
        const y = GY - 20 + p * (GH + 60);
        const x = x0 + 7 * Math.sin(p * 9 + k);
        const r = 4.5 + random(`sl-rr${k}`) * 3.5;
        // la estela aparece cuando acelera
        const vel = u < 0.55 ? 0 : limita((u - 0.55) / 0.2);
        const estela = 26 + vel * 110;
        if (sombra) {
          return (
            <g key={k} opacity={0.5}>
              <line
                x1={x}
                y1={y - estela}
                x2={x}
                y2={y}
                stroke="#0A0A20"
                strokeWidth={r * 0.9}
                strokeLinecap="round"
                opacity={0.25 + vel * 0.3}
              />
              <ellipse cx={x} cy={y} rx={r * 1.3} ry={r * 1.6} fill="#0A0A20" />
            </g>
          );
        }
        return (
          <g key={k}>
            <line
              x1={x}
              y1={y - estela}
              x2={x}
              y2={y - r}
              stroke="#C6D4FF"
              strokeWidth={r * 0.75}
              strokeLinecap="round"
              opacity={0.07 + vel * 0.13}
            />
            <ellipse
              cx={x}
              cy={y}
              rx={r}
              ry={r * 1.35}
              fill="#0B0F2C"
              opacity={0.5}
            />
            <ellipse
              cx={x}
              cy={y + r * 0.3}
              rx={r * 0.78}
              ry={r}
              fill="#D2DEFF"
              opacity={0.42}
            />
            <circle
              cx={x - r * 0.3}
              cy={y - r * 0.45}
              r={r * 0.26}
              fill="#FFFFFF"
              opacity={0.8}
            />
          </g>
        );
      })}
    </g>
  );
};

// ── capa viva: bokeh de la ciudad, coches y lluvia en el aire ──
const LucesYLluvia: React.FC = () => {
  const { fase, L } = useBucle();
  return (
    <Capa>
      <defs>
        <clipPath id="sl-vidrio1">
          <rect x={GX} y={GY} width={GW} height={GH} />
        </clipPath>
      </defs>
      <g clipPath="url(#sl-vidrio1)">
        {new Array(78).fill(0).map((_, k) => {
          const r = 9 + random(`sl-br${k}`) ** 1.6 * 30;
          const base = 0.1 + random(`sl-bo${k}`) * 0.26;
          const n = 1 + Math.floor(random(`sl-bn${k}`) * 5);
          const b = base * (0.72 + 0.28 * osc(fase, n, random(`sl-bd${k}`)));
          const color = BOKEH[Math.floor(random(`sl-bc${k}`) * BOKEH.length)];
          return (
            <circle
              key={k}
              cx={GX + random(`sl-bx${k}`) * GW}
              cy={GY + GH * (0.3 + 0.7 * random(`sl-by${k}`) ** 0.75)}
              r={r}
              fill={color}
              fillOpacity={b}
              stroke={color}
              strokeOpacity={b * 0.9}
              strokeWidth={1.4}
            />
          );
        })}
        {/* coches: discos blancos hacia la derecha, rojos hacia la izquierda */}
        {new Array(12).fill(0).map((_, k) => {
          const rojo = k % 2 === 0;
          const n = 2 + Math.floor(random(`sl-tn${k}`) * 3);
          const u = frac(random(`sl-tu${k}`) + n * fase);
          const x = GX - 60 + (rojo ? 1 - u : u) * (GW + 120);
          const y = GY + GH * (rojo ? 0.9 : 0.955) + random(`sl-ty${k}`) * 14;
          return (
            <circle
              key={k}
              cx={x}
              cy={y}
              r={rojo ? 12 : 15}
              fill={rojo ? "#FF4D5E" : "#FFF3D6"}
              fillOpacity={rojo ? 0.4 : 0.34}
            />
          );
        })}
        <Lluvia
          fase={fase}
          L={L}
          cuantas={70}
          largo={34}
          ancho={1.1}
          caida={0.62}
          op={0.2}
          semilla="sl-ll1"
          x0={GX}
          y0={GY}
          w={GW}
          h={GH}
        />
        <Lluvia
          fase={fase}
          L={L}
          cuantas={36}
          largo={58}
          ancho={1.7}
          caida={0.46}
          op={0.2}
          semilla="sl-ll2"
          x0={GX}
          y0={GY}
          w={GW}
          h={GH}
          color="#D6DEFF"
        />
        <GotasQueResbalan />
      </g>
    </Capa>
  );
};

// Guirnalda: cuatro arcos colgados del marco
const GANCHOS = [432, 697, 962, 1227, 1492];
const BOMBILLAS = (() => {
  const out: { x: number; y: number; k: number }[] = [];
  let k = 0;
  for (let i = 0; i < GANCHOS.length - 1; i++) {
    const x0 = GANCHOS[i];
    const x1 = GANCHOS[i + 1];
    for (let j = 1; j <= 6; j++) {
      const u = j / 7;
      out.push({
        x: x0 + (x1 - x0) * u,
        y: 96 + 4 * u * (1 - u) * 52 + 9,
        k: k++,
      });
    }
  }
  return out;
})();

// ── capa fija: el cuarto ──
const Cuarto = React.memo(() => (
  <Capa fija>
    <defs>
      <Vertical
        id="sl-pared"
        paradas={[
          [0, "#110E24"],
          [0.6, "#181430"],
          [1, "#1C1736"],
        ]}
      />
      <Vertical
        id="sl-alf"
        paradas={[
          [0, "#4A4478"],
          [1, "#2A2548"],
        ]}
      />
      <Vertical
        id="sl-lava"
        paradas={[
          [0, "#9A46E0"],
          [0.55, "#E04E9E"],
          [1, "#FF7A8A"],
        ]}
      />
      <filter id="sl-b9c" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
      <Vertical
        id="sl-sombra-alf"
        paradas={[
          [0, "#07061A", 0.55],
          [1, "#07061A", 0],
        ]}
      />
    </defs>
    {/* vaho y gotas quietas del vidrio */}
    <defs>
      <clipPath id="sl-vidrio2">
        <rect x={GX} y={GY} width={GW} height={GH} />
      </clipPath>
      <Vertical
        id="sl-vaho"
        paradas={[
          [0, "#BFD0FF", 0.02],
          [0.55, "#BFD0FF", 0.035],
          [1, "#C8D6FF", 0.13],
        ]}
      />
      <linearGradient id="sl-reflejo" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.07" />
        <stop offset="0.35" stopColor="#FFFFFF" stopOpacity="0" />
        <stop offset="0.6" stopColor="#FFFFFF" stopOpacity="0.035" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
    <g clipPath="url(#sl-vidrio2)">
      <rect x={GX} y={GY} width={GW} height={GH} fill="url(#sl-vaho)" />
      <rect x={GX} y={GY} width={GW} height={GH} fill="url(#sl-reflejo)" />
      {new Array(300).fill(0).map((_, k) => {
        const r = 1.4 + random(`sl-gr${k}`) ** 2 * 4.2;
        const x = GX + random(`sl-gx${k}`) * GW;
        const y = GY + random(`sl-gy${k}`) * GH;
        return (
          <g key={k}>
            <ellipse
              cx={x}
              cy={y}
              rx={r}
              ry={r * 1.2}
              fill="#0A0E28"
              opacity={0.35}
            />
            <ellipse
              cx={x}
              cy={y + r * 0.25}
              rx={r * 0.8}
              ry={r * 0.9}
              fill="#C9D8FF"
              opacity={0.3}
            />
            <circle
              cx={x - r * 0.3}
              cy={y - r * 0.35}
              r={Math.max(0.6, r * 0.25)}
              fill="#FFFFFF"
              opacity={0.55}
            />
          </g>
        );
      })}
    </g>
    {/* pared con el hueco del vidrio */}
    <path
      fillRule="evenodd"
      fill="url(#sl-pared)"
      d={`M 0 0 H ${W} V ${H} H 0 Z M ${GX} ${GY} V ${GY + GH} H ${GX + GW} V ${GY} Z`}
    />
    {/* la pared derecha es lateral: un tono más oscuro y la arista de la esquina */}
    <rect
      x={1604}
      y={0}
      width={W - 1604}
      height={H}
      fill="#0A0818"
      opacity={0.3}
    />
    <line
      x1={1604}
      y1={0}
      x2={1604}
      y2={H}
      stroke="#2A2548"
      strokeWidth={2}
      opacity={0.7}
    />
    {/* luz de la ventana proyectada en la pared lateral */}
    <g
      transform="matrix(0.3 -0.045 0 0.5 1456 548)"
      filter="url(#sl-b9c)"
      opacity={0.2}
    >
      {[0, 1, 2].map((c) =>
        [0, 1].map((r) => (
          <rect
            key={`${c}-${r}`}
            x={GX + c * (GW / 3) + 14}
            y={r === 0 ? GY + 8 : GY + 208}
            width={GW / 3 - 28}
            height={r === 0 ? 170 : GH - 216}
            fill="#93A6FF"
          />
        )),
      )}
    </g>
    {/* luz fría que entra por la ventana y luz rosa de la lámpara */}
    <Luz
      id="sl-frio"
      cx={960}
      cy={430}
      r={0}
      rx={980}
      ry={640}
      color="#4660C8"
      op={0.2}
    />
    <Luz id="sl-rosa" cx={196} cy={690} r={430} color="#E0509A" op={0.34} />

    {/* marco */}
    <g fill="#2A2342">
      <rect x={GX - 28} y={GY - 28} width={GW + 56} height={28} />
      <rect x={GX - 28} y={GY + GH} width={GW + 56} height={26} />
      <rect x={GX - 28} y={GY - 28} width={28} height={GH + 54} />
      <rect x={GX + GW} y={GY - 28} width={28} height={GH + 54} />
      <rect x={GX + GW / 3 - 8} y={GY} width={16} height={GH} />
      <rect x={GX + (2 * GW) / 3 - 8} y={GY} width={16} height={GH} />
      <rect x={GX} y={GY + 186} width={GW} height={14} />
    </g>
    {/* cantos iluminados por la calle */}
    <g stroke="#5E66B0" strokeWidth={2} opacity={0.55}>
      <line x1={GX} y1={GY} x2={GX} y2={GY + GH} />
      <line x1={GX} y1={GY} x2={GX + GW} y2={GY} />
      <line x1={GX + GW / 3 + 8} y1={GY} x2={GX + GW / 3 + 8} y2={GY + GH} />
      <line
        x1={GX + (2 * GW) / 3 + 8}
        y1={GY}
        x2={GX + (2 * GW) / 3 + 8}
        y2={GY + GH}
      />
      <line x1={GX} y1={GY + 200} x2={GX + GW} y2={GY + 200} />
    </g>
    <rect
      x={GX - 28}
      y={GY - 28}
      width={GW + 56}
      height={GH + 54}
      fill="none"
      stroke="#0B091C"
      strokeWidth={3}
      opacity={0.7}
    />

    {/* barra de la cortina */}
    <line
      x1={300}
      y1={62}
      x2={1620}
      y2={62}
      stroke="#3A3158"
      strokeWidth={10}
      strokeLinecap="round"
    />
    <circle cx={296} cy={62} r={11} fill="#4A406C" />
    <circle cx={1624} cy={62} r={11} fill="#4A406C" />

    {/* alféizar ancho */}
    <path
      d={`M ${GX - 70} ${ALF} H ${GX + GW + 70} L ${GX + GW + 104} ${ALF + 44} H ${GX - 104} Z`}
      fill="url(#sl-alf)"
    />
    <rect
      x={GX - 104}
      y={ALF + 44}
      width={GW + 208}
      height={26}
      fill="#1C1833"
    />
    <rect
      x={GX - 104}
      y={ALF + 70}
      width={GW + 208}
      height={70}
      fill="url(#sl-sombra-alf)"
    />
    <line
      x1={GX - 70}
      y1={ALF + 1}
      x2={GX + GW + 70}
      y2={ALF + 1}
      stroke="#8C94E0"
      strokeWidth={2}
      opacity={0.45}
    />

    {/* radiador bajo la ventana */}
    <g opacity={0.9}>
      {new Array(22).fill(0).map((_, k) => (
        <rect
          key={k}
          x={620 + k * 31}
          y={826}
          width={22}
          height={150}
          rx={10}
          fill="#221D3A"
        />
      ))}
      {new Array(22).fill(0).map((_, k) => (
        <rect
          key={k}
          x={622 + k * 31}
          y={830}
          width={4}
          height={140}
          rx={2}
          fill="#4A4878"
          opacity={0.5}
        />
      ))}
      <rect x={612} y={838} width={696} height={8} rx={4} fill="#1A1630" />
    </g>
    {/* mesita, lámpara de lava (cuerpo) y reloj */}
    <rect x={84} y={820} width={332} height={15} rx={4} fill="#2C2546" />
    <rect x={98} y={835} width={304} height={245} fill="#1B162F" />
    <rect x={118} y={858} width={264} height={84} rx={6} fill="#221C3A" />
    <circle cx={250} cy={900} r={7} fill="#4A4070" />
    <line
      x1={84}
      y1={821}
      x2={416}
      y2={821}
      stroke="#B070C0"
      strokeWidth={2}
      opacity={0.4}
    />
    <path d="M 160 820 L 232 820 L 218 768 L 174 768 Z" fill="#3A3358" />
    <path
      d="M 172 768 C 150 706 174 646 181 592 L 211 592 C 218 646 242 706 220 768 Z"
      fill="url(#sl-lava)"
      opacity={0.5}
    />
    <path d="M 181 592 L 211 592 L 206 562 L 186 562 Z" fill="#3A3358" />
    <rect
      x={292}
      y={766}
      width={104}
      height={54}
      rx={10}
      fill="#141128"
      stroke="#2E2848"
      strokeWidth={2}
    />

    {/* repisa con libros */}
    <rect x={1612} y={330} width={266} height={12} rx={3} fill="#2C2546" />
    <path
      d="M 1640 342 l 0 26 M 1850 342 l 0 26"
      stroke="#241E3C"
      strokeWidth={6}
    />
    {[
      [1628, 78, 22, "#4B3A66"],
      [1652, 92, 18, "#34506A"],
      [1672, 70, 26, "#6A4450"],
      [1700, 86, 20, "#3E5A52"],
      [1722, 64, 24, "#5A4A76"],
    ].map(([x, h, w, c]) => (
      <g key={x as number}>
        <rect
          x={x as number}
          y={330 - (h as number)}
          width={w as number}
          height={h as number}
          rx={2}
          fill={c as string}
        />
        <rect
          x={(x as number) + 3}
          y={330 - (h as number) + 12}
          width={(w as number) - 6}
          height={4}
          fill="#FFFFFF"
          opacity={0.12}
        />
      </g>
    ))}
    <g transform="translate(1756 330) rotate(-12)">
      <rect
        x={0}
        y={-74}
        width={56}
        height={74}
        rx={3}
        fill="#2A2444"
        stroke="#4A4270"
        strokeWidth={3}
      />
      <circle cx={28} cy={-44} r={12} fill="#F3D9A0" opacity={0.5} />
    </g>
    {/* fotos colgadas de un hilo */}
    <path
      d="M 1606 150 Q 1745 196 1884 138"
      fill="none"
      stroke="#4A4270"
      strokeWidth={2}
    />
    {[
      [1640, 160, -6],
      [1712, 174, 4],
      [1784, 172, -3],
      [1848, 154, 7],
    ].map(([x, y, a]) => (
      <g key={x} transform={`translate(${x} ${y}) rotate(${a})`}>
        <rect
          x={-23}
          y={0}
          width={46}
          height={56}
          rx={2}
          fill="#CFC8E0"
          opacity={0.5}
        />
        <rect
          x={-18}
          y={5}
          width={36}
          height={34}
          fill="#232048"
          opacity={0.9}
        />
        <rect x={-3} y={-5} width={6} height={10} fill="#8A6A5A" />
      </g>
    ))}

    {/* cable y bombillas de la guirnalda */}
    <path
      d={GANCHOS.slice(0, -1)
        .map((x0, i) => {
          const x1 = GANCHOS[i + 1];
          return `M ${x0} 96 Q ${(x0 + x1) / 2} ${96 + 104} ${x1} 96`;
        })
        .join(" ")}
      fill="none"
      stroke="#4A4068"
      strokeWidth={2.5}
    />
    <Luz
      id="sl-calido-arriba"
      cx={962}
      cy={128}
      r={0}
      rx={640}
      ry={110}
      color="#FFB060"
      op={0.16}
    />
    {GANCHOS.map((x) => (
      <circle key={x} cx={x} cy={95} r={4} fill="#3A3158" />
    ))}

    {/* libros y taza sobre el alféizar */}
    <g transform={`translate(1378 ${ALF + 2})`}>
      <rect x={-62} y={-22} width={124} height={22} rx={3} fill="#5A3E52" />
      <rect x={-54} y={-40} width={110} height={18} rx={3} fill="#35506C" />
      <rect x={-60} y={-60} width={118} height={20} rx={3} fill="#5B4A7A" />
      <rect
        x={-62}
        y={-22}
        width={124}
        height={3}
        fill="#FFFFFF"
        opacity={0.1}
      />
      <rect
        x={-54}
        y={-40}
        width={110}
        height={3}
        fill="#FFFFFF"
        opacity={0.1}
      />
      <rect
        x={-60}
        y={-60}
        width={118}
        height={3}
        fill="#9AA4F0"
        opacity={0.35}
      />
      <path d="M -20 -60 L -17 -100 L 21 -100 L 24 -60 Z" fill="#CDBBB0" />
      <path
        d="M 22 -92 q 20 2 16 16 q -3 10 -16 10"
        fill="none"
        stroke="#CDBBB0"
        strokeWidth={5}
      />
      <path
        d="M -20 -60 L -17 -100 L -6 -100 L -9 -60 Z"
        fill="#FFFFFF"
        opacity={0.18}
      />
      <ellipse cx={2} cy={-100} rx={19} ry={3.5} fill="#5A4038" />
    </g>

    {/* vela: tarro y cera */}
    <g transform={`translate(946 ${ALF + 2})`}>
      <rect
        x={-24}
        y={-58}
        width={48}
        height={58}
        rx={8}
        fill="#FFE6C0"
        opacity={0.14}
      />
      <rect
        x={-19}
        y={-34}
        width={38}
        height={32}
        rx={5}
        fill="#F2D8B0"
        opacity={0.85}
      />
      <rect
        x={-24}
        y={-58}
        width={48}
        height={58}
        rx={8}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={1.5}
        opacity={0.3}
      />
      <line x1={0} y1={-34} x2={0} y2={-42} stroke="#2A2030" strokeWidth={2} />
    </g>
  </Capa>
));

// Gato dormido (coordenadas locales: base en y=0, mirando a la izquierda)
const CUERPO =
  "M -150 0 C -160 -54 -112 -112 -18 -117 C 78 -121 154 -78 154 -10 C 154 -4 151 0 148 0 Z";

const Gato: React.FC<{ readonly fase: number; readonly L: number }> = ({
  fase,
  L,
}) => {
  const resp = osc(fase, ciclos(L, 4.4));
  // dos sacudidas de oreja y dos movimientos de la punta de la cola por bucle
  const oreja =
    bulto(fase, 0.23, 0.006) * Math.sin(fase * TAU * 900) +
    bulto(fase, 0.71, 0.005) * Math.sin(fase * TAU * 900);
  const cola = bulto(fase, 0.46, 0.05) + bulto(fase, 0.88, 0.04);
  const sy = 1 + 0.022 * resp;
  const punta = `${-58 - cola * 6} ${-12 - cola * 26}`;
  return (
    <g>
      <ellipse cx={6} cy={4} rx={182} ry={11} fill="#05041A" opacity={0.55} />
      <g transform={`scale(1 ${sy})`}>
        <path d={CUERPO} fill="url(#sl-gato)" />
        <g clipPath="url(#sl-gato-clip)">
          {/* rayas del lomo */}
          <g
            fill="none"
            stroke="#4E4A72"
            strokeWidth={8}
            strokeLinecap="round"
            opacity={0.5}
          >
            <path d="M 2 -122 q 10 16 3 36" />
            <path d="M 40 -118 q 11 16 5 36" />
            <path d="M 78 -108 q 11 14 7 32" />
            <path d="M 112 -90 q 10 12 7 26" />
          </g>
          {/* sombra de abajo y luz fría de la ventana por arriba */}
          <ellipse
            cx={10}
            cy={14}
            rx={200}
            ry={62}
            fill="url(#sl-gato-sombra)"
          />
          <ellipse
            cx={24}
            cy={-122}
            rx={170}
            ry={46}
            fill="url(#sl-gato-luz)"
          />
        </g>
        {/* muslo */}
        <path
          d="M 96 -2 C 62 -44 96 -92 146 -50"
          fill="none"
          stroke="#3E3A60"
          strokeWidth={4}
          opacity={0.45}
          strokeLinecap="round"
        />
      </g>
      {/* cola: rodea el cuerpo por delante y la punta se mueve */}
      <path
        d={`M 148 -22 C 176 2 120 6 52 -2 C 6 -8 -26 -2 ${punta}`}
        fill="none"
        stroke="#57527A"
        strokeWidth={24}
        strokeLinecap="round"
      />
      <path
        d={`M 148 -22 C 176 2 120 6 52 -2 C 6 -8 -26 -2 ${punta}`}
        fill="none"
        stroke="#8F89AE"
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.35}
        transform="translate(0 -7)"
      />
      {/* cabeza apoyada */}
      <g transform={`translate(0 ${-2.2 * resp})`}>
        <ellipse cx={-128} cy={-7} rx={31} ry={12} fill="#8C86AA" />
        <g transform={`rotate(${oreja * 5} -128 -90)`}>
          <path d="M -146 -78 L -140 -126 L -108 -94 Z" fill="#8A84A8" />
          <path
            d="M -139 -86 L -137 -113 L -119 -95 Z"
            fill="#C08A9A"
            opacity={0.75}
          />
        </g>
        <path d="M -92 -98 L -64 -132 L -52 -84 Z" fill="#7F7A9E" />
        <path
          d="M -85 -100 L -68 -120 L -62 -92 Z"
          fill="#B07E90"
          opacity={0.7}
        />
        <ellipse cx={-98} cy={-54} rx={56} ry={46} fill="url(#sl-gato-cara)" />
        {/* mofletes */}
        <ellipse
          cx={-118}
          cy={-34}
          rx={17}
          ry={11}
          fill="#B4AAB8"
          opacity={0.55}
        />
        <ellipse
          cx={-90}
          cy={-33}
          rx={17}
          ry={11}
          fill="#A49CB4"
          opacity={0.55}
        />
        {/* ojos cerrados, nariz, boca y bigotes */}
        <g fill="none" stroke="#35304E" strokeWidth={3.2} strokeLinecap="round">
          <path d="M -130 -53 q 10 8 20 0" />
          <path d="M -92 -51 q 10 8 20 0" />
          <path d="M -104 -34 q -6 7 -12 2" strokeWidth={2.2} />
          <path d="M -104 -34 q 6 7 12 2" strokeWidth={2.2} />
        </g>
        <path d="M -108 -40 h 8 l -4 6 z" fill="#E0A0AE" />
        <g
          stroke="#F0ECFA"
          strokeWidth={1.3}
          opacity={0.5}
          strokeLinecap="round"
        >
          <path d="M -124 -34 l -36 -6 M -124 -30 l -36 4 M -84 -33 l 34 -8 M -84 -29 l 35 3" />
        </g>
        <ellipse cx={-72} cy={-5} rx={28} ry={11} fill="#96909E" />
        <path
          d="M -150 -6 q 6 4 12 0 M -92 -4 q 6 4 12 0"
          fill="none"
          stroke="#5A5578"
          strokeWidth={1.6}
          opacity={0.6}
        />
      </g>
    </g>
  );
};

// ── capa viva: todo lo que respira dentro del cuarto ──
const Vida: React.FC = () => {
  const { fase, L } = useBucle();
  const llama = ruido(fase, "sl-llama", ciclos(L, 0.9), 5);
  const llama2 = ruido(fase, "sl-llama2", ciclos(L, 0.37), 4);
  const brillo = 0.9 + 0.1 * llama + 0.05 * llama2;
  const cortina =
    0.35 * osc(fase, ciclos(L, 11)) + 0.15 * osc(fase, ciclos(L, 6.3), 0.3);
  const dos = osc(fase, ciclos(L, 2)) > 0;
  // faros de un coche barriendo la pared (dos pasadas por bucle)
  const pasadas = [0.19, 0.63].map((c) => ({
    x: 1900 - avance(fase, c, 0.055) * 2100,
    op: bulto(fase, c, 0.055),
  }));
  return (
    <Capa>
      <defs>
        <linearGradient id="sl-gato" x1="0.1" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#8E88AC" />
          <stop offset="0.5" stopColor="#706B92" />
          <stop offset="1" stopColor="#4C4870" />
        </linearGradient>
        <clipPath id="sl-gato-clip">
          <path d={CUERPO} />
        </clipPath>
        <radialGradient id="sl-gato-sombra">
          <stop offset="0.25" stopColor="#15132E" stopOpacity="0.6" />
          <stop offset="1" stopColor="#15132E" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sl-gato-luz">
          <stop offset="0.2" stopColor="#B8C2FF" stopOpacity="0.5" />
          <stop offset="1" stopColor="#B8C2FF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sl-gato-cara" cx="0.3" cy="0.4" r="0.8">
          <stop offset="0" stopColor="#A89CAE" />
          <stop offset="1" stopColor="#7C7698" />
        </radialGradient>
        <linearGradient id="sl-cort" x1="0" y1="0" x2="1" y2="0">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
            <React.Fragment key={k}>
              <stop offset={k / 8} stopColor="#2B2346" />
              <stop offset={(k + 0.45) / 8} stopColor="#3D3462" />
              <stop offset={(k + 0.8) / 8} stopColor="#211A38" />
            </React.Fragment>
          ))}
        </linearGradient>
        <linearGradient id="sl-cort-luz-i" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.3" stopColor="#7C8AE8" stopOpacity="0" />
          <stop offset="1" stopColor="#7C8AE8" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="sl-cort-luz-d" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0.3" stopColor="#7C8AE8" stopOpacity="0" />
          <stop offset="1" stopColor="#7C8AE8" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="sl-faro" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#DCE4FF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#DCE4FF" stopOpacity="1" />
          <stop offset="1" stopColor="#DCE4FF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="sl-flama" cx="0.5" cy="0.75" r="0.7">
          <stop offset="0" stopColor="#FFFBE6" />
          <stop offset="0.45" stopColor="#FFC65A" />
          <stop offset="1" stopColor="#FF7A2A" stopOpacity="0.55" />
        </radialGradient>
        <filter id="sl-goo" x="-30%" y="-10%" width="160%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
          <feColorMatrix
            in="b"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
          />
        </filter>
        <clipPath id="sl-vasija">
          <path d="M 172 768 C 150 706 174 646 181 592 L 211 592 C 218 646 242 706 220 768 Z" />
        </clipPath>
        <clipPath id="sl-muros">
          <path
            clipRule="evenodd"
            d={`M 0 0 H ${W} V ${ALF} H 0 Z M ${GX - 28} ${GY - 28} V ${GY + GH + 26} H ${GX + GW + 28} V ${GY - 28} Z`}
          />
        </clipPath>
        <clipPath id="sl-vidrio-parche">
          <rect x={GX} y={GY} width={GW} height={GH} />
        </clipPath>
      </defs>

      {/* faros que barren la pared */}
      <g clipPath="url(#sl-muros)">
        {pasadas.map((p, k) => (
          <rect
            key={k}
            x={p.x - 190}
            y={0}
            width={380}
            height={ALF}
            fill="url(#sl-faro)"
            opacity={p.op * 0.085}
            transform={`skewX(-14)`}
          />
        ))}
      </g>

      {/* sombras de las gotas sobre la luz proyectada en la pared */}
      <g transform="matrix(0.3 -0.045 0 0.5 1456 548)">
        <g clipPath="url(#sl-vidrio-parche)" opacity={0.42}>
          <GotasQueResbalan sombra />
        </g>
      </g>

      {/* cortinas */}
      {[0, 1].map((lado) => {
        const x = lado === 0 ? 316 : 1444;
        return (
          <g
            key={lado}
            transform={`translate(${x} 62) skewX(${(lado === 0 ? 1 : -1) * cortina})`}
          >
            <path
              d="M 0 0 H 160 V 716 q -14 12 -27 0 q -13 -12 -26 0 q -14 12 -27 0 q -13 -12 -27 0 q -13 12 -26 0 q -13 -10 -27 0 Z"
              fill="url(#sl-cort)"
            />
            <path
              d="M 0 0 H 160 V 716 H 0 Z"
              fill={`url(#sl-cort-luz-${lado === 0 ? "i" : "d"})`}
              opacity={0.55}
            />
            {[14, 46, 80, 114, 146].map((rx) => (
              <circle
                key={rx}
                cx={rx}
                cy={0}
                r={8}
                fill="none"
                stroke="#4A406C"
                strokeWidth={3}
              />
            ))}
          </g>
        );
      })}

      {/* guirnalda: halos y bombillas */}
      {BOMBILLAS.map((b) => {
        const n = 3 + Math.floor(random(`sl-gn${b.k}`) * 7);
        const v = 0.72 + 0.28 * osc(fase, n, random(`sl-gd${b.k}`));
        return (
          <g key={b.k}>
            <circle
              cx={b.x}
              cy={b.y}
              r={62}
              fill="url(#sl-halo-bombilla)"
              opacity={v * 0.62}
            />
            <ellipse
              cx={b.x}
              cy={b.y}
              rx={4.6}
              ry={6.2}
              fill="#FFF3CF"
              opacity={0.6 + 0.4 * v}
            />
          </g>
        );
      })}

      {/* planta */}
      <g transform={`translate(560 ${ALF + 2})`}>
        {[
          [-34, 150, -17, 15],
          [-18, 196, -8, 17],
          [0, 222, 1, 18],
          [18, 186, 9, 17],
          [34, 138, 19, 15],
          [-8, 128, -27, 13],
          [10, 118, 28, 13],
        ].map(([x0, h, a, w], k) => (
          <g
            key={k}
            transform={`translate(${x0} -52) rotate(${a + 0.9 * osc(fase, ciclos(L, 7 + k), k / 7)})`}
          >
            <path
              d={`M ${-w} 0 Q ${-w * 1.25} ${-h * 0.5} 0 ${-h} Q ${w * 1.25} ${-h * 0.5} ${w} 0 Z`}
              fill="#27544C"
            />
            <path
              d={`M 0 0 Q ${w * 0.3} ${-h * 0.5} 0 ${-h}`}
              fill="none"
              stroke="#5E9C86"
              strokeWidth={2.5}
              opacity={0.7}
            />
            <path
              d={`M ${w * 0.55} ${-h * 0.1} Q ${w * 1.1} ${-h * 0.5} ${w * 0.1} ${-h * 0.92}`}
              fill="none"
              stroke="#9AB4FF"
              strokeWidth={2}
              opacity={0.35}
            />
          </g>
        ))}
        <path d="M -44 -56 H 44 L 36 0 H -36 Z" fill="#6A4650" />
        <rect x={-48} y={-62} width={96} height={12} rx={4} fill="#7A525A" />
        <path d="M 20 -56 H 44 L 36 0 H 16 Z" fill="#9AA4F0" opacity={0.2} />
      </g>

      {/* vela encendida */}
      <circle
        cx={946}
        cy={ALF - 46}
        r={300}
        fill="url(#sl-halo-vela)"
        opacity={0.5 * brillo}
      />
      <ellipse
        cx={946}
        cy={ALF + 8}
        rx={300}
        ry={34}
        fill="url(#sl-halo-vela)"
        opacity={0.55 * brillo}
      />
      <g
        transform={`translate(${946 + llama2 * 1.6} ${ALF - 40}) scale(${1 + llama2 * 0.07} ${0.94 + 0.12 * (0.5 + 0.5 * llama)})`}
      >
        <path
          d="M 0 0 C -9 -8 -8 -20 0 -34 C 8 -20 9 -8 0 0 Z"
          fill="url(#sl-flama)"
        />
      </g>

      {/* gato */}
      <g transform={`translate(1150 ${ALF + 3})`}>
        <Gato fase={fase} L={L} />
        {/* la vela le calienta la cara */}
        <ellipse
          cx={-150}
          cy={-50}
          rx={150}
          ry={110}
          fill="url(#sl-halo-vela)"
          opacity={0.3 * brillo}
        />
      </g>

      <Vapor
        fase={fase}
        L={L}
        x={1380}
        y={ALF - 104}
        s={0.8}
        op={0.26}
        semilla="sl-v"
      />

      {/* lámpara de lava: masas que suben y bajan */}
      <g clipPath="url(#sl-vasija)">
        <g filter="url(#sl-goo)" fill="#FFB0CC">
          <ellipse cx={196} cy={770} rx={34} ry={18} />
          <ellipse cx={196} cy={594} rx={20} ry={12} />
          {[0, 1, 2, 3, 4].map((k) => {
            const n = 1 + (k % 3);
            const y = 680 + 82 * osc(fase, n, random(`sl-lp${k}`));
            const r =
              11 + 7 * random(`sl-lr${k}`) + 2 * osc(fase, n * 2, k / 5);
            return (
              <ellipse
                key={k}
                cx={196 + 10 * osc(fase, n + 1, k / 5)}
                cy={y}
                rx={r}
                ry={r * (1.1 + 0.25 * osc(fase, n, random(`sl-lp${k}`) + 0.25))}
              />
            );
          })}
        </g>
      </g>
      <path
        d="M 172 768 C 150 706 174 646 181 592 L 211 592 C 218 646 242 706 220 768 Z"
        fill="none"
        stroke="#FFD0E6"
        strokeWidth={2}
        opacity={0.4}
      />
      <path
        d="M 180 750 C 168 700 182 650 187 604"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={3}
        opacity={0.3}
        strokeLinecap="round"
      />

      {/* reloj */}
      <text
        x={344}
        y={804}
        textAnchor="middle"
        fontFamily={mono}
        fontWeight={700}
        fontSize={31}
        fill="#FF7A6B"
        opacity={0.92}
      >
        2{dos ? ":" : " "}47
      </text>

      {/* polvo flotando en la luz de la ventana */}
      <Motas
        fase={fase}
        cuantas={34}
        x0={GX - 60}
        y0={GY + 60}
        w={GW + 120}
        h={GH + 160}
        color="#DCE4FF"
        semilla="sl-m"
        r={1.7}
        op={0.4}
      />
    </Capa>
  );
};

// ── capa fija: la cama en primer plano ──
const Cama = React.memo(() => (
  <Capa fija>
    <defs>
      <Vertical
        id="sl-manta"
        paradas={[
          [0, "#2E2754"],
          [0.5, "#1F1A3C"],
          [1, "#120F26"],
        ]}
      />
      <filter id="sl-b3" x="-5%" y="-20%" width="110%" height="140%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>
    <g filter="url(#sl-b3)">
      <path
        d="M -20 968 C 220 926 430 946 640 918 C 720 908 762 874 824 872 C 884 870 904 902 962 900 C 1012 898 1034 866 1092 866 C 1152 866 1184 904 1262 920 C 1500 958 1710 940 1940 982 L 1940 1100 L -20 1100 Z"
        fill="url(#sl-manta)"
      />
      <path
        d="M -20 968 C 220 926 430 946 640 918 C 720 908 762 874 824 872 C 884 870 904 902 962 900 C 1012 898 1034 866 1092 866 C 1152 866 1184 904 1262 920 C 1500 958 1710 940 1940 982"
        fill="none"
        stroke="#7482D8"
        strokeWidth={5}
        opacity={0.5}
      />
      <g
        fill="none"
        stroke="#0B0920"
        strokeWidth={9}
        opacity={0.5}
        strokeLinecap="round"
      >
        <path d="M 824 880 C 800 950 760 1010 700 1080" />
        <path d="M 1092 874 C 1120 950 1180 1010 1260 1080" />
        <path d="M 962 908 C 960 960 950 1020 930 1080" />
        <path d="M 330 950 C 380 1000 400 1040 410 1080" />
        <path d="M 1560 962 C 1530 1010 1520 1050 1520 1080" />
      </g>
    </g>
    {/* libro abierto boca abajo sobre la manta */}
    <g transform="translate(1420 978) rotate(-7)">
      <ellipse cx={0} cy={22} rx={120} ry={14} fill="#07061A" opacity={0.5} />
      <path d="M -104 16 L -6 -22 L 0 -8 L -96 30 Z" fill="#4A3F6E" />
      <path d="M 104 16 L 6 -22 L 0 -8 L 96 30 Z" fill="#3C335C" />
      <path
        d="M -104 16 L -6 -22 M 104 16 L 6 -22"
        stroke="#8E9AE8"
        strokeWidth={2.5}
        opacity={0.6}
      />
      <path
        d="M -96 30 L 0 -8 L 96 30"
        fill="none"
        stroke="#D8D2E8"
        strokeWidth={3}
        opacity={0.35}
      />
      <rect
        x={-52}
        y={-2}
        width={34}
        height={5}
        rx={2}
        fill="#E8D8A8"
        opacity={0.35}
        transform="rotate(-21 -35 0)"
      />
    </g>
    <Marca op={0.14} />
  </Capa>
));

// degradados de halo compartidos por la capa viva
const Halos = React.memo(() => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <radialGradient id="sl-halo-bombilla">
        <stop offset="0" stopColor="#FFD08A" stopOpacity="0.95" />
        <stop offset="0.2" stopColor="#FFC06A" stopOpacity="0.4" />
        <stop offset="0.55" stopColor="#FFB060" stopOpacity="0.1" />
        <stop offset="1" stopColor="#FFB060" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="sl-halo-vela">
        <stop offset="0" stopColor="#FFC470" stopOpacity="0.9" />
        <stop offset="0.14" stopColor="#FFB45E" stopOpacity="0.42" />
        <stop offset="0.42" stopColor="#FF9E4A" stopOpacity="0.13" />
        <stop offset="1" stopColor="#FF9E4A" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
));

export const SleepLluvia: React.FC = () => (
  <div
    style={{ position: "absolute", width: W, height: H, background: "#0B0920" }}
  >
    <Halos />
    <Exterior />
    <LucesYLluvia />
    <Cuarto />
    <Vida />
    <Cama />
    <Acabado vineta={0.62} grano={0.085} />
  </div>
);
