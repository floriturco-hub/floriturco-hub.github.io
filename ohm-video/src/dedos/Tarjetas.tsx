import { interpolate, random } from "remotion";
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

// Yema vista de frente con un patrón de arrugas fijo (el mismo cada vez)
const Huella: React.FC<{ readonly x: number; readonly y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={0} rx={70} ry={90} fill="#E0A27C" />
    {[0, 1, 2, 3, 4].map((k) => {
      const yy = -60 + k * 30;
      const f = random(`hu${k}`) * 6;
      const d = new Array(9)
        .fill(0)
        .map((_, i) => `${i === 0 ? "M" : "L"} ${-56 + i * 14} ${yy + Math.sin(i * 1.3 + f) * 7}`)
        .join(" ");
      return <path key={k} d={d} fill="none" stroke="#A86A48" strokeWidth={4} strokeLinecap="round" />;
    })}
  </g>
);

// Tarjetas superiores (espacio de pantalla)
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = (desde: number, hasta: number) => interpolate(t, [desde, desde + 0.4, hasta - 0.4, hasta], [0, 1, 1, 0], clamp);
  const sube = (desde: number) => interpolate(t, [desde - 0.1, desde + 0.3], [0, 1], clamp);

  const t1 = sale(T.medicos - 0.1, T.pasa - 0.1);
  const t2 = sale(T.cinco - 0.1, T.manos - 0.1);
  const t3 = sale(T.manos, T.sirve - 0.1);
  const t4 = sale(T.experimentos - 0.1, T.curioso - 0.1);
  const t5 = sale(T.curioso + 0.2, T.final - 0.1);

  const fila = (y: number, izq: string, der: string, color: string, desde: number) => (
    <g opacity={sube(desde)}>
      <text x={110} y={y} fill={C.white} fontFamily={mono} fontSize={33} fontWeight={700}>
        {izq}
      </text>
      <text x={970} y={y} textAnchor="end" fill={color} fontFamily={mono} fontSize={33} fontWeight={700}>
        {der}
      </text>
    </g>
  );

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={290} titulo="prueba médica del nervio" o={t1}>
          {fila(300, "nervio sano", "se arruga ✓", VERDE, T.medicos)}
          {fila(380, "nervio dañado", "piel lisa ✗", C.red, T.medicos + 0.5)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={390} titulo="lo que pasa en el agua" o={t2}>
          {fila(285, "1  ~5 minutos en el agua", "", C.white, T.cinco)}
          {fila(345, "2  los nervios estrechan los vasos", "", C.white, T.estrecha)}
          {fila(405, "3  la yema pierde volumen", "", C.white, T.volumen)}
          {fila(465, "4  la piel se pliega", "", C.yellow, T.arrugas)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={330} titulo="¿por qué solo manos y pies?" o={t3}>
          {fila(290, "piel más gruesa", "✓", C.yellow, T.gruesa)}
          {fila(355, "muchas glándulas de sudor", "✓", C.cyan, T.glandulas)}
          {fila(420, "red muy densa de vasos", "✓", C.red, T.vasos)}
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={330} titulo="¿mejor agarre en mojado?" o={t4}>
          {fila(290, "algunos experimentos", "sí ✓", VERDE, T.experimentos)}
          {fila(355, "otros", "sin diferencia ✗", C.red, T.otros)}
          {fila(420, "conclusión", "se discute", C.yellow, T.discute)}
        </Tarjeta>
      ) : null}

      {t5 > 0 ? (
        <Tarjeta alto={330} titulo="mismo patrón cada vez" o={t5}>
          <g opacity={sube(T.patron - 0.6)}>
            <Huella x={330} y={335} />
            <text x={540} y={350} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={60} fontWeight={700}>
              =
            </text>
            <Huella x={750} y={335} />
            <text x={330} y={460} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={26} fontWeight={700}>
              lunes
            </text>
            <text x={750} y={460} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={26} fontWeight={700}>
              jueves
            </text>
          </g>
        </Tarjeta>
      ) : null}
    </svg>
  );
};
