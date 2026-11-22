import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/vortice/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  deja: 2.16,
  mira: 4.2,
  final: 5.54,
  al: 8.12,
  frena: 9.32,
  borde: 10.86,
  enrolla: 13.08,
  asi: 15.22,
  vortice: 16.2,
  dona: 17.44,
  humo: 19.44,
  alBajar: 20.9,
  inestable: 23.06,
  pequenas: 24.5,
  rompe: 27.5,
  gotitas: 28.32,
  y: 29.54,
  dividirse: 31.88,
  cascada: 33.2,
  porEso: 35.08,
  fin: 36.84,
};

const AGUA = "#1A3A6A";
const TINTA = "#B04AE8";

// Anillo de vórtice visto en perspectiva: radio R, ondulación (modos) de amplitud a
const Anillo: React.FC<{ readonly x: number; readonly y: number; readonly R: number; readonly a?: number; readonly modos?: number; readonly t: number; readonly grosor?: number; readonly op?: number }> = ({
  x,
  y,
  R,
  a = 0,
  modos = 5,
  t,
  grosor = 22,
  op = 1,
}) => {
  const d =
    new Array(73)
      .fill(0)
      .map((_, k) => {
        const th = (k / 72) * Math.PI * 2;
        const r = R * (1 + a * Math.sin(modos * th + t * 2));
        return `${k === 0 ? "M" : "L"} ${x + Math.cos(th) * r} ${y + Math.sin(th) * r * 0.32 + a * R * 0.6 * Math.sin(modos * th) ** 2}`;
      })
      .join(" ") + " Z";
  return (
    <g opacity={op}>
      <path d={d} fill="none" stroke={TINTA} strokeWidth={grosor} strokeLinejoin="round" opacity={0.85} />
      <path d={d} fill="none" stroke="#E8B0FF" strokeWidth={grosor * 0.3} opacity={0.6} />
    </g>
  );
};

// Vaso de agua
const Vaso: React.FC = () => (
  <g>
    <path d="M 200 480 L 880 480 L 840 1440 L 240 1440 Z" fill={AGUA} opacity={0.8} />
    <path d="M 200 480 L 880 480 L 840 1440 L 240 1440 Z" fill="none" stroke="#C8C4D8" strokeWidth={8} />
  </g>
);

// Imagen del gancho y del cierre: un anillo de tinta bajando en el vaso
const VasoAnillo: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Vaso />
    <Anillo x={540} y={900} R={150} t={t} />
    <path d="M 540 560 Q 500 700 470 880 M 540 560 Q 580 700 610 880" stroke={TINTA} strokeWidth={6} fill="none" opacity={0.4} />
    <Texto x={780} y={640} size={110} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué la tinta forma anillos?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.deja], [1.12, 1])}>
        <VasoAnillo t={t} q={interpolate(t, [0.6, 0.9], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={0.66} color={TINTA} />
    </>
  );
};

// B. Deja caer una gota en agua quieta y mira con atención + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cae = interpolate(t, [T.deja + 0.3, T.mira], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.deja, T.al], [1, 1.05])}>
      <rect x={120} y={760} width={840} height={440} fill={AGUA} opacity={0.8} />
      <rect x={490} y={420} width={100} height={120} rx={20} fill="#8A86A8" />
      <path d="M 510 540 L 570 540 L 545 600 L 535 600 Z" fill="#C8C4D8" />
      <path d={`M 540 ${600 + cae * 160} q 22 36 0 50 q -22 -14 0 -50 Z`} fill={TINTA} opacity={cae < 1 ? 1 : 0} />
      <ellipse cx={540} cy={760} rx={60 + 200 * aparece(t, T.mira)} ry={10 + 20 * aparece(t, T.mira)} fill="none" stroke={C.white} strokeWidth={4} opacity={0.6 * (1 - aparece(t, T.final))} />
      <Texto x={540} y={1000} size={36} color={C.white} op={aparece(t, T.mira)}>
        agua quieta
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1300} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1300}
          width={700 * interpolate(t, [T.final, T.al], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1400} color={C.white} size={40}>
          qué la hace dividirse: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Flecha
const Flecha: React.FC<{ readonly x1: number; readonly y1: number; readonly x2: number; readonly y2: number; readonly color: string; readonly op?: number; readonly w?: number }> = ({
  x1,
  y1,
  x2,
  y2,
  color,
  op = 1,
  w = 10,
}) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  return (
    <g opacity={op}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} />
      <path d={`M ${x2 + Math.cos(a) * 20} ${y2 + Math.sin(a) * 20} L ${x2 + Math.cos(a + 2.4) * 26} ${y2 + Math.sin(a + 2.4) * 26} L ${x2 + Math.cos(a - 2.4) * 26} ${y2 + Math.sin(a - 2.4) * 26} Z`} fill={color} />
    </g>
  );
};

// C. La gota frena; su borde va más lento que el centro y se enrolla sobre sí misma
export const Frena: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const enrolla = interpolate(t, [T.enrolla - 0.3, T.asi], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.al, T.asi], [1, 1.04])}>
      <rect x={60} y={440} width={960} height={1000} fill={AGUA} opacity={0.6} />
      {/* gota en corte, se aplana y sus bordes se curvan hacia arriba */}
      <path
        d={`M ${540 - 200} ${820 - enrolla * 60} Q ${540 - 240 + enrolla * 40} ${900 + enrolla * 20} 540 ${940} Q ${540 + 240 - enrolla * 40} ${900 + enrolla * 20} ${540 + 200} ${820 - enrolla * 60} Q 540 ${760} ${540 - 200} ${820 - enrolla * 60} Z`}
        fill={TINTA}
        opacity={0.85}
      />
      <Flecha x1={540} y1={980} x2={540} y2={1180} color={C.yellow} op={aparece(t, T.borde)} />
      <Flecha x1={360} y1={900} x2={360} y2={960} color={C.cyan} op={aparece(t, T.borde)} />
      <Flecha x1={720} y1={900} x2={720} y2={960} color={C.cyan} op={aparece(t, T.borde)} />
      <g opacity={enrolla}>
        <path d="M 300 800 A 70 70 0 1 1 340 900" stroke={C.cyan} strokeWidth={8} fill="none" />
        <path d="M 780 800 A 70 70 0 1 0 740 900" stroke={C.cyan} strokeWidth={8} fill="none" />
      </g>
      <Texto x={540} y={1260} size={36} color={C.yellow} op={aparece(t, T.borde)}>
        centro: rápido · borde: lento
      </Texto>
      <Texto x={540} y={600} size={38} color={C.cyan} op={aparece(t, T.enrolla)}>
        el borde se enrolla
      </Texto>
    </Lienzo>
  );
};

// D. Así nace un anillo de vórtice: una dona que gira mientras avanza, como los anillos de humo
export const Dona: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const humo = aparece(t, T.humo);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.alBajar], [1, 1.04])}>
      <Anillo x={540} y={820} R={260} t={t} grosor={50} />
      {[-1, 1].map((l) => (
        <g key={l} transform={`translate(${540 + l * 260} 820) rotate(${l * (t - T.asi) * 200})`} opacity={aparece(t, T.dona)}>
          <path d="M 0 -60 A 60 60 0 1 1 -42 -42" stroke={C.yellow} strokeWidth={8} fill="none" />
          <path d="M -42 -42 l 4 -26 l 20 18 Z" fill={C.yellow} />
        </g>
      ))}
      <Texto x={540} y={600} size={40} color={TINTA} op={aparece(t, T.vortice)}>
        anillo de vórtice
      </Texto>
      <Texto x={540} y={1100} size={36} color={C.yellow} op={aparece(t, T.dona)}>
        una dona que gira
      </Texto>
      <g opacity={humo}>
        <ellipse cx={540} cy={1260} rx={90} ry={26} fill="none" stroke="#C8C4D8" strokeWidth={14} />
        <Texto x={540} y={1350} size={32} color={C.grey}>
          como un anillo de humo
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. Al bajar, el anillo se hace más grande y más inestable
export const Crece: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = interpolate(t, [T.alBajar, T.pequenas], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.alBajar, T.pequenas], [1, 1.04])}>
      <Vaso />
      <Anillo x={540} y={interpolate(u, [0, 1], [640, 1080])} R={interpolate(u, [0, 1], [110, 230])} a={0.04 * aparece(t, T.inestable)} t={t * 2} />
      <Texto x={540} y={1530} size={38} color={C.white} op={aparece(t, T.inestable)}>
        más grande, más inestable
      </Texto>
    </Lienzo>
  );
};

// F. Las ondulaciones del borde crecen y el anillo se rompe en varias gotitas
export const Rompe: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ond = interpolate(t, [T.pequenas, T.rompe], [0.03, 0.22], suave);
  const rompe = interpolate(t, [T.rompe, T.gotitas + 0.4], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pequenas, T.y], [1, 1.04])}>
        <rect x={60} y={440} width={960} height={1000} fill={AGUA} opacity={0.6} />
        <Anillo x={540} y={760} R={260} a={ond} modos={5} t={t} op={1 - rompe} grosor={34} />
        {new Array(5).fill(0).map((_, k) => {
          const th = (k / 5) * Math.PI * 2 + Math.PI / 10;
          return (
            <ellipse
              key={k}
              cx={540 + Math.cos(th) * 260}
              cy={760 + Math.sin(th) * 260 * 0.32 + rompe * 200}
              rx={50}
              ry={36}
              fill={TINTA}
              opacity={rompe * 0.9}
            />
          );
        })}
        <Texto x={540} y={1180} size={38} color={C.white} op={aparece(t, T.pequenas + 0.4)}>
          las ondulaciones crecen
        </Texto>
        <Texto x={540} y={1260} size={40} color={TINTA} op={aparece(t, T.rompe)}>
          … y se rompe en gotitas
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.rompe} color={TINTA} />
    </>
  );
};

// G. Cada gotita forma su propio anillo, que vuelve a dividirse: cascada de vórtices
export const Cascada: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const n2 = aparece(t, T.dividirse);
  const nivel1 = [200, 370, 540, 710, 880];
  return (
    <Lienzo zoom={interpolate(t, [T.y, T.porEso], [1, 1.04])}>
      <rect x={60} y={440} width={960} height={1000} fill={AGUA} opacity={0.6} />
      {nivel1.map((x, k) => (
        <g key={k}>
          <Anillo x={x} y={640} R={60} t={t + k} grosor={14} op={aparece(t, T.y + k * 0.1)} />
          {[-1, 1].map((l) => (
            <g key={l}>
              <line x1={x} y1={660} x2={x + l * 40} y2={860} stroke={TINTA} strokeWidth={4} opacity={0.4 * n2} />
              <Anillo x={x + l * 40} y={880} R={26} t={t + k + l} grosor={8} op={n2} />
              {[-1, 1].map((m) => (
                <Anillo key={m} x={x + l * 40 + m * 18} y={1080} R={12} t={t} grosor={5} op={aparece(t, T.cascada)} />
              ))}
            </g>
          ))}
        </g>
      ))}
      <Texto x={540} y={1300} size={42} color={C.yellow} op={aparece(t, T.cascada)}>
        cascada de vórtices
      </Texto>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <VasoAnillo t={t} q={interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp)} />
    </Lienzo>
  );
};
