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

// Tarjetas superiores (espacio de pantalla)
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = (desde: number, hasta: number) => interpolate(t, [desde, desde + 0.4, hasta - 0.4, hasta], [0, 1, 1, 0], clamp);
  const sube = (desde: number) => interpolate(t, [desde - 0.1, desde + 0.3], [0, 1], clamp);

  const t1 = sale(T.va - 0.2, T.dentro - 0.1);
  const t2 = sale(T.diferencia - 0.2, T.todo - 0.1);
  const t3 = sale(T.todo, T.paises - 0.1);
  const t4 = sale(T.paises, T.truco - 0.1);
  const t5 = sale(T.truco, T.final - 0.1);

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

  // Electrocardiograma: un latido por segundo, con el corte a los 0,025 s
  const ecg = (x0: number, ancho: number, y: number) => {
    const latido = (u: number) => {
      const f = u % 1;
      if (f > 0.42 && f < 0.46) {
        return -60 * Math.sin(((f - 0.42) / 0.04) * Math.PI);
      }
      if (f > 0.46 && f < 0.5) {
        return 22 * Math.sin(((f - 0.46) / 0.04) * Math.PI);
      }
      if (f > 0.62 && f < 0.75) {
        return -14 * Math.sin(((f - 0.62) / 0.13) * Math.PI);
      }
      return 0;
    };
    return new Array(201)
      .fill(0)
      .map((_, i) => `${i === 0 ? "M" : "L"} ${x0 + (ancho * i) / 200} ${y + latido((i / 200) * 2)}`)
      .join(" ");
  };

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={290} titulo="secadora funcionando" o={t1}>
          {fila(300, "va por la fase", "10 A", "#E8603A", T.va)}
          {fila(380, "vuelve por el neutro", "10 A", "#4A8AF8", T.otro)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={340} titulo="secadora en el agua" o={t2}>
          {fila(290, "va", "10,000 A", "#E8603A", T.diferencia)}
          {fila(355, "vuelve", "9,995 A", "#4A8AF8", T.diferencia + 0.4)}
          {fila(430, "diferencia", "5 mA → ¡corta!", C.yellow, T.cinco)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={340} titulo="más rápido que un latido" o={t3}>
          <path d={ecg(110, 860, 330)} fill="none" stroke={VERDE} strokeWidth={5} strokeLinejoin="round" />
          <rect x={110} y={260} width={860 * (0.025 / 2)} height={140} fill={C.red} opacity={0.9} />
          <text x={130} y={440} fill={C.red} fontFamily={mono} fontSize={30} fontWeight={700} opacity={sube(T.todo)}>
            ◀ corte: 0,025 s
          </text>
          <text x={970} y={440} textAnchor="end" fill={VERDE} fontFamily={mono} fontSize={30} fontWeight={700} opacity={sube(T.corazon - 1)}>
            un latido ≈ 1 s
          </text>
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={290} titulo="dos versiones" o={t4}>
          {fila(300, "enchufe GFCI", "≈ 5 mA", C.yellow, T.paises)}
          {fila(380, "diferencial (tablero)", "30 mA", C.cyan, T.diferencial)}
        </Tarjeta>
      ) : null}

      {t5 > 0 ? (
        <Tarjeta alto={340} titulo="una vez al mes" o={t5}>
          {fila(290, "1  aprieta TEST", "debe saltar", C.red, T.prueba)}
          {fila(355, "2  aprieta RESET", "vuelve la luz", VERDE, T.prueba + 1.0)}
          {fila(430, "si no salta", "cámbialo", C.yellow, T.cambialo)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
