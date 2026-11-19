import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/controlremoto/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  aprietas: 1.88, // aprietas
  responde: 3.82, // responde
  camara: 6.66, // camara
  final: 8.46, // final
  punta: 9.92, // punta
  infrarrojo: 11.32, // infrarrojo
  rojo: 13.44, // rojo
  ojos: 14.16, // ojos
  parpadea: 16.60, // parpadea
  destellos: 17.76, // destellos
  codigo: 19.78, // codigo
  boton: 21.64, // boton
  vibra: 23.98, // vibra
  segundo: 25.86, // segundo
  sol: 28.18, // sol
  sensor: 29.68, // sensor
  obedece: 31.64, // obedece
  sensor2: 32.66, // sensor
  morada: 36.44, // morada
  asi: 37.22, // asi
  fin: 38.68, // FIN
};

const IR = "#B86AF0";

const Tele: React.FC<{ readonly x: number; readonly y: number; readonly canal: number; readonly s?: number }> = ({ x, y, canal, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-300} y={-190} width={600} height={360} rx={20} fill="#1A1A22" stroke="#5A5A66" strokeWidth={8} />
    <rect x={-270} y={-165} width={540} height={300} rx={8} fill={["#2A6AC8", "#C84A6A", "#4AC88A", "#C8A040"][canal % 4]} opacity={0.8} />
    <Texto x={0} y={10} size={70} color="#fff">
      {String(canal)}
    </Texto>
    <circle cx={250} cy={150} r={8} fill={IR} opacity={0.6} />
    <rect x={-60} y={170} width={120} height={30} fill="#3A3A44" />
  </g>
);

const Control: React.FC<{ readonly x: number; readonly y: number; readonly rot?: number; readonly luz?: number; readonly s?: number }> = ({ x, y, rot = 0, luz = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-60} y={-220} width={120} height={440} rx={40} fill="#2A2A34" stroke="#4A4A56" strokeWidth={6} />
    {new Array(9).fill(0).map((_, k) => (
      <circle key={k} cx={-30 + (k % 3) * 30} cy={-100 + Math.floor(k / 3) * 50} r={12} fill="#5A5A66" />
    ))}
    <circle cx={0} cy={-170} r={20} fill={C.red} />
    <circle cx={0} cy={-224} r={12} fill={luz > 0 ? IR : "#3A3A44"} opacity={luz > 0 ? luz : 1} />
  </g>
);

const Rayo: React.FC<{ readonly x1: number; readonly y1: number; readonly x2: number; readonly y2: number; readonly t: number; readonly op: number; readonly visible?: boolean }> = ({ x1, y1, x2, y2, t, op, visible = false }) => (
  <g opacity={op}>
    {new Array(8).fill(0).map((_, k) => {
      const u = (t * 1.5 + k / 8) % 1;
      return <circle key={k} cx={x1 + (x2 - x1) * u} cy={y1 + (y2 - y1) * u} r={8} fill={visible ? IR : "#5A5A66"} opacity={visible ? 0.9 : 0.35} />;
    })}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Tele x={540} y={760} canal={3} />
    <Control x={540} y={1400} rot={0} luz={0} />
    <Rayo x1={540} y1={1170} x2={790} y2={910} t={t} op={1} />
    <Texto x={860} y={1250} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo te entiende este televisor?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.aprietas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Aprietas un botón y la tele responde sin luz visible; la cámara del celular sí la ve + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cam = aparece(t, T.camara);
  return (
    <Lienzo zoom={interpolate(t, [T.aprietas, T.punta], [1, 1.04])}>
      <Tele x={540} y={760} canal={t > T.responde ? 4 : 3} />
      <Control x={360} y={1400} luz={0} />
      <Rayo x1={360} y1={1170} x2={700} y2={910} t={t} op={aparece(t, T.aprietas)} />
      <g opacity={cam}>
        <rect x={620} y={1140} width={300} height={500} rx={40} fill="#1A1A22" stroke="#5A5A66" strokeWidth={8} />
        <rect x={640} y={1170} width={260} height={440} rx={24} fill="#0A0A10" />
        <rect x={730} y={1300} width={80} height={280} rx={30} fill="#2A2A34" />
        <circle cx={770} cy={1300} r={34} fill={IR} opacity={0.6 + 0.4 * Math.sin(t * 20)} />
        <circle cx={770} cy={1300} r={70} fill={IR} opacity={0.25} />
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿por qué la cámara sí la ve?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.punta], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. En la punta hay un foco infrarrojo: una luz más allá del rojo que tus ojos no detectan
export const Infrarrojo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cols = ["#8A4AE0", "#3A6AE0", "#3AC8E0", "#4AC84A", "#E8E040", "#F0A030", "#E04040"];
  return (
    <Lienzo zoom={interpolate(t, [T.punta, T.parpadea], [1, 1.04])}>
      <Control x={540} y={720} rot={90} luz={aparece(t, T.infrarrojo)} s={0.8} />
      {cols.map((c, k) => (
        <rect key={k} x={120 + k * 90} y={1000} width={90} height={140} fill={c} />
      ))}
      <rect x={750} y={1000} width={210} height={140} fill="#1A0A20" stroke={IR} strokeWidth={4} strokeDasharray="12 8" opacity={aparece(t, T.rojo)} />
      <Texto x={855} y={1080} size={30} color={IR} op={aparece(t, T.rojo)}>
        infrarrojo
      </Texto>
      <Texto x={430} y={1200} size={30} color={C.white}>
        luz visible
      </Texto>
      <g opacity={aparece(t, T.ojos)}>
        <ellipse cx={855} cy={1300} rx={70} ry={40} fill="#fff" />
        <circle cx={855} cy={1300} r={22} fill="#3A2A22" />
        <line x1={780} y1={1250} x2={930} y2={1350} stroke={C.red} strokeWidth={10} />
      </g>
      <Texto x={540} y={580} size={38} color={IR} op={aparece(t, T.infrarrojo)}>
        foco infrarrojo
      </Texto>
    </Lienzo>
  );
};

// D. Parpadea en un patrón de destellos largos y cortos, un código de unos y ceros; cada botón, el suyo
export const Codigo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const bits = [1, 0, 1, 1, 0, 0, 1, 0];
  const bits2 = [1, 1, 0, 1, 0, 1, 0, 0];
  const tren = (b: number[], y: number, col: string, op: number) => {
    let x = 140;
    return (
      <g opacity={op}>
        {b.map((v, k) => {
          const w = v ? 60 : 26;
          const r = <rect key={k} x={x} y={y - 60} width={w} height={60} fill={col} />;
          const lab = (
            <Texto key={`l${k}`} x={x + w / 2} y={y + 40} size={26} color={C.white}>
              {String(v)}
            </Texto>
          );
          x += w + 34;
          return (
            <g key={k}>
              {r}
              {lab}
            </g>
          );
        })}
      </g>
    );
  };
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.parpadea, T.vibra], [1, 1.04])}>
        {tren(bits, 900, IR, aparece(t, T.destellos))}
        <Texto x={540} y={760} size={36} color={IR} op={aparece(t, T.destellos)}>
          botón «canal +»
        </Texto>
        {tren(bits2, 1200, C.cyan, aparece(t, T.boton))}
        <Texto x={540} y={1060} size={36} color={C.cyan} op={aparece(t, T.boton)}>
          botón «volumen +»
        </Texto>
        <Texto x={540} y={580} size={40} color={C.white} op={aparece(t, T.codigo)}>
          código de unos y ceros
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.codigo} color={IR} />
    </>
  );
};

// E. Cada destello vibra 38.000 veces por segundo para no confundirse con el sol o los focos
export const Portadora: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.vibra, T.sensor], [1, 1.04])}>
      <rect x={140} y={760} width={800} height={200} fill="none" stroke={IR} strokeWidth={4} />
      <path
        d={`M 140 860 ${new Array(80)
          .fill(0)
          .map((_, i) => `L ${140 + i * 10} ${860 + (i % 2 ? -70 : 70)}`)
          .join(" ")}`}
        stroke={IR}
        strokeWidth={4}
        fill="none"
        opacity={aparece(t, T.vibra)}
      />
      <Texto x={540} y={700} size={38} color={IR} op={aparece(t, T.segundo)}>
        38.000 veces por segundo
      </Texto>
      <g opacity={aparece(t, T.sol)}>
        <circle cx={300} cy={1200} r={80} fill={C.yellow} />
        <circle cx={760} cy={1200} r={60} fill="#F8F0C8" />
        <line x1={140} y1={1380} x2={940} y2={1380} stroke={C.grey} strokeWidth={8} />
        <Texto x={540} y={1460} size={34} color={C.grey}>
          sol y focos: luz constante, se ignora
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. El sensor de la tele lee el código y obedece; el de tu cámara capta infrarrojo y lo muestra morado
export const Sensor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cam = aparece(t, T.sensor2);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.sensor, T.asi], [1, 1.04])}>
        <g opacity={1 - cam}>
          <Tele x={540} y={900} canal={t > T.obedece ? 5 : 4} />
          <Texto x={540} y={1250} size={40} color="#5AD08A" op={aparece(t, T.obedece)}>
            lee el código y obedece
          </Texto>
        </g>
        <g opacity={cam}>
          <rect x={340} y={640} width={400} height={720} rx={50} fill="#1A1A22" stroke="#5A5A66" strokeWidth={10} />
          <rect x={366} y={680} width={348} height={640} rx={30} fill="#0A0A10" />
          <rect x={490} y={900} width={100} height={380} rx={40} fill="#2A2A34" />
          <circle cx={540} cy={900} r={40} fill={IR} opacity={0.6 + 0.4 * Math.sin(t * 20)} />
          <circle cx={540} cy={900} r={90} fill={IR} opacity={0.25 * aparece(t, T.morada)} />
          <Texto x={540} y={1440} size={40} color={IR} op={aparece(t, T.morada)}>
            tu cámara lo ve morado
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.sensor2} color={IR} />
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
