import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Ambulancia, Espejo, Hoja, Persona, Planta } from "./Piezas";

// Instantes clave (s) de public/audio/espejo/narracion.wav (voz x1,1), sacados con Whisper
export const T = {
  adelante: 2.6,
  levanta: 5.2,
  enEspejo: 6.64,
  mismo: 8.96,
  cabeza: 10.84,
  pies: 12.26,
  invierte: 13.7,
  nariz: 16.0,
  reflejo: 17.94,
  entonces: 20.0,
  porque: 22.4,
  vuelta: 25.12,
  girar: 26.98,
  suDerecha: 27.74,
  giro: 29.5,
  prueba: 32.64,
  escribe: 33.56,
  lee: 37.28,
  papel: 39.12,
  girarlo: 40.08,
  invierteLetras: 41.62,
  ambulancias: 43.62,
  reves: 45.38,
  conductor: 45.9,
  retrovisor: 48.04,
  final: 49.36,
  lados: 49.86,
  miras: 51.24,
  fin: 52.95,
};

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };
const aparece = (t: number, d: number) => interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);

const Lienzo: React.FC<{ readonly children: React.ReactNode; readonly zoom?: number; readonly cy?: number }> = ({ children, zoom = 1, cy = 960 }) => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    <g transform={`translate(${540 - 540 * zoom} ${cy - cy * zoom}) scale(${zoom})`}>{children}</g>
  </svg>
);

const Marca: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly op: number; readonly color?: string }> = ({ x, y, texto, op, color = C.yellow }) => (
  <g opacity={op}>
    <rect x={x - texto.length * 11 - 18} y={y - 30} width={texto.length * 22 + 36} height={46} rx={23} fill={C.card} stroke={color} strokeWidth={3} />
    <text x={x} y={y + 1} textAnchor="middle" fill={color} fontFamily={mono} fontSize={30} fontWeight={700}>
      {texto}
    </text>
  </g>
);

// Plano por encima del hombro: tú de espaldas, tu reflejo de frente
const EncimaHombro: React.FC<{ readonly t: number; readonly levanta: number; readonly marcas: number; readonly arriba?: number }> = ({ t, levanta, marcas, arriba = 0 }) => {
  const res = Math.sin(t * 2) * 3;
  return (
    <g>
      <Espejo x={190} y={200} w={760} h={1000} id="hombro" brillo={0.55}>
        <Persona x={505} y={560 + res * 0.4} s={0.62} vista="frente" ladoReloj={1} levanta={levanta} />
      </Espejo>
      <Persona x={360} y={1260 + res} s={1.15} vista="espalda" ladoReloj={1} levanta={levanta} />
      <Marca x={700} y={330} texto="derecha" op={marcas} />
      <Marca x={720} y={860} texto="derecha" op={marcas} />
      {arriba > 0 ? (
        <g opacity={arriba}>
          <Marca x={330} y={420} texto="arriba" op={1} color={C.cyan} />
          <Marca x={330} y={960} texto="abajo" op={1} color={C.cyan} />
          <line x1={420} y1={420} x2={470} y2={440} stroke={C.cyan} strokeWidth={4} strokeDasharray="8 8" />
          <line x1={410} y1={960} x2={470} y2={955} stroke={C.cyan} strokeWidth={4} strokeDasharray="8 8" />
        </g>
      ) : null}
    </g>
  );
};

// A. Gancho
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const levanta = interpolate(t, [0.15, 0.6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const flash = interpolate(t, [T.adelante, T.adelante + 0.08, T.adelante + 0.45], [0, 0.3, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.levanta], [1, 1.06])} cy={700}>
        <EncimaHombro t={t} levanta={levanta} marcas={aparece(t, 0.7)} />
      </Lienzo>
      <div style={{ position: "absolute", inset: 0, background: C.white, opacity: flash }} />
    </>
  );
};

// B. Levanta la mano derecha: el reflejo levanta la del mismo lado
export const MismoLado: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const levanta = interpolate(t, [T.levanta + 0.3, T.levanta + 0.9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <Lienzo zoom={interpolate(t, [T.levanta, T.invierte], [1, 1.05])} cy={700}>
      <EncimaHombro t={t} levanta={levanta} marcas={aparece(t, T.mismo)} arriba={aparece(t, T.cabeza)} />
    </Lienzo>
  );
};

// Vista cenital: espejo, tú y tu reflejo
const Cenital: React.FC<{ readonly t: number; readonly reflejoOp?: number; readonly flechas?: [number, number]; readonly ladoMismo?: number; readonly children?: React.ReactNode }> = ({
  t,
  reflejoOp = 1,
  flechas = [0, 0],
  ladoMismo = 0,
  children,
}) => (
  <g>
    <rect x={120} y={300} width={840} height={660} rx={20} fill="#3A4A7A" opacity={0.14} />
    <text x={150} y={350} fill={C.grey} fontFamily={mono} fontSize={30}>dentro del espejo</text>
    <line x1={120} y1={960} x2={960} y2={960} stroke="#A8C8F0" strokeWidth={14} strokeLinecap="round" />
    {new Array(14).fill(0).map((_, k) => (
      <line key={k} x1={140 + k * 60} y1={968} x2={120 + k * 60} y2={992} stroke="#5A6A9A" strokeWidth={4} />
    ))}
    <text x={950} y={1040} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={30}>espejo</text>
    <Planta x={540} y={630 + Math.sin(t * 2) * 3} s={1.2} espejado op={reflejoOp} flecha={flechas[1]} />
    <Planta x={540} y={1290 + Math.sin(t * 2) * 3} s={1.2} flecha={flechas[0]} />
    <text x={540} y={1430} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>tú</text>
    <text x={540} y={480} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700} opacity={reflejoOp}>reflejo</text>
    {ladoMismo > 0 ? <line x1={694} y1={660} x2={694} y2={1260} stroke={C.yellow} strokeWidth={5} strokeDasharray="14 12" opacity={ladoMismo} /> : null}
    {children}
  </g>
);

// C. Lo que se invierte es la profundidad
export const Profundidad: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.invierte, T.entonces], [1, 1.04])}>
      <Cenital t={t} flechas={[aparece(t, T.nariz), aparece(t, T.reflejo)]} ladoMismo={aparece(t, T.invierte + 0.6)} />
    </Lienzo>
  );
};

// D. La media vuelta la imaginas tú
export const MediaVuelta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const camina = interpolate(t, [T.porque + 0.3, T.vuelta - 0.1], [0, 1], suave);
  const gira = interpolate(t, [T.vuelta, T.vuelta + 1.0], [0, 180], suave);
  const fantasma = interpolate(t, [T.porque, T.porque + 0.4, T.giro + 1.2, T.giro + 1.8], [0, 0.9, 0.9, 0], clamp);
  const cruce = aparece(t, T.suDerecha);
  const reflejoOp = interpolate(t, [T.porque, T.porque + 0.4, T.giro + 1.2, T.giro + 1.8], [1, 0.3, 0.3, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.entonces, T.prueba], [1, 1.04])}>
      <Cenital t={t} reflejoOp={reflejoOp}>
        <Planta x={540} y={interpolate(camina, [0, 1], [1290, 630])} s={1.2} rot={gira} color={C.orange} op={fantasma} />
        {cruce > 0 ? (
          <g opacity={cruce * (fantasma > 0.05 ? 1 : 0)}>
            <line x1={386} y1={660} x2={386} y2={1260} stroke={C.red} strokeWidth={5} strokeDasharray="14 12" />
            <text x={360} y={800} textAnchor="end" fill={C.red} fontFamily={mono} fontSize={30} fontWeight={700}>
              su derecha
            </text>
            <text x={360} y={1180} textAnchor="end" fill={C.red} fontFamily={mono} fontSize={30} fontWeight={700}>
              tu izquierda
            </text>
          </g>
        ) : null}
      </Cenital>
    </Lienzo>
  );
};

// E. La prueba: plástico transparente frente a papel girado
export const Prueba: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const giro = interpolate(t, [T.girarlo, T.girarlo + 0.7], [0, 1], suave);
  const check = interpolate(t, [T.lee + 0.4, T.lee + 0.9], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.prueba, T.ambulancias], [1, 1.04])}>
      <text x={540} y={290} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={80} fontWeight={700} opacity={aparece(t, T.prueba)}>
        Prueba esto
      </text>
      {/* Fila 1: plástico transparente */}
      <g opacity={aparece(t, T.escribe)}>
        <Hoja x={280} y={640} texto="ESPEJO" transparente />
        <text x={280} y={800} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={30}>plástico</text>
      </g>
      <g opacity={aparece(t, T.escribe + 0.6)}>
        <Espejo x={600} y={500} w={380} h={280} id="fila1">
          <g opacity={aparece(t, T.lee)}>
            <Hoja x={790} y={640} w={300} h={170} texto="ESPEJO" transparente />
          </g>
        </Espejo>
        <text x={790} y={840} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={30}>en el espejo</text>
        <path d="M 930 420 L 955 448 L 1000 392" stroke={C.cyan} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={110} strokeDashoffset={110 * (1 - check)} />
      </g>
      {/* Fila 2: papel que hay que girar */}
      <g opacity={aparece(t, T.papel)}>
        <Hoja x={280} y={1180} texto="ESPEJO" giro={giro} />
        <text x={280} y={1340} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={30}>{giro > 0.5 ? "papel girado" : "papel"}</text>
        <Espejo x={600} y={1040} w={380} h={280} id="fila2">
          <g opacity={interpolate(t, [T.girarlo + 0.6, T.girarlo + 0.9], [0, 1], clamp)}>
            <Hoja x={790} y={1180} w={300} h={170} texto="ESPEJO" invertido />
          </g>
        </Espejo>
        <text x={790} y={1380} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={30}>en el espejo</text>
      </g>
    </Lienzo>
  );
};

// F. Ambulancia: rótulo al revés para leerse en el retrovisor
export const Retrovisor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const espejo = aparece(t, T.conductor);
  return (
    <Lienzo zoom={interpolate(t, [T.ambulancias, T.final], [1, 1.05])}>
      <g opacity={espejo}>
        <rect x={525} y={150} width={30} height={170} rx={10} fill="#2E2A40" />
        <Espejo x={240} y={320} w={600} h={250} id="retro">
          <Ambulancia x={540} y={462} s={0.42} t={t} reves={false} />
        </Espejo>
        <text x={540} y={650} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={30}>tu retrovisor</text>
      </g>
      <Ambulancia x={540} y={1210} s={1.25} t={t} />
    </Lienzo>
  );
};

// G. Cierre: el espejo cambia hacia dónde miras
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.final, T.fin + 0.5], [1, 1.06])}>
      <Cenital t={t} flechas={[aparece(t, T.miras - 0.2), aparece(t, T.miras)]} ladoMismo={aparece(t, T.lados)} />
    </Lienzo>
  );
};
