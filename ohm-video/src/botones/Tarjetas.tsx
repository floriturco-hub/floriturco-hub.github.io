import { interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

const VERDE = "#48C878";

const Tarjeta: React.FC<{ readonly alto: number; readonly titulo: string; readonly o: number; readonly children: React.ReactNode }> = ({ alto, titulo, o, children }) => (
  <g opacity={o}>
    <rect x={60} y={150} width={960} height={alto} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
    <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>
      {titulo}
    </text>
    {children}
  </g>
);

const miles = (n: number) => (n >= 1000 ? `${Math.floor(n / 1000)}.${String(n % 1000).padStart(3, "0")}` : String(n));

// Tarjetas superiores (espacio de pantalla)
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = (desde: number, hasta: number) => interpolate(t, [desde, desde + 0.4, hasta - 0.4, hasta], [0, 1, 1, 0], clamp);
  const sube = (desde: number) => interpolate(t, [desde - 0.1, desde + 0.3], [0, 1], clamp);

  const t1 = sale(T.programa - 0.2, T.nuevaYork - 0.1);
  const t2 = sale(T.nuevaYork, T.otros - 0.1);
  const t3 = sale(T.horas - 0.2, T.noSolo);
  const t4 = sale(T.entrar + 0.3, T.porQue - 0.1);
  const t5 = sale(T.placebo - 0.2, T.truco - 0.1);
  const t6 = sale(T.truco, T.final - 0.1);

  // Ciclo fijo: una aguja que gira sin importar el botón
  const aguja = ((t - T.programa) * 80) % 360;
  const arco = (a0: number, a1: number, r: number) => {
    const p = (a: number) => [540 + r * Math.cos(((a - 90) * Math.PI) / 180), 330 + r * Math.sin(((a - 90) * Math.PI) / 180)];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
  };

  // Nueva York: 130 cuadritos (cada uno ≈ 25 botones), 30 funcionan
  const total = Math.round(interpolate(t, [T.nuevaYork + 0.2, T.botones + 0.2], [0, 3250], clamp));
  const funcionan = interpolate(t, [T.solo, T.funcionando], [0, 1], clamp);

  const fila = (y: number, izq: string, der: string, color: string, desde: number) => (
    <g opacity={sube(desde)}>
      <text x={110} y={y} fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>
        {izq}
      </text>
      <text x={970} y={y} textAnchor="end" fill={color} fontFamily={mono} fontSize={34} fontWeight={700}>
        {der}
      </text>
    </g>
  );

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={330} titulo="programa de tiempos fijo" o={t1}>
          <path d={arco(0, 250, 110)} fill="none" stroke={C.red} strokeWidth={26} />
          <path d={arco(254, 296, 110)} fill="none" stroke={C.yellow} strokeWidth={26} />
          <path d={arco(300, 356, 110)} fill="none" stroke={VERDE} strokeWidth={26} />
          <line x1={540} y1={330} x2={540 + 90 * Math.cos(((aguja - 90) * Math.PI) / 180)} y2={330 + 90 * Math.sin(((aguja - 90) * Math.PI) / 180)} stroke={C.white} strokeWidth={6} strokeLinecap="round" />
          <circle cx={540} cy={330} r={10} fill={C.white} />
          <text x={540} y={465} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={28} fontWeight={700} opacity={sube(T.fijo)}>
            gira igual, pulses o no
          </text>
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={400} titulo="Nueva York, 2004" o={t2}>
          <text x={110} y={300} fill={C.white} fontFamily={mono} fontSize={56} fontWeight={700}>
            {miles(total)}
          </text>
          <text x={970} y={296} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={30} fontWeight={700}>
            botones para peatones
          </text>
          {new Array(130).fill(0).map((_, i) => {
            const col = i % 26;
            const row = Math.floor(i / 26);
            const vivo = i < 30 && funcionan > i / 30;
            return <rect key={i} x={112 + col * 33} y={330 + row * 24} width={26} height={18} rx={4} fill={vivo ? VERDE : C.cardBorder} opacity={sube(T.botones)} />;
          })}
          <text x={110} y={510} fill={VERDE} fontFamily={mono} fontSize={34} fontWeight={700} opacity={sube(T.solo)}>
            ≈ 750 funcionaban
          </text>
          <text x={970} y={510} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={28} fontWeight={700} opacity={sube(T.resto)}>
            el resto, de adorno
          </text>
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={290} titulo="¿cuándo cuenta el botón?" o={t3}>
          {fila(300, "noche, poco tráfico", "✓ pide verde", VERDE, T.noche)}
          {fila(380, "hora punta", "✗ ciclo fijo", C.red, T.punta)}
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={290} titulo="otros botones sospechosos" o={t4}>
          {fila(300, "ascensor: cerrar", "tiempo mínimo", C.yellow, T.entrar + 0.3)}
          {fila(380, "termostato de oficina", "a veces, falso", C.red, T.termostatos)}
        </Tarjeta>
      ) : null}

      {t5 > 0 ? (
        <Tarjeta alto={290} titulo="botones placebo" o={t5}>
          {fila(300, "✓ sensación de control", "", VERDE, T.control)}
          {fila(380, "✓ la espera se siente más corta", "", VERDE, T.espera)}
        </Tarjeta>
      ) : null}

      {t6 > 0 ? (
        <Tarjeta alto={330} titulo="el truco" o={t6}>
          {fila(300, "1  aprieta una vez", "", C.white, T.unaVez)}
          {fila(370, "2  espera", "", C.white, T.espera2)}
          <text x={110} y={440} fill={C.red} fontFamily={mono} fontSize={34} fontWeight={700} opacity={sube(T.cinco2)}>
            ×5 = igual de lento
          </text>
        </Tarjeta>
      ) : null}
    </svg>
  );
};
