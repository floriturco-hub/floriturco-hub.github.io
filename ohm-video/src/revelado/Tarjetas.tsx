import { interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

const VERDE = "#48C878";
const ESPECTRO = ["#7A4AE8", "#4A8AF8", "#38C8E8", "#48C878", "#E8D848", "#E8A040", "#E8414F"];

const Tarjeta: React.FC<{ readonly alto: number; readonly titulo: string; readonly o: number; readonly children: React.ReactNode }> = ({ alto, titulo, o, children }) => (
  <g opacity={o}>
    <rect x={60} y={150} width={960} height={alto} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
    <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>
      {titulo}
    </text>
    {children}
  </g>
);

// Barra del espectro (violeta → rojo) entre x0 y x1
const Espectro: React.FC<{ readonly x0: number; readonly x1: number; readonly y: number; readonly alto: number }> = ({ x0, x1, y, alto }) => {
  const w = (x1 - x0) / ESPECTRO.length;
  return (
    <g>
      {ESPECTRO.map((c, i) => (
        <rect key={i} x={x0 + i * w} y={y} width={w + 1} height={alto} fill={c} />
      ))}
    </g>
  );
};

// Tarjetas superiores (espacio de pantalla)
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = (desde: number, hasta: number) => interpolate(t, [desde, desde + 0.4, hasta - 0.4, hasta], [0, 1, 1, 0], clamp);
  const sube = (desde: number) => interpolate(t, [desde - 0.1, desde + 0.3], [0, 1], clamp);
  const llena = (desde: number) => interpolate(t, [desde, desde + 0.9], [0, 1], clamp);

  const t1 = sale(T.sensible - 0.2, T.cristales - 0.1);
  const t2 = sale(T.clave, T.cantidad - 0.1);
  const t3 = sale(T.cantidad, T.muro - 0.1);
  const t4 = sale(T.porEso, T.ojo - 0.1);
  const t5 = sale(T.ojo, T.final - 0.1);

  const barra = (y: number, nombre: string, valor: number, color: string, desde: number) => (
    <g opacity={sube(desde)}>
      <text x={110} y={y + 30} fill={color} fontFamily={mono} fontSize={34} fontWeight={700}>
        {nombre}
      </text>
      <rect x={300} y={y} width={660} height={40} rx={20} fill={C.cardBorder} />
      <rect x={300} y={y} width={660 * valor * llena(desde)} height={40} rx={20} fill={color} />
    </g>
  );

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
        <Tarjeta alto={330} titulo="papel en blanco y negro: ¿qué colores ve?" o={t1}>
          <Espectro x0={110} x1={970} y={380} alto={40} />
          {/* Sensibilidad: alta en azul, nula en rojo */}
          <path d="M 110 380 C 160 260, 260 250, 360 270 C 460 290, 520 330, 600 372 L 620 380 Z" fill="#E8E6F0" opacity={0.85 * sube(T.sensible)} />
          <text x={250} y={320} textAnchor="middle" fill="#1A1430" fontFamily={mono} fontSize={26} fontWeight={700} opacity={sube(T.sensible)}>
            lo ve
          </text>
          <text x={850} y={350} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={30} fontWeight={700} opacity={sube(T.ciego)}>
            ciego al rojo
          </text>
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={340} titulo="energía de cada fotón" o={t2}>
          {barra(260, "azul", 0.9, "#4A8AF8", T.azul)}
          {barra(330, "verde", 0.74, VERDE, T.azul + 0.4)}
          {barra(400, "rojo", 0.52, "#E8414F", T.rojaE)}
          <line x1={300 + 660 * 0.66} y1={244} x2={300 + 660 * 0.66} y2={456} stroke={C.yellow} strokeWidth={4} strokeDasharray="10 8" opacity={sube(T.chocan)} />
          <text x={300 + 660 * 0.66} y={480} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={24} fontWeight={700} opacity={sube(T.chocan)}>
            mínimo para marcar el papel
          </text>
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={290} titulo="no es cuestión de cantidad" o={t3}>
          {fila(300, "×1000 fotones rojos", "0 marcas", C.red, T.mil)}
          {fila(380, "×1 fotón azul", "1 marca ✓", VERDE, T.unoAzul)}
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={330} titulo="¿quién ve la luz roja?" o={t4}>
          {fila(290, "papel blanco y negro", "no", VERDE, T.ciegoRojo)}
          {fila(355, "tus ojos", "sí", C.white, T.vemos)}
          {fila(420, "carrete de la cámara", "sí → a oscuras", C.red, T.carrete)}
        </Tarjeta>
      ) : null}

      {t5 > 0 ? (
        <Tarjeta alto={330} titulo="ninguna luz roja es perfecta" o={t5}>
          <Espectro x0={110} x1={970} y={380} alto={40} />
          <path d="M 110 378 L 560 378 C 600 360, 640 360, 680 378 L 760 378 C 800 260, 900 250, 970 300 L 970 378 Z" fill="#E8E6F0" opacity={0.85 * sube(T.perfecta)} />
          <text x={620} y={330} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={26} fontWeight={700} opacity={sube(T.cuela)}>
            se cuela un poco
          </text>
          <text x={110} y={460} fill={C.white} fontFamily={mono} fontSize={28} fontWeight={700} opacity={sube(T.cerca)}>
            lejos del papel y poco tiempo
          </text>
        </Tarjeta>
      ) : null}
    </svg>
  );
};
