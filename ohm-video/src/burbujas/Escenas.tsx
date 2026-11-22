import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/burbujas/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  soplas: 1.96, // soplas
  aro: 3.12, // aro
  estrella: 4.10, // estrella
  redondas: 5.72, // redondas
  final: 6.72, // final
  cuadrada: 7.98, // cuadrada
  pelicula: 10.00, // pel
  jabon: 11.90, // jab
  tension: 13.54, // tens
  encogerse: 17.72, // encog
  aire: 18.88, // aire
  volumen: 20.12, // volumen
  menor: 23.44, // menor
  esfera: 26.38, // esfera
  aro2: 27.30, // aro
  soltarse: 29.78, // soltarse
  cubo: 32.16, // cubo
  alambre: 32.52, // alambre
  cuadrada2: 35.88, // cuadrada
  porEso: 36.62, // por
  fin: 38.26, // FIN
};

const IRIS = ["#F070C0", "#70C0F0", "#C0F070", "#F0C070"];

const Burbuja: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly t: number; readonly sx?: number; readonly sy?: number }> = ({ x, y, r, t, sx = 1, sy = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${sx} ${sy})`}>
    <circle cx={0} cy={0} r={r} fill="#DDF4FF" opacity={0.12} />
    {IRIS.map((c, k) => (
      <circle key={k} cx={0} cy={0} r={r - k * 3} fill="none" stroke={c} strokeWidth={3} opacity={0.35 + 0.25 * Math.sin(t * 2 + k)} />
    ))}
    <ellipse cx={-r * 0.4} cy={-r * 0.45} rx={r * 0.18} ry={r * 0.1} fill="#FFFFFF" opacity={0.7} transform={`rotate(-30 ${-r * 0.4} ${-r * 0.45})`} />
  </g>
);

const Estrella: React.FC<{ readonly x: number; readonly y: number; readonly r: number }> = ({ x, y, r }) => (
  <polygon
    points={new Array(10)
      .fill(0)
      .map((_, k) => {
        const a = (Math.PI / 5) * k - Math.PI / 2;
        const rr = k % 2 ? r * 0.45 : r;
        return `${x + rr * Math.cos(a)},${y + rr * Math.sin(a)}`;
      })
      .join(" ")}
    fill="none"
    stroke="#E8C040"
    strokeWidth={10}
    strokeLinejoin="round"
  />
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Burbuja x={540} y={1000 + 20 * Math.sin(t)} r={260} t={t} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta burbuja es redonda?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.soplas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Aro cuadrado o de estrella, y aun así salen redondas + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sube = (k: number) => ((t - T.redondas) * 0.25 + k * 0.3) % 1;
  return (
    <Lienzo zoom={interpolate(t, [T.soplas, T.pelicula], [1, 1.04])}>
      <rect x={180} y={1160} width={200} height={200} fill="none" stroke="#E8C040" strokeWidth={10} opacity={aparece(t, T.aro)} />
      <line x1={280} y1={1360} x2={280} y2={1520} stroke="#E8C040" strokeWidth={10} opacity={aparece(t, T.aro)} />
      <g opacity={aparece(t, T.estrella)}>
        <Estrella x={800} y={1260} r={120} />
        <line x1={800} y1={1380} x2={800} y2={1520} stroke="#E8C040" strokeWidth={10} />
      </g>
      {t > T.redondas
        ? [0, 1, 2].map((k) => (
            <g key={k}>
              <Burbuja x={280 + 40 * Math.sin(t + k)} y={1100 - 500 * sube(k)} r={70 + k * 10} t={t} />
              <Burbuja x={800 + 40 * Math.sin(t + k + 1)} y={1100 - 500 * sube(k + 0.5)} r={60 + k * 12} t={t} />
            </g>
          ))
        : null}
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          una burbuja cuadrada: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.pelicula], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Película delgadísima de agua con jabón; tensión superficial: una piel que intenta encogerse
export const Pelicula: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const enc = aparece(t, T.encogerse);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pelicula, T.aire], [1, 1.04])}>
        <Burbuja x={540} y={1000} r={300} t={t} />
        <g transform="translate(540 700)">
          <rect x={-200} y={-50} width={400} height={100} rx={20} fill="#1A1A2A" stroke="#DDF4FF" strokeWidth={4} />
          {new Array(8).fill(0).map((_, k) => (
            <circle key={k} cx={-160 + k * 46} cy={0} r={k % 3 === 1 ? 18 : 12} fill={k % 3 === 1 ? "#F0C070" : "#3A8AD8"} />
          ))}
        </g>
        <Texto x={540} y={600} size={34} color={C.white} op={aparece(t, T.jabon)}>
          agua con jabón, delgadísima
        </Texto>
        {enc > 0
          ? [0, 60, 120, 180, 240, 300].map((a) => {
              const r = (a * Math.PI) / 180;
              const p = 0.5 + 0.5 * Math.sin(t * 4);
              return <line key={a} x1={540 + Math.cos(r) * 340} y1={1000 + Math.sin(r) * 340} x2={540 + Math.cos(r) * (300 - 20 * p)} y2={1000 + Math.sin(r) * (300 - 20 * p)} stroke={C.yellow} strokeWidth={6} opacity={enc} />;
            })
          : null}
        <Texto x={540} y={1420} size={38} color={C.yellow} op={aparece(t, T.tension)}>
          tensión superficial: quiere encogerse
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.tension} color={C.yellow} />
    </>
  );
};

// D. El aire de adentro ocupa un volumen fijo: la menor superficie para ese volumen es la esfera
export const Esfera: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const e = interpolate(t, [T.menor, T.esfera + 0.4], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.aire, T.aro2], [1, 1.04])}>
        <g opacity={1 - e}>
          <rect x={360} y={820} width={360} height={360} rx={30} fill="#DDF4FF" opacity={0.15} stroke="#70C0F0" strokeWidth={6} />
          <Texto x={540} y={1240} size={30} color={C.white}>
            más superficie
          </Texto>
        </g>
        <g opacity={e}>
          <Burbuja x={540} y={1000} r={203} t={t} />
          <Texto x={540} y={1260} size={34} color={C.yellow}>
            esfera: la menor superficie
          </Texto>
        </g>
        <Texto x={540} y={620} size={36} color={C.white} op={aparece(t, T.volumen)}>
          el aire de adentro: volumen fijo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.esfera} color="#70C0F0" />
    </>
  );
};

// E. El aro solo le da forma mientras está pegada; al soltarse se redondea. Cubo de alambre: burbuja cuadrada
export const Cubo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sol = interpolate(t, [T.soltarse, T.soltarse + 0.6], [0, 1], clamp);
  const cubo = aparece(t, T.cubo);
  const d = 160;
  const o = 70;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.aro2, T.porEso], [1, 1.04])}>
        <g opacity={1 - cubo}>
          <Estrella x={540} y={1150} r={150} />
          <Burbuja x={540} y={1150 - 300 * sol} r={120} t={t} sx={1 + 0.3 * (1 - sol)} sy={1 - 0.2 * (1 - sol)} />
          <Texto x={540} y={1420} size={34} color={C.white} op={aparece(t, T.soltarse)}>
            al soltarse, se redondea
          </Texto>
        </g>
        <g opacity={cubo} transform="translate(540 1000)">
          {[
            [-d, -d, d, -d],
            [d, -d, d, d],
            [d, d, -d, d],
            [-d, d, -d, -d],
          ].map(([a, b, c, e], k) => (
            <g key={k}>
              <line x1={a} y1={b} x2={c} y2={e} stroke="#C0C4D0" strokeWidth={6} />
              <line x1={a + o} y1={b - o} x2={c + o} y2={e - o} stroke="#C0C4D0" strokeWidth={6} opacity={0.6} />
              <line x1={a} y1={b} x2={a + o} y2={b - o} stroke="#C0C4D0" strokeWidth={6} opacity={0.6} />
            </g>
          ))}
          {[
            [-d, -d],
            [d, -d],
            [d, d],
            [-d, d],
          ].map(([a, b], k) => (
            <line key={k} x1={a + o * 0.5} y1={b - o * 0.5} x2={(a + o * 0.5) * 0.35} y2={(b - o * 0.5) * 0.35} stroke="#70C0F0" strokeWidth={3} opacity={0.7} />
          ))}
          <rect x={-55 + o * 0.5 * 0.35} y={-55 - o * 0.5 * 0.35} width={110} height={110} fill="#DDF4FF" opacity={0.25 * aparece(t, T.cuadrada2) + 0.05} stroke="#F070C0" strokeWidth={5} />
        </g>
        <Texto x={540} y={620} size={36} color={C.white} op={aparece(t, T.alambre)}>
          un cubo de alambre en jabón
        </Texto>
        <Texto x={540} y={1420} size={40} color={C.yellow} op={aparece(t, T.cuadrada2)}>
          ¡una burbuja cuadrada!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.cuadrada2} color="#F070C0" />
    </>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
