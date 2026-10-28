import { C } from "../theme";

// Cabeza de perfil mirando a la derecha, en coordenadas locales (0, 0 ≈ centro del cráneo, ~150 px de alto).
// Regla del estilo: la cara es UN solo trazado continuo (frente, nariz, labios, barbilla, mandíbula, nuca),
// con pelo, oreja, ojo y ceja dentro del contorno. Nada de óvalos con triángulos sueltos como nariz.
// Para tumbar a alguien boca arriba en la cama (cabeza a la izquierda): giro = -90.
const PERFIL =
  "M -58 -64 C -24 -96, 34 -92, 56 -56 C 63 -44, 65 -28, 63 -14 C 64 -8, 67 -4, 70 2 " +
  "C 76 12, 82 20, 86 26 C 88 31, 84 34, 77 33 C 76 37, 77 40, 79 43 C 77 46, 74 48, 75 51 " +
  "C 77 55, 75 59, 70 61 C 72 68, 71 77, 63 83 C 46 92, 24 92, 8 86 L 6 122 L -40 122 " +
  "C -46 96, -64 66, -70 26 C -74 -6, -72 -42, -58 -64 Z";
const PELO =
  "M -62 -60 C -28 -102, 38 -100, 60 -50 C 50 -60, 30 -66, 8 -64 C -8 -52, -20 -36, -30 -14 " +
  "C -40 8, -50 30, -56 54 C -66 34, -74 4, -72 -26 C -71 -42, -67 -52, -62 -60 Z";

type Props = {
  readonly x: number;
  readonly y: number;
  readonly escala?: number;
  readonly giro?: number;
  // 0 = ojo cerrado, 1 = abierto
  readonly ojos?: number;
  // 0 = tranquilo, 1 = asustado (cejas arriba, ojo muy abierto, boca entreabierta)
  readonly miedo?: number;
  readonly piel?: string;
  readonly pelo?: string;
};

export const Cara: React.FC<Props> = ({ x, y, escala = 1, giro = 0, ojos = 1, miedo = 0, piel = "#C98A64", pelo = "#2A1A14" }) => {
  const abierto = Math.max(0, Math.min(1, ojos));
  const alto = 5 + 4 * miedo;
  return (
    <g transform={`translate(${x} ${y}) rotate(${giro}) scale(${escala})`}>
      <path d={PERFIL} fill={piel} />
      <path d={PELO} fill={pelo} />
      {/* Oreja, a media altura y por detrás del ojo */}
      <path d="M -14 -6 C -2 -10, 2 8, -4 18 C -8 24, -16 22, -18 14 C -20 4, -20 -4, -14 -6 Z" fill="#A86A48" />
      <path d="M -10 0 C -4 2, -4 10, -9 14" fill="none" stroke="#8A5236" strokeWidth={2.5} strokeLinecap="round" />
      {/* Ceja */}
      <path d={`M 34 ${-18 - 6 * miedo} Q 46 ${-24 - 8 * miedo} 58 ${-17 - 6 * miedo}`} fill="none" stroke={pelo} strokeWidth={5} strokeLinecap="round" />
      {/* Ojo: almendra abierta o línea cerrada */}
      {abierto > 0.15 ? (
        <g>
          <path d={`M 38 -4 Q 47 ${-4 - alto * abierto} 56 -3 Q 47 ${-4 + alto * abierto * 0.8} 38 -4 Z`} fill="#F4EEE8" />
          <circle cx={50} cy={-4} r={2.6 + 1.2 * abierto} fill="#1A100C" />
        </g>
      ) : (
        <path d="M 38 -4 Q 47 1 56 -3" fill="none" stroke="#5A3A2A" strokeWidth={3} strokeLinecap="round" />
      )}
      {/* Fosa nasal y boca */}
      <path d="M 72 28 Q 76 30 79 29" fill="none" stroke="#8A5236" strokeWidth={2.5} strokeLinecap="round" />
      {miedo > 0.3 ? (
        <ellipse cx={72} cy={52} rx={3 + 2 * miedo} ry={2 + 3 * miedo} fill="#5A2A20" />
      ) : (
        <path d="M 66 52 L 75 51" stroke="#8A5236" strokeWidth={2.5} strokeLinecap="round" />
      )}
      <path d={PERFIL} fill="none" stroke={C.bgDeep} strokeWidth={1.5} opacity={0.25} />
    </g>
  );
};
