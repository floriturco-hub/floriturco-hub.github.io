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

// Instantes clave (s) de public/audio/antitranspirante/narracion.wav (voz x1,10), sacados con Whisper
export const T = {
  huele: 2.16,
  bacterias: 6.28,
  apestosos: 10.36,
  desodorante: 11.44,
  perfume: 15.32,
  sudes: 16.02,
  anti: 17.82,
  aluminio: 20.0,
  gel: 23.84,
  tapon: 28.26,
  salir: 30.02,
  permanente: 31.72,
  renueva: 34.12,
  noche: 37.24,
  menos: 39.64,
  final: 44.54,
  llave: 46.72,
  fin: 48.5,
};

const PIEL = "#C89078";
const VERDE = "#7AC85A";

// Corte de piel con glándula sudorípara y su conducto
// sudor: 0..1 flujo; tapon: 0..1 gel formado; aluminio: partículas entrando
const Piel: React.FC<{
  readonly t: number;
  readonly sudor: number;
  readonly tapon?: number;
  readonly aluminio?: number;
  readonly bloqueo?: number;
}> = ({ t, sudor, tapon = 0, aluminio = 0, bloqueo = 0 }) => (
  <g>
    <rect
      x={60}
      y={620}
      width={960}
      height={720}
      rx={30}
      fill="#5A2E3A"
      opacity={0.6}
    />
    <rect x={60} y={620} width={960} height={70} rx={20} fill={PIEL} />
    <path
      d="M 540 690 L 540 1080 C 540 1140 480 1150 470 1200 C 460 1260 560 1280 600 1240 C 640 1200 580 1150 520 1180 C 470 1210 500 1290 560 1290 C 640 1290 640 1200 600 1180"
      stroke="#E8C8B8"
      strokeWidth={34}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M 540 690 L 540 1080 C 540 1140 480 1150 470 1200 C 460 1260 560 1280 600 1240 C 640 1200 580 1150 520 1180 C 470 1210 500 1290 560 1290 C 640 1290 640 1200 600 1180"
      stroke="#3A1E2A"
      strokeWidth={18}
      fill="none"
      strokeLinecap="round"
    />
    {new Array(6).fill(0).map((_, k) => {
      const f = (t * 0.5 + k / 6) % 1;
      const tope = bloqueo > 0.5 ? 0.62 + (k % 3) * 0.06 : 1.25;
      const ff = Math.min(f * 1.25, tope);
      const y = 1080 - ff * 520;
      const fuera = y < 690;
      return (
        <circle
          key={k}
          cx={fuera ? 540 + (k % 2 ? 1 : -1) * (690 - y) * 0.6 : 540}
          cy={y}
          r={fuera ? 14 : 8}
          fill={C.cyan}
          opacity={sudor * (fuera ? Math.max(0, 1 - (690 - y) / 120) : 1)}
        />
      );
    })}
    {new Array(10).fill(0).map((_, k) => {
      const f = Math.min(1, aluminio * 1.4 - k * 0.04);
      return (
        <circle
          key={k}
          cx={540 + (random(`al${k}`) - 0.5) * (300 * (1 - f) + 10)}
          cy={460 + f * 300 + (random(`ay${k}`) - 0.5) * 40}
          r={14}
          fill="#E8E6F0"
          opacity={aluminio > 0 && f > 0 ? 1 - tapon : 0}
        />
      );
    })}
    <rect
      x={526}
      y={700}
      width={28}
      height={110}
      rx={10}
      fill="#F0F0FF"
      opacity={tapon * 0.95}
    />
    <rect
      x={516}
      y={690}
      width={48}
      height={130}
      rx={18}
      fill="#FFFFFF"
      opacity={tapon * 0.25}
    />
  </g>
);

// Bacteria
const Bacteria: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly t: number;
  readonly op?: number;
}> = ({ x, y, t, op = 1 }) => (
  <g
    opacity={op}
    transform={`translate(${x} ${y}) rotate(${Math.sin(t * 3 + x) * 15})`}
  >
    <ellipse rx={50} ry={26} fill={VERDE} opacity={0.85} />
    <path
      d={`M 50 0 q 20 ${10 * Math.sin(t * 8)} 40 0`}
      stroke={VERDE}
      strokeWidth={6}
      fill="none"
    />
    <circle cx={-18} cy={-4} r={6} fill="#1A3A10" />
    <circle cx={6} cy={-4} r={6} fill="#1A3A10" />
  </g>
);

// A. Gancho: tapones en el sudor
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tapon = interpolate(t, [0.8, 1.0], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.huele], [1.3, 1.15])} cy={760}>
        <Piel t={t} sudor={1} tapon={tapon} bloqueo={tapon} />
        <Texto x={540} y={540} color={C.yellow} size={90} op={aparece(t, 1.0)}>
          ¡TAPÓN!
        </Texto>
      </Lienzo>
      <Flash t={t} d={1.0} />
    </>
  );
};

// B. El sudor no huele: las bacterias sí
export const Olor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const apesta = aparece(t, T.apestosos);
  return (
    <Lienzo zoom={interpolate(t, [T.huele, T.desodorante], [1, 1.04])}>
      <path
        d="M 540 520 Q 620 640 620 700 A 80 80 0 0 1 460 700 Q 460 640 540 520 Z"
        fill={C.cyan}
        opacity={0.85}
      />
      <Texto x={540} y={870} color={C.grey} size={40} op={aparece(t, T.huele)}>
        sudor: casi sin olor
      </Texto>
      {[0, 1, 2].map((k) => (
        <Bacteria
          key={k}
          x={300 + k * 240}
          y={1060 + (k % 2) * 60}
          t={t}
          op={aparece(t, T.bacterias + k * 0.2)}
        />
      ))}
      {[0, 1, 2].map((k) => (
        <path
          key={k}
          d={`M ${380 + k * 160} 1300 q 30 -40 0 -80 q -30 -40 0 -80`}
          stroke={VERDE}
          strokeWidth={10}
          fill="none"
          opacity={apesta * (0.5 + 0.5 * Math.sin(t * 4 + k))}
          transform={`translate(0 ${-((t * 30) % 30)})`}
        />
      ))}
      <Texto x={540} y={1420} color={VERDE} size={44} op={apesta}>
        el olor lo hacen las bacterias
      </Texto>
    </Lienzo>
  );
};

// Bote de spray
const Spray: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly color: string;
}> = ({ x, y, color }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-60} y={-120} width={120} height={260} rx={30} fill={color} />
    <rect x={-30} y={-170} width={60} height={50} rx={10} fill="#C8C4D8" />
    <rect x={-10} y={-190} width={40} height={20} rx={6} fill="#8C88A8" />
  </g>
);

// C. Desodorante: mata bacterias y perfuma, pero sigues sudando
export const Desodorante: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.desodorante, T.anti], [1, 1.04])}>
      <Spray x={250} y={700} color={C.purpleLight} />
      <Texto
        x={250}
        y={900}
        color={C.purpleLight}
        size={36}
        op={aparece(t, T.desodorante)}
      >
        desodorante
      </Texto>
      {[0, 1].map((k) => (
        <g key={k}>
          <Bacteria
            x={600 + k * 220}
            y={620}
            t={t}
            op={aparece(t, T.desodorante + 0.3)}
          />
          <g opacity={aparece(t, T.desodorante + 1.2)}>
            <line
              x1={550 + k * 220}
              y1={580}
              x2={650 + k * 220}
              y2={660}
              stroke={C.red}
              strokeWidth={10}
            />
            <line
              x1={650 + k * 220}
              y1={580}
              x2={550 + k * 220}
              y2={660}
              stroke={C.red}
              strokeWidth={10}
            />
          </g>
        </g>
      ))}
      {new Array(8).fill(0).map((_, k) => (
        <circle
          key={k}
          cx={600 + random(`pf${k}`) * 300}
          cy={760 + random(`pg${k}`) * 120 - ((t * 40 + k * 20) % 60)}
          r={8}
          fill={C.yellow}
          opacity={aparece(t, T.perfume) * 0.8}
        />
      ))}
      <g opacity={aparece(t, T.sudes)}>
        {new Array(5).fill(0).map((_, k) => {
          const f = (t * 0.6 + k / 5) % 1;
          return (
            <path
              key={k}
              d="M 0 -40 Q 30 0 30 20 A 30 30 0 0 1 -30 20 Q -30 0 0 -40 Z"
              fill={C.cyan}
              transform={`translate(${340 + k * 100} ${1050 + f * 250})`}
              opacity={1 - f}
            />
          );
        })}
        <Texto x={540} y={1400} color={C.cyan} size={44}>
          pero sigues sudando
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Antitranspirante: sales de aluminio forman un gel que tapa el conducto
export const Tapon: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const al = interpolate(t, [T.aluminio, T.gel + 0.5], [0, 1], suave);
  const tapon = interpolate(t, [T.gel, T.tapon + 0.4], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.anti, T.permanente], [1, 1.04])}>
      <Texto x={540} y={440} color={C.white} size={44} op={aparece(t, T.anti)}>
        antitranspirante
      </Texto>
      <Piel
        t={t}
        sudor={1}
        aluminio={al}
        tapon={tapon}
        bloqueo={aparece(t, T.salir - 0.5)}
      />
      <Texto
        x={300}
        y={560}
        color="#E8E6F0"
        size={34}
        op={aparece(t, T.aluminio) * (1 - tapon)}
      >
        sales de aluminio
      </Texto>
      <g opacity={tapon}>
        <line
          x1={570}
          y1={750}
          x2={720}
          y2={560}
          stroke={C.white}
          strokeWidth={3}
        />
        <Texto x={780} y={545} color={C.white} size={36}>
          tapón de gel
        </Texto>
      </g>
      <Texto
        x={540}
        y={1430}
        color={C.yellow}
        size={44}
        op={aparece(t, T.salir)}
      >
        el sudor no sale
      </Texto>
    </Lienzo>
  );
};

// E. No es permanente: la piel se renueva
export const Temporal: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const dias = interpolate(t, [T.renueva, T.noche - 0.3], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.permanente, T.noche], [1, 1.04])}>
      <Piel t={t} sudor={1} tapon={1 - dias} bloqueo={dias < 0.8 ? 1 : 0} />
      <Tarjeta x={340} y={420} w={400} h={140} op={aparece(t, T.renueva)}>
        <Texto x={540} y={510} color={C.yellow} size={54}>
          {`día ${Math.round(1 + dias * 2)}`}
        </Texto>
      </Tarjeta>
      <Texto
        x={540}
        y={1430}
        color={C.white}
        size={44}
        op={aparece(t, T.renueva)}
      >
        la piel se renueva
      </Texto>
    </Lienzo>
  );
};

// F. De noche funciona mejor
export const Noche: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tapon = interpolate(t, [T.menos, T.final], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.noche, T.final], [1, 1.04])}>
      <rect
        x={0}
        y={0}
        width={1080}
        height={1920}
        fill="#05040F"
        opacity={0.4}
      />
      <path
        d="M 820 400 A 90 90 0 1 0 900 530 A 70 70 0 1 1 820 400 Z"
        fill={C.yellow}
        opacity={aparece(t, T.noche)}
      />
      <Piel t={t * 0.4} sudor={0.4} tapon={tapon} />
      <Texto x={540} y={1430} color={C.cyan} size={42} op={aparece(t, T.menos)}>
        menos sudor: el gel se forma
      </Texto>
    </Lienzo>
  );
};

// G. Cierre: disimula el olor vs cierra la llave
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.final, T.fin + 0.5], [1, 1.05])}>
      <Tarjeta x={100} y={600} w={420} h={520} op={aparece(t, T.final)}>
        <Spray x={310} y={800} color={C.purpleLight} />
        <Texto x={310} y={1020} color={C.purpleLight} size={36}>
          desodorante
        </Texto>
        <Texto x={310} y={1070} color={C.grey} size={30}>
          disimula el olor
        </Texto>
      </Tarjeta>
      <Tarjeta x={560} y={600} w={420} h={520} op={aparece(t, T.llave)}>
        <g transform="translate(770 800)">
          <rect
            x={-90}
            y={-30}
            width={180}
            height={50}
            rx={14}
            fill="#C8C4D8"
          />
          <rect x={40} y={20} width={40} height={70} rx={10} fill="#C8C4D8" />
          <rect x={-14} y={-90} width={28} height={60} fill="#C8C4D8" />
          <rect x={-60} y={-110} width={120} height={26} rx={10} fill={C.red} />
        </g>
        <Texto x={770} y={1020} color={C.yellow} size={36}>
          antitranspirante
        </Texto>
        <Texto x={770} y={1070} color={C.grey} size={30}>
          cierra la llave
        </Texto>
      </Tarjeta>
    </Lienzo>
  );
};
