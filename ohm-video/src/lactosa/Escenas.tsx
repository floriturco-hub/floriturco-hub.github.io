import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/lactosa/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  bebes: 2.02, // beb
  adultos: 4.80, // adultos
  final: 6.92, // final
  nadie: 8.18, // nadie
  azucar: 10.46, // az
  lactosa: 11.18, // lactosa
  enzima: 13.08, // enzima
  lactasa: 13.86, // lactasa
  mamiferos: 15.70, // mam
  destete: 18.72, // destete
  intestino: 21.22, // intestino
  bacterias: 22.38, // bacterias
  gases: 23.88, // gases
  pueblos: 27.08, // pueblos
  vacas: 27.86, // vacas
  mutacion: 29.78, // mutaci
  vida: 31.90, // vida
  europa: 33.50, // europa
  asia: 36.14, // asia
  porEso: 37.66, // por
  fin: 39.24, // FIN
};

const GLU = "#5AB8F0";
const GAL = "#F0B85A";

const Vaso: React.FC<{ readonly x: number; readonly y: number; readonly s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -110 -200 L 110 -200 L 90 200 L -90 200 Z" fill="#DDEEFF" opacity={0.25} stroke="#DDEEFF" strokeWidth={6} />
    <path d="M -102 -120 L 102 -120 L 90 192 L -90 192 Z" fill="#F8F6F0" />
  </g>
);

const Panza: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly mal: number }> = ({ x, y, t, mal }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={0} rx={150} ry={170} fill="#E8B48A" />
    {[0, 1, 2].map((k) => (
      <path key={k} d={`M ${-90 + k * 70} ${-40 + 20 * Math.sin(t * 6 + k)} q 20 -30 40 0 q 20 30 40 0`} stroke="#B05030" strokeWidth={6} fill="none" opacity={mal} />
    ))}
  </g>
);

// Lactosa = glucosa + galactosa unidas; c (0..1) las separa
const Lactosa: React.FC<{ readonly x: number; readonly y: number; readonly c: number; readonly s?: number }> = ({ x, y, c, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <polygon points="-130,-50 -70,-80 -10,-50 -10,30 -70,60 -130,30" fill={GLU} transform={`translate(${-60 * c} 0)`} />
    <polygon points="10,-50 70,-80 130,-50 130,30 70,60 10,30" fill={GAL} transform={`translate(${60 * c} 0)`} />
    <rect x={-14} y={-14} width={28} height={28} fill="#FFFFFF" opacity={1 - c} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Vaso x={330} y={1000} s={0.9} />
    <Panza x={720} y={1050} t={t} mal={1} />
    <Texto x={880} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta leche te cae mal?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.bebes], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. De bebés todos digerimos leche; la mayoría de los adultos, no + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ad = aparece(t, T.adultos);
  return (
    <Lienzo zoom={interpolate(t, [T.bebes, T.azucar], [1, 1.04])}>
      <g transform="translate(300 1000)">
        <circle cx={0} cy={-120} r={80} fill="#E8B48A" />
        <ellipse cx={0} cy={60} rx={100} ry={120} fill="#E8B48A" />
        <rect x={60} y={-150} width={40} height={90} rx={14} fill="#F8F6F0" />
      </g>
      <Texto x={300} y={1260} size={34} color="#5AD08A">
        bebé: ✓
      </Texto>
      <g opacity={ad}>
        <Panza x={780} y={1000} t={t} mal={1} />
        <circle cx={780} cy={760} r={80} fill="#E8B48A" />
        <Texto x={780} y={1260} size={34} color={C.orange}>
          mayoría de adultos
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿dónde casi nadie lo es?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.azucar], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. La lactosa se corta en dos con la lactasa; los mamíferos dejan de fabricarla tras el destete
export const Enzima: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const corta = interpolate(t, [T.lactasa, T.lactasa + 0.6], [0, 1], clamp);
  const sin = aparece(t, T.destete);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.azucar, T.intestino], [1, 1.04])}>
        <Lactosa x={540} y={950} c={corta * (1 - sin)} s={1.4} />
        <Texto x={540} y={720} size={40} color={C.white} op={aparece(t, T.lactosa)}>
          lactosa
        </Texto>
        <g opacity={aparece(t, T.enzima) * (1 - sin)}>
          <path d={`M 540 ${1180 - 60 * corta} l -60 90 l 120 0 Z`} fill="#5AD08A" />
          <Texto x={540} y={1340} size={36} color="#5AD08A">
            lactasa (enzima)
          </Texto>
        </g>
        <g opacity={sin}>
          <Texto x={540} y={1240} size={36} color={C.orange}>
            tras el destete: sin lactasa
          </Texto>
          <Texto x={540} y={1300} size={30} color={C.white} op={aparece(t, T.mamiferos)}>
            casi todos los mamíferos
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.lactasa} color="#5AD08A" />
    </>
  );
};

// D. La lactosa llega al intestino grueso, las bacterias la fermentan: gases y dolor
export const Fermenta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const gas = aparece(t, T.gases);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.intestino, T.pueblos], [1, 1.04])}>
        <path d="M 260 760 Q 260 680 340 680 L 740 680 Q 820 680 820 760 L 820 1200 Q 820 1280 740 1280 L 560 1280" stroke="#C87860" strokeWidth={70} fill="none" strokeLinecap="round" />
        <Lactosa x={300 + 440 * interpolate(t, [T.intestino, T.bacterias], [0, 1], clamp)} y={680} c={0} s={0.35} />
        {aparece(t, T.bacterias) > 0
          ? new Array(6).fill(0).map((_, k) => (
              <ellipse key={k} cx={820 + 14 * Math.sin(t * 3 + k)} cy={800 + k * 70} rx={24} ry={12} fill="#8AD05A" opacity={aparece(t, T.bacterias)} transform={`rotate(${k * 30} ${820} ${800 + k * 70})`} />
            ))
          : null}
        {gas > 0
          ? new Array(6).fill(0).map((_, k) => {
              const u = (t * 0.6 + k / 6) % 1;
              return <circle key={k} cx={680 + 60 * Math.sin(k * 2)} cy={1180 - u * 400} r={16 + 14 * u} fill="none" stroke="#DDEEFF" strokeWidth={4} opacity={gas * (1 - u)} />;
            })
          : null}
        <Texto x={540} y={1440} size={40} color={C.orange} op={gas}>
          gases y dolor
        </Texto>
        <Texto x={540} y={600} size={36} color={C.white} op={aparece(t, T.intestino)}>
          intestino grueso
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.gases} color={C.orange} />
    </>
  );
};

// E. Hace ~7000 años, pueblos con vacas y cabras: mutación que mantiene la lactasa toda la vida
export const Mutacion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const mut = aparece(t, T.mutacion);
  return (
    <Lienzo zoom={interpolate(t, [T.pueblos, T.europa], [1, 1.04])}>
      <Texto x={540} y={620} size={44} color={C.yellow} op={aparece(t, T.pueblos)}>
        hace ~7000 años
      </Texto>
      <g opacity={aparece(t, T.vacas)} transform="translate(540 930)">
        <rect x={-150} y={-70} width={300} height={140} rx={50} fill="#F0F0F0" />
        <circle cx={-60} cy={-20} r={30} fill="#2A2A2A" />
        <circle cx={60} cy={30} r={24} fill="#2A2A2A" />
        <rect x={150} y={-110} width={90} height={90} rx={30} fill="#F0F0F0" />
        {[-120, -60, 60, 120].map((x) => (
          <rect key={x} x={x - 12} y={60} width={24} height={90} fill="#F0F0F0" />
        ))}
      </g>
      <g opacity={mut} transform="translate(540 1260)">
        {new Array(8).fill(0).map((_, k) => (
          <g key={k}>
            <line x1={-280 + k * 80} y1={-30} x2={-280 + k * 80} y2={30} stroke={k === 4 ? C.yellow : "#8AC8E8"} strokeWidth={10} />
          </g>
        ))}
        <path d="M -300 -40 Q -40 40 300 -40 M -300 40 Q -40 -40 300 40" stroke="#E8E6F0" strokeWidth={6} fill="none" />
      </g>
      <Texto x={540} y={1420} size={34} color={C.white} op={aparece(t, T.vida)}>
        lactasa toda la vida
      </Texto>
    </Lienzo>
  );
};

// F. Norte de Europa: casi todos digieren leche; este de Asia: muy pocos
export const Mapa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const eu = aparece(t, T.europa);
  const as = aparece(t, T.asia);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.europa, T.porEso], [1, 1.04])}>
        <g opacity={eu}>
          <rect x={120} y={760} width={380} height={440} rx={40} fill="#2A3A5A" />
          <Texto x={310} y={840} size={34} color={C.white}>
            norte de Europa
          </Texto>
          <rect x={200} y={1140 - 260 * eu} width={220} height={260 * eu} rx={14} fill="#5AD08A" />
          <Texto x={310} y={1270} size={32} color="#5AD08A">
            casi todos
          </Texto>
        </g>
        <g opacity={as}>
          <rect x={580} y={760} width={380} height={440} rx={40} fill="#2A3A5A" />
          <Texto x={770} y={840} size={34} color={C.white}>
            este de Asia
          </Texto>
          <rect x={660} y={1140 - 40 * as} width={220} height={40 * as} rx={14} fill={C.orange} />
          <Texto x={770} y={1270} size={32} color={C.orange}>
            muy pocos
          </Texto>
        </g>
        <Texto x={540} y={620} size={38} color={C.white} op={eu}>
          digieren leche de adultos
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.europa} color={C.yellow} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
