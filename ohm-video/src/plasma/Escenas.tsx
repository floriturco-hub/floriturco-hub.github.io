import { interpolate, random } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/plasma/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  este: 1.88, // este
  gas: 3.04, // gas
  arco: 4.72, // arco
  final: 5.82, // final
  dentro: 8.28, // dentro
  bateria: 9.00, // bateria
  circuito: 10.06, // circuito
  eleva: 10.80, // eleva
  miles: 11.64, // miles
  ese: 12.96, // ese
  puntas: 14.60, // puntas
  cercanas: 15.26, // cercanas
  aire: 16.36, // aire
  aisla: 17.08, // aisla
  pero: 17.82, // pero
  rompe: 19.24, // rompe
  electrones: 20.08, // electrones
  arrancan: 20.64, // arrancan
  otros: 21.18, // otros
  conductor: 23.70, // conductor
  nace: 24.86, // nace
  plasma: 25.80, // plasma
  enciende: 27.28, // enciende
  mecha: 27.84, // mecha
  como: 28.68, // como
  viento: 30.02, // viento
  asi: 31.24, // asi
  fin: 33.24, // FIN
};

const ARCO = "#B86AF8";

// Arco eléctrico irregular entre (x1,y) y (x2,y)
const Arco: React.FC<{ readonly x1: number; readonly x2: number; readonly y: number; readonly t: number; readonly op: number; readonly w?: number }> = ({
  x1,
  x2,
  y,
  t,
  op,
  w = 8,
}) => {
  const f = Math.floor(t * 20);
  const pts = new Array(11)
    .fill(0)
    .map((_, i) => {
      const x = x1 + ((x2 - x1) * i) / 10;
      const dy = i === 0 || i === 10 ? 0 : (random(`a${f}-${i}`) - 0.5) * 40;
      return `${i ? "L" : "M"} ${x} ${y + dy}`;
    })
    .join(" ");
  return (
    <g opacity={op}>
      <ellipse cx={(x1 + x2) / 2} cy={y} rx={Math.abs(x2 - x1) * 0.7} ry={50} fill={ARCO} opacity={0.3} />
      <path d={pts} stroke={ARCO} strokeWidth={w * 2.4} fill="none" opacity={0.5} strokeLinejoin="round" />
      <path d={pts} stroke={C.white} strokeWidth={w} fill="none" strokeLinejoin="round" />
    </g>
  );
};

// Encendedor de arco: cuerpo con dos electrodos arriba
const Encendedor: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly arco: number; readonly t: number; readonly corte?: number; readonly rot?: number }> = ({
  x,
  y,
  s,
  arco,
  t,
  corte = 0,
  rot = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-110} y={-140} width={220} height={60} rx={10} fill="#5A5478" />
    <rect x={-70} y={-200} width={20} height={70} fill="#C8C4D8" />
    <rect x={50} y={-200} width={20} height={70} fill="#C8C4D8" />
    <Arco x1={-50} x2={50} y={-190} t={t} op={arco} />
    <rect x={-120} y={-90} width={240} height={420} rx={30} fill="#2A2640" stroke="#5A5478" strokeWidth={6} />
    <circle cx={0} cy={60} r={30} fill={ARCO} opacity={0.6} />
    <g opacity={corte}>
      <rect x={-100} y={-70} width={200} height={380} rx={20} fill="#141030" />
      <rect x={-60} y={120} width={120} height={170} rx={16} fill="#3A8A5A" />
      <Texto x={0} y={215} size={30} color={C.white}>
        3,7 V
      </Texto>
      <rect x={-70} y={-50} width={140} height={130} rx={10} fill="#4A4466" />
      {new Array(6).fill(0).map((_, k) => (
        <ellipse key={k} cx={-45 + k * 18} cy={15} rx={8} ry={45} fill="none" stroke="#D88A4A" strokeWidth={5} />
      ))}
    </g>
  </g>
);

const Vela: React.FC<{ readonly x: number; readonly y: number; readonly fuego: number; readonly t: number; readonly viento?: number }> = ({ x, y, fuego, t, viento = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-50} y={0} width={100} height={260} rx={12} fill={C.white} />
    <line x1={0} y1={0} x2={0} y2={-30} stroke="#333" strokeWidth={6} />
    <g opacity={fuego} transform={`skewX(${viento * 25})`}>
      <path d={`M 0 ${-130 - Math.sin(t * 9) * 8} Q 30 -70 18 -40 Q 0 -20 -18 -40 Q -30 -70 0 ${-130 - Math.sin(t * 9) * 8} Z`} fill={C.orange} />
      <path d="M 0 -90 Q 12 -60 8 -45 Q 0 -35 -8 -45 Q -12 -60 0 -90 Z" fill={C.yellow} />
    </g>
  </g>
);

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Encendedor x={360} y={1040} s={1.2} arco={1} t={t} rot={35} />
    <Vela x={630} y={850} fuego={0} t={t} />
    <Texto x={880} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo enciende fuego sin llama?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.este], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={ARCO} />
    </>
  );
};

// B. No tiene gas ni piedra, solo un arco morado + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const Tache: React.FC<{ readonly x: number; readonly txt: string; readonly op: number }> = ({ x, txt, op }) => (
    <g opacity={op}>
      <rect x={x - 120} y={1130} width={240} height={90} rx={18} fill={C.card} stroke={C.grey} strokeWidth={3} />
      <Texto x={x} y={1188} size={36} color={C.white}>
        {txt}
      </Texto>
      <line x1={x - 110} y1={1215} x2={x + 110} y2={1135} stroke={C.red} strokeWidth={10} />
    </g>
  );
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.este, T.dentro], [1, 1.05])}>
        <Encendedor x={540} y={800} s={1} arco={aparece(t, T.arco)} t={t} />
        <Tache x={360} txt="gas" op={aparece(t, T.gas)} />
        <Tache x={720} txt="piedra" op={aparece(t, T.gas + 0.5)} />
        <g opacity={aparece(t, T.final)}>
          <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
          <rect
            x={190}
            y={1330}
            width={700 * interpolate(t, [T.final, T.dentro], [0, 1], clamp)}
            height={24}
            rx={12}
            fill={C.yellow}
          />
          <Texto x={540} y={1430} color={C.white} size={38}>
            por qué no le afecta el viento
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.arco} color={ARCO} />
    </>
  );
};

// C. Una batería y un circuito que eleva el voltaje miles de veces
export const Circuito: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.dentro, T.ese], [1, 1.04])}>
      <Encendedor x={400} y={860} s={1.15} arco={0} t={t} corte={aparece(t, T.dentro)} />
      <g opacity={aparece(t, T.bateria)}>
        <path d="M 560 1110 L 660 1110" stroke="#3A8A5A" strokeWidth={6} />
        <Texto x={800} y={1122} size={36} color="#3A8A5A">
          batería
        </Texto>
      </g>
      <g opacity={aparece(t, T.circuito)}>
        <path d="M 520 870 L 660 870" stroke="#D88A4A" strokeWidth={6} />
        <Texto x={810} y={882} size={36} color="#D88A4A">
          circuito
        </Texto>
      </g>
      <g opacity={aparece(t, T.eleva)}>
        <rect x={250} y={1300} width={580} height={120} rx={20} fill={C.card} stroke={ARCO} strokeWidth={4} />
        <Texto x={540} y={1380} size={48} color={ARCO}>
          {aparece(t, T.miles) > 0.5 ? "voltaje × miles" : "3,7 V ↑"}
        </Texto>
      </g>
    </Lienzo>
  );
};

// Electrodos grandes con aire entre ellos
const Puntas: React.FC<{ readonly children?: React.ReactNode }> = ({ children }) => (
  <g>
    <path d="M 60 820 L 380 880 L 380 900 L 60 960 Z" fill="#C8C4D8" />
    <path d="M 1020 820 L 700 880 L 700 900 L 1020 960 Z" fill="#C8C4D8" />
    {children}
  </g>
);

// D. Ese voltaje se aplica entre dos puntas muy cercanas
export const Electrodos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.ese, T.aire], [1, 1.04])}>
      <Puntas>
        <Texto x={220} y={780} size={60} color={C.red} op={aparece(t, T.ese)}>
          +
        </Texto>
        <Texto x={860} y={780} size={60} color={C.cyan} op={aparece(t, T.ese)}>
          −
        </Texto>
        <g opacity={aparece(t, T.cercanas)}>
          <path d="M 390 1000 L 690 1000 M 390 980 L 390 1020 M 690 980 L 690 1020" stroke={C.yellow} strokeWidth={6} />
          <Texto x={540} y={1070} size={36} color={C.yellow}>
            muy cerca
          </Texto>
        </g>
      </Puntas>
    </Lienzo>
  );
};

// Átomos del aire en el hueco
const ATOMOS = new Array(15).fill(0).map((_, k) => ({ x: 420 + (k % 5) * 60 + (Math.floor(k / 5) % 2) * 25, y: 800 + Math.floor(k / 5) * 85 }));

// E. El aire aísla, pero con tanto voltaje se rompe: avalancha de electrones
export const Rompe: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const av = interpolate(t, [T.arrancan, T.conductor], [0, 1], clamp);
  const n = Math.floor(1 + av * 30);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.aire, T.nace], [1, 1.06])}>
        <Puntas>
          {ATOMOS.map((a, k) => (
            <g key={k}>
              <circle cx={a.x} cy={a.y} r={22} fill="#5A5478" />
              <circle cx={a.x} cy={a.y} r={8} fill={C.grey} />
            </g>
          ))}
          {new Array(n).fill(0).map((_, k) => {
            const u = ((t - T.electrones) * 1.4 + random(`e${k}`)) % 1;
            return (
              <circle
                key={k}
                cx={380 + u * 320}
                cy={800 + random(`y${k}`) * 180}
                r={9}
                fill={C.cyan}
                opacity={aparece(t, T.electrones)}
              />
            );
          })}
          <Arco x1={380} x2={700} y={890} t={t} op={aparece(t, T.conductor)} w={10} />
        </Puntas>
        <Texto x={540} y={1150} size={40} color={C.grey} op={aparece(t, T.aire) * (1 - aparece(t, T.rompe))}>
          el aire aísla
        </Texto>
        <Texto x={540} y={1150} size={40} color={C.yellow} op={aparece(t, T.rompe) * (1 - aparece(t, T.arrancan))}>
          con tanto voltaje, se rompe
        </Texto>
        <Texto x={540} y={1150} size={38} color={C.cyan} op={aparece(t, T.arrancan) * (1 - aparece(t, T.conductor))}>
          cada electrón arranca otros
        </Texto>
        <Texto x={540} y={1150} size={40} color={ARCO} op={aparece(t, T.conductor)}>
          el aire se vuelve conductor
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.conductor} color={ARCO} />
    </>
  );
};

// F. Nace un arco de plasma tan caliente que enciende la mecha al instante
export const Plasma: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.nace, T.como], [1, 1.04])}>
        <Encendedor x={360} y={1040} s={1.2} arco={1} t={t} rot={35} />
        <Vela x={630} y={850} fuego={aparece(t, T.mecha)} t={t} />
        <Texto x={540} y={1440} size={44} color={ARCO} op={aparece(t, T.plasma)}>
          arco de plasma
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.mecha} color={C.orange} />
    </>
  );
};

// G. Como no hay llama, el viento no lo apaga
export const Viento: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const v = aparece(t, T.viento);
  return (
    <Lienzo zoom={interpolate(t, [T.como, T.asi], [1, 1.04])}>
      <Encendedor x={540} y={960} s={1.2} arco={1} t={t} />
      {new Array(6).fill(0).map((_, k) => {
        const u = (t * 0.9 + k / 6) % 1;
        return (
          <path
            key={k}
            d={`M ${-100 + u * 1300} ${640 + k * 50} q 60 -20 120 0`}
            stroke={C.white}
            strokeWidth={6}
            fill="none"
            opacity={v * 0.6}
          />
        );
      })}
      <Texto x={540} y={1440} size={42} color={C.white} op={aparece(t, T.viento + 0.4)}>
        sin llama: el viento no lo apaga
      </Texto>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
