import { C } from "../theme";

type Props = {
  readonly x: number; // centro entre las patas
  readonly y: number; // línea de apoyo de las patas
  readonly s?: number;
  readonly alas?: number; // 0 plegadas, 1 abiertas
  readonly aleteo?: number; // fase del aleteo (radianes)
  readonly cuerpo?: string;
  readonly ala?: string;
};

// Pájaro estilizado en perfil. Con alas abiertas sirve también de águila (s grande).
export const Pajaro: React.FC<Props> = ({ x, y, s = 1, alas = 0, aleteo = 0, cuerpo = "#3FA8B8", ala = "#186878" }) => {
  const cy = y - 62 * s;
  const batido = Math.sin(aleteo) * 0.5 * alas;
  // Ala abierta hacia arriba y hacia un lado (lado 1 delante, −1 detrás)
  const alaAbierta = (lado: 1 | -1) => {
    const tx = x + lado * 170 * s * alas;
    const ty = cy - (110 + 60 * batido) * s * alas;
    return `M ${x} ${cy - 14 * s} Q ${x + lado * 70 * s * alas} ${ty - 40 * s} ${tx} ${ty} Q ${x + lado * 90 * s * alas} ${cy - 20 * s} ${x + lado * 14 * s} ${cy + 12 * s} Z`;
  };
  return (
    <g>
      {/* Patas */}
      <line x1={x - 16 * s} y1={cy + 30 * s} x2={x - 20 * s} y2={y} stroke={C.orange} strokeWidth={5 * s} strokeLinecap="round" />
      <line x1={x + 16 * s} y1={cy + 30 * s} x2={x + 20 * s} y2={y} stroke={C.orange} strokeWidth={5 * s} strokeLinecap="round" />
      {/* Cola */}
      <path d={`M ${x - 40 * s} ${cy} L ${x - 95 * s} ${cy + 22 * s} L ${x - 88 * s} ${cy - 2 * s} Z`} fill={ala} />
      {/* Ala trasera abierta */}
      {alas > 0.02 ? <path d={alaAbierta(-1)} fill={ala} opacity={alas} /> : null}
      {/* Cuerpo y cabeza */}
      <ellipse cx={x} cy={cy} rx={48 * s} ry={34 * s} fill={cuerpo} />
      <circle cx={x + 42 * s} cy={cy - 30 * s} r={22 * s} fill={cuerpo} />
      <path d={`M ${x + 60 * s} ${cy - 36 * s} L ${x + 86 * s} ${cy - 28 * s} L ${x + 60 * s} ${cy - 22 * s} Z`} fill={C.yellow} />
      <circle cx={x + 48 * s} cy={cy - 34 * s} r={4 * s} fill="#0B091D" />
      {/* Ala plegada o delantera abierta */}
      {alas > 0.02 ? (
        <path d={alaAbierta(1)} fill={ala} opacity={alas} />
      ) : (
        <ellipse cx={x - 6 * s} cy={cy + 2 * s} rx={32 * s} ry={18 * s} fill={ala} />
      )}
    </g>
  );
};
