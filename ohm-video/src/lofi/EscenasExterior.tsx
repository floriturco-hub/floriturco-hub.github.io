import { random } from "remotion";
import { mono } from "../theme";
import {
  CapaNubes,
  Degradado,
  Estrellas,
  frac,
  H,
  Halo,
  Lienzo,
  Lluvia,
  Marca,
  Motas,
  osc,
  useBucle,
  W,
} from "./Base";

const CALIDA = "#F8C27A";

// Edificios con ventanas que titilan
const Edificios: React.FC<{
  readonly fase: number;
  readonly base: number;
  readonly color: string;
  readonly semilla: string;
  readonly alto: number;
  readonly n: number;
  readonly luz: number;
}> = ({ fase, base, color, semilla, alto, n, luz }) => (
  <g>
    {new Array(n).fill(0).map((_, k) => {
      const bw = W / n + 20;
      const bh = alto * (0.4 + random(`${semilla}h${k}`) * 0.6);
      const bx = k * (W / n) - 10;
      const cols = Math.max(2, Math.floor(bw / 34));
      const filas = Math.floor(bh / 42);
      return (
        <g key={k}>
          <rect x={bx} y={base - bh} width={bw} height={bh} fill={color} />
          {new Array(cols * filas).fill(0).map((__, j) => {
            const r = random(`${semilla}w${k}-${j}`);
            if (r < 0.55) return null;
            const parp = Math.max(0, osc(fase, 1 + Math.floor(r * 4), r * 7));
            return (
              <rect
                key={j}
                x={bx + 10 + (j % cols) * 32}
                y={base - bh + 14 + Math.floor(j / cols) * 42}
                width={16}
                height={22}
                fill={r > 0.9 ? "#8AC8F8" : CALIDA}
                opacity={luz * (r > 0.97 ? parp : 0.55 + 0.25 * r)}
              />
            );
          })}
        </g>
      );
    })}
  </g>
);

// ───────────── Night City 1: skyline con puente y coches en movimiento ─────────────
export const CitySkyline: React.FC = () => {
  const { fase } = useBucle();
  return (
    <Lienzo fondo="#0A0A1C">
      <Degradado id="cieloS" arriba="#0A0820" abajo="#3A1E4A" />
      <rect width={W} height={H} fill="url(#cieloS)" />
      <Estrellas fase={fase} cuantas={70} alto={380} semilla="cs" />
      <Halo id="lunaS" cx={1580} cy={180} r={200} color="#FFD8E8" op={0.2} />
      <circle cx={1580} cy={180} r={56} fill="#FFE8F0" />
      <Edificios
        fase={fase}
        base={700}
        color="#1E1636"
        semilla="fondo"
        alto={420}
        n={18}
        luz={0.5}
      />
      <Edificios
        fase={fase}
        base={720}
        color="#140F28"
        semilla="medio"
        alto={340}
        n={11}
        luz={0.9}
      />
      {/* río con reflejos */}
      <rect x={0} y={720} width={W} height={360} fill="#0E0C24" />
      {new Array(40).fill(0).map((_, k) => (
        <rect
          key={k}
          x={random(`rf${k}`) * W + 20 * osc(fase, 3, k / 40)}
          y={740 + random(`rfy${k}`) * 300}
          width={30 + random(`rfw${k}`) * 70}
          height={3}
          fill={k % 3 ? CALIDA : "#C88AE8"}
          opacity={0.18}
        />
      ))}
      {/* puente */}
      <rect x={0} y={790} width={W} height={26} fill="#2A2040" />
      {new Array(9).fill(0).map((_, k) => (
        <rect
          key={k}
          x={60 + k * 230}
          y={816}
          width={18}
          height={220}
          fill="#2A2040"
        />
      ))}
      {new Array(8).fill(0).map((_, k) => (
        <path
          key={k}
          d={`M ${69 + k * 230} 790 Q ${184 + k * 230} 730 ${299 + k * 230} 790`}
          stroke="#3A2E54"
          strokeWidth={6}
          fill="none"
        />
      ))}
      {/* coches: faros hacia un lado, luces traseras hacia el otro (pasos enteros por bucle) */}
      {new Array(14).fill(0).map((_, k) => {
        const ida = k % 2 === 0;
        const n = 3 + (k % 4);
        const u = frac(random(`car${k}`) + (ida ? n : -n) * fase);
        const x = -100 + u * (W + 200);
        return (
          <g key={k}>
            <ellipse
              cx={x}
              cy={ida ? 796 : 808}
              rx={28}
              ry={6}
              fill={ida ? "#FFF2C8" : "#E8414F"}
              opacity={0.9}
            />
            <ellipse
              cx={x}
              cy={ida ? 796 : 808}
              rx={60}
              ry={12}
              fill={ida ? "#FFF2C8" : "#E8414F"}
              opacity={0.15}
            />
          </g>
        );
      })}
      <Marca />
    </Lienzo>
  );
};

// ───────────── Night City 2: azotea con letrero de neón y tren a lo lejos ─────────────
export const CityAzotea: React.FC = () => {
  const { fase } = useBucle();
  const tren = frac(fase * 4);
  const neon = 0.85 + 0.15 * osc(fase, 60) * (frac(fase * 6) < 0.05 ? -3 : 1);
  return (
    <Lienzo fondo="#0C0818">
      <Degradado id="cieloZ" arriba="#100A24" abajo="#4A1E50" />
      <rect width={W} height={H} fill="url(#cieloZ)" />
      <CapaNubes
        fase={fase}
        n={1}
        y={120}
        s={1.2}
        color="#2A1A40"
        cuantas={5}
        semilla="zn"
        op={0.6}
      />
      <Edificios
        fase={fase}
        base={760}
        color="#1E1236"
        semilla="zf"
        alto={440}
        n={16}
        luz={0.45}
      />
      {/* vía elevada con tren */}
      <rect x={0} y={640} width={W} height={14} fill="#2A1E44" />
      {new Array(10).fill(0).map((_, k) => (
        <rect
          key={k}
          x={k * 210 + 40}
          y={654}
          width={14}
          height={110}
          fill="#2A1E44"
        />
      ))}
      <g transform={`translate(${-900 + tren * (W + 1800)} 0)`}>
        {[0, 1, 2, 3].map((c) => (
          <g key={c}>
            <rect
              x={c * 210}
              y={590}
              width={200}
              height={50}
              rx={10}
              fill="#3A2E58"
            />
            {new Array(6).fill(0).map((_, j) => (
              <rect
                key={j}
                x={c * 210 + 14 + j * 31}
                y={602}
                width={20}
                height={18}
                rx={3}
                fill={CALIDA}
                opacity={0.85}
              />
            ))}
          </g>
        ))}
        <ellipse
          cx={840}
          cy={620}
          rx={40}
          ry={14}
          fill="#FFF2C8"
          opacity={0.6}
        />
      </g>
      <Edificios
        fase={fase}
        base={800}
        color="#150C28"
        semilla="zm"
        alto={260}
        n={9}
        luz={0.8}
      />
      {/* azotea en primer plano */}
      <rect x={0} y={860} width={W} height={220} fill="#1A1028" />
      <rect x={0} y={850} width={W} height={20} fill="#2E2040" />
      {/* antena y depósito de agua */}
      <line
        x1={260}
        y1={850}
        x2={260}
        y2={520}
        stroke="#2E2040"
        strokeWidth={10}
      />
      <line
        x1={220}
        y1={600}
        x2={300}
        y2={600}
        stroke="#2E2040"
        strokeWidth={6}
      />
      <circle
        cx={260}
        cy={516}
        r={8}
        fill="#E8414F"
        opacity={0.3 + 0.7 * Math.max(0, osc(fase, 40))}
      />
      <rect x={1520} y={700} width={180} height={150} rx={20} fill="#2A1C3A" />
      <polygon points="1500,700 1610,640 1720,700" fill="#2A1C3A" />
      {/* letrero de neón */}
      <rect
        x={700}
        y={690}
        width={520}
        height={150}
        rx={20}
        fill="#140A20"
        stroke="#2E2040"
        strokeWidth={8}
      />
      <g opacity={neon}>
        <text
          x={960}
          y={800}
          textAnchor="middle"
          fontFamily={mono}
          fontWeight={700}
          fontSize={96}
          fill="none"
          stroke="#FF5AC8"
          strokeWidth={14}
          opacity={0.35}
          style={{ filter: "blur(10px)" }}
        >
          LO-FI
        </text>
        <text
          x={960}
          y={800}
          textAnchor="middle"
          fontFamily={mono}
          fontWeight={700}
          fontSize={96}
          fill="#FFB8EC"
        >
          LO-FI
        </text>
      </g>
      <Halo
        id="neonH"
        cx={960}
        cy={770}
        r={420}
        color="#FF5AC8"
        op={0.12 * neon}
      />
      {/* llovizna fina */}
      <Lluvia
        fase={fase}
        cuantas={90}
        largo={18}
        ancho={1.2}
        vel={90}
        op={0.25}
        semilla="zl"
        color="#E8B8F0"
      />
      <Marca />
    </Lienzo>
  );
};

// Pino
const Pino: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly color: string;
  readonly balanceo?: number;
}> = ({ x, y, s, color, balanceo = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${balanceo})`}>
    <rect x={-8} y={-20} width={16} height={40} fill={color} />
    {[0, 1, 2].map((k) => (
      <polygon
        key={k}
        points={`${-70 + k * 14},${-20 - k * 60} 0,${-120 - k * 60} ${70 - k * 14},${-20 - k * 60}`}
        fill={color}
      />
    ))}
  </g>
);

// ───────────── Nature 1: bosque nocturno con luciérnagas y arroyo ─────────────
export const NatureBosque: React.FC = () => {
  const { fase } = useBucle();
  return (
    <Lienzo fondo="#081410">
      <Degradado id="cieloB" arriba="#081420" abajo="#1E3A3A" />
      <rect width={W} height={H} fill="url(#cieloB)" />
      <Estrellas fase={fase} cuantas={80} alto={360} semilla="bs" />
      <Halo id="lunaB" cx={960} cy={200} r={260} color="#E8FFF0" op={0.18} />
      <circle cx={960} cy={200} r={64} fill="#F0FFF4" />
      {new Array(16).fill(0).map((_, k) => (
        <Pino
          key={k}
          x={k * 125 + random(`pa${k}`) * 40}
          y={640}
          s={1.4 + random(`ps${k}`) * 0.5}
          color="#12302A"
        />
      ))}
      {new Array(12).fill(0).map((_, k) => (
        <Pino
          key={k}
          x={k * 170 + random(`pb${k}`) * 60}
          y={760}
          s={1.9 + random(`pt${k}`) * 0.6}
          color="#0C221E"
          balanceo={0.6 * osc(fase, 2, k / 12)}
        />
      ))}
      <rect x={0} y={760} width={W} height={320} fill="#0A1C18" />
      {/* arroyo con brillos que fluyen */}
      <path
        d="M 0 900 Q 480 840 960 900 T 1920 880 L 1920 1000 Q 1440 1040 960 990 T 0 1000 Z"
        fill="#14384A"
      />
      {new Array(36).fill(0).map((_, k) => {
        const n = 4 + (k % 4);
        const u = frac(random(`ar${k}`) + n * fase);
        const x = u * (W + 200) - 100;
        const y =
          910 + random(`ary${k}`) * 70 + 10 * Math.sin((x / W) * Math.PI * 2);
        return (
          <rect
            key={k}
            x={x}
            y={y}
            width={40 + random(`arw${k}`) * 50}
            height={3}
            rx={1.5}
            fill="#A8E8F0"
            opacity={0.35}
          />
        );
      })}
      <Motas
        fase={fase}
        cuantas={34}
        x0={0}
        y0={520}
        w={W}
        h={360}
        color="#E8F87A"
        semilla="lu"
        r={4}
      />
      {/* rocas y hierba */}
      <ellipse cx={300} cy={1010} rx={120} ry={40} fill="#1A2A26" />
      <ellipse cx={1600} cy={1020} rx={160} ry={46} fill="#1A2A26" />
      {new Array(40).fill(0).map((_, k) => {
        const x = random(`hb${k}`) * W;
        return (
          <path
            key={k}
            d={`M ${x} 1080 q ${6 * osc(fase, 3, k / 40)} -30 ${10 + 4 * osc(fase, 3, k / 40)} -60`}
            stroke="#1E4A3A"
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
          />
        );
      })}
      <Marca />
    </Lienzo>
  );
};

// ───────────── Nature 2: lago de montaña al atardecer con aves ─────────────
export const NatureLago: React.FC = () => {
  const { fase } = useBucle();
  return (
    <Lienzo fondo="#2A1E3A">
      <defs>
        <linearGradient id="cieloL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A2A5A" />
          <stop offset="0.55" stopColor="#E8907A" />
          <stop offset="1" stopColor="#F8D0A0" />
        </linearGradient>
      </defs>
      <rect width={W} height={620} fill="url(#cieloL)" />
      <circle cx={960} cy={560} r={110} fill="#FFE8B8" opacity={0.9} />
      <CapaNubes
        fase={fase}
        n={1}
        y={200}
        s={0.9}
        color="#F8B09A"
        cuantas={5}
        semilla="ln"
        op={0.5}
      />
      <CapaNubes
        fase={fase}
        n={-1}
        y={300}
        s={0.7}
        color="#E89A8A"
        cuantas={4}
        semilla="lm"
        op={0.4}
      />
      <polygon
        points="0,620 220,360 420,520 640,300 900,560 1180,330 1420,540 1660,380 1920,560 1920,620"
        fill="#5A3A6A"
      />
      <polygon
        points="0,620 300,470 560,600 820,450 1100,610 1380,470 1680,600 1920,500 1920,620"
        fill="#3A2850"
      />
      {/* lago con reflejo */}
      <rect x={0} y={620} width={W} height={460} fill="#4A3A6A" />
      <g opacity={0.35}>
        <polygon
          points="0,620 220,880 420,720 640,940 900,680 1180,910 1420,700 1660,860 1920,680 1920,620"
          fill="#5A3A6A"
        />
      </g>
      {new Array(18).fill(0).map((_, k) => (
        <rect
          key={k}
          x={960 - 100 + 24 * osc(fase, 5, k / 18) - k * 4}
          y={640 + k * 22}
          width={200 + k * 8}
          height={4}
          rx={2}
          fill="#FFE8B8"
          opacity={0.55 - k * 0.025}
        />
      ))}
      {new Array(40).fill(0).map((_, k) => (
        <rect
          key={k}
          x={random(`lr${k}`) * W + 30 * osc(fase, 2, k / 40)}
          y={660 + random(`lry${k}`) * 400}
          width={60 + random(`lrw${k}`) * 120}
          height={2}
          fill="#F8D0E8"
          opacity={0.15}
        />
      ))}
      {/* aves que cruzan 3 veces por bucle */}
      {[0, 1, 2, 3, 4].map((k) => {
        const u = frac(fase * 3 + k * 0.025);
        const x = -100 + u * (W + 200);
        const y = 260 + (k % 3) * 30 + k * 6 + 12 * osc(fase, 60, k / 5);
        const ala = 10 * osc(fase, 90, k / 5);
        return (
          <path
            key={k}
            d={`M ${x - 18} ${y + ala} Q ${x - 9} ${y - 8} ${x} ${y} Q ${x + 9} ${y - 8} ${x + 18} ${y + ala}`}
            stroke="#2A1A30"
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
        );
      })}
      {/* juncos en primer plano */}
      {new Array(30).fill(0).map((_, k) => {
        const x = random(`jn${k}`) * W;
        const h = 80 + random(`jh${k}`) * 120;
        return (
          <path
            key={k}
            d={`M ${x} 1080 q ${8 * osc(fase, 2, k / 30)} ${-h / 2} ${14 + 8 * osc(fase, 2, k / 30)} ${-h}`}
            stroke="#2A1E3A"
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
          />
        );
      })}
      <Marca />
    </Lienzo>
  );
};
