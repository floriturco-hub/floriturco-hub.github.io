import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, mono, useT } from "../theme";

// Instantes clave (s) de public/audio/llanta/narracion.wav (voz x1,10), sacados con Whisper
export const T = {
  psi: 1.76,
  empuja: 7.22,
  pulgada: 9.42,
  sostiene: 12.18,
  mide: 14.66,
  lapiz: 15.62,
  piston: 18.5,
  varilla: 21.56,
  digital: 25.98,
  membrana: 28.28,
  resistencias: 31.0,
  dobla: 33.0,
  chip: 37.56,
  fria: 40.66,
  calienta: 42.48,
  sube: 44.9,
  libras: 46.2,
  fin: 49.0,
};

const METAL = "#8C88A8";

// Auto de perfil sobre dos llantas con aire
const Auto: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly t: number;
  readonly aire: number;
}> = ({ x, y, s, t, aire }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -380 0 L -300 -110 Q -260 -160 -180 -160 L 160 -160 Q 240 -160 290 -110 L 380 -30 L 400 40 L -400 40 Z"
      fill="#3A3A5A"
      stroke={METAL}
      strokeWidth={8}
    />
    <path
      d="M -250 -40 L -180 -130 L 0 -130 L 0 -40 Z"
      fill="#6A8AB8"
      opacity={0.6}
    />
    {[-230, 230].map((cx) => (
      <g key={cx}>
        <circle
          cx={cx}
          cy={60}
          r={95}
          fill="#1A1A2A"
          stroke={METAL}
          strokeWidth={8}
        />
        <circle cx={cx} cy={60} r={45} fill="#3A3A4A" />
        {new Array(8).fill(0).map((_, k) => {
          const a = k * 0.785 + t;
          return (
            <circle
              key={k}
              cx={cx + Math.cos(a) * 70}
              cy={60 + Math.sin(a) * 70}
              r={8}
              fill={C.cyan}
              opacity={aire}
            />
          );
        })}
      </g>
    ))}
  </g>
);

// A. Gancho: tu auto se apoya en aire
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.psi], [1.08, 1])}>
        <Auto x={540} y={880} s={1.15} t={t} aire={aparece(t, 0.6)} />
        <line
          x1={60}
          y1={1010}
          x2={1020}
          y2={1010}
          stroke={METAL}
          strokeWidth={6}
        />
        <Texto x={540} y={1240} color={C.cyan} size={70} op={aparece(t, 1.0)}>
          AIRE
        </Texto>
      </Lienzo>
      <Flash t={t} d={1.0} color={C.cyan} />
    </>
  );
};

// B. PSI: libras por pulgada cuadrada
export const Psi: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.psi, T.mide], [1, 1.03])}>
      <Tarjeta x={190} y={420} w={700} h={170} op={aparece(t, T.psi)}>
        <Texto x={540} y={530} color={C.yellow} size={80}>
          32 PSI
        </Texto>
      </Tarjeta>
      <g opacity={aparece(t, T.psi + 1.5)} transform="translate(540 900)">
        <circle r={230} fill="none" stroke="#1A1A2A" strokeWidth={80} />
        <circle
          r={230}
          fill="none"
          stroke={METAL}
          strokeWidth={4}
          opacity={0.5}
        />
        {new Array(12).fill(0).map((_, k) => {
          const a = (k / 12) * Math.PI * 2;
          const d = 150 + 20 * Math.sin(t * 5);
          return (
            <g key={k} transform={`rotate(${(a * 180) / Math.PI})`}>
              <line
                x1={110}
                y1={0}
                x2={d + 30}
                y2={0}
                stroke={C.cyan}
                strokeWidth={8}
              />
              <path
                d={`M ${d + 30} -14 L ${d + 52} 0 L ${d + 30} 14 Z`}
                fill={C.cyan}
              />
            </g>
          );
        })}
      </g>
      <g opacity={aparece(t, T.pulgada)}>
        <rect
          x={150}
          y={1230}
          width={110}
          height={110}
          fill="none"
          stroke={C.white}
          strokeWidth={6}
        />
        <Texto x={205} y={1380} color={C.grey} size={26}>
          1 pulgada²
        </Texto>
        <Texto x={300} y={1300} color={C.white} size={44} anchor="start">
          = 32 libras empujando
        </Texto>
      </g>
      <Texto
        x={540}
        y={1460}
        color={C.yellow}
        size={40}
        op={aparece(t, T.sostiene)}
      >
        ese empuje sostiene el auto
      </Texto>
    </Lienzo>
  );
};

// C. Medidor de lápiz: pistón, resorte y varilla
export const Lapiz: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.piston, T.varilla + 0.6], [0, 1], suave);
  const nResorte = 10;
  const x0 = 360 + p * 120;
  const resorte = new Array(nResorte * 2 + 1)
    .fill(0)
    .map(
      (_, k) =>
        `${x0 + 40 + ((880 - x0 - 40) * k) / (nResorte * 2)} ${k % 2 ? 830 : 890}`,
    )
    .join(" L ");
  return (
    <Lienzo zoom={interpolate(t, [T.mide, T.digital], [1, 1.03])}>
      <Texto x={540} y={500} color={C.white} size={44} op={aparece(t, T.lapiz)}>
        medidor de lápiz
      </Texto>
      <rect
        x={160}
        y={790}
        width={760}
        height={140}
        rx={30}
        fill="none"
        stroke={METAL}
        strokeWidth={8}
      />
      <rect x={120} y={820} width={60} height={80} rx={10} fill={METAL} />
      {new Array(8).fill(0).map((_, k) => {
        const f = (t * 1.5 + k / 8) % 1;
        return (
          <circle
            key={k}
            cx={190 + f * (x0 - 200)}
            cy={860 + (random(`ll${k}`) - 0.5) * 70}
            r={9}
            fill={C.cyan}
            opacity={aparece(t, T.piston)}
          />
        );
      })}
      <rect
        x={x0}
        y={800}
        width={40}
        height={120}
        rx={8}
        fill={C.orange}
        opacity={aparece(t, T.piston)}
      />
      <path d={`M ${resorte}`} stroke={METAL} strokeWidth={6} fill="none" />
      <g opacity={aparece(t, T.varilla)}>
        <rect
          x={x0 + 40}
          y={1000}
          width={420}
          height={70}
          rx={10}
          fill="#E8E6F0"
        />
        {[0, 10, 20, 30, 40].map((n, k) => (
          <text
            key={n}
            x={x0 + 60 + k * 88}
            y={1048}
            fontFamily={mono}
            fontSize={30}
            fontWeight={700}
            fill="#1A1636"
          >
            {n}
          </text>
        ))}
        <line
          x1={840}
          y1={980}
          x2={840}
          y2={1090}
          stroke={C.red}
          strokeWidth={6}
        />
      </g>
      <Texto
        x={540}
        y={1250}
        color={C.yellow}
        size={44}
        op={aparece(t, T.varilla + 0.6)}
      >
        más presión, más sale
      </Texto>
    </Lienzo>
  );
};

// D. Digital: membrana de silicio con resistencias
export const Digital: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const dobla = interpolate(t, [T.dobla, T.dobla + 0.8], [0, 1], suave);
  const lectura = interpolate(t, [T.chip, T.chip + 1.2], [0, 32], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.digital, T.fria], [1, 1.03])}>
      <Texto
        x={540}
        y={460}
        color={C.white}
        size={44}
        op={aparece(t, T.digital)}
      >
        medidor digital
      </Texto>
      <g opacity={aparece(t, T.digital + 0.8)}>
        <rect x={180} y={600} width={60} height={260} fill={METAL} />
        <rect x={840} y={600} width={60} height={260} fill={METAL} />
        <path
          d={`M 240 700 Q 540 ${700 - dobla * 140} 840 700`}
          stroke="#C8C4D8"
          strokeWidth={14}
          fill="none"
        />
        <Texto x={540} y={790} color={C.grey} size={30}>
          membrana de silicio
        </Texto>
      </g>
      <g opacity={aparece(t, T.resistencias)}>
        {[380, 640].map((x) => (
          <path
            key={x}
            d={`M ${x} ${684 - dobla * 110} ${new Array(6)
              .fill(0)
              .map((_, k) => `l ${10 + dobla * 3} ${k % 2 ? 14 : -14}`)
              .join(" ")}`}
            stroke={C.orange}
            strokeWidth={6}
            fill="none"
          />
        ))}
      </g>
      {new Array(6).fill(0).map((_, k) => (
        <path
          key={k}
          d={`M ${300 + k * 90} 900 L ${300 + k * 90} 830`}
          stroke={C.cyan}
          strokeWidth={6}
          opacity={aparece(t, T.dobla)}
        />
      ))}
      <Tarjeta x={240} y={1050} w={600} h={220} op={aparece(t, T.chip)}>
        <rect
          x={290}
          y={1090}
          width={500}
          height={140}
          rx={14}
          fill="#0A1A10"
        />
        <Texto x={540} y={1190} color="#5AE878" size={80}>
          {`${lectura.toFixed(1)} PSI`}
        </Texto>
      </Tarjeta>
    </Lienzo>
  );
};

// E. Mide en frío: al rodar el aire se calienta y la lectura sube
export const Fria: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const calor = interpolate(t, [T.calienta, T.sube + 0.6], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.fria, T.libras], [1, 1.03])}>
      <g transform="translate(540 820)">
        <circle
          r={230}
          fill="#1A1A2A"
          stroke={calor > 0.5 ? C.orange : METAL}
          strokeWidth={14}
        />
        <circle r={110} fill="#3A3A4A" />
        {new Array(10).fill(0).map((_, k) => {
          const a = k * 0.63 + t * (1 + calor * 3);
          return (
            <circle
              key={k}
              cx={Math.cos(a) * 170}
              cy={Math.sin(a) * 170}
              r={10}
              fill={calor > 0.5 ? C.orange : C.cyan}
            />
          );
        })}
      </g>
      <Tarjeta x={290} y={1120} w={500} h={160} op={aparece(t, T.fria)}>
        <Texto
          x={540}
          y={1222}
          color={calor > 0.5 ? C.orange : C.cyan}
          size={70}
        >
          {`${Math.round(32 + calor * 3)} PSI`}
        </Texto>
      </Tarjeta>
      <Texto x={540} y={1400} color={C.white} size={40} op={aparece(t, T.fria)}>
        {calor > 0.5 ? "caliente: lee de más" : "mide con la llanta fría"}
      </Texto>
    </Lienzo>
  );
};

// F. Cierre: unas libras de aire cargando tu auto
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.libras, T.fin + 0.5], [1, 1.05])}>
      <Auto x={540} y={860} s={1.15} t={t} aire={1} />
      <line
        x1={60}
        y1={990}
        x2={1020}
        y2={990}
        stroke={METAL}
        strokeWidth={6}
      />
      <Texto
        x={540}
        y={1220}
        color={C.yellow}
        size={70}
        op={aparece(t, T.libras + 0.5)}
      >
        32 PSI
      </Texto>
    </Lienzo>
  );
};
