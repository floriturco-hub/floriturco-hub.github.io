import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { GIROS, T } from "./tiempos";

// Orden de la ruleta europea (37 casillas, la primera es el 0)
const ORDEN = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const ROJOS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const SLOT = 360 / ORDEN.length;
const CENTRO: [number, number] = [540, 880];
const R = 300;

const colorCasilla = (n: number) => (n === 0 ? "#1F8A4A" : ROJOS.includes(n) ? "#C8303C" : "#15121F");
// Índices de las casillas negras, para que cada giro caiga en negro
const NEGROS = ORDEN.map((n, i) => (n !== 0 && !ROJOS.includes(n) ? i : -1)).filter((i) => i >= 0);
const DESTINOS = [0, 1, 2, 3, 4, 5].map((k) => NEGROS[(k * 5) % NEGROS.length]);

// Ángulo de la rueda al final de cada giro: la casilla destino queda arriba (-90°)
const finGiro = (indice: number) => -90 - indice * SLOT;

// Rotación acumulada: cada giro da vueltas completas y se detiene en su casilla
const rotacion = (t: number) => {
  let angulo = 0;
  for (let k = 0; k < GIROS.length; k++) {
    const inicio = GIROS[k];
    const fin = inicio + 0.9;
    const objetivo = finGiro(DESTINOS[k]);
    const base = angulo;
    const delta = (((objetivo - base) % 360) + 360) % 360;
    const destino = base + 720 + delta;
    if (t < inicio) {
      return angulo;
    }
    if (t < fin) {
      const p = interpolate(t, [inicio, fin], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
      return base + (destino - base) * p;
    }
    angulo = destino;
  }
  return angulo;
};

export const Ruleta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const giro = rotacion(t);
  const giros = GIROS.map((inicio, k) => (t >= inicio + 0.9 ? k : -1)).filter((k) => k >= 0).length;
  const cuerpo = (n: number) => 10 * Math.pow(2, n);
const formato = (v: number) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Pérdidas acumuladas: cada giro completado suma su apuesta
  const perdido = Array.from({ length: giros }).reduce<number>((s, _, k) => s + cuerpo(k), 0);
  const restante = 1000 - perdido;

  const ocultaSaldo = interpolate(t, [T.dosDeCada100 - 0.4, T.dosDeCada100, T.cero, T.cero + 0.4], [1, 0, 0, 1], clamp);

  // Gancho: cartel grande en los primeros segundos y el sello "¡Mentira!"
  const cartel = interpolate(t, [0, 0.2, T.mentira - 0.2, T.mentira], [0, 1, 1, 0], clamp);
  const sello = interpolate(t, [T.mentira, T.mentira + 0.15, T.trampa - 0.2, T.trampa], [0, 1, 1, 0], clamp);

  // Bola: vuelta rápida que se asienta en la casilla
  const bola = (() => {
    for (let k = 0; k < GIROS.length; k++) {
      const inicio = GIROS[k];
      if (t >= inicio && t < inicio + 0.9) {
        const p = interpolate(t, [inicio, inicio + 0.9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        return -90 + (1 - p) * 1080;
      }
    }
    return -90;
  })();

  // Pila de fichas por apuesta, aparece al girar
  const pilas = [0, 1, 2, 3, 4, 5].map((k) => ({ x: 170 + k * 128, valor: cuerpo(k), o: interpolate(t, [GIROS[k] + 0.9, GIROS[k] + 1.1], [0, 1], clamp) }));
  const tope = interpolate(t, [T.siguiente, T.siguiente + 0.4], [0, 1], clamp);

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {/* Cartel del gancho */}
      {cartel > 0 ? (
        <g opacity={cartel}>
          <text x={540} y={200} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={92} fontWeight={700}>
            ¿NUNCA PIERDES?
          </text>
        </g>
      ) : null}
      {sello > 0 && t >= T.mentira ? (
        <g transform={`translate(540 430) rotate(-8) scale(${interpolate(t, [T.mentira, T.mentira + 0.15], [1.6, 1], clamp)})`} opacity={sello}>
          <rect x={-250} y={-60} width={500} height={120} rx={14} fill="none" stroke={C.red} strokeWidth={10} />
          <text x={0} y={22} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={76} fontWeight={700}>
            ¡Mentira!
          </text>
        </g>
      ) : null}

      {/* Barra de saldo: 1.000 € de inicio; se oculta mientras la tarjeta de probabilidad ocupa su sitio */}
      <g opacity={ocultaSaldo}>
        <rect x={100} y={300} width={880} height={40} rx={20} fill={C.cardBorder} />
        <rect x={100} y={300} width={880 * Math.max(0, restante) / 1000} height={40} rx={20} fill={C.cyan} />
        <text x={100} y={280} fill={C.grey} fontFamily={mono} fontSize={30}>
          saldo: {formato(restante)} €
        </text>
        <text x={980} y={280} textAnchor="end" fill={C.red} fontFamily={mono} fontSize={30} fontWeight={700} opacity={interpolate(t, [GIROS[0], GIROS[0] + 0.3], [0, 1], clamp)}>
          perdido: {formato(perdido)} €
        </text>
      </g>

      {/* Rueda */}
      <g transform={`translate(${CENTRO[0]} ${CENTRO[1]})`}>
        <circle r={R + 26} fill="#2A2350" />
        <g transform={`rotate(${giro})`}>
          {ORDEN.map((n, i) => {
            const a1 = ((i * SLOT - SLOT / 2) * Math.PI) / 180;
            const a2 = ((i * SLOT + SLOT / 2) * Math.PI) / 180;
            const x1 = Math.cos(a1) * R;
            const y1 = Math.sin(a1) * R;
            const x2 = Math.cos(a2) * R;
            const y2 = Math.sin(a2) * R;
            const xt = Math.cos((i * SLOT * Math.PI) / 180) * (R - 40);
            const yt = Math.sin((i * SLOT * Math.PI) / 180) * (R - 40);
            return (
              <g key={i}>
                <path d={`M 0 0 L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} Z`} fill={colorCasilla(n)} stroke="#F2E6DA" strokeWidth={2} />
                <text x={xt} y={yt + 9} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={22} fontWeight={700} transform={`rotate(${i * SLOT + 90} ${xt} ${yt})`}>
                  {n}
                </text>
              </g>
            );
          })}
        </g>
        <circle r={R * 0.42} fill="#120E28" stroke="#C8C4D8" strokeWidth={6} />
        {/* Bola */}
        <circle cx={Math.cos((bola * Math.PI) / 180) * (R - 14)} cy={Math.sin((bola * Math.PI) / 180) * (R - 14)} r={13} fill="#FFFFFF" />
        {/* Puntero */}
        <polygon points={`0,${-R - 12} -18,${-R - 48} 18,${-R - 48}`} fill={C.yellow} />
      </g>

      {/* Mesa de apuestas: pilas de fichas que suben */}
      <g>
        <rect x={60} y={1210} width={960} height={300} rx={24} fill="#1A1636" stroke={C.cardBorder} strokeWidth={2} />
        {pilas.map((p, k) => {
          const alto = Math.min(260, (p.valor / 320) * 240 + 20);
          return (
            <g key={k} opacity={p.o}>
              <rect x={p.x - 46} y={1470 - alto} width={92} height={alto} rx={12} fill={k % 2 ? C.yellow : C.cyan} opacity={0.9} />
              <text x={p.x} y={1500} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={30} fontWeight={700}>
                {p.valor} €
              </text>
            </g>
          );
        })}
        {/* Séptima apuesta, tachada */}
        <g opacity={tope}>
          <rect x={170 + 6 * 128 - 60} y={1226} width={120} height={60} rx={12} fill="none" stroke={C.red} strokeWidth={4} />
          <text x={170 + 6 * 128} y={1268} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={28} fontWeight={700}>
            640 €
          </text>
          <line x1={170 + 6 * 128 - 58} y1={1226} x2={170 + 6 * 128 + 58} y2={1286} stroke={C.red} strokeWidth={6} />
        </g>
      </g>
    </svg>
  );
};
