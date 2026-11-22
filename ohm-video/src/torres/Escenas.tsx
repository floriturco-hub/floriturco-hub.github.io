import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/torres/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  bastan: 2.66, // bastan
  tres: 4.52, // tres
  seis: 5.28, // seis
  final: 6.26, // final
  trifasica: 10.62, // trifasica
  desfasadas: 13.36, // desfasadas
  pistones: 14.48, // pistones
  instante: 15.70, // instante
  otros: 18.16, // otros
  regreso: 20.36, // regreso
  metal: 22.74, // metal
  grupos: 24.12, // grupos
  circuitos: 26.42, // circuitos
  pelotas: 27.52, // pelotas
  marcadores: 28.56, // marcadores
  pilotos: 29.78, // pilotos
  porEso: 32.70, // por
  fin: 34.76, // FIN
};

const FASES = [C.red, C.yellow, "#3A8AE8"];
const ACERO = "#8C88A8";

// Torre de celosía; seis = dos circuitos (brazos a ambos lados)
const Torre: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly seis?: number; readonly colores?: number }> = ({
  x,
  y,
  s,
  seis = 0,
  colores = 0,
}) => {
  const brazos = [-300, -180, -60];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -120 380 L -30 -380 L 30 -380 L 120 380" stroke={ACERO} strokeWidth={10} fill="none" />
      {new Array(7).fill(0).map((_, k) => {
        const y1 = 380 - k * 108;
        const w1 = 120 - k * 12.9;
        const w2 = 120 - (k + 1) * 12.9;
        return <path key={k} d={`M ${-w1} ${y1} L ${w2} ${y1 - 108} M ${w1} ${y1} L ${-w2} ${y1 - 108}`} stroke={ACERO} strokeWidth={5} />;
      })}
      {brazos.map((by, k) => (
        <g key={k}>
          <line x1={-30} y1={by} x2={-220} y2={by} stroke={ACERO} strokeWidth={10} />
          <line x1={-200} y1={by} x2={-200} y2={by + 50} stroke="#C8C4D8" strokeWidth={8} />
          <circle cx={-200} cy={by + 58} r={10} fill={colores ? FASES[k] : C.white} />
          <g opacity={seis}>
            <line x1={30} y1={by} x2={220} y2={by} stroke={ACERO} strokeWidth={10} />
            <line x1={200} y1={by} x2={200} y2={by + 50} stroke="#C8C4D8" strokeWidth={8} />
            <circle cx={200} cy={by + 58} r={10} fill={colores ? FASES[k] : C.white} />
          </g>
        </g>
      ))}
    </g>
  );
};

// Cables que salen de la torre hacia los lados (catenarias)
const Cables: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly seis?: number; readonly colores?: number; readonly bolas?: number }> = ({
  x,
  y,
  s,
  seis = 0,
  colores = 0,
  bolas = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-300, -180, -60].map((by, k) => (
      <g key={k}>
        <path d={`M -200 ${by + 58} Q -500 ${by + 140} -800 ${by + 58}`} stroke={colores ? FASES[k] : "#C8C4D8"} strokeWidth={6} fill="none" />
        <g opacity={seis}>
          <path d={`M 200 ${by + 58} Q 500 ${by + 140} 800 ${by + 58}`} stroke={colores ? FASES[k] : "#C8C4D8"} strokeWidth={6} fill="none" />
        </g>
        <g opacity={bolas * (k === 0 ? 1 : 0)}>
          {[-380, -520, -660].map((bx) => (
            <circle key={bx} cx={bx} cy={by + 58 + 82 * (1 - ((bx + 500) / 300) ** 2)} r={30} fill={C.orange} />
          ))}
        </g>
      </g>
    ))}
  </g>
);

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <Cables x={620} y={1000} s={1} />
    <Torre x={620} y={1000} s={1} />
    <Texto x={860} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué estas torres llevan tres cables?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.bastan], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.yellow} />
    </>
  );
};

// Enchufe de casa con dos clavijas
const Enchufe: React.FC<{ readonly x: number; readonly y: number; readonly op: number }> = ({ x, y, op }) => (
  <g opacity={op} transform={`translate(${x} ${y})`}>
    <rect x={-120} y={-150} width={240} height={300} rx={40} fill="#E8E4F0" />
    <rect x={-60} y={-50} width={24} height={90} rx={8} fill="#2A2640" />
    <rect x={36} y={-50} width={24} height={90} rx={8} fill="#2A2640" />
    <Texto x={0} y={230} size={40} color={C.white}>
      casa: 2
    </Texto>
  </g>
);

// B. En casa bastan dos, las torres llevan tres o seis + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const seis = aparece(t, T.seis);
  return (
    <Lienzo zoom={interpolate(t, [T.bastan, T.trifasica], [1, 1.05])}>
      <Enchufe x={230} y={860} op={aparece(t, T.bastan)} />
      <g opacity={aparece(t, T.tres)}>
        <Torre x={720} y={900} s={0.75} seis={seis} />
        <Texto x={720} y={1250} size={40} color={C.yellow}>
          {seis > 0.5 ? "torre: 3 o 6" : "torre: 3"}
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <circle cx={540} cy={1140} r={26} fill={C.orange} />
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.trifasica], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          ¿y las pelotas naranjas? al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Tres ondas desfasadas
const Ondas: React.FC<{ readonly t: number; readonly y: number; readonly op: number[]; readonly marca?: number }> = ({ t, y, op, marca }) => (
  <g>
    {FASES.map((col, k) => (
      <path
        key={k}
        opacity={op[k]}
        d={new Array(121)
          .fill(0)
          .map((_, i) => `${i ? "L" : "M"} ${120 + i * 7} ${y - Math.sin(i * 0.09 - t * 2 + (k * 2 * Math.PI) / 3) * 130}`)
          .join(" ")}
        stroke={col}
        strokeWidth={8}
        fill="none"
      />
    ))}
    {marca !== undefined ? <line x1={marca} y1={y - 170} x2={marca} y2={y + 170} stroke={C.white} strokeWidth={4} strokeDasharray="12 8" /> : null}
  </g>
);

// C. Corriente alterna trifásica: tres corrientes desfasadas, como tres pistones
export const Trifasica: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.trifasica, T.instante], [1, 1.04])}>
      <Texto x={540} y={480} size={44} color={C.white} op={aparece(t, T.trifasica)}>
        corriente trifásica
      </Texto>
      <Ondas t={t} y={760} op={[aparece(t, T.trifasica), aparece(t, T.desfasadas - 0.3), aparece(t, T.desfasadas)]} />
      <g opacity={aparece(t, T.pistones)}>
        {FASES.map((col, k) => {
          const h = Math.sin(-t * 2 + (k * 2 * Math.PI) / 3 + 0.09 * 60) * 70;
          return (
            <g key={k}>
              <rect x={290 + k * 200} y={1050} width={100} height={260} rx={10} fill="none" stroke={C.grey} strokeWidth={5} />
              <rect x={300 + k * 200} y={1150 - h} width={80} height={60} rx={8} fill={col} />
            </g>
          );
        })}
      </g>
    </Lienzo>
  );
};

// D. En cada instante lo que va por uno vuelve por los otros dos: no hace falta cable de regreso
export const Suma: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ph = -t * 2 + 0.09 * 60;
  const vals = FASES.map((_, k) => Math.sin(ph + (k * 2 * Math.PI) / 3));
  return (
    <Lienzo zoom={interpolate(t, [T.instante, T.grupos], [1, 1.04])}>
      <Ondas t={t} y={640} op={[1, 1, 1]} marca={540} />
      <g opacity={aparece(t, T.instante + 0.3)}>
        <line x1={160} y1={1060} x2={920} y2={1060} stroke={C.grey} strokeWidth={4} />
        {vals.map((v, k) => (
          <rect key={k} x={250 + k * 220} y={v > 0 ? 1060 - v * 180 : 1060} width={140} height={Math.abs(v) * 180} rx={10} fill={FASES[k]} />
        ))}
        <Texto x={540} y={1330} size={44} color={C.white} op={aparece(t, T.otros)}>
          suma = 0
        </Texto>
      </g>
      <Texto x={540} y={1410} size={38} color={C.yellow} op={aparece(t, T.regreso)}>
        sin cable de regreso
      </Texto>
      <Texto x={540} y={1470} size={34} color={C.grey} op={aparece(t, T.metal)}>
        más energía, menos metal
      </Texto>
    </Lienzo>
  );
};

// E. Van en grupos de tres: seis cables son dos circuitos
export const Grupos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.grupos, T.pelotas], [1, 1.04])}>
      <Cables x={540} y={950} s={0.95} seis={1} colores={1} />
      <Torre x={540} y={950} s={0.95} seis={1} colores={1} />
      <g opacity={aparece(t, T.circuitos)}>
        <Texto x={300} y={1400} size={40} color={C.white}>
          circuito 1
        </Texto>
        <Texto x={780} y={1400} size={40} color={C.white}>
          circuito 2
        </Texto>
      </g>
    </Lienzo>
  );
};

// Helicóptero simple
const Helicoptero: React.FC<{ readonly x: number; readonly y: number; readonly t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={0} rx={90} ry={50} fill="#5A5478" />
    <rect x={80} y={-10} width={140} height={20} fill="#5A5478" />
    <circle cx={-30} cy={-10} r={28} fill="#8AC8F8" />
    <line x1={-140 * Math.cos(t * 30)} y1={-60} x2={140 * Math.cos(t * 30)} y2={-60} stroke={C.white} strokeWidth={8} />
    <line x1={0} y1={-50} x2={0} y2={-60} stroke={C.white} strokeWidth={8} />
  </g>
);

// F. Las pelotas naranjas son marcadores para que los pilotos vean los cables
export const Pelotas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pelotas, T.porEso], [1, 1.04])}>
        <Cables x={900} y={1000} s={1} bolas={aparece(t, T.pelotas)} />
        <Torre x={900} y={1000} s={1} />
        <Texto x={380} y={1300} size={40} color={C.orange} op={aparece(t, T.marcadores)}>
          marcadores
        </Texto>
        <g opacity={aparece(t, T.pilotos)}>
          <Helicoptero x={interpolate(t, [T.pilotos, T.porEso], [-100, 320], clamp)} y={520} t={t} />
        </g>
      </Lienzo>
      <Flash t={t} d={T.pelotas} color={C.orange} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} />
    </Lienzo>
  );
};
