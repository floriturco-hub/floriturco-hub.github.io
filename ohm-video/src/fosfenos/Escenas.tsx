import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/fosfenos/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  frotas: 1.52, // frotas
  estrellas: 3.04, // estrellas
  colores: 3.90, // colores
  tableros: 4.84, // tableros
  final: 6.44, // final
  llaman: 9.06, // llaman
  fosfenos: 9.36, // fosfenos
  presionar: 10.80, // presionar
  deformas: 11.62, // deformas
  retina: 12.36, // retina
  capta: 14.02, // capta
  presion: 15.30, // presion
  estimula: 15.66, // estimula
  aunque: 16.76, // aunque
  mandan: 18.70, // mandan
  cerebro: 19.72, // cerebro
  tu: 20.44, // tu
  interpretar: 21.40, // interpretar
  manera: 23.42, // manera
  luz: 24.32, // luz
  formas: 25.24, // formas
  cuadriculas: 25.92, // cuadriculas
  espirales: 26.74, // espirales
  organizadas: 28.46, // organizadas
  corteza: 30.64, // corteza
  pero: 31.84, // pero
  fuerte: 32.60, // fuerte
  danar: 34.60, // danar
  eso: 35.66, // eso
  fin: 36.94, // FIN
};

const RETINA = "#E05A6A";

// Visión de fosfenos: estrellas, manchas de color y tablero
const Vision: React.FC<{ readonly t: number; readonly est?: number; readonly col?: number; readonly tab?: number; readonly cx?: number; readonly cy?: number; readonly r?: number }> = ({
  t,
  est = 1,
  col = 1,
  tab = 1,
  cx = 540,
  cy = 900,
  r = 380,
}) => (
  <g>
    <clipPath id={`vis${cx}${cy}`}>
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.8} />
    </clipPath>
    <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.8} fill="#0A0814" />
    <g clipPath={`url(#vis${cx}${cy})`}>
      <g opacity={tab * (0.5 + 0.3 * Math.sin(t * 2))} transform={`rotate(${t * 6} ${cx} ${cy})`}>
        {new Array(14).fill(0).map((_, i) =>
          new Array(14).fill(0).map((__, j) =>
            (i + j) % 2 ? null : <rect key={`${i}-${j}`} x={cx - 420 + i * 60} y={cy - 420 + j * 60} width={60} height={60} fill="#3A6AE0" opacity={0.6} />,
          ),
        )}
      </g>
      <g opacity={col}>
        {[
          ["#E04AA0", -120, -60],
          ["#4AE0C8", 140, 40],
          ["#E0C84A", -20, 120],
        ].map(([c, dx, dy], k) => (
          <circle key={k} cx={cx + (dx as number) + 30 * Math.sin(t * 1.3 + k)} cy={cy + (dy as number) + 20 * Math.cos(t + k)} r={110} fill={c as string} opacity={0.45} />
        ))}
      </g>
      <g opacity={est}>
        {new Array(24).fill(0).map((_, k) => {
          const x = cx + ((k * 137) % (r * 1.6)) - r * 0.8;
          const y = cy + ((k * 89) % (r * 1.2)) - r * 0.6;
          const s = 0.5 + 0.5 * Math.sin(t * 6 + k);
          return <path key={k} d={`M ${x} ${y - 14 * s} L ${x + 4} ${y} L ${x} ${y + 14 * s} L ${x - 4} ${y} Z M ${x - 14 * s} ${y} L ${x} ${y - 4} L ${x + 14 * s} ${y} L ${x} ${y + 4} Z`} fill="#fff" />;
        })}
      </g>
    </g>
  </g>
);

// Ojo cerrado con pestañas
const OjoCerrado: React.FC<{ readonly x: number; readonly y: number; readonly s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -200 0 Q 0 120 200 0" stroke="#C89A7A" strokeWidth={14} fill="none" strokeLinecap="round" />
    {[-140, -70, 0, 70, 140].map((dx) => (
      <line key={dx} x1={dx} y1={60 - Math.abs(dx) * 0.25} x2={dx * 1.15} y2={100 - Math.abs(dx) * 0.2} stroke="#3A2A22" strokeWidth={8} strokeLinecap="round" />
    ))}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Vision t={t} />
    <Texto x={540} y={1350} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿qué son estas luces?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.frotas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Te frotas los ojos cerrados y ves estrellas, colores y tableros + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.frotas, T.llaman], [1, 1.04])}>
      <g opacity={1 - aparece(t, T.estrellas)}>
        <OjoCerrado x={540} y={900} s={1.4} />
        <circle cx={540 + 60 * Math.sin(t * 10)} cy={820} r={70} fill="#C89A7A" />
      </g>
      <g opacity={aparece(t, T.estrellas)}>
        <Vision t={t} est={1} col={aparece(t, T.colores)} tab={aparece(t, T.tableros)} />
      </g>
      <Texto x={250} y={1300} size={34} color={C.white} op={aparece(t, T.estrellas)}>
        estrellas
      </Texto>
      <Texto x={540} y={1300} size={34} color="#E04AA0" op={aparece(t, T.colores)}>
        colores
      </Texto>
      <Texto x={830} y={1300} size={34} color="#3A6AE0" op={aparece(t, T.tableros)}>
        tableros
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿por qué esas formas?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.llaman], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Se llaman fosfenos
export const Nombre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.llaman, T.presionar], [1, 1.06])}>
        <Vision t={t} />
        <Texto x={540} y={1330} size={80} color={C.yellow} op={aparece(t, T.fosfenos)}>
          fosfenos
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.fosfenos} color={C.yellow} />
    </>
  );
};

// Corte del ojo; hund = deformación por presión
const Globo: React.FC<{ readonly hund: number; readonly brillo?: number }> = ({ hund, brillo = 0 }) => {
  const pts = new Array(73).fill(0).map((_, i) => {
    const a = (i / 72) * Math.PI * 2;
    const front = Math.max(0, Math.cos(a - Math.PI)) ** 6;
    const r = 300 - hund * 70 * front;
    return `${i ? "L" : "M"} ${540 + Math.cos(a) * r} ${900 + Math.sin(a) * r}`;
  });
  const ret = new Array(41).fill(0).map((_, i) => {
    const a = -Math.PI / 2.4 + (i / 40) * (Math.PI / 1.2);
    const r = 280 + hund * 12 * Math.cos(a) ** 8;
    return `${i ? "L" : "M"} ${540 + Math.cos(a) * r} ${900 + Math.sin(a) * r}`;
  });
  return (
    <g>
      <path d={`${pts.join(" ")} Z`} fill="#F0F0F4" />
      <path d={`${pts.join(" ")} Z`} fill="none" stroke="#C8C8D4" strokeWidth={6} />
      <ellipse cx={250} cy={900} rx={30} ry={120} fill="#6A4A2A" />
      <ellipse cx={300} cy={900} rx={40} ry={90} fill="#C8E0F0" opacity={0.7} />
      <path d={ret.join(" ")} stroke={RETINA} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d={ret.join(" ")} stroke={C.yellow} strokeWidth={22} fill="none" strokeLinecap="round" opacity={brillo} />
      <path d="M 840 900 Q 940 900 1000 980" stroke="#E0B060" strokeWidth={36} fill="none" />
    </g>
  );
};

// D. Al presionar deformas la retina, la capa del fondo que capta la luz
export const Retina: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const hund = interpolate(t, [T.presionar, T.deformas + 0.4], [0, 1], clamp) * (0.85 + 0.15 * Math.sin(t * 8));
  return (
    <Lienzo zoom={interpolate(t, [T.presionar, T.presion], [1, 1.04])}>
      <Globo hund={hund} />
      <g transform={`translate(${170 + hund * 70} 900)`} opacity={aparece(t, T.presionar)}>
        <rect x={-260} y={-50} width={220} height={100} rx={50} fill="#C89A7A" />
        <path d="M -40 0 L -10 0" stroke={C.yellow} strokeWidth={8} />
      </g>
      <Texto x={540} y={540} size={40} color={C.white} op={aparece(t, T.presionar)}>
        presión sobre el ojo
      </Texto>
      <Texto x={760} y={1270} size={40} color={RETINA} op={aparece(t, T.retina)}>
        retina
      </Texto>
      <Texto x={760} y={1340} size={32} color={C.grey} op={aparece(t, T.capta)}>
        la capa que capta la luz
      </Texto>
    </Lienzo>
  );
};

// E. La presión estimula sus células sin luz; mandan señales al cerebro
export const Senales: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const est = aparece(t, T.estimula);
  return (
    <Lienzo zoom={interpolate(t, [T.presion, T.tu], [1, 1.04])}>
      <Globo hund={0.8} brillo={est * (0.5 + 0.5 * Math.sin(t * 14))} />
      <Texto x={540} y={540} size={40} color={C.yellow} op={est}>
        células estimuladas
      </Texto>
      <Texto x={420} y={1300} size={36} color={C.grey} op={aparece(t, T.aunque)}>
        sin luz 🚫💡
      </Texto>
      <g opacity={aparece(t, T.mandan)}>
        {new Array(5).fill(0).map((_, k) => {
          const u = (t * 1.2 + k / 5) % 1;
          return <circle key={k} cx={840 + u * 160} cy={900 + u * u * 80} r={14} fill={C.yellow} />;
        })}
        <Texto x={880} y={1100} size={34} color={C.yellow}>
          señales →
        </Texto>
        <Texto x={880} y={1160} size={34} color={C.white} op={aparece(t, T.cerebro)}>
          al cerebro
        </Texto>
      </g>
    </Lienzo>
  );
};

// Cerebro sencillo
const Cerebro: React.FC<{ readonly x: number; readonly y: number; readonly s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -200 40 C -240 -80 -120 -200 0 -180 C 120 -220 250 -100 210 20 C 240 120 120 170 40 140 C -20 190 -160 170 -200 40 Z" fill="#E8A0B0" />
    <path d="M -120 -100 q 40 40 0 80 M -20 -150 q 50 60 0 130 M 90 -120 q -40 60 10 120 M 160 -30 q -50 30 -10 80" stroke="#C87A90" strokeWidth={10} fill="none" />
  </g>
);

// F. El cerebro solo interpreta las señales de los ojos de una manera: como luz
export const Luz: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const luz = aparece(t, T.luz);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.tu, T.formas], [1, 1.04])}>
        <Cerebro x={540} y={820} s={1.4} />
        <g opacity={aparece(t, T.interpretar)}>
          {new Array(6).fill(0).map((_, k) => {
            const u = (t * 1.2 + k / 6) % 1;
            return <circle key={k} cx={120 + u * 300} cy={1100 - u * 140} r={14} fill={C.yellow} />;
          })}
        </g>
        <Texto x={540} y={1200} size={40} color={C.white} op={aparece(t, T.manera)}>
          una sola interpretación:
        </Texto>
        <g opacity={luz}>
          <circle cx={540} cy={1360} r={60} fill={C.yellow} />
          <rect x={515} y={1415} width={50} height={40} rx={8} fill="#8A8A96" />
          <Texto x={760} y={1380} size={56} color={C.yellow}>
            ¡LUZ!
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.luz} color={C.yellow} />
    </>
  );
};

// G. Las formas (cuadrículas, espirales) reflejan la organización de neuronas en retina y corteza visual
export const Formas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const esp = aparece(t, T.espirales);
  return (
    <Lienzo zoom={interpolate(t, [T.formas, T.pero], [1, 1.04])}>
      <g opacity={aparece(t, T.cuadriculas)}>
        {new Array(7).fill(0).map((_, i) => (
          <g key={i}>
            <line x1={180 + i * 60} y1={640} x2={180 + i * 60} y2={1000} stroke="#3A6AE0" strokeWidth={6} />
            <line x1={180} y1={640 + i * 60} x2={540} y2={640 + i * 60} stroke="#3A6AE0" strokeWidth={6} />
          </g>
        ))}
        <Texto x={360} y={1070} size={34} color="#3A6AE0">
          cuadrículas
        </Texto>
      </g>
      <g opacity={esp}>
        <path
          d={new Array(120)
            .fill(0)
            .map((_, i) => {
              const a = i * 0.18 + t;
              const r = 4 + i * 1.5;
              return `${i ? "L" : "M"} ${790 + Math.cos(a) * r} ${820 + Math.sin(a) * r}`;
            })
            .join(" ")}
          stroke="#E04AA0"
          strokeWidth={6}
          fill="none"
        />
        <Texto x={790} y={1070} size={34} color="#E04AA0">
          espirales
        </Texto>
      </g>
      <g opacity={aparece(t, T.organizadas)}>
        {new Array(30).fill(0).map((_, k) => (
          <circle key={k} cx={200 + (k % 10) * 75} cy={1220 + Math.floor(k / 10) * 60} r={14} fill={C.cyan} opacity={0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 5 + k))} />
        ))}
        <Texto x={540} y={1450} size={36} color={C.cyan}>
          neuronas en filas ordenadas
        </Texto>
        <Texto x={540} y={1510} size={32} color={C.white} op={aparece(t, T.corteza)}>
          retina y corteza visual
        </Texto>
      </g>
    </Lienzo>
  );
};

// H. Pero no frotes fuerte: demasiada presión puede dañar el ojo
export const Cuidado: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pero, T.eso], [1, 1.04])}>
        <g opacity={aparece(t, T.fuerte)}>
          <path d="M 540 620 L 800 1080 L 280 1080 Z" fill={C.yellow} stroke="#111" strokeWidth={10} strokeLinejoin="round" />
          <Texto x={540} y={1020} size={200} color="#111">
            !
          </Texto>
        </g>
        <Texto x={540} y={1220} size={44} color={C.white} op={aparece(t, T.fuerte)}>
          no frotes fuerte
        </Texto>
        <Texto x={540} y={1300} size={38} color={C.red} op={aparece(t, T.danar)}>
          puede dañar el ojo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.fuerte} color={C.red} />
    </>
  );
};

// I. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.eso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
