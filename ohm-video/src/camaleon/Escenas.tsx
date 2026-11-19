import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/camaleon/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  giran: 2.26, // giran
  adelante: 4.08, // adelante
  atras: 5.08, // atras
  final: 6.06, // final
  torreta: 9.90, // torreta
  ciento: 10.96, // ciento
  cuenta: 13.16, // cuenta
  cerebro: 14.02, // cerebro
  mezcla: 14.72, // mezcla
  procesa: 16.64, // procesa
  alternando: 18.14, // alternando
  vigila: 21.26, // vigila
  pero: 24.16, // pero
  insecto: 25.24, // insecto
  gira2: 25.74, // gira
  ambos: 27.98, // ambos
  enfoca: 29.50, // enfoca
  distancia: 30.50, // distancia
  dispara: 32.12, // dispara
  asi: 33.70, // asi
  fin: 35.52, // FIN
};

const VERDE = "#4AC86A";
const CONO1 = "#F8C848";
const CONO2 = C.cyan;

// Camaleón visto desde arriba (cabeza hacia la derecha); a1/a2 = dirección de cada ojo (grados, 0 = adelante)
const Camaleon: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly a1: number; readonly a2: number; readonly conos?: number; readonly lengua?: number }> = ({
  x,
  y,
  s,
  a1,
  a2,
  conos = 1,
  lengua = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -300 0 Q -380 60 -420 0 Q -460 -60 -400 -60 Q -360 -50 -380 -10" stroke={VERDE} strokeWidth={30} fill="none" strokeLinecap="round" />
    <ellipse cx={-120} cy={0} rx={200} ry={90} fill={VERDE} />
    <path d="M 60 -70 L 240 0 L 60 70 Z" fill={VERDE} />
    <line x1={240} y1={0} x2={240 + lengua * 400} y2={0} stroke="#E8829A" strokeWidth={14} strokeLinecap="round" />
    <circle cx={240 + lengua * 400} cy={0} r={lengua > 0.05 ? 22 : 0} fill="#E8829A" />
    {[
      [-1, a1, CONO1],
      [1, a2, CONO2],
    ].map(([sd, a, col]) => {
      const ey = (sd as number) * 70;
      const rad = ((a as number) * Math.PI) / 180;
      const dx = Math.cos(rad);
      const dy = Math.sin(rad) * (sd as number);
      return (
        <g key={sd as number}>
          <path
            d={`M 110 ${ey} L ${110 + Math.cos(rad - 0.25) * 420} ${ey + Math.sin(rad - 0.25) * (sd as number) * 420} L ${110 + Math.cos(rad + 0.25) * 420} ${ey + Math.sin(rad + 0.25) * (sd as number) * 420} Z`}
            fill={col as string}
            opacity={0.18 * conos}
          />
          <circle cx={110} cy={ey} r={42} fill="#3AA85A" stroke="#2A7A3A" strokeWidth={6} />
          <circle cx={110 + dx * 22} cy={ey + dy * 22} r={14} fill="#111" />
        </g>
      );
    })}
  </g>
);

const Mosca: React.FC<{ readonly x: number; readonly y: number; readonly t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x + Math.sin(t * 7) * 10} ${y + Math.cos(t * 9) * 8})`}>
    <ellipse cx={0} cy={0} rx={22} ry={14} fill="#222" />
    <ellipse cx={-6} cy={-16} rx={14} ry={9} fill="#C8D8F8" opacity={0.7} />
    <ellipse cx={8} cy={-16} rx={14} ry={9} fill="#C8D8F8" opacity={0.7} />
  </g>
);

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Camaleon x={500} y={940} s={1.05} a1={-20 + Math.sin(t) * 10} a2={150 + Math.sin(t * 1.3) * 15} />
    <Texto x={540} y={560} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo no ve doble este camaleón?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.giran], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={VERDE} />
    </>
  );
};

// B. Sus ojos giran por separado: uno adelante y otro atrás + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const a1 = interpolate(t, [T.giran, T.adelante], [60, -10], clamp);
  const a2 = interpolate(t, [T.giran, T.atras], [20, 160], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.giran, T.torreta], [1, 1.04])}>
      <Camaleon x={500} y={880} s={1} a1={a1} a2={a2} />
      <Texto x={860} y={600} size={34} color={CONO1} op={aparece(t, T.adelante)}>
        adelante
      </Texto>
      <Texto x={220} y={1180} size={34} color={CONO2} op={aparece(t, T.atras)}>
        atrás
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.torreta], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          cuando encuentra comida: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Cada ojo está en una torreta que gira casi 180 grados por su cuenta
export const Torreta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const a = Math.sin((t - T.torreta) * 1.5) * 85;
  return (
    <Lienzo zoom={interpolate(t, [T.torreta, T.cerebro], [1, 1.04])}>
      <g opacity={aparece(t, T.ciento)}>
        <path d="M 540 900 m -300 0 a 300 300 0 0 1 600 0" stroke={C.yellow} strokeWidth={6} fill="none" strokeDasharray="16 10" />
        <Texto x={540} y={560} size={44} color={C.yellow}>
          casi 180°
        </Texto>
      </g>
      <g transform={`translate(540 900) rotate(${a})`}>
        <circle cx={0} cy={0} r={160} fill="#3AA85A" stroke="#2A7A3A" strokeWidth={14} />
        {[0, 1, 2].map((k) => (
          <circle key={k} cx={0} cy={-60} r={130 - k * 30} fill="none" stroke="#2A7A3A" strokeWidth={6} opacity={0.6} />
        ))}
        <circle cx={0} cy={-120} r={40} fill="#111" />
      </g>
      <Texto x={540} y={1200} size={38} color={C.white} op={aparece(t, T.cuenta)}>
        cada ojo, por su cuenta
      </Texto>
    </Lienzo>
  );
};

// D. El cerebro no mezcla las imágenes: las procesa por separado y alterna su atención
export const Cerebro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const alterna = aparece(t, T.alternando) * (Math.sin((t - T.alternando) * 4) > 0 ? 1 : 0);
  return (
    <Lienzo zoom={interpolate(t, [T.cerebro, T.pero], [1, 1.04])}>
      {[0, 1].map((k) => {
        const activo = k === 0 ? 1 - alterna : alterna;
        const col = k === 0 ? CONO1 : CONO2;
        return (
          <g key={k} opacity={aparece(t, T.procesa)}>
            <rect x={120 + k * 440} y={560} width={400} height={300} rx={20} fill={C.card} stroke={col} strokeWidth={4 + 8 * activo * aparece(t, T.alternando)} />
            <Texto x={320 + k * 440} y={720} size={36} color={col}>
              {k === 0 ? "ojo 1: adelante" : "ojo 2: atrás"}
            </Texto>
          </g>
        );
      })}
      <g opacity={aparece(t, T.mezcla) * (1 - aparece(t, T.procesa))}>
        <Texto x={540} y={720} size={44} color={C.red}>
          no las mezcla
        </Texto>
      </g>
      <Texto x={540} y={1000} size={38} color={C.white} op={aparece(t, T.alternando)}>
        alterna su atención
      </Texto>
      <g opacity={aparece(t, T.vigila)}>
        <circle cx={540} cy={1230} r={150} fill={VERDE} opacity={0.15} stroke={VERDE} strokeWidth={4} />
        <Texto x={540} y={1245} size={32} color={VERDE}>
          vigila casi todo
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. Al detectar un insecto gira los dos ojos hacia él, enfoca y mide la distancia; dispara la lengua
export const Insecto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const conv = interpolate(t, [T.gira2, T.ambos], [0, 1], clamp);
  const a1 = -10 * (1 - conv) + 8 * conv;
  const a2 = 160 * (1 - conv) + 8 * conv;
  const lengua = interpolate(t, [T.dispara, T.dispara + 0.15, T.dispara + 0.5], [0, 1, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pero, T.asi], [1, 1.04])}>
        <Camaleon x={360} y={940} s={0.8} a1={a1} a2={a2} lengua={lengua} />
        <g opacity={aparece(t, T.insecto) * (1 - (lengua > 0.9 ? 1 : 0))}>
          <Mosca x={880} y={940} t={t} />
        </g>
        <g opacity={aparece(t, T.distancia)}>
          <path d="M 560 1080 L 870 1080 M 560 1060 L 560 1100 M 870 1060 L 870 1100" stroke={C.white} strokeWidth={5} />
          <Texto x={715} y={1140} size={32} color={C.white}>
            distancia exacta
          </Texto>
        </g>
        <Texto x={540} y={600} size={40} color={C.yellow} op={aparece(t, T.ambos) * (1 - aparece(t, T.dispara))}>
          los dos ojos al insecto
        </Texto>
        <Texto x={540} y={600} size={48} color="#E8829A" op={aparece(t, T.dispara)}>
          ¡lengua!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.dispara} color="#E8829A" />
    </>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
