import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/maquinacoser/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  hilos: 4.58, // hilos
  bobina: 7.38, // bobina
  final: 8.24, // final
  puntadas: 9.38, // puntadas
  ojo: 12.02, // ojo
  atraviesa: 13.84, // atraviesa
  lazada: 17.48, // lazada
  gancho: 19.52, // gancho
  atrapa: 20.52, // atrapa
  bobina2: 22.74, // bobina
  segundo: 24.02, // segundo
  tensan: 26.24, // tensan
  entrelazados: 27.70, // entrelazados
  puntada: 29.94, // puntada
  repite: 31.34, // repite
  cientos: 33.66, // cientos
  asi: 35.58, // asi
  fin: 37.62, // FIN
};

const HILO1 = C.yellow;
const HILO2 = C.cyan;
const TELA = "#C86A9A";

// Corte lateral: tela en y=1000, aguja que sube y baja (fase 0..1), lazada abajo
const Corte: React.FC<{ readonly fase: number; readonly lazada?: number; readonly gancho?: number; readonly t?: number }> = ({ fase, lazada = 0, gancho = 0 }) => {
  const yA = 760 + 300 * Math.max(0, Math.sin(fase * Math.PI * 2));
  return (
    <g>
      <rect x={140} y={985} width={800} height={30} rx={8} fill={TELA} opacity={0.7} />
      {/* aguja */}
      <rect x={532} y={yA - 400} width={16} height={400} fill="#C8CCD8" />
      <path d={`M 532 ${yA} L 548 ${yA} L 540 ${yA + 30} Z`} fill="#C8CCD8" />
      <ellipse cx={540} cy={yA - 10} rx={4} ry={10} fill="#1A1A2A" />
      <path d={`M 540 ${yA - 10} L 540 600`} stroke={HILO1} strokeWidth={5} />
      {/* lazada */}
      <path d={`M 540 1015 q ${-60 - 40 * gancho} ${80 * lazada} 0 ${120 * lazada} q ${60 + 40 * gancho} ${-40 * lazada} 0 ${-120 * lazada}`} stroke={HILO1} strokeWidth={5} fill="none" opacity={lazada} />
      {/* bobina */}
      <g transform="translate(540 1250)">
        <circle cx={0} cy={0} r={70} fill="#5A6070" />
        <circle cx={0} cy={0} r={50} fill={HILO2} opacity={0.8} />
        <circle cx={0} cy={0} r={14} fill="#2A2E3A" />
      </g>
      <path d="M 590 1210 Q 700 1100 940 1015" stroke={HILO2} strokeWidth={5} fill="none" />
    </g>
  );
};

const Maquina: React.FC<{ readonly t: number }> = ({ t }) => {
  const yA = 1010 + 40 * Math.sin(t * 14);
  return (
    <g>
      <path d="M 160 1150 L 160 760 Q 160 680 240 680 L 820 680 Q 900 680 900 760 L 900 820 L 760 820 L 760 760 L 300 760 L 300 1150 Z" fill="#E8E6F0" />
      <rect x={120} y={1150} width={860} height={90} rx={20} fill="#C8CCD8" />
      <rect x={780} y={820} width={60} height={160} fill="#E8E6F0" />
      <rect x={804} y={980} width={12} height={yA - 980} fill="#8A90A0" />
      <rect x={300} y={1130} width={680} height={22} fill={TELA} opacity={0.8} />
      <circle cx={940} cy={760} r={60} fill="#8A90A0" />
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Maquina t={t} />
    <Texto x={880} y={560} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo cose esta máquina sin atravesar?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.hilos], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Une la tela con dos hilos, pero la aguja nunca pasa al otro lado de la bobina + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.hilos, T.ojo], [1, 1.04])}>
      <Corte fase={(t * 0.6) % 1} lazada={0} />
      <Texto x={300} y={700} size={34} color={HILO1} op={aparece(t, T.hilos)}>
        hilo de arriba
      </Texto>
      <Texto x={790} y={1260} size={34} color={HILO2} op={aparece(t, T.hilos)}>
        hilo de abajo
      </Texto>
      <Texto x={540} y={1440} size={36} color={C.white} op={aparece(t, T.bobina)}>
        la aguja nunca rodea la bobina
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cuántas puntadas por minuto?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.ojo], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Ojo en la punta: baja, atraviesa la tela y al subir un poco forma una lazada abajo
export const Lazada: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fase = interpolate(t, [T.atraviesa, T.lazada], [0.05, 0.3], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.ojo, T.gancho], [1, 1.04])}>
        <Corte fase={fase} lazada={aparece(t, T.lazada)} />
        <Texto x={790} y={700} size={32} color={C.white} op={aparece(t, T.ojo)}>
          el ojo está en la punta
        </Texto>
        <Texto x={540} y={1440} size={40} color={HILO1} op={aparece(t, T.lazada)}>
          se forma una lazada
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.lazada} color={HILO1} />
    </>
  );
};

// D. Un gancho giratorio atrapa la lazada y la pasa alrededor de la bobina
export const Garfio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const giro = interpolate(t, [T.atrapa, T.segundo + 0.6], [0, 360], clamp);
  const rad = (giro * Math.PI) / 180;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.gancho, T.tensan], [1, 1.04])}>
        <g transform="translate(540 1050)">
          <circle cx={0} cy={0} r={240} fill="none" stroke="#5A6070" strokeWidth={24} />
          <circle cx={0} cy={0} r={110} fill={HILO2} opacity={0.8} />
          <circle cx={0} cy={0} r={26} fill="#2A2E3A" />
          <g transform={`rotate(${giro})`} opacity={aparece(t, T.gancho)}>
            <path d="M 0 -240 Q 60 -250 90 -210" stroke={C.white} strokeWidth={14} fill="none" strokeLinecap="round" />
          </g>
          {/* lazada que rodea la bobina */}
          <path
            d={`M 0 -330 Q ${Math.sin(rad) * 230} ${-Math.cos(rad) * 230} ${Math.sin(rad) * 190} ${-Math.cos(rad) * 190}`}
            stroke={HILO1}
            strokeWidth={8}
            fill="none"
            opacity={aparece(t, T.atrapa)}
          />
          <circle cx={0} cy={0} r={190} fill="none" stroke={HILO1} strokeWidth={6} strokeDasharray={`${(giro / 360) * 1194} 2000`} transform="rotate(-90)" opacity={0.8} />
        </g>
        <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.gancho)}>
          gancho giratorio
        </Texto>
        <Texto x={540} y={1420} size={36} color={HILO1} op={aparece(t, T.atrapa)}>
          atrapa la lazada y rodea la bobina
        </Texto>
        <Texto x={540} y={1490} size={34} color={HILO2} op={aparece(t, T.segundo)}>
          donde está el segundo hilo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.atrapa} color={C.white} />
    </>
  );
};

// E. Al subir la aguja se tensan los dos hilos y quedan entrelazados dentro de la tela: la puntada
export const Puntada: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = interpolate(t, [T.tensan, T.entrelazados + 0.6], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.tensan, T.repite], [1, 1.04])}>
        <rect x={100} y={940} width={880} height={120} rx={14} fill={TELA} opacity={0.6} />
        {new Array(4).fill(0).map((_, k) => {
          const x = 220 + k * 220;
          return (
            <g key={k}>
              <path d={`M ${x - 110} ${930} L ${x} ${930} L ${x} ${1000 + 60 * (1 - u)}`} stroke={HILO1} strokeWidth={10} fill="none" />
              <path d={`M ${x - 110} ${1070} L ${x} ${1070} L ${x} ${1000 + 60 * (1 - u) - 10}`} stroke={HILO2} strokeWidth={10} fill="none" />
              <circle cx={x} cy={1000} r={18} fill="none" stroke={C.white} strokeWidth={4} opacity={u} />
            </g>
          );
        })}
        <Texto x={540} y={760} size={38} color={C.white} op={aparece(t, T.tensan)}>
          se tensan los dos hilos
        </Texto>
        <Texto x={540} y={1260} size={36} color={C.cyan} op={aparece(t, T.entrelazados)}>
          entrelazados dentro de la tela
        </Texto>
        <Texto x={540} y={1350} size={48} color={C.yellow} op={aparece(t, T.puntada)}>
          = puntada
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.puntada} color={C.yellow} />
    </>
  );
};

// F. Todo se repite: cientos de puntadas por minuto
export const Velocidad: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.repite, T.asi], [1, 1.04])}>
      <Maquina t={t * 2} />
      <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.repite)}>
        se repite sin parar
      </Texto>
      <Texto x={540} y={1420} size={46} color={C.yellow} op={aparece(t, T.cientos)}>
        cientos de puntadas por minuto
      </Texto>
    </Lienzo>
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
