import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/monedascopa/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  llenas: 2.04, // llenas
  monedas: 4.02, // monedas
  sube: 5.16, // sube
  final: 7.14, // final
  rompe: 7.98, // rompe
  atraen: 10.48, // atraen
  superficie: 12.02, // superficie
  vecinas: 13.18, // vecinas
  jalan: 16.08, // jalan
  piel: 18.94, // piel
  tension: 20.52, // tensi
  moneda2: 22.32, // moneda
  estira: 24.42, // estira
  domo: 26.52, // domo
  peso: 27.66, // peso
  desborda: 29.30, // desborda
  jabon: 30.66, // jab
  golpe: 33.42, // golpe
  porEso: 34.04, // por
  fin: 35.92, // FIN
};

const AGUA = "#3A8AD8";
const ORO = "#E8C040";

// Copa con agua; domo (0..1) por encima del borde; derrame (0..1)
const Copa: React.FC<{ readonly t: number; readonly domo: number; readonly derrame?: number; readonly monedas?: number }> = ({ t, domo, derrame = 0, monedas = 0 }) => {
  const h = 70 * domo * (1 - derrame);
  return (
    <g>
      <path d={`M 290 800 Q 540 ${800 - 2 * h} 790 800 L 760 1100 Q 540 1220 320 1100 Z`} fill={AGUA} opacity={0.7} />
      {new Array(monedas).fill(0).map((_, k) => (
        <ellipse key={k} cx={480 + ((k * 37) % 120)} cy={1120 - k * 8} rx={36} ry={10} fill={ORO} />
      ))}
      <path d="M 280 780 L 320 1110 Q 540 1240 760 1110 L 800 780" fill="none" stroke="#DDEEFF" strokeWidth={8} />
      <rect x={525} y={1180} width={30} height={220} fill="#DDEEFF" opacity={0.8} />
      <ellipse cx={540} cy={1410} rx={160} ry={24} fill="#DDEEFF" opacity={0.8} />
      {derrame > 0 ? (
        <g opacity={derrame}>
          <path d={`M 290 800 Q 250 ${900 + 200 * derrame} 230 ${1000 + 300 * derrame}`} stroke={AGUA} strokeWidth={24} fill="none" strokeLinecap="round" />
          <path d={`M 790 800 Q 830 ${900 + 200 * derrame} 850 ${1000 + 300 * derrame}`} stroke={AGUA} strokeWidth={24} fill="none" strokeLinecap="round" />
          <ellipse cx={540} cy={1440} rx={380 * derrame} ry={30} fill={AGUA} opacity={0.6} />
        </g>
      ) : null}
      {h > 0 ? <path d={`M 300 798 Q 540 ${800 - 2 * h} 780 798`} stroke="#DDF4FF" strokeWidth={4} fill="none" opacity={0.7 + 0.2 * Math.sin(t * 3)} /> : null}
    </g>
  );
};

const Moneda: React.FC<{ readonly x: number; readonly y: number }> = ({ x, y }) => (
  <g>
    <ellipse cx={x} cy={y} rx={40} ry={12} fill={ORO} stroke="#B08A20" strokeWidth={3} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Copa t={t} domo={1} monedas={8} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta copa no se derrama?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.llenas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Copa llena hasta el borde, monedas: el agua sube pero no se derrama + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const n = Math.floor(interpolate(t, [T.monedas, T.atraen], [0, 6], clamp));
  const caida = ((t - T.monedas) * 1.4) % 1;
  return (
    <Lienzo zoom={interpolate(t, [T.llenas, T.atraen], [1, 1.04])}>
      <Copa t={t} domo={interpolate(t, [T.monedas, T.final], [0, 1], clamp)} monedas={n} />
      {t > T.monedas && t < T.atraen ? <Moneda x={540} y={620 + 160 * caida} /> : null}
      <Texto x={540} y={1520} size={38} color={C.yellow} op={aparece(t, T.sube)}>
        sube, pero no se derrama
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          qué la rompe al instante: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.atraen], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Las moléculas se atraen; en la superficie solo hay vecinas abajo y a los lados: la jalan adentro, piel elástica
export const Tension: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sup = aparece(t, T.superficie);
  const flechas = (cx: number, cy: number, arriba: boolean, op: number) =>
    [
      [1, 0],
      [-1, 0],
      [0, 1],
      ...(arriba ? [[0, -1]] : []),
    ].map(([dx, dy], i) => (
      <line key={i} x1={cx} y1={cy} x2={cx + dx * 80} y2={cy + dy * 80} stroke={C.yellow} strokeWidth={6} opacity={op} />
    ));
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.atraen, T.moneda2], [1, 1.04])}>
        <rect x={100} y={800} width={880} height={640} fill={AGUA} opacity={0.35} />
        <path d="M 100 800 L 980 800" stroke="#DDF4FF" strokeWidth={8 + 6 * aparece(t, T.piel)} />
        {new Array(24).fill(0).map((_, k) => (
          <circle key={k} cx={180 + (k % 6) * 145} cy={830 + Math.floor(k / 6) * 150} r={34} fill={AGUA} stroke="#DDF4FF" strokeWidth={3} />
        ))}
        <g opacity={1 - sup}>{flechas(470, 1130, true, aparece(t, T.atraen))}</g>
        <g opacity={sup}>
          {flechas(470, 830, false, aparece(t, T.vecinas))}
          <circle cx={470} cy={830} r={40} fill="none" stroke={C.yellow} strokeWidth={6} />
        </g>
        <Texto x={540} y={620} size={38} color={C.white} op={aparece(t, T.atraen) * (1 - sup)}>
          las moléculas se atraen
        </Texto>
        <Texto x={540} y={620} size={36} color={C.white} op={aparece(t, T.vecinas)}>
          arriba no hay vecinas: la jalan adentro
        </Texto>
        <Texto x={540} y={720} size={40} color={C.yellow} op={aparece(t, T.tension)}>
          tensión superficial
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.tension} color={C.yellow} />
    </>
  );
};

// D. Con cada moneda la piel se estira por encima del borde: un domo; hasta que su peso vence y se desborda
export const Domo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const d = interpolate(t, [T.moneda2, T.domo + 0.5], [0.3, 1.3], clamp);
  const der = interpolate(t, [T.desborda, T.desborda + 0.6], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.moneda2, T.jabon], [1, 1.04])}>
        <Copa t={t} domo={d} derrame={der} monedas={8} />
        <Texto x={540} y={620} size={40} color={C.white} op={aparece(t, T.domo) * (1 - der)}>
          un domo sobre el borde
        </Texto>
        <Texto x={540} y={620} size={40} color={C.orange} op={der}>
          el peso vence: se desborda
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.desborda} color={AGUA} />
    </>
  );
};

// E. Una gota de jabón debilita la piel y el domo se derrama de golpe
export const Jabon: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const gota = interpolate(t, [T.jabon, T.golpe], [0, 1], clamp);
  const der = interpolate(t, [T.golpe, T.golpe + 0.4], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.jabon, T.porEso], [1, 1.04])}>
        <Copa t={t} domo={1} derrame={der} monedas={8} />
        {der < 1 ? <path d={`M 540 ${560 + 200 * gota} q -20 30 0 50 q 20 -20 0 -50 Z`} fill="#F070C0" /> : null}
        <Texto x={540} y={500} size={38} color="#F070C0" op={aparece(t, T.jabon)}>
          una gota de jabón
        </Texto>
        <Texto x={540} y={1530} size={40} color={C.yellow} op={der}>
          ¡se derrama de golpe!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.golpe} color="#F070C0" />
    </>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
