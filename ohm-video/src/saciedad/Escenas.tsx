import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/saciedad/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  escribes: 1.88, // escribes
  veces: 3.38, // veces
  escrita: 5.34, // escrita
  idioma: 6.56, // idioma
  final: 7.44, // final
  llama: 9.72, // llama
  saciedad: 9.98, // saciedad
  lees: 12.08, // lees
  neuronas: 14.24, // neuronas
  forma: 15.32, // forma
  significado: 16.08, // significado
  repites: 17.30, // repites
  cansan: 19.72, // cansan
  fuerza: 21.80, // fuerza
  apaga: 23.42, // apaga
  letras: 24.66, // letras
  descansar: 26.76, // descansar
  recuperen: 28.42, // recuperen
  terapeutas: 29.66, // terapeutas
  angustia: 32.56, // angustia
  porEso: 34.76, // por
  fin: 36.44, // FIN
};

// Palabra con letras que se desordenan (raro 0..1)
const Palabra: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly raro: number; readonly size?: number; readonly t?: number; readonly col?: string; readonly op?: number }> = ({
  x,
  y,
  texto,
  raro,
  size = 90,
  t = 0,
  col = C.white,
  op = 1,
}) => {
  const n = texto.length;
  const w = size * 0.62;
  return (
    <g opacity={op}>
      {texto.split("").map((ch, k) => {
        const dx = (k - (n - 1) / 2) * w * (1 + raro * 0.6);
        const dy = raro * 30 * Math.sin(k * 2.3 + t * 2);
        const rot = raro * 25 * Math.sin(k * 1.7 + t);
        return (
          <g key={k} transform={`translate(${x + dx} ${y + dy}) rotate(${rot})`}>
            <Texto x={0} y={0} size={size} color={col}>
              {ch}
            </Texto>
          </g>
        );
      })}
    </g>
  );
};

const Mesa: React.FC<{ readonly x: number; readonly y: number; readonly op: number; readonly s?: number }> = ({ x, y, op, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <rect x={-120} y={-20} width={240} height={30} rx={8} fill="#C8884A" />
    <rect x={-100} y={10} width={20} height={110} fill="#A8683A" />
    <rect x={80} y={10} width={20} height={110} fill="#A8683A" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    {new Array(7).fill(0).map((_, k) => (
      <Palabra key={k} x={540} y={700 + k * 110} texto="mesa" raro={k === 3 ? 0.8 : 0} size={70} t={t} col={k === 3 ? C.yellow : "#5A5A7A"} />
    ))}
    <Texto x={880} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta palabra se ve rara?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.escribes], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Escribes la misma palabra 30 veces y de pronto parece mal escrita, de otro idioma + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const n = Math.min(30, Math.floor(interpolate(t, [T.escribes, T.escrita], [1, 30], clamp)));
  const raro = aparece(t, T.escrita);
  return (
    <Lienzo zoom={interpolate(t, [T.escribes, T.llama], [1, 1.04])}>
      {new Array(Math.min(n, 10)).fill(0).map((_, k) => (
        <Texto key={k} x={540} y={640 + k * 60} size={40} color="#5A5A7A">
          mesa mesa mesa
        </Texto>
      ))}
      <Palabra x={540} y={1300} texto="mesa" raro={raro} size={110} t={t} col={raro > 0.5 ? C.yellow : C.white} />
      <Texto x={880} y={1450} size={44} color={C.white}>
        {"× " + n}
      </Texto>
      <Texto x={420} y={1450} size={36} color={C.yellow} op={aparece(t, T.idioma)}>
        ¿de otro idioma?
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿para qué se usa?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.llama], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Saciedad semántica: unas neuronas conectan la forma de la palabra con su significado
export const Conexion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.llama, T.repites], [1, 1.04])}>
        <Texto x={540} y={600} size={48} color={C.yellow} op={aparece(t, T.saciedad) * (1 - aparece(t, T.lees))}>
          saciedad semántica
        </Texto>
        <Palabra x={540} y={1000} texto="mesa" raro={0.6} size={130} t={t} col={C.yellow} op={1 - aparece(t, T.lees)} />
        <g opacity={aparece(t, T.lees)}>
          <Palabra x={250} y={980} texto="mesa" raro={0} size={70} />
          <Texto x={250} y={1090} size={30} color={C.grey}>
            forma
          </Texto>
          <Mesa x={830} y={950} op={aparece(t, T.significado)} />
          <Texto x={830} y={1120} size={30} color={C.grey} op={aparece(t, T.significado)}>
            significado
          </Texto>
          {new Array(5).fill(0).map((_, k) => (
            <circle key={k} cx={440 + k * 50} cy={960 + 20 * Math.sin(k + t * 3)} r={18} fill={C.cyan} opacity={aparece(t, T.neuronas)} />
          ))}
          <path d="M 380 960 L 690 960" stroke={C.cyan} strokeWidth={6} strokeDasharray="14 10" strokeDashoffset={-t * 80} opacity={aparece(t, T.forma)} />
          <Texto x={540} y={1300} size={36} color={C.cyan} op={aparece(t, T.neuronas)}>
            neuronas que conectan ambas
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.saciedad} color={C.yellow} />
    </>
  );
};

// D. Si la repites, esas neuronas se cansan y responden con menos fuerza; el significado se apaga
export const Cansancio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const apaga = aparece(t, T.apaga);
  return (
    <Lienzo zoom={interpolate(t, [T.repites, T.descansar], [1, 1.04])}>
      {new Array(10).fill(0).map((_, k) => {
        const h = 300 * Math.pow(0.82, k) * aparece(t, T.repites + k * 0.15);
        return <rect key={k} x={180 + k * 75} y={1000 - h} width={50} height={h} rx={10} fill={C.cyan} />;
      })}
      <line x1={160} y1={1000} x2={940} y2={1000} stroke={C.grey} strokeWidth={3} />
      <Texto x={540} y={1060} size={30} color={C.grey}>
        repetición 1 → 10
      </Texto>
      <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.cansan)}>
        las neuronas se cansan
      </Texto>
      <Mesa x={300} y={1260} op={1 - apaga} s={0.7} />
      <Palabra x={700} y={1300} texto="mesa" raro={aparece(t, T.letras)} size={80} t={t} col={C.yellow} />
      <Texto x={540} y={1480} size={38} color={C.orange} op={apaga}>
        el significado se apaga
      </Texto>
    </Lienzo>
  );
};

// E. Descansar unos segundos basta; los terapeutas lo usan para quitar fuerza a palabras que angustian
export const Terapia: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ter = aparece(t, T.terapeutas);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.descansar, T.porEso], [1, 1.04])}>
        <g opacity={1 - ter}>
          {new Array(10).fill(0).map((_, k) => {
            const h = 300 * (0.3 + 0.7 * aparece(t, T.recuperen)) * (0.9 + 0.1 * Math.sin(k + t * 2));
            return <rect key={k} x={180 + k * 75} y={1000 - h} width={50} height={h} rx={10} fill={C.cyan} />;
          })}
          <Texto x={540} y={600} size={40} color="#5AD08A" op={aparece(t, T.descansar)}>
            unos segundos de descanso…
          </Texto>
          <Texto x={540} y={1100} size={40} color="#5AD08A" op={aparece(t, T.recuperen)}>
            …y se recuperan
          </Texto>
        </g>
        <g opacity={ter}>
          <Palabra x={540} y={1000} texto="miedo" raro={0.3 * aparece(t, T.angustia)} size={110} t={t} col={C.red} op={1 - 0.6 * aparece(t, T.angustia + 1)} />
          <Texto x={540} y={600} size={40} color={C.white}>
            terapia: repetirla en voz alta
          </Texto>
          <Texto x={540} y={1250} size={38} color={C.cyan} op={aparece(t, T.angustia)}>
            le quita parte de su fuerza
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.terapeutas} color={C.cyan} />
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
