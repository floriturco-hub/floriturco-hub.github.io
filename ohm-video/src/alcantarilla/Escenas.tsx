import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/alcantarilla/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  casi: 2.50, // casi
  circulos: 4.34, // circulos
  final: 5.40, // final
  circulo: 8.48, // circulo
  ancho: 9.80, // ancho
  gires: 11.56, // gires
  nunca: 12.76, // nunca
  caer: 14.92, // caer
  cuadrada: 16.32, // cuadrada
  canto: 18.12, // canto
  diagonal: 19.60, // diagonal
  cae: 21.82, // cae
  ademas: 22.86, // ademas
  alinearla: 24.82, // alinearla
  encaja: 25.30, // encaja
  pesa: 27.56, // pesa
  rodar: 29.64, // rodar
  pozo: 30.52, // pozo
  tubo: 31.26, // tubo
  presion: 33.32, // presion
  porEso: 34.36, // por
  fin: 36.32, // FIN
};

const HIERRO = "#5A5A68";
const CALLE = "#2A2A34";

// Tapa redonda vista desde arriba
const Tapa: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly rot?: number }> = ({ x, y, r, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <circle cx={0} cy={0} r={r} fill={HIERRO} stroke="#8C88A8" strokeWidth={r * 0.06} />
    {new Array(5).fill(0).map((_, k) => (
      <g key={k}>
        <line x1={-r * 0.8} y1={-r * 0.6 + k * r * 0.3} x2={r * 0.8} y2={-r * 0.6 + k * r * 0.3} stroke="#3A3A48" strokeWidth={r * 0.05} />
        <line x1={-r * 0.6 + k * r * 0.3} y1={-r * 0.8} x2={-r * 0.6 + k * r * 0.3} y2={r * 0.8} stroke="#3A3A48" strokeWidth={r * 0.05} />
      </g>
    ))}
    <circle cx={0} cy={0} r={r * 0.25} fill="#4A4A58" />
  </g>
);

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <rect x={60} y={560} width={960} height={760} rx={30} fill={CALLE} />
    <Tapa x={540} y={940} r={280} />
    <Texto x={540} y={1460} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué las alcantarillas son redondas?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.casi], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.yellow} />
    </>
  );
};

// B. En casi todo el mundo las tapas son círculos + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.casi, T.circulo], [1, 1.04])}>
      {[
        [300, 700],
        [780, 760],
        [540, 1040],
        [260, 1180],
        [820, 1180],
      ].map(([x, y], k) => (
        <g key={k} opacity={aparece(t, T.casi + k * 0.25)}>
          <Tapa x={x} y={y} r={110} rot={k * 20} />
        </g>
      ))}
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.circulo], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          el detalle que ahorra trabajo
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Un círculo mide lo mismo de ancho en todas direcciones
export const Ancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const a = (t - T.ancho) * 40;
  return (
    <Lienzo zoom={interpolate(t, [T.circulo, T.gires], [1, 1.04])}>
      <Tapa x={540} y={900} r={300} />
      <g opacity={aparece(t, T.ancho)} transform={`rotate(${a} 540 900)`}>
        <line x1={230} y1={900} x2={850} y2={900} stroke={C.yellow} strokeWidth={10} />
        <circle cx={230} cy={900} r={14} fill={C.yellow} />
        <circle cx={850} cy={900} r={14} fill={C.yellow} />
      </g>
      <Texto x={540} y={1330} size={40} color={C.yellow} op={aparece(t, T.ancho)}>
        mismo ancho en todas direcciones
      </Texto>
    </Lienzo>
  );
};

// Corte lateral del pozo con reborde; tapa como segmento de longitud L girando
const Pozo: React.FC<{ readonly ang: number; readonly L: number; readonly cae?: number; readonly hueco: number; readonly col: string }> = ({ ang, L, cae = 0, hueco, col }) => (
  <g>
    <rect x={60} y={900} width={540 - hueco / 2 - 60} height={420} fill="#5A4A3A" />
    <rect x={540 + hueco / 2} y={900} width={1020 - 540 - hueco / 2} height={420} fill="#5A4A3A" />
    <rect x={540 - hueco / 2} y={900} width={hueco} height={420} fill="#141030" />
    <g transform={`translate(540 ${800 + cae * 450}) rotate(${ang})`}>
      <rect x={-L / 2} y={-14} width={L} height={28} rx={8} fill={col} />
    </g>
  </g>
);

// D. Gires como gires la tapa, nunca cabe por el hueco: no puede caer
export const Gira: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ang = (t - T.gires) * 60;
  return (
    <Lienzo zoom={interpolate(t, [T.gires, T.cuadrada], [1, 1.04])}>
      <Pozo ang={ang} L={460} hueco={420} col={HIERRO} />
      <g opacity={aparece(t, T.nunca)}>
        <path d="M 330 1360 L 750 1360 M 330 1340 L 330 1380 M 750 1340 L 750 1380" stroke={C.cyan} strokeWidth={5} />
        <Texto x={540} y={1430} size={34} color={C.cyan}>
          hueco más angosto que la tapa
        </Texto>
      </g>
      <Texto x={540} y={560} size={44} color={C.yellow} op={aparece(t, T.caer)}>
        nunca cabe
      </Texto>
    </Lienzo>
  );
};

// E. Una tapa cuadrada sí: de canto, su lado pasa por la diagonal del hueco, que es más larga
export const Cuadrada: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cae = interpolate(t, [T.cae, T.cae + 0.5], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cuadrada, T.ademas], [1, 1.04])}>
        <rect x={60} y={560} width={960} height={760} rx={30} fill={CALLE} />
        <rect x={340} y={740} width={400} height={400} fill="#141030" stroke="#8C88A8" strokeWidth={8} />
        <g opacity={aparece(t, T.diagonal)}>
          <line x1={340} y1={1140} x2={740} y2={740} stroke={C.yellow} strokeWidth={6} strokeDasharray="16 10" />
          <Texto x={860} y={720} size={32} color={C.yellow}>
            diagonal
          </Texto>
          <Texto x={860} y={760} size={32} color={C.yellow}>
            más larga
          </Texto>
        </g>
        <g transform={`translate(540 940) rotate(${aparece(t, T.canto) * -45}) scale(${1 - cae * 0.6})`} opacity={1 - cae * 0.8}>
          <rect x={-215} y={aparece(t, T.canto) * -10 - 215 * (1 - aparece(t, T.canto) * 0.95)} width={430} height={430 * (1 - aparece(t, T.canto) * 0.95)} fill={HIERRO} stroke="#8C88A8" strokeWidth={6} />
        </g>
        <Texto x={540} y={1420} size={44} color={C.red} op={aparece(t, T.cae)}>
          ¡se cae al pozo!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.cae} color={C.red} />
    </>
  );
};

// F. No hay que alinearla, encaja en cualquier posición; pesa decenas de kilos pero se puede rodar
export const Ventajas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rueda = aparece(t, T.rodar);
  const x = interpolate(t, [T.rodar, T.pozo], [200, 860], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.ademas, T.pozo], [1, 1.04])}>
      <g opacity={1 - rueda}>
        <rect x={60} y={560} width={960} height={760} rx={30} fill={CALLE} />
        <circle cx={540} cy={900} r={290} fill="#141030" />
        <Tapa x={540} y={900} r={270} rot={(t - T.ademas) * 50} />
        <Texto x={540} y={1300} size={40} color={C.cyan} op={aparece(t, T.encaja)}>
          encaja en cualquier posición
        </Texto>
      </g>
      <g opacity={rueda}>
        <rect x={0} y={1180} width={1080} height={30} fill="#5A4A3A" />
        <g transform={`translate(${x} 1000)`}>
          <ellipse cx={0} cy={0} rx={50} ry={180} fill={HIERRO} stroke="#8C88A8" strokeWidth={8} />
          <line x1={0} y1={-170} x2={0} y2={170} stroke="#3A3A48" strokeWidth={6} transform={`rotate(${(t - T.rodar) * 20})`} />
        </g>
        <Texto x={540} y={720} size={40} color={C.white}>
          se puede rodar
        </Texto>
      </g>
      <Texto x={540} y={500} size={36} color={C.grey} op={aparece(t, T.pesa) * (1 - rueda)}>
        decenas de kilos
      </Texto>
    </Lienzo>
  );
};

// G. El pozo es un tubo: redondo aguanta mejor la presión de la tierra
export const Tubo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.pozo, T.porEso], [1, 1.04])}>
      <rect x={60} y={560} width={960} height={760} rx={30} fill="#5A4A3A" />
      <circle cx={540} cy={940} r={260} fill="#141030" stroke="#8C88A8" strokeWidth={30} />
      <g opacity={aparece(t, T.presion)}>
        {new Array(12).fill(0).map((_, k) => {
          const a = (k / 12) * Math.PI * 2;
          const r1 = 400 + Math.sin(t * 5) * 10;
          return (
            <path
              key={k}
              d={`M ${540 + Math.cos(a) * r1} ${940 + Math.sin(a) * r1} L ${540 + Math.cos(a) * 300} ${940 + Math.sin(a) * 300}`}
              stroke={C.orange}
              strokeWidth={8}
              markerEnd=""
            />
          );
        })}
      </g>
      <Texto x={540} y={950} size={40} color={C.white} op={aparece(t, T.tubo)}>
        tubo redondo
      </Texto>
      <Texto x={540} y={1400} size={36} color={C.orange} op={aparece(t, T.presion)}>
        reparte la presión de la tierra
      </Texto>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} />
    </Lienzo>
  );
};
