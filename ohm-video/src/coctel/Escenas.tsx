import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/coctel/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  fiesta: 1.82, // fiesta
  voces: 2.56, // voces
  nombre: 5.34, // nombre
  volteas: 5.84, // volteas
  final: 7.34, // final
  llama: 9.32, // llama
  efecto: 9.56, // efecto
  cerebro: 11.68, // cerebro
  atender: 12.52, // atender
  elige: 14.40, // elige
  volumen: 15.62, // volumen
  apaga: 17.34, // apaga
  plano: 19.16, // plano
  importante: 20.38, // importante
  nombre2: 21.50, // nombre
  alarma: 25.42, // alarma
  atencion: 26.12, // atencion
  experimentos: 27.72, // experimentos
  tercio: 29.12, // tercio
  asi: 33.46, // asi
  fin: 34.66, // FIN
};

const COLS = ["#E08A6A", "#6AA8E0", "#8AE06A", "#E0C86A", "#C86AE0", "#6AE0C8"];

const Persona: React.FC<{ readonly x: number; readonly y: number; readonly col: string; readonly s?: number; readonly gira?: number }> = ({ x, y, col, s = 1, gira = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-50} y={40} width={100} height={130} rx={40} fill={col} opacity={0.8} />
    <circle cx={0} cy={0} r={46} fill="#E0A888" />
    <circle cx={-14 + gira * 30} cy={-6} r={6} fill="#3A2A22" />
    <circle cx={14 + gira * 30} cy={-6} r={6} fill="#3A2A22" />
  </g>
);

const Burbuja: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly op: number; readonly col?: string; readonly size?: number }> = ({ x, y, texto, op, col = "#3A3A5A", size = 26 }) => (
  <g opacity={op}>
    <rect x={x - texto.length * size * 0.32 - 20} y={y - size - 10} width={texto.length * size * 0.64 + 40} height={size + 34} rx={22} fill={col} />
    <Texto x={x} y={y + 6} size={size} color="#fff">
      {texto}
    </Texto>
  </g>
);

// Multitud con burbujas de "bla bla"
const Fiesta: React.FC<{ readonly t: number; readonly ruido: number; readonly nombre: number; readonly gira: number }> = ({ t, ruido, nombre, gira }) => (
  <g>
    {new Array(10).fill(0).map((_, k) => (
      <Persona key={k} x={140 + (k % 5) * 200} y={760 + Math.floor(k / 5) * 330} col={COLS[k % 6]} s={0.9} />
    ))}
    {new Array(8).fill(0).map((_, k) => (
      <Burbuja key={k} x={160 + (k % 4) * 250} y={640 + Math.floor(k / 4) * 330 + 10 * Math.sin(t * 3 + k)} texto="bla bla" op={ruido * (0.5 + 0.5 * Math.sin(t * 2 + k * 1.3))} />
    ))}
    <Burbuja x={900} y={980} texto="¡TU NOMBRE!" op={nombre} col={C.orange} size={30} />
    <Persona x={540} y={1500} col={C.yellow} s={1.3} gira={gira} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Fiesta t={t} ruido={1} nombre={1} gira={1} />
    <Texto x={540} y={540} size={110} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo escuchaste tu nombre?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.fiesta], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Fiesta llena de voces; alguien dice tu nombre y volteas + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.fiesta, T.llama], [1, 1.04])}>
      <Fiesta t={t} ruido={aparece(t, T.fiesta)} nombre={aparece(t, T.nombre)} gira={interpolate(t, [T.volteas, T.volteas + 0.3], [0, 1], clamp)} />
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿le pasa a todos?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.llama], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Efecto fiesta de cóctel
export const Nombre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.llama, T.cerebro], [1, 1.06])}>
        {[-1, 1].map((d) => (
          <g key={d} transform={`translate(${540 + d * 120} 960) rotate(${d * 15})`}>
            <path d="M -70 -120 L 70 -120 L 0 0 Z" fill="#C8E8FF" opacity={0.5} />
            <path d="M -60 -110 L 60 -110 L 0 -10 Z" fill={C.orange} opacity={0.8} />
            <line x1={0} y1={0} x2={0} y2={150} stroke="#C8E8FF" strokeWidth={8} />
            <line x1={-50} y1={150} x2={50} y2={150} stroke="#C8E8FF" strokeWidth={8} />
          </g>
        ))}
        <Texto x={540} y={1280} size={52} color={C.yellow} op={aparece(t, T.efecto)}>
          efecto fiesta de cóctel
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.efecto} color={C.yellow} />
    </>
  );
};

// Cerebro con canales de voz (barras de volumen); elegida resaltada; escaneo de fondo
const Canales: React.FC<{ readonly t: number; readonly elige: number; readonly baja: number; readonly escaneo: number; readonly alerta?: number }> = ({ t, elige, baja, escaneo, alerta = 0 }) => (
  <g>
    <g transform="translate(540 760) scale(0.9)">
      <path d="M -200 40 C -240 -80 -120 -200 0 -180 C 120 -220 250 -100 210 20 C 240 120 120 170 40 140 C -20 190 -160 170 -200 40 Z" fill="#E8A0B0" />
    </g>
    {new Array(6).fill(0).map((_, k) => {
      const sel = k === 1;
      const nom = k === 4;
      const vol = sel ? 1 : 1 - 0.75 * baja;
      const x = 140 + k * 160;
      const h = 260 * vol * (0.7 + 0.3 * Math.sin(t * 6 + k));
      return (
        <g key={k}>
          <rect x={x - 40} y={1360 - h} width={80} height={h} rx={14} fill={nom && alerta > 0 ? C.orange : sel && elige > 0 ? C.yellow : COLS[k]} opacity={sel ? 1 : 0.5 + 0.5 * (1 - baja)} />
          <Texto x={x} y={1410} size={26} color={C.white}>
            {nom && alerta > 0 ? "¡nombre!" : sel && elige > 0 ? "esta" : "voz"}
          </Texto>
        </g>
      );
    })}
    {escaneo > 0 ? <rect x={100 + ((t * 300) % 880)} y={1060} width={12} height={320} fill={C.cyan} opacity={escaneo * 0.7} /> : null}
  </g>
);

// D. El cerebro no puede atender todas: elige una y baja el volumen de las demás, pero no las apaga
export const Filtro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.cerebro, T.importante], [1, 1.04])}>
      <Canales t={t} elige={aparece(t, T.elige)} baja={aparece(t, T.volumen)} escaneo={aparece(t, T.plano)} />
      <Texto x={540} y={540} size={38} color={C.white} op={aparece(t, T.atender) * (1 - aparece(t, T.elige))}>
        demasiadas voces
      </Texto>
      <Texto x={540} y={540} size={38} color={C.yellow} op={aparece(t, T.elige) * (1 - aparece(t, T.apaga))}>
        elige una, baja las demás
      </Texto>
      <Texto x={540} y={540} size={38} color={C.cyan} op={aparece(t, T.apaga)}>
        …pero las sigue vigilando
      </Texto>
      <Texto x={540} y={1490} size={34} color={C.cyan} op={aparece(t, T.plano)}>
        en segundo plano
      </Texto>
    </Lienzo>
  );
};

// E. Tu nombre es de lo más importante: salta la alarma y tu atención se va hacia allá
export const Alarma: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const al = aparece(t, T.alarma);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.importante, T.experimentos], [1, 1.04])}>
        <Canales t={t} elige={1} baja={1 - aparece(t, T.atencion) * 0.5} escaneo={1 - al} alerta={aparece(t, T.nombre2)} />
        <g opacity={al} transform={`translate(800 560) rotate(${10 * Math.sin(t * 20)})`}>
          <path d="M -50 40 Q -50 -50 0 -50 Q 50 -50 50 40 L 70 60 L -70 60 Z" fill={C.red} />
          <circle cx={0} cy={80} r={14} fill={C.red} />
        </g>
        <path d="M 300 760 Q 500 960 780 1180" stroke={C.orange} strokeWidth={12} fill="none" strokeDasharray="20 14" opacity={aparece(t, T.atencion)} />
        <Texto x={300} y={560} size={40} color={C.orange} op={aparece(t, T.nombre2)}>
          ¡tu nombre!
        </Texto>
        <Texto x={540} y={1500} size={38} color={C.white} op={aparece(t, T.atencion)}>
          la atención salta hacia allá
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.alarma} color={C.red} />
    </>
  );
};

// F. En experimentos, cerca de un tercio nota su nombre en una conversación que no escucha
export const Tercio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.experimentos, T.asi], [1, 1.04])}>
      {[0, 1, 2].map((k) => (
        <g key={k} opacity={k === 0 ? 1 : 0.35 + 0.65 * (1 - aparece(t, T.tercio))}>
          <Persona x={260 + k * 280} y={900} col={k === 0 ? C.yellow : C.grey} s={1.6} gira={k === 0 ? aparece(t, T.tercio) : 0} />
        </g>
      ))}
      <Texto x={540} y={600} size={38} color={C.white} op={aparece(t, T.experimentos)}>
        en experimentos…
      </Texto>
      <Texto x={540} y={1340} size={48} color={C.yellow} op={aparece(t, T.tercio)}>
        ~1 de cada 3 lo nota
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
