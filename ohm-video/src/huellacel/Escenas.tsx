import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/huellacel/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  lo: 1.8,
  tu: 4.14,
  final: 4.74,
  tuHuella: 8.66,
  crestas: 9.48,
  valles: 10.26,
  muchos: 11.48,
  condensadores: 13.46,
  rejilla: 15.4,
  las: 16.2,
  tocan: 16.8,
  aire: 19.32,
  cada: 19.86,
  carga: 22.16,
  asi: 23.2,
  mapa: 24.18,
  luego: 26.14,
  busca: 27.5,
  cortan: 29.58,
  compara: 30.96,
  una: 32.74,
  plana: 33.14,
  porEso: 36.46,
  fin: 38.4,
};

const PIEL = "#E8B890";
const LINEA = "#8A5A40";

// Huella dactilar: elipses concéntricas con cortes
const Huella: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly color?: string; readonly op?: number }> = ({
  x,
  y,
  s,
  color = LINEA,
  op = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    {new Array(10).fill(0).map((_, k) => (
      <ellipse
        key={k}
        rx={18 + k * 14}
        ry={26 + k * 18}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeDasharray={`${60 + k * 20} ${10 + (k % 3) * 8}`}
        strokeDashoffset={k * 37}
      />
    ))}
  </g>
);

// Celular con lector
const Celular: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly brillo?: number; readonly abierto?: number }> = ({
  x,
  y,
  s,
  brillo = 0,
  abierto = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-200} y={-380} width={400} height={760} rx={50} fill="#1A1620" />
    <rect x={-180} y={-340} width={360} height={680} rx={30} fill="#2A2640" />
    <circle cx={0} cy={200} r={70} fill={brillo > 0.5 ? "#3A6A5A" : "#3A3650"} />
    <Huella x={0} y={200} s={0.32} color={brillo > 0.5 ? "#5AC878" : C.grey} />
    {/* candado */}
    <g transform="translate(0 -120)">
      <rect x={-50} y={-10} width={100} height={80} rx={12} fill={abierto > 0.5 ? "#5AC878" : C.grey} />
      <path d={`M -30 -10 L -30 -50 A 30 30 0 0 1 30 -50 L 30 ${-10 - abierto * 30}`} stroke={abierto > 0.5 ? "#5AC878" : C.grey} strokeWidth={14} fill="none" />
    </g>
  </g>
);

// Dedo que baja hacia el lector
const Dedo: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-60} y={-400} width={120} height={400} rx={60} fill={PIEL} />
    <ellipse cx={0} cy={-60} rx={40} ry={30} fill="#F0D0B0" />
  </g>
);

// A. Gancho: ¿cómo reconoce tu dedo el celular?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.lo], [1.12, 1])}>
        <Celular x={540} y={940} s={1.2} />
        <Dedo x={540} y={interpolate(t, [0, 1.6], [900, 1100], clamp)} s={1.1} />
        <Texto x={820} y={560} size={110} color={C.yellow} op={interpolate(t, [0.6, 0.9], [0, 1], clamp)}>
          ?
        </Texto>
      </Lienzo>
      <Flash t={t} d={0.62} color="#5AC878" />
    </>
  );
};

// B. Lo tocas medio segundo y ya sabe que eres tú + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ok = aparece(t, T.lo + 1.2);
  return (
    <Lienzo zoom={interpolate(t, [T.lo, T.tuHuella], [1, 1.05])}>
      <Celular x={540} y={860} s={0.95} brillo={ok} abierto={ok} />
      <Texto x={540} y={600} size={40} color="#5AC878" op={aparece(t, T.tu)}>
        eres tú
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1300} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1300}
          width={700 * interpolate(t, [T.final, T.tuHuella], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1400} color={C.white} size={36}>
          por qué una foto no lo engaña: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Perfil de la piel: crestas y valles sobre la línea y
const Perfil: React.FC<{ readonly y: number; readonly baja: number }> = ({ y, baja }) => (
  <path
    d={
      `M 60 ${y - 200 + baja} ` +
      new Array(25)
        .fill(0)
        .map((_, k) => `L ${60 + k * 40} ${y + baja - 30 + Math.cos(k * Math.PI * 0.5) * 30}`)
        .join(" ") +
      ` L 1020 ${y - 200 + baja} Z`
    }
    fill={PIEL}
  />
);

// C. Tu huella tiene crestas y valles diminutos
export const Crestas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const corte = aparece(t, T.crestas);
  return (
    <Lienzo zoom={interpolate(t, [T.tuHuella, T.muchos], [1, 1.04])}>
      <g opacity={1 - corte * 0.7}>
        <ellipse cx={540} cy={780} rx={230} ry={300} fill={PIEL} />
        <Huella x={540} y={780} s={1.4} />
      </g>
      <g opacity={corte}>
        <Perfil y={1200} baja={0} />
        <Texto x={300} y={1260} size={34} color={C.yellow}>
          crestas
        </Texto>
        <Texto x={780} y={1260} size={34} color={C.cyan} op={aparece(t, T.valles)}>
          valles
        </Texto>
      </g>
    </Lienzo>
  );
};

// Rejilla de condensadores (estado por celda)
const Rejilla: React.FC<{ readonly x: number; readonly y: number; readonly n: number; readonly lado: number; readonly valor?: (i: number, j: number) => number }> = ({
  x,
  y,
  n,
  lado,
  valor = () => 0,
}) => (
  <g>
    {new Array(n).fill(0).map((_, i) =>
      new Array(n).fill(0).map((__, j) => {
        const v = valor(i, j);
        return (
          <rect
            key={`${i}${j}`}
            x={x + i * lado}
            y={y + j * lado}
            width={lado - 4}
            height={lado - 4}
            rx={3}
            fill={v > 0.5 ? C.cyan : "#2A3A5A"}
          />
        );
      }),
    )}
  </g>
);

// D. Debajo hay miles de condensadores pequeñísimos, como una rejilla
export const Condensadores: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.muchos, T.las], [1, 1.04])}>
      <g opacity={aparece(t, T.muchos + 0.4)}>
        <Rejilla x={190} y={520} n={20} lado={35} />
      </g>
      <Texto x={540} y={1300} size={40} color={C.cyan} op={aparece(t, T.condensadores)}>
        miles de condensadores
      </Texto>
    </Lienzo>
  );
};

// E. Las crestas tocan el sensor; los valles dejan aire; cada condensador mide la diferencia de carga
export const Toca: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const baja = interpolate(t, [T.las, T.tocan + 0.4], [-200, 0], suave);
  const mide = aparece(t, T.cada);
  return (
    <Lienzo zoom={interpolate(t, [T.las, T.asi], [1, 1.04])}>
      <Perfil y={900} baja={baja} />
      {new Array(24).fill(0).map((_, k) => {
        const cresta = k % 4 === 0 || k % 4 === 3;
        return (
          <g key={k}>
            <rect x={60 + k * 40} y={904} width={36} height={60} rx={4} fill={mide > 0.5 && cresta ? C.cyan : "#2A3A5A"} />
            {mide > 0.5 ? (
              <text x={78 + k * 40} y={1000} textAnchor="middle" fontSize={20} fontWeight={700} fill={cresta ? C.cyan : C.grey} fontFamily="JetBrains Mono">
                {cresta ? "+" : "-"}
              </text>
            ) : null}
          </g>
        );
      })}
      <Texto x={540} y={1120} size={36} color={C.yellow} op={aparece(t, T.tocan)}>
        crestas: tocan el sensor
      </Texto>
      <Texto x={540} y={1190} size={36} color={C.grey} op={aparece(t, T.aire)}>
        valles: hueco de aire
      </Texto>
      <Texto x={540} y={1280} size={36} color={C.cyan} op={aparece(t, T.carga)}>
        diferencia de carga eléctrica
      </Texto>
    </Lienzo>
  );
};

// Valor de la huella en la rejilla (anillos)
const enHuella = (i: number, j: number, n: number) => {
  const dx = (i - n / 2) / 0.8;
  const dy = (j - n / 2) / 1.0;
  const r = Math.sqrt(dx * dx + dy * dy);
  return Math.sin(r * 1.6) > 0.2 && r < n / 2 ? 1 : 0;
};

// F. Así dibuja un mapa de tu huella, punto a punto
export const Mapa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const barrido = interpolate(t, [T.asi + 0.2, T.luego - 0.3], [0, 20], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.luego], [1, 1.04])}>
      <Rejilla x={190} y={520} n={20} lado={35} valor={(i, j) => (j < barrido ? enHuella(i, j, 20) : 0)} />
      <Texto x={540} y={1300} size={40} color={C.cyan} op={aparece(t, T.mapa)}>
        un mapa, punto a punto
      </Texto>
    </Lienzo>
  );
};

// G. No guarda la foto: busca dónde las líneas se cortan o terminan y los compara
export const Minucias: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pts = [
    [-60, -120],
    [80, -60],
    [-100, 40],
    [40, 110],
    [110, 170],
    [-40, -10],
  ];
  const compara = aparece(t, T.compara);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.luego, T.una], [1, 1.04])}>
        <Huella x={300} y={840} s={1.1} op={0.7} />
        {pts.map(([dx, dy], k) => (
          <circle key={k} cx={300 + dx} cy={840 + dy} r={18} fill="none" stroke={C.red} strokeWidth={6} opacity={aparece(t, T.busca + k * 0.2)} />
        ))}
        <g opacity={compara}>
          <rect x={620} y={600} width={320} height={480} rx={20} fill={C.card} stroke={C.cardBorder} strokeWidth={4} />
          <Texto x={780} y={650} size={28} color={C.grey}>
            registrada
          </Texto>
          {pts.map(([dx, dy], k) => (
            <g key={`r${k}`}>
              <circle cx={780 + dx * 0.9} cy={860 + dy * 0.9} r={14} fill={C.red} />
              <line x1={300 + dx} y1={840 + dy} x2={780 + dx * 0.9} y2={860 + dy * 0.9} stroke="#5AC878" strokeWidth={3} strokeDasharray="10 8" opacity={aparece(t, T.compara + 0.4 + k * 0.1)} />
            </g>
          ))}
        </g>
        <Texto x={540} y={540} size={36} color={C.grey} op={aparece(t, T.luego) * (1 - aparece(t, T.busca))}>
          no guarda la foto
        </Texto>
        <Texto x={540} y={1250} size={38} color={C.red} op={aparece(t, T.cortan)}>
          cruces y finales de las líneas
        </Texto>
        <Texto x={540} y={1330} size={38} color="#5AC878" op={aparece(t, T.compara + 1)}>
          ¡coinciden!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.compara + 1} color="#5AC878" />
    </>
  );
};

// H. Una foto plana no tiene crestas ni valles, así que no lo engaña
export const Foto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.una, T.porEso], [1, 1.04])}>
      <g transform="translate(540 700) rotate(-6)">
        <rect x={-220} y={-170} width={440} height={300} fill={C.white} />
        <Huella x={0} y={-20} s={0.8} color="#4A4A5A" />
      </g>
      {new Array(24).fill(0).map((_, k) => (
        <rect key={k} x={60 + k * 40} y={980} width={36} height={60} rx={4} fill="#2A3A5A" />
      ))}
      <rect x={60} y={950} width={960} height={26} fill={C.white} opacity={aparece(t, T.plana)} />
      <Texto x={540} y={1150} size={40} color={C.white} op={aparece(t, T.plana)}>
        foto plana: sin crestas
      </Texto>
      <g opacity={aparece(t, T.plana + 1.2)} transform="translate(540 1280)">
        <path d="M -40 -40 L 40 40 M 40 -40 L -40 40" stroke={C.red} strokeWidth={16} strokeLinecap="round" />
      </g>
    </Lienzo>
  );
};

// I. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Celular x={540} y={940} s={1.2} />
      <Dedo x={540} y={900} s={1.1} />
      <Texto x={820} y={560} size={110} color={C.yellow}>
        ?
      </Texto>
    </Lienzo>
  );
};
