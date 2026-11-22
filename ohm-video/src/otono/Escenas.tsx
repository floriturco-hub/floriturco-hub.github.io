import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/otono/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  otono: 1.90, // oto
  verde: 3.50, // verde
  rojo: 5.58, // rojo
  final: 6.44, // final
  rojos: 8.66, // rojos
  clorofila: 10.54, // clorofila
  luz: 11.80, // luz
  alimento: 13.00, // alimento
  carotenoides: 16.98, // carot
  tapados: 19.32, // tapados
  acortan: 21.64, // acortan
  desarma: 24.32, // desarma
  desaparece: 25.44, // desaparece
  ven: 27.14, // ven
  rojo2: 29.12, // rojo
  antocianinas: 33.30, // antoc
  soleados: 35.62, // soleados
  frescas: 36.66, // frescas
  ahi: 38.30, // ahi
  fin: 39.46, // FIN
};

const VERDE = "#3AA048";
const AMARILLO = "#F0C030";
const NARANJA = "#E8803A";
const ROJO = "#C83040";

const mezcla = (a: string, b: string, u: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a);
  const B = p(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * u)).join(",")})`;
};

const Hoja: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly r?: number; readonly col: string }> = ({ x, y, s = 1, r = 0, col }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M 0 -200 C 130 -140 150 60 0 200 C -150 60 -130 -140 0 -200 Z" fill={col} />
    <path d="M 0 -180 L 0 240" stroke="#5A3A20" strokeWidth={8} />
    {[-1, 1].map((d) => [0, 1, 2].map((k) => <path key={`${d}${k}`} d={`M 0 ${-100 + k * 80} l ${d * 80} -50`} stroke="#5A3A20" strokeWidth={4} opacity={0.5} />))}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Hoja x={540} y={1000} s={1.6} r={10 * Math.sin(t)} col={AMARILLO} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿de dónde sale este amarillo?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.otono], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. En otoño las hojas pasan de verde a amarillo, naranja y rojo + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = interpolate(t, [T.verde, T.rojo + 0.4], [0, 1], clamp);
  const cols = [AMARILLO, NARANJA, ROJO];
  return (
    <Lienzo zoom={interpolate(t, [T.otono, T.clorofila], [1, 1.04])}>
      {cols.map((c, k) => (
        <Hoja key={k} x={260 + k * 280} y={1000 + 30 * Math.sin(t + k)} s={0.8} r={-15 + k * 15} col={mezcla(VERDE, c, u)} />
      ))}
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿por qué unos otoños son más rojos?
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.clorofila], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. El verde es la clorofila, que atrapa luz para fabricar alimento; los carotenoides siempre estuvieron ahí, tapados
export const Pigmentos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const car = aparece(t, T.carotenoides);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.clorofila, T.acortan], [1, 1.04])}>
        <Hoja x={540} y={1050} s={1.3} col={VERDE} />
        {aparece(t, T.luz) > 0
          ? [0, 1, 2].map((k) => {
              const u = (t * 0.8 + k / 3) % 1;
              return <line key={k} x1={200 + k * 120 + 200 * u} y1={600 + 300 * u} x2={240 + k * 120 + 200 * u} y2={660 + 300 * u} stroke={C.yellow} strokeWidth={8} opacity={aparece(t, T.luz) * (1 - u)} />;
            })
          : null}
        <Texto x={540} y={620} size={40} color={VERDE} op={aparece(t, T.clorofila)}>
          clorofila
        </Texto>
        <Texto x={540} y={680} size={30} color={C.white} op={aparece(t, T.alimento)}>
          con luz fabrica alimento
        </Texto>
        <g opacity={car}>
          {new Array(14).fill(0).map((_, k) => (
            <circle key={k} cx={540 + Math.cos(k * 2.4) * (40 + (k % 4) * 30)} cy={1050 + Math.sin(k * 2.4) * (60 + (k % 4) * 40)} r={10} fill={k % 2 ? AMARILLO : NARANJA} />
          ))}
          <Texto x={540} y={1420} size={36} color={AMARILLO}>
            carotenoides: tapados por el verde
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.carotenoides} color={AMARILLO} />
    </>
  );
};

// D. Días cortos: el árbol deja de fabricar clorofila y la desarma; el verde desaparece y se ven amarillo y naranja
export const Revela: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = interpolate(t, [T.desarma, T.ven + 0.4], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.acortan, T.rojo2], [1, 1.04])}>
        <g transform="translate(540 760)" opacity={aparece(t, T.acortan) * (1 - u * 0.5)}>
          <circle cx={0} cy={0} r={60} fill={C.yellow} />
          <path d="M -260 80 A 260 200 0 0 1 260 80" stroke={C.yellow} strokeWidth={4} fill="none" strokeDasharray="12 10" />
        </g>
        <Hoja x={360} y={1150} s={0.9} col={mezcla(VERDE, AMARILLO, u)} />
        <Hoja x={720} y={1150} s={0.9} r={12} col={mezcla(VERDE, NARANJA, u)} />
        <Texto x={540} y={620} size={36} color={C.white} op={aparece(t, T.acortan)}>
          días más cortos: adiós clorofila
        </Texto>
        <Texto x={540} y={1440} size={40} color={AMARILLO} op={aparece(t, T.ven)}>
          por fin se ven
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.desaparece} color={AMARILLO} />
    </>
  );
};

// E. El rojo es distinto: pigmentos nuevos, antocianinas; más con días soleados y noches frescas sin helar
export const Rojo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const r = interpolate(t, [T.antocianinas, T.antocianinas + 1], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.rojo2, T.ahi], [1, 1.04])}>
        <Hoja x={540} y={1050} s={1.2} col={mezcla(NARANJA, ROJO, r)} />
        <Texto x={540} y={620} size={38} color={C.white} op={aparece(t, T.rojo2)}>
          el rojo es nuevo
        </Texto>
        <Texto x={540} y={1380} size={40} color={ROJO} op={aparece(t, T.antocianinas)}>
          antocianinas
        </Texto>
        <g opacity={aparece(t, T.soleados)}>
          <circle cx={200} cy={760} r={50} fill={C.yellow} />
          <Texto x={200} y={860} size={28} color={C.white}>
            días de sol
          </Texto>
        </g>
        <g opacity={aparece(t, T.frescas)}>
          <circle cx={880} cy={760} r={50} fill="#E8E6F0" />
          <circle cx={900} cy={745} r={44} fill="#1A1A3A" />
          <Texto x={880} y={860} size={28} color={C.white}>
            noches frescas
          </Texto>
          <Texto x={540} y={1460} size={30} color={C.yellow}>
            sin helar
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.antocianinas} color={ROJO} />
    </>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.ahi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
