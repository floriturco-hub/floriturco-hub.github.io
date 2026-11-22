import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/fotocrom/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  sales: 2.3,
  techo: 4.34,
  final: 6.32,
  el: 9.02,
  moleculas: 10.42,
  capa: 12.98,
  normal: 14.52,
  claro: 17.48,
  pero: 18.88,
  uv: 19.38,
  abren: 22.12,
  abiertas: 22.94,
  oscurece: 25.94,
  bajo: 27.1,
  aclara: 30.96,
  y: 32.2,
  parabrisas: 32.54,
  auto: 35.08,
  porEso: 37.14,
  fin: 39.3,
};

const UV = "#A85AE8";
const LENTE_OSC = "#3A2A1A";

// Lentes con oscuridad (0..1)
const Lentes: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly osc: number }> = ({ x, y, s, osc }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-1, 1].map((l) => (
      <g key={l}>
        <ellipse cx={l * 170} cy={0} rx={150} ry={110} fill="#A8C8E8" opacity={0.25} />
        <ellipse cx={l * 170} cy={0} rx={150} ry={110} fill={LENTE_OSC} opacity={osc * 0.9} />
        <ellipse cx={l * 170} cy={0} rx={150} ry={110} fill="none" stroke="#C8C4D8" strokeWidth={12} />
        <ellipse cx={l * 170 - 60} cy={-40} rx={30} ry={14} fill={C.white} opacity={0.3} />
      </g>
    ))}
    <path d="M -20 -20 Q 0 -40 20 -20" stroke="#C8C4D8" strokeWidth={12} fill="none" />
  </g>
);

// Sol
const Sol: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly op?: number }> = ({ x, y, t, op = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${t * 20})`} opacity={op}>
    {new Array(10).fill(0).map((_, k) => (
      <line key={k} x1={0} y1={-80} x2={0} y2={-110} stroke={C.yellow} strokeWidth={10} strokeLinecap="round" transform={`rotate(${k * 36})`} />
    ))}
    <circle r={60} fill={C.yellow} />
  </g>
);

// A. Gancho: ¿por qué estos lentes se oscurecen solos?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const osc = interpolate(t, [0.3, 1.4], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.sales], [1.12, 1])}>
        <Sol x={820} y={540} t={t} op={osc} />
        <Lentes x={540} y={900} s={1.3} osc={osc} />
        <Texto x={540} y={1280} size={110} color={C.yellow} op={interpolate(t, [0.8, 1.1], [0, 1], clamp)}>
          ?
        </Texto>
      </Lienzo>
      <Flash t={t} d={1.06} color={C.yellow} />
    </>
  );
};

// B. Al sol se oscurecen y bajo techo se aclaran + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const osc = interpolate(t, [T.sales, T.sales + 1, T.techo, T.techo + 1.2], [0, 1, 1, 0], clamp);
  const techo = aparece(t, T.techo - 0.3);
  return (
    <Lienzo zoom={interpolate(t, [T.sales, T.el], [1, 1.05])}>
      <Sol x={820} y={560} t={t} op={1 - techo} />
      <g opacity={techo}>
        <path d="M 200 640 L 540 440 L 880 640 Z" fill="#6A4A3A" />
        <rect x={260} y={640} width={560} height={30} fill="#4A3A2A" />
      </g>
      <Lentes x={540} y={880} s={1} osc={osc} />
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.el], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={38}>
          por qué fallan dentro del auto: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Molécula fotocrómica: abierta 0 = doblada, 1 = recta
const Molecula: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly abierta: number; readonly rot?: number }> = ({ x, y, s, abierta, rot = 0 }) => {
  const ang = interpolate(abierta, [0, 1], [70, 0]);
  const color = abierta > 0.5 ? "#8A5A2A" : "#C8C4D8";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <polygon points="-60,-17 -45,-30 -25,-30 -10,-17 -25,-4 -45,-4" transform="translate(0 17)" fill="none" stroke={color} strokeWidth={6} />
      <g transform={`rotate(${-ang} -10 0)`}>
        <line x1={-10} y1={0} x2={10} y2={0} stroke={color} strokeWidth={6} />
        <polygon points="10,-13 25,-26 45,-26 60,-13 45,0 25,0" transform="translate(0 13)" fill="none" stroke={color} strokeWidth={6} />
      </g>
    </g>
  );
};

// Campo de moléculas en una lente ampliada
const Campo: React.FC<{ readonly abierta: number; readonly fondo?: number }> = ({ abierta, fondo = 0 }) => (
  <g>
    <circle cx={540} cy={820} r={330} fill="#A8C8E8" opacity={0.15} />
    <circle cx={540} cy={820} r={330} fill={LENTE_OSC} opacity={fondo * 0.7} />
    <circle cx={540} cy={820} r={330} fill="none" stroke="#C8C4D8" strokeWidth={10} />
    {new Array(14).fill(0).map((_, k) => {
      const a = random(`m${k}`) * Math.PI * 2;
      const d = Math.sqrt(random(`md${k}`)) * 260;
      return <Molecula key={k} x={540 + Math.cos(a) * d} y={820 + Math.sin(a) * d} s={0.9} abierta={abierta} rot={random(`mr${k}`) * 360} />;
    })}
  </g>
);

// C. El lente tiene millones de moléculas especiales, en el plástico o en una capa
export const Moleculas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.el, T.normal], [1, 1.04])}>
      <g opacity={aparece(t, T.moleculas - 0.4)}>
        <Campo abierta={0} />
      </g>
      <Texto x={540} y={1240} size={40} color={C.white} op={aparece(t, T.moleculas)}>
        millones de moléculas especiales
      </Texto>
    </Lienzo>
  );
};

// Rayos de luz visible que cruzan (pasan) o se detienen (absorbidos)
const RayosVisibles: React.FC<{ readonly t: number; readonly absorbe: number }> = ({ t, absorbe }) => (
  <g>
    {["#E8414F", "#F8C848", "#5AC878", "#08D8E8"].map((c, k) => {
      const u = (t * 0.6 + k / 4) % 1;
      const x = 120 + u * 840;
      const parada = absorbe > 0.5 && x > 440;
      return <circle key={c} cx={parada ? 440 : x} cy={700 + k * 80} r={16} fill={c} opacity={parada ? 0.2 : 1} />;
    })}
  </g>
);

// D. Normalmente están dobladas y no atrapan la luz visible: el lente se ve claro
export const Dobladas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.normal, T.pero], [1, 1.04])}>
      <Campo abierta={0} />
      <RayosVisibles t={t} absorbe={0} />
      <Texto x={540} y={1240} size={40} color={C.white} op={aparece(t, T.normal + 0.6)}>
        dobladas: la luz pasa
      </Texto>
      <Texto x={540} y={1310} size={38} color="#A8C8E8" op={aparece(t, T.claro)}>
        lente claro
      </Texto>
    </Lienzo>
  );
};

// E. La luz ultravioleta les da un golpe de energía y se abren
export const Ultravioleta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const abre = interpolate(t, [T.abren - 0.6, T.abren + 0.3], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pero, T.abiertas], [1, 1.04])}>
        <Campo abierta={abre} />
        {[0, 1, 2].map((k) => (
          <path
            key={k}
            d={new Array(20)
              .fill(0)
              .map((_, i) => `${i === 0 ? "M" : "L"} ${100 + i * 22 + ((t * 200) % 44)} ${560 + k * 100 + Math.sin(i * 1.4 + t * 10) * 16}`)
              .join(" ")}
            stroke={UV}
            strokeWidth={6}
            fill="none"
            opacity={aparece(t, T.uv)}
          />
        ))}
        <Texto x={540} y={1240} size={40} color={UV} op={aparece(t, T.uv)}>
          luz ultravioleta
        </Texto>
        <Texto x={540} y={1310} size={38} color={C.white} op={aparece(t, T.abren)}>
          ¡se abren!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.abren} color={UV} />
    </>
  );
};

// F. Abiertas absorben la luz visible: el lente se oscurece
export const Absorben: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const osc = interpolate(t, [T.abiertas, T.oscurece + 0.4], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.abiertas, T.bajo], [1, 1.04])}>
      <Campo abierta={1} fondo={osc} />
      <RayosVisibles t={t} absorbe={1} />
      <Texto x={540} y={1240} size={40} color={C.white} op={aparece(t, T.abiertas + 0.6)}>
        abiertas: absorben la luz
      </Texto>
      <Texto x={540} y={1310} size={38} color="#C8A070" op={aparece(t, T.oscurece)}>
        lente oscuro
      </Texto>
    </Lienzo>
  );
};

// G. Bajo techo, sin ultravioleta, se cierran poco a poco y el lente se aclara
export const Interior: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cierra = interpolate(t, [T.bajo + 0.6, T.aclara + 0.6], [1, 0], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.bajo, T.y], [1, 1.04])}>
      <path d="M 160 480 L 540 380 L 920 480 Z" fill="#6A4A3A" />
      <Campo abierta={cierra} fondo={cierra} />
      <Texto x={540} y={1240} size={40} color={C.white} op={aparece(t, T.bajo + 0.4)}>
        sin UV: se cierran poco a poco
      </Texto>
      <Texto x={540} y={1310} size={38} color="#A8C8E8" op={aparece(t, T.aclara)}>
        el lente se aclara
      </Texto>
    </Lienzo>
  );
};

// H. El parabrisas bloquea casi todo el ultravioleta: dentro del auto casi no se oscurecen
export const Auto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.y, T.porEso], [1, 1.04])}>
      <Sol x={180} y={520} t={t} />
      {/* parabrisas */}
      <path d="M 420 480 L 520 1160" stroke="#8AB8E8" strokeWidth={26} opacity={0.8} />
      {[0, 1, 2].map((k) => {
        const u = ((t * 0.7 + k / 3) % 1);
        const x = 240 + u * 400;
        return (
          <circle key={k} cx={Math.min(x, 440 + k * 30)} cy={600 + k * 150 + u * 40} r={14} fill={UV} opacity={x > 460 ? 0.2 : 1} />
        );
      })}
      <Lentes x={760} y={820} s={0.65} osc={0.08} />
      <Texto x={420} y={1240} size={38} color="#8AB8E8" op={aparece(t, T.parabrisas)}>
        el parabrisas bloquea el UV
      </Texto>
      <Texto x={540} y={1320} size={36} color={C.white} op={aparece(t, T.auto)}>
        dentro del auto, casi no se oscurecen
      </Texto>
    </Lienzo>
  );
};

// I. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const osc = interpolate(t, [T.porEso, T.fin], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Sol x={820} y={540} t={t} op={osc} />
      <Lentes x={540} y={900} s={1.3} osc={osc} />
      <Texto x={540} y={1280} size={110} color={C.yellow} op={interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp)}>
        ?
      </Texto>
    </Lienzo>
  );
};
