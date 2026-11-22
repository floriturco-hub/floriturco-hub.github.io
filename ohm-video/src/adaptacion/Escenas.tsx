import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/adaptacion/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  ducha: 2.36, // ducha
  alberca: 3.48, // alberca
  aguantas: 4.62, // aguantas
  minuto: 5.64, // minuto
  final: 7.92, // final
  piel: 10.98, // piel
  sensores: 11.52, // sensores
  golpe: 14.74, // golpe
  alarma: 16.96, // alarma
  igual: 18.86, // igual
  menos: 20.56, // menos
  adaptacion: 21.64, // adaptacion
  temperatura: 25.28, // temperatura
  achica: 27.40, // achica
  experimento: 28.40, // experimento
  fria: 30.02, // fria
  tibia: 32.86, // tibia
  sentira: 34.04, // sentira
  fria2: 35.50, // fria
  porEso: 36.40, // por
  fin: 38.14, // FIN
};

const CAL = "#E8703C";
const FRI = "#3AB8E8";
const PIEL = "#E8B48A";

// Persona en la ducha con vapor; calma 0..1
const Ducha: React.FC<{ readonly t: number; readonly calma: number }> = ({ t, calma }) => (
  <g>
    <rect x={460} y={620} width={160} height={30} rx={14} fill="#8A90A0" />
    {new Array(14).fill(0).map((_, k) => (
      <line key={k} x1={480 + (k % 7) * 20} y1={660 + ((t * 600 + k * 70) % 300)} x2={480 + (k % 7) * 20 - 4} y2={690 + ((t * 600 + k * 70) % 300)} stroke="#8AC8FF" strokeWidth={4} />
    ))}
    <circle cx={540} cy={1000} r={60} fill={PIEL} />
    <rect x={480} y={1060} width={120} height={260} rx={50} fill={PIEL} />
    {/* cara: ojos apretados vs tranquila */}
    <path d={calma > 0.5 ? "M 515 990 q 8 6 16 0 M 550 990 q 8 6 16 0" : "M 512 985 l 18 8 M 568 985 l -18 8"} stroke="#3A2A20" strokeWidth={5} fill="none" />
    <path d={calma > 0.5 ? "M 520 1025 q 20 14 40 0" : "M 520 1030 q 20 -12 40 0"} stroke="#3A2A20" strokeWidth={5} fill="none" />
    {new Array(4).fill(0).map((_, k) => (
      <path key={k} d={`M ${400 + k * 90} ${1200 - ((t * 60 + k * 40) % 200)} q 20 -30 0 -60`} stroke="#E8E8F0" strokeWidth={6} fill="none" opacity={0.4} />
    ))}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Ducha t={t} calma={0} />
    <Texto x={880} y={620} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta agua ya no quema?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.ducha], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Ducha caliente o alberca fría: no aguantas; un minuto después, normal + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const calma = aparece(t, T.minuto);
  const seg = Math.round(interpolate(t, [T.minuto, T.final], [0, 60], clamp));
  return (
    <Lienzo zoom={interpolate(t, [T.ducha, T.piel], [1, 1.04])}>
      <Ducha t={t} calma={calma} />
      <Texto x={540} y={1440} size={44} color={CAL} op={aparece(t, T.aguantas) * (1 - calma)}>
        ¡no aguanto!
      </Texto>
      <Texto x={540} y={1440} size={44} color="#5AD08A" op={calma}>
        {"+" + seg + " s: normal"}
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          un experimento para tus manos: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.piel], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Sensores de frío y calor: al cambio disparan muchas señales; si se queda igual, disparan menos (adaptación)
export const Sensores: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const t1 = T.golpe;
  // tasa de disparo: pico al cambio y decae
  const tasa = (x: number) => (x < t1 ? 0.1 : 0.15 + 0.85 * Math.exp(-(x - t1) / 1.6));
  const espigas: number[] = [];
  let acc = 0;
  for (let x = T.piel; x < Math.min(t, T.temperatura); x += 0.02) {
    acc += tasa(x) * 0.02 * 14;
    if (acc >= 1) {
      espigas.push(x);
      acc -= 1;
    }
  }
  const x0 = T.piel;
  const sx = (x: number) => 140 + ((x - x0) / (T.temperatura - x0)) * 800;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.piel, T.temperatura], [1, 1.04])}>
        <rect x={140} y={700} width={800} height={70} rx={20} fill={PIEL} opacity={0.6} />
        {[300, 500, 700].map((x, k) => (
          <circle key={x} cx={x} cy={735} r={18} fill={k % 2 ? CAL : FRI} opacity={aparece(t, T.sensores)} />
        ))}
        <Texto x={540} y={650} size={38} color={C.white} op={aparece(t, T.sensores)}>
          sensores de frío y de calor
        </Texto>
        <line x1={140} y1={1150} x2={940} y2={1150} stroke={C.grey} strokeWidth={3} />
        {espigas.map((x) => (
          <line key={x} x1={sx(x)} y1={1150} x2={sx(x)} y2={1000} stroke={C.yellow} strokeWidth={4} />
        ))}
        <Texto x={540} y={1210} size={28} color={C.grey}>
          señales al cerebro
        </Texto>
        <Texto x={300} y={1320} size={40} color={CAL} op={aparece(t, T.alarma)}>
          ¡alarma!
        </Texto>
        <Texto x={760} y={1320} size={34} color={C.cyan} op={aparece(t, T.menos)}>
          …cada vez menos
        </Texto>
        <Texto x={540} y={1440} size={46} color={C.yellow} op={aparece(t, T.adaptacion)}>
          adaptación sensorial
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.adaptacion} color={C.yellow} />
    </>
  );
};

// D. La piel se acerca a la temperatura del agua y la diferencia se achica
export const Piel: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = interpolate(t, [T.temperatura, T.achica + 0.6], [0, 1], clamp);
  const hP = 160 + 160 * u;
  return (
    <Lienzo zoom={interpolate(t, [T.temperatura, T.experimento], [1, 1.04])}>
      {[
        [360, "piel", hP, PIEL],
        [720, "agua", 380, CAL],
      ].map(([x, txt, h, col]) => (
        <g key={String(txt)}>
          <rect x={Number(x) - 30} y={1300 - 420} width={60} height={420} rx={30} fill="#2A2E3A" />
          <rect x={Number(x) - 20} y={1300 - Number(h)} width={40} height={Number(h)} rx={20} fill={String(col)} />
          <circle cx={Number(x)} cy={1320} r={44} fill={String(col)} />
          <Texto x={Number(x)} y={1420} size={34} color={C.white}>
            {String(txt)}
          </Texto>
        </g>
      ))}
      <line x1={420} y1={1300 - hP} x2={660} y2={1300 - 380} stroke={C.yellow} strokeWidth={4} strokeDasharray="10 8" />
      <Texto x={540} y={640} size={38} color={C.white} op={aparece(t, T.temperatura)}>
        tu piel se acerca a la del agua
      </Texto>
      <Texto x={540} y={1500} size={38} color={C.yellow} op={aparece(t, T.achica)}>
        la diferencia se achica
      </Texto>
    </Lienzo>
  );
};

// E. Experimento: una mano en fría, otra en caliente, luego las dos en tibia
export const Experimento: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tib = aparece(t, T.tibia);
  const res = aparece(t, T.sentira);
  const Mano = ({ x, y }: { x: number; y: number }) => <path transform={`translate(${x} ${y})`} d="M -30 -120 L -30 0 Q 0 30 30 0 L 30 -120 Z" fill={PIEL} />;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.experimento, T.porEso], [1, 1.04])}>
        <g opacity={1 - tib}>
          <rect x={120} y={1000} width={300} height={220} rx={30} fill={FRI} opacity={0.6} />
          <rect x={660} y={1000} width={300} height={220} rx={30} fill={CAL} opacity={0.6} />
          <Mano x={270} y={1060} />
          <Mano x={810} y={1060} />
          <Texto x={270} y={1290} size={32} color={FRI} op={aparece(t, T.fria)}>
            fría
          </Texto>
          <Texto x={810} y={1290} size={32} color={CAL} op={aparece(t, T.fria)}>
            caliente
          </Texto>
        </g>
        <g opacity={tib}>
          <rect x={240} y={1000} width={600} height={220} rx={30} fill="#E8C870" opacity={0.6} />
          <Mano x={430} y={1060} />
          <Mano x={650} y={1060} />
          <Texto x={540} y={1290} size={32} color="#E8C870">
            tibia
          </Texto>
          <Texto x={400} y={880} size={36} color={CAL} op={res}>
            «¡caliente!»
          </Texto>
          <Texto x={700} y={880} size={36} color={FRI} op={aparece(t, T.fria2)}>
            «¡fría!»
          </Texto>
        </g>
        <Texto x={540} y={640} size={42} color={C.yellow} op={aparece(t, T.experimento)}>
          el experimento
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.tibia} color={C.white} />
    </>
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
