import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/bumeran/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  lanzas: 1.92, // lanzas
  vuelta: 3.56, // vuelta
  regresa: 4.58, // regresa
  final: 6.14, // final
  ala: 9.40, // ala
  sustentacion: 11.72, // sustentacion
  gira: 13.40, // gira
  avanza: 14.04, // avanza
  arriba: 15.60, // arriba
  favor: 16.40, // favor
  rapido: 18.28, // rapido
  velocidad: 19.86, // velocidad
  empujon: 22.98, // empujon
  voltea: 26.40, // voltea
  direccion: 27.84, // direccion
  trompo: 29.50, // trompo
  precesion: 31.02, // precesion
  vertical: 33.26, // vertical
  giro: 34.48, // giro
  frisbi: 36.04, // frisbi
  asi: 36.74, // asi
  fin: 38.40, // FIN
};

const MADERA = "#C8884A";

// Bumerán (forma de V) en (x,y) con rotación ang
const Bumeran: React.FC<{ readonly x: number; readonly y: number; readonly ang: number; readonly s?: number }> = ({ x, y, ang, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${s})`}>
    <path d="M -10 -10 Q -60 -70 -150 -80 Q -160 -60 -140 -50 Q -70 -40 -20 10 Z" fill={MADERA} />
    <path d="M -10 -10 Q 50 -60 130 -40 Q 140 -20 120 -12 Q 60 -20 10 15 Z" fill="#B8783A" />
  </g>
);

// Trayectoria circular de ida y vuelta (vista desde arriba): u 0..1
const Ruta: React.FC<{ readonly u: number; readonly cx: number; readonly cy: number; readonly r: number; readonly t: number; readonly linea?: number }> = ({ u, cx, cy, r, t, linea = 1 }) => {
  const x = cx + Math.sin(u * Math.PI * 2) * r * 0.8;
  const y = cy + Math.cos(u * Math.PI * 2) * r;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={r * 0.8} ry={r} fill="none" stroke={C.grey} strokeWidth={4} strokeDasharray="14 12" opacity={0.6 * linea} />
      <Bumeran x={x} y={y} ang={t * 900} s={0.8} />
    </g>
  );
};

const Persona: React.FC<{ readonly x: number; readonly y: number }> = ({ x, y }) => (
  <g>
    <circle cx={x} cy={y - 150} r={40} fill="#E0A888" />
    <rect x={x - 40} y={y - 105} width={80} height={140} rx={30} fill="#4A6AC8" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Persona x={540} y={1450} />
    <Ruta u={(t * 0.4) % 1} cx={540} cy={900} r={400} t={t} />
    <Texto x={540} y={950} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo sabe volver este bumerán?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.lanzas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Lanzas un bumerán, da una vuelta en el aire y regresa a tus manos + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.lanzas, T.ala], [1, 1.04])}>
      <Persona x={540} y={1450} />
      <Ruta u={interpolate(t, [T.lanzas, T.regresa + 0.5], [0, 0.999], clamp)} cx={540} cy={900} r={400} t={t} />
      <Texto x={540} y={1560} size={42} color="#5AD08A" op={aparece(t, T.regresa)}>
        ¡regresa a tus manos!
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cómo hay que lanzarlo?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.ala], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Cada brazo tiene forma de ala de avión: al girar, cada uno genera sustentación
export const Ala: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.ala, T.gira], [1, 1.04])}>
        <path d="M 200 950 Q 300 860 600 870 Q 850 880 880 950 Q 600 960 200 950 Z" fill={MADERA} />
        {new Array(4).fill(0).map((_, k) => {
          const u = (t * 1.2 + k / 4) % 1;
          return (
            <g key={k}>
              <path d={`M ${80 + u * 900} ${820 - Math.sin(u * Math.PI) * 30} l 60 0`} stroke={C.cyan} strokeWidth={5} opacity={1 - u} />
              <path d={`M ${80 + u * 900} ${1020} l 60 0`} stroke={C.cyan} strokeWidth={5} opacity={1 - u} />
            </g>
          );
        })}
        <g opacity={aparece(t, T.sustentacion)}>
          <path d="M 540 860 L 540 680" stroke={C.yellow} strokeWidth={14} />
          <path d="M 510 700 L 540 650 L 570 700 Z" fill={C.yellow} />
          <Texto x={540} y={620} size={40} color={C.yellow}>
            sustentación
          </Texto>
        </g>
        <Texto x={540} y={1200} size={40} color={C.white} op={aparece(t, T.ala)}>
          cada brazo: un ala
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.sustentacion} color={C.yellow} />
    </>
  );
};

// D. Gira mientras avanza: el brazo de arriba va a favor del vuelo y corta el aire más rápido que el de abajo
export const Velocidad: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.gira, T.empujon], [1, 1.04])}>
      <g transform={`translate(${540 + 40 * Math.sin(t)} 950) rotate(${t * 120})`}>
        <rect x={-14} y={-300} width={28} height={600} rx={14} fill={MADERA} />
      </g>
      <path d="M 300 1350 L 780 1350" stroke={C.grey} strokeWidth={8} opacity={aparece(t, T.avanza)} />
      <path d="M 770 1330 L 810 1350 L 770 1370 Z" fill={C.grey} opacity={aparece(t, T.avanza)} />
      <Texto x={540} y={1420} size={32} color={C.grey} op={aparece(t, T.avanza)}>
        avance
      </Texto>
      <g opacity={aparece(t, T.arriba)}>
        <path d="M 540 650 L 900 650" stroke={C.yellow} strokeWidth={14} />
        <path d="M 890 630 L 930 650 L 890 670 Z" fill={C.yellow} />
        <Texto x={540} y={610} size={34} color={C.yellow}>
          arriba: giro + avance = rápido
        </Texto>
      </g>
      <g opacity={aparece(t, T.rapido)}>
        <path d="M 540 1250 L 640 1250" stroke={C.cyan} strokeWidth={14} />
        <path d="M 630 1230 L 670 1250 L 630 1270 Z" fill={C.cyan} />
        <Texto x={760} y={1260} size={32} color={C.cyan}>
          abajo: lento
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. Más velocidad, más sustentación: empujón lateral; como gira, no lo voltea: cambia de dirección (precesión)
export const Precesion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const trompo = aparece(t, T.trompo);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.velocidad, T.vertical], [1, 1.04])}>
        <g opacity={1 - trompo}>
          <g transform="translate(540 950)">
            <rect x={-14} y={-300} width={28} height={600} rx={14} fill={MADERA} />
          </g>
          <path d="M 560 700 L 820 700" stroke={C.orange} strokeWidth={18} opacity={aparece(t, T.empujon)} />
          <path d="M 810 674 L 860 700 L 810 726 Z" fill={C.orange} opacity={aparece(t, T.empujon)} />
          <path d="M 560 1200 L 640 1200" stroke={C.orange} strokeWidth={10} opacity={aparece(t, T.empujon)} />
          <Texto x={540} y={600} size={38} color={C.orange} op={aparece(t, T.empujon)}>
            arriba empuja más fuerte
          </Texto>
          <Texto x={540} y={1400} size={38} color={C.white} op={aparece(t, T.voltea)}>
            pero no lo voltea…
          </Texto>
          <Texto x={540} y={1470} size={38} color={C.cyan} op={aparece(t, T.direccion)}>
            …cambia de dirección poco a poco
          </Texto>
        </g>
        <g opacity={trompo}>
          <g transform={`translate(${540 + Math.cos(t * 2) * 120} ${950 + Math.sin(t * 2) * 40}) rotate(${20 * Math.cos(t * 2)})`}>
            <path d="M -90 -60 L 90 -60 L 0 120 Z" fill={C.purpleLight} />
            <rect x={-8} y={-110} width={16} height={50} fill={C.grey} />
          </g>
          <ellipse cx={540} cy={1100} rx={140} ry={40} fill="none" stroke={C.grey} strokeWidth={4} strokeDasharray="12 10" />
          <Texto x={540} y={1300} size={40} color={C.purpleLight}>
            como un trompo inclinado
          </Texto>
          <Texto x={540} y={1380} size={48} color={C.yellow} op={aparece(t, T.precesion)}>
            precesión
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.precesion} color={C.yellow} />
    </>
  );
};

// F. Hay que lanzarlo casi vertical, con mucho giro, no acostado como un frisbi
export const Lanzar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.vertical, T.asi], [1, 1.04])}>
        <g opacity={aparece(t, T.vertical)}>
          <g transform="translate(320 950) rotate(-10)">
            <rect x={-12} y={-220} width={24} height={440} rx={12} fill={MADERA} />
            <ellipse cx={0} cy={0} rx={70} ry={230} fill="none" stroke={C.yellow} strokeWidth={5} strokeDasharray="20 14" strokeDashoffset={-t * 120} />
          </g>
          <Texto x={320} y={1260} size={36} color="#5AD08A">
            casi vertical ✓
          </Texto>
          <Texto x={320} y={1320} size={32} color={C.white} op={aparece(t, T.giro)}>
            con mucho giro
          </Texto>
        </g>
        <g opacity={aparece(t, T.frisbi)}>
          <ellipse cx={780} cy={950} rx={180} ry={40} fill={MADERA} />
          <line x1={620} y1={830} x2={940} y2={1070} stroke={C.red} strokeWidth={12} />
          <Texto x={780} y={1260} size={36} color={C.red}>
            acostado ✗
          </Texto>
        </g>
        <Texto x={540} y={600} size={42} color={C.yellow} op={aparece(t, T.vertical)}>
          cómo lanzarlo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.vertical} color={C.yellow} />
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
