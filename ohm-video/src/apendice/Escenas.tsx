import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/apendice/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  durante: 2.42,
  nada: 4.56,
  final: 5.22,
  intestino: 7.58,
  bacterias: 9.08,
  digerir: 10.54,
  defender: 11.24,
  apendice: 12.44,
  tubito: 13.44,
  pegado: 14.58,
  dentro: 16.04,
  capa: 17.22,
  protegida: 18.52,
  diarrea: 19.7,
  arrasa: 20.8,
  inundacion: 22.26,
  salvo: 23.12,
  despues: 24.92,
  poblar: 26.38,
  ademas: 27.6,
  tejido: 28.38,
  globulos: 30.12,
  aun: 31.32,
  inflama: 32.18,
  vive: 33.64,
  inutil: 35.06,
  porque: 36.44,
  fin: 39.04,
};

const TRIPA = "#C86A80";
const TRIPA_OSC = "#7A3A50";
const BACT = "#5AC878";
const AGUA = "#4AA8E8";

// Bacteria (cápsula)
const Bacteria: React.FC<{ readonly x: number; readonly y: number; readonly rot: number; readonly s?: number; readonly op?: number; readonly color?: string }> = ({
  x,
  y,
  rot,
  s = 1,
  op = 1,
  color = BACT,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={op}>
    <rect x={-22} y={-10} width={44} height={20} rx={10} fill={color} />
  </g>
);

// Colon ascendente (tubo vertical) con el apéndice colgando abajo
const Colon: React.FC<{ readonly inflama?: number; readonly corte?: number }> = ({ inflama = 0, corte = 0 }) => (
  <g>
    <rect x={300} y={420} width={300} height={720} rx={150} fill={TRIPA} />
    <rect x={340} y={460} width={220} height={640} rx={110} fill={TRIPA_OSC} />
    <g transform={`translate(${corte * 140} ${corte * 60}) rotate(${corte * 20} 470 1100)`} opacity={1 - corte * 0.8}>
      <path
        d="M 470 1080 Q 520 1200 620 1260 Q 700 1300 740 1240"
        stroke={inflama > 0.5 ? C.red : TRIPA}
        strokeWidth={70 + inflama * 30}
        fill="none"
        strokeLinecap="round"
      />
      <path d="M 470 1080 Q 520 1200 620 1260 Q 700 1300 740 1240" stroke={inflama > 0.5 ? "#8A1A2A" : TRIPA_OSC} strokeWidth={36 + inflama * 20} fill="none" strokeLinecap="round" />
    </g>
  </g>
);

// Escudo
const Escudo: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly op?: number }> = ({ x, y, s, op = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <path d="M 0 -120 L 100 -80 Q 100 60 0 120 Q -100 60 -100 -80 Z" fill="none" stroke={C.cyan} strokeWidth={14} />
  </g>
);

// Imagen del gancho y del cierre: apéndice dentro de un búnker
const Bunker: React.FC<{ readonly t: number; readonly brillo: number }> = ({ t, brillo }) => (
  <>
    <circle cx={540} cy={880} r={330} fill={C.cyan} opacity={0.1 * brillo} />
    <path d="M 220 1100 L 220 820 Q 540 560 860 820 L 860 1100 Z" fill="#3A3650" stroke="#6A6488" strokeWidth={12} />
    <rect x={180} y={1090} width={720} height={40} rx={10} fill="#6A6488" />
    <path d="M 380 1000 Q 470 1060 560 1000 Q 650 940 720 1000" stroke={TRIPA} strokeWidth={70} fill="none" strokeLinecap="round" />
    {new Array(8).fill(0).map((_, k) => (
      <Bacteria key={k} x={400 + k * 42} y={1000 + Math.sin(k + t * 2) * 30} rot={k * 40 + t * 30} s={0.7} op={brillo} />
    ))}
    <Escudo x={540} y={720} s={0.7} op={brillo} />
  </>
);

// A. Gancho: tu apéndice esconde un búnker secreto
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.durante], [1.12, 1])}>
        <Bunker t={t} brillo={interpolate(t, [0.9, 1.3], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={1.1} color={C.cyan} />
    </>
  );
};

// B. Se creyó que no servía para nada + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.durante, T.intestino], [1, 1.05])}>
      <g transform="translate(0 -50)">
        <Colon />
      </g>
      <g opacity={aparece(t, T.nada - 0.6)} transform="translate(620 760) rotate(-12)">
        <rect x={-200} y={-60} width={400} height={120} rx={14} fill="none" stroke={C.red} strokeWidth={10} />
        <Texto x={0} y={22} size={58} color={C.red}>
          ¿INÚTIL?
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1420} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1420}
          width={700 * interpolate(t, [T.final, T.intestino], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1510} color={C.white} size={38}>
          si puedes vivir sin él: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. El intestino está lleno de bacterias buenas
export const Intestino: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.intestino, T.apendice], [1, 1.04])}>
      <path
        d="M 160 560 Q 540 460 920 560 Q 1000 700 760 740 Q 360 720 220 860 Q 140 1020 540 1040 Q 900 1040 920 1180"
        stroke={TRIPA}
        strokeWidth={130}
        fill="none"
        strokeLinecap="round"
      />
      {new Array(40).fill(0).map((_, k) => {
        const u = (k / 40 + t * 0.03) % 1;
        // muestreo aproximado del recorrido
        const pts = [
          [160, 560], [540, 500], [920, 560], [900, 700], [760, 740], [360, 730], [220, 860], [300, 1010], [540, 1040], [900, 1080], [920, 1180],
        ];
        const f = u * (pts.length - 1);
        const i = Math.floor(f);
        const r = f - i;
        const x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r + (random(`bx${k}`) - 0.5) * 60;
        const y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r + (random(`by${k}`) - 0.5) * 60;
        return <Bacteria key={k} x={x} y={y} rot={k * 37 + t * 40} op={aparece(t, T.bacterias + (k % 10) * 0.05)} />;
      })}
      <Texto x={300} y={1300} size={38} color={BACT} op={aparece(t, T.digerir)}>
        digieren
      </Texto>
      <Texto x={780} y={1300} size={38} color={C.cyan} op={aparece(t, T.defender)}>
        defienden
      </Texto>
    </Lienzo>
  );
};

// D. El apéndice es un tubito sin salida con una capa de bacterias protegida
export const Tubito: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const dentro = aparece(t, T.dentro);
  return (
    <Lienzo zoom={interpolate(t, [T.apendice, T.diarrea], [1, 1.04])}>
      <g opacity={1 - dentro}>
        <g transform="translate(0 -50)">
          <Colon />
        </g>
        <Texto x={810} y={600} size={36} color={C.white} op={aparece(t, T.pegado)}>
          intestino grueso
        </Texto>
        <g opacity={aparece(t, T.tubito)}>
          <line x1={760} y1={1250} x2={830} y2={1360} stroke={C.yellow} strokeWidth={6} />
          <Texto x={820} y={1410} size={38} color={C.yellow}>
            apéndice
          </Texto>
        </g>
      </g>
      <g opacity={dentro}>
        {/* corte del apéndice: tubo con fondo cerrado */}
        <path d="M 140 640 L 820 640 Q 960 640 960 860 Q 960 1080 820 1080 L 140 1080" fill={TRIPA} />
        <path d="M 140 700 L 800 700 Q 900 700 900 860 Q 900 1020 800 1020 L 140 1020" fill={TRIPA_OSC} />
        {new Array(26).fill(0).map((_, k) => {
          const arriba = k % 2 === 0;
          const x = 170 + (k >> 1) * 56;
          return (
            <Bacteria
              key={k}
              x={x}
              y={arriba ? 720 : 1000}
              rot={(arriba ? 0 : 180) + Math.sin(t * 3 + k) * 10}
              op={aparece(t, T.capa + (k % 6) * 0.05)}
            />
          );
        })}
        <rect x={150} y={736} width={700} height={14} fill={C.cyan} opacity={0.6 * aparece(t, T.protegida)} />
        <rect x={150} y={970} width={700} height={14} fill={C.cyan} opacity={0.6 * aparece(t, T.protegida)} />
        <Texto x={540} y={1200} size={40} color={C.cyan} op={aparece(t, T.protegida)}>
          capa protegida
        </Texto>
        <Texto x={880} y={600} size={32} color={C.grey} op={dentro}>
          sin salida
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. Una diarrea arrasa con todo como una inundación; las del apéndice quedan a salvo
export const Diarrea: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ola = interpolate(t, [T.arrasa - 0.3, T.salvo], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.diarrea, T.despues], [1, 1.04])}>
        <g transform="translate(0 -50)">
          <Colon />
          {new Array(14).fill(0).map((_, k) => {
            const y0 = 480 + (k % 7) * 85;
            const x0 = 390 + Math.floor(k / 7) * 110;
            return <Bacteria key={k} x={x0} y={y0 - ola * 900} rot={k * 30 + ola * 200} op={1 - ola} />;
          })}
          <rect x={340} y={1100 - ola * 640} width={220} height={ola * 640} rx={40} fill={AGUA} opacity={0.6} />
          {new Array(5).fill(0).map((_, k) => (
            <Bacteria key={`a${k}`} x={560 + k * 36} y={1210 + Math.sin(k) * 20} rot={k * 30} s={0.8} />
          ))}
          <Escudo x={640} y={1230} s={0.7} op={aparece(t, T.salvo)} />
        </g>
        <Texto x={540} y={1410} size={40} color={AGUA} op={aparece(t, T.inundacion) * (1 - aparece(t, T.salvo))}>
          inundación
        </Texto>
        <Texto x={540} y={1410} size={40} color={C.cyan} op={aparece(t, T.salvo)}>
          a salvo en el apéndice
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.arrasa} color={AGUA} />
    </>
  );
};

// F. Después salen y vuelven a poblar el intestino
export const Repuebla: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sube = interpolate(t, [T.despues + 0.3, T.ademas], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.despues, T.ademas], [1, 1.04])}>
      <g transform="translate(0 -50)">
        <Colon />
        {new Array(16).fill(0).map((_, k) => {
          const dx = 390 + (k % 4) * 40;
          const dy = 480 + Math.floor(k / 4) * 150;
          return (
            <Bacteria
              key={k}
              x={interpolate(sube, [0, 1], [600 + (k % 5) * 30, dx + (random(`rp${k}`) - 0.5) * 30])}
              y={interpolate(sube, [0, 1], [1220, dy])}
              rot={k * 40 + t * 50}
            />
          );
        })}
      </g>
      <Texto x={540} y={1410} size={40} color={BACT} op={aparece(t, T.poblar)}>
        vuelven a poblar
      </Texto>
    </Lienzo>
  );
};

// G. Tiene tejido de defensa que entrena a los glóbulos blancos
export const Defensa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.ademas, T.aun], [1, 1.04])}>
      {new Array(5).fill(0).map((_, k) => {
        const x = 220 + k * 160;
        const y = 820 + Math.sin(t * 2 + k) * 30;
        return (
          <g key={k} opacity={aparece(t, T.tejido + k * 0.15)}>
            <circle cx={x} cy={y} r={62} fill={C.white} opacity={0.9} />
            <path d={`M ${x - 30} ${y} q 15 -30 30 0 q 15 30 30 0`} stroke={C.purpleLight} strokeWidth={14} fill="none" />
          </g>
        );
      })}
      <g opacity={aparece(t, T.globulos)}>
        <circle cx={540} cy={1100} r={80} fill="none" stroke={C.red} strokeWidth={8} />
        <circle cx={540} cy={1100} r={45} fill="none" stroke={C.red} strokeWidth={8} />
        <circle cx={540} cy={1100} r={12} fill={C.red} />
      </g>
      <Texto x={540} y={650} size={40} color={C.white} op={aparece(t, T.tejido)}>
        glóbulos blancos
      </Texto>
      <Texto x={540} y={1290} size={38} color={C.cyan} op={aparece(t, T.globulos)}>
        entrena tus defensas
      </Texto>
    </Lienzo>
  );
};

// H. Si se inflama hay que quitarlo y se vive bien sin él; pero no es inútil
export const Quitar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const inflama = aparece(t, T.inflama);
  const corte = interpolate(t, [T.inflama + 0.6, T.vive], [0, 1], suave);
  const sello = aparece(t, T.inutil);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.aun, T.porque], [1, 1.05])}>
        <g transform="translate(0 -50)">
          <Colon inflama={inflama} corte={corte} />
        </g>
        <Texto x={540} y={1410} size={40} color={C.white} op={aparece(t, T.vive) * (1 - sello)}>
          se vive bien sin él
        </Texto>
        <g opacity={sello} transform="translate(540 1410) rotate(-6)">
          <rect x={-260} y={-60} width={520} height={110} rx={14} fill="none" stroke="#5AC878" strokeWidth={10} />
          <Texto x={0} y={16} size={52} color="#5AC878">
            NO ES INÚTIL
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.inutil} color="#5AC878" />
    </>
  );
};

// I. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porque, T.fin + 0.5], [1, 1.12])}>
      <Bunker t={t} brillo={1} />
    </Lienzo>
  );
};
