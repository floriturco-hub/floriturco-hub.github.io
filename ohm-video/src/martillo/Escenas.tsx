import { interpolate, random } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/martillo/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  golpeas: 2.32, // golpeas
  debilita: 4.18, // debilita
  barra: 6.12, // barra
  norte: 7.48, // norte
  vuelve: 8.20, // vuelve
  final: 9.44, // final
  dominios: 13.68, // dominios
  diminutas: 14.74, // diminutas
  pequeno: 16.50, // pequeno
  apuntan: 18.84, // apuntan
  sacude: 21.18, // sacude
  desordena: 21.94, // desordena
  cancela: 23.58, // cancela
  comun: 25.30, // comun
  desordenados: 26.02, // desordenados
  libres: 30.20, // libres
  si: 31.46, // si
  campo: 33.18, // campo
  alinearse: 35.36, // alinearse
  quedan: 36.80, // quedan
  porEso: 37.70, // por
  fin: 39.52, // FIN
};

const HIERRO = "#8C88A8";

// Barra con dominios: alin 0 = desordenados, 1 = todos hacia la derecha (norte); temblor 0-1
const Dominios: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly alin: number; readonly temblor?: number; readonly t: number }> = ({
  x,
  y,
  s,
  alin,
  temblor = 0,
  t,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-400} y={-160} width={800} height={320} rx={16} fill="#3A3650" stroke={HIERRO} strokeWidth={8} />
    {new Array(4).fill(0).map((_, r) =>
      new Array(8).fill(0).map((__, c) => {
        const a0 = random(`d${r}-${c}`) * 360 - 180;
        const a = a0 * (1 - alin) + Math.sin(t * 30 + r * 3 + c) * 40 * temblor;
        const cx = -350 + c * 100;
        const cy = -120 + r * 80;
        return (
          <g key={`${r}${c}`}>
            <rect x={cx - 48} y={cy - 38} width={96} height={76} fill="none" stroke="#5A5478" strokeWidth={2} />
            <g transform={`translate(${cx} ${cy}) rotate(${a})`}>
              <line x1={-26} y1={0} x2={22} y2={0} stroke={C.white} strokeWidth={6} />
              <polygon points="34,0 18,-11 18,11" fill={C.red} />
            </g>
          </g>
        );
      }),
    )}
  </g>
);

// Líneas de campo alrededor de un imán (fuerza 0-1)
const Campo: React.FC<{ readonly x: number; readonly y: number; readonly f: number }> = ({ x, y, f }) => (
  <g opacity={f}>
    {[1, 2, 3].map((k) => (
      <g key={k}>
        <ellipse cx={x} cy={y - 40 * k} rx={240 + 40 * k} ry={60 * k} fill="none" stroke={C.cyan} strokeWidth={4} opacity={0.6} />
        <ellipse cx={x} cy={y + 40 * k} rx={240 + 40 * k} ry={60 * k} fill="none" stroke={C.cyan} strokeWidth={4} opacity={0.6} />
      </g>
    ))}
  </g>
);

const Iman: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-260} y={-60} width={260} height={120} fill={C.red} />
    <rect x={0} y={-60} width={260} height={120} fill="#3A6EE8" />
    <Texto x={-130} y={18} size={56} color={C.white}>
      S
    </Texto>
    <Texto x={130} y={18} size={56} color={C.white}>
      N
    </Texto>
  </g>
);

const Martillo: React.FC<{ readonly x: number; readonly y: number; readonly rot: number }> = ({ x, y, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-14} y={-20} width={28} height={300} rx={10} fill="#8A5A2A" />
    <rect x={-80} y={-70} width={160} height={70} rx={10} fill="#5A5A68" />
  </g>
);

const Brujula: React.FC<{ readonly x: number; readonly y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle cx={0} cy={0} r={60} fill={C.card} stroke={C.white} strokeWidth={5} />
    <polygon points="48,0 0,12 0,-12" fill={C.red} />
    <polygon points="-48,0 0,12 0,-12" fill={C.white} />
    <Texto x={88} y={10} size={30} color={C.red}>
      N
    </Texto>
  </g>
);

const golpe = (t: number, d: number) => interpolate(t, [d - 0.3, d, d + 0.3], [-60, 0, -60], clamp);

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <rect x={190} y={1000} width={700} height={90} rx={10} fill={HIERRO} />
    <Martillo x={600} y={760} rot={-30 + Math.abs(Math.sin(t * 3)) * 30} />
    <Texto x={540} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este golpe crea un imán?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.golpeas], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.yellow} />
    </>
  );
};

// B. Golpear un imán lo debilita; golpear hierro apuntando al norte lo imanta + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const segunda = aparece(t, T.barra);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.golpeas, T.dominios], [1, 1.04])}>
        <g opacity={1 - segunda}>
          <Campo x={540} y={860} f={1 - aparece(t, T.debilita) * 0.8} />
          <Iman x={540} y={860} s={1} />
          <Martillo x={600} y={620} rot={golpe(t, T.debilita)} />
          <Texto x={540} y={1140} size={38} color={C.red} op={aparece(t, T.debilita)}>
            se debilita
          </Texto>
        </g>
        <g opacity={segunda}>
          <Campo x={540} y={860} f={aparece(t, T.vuelve)} />
          <rect x={280} y={820} width={520} height={80} rx={10} fill={HIERRO} />
          <Brujula x={900} y={560} />
          <Martillo x={600} y={620} rot={golpe(t, T.norte + 0.3)} />
          <Texto x={540} y={1140} size={38} color={C.cyan} op={aparece(t, T.vuelve)}>
            ¡se vuelve imán!
          </Texto>
        </g>
        <g opacity={aparece(t, T.final)}>
          <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
          <rect
            x={190}
            y={1330}
            width={700 * interpolate(t, [T.final, T.dominios], [0, 1], clamp)}
            height={24}
            rx={12}
            fill={C.yellow}
          />
          <Texto x={540} y={1430} color={C.white} size={38}>
            quién la imanta: al final
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.norte + 0.3} color={C.cyan} />
    </>
  );
};

// C. El hierro está dividido en dominios, cada uno como un pequeño imán
export const Zonas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.dominios, T.apuntan], [1, 1.04])}>
      <Dominios x={540} y={880} s={1.1} alin={0} t={t} />
      <Texto x={540} y={1150} size={40} color={C.white} op={aparece(t, T.dominios)}>
        millones de dominios
      </Texto>
      <Texto x={540} y={1220} size={34} color={C.red} op={aparece(t, T.pequeno)}>
        cada uno, un pequeño imán
      </Texto>
    </Lienzo>
  );
};

// D. En un imán todos apuntan igual; un golpe los desordena y la fuerza se cancela
export const Iman1: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const alin = 1 - interpolate(t, [T.sacude, T.desordena + 0.5], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.apuntan, T.comun], [1, 1.04])}>
        <Dominios x={540} y={880} s={1.1} alin={alin} temblor={aparece(t, T.sacude) * (1 - aparece(t, T.cancela))} t={t} />
        <Martillo x={600} y={560} rot={golpe(t, T.sacude)} />
        <Texto x={540} y={1150} size={40} color={C.cyan} op={aparece(t, T.apuntan) * (1 - aparece(t, T.sacude))}>
          imán: todos alineados
        </Texto>
        <Texto x={540} y={1150} size={40} color={C.red} op={aparece(t, T.cancela)}>
          se cancelan: pierde fuerza
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.sacude} color={C.white} />
    </>
  );
};

// E. En el hierro común están desordenados; el golpe los deja libres para girar
export const Hierro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.comun, T.si], [1, 1.04])}>
      <Dominios x={540} y={880} s={1.1} alin={0} temblor={aparece(t, T.libres)} t={t} />
      <Martillo x={600} y={560} rot={golpe(t, T.libres - 0.4)} />
      <Texto x={540} y={1150} size={40} color={C.white} op={aparece(t, T.desordenados) * (1 - aparece(t, T.libres))}>
        hierro común: desordenados
      </Texto>
      <Texto x={540} y={1150} size={40} color={C.yellow} op={aparece(t, T.libres)}>
        libres para girar
      </Texto>
    </Lienzo>
  );
};

// F. Apuntando al norte, el campo de la Tierra los alinea y se quedan así
export const Tierra: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const alin = interpolate(t, [T.alinearse - 0.3, T.quedan], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.si, T.porEso], [1, 1.04])}>
        <g opacity={aparece(t, T.campo)}>
          <path d="M 120 560 L 900 560" stroke={C.cyan} strokeWidth={12} />
          <polygon points="960,560 900,530 900,590" fill={C.cyan} />
          <Texto x={540} y={520} size={34} color={C.cyan}>
            campo magnético de la Tierra
          </Texto>
        </g>
        <Dominios x={540} y={880} s={1.1} alin={alin} temblor={1 - alin} t={t} />
        <Brujula x={900} y={1200} />
        <Texto x={420} y={1220} size={44} color={C.cyan} op={aparece(t, T.quedan)}>
          ¡imán!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.quedan} color={C.cyan} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
