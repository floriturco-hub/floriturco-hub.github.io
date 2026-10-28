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

const Persona: React.FC<{ readonly x: number; readonly y: number; readonly color: string; readonly o: number }> = ({ x, y, color, o }) => (
  <g opacity={o} fill={color}>
    <circle cx={x} cy={y - 26} r={13} />
    <rect x={x - 15} y={y - 8} width={30} height={46} rx={13} />
  </g>
);

// Tarjetas superiores (espacio de pantalla) que acompañan a la escena del dormitorio
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = (desde: number, hasta: number) => interpolate(t, [desde, desde + 0.4, hasta - 0.4, hasta], [0, 1, 1, 0], clamp);
  const sube = (desde: number) => interpolate(t, [desde - 0.1, desde + 0.3], [0, 1], clamp);

  const fila = (y: number, clave: string, valor: string, color: string, o: number) => (
    <g opacity={o}>
      <text x={110} y={y} fill={C.grey} fontFamily={mono} fontSize={34}>
        {clave}
      </text>
      <text x={420} y={y} fill={color} fontFamily={mono} fontSize={40} fontWeight={700}>
        {valor}
      </text>
    </g>
  );

  // 1) Fase REM
  const t1 = sale(T.rem - 0.2, T.aVeces);
  // 2) Cuántos y cuánto dura
  const t2 = sale(T.uno - 0.2, T.frecuente);
  const encendida = interpolate(t, [T.diez - 0.2, T.diez + 0.3], [0, 1], clamp);
  // 3) Más frecuente si...
  const t3 = sale(T.frecuente - 0.2, T.siTePasa);
  // 4) Qué hacer
  const t4 = sale(T.siTePasa - 0.2, T.fantasma);

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={330} titulo="mientras sueñas (fase REM)" o={t1}>
          {fila(300, "músculos", "desconectados", C.red, sube(T.desconecta))}
          {fila(365, "ojos", "funcionan", C.cyan, sube(T.libran + 0.6))}
          {fila(430, "respiración", "funciona", C.cyan, sube(T.respiracion))}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={360} titulo="al menos una vez en la vida" o={t2}>
          {new Array(10).fill(0).map((_, i) => (
            <Persona key={i} x={140 + i * 84} y={310} color={i === 0 && encendida > 0.5 ? C.yellow : C.grey} o={i === 0 ? 0.35 + 0.65 * encendida : 0.35} />
          ))}
          <text x={110} y={420} fill={C.yellow} fontFamily={mono} fontSize={50} fontWeight={700} opacity={encendida}>
            casi 1 de cada 10
          </text>
          <g opacity={sube(T.dura)}>
            <text x={110} y={475} fill={C.grey} fontFamily={mono} fontSize={30}>
              dura de segundos a un par de minutos
            </text>
          </g>
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={330} titulo="más frecuente si" o={t3}>
          {fila(300, "1", "duermes poco", C.orange, sube(T.poco))}
          {fila(365, "2", "horarios irregulares", C.orange, sube(T.horarios))}
          {fila(430, "3", "duermes boca arriba", C.orange, sube(T.bocaArriba))}
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={330} titulo="si te pasa" o={t4}>
          {fila(300, "1", "respira despacio", C.cyan, sube(T.respira))}
          {fila(365, "2", "mueve un dedo del pie", C.cyan, sube(T.dedoPie))}
          {fila(430, "3", "muy a menudo: médico", C.yellow, sube(T.medico))}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
