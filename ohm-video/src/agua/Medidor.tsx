import { C, mono } from "../theme";

const METAL = "#8C88A8";
const AGUA = "#3F7BD8";

// Rodillos del medidor tipo cuentakilómetros: cada dígito rueda cuando el de su derecha pasa de 9 a 0
export const Rodillos: React.FC<{ readonly x: number; readonly y: number; readonly valor: number; readonly enteros?: number; readonly decimales?: number; readonly alto?: number }> = ({
  x,
  y,
  valor,
  enteros = 5,
  decimales = 3,
  alto = 70,
}) => {
  const total = enteros + decimales;
  const ancho = alto * 0.72;
  const escalado = valor * 10 ** decimales;
  return (
    <g>
      <defs>
        <clipPath id={`rod-${x}-${y}`}>
          <rect x={x} y={y} width={total * ancho} height={alto} rx={8} />
        </clipPath>
      </defs>
      <rect x={x - 6} y={y - 6} width={total * ancho + 12} height={alto + 12} rx={12} fill="#0B091D" stroke={METAL} strokeWidth={4} />
      <g clipPath={`url(#rod-${x}-${y})`}>
        {new Array(total).fill(0).map((_, k) => {
          const potencia = 10 ** (total - 1 - k);
          const bruto = escalado / potencia;
          const digito = Math.floor(bruto) % 10;
          // Rueda solo en la última décima antes del cambio (como los rodillos reales)
          const frac = bruto - Math.floor(bruto);
          const arrastre = k === total - 1 ? frac : Math.max(0, ((escalado % potencia) / potencia - 0.9) * 10);
          const desplaza = (k === total - 1 ? frac : arrastre) * alto;
          const decimal = k >= enteros;
          return (
            <g key={k}>
              <rect x={x + k * ancho} y={y} width={ancho - 3} height={alto} fill={decimal ? "#5A1A22" : "#1A1636"} />
              {[0, 1].map((d) => (
                <text
                  key={d}
                  x={x + k * ancho + ancho / 2 - 1.5}
                  y={y + alto * 0.74 - desplaza + d * alto}
                  textAnchor="middle"
                  fill={decimal ? "#FF8A8A" : C.white}
                  fontFamily={mono}
                  fontSize={alto * 0.66}
                  fontWeight={700}
                >
                  {(digito + d) % 10}
                </text>
              ))}
            </g>
          );
        })}
      </g>
    </g>
  );
};

// Estrella indicadora de fugas: gira con el más mínimo paso de agua
export const Estrella: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly angulo: number; readonly color?: string }> = ({ x, y, r, angulo, color = C.red }) => (
  <g transform={`translate(${x} ${y}) rotate(${angulo})`}>
    <circle r={r * 1.3} fill="#0B091D" stroke={METAL} strokeWidth={3} />
    {new Array(6).fill(0).map((_, k) => (
      <path key={k} d={`M 0 0 L ${r * 0.25} ${-r * 0.3} L 0 ${-r} L ${-r * 0.25} ${-r * 0.3} Z`} fill={color} transform={`rotate(${k * 60})`} />
    ))}
  </g>
);

// Esfera frontal del medidor
export const Esfera: React.FC<{ readonly x: number; readonly y: number; readonly valor: number; readonly giro: number; readonly s?: number }> = ({ x, y, valor, giro, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-330} y={-40} width={660} height={80} rx={20} fill={METAL} />
    <circle r={300} fill="#2A2350" stroke={METAL} strokeWidth={14} />
    <circle r={260} fill="#E8E6F0" opacity={0.08} />
    <text y={-150} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={34} fontWeight={700}>m³</text>
    <Rodillos x={-206} y={-110} valor={valor} />
    <Estrella x={0} y={130} r={42} angulo={giro} />
  </g>
);

// Corte del medidor: tubería, turbina de paletas y tren de engranajes hasta los rodillos
export const Corte: React.FC<{ readonly t: number; readonly giro: number; readonly flujo: number; readonly vistaEngranajes: number }> = ({ t, giro, flujo, vistaEngranajes }) => {
  const turbina = { x: 540, y: 1240 };
  return (
    <g>
      {/* Tubería */}
      <rect x={-40} y={1160} width={1160} height={160} fill="#1A1636" stroke={METAL} strokeWidth={8} />
      {new Array(18).fill(0).map((_, k) => {
        const x = ((k * 70 + t * 260 * flujo) % 1240) - 80;
        return <circle key={k} cx={x} cy={1185 + ((k * 37) % 110)} r={7} fill={AGUA} opacity={flujo > 0 ? 0.85 : 0.3} />;
      })}
      {/* Cámara y turbina */}
      <circle cx={turbina.x} cy={turbina.y} r={120} fill="#0F0C24" stroke={METAL} strokeWidth={8} />
      <g transform={`translate(${turbina.x} ${turbina.y}) rotate(${giro})`}>
        {new Array(8).fill(0).map((_, k) => (
          <path key={k} d="M 0 -14 L 92 -24 Q 104 0 92 24 L 0 14 Z" fill={C.cyan} opacity={0.85} transform={`rotate(${k * 45})`} />
        ))}
        <circle r={22} fill={METAL} />
      </g>
      {/* Tren de engranajes hacia arriba */}
      <g opacity={vistaEngranajes}>
        <line x1={turbina.x} y1={turbina.y - 120} x2={turbina.x} y2={1000} stroke={METAL} strokeWidth={10} />
        {[
          { x: 540, y: 960, r: 50, dientes: 12, v: 1 },
          { x: 630, y: 880, r: 34, dientes: 8, v: -1.5 },
          { x: 700, y: 810, r: 50, dientes: 12, v: 1 },
          { x: 610, y: 740, r: 30, dientes: 8, v: -1.7 },
        ].map((g, k) => (
          <g key={k} transform={`translate(${g.x} ${g.y}) rotate(${(giro / 6) * g.v})`}>
            <circle r={g.r} fill="#2A2350" stroke={C.yellow} strokeWidth={4} />
            {new Array(g.dientes).fill(0).map((_, d) => (
              <rect key={d} x={-6} y={-g.r - 12} width={12} height={14} fill={C.yellow} transform={`rotate(${(d * 360) / g.dientes})`} />
            ))}
            <circle r={8} fill={C.yellow} />
          </g>
        ))}
      </g>
    </g>
  );
};
