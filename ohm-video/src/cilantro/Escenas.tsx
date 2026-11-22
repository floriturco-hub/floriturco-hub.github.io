import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/cilantro/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  y: 1.94,
  nariz: 3.42,
  final: 5.32,
  tiene: 7.1,
  aldehidos: 9.1,
  jabon: 10.3,
  lociones: 11.96,
  insectos: 13.12,
  para: 14.38,
  receptor: 16.08,
  or6a2: 16.82,
  hay: 18.58,
  gen: 20.56,
  fuerza: 22.26,
  ellas: 23.26,
  desaparece: 24.74,
  soloJabon: 25.68,
  siete: 27.1,
  buena: 30.2,
  machacas: 31.28,
  enzimas: 32.66,
  baja: 34.52,
  porque: 36.2,
  fin: 38.58,
};

const VERDE = "#4AB85A";
const JABON = "#8ADCF0";

// Ramita de cilantro
const Cilantro: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly op?: number }> = ({ x, y, s, op = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <path d="M 0 160 Q -10 40 0 -60" stroke="#3A8A3A" strokeWidth={10} fill="none" />
    <path d="M 0 40 Q -60 0 -90 -40 M 0 0 Q 60 -30 90 -70" stroke="#3A8A3A" strokeWidth={8} fill="none" />
    {[
      [0, -90],
      [-100, -60],
      [100, -90],
      [-50, -130],
      [55, -140],
    ].map(([cx, cy], k) => (
      <g key={k} transform={`translate(${cx} ${cy})`} fill={VERDE}>
        <circle cx={-18} cy={0} r={24} />
        <circle cx={18} cy={0} r={24} />
        <circle cx={0} cy={-22} r={24} />
      </g>
    ))}
  </g>
);

// Barra de jabón con burbujas
const Jabon: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly t: number; readonly op?: number }> = ({
  x,
  y,
  s,
  t,
  op = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <rect x={-150} y={-70} width={300} height={140} rx={50} fill={JABON} />
    <rect x={-120} y={-50} width={120} height={20} rx={10} fill={C.white} opacity={0.5} />
    {new Array(6).fill(0).map((_, k) => {
      const u = (t * 0.4 + k / 6) % 1;
      return (
        <circle
          key={k}
          cx={-110 + k * 44 + Math.sin(u * 6 + k) * 14}
          cy={-90 - u * 180}
          r={14 + (k % 3) * 8}
          fill="none"
          stroke={C.white}
          strokeWidth={4}
          opacity={0.7 * (1 - u)}
        />
      );
    })}
  </g>
);

// Imagen del gancho y del cierre: cilantro que se vuelve jabón
const CilantroJabon: React.FC<{ readonly t: number; readonly mezcla: number }> = ({ t, mezcla }) => (
  <>
    <circle cx={540} cy={860} r={330} fill={JABON} opacity={0.1 * mezcla} />
    <Cilantro x={interpolate(mezcla, [0, 1], [540, 330])} y={820} s={1.6} />
    <g opacity={mezcla}>
      <Texto x={570} y={880} size={90} color={C.white}>
        =
      </Texto>
      <Jabon x={800} y={860} s={0.9} t={t} />
    </g>
  </>
);

// A. Gancho: para algunos, el cilantro es jabón
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.y], [1.12, 1])}>
        <CilantroJabon t={t} mezcla={interpolate(t, [1.2, 1.6], [0, 1], suave)} />
      </Lienzo>
      <Flash t={t} d={1.5} color={JABON} />
    </>
  );
};

// Nariz de perfil (mirando a la izquierda)
const Nariz: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 120 -260 Q 80 -80 -60 40 Q -90 80 -40 100 L 60 100 Q 120 100 140 60" fill="#E8B890" />
    <ellipse cx={20} cy={80} rx={34} ry={14} fill="#8A5A40" />
  </g>
);

// B. No exageran: su nariz lo detecta de verdad + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.y, T.tiene], [1, 1.05])}>
      <Nariz x={720} y={820} s={1.6} />
      <Cilantro x={300} y={860} s={1} />
      {new Array(4).fill(0).map((_, k) => {
        const u = (t * 0.7 + k / 4) % 1;
        return (
          <path
            key={k}
            d={`M ${380 + u * 240} ${780 + Math.sin(k) * 30} q 20 -20 40 0 q 20 20 40 0`}
            stroke={JABON}
            strokeWidth={8}
            fill="none"
            opacity={aparece(t, T.nariz) * Math.sin(u * Math.PI)}
          />
        );
      })}
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.tiene], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={40}>
          si tiene arreglo: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Molécula de aldehído: cadena en zigzag terminada en C=O
const Aldehido: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly roto?: number; readonly color?: string }> = ({
  x,
  y,
  s,
  roto = 0,
  color = JABON,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g transform={`translate(${-roto * 40} ${roto * 20}) rotate(${-roto * 20})`}>
      <polyline points="-160,0 -120,-25 -80,0 -40,-25 0,0" fill="none" stroke={color} strokeWidth={10} strokeLinejoin="round" />
    </g>
    <g transform={`translate(${roto * 40} ${roto * 20}) rotate(${roto * 20})`}>
      <polyline points="0,0 40,-25 80,0" fill="none" stroke={color} strokeWidth={10} strokeLinejoin="round" />
      <line x1={80} y1={0} x2={80} y2={50} stroke={C.red} strokeWidth={10} />
      <line x1={96} y1={0} x2={96} y2={50} stroke={C.red} strokeWidth={10} />
      <circle cx={88} cy={66} r={16} fill={C.red} />
    </g>
  </g>
);

// C. El cilantro tiene aldehídos, parecidos a los del jabón, lociones e insectos
export const Aldehidos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.tiene, T.para], [1, 1.04])}>
      <Cilantro x={250} y={680} s={0.8} />
      <Aldehido x={700} y={640} s={1.3} />
      <Texto x={680} y={770} size={38} color={JABON} op={aparece(t, T.aldehidos)}>
        aldehídos
      </Texto>
      <g opacity={aparece(t, T.jabon)}>
        <Jabon x={220} y={1080} s={0.5} t={t} />
        <Texto x={220} y={1190} size={32} color={C.white}>
          jabón
        </Texto>
      </g>
      <g opacity={aparece(t, T.lociones)}>
        <rect x={500} y={980} width={80} height={170} rx={20} fill="#E8C8F0" />
        <rect x={520} y={950} width={40} height={40} rx={8} fill="#B88AC8" />
        <Texto x={540} y={1190} size={32} color={C.white}>
          lociones
        </Texto>
      </g>
      <g opacity={aparece(t, T.insectos)}>
        <ellipse cx={860} cy={1070} rx={70} ry={45} fill="#6A4A2A" />
        <circle cx={790} cy={1060} r={30} fill="#4A3A2A" />
        {[-40, 0, 40].map((dx) => (
          <g key={dx}>
            <line x1={860 + dx} y1={1100} x2={840 + dx} y2={1140} stroke="#4A3A2A" strokeWidth={6} />
            <line x1={860 + dx} y1={1040} x2={840 + dx} y2={1000} stroke="#4A3A2A" strokeWidth={6} />
          </g>
        ))}
        <Texto x={860} y={1190} size={32} color={C.white}>
          insectos
        </Texto>
      </g>
    </Lienzo>
  );
};

// Receptor olfativo (Y) en la membrana
const Receptor: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly brillo: number }> = ({ x, y, s, brillo }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-30} y={0} width={60} height={160} rx={20} fill={brillo > 0.5 ? C.yellow : "#8A5CC8"} />
    <rect x={-90} y={-110} width={50} height={140} rx={20} fill={brillo > 0.5 ? C.yellow : "#8A5CC8"} transform="rotate(-25 -65 30)" />
    <rect x={40} y={-110} width={50} height={140} rx={20} fill={brillo > 0.5 ? C.yellow : "#8A5CC8"} transform="rotate(25 65 30)" />
  </g>
);

// D. Para detectarlas, la nariz usa el receptor OR6A2
export const ReceptorOR: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const llega = interpolate(t, [T.receptor + 0.2, T.or6a2 + 0.4], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.para, T.hay], [1, 1.04])}>
        <rect x={60} y={1000} width={960} height={70} fill="#5A3A5A" />
        <Receptor x={540} y={840} s={1.3} brillo={llega > 0.95 ? 1 : 0} />
        <Aldehido x={interpolate(llega, [0, 1], [300, 520])} y={interpolate(llega, [0, 1], [560, 690])} s={0.8} />
        <g opacity={aparece(t, T.or6a2)}>
          <rect x={360} y={1130} width={360} height={90} rx={20} fill={C.card} stroke={C.yellow} strokeWidth={4} />
          <Texto x={540} y={1190} size={50} color={C.yellow}>
            OR6A2
          </Texto>
        </g>
        <Texto x={540} y={1300} size={36} color={C.white} op={aparece(t, T.receptor)}>
          receptor de olor
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.or6a2 + 0.4} color={C.yellow} />
    </>
  );
};

// E. Algunas personas nacen con una versión del gen que capta los aldehídos con fuerza
export const Gen: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fuerza = aparece(t, T.fuerza);
  return (
    <Lienzo zoom={interpolate(t, [T.hay, T.ellas], [1, 1.04])}>
      {/* ADN */}
      {new Array(14).fill(0).map((_, k) => {
        const x = 130 + k * 64;
        const a = Math.sin(k * 0.7 + t * 1.5) * 90;
        const marca = k === 7 && t > T.gen;
        return (
          <g key={k}>
            <line x1={x} y1={700 - a} x2={x} y2={700 + a} stroke={marca ? C.yellow : "#4A4466"} strokeWidth={marca ? 12 : 8} />
            <circle cx={x} cy={700 - a} r={14} fill={C.cyan} />
            <circle cx={x} cy={700 + a} r={14} fill={C.purpleLight} />
          </g>
        );
      })}
      <Texto x={578} y={890} size={34} color={C.yellow} op={aparece(t, T.gen)}>
        otra versión del gen
      </Texto>
      <g opacity={fuerza}>
        <Tarjeta x={180} y={980} w={720} h={250}>
          <Texto x={330} y={1040} size={30} color={C.grey}>
            versión común
          </Texto>
          <rect x={250} y={1170 - 60} width={160} height={60} rx={10} fill={C.purpleLight} />
          <Texto x={750} y={1040} size={30} color={C.yellow}>
            otra versión
          </Texto>
          <rect x={670} y={1170 - 110 * fuerza} width={160} height={110 * fuerza} rx={10} fill={C.yellow} />
        </Tarjeta>
      </g>
    </Lienzo>
  );
};

// Cabeza esquemática
const Cabeza: React.FC<{ readonly x: number; readonly y: number; readonly cara: "feliz" | "asco" }> = ({ x, y, cara }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={120} fill="#E8B890" />
    <circle cx={-40} cy={-20} r={14} fill="#1A1010" />
    <circle cx={40} cy={-20} r={14} fill="#1A1010" />
    {cara === "feliz" ? (
      <path d="M -50 40 Q 0 80 50 40" stroke="#5A1A20" strokeWidth={10} fill="none" strokeLinecap="round" />
    ) : (
      <path d="M -50 60 Q -25 30 0 60 Q 25 90 50 60" stroke="#5A1A20" strokeWidth={10} fill="none" strokeLinecap="round" />
    )}
  </g>
);

// F. Para ellas el aroma fresco desaparece y solo queda olor a jabón
export const Sabor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fuera = aparece(t, T.desaparece);
  return (
    <Lienzo zoom={interpolate(t, [T.ellas, T.siete], [1, 1.04])}>
      <Cabeza x={290} y={720} cara="feliz" />
      <Cabeza x={790} y={720} cara="asco" />
      <Cilantro x={290} y={1120} s={0.7} />
      <Texto x={290} y={1300} size={36} color={VERDE}>
        fresco
      </Texto>
      <g opacity={1 - fuera}>
        <Cilantro x={790} y={1120} s={0.7} />
      </g>
      <g opacity={aparece(t, T.soloJabon - 0.5)}>
        <Jabon x={790} y={1120} s={0.6} t={t} />
      </g>
      <Texto x={790} y={1300} size={36} color={JABON} op={aparece(t, T.soloJabon)}>
        jabón
      </Texto>
    </Lienzo>
  );
};

// G. Le pasa a una de cada siete personas
export const Siete: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.siete, T.buena], [1, 1.04])}>
      {new Array(7).fill(0).map((_, k) => {
        const x = 150 + k * 130;
        const marcada = k === 3;
        return (
          <g key={k} opacity={aparece(t, T.siete + 0.6 + k * 0.08)} fill={marcada ? JABON : "#4A4466"}>
            <circle cx={x} cy={740} r={40} />
            <rect x={x - 45} y={790} width={90} height={160} rx={30} />
          </g>
        );
      })}
      <Texto x={540} y={1110} size={64} color={JABON} op={aparece(t, T.siete + 1.4)}>
        1 de cada 7
      </Texto>
    </Lienzo>
  );
};

// H. Si machacas el cilantro, sus enzimas rompen los aldehídos y el jabón baja
export const Machacar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const golpe = Math.abs(Math.sin((t - T.machacas) * 6)) * aparece(t, T.machacas);
  const roto = interpolate(t, [T.enzimas, T.baja], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.buena, T.porque], [1, 1.04])}>
      {/* mortero */}
      <path d="M 200 900 L 560 900 Q 560 1150 380 1150 Q 200 1150 200 900 Z" fill="#6A6488" />
      <ellipse cx={380} cy={900} rx={180} ry={30} fill="#3A3650" />
      <Cilantro x={380} y={920} s={0.5} />
      <rect x={400} y={600 + golpe * 160} width={50} height={300} rx={25} fill="#8A86A8" transform={`rotate(20 425 ${750 + golpe * 160})`} />
      <Aldehido x={780} y={760} s={0.9} roto={roto} />
      <Texto x={780} y={880} size={34} color={C.white} op={aparece(t, T.enzimas)}>
        las enzimas lo rompen
      </Texto>
      <g opacity={aparece(t, T.enzimas)}>
        <Texto x={780} y={1000} size={30} color={C.grey}>
          sabor a jabón
        </Texto>
        <rect x={640} y={1030} width={280} height={36} rx={18} fill="#2A2440" />
        <rect x={640} y={1030} width={280 * (1 - roto * 0.7)} height={36} rx={18} fill={JABON} />
      </g>
    </Lienzo>
  );
};

// I. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porque, T.fin + 0.5], [1, 1.12])}>
      <CilantroJabon t={t} mezcla={1} />
    </Lienzo>
  );
};
