import { Easing, interpolate } from "remotion";
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

// Tarjetas superiores (espacio de pantalla) con octanaje, energía, estudio y la regla del manual
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = (desde: number, hasta: number) => interpolate(t, [desde, desde + 0.4, hasta - 0.4, hasta], [0, 1, 1, 0], clamp);
  const sube = (desde: number) => interpolate(t, [desde - 0.1, desde + 0.3], [0, 1], clamp);
  const llena = (desde: number) => interpolate(t, [desde, desde + 0.9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  const barra = (y: number, nombre: string, valor: number, color: string, desde: number) => (
    <g opacity={sube(desde)}>
      <text x={110} y={y + 30} fill={color} fontFamily={mono} fontSize={34} fontWeight={700}>
        {nombre}
      </text>
      <rect x={380} y={y} width={580} height={40} rx={20} fill={C.cardBorder} />
      <rect x={380} y={y} width={580 * valor * llena(desde)} height={40} rx={20} fill={color} />
    </g>
  );

  const t1 = sale(T.octanaje - 0.2, T.noEnergia);
  const t2 = sale(T.noEnergia - 0.1, T.turbo);
  const t3 = sale(T.turbo - 0.1, T.aaa);
  const t4 = sale(T.aaa - 0.1, T.manual);
  const t5 = sale(T.requiere - 0.2, T.final);

  const fila = (y: number, izq: string, der: string, color: string, desde: number) => (
    <g opacity={sube(desde)}>
      <text x={110} y={y} fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700}>
        {izq}
      </text>
      <text x={960} y={y} textAnchor="end" fill={color} fontFamily={mono} fontSize={36} fontWeight={700}>
        {der}
      </text>
    </g>
  );

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={330} titulo="octanaje: aguante sin encenderse sola" o={t1}>
          {barra(260, "normal", 0.6, C.cyan, T.aguanta)}
          {barra(340, "premium", 0.85, C.yellow, T.masAguante)}
          <text x={110} y={440} fill={C.grey} fontFamily={mono} fontSize={26}>
            más octanos = más aguante, no más potencia
          </text>
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={330} titulo="energía por litro" o={t2}>
          {barra(260, "normal", 0.97, C.cyan, T.noEnergia)}
          {barra(340, "premium", 0.97, C.yellow, T.noEnergia + 0.4)}
          <text x={110} y={440} fill={C.white} fontFamily={mono} fontSize={30} fontWeight={700} opacity={sube(T.misma)}>
            casi la misma
          </text>
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={330} titulo="¿quién la necesita?" o={t3}>
          {fila(290, "motor muy comprimido", "sí", C.yellow, T.turbo)}
          {fila(355, "motor turbo", "sí", C.yellow, T.turbo + 0.6)}
          {fila(420, "motor para normal", "no la aprovecha", C.red, T.normal)}
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={330} titulo="estudio AAA (EE. UU.): coches de normal con premium" o={t4}>
          {fila(310, "potencia", "igual", C.cyan, T.aaa + 1.2)}
          {fila(380, "consumo", "igual", C.cyan, T.aaa + 1.8)}
          <text x={110} y={440} fill={C.grey} fontFamily={mono} fontSize={24}>
            y pagaste más por litro
          </text>
        </Tarjeta>
      ) : null}

      {t5 > 0 ? (
        <Tarjeta alto={300} titulo="mira el manual o la tapa del depósito" o={t5}>
          {fila(300, "«requiere premium»", "úsala", C.yellow, T.requiere)}
          {fila(380, "si no lo dice", "ahórrala", C.cyan, T.ahorra)}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
