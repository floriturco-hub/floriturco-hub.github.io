import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/encendedor/narracion.wav (voz x1,12), sacados con Whisper
export const T = {
  pila: 1.76,
  pones: 4.28,
  cristal: 6.22,
  aprietas: 9.34,
  separan: 12.66,
  voltaje: 17.08,
  despacio: 18.6,
  duro: 20.5,
  suelta: 26.02,
  martillo: 26.62,
  clic: 29.06,
  rapido: 31.0,
  miles: 33.34,
  chispa: 37.9,
  valvula: 40.4,
  enciende: 45.7,
  sin: 47.08,
  fin: 50.5,
};

const METAL = "#8C88A8";

// Rayo / chispa entre dos puntos
const Chispa: React.FC<{
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
  readonly t: number;
  readonly op: number;
  readonly ancho?: number;
}> = ({ x1, y1, x2, y2, t, op, ancho = 8 }) => {
  const n = 7;
  const pts = new Array(n + 1)
    .fill(0)
    .map((_, k) => {
      const u = k / n;
      const off =
        k === 0 || k === n
          ? 0
          : (random(`ch${k}${Math.floor(t * 20)}`) - 0.5) * 50;
      return `${x1 + (x2 - x1) * u + off} ${y1 + (y2 - y1) * u + off * 0.5}`;
    })
    .join(" L ");
  return (
    <g opacity={op}>
      <path
        d={`M ${pts}`}
        stroke="#FFFFFF"
        strokeWidth={ancho}
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d={`M ${pts}`}
        stroke={C.cyan}
        strokeWidth={ancho * 3}
        fill="none"
        opacity={0.35}
        strokeLinejoin="round"
      />
    </g>
  );
};

// Red cristalina; presion 0..1 separa cargas
const Cristal: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly presion: number;
  readonly cargas: number;
}> = ({ x, y, presion, cargas }) => {
  const alto = 340 * (1 - 0.12 * presion);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        x={-220}
        y={-alto / 2}
        width={440}
        height={alto}
        rx={20}
        fill="#2A3A5A"
        stroke={C.cyan}
        strokeWidth={6}
      />
      {new Array(20).fill(0).map((_, k) => {
        const col = k % 5;
        const fila = Math.floor(k / 5);
        const pos = (col + fila) % 2 === 0;
        const cx = -160 + col * 80;
        const cy = -alto / 2 + 50 + fila * ((alto - 100) / 3);
        const d = presion * 16 * (pos ? -1 : 1);
        return (
          <g key={k}>
            <circle
              cx={cx}
              cy={cy + d}
              r={18}
              fill={pos ? C.red : C.cyan}
              opacity={0.9}
            />
            <text
              x={cx}
              y={cy + d + 8}
              textAnchor="middle"
              fontSize={24}
              fontWeight={700}
              fill="#0B091D"
            >
              {pos ? "+" : "-"}
            </text>
          </g>
        );
      })}
      <g opacity={cargas}>
        <rect
          x={-220}
          y={-alto / 2 - 40}
          width={440}
          height={26}
          rx={8}
          fill={C.red}
        />
        <rect
          x={-220}
          y={alto / 2 + 14}
          width={440}
          height={26}
          rx={8}
          fill={C.cyan}
        />
        <text
          x={250}
          y={-alto / 2 - 18}
          fontSize={50}
          fontWeight={700}
          fill={C.red}
        >
          +
        </text>
        <text
          x={250}
          y={alto / 2 + 44}
          fontSize={50}
          fontWeight={700}
          fill={C.cyan}
        >
          -
        </text>
      </g>
      {presion > 0 ? (
        <g opacity={presion}>
          <path
            d={`M 0 ${-alto / 2 - 160} L 0 ${-alto / 2 - 60}`}
            stroke={C.white}
            strokeWidth={14}
          />
          <path
            d={`M -30 ${-alto / 2 - 90} L 0 ${-alto / 2 - 50} L 30 ${-alto / 2 - 90}`}
            stroke={C.white}
            strokeWidth={14}
            fill="none"
          />
          <path
            d={`M 0 ${alto / 2 + 160} L 0 ${alto / 2 + 60}`}
            stroke={C.white}
            strokeWidth={14}
          />
          <path
            d={`M -30 ${alto / 2 + 90} L 0 ${alto / 2 + 50} L 30 ${alto / 2 + 90}`}
            stroke={C.white}
            strokeWidth={14}
            fill="none"
          />
        </g>
      ) : null}
    </g>
  );
};

// A. Gancho: tu pulgar fabrica un rayo
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const baja = interpolate(t, [0.2, 0.9], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.pila], [1.08, 1])}>
        <rect
          x={380}
          y={760}
          width={320}
          height={560}
          rx={60}
          fill="#3A3A5A"
          stroke={METAL}
          strokeWidth={8}
        />
        <rect
          x={470}
          y={700 + baja * 40}
          width={140}
          height={80}
          rx={20}
          fill={C.orange}
        />
        <ellipse
          cx={540}
          cy={600 + baja * 40}
          rx={120}
          ry={90}
          fill={C.grey}
          opacity={0.6}
        />
        <Chispa
          x1={470}
          y1={560}
          x2={610}
          y2={420}
          t={t}
          op={aparece(t, 1.0)}
          ancho={10}
        />
      </Lienzo>
      <Flash t={t} d={1.0} color={C.cyan} />
    </>
  );
};

// B. No tiene pila: la electricidad la pones tú
export const SinPila: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.pila, T.cristal], [1, 1.04])}>
      <g opacity={aparece(t, T.pila)} transform="translate(540 760)">
        <rect
          x={-90}
          y={-180}
          width={180}
          height={360}
          rx={20}
          fill="#3A3A5A"
          stroke={METAL}
          strokeWidth={8}
        />
        <rect x={-40} y={-210} width={80} height={30} rx={8} fill={METAL} />
        <line
          x1={-200}
          y1={-220}
          x2={200}
          y2={220}
          stroke={C.red}
          strokeWidth={24}
          strokeLinecap="round"
        />
      </g>
      <Texto
        x={540}
        y={1150}
        color={C.yellow}
        size={48}
        op={aparece(t, T.pones)}
      >
        la electricidad la pones tú
      </Texto>
    </Lienzo>
  );
};

// C. Cristal piezoeléctrico: al apretarlo, las cargas se separan
export const Piezo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const presion = interpolate(t, [T.aprietas, T.aprietas + 0.5], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.cristal, T.despacio], [1, 1.03])}>
      <Texto
        x={540}
        y={440}
        color={C.cyan}
        size={46}
        op={aparece(t, T.cristal)}
      >
        cristal piezoeléctrico
      </Texto>
      <Cristal
        x={540}
        y={900}
        presion={presion}
        cargas={aparece(t, T.separan)}
      />
      <Tarjeta x={290} y={1280} w={500} h={150} op={aparece(t, T.voltaje)}>
        <Texto x={540} y={1380} color={C.yellow} size={60}>
          ¡voltaje!
        </Texto>
      </Tarjeta>
    </Lienzo>
  );
};

// D. Botón duro: resorte que suelta un martillo
export const Resorte: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const comp = interpolate(t, [T.duro, T.suelta], [0, 1], clamp);
  const golpe =
    t > T.suelta
      ? interpolate(t, [T.suelta, T.suelta + 0.12], [0, 1], clamp)
      : 0;
  const botonY = 480 + comp * 120;
  const martilloY = interpolate(golpe, [0, 1], [830, 1010]);
  const resorteFin = martilloY;
  const vueltas = 8;
  const resorte = new Array(vueltas * 2 + 1)
    .fill(0)
    .map(
      (_, k) =>
        `${k % 2 ? 470 : 610} ${botonY + 80 + ((resorteFin - botonY - 80) * k) / (vueltas * 2)}`,
    )
    .join(" L ");
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.despacio, T.rapido], [1, 1.03])}>
        <rect
          x={430}
          y={botonY}
          width={220}
          height={80}
          rx={20}
          fill={C.orange}
        />
        <path
          d={`M ${resorte}`}
          stroke={METAL}
          strokeWidth={10}
          fill="none"
          opacity={1}
        />
        <rect
          x={470}
          y={martilloY}
          width={140}
          height={70}
          rx={14}
          fill="#C8C4D8"
        />
        <rect
          x={400}
          y={1080}
          width={280}
          height={160}
          rx={16}
          fill="#2A3A5A"
          stroke={C.cyan}
          strokeWidth={6}
        />
        <Texto x={540} y={1180} color={C.cyan} size={34}>
          cristal
        </Texto>
        <Texto
          x={820}
          y={botonY + 55}
          color={C.white}
          size={36}
          op={aparece(t, T.duro)}
        >
          resorte
        </Texto>
        <Texto
          x={820}
          y={martilloY + 50}
          color={C.white}
          size={36}
          op={aparece(t, T.martillo)}
        >
          martillo
        </Texto>
        <Texto
          x={540}
          y={1400}
          color={C.yellow}
          size={80}
          op={aparece(t, T.clic)}
        >
          ¡clic!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.suelta} />
    </>
  );
};

// E. Miles de voltios: la chispa salta
export const Voltios: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const v = interpolate(t, [T.miles, T.miles + 0.8], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.rapido, T.valvula], [1, 1.03])}>
      <rect
        x={160}
        y={700}
        width={240}
        height={160}
        rx={16}
        fill="#2A3A5A"
        stroke={C.cyan}
        strokeWidth={6}
      />
      <path
        d="M 400 740 L 700 740 L 700 620"
        stroke={C.red}
        strokeWidth={8}
        fill="none"
      />
      <path
        d="M 400 820 L 760 820 L 760 940"
        stroke={C.cyan}
        strokeWidth={8}
        fill="none"
      />
      <circle cx={700} cy={610} r={14} fill={C.grey} />
      <circle cx={760} cy={950} r={14} fill={C.grey} />
      <Chispa
        x1={700}
        y1={620}
        x2={760}
        y2={940}
        t={t}
        op={aparece(t, T.chispa) * (Math.sin(t * 25) > -0.3 ? 1 : 0.2)}
      />
      <Tarjeta x={240} y={1100} w={600} h={160} op={aparece(t, T.miles)}>
        <Texto x={540} y={1205} color={C.yellow} size={60}>
          {`${Math.round(v * 10000).toLocaleString("es")} V`}
        </Texto>
      </Tarjeta>
      <Texto
        x={540}
        y={1360}
        color={C.grey}
        size={36}
        op={aparece(t, T.miles + 1)}
      >
        mucho voltaje, poca energía
      </Texto>
    </Lienzo>
  );
};

// F. Gas + chispa = llama
export const Llama: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fuego = aparece(t, T.enciende);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.valvula, T.sin], [1, 1.04])}>
        <rect
          x={380}
          y={900}
          width={320}
          height={480}
          rx={50}
          fill="#3A3A5A"
          stroke={METAL}
          strokeWidth={8}
        />
        <rect x={510} y={830} width={60} height={80} rx={10} fill={METAL} />
        {new Array(6).fill(0).map((_, k) => {
          const f = (t * 1.5 + k / 6) % 1;
          return (
            <circle
              key={k}
              cx={540 + Math.sin(k * 2 + t * 3) * 20 * f}
              cy={820 - f * 140}
              r={10 + f * 14}
              fill="#C8C4D8"
              opacity={aparece(t, T.valvula) * (1 - f) * 0.5 * (1 - fuego)}
            />
          );
        })}
        <Chispa
          x1={600}
          y1={760}
          x2={640}
          y2={820}
          t={t}
          op={aparece(t, T.chispa) * (1 - fuego)}
        />
        <g
          opacity={fuego}
          transform={`translate(540 820) scale(${1 + 0.05 * Math.sin(t * 12)})`}
        >
          <path
            d="M 0 0 C -90 -60 -60 -200 0 -320 C 60 -200 90 -60 0 0 Z"
            fill={C.orange}
          />
          <path
            d="M 0 0 C -50 -40 -30 -140 0 -210 C 30 -140 50 -40 0 0 Z"
            fill={C.yellow}
          />
        </g>
        <Texto
          x={540}
          y={1480}
          color={C.white}
          size={40}
          op={aparece(t, T.valvula)}
        >
          el botón abre el gas
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.enciende} color={C.orange} />
    </>
  );
};

// G. Cierre: golpe + cristal + pulgar
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const items = ["golpe", "cristal", "pulgar"];
  return (
    <Lienzo zoom={interpolate(t, [T.sin, T.fin + 0.5], [1, 1.05])}>
      {items.map((txt, k) => (
        <Texto
          key={txt}
          x={540}
          y={720 + k * 130}
          color={[C.white, C.cyan, C.orange][k]}
          size={64}
          op={aparece(t, T.sin + 0.8 + k * 0.5)}
        >
          {txt}
        </Texto>
      ))}
      <g
        transform={`translate(540 1300) scale(${0.7 + 0.04 * Math.sin(t * 12)})`}
        opacity={aparece(t, T.sin + 2.2)}
      >
        <path
          d="M 0 0 C -90 -60 -60 -200 0 -320 C 60 -200 90 -60 0 0 Z"
          fill={C.orange}
        />
        <path
          d="M 0 0 C -50 -40 -30 -140 0 -210 C 30 -140 50 -40 0 0 Z"
          fill={C.yellow}
        />
      </g>
    </Lienzo>
  );
};
