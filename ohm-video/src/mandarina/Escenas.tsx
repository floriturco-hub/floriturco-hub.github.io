import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/mandarina/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  mandarina: 2.82, // mandarina
  apretados: 3.82, // apretados
  mano: 6.66, // mano
  romperse: 7.16, // romperse
  final: 8.36, // final
  compartimento: 11.86, // compartimento
  membrana: 14.18, // membrana
  jugo: 16.22, // jugo
  vesiculas: 18.48, // vesiculas
  pulpa: 20.96, // pulpa
  membranas: 22.70, // membranas
  pectina: 24.32, // pectina
  madurar: 26.56, // madurar
  enzimas: 27.36, // enzimas
  despegan: 30.10, // despegan
  flor: 35.08, // flor
  eje: 37.02, // eje
  porEso: 37.98, // por
  fin: 39.58, // FIN
};

const NAR = "#F0A030";
const NAR2 = "#F8C060";

// Mandarina en corte: n gajos alrededor del centro; sep = separación radial de los gajos
const Corte: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly sep?: number; readonly cascara?: number; readonly ves?: number; readonly t?: number }> = ({
  x,
  y,
  r,
  sep = 0,
  cascara = 1,
  ves = 0,
}) => {
  const n = 10;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx={0} cy={0} r={r + 30} fill={NAR} opacity={cascara} />
      <circle cx={0} cy={0} r={r + 10} fill="#F8E8C8" opacity={cascara} />
      {new Array(n).fill(0).map((_, k) => {
        const a0 = (k / n) * Math.PI * 2;
        const a1 = ((k + 1) / n) * Math.PI * 2;
        const am = (a0 + a1) / 2;
        const dx = Math.cos(am) * sep;
        const dy = Math.sin(am) * sep;
        const p = (a: number, rr: number) => `${Math.cos(a) * rr + dx} ${Math.sin(a) * rr + dy}`;
        return (
          <g key={k}>
            <path d={`M ${p(am, 14)} L ${p(a0 + 0.04, r)} A ${r} ${r} 0 0 1 ${p(a1 - 0.04, r)} Z`} fill={NAR2} stroke="#FFF0D8" strokeWidth={5} />
            {ves > 0
              ? [0.35, 0.55, 0.75].map((f) => <ellipse key={f} cx={Math.cos(am) * r * f + dx} cy={Math.sin(am) * r * f + dy} rx={10} ry={18} fill={NAR} opacity={ves} transform={`rotate(${(am * 180) / Math.PI + 90} ${Math.cos(am) * r * f + dx} ${Math.sin(am) * r * f + dy})`} />)
              : null}
          </g>
        );
      })}
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Corte x={540} y={1000} r={280} sep={20 + 12 * Math.sin(t * 2)} cascara={0} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué se separan estos gajos?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.mandarina], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Crecieron apretados en la misma cáscara, pero se separan con la mano sin romperse + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cas = 1 - aparece(t, T.mano);
  const sep = interpolate(t, [T.mano, T.romperse + 0.6], [0, 40], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.mandarina, T.compartimento], [1, 1.04])}>
      <Corte x={540} y={1000} r={280} sep={sep} cascara={cas} />
      <Texto x={540} y={1420} size={38} color={C.white} op={aparece(t, T.apretados) * cas}>
        apretados en la misma cáscara
      </Texto>
      <Texto x={540} y={1420} size={38} color="#5AD08A" op={aparece(t, T.romperse)}>
        se separan sin romperse
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿de dónde sale cada gajo?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.compartimento], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// Gajo grande visto de lado: membrana y vesículas
const Gajo: React.FC<{ readonly x: number; readonly y: number; readonly mem?: number; readonly ves?: number; readonly s?: number }> = ({ x, y, mem = 0, ves = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -260 60 Q -240 -180 0 -200 Q 240 -180 260 60 Q 0 120 -260 60 Z" fill={NAR2} />
    {ves > 0
      ? new Array(14).fill(0).map((_, k) => (
          <ellipse key={k} cx={-180 + (k % 7) * 60} cy={-120 + Math.floor(k / 7) * 100} rx={22} ry={40} fill={NAR} opacity={ves} stroke="#FFF0D8" strokeWidth={3} />
        ))
      : null}
    <path d="M -260 60 Q -240 -180 0 -200 Q 240 -180 260 60 Q 0 120 -260 60 Z" fill="none" stroke="#FFF8E8" strokeWidth={10} opacity={mem} />
  </g>
);

// C. Cada gajo es un compartimento cerrado con su propia membrana; el jugo está en vesículas
export const Compartimento: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.compartimento, T.pulpa], [1, 1.04])}>
        <Gajo x={540} y={1000} s={1.3} mem={aparece(t, T.membrana)} ves={aparece(t, T.vesiculas)} />
        <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.compartimento)}>
          cada gajo: un compartimento cerrado
        </Texto>
        <Texto x={540} y={1260} size={36} color="#FFF8E8" op={aparece(t, T.membrana)}>
          con su propia membrana
        </Texto>
        <Texto x={540} y={1340} size={38} color={NAR} op={aparece(t, T.vesiculas)}>
          jugo en vesículas
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.compartimento} color={NAR2} />
    </>
  );
};

// D. Entre gajos solo hay dos membranas pegadas con pectina
export const Pectina: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.pulpa, T.madurar], [1, 1.04])}>
      <rect x={140} y={760} width={360} height={480} rx={40} fill={NAR2} />
      <rect x={580} y={760} width={360} height={480} rx={40} fill={NAR2} />
      <rect x={490} y={760} width={14} height={480} fill="#FFF8E8" opacity={aparece(t, T.membranas)} />
      <rect x={576} y={760} width={14} height={480} fill="#FFF8E8" opacity={aparece(t, T.membranas)} />
      <rect x={504} y={760} width={72} height={480} fill="#E8D890" opacity={0.7 * aparece(t, T.pectina)} />
      <Texto x={540} y={640} size={38} color={C.white} op={aparece(t, T.pulpa)}>
        no comparten pulpa
      </Texto>
      <Texto x={540} y={1320} size={34} color="#FFF8E8" op={aparece(t, T.membranas)}>
        solo dos membranas…
      </Texto>
      <Texto x={540} y={1400} size={40} color={C.yellow} op={aparece(t, T.pectina)}>
        …pegadas con pectina
      </Texto>
    </Lienzo>
  );
};

// E. Al madurar, enzimas debilitan la pectina y las membranas se despegan sin romper las vesículas
export const Madurar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sep = interpolate(t, [T.despegan, T.despegan + 0.8], [0, 80], clamp);
  const pec = 1 - interpolate(t, [T.enzimas, T.despegan + 0.4], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.madurar, T.flor], [1, 1.04])}>
        <rect x={140 - sep} y={760} width={360} height={480} rx={40} fill={NAR2} />
        <rect x={580 + sep} y={760} width={360} height={480} rx={40} fill={NAR2} />
        <rect x={504} y={760} width={72} height={480} fill="#E8D890" opacity={0.7 * pec} />
        {aparece(t, T.enzimas) > 0
          ? new Array(6).fill(0).map((_, k) => (
              <path key={k} transform={`translate(${540 + 12 * Math.sin(t * 4 + k)} ${800 + k * 75}) rotate(${t * 90 + k * 40})`} d="M -14 0 A 14 14 0 1 1 14 0 L 0 0 Z" fill={C.cyan} opacity={aparece(t, T.enzimas) * pec} />
            ))
          : null}
        <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.madurar)}>
          al madurar…
        </Texto>
        <Texto x={540} y={1320} size={36} color={C.cyan} op={aparece(t, T.enzimas)}>
          enzimas debilitan la pectina
        </Texto>
        <Texto x={540} y={1400} size={40} color="#5AD08A" op={aparece(t, T.despegan)}>
          se despegan fácil
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.despegan} color={C.cyan} />
    </>
  );
};

// F. Cada gajo fue una cámara separada en la flor, alrededor de un eje central
export const Flor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.flor, T.porEso], [1, 1.04])}>
      {new Array(5).fill(0).map((_, k) => {
        const a = (k / 5) * Math.PI * 2 + 0.3;
        return <ellipse key={k} cx={540 + Math.cos(a) * 230} cy={980 + Math.sin(a) * 230} rx={130} ry={80} fill="#F8F4EC" transform={`rotate(${(a * 180) / Math.PI} ${540 + Math.cos(a) * 230} ${980 + Math.sin(a) * 230})`} opacity={aparece(t, T.flor)} />;
      })}
      <circle cx={540} cy={980} r={120} fill="#B8D060" opacity={aparece(t, T.flor)} />
      {new Array(10).fill(0).map((_, k) => {
        const a0 = (k / 10) * Math.PI * 2;
        return <line key={k} x1={540} y1={980} x2={540 + Math.cos(a0) * 120} y2={980 + Math.sin(a0) * 120} stroke="#7A9030" strokeWidth={4} opacity={aparece(t, T.flor)} />;
      })}
      <circle cx={540} cy={980} r={14} fill={C.yellow} opacity={aparece(t, T.eje)} />
      <Texto x={540} y={640} size={38} color={C.white} op={aparece(t, T.flor)}>
        en la flor: una cámara por gajo
      </Texto>
      <Texto x={540} y={1360} size={36} color={C.yellow} op={aparece(t, T.eje)}>
        alrededor de un eje central
      </Texto>
    </Lienzo>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
