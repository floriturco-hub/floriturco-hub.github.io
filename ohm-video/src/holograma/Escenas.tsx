import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/holograma/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  holograma: 2.36, // holograma
  fondo: 4.00, // fondo
  mueve: 4.80, // mueve
  pero: 6.04, // pero
  final: 7.64, // final
  superficie: 10.42, // superficie
  surcos: 12.06, // surcos
  microscopicos: 12.38, // microscopicos
  longitud: 14.16, // longitud
  cuando: 15.80, // cuando
  desvia: 17.48, // desvia
  colores: 18.26, // colores
  cd: 20.34, // cd
  cambian: 21.48, // cambian
  orientacion: 22.02, // orientacion
  angulo: 24.72, // angulo
  ojo: 27.08, // ojo
  cerebro: 29.20, // cerebro
  profundidad: 30.28, // profundidad
  copiarlos: 31.24, // copiarlos
  maquinas: 32.30, // maquinas
  fotocopia: 33.98, // fotocopia
  porEso: 35.32, // por
  fin: 37.18, // FIN
};

const ARCO = [C.red, C.orange, C.yellow, "#3AC86A", C.cyan, "#3A6EE8", C.purpleLight];

// Cubo en perspectiva (para la imagen 3D); dx = paralaje
const Cubo: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly dx: number; readonly col?: string }> = ({ x, y, s, dx, col = C.white }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M -60 -20 L 60 -20 L 60 100 L -60 100 Z`} fill="none" stroke={col} strokeWidth={6} />
    <path d={`M ${-60 + dx} -80 L ${60 + dx} -80 L ${60 + dx} 40 L ${-60 + dx} 40 Z`} fill="none" stroke={col} strokeWidth={6} opacity={0.8} />
    {[
      [-60, -20],
      [60, -20],
      [60, 100],
      [-60, 100],
    ].map(([px, py], k) => (
      <line key={k} x1={px} y1={py} x2={px + dx} y2={py - 60} stroke={col} strokeWidth={5} opacity={0.8} />
    ))}
  </g>
);

// Tarjeta con parche holográfico; tilt -1..1
const Tarjeta: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly tilt: number; readonly copia?: number }> = ({ x, y, s, tilt, copia = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s * (1 - Math.abs(tilt) * 0.25)} ${s})`}>
    <rect x={-300} y={-190} width={600} height={380} rx={30} fill="#2A3A6A" />
    <rect x={-240} y={-120} width={90} height={70} rx={10} fill="#C8A048" />
    <Texto x={-150} y={150} size={34} color={C.white}>
      **** 4821
    </Texto>
    <g transform="translate(150 -10)">
      <defs>
        <linearGradient id="holo" x1={tilt * 0.6} y1={0} x2={1 + tilt * 0.6} y2={1} spreadMethod="reflect">
          {ARCO.map((c, k) => (
            <stop key={k} offset={`${k / 6}`} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <rect x={-110} y={-110} width={220} height={220} rx={20} fill={copia > 0.5 ? "#8C88A8" : "url(#holo)"} />
      <g opacity={1 - copia}>
        <Cubo x={-10 * tilt} y={-10} s={0.8} dx={40 * tilt + 20} col="#141030" />
      </g>
    </g>
  </g>
);

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Tarjeta x={540} y={940} s={1.4} tilt={Math.sin(t * 2) * 0.6} />
    <Texto x={540} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo hay profundidad en algo plano?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.holograma], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.purpleLight} />
    </>
  );
};

// B. Parece tener fondo y se mueve al inclinarlo, pero es plástico liso + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const liso = aparece(t, T.pero);
  return (
    <Lienzo zoom={interpolate(t, [T.holograma, T.superficie], [1, 1.04])}>
      <g opacity={1 - liso * 0.8}>
        <Tarjeta x={540} y={860} s={1.2} tilt={t > T.mueve ? Math.sin((t - T.mueve) * 3) * 0.8 : 0} />
      </g>
      <g opacity={liso}>
        <rect x={140} y={1140} width={800} height={24} rx={6} fill="#8C88A8" />
        <Texto x={540} y={1230} size={40} color={C.white}>
          de canto: plástico liso
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.superficie], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          por qué es difícil falsificarlo
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Millones de surcos microscópicos del tamaño de la longitud de onda de la luz
export const Surcos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const d = new Array(161)
    .fill(0)
    .map((_, i) => `${i ? "L" : "M"} ${100 + i * 5.5} ${960 - Math.abs(Math.sin(i * 0.25)) * 80}`)
    .join(" ");
  return (
    <Lienzo zoom={interpolate(t, [T.superficie, T.cuando], [1, 1.04])}>
      <circle cx={540} cy={920} r={420} fill="#141030" stroke={C.white} strokeWidth={8} opacity={aparece(t, T.superficie)} />
      <g opacity={aparece(t, T.surcos)}>
        <path d={`${d} L 980 1100 L 100 1100 Z`} fill="#8C88A8" />
      </g>
      <g opacity={aparece(t, T.longitud)}>
        <path d={new Array(81).fill(0).map((_, i) => `${i ? "L" : "M"} ${220 + i * 8} ${740 + Math.sin(i * 0.5 - t * 6) * 40}`).join(" ")} stroke={C.cyan} strokeWidth={6} fill="none" />
        <Texto x={540} y={660} size={32} color={C.cyan}>
          onda de luz
        </Texto>
      </g>
      <Texto x={540} y={1430} size={38} color={C.white} op={aparece(t, T.microscopicos)}>
        surcos microscópicos
      </Texto>
    </Lienzo>
  );
};

// D. La luz rebota en ellos, se desvía y los colores se separan, como en un CD
export const Difraccion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sep = aparece(t, T.colores);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cuando, T.cambian], [1, 1.04])}>
        <path d={new Array(121).fill(0).map((_, i) => `${i ? "L" : "M"} ${120 + i * 7} ${1100 - Math.abs(Math.sin(i * 0.4)) * 30}`).join(" ")} stroke="#8C88A8" strokeWidth={8} fill="none" />
        <line x1={200} y1={560} x2={540} y2={1080} stroke={C.white} strokeWidth={14} opacity={aparece(t, T.cuando)} />
        {ARCO.map((c, k) => {
          const a = (-60 + k * 10 * sep) * (Math.PI / 180);
          return <line key={k} x1={540} y1={1080} x2={540 + Math.cos(a) * 520} y2={1080 + Math.sin(a) * 520} stroke={c} strokeWidth={10} opacity={aparece(t, T.desvia)} />;
        })}
        <g opacity={aparece(t, T.cd)} transform="translate(200 1350)">
          <circle cx={0} cy={0} r={90} fill="url(#cdg)" />
          <defs>
            <linearGradient id="cdg" x1={0} y1={0} x2={1} y2={1}>
              {ARCO.map((c, k) => (
                <stop key={k} offset={`${k / 6}`} stopColor={c} />
              ))}
            </linearGradient>
          </defs>
          <circle cx={0} cy={0} r={20} fill="#141030" />
          <Texto x={250} y={14} size={36} color={C.white}>
            como un CD
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.colores} color={C.white} />
    </>
  );
};

// E. Los surcos cambian por zonas: cada ángulo recibe una imagen distinta
export const Zonas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ojoX = interpolate(t, [T.angulo, T.ojo], [260, 820], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.cambian, T.ojo], [1, 1.04])}>
      {new Array(4).fill(0).map((_, r) =>
        new Array(4).fill(0).map((__, c) => {
          const rot = (r * 4 + c) * 23;
          const esp = 14 + ((r + c) % 3) * 6;
          return (
            <g key={`${r}${c}`} opacity={aparece(t, T.cambian)}>
              <rect x={240 + c * 150} y={560 + r * 150} width={140} height={140} fill="#2A2640" />
              <clipPath id={`z${r}${c}`}>
                <rect x={240 + c * 150} y={560 + r * 150} width={140} height={140} />
              </clipPath>
              <g clipPath={`url(#z${r}${c})`}>
                {new Array(14).fill(0).map((___, k) => (
                  <line
                    key={k}
                    x1={240 + c * 150 - 100 + k * esp}
                    y1={560 + r * 150 - 50}
                    x2={240 + c * 150 - 100 + k * esp}
                    y2={560 + r * 150 + 190}
                    stroke={ARCO[(r + c + k) % 7]}
                    strokeWidth={4}
                    transform={`rotate(${rot} ${310 + c * 150} ${630 + r * 150})`}
                    opacity={aparece(t, T.orientacion)}
                  />
                ))}
              </g>
            </g>
          );
        }),
      )}
      <g opacity={aparece(t, T.angulo)} transform={`translate(${ojoX} 1300)`}>
        <path d="M -50 0 Q 0 -35 50 0 Q 0 35 -50 0 Z" fill={C.white} />
        <circle cx={0} cy={0} r={16} fill="#3A7AB8" />
      </g>
      <Texto x={540} y={1430} size={36} color={C.white} op={aparece(t, T.angulo)}>
        cada ángulo, otra imagen
      </Texto>
    </Lienzo>
  );
};

// F. Cada ojo ve una imagen distinta y tu cerebro las une en profundidad
export const Ojos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const une = aparece(t, T.profundidad);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.ojo, T.copiarlos], [1, 1.04])}>
        <g opacity={1 - une}>
          <Cubo x={330} y={760} s={1.3} dx={-30} col={C.cyan} />
          <Cubo x={750} y={760} s={1.3} dx={50} col={C.red} />
          <Texto x={330} y={980} size={32} color={C.cyan}>
            ojo izquierdo
          </Texto>
          <Texto x={750} y={980} size={32} color={C.red}>
            ojo derecho
          </Texto>
        </g>
        <g opacity={une}>
          <Cubo x={540} y={780} s={2.2} dx={20 + Math.sin(t * 2) * 15} col={C.yellow} />
        </g>
        <g opacity={aparece(t, T.cerebro)} transform="translate(540 1230)">
          <ellipse cx={0} cy={0} rx={130} ry={90} fill="#E89AB8" />
          {[0, 1, 2].map((k) => (
            <path key={k} d={`M ${-70 + k * 60} -60 q 20 30 0 60 q -20 30 0 60`} stroke="#C86A8A" strokeWidth={6} fill="none" />
          ))}
        </g>
        <Texto x={540} y={1400} size={38} color={C.yellow} op={une}>
          profundidad
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.profundidad} color={C.yellow} />
    </>
  );
};

// G. Copiarlos exige máquinas nanométricas: una fotocopia los pierde
export const Copia: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.copiarlos, T.porEso], [1, 1.04])}>
      <Tarjeta x={540} y={720} s={0.8} tilt={Math.sin(t * 2) * 0.5} />
      <Texto x={540} y={940} size={34} color={C.white} op={aparece(t, T.maquinas)}>
        original: máquinas nanométricas
      </Texto>
      <g opacity={aparece(t, T.fotocopia)}>
        <Tarjeta x={540} y={1180} s={0.8} tilt={Math.sin(t * 2) * 0.5} copia={1} />
        <Texto x={540} y={1400} size={36} color={C.red}>
          fotocopia: sin holograma
        </Texto>
      </g>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
