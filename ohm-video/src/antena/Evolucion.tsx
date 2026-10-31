import { Easing, interpolate, interpolateColors, random } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Antena3D } from "./Antena3D";
import { cruzar, Gen, GANADORA, genAleatorio, proyectar, puntosBrazo } from "./geom";
import { T } from "./tiempos";

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };
const N = 16;
const POBLACION = new Array(N).fill(0).map((_, k) => genAleatorio(`p${k}`));
const PUNTUACION = new Array(N).fill(0).map((_, k) => 0.15 + random(`sc${k}`) * 0.85);
const MEJORES = [...PUNTUACION.map((v, k) => [v, k] as const)].sort((a, b) => b[0] - a[0]).slice(0, 4).map((x) => x[1]);
const FOCO = 5; // la antena cuyo ADN se lee

const celda = (k: number) => ({ x: 175 + (k % 4) * 243, y: 640 + Math.floor(k / 4) * 300 });

// Mezcla gradual de un ADN hacia la ganadora (para la evolución acelerada)
const hacia = (a: Gen[], p: number): Gen[] =>
  GANADORA.map((g, k) => {
    const b = a[k] ?? a[a.length - 1];
    return { largo: b.largo + (g.largo - b.largo) * p, giro: b.giro + (g.giro - b.giro) * p, inclina: b.inclina + (g.inclina - b.inclina) * p };
  });

export const Poblacion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const foco = interpolate(t, [T.adn - 0.3, T.adn + 0.5, T.simulador - 0.5, T.simulador + 0.2], [0, 1, 1, 0], suave);
  const pasos = Math.floor(interpolate(t, [T.avanza - 0.2, T.simulador - 0.6], [1, 7], clamp));
  const prueba = interpolate(t, [T.simulador + 0.2, T.sobreviven - 0.2], [0, 1], suave);
  const sobrevive = interpolate(t, [T.sobreviven, T.sobreviven + 0.4], [0, 1], clamp);
  const descarta = interpolate(t, [T.descartan, T.descartan + 0.5], [0, 1], clamp);
  const zoom = 1 + 1.2 * foco;
  const c = celda(FOCO);
  const cx = 540 + (c.x - 540) * foco;
  const cy = 1000 + (c.y + 60 - 1000) * foco;

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`}>
        {POBLACION.map((genes, k) => {
          const { x, y } = celda(k);
          const aparece = interpolate(t, [T.azar - 0.4 + k * 0.08, T.azar + k * 0.08], [0, 1], clamp);
          const esMejor = MEJORES.includes(k);
          const apaga = esMejor ? 0 : descarta;
          const dim = k === FOCO ? 1 : 1 - 0.75 * foco;
          return (
            <g key={k} opacity={aparece * dim * (1 - 0.8 * apaga)}>
              <rect x={x - 105} y={y - 150} width={210} height={270} rx={18} fill={C.card} stroke={esMejor && sobrevive > 0.5 ? C.yellow : C.cardBorder} strokeWidth={esMejor && sobrevive > 0.5 ? 4 : 2} />
              <Antena3D
                x={x}
                y={y + 30}
                s={2.2}
                guinada={t * 0.7 + k}
                genes={genes}
                pasos={k === FOCO && foco > 0.05 ? pasos : undefined}
                color={esMejor && sobrevive > 0.5 ? C.yellow : "#D8D4E8"}
                grosor={2.4}
              />
              {/* Puntuación del simulador */}
              <rect x={x - 80} y={y + 92} width={160} height={12} rx={6} fill="rgba(255,255,255,0.08)" />
              <rect x={x - 80} y={y + 92} width={160 * PUNTUACION[k] * prueba} height={12} rx={6} fill={interpolateColors(PUNTUACION[k], [0, 0.6, 1], [C.red, C.orange, C.cyan])} />
              {apaga > 0 ? (
                <g stroke={C.red} strokeWidth={6} strokeLinecap="round" opacity={apaga}>
                  <line x1={x - 40} y1={y - 60} x2={x + 40} y2={y + 20} />
                  <line x1={x + 40} y1={y - 60} x2={x - 40} y2={y + 20} />
                </g>
              ) : null}
            </g>
          );
        })}
      </g>
      {/* Las reglas que recibió el programa (los ingenieros no dibujaron nada) */}
      {t < T.azar + 0.6 ? (
        <g opacity={interpolate(t, [T.ingenieros + 0.2, T.ingenieros + 0.7, T.azar + 0.1, T.azar + 0.6], [0, 1, 1, 0], clamp)}>
          <rect x={60} y={560} width={960} height={560} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={630} fill={C.grey} fontFamily={mono} fontSize={30}>reglas para el programa</text>
          {["cabe en pocos centímetros", "capta casi cualquier ángulo", "funciona en la banda X"].map((r, k) => {
            const on = interpolate(t, [21.6 + k * 0.35, 21.9 + k * 0.35], [0.25, 1], clamp);
            return (
              <g key={k} opacity={on}>
                <circle cx={135} cy={730 + k * 120} r={28} fill={on > 0.5 ? C.yellow : C.grey} />
                <text x={135} y={741 + k * 120} textAnchor="middle" fill={C.bg} fontFamily={mono} fontSize={30} fontWeight={700}>{k + 1}</text>
                <text x={190} y={746 + k * 120} fill={C.white} fontFamily={mono} fontSize={44} fontWeight={700}>{r}</text>
              </g>
            );
          })}
          <text x={110} y={1080} fill={C.grey} fontFamily={mono} fontSize={28}>ningún plano dibujado a mano</text>
        </g>
      ) : null}
      {/* ADN: lista de instrucciones que va construyendo la antena */}
      {foco > 0 ? (
        <g opacity={foco}>
          <rect x={60} y={150} width={960} height={440} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={210} fill={C.grey} fontFamily={mono} fontSize={30}>ADN de la antena</text>
          {POBLACION[FOCO].slice(0, 6).map((g, k) => {
            const on = k < pasos ? 1 : 0.25;
            return (
              <text key={k} x={110} y={270 + k * 52} fill={k < pasos ? C.yellow : C.grey} opacity={on} fontFamily={mono} fontSize={36} fontWeight={700}>
                {`avanza ${Math.round(g.largo)} · gira ${Math.round(g.giro)}° · sube ${Math.round(g.inclina)}°`}
              </text>
            );
          })}
        </g>
      ) : null}
    </svg>
  );
};

// Cruce de dos ganadoras + mutación, y evolución acelerada con contador de generaciones
export const Generaciones: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const padreA = POBLACION[MEJORES[0]];
  const padreB = POBLACION[MEJORES[1]];
  const mezcla = interpolate(t, [T.mezclan + 0.2, T.mezclan + 1.2], [0, 1], suave);
  const muta = interpolate(t, [T.mutaciones, T.mutaciones + 0.4], [0, 1], clamp);
  const hijo = cruzar(padreA, padreB, 3, 4, 50 * muta);
  const acelera = interpolate(t, [T.generacion, T.aparecio], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const generacion = Math.max(1, Math.round(acelera * 140));
  const cruceVis = 1 - interpolate(t, [T.generacion - 0.2, T.generacion + 0.4], [0, 1], clamp);

  const segmentos = (genes: Gen[], x: number, y: number, s: number, guinada: number) => {
    const pts = puntosBrazo(genes);
    return new Array(4).fill(0).map((_, b) =>
      pts.slice(1).map((p, k) => {
        const a = proyectar(pts[k], guinada + (b * Math.PI) / 2);
        const q = proyectar(p, guinada + (b * Math.PI) / 2);
        const color = k === 4 && muta > 0 ? C.yellow : k < 3 ? C.cyan : C.orange;
        return <line key={`${b}-${k}`} x1={x + a[0] * s} y1={y + a[1] * s} x2={x + q[0] * s} y2={y + q[1] * s} stroke={color} strokeWidth={5} strokeLinecap="round" />;
      }),
    );
  };

  // Curva de aptitud que sube con las generaciones
  const curva: string[] = [];
  for (let k = 0; k <= 60; k++) {
    const u = k / 60;
    if (u > acelera) break;
    const v = 1 - Math.exp(-u * 4) * 0.85 + (random(`f${k}`) - 0.5) * 0.04;
    curva.push(`${(140 + u * 800).toFixed(1)},${(520 - v * 260).toFixed(1)}`);
  }

  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {cruceVis > 0 ? (
        <g opacity={cruceVis}>
          <Antena3D x={260} y={1150} s={3.6} guinada={t * 0.7} genes={padreA} color={C.cyan} grosor={4} />
          <Antena3D x={820} y={1150} s={3.6} guinada={t * 0.7 + 1} genes={padreB} color={C.orange} grosor={4} />
          <g opacity={mezcla}>
            <text x={540} y={1250} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={60} fontWeight={700}>+</text>
            {segmentos(hijo, 540, 1560, 4.2, t * 0.7)}
            {muta > 0 ? <circle cx={540} cy={1560 - 140} r={30 + 20 * Math.sin(t * 10)} fill="none" stroke={C.yellow} strokeWidth={4} opacity={muta * 0.6} /> : null}
          </g>
        </g>
      ) : null}
      {/* Evolución acelerada */}
      {cruceVis < 1 ? (
        <g opacity={1 - cruceVis}>
          {new Array(9).fill(0).map((_, k) => {
            const x = 220 + (k % 3) * 320;
            const y = 900 + Math.floor(k / 3) * 330;
            const g = hacia(genAleatorio(`gen${k}-${Math.floor(generacion / 12)}`), Math.min(1, acelera * 1.1));
            return <Antena3D key={k} x={x} y={y} s={2.6} guinada={t * 0.8 + k} genes={g} grosor={2.6} color={acelera > 0.85 ? C.yellow : "#D8D4E8"} />;
          })}
          <rect x={60} y={150} width={960} height={430} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>generación</text>
          <text x={980} y={240} textAnchor="end" fill={C.yellow} fontFamily={mono} fontSize={80} fontWeight={700}>{generacion}</text>
          <line x1={140} y1={520} x2={940} y2={520} stroke={C.grey} strokeWidth={2} opacity={0.5} />
          <text x={140} y={560} fill={C.grey} fontFamily={mono} fontSize={26}>calidad de la señal</text>
          <polyline points={curva.join(" ")} fill="none" stroke={C.cyan} strokeWidth={6} strokeLinejoin="round" />
        </g>
      ) : null}
    </svg>
  );
};
