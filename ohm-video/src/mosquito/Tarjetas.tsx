import { interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";


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

  const t1 = sale(T.dos - 0.1, T.porQue - 0.1);
  const t2 = sale(T.porQue, T.picazon - 0.1);
  const t3 = sale(T.picazon, T.hembras - 0.1);

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
        <Tarjeta alto={400} titulo="6 agujas" o={t1}>
          {fila(290, "2 sierras", "cortan vibrando", "#E8414F", T.dos)}
          {fila(355, "2 separadores", "abren la piel", "#B88AF8", T.otras)}
          {fila(420, "1 pajita", "busca un vaso", C.yellow, T.pajita)}
          {fila(485, "1 tubo de saliva", "sin coágulos", C.cyan, T.saliva)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={340} titulo="¿por qué no duele?" o={t2}>
          {fila(290, "el haz", "más fino que un pelo", C.white, T.haz)}
          {fila(355, "serrucha", "fuerza diminuta", C.cyan, T.fuerza)}
          {fila(430, "sensores de dolor", "casi no se activan", C.yellow, T.sensores)}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={290} titulo="la picazón" o={t3}>
          {fila(300, "tu cuerpo reacciona", "a la saliva", C.white, T.picazon)}
          {fila(380, "histamina", "hincha y pica", "#7AE87A", T.histamina)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
