import { interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

const TINTO = "#C83A4A";

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
  const llena = (desde: number) => interpolate(t, [desde, desde + 1.0], [0, 1], clamp);

  const t1 = sale(T.estudiantes - 0.2, T.parece - 0.2);
  const t2 = sale(T.antes, T.etiqueta - 0.2);
  const t3 = sale(T.mismo - 0.1, T.estudio - 0.2);
  const t4 = sale(T.escaner - 0.1, T.ciegas - 0.2);
  const t5 = sale(T.seisMil - 0.1, T.asi - 0.1);
  const t6 = sale(T.truco - 0.1, T.final - 0.1);

  const contador = Math.round(interpolate(t, [T.estudiantes - 0.2, T.estudiantes + 0.8], [0, 54], clamp));
  const catas = Math.round(interpolate(t, [T.seisMil - 0.1, T.seisMil + 1.0], [0, 6000], clamp));

  const pildora = (x: number, y: number, texto: string, color: string, desde: number) => {
    const ancho = texto.length * 22 + 40;
    return (
      <g opacity={sube(desde)}>
        <rect x={x} y={y - 42} width={ancho} height={60} rx={16} fill={color} />
        <text x={x + ancho / 2} y={y} textAnchor="middle" fill="#1A1430" fontFamily={mono} fontSize={32} fontWeight={700}>
          {texto}
        </text>
      </g>
    );
  };

  const barra = (y: number, nombre: string, valor: number, color: string, desde: number) => (
    <g opacity={sube(desde)}>
      <text x={110} y={y + 30} fill={color} fontFamily={mono} fontSize={34} fontWeight={700}>
        {nombre}
      </text>
      <rect x={330} y={y} width={630} height={40} rx={20} fill={C.cardBorder} />
      <rect x={330} y={y} width={630 * valor * llena(desde)} height={40} rx={20} fill={color} />
    </g>
  );

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={380} titulo="experimento · Universidad de Burdeos" o={t1}>
          <text x={110} y={310} fill={C.yellow} fontFamily={mono} fontSize={80} fontWeight={700}>
            {contador}
          </text>
          <text x={260} y={300} fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>
            estudiantes de enología
          </text>
          <text x={110} y={380} fill={C.grey} fontFamily={mono} fontSize={30} fontWeight={700} opacity={sube(T.colorante)}>
            blanco + colorante sin sabor ni olor
          </text>
          {pildora(110, 470, "«tinto»", TINTO, T.tinto)}
          {pildora(330, 470, "frutos rojos", C.yellow, T.frutos)}
          {pildora(660, 470, "notas oscuras", C.yellow, T.notas)}
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={300} titulo="antes de probar" o={t2}>
          <g opacity={sube(T.ojos)}>
            <text x={110} y={305} fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700}>
              ojos: color rojo
            </text>
            <text x={970} y={305} textAnchor="end" fill={TINTO} fontFamily={mono} fontSize={36} fontWeight={700} opacity={sube(T.rojoTinto)}>
              = tinto
            </text>
          </g>
          <g opacity={sube(T.ajusta)}>
            <text x={110} y={390} fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700}>
              sabor
            </text>
            <text x={970} y={390} textAnchor="end" fill={C.yellow} fontFamily={mono} fontSize={36} fontWeight={700}>
              se ajusta a lo esperado
            </text>
          </g>
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={340} titulo="el mismo vino, otra botella" o={t3}>
          <text x={300} y={300} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={36} fontWeight={700} opacity={sube(T.reserva)}>
            gran reserva
          </text>
          <text x={780} y={300} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={36} fontWeight={700} opacity={sube(T.mesa)}>
            vino de mesa
          </text>
          <line x1={540} y1={260} x2={540} y2={460} stroke={C.cardBorder} strokeWidth={3} />
          <g opacity={sube(T.complejo)}>
            <text x={300} y={375} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>
              complejo
            </text>
            <text x={300} y={430} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>
              equilibrado
            </text>
          </g>
          <g opacity={sube(T.plano)}>
            <text x={780} y={375} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>
              plano
            </text>
            <text x={780} y={430} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>
              débil
            </text>
          </g>
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={300} titulo="escáner cerebral · mismo vino" o={t4}>
          {barra(265, "90 $", 0.85, C.yellow, T.noventa)}
          {barra(345, "10 $", 0.5, "#C8C4D8", T.diez)}
          <text x={110} y={428} fill={C.grey} fontFamily={mono} fontSize={26} opacity={sube(T.placer)}>
            actividad en la zona del placer
          </text>
        </Tarjeta>
      ) : null}

      {t5 > 0 ? (
        <Tarjeta alto={340} titulo="catas a ciegas" o={t5}>
          <text x={110} y={305} fill={C.yellow} fontFamily={mono} fontSize={64} fontWeight={700}>
            +{catas >= 1000 ? `${Math.floor(catas / 1000)}.${String(catas % 1000).padStart(3, "0")}` : catas}
          </text>
          <text x={970} y={300} textAnchor="end" fill={C.white} fontFamily={mono} fontSize={30} fontWeight={700} opacity={sube(T.sinFormacion)}>
            gente sin formación
          </text>
          {barra(345, "baratos", 0.66, C.cyan, T.baratos)}
          {barra(405, "caros", 0.6, "#C8C4D8", T.caros)}
        </Tarjeta>
      ) : null}

      {t6 > 0 ? (
        <Tarjeta alto={300} titulo="el truco" o={t6}>
          <text x={110} y={300} fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700} opacity={sube(T.cata)}>
            1  cata a ciegas
          </text>
          <text x={110} y={365} fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700} opacity={sube(T.paga)}>
            2  paga por lo que te gusta
          </text>
          <text x={110} y={425} fill={C.yellow} fontFamily={mono} fontSize={34} fontWeight={700} opacity={sube(T.noEtiqueta)}>
            no por la etiqueta
          </text>
        </Tarjeta>
      ) : null}
    </svg>
  );
};
