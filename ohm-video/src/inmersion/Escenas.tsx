import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/inmersion/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  cara: 2.56, // cara
  lento: 4.80, // lento
  final: 6.38, // final
  calmarte: 8.14, // calmarte
  reflejo: 9.34, // reflejo
  focas: 11.50, // focas
  nervios: 13.36, // nervios
  cerebro: 16.02, // cerebro
  bajo: 17.02, // bajo
  frena2: 19.40, // frena
  oxigeno: 20.56, // ox
  vasos: 21.76, // vasos
  cierran: 23.70, // cierran
  cerebro2: 25.62, // cerebro
  bazo: 27.40, // bazo
  globulos: 29.10, // gl
  terapeutas: 31.98, // terapeutas
  ansiedad: 34.90, // ansiedad
  porEso: 35.72, // por
  fin: 37.38, // FIN
};

const ROJO = "#E05050";
const FRIA = "#3AB8E8";

const Corazon: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly t: number; readonly bpm: number }> = ({ x, y, s = 1, t, bpm }) => {
  const f = bpm / 60;
  const lat = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2 * f)), 8);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (1 + 0.1 * lat)})`}>
      <path d="M 0 80 C -150 -20 -110 -140 0 -70 C 110 -140 150 -20 0 80 Z" fill={ROJO} />
    </g>
  );
};

// Trazo de electrocardiograma con frecuencia bpm
const Ecg: React.FC<{ readonly y: number; readonly t: number; readonly bpm: number; readonly col?: string }> = ({ y, t, bpm, col = "#5AD08A" }) => {
  const per = (60 / bpm) * 220;
  const pts: string[] = [];
  for (let x = 140; x <= 940; x += 6) {
    const u = (((x + t * 220) % per) + per) % per;
    const pico = u > 40 && u < 70 ? (u < 55 ? -(u - 40) * 6 : -(70 - u) * 6) : 0;
    pts.push(`${x},${y + pico}`);
  }
  return <polyline points={pts.join(" ")} fill="none" stroke={col} strokeWidth={5} />;
};

const Cara: React.FC<{ readonly x: number; readonly y: number; readonly hundida: number }> = ({ x, y, hundida }) => (
  <g>
    <g transform={`translate(${x} ${y + 120 * hundida}) rotate(${-70 * hundida})`}>
      <ellipse cx={0} cy={0} rx={110} ry={140} fill="#E8B48A" />
      <circle cx={50} cy={-20} r={10} fill="#2A2A2A" />
      <path d="M 40 60 q 20 10 40 0" stroke="#3A2A20" strokeWidth={6} fill="none" />
    </g>
    <rect x={x - 230} y={y + 110} width={460} height={240} rx={30} fill={FRIA} opacity={0.6} />
    {[0, 1, 2].map((k) => (
      <rect key={k} x={x - 170 + k * 120} y={y + 130 + 10 * k} width={60} height={60} rx={10} fill="#E8F6FF" opacity={0.8} />
    ))}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Corazon x={540} y={1000} s={1.8} t={t} bpm={50} />
    <Ecg y={1360} t={t} bpm={50} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este corazón se frena?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.cara], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Cara en agua helada: el corazón late más lento al instante + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const h = interpolate(t, [T.cara, T.cara + 0.8], [0, 1], clamp);
  const bpm = interpolate(t, [T.lento, T.lento + 1], [80, 50], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.cara, T.reflejo], [1, 1.04])}>
      <Cara x={540} y={820} hundida={h} />
      <Ecg y={1340} t={t} bpm={bpm} />
      <Texto x={540} y={1450} size={40} color={C.yellow} op={aparece(t, T.lento)}>
        {`${Math.round(bpm)} latidos/min`}
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          cómo te calma: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.reflejo], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Reflejo de inmersión, como focas y ballenas; nervios de la cara avisan al cerebro
export const Reflejo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const nerv = interpolate(t, [T.nervios, T.cerebro], [0, 1], clamp);
  const focas = aparece(t, T.focas) * (1 - aparece(t, T.nervios));
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.reflejo, T.frena2], [1, 1.04])}>
        <Texto x={540} y={620} size={40} color={C.white} op={aparece(t, T.reflejo)}>
          reflejo de inmersión
        </Texto>
        <g opacity={focas} transform="translate(540 1000)">
          <ellipse cx={0} cy={0} rx={260} ry={90} fill="#7A8A9A" />
          <circle cx={230} cy={-40} r={70} fill="#7A8A9A" />
          <circle cx={260} cy={-60} r={10} fill="#1A1A1A" />
          <path d="M -250 0 l -90 -60 l 0 120 Z" fill="#7A8A9A" />
          <Texto x={0} y={180} size={34} color={C.white}>
            como focas y ballenas
          </Texto>
        </g>
        <g opacity={aparece(t, T.nervios)}>
          <ellipse cx={400} cy={1080} rx={140} ry={180} fill="#E8B48A" />
          <ellipse cx={720} cy={820} rx={150} ry={110} fill="#E8A0B0" />
          <Texto x={720} y={830} size={30} color="#3A2A30">
            cerebro
          </Texto>
          <path d="M 440 1100 Q 560 1060 620 900" stroke={C.yellow} strokeWidth={6} fill="none" strokeDasharray="1000" strokeDashoffset={1000 * (1 - nerv)} />
          <Texto x={600} y={1300} size={34} color={C.yellow} op={aparece(t, T.bajo)}>
            «¡estás bajo el agua!»
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.reflejo} color={FRIA} />
    </>
  );
};

// D. El corazón se frena; los vasos de brazos y piernas se cierran: la sangre se queda para cerebro y corazón
export const Ahorra: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const c = aparece(t, T.cierran);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.frena2, T.bazo], [1, 1.04])}>
        <g transform="translate(540 1000)">
          <circle cx={0} cy={-300} r={80} fill="#3A3A50" stroke="#8A90A0" strokeWidth={6} />
          <rect x={-90} y={-210} width={180} height={320} rx={40} fill="#3A3A50" stroke="#8A90A0" strokeWidth={6} />
          {[-1, 1].map((d) => (
            <g key={d}>
              <rect x={d * 120 - 25} y={-200} width={50} height={280} rx={24} fill="#3A3A50" stroke="#8A90A0" strokeWidth={6} />
              <rect x={d * 50 - 25} y={120} width={50} height={300} rx={24} fill="#3A3A50" stroke="#8A90A0" strokeWidth={6} />
              <line x1={d * 120} y1={-180} x2={d * 120} y2={60} stroke={ROJO} strokeWidth={14 - 10 * c} />
              <line x1={d * 50} y1={140} x2={d * 50} y2={400} stroke={ROJO} strokeWidth={14 - 10 * c} />
            </g>
          ))}
          <line x1={0} y1={-260} x2={0} y2={-120} stroke={ROJO} strokeWidth={14 + 8 * aparece(t, T.cerebro2)} />
          <circle cx={0} cy={-300} r={40} fill={ROJO} opacity={0.3 + 0.5 * aparece(t, T.cerebro2)} />
          <Corazon x={0} y={-80} s={0.4} t={t} bpm={50} />
        </g>
        <Texto x={540} y={620} size={38} color={C.white} op={aparece(t, T.frena2)}>
          el corazón se frena: ahorra oxígeno
        </Texto>
        <Texto x={800} y={1180} size={30} color={C.orange} op={aparece(t, T.vasos)}>
          brazos y piernas: se cierran
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.frena2} color={ROJO} />
    </>
  );
};

// E. El bazo suelta más glóbulos rojos; terapeutas lo usan para bajar una crisis de ansiedad
export const Bazo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const gl = aparece(t, T.globulos);
  const ter = aparece(t, T.terapeutas);
  return (
    <Lienzo zoom={interpolate(t, [T.bazo, T.porEso], [1, 1.04])}>
      <g opacity={1 - ter}>
        <ellipse cx={540} cy={980} rx={200} ry={110} fill="#A04060" transform={`scale(${1 - 0.15 * gl}) translate(${540 * 0.15 * gl} ${980 * 0.15 * gl})`} />
        <Texto x={540} y={990} size={36} color={C.white}>
          bazo
        </Texto>
        {gl > 0
          ? new Array(10).fill(0).map((_, k) => {
              const u = (t * 0.5 + k / 10) % 1;
              return <ellipse key={k} cx={540 + Math.cos(k * 0.63) * (220 + 260 * u)} cy={980 + Math.sin(k * 0.63) * (130 + 200 * u)} rx={24} ry={14} fill={ROJO} opacity={gl * (1 - u)} />;
            })
          : null}
        <Texto x={540} y={1400} size={34} color={C.yellow} op={gl}>
          más glóbulos rojos para el oxígeno
        </Texto>
      </g>
      <g opacity={ter}>
        <Cara x={540} y={820} hundida={0.6} />
        <Ecg y={1340} t={t} bpm={interpolate(t, [T.terapeutas, T.ansiedad + 1], [110, 65], clamp)} />
        <Texto x={540} y={1450} size={36} color={C.yellow} op={aparece(t, T.ansiedad)}>
          baja una crisis de ansiedad
        </Texto>
      </g>
    </Lienzo>
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
