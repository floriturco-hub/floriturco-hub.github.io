import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/tripas/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  tienes: 1.42, // tienes
  suena: 2.78, // suena
  silencio: 3.54, // silencio
  final: 4.56, // final
  estomago: 7.26, // estomago
  musculos: 8.80, // musculos
  ondas: 10.22, // ondas
  empujando: 10.52, // empujando
  vacios: 12.48, // vacios
  horas: 13.66, // horas
  empieza: 14.88, // empieza
  limpieza: 15.96, // limpieza
  barre: 16.64, // barre
  sin: 18.28, // sin
  aire: 19.94, // aire
  retumban: 22.70, // retumban
  botella: 23.82, // botella
  ruido: 25.04, // ruido
  borborigmo: 25.84, // borborigmo
  digerir: 27.20, // digerir
  apaga: 29.22, // apaga
  porEso: 29.54, // por
  fin: 31.12, // FIN
};

const PARED = "#E8829A";
const COMIDA = "#C8A04A";

// Barriga de perfil con ondas de sonido
const Barriga: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly sonido: number; readonly t: number }> = ({ x, y, s, sonido, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -220 -360 Q -140 -380 -120 -260 Q -20 -200 0 0 Q 0 200 -120 300 Q -150 380 -220 380 Z" fill="#E8B48A" />
    <path d="M -220 -360 Q -140 -380 -120 -260 L -220 -260 Z" fill="#3A6EE8" />
    <path d="M -220 -260 L -120 -260 Q -20 -200 0 0 L -220 0 Z" fill="#3A6EE8" opacity={0.9} />
    <circle cx={-40} cy={80} r={10} fill="#B8745A" />
    <rect x={-230} y={240} width={180} height={40} rx={8} fill="#5A3A2A" />
    {[0, 1, 2].map((k) => (
      <path
        key={k}
        d={`M ${60 + k * 50} -70 q 30 70 0 140`}
        stroke={C.yellow}
        strokeWidth={10}
        fill="none"
        opacity={sonido * (0.4 + 0.6 * Math.max(0, Math.sin(t * 12 - k)))}
      />
    ))}
  </g>
);

// Tubo intestinal horizontal con contracción gaussiana en xc; ancho = apriete
const Tubo: React.FC<{
  readonly y: number;
  readonly xc: number;
  readonly apriete: number;
  readonly children?: React.ReactNode;
}> = ({ y, xc, apriete, children }) => {
  const h = 110;
  const borde = (sg: number) =>
    new Array(61)
      .fill(0)
      .map((_, i) => {
        const x = 40 + i * 16.7;
        const p = apriete * Math.exp(-(((x - xc) / 80) ** 2));
        return `${i ? "L" : "M"} ${x} ${y + sg * h * (1 - 0.8 * p)}`;
      })
      .join(" ");
  return (
    <g>
      <path d={`${borde(-1)} L 1040 ${y + h} ${borde(1).replace("M", "L").split(" L ").reverse().join(" L ")} Z`} fill="#4A1A2A" opacity={0.6} />
      {children}
      <path d={borde(-1)} stroke={PARED} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d={borde(1)} stroke={PARED} strokeWidth={22} fill="none" strokeLinecap="round" />
    </g>
  );
};

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Barriga x={500} y={960} s={1.2} sonido={1} t={t} />
    <Texto x={820} y={700} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué ruge tu panza?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.tienes], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.yellow} />
    </>
  );
};

// B. Tienes hambre y tu panza suena en pleno silencio + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.tienes, T.estomago], [1, 1.05])}>
      <Barriga x={500} y={880} s={1} sonido={aparece(t, T.suena)} t={t} />
      <Texto x={820} y={880} size={60} color={C.yellow} op={aparece(t, T.suena)}>
        grrr
      </Texto>
      <Texto x={540} y={1250} size={34} color={C.grey} op={aparece(t, T.silencio)}>
        ...en pleno silencio
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.estomago], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          también suena lleno: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Estómago e intestinos tienen músculos que se contraen en ondas, empujando la comida
export const Ondas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const xc = 100 + (((t - T.ondas) * 220) % 1000);
  return (
    <Lienzo zoom={interpolate(t, [T.estomago, T.vacios], [1, 1.04])}>
      <Tubo y={900} xc={xc} apriete={aparece(t, T.musculos)}>
        <ellipse cx={xc + 120} cy={900} rx={70} ry={70} fill={COMIDA} opacity={aparece(t, T.empujando)} />
      </Tubo>
      <Texto x={540} y={1150} size={40} color={PARED} op={aparece(t, T.ondas)}>
        ondas de músculo
      </Texto>
      <Texto x={540} y={1220} size={36} color={COMIDA} op={aparece(t, T.empujando)}>
        empujan la comida
      </Texto>
    </Lienzo>
  );
};

// D. Vacíos, dos horas después de comer, empieza una onda de limpieza que barre los restos
export const Limpieza: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const xc = interpolate(t, [T.limpieza, T.sin], [80, 1000], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.vacios, T.sin], [1, 1.04])}>
        <g opacity={aparece(t, T.horas)} transform="translate(540 560)">
          <circle cx={0} cy={0} r={90} fill={C.card} stroke={C.white} strokeWidth={6} />
          <line x1={0} y1={0} x2={0} y2={-65} stroke={C.white} strokeWidth={8} />
          <line x1={0} y1={0} x2={50} y2={20} stroke={C.yellow} strokeWidth={8} />
          <Texto x={170} y={15} size={40} color={C.white}>
            2 h
          </Texto>
        </g>
        <Tubo y={900} xc={xc} apriete={aparece(t, T.empieza)}>
          {new Array(5).fill(0).map((_, k) => {
            const x0 = 250 + k * 150;
            const x = Math.max(x0, xc + 90);
            return <circle key={k} cx={x} cy={900 + (k % 2 ? 30 : -30)} r={14} fill={COMIDA} opacity={x > 1000 ? 0 : 1} />;
          })}
        </Tubo>
        <Texto x={540} y={1150} size={40} color={C.white} op={aparece(t, T.vacios) * (1 - aparece(t, T.limpieza))}>
          tubos vacíos
        </Texto>
        <Texto x={540} y={1150} size={40} color={C.yellow} op={aparece(t, T.limpieza)}>
          onda de limpieza
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.limpieza} color={PARED} />
    </>
  );
};

// E. Sin comida, el aire y los jugos se mueven libres y retumban, como en una botella vacía
export const Retumba: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const xc = 100 + (((t - T.sin) * 260) % 1000);
  const bot = aparece(t, T.botella);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.sin, T.ruido], [1, 1.04])}>
        <g opacity={1 - bot * 0.8}>
          <Tubo y={900} xc={xc} apriete={1}>
            {new Array(6).fill(0).map((_, k) => {
              const x = ((k * 170 + (t - T.sin) * 300 * (k % 2 ? 1 : 0.7)) % 960) + 60;
              return <circle key={k} cx={x} cy={880 + Math.sin(t * 6 + k) * 30} r={24 + (k % 3) * 8} fill="#C8D8F8" opacity={aparece(t, T.aire) * 0.8} />;
            })}
          </Tubo>
          {[0, 1, 2].map((k) => (
            <g key={k} opacity={aparece(t, T.retumban) * (0.4 + 0.6 * Math.max(0, Math.sin(t * 10 - k)))}>
              <path d={`M ${400 - k * 60} ${720 - k * 40} q 140 -60 280 0`} stroke={C.yellow} strokeWidth={8} fill="none" />
              <path d={`M ${400 - k * 60} ${1080 + k * 40} q 140 60 280 0`} stroke={C.yellow} strokeWidth={8} fill="none" />
            </g>
          ))}
        </g>
        <g opacity={bot} transform="translate(540 900)">
          <path d="M -40 -260 L 40 -260 L 40 -170 Q 120 -120 120 -40 L 120 200 Q 120 240 80 240 L -80 240 Q -120 240 -120 200 L -120 -40 Q -120 -120 -40 -170 Z" fill="none" stroke={C.cyan} strokeWidth={10} />
          <Texto x={0} y={330} size={38} color={C.cyan}>
            como una botella vacía
          </Texto>
        </g>
        <Texto x={540} y={1150} size={40} color={C.yellow} op={aparece(t, T.retumban) * (1 - bot)}>
          retumban
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.retumban} color={C.yellow} />
    </>
  );
};

// F. Ese ruido se llama borborigmo; al digerir también suena, pero la comida lo apaga
export const Borborigmo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lleno = aparece(t, T.digerir);
  const xc = 100 + (((t - T.digerir) * 220) % 1000);
  return (
    <Lienzo zoom={interpolate(t, [T.ruido, T.porEso], [1, 1.04])}>
      <g opacity={1 - lleno}>
        <Texto x={540} y={900} size={84} color={C.yellow} op={aparece(t, T.borborigmo)}>
          BORBORIGMO
        </Texto>
      </g>
      <g opacity={lleno}>
        <Tubo y={900} xc={xc} apriete={1}>
          {new Array(8).fill(0).map((_, k) => (
            <ellipse key={k} cx={100 + k * 120} cy={900} rx={60} ry={70} fill={COMIDA} />
          ))}
        </Tubo>
        <path d="M 460 700 q 80 -20 160 0" stroke={C.yellow} strokeWidth={6} fill="none" opacity={0.35} />
        <Texto x={540} y={1150} size={40} color={COMIDA}>
          la comida apaga el ruido
        </Texto>
      </g>
    </Lienzo>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
