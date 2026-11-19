import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/espejodolor/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  video: 2.24, // video
  espinilla: 3.56, // espinilla
  corrientazo: 4.82, // corrientazo
  final: 7.06, // final
  moverse: 10.10, // moverse
  activa: 11.20, // activa
  neuronas: 15.18, // neuronas
  dolor: 16.76, // dolor
  herida: 18.80, // herida
  encienden: 19.40, // encienden
  emocional: 22.84, // emocional
  algunas: 23.92, // algunas
  sienten: 26.14, // sienten
  fisico: 29.32, // fisico
  estudio: 30.46, // estudio
  tercio: 31.60, // tercio
  lesiones: 34.62, // lesiones
  porEso: 35.44, // por
  fin: 36.80, // FIN
};

const PIEL = "#E0A888";

const Rayo: React.FC<{ readonly x: number; readonly y: number; readonly op: number; readonly s?: number }> = ({ x, y, op, s = 1 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M 10 -60 L -20 0 L 5 0 L -10 60 L 30 -10 L 5 -10 L 20 -60 Z" fill={C.yellow} opacity={op} />
);

// Pierna de perfil (espinilla al frente)
const Pierna: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly golpe?: number }> = ({ x, y, s = 1, golpe = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-40} y={-300} width={80} height={300} rx={36} fill={PIEL} />
    <path d="M -40 -10 L 60 -10 Q 90 -10 90 20 L 90 30 L -40 30 Z" fill="#4A3A6A" />
    {golpe > 0 ? <circle cx={44} cy={-120} r={30 * golpe} fill={C.red} opacity={0.5 * golpe} /> : null}
  </g>
);

// Celular mostrando a alguien golpearse la espinilla con una mesa
const Pantalla: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly golpe: number; readonly s?: number }> = ({ x, y, t, golpe, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-180} y={-300} width={360} height={600} rx={40} fill="#1A1A22" stroke="#5A5A66" strokeWidth={8} />
    <rect x={-160} y={-270} width={320} height={540} rx={24} fill="#2A3A4A" />
    <rect x={-20} y={60} width={160} height={30} fill="#8A6A4A" />
    <rect x={110} y={90} width={20} height={120} fill="#8A6A4A" />
    <g transform={`translate(${-100 + golpe * 70} 210)`}>
      <Pierna x={0} y={0} s={0.8} golpe={golpe} />
    </g>
    <path d="M 0 40 l 15 -40 l 10 30 l 25 -30 l -5 40 l 30 0 l -30 20 Z" fill={C.yellow} opacity={golpe > 0.9 ? 1 : 0} />
    {void t}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Pantalla x={330} y={900} t={t} golpe={1} s={0.9} />
    <Pierna x={800} y={1320} s={1.3} golpe={0} />
    <Rayo x={860} y={1100} op={0.6 + 0.4 * Math.sin(t * 20)} s={1.4} />
    <Texto x={800} y={620} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué sentiste ese golpe?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.video], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Ves a alguien golpearse la espinilla y sientes un corrientazo en tu pierna + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const golpe = interpolate(t, [T.espinilla - 0.3, T.espinilla + 0.2], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.video, T.moverse], [1, 1.04])}>
        <Pantalla x={330} y={900} t={t} golpe={golpe} s={0.9} />
        <Pierna x={800} y={1320} s={1.3} />
        <Rayo x={860} y={1100} op={aparece(t, T.corrientazo) * (0.6 + 0.4 * Math.sin(t * 20))} s={1.4} />
        <Texto x={800} y={1430} size={34} color={C.yellow} op={aparece(t, T.corrientazo)}>
          ¡tu pierna!
        </Texto>
        <g opacity={aparece(t, T.final)}>
          <Texto x={540} y={470} color={C.white} size={34}>
            ¿a cuántas personas les pasa?: al final
          </Texto>
          <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
          <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.moverse], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
        </g>
      </Lienzo>
      <Flash t={t} d={T.corrientazo} color={C.yellow} />
    </>
  );
};

// Cerebro de perfil con zonas: motora/sensorial (franja) y emocional (ínsula)
const Cerebro: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly motora?: number; readonly emo?: number; readonly t?: number }> = ({ x, y, s = 1, motora = 0, emo = 0, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -200 40 C -240 -80 -120 -200 0 -180 C 120 -220 250 -100 210 20 C 240 120 120 170 40 140 C -20 190 -160 170 -200 40 Z" fill="#E8A0B0" />
    <path d="M -10 -175 Q 20 -40 -30 130" stroke={C.yellow} strokeWidth={40} fill="none" opacity={motora * (0.6 + 0.4 * Math.sin(t * 8))} strokeLinecap="round" />
    <ellipse cx={60} cy={40} rx={60} ry={34} fill={C.orange} opacity={emo * (0.6 + 0.4 * Math.sin(t * 8))} />
  </g>
);

// C. Al ver a alguien moverse, tu cerebro activa zonas de ese movimiento: neuronas espejo
export const Espejo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const brazo = 30 * Math.sin(t * 3);
  return (
    <Lienzo zoom={interpolate(t, [T.moverse, T.dolor], [1, 1.04])}>
      <g transform="translate(260 1150)">
        <circle cx={0} cy={-260} r={60} fill={PIEL} />
        <rect x={-55} y={-190} width={110} height={220} rx={40} fill="#4A6AC8" />
        <rect x={40} y={-180} width={40} height={180} rx={20} fill={PIEL} transform={`rotate(${-90 + brazo} 60 -170)`} />
      </g>
      <Cerebro x={740} y={1000} s={1} motora={aparece(t, T.activa)} t={t} />
      <path d="M 380 950 Q 520 860 600 920" stroke={C.white} strokeWidth={5} fill="none" strokeDasharray="12 10" opacity={aparece(t, T.activa)} />
      <Texto x={540} y={560} size={44} color={C.yellow} op={aparece(t, T.neuronas)}>
        neuronas espejo
      </Texto>
      <Texto x={540} y={1340} size={34} color={C.white} op={aparece(t, T.activa)}>
        tu cerebro «ensaya» el movimiento
      </Texto>
    </Lienzo>
  );
};

// D. Al ver una herida, se encienden zonas que procesan tu propio dolor, sobre todo la parte emocional
export const Dolor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.dolor, T.algunas], [1, 1.04])}>
        <Cerebro x={540} y={950} s={1.5} emo={aparece(t, T.encienden)} t={t} />
        <Texto x={540} y={560} size={40} color={C.white} op={aparece(t, T.herida)}>
          al ver una herida…
        </Texto>
        <Texto x={540} y={1300} size={40} color={C.orange} op={aparece(t, T.encienden)}>
          se enciende tu zona del dolor
        </Texto>
        <Texto x={540} y={1370} size={34} color={C.white} op={aparece(t, T.emocional)}>
          sobre todo la parte emocional
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.encienden} color={C.orange} />
    </>
  );
};

// E. En algunas personas se activan también las zonas que sienten esa parte del cuerpo: lo sienten físico
export const Fisico: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.algunas, T.estudio], [1, 1.04])}>
      <Cerebro x={320} y={900} s={0.9} motora={aparece(t, T.sienten)} emo={1} t={t} />
      <Pierna x={800} y={1300} s={1.4} />
      <Rayo x={860} y={1080} op={aparece(t, T.fisico) * (0.6 + 0.4 * Math.sin(t * 20))} s={1.5} />
      <path d="M 420 960 Q 640 1000 780 1080" stroke={C.yellow} strokeWidth={6} fill="none" strokeDasharray="14 10" opacity={aparece(t, T.sienten)} />
      <Texto x={540} y={560} size={38} color={C.white} op={aparece(t, T.algunas)}>
        en algunas personas…
      </Texto>
      <Texto x={540} y={1460} size={42} color={C.yellow} op={aparece(t, T.fisico)}>
        ¡se siente físico!
      </Texto>
    </Lienzo>
  );
};

// F. En un estudio, cerca de un tercio sintió dolor al ver imágenes de lesiones
export const Tercio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.estudio, T.porEso], [1, 1.04])}>
      {[0, 1, 2].map((k) => (
        <g key={k} opacity={k === 0 ? 1 : 0.35 + 0.65 * (1 - aparece(t, T.tercio))}>
          <circle cx={260 + k * 280} cy={820} r={70} fill={PIEL} />
          <rect x={200 + k * 280} y={900} width={120} height={220} rx={44} fill={k === 0 ? C.yellow : C.grey} />
          {k === 0 ? <Rayo x={340} y={760} op={aparece(t, T.tercio)} /> : null}
        </g>
      ))}
      <Texto x={540} y={560} size={38} color={C.white} op={aparece(t, T.estudio)}>
        en un estudio…
      </Texto>
      <Texto x={540} y={1300} size={48} color={C.yellow} op={aparece(t, T.tercio)}>
        ~1 de cada 3
      </Texto>
      <Texto x={540} y={1380} size={34} color={C.white} op={aparece(t, T.lesiones)}>
        sintió dolor al ver lesiones
      </Texto>
    </Lienzo>
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
