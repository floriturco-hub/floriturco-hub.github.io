import { interpolateColors, random } from "remotion";
import { C, mono } from "../theme";

export const HIGADO = "#A8443C";
const BORDE = "#E07A68";
const LOBULO_D =
  "M 60 -175 C -80 -200 -300 -190 -340 -60 C -370 40 -300 150 -170 170 C -60 185 30 150 60 110 Z";
const LOBULO_I =
  "M 60 -175 C 160 -170 300 -150 360 -90 C 380 -60 340 -30 280 -10 C 200 20 120 70 60 110 Z";

// Hígado visto de frente. El lóbulo derecho (a la izquierda de la pantalla) es ~2/3 del total.
export const Higado: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly quitar?: number; // 0..1 el lóbulo derecho se separa y desaparece
  readonly crece?: number; // 0..1 lo que queda se agranda
  readonly fantasma?: number; // contorno del hígado original
  readonly linea?: number; // línea de corte
  readonly cicatrices?: number;
  readonly solo?: "D" | "I";
  readonly creceD?: number; // para el receptor: el lóbulo derecho trasplantado se agranda
  readonly mordido?: number; // 0..1 Prometeo: el hígado se encoge
}> = ({
  x,
  y,
  s = 1,
  quitar = 0,
  crece = 0,
  fantasma = 0,
  linea = 0,
  cicatrices = 0,
  solo,
  creceD = 0,
  mordido = 0,
}) => {
  const color = interpolateColors(cicatrices, [0, 1], [HIGADO, "#7E6058"]);
  const mostrarD = solo !== "I" && quitar < 1;
  const mostrarI = solo !== "D";
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (1 - 0.45 * mordido)})`}>
      {fantasma > 0 ? (
        <g
          opacity={fantasma}
          fill="none"
          stroke={C.grey}
          strokeWidth={5}
          strokeDasharray="16 12"
        >
          <path d={LOBULO_D} />
          <path d={LOBULO_I} />
        </g>
      ) : null}
      {mostrarD ? (
        <g
          transform={`translate(${-140 * quitar + 140 * creceD} ${60 * quitar}) rotate(${-10 * quitar} -140 0) scale(${1 + 0.4 * creceD})`}
          opacity={1 - quitar}
        >
          <path d={LOBULO_D} fill={color} stroke={BORDE} strokeWidth={6} />
        </g>
      ) : null}
      {mostrarI ? (
        <g
          transform={`translate(${-190 * crece} ${10 * crece}) translate(220 -30) scale(${1 + 0.6 * crece}) translate(-220 30)`}
        >
          <path
            d={LOBULO_I}
            fill={color}
            stroke={BORDE}
            strokeWidth={6 / (1 + 0.6 * crece)}
          />
        </g>
      ) : null}
      {linea > 0 ? (
        <line
          x1={60}
          y1={-230}
          x2={60}
          y2={-230 + 400 * linea}
          stroke={C.yellow}
          strokeWidth={7}
          strokeDasharray="20 14"
        />
      ) : null}
      {cicatrices > 0 ? (
        <g
          opacity={cicatrices}
          stroke="#D8CCC0"
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        >
          {new Array(14).fill(0).map((_, k) => {
            const px = -300 + random(`cx${k}`) * 600;
            const py = -150 + random(`cy${k}`) * 260;
            return (
              <path
                key={k}
                d={`M ${px} ${py} q ${30 + random(`cq${k}`) * 30} ${-20 + random(`cr${k}`) * 40} ${60} ${10}`}
              />
            );
          })}
          {new Array(18).fill(0).map((_, k) => (
            <circle
              key={`n${k}`}
              cx={-300 + random(`nx${k}`) * 620}
              cy={-140 + random(`ny${k}`) * 250}
              r={14}
              stroke="#C8A898"
              strokeWidth={4}
            />
          ))}
        </g>
      ) : null}
    </g>
  );
};

// Tejido de hepatocitos: rejilla hexagonal
const hexa = (r: number) =>
  new Array(6)
    .fill(0)
    .map(
      (_, i) =>
        `${r * Math.cos((Math.PI / 3) * i + Math.PI / 6)},${r * Math.sin((Math.PI / 3) * i + Math.PI / 6)}`,
    )
    .join(" ");
const Rejilla: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly r: number;
  readonly brillo: number;
  readonly adn: number;
  readonly tabique: number;
  readonly t: number;
  readonly op?: number;
}> = ({ x, y, w, h, r, brillo, adn, tabique, t, op = 1 }) => {
  const dx = r * Math.sqrt(3);
  const dy = r * 1.5;
  const celdas: React.ReactNode[] = [];
  let k = 0;
  for (let fila = 0; y + fila * dy < y + h; fila++) {
    for (let col = 0; x + col * dx < x + w; col++) {
      const cx = x + col * dx + (fila % 2 ? dx / 2 : 0);
      const cy = y + fila * dy;
      const late = 0.85 + 0.15 * Math.sin(t * 5 + k);
      const color = `rgba(${Math.round(110 + 110 * brillo)}, ${Math.round(50 + 40 * brillo)}, ${Math.round(60 + 20 * brillo)}, ${0.55 + 0.45 * brillo * late})`;
      const sep = r * 0.28 * adn;
      celdas.push(
        <g key={k} transform={`translate(${cx} ${cy})`}>
          <polygon
            points={hexa(r * 0.94)}
            fill={color}
            stroke="#E8A090"
            strokeWidth={2}
          />
          {adn > 0 ? (
            <>
              <circle cx={-sep} cy={0} r={r * 0.22} fill="#5A1E30" />
              <circle cx={sep} cy={0} r={r * 0.22} fill="#5A1E30" />
            </>
          ) : (
            <circle cx={0} cy={0} r={r * 0.24} fill="#5A1E30" />
          )}
          {tabique > 0 ? (
            <line
              x1={0}
              y1={-r * 0.9 * tabique}
              x2={0}
              y2={r * 0.9 * tabique}
              stroke="#F4D0C0"
              strokeWidth={4}
            />
          ) : null}
        </g>,
      );
      k++;
    }
  }
  return <g opacity={op}>{celdas}</g>;
};

export const Tejido: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly t: number;
  readonly zzz: number;
  readonly senales: number;
  readonly brillo: number;
  readonly adn: number;
  readonly division: number; // 0..1: tabique y luego rejilla doble
}> = ({ x, y, w, h, t, zzz, senales, brillo, adn, division }) => {
  const tabique = Math.min(1, division * 2);
  const doble = Math.max(0, division * 2 - 1);
  return (
    <g>
      <defs>
        <clipPath id="clip-tejido">
          <rect x={x} y={y + 90} width={w} height={h - 90} rx={20} />
        </clipPath>
      </defs>
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
      {/* vaso sanguíneo */}
      <rect
        x={x + 20}
        y={y + 20}
        width={w - 40}
        height={56}
        rx={28}
        fill="#7A1E2A"
      />
      {new Array(10).fill(0).map((_, k) => (
        <ellipse
          key={k}
          cx={x + 40 + ((t * 90 + k * 95) % (w - 80))}
          cy={y + 48}
          rx={18}
          ry={11}
          fill="#E8414F"
        />
      ))}
      <g clipPath="url(#clip-tejido)">
        <Rejilla
          x={x + 10}
          y={y + 120}
          w={w}
          h={h - 110}
          r={62}
          brillo={brillo}
          adn={adn}
          tabique={tabique}
          t={t}
          op={1 - doble}
        />
        {doble > 0 ? (
          <Rejilla
            x={x + 10}
            y={y + 105}
            w={w}
            h={h - 95}
            r={44}
            brillo={1}
            adn={0}
            tabique={0}
            t={t}
            op={doble}
          />
        ) : null}
        {senales > 0
          ? new Array(16).fill(0).map((_, k) => {
              const f = (t * 0.5 + k / 16) % 1;
              const px = x + 40 + random(`sx${k}`) * (w - 80);
              return (
                <circle
                  key={`s${k}`}
                  cx={px + Math.sin(f * 6 + k) * 12}
                  cy={y + 80 + f * (h - 100)}
                  r={9}
                  fill={C.yellow}
                  opacity={senales * Math.sin(f * Math.PI)}
                />
              );
            })
          : null}
      </g>
      {zzz > 0 ? (
        <g opacity={zzz} fill={C.grey} fontFamily={mono} fontWeight={700}>
          {[0, 1, 2].map((k) => {
            const f = (t * 0.4 + k / 3) % 1;
            return (
              <text
                key={k}
                x={x + w - 160 + f * 60}
                y={y + h - 60 - f * 220}
                fontSize={40 + 20 * f}
                opacity={Math.sin(f * Math.PI)}
              >
                z
              </text>
            );
          })}
        </g>
      ) : null}
    </g>
  );
};

// Barra de tamaño con la línea objetivo
export const Medidor: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly h: number;
  readonly nivel: number;
  readonly freno: number;
}> = ({ x, y, h, nivel, freno }) => (
  <g>
    <rect
      x={x}
      y={y}
      width={90}
      height={h}
      rx={20}
      fill={C.card}
      stroke={C.cardBorder}
      strokeWidth={3}
    />
    <rect
      x={x + 8}
      y={y + h - 8 - (h - 16) * nivel}
      width={74}
      height={(h - 16) * nivel}
      rx={14}
      fill={HIGADO}
    />
    <line
      x1={x - 30}
      y1={y + 8 + (h - 16) * 0.0}
      x2={x + 120}
      y2={y + 8}
      stroke={C.yellow}
      strokeWidth={6}
      strokeDasharray="14 10"
    />
    <text
      x={x + 140}
      y={y + 18}
      fill={C.yellow}
      fontFamily={mono}
      fontSize={28}
      fontWeight={700}
    >
      lo que necesitas
    </text>
    <g opacity={freno} transform={`translate(${x + 230} ${y + 120})`}>
      <polygon
        points={hexa(60)
          .split(" ")
          .map((p) => p)
          .join(" ")}
        fill={C.red}
        transform="rotate(30)"
      />
      <text
        y={12}
        textAnchor="middle"
        fill={C.white}
        fontFamily={mono}
        fontSize={30}
        fontWeight={700}
      >
        STOP
      </text>
    </g>
  </g>
);

// Persona esquemática con un hígado en el torso
export const Persona: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly etiqueta: string;
  readonly color: string;
  readonly children: React.ReactNode;
}> = ({ x, y, etiqueta, color, children }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle
      cx={0}
      cy={-330}
      r={80}
      fill="#2A2350"
      stroke={color}
      strokeWidth={6}
    />
    <path
      d="M -170 -220 Q 0 -260 170 -220 L 190 260 Q 0 290 -190 260 Z"
      fill="#2A2350"
      stroke={color}
      strokeWidth={6}
    />
    {children}
    <text
      y={340}
      textAnchor="middle"
      fill={color}
      fontFamily={mono}
      fontSize={36}
      fontWeight={700}
    >
      {etiqueta}
    </text>
  </g>
);

// Águila esquemática
export const Aguila: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly t: number;
}> = ({ x, y, s = 1, t }) => {
  const a = Math.sin(t * 9) * 22;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform={`rotate(${-a})`}>
        <path
          d="M -20 0 Q -140 -90 -260 -40 Q -180 -20 -140 10 Q -80 20 -20 20 Z"
          fill="#5A3A22"
          stroke="#C8A070"
          strokeWidth={4}
        />
      </g>
      <g transform={`rotate(${a})`}>
        <path
          d="M 20 0 Q 140 -90 260 -40 Q 180 -20 140 10 Q 80 20 20 20 Z"
          fill="#5A3A22"
          stroke="#C8A070"
          strokeWidth={4}
        />
      </g>
      <ellipse cx={0} cy={20} rx={44} ry={70} fill="#6A4428" />
      <circle cx={0} cy={-50} r={34} fill="#F0E8D8" />
      <path d="M 10 -46 L 46 -36 L 14 -28 Z" fill={C.yellow} />
      <circle cx={8} cy={-56} r={6} fill={C.bg} />
      <path d="M -30 86 L 0 120 L 30 86 Z" fill="#5A3A22" />
    </g>
  );
};

// Iconos para el cierre
export const Copa: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly op: number;
}> = ({ x, y, op }) => (
  <g transform={`translate(${x} ${y})`} opacity={op}>
    <path
      d="M -50 -70 L 50 -70 Q 50 10 0 20 Q -50 10 -50 -70 Z"
      fill="none"
      stroke={C.white}
      strokeWidth={7}
    />
    <path
      d="M -44 -30 L 44 -30 Q 40 10 0 16 Q -40 10 -44 -30 Z"
      fill="#B8323A"
    />
    <line x1={0} y1={20} x2={0} y2={80} stroke={C.white} strokeWidth={7} />
    <line
      x1={-34}
      y1={82}
      x2={34}
      y2={82}
      stroke={C.white}
      strokeWidth={7}
      strokeLinecap="round"
    />
    <text
      y={140}
      textAnchor="middle"
      fill={C.white}
      fontFamily={mono}
      fontSize={30}
      fontWeight={700}
    >
      alcohol
    </text>
  </g>
);
export const Virus: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly op: number;
  readonly t: number;
}> = ({ x, y, op, t }) => (
  <g transform={`translate(${x} ${y}) rotate(${t * 20})`} opacity={op}>
    {new Array(10).fill(0).map((_, k) => (
      <g key={k} transform={`rotate(${k * 36})`}>
        <line
          x1={0}
          y1={-50}
          x2={0}
          y2={-78}
          stroke={C.orange}
          strokeWidth={6}
        />
        <circle cx={0} cy={-82} r={9} fill={C.orange} />
      </g>
    ))}
    <circle r={52} fill="#8A3A1E" stroke={C.orange} strokeWidth={6} />
  </g>
);
