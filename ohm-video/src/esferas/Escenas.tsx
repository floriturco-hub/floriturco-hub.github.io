import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/esferas/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  planetas: 2.44, // planetas
  esferas: 3.50, // esferas
  pero: 4.14, // pero
  asteroides: 4.54, // asteroides
  deformes: 6.16, // deformes
  final: 7.30, // final
  gravedad: 10.22, // gravedad
  centro: 12.22, // centro
  direcciones: 13.28, // direcciones
  enorme: 15.26, // enorme
  vence: 16.42, // vence
  dureza: 16.94, // dureza
  montanas: 18.24, // montanas
  hunden: 19.74, // hunden
  acomoda: 20.88, // acomoda
  compacta: 23.00, // compacta
  equilibrio: 24.30, // equilibrio
  pequeno: 26.90, // pequeno
  debil: 28.38, // debil
  aguanta: 29.30, // aguanta
  limite: 31.36, // limite
  cuatrocientos: 32.22, // cuatrocientos
  hielo: 34.24, // hielo
  roca: 35.68, // roca
  porEso: 36.28, // por
  fin: 38.12, // FIN
};

const ROCA = "#8A7A6A";

// Cuerpo con relieve: bulto 0 = esfera, 1 = papa
const Cuerpo: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly bulto: number; readonly col?: string; readonly rot?: number }> = ({
  x,
  y,
  r,
  bulto,
  col = ROCA,
  rot = 0,
}) => {
  const pts = new Array(64).fill(0).map((_, i) => {
    const a = (i / 64) * Math.PI * 2;
    const n = Math.sin(a * 2) * 0.28 + Math.sin(a * 3 + 1) * 0.14 + Math.sin(a * 7 + 2) * 0.06;
    const rr = r * (1 + bulto * n) * (1 - bulto * 0.1) * (1 + bulto * 0.35 * Math.cos(a) ** 2);
    return `${i ? "L" : "M"} ${Math.cos(a) * rr} ${Math.sin(a) * rr * (1 - bulto * 0.3)}`;
  });
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`${pts.join(" ")} Z`} fill={col} />
      {[0, 1, 2].map((k) => (
        <circle key={k} cx={(k - 1) * r * 0.35} cy={(k % 2 ? -1 : 1) * r * 0.25} r={r * 0.1} fill="#000" opacity={0.18} />
      ))}
    </g>
  );
};

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Cuerpo x={540} y={940} r={260} bulto={1} rot={t * 6} />
    <Texto x={540} y={560} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este asteroide parece una papa?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.planetas], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.white} />
    </>
  );
};

// B. Planetas y Sol son esferas; los asteroides pequeños son deformes + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.planetas, T.gravedad], [1, 1.04])}>
      <circle cx={260} cy={760} r={170} fill={C.yellow} opacity={aparece(t, T.planetas)} />
      <circle cx={650} cy={700} r={110} fill="#3A6EE8" opacity={aparece(t, T.planetas + 0.3)} />
      <circle cx={880} cy={820} r={70} fill="#C86A3A" opacity={aparece(t, T.planetas + 0.6)} />
      <Texto x={540} y={1000} size={38} color={C.white} op={aparece(t, T.esferas)}>
        esferas
      </Texto>
      <g opacity={aparece(t, T.asteroides)}>
        <Cuerpo x={400} y={1150} r={70} bulto={1} rot={30} />
        <Cuerpo x={680} y={1170} r={55} bulto={1} rot={-50} />
        <Texto x={540} y={1280} size={38} color="#C8B8A8" op={aparece(t, T.deformes)}>
          asteroides: deformes
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          el tamaño que lo decide: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.gravedad], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. La gravedad jala toda la materia hacia el centro, desde todas direcciones por igual
export const Gravedad: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.gravedad, T.enorme], [1, 1.04])}>
      <circle cx={540} cy={900} r={20} fill={C.yellow} />
      {new Array(16).fill(0).map((_, k) => {
        const a = (k / 16) * Math.PI * 2;
        const u = (t * 0.8 + (k % 4) * 0.25) % 1;
        const r0 = 380 - u * 200;
        return (
          <g key={k} opacity={aparece(t, k % 2 ? T.direcciones : T.gravedad)}>
            <circle cx={540 + Math.cos(a) * r0} cy={900 + Math.sin(a) * r0} r={14} fill="#C8B8A8" />
            <path d={`M ${540 + Math.cos(a) * 340} ${900 + Math.sin(a) * 340} L ${540 + Math.cos(a) * 240} ${900 + Math.sin(a) * 240}`} stroke={C.cyan} strokeWidth={6} />
          </g>
        );
      })}
      <Texto x={540} y={1380} size={38} color={C.cyan} op={aparece(t, T.centro)}>
        todo hacia el centro
      </Texto>
    </Lienzo>
  );
};

// D. En un objeto enorme la gravedad vence a la roca: las montañas se hunden y queda una esfera
export const Enorme: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const bulto = 0.6 * (1 - interpolate(t, [T.hunden, T.compacta], [0, 1], clamp));
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.enorme, T.pequeno], [1, 1.04])}>
        <Cuerpo x={540} y={860} r={300} bulto={bulto} col="#7A6A8A" />
        <g opacity={aparece(t, T.vence)}>
          <Texto x={300} y={1260} size={32} color={C.cyan}>
            gravedad
          </Texto>
          <rect x={200} y={1290} width={200} height={30} rx={10} fill={C.cyan} />
          <Texto x={780} y={1260} size={32} color={ROCA}>
            dureza de la roca
          </Texto>
          <rect x={700} y={1290} width={120} height={30} rx={10} fill={ROCA} opacity={aparece(t, T.dureza)} />
        </g>
        <Texto x={540} y={500} size={38} color={C.white} op={aparece(t, T.montanas) * (1 - aparece(t, T.acomoda))}>
          las montañas se hunden
        </Texto>
        <Texto x={540} y={500} size={38} color={C.white} op={aparece(t, T.acomoda) * (1 - aparece(t, T.equilibrio))}>
          la forma más compacta
        </Texto>
        <Texto x={540} y={500} size={42} color={C.yellow} op={aparece(t, T.equilibrio)}>
          equilibrio hidrostático
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.equilibrio} color={C.yellow} />
    </>
  );
};

// E. En un asteroide pequeño la gravedad es débil: la roca aguanta su forma
export const Pequeno: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.pequeno, T.limite], [1, 1.04])}>
      <Cuerpo x={540} y={880} r={220} bulto={1} rot={20} />
      <g opacity={aparece(t, T.debil)}>
        {new Array(8).fill(0).map((_, k) => {
          const a = (k / 8) * Math.PI * 2;
          return <path key={k} d={`M ${540 + Math.cos(a) * 380} ${880 + Math.sin(a) * 380} L ${540 + Math.cos(a) * 330} ${880 + Math.sin(a) * 330}`} stroke={C.cyan} strokeWidth={3} opacity={0.6} />;
        })}
        <Texto x={540} y={1300} size={38} color={C.cyan}>
          gravedad débil
        </Texto>
      </g>
      <Texto x={540} y={1370} size={38} color={ROCA} op={aparece(t, T.aguanta)}>
        la roca aguanta su forma
      </Texto>
    </Lienzo>
  );
};

// F. El límite: unos 400 km si es de hielo, algo más si es de roca
export const Limite: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tam = [40, 70, 110, 160, 220];
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.limite, T.porEso], [1, 1.04])}>
        {tam.map((r, k) => (
          <g key={k} opacity={aparece(t, T.limite + k * 0.2)}>
            <Cuerpo x={75 + tam.slice(0, k).reduce((s, v) => s + v * 1.3 + 30, 0) + r * 0.65} y={900} r={r * 0.6} bulto={k < 2 ? 1 : k === 2 ? 0.35 : 0} col={k < 3 ? ROCA : "#8AA8C8"} />
          </g>
        ))}
        <line x1={436} y1={600} x2={436} y2={1180} stroke={C.yellow} strokeWidth={6} strokeDasharray="18 12" opacity={aparece(t, T.cuatrocientos)} />
        <Texto x={436} y={570} size={40} color={C.yellow} op={aparece(t, T.cuatrocientos)}>
          ~400 km
        </Texto>
        <Texto x={540} y={1290} size={36} color="#8AA8C8" op={aparece(t, T.hielo)}>
          hielo: unos 400 km
        </Texto>
        <Texto x={540} y={1360} size={36} color={ROCA} op={aparece(t, T.roca)}>
          roca: algo más
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.cuatrocientos} color={C.yellow} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t - T.fin - 0.3} />
    </Lienzo>
  );
};
