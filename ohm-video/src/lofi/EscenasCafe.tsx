import { random } from "remotion";
import { mono } from "../theme";
import {
  CapaNubes,
  Degradado,
  frac,
  H,
  Halo,
  Lienzo,
  Lluvia,
  Marca,
  osc,
  useBucle,
  Vapor,
  W,
} from "./Base";

const CALIDA = "#F8C27A";
const MADERA = "#4A2E24";

// Tocadiscos con disco que gira n vueltas por bucle
const Tocadiscos: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly fase: number;
  readonly n: number;
}> = ({ x, y, s, fase, n }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect
      x={-170}
      y={-120}
      width={340}
      height={240}
      rx={18}
      fill="#2A1E1A"
      stroke="#5A4034"
      strokeWidth={6}
    />
    <g transform={`translate(-30 0) rotate(${fase * n * 360})`}>
      <circle r={95} fill="#0E0C14" />
      {[80, 65, 50].map((r) => (
        <circle key={r} r={r} fill="none" stroke="#2A2632" strokeWidth={2} />
      ))}
      <circle r={30} fill="#E8703C" />
      <rect x={-4} y={-28} width={8} height={14} fill="#F8C27A" />
    </g>
    <circle cx={110} cy={-80} r={14} fill="#8C88A8" />
    <path
      d="M 110 -80 L 60 30 L 30 40"
      stroke="#C8C4D8"
      strokeWidth={8}
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

// ───────────── Jazzhop 1: café de noche con tocadiscos ─────────────
export const JazzCafe: React.FC = () => {
  const { fase } = useBucle();
  return (
    <Lienzo fondo="#1E1418">
      <Degradado id="paredJ" arriba="#2A1C22" abajo="#3A2628" />
      <rect width={W} height={H} fill="url(#paredJ)" />
      {/* ventana a la calle con llovizna */}
      <defs>
        <clipPath id="ventJ">
          <rect x={1060} y={120} width={720} height={460} rx={10} />
        </clipPath>
      </defs>
      <rect x={1060} y={120} width={720} height={460} rx={10} fill="#141A34" />
      <g clipPath="url(#ventJ)">
        {new Array(24).fill(0).map((_, k) => (
          <circle
            key={k}
            cx={1060 + random(`jb${k}`) * 720}
            cy={300 + random(`jby${k}`) * 260}
            r={16 + random(`jbr${k}`) * 26}
            fill={["#F8C27A", "#E8703C", "#7AA8E8"][k % 3]}
            opacity={0.18 + 0.06 * osc(fase, 3, k / 24)}
          />
        ))}
        <Lluvia
          fase={fase}
          cuantas={60}
          largo={22}
          ancho={1.4}
          vel={100}
          op={0.35}
          semilla="jr"
          x0={1060}
          y0={120}
          w={720}
          h={460}
          inclinacion={0.1}
        />
      </g>
      <rect
        x={1060}
        y={120}
        width={720}
        height={460}
        rx={10}
        fill="none"
        stroke={MADERA}
        strokeWidth={22}
      />
      <rect x={1410} y={120} width={20} height={460} fill={MADERA} />
      {/* lámparas colgantes que se balancean suavemente */}
      {[300, 700].map((x, k) => {
        const ang = 2.5 * osc(fase, 3, k * 0.3);
        return (
          <g key={x} transform={`rotate(${ang} ${x} 0)`}>
            <line
              x1={x}
              y1={0}
              x2={x}
              y2={260}
              stroke="#1A1014"
              strokeWidth={4}
            />
            <path
              d={`M ${x - 60} 320 L ${x + 60} 320 L ${x + 30} 260 L ${x - 30} 260 Z`}
              fill="#3A2A20"
            />
            <Halo
              id={`lj${k}`}
              cx={x}
              cy={340}
              r={300}
              color={CALIDA}
              op={0.25}
            />
            <ellipse
              cx={x}
              cy={320}
              rx={56}
              ry={10}
              fill={CALIDA}
              opacity={0.9}
            />
          </g>
        );
      })}
      {/* barra */}
      <rect x={0} y={720} width={W} height={360} fill="#2A1A16" />
      <rect x={0} y={700} width={W} height={36} fill={MADERA} />
      <Tocadiscos x={460} y={620} s={0.9} fase={fase} n={60} />
      {/* notas que flotan desde el tocadiscos */}
      {[0, 1, 2, 3].map((k) => {
        const u = frac(fase * 18 + k / 4);
        return (
          <text
            key={k}
            x={430 + 60 * osc(fase, 18, k / 4) + k * 20}
            y={500 - u * 320}
            fill={CALIDA}
            opacity={Math.sin(u * Math.PI) * 0.8}
            fontSize={48}
            fontFamily={mono}
            fontWeight={700}
          >
            {k % 2 ? "♪" : "♫"}
          </text>
        );
      })}
      {/* taza de café */}
      <rect x={880} y={620} width={110} height={90} rx={16} fill="#E8E6F0" />
      <path
        d="M 990 640 q 44 0 44 30 q 0 30 -44 30"
        stroke="#E8E6F0"
        strokeWidth={12}
        fill="none"
      />
      <ellipse cx={935} cy={705} rx={90} ry={14} fill="#C8C4D8" />
      <Vapor fase={fase} x={935} y={610} n={20} />
      {/* cafetera */}
      <rect x={1200} y={560} width={220} height={150} rx={14} fill="#8C88A8" />
      <rect x={1230} y={590} width={160} height={40} rx={8} fill="#2A2440" />
      <circle
        cx={1310}
        cy={610}
        r={10}
        fill={CALIDA}
        opacity={0.6 + 0.4 * osc(fase, 10)}
      />
      <rect x={1290} y={640} width={40} height={30} fill="#5A5670" />
      {/* plantas */}
      <rect x={1560} y={620} width={90} height={90} rx={10} fill="#5A3A2A" />
      {[0, 1, 2, 3, 4].map((k) => (
        <ellipse
          key={k}
          cx={1605}
          cy={570}
          rx={20}
          ry={58}
          fill="#3A6A4A"
          transform={`rotate(${(k - 2) * 25 + 2 * osc(fase, 2, k / 5)} 1605 620)`}
        />
      ))}
      <Marca />
    </Lienzo>
  );
};

// ───────────── Jazzhop 2: escenario de club de jazz con foco ─────────────
export const JazzClub: React.FC = () => {
  const { fase } = useBucle();
  return (
    <Lienzo fondo="#120A16">
      <Degradado id="clubJ" arriba="#1A0E1E" abajo="#2A1420" />
      <rect width={W} height={H} fill="url(#clubJ)" />
      {/* telón */}
      {new Array(14).fill(0).map((_, k) => (
        <rect
          key={k}
          x={k * 140}
          y={0}
          width={140}
          height={760}
          fill={k % 2 ? "#4A1424" : "#5A1A2C"}
          opacity={0.75}
        />
      ))}
      {/* foco */}
      <polygon
        points="900,0 1020,0 1300,860 620,860"
        fill="#FFE8C0"
        opacity={0.08 + 0.015 * osc(fase, 4)}
      />
      <ellipse
        cx={960}
        cy={860}
        rx={360}
        ry={60}
        fill="#FFE8C0"
        opacity={0.15}
      />
      {/* humo flotante */}
      {new Array(10).fill(0).map((_, k) => (
        <ellipse
          key={k}
          cx={
            frac(random(`hm${k}`) + fase * (k % 2 ? 1 : -1)) * (W + 800) - 400
          }
          cy={300 + random(`hmy${k}`) * 400}
          rx={260}
          ry={60}
          fill="#E8D8F0"
          opacity={0.05}
        />
      ))}
      {/* escenario */}
      <rect x={0} y={840} width={W} height={240} fill="#2A1614" />
      <rect x={0} y={830} width={W} height={20} fill="#4A2A22" />
      {/* contrabajo */}
      <g transform="translate(760 560)">
        <ellipse cx={0} cy={140} rx={80} ry={110} fill="#8A4A24" />
        <ellipse cx={0} cy={20} rx={60} ry={80} fill="#8A4A24" />
        <rect x={-10} y={-260} width={20} height={300} fill="#3A2014" />
        <rect x={-16} y={-290} width={32} height={40} rx={8} fill="#3A2014" />
        <line
          x1={0}
          y1={250}
          x2={0}
          y2={290}
          stroke="#1A1010"
          strokeWidth={6}
        />
      </g>
      {/* saxofón en su soporte */}
      <g transform="translate(1160 560)">
        <path
          d="M 0 -150 Q 10 -40 0 120 Q 0 180 60 180 Q 110 180 110 120 L 110 80"
          stroke="#E8B848"
          strokeWidth={34}
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx={110} cy={70} rx={36} ry={20} fill="#E8B848" />
        <line
          x1={-20}
          y1={-160}
          x2={10}
          y2={-150}
          stroke="#2A2440"
          strokeWidth={8}
        />
        <line
          x1={40}
          y1={200}
          x2={0}
          y2={280}
          stroke="#2A2440"
          strokeWidth={8}
        />
        <line
          x1={80}
          y1={200}
          x2={120}
          y2={280}
          stroke="#2A2440"
          strokeWidth={8}
        />
      </g>
      {/* micrófono */}
      <line
        x1={960}
        y1={600}
        x2={960}
        y2={840}
        stroke="#2A2440"
        strokeWidth={8}
      />
      <rect x={945} y={560} width={30} height={50} rx={14} fill="#8C88A8" />
      {/* notas subiendo */}
      {new Array(8).fill(0).map((_, k) => {
        const u = frac(fase * 14 + k / 8);
        return (
          <text
            key={k}
            x={700 + k * 70 + 40 * osc(fase, 14, k / 8)}
            y={760 - u * 560}
            fill="#F8C848"
            opacity={Math.sin(u * Math.PI) * 0.7}
            fontSize={52}
            fontFamily={mono}
            fontWeight={700}
          >
            {["♪", "♫", "♩"][k % 3]}
          </text>
        );
      })}
      {/* mesas con velas en primer plano */}
      {[220, 1700].map((x, k) => (
        <g key={x}>
          <Halo
            id={`vela${k}`}
            cx={x}
            cy={960}
            r={140}
            color={CALIDA}
            op={0.3 + 0.05 * osc(fase, 37, k / 2)}
          />
          <ellipse cx={x} cy={1000} rx={140} ry={26} fill="#1A0E10" />
          <rect x={x - 8} y={950} width={16} height={40} fill="#E8E6F0" />
          <ellipse cx={x} cy={944} rx={6} ry={12} fill={CALIDA} />
        </g>
      ))}
      <Marca />
    </Lienzo>
  );
};

// Reloj de pared: minutero 1 vuelta por bucle, horario 1/12 (solo se ve quieto) -> usamos segundero n vueltas
const Reloj: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly fase: number;
}> = ({ x, y, r, fase }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#E8E6F0" stroke="#3A2A48" strokeWidth={8} />
    {new Array(12).fill(0).map((_, k) => (
      <line
        key={k}
        x1={0}
        y1={-r + 8}
        x2={0}
        y2={-r + 18}
        stroke="#3A2A48"
        strokeWidth={4}
        transform={`rotate(${k * 30})`}
      />
    ))}
    <line
      x1={0}
      y1={0}
      x2={0}
      y2={-r * 0.5}
      stroke="#2A2440"
      strokeWidth={6}
      strokeLinecap="round"
      transform="rotate(300)"
    />
    <line
      x1={0}
      y1={0}
      x2={0}
      y2={-r * 0.75}
      stroke="#2A2440"
      strokeWidth={4}
      strokeLinecap="round"
      transform={`rotate(${fase * 360 * 2})`}
    />
    <circle r={5} fill="#E8703C" />
  </g>
);

// ───────────── Study 1: escritorio nocturno con portátil y lámpara ─────────────
export const StudyEscritorio: React.FC = () => {
  const { fase } = useBucle();
  const scroll = frac(fase * 8);
  return (
    <Lienzo fondo="#1A1630">
      <rect width={W} height={H} fill="#1E1A38" />
      {/* ventana nocturna */}
      <rect x={160} y={110} width={560} height={420} rx={12} fill="#0E1230" />
      {new Array(40).fill(0).map((_, k) => (
        <circle
          key={k}
          cx={180 + random(`se${k}`) * 520}
          cy={130 + random(`sey${k}`) * 260}
          r={1.5 + random(`ser${k}`) * 1.5}
          fill="#E8E6F0"
          opacity={0.5 + 0.4 * osc(fase, 3 + (k % 6), k / 40)}
        />
      ))}
      <circle cx={600} cy={200} r={40} fill="#F0ECE0" />
      <path
        d={`M 160 530 L 160 440 L 260 400 L 320 440 L 420 380 L 520 450 L 620 410 L 720 450 L 720 530 Z`}
        fill="#141A3A"
      />
      <rect
        x={160}
        y={110}
        width={560}
        height={420}
        rx={12}
        fill="none"
        stroke="#3A2A48"
        strokeWidth={20}
      />
      <Reloj x={1500} y={230} r={80} fase={fase} />
      {/* estantería */}
      <rect x={1000} y={380} width={620} height={18} fill="#3A2A48" />
      {new Array(11).fill(0).map((_, k) => (
        <rect
          key={k}
          x={1020 + k * 52}
          y={260 + random(`lb${k}`) * 40}
          width={40}
          height={120 - random(`lb${k}`) * 40}
          rx={4}
          fill={["#6A4A7A", "#4A6A8A", "#8A5A4A", "#4A7A5A"][k % 4]}
        />
      ))}
      {/* escritorio */}
      <rect x={0} y={760} width={W} height={320} fill="#2E2236" />
      <rect x={0} y={750} width={W} height={20} fill="#4A3650" />
      <Halo id="lampE" cx={420} cy={700} r={480} color={CALIDA} op={0.3} />
      <path
        d="M 340 760 L 380 600 L 460 560"
        stroke="#1A1424"
        strokeWidth={14}
        fill="none"
        strokeLinecap="round"
      />
      <path d="M 440 520 L 560 540 L 520 600 L 450 580 Z" fill="#E8703C" />
      {/* portátil con código que se desplaza */}
      <defs>
        <clipPath id="pantalla">
          <rect x={760} y={480} width={420} height={250} rx={8} />
        </clipPath>
      </defs>
      <rect x={740} y={460} width={460} height={290} rx={16} fill="#2A2440" />
      <rect x={760} y={480} width={420} height={250} rx={8} fill="#0E1022" />
      <g clipPath="url(#pantalla)">
        {new Array(36).fill(0).map((_, k) => (
          <rect
            key={k}
            x={790 + random(`ci${k % 12}`) * 3 * 30}
            y={500 + (k - 12) * 22 - scroll * 264}
            width={80 + random(`cw${k % 12}`) * 220}
            height={8}
            rx={4}
            fill={["#08D8E8", "#F8C848", "#C88AE8", "#5AE878"][k % 4]}
            opacity={0.7}
          />
        ))}
      </g>
      <Halo id="pant" cx={970} cy={605} r={300} color="#7AA8E8" op={0.12} />
      <path d="M 700 760 L 1240 760 L 1200 750 L 740 750 Z" fill="#3A3460" />
      {/* cuaderno, lápiz y taza */}
      <rect
        x={1300}
        y={710}
        width={240}
        height={50}
        rx={6}
        fill="#E8E6F0"
        transform="rotate(-6 1420 735)"
      />
      <rect
        x={1330}
        y={700}
        width={180}
        height={10}
        rx={5}
        fill="#F8C848"
        transform="rotate(-20 1420 705)"
      />
      <rect x={560} y={680} width={90} height={80} rx={14} fill="#C88AA8" />
      <Vapor fase={fase} x={605} y={670} s={0.8} n={20} />
      {/* planta */}
      <rect x={180} y={680} width={90} height={80} rx={10} fill="#5A3A4A" />
      {[0, 1, 2, 3, 4].map((k) => (
        <ellipse
          key={k}
          cx={225}
          cy={630}
          rx={18}
          ry={56}
          fill="#3A6A4A"
          transform={`rotate(${(k - 2) * 24 + 2 * osc(fase, 2, k / 5)} 225 680)`}
        />
      ))}
      <Marca />
    </Lienzo>
  );
};

// ───────────── Study 2: habitación al atardecer con gato dormido ─────────────
export const StudyAtardecer: React.FC = () => {
  const { fase } = useBucle();
  const respira = 1 + 0.03 * osc(fase, 24);
  return (
    <Lienzo fondo="#2A1E30">
      <rect width={W} height={H} fill="#3A2838" />
      {/* ventana con atardecer y nubes que pasan */}
      <defs>
        <linearGradient id="atard" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5A3A7A" />
          <stop offset="0.6" stopColor="#E8705A" />
          <stop offset="1" stopColor="#F8C27A" />
        </linearGradient>
        <clipPath id="ventS">
          <rect x={560} y={100} width={800} height={500} rx={12} />
        </clipPath>
      </defs>
      <rect
        x={560}
        y={100}
        width={800}
        height={500}
        rx={12}
        fill="url(#atard)"
      />
      <g clipPath="url(#ventS)">
        <circle cx={960} cy={540} r={90} fill="#FFE0A0" opacity={0.9} />
        <CapaNubes
          fase={fase}
          n={1}
          y={260}
          s={0.6}
          color="#F8A88A"
          cuantas={5}
          semilla="sn"
          op={0.55}
        />
        <path
          d="M 560 600 L 560 500 L 700 470 L 820 520 L 980 460 L 1120 510 L 1240 470 L 1360 500 L 1360 600 Z"
          fill="#3A2448"
        />
        {/* pájaros: cruzan 2 veces por bucle */}
        {[0, 1, 2].map((k) => {
          const u = frac(fase * 2 + k * 0.05);
          const x = 520 + u * 900;
          const y = 220 + k * 24 + 10 * osc(fase, 40, k / 3);
          return (
            <path
              key={k}
              d={`M ${x - 14} ${y} q 7 -8 14 0 q 7 -8 14 0`}
              stroke="#2A1A30"
              strokeWidth={4}
              fill="none"
            />
          );
        })}
      </g>
      <rect
        x={560}
        y={100}
        width={800}
        height={500}
        rx={12}
        fill="none"
        stroke="#5A3A48"
        strokeWidth={24}
      />
      <rect x={950} y={100} width={20} height={500} fill="#5A3A48" />
      {/* luz del atardecer sobre la pared */}
      <polygon
        points="560,600 1360,600 1560,1080 360,1080"
        fill="#F8C27A"
        opacity={0.06}
      />
      {/* escritorio */}
      <rect x={0} y={760} width={W} height={320} fill="#4A3040" />
      <rect x={0} y={750} width={W} height={20} fill="#6A4250" />
      {/* cuaderno abierto */}
      <path
        d="M 560 740 L 760 720 L 960 740 L 960 760 L 560 760 Z"
        fill="#F0EEF8"
      />
      <line
        x1={760}
        y1={720}
        x2={760}
        y2={760}
        stroke="#C8C4D8"
        strokeWidth={3}
      />
      {/* auriculares */}
      <path
        d="M 1080 750 A 70 70 0 0 1 1220 750"
        stroke="#2A2440"
        strokeWidth={14}
        fill="none"
      />
      <rect x={1064} y={720} width={34} height={40} rx={12} fill="#E8703C" />
      <rect x={1204} y={720} width={34} height={40} rx={12} fill="#E8703C" />
      {/* gato dormido respirando */}
      <g transform={`translate(1500 720) scale(${respira} ${1 / respira})`}>
        <ellipse cx={0} cy={0} rx={130} ry={60} fill="#1E1626" />
        <circle cx={-100} cy={-20} r={48} fill="#1E1626" />
        <polygon points="-136,-48 -124,-90 -104,-56" fill="#1E1626" />
        <polygon points="-90,-60 -70,-96 -62,-52" fill="#1E1626" />
        <path
          d="M -118 -22 q 8 6 16 0 M -90 -22 q 8 6 16 0"
          stroke="#8C7A90"
          strokeWidth={3}
          fill="none"
        />
        <path
          d="M 120 10 q 60 20 20 50"
          stroke="#1E1626"
          strokeWidth={22}
          fill="none"
          strokeLinecap="round"
        />
      </g>
      {/* Zzz */}
      {[0, 1, 2].map((k) => {
        const u = frac(fase * 12 + k / 3);
        return (
          <text
            key={k}
            x={1380 - u * 60}
            y={640 - u * 120}
            fill="#E8E6F0"
            opacity={Math.sin(u * Math.PI) * 0.6}
            fontSize={30 + u * 20}
            fontFamily={mono}
            fontWeight={700}
          >
            z
          </text>
        );
      })}
      {/* planta colgante */}
      <line
        x1={300}
        y1={0}
        x2={300}
        y2={180}
        stroke="#2A1A20"
        strokeWidth={3}
      />
      <path d="M 250 180 L 350 180 L 330 240 L 270 240 Z" fill="#8A5A4A" />
      {[0, 1, 2, 3].map((k) => (
        <path
          key={k}
          d={`M ${270 + k * 20} 240 q ${10 * osc(fase, 2, k / 4)} 80 ${-10 + k * 6} ${160 + k * 30}`}
          stroke="#4A7A5A"
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
        />
      ))}
      <Marca />
    </Lienzo>
  );
};
