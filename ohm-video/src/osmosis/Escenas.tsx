import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/osmosis/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  echas: 2.12, // echas
  cortada: 3.26, // cortada
  gotitas: 5.48, // gotitas
  final: 6.50, // final
  celulas: 10.90, // celulas
  membranas: 12.96, // membranas
  sal: 14.00, // sal
  salada: 16.18, // salada
  moverse: 17.72, // moverse
  igualar: 20.80, // igualar
  osmosis: 23.02, // osmosis
  sale: 24.54, // sale
  superficie: 26.46, // superficie
  carne: 27.60, // carne
  esperas: 29.32, // esperas
  disuelve: 30.56, // disuelve
  salmuera: 32.14, // salmuera
  sazona: 34.20, // sazona
  porEso: 34.56, // por
  fin: 37.02, // FIN
};

const PULPA = "#E8E0B0";
const AGUA = "#5AB8F0";

const Gotas: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly op: number; readonly n?: number }> = ({ x, y, r, op, n = 14 }) => (
  <g opacity={op}>
    {new Array(n).fill(0).map((_, k) => {
      const a = k * 2.4;
      const d = r * Math.sqrt((k + 0.5) / n);
      return <circle key={k} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d * 0.9} r={9 + (k % 3) * 3} fill="#C8E8FF" stroke="#fff" strokeWidth={2} opacity={0.9} />;
    })}
  </g>
);

// Rodaja de berenjena
const Rodaja: React.FC<{ readonly x: number; readonly y: number; readonly r?: number; readonly sal?: number; readonly gotas?: number }> = ({ x, y, r = 300, sal = 0, gotas = 0 }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#4A2A5A" />
    <circle cx={x} cy={y} r={r - 18} fill={PULPA} />
    {new Array(10).fill(0).map((_, k) => (
      <ellipse key={k} cx={x + Math.cos(k * 0.63) * r * 0.4} cy={y + Math.sin(k * 0.63) * r * 0.4} rx={8} ry={12} fill="#C8B880" />
    ))}
    <g opacity={sal}>
      {new Array(40).fill(0).map((_, k) => (
        <rect key={k} x={x - r * 0.7 + ((k * 97) % (r * 1.4))} y={y - r * 0.7 + ((k * 61) % (r * 1.4))} width={10} height={10} fill="#fff" transform={`rotate(${k * 20} ${x} ${y})`} />
      ))}
    </g>
    <Gotas x={x} y={y} r={r * 0.75} op={gotas} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Rodaja x={540} y={1000} sal={1} gotas={0.85 + 0.15 * Math.sin(t * 2)} />
    <Texto x={540} y={560} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta berenjena suda?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.echas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Echas sal a una berenjena cortada y se cubre de gotitas + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.echas, T.celulas], [1, 1.04])}>
      <Rodaja x={540} y={1000} sal={aparece(t, T.echas)} gotas={interpolate(t, [T.gotitas - 0.6, T.gotitas + 0.4], [0, 1], clamp)} />
      <g opacity={aparece(t, T.echas) * (1 - aparece(t, T.gotitas))}>
        {new Array(8).fill(0).map((_, k) => {
          const u = (t * 1.5 + k / 8) % 1;
          return <rect key={k} x={420 + ((k * 37) % 240)} y={560 + u * 300} width={10} height={10} fill="#fff" />;
        })}
      </g>
      <Texto x={540} y={1420} size={40} color="#C8E8FF" op={aparece(t, T.gotitas)}>
        ¡se cubre de gotitas!
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿por qué la carne lo reabsorbe?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.celulas], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// Fila de células; enco = encogimiento 0..1; flechas = agua saliendo
const Celulas: React.FC<{ readonly t: number; readonly enco: number; readonly flechas: number; readonly sal: number }> = ({ t, enco, flechas, sal }) => (
  <g>
    <rect x={90} y={620} width={900} height={200} fill={AGUA} opacity={0.25 * sal} />
    {new Array(Math.round(30 * sal)).fill(0).map((_, k) => (
      <rect key={k} x={110 + ((k * 89) % 860)} y={640 + ((k * 53) % 160)} width={10} height={10} fill="#fff" />
    ))}
    {new Array(8).fill(0).map((_, k) => {
      const i = k % 4;
      const j = Math.floor(k / 4);
      const cx = 220 + i * 215;
      const cy = 960 + j * 230;
      const w = 180 * (1 - enco * 0.18);
      const h = 200 * (1 - enco * 0.18);
      return (
        <g key={k}>
          <rect x={cx - 95} y={cy - 105} width={190} height={210} rx={30} fill="none" stroke="#8AA83A" strokeWidth={6} />
          <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={26} fill={AGUA} opacity={0.6} stroke="#C8E870" strokeWidth={4} />
          {j === 0 && flechas > 0 ? (
            <path d={`M ${cx} ${cy - 80 - ((t * 60) % 60)} l 0 -50 m -15 15 l 15 -15 l 15 15`} stroke={AGUA} strokeWidth={8} fill="none" opacity={flechas} />
          ) : null}
        </g>
      );
    })}
  </g>
);

// C. Células llenas de agua, envueltas en membranas; la sal forma afuera agua muy salada
export const CelulasEsc: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.celulas, T.moverse], [1, 1.04])}>
      <Celulas t={t} enco={0} flechas={0} sal={aparece(t, T.sal)} />
      <Texto x={540} y={1440} size={38} color={AGUA} op={aparece(t, T.celulas)}>
        células llenas de agua
      </Texto>
      <Texto x={540} y={1500} size={34} color="#C8E870" op={aparece(t, T.membranas)}>
        envueltas en membranas
      </Texto>
      <Texto x={540} y={580} size={38} color={C.white} op={aparece(t, T.salada)}>
        afuera: agua muy salada
      </Texto>
    </Lienzo>
  );
};

// D. El agua se mueve hacia donde hay más sal: ósmosis; sale de las células a la superficie
export const Osmosis: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const enco = interpolate(t, [T.moverse, T.superficie], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.moverse, T.carne], [1, 1.04])}>
        <Celulas t={t} enco={enco} flechas={aparece(t, T.moverse)} sal={1} />
        <Texto x={540} y={1440} size={36} color={C.white} op={aparece(t, T.igualar)}>
          para igualar la sal
        </Texto>
        <Texto x={540} y={580} size={56} color={C.yellow} op={aparece(t, T.osmosis) * (1 - aparece(t, T.superficie))}>
          ósmosis
        </Texto>
        <Gotas x={540} y={590} r={380} op={aparece(t, T.superficie)} n={18} />
        <Texto x={540} y={1510} size={36} color="#C8E8FF" op={aparece(t, T.superficie)}>
          el agua sale a la superficie
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.osmosis} color={C.yellow} />
    </>
  );
};

const FORMA_FILETE = (x: number, y: number) =>
  `M ${x - 320} ${y} Q ${x - 340} ${y - 180} ${x - 100} ${y - 200} Q ${x + 200} ${y - 240} ${x + 320} ${y - 80} Q ${x + 360} ${y + 120} ${x + 60} ${y + 160} Q ${x - 300} ${y + 180} ${x - 320} ${y} Z`;

// Filete de carne; dentro = color de sazón interior
const Filete: React.FC<{ readonly x: number; readonly y: number; readonly sal: number; readonly liquido: number; readonly dentro: number }> = ({ x, y, sal, liquido, dentro }) => (
  <g>
    <path d={FORMA_FILETE(x, y)} fill="#B83A3A" />
    <path d={`M ${x - 200} ${y - 60} Q ${x} ${y - 120} ${x + 200} ${y - 20}`} stroke="#F0D0C0" strokeWidth={18} fill="none" opacity={0.8} />
    <path d={FORMA_FILETE(x, y)} fill="#8A2A4A" opacity={dentro * 0.45} />
    <g opacity={sal}>
      {new Array(30).fill(0).map((_, k) => (
        <rect key={k} x={x - 260 + ((k * 97) % 520)} y={y - 170 + ((k * 61) % 300)} width={9} height={9} fill="#fff" />
      ))}
    </g>
    <Gotas x={x} y={y - 20} r={260} op={liquido} n={16} />
  </g>
);

// E. En la carne pasa igual, pero si esperas la sal se disuelve y la salmuera vuelve a entrar y la sazona
export const Carne: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const reabs = interpolate(t, [T.salmuera, T.sazona + 0.6], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.carne, T.porEso], [1, 1.04])}>
        <Filete x={540} y={1000} sal={1 - aparece(t, T.disuelve)} liquido={aparece(t, T.carne) * (1 - reabs)} dentro={reabs} />
        <g opacity={aparece(t, T.esperas)} transform="translate(860 620)">
          <circle cx={0} cy={0} r={70} fill="none" stroke={C.white} strokeWidth={8} />
          <line x1={0} y1={0} x2={45 * Math.sin(t * 2)} y2={-45 * Math.cos(t * 2)} stroke={C.white} strokeWidth={8} strokeLinecap="round" />
          <Texto x={0} y={130} size={30} color={C.white}>
            espera
          </Texto>
        </g>
        <Texto x={540} y={1300} size={38} color={AGUA} op={aparece(t, T.salmuera)}>
          la salmuera vuelve a entrar
        </Texto>
        <Texto x={540} y={1380} size={40} color={C.yellow} op={aparece(t, T.sazona)}>
          sazonada por dentro
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.sazona} color={C.yellow} />
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
