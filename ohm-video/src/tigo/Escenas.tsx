import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/tigo/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
// Campaña de marca: sin morado ni rojo (ni naranja); sin logos de Tigo ni de Ookla, solo texto.
export const T = {
  play: 2.38, // play
  instante: 3.98, // instante
  final: 4.96, // final
  pulsos: 8.94, // pulsos
  fibra: 9.86, // fibra
  hilo: 10.98, // hilo
  pelo: 12.54, // pelo
  rebota: 13.50, // rebota
  antena: 16.40, // antena
  ondas: 17.98, // ondas
  celular: 19.28, // celular
  canales: 20.44, // canales
  autopista: 21.64, // autopista
  velocidad: 23.48, // velocidad
  plan: 25.80, // plan
  equipo: 26.46, // equipo
  ookla: 27.58, // ookla
  pruebas: 28.28, // pruebas
  segun: 29.94, // segun
  tigo: 31.62, // contigo
  fija: 32.66, // fija
  movil: 33.42, // movil
  colombia: 35.22, // colombia
  asi: 35.86, // asi
  fin: 37.70, // FIN
};

// Paleta permitida
const AZUL = "#1E7BE0";
const AZUL_OSC = "#0E3A66";
const GRIS = "#8FA0B0";
const VERDE = "#4CD08A";

// Celular con un video
const Cel: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly u?: number; readonly t?: number; readonly play?: number }> = ({
  x,
  y,
  s = 1,
  u = 0,
  t = 0,
  play = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-150} y={-290} width={300} height={580} rx={40} fill="#1A2633" stroke={GRIS} strokeWidth={6} />
    <rect x={-128} y={-250} width={256} height={480} rx={18} fill="#0A1622" />
    {/* video: cielo y montañas que se mueven al reproducirse */}
    <rect x={-128} y={-150} width={256} height={170} fill={AZUL_OSC} />
    <circle cx={60 - ((t * 40 * play) % 60)} cy={-110} r={20} fill={C.yellow} />
    <path d={`M -128 20 L ${-60 - ((t * 30 * play) % 40)} -60 L 0 0 L 60 -80 L 128 20 Z`} fill={AZUL} />
    <g opacity={1 - play}>
      <circle cx={0} cy={-65} r={46} fill="rgba(0,0,0,0.5)" />
      <path d="M -14 -90 L 24 -65 L -14 -40 Z" fill={C.white} />
    </g>
    <rect x={-110} y={50} width={220} height={10} rx={5} fill="#22303E" />
    <rect x={-110} y={50} width={220 * u} height={10} rx={5} fill={C.cyan} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Cel x={540} y={1000} s={1.3} u={(t * 0.15) % 1} t={t} play={1} />
    {[0, 1, 2].map((k) => (
      <line key={k} x1={300 - k * 30} y1={760 + k * 90} x2={200 - k * 30} y2={760 + k * 90} stroke={C.cyan} strokeWidth={8} strokeLinecap="round" opacity={0.4 + 0.3 * Math.sin(t * 6 + k)} />
    ))}
    <Texto x={860} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo llega tan rápido este video?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.play], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Le das play y arranca en un instante + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const play = aparece(t, T.play + 0.3);
  return (
    <Lienzo zoom={interpolate(t, [T.play, T.pulsos], [1, 1.04])}>
      <Cel x={540} y={1000} s={1.3} u={interpolate(t, [T.play + 0.3, T.pulsos], [0, 0.3], clamp)} t={t} play={play} />
      <Texto x={540} y={1460} size={44} color={C.cyan} op={aparece(t, T.instante)}>
        ¡arranca en un instante!
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿qué red es la más rápida?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#16283A" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.pulsos], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Pulsos de luz por fibra óptica: hilo de vidrio, la luz rebota en las paredes y no se escapa
export const Fibra: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const y0 = 1000;
  const h = 90;
  // rayo en zigzag dentro del núcleo
  const ray = new Array(9).fill(0).map((_, k) => `${k ? "L" : "M"} ${60 + k * 120} ${y0 + (k % 2 ? h : -h) * 0.85}`).join(" ");
  const off = -t * 400;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pulsos, T.antena], [1, 1.04])}>
        <rect x={0} y={y0 - h - 30} width={1080} height={2 * h + 60} fill="#13324F" opacity={0.6} />
        <rect x={0} y={y0 - h} width={1080} height={2 * h} fill="#5AB8F0" opacity={0.25} />
        <line x1={0} y1={y0 - h} x2={1080} y2={y0 - h} stroke="#9AD8FF" strokeWidth={4} />
        <line x1={0} y1={y0 + h} x2={1080} y2={y0 + h} stroke="#9AD8FF" strokeWidth={4} />
        <path d={ray} stroke={C.yellow} strokeWidth={5} fill="none" opacity={0.3 * aparece(t, T.pulsos)} />
        <path d={ray} stroke={C.yellow} strokeWidth={9} strokeLinecap="round" fill="none" strokeDasharray="90 230" strokeDashoffset={off} opacity={aparece(t, T.pulsos)} />
        {aparece(t, T.rebota) > 0
          ? [1, 3, 5, 7].map((k) => <circle key={k} cx={60 + k * 120} cy={y0 + h * 0.85} r={14 + 6 * Math.sin(t * 8 + k)} fill={C.yellow} opacity={0.5 * aparece(t, T.rebota)} />)
          : null}
        <Texto x={540} y={720} size={48} color={C.white} op={aparece(t, T.fibra)}>
          fibra óptica
        </Texto>
        <Texto x={540} y={790} size={34} color={C.yellow} op={aparece(t, T.pulsos)}>
          tu video = pulsos de luz
        </Texto>
        <g opacity={aparece(t, T.hilo)}>
          <circle cx={300} cy={1330} r={40} fill="#5AB8F0" opacity={0.5} stroke="#9AD8FF" strokeWidth={4} />
          <Texto x={300} y={1420} size={30} color="#9AD8FF">
            hilo de vidrio
          </Texto>
          <line x1={700} y1={1290} x2={900} y2={1370} stroke={GRIS} strokeWidth={14} strokeLinecap="round" opacity={aparece(t, T.pelo)} />
          <Texto x={800} y={1420} size={30} color={GRIS} op={aparece(t, T.pelo)}>
            más delgado que un pelo
          </Texto>
        </g>
        <Texto x={540} y={1530} size={36} color={C.cyan} op={aparece(t, T.rebota)}>
          la luz rebota y no se escapa
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.fibra} color={C.cyan} />
    </>
  );
};

// D. Una antena 5G lo convierte en ondas de radio hasta tu celular; más canales: autopista con más carriles
export const Antena: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const auto = aparece(t, T.autopista);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.antena, T.velocidad], [1, 1.04])}>
        <g opacity={1 - auto}>
          {/* torre */}
          <path d="M 260 1350 L 300 800 L 340 1350 Z" fill="none" stroke={GRIS} strokeWidth={10} />
          <path d="M 270 1200 L 330 1100 M 330 1200 L 270 1100 M 280 1000 L 320 920" stroke={GRIS} strokeWidth={6} />
          <rect x={282} y={780} width={36} height={60} rx={6} fill={C.white} />
          <Texto x={300} y={740} size={40} color={C.yellow} op={aparece(t, T.antena)}>
            5G
          </Texto>
          {[0, 1, 2, 3, 4].map((k) => {
            const u = (t * 0.8 + k / 5) % 1;
            return (
              <path
                key={k}
                d={`M ${340 + u * 380} ${800 + u * 200 - 120} q 40 120 0 240`}
                stroke={C.cyan}
                strokeWidth={8}
                fill="none"
                opacity={aparece(t, T.ondas) * (1 - u)}
              />
            );
          })}
          <Cel x={830} y={1100} s={0.6} t={t} play={1} u={(t * 0.15) % 1} />
          <Texto x={540} y={1480} size={38} color={C.cyan} op={aparece(t, T.ondas)}>
            ondas de radio hasta tu celular
          </Texto>
        </g>
        <g opacity={auto}>
          {[0, 1, 2, 3, 4].map((k) => (
            <g key={k}>
              <rect x={0} y={760 + k * 140} width={1080} height={120} fill="#1A2633" />
              {[0, 1, 2].map((m) => (
                <rect key={m} x={((m * 420 + t * (300 + k * 40) + k * 90) % 1300) - 160} y={790 + k * 140} width={120} height={60} rx={14} fill={[AZUL, C.cyan, C.yellow, VERDE, "#9AD8FF"][k]} />
              ))}
            </g>
          ))}
          <Texto x={540} y={1530} size={40} color={C.yellow}>
            más canales = más carriles
          </Texto>
        </g>
        <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.canales)}>
          5G: más canales a la vez
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.autopista} color={C.cyan} />
    </>
  );
};

// E. La velocidad real cambia según dónde estés, tu plan y tu equipo; Ookla la mide con pruebas reales
export const Medicion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const prueba = aparece(t, T.ookla);
  const items: [string, number][] = [
    ["dónde estés", T.velocidad + 0.6],
    ["tu plan", T.plan],
    ["tu equipo", T.equipo],
  ];
  return (
    <Lienzo zoom={interpolate(t, [T.velocidad, T.segun], [1, 1.04])}>
      <g opacity={1 - prueba}>
        <Texto x={540} y={640} size={40} color={C.white}>
          la velocidad real cambia según…
        </Texto>
        {items.map(([txt, tt], k) => (
          <g key={txt} opacity={aparece(t, tt)} transform={`translate(${220 + k * 320} 1000)`}>
            <rect x={-110} y={-130} width={220} height={260} rx={30} fill="#13324F" />
            {[0, 1, 2, 3].map((b) => (
              <rect key={b} x={-60 + b * 32} y={40 - b * 36} width={22} height={30 + b * 36} rx={5} fill={b <= 3 - k ? C.cyan : "#22303E"} />
            ))}
            <Texto x={0} y={190} size={32} color={C.yellow}>
              {txt}
            </Texto>
          </g>
        ))}
      </g>
      <g opacity={prueba}>
        {new Array(12).fill(0).map((_, k) => {
          const x = 200 + (k % 4) * 230;
          const y = 820 + Math.floor(k / 4) * 220;
          const a = -60 + 120 * ((Math.sin(t * 2 + k * 1.7) + 1) / 2);
          return (
            <g key={k} transform={`translate(${x} ${y})`} opacity={aparece(t, T.pruebas + k * 0.05)}>
              <path d="M -70 20 A 70 70 0 0 1 70 20" stroke="#22303E" strokeWidth={12} fill="none" />
              <path d="M -70 20 A 70 70 0 0 1 70 20" stroke={C.cyan} strokeWidth={12} fill="none" strokeDasharray={`${220 * ((a + 90) / 180)} 400`} />
              <line x1={0} y1={20} x2={60 * Math.sin((a * Math.PI) / 180)} y2={20 - 60 * Math.cos((a * Math.PI) / 180)} stroke={C.white} strokeWidth={6} strokeLinecap="round" />
            </g>
          );
        })}
        <Texto x={540} y={640} size={42} color={C.white}>
          Ookla: pruebas reales de usuarios
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. Según Ookla 2026, con Tigo tienes la red fija y la red móvil 5G más rápidas de Colombia
export const Tigo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.segun, T.asi], [1, 1.04])}>
        <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.segun)}>
          según Ookla 2026
        </Texto>
        <Texto x={540} y={740} size={96} color={C.white} op={aparece(t, T.tigo)}>
          con Tigo
        </Texto>
        <g opacity={aparece(t, T.fija)} transform="translate(300 1050)">
          <rect x={-150} y={-150} width={300} height={300} rx={40} fill="#13324F" />
          <path d="M -70 30 L -70 -20 L 0 -80 L 70 -20 L 70 30 Z" fill="none" stroke={C.cyan} strokeWidth={10} strokeLinejoin="round" />
          <rect x={-30} y={-10} width={60} height={40} rx={8} fill={C.cyan} />
          <Texto x={0} y={110} size={36} color={C.yellow}>
            red fija
          </Texto>
        </g>
        <g opacity={aparece(t, T.movil)} transform="translate(780 1050)">
          <rect x={-150} y={-150} width={300} height={300} rx={40} fill="#13324F" />
          <rect x={-40} y={-90} width={80} height={140} rx={14} fill="none" stroke={C.cyan} strokeWidth={10} />
          <Texto x={0} y={-10} size={36} color={C.cyan}>
            5G
          </Texto>
          <Texto x={0} y={110} size={36} color={C.yellow}>
            red móvil 5G
          </Texto>
        </g>
        <Texto x={540} y={1340} size={48} color={C.yellow} op={aparece(t, T.movil + 0.5)}>
          las más rápidas
        </Texto>
        <Texto x={540} y={1410} size={48} color={C.yellow} op={aparece(t, T.colombia)}>
          de Colombia
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.tigo} color={C.cyan} />
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
