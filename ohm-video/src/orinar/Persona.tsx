import { Cara } from "../components/Cara";

// Persona de pie, de perfil mirando a la derecha, con las proporciones del estilo (7,5 cabezas de alto).
// Coordenadas locales: (0, 0) = entre los pies en el suelo; y negativa hacia arriba. Cabeza h ≈ 102 px.
type P2 = [number, number];
export const H_CABEZA = 102;
const CORONILLA = -765;
const CENTRO_CARA = -712;
const HOMBRO: P2 = [-4, -610];
const CADERA: P2 = [-2, -392];
const BRAZO = 150;
const ANTEBRAZO = 140;
const MUSLO = 192;
const PIERNA = 178;

const PIEL = "#C98A64";
const PIEL_OSCURA = "#A86A48";
const CHAQUETA = "#3E6E8E";
const CHAQUETA_COSTURA = "#2A4C64";
const CHAQUETA_LUZ = "#6898B8";
const PANTALON = "#38344E";
const PANTALON_COSTURA = "#25223A";
const PANTALON_LUZ = "#55507A";
const ZAPATO = "#1E1A24";
const SUELA = "#5A5468";

// Dos huesos: devuelve la articulación intermedia (codo o rodilla)
export const ik = (a: P2, b: P2, l1: number, l2: number, lado: number): P2 => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const d = Math.min(Math.hypot(dx, dy), l1 + l2 - 1);
  const base = Math.atan2(dy, dx);
  const alfa = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  return [a[0] + l1 * Math.cos(base + lado * alfa), a[1] + l1 * Math.sin(base + lado * alfa)];
};

// Mano con palma, cuatro dedos y pulgar, orientada en `angulo` (grados); `cierra` 0 abierta, 1 en puño
const Mano: React.FC<{ readonly p: P2; readonly angulo: number; readonly cierra: number; readonly piel: string; readonly llave?: boolean }> = ({ p, angulo, cierra, piel, llave }) => (
  <g transform={`translate(${p[0]} ${p[1]}) rotate(${angulo})`}>
    {llave ? (
      <g>
        <circle cx={44} cy={-2} r={11} fill="none" stroke="#D8B848" strokeWidth={5} />
        <path d="M 54 -2 L 82 -2 M 70 -2 L 70 6 M 78 -2 L 78 5" stroke="#D8B848" strokeWidth={5} strokeLinecap="round" />
      </g>
    ) : null}
    <ellipse cx={20} cy={0} rx={21} ry={14} fill={piel} />
    {[-9, -3, 3, 9].map((dy, i) => {
      const largo = 26 - Math.abs(i - 1.5) * 3;
      const curva = 14 * cierra;
      return (
        <path
          key={i}
          d={`M 34 ${dy} q ${largo * 0.6} ${curva * 0.2} ${largo * (1 - 0.55 * cierra)} ${curva}`}
          fill="none"
          stroke={piel}
          strokeWidth={6.5}
          strokeLinecap="round"
        />
      );
    })}
    <path d={`M 12 -10 q 10 -12 ${22 - 6 * cierra} ${-10 + 8 * cierra}`} fill="none" stroke={piel} strokeWidth={7} strokeLinecap="round" />
    <path d="M 8 6 q 12 4 24 2" fill="none" stroke={PIEL_OSCURA} strokeWidth={2} opacity={0.6} />
  </g>
);

// Brazo con manga (pliegue en el codo, puño oscuro y luz en el hombro) y mano
const Brazo: React.FC<{ readonly hombro: P2; readonly muneca: P2; readonly lejano?: boolean; readonly cierra: number; readonly llave?: boolean }> = ({
  hombro,
  muneca,
  lejano,
  cierra,
  llave,
}) => {
  const codo = ik(hombro, muneca, BRAZO, ANTEBRAZO, 1);
  const ang = (Math.atan2(muneca[1] - codo[1], muneca[0] - codo[0]) * 180) / Math.PI;
  const tela = lejano ? CHAQUETA_COSTURA : CHAQUETA;
  const puno: P2 = [muneca[0] - (muneca[0] - codo[0]) * 0.12, muneca[1] - (muneca[1] - codo[1]) * 0.12];
  return (
    <g>
      <path d={`M ${hombro[0]} ${hombro[1]} L ${codo[0]} ${codo[1]} L ${puno[0]} ${puno[1]}`} fill="none" stroke={tela} strokeWidth={38} strokeLinecap="round" strokeLinejoin="round" />
      {/* Puño de la manga, más oscuro */}
      <path d={`M ${puno[0]} ${puno[1]} L ${muneca[0] - (muneca[0] - codo[0]) * 0.05} ${muneca[1] - (muneca[1] - codo[1]) * 0.05}`} stroke={lejano ? "#1E384C" : CHAQUETA_COSTURA} strokeWidth={36} strokeLinecap="butt" />
      {/* Pliegue del codo */}
      <circle cx={codo[0]} cy={codo[1]} r={9} fill="none" stroke={CHAQUETA_COSTURA} strokeWidth={3} strokeDasharray="10 30" opacity={0.9} />
      <Mano p={muneca} angulo={ang} cierra={cierra} piel={lejano ? PIEL_OSCURA : PIEL} llave={llave} />
    </g>
  );
};

// Pierna con pantalón (costura lateral, pliegue en la rodilla, luz en el muslo) y zapato
const Pierna: React.FC<{ readonly cadera: P2; readonly tobillo: P2; readonly lejana?: boolean }> = ({ cadera, tobillo, lejana }) => {
  const rodilla = ik(cadera, tobillo, MUSLO, PIERNA, -1);
  const tela = lejana ? PANTALON_COSTURA : PANTALON;
  return (
    <g>
      <path d={`M ${cadera[0]} ${cadera[1]} L ${rodilla[0]} ${rodilla[1]} L ${tobillo[0]} ${tobillo[1] - 6}`} fill="none" stroke={tela} strokeWidth={50} strokeLinecap="round" strokeLinejoin="round" />
      {lejana ? null : (
        <g>
          <path d={`M ${cadera[0] + 2} ${cadera[1] + 20} L ${rodilla[0] + 2} ${rodilla[1]} L ${tobillo[0] + 2} ${tobillo[1] - 14}`} fill="none" stroke={PANTALON_COSTURA} strokeWidth={3} strokeLinejoin="round" />
          <path d={`M ${cadera[0] + 14} ${cadera[1] + 30} L ${(cadera[0] + rodilla[0]) / 2 + 14} ${(cadera[1] + rodilla[1]) / 2}`} stroke={PANTALON_LUZ} strokeWidth={6} strokeLinecap="round" opacity={0.8} />
          <path d={`M ${rodilla[0] + 6} ${rodilla[1] - 10} q 12 8 4 20`} fill="none" stroke={PANTALON_COSTURA} strokeWidth={3} strokeLinecap="round" />
        </g>
      )}
      {/* Dobladillo */}
      <path d={`M ${tobillo[0] - 24} ${tobillo[1] - 14} L ${tobillo[0] + 24} ${tobillo[1] - 14}`} stroke={PANTALON_COSTURA} strokeWidth={8} />
      {/* Zapato */}
      <path
        d={`M ${tobillo[0] - 24} ${tobillo[1] - 14} L ${tobillo[0] + 24} ${tobillo[1] - 14} C ${tobillo[0] + 50} ${tobillo[1] - 8}, ${tobillo[0] + 72} ${tobillo[1]}, ${tobillo[0] + 74} ${tobillo[1] + 14} L ${tobillo[0] - 26} ${tobillo[1] + 14} Z`}
        fill={lejana ? "#141018" : ZAPATO}
      />
      <path d={`M ${tobillo[0] - 26} ${tobillo[1] + 14} L ${tobillo[0] + 74} ${tobillo[1] + 14}`} stroke={SUELA} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};

type Props = {
  readonly x: number;
  readonly suelo: number;
  readonly t: number;
  // 0 quieto, 1 "baile" de urgencia (cambia el peso de un pie a otro)
  readonly baile?: number;
  // fase de paso al caminar (radianes); null = de pie
  readonly paso?: number | null;
  // muñeca del brazo cercano en coordenadas locales; null = colgando
  readonly mano?: P2 | null;
  readonly llave?: boolean;
  readonly miedo?: number;
  readonly respira?: number;
  readonly opacidad?: number;
};

export const Persona: React.FC<Props> = ({ x, suelo, t, baile = 0, paso = null, mano = null, llave = false, miedo = 0, respira = 0, opacidad = 1 }) => {
  // Baile de urgencia: levanta un pie y luego el otro, con un pequeño rebote del cuerpo
  const fase = Math.sin(t * 9);
  const levantaCerca = Math.max(0, fase) * 30 * baile;
  const levantaLejos = Math.max(0, -fase) * 30 * baile;
  let pieCerca: P2 = [14, -30 - levantaCerca];
  let pieLejos: P2 = [-10, -30 - levantaLejos];
  let rebote = -Math.abs(fase) * 7 * baile;
  let balanceo = 0;
  if (paso !== null) {
    pieCerca = [60 * Math.sin(paso), -30 - Math.max(0, Math.cos(paso)) * 26];
    pieLejos = [-60 * Math.sin(paso), -30 - Math.max(0, -Math.cos(paso)) * 26];
    rebote = -Math.abs(Math.cos(paso)) * 8;
    balanceo = Math.sin(paso);
  }
  const pecho = 1 + 0.03 * respira * Math.max(0, Math.sin(t * 2.4));
  const cadera: P2 = [CADERA[0], CADERA[1] + rebote];
  const hombro: P2 = [HOMBRO[0], HOMBRO[1] + rebote];
  const manoCerca: P2 = mano ?? [12 + 40 * balanceo, -330 + rebote];
  const manoLejos: P2 = [-22 - 40 * balanceo, -336 + rebote];

  return (
    <g transform={`translate(${x} ${suelo})`} opacity={opacidad}>
      {/* Brazo y pierna lejanos, detrás del cuerpo */}
      <Brazo hombro={[hombro[0] - 8, hombro[1] + 4]} muneca={manoLejos} lejano cierra={0.4} />
      <Pierna cadera={[cadera[0] - 6, cadera[1]]} tobillo={pieLejos} lejana />
      <Pierna cadera={cadera} tobillo={pieCerca} />

      {/* Cuello */}
      <path d={`M -22 ${-660 + rebote} L 4 ${-660 + rebote} L 6 ${-618 + rebote} L -20 ${-618 + rebote} Z`} fill={PIEL_OSCURA} />

      {/* Chaqueta */}
      <g transform={`translate(0 ${rebote}) translate(0 -500) scale(${pecho} 1) translate(0 500)`}>
        <path
          d="M -22 -650 C -46 -640, -60 -612, -58 -572 C -55 -522, -46 -482, -44 -456 C -48 -420, -56 -386, -56 -360 L 48 -360 C 48 -390, 40 -430, 38 -458 C 42 -500, 52 -540, 50 -580 C 48 -616, 30 -642, 6 -650 Z"
          fill={CHAQUETA}
        />
        {/* Cuello de la camisa y de la chaqueta */}
        <path d="M -20 -652 C -8 -642, 2 -640, 8 -652 L 4 -628 C -4 -626, -14 -628, -20 -636 Z" fill="#D8D4E4" />
        <path d="M -24 -650 C -34 -632, -30 -612, -18 -600" fill="none" stroke={CHAQUETA_COSTURA} strokeWidth={6} strokeLinecap="round" />
        {/* Cremallera delantera */}
        <path d="M 8 -646 C 30 -600, 42 -540, 38 -458 C 40 -420, 46 -390, 46 -362" fill="none" stroke={CHAQUETA_COSTURA} strokeWidth={4} />
        {/* Luz en el hombro */}
        <path d="M -40 -626 C -22 -640, 0 -640, 18 -630" fill="none" stroke={CHAQUETA_LUZ} strokeWidth={9} strokeLinecap="round" opacity={0.85} />
        {/* Pliegues de la cintura */}
        <path d="M -30 -466 q 18 8 36 0 M -24 -446 q 16 6 30 -2" fill="none" stroke={CHAQUETA_COSTURA} strokeWidth={3} strokeLinecap="round" />
        {/* Bajo de la chaqueta, más oscuro */}
        <path d="M -56 -366 L 48 -366" stroke={CHAQUETA_COSTURA} strokeWidth={12} />
        {/* Bolsillo */}
        <path d="M 6 -420 L 34 -412" stroke={CHAQUETA_COSTURA} strokeWidth={4} strokeLinecap="round" />
      </g>

      {/* Cabeza: la cara aprobada, con reflejo en el pelo (dos tonos) */}
      <Cara x={0} y={CENTRO_CARA + rebote} escala={0.55} ojos={1} miedo={miedo} />
      <g transform={`translate(0 ${CENTRO_CARA + rebote}) scale(0.55)`}>
        <path d="M -40 -78 C -16 -96, 22 -94, 44 -66" fill="none" stroke="#5A3A2A" strokeWidth={7} strokeLinecap="round" opacity={0.9} />
      </g>

      {/* Brazo cercano, delante del cuerpo */}
      <Brazo hombro={hombro} muneca={manoCerca} cierra={mano ? 0.8 : 0.3} llave={llave} />
    </g>
  );
};

export const PUNTOS = {
  coronilla: CORONILLA,
  cara: CENTRO_CARA,
  hombro: HOMBRO,
  cadera: CADERA,
};
