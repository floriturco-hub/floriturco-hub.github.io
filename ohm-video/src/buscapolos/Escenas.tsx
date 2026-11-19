import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/buscapolos/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  tocas: 2.14, // tocas
  enciende: 4.28, // enciende
  conectado: 6.88, // conectado
  final: 8.10, // final
  mango: 10.90, // mango
  neon: 12.24, // neon
  resistencia: 12.86, // resistencia
  millones: 14.54, // millones
  fase: 16.46, // fase
  dedo: 17.36, // dedo
  circuito: 18.58, // circuito
  punta: 20.56, // punta
  cuerpo: 23.28, // cuerpo
  suelo: 24.04, // suelo
  neon2: 24.82, // neon
  voltaje: 27.62, // voltaje
  neutro: 28.82, // neutro
  resistencia2: 32.10, // resistencia
  diminuta: 34.20, // diminuta
  sientes: 35.26, // sientes
  asi: 36.06, // asi
  fin: 37.80, // FIN
};

const NEON = "#FF6A3A";

// Destornillador busca-polos vertical (punta abajo en x,y); luz 0..1; corte muestra el interior
const Busca: React.FC<{ readonly x: number; readonly y: number; readonly luz: number; readonly s?: number; readonly corte?: number; readonly flujo?: number; readonly t?: number }> = ({
  x,
  y,
  luz,
  s = 1,
  corte = 0,
  flujo = 0,
  t = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-8} y={-200} width={16} height={200} fill="#C8C8D4" />
    <path d="M -8 0 L 8 0 L 4 16 L -4 16 Z" fill="#C8C8D4" />
    <rect x={-40} y={-620} width={80} height={430} rx={30} fill={C.red} opacity={1 - corte * 0.75} />
    <rect x={-30} y={-640} width={60} height={30} rx={8} fill="#C8C8D4" />
    <g opacity={corte}>
      <rect x={-14} y={-330} width={28} height={110} rx={6} fill="#C8A060" />
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={-14} y={-320 + k * 26} width={28} height={8} fill={["#8A4A2A", "#111", "#E04A3A", "#C8A040"][k]} />
      ))}
      <path d="M 0 -440 l 12 10 l -24 10 l 24 10 l -24 10 l 24 10 l -12 10" stroke="#C8C8D4" strokeWidth={4} fill="none" />
      <line x1={0} y1={-330} x2={0} y2={-380} stroke="#C8C8D4" strokeWidth={4} />
    </g>
    <ellipse cx={0} cy={-415} rx={22} ry={38} fill={luz > 0 ? NEON : "#5A3A3A"} opacity={0.4 + 0.6 * luz} />
    {luz > 0 ? <ellipse cx={0} cy={-415} rx={50} ry={70} fill={NEON} opacity={0.25 * luz} /> : null}
    {flujo > 0 ? (
      <g opacity={flujo}>
        {new Array(6).fill(0).map((_, k) => {
          const u = (t * 0.6 + k / 6) % 1;
          return <circle key={k} cx={0} cy={10 - u * 650} r={7} fill={C.yellow} />;
        })}
      </g>
    ) : null}
  </g>
);

const Cable: React.FC<{ readonly x: number; readonly y: number; readonly col: string; readonly w?: number }> = ({ x, y, col, w = 400 }) => (
  <g>
    <rect x={x - w / 2} y={y} width={w} height={50} rx={25} fill={col} />
    <rect x={x - 30} y={y} width={60} height={50} fill="#E08A4A" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Cable x={540} y={1300} col="#3A3A44" w={700} />
    <Busca x={540} y={1300} luz={0.8 + 0.2 * Math.sin(t * 12)} s={1.3} />
    <Texto x={840} y={700} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo sabe cuál cable da corriente?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.tocas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Tocas un cable y se enciende, aunque no hay nada conectado al destornillador + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const baja = interpolate(t, [T.tocas, T.enciende], [-120, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.tocas, T.mango], [1, 1.04])}>
      <Cable x={540} y={1300} col="#3A3A44" w={700} />
      <Busca x={540} y={1300 + baja} luz={t > T.enciende ? 1 : 0} s={1.3} />
      <Texto x={540} y={1460} size={38} color={C.white} op={aparece(t, T.conectado)}>
        sin ningún cable conectado
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿por qué no te electrocuta?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.mango], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. En el mango: bombillita de neón y resistencia de millones de ohmios
export const Mango: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.mango, T.fase], [1, 1.04])}>
      <Busca x={420} y={1450} luz={0} s={1.5} corte={aparece(t, T.mango)} />
      <g opacity={aparece(t, T.neon)}>
        <line x1={460} y1={827} x2={640} y2={827} stroke={NEON} strokeWidth={4} />
        <Texto x={780} y={840} size={38} color={NEON}>
          neón
        </Texto>
      </g>
      <g opacity={aparece(t, T.resistencia)}>
        <line x1={460} y1={1035} x2={640} y2={1035} stroke="#C8A060" strokeWidth={4} />
        <Texto x={800} y={1050} size={38} color="#C8A060">
          resistencia
        </Texto>
        <Texto x={800} y={1110} size={34} color={C.white} op={aparece(t, T.millones)}>
          ~1.000.000 Ω
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Tocas la fase con el dedo atrás: circuito por la punta, resistencia, neón, tu cuerpo y el suelo
export const Circuito: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fl = aparece(t, T.circuito);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.fase, T.neon2], [1, 1.04])}>
        <Cable x={300} y={1400} col="#8A3A2A" w={400} />
        <Texto x={300} y={1520} size={34} color={C.red} op={aparece(t, T.fase)}>
          fase
        </Texto>
        <Busca x={300} y={1400} luz={fl} s={1.2} corte={0.7} flujo={fl} t={t} />
        <g opacity={aparece(t, T.dedo)}>
          <path d="M 300 620 Q 300 560 360 560 L 700 560 Q 760 560 760 620 L 760 700" stroke="#C89A7A" strokeWidth={60} fill="none" strokeLinecap="round" />
          <Texto x={560} y={520} size={32} color="#C89A7A">
            tu dedo
          </Texto>
        </g>
        <g opacity={aparece(t, T.cuerpo)}>
          <circle cx={800} cy={780} r={60} fill="#C89A7A" />
          <rect x={740} y={850} width={120} height={300} rx={40} fill="#4A6AC8" />
          <rect x={750} y={1150} width={40} height={250} fill="#2A2440" />
          <rect x={810} y={1150} width={40} height={250} fill="#2A2440" />
          {new Array(6).fill(0).map((_, k) => {
            const u = (t * 0.6 + k / 6) % 1;
            return <circle key={k} cx={800} cy={700 + u * 720} r={6} fill={C.yellow} opacity={fl} />;
          })}
        </g>
        <g opacity={aparece(t, T.suelo)}>
          <rect x={600} y={1420} width={400} height={30} fill="#5A4A3A" />
          {[0, 1, 2].map((k) => (
            <line key={k} x1={700 + k * 30} y1={1470 + k * 20} x2={900 - k * 30} y2={1470 + k * 20} stroke="#8A7A6A" strokeWidth={6} />
          ))}
          <Texto x={800} y={1560} size={32} color="#8A7A6A">
            suelo
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.circuito} color={NEON} />
    </>
  );
};

// E. El neón enciende con poquísima corriente si hay voltaje; el neutro casi no tiene voltaje
export const Neutro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.neon2, T.resistencia2], [1, 1.04])}>
      <Cable x={300} y={1350} col="#8A3A2A" w={380} />
      <Busca x={300} y={1350} luz={1} s={1.1} />
      <Texto x={300} y={1470} size={36} color={C.red}>
        fase: con voltaje
      </Texto>
      <g opacity={aparece(t, T.neutro)}>
        <Cable x={780} y={1350} col="#3A5AC8" w={380} />
        <Busca x={780} y={1350} luz={0} s={1.1} />
        <Texto x={780} y={1470} size={36} color="#6A8AE8">
          neutro: casi 0 V
        </Texto>
      </g>
      <Texto x={540} y={560} size={40} color={C.white} op={aparece(t, T.voltaje)}>
        el neón necesita voltaje
      </Texto>
    </Lienzo>
  );
};

// F. La resistencia deja pasar una corriente tan diminuta que ni la sientes
export const Seguro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.resistencia2, T.asi], [1, 1.04])}>
        <rect x={340} y={700} width={400} height={160} rx={30} fill="#C8A060" />
        {[0, 1, 2, 3].map((k) => (
          <rect key={k} x={400 + k * 80} y={700} width={30} height={160} fill={["#8A4A2A", "#111", "#E04A3A", "#C8A040"][k]} />
        ))}
        <line x1={120} y1={780} x2={340} y2={780} stroke="#C8C8D4" strokeWidth={10} />
        <line x1={740} y1={780} x2={960} y2={780} stroke="#C8C8D4" strokeWidth={10} />
        {new Array(3).fill(0).map((_, k) => {
          const u = (t * 0.3 + k / 3) % 1;
          return <circle key={k} cx={120 + u * 840} cy={780} r={8} fill={C.yellow} opacity={aparece(t, T.diminuta)} />;
        })}
        <Texto x={540} y={1050} size={44} color={C.yellow} op={aparece(t, T.diminuta)}>
          menos de 1 miliamperio
        </Texto>
        <Texto x={540} y={1150} size={42} color="#5AD08A" op={aparece(t, T.sientes)}>
          ni la sientes ✓
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.diminuta} color={C.yellow} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
