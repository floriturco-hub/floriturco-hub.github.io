import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/corazon/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  corres: 2.26, // corres
  piernas: 4.12, // piernas
  arden: 4.50, // arden
  corazon: 5.84, // corazon
  vida: 7.02, // vida
  final: 8.28, // final
  esforzarse: 11.50, // esforzarse
  oxigeno: 13.08, // oxigeno
  azucar: 14.12, // azucar
  acido: 16.02, // acido
  ardor: 17.20, // ardor
  mitocondrias: 19.80, // mitocondrias
  fabricas: 20.86, // fabricas
  tercio: 23.92, // tercio
  arterias: 27.32, // arterias
  grasa: 28.40, // grasa
  combustible: 31.30, // combustible
  latido: 34.04, // latido
  relaja: 34.64, // relaja
  tercios: 36.02, // tercios
  porEso: 37.20, // por
  fin: 39.36, // FIN
};

const ROJO = "#E05050";

const Corazon: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly t: number; readonly ritmo?: number }> = ({ x, y, s = 1, t, ritmo = 1.2 }) => {
  const ph = (t * ritmo) % 1;
  const lat = ph < 0.15 ? 1 + 0.12 * Math.sin((ph / 0.15) * Math.PI) : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * lat})`}>
      <path d="M 0 120 C -160 20 -180 -90 -90 -120 C -40 -135 -10 -100 0 -70 C 10 -100 40 -135 90 -120 C 180 -90 160 20 0 120 Z" fill={ROJO} />
    </g>
  );
};

const Pierna: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly arde: number }> = ({ x, y, t, arde }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M 0 0 L ${30 * Math.sin(t * 8)} 220 L ${-10 + 30 * Math.sin(t * 8)} 420`} stroke="#E8B48A" strokeWidth={70} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <ellipse cx={10} cy={110} rx={50} ry={90} fill={C.orange} opacity={0.6 * arde * (0.7 + 0.3 * Math.sin(t * 10))} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Corazon x={540} y={1000} s={1.6} t={t} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este músculo nunca descansa?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.corres], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Corres a tope y las piernas arden; el corazón late toda la vida + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.corres, T.esforzarse], [1, 1.04])}>
      <Pierna x={300} y={850} t={t} arde={aparece(t, T.arden)} />
      <Texto x={300} y={1360} size={36} color={C.orange} op={aparece(t, T.arden)}>
        ¡arden!
      </Texto>
      <g opacity={aparece(t, T.corazon)}>
        <Corazon x={760} y={1000} s={0.9} t={t} />
        <Texto x={760} y={1200} size={34} color={ROJO}>
          toda la vida
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cuánto descansa en realidad?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.esforzarse], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Las piernas se quedan sin oxígeno y queman azúcar sin él: se acumula ácido y aparece el ardor
export const Piernas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const o2 = 1 - aparece(t, T.oxigeno) * 0.85;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.esforzarse, T.mitocondrias], [1, 1.04])}>
        <Pierna x={300} y={800} t={t} arde={aparece(t, T.ardor)} />
        <g transform="translate(720 900)">
          <rect x={-150} y={-30} width={300} height={60} rx={30} fill="#2A2E3A" />
          <rect x={-150} y={-30} width={300 * o2} height={60} rx={30} fill={C.cyan} />
          <Texto x={0} y={-60} size={32} color={C.cyan}>
            oxígeno
          </Texto>
        </g>
        <Texto x={720} y={1100} size={34} color={C.white} op={aparece(t, T.azucar)}>
          queman azúcar sin oxígeno
        </Texto>
        {new Array(10).fill(0).map((_, k) => (
          <circle key={k} cx={620 + (k % 5) * 50} cy={1200 + Math.floor(k / 5) * 50} r={14} fill={C.orange} opacity={aparece(t, T.acido + k * 0.1)} />
        ))}
        <Texto x={720} y={1380} size={36} color={C.orange} op={aparece(t, T.acido)}>
          se acumula ácido
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.ardor} color={C.orange} />
    </>
  );
};

// D. El corazón está lleno de mitocondrias: casi un tercio de cada célula
export const Mitocondrias: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.mitocondrias, T.arterias], [1, 1.04])}>
        <rect x={160} y={720} width={760} height={560} rx={80} fill="#C86A6A" opacity={0.35} stroke={ROJO} strokeWidth={6} />
        {new Array(16).fill(0).map((_, k) => (
          <g key={k} transform={`translate(${250 + (k % 4) * 180} ${800 + Math.floor(k / 4) * 120}) rotate(${(k * 37) % 60 - 30})`} opacity={k < Math.ceil(16 * aparece(t, T.tercio)) || k < 6 ? aparece(t, T.mitocondrias) : 0.15}>
            <ellipse cx={0} cy={0} rx={70} ry={34} fill="#E8A040" />
            <path d="M -50 0 q 12 -20 24 0 t 24 0 t 24 0 t 24 0" stroke="#A86A20" strokeWidth={4} fill="none" />
          </g>
        ))}
        <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.mitocondrias)}>
          célula del corazón
        </Texto>
        <Texto x={540} y={1360} size={36} color="#E8A040" op={aparece(t, T.fabricas)}>
          mitocondrias: fábricas que usan oxígeno
        </Texto>
        <Texto x={540} y={1440} size={42} color={C.yellow} op={aparece(t, T.tercio)}>
          ~1/3 de cada célula
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.mitocondrias} color="#E8A040" />
    </>
  );
};

// E. Recibe sangre de sus propias arterias y usa grasa, azúcar y hasta ácido como combustible
export const Combustible: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fuentes: [string, string, number][] = [
    ["grasa", "#E8C870", T.grasa],
    ["azúcar", "#E8E6F0", T.grasa + 0.5],
    ["ácido", C.orange, T.grasa + 1],
  ];
  return (
    <Lienzo zoom={interpolate(t, [T.arterias, T.latido], [1, 1.04])}>
      <Corazon x={540} y={980} s={1.1} t={t} />
      <path d="M 470 880 Q 420 960 470 1060 M 610 880 Q 660 960 610 1060" stroke="#8A2030" strokeWidth={10} fill="none" opacity={aparece(t, T.arterias)} />
      <Texto x={540} y={640} size={38} color={C.white} op={aparece(t, T.arterias)}>
        sus propias arterias
      </Texto>
      {fuentes.map(([n, col, tt], k) => {
        const u = (t * 0.6 + k / 3) % 1;
        return (
          <g key={n} opacity={aparece(t, tt)}>
            <circle cx={200 + k * 340 + (540 - (200 + k * 340)) * u * 0.5} cy={1350 - 200 * u * 0.5} r={30} fill={col} />
            <Texto x={200 + k * 340} y={1440} size={32} color={col}>
              {n}
            </Texto>
          </g>
        );
      })}
      <Texto x={540} y={1520} size={36} color={C.yellow} op={aparece(t, T.combustible)}>
        todo le sirve de combustible
      </Texto>
    </Lienzo>
  );
};

// F. Sí descansa: tras cada latido se relaja, más o menos dos tercios del tiempo
export const Descanso: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ph = (t * 1.2) % 1;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.latido, T.porEso], [1, 1.04])}>
        <Corazon x={540} y={900} s={0.9} t={t} />
        <g transform="translate(160 1250)" opacity={aparece(t, T.relaja)}>
          <rect x={0} y={0} width={253} height={60} rx={10} fill={ROJO} />
          <rect x={253} y={0} width={507} height={60} rx={10} fill="#5AD08A" opacity={0.8} />
          <Texto x={126} y={100} size={28} color={ROJO}>
            latido
          </Texto>
          <Texto x={506} y={100} size={28} color="#5AD08A">
            relajado
          </Texto>
          <line x1={ph * 760} y1={-20} x2={ph * 760} y2={80} stroke={C.white} strokeWidth={4} />
        </g>
        <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.latido)}>
          sí descansa…
        </Texto>
        <Texto x={540} y={1460} size={42} color={C.yellow} op={aparece(t, T.tercios)}>
          ~2/3 del tiempo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.relaja} color="#5AD08A" />
    </>
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
