import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/nivel/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  tubito: 2.34, // tubito
  parece: 3.58, // parece
  curvado: 5.02, // curvado
  platano: 6.14, // platano
  final: 7.10, // final
  burbuja: 9.58, // burbuja
  aire: 10.28, // aire
  liviano: 11.12, // liviano
  sube: 12.88, // sube
  alto: 14.04, // alto
  si: 15.18, // si
  recto: 15.84, // recto
  horizontal: 16.76, // horizontal
  habria: 17.74, // habria
  cualquier: 20.28, // cualquier
  con: 21.40, // con
  curva: 21.72, // curva
  centro: 24.12, // centro
  nivelada: 25.58, // nivelada
  inclina: 26.70, // inclina
  mueve: 28.22, // mueve
  cuanto: 30.16, // cuanto
  suave: 30.72, // suave
  minima: 33.90, // minima
  preciso: 35.06, // preciso
  porEso: 36.60, // por
  fin: 38.46, // FIN
};

const LIQ = "#C8E05A";

// Tubo curvo (arco de radio R) centrado en (cx, cy), inclinado tilt grados. La burbuja busca el punto más alto.
const Tubo: React.FC<{
  readonly cx: number;
  readonly cy: number;
  readonly R: number;
  readonly tilt?: number;
  readonly mitad?: number;
  readonly grosor?: number;
  readonly burbuja?: number;
}> = ({ cx, cy, R, tilt = 0, mitad = 330, grosor = 90, burbuja = 1 }) => {
  const a = mitad / R;
  const pt = (phi: number, dr = 0) => [cx + (R + dr) * Math.sin(phi), cy + R - (R + dr) * Math.cos(phi)];
  const arco = (dr: number) =>
    new Array(41)
      .fill(0)
      .map((_, i) => {
        const [x, y] = pt(-a + (2 * a * i) / 40, dr);
        return `${i ? "L" : "M"} ${x} ${y}`;
      })
      .join(" ");
  const bA = 60 / R;
  const phiB = Math.max(-a + bA, Math.min(a - bA, (-tilt * Math.PI) / 180));
  const [bx, by] = pt(phiB, grosor * 0.22);
  const marca = (phi: number) => {
    const [x1, y1] = pt(phi, grosor / 2);
    const [x2, y2] = pt(phi, -grosor / 2);
    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#111" strokeWidth={6} />;
  };
  return (
    <g transform={`rotate(${tilt} ${cx} ${cy})`}>
      <path d={arco(0)} stroke="#E8F0F8" strokeWidth={grosor + 16} fill="none" strokeLinecap="round" opacity={0.9} />
      <path d={arco(0)} stroke={LIQ} strokeWidth={grosor} fill="none" strokeLinecap="round" />
      <ellipse cx={bx} cy={by} rx={62} ry={grosor * 0.28} fill="#F8FFF0" opacity={burbuja} transform={`rotate(${(phiB * 180) / Math.PI} ${bx} ${by})`} />
      {marca(-bA - 6 / R)}
      {marca(bA + 6 / R)}
    </g>
  );
};

// Nivel completo (barra amarilla con el tubo)
const Nivel: React.FC<{ readonly t: number; readonly y: number; readonly tilt?: number }> = ({ y, tilt = 0 }) => (
  <g transform={`rotate(${tilt} 540 ${y})`}>
    <rect x={90} y={y - 70} width={900} height={140} rx={16} fill={C.yellow} />
    <rect x={380} y={y - 45} width={320} height={90} rx={14} fill="#2A2440" />
    <Tubo cx={540} cy={y - 10} R={3000} mitad={140} grosor={50} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Tubo cx={540} cy={860} R={700} tilt={3 * Math.sin(t * 2)} />
    <Texto x={540} y={1300} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este tubo no es recto?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.tubito], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Parece recto pero está curvado, como un plátano + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const R = interpolate(t, [T.curvado, T.curvado + 0.8], [60000, 700], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.tubito, T.burbuja], [1, 1.04])}>
      <g opacity={1 - aparece(t, T.parece)}>
        <Nivel t={t} y={900} />
      </g>
      <g opacity={aparece(t, T.parece)}>
        <Tubo cx={540} cy={880} R={R} />
        <Texto x={540} y={1100} size={40} color={C.white} op={aparece(t, T.parece) * (1 - aparece(t, T.curvado))}>
          ¿recto?
        </Texto>
        <Texto x={540} y={1100} size={44} color={C.yellow} op={aparece(t, T.curvado)}>
          curvado
        </Texto>
        <Texto x={540} y={1180} size={38} color={C.white} op={aparece(t, T.platano)}>
          como un plátano 🍌
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿qué decide su precisión?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.burbuja], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. La burbuja es aire, más liviana que el líquido: siempre sube al punto más alto
export const Sube: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tilt = interpolate(t, [T.sube, T.sube + 0.6, T.alto, T.alto + 0.6], [0, 10, 10, -10], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.burbuja, T.si], [1, 1.04])}>
      <Tubo cx={540} cy={880} R={700} tilt={tilt} />
      <Texto x={540} y={600} size={40} color="#F8FFF0" op={aparece(t, T.aire)}>
        burbuja = aire
      </Texto>
      <Texto x={540} y={1150} size={38} color={LIQ} op={aparece(t, T.liviano)}>
        más liviano que el líquido
      </Texto>
      <Texto x={540} y={1230} size={42} color={C.yellow} op={aparece(t, T.sube)}>
        sube al punto más alto ↑
      </Texto>
    </Lienzo>
  );
};

// D. Si fuera recto y horizontal no habría punto más alto: la burbuja iría a cualquier lado
export const Recto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const vaga = aparece(t, T.cualquier - 0.6);
  const bx = 540 + vaga * 230 * Math.sin(t * 1.7) * Math.cos(t * 0.6);
  return (
    <Lienzo zoom={interpolate(t, [T.si, T.con], [1, 1.04])}>
      <g opacity={aparece(t, T.recto)}>
        <rect x={200} y={835} width={680} height={106} rx={53} fill="#E8F0F8" />
        <rect x={208} y={843} width={664} height={90} rx={45} fill={LIQ} />
        <ellipse cx={bx} cy={868} rx={62} ry={25} fill="#F8FFF0" />
        <line x1={200} y1={1000} x2={880} y2={1000} stroke={C.grey} strokeWidth={4} strokeDasharray="16 12" opacity={aparece(t, T.horizontal)} />
      </g>
      <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.recto)}>
        tubo recto y horizontal
      </Texto>
      <Texto x={540} y={1150} size={38} color={C.grey} op={aparece(t, T.habria)}>
        sin punto más alto
      </Texto>
      <Texto x={540} y={1230} size={40} color={C.red} op={aparece(t, T.cualquier)}>
        la burbuja se va a cualquier lado
      </Texto>
    </Lienzo>
  );
};

// E. Con la curva, el punto más alto queda en el centro si está nivelado; si se inclina, la burbuja se mueve
export const Curva: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tilt = interpolate(t, [T.inclina, T.inclina + 0.8], [0, 6], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.con, T.cuanto], [1, 1.04])}>
        <Tubo cx={540} cy={880} R={700} tilt={tilt} />
        <line x1={540} y1={700} x2={540} y2={760} stroke={C.yellow} strokeWidth={6} opacity={aparece(t, T.centro) * (1 - aparece(t, T.inclina))} />
        <Texto x={540} y={680} size={36} color={C.yellow} op={aparece(t, T.centro) * (1 - aparece(t, T.inclina))}>
          punto más alto: el centro
        </Texto>
        <Texto x={540} y={1150} size={40} color="#5AD08A" op={aparece(t, T.nivelada) * (1 - aparece(t, T.inclina))}>
          nivelado ✓
        </Texto>
        <Texto x={540} y={1150} size={40} color={C.orange} op={aparece(t, T.inclina)}>
          inclinado {tilt.toFixed(0)}°
        </Texto>
        <Texto x={540} y={1230} size={38} color={C.white} op={aparece(t, T.mueve)}>
          el punto alto se mueve… y la burbuja
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.centro} color={C.yellow} />
    </>
  );
};

// F. Cuanto más suave la curva, más se mueve la burbuja con una inclinación mínima: más precisión
export const Precision: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tilt = 2.5 * interpolate(t, [T.minima - 0.8, T.minima], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cuanto, T.porEso], [1, 1.04])}>
        <Texto x={540} y={540} size={34} color={C.grey}>
          curva fuerte
        </Texto>
        <Tubo cx={540} cy={700} R={500} tilt={tilt} grosor={80} />
        <g opacity={aparece(t, T.suave)}>
          <Texto x={540} y={1000} size={34} color={C.cyan}>
            curva suave
          </Texto>
          <Tubo cx={540} cy={1160} R={4000} tilt={tilt} grosor={80} />
        </g>
        <Texto x={540} y={1360} size={36} color={C.orange} op={aparece(t, T.minima - 0.8)}>
          misma inclinación: {tilt.toFixed(1)}°
        </Texto>
        <Texto x={540} y={1440} size={44} color={C.yellow} op={aparece(t, T.preciso)}>
          curva suave = más preciso
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.preciso} color={C.yellow} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
