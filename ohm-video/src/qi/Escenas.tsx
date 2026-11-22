import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/qi/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  dejas: 2.14, // dejas
  base: 2.78, // base
  final: 5.06, // final
  dentro: 7.04, // dentro
  bobina: 8.22, // bobina
  alterna: 10.32, // alterna
  campo: 12.26, // campo
  direccion: 13.68, // direccion
  miles: 14.10, // miles
  celular: 16.44, // celular
  atraviesa: 19.04, // atraviesa
  induce: 19.86, // induce
  circuito: 21.74, // circuito
  bateria: 23.48, // bateria
  alineadas: 25.40, // alineadas
  anillo: 27.28, // anillo
  encajen: 28.34, // encajen
  energia: 30.06, // energia
  calor: 31.22, // calor
  lento: 32.66, // lento
  asi: 34.06, // asi
  fin: 35.88, // FIN
};

const COBRE = "#E08A4A";

// Celular visto de frente con batería
const Celular: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly carga?: number }> = ({ x, y, s = 1, carga = -1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-150} y={-300} width={300} height={600} rx={40} fill="#1A1A22" stroke="#5A5A66" strokeWidth={8} />
    <rect x={-130} y={-270} width={260} height={540} rx={24} fill="#2A2440" />
    {carga >= 0 ? (
      <g>
        <rect x={-50} y={-80} width={100} height={170} rx={12} fill="none" stroke="#fff" strokeWidth={8} />
        <rect x={-20} y={-96} width={40} height={16} rx={4} fill="#fff" />
        <rect x={-38} y={78 - 146 * carga} width={76} height={146 * carga} rx={6} fill="#5AD08A" />
        <path d="M 10 -40 L -15 10 L 5 10 L -10 50" stroke={C.yellow} strokeWidth={8} fill="none" opacity={carga > 0 ? 1 : 0} />
      </g>
    ) : null}
  </g>
);

// Bobina plana vista de lado (corte): espiras como puntos
const BobinaCorte: React.FC<{ readonly x: number; readonly y: number; readonly corriente: number; readonly t: number; readonly w?: number }> = ({ x, y, corriente, t, w = 360 }) => (
  <g>
    {new Array(8).fill(0).map((_, k) => {
      const dx = -w / 2 + (k * w) / 7;
      const signo = (dx < 0 ? 1 : -1) * Math.sign(Math.sin(t * 6)) * corriente;
      return (
        <g key={k}>
          <circle cx={x + dx} cy={y} r={16} fill={COBRE} />
          {corriente > 0 ? (
            signo > 0 ? <circle cx={x + dx} cy={y} r={5} fill="#111" /> : <path d={`M ${x + dx - 6} ${y - 6} L ${x + dx + 6} ${y + 6} M ${x + dx + 6} ${y - 6} L ${x + dx - 6} ${y + 6}`} stroke="#111" strokeWidth={3} />
          ) : null}
        </g>
      );
    })}
  </g>
);

// Líneas de campo magnético sobre la bobina; dir = signo
const Campo: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly op: number; readonly alto?: number }> = ({ x, y, t, op, alto = 1 }) => {
  const dir = Math.sin(t * 6);
  return (
    <g opacity={op * Math.abs(dir) ** 0.5}>
      {[90, 150, 210].map((r, k) => (
        <g key={k}>
          <path d={`M ${x - 40} ${y} C ${x - 40} ${y - r * 2 * alto}, ${x - r * 1.6} ${y - r * 1.4 * alto}, ${x - r * 1.4} ${y}`} stroke={C.cyan} strokeWidth={5} fill="none" />
          <path d={`M ${x + 40} ${y} C ${x + 40} ${y - r * 2 * alto}, ${x + r * 1.6} ${y - r * 1.4 * alto}, ${x + r * 1.4} ${y}`} stroke={C.cyan} strokeWidth={5} fill="none" />
        </g>
      ))}
      <path d={dir > 0 ? `M ${x - 20} ${y - 260 * alto} L ${x} ${y - 300 * alto} L ${x + 20} ${y - 260 * alto}` : `M ${x - 20} ${y - 300 * alto} L ${x} ${y - 260 * alto} L ${x + 20} ${y - 300 * alto}`} stroke={C.cyan} strokeWidth={8} fill="none" />
    </g>
  );
};

const Base: React.FC<{ readonly x: number; readonly y: number; readonly brillo?: number }> = ({ x, y, brillo = 0 }) => (
  <g>
    <ellipse cx={x} cy={y} rx={260} ry={60} fill="#3A3A44" />
    <ellipse cx={x} cy={y - 14} rx={250} ry={52} fill="#5A5A66" />
    <ellipse cx={x} cy={y - 14} rx={120} ry={24} fill="none" stroke={C.cyan} strokeWidth={5} opacity={brillo} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Base x={540} y={1250} brillo={0.6 + 0.4 * Math.sin(t * 4)} />
    <Celular x={540} y={900} s={0.9} carga={0.6} />
    <Texto x={860} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo carga sin cable este celular?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.dejas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Lo dejas sobre una base y carga sin cable + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const baja = interpolate(t, [T.dejas, T.base], [-260, 0], clamp);
  const carga = interpolate(t, [T.base, T.dentro], [0.1, 0.5], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.dejas, T.dentro], [1, 1.04])}>
      <Base x={540} y={1250} brillo={t > T.base ? 1 : 0} />
      <Celular x={540} y={900 + baja} s={0.9} carga={t > T.base ? carga : 0} />
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿por qué se calienta?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.dentro], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Dentro de la base: bobina de cobre con corriente alterna; campo que cambia miles de veces por segundo
export const Bobina: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.dentro, T.celular], [1, 1.04])}>
      <g opacity={aparece(t, T.dentro)}>
        {new Array(7).fill(0).map((_, k) => (
          <ellipse key={k} cx={540} cy={1200} rx={60 + k * 30} ry={(60 + k * 30) * 0.3} fill="none" stroke={COBRE} strokeWidth={10} />
        ))}
        <Texto x={540} y={1420} size={36} color={COBRE}>
          bobina de cobre
        </Texto>
      </g>
      <g opacity={aparece(t, T.alterna)}>
        <path
          d={`M 200 1520 ${new Array(60)
            .fill(0)
            .map((_, i) => `L ${200 + i * 11.5} ${1520 + 30 * Math.sin(i * 0.5 - t * 8)}`)
            .join(" ")}`}
          stroke={C.yellow}
          strokeWidth={5}
          fill="none"
        />
        <Texto x={540} y={1590} size={30} color={C.yellow}>
          corriente alterna
        </Texto>
      </g>
      <Campo x={540} y={1180} t={t} op={aparece(t, T.campo)} />
      <Texto x={540} y={580} size={38} color={C.cyan} op={aparece(t, T.direccion)}>
        el campo cambia de dirección
      </Texto>
      <Texto x={540} y={640} size={34} color={C.white} op={aparece(t, T.miles)}>
        miles de veces por segundo
      </Texto>
    </Lienzo>
  );
};

// D. Otra bobina en el celular: el campo la atraviesa e induce corriente; un circuito carga la batería
export const Induccion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ind = aparece(t, T.induce);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.celular, T.alineadas], [1, 1.04])}>
        <rect x={300} y={720} width={480} height={70} rx={20} fill="#1A1A22" stroke="#5A5A66" strokeWidth={6} />
        <Texto x={540} y={690} size={32} color={C.white}>
          celular
        </Texto>
        <BobinaCorte x={540} y={755} corriente={ind} t={t} w={320} />
        <rect x={300} y={1080} width={480} height={70} rx={20} fill="#3A3A44" />
        <Texto x={540} y={1200} size={32} color={C.grey}>
          base
        </Texto>
        <BobinaCorte x={540} y={1115} corriente={1} t={t} w={320} />
        <g opacity={aparece(t, T.atraviesa)}>
          {[-120, -40, 40, 120].map((dx) => (
            <line key={dx} x1={540 + dx} y1={1080} x2={540 + dx} y2={790} stroke={C.cyan} strokeWidth={5} strokeDasharray="14 10" strokeDashoffset={Math.sin(t * 6) > 0 ? -t * 80 : t * 80} />
          ))}
        </g>
        <Texto x={540} y={940} size={36} color={C.yellow} op={ind}>
          ¡corriente inducida!
        </Texto>
        <g opacity={aparece(t, T.circuito)}>
          <rect x={820} y={560} width={120} height={80} rx={10} fill="#2A6A3A" />
          <Texto x={880} y={612} size={26} color="#fff">
            chip
          </Texto>
          <path d="M 780 740 L 880 740 L 880 640" stroke={C.yellow} strokeWidth={6} fill="none" />
        </g>
        <g opacity={aparece(t, T.bateria)}>
          <Celular x={880} y={1440} s={0.35} carga={interpolate(t, [T.bateria, T.alineadas], [0.3, 0.8], clamp)} />
        </g>
      </Lienzo>
      <Flash t={t} d={T.induce} color={C.yellow} />
    </>
  );
};

// E. Las bobinas deben estar alineadas: MagSafe usa un anillo de imanes
export const Alinea: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const enc = interpolate(t, [T.encajen - 0.3, T.encajen + 0.3], [0, 1], clamp);
  const dx = 200 * (1 - enc);
  return (
    <Lienzo zoom={interpolate(t, [T.alineadas, T.energia], [1, 1.04])}>
      <g opacity={0.9}>
        {new Array(6).fill(0).map((_, k) => (
          <circle key={k} cx={540} cy={1000} r={50 + k * 30} fill="none" stroke={COBRE} strokeWidth={8} />
        ))}
      </g>
      <g opacity={aparece(t, T.anillo)}>
        {new Array(16).fill(0).map((_, k) => {
          const a = (k / 16) * Math.PI * 2;
          return <rect key={k} x={540 + Math.cos(a) * 250 - 14} y={1000 + Math.sin(a) * 250 - 14} width={28} height={28} fill={C.red} transform={`rotate(${(a * 180) / Math.PI} ${540 + Math.cos(a) * 250} ${1000 + Math.sin(a) * 250})`} />;
        })}
      </g>
      <g transform={`translate(${dx} ${-dx * 0.3})`} opacity={0.85}>
        {new Array(6).fill(0).map((_, k) => (
          <circle key={k} cx={540} cy={1000} r={50 + k * 30} fill="none" stroke={C.yellow} strokeWidth={5} strokeDasharray="10 8" />
        ))}
        <g opacity={aparece(t, T.anillo)}>
          {new Array(16).fill(0).map((_, k) => {
            const a = (k / 16) * Math.PI * 2;
            return <circle key={k} cx={540 + Math.cos(a) * 250} cy={1000 + Math.sin(a) * 250} r={10} fill="#8A8A96" />;
          })}
        </g>
      </g>
      <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.alineadas)}>
        tienen que estar alineadas
      </Texto>
      <Texto x={540} y={1400} size={38} color={C.red} op={aparece(t, T.anillo)}>
        MagSafe: anillo de imanes
      </Texto>
      <Texto x={540} y={1470} size={36} color="#5AD08A" op={enc}>
        ¡encaja solo!
      </Texto>
    </Lienzo>
  );
};

// F. Parte de la energía se pierde como calor: carga más lento y se calienta
export const Calor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.energia, T.asi], [1, 1.04])}>
        <Base x={540} y={1250} brillo={1} />
        <Celular x={540} y={900} s={0.9} carga={0.7} />
        <g opacity={aparece(t, T.calor)}>
          {[-200, -100, 0, 100, 200].map((dx, k) => (
            <path key={dx} d={`M ${540 + dx} ${600 - ((t * 60 + k * 20) % 60)} q 20 -30 0 -60 q -20 -30 0 -60`} stroke={C.red} strokeWidth={8} fill="none" opacity={0.7} />
          ))}
          <Texto x={540} y={1400} size={44} color={C.red}>
            energía perdida = calor
          </Texto>
        </g>
        <Texto x={540} y={1480} size={38} color={C.white} op={aparece(t, T.lento)}>
          carga más lento
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.calor} color={C.red} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
