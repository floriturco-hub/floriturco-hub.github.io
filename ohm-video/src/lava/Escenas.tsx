import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/lava/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  sube: 1.8,
  final: 5.78,
  dentro: 8.22,
  agua: 10.84,
  cera: 12.02,
  pesada: 13.1,
  abajo: 14.6,
  calienta: 15.78,
  expande: 18.08,
  ligera: 19.48,
  arriba: 21.4,
  enfria: 23.06,
  cae: 25.76,
  llegar: 26.5,
  ciclo: 29.48,
  si: 31.28,
  dormida: 33.4,
  porEso: 35.96,
  fin: 37.78,
};

const AGUA = "#6A2A9A";
const CERA = "#F8783C";
const METAL = "#8A86A8";

const VIDRIO = "M -70 -330 L 70 -330 Q 170 120 160 250 L 130 330 L -130 330 L -160 250 Q -170 120 -70 -330 Z";

// Lámpara de lava centrada en (x,y), escala s. velocidad 0 = apagada (cera en el fondo)
const Lampara: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly t: number;
  readonly vel?: number;
  readonly luz?: number;
  readonly id: string;
}> = ({ x, y, s, t, vel = 1, luz = 1, id }) => {
  const blobs = [0, 1.7, 3.3, 4.6];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={0} cy={330} r={260} fill={C.orange} opacity={0.12 * luz} />
      <defs>
        <clipPath id={`vid-${id}`}>
          <path d={VIDRIO} />
        </clipPath>
      </defs>
      <path d={VIDRIO} fill={AGUA} />
      <g clipPath={`url(#vid-${id})`}>
        {vel > 0
          ? blobs.map((ph, k) => {
              const u = 0.5 - 0.5 * Math.cos(t * 0.55 * vel + ph);
              const by = interpolate(u, [0, 1], [300, -260]);
              const r = 46 + (k % 2) * 18;
              return (
                <ellipse
                  key={k}
                  cx={((k % 3) - 1) * 50 + Math.sin(t * 0.8 + k) * 14}
                  cy={by}
                  rx={r * (1 - Math.sin(t * 1.3 + k) * 0.12)}
                  ry={r * (1 + Math.sin(t * 1.3 + k) * 0.22)}
                  fill={CERA}
                />
              );
            })
          : null}
        <ellipse cx={0} cy={330} rx={150} ry={vel > 0 ? 50 : 90} fill={vel > 0 ? CERA : "#A8603A"} />
      </g>
      <path d={VIDRIO} fill="none" stroke="#C8C4D8" strokeWidth={6} opacity={0.6} />
      <rect x={-50} y={-310} width={14} height={520} rx={7} fill={C.white} opacity={0.12} />
      <path d="M -80 -400 L 80 -400 L 70 -330 L -70 -330 Z" fill={METAL} />
      <path d="M -130 330 L 130 330 L 190 520 L -190 520 Z" fill={METAL} />
      <circle cx={0} cy={420} r={34} fill={luz > 0.5 ? C.yellow : "#3A3650"} />
    </g>
  );
};

// A. Gancho: ¿por qué esta lava nunca para?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.sube], [1.12, 1])}>
        <Lampara x={540} y={880} s={1.3} t={t + 6} id="g" />
        <Texto x={540} y={1610} size={80} color={C.yellow} op={interpolate(t, [0.5, 0.8], [0, 1], clamp)}>
          ?
        </Texto>
      </Lienzo>
      <Flash t={t} d={0.6} color={C.orange} />
    </>
  );
};

// B. Sube, baja, se estira y no se acaba nunca + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.sube, T.dentro], [1, 1.05])}>
      <Lampara x={330} y={820} s={0.9} t={t * 2.5} id="b" />
      <Texto x={720} y={620} size={44} color={CERA} op={aparece(t, T.sube)}>
        sube
      </Texto>
      <Texto x={720} y={720} size={44} color={CERA} op={aparece(t, 2.64)}>
        baja
      </Texto>
      <Texto x={720} y={820} size={44} color={CERA} op={aparece(t, 3.24)}>
        se estira
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1300} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1300}
          width={700 * interpolate(t, [T.final, T.dentro], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1400} color={C.white} size={38}>
          qué pasa si la apagas: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Dos líquidos que no se mezclan: agua con color y cera casi igual de pesada
export const Liquidos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const balanza = aparece(t, T.pesada);
  const incl = Math.sin(t * 2) * 4 * balanza;
  return (
    <Lienzo zoom={interpolate(t, [T.dentro, T.abajo], [1, 1.04])}>
      <g opacity={1 - balanza}>
        <rect x={340} y={560} width={400} height={560} rx={30} fill="none" stroke="#C8C4D8" strokeWidth={8} />
        <rect x={348} y={640} width={384} height={472} rx={24} fill={AGUA} opacity={aparece(t, T.agua)} />
        <ellipse cx={540} cy={1000} rx={120} ry={60} fill={CERA} opacity={aparece(t, T.cera)} />
        <Texto x={540} y={1220} size={40} color={C.white} op={aparece(t, T.dentro + 0.6)}>
          no se mezclan
        </Texto>
      </g>
      <g opacity={balanza}>
        <polygon points="540,1000 500,1120 580,1120" fill={METAL} />
        <g transform={`rotate(${incl} 540 1000)`}>
          <rect x={200} y={990} width={680} height={20} rx={10} fill={METAL} />
          <circle cx={290} cy={920} r={70} fill={AGUA} />
          <ellipse cx={790} cy={920} rx={70} ry={66} fill={CERA} />
        </g>
        <Texto x={540} y={1240} size={40} color={C.yellow}>
          casi igual de pesados
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. La bombilla calienta la cera: se expande, se vuelve más ligera y sube
export const Calor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const crece = interpolate(t, [T.expande - 0.3, T.ligera], [1, 1.35], suave);
  const sube = interpolate(t, [T.ligera, T.arriba], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.abajo, T.arriba], [1, 1.04])}>
      <rect x={290} y={480} width={500} height={760} rx={40} fill={AGUA} />
      <circle cx={540} cy={1300} r={70} fill={C.yellow} opacity={aparece(t, T.calienta - 0.6)} />
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M ${480 + k * 60} 1220 q 15 -25 0 -50 q -15 -25 0 -50`} stroke={C.orange} strokeWidth={8} fill="none" opacity={aparece(t, T.calienta) * (0.5 + 0.5 * Math.sin(t * 6 + k))} />
      ))}
      <g transform={`translate(540 ${interpolate(sube, [0, 1], [1100, 640])})`}>
        <ellipse rx={90 * crece} ry={70 * crece} fill={CERA} />
        {new Array(8).fill(0).map((_, k) => (
          <circle key={k} cx={Math.cos(k * 0.785 + t) * 45 * crece} cy={Math.sin(k * 0.785 + t) * 32 * crece} r={8} fill="#FFC8A0" />
        ))}
      </g>
      <Texto x={540} y={430} size={40} color={CERA} op={aparece(t, T.expande) * (1 - aparece(t, T.ligera))}>
        se expande
      </Texto>
      <Texto x={540} y={430} size={40} color={C.yellow} op={aparece(t, T.ligera)}>
        más ligera: ¡sube!
      </Texto>
    </Lienzo>
  );
};

// E. Arriba se enfría, se encoge, pesa más y vuelve a caer
export const Enfria: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const encoge = interpolate(t, [T.enfria, T.cae - 0.3], [1.35, 1], suave);
  const cae = interpolate(t, [T.cae - 0.3, T.llegar + 0.3], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.arriba, T.llegar], [1, 1.04])}>
      <rect x={290} y={480} width={500} height={760} rx={40} fill={AGUA} />
      <g transform={`translate(540 ${interpolate(cae, [0, 1], [640, 1100])})`}>
        <ellipse rx={90 * encoge} ry={70 * encoge} fill={encoge < 1.15 ? "#D8603A" : CERA} />
      </g>
      <g opacity={aparece(t, T.enfria)} transform="translate(880 640)">
        <rect x={-24} y={-120} width={48} height={200} rx={24} fill="#2A2440" />
        <rect x={-12} y={10} width={24} height={60} rx={12} fill={C.cyan} />
        <circle cx={0} cy={90} r={36} fill={C.cyan} />
      </g>
      <Texto x={540} y={430} size={40} color={C.cyan} op={aparece(t, T.enfria) * (1 - aparece(t, T.cae))}>
        se enfría y se encoge
      </Texto>
      <Texto x={540} y={430} size={40} color={C.white} op={aparece(t, T.cae)}>
        más pesada: ¡cae!
      </Texto>
    </Lienzo>
  );
};

// F. Abajo se calienta otra vez y el ciclo empieza de nuevo
export const Ciclo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const a = (t - T.llegar) * 90;
  const pasos: [string, string, number, number][] = [
    ["calienta", C.orange, 540, 1180],
    ["sube", CERA, 840, 860],
    ["enfría", C.cyan, 540, 540],
    ["baja", C.purpleLight, 240, 860],
  ];
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.llegar, T.si], [1, 1.04])}>
        <circle cx={540} cy={860} r={280} fill="none" stroke="#3A3456" strokeWidth={14} />
        <circle cx={540 + 280 * Math.cos(((a + 90) * Math.PI) / 180)} cy={860 + 280 * Math.sin(((a + 90) * Math.PI) / 180)} r={40} fill={CERA} />
        {pasos.map(([txt, col, x, y], k) => (
          <g key={txt} opacity={aparece(t, T.llegar + k * 0.25)}>
            <rect x={x - 120} y={y - 40} width={240} height={70} rx={20} fill={C.card} stroke={col} strokeWidth={4} />
            <Texto x={x} y={y + 8} size={36} color={col}>
              {txt}
            </Texto>
          </g>
        ))}
        <Texto x={540} y={875} size={44} color={C.yellow} op={aparece(t, T.ciclo)}>
          ciclo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.ciclo} color={C.orange} />
    </>
  );
};

// G. Si la apagas, la cera se queda dormida en el fondo
export const Apagada: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const apaga = aparece(t, T.si + 0.4);
  return (
    <Lienzo zoom={interpolate(t, [T.si, T.porEso], [1, 1.05])}>
      <Lampara x={540} y={860} s={1.1} t={t} vel={apaga > 0.5 ? 0 : 1} luz={1 - apaga} id="a" />
      <Texto x={540} y={1530} size={44} color={C.grey} op={aparece(t, T.dormida)}>
        Zzz… como una piedra
      </Texto>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Lampara x={540} y={880} s={1.3} t={t + 6 - T.fin} id="c" />
      <Texto x={540} y={1610} size={80} color={C.yellow}>
        ?
      </Texto>
    </Lienzo>
  );
};
