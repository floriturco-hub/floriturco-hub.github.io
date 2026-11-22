import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/flash/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  la: 2.42,
  siguen: 4.54,
  final: 5.7,
  por: 8.24,
  celdas: 10.18,
  jaula: 12.06,
  para: 13.38,
  voltaje: 14.54,
  electrones: 15.8,
  atrapados: 19.14,
  sin: 20.44,
  salir: 22.26,
  asi: 22.98,
  leer: 24.5,
  llena: 26.7,
  pero: 27.68,
  escapan: 31.18,
  copia: 32.0,
  asi2: 34.44,
  fin: 36.72,
};

const AISLANTE = "#8A86A8";
const JAULA = C.yellow;
const ELECTRON = C.cyan;

// Memoria USB
const Usb: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-90} y={-180} width={180} height={300} rx={30} fill="#3A3650" />
    <rect x={-60} y={-260} width={120} height={90} rx={8} fill="#C8C4D8" />
    <rect x={-35} y={-235} width={25} height={25} fill="#3A3650" />
    <rect x={10} y={-235} width={25} height={25} fill="#3A3650" />
    <circle cx={0} cy={60} r={14} fill={C.cyan} opacity={0.6} />
  </g>
);

// Foto
const Foto: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly rot: number }> = ({ x, y, s, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-70} y={-55} width={140} height={110} fill={C.white} />
    <rect x={-60} y={-45} width={120} height={80} fill="#6AA8D8" />
    <path d="M -60 35 L -20 -5 L 10 20 L 30 0 L 60 35 Z" fill="#3A8A5A" />
    <circle cx={35} cy={-25} r={10} fill={C.yellow} />
  </g>
);

// A. Gancho: ¿cómo recuerda una memoria sin electricidad?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.la], [1.12, 1])}>
        <Usb x={540} y={960} s={1.4} />
        <g opacity={q} transform="translate(820 620)">
          <path d="M 10 -60 L -30 10 L 0 10 L -15 60 L 35 -15 L 5 -15 L 20 -60 Z" fill={C.yellow} />
          <line x1={-60} y1={-70} x2={70} y2={70} stroke={C.red} strokeWidth={12} />
        </g>
        <Texto x={300} y={680} size={110} color={C.yellow} op={q}>
          ?
        </Texto>
      </Lienzo>
      <Flash t={t} d={0.74} color={C.cyan} />
    </>
  );
};

// B. La desconectas durante años y tus fotos siguen ahí + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const anos = Math.floor(interpolate(t, [T.la, T.siguen + 0.5], [0, 10], clamp));
  return (
    <Lienzo zoom={interpolate(t, [T.la, T.por], [1, 1.05])}>
      <Usb x={330} y={900} s={0.9} />
      <g transform="translate(760 760)">
        <rect x={-120} y={-100} width={240} height={200} rx={16} fill={C.card} stroke={C.grey} strokeWidth={4} />
        <Texto x={0} y={-30} size={30} color={C.grey}>
          años
        </Texto>
        <Texto x={0} y={50} size={70} color={C.white}>
          {`${anos}`}
        </Texto>
      </g>
      {[0, 1, 2].map((k) => (
        <g key={k} opacity={aparece(t, T.siguen + k * 0.15)}>
          <Foto x={640 + k * 120} y={1020 + (k % 2) * 30} s={0.8} rot={k * 8 - 8} />
        </g>
      ))}
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1300} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1300}
          width={700 * interpolate(t, [T.final, T.por], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1400} color={C.white} size={38}>
          por qué no dura para siempre: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Celda en corte: canal abajo, aislante, jaula (compuerta flotante), aislante, control arriba
const Celda: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly carga: number; readonly t: number; readonly fuga?: number; readonly grietas?: number }> = ({
  x,
  y,
  s,
  carga,
  t,
  fuga = 0,
  grietas = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-260} y={-260} width={520} height={80} rx={10} fill="#4A4466" />
    <rect x={-260} y={-180} width={520} height={50} fill={AISLANTE} opacity={0.7} />
    <rect x={-260} y={-130} width={520} height={120} rx={10} fill="none" stroke={JAULA} strokeWidth={10} />
    <rect x={-260} y={-10} width={520} height={30} fill={AISLANTE} opacity={0.7} />
    <rect x={-300} y={20} width={600} height={120} rx={10} fill="#2A4A3A" />
    {new Array(10).fill(0).map((_, k) => {
      const dentro = k / 10 < carga;
      const escapa = k < 10 * fuga;
      const jx = -220 + k * 48 + Math.sin(t * 3 + k) * 6;
      const jy = -70 + Math.cos(t * 4 + k) * 20;
      return dentro ? (
        <circle key={k} cx={jx} cy={escapa ? jy + 160 : jy} r={14} fill={ELECTRON} opacity={escapa ? 0.4 : 1} />
      ) : null;
    })}
    {new Array(5).fill(0).map((_, k) => (
      <path key={`g${k}`} d={`M ${-200 + k * 100} -10 l 10 15 l -8 10 l 10 15`} stroke={C.red} strokeWidth={4} fill="none" opacity={grietas > k / 5 ? 1 : 0} />
    ))}
  </g>
);

// C. Por dentro tiene miles de millones de celdas, cada una con una pequeña jaula aislada
export const Celdas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const zoom = aparece(t, T.jaula - 0.6);
  return (
    <Lienzo zoom={interpolate(t, [T.por, T.para], [1, 1.04])}>
      <g opacity={1 - zoom}>
        {new Array(12).fill(0).map((_, i) =>
          new Array(12).fill(0).map((__, j) => (
            <rect key={`${i}${j}`} x={190 + i * 58} y={520 + j * 58} width={48} height={48} rx={6} fill={random(`c${i}${j}`) > 0.5 ? C.cyan : "#3A3650"} opacity={aparece(t, T.celdas - 0.5)} />
          )),
        )}
      </g>
      <g opacity={zoom}>
        <Celda x={540} y={860} s={1.3} carga={0} t={t} />
        <Texto x={540} y={1150} size={40} color={JAULA}>
          una jaula aislada
        </Texto>
      </g>
      <Texto x={540} y={1300} size={36} color={C.white} op={aparece(t, T.celdas) * (1 - zoom)}>
        miles de millones de celdas
      </Texto>
    </Lienzo>
  );
};

// D. Un voltaje alto empuja electrones a través del aislante y quedan atrapados en la jaula
export const Escribir: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const carga = interpolate(t, [T.electrones, T.atrapados + 0.3], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.para, T.sin], [1, 1.04])}>
        <Celda x={540} y={860} s={1.3} carga={carga} t={t} />
        <g opacity={aparece(t, T.voltaje)}>
          <path d="M 540 470 L 540 520" stroke={C.yellow} strokeWidth={10} />
          <Texto x={540} y={450} size={40} color={C.yellow}>
            + voltaje alto
          </Texto>
        </g>
        {[0, 1, 2].map((k) => {
          const u = ((t - T.electrones) * 1.2 + k / 3) % 1;
          return <circle key={k} cx={380 + k * 140} cy={1020 - u * 160} r={14} fill={ELECTRON} opacity={aparece(t, T.electrones) * (carga < 1 ? 1 : 0)} />;
        })}
        <Texto x={540} y={1180} size={38} color={ELECTRON} op={aparece(t, T.atrapados)}>
          electrones atrapados
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.atrapados} color={C.cyan} />
    </>
  );
};

// E. Sin electricidad no tienen por dónde salir: así se guarda el dato
export const SinLuz: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.sin, T.leer], [1, 1.04])}>
      <Celda x={540} y={860} s={1.3} carga={1} t={t} />
      <g transform="translate(540 470)" opacity={aparece(t, T.sin)}>
        <path d="M 10 -50 L -25 10 L 0 10 L -12 50 L 30 -12 L 5 -12 L 18 -50 Z" fill={C.grey} />
        <line x1={-50} y1={-55} x2={55} y2={55} stroke={C.red} strokeWidth={10} />
      </g>
      <Texto x={540} y={1180} size={38} color={C.white} op={aparece(t, T.salir)}>
        no tienen por dónde salir
      </Texto>
      <Texto x={540} y={1260} size={40} color={C.yellow} op={aparece(t, T.asi)}>
        dato guardado
      </Texto>
    </Lienzo>
  );
};

// F. Para leer, el chip mide si la jaula está llena o vacía
export const Leer: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.leer, T.pero], [1, 1.04])}>
      <Celda x={300} y={860} s={0.8} carga={1} t={t} />
      <Celda x={780} y={860} s={0.8} carga={0} t={t} />
      <Texto x={300} y={1060} size={60} color={ELECTRON} op={aparece(t, T.llena - 0.4)}>
        0
      </Texto>
      <Texto x={780} y={1060} size={60} color={C.white} op={aparece(t, T.llena)}>
        1
      </Texto>
      <Texto x={300} y={1130} size={30} color={C.grey} op={aparece(t, T.llena - 0.4)}>
        llena
      </Texto>
      <Texto x={780} y={1130} size={30} color={C.grey} op={aparece(t, T.llena)}>
        vacía
      </Texto>
    </Lienzo>
  );
};

// G. El aislante se desgasta y con los años algunos electrones escapan: copia tus archivos
export const Desgaste: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const grietas = interpolate(t, [T.pero + 0.3, T.escapan], [0, 1], clamp);
  const fuga = interpolate(t, [T.escapan - 1, T.copia], [0, 0.4], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.asi2], [1, 1.04])}>
      <Celda x={540} y={760} s={1.1} carga={1} t={t} fuga={fuga} grietas={grietas} />
      <Texto x={540} y={1000} size={36} color={C.red} op={aparece(t, T.pero + 0.6)}>
        el aislante se desgasta
      </Texto>
      <g opacity={aparece(t, T.copia)}>
        <Usb x={380} y={1300} s={0.45} />
        <path d="M 470 1240 L 620 1240" stroke={C.yellow} strokeWidth={8} />
        <path d="M 620 1220 L 650 1240 L 620 1260 Z" fill={C.yellow} />
        <Usb x={720} y={1300} s={0.45} />
        <Texto x={540} y={1440} size={36} color={C.yellow}>
          copia tus archivos importantes
        </Texto>
      </g>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi2, T.fin + 0.5], [1, 1.12])}>
      <Usb x={540} y={960} s={1.4} />
      <g opacity={q} transform="translate(820 620)">
        <path d="M 10 -60 L -30 10 L 0 10 L -15 60 L 35 -15 L 5 -15 L 20 -60 Z" fill={C.yellow} />
        <line x1={-60} y1={-70} x2={70} y2={70} stroke={C.red} strokeWidth={12} />
      </g>
      <Texto x={300} y={680} size={110} color={C.yellow} op={q}>
        ?
      </Texto>
    </Lienzo>
  );
};
