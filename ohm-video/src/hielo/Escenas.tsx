import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/hielo/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  el: 1.72,
  caes: 3.42,
  final: 4.82,
  durante: 7.2,
  presion: 9.16,
  pero: 11.56,
  noBasta: 13.3,
  hoy: 15.0,
  especial: 17.02,
  sus: 17.86,
  vecinas: 19.74,
  liquidas: 22.36,
  ademas: 23.66,
  friccion: 25.28,
  derrite: 26.58,
  esa: 28.84,
  lubricante: 30.2,
  al: 31.8,
  sujetas: 33.72,
  porEso: 35.94,
  fin: 37.64,
};

const HIELO = "#A8E0F0";
const VIDRIO = "#8A9AA8";
const AGUA = "#4AA8E8";

// Patín (bota + cuchilla) mirando a la derecha
const Patin: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -120 -40 L -120 -220 L -20 -220 L -10 -110 L 120 -80 Q 150 -60 140 -40 Z" fill={C.white} />
    <rect x={-130} y={-48} width={280} height={20} rx={8} fill="#6A6488" />
    <rect x={-100} y={-30} width={20} height={20} fill="#8A86A8" />
    <rect x={80} y={-30} width={20} height={20} fill="#8A86A8" />
    <path d="M -150 -10 L 160 -10 Q 190 -10 180 0 L -150 0 Z" fill="#C8C4D8" />
  </g>
);

// Imagen del gancho y del cierre: patín deslizándose sobre el hielo
const PatinHielo: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <rect x={0} y={1000} width={1080} height={420} fill={HIELO} />
    <rect x={0} y={1000} width={1080} height={10} fill={C.white} opacity={0.6} />
    {[0, 1, 2, 3].map((k) => (
      <line key={k} x1={((k * 300 - t * 400) % 1200 + 1200) % 1200 - 60} y1={1060 + k * 70} x2={((k * 300 - t * 400) % 1200 + 1200) % 1200 + 140} y2={1060 + k * 70} stroke={C.white} strokeWidth={6} opacity={0.6} />
    ))}
    <Patin x={540} y={1000} s={1.6} />
    {[0, 1, 2].map((k) => (
      <line key={k} x1={180} y1={760 + k * 60} x2={320 - k * 20} y2={760 + k * 60} stroke={C.white} strokeWidth={8} strokeLinecap="round" opacity={0.6} />
    ))}
    <Texto x={540} y={560} size={110} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué resbala tanto el hielo?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.el], [1.12, 1])}>
        <PatinHielo t={t} q={interpolate(t, [0.6, 0.9], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={0.7} color={HIELO} />
    </>
  );
};

// Zapato simple
const Zapato: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -110 0 L -110 -90 L -20 -90 L 10 -40 L 110 -30 Q 130 -10 110 0 Z" fill="#8A4A3A" />
    <rect x={-115} y={-6} width={235} height={14} rx={6} fill="#3A2A20" />
  </g>
);

// B. El vidrio también es liso y no te caes + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const resbala = Math.sin(t * 4) * 50;
  return (
    <Lienzo zoom={interpolate(t, [T.el, T.durante], [1, 1.05])}>
      <rect x={60} y={900} width={440} height={160} fill={HIELO} />
      <Zapato x={280 + resbala} y={900} s={1} rot={Math.sin(t * 4) * 6} />
      <Texto x={280} y={1130} size={38} color={HIELO}>
        hielo
      </Texto>
      <g opacity={aparece(t, T.el + 0.3)}>
        <rect x={580} y={900} width={440} height={160} fill={VIDRIO} />
        <rect x={580} y={900} width={440} height={12} fill={C.white} opacity={0.5} />
        <Zapato x={800} y={900} s={1} />
        <Texto x={800} y={1130} size={38} color={VIDRIO}>
          vidrio
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1300} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1300}
          width={700 * interpolate(t, [T.final, T.durante], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1400} color={C.white} size={40}>
          qué le falta al vidrio: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Durante un siglo se creyó que la presión del patín derretía el hielo; los cálculos no cuadran
export const Presion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const no = aparece(t, T.pero);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.durante, T.hoy], [1, 1.04])}>
        <rect x={0} y={1000} width={1080} height={400} fill={HIELO} />
        <Patin x={540} y={1000} s={1.4} />
        {[-1, 0, 1].map((k) => (
          <g key={k} opacity={aparece(t, T.presion)}>
            <line x1={540 + k * 140} y1={520} x2={540 + k * 140} y2={640} stroke={C.yellow} strokeWidth={12} />
            <path d={`M ${520 + k * 140} 640 L ${540 + k * 140} 680 L ${560 + k * 140} 640 Z`} fill={C.yellow} />
          </g>
        ))}
        <Texto x={540} y={480} size={40} color={C.yellow} op={aparece(t, T.presion)}>
          ¿la presión lo derrite?
        </Texto>
        <g opacity={no}>
          <rect x={220} y={1110} width={640} height={110} rx={20} fill={C.card} stroke={C.red} strokeWidth={4} />
          <Texto x={540} y={1180} size={40} color={C.red}>
            los cálculos no cuadran
          </Texto>
          <line x1={180} y1={440} x2={900} y2={720} stroke={C.red} strokeWidth={12} opacity={aparece(t, T.noBasta)} />
        </g>
      </Lienzo>
      <Flash t={t} d={T.pero} color={C.red} />
    </>
  );
};

// D. La superficie del hielo es especial: sus moléculas de arriba casi no tienen vecinas y se mueven como líquidas
export const Superficie: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const libre = aparece(t, T.vecinas);
  const filas = 6;
  return (
    <Lienzo zoom={interpolate(t, [T.hoy, T.ademas], [1, 1.05])}>
      {new Array(filas).fill(0).map((_, r) =>
        new Array(9).fill(0).map((__, c) => {
          const arriba = r === 0;
          const mov = arriba ? libre : 0.08;
          const x = 160 + c * 95 + (r % 2) * 47 + Math.sin(t * 7 + c * 1.7 + r) * 30 * mov;
          const y = 640 + r * 95 + Math.cos(t * 6 + c * 2.1) * 30 * mov;
          return (
            <g key={`${r}${c}`}>
              {!arriba && c < 8 ? <line x1={x} y1={y} x2={x + 95} y2={y} stroke="#6AA8C8" strokeWidth={6} /> : null}
              {!arriba && r > 1 ? <line x1={x} y1={y} x2={x - 47} y2={y - 95} stroke="#6AA8C8" strokeWidth={6} /> : null}
              <circle cx={x} cy={y} r={26} fill={arriba && libre > 0.5 ? AGUA : HIELO} />
            </g>
          );
        }),
      )}
      <Texto x={540} y={540} size={38} color={AGUA} op={libre}>
        capa de arriba: casi líquida
      </Texto>
      <Texto x={540} y={1300} size={38} color={HIELO} op={aparece(t, T.sus)}>
        moléculas de hielo
      </Texto>
    </Lienzo>
  );
};

// E. Al deslizarte, la fricción calienta y derrite una capa finísima de agua
export const Friccion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const capa = interpolate(t, [T.derrite, T.esa], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.ademas, T.esa], [1, 1.05])}>
      <rect x={0} y={1000} width={1080} height={400} fill={HIELO} />
      <rect x={0} y={1000 - 14 * capa} width={1080} height={14 * capa + 2} fill={AGUA} />
      <Patin x={540 + Math.sin(t * 2) * 40} y={1000 - 14 * capa} s={1.4} />
      {[0, 1, 2, 3].map((k) => (
        <path
          key={k}
          d={`M ${400 + k * 90} 1060 q 14 -20 0 -40 q -14 -20 0 -40`}
          stroke={C.orange}
          strokeWidth={8}
          fill="none"
          opacity={aparece(t, T.friccion) * (0.5 + 0.5 * Math.sin(t * 8 + k))}
          transform="translate(0 30)"
        />
      ))}
      <Texto x={540} y={1250} size={40} color={C.orange} op={aparece(t, T.friccion)}>
        la fricción calienta
      </Texto>
      <Texto x={540} y={1320} size={38} color={AGUA} op={aparece(t, T.derrite)}>
        capa finísima de agua
      </Texto>
    </Lienzo>
  );
};

// F. Esa capa funciona como un lubricante bajo tus pies
export const Lubricante: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.esa, T.al], [1, 1.04])}>
      <rect x={100} y={600} width={880} height={160} rx={10} fill="#C8C4D8" />
      <Texto x={540} y={700} size={40} color="#1A1620">
        cuchilla
      </Texto>
      <rect x={100} y={780} width={880} height={70} fill={AGUA} />
      {new Array(10).fill(0).map((_, k) => (
        <circle key={k} cx={130 + ((k * 90 + t * 260) % 860)} cy={815} r={16} fill="#8AD0F8" />
      ))}
      <Texto x={540} y={830} size={32} color={C.white}>
        agua
      </Texto>
      <rect x={100} y={870} width={880} height={300} fill={HIELO} />
      <Texto x={540} y={1040} size={40} color="#1A3A5A">
        hielo
      </Texto>
      <Texto x={540} y={1300} size={42} color={C.yellow} op={aparece(t, T.lubricante)}>
        como un lubricante
      </Texto>
    </Lienzo>
  );
};

// G. Al vidrio le falta esa capa: sus moléculas están bien sujetas
export const Vidrio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.al, T.porEso], [1, 1.04])}>
        {new Array(5).fill(0).map((_, r) =>
          new Array(9).fill(0).map((__, c) => {
            const x = 160 + c * 95 + (r % 2) * 47;
            const y = 700 + r * 95;
            return (
              <g key={`${r}${c}`}>
                {c < 8 ? <line x1={x} y1={y} x2={x + 95} y2={y} stroke="#6A7A88" strokeWidth={8} /> : null}
                {r > 0 ? <line x1={x} y1={y} x2={x - 47} y2={y - 95} stroke="#6A7A88" strokeWidth={8} /> : null}
                <circle cx={x} cy={y} r={26} fill={VIDRIO} />
              </g>
            );
          }),
        )}
        <Zapato x={540} y={660} s={1.4} />
        <Texto x={540} y={460} size={40} color={C.white} op={aparece(t, T.al)}>
          vidrio: sin capa de agua
        </Texto>
        <Texto x={540} y={1300} size={40} color={VIDRIO} op={aparece(t, T.sujetas)}>
          moléculas bien sujetas
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.al} color={VIDRIO} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <PatinHielo t={t} q={1} />
    </Lienzo>
  );
};
