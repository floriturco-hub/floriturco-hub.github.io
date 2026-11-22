import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/dialisis/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  cuando: 2.30, // cuando
  maquina: 4.02, // maquina
  final: 5.78, // final
  sale: 9.40, // sale
  filtro: 11.22, // filtro
  miles: 12.12, // miles
  fibras: 12.74, // fibras
  finas: 13.76, // finas
  paredes: 15.52, // paredes
  poros: 16.20, // poros
  dejan: 17.42, // dejan
  desechos: 19.32, // desechos
  pero: 20.62, // pero
  celulas: 21.32, // celulas
  proteinas: 22.06, // proteinas
  fuera: 23.22, // fuera
  liquido: 24.58, // liquido
  contrario: 25.96, // contrario
  mucho: 28.38, // mucho
  poco: 29.42, // poco
  van: 30.26, // van
  limpia: 31.24, // limpia
  vuelve: 31.68, // vuelve
  sesion: 33.16, // sesion
  quince: 35.74, // quince
  asi: 36.98, // asi
  fin: 38.84, // FIN
};

const SANGRE = "#C8283A";
const UREA = "#6AE88A";
const LIQ = "#2AA8D8";

const Rinon: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly color: string }> = ({ x, y, s, color }) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M 0 -120 C 90 -130 120 -40 100 30 C 85 100 20 140 -30 110 C -60 90 -20 40 -40 0 C -60 -40 -90 -110 0 -120 Z"
    fill={color}
  />
);

const Gota: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M 0 -80 C 40 -20 60 10 60 40 A 60 60 0 0 1 -60 40 C -60 10 -40 -20 0 -80 Z" fill={SANGRE} />
);

// Circuito brazo -> máquina -> brazo con gotitas que circulan
const Circuito: React.FC<{ readonly t: number; readonly op: number; readonly vel?: number }> = ({ t, op, vel = 0.4 }) => {
  const ida = (u: number) => [260 + u * 480, 700 - Math.sin(u * Math.PI) * 120];
  const vuelta = (u: number) => [740 - u * 480, 1060 + Math.sin(u * Math.PI) * 120];
  return (
    <g opacity={op}>
      <path d="M 260 700 Q 500 460 740 700" stroke={SANGRE} strokeWidth={14} fill="none" opacity={0.5} />
      <path d="M 740 1060 Q 500 1300 260 1060" stroke="#E86A7A" strokeWidth={14} fill="none" opacity={0.5} />
      {new Array(6).fill(0).map((_, k) => {
        const u = (t * vel + k / 6) % 1;
        const [x1, y1] = ida(u);
        const [x2, y2] = vuelta(u);
        return (
          <g key={k}>
            <circle cx={x1} cy={y1} r={13} fill={SANGRE} />
            <circle cx={x2} cy={y2} r={13} fill="#E86A7A" />
          </g>
        );
      })}
      {/* brazo */}
      <rect x={110} y={640} width={150} height={480} rx={70} fill="#E8B48A" />
      {/* máquina */}
      <rect x={720} y={620} width={260} height={520} rx={30} fill="#3A3650" />
      <rect x={760} y={670} width={180} height={110} rx={12} fill="#0E2A1A" />
      <rect x={810} y={840} width={80} height={240} rx={30} fill="#8AC8F8" opacity={0.7} />
    </g>
  );
};

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <Rinon x={380} y={900} s={1.3} color="#5A4A5A" />
    <Rinon x={700} y={900} s={-1.3} color="#5A4A5A" />
    <Gota x={540} y={1230} s={1.2} />
    <Texto x={540} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo se limpia la sangre sin riñones?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.cuando], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={SANGRE} />
    </>
  );
};

// B. Cuando los riñones fallan, una máquina hace su trabajo + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const maq = aparece(t, T.maquina);
  return (
    <Lienzo zoom={interpolate(t, [T.cuando, T.sale], [1, 1.05])}>
      <g opacity={1 - maq}>
        <Rinon x={380} y={900} s={1.3} color="#5A4A5A" />
        <Rinon x={700} y={900} s={-1.3} color="#5A4A5A" />
        <line x1={260} y1={760} x2={820} y2={1040} stroke={C.red} strokeWidth={14} opacity={aparece(t, T.cuando + 0.6)} />
      </g>
      <Circuito t={t} op={maq} />
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.sale], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          cuántas veces pasa tu sangre
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. La sangre entra a un filtro lleno de miles de fibras huecas, finas como un cabello
export const Filtro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const corte = aparece(t, T.miles);
  return (
    <Lienzo zoom={interpolate(t, [T.sale, T.paredes], [1, 1.04])}>
      <g opacity={1 - corte}>
        <Circuito t={t} op={1} />
        <circle cx={850} cy={960} r={150} fill="none" stroke={C.yellow} strokeWidth={8} opacity={aparece(t, T.filtro)} />
      </g>
      <g opacity={corte}>
        <circle cx={540} cy={860} r={330} fill="#3A1A2A" stroke="#8AC8F8" strokeWidth={10} />
        {new Array(110).fill(0).map((_, k) => {
          const a = k * 2.399;
          const r = 300 * Math.sqrt(k / 110);
          return (
            <circle
              key={k}
              cx={540 + Math.cos(a) * r}
              cy={860 + Math.sin(a) * r}
              r={14}
              fill={SANGRE}
              stroke="#E8E4F0"
              strokeWidth={4}
              opacity={aparece(t, T.miles + (k / 110) * 0.8)}
            />
          );
        })}
        <Texto x={540} y={1260} size={40} color={C.white} op={aparece(t, T.fibras)}>
          miles de fibras huecas
        </Texto>
        <Texto x={540} y={1320} size={34} color={C.grey} op={aparece(t, T.finas)}>
          finas como un cabello
        </Texto>
      </g>
    </Lienzo>
  );
};

type Part = { x: number; y: number; r: number; c: string; sale: boolean; n: string };
const PARTS: Part[] = [
  ...[0, 1, 2].map((k) => ({ x: 250 + k * 260, y: 860, r: 42, c: SANGRE, sale: false, n: "célula" })),
  ...[0, 1].map((k) => ({ x: 380 + k * 260, y: 920, r: 26, c: "#9A6AE8", sale: false, n: "proteína" })),
  ...[0, 1, 2, 3, 4].map((k) => ({ x: 200 + k * 170, y: 800 + (k % 2) * 140, r: 11, c: UREA, sale: true, n: "urea" })),
  ...[0, 1, 2, 3].map((k) => ({ x: 290 + k * 190, y: 840 + (k % 2) * 90, r: 8, c: LIQ, sale: true, n: "agua" })),
  ...[0, 1, 2].map((k) => ({ x: 330 + k * 210, y: 900 - (k % 2) * 120, r: 7, c: C.yellow, sale: true, n: "sal" })),
];

// D. Las paredes tienen poros: pasan agua, sales y urea, pero no células ni proteínas
export const Poros: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.dejan, T.pero], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.paredes, T.fuera], [1, 1.04])}>
      {[700, 1020].map((y) => (
        <g key={y}>
          <rect x={80} y={y} width={920} height={40} fill="#E8E4F0" opacity={0.85} />
          {new Array(12).fill(0).map((_, k) => (
            <rect key={k} x={110 + k * 76} y={y} width={18} height={40} fill="#141030" opacity={aparece(t, T.poros)} />
          ))}
        </g>
      ))}
      {PARTS.map((q, k) => {
        const salir = q.sale ? p : 0;
        const dir = q.y < 880 ? -1 : 1;
        return <circle key={k} cx={q.x + Math.sin(t * 2 + k) * 6} cy={q.y + dir * salir * 250} r={q.r} fill={q.c} />;
      })}
      <g opacity={aparece(t, T.desechos)}>
        <Texto x={540} y={470} size={36} color={UREA}>
          agua, sales y urea: salen
        </Texto>
      </g>
      <g opacity={aparece(t, T.celulas)}>
        <Texto x={540} y={1330} size={36} color={SANGRE}>
          células y proteínas: se quedan
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. Por fuera corre un líquido limpio en sentido contrario; los desechos pasan de mucho a poco
export const Contra: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const paso = aparece(t, T.mucho);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.fuera, T.limpia], [1, 1.04])}>
        <rect x={60} y={600} width={960} height={520} rx={30} fill={LIQ} opacity={0.18 * (0.3 + 0.7 * aparece(t, T.liquido))} />
        <rect x={60} y={790} width={960} height={140} fill="#5A1A2A" stroke="#E8E4F0" strokeWidth={8} strokeDasharray="20 10" />
        {[0, 1, 2, 3].map((k) => {
          const u = (t * 0.25 + k / 4) % 1;
          return (
            <g key={k}>
              <path d={`M ${100 + u * 880} 860 l 40 0 m -16 -16 l 16 16 l -16 16`} stroke={SANGRE} strokeWidth={8} fill="none" />
              <g opacity={aparece(t, T.contrario)}>
                <path d={`M ${980 - u * 880} 680 l -40 0 m 16 -16 l -16 16 l 16 16`} stroke={LIQ} strokeWidth={8} fill="none" />
                <path d={`M ${980 - u * 880} 1040 l -40 0 m 16 -16 l -16 16 l 16 16`} stroke={LIQ} strokeWidth={8} fill="none" />
              </g>
            </g>
          );
        })}
        {new Array(14).fill(0).map((_, k) => {
          const x = 120 + ((k * 67) % 840);
          const u = paso > 0 ? ((t - T.mucho) * 0.5 + k / 14) % 1 : 0;
          const lado = k % 2 ? -1 : 1;
          const y = 860 + lado * (u * 200);
          const xx = x - (u > 0.5 ? (u - 0.5) * 400 : 0);
          return <circle key={k} cx={xx} cy={y} r={11} fill={UREA} opacity={u > 0.85 ? (1 - u) * 6 : 1} />;
        })}
        <Texto x={540} y={1220} size={36} color={LIQ} op={aparece(t, T.liquido) * (1 - paso)}>
          líquido limpio, en sentido contrario
        </Texto>
        <Texto x={540} y={1220} size={36} color={UREA} op={paso}>
          de donde hay mucho a donde hay poco
        </Texto>
        <Texto x={540} y={560} size={34} color={C.grey} op={aparece(t, T.van)}>
          y se los lleva
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.mucho} color={UREA} />
    </>
  );
};

// F. La sangre limpia vuelve; en cuatro horas toda tu sangre pasa unas quince veces
export const Vuelve: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const n = Math.round(interpolate(t, [T.sesion, T.quince + 0.2], [0, 15], clamp));
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.limpia, T.asi], [1, 1.04])}>
        <Circuito t={t} op={1} vel={interpolate(t, [T.sesion, T.quince], [0.4, 1.4], clamp)} />
        <g opacity={aparece(t, T.sesion)}>
          <rect x={300} y={1240} width={480} height={140} rx={24} fill={C.card} stroke={C.yellow} strokeWidth={4} />
          <Texto x={540} y={1300} size={34} color={C.grey}>
            4 horas
          </Texto>
          <Texto x={540} y={1360} size={56} color={C.yellow}>
            {`× ${n}`}
          </Texto>
        </g>
        <Texto x={540} y={540} size={40} color="#E86A7A" op={aparece(t, T.vuelve) * (1 - aparece(t, T.sesion))}>
          vuelve limpia al cuerpo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.quince} color={C.yellow} />
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
