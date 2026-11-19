import { interpolate, random } from "remotion";
import { aparece, Lienzo, suave, Tarjeta, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/jetflorida/narracion.wav (voz x1,15), sacados con Whisper
export const T = {
  domingo: 3.12,
  murieron: 8.42,
  buscan: 10.48,
  altura: 12.44,
  menos47: 14.14,
  turbulencia: 16.12,
  hielo: 18.14,
  fenomeno: 20.08,
  sobreenfriada: 22.06,
  gotas: 23.62,
  corrientes: 26.78,
  chocan: 29.7,
  congelan: 31.02,
  transparente: 32.7,
  forma: 33.94,
  cola: 36.1,
  responde: 36.64,
  pidieron: 38.74,
  sobrevelocidad: 41.84,
  caian: 43.76,
  piezas: 46.0,
  encontraron: 48.7,
  causa: 52.36,
  cada: 54.1,
  fin: 56.9,
};

const HIELO = "#C8ECFF";

// Silueta de jet ejecutivo vista de lado (mirando a la derecha)
const Jet: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly rot?: number;
  readonly op?: number;
}> = ({ x, y, s, rot = 0, op = 1 }) => (
  <g opacity={op} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path
      d="M -120 0 Q -110 -16 -60 -16 L 90 -14 Q 130 -10 140 0 Q 130 10 90 12 L -60 14 Q -110 14 -120 0 Z"
      fill="#E8E6F0"
    />
    <path d="M -100 -12 L -130 -60 L -110 -60 L -70 -14 Z" fill="#C8C4D8" />
    <path d="M -130 -60 L -90 -60 L -96 -54 L -134 -54 Z" fill="#C8C4D8" />
    <path d="M -10 6 L -50 40 L -30 40 L 30 8 Z" fill="#C8C4D8" />
    <rect x={-80} y={-26} width={40} height={18} rx={9} fill="#C8C4D8" />
    {[0, 1, 2, 3].map((k) => (
      <circle key={k} cx={-20 + k * 22} cy={-4} r={4} fill="#2A2440" />
    ))}
  </g>
);

// Nube de tormenta
const Nube: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly op?: number;
  readonly color?: string;
}> = ({ x, y, s, op = 1, color = "#3A3A5A" }) => (
  <g opacity={op} transform={`translate(${x} ${y}) scale(${s})`}>
    {[
      [-120, 20, 80],
      [-40, -30, 110],
      [70, -10, 95],
      [150, 30, 70],
      [0, 40, 100],
    ].map(([cx, cy, r], k) => (
      <circle key={k} cx={cx} cy={cy} r={r} fill={color} />
    ))}
  </g>
);

// A. Gancho: casi 11 km en 77 segundos
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = interpolate(t, [0, T.domingo - 0.3], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [0, T.domingo], [1.05, 1])}>
      <Tarjeta x={140} y={560} w={800} h={360}>
        <Texto x={540} y={700} color={C.white} size={110}>
          {`${(10.7 * (1 - u)).toFixed(1)} km`}
        </Texto>
        <Texto x={540} y={840} color={C.yellow} size={80}>
          {`${Math.round(77 * u)} s`}
        </Texto>
      </Tarjeta>
      <line
        x1={200}
        y1={1020}
        x2={880}
        y2={1020}
        stroke={C.grey}
        strokeWidth={4}
      />
      <line
        x1={200}
        y1={1020}
        x2={200 + 680 * u}
        y2={1020}
        stroke={C.red}
        strokeWidth={10}
      />
    </Lienzo>
  );
};

// B. La noticia: de Texas a las Bahamas, cayó en Florida
export const Ruta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.domingo + 0.5, T.domingo + 3], [0, 1], suave);
  const pts = { tx: [180, 720], fl: [740, 860], bh: [900, 960] };
  const x = pts.tx[0] + (pts.fl[0] - pts.tx[0]) * p;
  const y =
    pts.tx[1] + (pts.fl[1] - pts.tx[1]) * p - Math.sin(p * Math.PI) * 120;
  return (
    <Lienzo zoom={interpolate(t, [T.domingo, T.altura], [1, 1.04])}>
      <path
        d={`M ${pts.tx[0]} ${pts.tx[1]} Q 460 ${560} ${pts.fl[0]} ${pts.fl[1]} L ${pts.bh[0]} ${pts.bh[1]}`}
        stroke={C.grey}
        strokeWidth={6}
        strokeDasharray="16 14"
        fill="none"
      />
      {(
        [
          ["Texas", pts.tx, C.white],
          ["Florida", pts.fl, C.red],
          ["Bahamas", pts.bh, C.grey],
        ] as const
      ).map(([nom, [px, py], col]) => (
        <g key={nom}>
          <circle cx={px} cy={py} r={18} fill={col} />
          <Texto x={px} y={py + 70} color={col} size={36}>
            {nom}
          </Texto>
        </g>
      ))}
      <Jet
        x={x}
        y={y - 40}
        s={0.6}
        op={aparece(t, T.domingo) * (1 - aparece(t, T.domingo + 3.3))}
      />
      <Texto
        x={540}
        y={1240}
        color={C.white}
        size={50}
        op={aparece(t, T.murieron)}
      >
        9 personas a bordo
      </Texto>
      <Texto
        x={540}
        y={1340}
        color={C.cyan}
        size={44}
        op={aparece(t, T.buscan)}
      >
        ¿qué buscan los investigadores?
      </Texto>
    </Lienzo>
  );
};

// C. A 35.000 pies: -47 °C, turbulencia y hielo en zona de tormentas
export const Altura: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sacude = aparece(t, T.turbulencia) * Math.sin(t * 9) * 14;
  return (
    <Lienzo zoom={interpolate(t, [T.altura, T.fenomeno], [1, 1.04])}>
      <Nube x={300} y={1080} s={1.4} op={aparece(t, T.turbulencia)} />
      <Nube x={820} y={1120} s={1.1} op={aparece(t, T.turbulencia)} />
      <Jet x={540} y={760 + sacude} s={1.5} rot={sacude * 0.2} />
      <Tarjeta x={140} y={420} w={380} h={130} op={aparece(t, T.altura)}>
        <Texto x={330} y={505} color={C.white} size={50}>
          35.000 ft
        </Texto>
      </Tarjeta>
      <Tarjeta x={560} y={420} w={380} h={130} op={aparece(t, T.menos47)}>
        <Texto x={750} y={505} color={C.cyan} size={56}>
          -47 °C
        </Texto>
      </Tarjeta>
      <g opacity={aparece(t, T.hielo)}>
        {[0, 1, 2].map((k) => (
          <g
            key={k}
            transform={`translate(${380 + k * 160} 940) rotate(${t * 30})`}
          >
            {[0, 60, 120].map((a) => (
              <line
                key={a}
                x1={-26}
                y1={0}
                x2={26}
                y2={0}
                stroke={HIELO}
                strokeWidth={6}
                transform={`rotate(${a})`}
              />
            ))}
          </g>
        ))}
      </g>
    </Lienzo>
  );
};

// D. Agua sobreenfriada: líquida bajo cero, subida por la tormenta, se congela al chocar
export const Sobreenfriada: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const choque = aparece(t, T.chocan);
  const capa = interpolate(
    t,
    [T.congelan, T.transparente + 0.5],
    [0, 1],
    suave,
  );
  return (
    <Lienzo zoom={interpolate(t, [T.fenomeno, T.forma], [1, 1.03])}>
      <Texto
        x={540}
        y={440}
        color={C.cyan}
        size={52}
        op={aparece(t, T.sobreenfriada)}
      >
        agua sobreenfriada
      </Texto>
      <g opacity={1 - choque}>
        <Nube
          x={540}
          y={900}
          s={2.2}
          color="#2E2E4E"
          op={aparece(t, T.fenomeno)}
        />
        {new Array(14).fill(0).map((_, k) => {
          const f = aparece(t, T.corrientes)
            ? (t * 0.4 + random(`d${k}`)) % 1
            : 0;
          return (
            <path
              key={k}
              d="M 0 -18 Q 14 0 14 8 A 14 14 0 0 1 -14 8 Q -14 0 0 -18 Z"
              fill={C.cyan}
              transform={`translate(${300 + random(`dx${k}`) * 480} ${1000 - random(`dy${k}`) * 160 - f * 220})`}
              opacity={aparece(t, T.gotas)}
            />
          );
        })}
        <Texto
          x={540}
          y={1200}
          color={C.white}
          size={40}
          op={aparece(t, T.gotas)}
        >
          gotas líquidas bajo cero
        </Texto>
        <g opacity={aparece(t, T.corrientes)}>
          {[360, 540, 720].map((x) => (
            <g key={x}>
              <line
                x1={x}
                y1={1420}
                x2={x}
                y2={1320 - ((t * 60) % 40)}
                stroke={C.yellow}
                strokeWidth={8}
              />
              <path
                d={`M ${x - 20} ${1340 - ((t * 60) % 40)} L ${x} ${1310 - ((t * 60) % 40)} L ${x + 20} ${1340 - ((t * 60) % 40)}`}
                stroke={C.yellow}
                strokeWidth={8}
                fill="none"
              />
            </g>
          ))}
        </g>
      </g>
      <g opacity={choque}>
        <path
          d="M 200 900 Q 260 760 520 760 L 900 820 L 900 900 Q 600 960 200 900 Z"
          fill="#8C88A8"
        />
        <path
          d={`M 200 900 Q 260 760 520 760`}
          stroke={HIELO}
          strokeWidth={8 + capa * 34}
          fill="none"
          opacity={0.85}
          strokeLinecap="round"
        />
        {new Array(8).fill(0).map((_, k) => {
          const f = (t * 1.3 + k / 8) % 1;
          return (
            <path
              key={k}
              d="M 0 -14 Q 10 0 10 6 A 10 10 0 0 1 -10 6 Q -10 0 0 -14 Z"
              fill={C.cyan}
              transform={`translate(${20 + f * 190} ${780 + k * 18}) rotate(-90)`}
              opacity={1 - f}
            />
          );
        })}
        <Texto
          x={540}
          y={1100}
          color={HIELO}
          size={44}
          op={aparece(t, T.congelan)}
        >
          se congelan al instante
        </Texto>
        <Texto
          x={540}
          y={1180}
          color={C.grey}
          size={36}
          op={aparece(t, T.transparente)}
        >
          hielo transparente
        </Texto>
      </g>
    </Lienzo>
  );
};

// Perfil de ala con flujo de aire; hielo 0..1 deforma el borde y el flujo
const Perfil: React.FC<{ readonly t: number; readonly hielo: number }> = ({
  t,
  hielo,
}) => (
  <g>
    {new Array(7).fill(0).map((_, k) => {
      const y0 = 640 + k * 90;
      const cerca = Math.abs(y0 - 860) < 120;
      const desorden = hielo * (cerca ? 1 : 0.3);
      const d = new Array(12)
        .fill(0)
        .map((_, j) => {
          const x = 60 + j * 90;
          const base =
            y0 +
            (cerca && x > 260 && x < 860
              ? (y0 < 860 ? -40 : 40) * Math.sin(((x - 260) / 600) * Math.PI)
              : 0);
          const ruido =
            desorden * Math.sin(j * 1.7 + t * 6 + k) * (x > 400 ? 28 : 0);
          return `${j === 0 ? "M" : "L"} ${x} ${base + ruido}`;
        })
        .join(" ");
      return (
        <path
          key={k}
          d={d}
          stroke={C.cyan}
          strokeWidth={4}
          fill="none"
          opacity={0.6}
        />
      );
    })}
    <path
      d="M 260 860 Q 300 790 480 790 L 860 850 Q 600 900 300 885 Q 255 880 260 860 Z"
      fill="#8C88A8"
    />
    <path
      d="M 262 858 Q 270 800 330 790 Q 300 820 300 860 Z"
      fill={HIELO}
      opacity={hielo}
      transform={`scale(1) translate(${-10 * hielo} ${-12 * hielo})`}
    />
  </g>
);

// E. El hielo cambia la forma de alas y cola
export const Forma: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const hielo = interpolate(t, [T.forma, T.forma + 1.2], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.forma, T.pidieron], [1, 1.03])}>
      <Texto x={540} y={470} color={C.white} size={46} op={aparece(t, T.forma)}>
        el hielo cambia la forma
      </Texto>
      <Perfil t={t} hielo={hielo} />
      <Texto
        x={540}
        y={1330}
        color={C.yellow}
        size={42}
        op={aparece(t, T.responde)}
      >
        y cómo responde el avión
      </Texto>
    </Lienzo>
  );
};

// F. Sobrevelocidad: 20.000 pies por minuto
export const Sobrevelocidad: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const x0 = 180;
  const y0 = 560;
  const w = 720;
  const h = 560;
  const prog = interpolate(t, [T.pidieron + 1, T.caian + 1], [0, 1], clamp);
  const curva = new Array(41)
    .fill(0)
    .map((_, k) => {
      const u = k / 40;
      const alt =
        u < 0.3 ? 0.92 + u * 0.2 : 0.98 - ((u - 0.3) / 0.7) ** 1.4 * 0.98;
      return `${k === 0 ? "M" : "L"} ${x0 + u * w} ${y0 + (1 - alt) * h}`;
    })
    .join(" ");
  return (
    <Lienzo zoom={interpolate(t, [T.pidieron, T.encontraron], [1, 1.03])}>
      <Tarjeta x={120} y={470} w={840} h={720} op={aparece(t, T.pidieron)}>
        <line
          x1={x0}
          y1={y0 + h}
          x2={x0 + w}
          y2={y0 + h}
          stroke={C.grey}
          strokeWidth={4}
        />
        <line
          x1={x0}
          y1={y0 + h}
          x2={x0}
          y2={y0 - 10}
          stroke={C.grey}
          strokeWidth={4}
        />
        <Texto x={x0 + 10} y={y0 + 20} color={C.grey} size={26} anchor="start">
          altitud
        </Texto>
        <defs>
          <clipPath id="corteJ">
            <rect x={x0} y={0} width={w * prog} height={1920} />
          </clipPath>
        </defs>
        <g clipPath="url(#corteJ)">
          <path d={curva} stroke={C.red} strokeWidth={10} fill="none" />
        </g>
        <Texto
          x={x0 + w * 0.3}
          y={y0 - 20}
          color={C.white}
          size={28}
          op={aparece(t, T.pidieron + 0.3)}
        >
          piden subir
        </Texto>
      </Tarjeta>
      <Tarjeta x={190} y={1230} w={700} h={150} op={aparece(t, T.caian)}>
        <Texto x={540} y={1330} color={C.red} size={54}>
          {`${Math.round(interpolate(t, [T.caian, T.caian + 1.2], [0, 20000], clamp)).toLocaleString("es")} ft/min`}
        </Texto>
      </Tarjeta>
      <Texto
        x={540}
        y={1460}
        color={C.orange}
        size={40}
        op={aparece(t, T.piezas)}
      >
        el aire puede arrancar piezas
      </Texto>
    </Lienzo>
  );
};

// G. La investigación: piezas de la cola lejos del impacto, sin causa oficial
export const Investigacion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.encontraron, T.cada], [1, 1.03])}>
      <rect
        x={120}
        y={500}
        width={840}
        height={660}
        rx={24}
        fill="#141230"
        stroke={C.cardBorder}
        strokeWidth={2}
      />
      {new Array(6).fill(0).map((_, k) => (
        <line
          key={k}
          x1={120}
          y1={600 + k * 100}
          x2={960}
          y2={600 + k * 100}
          stroke="#22204A"
          strokeWidth={3}
        />
      ))}
      <circle
        cx={760}
        cy={1000}
        r={26}
        fill={C.red}
        opacity={aparece(t, T.encontraron)}
      />
      <Texto
        x={760}
        y={1070}
        color={C.red}
        size={30}
        op={aparece(t, T.encontraron)}
      >
        impacto
      </Texto>
      {[
        [320, 640],
        [400, 720],
        [470, 600],
      ].map(([x, y], k) => (
        <g key={k} opacity={aparece(t, T.encontraron + 0.6 + k * 0.3)}>
          <rect
            x={x - 14}
            y={y - 14}
            width={28}
            height={28}
            fill={C.yellow}
            transform={`rotate(45 ${x} ${y})`}
          />
        </g>
      ))}
      <Texto
        x={400}
        y={820}
        color={C.yellow}
        size={32}
        op={aparece(t, T.encontraron + 1)}
      >
        piezas de la cola
      </Texto>
      <line
        x1={470}
        y1={640}
        x2={740}
        y2={980}
        stroke={C.yellow}
        strokeWidth={3}
        strokeDasharray="10 10"
        opacity={aparece(t, T.encontraron + 1)}
      />
      <Texto
        x={540}
        y={1300}
        color={C.white}
        size={48}
        op={aparece(t, T.causa)}
      >
        aún sin causa oficial
      </Texto>
    </Lienzo>
  );
};

// H. Cierre: cada accidente entendido hace más seguro el próximo vuelo
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const vuelo = interpolate(t, [T.cada, T.fin + 0.5], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.cada, T.fin + 0.5], [1, 1.04])}>
      <path
        d="M 120 1000 Q 540 760 960 820"
        stroke={C.cyan}
        strokeWidth={4}
        strokeDasharray="14 12"
        fill="none"
        opacity={0.6}
      />
      <Jet x={200 + vuelo * 600} y={960 - vuelo * 160} s={1.2} rot={-10} />
      <Texto
        x={540}
        y={1240}
        color={C.yellow}
        size={48}
        op={aparece(t, T.cada + 0.5)}
      >
        vuelos más seguros
      </Texto>
    </Lienzo>
  );
};
