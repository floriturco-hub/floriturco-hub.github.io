import { random } from "remotion";
import {
  CapaNubes,
  Degradado,
  destello,
  Estrellas,
  frac,
  H,
  Halo,
  Lienzo,
  Lluvia,
  Marca,
  osc,
  Rayo,
  useBucle,
  Vapor,
  W,
} from "./Base";

const CALIDA = "#F8C27A";

// ───────────── Rainy Night 1: ventana con lluvia desde un cuarto acogedor ─────────────
export const RainyVentana: React.FC = () => {
  const { fase } = useBucle();
  // marco de la ventana
  const vx = 360;
  const vy = 120;
  const vw = 1200;
  const vh = 640;
  return (
    <Lienzo fondo="#16122A">
      <Degradado id="exterior" arriba="#0C1028" abajo="#1E2448" />
      <defs>
        <clipPath id="vidrio">
          <rect x={vx} y={vy} width={vw} height={vh} />
        </clipPath>
      </defs>
      <rect width={W} height={H} fill="#1A1530" />
      <rect x={vx} y={vy} width={vw} height={vh} fill="url(#exterior)" />
      <g clipPath="url(#vidrio)">
        {/* luces desenfocadas de la ciudad */}
        {new Array(40).fill(0).map((_, k) => (
          <circle
            key={k}
            cx={vx + random(`bk${k}`) * vw}
            cy={vy + 260 + random(`bky${k}`) * 360}
            r={14 + random(`bkr${k}`) * 30}
            fill={["#F8C27A", "#E8703C", "#7AA8E8", "#C88AE8"][k % 4]}
            opacity={
              (0.12 + 0.1 * osc(fase, 2 + (k % 5), random(`bkd${k}`))) * 1.4
            }
          />
        ))}
        <Lluvia
          fase={fase}
          cuantas={120}
          largo={30}
          ancho={1.5}
          vel={110}
          op={0.35}
          semilla="vr"
          x0={vx}
          y0={vy}
          w={vw}
          h={vh}
          inclinacion={0.1}
        />
        {/* gotas que resbalan por el vidrio */}
        {new Array(26).fill(0).map((_, k) => {
          const n = 2 + Math.floor(random(`gn${k}`) * 4);
          const u = frac(random(`gu${k}`) + n * fase);
          const x = vx + 30 + random(`gx${k}`) * (vw - 60);
          const y = vy - 20 + u * (vh + 140);
          return (
            <g key={k} opacity={0.6}>
              <line
                x1={x}
                y1={y - 80}
                x2={x}
                y2={y}
                stroke="#B8C8F0"
                strokeWidth={2}
                opacity={0.25}
              />
              <ellipse
                cx={x}
                cy={y}
                rx={6}
                ry={8}
                fill="#C8D8FF"
                opacity={0.55}
              />
            </g>
          );
        })}
        {new Array(70).fill(0).map((_, k) => (
          <circle
            key={k}
            cx={vx + random(`gs${k}`) * vw}
            cy={vy + random(`gsy${k}`) * vh}
            r={2 + random(`gsr${k}`) * 3}
            fill="#C8D8FF"
            opacity={0.3}
          />
        ))}
      </g>
      {/* marco */}
      <rect
        x={vx - 24}
        y={vy - 24}
        width={vw + 48}
        height={vh + 48}
        fill="none"
        stroke="#2E2540"
        strokeWidth={48}
      />
      <rect x={vx + vw / 2 - 12} y={vy} width={24} height={vh} fill="#2E2540" />
      <rect x={vx} y={vy + vh / 2 - 12} width={vw} height={24} fill="#2E2540" />
      {/* cortinas */}
      <path
        d={`M 250 60 Q 330 400 280 820 L 200 820 L 200 60 Z`}
        fill="#3A2A55"
      />
      <path
        d={`M 1670 60 Q 1590 400 1640 820 L 1720 820 L 1720 60 Z`}
        fill="#3A2A55"
      />
      {/* escritorio */}
      <rect x={0} y={800} width={W} height={280} fill="#2A1E36" />
      <rect x={0} y={800} width={W} height={18} fill="#3A2A48" />
      <Halo
        id="lampV"
        cx={480}
        cy={760}
        r={420}
        color={CALIDA}
        op={0.28 + 0.02 * osc(fase, 41)}
      />
      <path
        d="M 430 800 L 470 640 L 490 640"
        stroke="#1A1424"
        strokeWidth={14}
        fill="none"
      />
      <path d="M 440 600 L 560 600 L 520 660 L 470 660 Z" fill="#3A2A48" />
      <ellipse cx={495} cy={660} rx={32} ry={8} fill={CALIDA} opacity={0.9} />
      <rect x={400} y={790} width={120} height={14} rx={6} fill="#1A1424" />
      {/* taza */}
      <rect x={1240} y={720} width={90} height={84} rx={14} fill="#C8C4D8" />
      <path
        d="M 1330 740 q 40 0 40 30 q 0 30 -40 30"
        stroke="#C8C4D8"
        strokeWidth={12}
        fill="none"
      />
      <Vapor fase={fase} x={1285} y={710} s={0.9} n={20} />
      {/* libros y planta */}
      <rect x={700} y={760} width={260} height={30} rx={4} fill="#6A4A7A" />
      <rect x={720} y={730} width={230} height={30} rx={4} fill="#4A6A8A" />
      <rect x={1500} y={700} width={90} height={100} rx={10} fill="#4A3A5A" />
      {[0, 1, 2, 3, 4].map((k) => (
        <ellipse
          key={k}
          cx={1545 + (k - 2) * 26}
          cy={660 - Math.abs(k - 2) * -10}
          rx={22}
          ry={60}
          fill="#3A6A4A"
          transform={`rotate(${(k - 2) * 22 + 2 * osc(fase, 3, k / 5)} ${1545} 700)`}
        />
      ))}
      <Marca />
    </Lienzo>
  );
};

// ───────────── Rainy Night 2: farola en una calle mojada ─────────────
const RAYOS_CALLE = [31, 74];
export const RainyCalle: React.FC = () => {
  const { fase, t } = useBucle();
  const flash = destello(t, RAYOS_CALLE);
  const activo = RAYOS_CALLE.findIndex((r) => t - r >= 0 && t - r < 0.5);
  return (
    <Lienzo fondo="#0B0A1C">
      <Degradado id="cieloC" arriba="#080818" abajo="#1E1C3E" />
      <rect width={W} height={H} fill="url(#cieloC)" />
      {activo >= 0 ? (
        <Rayo
          x={[1400, 600][activo]}
          semilla={`rc${activo}`}
          op={Math.min(1, flash * 1.4)}
        />
      ) : null}
      <CapaNubes
        fase={fase}
        n={1}
        y={100}
        s={1.4}
        color="#1C1B38"
        cuantas={6}
        semilla="cl"
      />
      <CapaNubes
        fase={fase}
        n={2}
        y={30}
        s={1.6}
        color="#262447"
        cuantas={5}
        semilla="cc"
        op={0.9}
      />
      <rect width={W} height={H} fill="#B8C4FF" opacity={flash * 0.2} />
      {/* edificios lejanos */}
      {new Array(12).fill(0).map((_, k) => {
        const bw = 120 + random(`ew${k}`) * 80;
        const bh = 180 + random(`eh${k}`) * 260;
        const bx = k * 165;
        return (
          <g key={k}>
            <rect x={bx} y={780 - bh} width={bw} height={bh} fill="#151330" />
            {new Array(8).fill(0).map((__, j) => (
              <rect
                key={j}
                x={bx + 16 + (j % 3) * 36}
                y={800 - bh + 30 + Math.floor(j / 3) * 50}
                width={18}
                height={24}
                fill={CALIDA}
                opacity={
                  random(`ev${k}${j}`) > 0.5
                    ? 0.35 + 0.1 * osc(fase, 1 + (j % 3), k / 12)
                    : 0.05
                }
              />
            ))}
          </g>
        );
      })}
      <rect x={0} y={780} width={W} height={300} fill="#0E0C20" />
      {/* reflejos en el asfalto mojado */}
      {new Array(12).fill(0).map((_, k) => (
        <rect
          key={k}
          x={k * 165 + 30}
          y={800 + (k % 3) * 14}
          width={60}
          height={160}
          fill={CALIDA}
          opacity={0.04 + 0.02 * osc(fase, 5, k / 12)}
        />
      ))}
      <Lluvia
        fase={fase}
        cuantas={200}
        largo={26}
        ancho={1.5}
        vel={120}
        op={0.35}
        semilla="cf"
      />
      {/* farola con cono de luz */}
      <Halo id="farola" cx={700} cy={430} r={300} color={CALIDA} op={0.35} />
      <polygon
        points="660,440 740,440 980,1000 420,1000"
        fill={CALIDA}
        opacity={0.08}
      />
      <ellipse
        cx={700}
        cy={1000}
        rx={300}
        ry={40}
        fill={CALIDA}
        opacity={0.12}
      />
      <rect x={690} y={430} width={20} height={600} fill="#1A1630" />
      <path d="M 650 440 L 750 440 L 730 400 L 670 400 Z" fill="#2A2440" />
      <rect x={672} y={438} width={56} height={10} fill={CALIDA} />
      {/* lluvia iluminada dentro del cono */}
      <Lluvia
        fase={fase}
        cuantas={70}
        largo={30}
        ancho={2}
        vel={150}
        op={0.6}
        semilla="cono"
        color="#FFE4B0"
        x0={460}
        y0={440}
        w={480}
        h={560}
        inclinacion={0.12}
      />
      {/* banco */}
      <rect x={880} y={930} width={260} height={16} rx={6} fill="#2A2440" />
      <rect x={880} y={890} width={260} height={12} rx={6} fill="#2A2440" />
      <rect x={895} y={946} width={12} height={60} fill="#2A2440" />
      <rect x={1113} y={946} width={12} height={60} fill="#2A2440" />
      {/* ondas en charcos */}
      {new Array(24).fill(0).map((_, k) => {
        const m = 30 + Math.floor(random(`om${k}`) * 40);
        const u = frac(random(`ou${k}`) + m * fase);
        return (
          <ellipse
            key={k}
            cx={random(`ox${k}`) * W}
            cy={1000 + random(`oy${k}`) * 60}
            rx={6 + u * 46}
            ry={(6 + u * 46) * 0.22}
            fill="none"
            stroke="#9AA8D8"
            strokeWidth={2}
            opacity={(1 - u) * 0.45}
          />
        );
      })}
      <Lluvia
        fase={fase}
        cuantas={110}
        largo={52}
        ancho={2.4}
        vel={160}
        op={0.5}
        semilla="cn"
      />
      <rect width={W} height={H} fill="#FFFFFF" opacity={flash * 0.07} />
      <Marca />
    </Lienzo>
  );
};

// Montañas en capas
const Montes: React.FC<{
  readonly y: number;
  readonly color: string;
  readonly semilla: string;
  readonly amp: number;
}> = ({ y, color, semilla, amp }) => {
  const pts = new Array(11)
    .fill(0)
    .map((_, k) => `${(k / 10) * W},${y - random(`${semilla}${k}`) * amp}`);
  return <polygon points={`0,${H} ${pts.join(" ")} ${W},${H}`} fill={color} />;
};

// ───────────── Sleepy Ambient 1: luna, aurora y lago en calma ─────────────
export const SleepyAurora: React.FC = () => {
  const { fase } = useBucle();
  const banda = (k: number) =>
    new Array(13)
      .fill(0)
      .map((_, j) => {
        const x = (j / 12) * W;
        const y =
          260 +
          k * 50 +
          60 * osc(fase, 1, j / 12 + k * 0.2) +
          30 * osc(fase, 2, j / 6);
        return `${j === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  return (
    <Lienzo fondo="#060818">
      <Degradado id="cieloA" arriba="#04061A" abajo="#142040" />
      <rect width={W} height={H} fill="url(#cieloA)" />
      <Estrellas fase={fase} cuantas={160} alto={620} semilla="ea" />
      {[0, 1, 2].map((k) => (
        <path
          key={k}
          d={banda(k)}
          stroke={["#3AE8B0", "#5AC8E8", "#9A7AE8"][k]}
          strokeWidth={70 - k * 15}
          fill="none"
          opacity={0.12 + 0.05 * osc(fase, 2, k / 3)}
          strokeLinecap="round"
          style={{ filter: "blur(18px)" }}
        />
      ))}
      <Halo id="luna" cx={1440} cy={220} r={240} color="#E8F0FF" op={0.25} />
      <circle cx={1440} cy={220} r={70} fill="#EEF2FF" />
      <circle cx={1420} cy={200} r={12} fill="#D8DEF0" />
      <circle cx={1465} cy={240} r={8} fill="#D8DEF0" />
      <Montes y={700} color="#0E1430" semilla="ma" amp={260} />
      <Montes y={760} color="#0A0F26" semilla="mb" amp={160} />
      {/* lago con reflejos */}
      <rect x={0} y={760} width={W} height={320} fill="#0A1230" />
      <g opacity={0.5}>
        {new Array(16).fill(0).map((_, k) => (
          <rect
            key={k}
            x={1440 - 60 + 20 * osc(fase, 6, k / 16) - k * 3}
            y={780 + k * 18}
            width={120 + k * 6}
            height={4}
            rx={2}
            fill="#EEF2FF"
            opacity={0.6 - k * 0.03}
          />
        ))}
      </g>
      {new Array(30).fill(0).map((_, k) => (
        <rect
          key={k}
          x={random(`la${k}`) * W + 30 * osc(fase, 2, k / 30)}
          y={800 + random(`lb${k}`) * 260}
          width={60 + random(`lc${k}`) * 120}
          height={2}
          fill="#5AC8E8"
          opacity={0.12}
        />
      ))}
      <Marca />
    </Lienzo>
  );
};

// ───────────── Sleepy Ambient 2: pueblo dormido bajo la luna ─────────────
export const SleepyPueblo: React.FC = () => {
  const { fase } = useBucle();
  const fugaz = frac(fase * 2);
  return (
    <Lienzo fondo="#0A0A20">
      <Degradado id="cieloP" arriba="#0A0A22" abajo="#2A2450" />
      <rect width={W} height={H} fill="url(#cieloP)" />
      <Estrellas fase={fase} cuantas={130} alto={600} semilla="ep" />
      {fugaz < 0.08 ? (
        <line
          x1={300 + fugaz * 6000}
          y1={120 + fugaz * 1500}
          x2={300 + fugaz * 6000 - 160}
          y2={120 + fugaz * 1500 - 40}
          stroke="#FFFFFF"
          strokeWidth={3}
          opacity={Math.sin((fugaz / 0.08) * Math.PI)}
          strokeLinecap="round"
        />
      ) : null}
      <Halo id="lunaP" cx={420} cy={240} r={260} color="#FFE8C8" op={0.22} />
      <path
        d="M 420 160 A 80 80 0 1 0 470 300 A 64 64 0 1 1 420 160 Z"
        fill="#FFF0D8"
      />
      <CapaNubes
        fase={fase}
        n={1}
        y={320}
        s={1}
        color="#3A3460"
        cuantas={4}
        semilla="np"
        op={0.45}
      />
      <path
        d={`M 0 760 Q 480 640 960 730 T 1920 700 L 1920 ${H} L 0 ${H} Z`}
        fill="#1E1A3E"
      />
      <path
        d={`M 0 860 Q 520 780 1000 840 T 1920 820 L 1920 ${H} L 0 ${H} Z`}
        fill="#16132E"
      />
      {/* casitas con ventanas que se encienden y apagan despacio */}
      {new Array(9).fill(0).map((_, k) => {
        const x = 160 + k * 200 + random(`cx${k}`) * 60;
        const y = 760 + random(`cy${k}`) * 60;
        const s = 0.7 + random(`cs${k}`) * 0.4;
        const luz = Math.max(0, osc(fase, 1, random(`cl${k}`)));
        return (
          <g key={k} transform={`translate(${x} ${y}) scale(${s})`}>
            <Halo
              id={`hp${k}`}
              cx={40}
              cy={50}
              r={110}
              color={CALIDA}
              op={0.18 * luz}
            />
            <rect x={0} y={20} width={90} height={70} fill="#0E0C22" />
            <polygon points="-12,24 45,-24 102,24" fill="#0E0C22" />
            <rect
              x={28}
              y={42}
              width={32}
              height={26}
              rx={3}
              fill={CALIDA}
              opacity={0.15 + 0.75 * luz}
            />
          </g>
        );
      })}
      <Marca />
    </Lienzo>
  );
};
