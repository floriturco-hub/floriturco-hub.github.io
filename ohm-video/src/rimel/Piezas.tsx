import { interpolate, interpolateColors, random } from "remotion";
import { C, clamp } from "../theme";

export const AIRE = "#C8D4F0";
export const MICROBIO = "#8CCB5A";
const RIMEL = "#241A30";
const RIMEL_SECO = "#4A3C40";

const fr = (v: number) => Math.max(0, Math.min(1, v));

// Microbio: cápsula verde con dos flagelos
export const Microbio: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly rot?: number; readonly t: number }> = ({ x, y, s = 1, rot = 0, t }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d={`M 14 0 q 8 ${Math.sin(t * 9) * 5} 16 0 M -14 0 q -8 ${Math.cos(t * 9) * 5} -16 0`} stroke={MICROBIO} strokeWidth={2.5} fill="none" />
    <rect x={-14} y={-6} width={28} height={12} rx={6} fill={MICROBIO} />
    <circle cx={-4} cy={-1} r={2} fill="#4E7A2E" />
    <circle cx={5} cy={1} r={2} fill="#4E7A2E" />
  </g>
);

// Cepillo del rímel (coordenadas: y=0 es la base del tapón; el cepillo baja hasta y=800)
export const Cepillo: React.FC<{ readonly giro?: number; readonly carga?: number; readonly grumos?: number }> = ({ giro = 0, carga = 0.6, grumos = 0 }) => {
  const cerdas = 36;
  return (
    <g>
      {/* Tapón / mango */}
      <rect x={-82} y={-300} width={164} height={312} rx={22} fill="#2E2A40" stroke="#5A5478" strokeWidth={4} />
      <rect x={-82} y={-300} width={40} height={312} rx={20} fill="#FFFFFF" opacity={0.08} />
      {new Array(6).fill(0).map((_, k) => (
        <line key={k} x1={-82} y1={-24 - k * 8} x2={82} y2={-24 - k * 8} stroke="#3E3858" strokeWidth={3} />
      ))}
      {/* Varilla */}
      <rect x={-7} y={10} width={14} height={400} fill="#B8B4C8" />
      {/* Cerdas en espiral */}
      <rect x={-6} y={388} width={12} height={272} rx={6} fill="#6A6680" />
      {new Array(cerdas).fill(0).map((_, k) => {
        const yk = 396 + k * 7.2;
        const fase = ((k * 0.55 + giro) % (Math.PI * 2)) + 0.0001;
        const ancho = 58 * (0.75 + 0.25 * Math.cos(fase));
        const punta = k < 3 || k > cerdas - 4 ? 0.7 : 1;
        return (
          <line
            key={k}
            x1={-ancho * punta}
            y1={yk + Math.sin(fase) * 3}
            x2={ancho * punta}
            y2={yk - Math.sin(fase) * 3}
            stroke={Math.cos(fase) > 0 ? "#3A3448" : "#24202E"}
            strokeWidth={4}
            strokeLinecap="round"
          />
        );
      })}
      {/* Rímel cargado en el cepillo */}
      <rect x={-50} y={398} width={100} height={252} rx={40} fill={RIMEL} opacity={0.55 * carga} />
      {new Array(Math.round(grumos)).fill(0).map((_, k) => (
        <ellipse
          key={k}
          cx={(random(`gx${k}`) - 0.5) * 100}
          cy={412 + random(`gy${k}`) * 225}
          rx={13 + random(`gr${k}`) * 10}
          ry={10 + random(`gq${k}`) * 7}
          fill={RIMEL_SECO}
          stroke="#2A2026"
          strokeWidth={3}
        />
      ))}
    </g>
  );
};

type TuboProps = {
  readonly t: number;
  readonly x: number;
  readonly y: number; // borde superior del cuello
  readonly s?: number;
  readonly salida?: number; // 0 = cepillo dentro, 1 = fuera
  readonly giro?: number;
  readonly aire?: number; // partículas de aire dentro (continuo: la fracción entra)
  readonly seco?: number; // 0 brillante, 1 espeso y seco
  readonly evapora?: number; // intensidad de moléculas que escapan
  readonly microbios?: number;
  readonly microbiosEntran?: number; // los primeros N entran por el cuello; el resto crece dentro
  readonly oscuro?: number;
  readonly grumos?: number;
  readonly holgura?: number; // resaltar el ajuste casi justo
  readonly cepillo?: boolean;
};

// Tubo de rímel en corte, con el cepillo dentro
export const Tubo: React.FC<TuboProps> = ({
  t,
  x,
  y,
  s = 1,
  salida = 0,
  giro = 0,
  aire = 0,
  seco = 0,
  evapora = 0,
  microbios = 0,
  microbiosEntran,
  oscuro = 0,
  grumos = 0,
  holgura = 0,
  cepillo = true,
}) => {
  const nivel = 330; // superficie del rímel
  const colorRimel = interpolateColors(seco, [0, 1], [RIMEL, RIMEL_SECO]);
  const entran = microbiosEntran ?? microbios;
  const dy = -salida * 660;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* Cuerpo en corte */}
      <rect x={-108} y={86} width={216} height={630} rx={46} fill="#C8418A" />
      <rect x={-108} y={86} width={60} height={630} rx={30} fill="#FFFFFF" opacity={0.12} />
      <rect x={-84} y={-2} width={168} height={100} rx={8} fill="#A8A4B8" />
      {new Array(5).fill(0).map((_, k) => (
        <line key={k} x1={-84} y1={14 + k * 16} x2={84} y2={8 + k * 16} stroke="#7A768C" strokeWidth={3} />
      ))}
      {/* Cavidad */}
      <path d="M -62 -2 L 62 -2 L 62 96 L 80 112 L 80 680 Q 80 696 64 696 L -64 696 Q -80 696 -80 680 L -80 112 L -62 96 Z" fill="#120E22" />
      {/* Rímel */}
      <path
        d={`M -80 ${nivel} ${new Array(9)
          .fill(0)
          .map((_, k) => `L ${-80 + k * 20} ${nivel + Math.sin(k * 1.7) * 10 * seco + (seco > 0 ? -random(`n${k}`) * 16 * seco : 0)}`)
          .join(" ")} L 80 ${nivel} L 80 680 Q 80 696 64 696 L -64 696 Q -80 696 -80 680 Z`}
        fill={colorRimel}
      />
      <path d={`M -64 ${nivel + 14} Q -40 ${nivel + 6} -20 ${nivel + 14}`} stroke="#FFFFFF" strokeWidth={5} opacity={0.35 * (1 - seco)} fill="none" strokeLinecap="round" />
      {/* Costra seca en las paredes */}
      {seco > 0
        ? new Array(10).fill(0).map((_, k) => (
            <path
              key={k}
              d={`M ${k % 2 ? 80 : -80} ${130 + k * 18} q ${k % 2 ? -14 : 14} 10 0 ${18 + random(`c${k}`) * 16}`}
              fill={RIMEL_SECO}
              opacity={fr(seco * 1.6 - k * 0.08)}
            />
          ))
        : null}
      {seco > 0
        ? new Array(5).fill(0).map((_, k) => (
            <path
              key={`g${k}`}
              d={`M ${-60 + k * 30} ${nivel + 40 + random(`gk${k}`) * 250} l 12 10 l -6 14 l 14 8`}
              stroke="#6A5A5A"
              strokeWidth={3}
              fill="none"
              opacity={fr(seco * 2 - 1)}
            />
          ))
        : null}
      {/* Aire dentro */}
      {new Array(Math.ceil(aire)).fill(0).map((_, k) => {
        const p = fr(aire - k);
        const xr = (random(`ax${k}`) - 0.5) * 130;
        const yr = 130 + random(`ay${k}`) * (nivel - 160);
        const xx = interpolate(p, [0, 1], [(random(`ae${k}`) - 0.5) * 60, xr]);
        const yy = interpolate(p, [0, 1], [-30, yr]);
        return (
          <circle key={k} cx={xx + Math.sin(t * 1.3 + k) * 6} cy={yy + Math.cos(t * 1.1 + k * 2) * 6} r={7} fill={AIRE} opacity={0.75 * fr(p * 3)} />
        );
      })}
      {/* Moléculas de agua / disolvente que se evaporan */}
      {evapora > 0
        ? new Array(14).fill(0).map((_, k) => {
            const fase = (t * 0.55 + random(`ev${k}`)) % 1;
            const xx = (random(`evx${k}`) - 0.5) * 130 + Math.sin(t * 2 + k) * 8;
            const yy = nivel - 6 - fase * 220;
            return (
              <g key={k} opacity={evapora * Math.sin(fase * Math.PI)}>
                <circle cx={xx} cy={yy} r={9} fill={C.cyan} />
                <circle cx={xx - 9} cy={yy - 6} r={5} fill={C.cyan} opacity={0.7} />
                <circle cx={xx + 9} cy={yy - 6} r={5} fill={C.cyan} opacity={0.7} />
              </g>
            );
          })
        : null}
      {/* Microbios */}
      {new Array(Math.ceil(microbios)).fill(0).map((_, k) => {
        const p = fr(microbios - k);
        const xr = (random(`mx${k}`) - 0.5) * 130;
        const yr = 140 + random(`my${k}`) * 520;
        if (k < entran) {
          const xx = interpolate(p, [0, 1], [0, xr]);
          const yy = interpolate(p, [0, 1], [-40, yr]);
          return <Microbio key={k} x={xx} y={yy} s={0.9} rot={random(`mr${k}`) * 180} t={t + k} />;
        }
        return <Microbio key={k} x={xr} y={yr} s={0.9 * p} rot={random(`mr${k}`) * 180} t={t + k} />;
      })}
      {/* Humedad y oscuridad */}
      {oscuro > 0 ? (
        <g>
          <path d="M -62 -2 L 62 -2 L 62 96 L 80 112 L 80 680 Q 80 696 64 696 L -64 696 Q -80 696 -80 680 L -80 112 L -62 96 Z" fill="#000000" opacity={0.35 * oscuro} />
          {new Array(8).fill(0).map((_, k) => (
            <ellipse key={k} cx={k % 2 ? 70 : -70} cy={140 + k * 34} rx={6} ry={9} fill={C.cyan} opacity={0.55 * oscuro} />
          ))}
        </g>
      ) : null}
      {/* Cepillo */}
      {cepillo ? (
        <g transform={`translate(0 ${dy})`}>
          <Cepillo giro={giro} carga={0.4 + 0.6 * fr(1 - seco)} grumos={grumos} />
        </g>
      ) : null}
      {/* Escurridor de goma del cuello */}
      <rect x={-62} y={74} width={6} height={22} fill="#6A6680" />
      <rect x={56} y={74} width={6} height={22} fill="#6A6680" />
      {/* Ajuste casi justo */}
      {holgura > 0 ? (
        <g opacity={holgura} stroke={C.yellow} strokeWidth={5} fill="none">
          <path d="M -80 500 L -100 500 M -58 500 L -38 500" />
          <path d="M 58 500 L 38 500 M 80 500 L 100 500" />
          <path d="M -150 560 L -150 640 M 150 560 L 150 640" opacity={0} />
        </g>
      ) : null}
    </g>
  );
};

// Flechas de aire entrando por el cuello (coordenadas del tubo)
export const FlechasAire: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly a: number; readonly t: number }> = ({ x, y, s = 1, a, t }) => {
  if (a <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={a}>
      {[-1, 1].map((lado) =>
        [0, 1].map((k) => {
          const fase = (t * 2.4 + k * 0.5) % 1;
          const d = `M ${lado * (260 + k * 50)} ${-240 + k * 60} Q ${lado * 160} ${-60} ${lado * 40} 40`;
          return (
            <g key={`${lado}${k}`}>
              <path d={d} stroke={AIRE} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray="30 22" strokeDashoffset={-fase * 104} opacity={0.8} />
            </g>
          );
        }),
      )}
      <path d="M -26 30 L 0 70 L 26 30" stroke={AIRE} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

// Jeringa vertical (aguja abajo)
export const Jeringa: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly embolo: number }> = ({ x, y, s = 1, embolo }) => {
  const dy = -embolo * 420;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform={`translate(0 ${dy})`}>
        <rect x={-70} y={-120} width={140} height={22} rx={8} fill="#B8B4C8" />
        <rect x={-10} y={-100} width={20} height={300} fill="#B8B4C8" />
        <rect x={-62} y={196} width={124} height={40} rx={8} fill="#2E2A40" stroke="#5A5478" strokeWidth={3} />
      </g>
      <rect x={-70} y={80} width={140} height={660} rx={14} fill="#FFFFFF" opacity={0.1} stroke={C.white} strokeWidth={5} />
      <rect x={-100} y={80} width={200} height={16} rx={6} fill={C.white} opacity={0.6} />
      {new Array(9).fill(0).map((_, k) => (
        <line key={k} x1={40} y1={180 + k * 60} x2={66} y2={180 + k * 60} stroke={C.white} strokeWidth={3} opacity={0.6} />
      ))}
      <path d="M -26 740 L 26 740 L 10 790 L -10 790 Z" fill={C.white} opacity={0.7} />
      <rect x={-3} y={790} width={6} height={170} fill="#D8D4E8" />
    </g>
  );
};

// Ojo con pestañas
export const Ojo: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly rimel?: number; readonly t: number }> = ({ x, y, s = 1, rimel = 0, t }) => {
  const parpadeo = Math.max(0.12, 1 - Math.max(0, Math.sin(t * 1.3) * 8 - 7.2));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -220 0 Q 0 -150 220 0 Q 0 150 -220 0 Z" fill="#F4ECE8" transform={`scale(1 ${parpadeo})`} />
      <g transform={`scale(1 ${parpadeo})`}>
        <circle cx={0} cy={0} r={78} fill="#5A3A22" />
        <circle cx={0} cy={0} r={36} fill="#120A08" />
        <circle cx={-22} cy={-24} r={14} fill="#FFFFFF" opacity={0.85} />
      </g>
      <path d={`M -220 0 Q 0 ${-150 * parpadeo} 220 0`} stroke="#3A2A2A" strokeWidth={8} fill="none" />
      {new Array(13).fill(0).map((_, k) => {
        const u = (k + 0.5) / 13;
        const u2 = 0.1 + u * 0.8;
        const px = -220 + 440 * u2;
        const py = -300 * parpadeo * u2 * (1 - u2);
        const ang = (u2 - 0.5) * 70;
        return (
          <path
            key={k}
            d={`M ${px} ${py} q ${Math.sin((ang * Math.PI) / 180) * 30} -50 ${Math.sin((ang * Math.PI) / 180) * 80 + 14} -95`}
            transform={`rotate(${ang * 0.4} ${px} ${py})`}
            stroke="#1A1218"
            strokeWidth={5 + 6 * rimel}
            strokeLinecap="round"
            fill="none"
          />
        );
      })}
    </g>
  );
};

export const fraccion = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], clamp);
