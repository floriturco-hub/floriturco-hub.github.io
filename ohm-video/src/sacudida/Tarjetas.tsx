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

  // 1) Hasta siete de cada diez
  const t1 = sale(T.siete - 0.3, T.dormirte);
  const encendidas = interpolate(t, [T.siete, T.siete + 1.4], [0, 7], clamp);
  // 2) Qué pasa al dormirte
  const t2 = sale(T.dormirte - 0.2, T.pero);
  // 3) Teoría de los árboles
  const t3 = sale(T.teoria - 0.2, T.probable - 0.1);
  const cae = interpolate(t, [T.arboles + 1.0, T.arboles + 2.2], [0, 1], clamp);
  // 4) Qué lo favorece
  const t4 = sale(T.probable - 0.2, T.inofensiva);
  // 5) Cómo reducirlo
  const t5 = sale(T.reducirla - 0.2, T.noTeCaes);

  const dibujaFila = (y: number, clave: string, valor: string, color: string, o: number) => (
    <g opacity={o}>
      <text x={110} y={y} fill={C.grey} fontFamily={mono} fontSize={34}>
        {clave}
      </text>
      <text x={400} y={y} fill={color} fontFamily={mono} fontSize={40} fontWeight={700}>
        {valor}
      </text>
    </g>
  );

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={330} titulo="quién la siente" o={t1}>
          {new Array(10).fill(0).map((_, i) => (
            <Persona key={i} x={140 + i * 84} y={310} color={i < encendidas ? C.yellow : C.grey} o={i < encendidas ? 1 : 0.35} />
          ))}
          <text x={110} y={425} fill={C.yellow} fontFamily={mono} fontSize={52} fontWeight={700}>
            hasta 7 de cada 10
          </text>
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={330} titulo="al dormirte" o={t2}>
          {dibujaFila(300, "músculos", "se relajan", C.cyan, sube(T.musculos))}
          {dibujaFila(365, "corazón", "más lento", C.cyan, sube(T.corazon))}
          {dibujaFila(430, "temperatura", "baja", C.cyan, sube(T.temperatura))}
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={360} titulo="una teoría: reflejo antiguo" o={t3}>
          <line x1={110} y1={330} x2={520} y2={330} stroke="#8A5A32" strokeWidth={14} strokeLinecap="round" />
          <circle cx={230} cy={295} r={26} fill="#8A5A32" />
          <circle cx={230} cy={265} r={14} fill="#8A5A32" />
          <g opacity={cae}>
            <path d="M 230 340 L 230 440" stroke={C.red} strokeWidth={6} strokeDasharray="10 10" strokeLinecap="round" />
            <polyline points="214,424 230,446 246,424" fill="none" stroke={C.red} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text x={570} y={310} fill={C.white} fontFamily={mono} fontSize={38} fontWeight={700}>
            dormir en los árboles
          </text>
          <text x={570} y={370} fill={C.red} fontFamily={mono} fontSize={38} fontWeight={700}>
            caer era peligroso
          </text>
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={400} titulo="más probable con" o={t4}>
          {dibujaFila(300, "", "cafeína", C.orange, sube(T.cafeina))}
          {dibujaFila(360, "", "estrés", C.orange, sube(T.estres))}
          {dibujaFila(420, "", "cansancio", C.orange, sube(T.cansancio))}
          {dibujaFila(480, "", "ejercicio nocturno", C.orange, sube(T.ejercicio))}
        </Tarjeta>
      ) : null}

      {t5 > 0 ? (
        <Tarjeta alto={290} titulo="cómo reducirla" o={t5}>
          {dibujaFila(300, "1", "duerme a horas regulares", C.yellow, sube(T.horas))}
          {dibujaFila(370, "2", "sin cafeína por la tarde", C.yellow, sube(T.cafeinaTarde))}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
