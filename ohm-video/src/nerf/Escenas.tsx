import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/nerf/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  dardoG: 0.48, // dardo
  dardo: 2.06, // dardo
  suave: 3.00, // suave
  lastima: 3.72, // lastima
  recto: 5.34, // recto
  veinte: 5.92, // veinte
  final: 7.36, // final
  esSuave: 9.70, // es
  gramo: 11.46, // gramo
  sale: 12.06, // sale
  segundo: 13.46, // segundo
  energia: 14.98, // energia
  reparte: 15.80, // reparte
  ancha: 16.96, // ancha
  pero: 17.90, // pero
  truco: 19.30, // truco
  peso: 20.14, // peso
  punta: 20.88, // punta
  mas: 21.90, // mas
  cuerpo: 22.44, // cuerpo
  centro: 23.82, // centro
  adelante: 24.92, // adelante
  si: 25.79, // si
  tuerce: 26.48, // tuerce
  aire: 27.22, // aire
  cola: 28.28, // cola
  endereza: 29.20, // endereza
  pluma: 30.16, // pluma
  porEso: 31.88, // por
  fin: 33.86, // FIN
};

const ESPUMA = "#F08A2A";
const GOMA = "#2A6AE0";

// Dardo apuntando a la derecha, centrado en su centro de gravedad aproximado
const Dardo: React.FC<{ readonly x: number; readonly y: number; readonly rot?: number; readonly s?: number; readonly cg?: number }> = ({ x, y, rot = 0, s = 1, cg = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-170} y={-32} width={260} height={64} rx={8} fill={ESPUMA} />
    {[0, 1, 2].map((k) => (
      <line key={k} x1={-150 + k * 70} y1={-32} x2={-150 + k * 70} y2={32} stroke="#C86A1A" strokeWidth={3} opacity={0.5} />
    ))}
    <path d="M 90 -36 L 140 -36 Q 175 -36 175 0 Q 175 36 140 36 L 90 36 Z" fill={GOMA} />
    {cg > 0 ? (
      <g opacity={cg}>
        <circle cx={70} cy={0} r={20} fill="#fff" />
        <path d="M 70 -20 A 20 20 0 0 1 90 0 L 70 0 Z M 70 20 A 20 20 0 0 1 50 0 L 70 0 Z" fill="#111" />
      </g>
    ) : null}
  </g>
);

const Estelas: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly op?: number }> = ({ x, y, t, op = 1 }) => (
  <g opacity={op}>
    {[-20, 0, 20].map((dy, k) => {
      const u = (t * 2 + k * 0.3) % 1;
      return <line key={k} x1={x - 200 - u * 200} y1={y + dy} x2={x - 60 - u * 200} y2={y + dy} stroke="#fff" strokeWidth={5} opacity={0.5 * (1 - u)} strokeLinecap="round" />;
    })}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Dardo x={560} y={940} s={1.5} />
    <Estelas x={360} y={940} t={t} />
    <Texto x={540} y={680} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este dardo vuela recto?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.dardo], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Tan suave que no lastima, y vuela recto unos 20 metros + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const vuelo = interpolate(t, [T.recto - 0.3, T.final], [0, 1], clamp);
  const squish = 1 - 0.25 * Math.max(0, Math.sin(Math.min(1, Math.max(0, (t - T.suave) / 0.8)) * Math.PI));
  return (
    <Lienzo zoom={interpolate(t, [T.dardo, T.esSuave], [1, 1.04])}>
      <g opacity={1 - aparece(t, T.recto - 0.3)}>
        <g transform={`translate(540 900) scale(${squish} 1) translate(-540 -900)`}>
          <Dardo x={540} y={900} s={1.6} />
        </g>
        <Texto x={540} y={1080} size={40} color={C.white} op={aparece(t, T.suave)}>
          espuma suave
        </Texto>
        <Texto x={540} y={1150} size={40} color="#5AD08A" op={aparece(t, T.lastima)}>
          no lastima
        </Texto>
      </g>
      <g opacity={aparece(t, T.recto - 0.3)}>
        <line x1={120} y1={1000} x2={960} y2={1000} stroke={C.grey} strokeWidth={4} strokeDasharray="20 14" />
        <Dardo x={160 + vuelo * 700} y={1000} s={0.6} />
        <Estelas x={100 + vuelo * 700} y={1000} t={t} />
        {new Array(5).fill(0).map((_, k) => (
          <line key={k} x1={160 + k * 175} y1={1080} x2={160 + k * 175} y2={1110} stroke={C.grey} strokeWidth={4} />
        ))}
        <Texto x={540} y={1190} size={44} color={C.yellow} op={aparece(t, T.veinte)}>
          ~20 metros, recto
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿por qué la punta pesada?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.esSuave], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Suave: 1 g, 20 m/s, muy poca energía, repartida en una punta ancha de goma
export const Suave: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rep = aparece(t, T.reparte);
  return (
    <Lienzo zoom={interpolate(t, [T.esSuave, T.pero], [1, 1.04])}>
      <g opacity={1 - rep}>
        <rect x={340} y={900} width={400} height={40} rx={10} fill="#5A5A66" opacity={aparece(t, T.gramo)} />
        <rect x={420} y={940} width={240} height={140} rx={20} fill="#3A3A44" opacity={aparece(t, T.gramo)} />
        <Dardo x={540} y={860} s={0.9} />
        <Texto x={540} y={1030} size={50} color={C.yellow} op={aparece(t, T.gramo)}>
          1 g
        </Texto>
        <Texto x={540} y={600} size={44} color={C.cyan} op={aparece(t, T.sale)}>
          ~20 m/s
        </Texto>
        <g opacity={aparece(t, T.energia)}>
          <Texto x={540} y={1200} size={36} color={C.white}>
            energía
          </Texto>
          <rect x={290} y={1230} width={500} height={30} rx={10} fill="#2A2440" />
          <rect x={290} y={1230} width={40} height={30} rx={10} fill={C.orange} />
        </g>
      </g>
      <g opacity={rep}>
        <Dardo x={420} y={900} s={1.6} />
        <rect x={720} y={700} width={40} height={400} fill="#C89A7A" />
        {[-120, -60, 0, 60, 120].map((dy, k) => (
          <path key={k} d={`M 700 ${900 + dy * 0.4} L 720 ${900 + dy}`} stroke={C.yellow} strokeWidth={6} opacity={aparece(t, T.ancha)} />
        ))}
        <Texto x={540} y={1200} size={40} color={C.yellow} op={aparece(t, T.ancha)}>
          punta ancha: reparte el golpe
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. El truco está en el peso: punta de goma más pesada → centro de gravedad adelante
export const Peso: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cg = aparece(t, T.centro);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pero, T.si], [1, 1.04])}>
        <Texto x={540} y={600} size={46} color={C.yellow} op={aparece(t, T.truco) * (1 - aparece(t, T.punta))}>
          el truco: el peso
        </Texto>
        <g opacity={aparece(t, T.punta)}>
          <Dardo x={540} y={900} s={2} cg={cg} />
          <Texto x={760} y={1040} size={36} color={GOMA}>
            goma: pesada
          </Texto>
          <Texto x={300} y={1040} size={36} color={ESPUMA} op={aparece(t, T.cuerpo)}>
            espuma: liviana
          </Texto>
        </g>
        <path d="M 680 760 L 680 700" stroke="#fff" strokeWidth={6} opacity={cg} />
        <Texto x={680} y={680} size={36} color={C.white} op={cg}>
          centro de gravedad
        </Texto>
        <Texto x={540} y={1200} size={42} color={C.yellow} op={aparece(t, T.adelante)}>
          ¡queda adelante!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.adelante} color={C.yellow} />
    </>
  );
};

// E. Si se tuerce, el aire empuja más la cola liviana y lo endereza (como un volante de bádminton)
export const Endereza: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ang = interpolate(t, [T.tuerce, T.tuerce + 0.4], [0, -30], clamp) * (1 - interpolate(t, [T.endereza, T.endereza + 0.8], [0, 1], clamp));
  const pluma = aparece(t, T.pluma);
  return (
    <Lienzo zoom={interpolate(t, [T.si, T.porEso], [1, 1.04])}>
      <g opacity={1 - pluma * 0.7}>
        <Dardo x={600} y={880} s={1.6} rot={ang} cg={1} />
        <g opacity={aparece(t, T.aire)}>
          {[0, 1, 2, 3].map((k) => {
            const u = (t * 1.5 + k / 4) % 1;
            return <path key={k} d={`M ${700 - u * 500} ${700 + k * 30} L ${780 - u * 500} ${700 + k * 30}`} stroke={C.cyan} strokeWidth={6} opacity={1 - u} />;
          })}
          <path d="M 370 1130 L 370 1060" stroke={C.cyan} strokeWidth={14} />
          <path d="M 345 1070 L 370 1035 L 395 1070 Z" fill={C.cyan} />
        </g>
        <Texto x={540} y={1190} size={40} color={C.cyan} op={aparece(t, T.cola)}>
          el aire empuja la cola
        </Texto>
        <Texto x={540} y={1250} size={40} color={C.yellow} op={aparece(t, T.endereza)}>
          y lo endereza
        </Texto>
      </g>
      <g opacity={pluma} transform="translate(540 1360)">
        <path d="M 60 0 L -120 -70 L -120 70 Z" fill="#E8E8EE" />
        <circle cx={70} cy={0} r={34} fill="#E8E8EE" />
        <Texto x={0} y={110} size={34} color={C.white}>
          igual que un volante de bádminton
        </Texto>
      </g>
    </Lienzo>
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
