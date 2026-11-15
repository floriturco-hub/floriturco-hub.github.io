import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/chip/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  antes: 1.8,
  aparato: 3.38,
  final: 4.6,
  la: 7.2,
  iguales: 8.74,
  quien: 10.08,
  identica: 11.9,
  el: 13.44,
  computadora: 14.56,
  clave: 16.12,
  nunca: 17.78,
  en: 19.18,
  desafio: 20.7,
  responde: 22.02,
  codigo: 23.1,
  firmado: 23.78,
  ese: 25.42,
  vez: 26.74,
  si: 27.62,
  noVale: 28.76,
  tu: 29.22,
  nuevo: 31.2,
  lo: 32.86,
  internet: 35.02,
  porEso: 36.3,
  fin: 38.18,
};

const AZUL = "#2A4A8A";
const ORO = "#E8C048";

// Tarjeta bancaria: frente (chip) o reverso (banda)
const TarjetaBanco: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly reverso?: boolean; readonly color?: string; readonly rot?: number; readonly op?: number }> = ({
  x,
  y,
  s,
  reverso = false,
  color = AZUL,
  rot = 0,
  op = 1,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={op}>
    <rect x={-240} y={-150} width={480} height={300} rx={26} fill={color} />
    {reverso ? (
      <rect x={-240} y={-100} width={480} height={70} fill="#1A1620" />
    ) : (
      <>
        <rect x={-180} y={-60} width={90} height={70} rx={12} fill={ORO} />
        <path d="M -180 -25 L -90 -25 M -135 -60 L -135 10 M -160 -60 L -160 10 M -110 -60 L -110 10" stroke="#A88A28" strokeWidth={3} />
        <text x={-190} y={80} fontSize={30} fontWeight={700} fill={C.white} fontFamily="JetBrains Mono" opacity={0.8}>
          **** **** **** 4521
        </text>
      </>
    )}
  </g>
);

// Imagen del gancho y del cierre: tarjeta y su clon con interrogación
const Clon: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <TarjetaBanco x={470} y={860} s={1.2} rot={-8} />
    <g opacity={q}>
      <rect x={430} y={680} width={576} height={360} rx={31} fill="none" stroke={C.red} strokeWidth={8} strokeDasharray="24 16" transform="rotate(8 718 860)" />
      <Texto x={760} y={1260} size={110} color={C.yellow}>
        ?
      </Texto>
    </g>
  </>
);

// A. Gancho: ¿por qué ya no clonan tu tarjeta?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.antes], [1.12, 1])}>
        <Clon q={interpolate(t, [0.5, 0.9], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={0.54} color={C.red} />
    </>
  );
};

// B. Antes bastaba con pasarla por un aparato escondido + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pasa = interpolate(t, [T.antes + 0.4, T.aparato + 0.8], [-300, 1300], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.antes, T.la], [1, 1.05])}>
      <rect x={380} y={640} width={320} height={260} rx={20} fill="#3A3650" />
      <rect x={380} y={760} width={320} height={22} fill="#1A1620" />
      <circle cx={660} cy={680} r={12} fill={C.red} opacity={0.5 + 0.5 * Math.sin(t * 8)} />
      <TarjetaBanco x={pasa} y={770} s={0.6} reverso />
      <Texto x={540} y={1000} size={38} color={C.red} op={aparece(t, T.aparato)}>
        lector escondido
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.la], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={40}>
          qué sigue en riesgo: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. La banda guarda tus datos siempre iguales: quien los copia fabrica otra idéntica
export const Banda: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const copia = interpolate(t, [T.quien + 0.4, T.identica + 0.3], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.la, T.el], [1, 1.04])}>
      <TarjetaBanco x={540} y={660} s={0.9} reverso />
      <Texto x={540} y={668} size={30} color={C.cyan} op={aparece(t, T.iguales)}>
        4521-8830-0927-1144
      </Texto>
      <Texto x={540} y={860} size={34} color={C.white} op={aparece(t, T.iguales)}>
        siempre los mismos datos
      </Texto>
      <TarjetaBanco x={540} y={1150} s={0.9} reverso color="#4A4466" op={aparece(t, T.quien)} />
      <Texto x={540} y={1158} size={30} color={C.cyan} op={copia}>
        4521-8830-0927-1144
      </Texto>
      <Texto x={540} y={1360} size={38} color={C.red} op={aparece(t, T.identica)}>
        clon idéntico
      </Texto>
    </Lienzo>
  );
};

// Llave
const Llave: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={-40} cy={0} r={34} fill="none" stroke={C.yellow} strokeWidth={14} />
    <path d="M -6 0 L 70 0 M 50 0 L 50 26 M 66 0 L 66 20" stroke={C.yellow} strokeWidth={14} fill="none" />
  </g>
);

// D. El chip es una pequeña computadora con una clave secreta que nunca sale de él
export const Chip: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.el, T.en], [1, 1.04])}>
      <rect x={290} y={560} width={500} height={420} rx={50} fill={ORO} />
      <rect x={350} y={620} width={380} height={300} rx={24} fill="#1A1A28" />
      {new Array(8).fill(0).map((_, k) => (
        <line key={k} x1={350} y1={650 + k * 36} x2={730} y2={650 + k * 36} stroke="#3A5A3A" strokeWidth={4} opacity={aparece(t, T.computadora)} />
      ))}
      <g opacity={aparece(t, T.clave)}>
        <rect x={470} y={720} width={140} height={110} rx={16} fill="#2A2640" stroke={C.yellow} strokeWidth={4} />
        <Llave x={540} y={775} s={0.8} />
      </g>
      <Texto x={540} y={1090} size={40} color={C.white} op={aparece(t, T.computadora)}>
        una pequeña computadora
      </Texto>
      <Texto x={540} y={1170} size={40} color={C.yellow} op={aparece(t, T.clave)}>
        clave secreta
      </Texto>
      <Texto x={540} y={1250} size={36} color={C.red} op={aparece(t, T.nunca)}>
        nunca sale del chip
      </Texto>
    </Lienzo>
  );
};

// E. El lector manda un desafío y el chip responde con un código único firmado
export const Desafio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ida = interpolate(t, [T.desafio, T.desafio + 0.9], [0, 1], suave);
  const vuelta = interpolate(t, [T.responde + 0.2, T.codigo + 0.6], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.en, T.ese], [1, 1.04])}>
      {/* lector */}
      <rect x={120} y={600} width={260} height={420} rx={30} fill="#3A3650" />
      <rect x={150} y={640} width={200} height={120} rx={10} fill="#0A1A10" />
      <Texto x={250} y={1080} size={32} color={C.grey}>
        lector
      </Texto>
      {/* chip */}
      <rect x={720} y={700} width={220} height={180} rx={24} fill={ORO} />
      <Llave x={830} y={790} s={0.6} />
      <Texto x={830} y={1080} size={32} color={ORO}>
        chip
      </Texto>
      <g opacity={aparece(t, T.desafio)}>
        <rect x={interpolate(ida, [0, 1], [380, 560]) - 110} y={680} width={220} height={60} rx={14} fill={C.card} stroke={C.cyan} strokeWidth={4} />
        <Texto x={interpolate(ida, [0, 1], [380, 560])} y={722} size={30} color={C.cyan}>
          desafío 7F3A
        </Texto>
      </g>
      <g opacity={aparece(t, T.responde)}>
        <rect x={interpolate(vuelta, [0, 1], [720, 520]) - 140} y={880} width={280} height={60} rx={14} fill={C.card} stroke={C.yellow} strokeWidth={4} />
        <Texto x={interpolate(vuelta, [0, 1], [720, 520])} y={922} size={30} color={C.yellow}>
          código 9C21E8
        </Texto>
      </g>
      <Texto x={540} y={1250} size={38} color={C.yellow} op={aparece(t, T.firmado)}>
        firmado con la clave secreta
      </Texto>
    </Lienzo>
  );
};

// F. Ese código solo sirve una vez: si alguien lo copia, ya no vale
export const UnaVez: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.ese, T.tu], [1, 1.04])}>
        <rect x={290} y={620} width={500} height={150} rx={20} fill={C.card} stroke={C.yellow} strokeWidth={4} />
        <Texto x={540} y={712} size={50} color={C.yellow}>
          9C21E8
        </Texto>
        <g opacity={aparece(t, T.vez)} transform="translate(540 700) rotate(-10)">
          <rect x={-170} y={-50} width={340} height={100} rx={12} fill="none" stroke={C.grey} strokeWidth={8} />
          <Texto x={0} y={18} size={50} color={C.grey}>
            USADO
          </Texto>
        </g>
        <g opacity={aparece(t, T.si)}>
          <rect x={290} y={950} width={500} height={150} rx={20} fill={C.card} stroke={C.red} strokeWidth={4} strokeDasharray="20 12" />
          <Texto x={540} y={1042} size={50} color={C.red}>
            9C21E8
          </Texto>
          <Texto x={540} y={930} size={30} color={C.grey}>
            copia
          </Texto>
        </g>
        <g opacity={aparece(t, T.noVale)} transform="translate(860 1025)">
          <path d="M -40 -40 L 40 40 M 40 -40 L -40 40" stroke={C.red} strokeWidth={16} strokeLinecap="round" />
        </g>
      </Lienzo>
      <Flash t={t} d={T.noVale} color={C.red} />
    </>
  );
};

// G. Tu teléfono hace lo mismo, con un código nuevo en cada pago
export const Telefono: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const codigos = ["4F81A2", "B7C30D", "19E5F7"];
  const i = Math.min(2, Math.floor(interpolate(t, [T.tu + 0.5, T.lo], [0, 3], clamp)));
  return (
    <Lienzo zoom={interpolate(t, [T.tu, T.lo], [1, 1.04])}>
      <g transform="translate(400 860)">
        <rect x={-150} y={-280} width={300} height={560} rx={40} fill="#1A1620" />
        <rect x={-130} y={-250} width={260} height={500} rx={24} fill="#2A2640" />
        <TarjetaBanco x={0} y={-60} s={0.45} />
      </g>
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M ${600 + k * 50} 760 q 30 100 0 200`} stroke={C.cyan} strokeWidth={8} fill="none" opacity={0.3 + 0.7 * Math.abs(Math.sin(t * 4 - k))} />
      ))}
      <rect x={720} y={800} width={260} height={120} rx={20} fill={C.card} stroke={C.yellow} strokeWidth={4} />
      <Texto x={850} y={875} size={40} color={C.yellow}>
        {codigos[i]}
      </Texto>
      <Texto x={540} y={1250} size={38} color={C.white} op={aparece(t, T.nuevo)}>
        un código nuevo en cada pago
      </Texto>
    </Lienzo>
  );
};

// H. Lo que sí sigue en riesgo: los datos que escribes en internet
export const Riesgo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.lo, T.porEso], [1, 1.04])}>
      <rect x={200} y={580} width={680} height={440} rx={20} fill="#2A2640" stroke={C.grey} strokeWidth={8} />
      <rect x={120} y={1020} width={840} height={40} rx={10} fill="#4A4466" />
      <rect x={260} y={680} width={560} height={70} rx={10} fill={C.white} />
      <Texto x={280} y={728} size={30} color="#1A1620" anchor="start">
        Número de tarjeta
      </Texto>
      <rect x={260} y={800} width={560} height={70} rx={10} fill={C.white} />
      <Texto x={280} y={848} size={30} color="#1A1620" anchor="start">
        CVV  ***
      </Texto>
      <g opacity={aparece(t, T.internet)} transform="translate(540 1200)">
        <path d="M 0 -80 L 90 70 L -90 70 Z" fill={C.yellow} />
        <Texto x={0} y={50} size={70} color="#1A1620">
          !
        </Texto>
      </g>
      <Texto x={540} y={1380} size={38} color={C.yellow} op={aparece(t, T.internet)}>
        cuidado con los datos en internet
      </Texto>
    </Lienzo>
  );
};

// I. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Clon q={interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp)} />
    </Lienzo>
  );
};
