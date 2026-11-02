import { Easing, interpolate } from "remotion";
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

// Iconos sencillos para la tarjeta de Pavlov
const Campana: React.FC<{ readonly x: number; readonly y: number; readonly t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y}) rotate(${Math.sin(t * 12) * 12} 0 -30)`}>
    <path d="M -30 16 C -30 -20, -18 -38, 0 -38 C 18 -38, 30 -20, 30 16 L 38 24 L -38 24 Z" fill={C.yellow} />
    <circle cx={0} cy={30} r={7} fill={C.yellow} />
    <circle cx={0} cy={-42} r={5} fill={C.yellow} />
  </g>
);
const Gota: React.FC<{ readonly x: number; readonly y: number; readonly color: string }> = ({ x, y, color }) => (
  <path d={`M ${x} ${y - 32} C ${x + 6} ${y - 18}, ${x + 22} ${y - 2}, ${x + 22} ${y + 12} C ${x + 22} ${y + 26}, ${x + 12} ${y + 34}, ${x} ${y + 34} C ${x - 12} ${y + 34}, ${x - 22} ${y + 26}, ${x - 22} ${y + 12} C ${x - 22} ${y - 2}, ${x - 6} ${y - 18}, ${x} ${y - 32} Z`} fill={color} />
);
const Llave: React.FC<{ readonly x: number; readonly y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle cx={-22} cy={0} r={16} fill="none" stroke={C.yellow} strokeWidth={8} />
    <path d="M -6 0 L 40 0 M 26 0 L 26 14 M 36 0 L 36 11" stroke={C.yellow} strokeWidth={8} strokeLinecap="round" />
  </g>
);
const Wc: React.FC<{ readonly x: number; readonly y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-40} y={-30} width={80} height={60} rx={10} fill={C.cyan} />
    <text x={0} y={14} textAnchor="middle" fill="#0A0818" fontFamily={mono} fontSize={36} fontWeight={700}>
      WC
    </text>
  </g>
);
const Flecha: React.FC<{ readonly x: number; readonly y: number; readonly o: number }> = ({ x, y, o }) => (
  <path d={`M ${x} ${y} L ${x + 70} ${y} M ${x + 52} ${y - 16} L ${x + 72} ${y} L ${x + 52} ${y + 16}`} fill="none" stroke={C.white} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={o} />
);

// Tarjetas superiores (espacio de pantalla) y el medidor de "ganas" a la izquierda
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = (desde: number, hasta: number) => interpolate(t, [desde, desde + 0.4, hasta - 0.4, hasta], [0, 1, 1, 0], clamp);
  const sube = (desde: number) => interpolate(t, [desde - 0.1, desde + 0.3], [0, 1], clamp);
  const traza = (desde: number, hasta: number) => interpolate(t, [desde, hasta], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });

  const t1 = sale(T.parece - 0.2, T.musculo - 0.2);
  const t2 = sale(T.ml - 0.1, T.calle - 0.1);
  const t3 = sale(T.calle + 0.2, T.aprende - 0.1);
  const t4 = sale(T.aprende, T.suelta - 0.2);
  const t5 = sale(T.pavlov - 0.1, T.truco - 0.2);
  const t6 = sale(T.truco - 0.1, T.escapa - 0.2);
  const t7 = sale(T.escapa - 0.1, T.final - 0.1);

  // Gráfica del camino a casa: la vejiga casi plana, las ganas se disparan en la puerta
  const G = { x0: 130, x1: 900, y0: 450, y1: 260 };
  const curva = (f: (u: number) => number, hasta: number) =>
    new Array(41)
      .fill(0)
      .map((_, i) => i / 40)
      .filter((u) => u <= hasta)
      .map((u, i) => `${i === 0 ? "M" : "L"} ${G.x0 + (G.x1 - G.x0) * u} ${G.y0 + (G.y1 - G.y0) * f(u)}`)
      .join(" ");
  const vejigaF = (u: number) => Math.min(0.75, 0.2 + u * 1.4);
  const ganasF = (u: number) => (u < 0.88 ? 0.12 + 0.05 * Math.sin(u * 20) : 0.12 + (u - 0.88) * 7);
  const pVejiga = traza(T.parece, T.llevaba + 1.2);
  const pGanas = Math.min(0.87, traza(T.parece + 0.4, T.cambio)) + (t > T.cambio ? traza(T.cambio, T.cambio + 0.5) * 0.13 : 0);

  // Contador de veces que llegaste a casa y fuiste directo al baño
  const veces = Math.round(interpolate(t, [T.cientos, T.directo + 0.6], [1, 300], { ...clamp, easing: Easing.in(Easing.quad) }));

  // Volumen de la alarma en la calle
  const barras = Math.round(interpolate(t, [T.baja, T.alarma + 0.4], [5, 1], clamp));

  // Medidor de ganas (izquierda)
  const medidor = Math.max(sale(-1, T.parece + 0.2), sale(T.suelta - 0.2, T.pavlov), sale(T.truco - 0.2, T.escapa));
  const ganas =
    t < T.parece + 0.5
      ? interpolate(t, [0, T.meando], [0.55, 0.95], clamp)
      : t < T.truco - 0.3
        ? interpolate(t, [T.suelta - 0.2, T.contrae], [0.4, 0.97], clamp)
        : interpolate(t, [T.aprieta, T.bajaU + 1.0], [0.97, 0.3], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const tiembla = ganas > 0.85 ? Math.sin(t * 40) * 3 : 0;
  const colorGanas = ganas > 0.8 ? C.red : ganas > 0.5 ? C.orange : C.cyan;

  const fila = (y: number, izq: string, der: string, color: string, desde: number) => (
    <g opacity={sube(desde)}>
      <text x={110} y={y} fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700}>
        {izq}
      </text>
      <text x={970} y={y} textAnchor="end" fill={color} fontFamily={mono} fontSize={36} fontWeight={700}>
        {der}
      </text>
    </g>
  );
  const pildora = (x: number, texto: string, desde: number) => {
    const o = sube(desde);
    const ancho = texto.length * 24 + 40;
    return (
      <g opacity={0.25 + 0.75 * o}>
        <rect x={x} y={330} width={ancho} height={60} rx={16} fill={o > 0.5 ? C.yellow : C.cardBorder} />
        <text x={x + ancho / 2} y={372} textAnchor="middle" fill={o > 0.5 ? "#1A1430" : C.grey} fontFamily={mono} fontSize={34} fontWeight={700}>
          {texto}
        </text>
      </g>
    );
  };

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {medidor > 0 ? (
        <g opacity={medidor} transform={`translate(${tiembla} 0)`}>
          <rect x={46} y={640} width={92} height={600} rx={46} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <rect x={66} y={660 + 560 * (1 - ganas)} width={52} height={560 * ganas} rx={26} fill={colorGanas} />
          <text x={92} y={1290} textAnchor="middle" fill={colorGanas} fontFamily={mono} fontSize={30} fontWeight={700}>
            ganas
          </text>
        </g>
      ) : null}

      {t1 > 0 ? (
        <Tarjeta alto={340} titulo="camino a casa" o={t1}>
          <line x1={G.x0} y1={G.y0} x2={G.x1} y2={G.y0} stroke={C.grey} strokeWidth={2} />
          <line x1={G.x0 + (G.x1 - G.x0) * 0.88} y1={G.y1 - 10} x2={G.x0 + (G.x1 - G.x0) * 0.88} y2={G.y0} stroke={C.grey} strokeWidth={2} strokeDasharray="6 6" />
          <text x={G.x0 + (G.x1 - G.x0) * 0.88} y={G.y0 + 30} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={22}>
            puerta
          </text>
          <text x={G.x0} y={G.y0 + 30} fill={C.grey} fontFamily={mono} fontSize={22}>
            salida
          </text>
          <path d={curva(vejigaF, pVejiga)} fill="none" stroke={C.yellow} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          <path d={curva(ganasF, pGanas)} fill="none" stroke={C.red} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          <text x={760} y={215} textAnchor="end" fill={C.yellow} fontFamily={mono} fontSize={28} fontWeight={700} opacity={sube(T.parece)}>
            vejiga
          </text>
          <text x={970} y={215} textAnchor="end" fill={C.red} fontFamily={mono} fontSize={28} fontWeight={700} opacity={sube(T.parece + 0.4)}>
            ganas
          </text>
          <text x={540} y={340} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={26} opacity={sube(T.llevaba)}>
            igual de llena
          </text>
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={290} titulo="primer aviso" o={t2}>
          <text x={110} y={320} fill={C.yellow} fontFamily={mono} fontSize={70} fontWeight={700}>
            ≈ 200 ml
          </text>
          <g opacity={sube(T.avisa)}>
            <Flecha x={560} y={298} o={1} />
            <text x={970} y={318} textAnchor="end" fill={C.cyan} fontFamily={mono} fontSize={40} fontWeight={700}>
              cerebro
            </text>
          </g>
          <text x={110} y={400} fill={C.red} fontFamily={mono} fontSize={38} fontWeight={700} opacity={sube(T.todavia)}>
            respuesta: «todavía no»
          </text>
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={330} titulo="en la calle" o={t3}>
          {fila(290, "baño", "no hay", C.red, T.calle + 0.4)}
          {fila(355, "freno", "puesto", C.red, T.freno)}
          <g opacity={sube(T.baja)}>
            <text x={110} y={420} fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700}>
              alarma
            </text>
            {[0, 1, 2, 3, 4].map((k) => (
              <rect key={k} x={800 + k * 34} y={420 - 14 - k * 9} width={22} height={14 + k * 9} rx={4} fill={k < barras ? C.orange : C.cardBorder} />
            ))}
          </g>
        </Tarjeta>
      ) : null}

      {t4 > 0 ? (
        <Tarjeta alto={370} titulo="tu cerebro aprende" o={t4}>
          <g opacity={sube(T.cientos)}>
            <text x={110} y={290} fill={C.yellow} fontFamily={mono} fontSize={52} fontWeight={700}>
              ×{veces}
            </text>
            <text x={970} y={286} textAnchor="end" fill={C.white} fontFamily={mono} fontSize={30} fontWeight={700}>
              llegar → baño
            </text>
          </g>
          {pildora(110, "puerta", T.puertaA)}
          {pildora(400, "llaves", T.llaves)}
          {pildora(690, "pasillo", T.pasillo)}
          <text x={540} y={470} textAnchor="middle" fill={VERDE} fontFamily={mono} fontSize={40} fontWeight={700} opacity={sube(T.aqui)}>
            = «aquí sí se puede»
          </text>
        </Tarjeta>
      ) : null}

      {t5 > 0 ? (
        <Tarjeta alto={380} titulo="reflejo aprendido" o={t5}>
          <g opacity={sube(T.pavlov)}>
            <Campana x={180} y={300} t={t} />
            <Flecha x={250} y={300} o={1} />
            <Gota x={390} y={292} color={C.cyan} />
            <text x={970} y={312} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={30} fontWeight={700}>
              perro: baba
            </text>
          </g>
          <g opacity={sube(T.banoP - 0.6)}>
            <Llave x={180} y={400} />
            <Flecha x={250} y={400} o={1} />
            <Wc x={390} y={400} />
            <text x={970} y={412} textAnchor="end" fill={C.white} fontFamily={mono} fontSize={30} fontWeight={700}>
              tú: ganas
            </text>
          </g>
          <text x={540} y={490} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={28} fontWeight={700} opacity={sube(T.urgencia)}>
            «urgencia de la llave en la cerradura»
          </text>
        </Tarjeta>
      ) : null}

      {t6 > 0 ? (
        <Tarjeta alto={380} titulo="el truco" o={t6}>
          {fila(290, "1  no corras", "", C.white, T.corras)}
          {fila(355, "2  para y respira", "", C.white, T.para)}
          <g opacity={sube(T.aprieta)}>
            <text x={110} y={420} fill={C.white} fontFamily={mono} fontSize={36} fontWeight={700}>
              3  aprieta el suelo pélvico
            </text>
          </g>
          <text x={110} y={490} fill={C.cyan} fontFamily={mono} fontSize={36} fontWeight={700} opacity={sube(T.bajaU)}>
            → baja en segundos
          </text>
        </Tarjeta>
      ) : null}

      {t7 > 0 ? (
        <Tarjeta alto={290} titulo="si se te escapa a menudo" o={t7}>
          {fila(300, "consúltalo", "médico", C.cyan, T.consulta)}
          <text x={110} y={380} fill={C.yellow} fontFamily={mono} fontSize={36} fontWeight={700} opacity={sube(T.entrena)}>
            la vejiga se entrena
          </text>
        </Tarjeta>
      ) : null}
    </svg>
  );
};
