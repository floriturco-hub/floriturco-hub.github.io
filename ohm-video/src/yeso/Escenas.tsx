import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/yeso/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  sierra: 1.90, // sierra
  durisimo: 3.76, // durisimo
  brazo: 5.50, // brazo
  final: 7.18, // final
  truco: 9.84, // truco
  gira: 11.28, // gira
  vibra: 11.94, // vibra
  milimetros: 14.00, // milimetros
  miles: 14.86, // miles
  rigido: 17.48, // rigido
  raspan: 20.66, // raspan
  pulverizando: 21.52, // pulverizando
  elastica: 23.36, // elastica
  mueve: 26.04, // mueve
  cortarla: 29.22, // cortarla
  friccion: 30.34, // friccion
  calienta: 30.76, // calienta
  quemar: 34.26, // quemar
  porEso: 35.38, // por
  fin: 36.90, // FIN
};

const PIEL = "#E0A888";
const YESO = "#F0F0F4";

// Disco de sierra oscilante; ang en grados; calor 0..1
const Disco: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly ang: number; readonly calor?: number }> = ({ x, y, r, ang, calor = 0 }) => {
  const col = `rgb(${190 + calor * 65}, ${190 - calor * 100}, ${200 - calor * 160})`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      <path
        d={new Array(48)
          .fill(0)
          .map((_, i) => {
            const a = (i / 48) * Math.PI * 2;
            const rr = i % 2 ? r : r + 14;
            return `${i ? "L" : "M"} ${Math.cos(a) * rr} ${Math.sin(a) * rr}`;
          })
          .join(" ")}
        fill={col}
      />
      <circle cx={0} cy={0} r={r * 0.3} fill="#5A5A66" />
      <line x1={0} y1={-r * 0.8} x2={0} y2={-r * 0.35} stroke="#5A5A66" strokeWidth={8} />
    </g>
  );
};

const Mango: React.FC<{ readonly x: number; readonly y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 50} y={y - 520} width={100} height={420} rx={40} fill="#4A6AC8" />
    <rect x={x - 30} y={y - 110} width={60} height={110} fill="#8A8A96" />
  </g>
);

// Antebrazo horizontal con yeso; yeso 0..1 visible; corte = ancho de la ranura
const Brazo: React.FC<{ readonly y: number; readonly yeso?: number; readonly hunde?: number; readonly hx?: number }> = ({ y, yeso = 1, hunde = 0, hx = 540 }) => (
  <g>
    <path d={`M 0 ${y - 110} L ${hx - 120} ${y - 110} Q ${hx} ${y - 110 + hunde * 30} ${hx + 120} ${y - 110} L 1080 ${y - 100} L 1080 ${y + 110} L 0 ${y + 110} Z`} fill={PIEL} />
    <rect x={120} y={y - 150} width={840} height={300} rx={60} fill={YESO} opacity={yeso} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Brazo y={1180} yeso={0} hunde={0.6 + 0.4 * Math.sin(t * 60)} />
    <Mango x={540} y={820} />
    <Disco x={540} y={940} r={130} ang={6 * Math.sin(t * 60)} />
    <Texto x={860} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo no corta esta piel?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.sierra], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. La sierra corta el yeso durísimo, pero si toca tu brazo no te corta + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const piel = aparece(t, T.brazo);
  return (
    <Lienzo zoom={interpolate(t, [T.sierra, T.truco], [1, 1.04])}>
      <Brazo y={1180} yeso={1 - piel} hunde={piel * (0.6 + 0.4 * Math.sin(t * 60))} />
      {new Array(10).fill(0).map((_, k) => {
        const u = (t * 1.5 + k / 10) % 1;
        return <circle key={k} cx={540 + (k % 2 ? 1 : -1) * u * 160} cy={1030 - u * 120 + u * u * 200} r={6} fill={YESO} opacity={(1 - piel) * (1 - u)} />;
      })}
      <Mango x={540} y={820} />
      <Disco x={540} y={940} r={130} ang={6 * Math.sin(t * 60)} />
      <Texto x={540} y={1420} size={40} color={C.white} op={aparece(t, T.durisimo) * (1 - piel)}>
        corta el yeso duro
      </Texto>
      <Texto x={540} y={1420} size={42} color="#5AD08A" op={piel}>
        toca la piel… y no corta
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cuándo sí puede lastimar?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.truco], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. La cuchilla no gira: vibra de lado a lado, unos milímetros, miles de veces por minuto
export const Vibra: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rapido = aparece(t, T.miles);
  const ang = (t < T.vibra ? t * 120 : 0) + aparece(t, T.vibra) * 8 * Math.sin(t * (4 + 50 * rapido));
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.truco, T.rigido], [1, 1.04])}>
        <Disco x={540} y={950} r={260} ang={ang} />
        <g opacity={aparece(t, T.gira) * (1 - aparece(t, T.vibra))}>
          <Texto x={540} y={600} size={46} color={C.red}>
            ¿gira? ✗
          </Texto>
        </g>
        <g opacity={aparece(t, T.vibra)}>
          <path d="M 400 600 A 360 360 0 0 1 680 600" stroke={C.yellow} strokeWidth={8} fill="none" />
          <path d="M 400 600 l 30 -20 m -30 20 l 30 20 M 680 600 l -30 -20 m 30 20 l -30 20" stroke={C.yellow} strokeWidth={8} fill="none" />
          <Texto x={540} y={540} size={46} color={C.yellow}>
            vibra ↔
          </Texto>
        </g>
        <Texto x={540} y={1340} size={38} color={C.white} op={aparece(t, T.milimetros)}>
          apenas unos milímetros
        </Texto>
        <Texto x={540} y={1410} size={38} color={C.cyan} op={aparece(t, T.miles)}>
          miles de veces por minuto
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.vibra} color={C.yellow} />
    </>
  );
};

// D. El yeso es rígido: no se mueve con la cuchilla, los dientes lo raspan y pulverizan
export const Rigido: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ranura = interpolate(t, [T.raspan, T.elastica], [0, 120], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.rigido, T.elastica], [1, 1.04])}>
      <rect x={140} y={1000} width={800} height={320} fill={YESO} />
      <rect x={520} y={1000} width={40} height={ranura} fill="#0E0B1E" />
      <Disco x={540} y={860 + ranura} r={160} ang={8 * Math.sin(t * 60)} />
      {new Array(14).fill(0).map((_, k) => {
        const u = (t * 1.4 + k / 14) % 1;
        return <circle key={k} cx={540 + (k % 2 ? 1 : -1) * (30 + u * 200)} cy={1000 - u * 160 + u * u * 220} r={7} fill={YESO} opacity={aparece(t, T.pulverizando) * (1 - u)} />;
      })}
      <Texto x={540} y={1430} size={40} color={C.white} op={aparece(t, T.rigido)}>
        yeso rígido: no se mueve
      </Texto>
      <Texto x={540} y={1500} size={38} color={C.yellow} op={aparece(t, T.raspan)}>
        los dientes lo raspan
      </Texto>
    </Lienzo>
  );
};

// E. La piel es elástica: se mueve con la cuchilla de ida y vuelta, y no se corta
export const Elastica: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const osc = Math.sin(t * 8);
  const lado = aparece(t, T.mueve) * 60 * osc;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.elastica, T.friccion], [1.15, 1.2])} cy={1000}>
        <path
          d={`M 100 1100 ${new Array(40)
            .fill(0)
            .map((_, i) => {
              const x = 100 + i * 22;
              const d = Math.exp(-(((x - 540) / 160) ** 2));
              return `L ${x + lado * d} ${1100 + 30 * d}`;
            })
            .join(" ")} L 980 1400 L 100 1400 Z`}
          fill={PIEL}
        />
        {[0, 1, 2, 3, 4].map((k) => {
          const x = 300 + k * 120;
          const d = Math.exp(-(((x - 540) / 160) ** 2));
          return <circle key={k} cx={x + lado * d} cy={1160} r={6} fill="#B8876A" />;
        })}
        <Disco x={540 + lado} y={940} r={160} ang={osc * 10} />
        <Texto x={540} y={600} size={44} color={PIEL} op={aparece(t, T.elastica)}>
          la piel es elástica
        </Texto>
        <Texto x={540} y={1480} size={38} color={C.white} op={aparece(t, T.mueve)}>
          se mueve con la cuchilla ↔
        </Texto>
        <Texto x={540} y={1550} size={40} color="#5AD08A" op={aparece(t, T.cortarla)}>
          no se corta ✓
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.cortarla} color="#5AD08A" />
    </>
  );
};

// F. La fricción calienta la cuchilla: si se queda en un punto, puede quemar
export const Calor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cal = interpolate(t, [T.calienta, T.quemar], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.friccion, T.porEso], [1, 1.04])}>
        <Brazo y={1180} yeso={0} hunde={0.6} />
        <Mango x={540} y={820} />
        <Disco x={540} y={940} r={130} ang={6 * Math.sin(t * 60)} calor={cal} />
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M ${460 + k * 80} ${760 - ((t * 60 + k * 20) % 60)} q 20 -30 0 -60 q -20 -30 0 -60`} stroke={C.red} strokeWidth={8} fill="none" opacity={cal * 0.8} />
        ))}
        <Texto x={540} y={1420} size={40} color={C.orange} op={aparece(t, T.friccion)}>
          la fricción la calienta
        </Texto>
        <Texto x={540} y={1490} size={40} color={C.red} op={aparece(t, T.quemar)}>
          ¡puede quemar!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.quemar} color={C.red} />
    </>
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
