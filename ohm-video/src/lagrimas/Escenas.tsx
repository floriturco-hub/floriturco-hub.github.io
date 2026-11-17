import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/lagrimas/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  tristeza: 2.28, // tristeza
  risa: 3.22, // risa
  escurre: 4.78, // escurre
  final: 6.08, // final
  esquina: 8.28, // esquina
  agujeritos: 10.10, // agujeritos
  puntos: 11.28, // puntos
  normalmente: 12.80, // normalmente
  drenan: 13.30, // drenan
  tubito: 15.90, // tubito
  nariz: 17.40, // nariz
  cuando: 18.02, // cuando
  muchas: 19.20, // muchas
  mejillas: 21.62, // mejillas
  tubo: 23.44, // tubo
  llega: 24.06, // llega
  mucosa: 25.86, // mucosa
  escurre2: 26.60, // escurre
  asi: 27.08, // asi
  lagrima: 29.02, // lagrima
  porEso: 30.48, // por
  fin: 32.22, // FIN
};

const PIEL = "#E8B48A";
const LAGRIMA = "#5AB8F8";

// Cara de frente; llora 0-1 (lágrimas por la mejilla), moco 0-1 (gota en la nariz); corte = conducto visible
const Cara: React.FC<{ readonly llora: number; readonly moco: number; readonly t: number; readonly corte?: number; readonly flujo?: number; readonly mucho?: number }> = ({
  llora,
  moco,
  t,
  corte = 0,
  flujo = 0,
  mucho = 0,
}) => (
  <g>
    <ellipse cx={540} cy={900} rx={330} ry={420} fill={PIEL} />
    {[-1, 1].map((sd) => (
      <g key={sd}>
        <path d={`M ${540 + sd * 70} 760 Q ${540 + sd * 140} 720 ${540 + sd * 210} 760 Q ${540 + sd * 140} 800 ${540 + sd * 70} 760 Z`} fill={C.white} />
        <circle cx={540 + sd * 140} cy={760} r={26} fill="#5A3A2A" />
        <path d={`M ${540 + sd * 70} 700 Q ${540 + sd * 140} 670 ${540 + sd * 210} 700`} stroke="#5A3A2A" strokeWidth={10} fill="none" />
        {[0, 1].map((k) => {
          const u = (t * 0.6 + k * 0.5) % 1;
          return <ellipse key={k} cx={540 + sd * 190} cy={790 + u * 300} rx={10} ry={16} fill={LAGRIMA} opacity={llora * (1 - u * 0.5)} />;
        })}
      </g>
    ))}
    <path d="M 540 780 L 500 960 Q 540 990 580 960 Z" fill="#D89A72" />
    <ellipse cx={515 + 0} cy={980 + moco * 40} rx={10 + moco * 4} ry={14 + moco * 10} fill={LAGRIMA} opacity={moco} />
    <path d="M 450 1080 Q 540 1040 630 1080" stroke="#A85A4A" strokeWidth={12} fill="none" />
    <g opacity={corte}>
      <ellipse cx={700} cy={700} rx={60} ry={34} fill="#F8C8D8" stroke="#C86A8A" strokeWidth={4} />
      <circle cx={610} cy={752} r={8} fill="#141030" />
      <circle cx={610} cy={772} r={8} fill="#141030" />
      <path d="M 610 760 Q 590 800 570 880 L 560 960" stroke="#C86A8A" strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d="M 610 760 Q 590 800 570 880 L 560 960" stroke={LAGRIMA} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray="14 14" strokeDashoffset={-t * 80} opacity={flujo} />
      {[0, 1, 2].map((k) => {
        const u = (t * 0.7 + k / 3) % 1;
        return <circle key={k} cx={700 - u * 90} cy={730 + u * 30} r={7 + mucho * 4} fill={LAGRIMA} opacity={flujo} />;
      })}
    </g>
  </g>
);

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Cara llora={1} moco={1} t={t} />
    <Texto x={540} y={440} size={110} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué lloras también por la nariz?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.tristeza], [1.08, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={LAGRIMA} />
    </>
  );
};

// B. Lloras de tristeza o de risa y te escurre la nariz + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.tristeza, T.esquina], [1, 1.04])}>
      <Cara llora={aparece(t, T.tristeza)} moco={aparece(t, T.escurre)} t={t} />
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1380} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1380}
          width={700 * interpolate(t, [T.final, T.esquina], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1470} color={C.white} size={38}>
          por qué no es moco: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. En la esquina interior de cada ojo hay dos agujeritos: los puntos lagrimales
export const Puntos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.esquina, T.normalmente], [1.25, 1.35])} cy={760}>
      <Cara llora={0} moco={0} t={t} corte={aparece(t, T.agujeritos) * 0.999} />
      <g opacity={aparece(t, T.puntos)}>
        <circle cx={610} cy={762} r={26} fill="none" stroke={C.yellow} strokeWidth={4} />
        <Texto x={540} y={700} size={26} color={C.yellow}>
          puntos lagrimales
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Normalmente drenan las pocas lágrimas por un tubito que baja a la nariz
export const Drenaje: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.normalmente, T.cuando], [1.25, 1.3])} cy={820}>
      <Cara llora={0} moco={aparece(t, T.nariz) * 0.3} t={t} corte={1} flujo={aparece(t, T.drenan)} />
      <Texto x={700} y={640} size={22} color="#C86A8A" op={aparece(t, T.drenan)}>
        glándula lagrimal
      </Texto>
      <Texto x={680} y={920} size={22} color={LAGRIMA} op={aparece(t, T.tubito)}>
        tubito a la nariz
      </Texto>
    </Lienzo>
  );
};

// E. Al llorar produces muchas más: unas caen por las mejillas, otras se van por el tubo
export const Llanto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cuando, T.llega], [1.2, 1.25])} cy={860}>
        <Cara llora={aparece(t, T.mejillas)} moco={aparece(t, T.tubo) * 0.6} t={t} corte={1} flujo={1} mucho={aparece(t, T.muchas)} />
        <Texto x={540} y={1350} size={34} color={LAGRIMA} op={aparece(t, T.muchas)}>
          muchas más lágrimas
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.muchas} color={LAGRIMA} />
    </>
  );
};

// F. Llega a la nariz, se mezcla con la mucosa y escurre: casi todo es lágrima, no moco
export const Nariz: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.llega, T.porEso], [1, 1.04])}>
        <path d="M 540 520 L 330 1150 Q 540 1260 750 1150 Z" fill="#D89A72" />
        <ellipse cx={430} cy={1160} rx={60} ry={34} fill="#3A1A2A" />
        <ellipse cx={650} cy={1160} rx={60} ry={34} fill="#3A1A2A" />
        {new Array(8).fill(0).map((_, k) => {
          const u = (t * 0.5 + k / 8) % 1;
          return <circle key={k} cx={480 + (k % 3) * 40} cy={620 + u * 520} r={14} fill={LAGRIMA} opacity={aparece(t, T.llega)} />;
        })}
        <g opacity={aparece(t, T.mucosa)}>
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={460 + k * 60} cy={900 + k * 60} r={12} fill="#C8E8A8" opacity={0.8} />
          ))}
        </g>
        <ellipse cx={430} cy={1220 + ((t * 60) % 80)} rx={14} ry={22} fill={LAGRIMA} opacity={aparece(t, T.escurre2)} />
        <Texto x={540} y={460} size={36} color={C.white} op={aparece(t, T.mucosa) * (1 - aparece(t, T.asi))}>
          se mezcla con la mucosa
        </Texto>
        <g opacity={aparece(t, T.lagrima)}>
          <rect x={240} y={1330} width={600} height={110} rx={20} fill={C.card} stroke={LAGRIMA} strokeWidth={4} />
          <Texto x={540} y={1400} size={40} color={LAGRIMA}>
            casi todo lágrima
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.lagrima} color={LAGRIMA} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.08])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
