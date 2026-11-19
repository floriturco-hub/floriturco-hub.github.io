import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/cloro/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  echas: 1.42, // echas
  desaparece: 2.74, // desaparece
  sigue: 4.42, // sigue
  final: 5.52, // final
  moleculas: 10.68, // moleculas
  enlaces: 11.50, // enlaces
  absorben: 12.24, // absorben
  hipoclorito: 15.14, // hipoclorito
  oxidante: 16.54, // oxidante
  rompe: 17.40, // rompe
  pegada: 19.78, // pegada
  transparente: 23.02, // transparente
  blanca: 24.94, // blanca
  problema: 25.84, // problema
  tintes: 26.72, // tintes
  decolora: 31.76, // decolora
  asi: 32.46, // asi
  fin: 35.14, // FIN
};

const MANCHA = "#8A5A2A";
const CLORO = "#C8F048";

// Camiseta con mancha (op) y color de tela
const Camiseta: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly mancha: number; readonly tela?: string; readonly hueco?: number }> = ({
  x,
  y,
  s,
  mancha,
  tela = "#F0F0F4",
  hueco = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -110 -260 Q 0 -200 110 -260 L 300 -170 L 230 -50 L 170 -90 L 170 260 L -170 260 L -170 -90 L -230 -50 L -300 -170 Z" fill={tela} />
    <path d="M -50 40 Q -10 -20 50 10 Q 110 40 70 100 Q 30 150 -30 120 Q -90 90 -50 40 Z" fill={MANCHA} opacity={mancha} />
    <ellipse cx={10} cy={80} rx={110} ry={90} fill="#F0F0F4" opacity={hueco} />
  </g>
);

// Molécula de color: cadena en zigzag con dobles enlaces (rotos 0-1)
const Molecula: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly roto: number; readonly color: string }> = ({ x, y, s, roto, color }) => {
  const pts = new Array(9).fill(0).map((_, i) => [i * 80, i % 2 ? -46 : 0]);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {pts.slice(1).map(([px, py], i) => {
        const [ax, ay] = pts[i];
        const doble = i % 2 === 0;
        return (
          <g key={i}>
            <line x1={ax} y1={ay} x2={px} y2={py} stroke={roto > 0.5 ? "#8C88A8" : color} strokeWidth={8} />
            {doble ? <line x1={ax} y1={ay + 20} x2={px} y2={py + 20} stroke={color} strokeWidth={8} opacity={1 - roto} /> : null}
          </g>
        );
      })}
      {pts.map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={14} fill={roto > 0.5 ? "#8C88A8" : color} />
      ))}
    </g>
  );
};

// Flechas de luz de colores
const Luz: React.FC<{ readonly x: number; readonly y: number; readonly op: number; readonly cols: string[] }> = ({ x, y, op, cols }) => (
  <g opacity={op}>
    {cols.map((c, k) => (
      <g key={k}>
        <line x1={x + k * 40} y1={y} x2={x + k * 40 + 120} y2={y + 160} stroke={c} strokeWidth={8} />
      </g>
    ))}
  </g>
);

const ARCOIRIS = [C.red, C.orange, C.yellow, "#3AC86A", "#3A6EE8"];

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <Camiseta x={540} y={980} s={1.3} mancha={1} />
    <Texto x={540} y={1440} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿a dónde se va la mancha?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.echas], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.yellow} />
    </>
  );
};

// B. Echas cloro y la mancha desaparece, pero sigue ahí + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const gota = interpolate(t, [T.echas, T.echas + 0.6], [0, 1], clamp);
  const fade = interpolate(t, [T.desaparece - 0.3, T.desaparece + 0.5], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.echas, T.moleculas], [1, 1.05])}>
      <Camiseta x={540} y={900} s={1.1} mancha={fade} />
      <circle cx={560} cy={480 + gota * 480} r={22} fill={CLORO} opacity={gota < 1 ? 1 : 0} />
      <g opacity={aparece(t, T.sigue)}>
        <circle cx={760} cy={720} r={130} fill="#141030" stroke={C.white} strokeWidth={10} />
        <line x1={850} y1={810} x2={940} y2={900} stroke={C.white} strokeWidth={18} />
        <Molecula x={680} y={730} s={0.45} roto={1} color={MANCHA} />
        <Texto x={760} y={900} size={30} color={C.white}>
          sigue ahí
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.moleculas], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          por qué destiñe la ropa de color
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Las moléculas de la mancha tienen enlaces que absorben ciertos colores
export const Color: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.moleculas, T.hipoclorito], [1, 1.04])}>
      <Molecula x={220} y={900} s={1} roto={0} color={MANCHA} />
      <g opacity={aparece(t, T.enlaces)}>
        <path d="M 260 960 L 260 1030" stroke={C.yellow} strokeWidth={5} />
        <Texto x={260} y={1080} size={34} color={C.yellow}>
          enlaces dobles
        </Texto>
      </g>
      <Luz x={180} y={560} op={aparece(t, T.absorben)} cols={ARCOIRIS} />
      <g opacity={aparece(t, T.absorben + 0.5)}>
        <line x1={640} y1={860} x2={800} y2={620} stroke={MANCHA} strokeWidth={10} />
        <line x1={680} y1={860} x2={840} y2={620} stroke={C.orange} strokeWidth={10} />
        <Texto x={540} y={1230} size={36} color={C.white}>
          absorbe unos colores, refleja otros
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. El cloro, hipoclorito de sodio, es un oxidante: rompe esos enlaces
export const Rompe: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const roto = interpolate(t, [T.rompe, T.rompe + 0.4], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.hipoclorito, T.pegada], [1, 1.04])}>
        <Molecula x={220} y={900} s={1} roto={roto} color={MANCHA} />
        {[0, 1, 2, 3].map((k) => {
          const u = interpolate(t, [T.oxidante, T.rompe], [0, 1], clamp);
          return (
            <g key={k} transform={`translate(${260 + k * 160} ${640 + u * 220})`} opacity={aparece(t, T.hipoclorito) * (1 - roto)}>
              <circle cx={0} cy={0} r={30} fill={CLORO} />
              <circle cx={40} cy={0} r={22} fill={C.red} />
              <Texto x={0} y={10} size={24} color="#141030">
                Cl
              </Texto>
              <Texto x={40} y={9} size={22} color={C.white}>
                O
              </Texto>
            </g>
          );
        })}
        <Texto x={540} y={520} size={40} color={CLORO} op={aparece(t, T.hipoclorito)}>
          hipoclorito de sodio
        </Texto>
        <Texto x={540} y={1230} size={40} color={C.yellow} op={aparece(t, T.rompe)}>
          rompe los enlaces
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.rompe} color={CLORO} />
    </>
  );
};

// E. La molécula sigue en la tela, pero ya no absorbe luz: transparente, la ves blanca
export const Transparente: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.pegada, T.problema], [1, 1.04])}>
      <rect x={100} y={1000} width={880} height={80} rx={10} fill="#F0F0F4" />
      {new Array(10).fill(0).map((_, k) => (
        <line key={k} x1={120 + k * 88} y1={1000} x2={160 + k * 88} y2={1080} stroke="#D8D8E0" strokeWidth={4} />
      ))}
      <Molecula x={220} y={960} s={1} roto={1} color={MANCHA} />
      <Luz x={300} y={600} op={aparece(t, T.transparente)} cols={ARCOIRIS} />
      <g opacity={aparece(t, T.transparente + 0.4)}>
        {ARCOIRIS.map((c, k) => (
          <line key={k} x1={560 + k * 30} y1={960} x2={700 + k * 30} y2={680} stroke={c} strokeWidth={8} />
        ))}
      </g>
      <Texto x={540} y={1200} size={38} color={C.white} op={aparece(t, T.pegada) * (1 - aparece(t, T.transparente))}>
        sigue pegada a la tela
      </Texto>
      <Texto x={540} y={1200} size={40} color={C.white} op={aparece(t, T.transparente)}>
        transparente: la ves blanca
      </Texto>
    </Lienzo>
  );
};

// F. Los tintes de tu ropa también se rompen: por eso decolora
export const Tintes: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const h = interpolate(t, [T.decolora - 0.6, T.decolora + 0.4], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.problema, T.asi], [1, 1.04])}>
        <Camiseta x={540} y={880} s={1.1} mancha={0} tela="#2A5AB8" hueco={h} />
        <Molecula x={260} y={1300} s={0.7} roto={h} color="#3A6EE8" />
        <Texto x={540} y={1450} size={38} color="#6A9AF8" op={aparece(t, T.tintes)}>
          los tintes también se rompen
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.decolora} color={CLORO} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} />
    </Lienzo>
  );
};
