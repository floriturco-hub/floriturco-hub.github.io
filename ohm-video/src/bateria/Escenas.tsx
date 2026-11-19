import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/bateria/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  tras: 2.0,
  apaga0: 3.58,
  lento0: 4.84,
  final: 5.56,
  cuando: 8.6,
  pide: 10.56,
  corriente: 11.58,
  una: 12.96,
  pero: 15.26,
  quimica: 16.44,
  resistencia: 17.9,
  entonces: 19.64,
  pico: 20.76,
  cae: 22.32,
  si: 23.5,
  apaga: 25.2,
  para: 26.36,
  fabricantes: 27.92,
  limitan: 28.52,
  gastada: 31.34,
  la: 32.32,
  cambiar: 34.0,
  porEso: 35.32,
  fin: 37.18,
};

const VERDE = "#3CC878";

// Celular con pantalla; `luz` 0-1 apaga la pantalla
const Celular: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly luz?: number;
  readonly children?: React.ReactNode;
}> = ({ x, y, s, luz = 1, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-190} y={-370} width={380} height={740} rx={50} fill="#2A2640" stroke="#5A5478" strokeWidth={8} />
    <rect x={-165} y={-330} width={330} height={640} rx={24} fill="#000" />
    <rect x={-165} y={-330} width={330} height={640} rx={24} fill="#1C2A50" opacity={luz} />
    <rect x={-40} y={-352} width={80} height={10} rx={5} fill="#5A5478" />
    <g opacity={luz}>{children}</g>
  </g>
);

// Rueda de carga que gira lento
const Rueda: React.FC<{ readonly t: number; readonly r?: number }> = ({ t, r = 60 }) => (
  <g transform={`rotate(${t * 140})`}>
    {new Array(8).fill(0).map((_, k) => {
      const a = (k / 8) * Math.PI * 2;
      return (
        <circle
          key={k}
          cx={Math.cos(a) * r}
          cy={Math.sin(a) * r}
          r={r * 0.18}
          fill={C.white}
          opacity={0.2 + (k / 8) * 0.8}
        />
      );
    })}
  </g>
);

// Batería: nivel 0-1, color, y opcionalmente "vieja" (abombada, opaca)
const Bateria: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly nivel: number;
  readonly color: string;
  readonly vieja?: number;
}> = ({ x, y, s, nivel, color, vieja = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-40} y={-230} width={80} height={30} rx={8} fill="#8C88A8" />
    <rect
      x={-110 - vieja * 12}
      y={-200}
      width={220 + vieja * 24}
      height={400}
      rx={30 + vieja * 20}
      fill="#1A1630"
      stroke="#8C88A8"
      strokeWidth={10}
    />
    <rect x={-88} y={180 - 360 * nivel} width={176} height={360 * nivel} rx={14} fill={color} />
  </g>
);

// Chip del procesador
const Chip: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly brillo: number }> = ({
  x,
  y,
  s,
  brillo,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {new Array(5).fill(0).map((_, k) => (
      <g key={k}>
        <rect x={-100 + k * 45 - 6} y={-140} width={12} height={40} fill="#8C88A8" />
        <rect x={-100 + k * 45 - 6} y={100} width={12} height={40} fill="#8C88A8" />
        <rect x={-140} y={-100 + k * 45 - 6} width={40} height={12} fill="#8C88A8" />
        <rect x={100} y={-100 + k * 45 - 6} width={40} height={12} fill="#8C88A8" />
      </g>
    ))}
    <rect x={-110} y={-110} width={220} height={220} rx={16} fill="#3A3650" stroke={C.yellow} strokeWidth={6 + brillo * 6} />
    <rect x={-60} y={-60} width={120} height={120} rx={8} fill={C.yellow} opacity={0.25 + brillo * 0.75} />
    <Texto x={0} y={12} size={34} color="#1A1630">
      CPU
    </Texto>
  </g>
);

// Rayo dibujado (sin glifos)
const Rayo: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly color: string }> = ({
  x,
  y,
  s,
  color,
}) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M 10 -60 L -30 10 L 0 10 L -15 60 L 35 -15 L 5 -15 L 20 -60 Z"
    fill={color}
  />
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Celular x={540} y={960} s={1.25}>
      <Rueda t={t} r={70} />
    </Celular>
    <Texto x={860} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
    <g opacity={q}>
      <Texto x={540} y={1480} size={44} color={C.red}>
        lento...
      </Texto>
    </g>
  </>
);

// A. Gancho: ¿por qué tu celular viejo va lento?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.tras], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.68} color={C.yellow} />
    </>
  );
};

// B. Tras dos años se traba, se apaga solo o va más lento + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const apagado = interpolate(t, [T.apaga0, T.apaga0 + 0.15, T.lento0 - 0.3, T.lento0], [1, 0, 0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.tras, T.cuando], [1, 1.05])}>
      <Celular x={540} y={840} s={0.95} luz={apagado}>
        <Rueda t={t} r={55} />
      </Celular>
      <Texto x={540} y={450} size={48} color={C.white} op={aparece(t, T.tras)}>
        2 años después
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.cuando], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          cómo devolverle la velocidad: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. El procesador a tope pide de golpe mucha corriente; una batería nueva la entrega sin problema
export const Pico: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tope = aparece(t, T.cuando + 0.6);
  const flujo = aparece(t, T.pide);
  const nueva = aparece(t, T.una);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cuando, T.pero], [1, 1.04])}>
        <Chip x={540} y={600} s={1.1} brillo={tope * (0.7 + 0.3 * Math.sin(t * 20))} />
        <Bateria x={540} y={1180} s={0.8} nivel={0.85} color={VERDE} />
        {[0, 1, 2, 3].map((k) => {
          const u = ((t - T.pide) * 1.6 + k / 4) % 1;
          return (
            <g key={k} opacity={flujo}>
              <Rayo x={540 + (k % 2 ? 40 : -40)} y={980 - u * 180} s={0.6} color={C.yellow} />
            </g>
          );
        })}
        <Texto x={540} y={1440} size={38} color={C.yellow} op={aparece(t, T.corriente) * (1 - nueva)}>
          mucha corriente de golpe
        </Texto>
        <Texto x={540} y={1440} size={40} color={VERDE} op={nueva}>
          nueva: sin problema
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.pide} color={C.yellow} />
    </>
  );
};

// D. Con los años su química se desgasta y su resistencia interna sube
export const Quimica: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const vieja = interpolate(t, [T.quimica, T.resistencia], [0, 1], clamp);
  const r = interpolate(t, [T.resistencia, T.entonces - 0.3], [0.15, 0.9], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.entonces], [1, 1.04])}>
      <Bateria x={300} y={800} s={0.75} nivel={0.85} color={VERDE} />
      <Texto x={300} y={1020} size={36} color={VERDE}>
        nueva
      </Texto>
      <g opacity={aparece(t, T.pero + 0.3)}>
        <Bateria x={780} y={800} s={0.75} nivel={0.85 - vieja * 0.2} color={vieja > 0.5 ? C.orange : VERDE} vieja={vieja} />
        <Texto x={780} y={1020} size={36} color={C.orange}>
          vieja
        </Texto>
        {[0, 1, 2].map((k) => (
          <path
            key={k}
            d={`M ${730 + k * 40} ${700 + k * 50} l 18 22 l -14 14 l 18 24`}
            stroke="#1A1630"
            strokeWidth={6}
            fill="none"
            opacity={vieja}
          />
        ))}
      </g>
      <g opacity={aparece(t, T.resistencia)}>
        <Texto x={540} y={1150} size={36} color={C.white}>
          resistencia interna
        </Texto>
        <rect x={190} y={1200} width={700} height={40} rx={20} fill="#2A2440" />
        <rect x={190} y={1200} width={700 * r} height={40} rx={20} fill={C.red} />
        <path
          d={`M ${190 + 700 * r - 20} 1290 L ${190 + 700 * r} 1260 L ${190 + 700 * r + 20} 1290`}
          stroke={C.red}
          strokeWidth={8}
          fill="none"
        />
      </g>
    </Lienzo>
  );
};

// Curva de voltaje: x de 0 a 1, caída en el pico
const voltaje = (s: number, hondo: number) => {
  const d = Math.exp(-(((s - 0.5) / 0.08) ** 2));
  return 700 + d * hondo;
};

// E. Ante un pico de demanda el voltaje cae de golpe; si baja demasiado, el teléfono se apaga
export const Caida: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.entonces + 0.3, T.cae + 0.6], [0, 1], clamp);
  const x0 = 170;
  const ancho = 740;
  const linea = (hondo: number) =>
    new Array(Math.max(2, Math.round(p * 80)))
      .fill(0)
      .map((_, k, a) => {
        const s = (k / (a.length - 1)) * p;
        return `${k ? "L" : "M"} ${x0 + s * ancho} ${voltaje(s, hondo)}`;
      })
      .join(" ");
  const apagado = interpolate(t, [T.apaga, T.apaga + 0.2], [1, 0], clamp);
  const cel = aparece(t, T.si + 0.6);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.entonces, T.para], [1, 1.04])}>
        <g opacity={1 - cel * 0.85}>
          <line x1={x0} y1={500} x2={x0} y2={1150} stroke={C.grey} strokeWidth={4} />
          <line x1={x0} y1={1150} x2={x0 + ancho} y2={1150} stroke={C.grey} strokeWidth={4} />
          <Texto x={x0 + 10} y={470} size={32} color={C.grey} anchor="start">
            voltaje
          </Texto>
          <line
            x1={x0}
            y1={1000}
            x2={x0 + ancho}
            y2={1000}
            stroke={C.red}
            strokeWidth={5}
            strokeDasharray="20 14"
            opacity={aparece(t, T.si)}
          />
          <Texto x={x0 + ancho} y={1050} size={30} color={C.red} anchor="end" op={aparece(t, T.si)}>
            límite: se apaga
          </Texto>
          <path d={linea(150)} stroke={VERDE} strokeWidth={8} fill="none" opacity={0.6} />
          <path d={linea(380)} stroke={C.orange} strokeWidth={10} fill="none" />
          <g opacity={aparece(t, T.pico)}>
            <Rayo x={x0 + ancho * 0.5} y={560} s={0.8} color={C.yellow} />
            <Texto x={x0 + ancho * 0.5} y={650} size={30} color={C.yellow}>
              pico de demanda
            </Texto>
          </g>
          <Texto x={x0 + 20} y={670} size={28} color={VERDE} anchor="start" op={aparece(t, T.entonces + 0.5)}>
            nueva
          </Texto>
          <Texto x={x0 + 20} y={760} size={28} color={C.orange} anchor="start" op={aparece(t, T.entonces + 0.5)}>
            vieja
          </Texto>
        </g>
        <g opacity={cel}>
          <Celular x={540} y={880} s={0.9} luz={apagado}>
            <Rueda t={t} r={50} />
          </Celular>
          <Texto x={540} y={1440} size={38} color={C.red} op={aparece(t, T.apaga)}>
            se apaga para protegerse
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.cae} color={C.red} />
    </>
  );
};

// Velocímetro del procesador
const Medidor: React.FC<{ readonly x: number; readonly y: number; readonly v: number; readonly tope: number }> = ({
  x,
  y,
  v,
  tope,
}) => {
  const r = 260;
  const arco = (a0: number, a1: number) => {
    const p0 = [x + Math.cos(Math.PI + a0 * Math.PI) * r, y + Math.sin(Math.PI + a0 * Math.PI) * r];
    const p1 = [x + Math.cos(Math.PI + a1 * Math.PI) * r, y + Math.sin(Math.PI + a1 * Math.PI) * r];
    return `M ${p0[0]} ${p0[1]} A ${r} ${r} 0 0 1 ${p1[0]} ${p1[1]}`;
  };
  const a = Math.PI + v * Math.PI;
  return (
    <g>
      <path d={arco(0, 1)} stroke="#2A2440" strokeWidth={40} fill="none" />
      <path d={arco(0, Math.min(v, 0.999))} stroke={C.cyan} strokeWidth={40} fill="none" />
      {tope < 1 ? (
        <path d={arco(tope, 0.999)} stroke={C.red} strokeWidth={40} fill="none" opacity={0.55} />
      ) : null}
      <line x1={x} y1={y} x2={x + Math.cos(a) * (r - 50)} y2={y + Math.sin(a) * (r - 50)} stroke={C.white} strokeWidth={12} strokeLinecap="round" />
      <circle cx={x} cy={y} r={22} fill={C.white} />
    </g>
  );
};

// F. Algunos fabricantes limitan la velocidad del procesador cuando la batería está gastada
export const Limita: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tope = interpolate(t, [T.limitan, T.limitan + 0.6], [1, 0.45], clamp);
  const v = Math.min(tope, 0.9 + 0.05 * Math.sin(t * 6));
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.para, T.la], [1, 1.04])}>
        <Texto x={540} y={470} size={40} color={C.white}>
          velocidad del procesador
        </Texto>
        <Medidor x={540} y={850} v={v} tope={tope} />
        <g opacity={aparece(t, T.limitan)}>
          <rect x={300} y={920} width={480} height={90} rx={20} fill={C.red} />
          <Texto x={540} y={980} size={44} color={C.white}>
            LIMITADO
          </Texto>
        </g>
        <g opacity={aparece(t, T.gastada)}>
          <Bateria x={540} y={1300} s={0.4} nivel={0.3} color={C.orange} vieja={1} />
          <Texto x={540} y={1450} size={36} color={C.orange}>
            batería gastada
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.limitan} color={C.red} />
    </>
  );
};

// G. La solución suele ser simple: cambiar la batería
export const Solucion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = interpolate(t, [T.cambiar - 0.6, T.cambiar], [0, 1], clamp);
  const entra = interpolate(t, [T.cambiar, T.cambiar + 0.6], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.la, T.porEso], [1, 1.04])}>
        <g transform="translate(540 880)">
          <rect x={-220} y={-400} width={440} height={800} rx={56} fill="none" stroke="#5A5478" strokeWidth={10} strokeDasharray="24 16" />
        </g>
        <g opacity={1 - sale}>
          <Bateria x={540 - sale * 500} y={880} s={0.9} nivel={0.3} color={C.orange} vieja={1} />
        </g>
        <g opacity={entra}>
          <Bateria x={540 + (1 - entra) * 500} y={880} s={0.9} nivel={0.95} color={VERDE} />
        </g>
        <Texto x={540} y={1400} size={44} color={VERDE} op={aparece(t, T.cambiar)}>
          batería nueva
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.cambiar} color={VERDE} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
