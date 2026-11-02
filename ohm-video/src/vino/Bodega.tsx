import { Easing, interpolate } from "remotion";
import { Persona } from "../orinar/Persona";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: una bodega con barra. Un catador (de perfil) sostiene la copa; a su derecha, la botella cara y la barata;
// más a la derecha, una caja de vino barato sobre una caja de madera.
type P2 = [number, number];
const BARRA = 1350;
const PX = 260;
const SUELO = BARRA + 408;
const CABEZA: P2 = [PX, SUELO - 712];
const CEREBRO: P2 = [PX - 5, CABEZA[1] - 25];
const OJO: P2 = [PX + 26, CABEZA[1] - 2];
const BOCA: P2 = [PX + 40, CABEZA[1] + 29];
const COPA_REPOSO: P2 = [470, BARRA];
const CARA_X = 700;
const BARATA_X = 880;
const CAJA_X = 1120;
const BLANCO = "#E8D890";
const TINTO = "#8A1A2A";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 470, 1210, 2.2],
  [T.burdeos - 0.3, 470, 1210, 2.25],
  [T.burdeos + 0.6, 450, 1230, 1.4],
  [T.pero - 0.3, 450, 1230, 1.42],
  [T.pero + 0.6, 300, 1030, 2.5],
  [T.etiqueta - 0.3, 300, 1030, 2.55],
  [T.etiqueta + 0.6, 570, 1200, 1.2],
  [T.estudio - 0.3, 570, 1200, 1.22],
  [T.estudio + 0.6, 520, 1220, 1.25],
  [T.ciegas - 0.3, 520, 1220, 1.27],
  [T.ciegas + 0.6, 570, 1200, 1.2],
  [T.asi - 0.3, 570, 1200, 1.22],
  [T.asi + 0.6, 960, 1200, 1.15],
  [T.disfruten - 0.3, 960, 1200, 1.17],
  [T.disfruten + 0.6, 560, 1200, 1.2],
  [T.final - 0.3, 560, 1200, 1.22],
  [T.final + 0.6, 520, 1240, 1.1],
  [T.fin, 520, 1240, 1.12],
];

const camara = (t: number) => {
  const K = camaraKeys();
  let k = 0;
  while (k < K.length - 1 && K[k + 1][0] <= t) {
    k++;
  }
  const a = K[k];
  const b = K[Math.min(k + 1, K.length - 1)];
  const p = b[0] === a[0] ? 0 : interpolate(t, [a[0], b[0]], [0, 1], suave);
  return { cx: a[1] + (b[1] - a[1]) * p, cy: a[2] + (b[2] - a[2]) * p, zoom: a[3] + (b[3] - a[3]) * p };
};

const mezcla = (a: string, b: string, p: number) => {
  const h = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16);
  const c = [0, 1, 2].map((i) => Math.round(h(a, i) + (h(b, i) - h(a, i)) * Math.max(0, Math.min(1, p))));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
};

// Copa: (0, 0) = centro del pie; el cáliz llega hasta y = −170
const Copa: React.FC<{ readonly x: number; readonly y: number; readonly giro: number; readonly color: string; readonly nivel: number; readonly t: number; readonly tinta: number }> = ({
  x,
  y,
  giro,
  color,
  nivel,
  t,
  tinta,
}) => {
  const caliz = "M -38 -172 C -40 -130, -30 -96, 0 -88 C 30 -96, 40 -130, 38 -172 Z";
  const superficie = -92 - 70 * nivel;
  return (
    <g transform={`translate(${x} ${y}) rotate(${giro} 0 -45)`}>
      <defs>
        <clipPath id="caliz-vn">
          <path d={caliz} />
        </clipPath>
      </defs>
      <g clipPath="url(#caliz-vn)">
        <rect x={-60} y={superficie} width={120} height={120} fill={color} transform={`rotate(${-giro} 0 ${superficie})`} />
        {/* Remolinos de colorante */}
        {tinta > 0
          ? [0, 1, 2].map((k) => {
              const p = (t * 0.6 + k / 3) % 1;
              return (
                <path
                  key={k}
                  d={`M ${-10 + k * 8} ${superficie + 4} C ${-24 + k * 10} ${superficie + 20 + p * 30}, ${16 - k * 6} ${superficie + 30 + p * 20}, ${4 + k * 4} ${superficie + 50 + p * 20}`}
                  fill="none"
                  stroke={TINTO}
                  strokeWidth={8 - k * 2}
                  strokeLinecap="round"
                  opacity={tinta * (1 - p) * 0.9}
                />
              );
            })
          : null}
      </g>
      <path d={caliz} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.7)" strokeWidth={3} />
      <path d="M -28 -160 C -30 -130, -24 -108, -12 -100" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={4} strokeLinecap="round" />
      <path d="M 0 -88 L 0 -6" stroke="rgba(255,255,255,0.7)" strokeWidth={5} />
      <ellipse cx={0} cy={-3} rx={32} ry={6} fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.7)" strokeWidth={3} />
    </g>
  );
};

// Botella: (x, BARRA) = centro de la base. Cara: vidrio negro, etiqueta dorada, cápsula. Barata: verde y etiqueta lisa.
const Botella: React.FC<{ readonly x: number; readonly cara: boolean; readonly bolsa: number }> = ({ x, cara, bolsa }) => {
  const vidrio = cara ? "#1A1420" : "#2E5A3A";
  return (
    <g transform={`translate(${x} ${BARRA})`}>
      <path d="M -46 0 L -46 -200 C -46 -236, -20 -246, -16 -270 L -16 -320 L 16 -320 L 16 -270 C 20 -246, 46 -236, 46 -200 L 46 0 Z" fill={vidrio} />
      <path d="M -34 -20 L -34 -196" stroke="rgba(255,255,255,0.25)" strokeWidth={6} strokeLinecap="round" />
      {cara ? (
        <g>
          <rect x={-18} y={-334} width={36} height={60} rx={4} fill="#C8A040" />
          <rect x={-40} y={-170} width={80} height={110} rx={6} fill="#F0E2C0" stroke="#C8A040" strokeWidth={5} />
          <path d="M 0 -160 L 10 -146 L 0 -132 L -10 -146 Z" fill="#C8A040" />
          <text x={0} y={-108} textAnchor="middle" fill="#3A2A10" fontFamily={mono} fontSize={13} fontWeight={700}>
            GRAN
          </text>
          <text x={0} y={-92} textAnchor="middle" fill="#3A2A10" fontFamily={mono} fontSize={13} fontWeight={700}>
            RESERVA
          </text>
          <line x1={-28} y1={-80} x2={28} y2={-80} stroke="#C8A040" strokeWidth={2} />
        </g>
      ) : (
        <g>
          <rect x={-18} y={-330} width={36} height={22} rx={3} fill="#8C8C98" />
          <rect x={-40} y={-150} width={80} height={80} rx={4} fill="#E8E6F0" />
          <text x={0} y={-114} textAnchor="middle" fill="#3A3A48" fontFamily={mono} fontSize={14} fontWeight={700}>
            VINO
          </text>
          <text x={0} y={-96} textAnchor="middle" fill="#3A3A48" fontFamily={mono} fontSize={14} fontWeight={700}>
            DE MESA
          </text>
        </g>
      )}
      {/* Bolsa de papel para la cata a ciegas */}
      {bolsa > 0 ? (
        <g opacity={bolsa}>
          <path d={`M -58 0 L -58 ${-250 * bolsa} L -36 ${-268 * bolsa} L 36 ${-268 * bolsa} L 58 ${-250 * bolsa} L 58 0 Z`} fill="#B88A58" />
          <path d={`M -58 ${-250 * bolsa} L 58 ${-250 * bolsa}`} stroke="#8A6438" strokeWidth={4} />
          <path d="M -40 -20 L -36 -230 M 40 -20 L 36 -230" stroke="#9A7040" strokeWidth={3} opacity={0.6} />
          <text x={0} y={-110} textAnchor="middle" fill="#3A2A10" fontFamily={mono} fontSize={80} fontWeight={700} opacity={bolsa}>
            ?
          </text>
        </g>
      ) : null}
    </g>
  );
};

// Etiqueta de precio colgada del cuello de una botella
const Precio: React.FC<{ readonly x: number; readonly texto: string; readonly color: string; readonly o: number }> = ({ x, texto, color, o }) =>
  o > 0 ? (
    <g opacity={o} transform={`translate(${x} ${BARRA - 280})`}>
      <path d="M 16 0 Q 40 10 52 30" fill="none" stroke="#C8C4D8" strokeWidth={2} />
      <path d="M 40 30 L 120 30 L 120 80 L 40 80 L 28 55 Z" fill={color} />
      <circle cx={42} cy={55} r={4} fill="#1A1430" />
      <text x={84} y={66} textAnchor="middle" fill="#1A1430" fontFamily={mono} fontSize={26} fontWeight={700}>
        {texto}
      </text>
    </g>
  ) : null;

// Bocadillo en espacio de pantalla, anclado a un punto del mundo
const Bocadillo: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly color: string; readonly o: number; readonly piensa?: boolean }> = ({ x, y, texto, color, o, piensa }) => {
  if (o <= 0) {
    return null;
  }
  const ancho = texto.length * 22 + 48;
  const bx = x + 40;
  const by = y - 150;
  return (
    <g opacity={o}>
      {piensa ? (
        <g>
          <circle cx={x + 10} cy={y - 30} r={8} fill={C.white} />
          <circle cx={x + 24} cy={y - 64} r={12} fill={C.white} />
        </g>
      ) : (
        <path d={`M ${x + 6} ${y - 10} L ${bx + 20} ${by + 30} L ${bx + 56} ${by + 30} Z`} fill={C.white} />
      )}
      <rect x={bx} y={by - 34} width={ancho} height={68} rx={34} fill={C.white} />
      <text x={bx + ancho / 2} y={by + 12} textAnchor="middle" fill={color} fontFamily={mono} fontSize={36} fontWeight={700}>
        {texto}
      </text>
    </g>
  );
};

// Etiqueta anclada a un punto del mundo, con tamaño constante en pantalla
const Tag: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly color: string; readonly o: number; readonly dx?: number; readonly dy?: number }> = ({
  x,
  y,
  texto,
  color,
  o,
  dx = 0,
  dy = -90,
}) => {
  if (o <= 0) {
    return null;
  }
  const ancho = texto.length * 22 + 36;
  return (
    <g opacity={o}>
      <line x1={x} y1={y} x2={x + dx} y2={y + dy + (dy < 0 ? 26 : -30)} stroke={color} strokeWidth={2} opacity={0.7} />
      <circle cx={x} cy={y} r={6} fill={color} />
      <rect x={x + dx - ancho / 2} y={y + dy - 30} width={ancho} height={56} rx={14} fill={C.pill} stroke={color} strokeWidth={2} />
      <text x={x + dx} y={y + dy + 10} textAnchor="middle" fill={color} fontFamily={mono} fontSize={36} fontWeight={700}>
        {texto}
      </text>
    </g>
  );
};

export const Bodega: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => interpolate(t, [a, a + entra, b - sale, b], [0, 1, 1, 0], clamp);

  // Colorante: gotas hasta que el blanco queda rojo
  const tinte = interpolate(t, [0, T.rojo + 0.8], [0.25, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const gotero = ventana(-1, T.sirvieron + 0.6, 0.4, 0.6);
  const tinta = interpolate(t, [0, T.burdeos, T.colorante, T.describieron], [1, 0.5, 0.5, 0], clamp);
  const colorVino = mezcla(BLANCO, TINTO, tinte);

  // La copa sube a la boca para catar
  const cata = Math.max(
    interpolate(t, [T.describieron - 0.4, T.describieron + 0.3, T.parece - 0.2, T.parece + 0.5], [0, 1, 1, 0], suave),
    interpolate(t, [T.primero - 0.4, T.primero + 0.3, T.plano + 0.5, T.plano + 1.1], [0, 1, 1, 0], suave),
    interpolate(t, [T.seisMil - 0.3, T.seisMil + 0.4, T.caros, T.caros + 0.6], [0, 1, 1, 0], suave),
    interpolate(t, [T.disfruten - 0.5, T.disfruten + 0.2, T.truco - 0.4, T.truco + 0.2], [0, 1, 1, 0], suave),
  );
  const pieCopa: P2 = [COPA_REPOSO[0] + (386 - COPA_REPOSO[0]) * cata, COPA_REPOSO[1] + (1195 - COPA_REPOSO[1]) * cata];
  const giroCopa = -35 * cata;
  const tallo: P2 = [pieCopa[0] + 26 * cata, pieCopa[1] - 45 + 8 * cata];
  const mano: P2 = [tallo[0] - 30 - PX, tallo[1] + 4 - SUELO];

  // Botellas, precios, cata a ciegas y la caja
  const botellas = interpolate(t, [T.etiqueta - 0.2, T.etiqueta + 0.5], [0, 1], clamp);
  const precio90 = ventana(T.noventa - 0.2, T.ciegas);
  const precio10 = ventana(T.diez - 0.2, T.ciegas);
  const bolsa = interpolate(t, [T.seisMil - 0.2, T.seisMil + 0.5, T.asi - 0.2, T.asi + 0.3], [0, 1, 1, 0], suave);
  const venda = ventana(T.ciegas, T.asi + 0.3);
  const caja = interpolate(t, [T.asi - 0.3, T.asi + 0.4], [0, 1], clamp);
  const aCaja = interpolate(t, [T.caja - 0.6, T.caja + 0.2, T.disfruten, T.disfruten + 0.8], [0, 1, 1, 0], suave);
  const xCara = CARA_X + (CAJA_X - 60 - CARA_X) * aCaja;
  const chorro = ventana(T.caja + 0.2, T.disfruten - 0.1, 0.3, 0.3);
  const embudo = ventana(T.caja - 0.2, T.disfruten + 0.2);

  // Cerebro: predicción, ajuste y placer
  const rayos = Math.max(ventana(T.pero - 0.1, T.etiqueta), ventana(T.escaner, T.ciegas));
  const flechaOjo = interpolate(t, [T.ojos, T.ojos + 0.8], [0, 1], clamp);
  const placer = ventana(T.placer - 0.3, T.ciegas) * (t < T.diez ? 1 : 0.45) * (0.8 + 0.2 * Math.sin(t * 8));
  const corazones = ventana(T.disfruten - 0.1, T.truco + 0.3);

  // Bocadillos y etiquetas
  const bFrutos = ventana(T.frutos - 0.1, T.parece);
  const bTinto = ventana(T.prediccion, T.etiqueta - 0.2);
  const bComplejo = ventana(T.complejo - 0.1, T.segundo);
  const bPlano = ventana(T.plano - 0.1, T.estudio - 0.1);
  const tagColorante = ventana(T.colorante - 0.1, T.describieron);
  const tagOjos = ventana(T.ojos, T.ajusta);
  const tagReserva = ventana(T.reserva - 0.1, T.noventa - 0.3);
  const tagMesa = ventana(T.mesa - 0.1, T.noventa - 0.3);
  const tagCaja = ventana(T.caja - 0.1, T.truco);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Pared de la bodega con botelleros */}
        <rect x={-600} y={200} width={2400} height={1200} fill="#21182E" />
        {new Array(9).fill(0).map((_, f) =>
          new Array(24).fill(0).map((__, c) => (
            <g key={`${f}-${c}`}>
              <circle cx={-560 + c * 100 + (f % 2) * 50} cy={330 + f * 90} r={34} fill="#140E1E" />
              <circle cx={-560 + c * 100 + (f % 2) * 50} cy={330 + f * 90} r={16} fill={(f * 7 + c * 3) % 5 === 0 ? "#5A1A2A" : "#2A3A2A"} opacity={0.8} />
            </g>
          )),
        )}
        <rect x={-600} y={1150} width={2400} height={200} fill="#1A1226" />

        {/* El catador, detrás de la barra */}
        <Persona x={PX} suelo={SUELO} t={t} mano={mano} />
        {/* Venda para la cata a ciegas */}
        {venda > 0 ? (
          <g opacity={venda}>
            <path d={`M ${PX - 42} ${OJO[1] - 14} L ${PX + 58} ${OJO[1] - 18} L ${PX + 58} ${OJO[1] + 10} L ${PX - 42} ${OJO[1] + 12} Z`} fill="#2A2236" />
            <path d={`M ${PX - 42} ${OJO[1] - 2} q -24 10 -30 34 M ${PX - 42} ${OJO[1]} q -12 18 -6 40`} fill="none" stroke="#2A2236" strokeWidth={8} strokeLinecap="round" />
            <path d={`M ${PX - 30} ${OJO[1] - 9} L ${PX + 50} ${OJO[1] - 12}`} stroke="#4A3E5A" strokeWidth={3} />
          </g>
        ) : null}

        {/* Barra */}
        <rect x={-600} y={BARRA} width={2400} height={30} fill="#7A4E36" />
        <rect x={-600} y={BARRA} width={2400} height={6} fill="#A8724E" />
        <rect x={-600} y={BARRA + 30} width={2400} height={900} fill="#4A2E22" />
        {new Array(24).fill(0).map((_, i) => (
          <line key={i} x1={-600 + i * 100} y1={BARRA + 30} x2={-600 + i * 100} y2={BARRA + 930} stroke="#3A2218" strokeWidth={4} />
        ))}

        {/* Caja de vino sobre una caja de madera */}
        {caja > 0 ? (
          <g opacity={caja}>
            <rect x={CAJA_X - 70} y={BARRA - 260} width={260} height={260} fill="#6A4A30" />
            <path d={`M ${CAJA_X - 70} ${BARRA - 170} L ${CAJA_X + 190} ${BARRA - 170} M ${CAJA_X - 70} ${BARRA - 85} L ${CAJA_X + 190} ${BARRA - 85}`} stroke="#4A3020" strokeWidth={6} />
            <rect x={CAJA_X - 50} y={BARRA - 500} width={230} height={240} fill="#C89A68" />
            <path d={`M ${CAJA_X - 50} ${BARRA - 500} L ${CAJA_X + 180} ${BARRA - 500} L ${CAJA_X + 160} ${BARRA - 530} L ${CAJA_X - 30} ${BARRA - 530} Z`} fill="#A87A48" />
            <text x={CAJA_X + 65} y={BARRA - 400} textAnchor="middle" fill="#5A1A2A" fontFamily={mono} fontSize={44} fontWeight={700}>
              VINO
            </text>
            <text x={CAJA_X + 65} y={BARRA - 360} textAnchor="middle" fill="#5A3A20" fontFamily={mono} fontSize={22} fontWeight={700}>
              3 L
            </text>
            {[0, 1, 2, 3, 4].map((k) => (
              <circle key={k} cx={CAJA_X + 40 + (k % 3) * 22 + (k > 2 ? 11 : 0)} cy={BARRA - 320 + (k > 2 ? 18 : 0)} r={10} fill="#6A2A4A" />
            ))}
            {/* Grifo */}
            <rect x={CAJA_X - 80} y={BARRA - 300} width={34} height={22} rx={4} fill="#1A1420" />
            <rect x={CAJA_X - 74} y={BARRA - 280} width={14} height={16} fill="#1A1420" />
          </g>
        ) : null}
        {chorro > 0 ? <path d={`M ${CAJA_X - 67} ${BARRA - 262} Q ${CAJA_X - 66} ${BARRA - 240} ${CAJA_X - 62} ${BARRA - 212}`} stroke={TINTO} strokeWidth={9} strokeLinecap="round" opacity={chorro} /> : null}

        {/* Botellas */}
        <g opacity={botellas}>
          <Botella x={xCara} cara bolsa={bolsa} />
          <Botella x={BARATA_X} cara={false} bolsa={bolsa} />
          <Precio x={xCara} texto="90 $" color={C.yellow} o={precio90 * (1 - bolsa)} />
          <Precio x={BARATA_X} texto="10 $" color="#C8C4D8" o={precio10 * (1 - bolsa)} />
        </g>
        {embudo > 0 ? (
          <g opacity={embudo} transform={`translate(${xCara} ${BARRA - 320})`}>
            <path d="M -40 -70 L 40 -70 L 8 -16 L 8 6 L -8 6 L -8 -16 Z" fill="#9AA4B8" />
            <path d="M -40 -70 L 40 -70" stroke="#C8D0E0" strokeWidth={4} />
          </g>
        ) : null}

        {/* Gotero de colorante */}
        {gotero > 0 ? (
          <g opacity={gotero} transform={`translate(${COPA_REPOSO[0]} ${BARRA - 300})`}>
            <rect x={-10} y={-120} width={20} height={90} rx={6} fill="rgba(255,255,255,0.35)" stroke="rgba(255,255,255,0.7)" strokeWidth={2} />
            <rect x={-8} y={-80} width={16} height={46} rx={4} fill={TINTO} />
            <path d="M -10 -32 L -3 -10 L 3 -10 L 10 -32 Z" fill="rgba(255,255,255,0.5)" />
            <ellipse cx={0} cy={-136} rx={20} ry={26} fill="#C83040" />
            {[0, 1].map((k) => {
              const p = (t * 1.3 + k * 0.5) % 1;
              return <ellipse key={k} cx={0} cy={-6 + p * 150} rx={6} ry={9} fill={TINTO} opacity={p < 0.95 ? 1 : 0} />;
            })}
          </g>
        ) : null}

        {/* Copa */}
        <Copa x={pieCopa[0]} y={pieCopa[1]} giro={giroCopa} color={colorVino} nivel={0.6} t={t} tinta={tinta} />

        {/* Corazones al beber el vino de caja en botella elegante */}
        {corazones > 0
          ? [0, 1, 2].map((k) => {
              const p = (t * 0.7 + k / 3) % 1;
              const x = PX + 60 + k * 40 + Math.sin(p * 6 + k) * 10;
              const y = CABEZA[1] - 120 - p * 160;
              return (
                <path
                  key={k}
                  d={`M ${x} ${y + 12} C ${x - 22} ${y - 4}, ${x - 12} ${y - 22}, ${x} ${y - 8} C ${x + 12} ${y - 22}, ${x + 22} ${y - 4}, ${x} ${y + 12} Z`}
                  fill="#FF5A8A"
                  opacity={(1 - p) * corazones}
                />
              );
            })
          : null}

        {/* Rayos X de la cabeza: cerebro, ojo → predicción, zona del placer */}
        {rayos > 0 ? (
          <g opacity={rayos}>
            <ellipse cx={CEREBRO[0]} cy={CEREBRO[1]} rx={36} ry={25} fill="#E89AB0" opacity={0.95} />
            <path d={`M ${CEREBRO[0] - 26} ${CEREBRO[1] - 4} q 8 -10 16 0 q 8 10 16 0 q 8 -10 14 2 M ${CEREBRO[0] - 20} ${CEREBRO[1] + 10} q 10 -6 20 2 q 8 6 16 -2`} fill="none" stroke="#B85A78" strokeWidth={2.5} />
            <path d={`M ${OJO[0]} ${OJO[1]} Q ${OJO[0] - 6} ${OJO[1] - 14} ${OJO[0] - 6 - 10 * flechaOjo} ${OJO[1] - 20 * flechaOjo}`} fill="none" stroke={C.red} strokeWidth={4} strokeLinecap="round" />
            <path d={`M ${BOCA[0]} ${BOCA[1]} Q ${BOCA[0] - 20} ${BOCA[1] - 30} ${CEREBRO[0] + 18} ${CEREBRO[1] + 18}`} fill="none" stroke={C.cyan} strokeWidth={3} strokeDasharray="5 5" opacity={ventana(T.ajusta - 0.2, T.etiqueta)} />
            <circle cx={CEREBRO[0] + 22} cy={CEREBRO[1] + 12} r={12 + 8 * placer} fill={C.yellow} opacity={0.85 * placer} />
          </g>
        ) : null}
      </g>

      <Bocadillo x={sx(BOCA[0])} y={sy(BOCA[1])} texto="¡frutos rojos!" color={TINTO} o={bFrutos} />
      <Bocadillo x={sx(CABEZA[0] + 20)} y={sy(CABEZA[1] - 70)} texto="tinto" color={TINTO} o={bTinto} piensa />
      <Bocadillo x={sx(BOCA[0])} y={sy(BOCA[1])} texto="complejo…" color="#8A6A10" o={bComplejo} />
      <Bocadillo x={sx(BOCA[0])} y={sy(BOCA[1])} texto="plano…" color="#5A5A6A" o={bPlano} />
      <Tag x={sx(COPA_REPOSO[0])} y={sy(BARRA - 300 - 136)} dx={160} dy={-40} texto="colorante" color={C.red} o={tagColorante} />
      <Tag x={sx(OJO[0])} y={sy(OJO[1])} dx={170} dy={70} texto="ojos" color={C.red} o={tagOjos} />
      <Tag x={sx(CARA_X)} y={sy(BARRA - 120)} dx={-40} dy={300} texto="gran reserva" color={C.yellow} o={tagReserva} />
      <Tag x={sx(BARATA_X)} y={sy(BARRA - 110)} dx={20} dy={390} texto="vino de mesa" color={C.white} o={tagMesa} />
      <Tag x={sx(CAJA_X + 65)} y={sy(BARRA - 420)} dx={0} dy={-170} texto="vino de caja" color={C.yellow} o={tagCaja} />
    </svg>
  );
};
