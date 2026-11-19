import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/luna/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  siempre: 2.02,
  girando: 4.32,
  final: 5.58,
  la: 8.18,
  exactamente: 9.68,
  dias: 12.92,
  asi: 14.72,
  frente: 17.12,
  no: 19.18,
  hace: 20.58,
  rapido: 22.08,
  gravedad: 23.38,
  rugby: 25.8,
  ese: 27.2,
  freno: 28.32,
  sincronizado: 29.92,
  y: 31.44,
  frena: 32.34,
  dias2: 33.82,
  porEso: 36.52,
  fin: 38.46,
};

const LUNA = "#C8C4D0";
const CRATER = "#9A96A8";
const TIERRA = "#2A6AB8";

// Luna con cráteres; mira = ángulo (rad) hacia donde apunta su "cara" (punto rojo); estira = alargamiento
const Luna: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly mira: number; readonly estira?: number; readonly marca?: number }> = ({
  x,
  y,
  r,
  mira,
  estira = 0,
  marca = 1,
}) => {
  const grados = (mira * 180) / Math.PI;
  return (
    <g transform={`translate(${x} ${y}) rotate(${grados})`}>
      <ellipse rx={r * (1 + estira * 0.35)} ry={r * (1 - estira * 0.15)} fill={LUNA} />
      <circle cx={-r * 0.3} cy={-r * 0.35} r={r * 0.18} fill={CRATER} />
      <circle cx={r * 0.25} cy={r * 0.4} r={r * 0.14} fill={CRATER} />
      <circle cx={-r * 0.4} cy={r * 0.3} r={r * 0.1} fill={CRATER} />
      <circle cx={r * 0.1} cy={-r * 0.05} r={r * 0.08} fill={CRATER} />
      <circle cx={r * 0.78 * (1 + estira * 0.35)} cy={0} r={r * 0.14} fill={C.red} opacity={marca} />
    </g>
  );
};

// Tierra
const Tierra: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly bulto?: number }> = ({ x, y, r, bulto = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse rx={r * (1 + bulto * 0.12)} ry={r} fill={TIERRA} />
    <path d={`M ${-r * 0.5} ${-r * 0.3} q ${r * 0.3} ${-r * 0.3} ${r * 0.6} 0 q ${-r * 0.1} ${r * 0.4} ${-r * 0.6} 0 Z`} fill="#3A9A5A" />
    <path d={`M ${r * 0.1} ${r * 0.2} q ${r * 0.3} ${-r * 0.1} ${r * 0.4} ${r * 0.3} q ${-r * 0.3} ${r * 0.2} ${-r * 0.4} ${-r * 0.3} Z`} fill="#3A9A5A" />
  </g>
);

// Imagen del gancho y del cierre: Luna grande con su cara oculta en sombra
const LunaPregunta: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <circle cx={540} cy={880} r={360} fill={C.white} opacity={0.05} />
    <Luna x={540} y={880} r={300} mira={Math.PI / 2} marca={0} />
    <path d="M 540 580 A 300 300 0 0 1 540 1180 A 120 300 0 0 0 540 580 Z" fill="#0B091D" opacity={0.75} />
    <Texto x={800} y={560} size={110} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué la Luna nunca se voltea?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.siempre], [1.12, 1])}>
        <LunaPregunta q={interpolate(t, [0.8, 1.1], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={0.98} />
    </>
  );
};

// Órbita de la Luna alrededor de la Tierra con la cara siempre hacia ella
const Orbita: React.FC<{ readonly t: number; readonly cx: number; readonly cy: number; readonly R: number; readonly vel: number; readonly rL?: number; readonly flecha?: number }> = ({
  t,
  cx,
  cy,
  R,
  vel,
  rL = 60,
  flecha = 0,
}) => {
  const a = t * vel;
  const mx = cx + Math.cos(a) * R;
  const my = cy + Math.sin(a) * R;
  return (
    <g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#3A3456" strokeWidth={4} strokeDasharray="12 10" />
      <Tierra x={cx} y={cy} r={90} />
      <Luna x={mx} y={my} r={rL} mira={a + Math.PI} />
      {flecha > 0 ? (
        <line x1={mx} y1={my} x2={mx + Math.cos(a + Math.PI) * 120} y2={my + Math.sin(a + Math.PI) * 120} stroke={C.red} strokeWidth={6} strokeDasharray="10 8" opacity={flecha} />
      ) : null}
    </g>
  );
};

// B. Siempre vemos la misma cara, y sin embargo sí está girando + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.siempre, T.la], [1, 1.05])}>
      <Orbita t={t} cx={540} cy={820} R={300} vel={0.7} flecha={aparece(t, T.siempre)} />
      <Texto x={540} y={1220} size={38} color={C.red} op={aparece(t, T.siempre)}>
        siempre la misma cara
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1300} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1300}
          width={700 * interpolate(t, [T.final, T.la], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1400} color={C.white} size={38}>
          qué le pasa a la Tierra: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Gira sobre sí misma al mismo ritmo con que da la vuelta: unos 27 días
export const Ritmo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const g = (t - T.la) * 1.2;
  return (
    <Lienzo zoom={interpolate(t, [T.la, T.asi], [1, 1.04])}>
      <Luna x={300} y={760} r={120} mira={g} />
      <path d="M 300 600 A 160 160 0 1 1 160 690" stroke={C.cyan} strokeWidth={6} fill="none" />
      <Texto x={300} y={980} size={34} color={C.cyan}>
        gira sobre sí
      </Texto>
      <g opacity={aparece(t, T.exactamente)}>
        <Texto x={540} y={790} size={70} color={C.yellow}>
          =
        </Texto>
        <circle cx={780} cy={760} r={150} fill="none" stroke="#3A3456" strokeWidth={4} strokeDasharray="12 10" />
        <Tierra x={780} y={760} r={50} />
        <Luna x={780 + Math.cos(g) * 150} y={760 + Math.sin(g) * 150} r={34} mira={g + Math.PI} />
        <Texto x={780} y={980} size={34} color={C.white}>
          vuelta a la Tierra
        </Texto>
      </g>
      <Tarjeta x={290} y={1100} w={500} h={120} op={aparece(t, T.dias)}>
        <Texto x={540} y={1178} size={48} color={C.yellow}>
          27 días
        </Texto>
      </Tarjeta>
    </Lienzo>
  );
};

// D. Mientras avanza gira lo justo para mirarnos siempre de frente
export const Frente: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.no], [1, 1.04])}>
      <circle cx={540} cy={840} r={330} fill="none" stroke="#3A3456" strokeWidth={4} strokeDasharray="12 10" />
      <Tierra x={540} y={840} r={100} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
        const a = (k / 8) * Math.PI * 2;
        return (
          <g key={k} opacity={aparece(t, T.asi + k * 0.25)}>
            <Luna x={540 + Math.cos(a) * 330} y={840 + Math.sin(a) * 330} r={48} mira={a + Math.PI} />
          </g>
        );
      })}
      <Texto x={540} y={1290} size={40} color={C.red} op={aparece(t, T.frente)}>
        siempre de frente
      </Texto>
    </Lienzo>
  );
};

// E. Hace miles de millones de años giraba más rápido; la gravedad de la Tierra la estiró como un balón de rugby
export const Pasado: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const estira = interpolate(t, [T.gravedad, T.rugby + 0.4], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.no, T.ese], [1, 1.04])}>
      <Texto x={540} y={500} size={40} color={C.grey} op={aparece(t, T.hace)}>
        hace miles de millones de años
      </Texto>
      <Luna x={680} y={840} r={170} mira={(t - T.no) * 3 * (1 - estira * 0.7)} estira={estira} />
      <Tierra x={180} y={840} r={110} />
      <g opacity={aparece(t, T.gravedad)}>
        {[-1, 0, 1].map((k) => (
          <line key={k} x1={310} y1={840 + k * 60} x2={480} y2={840 + k * 40} stroke={C.cyan} strokeWidth={6} strokeDasharray="14 10" />
        ))}
      </g>
      <Texto x={680} y={1120} size={38} color={C.cyan} op={aparece(t, T.rapido)}>
        giraba más rápido
      </Texto>
      <Texto x={540} y={1250} size={40} color={C.yellow} op={aparece(t, T.rugby)}>
        estirada como un balón de rugby
      </Texto>
    </Lienzo>
  );
};

// F. Ese bulto funcionó como un freno hasta que su giro quedó sincronizado
export const Freno: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sincro = interpolate(t, [T.freno, T.sincronizado + 0.4], [0, 1], suave);
  const giro = interpolate(sincro, [0, 1], [0.9, 0]);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.ese, T.y], [1, 1.04])}>
        <Tierra x={180} y={840} r={110} />
        <Luna x={680} y={840} r={170} mira={Math.PI + Math.sin(t * 4) * giro} estira={1} />
        <g transform="translate(680 1100)">
          <rect x={-200} y={-30} width={400} height={60} rx={30} fill="#2A2440" />
          <rect x={-200} y={-30} width={400 * (1 - sincro)} height={60} rx={30} fill={C.orange} />
          <Texto x={0} y={70} size={30} color={C.grey}>
            velocidad de giro de más
          </Texto>
        </g>
        <Texto x={540} y={1300} size={40} color="#5AC878" op={aparece(t, T.sincronizado)}>
          sincronizada
        </Texto>
        <Texto x={680} y={560} size={38} color={C.orange} op={aparece(t, T.freno)}>
          el bulto la frena
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.sincronizado} color="#5AC878" />
    </>
  );
};

// G. La Luna también nos frena: los días en la Tierra se alargan poco a poco
export const Dias: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.y, T.porEso], [1, 1.04])}>
      <g transform={`rotate(${(t - T.y) * 40} 400 820)`}>
        <Tierra x={400} y={820} r={200} bulto={1} />
      </g>
      <Luna x={860} y={820} r={70} mira={Math.PI} />
      <g opacity={aparece(t, T.frena)}>
        <path d="M 400 560 A 260 260 0 0 1 640 700" stroke={C.orange} strokeWidth={8} fill="none" />
        <Texto x={400} y={520} size={36} color={C.orange}>
          la Luna nos frena
        </Texto>
      </g>
      <Tarjeta x={190} y={1120} w={700} h={170} op={aparece(t, T.dias2)}>
        <Texto x={540} y={1185} size={32} color={C.grey}>
          duración del día
        </Texto>
        <Texto x={540} y={1255} size={50} color={C.yellow}>
          24 h… y creciendo
        </Texto>
      </Tarjeta>
      <Texto x={540} y={1380} size={30} color={C.grey} op={aparece(t, T.dias2 + 0.6)}>
        unos 2 milisegundos más cada siglo
      </Texto>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <LunaPregunta q={interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp)} />
    </Lienzo>
  );
};
