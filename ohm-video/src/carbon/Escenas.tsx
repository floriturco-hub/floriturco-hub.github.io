import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/carbon/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  suena: 1.92,
  urgencias: 3.26,
  final: 5.42,
  noAsar: 7.68,
  vapor: 9.74,
  poros: 10.96,
  cucharada: 12.56,
  superficie: 14.0,
  campo: 15.14,
  estomago: 16.46,
  choca: 17.68,
  pegado: 19.32,
  asi: 20.88,
  sangre: 21.9,
  sale: 22.48,
  pero: 24.46,
  solo: 25.76,
  ademas: 27.38,
  alcohol: 29.2,
  escapan: 31.24,
  porEso: 32.02,
  fin: 35.0,
};

const NEGRO = "#2A2733";
const VENENO = "#7AE04A";

// Vaso con líquido negro y cruz de hospital
const Vaso: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly t: number;
}> = ({ x, y, s, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -110 -160 L 110 -160 L 90 160 L -90 160 Z" fill="#2A2640" opacity={0.6} />
    <path
      d={`M -102 ${-80 + Math.sin(t * 3) * 4} Q 0 ${-95 + Math.sin(t * 3 + 1) * 6} 102 ${-80 + Math.sin(t * 3 + 2) * 4} L 90 160 L -90 160 Z`}
      fill={NEGRO}
    />
    <path
      d="M -110 -160 L 110 -160 L 90 160 L -90 160 Z"
      fill="none"
      stroke="#C8C4D8"
      strokeWidth={8}
    />
    <rect x={-70} y={-150} width={20} height={280} rx={8} fill="#FFFFFF" opacity={0.12} />
  </g>
);

const Cruz: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly op?: number }> = ({
  x,
  y,
  s,
  op = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <rect x={-60} y={-20} width={120} height={40} rx={6} fill={C.red} />
    <rect x={-20} y={-60} width={40} height={120} rx={6} fill={C.red} />
  </g>
);

// Imagen del gancho y del cierre
const VasoHospital: React.FC<{ readonly t: number; readonly brillo: number }> = ({ t, brillo }) => (
  <>
    <circle cx={540} cy={900} r={340} fill={C.white} opacity={0.06 + 0.06 * brillo} />
    <Vaso x={540} y={920} s={1.6} t={t} />
    <Cruz x={820} y={620} s={1.1} op={brillo} />
  </>
);

// A. Gancho: un vaso de carbón te salva
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.suena], [1.12, 1])}>
        <VasoHospital t={t} brillo={interpolate(t, [0.8, 1.2], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={1.06} />
    </>
  );
};

// Frasco de veneno
const Veneno: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-30} y={-150} width={60} height={50} rx={8} fill="#6A6488" />
    <path d="M -30 -100 L 30 -100 L 90 -20 L 90 140 L -90 140 L -90 -20 Z" fill="#3A5A2A" />
    <circle cx={0} cy={40} r={44} fill={C.white} />
    <rect x={-22} y={70} width={44} height={26} rx={6} fill={C.white} />
    <circle cx={-16} cy={36} r={11} fill="#3A5A2A" />
    <circle cx={16} cy={36} r={11} fill="#3A5A2A" />
  </g>
);

// B. Suena a locura, pero en urgencias lo usan contra venenos + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.suena, T.noAsar], [1, 1.05])}>
      <Veneno x={300} y={760} s={1.3} />
      <Texto x={540} y={790} size={80} color={C.white} op={aparece(t, T.urgencias)}>
        VS
      </Texto>
      <g opacity={aparece(t, T.urgencias)}>
        <Vaso x={790} y={760} s={0.9} t={t} />
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.noAsar], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={38}>
          lo que no puede atrapar: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Grano de carbón activado lleno de poros
const Grano: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly poros: number;
  readonly semilla: string;
}> = ({ x, y, r, poros, semilla }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#2E2A38" stroke="#5A5470" strokeWidth={r * 0.03} />
    {new Array(46).fill(0).map((_, k) => {
      const a = random(`${semilla}a${k}`) * Math.PI * 2;
      const d = Math.sqrt(random(`${semilla}d${k}`)) * r * 0.86;
      return (
        <circle
          key={k}
          cx={x + Math.cos(a) * d}
          cy={y + Math.sin(a) * d}
          r={r * (0.03 + random(`${semilla}r${k}`) * 0.07)}
          fill="#08060F"
          opacity={poros}
        />
      );
    })}
  </g>
);

// C. No es carbón de asar: con vapor se llena de poros
export const Poros: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const vapor = aparece(t, T.vapor);
  const zoom = aparece(t, T.poros);
  return (
    <Lienzo zoom={interpolate(t, [T.noAsar, T.cucharada], [1, 1.04])}>
      <g opacity={1 - zoom}>
        <path d="M 340 760 L 460 640 L 640 660 L 740 780 L 650 900 L 420 900 Z" fill="#2E2A38" />
        <g opacity={1 - vapor}>
          <line x1={300} y1={600} x2={780} y2={940} stroke={C.red} strokeWidth={16} />
          <Texto x={540} y={1060} size={42} color={C.red}>
            no es carbón de asar
          </Texto>
        </g>
        <g opacity={vapor}>
          {new Array(6).fill(0).map((_, k) => {
            const u = ((t - T.vapor) * 0.8 + k / 6) % 1;
            return (
              <circle
                key={k}
                cx={380 + k * 60 + Math.sin(u * 8 + k) * 20}
                cy={620 - u * 260}
                r={30 + u * 30}
                fill={C.white}
                opacity={0.35 * (1 - u)}
              />
            );
          })}
          <Texto x={540} y={1060} size={42} color={C.orange}>
            vapor a 900 °C
          </Texto>
        </g>
      </g>
      <g opacity={zoom}>
        <Grano x={540} y={800} r={330} poros={1} semilla="zoom" />
        <Texto x={540} y={1230} size={42} color={C.white}>
          poros microscópicos
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Una cucharada tiene tanta superficie como un campo de fútbol
export const Superficie: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const campo = aparece(t, T.campo);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cucharada, T.estomago], [1, 1.04])}>
        <g transform={`translate(${interpolate(campo, [0, 1], [540, 190])} ${interpolate(campo, [0, 1], [760, 520])}) scale(${1 - campo * 0.55})`}>
          <ellipse cx={0} cy={0} rx={150} ry={95} fill="#C8C4D8" />
          <ellipse cx={0} cy={-6} rx={124} ry={72} fill={NEGRO} />
          <rect x={130} y={-18} width={300} height={36} rx={18} fill="#C8C4D8" />
        </g>
        <Texto x={540} y={1000} size={42} color={C.white} op={aparece(t, T.superficie) * (1 - campo)}>
          1 cucharada
        </Texto>
        <g opacity={campo}>
          <Texto x={540} y={560} size={70} color={C.white}>
            =
          </Texto>
          <rect x={160} y={680} width={760} height={460} fill="#2E8A4A" stroke={C.white} strokeWidth={8} />
          <line x1={540} y1={680} x2={540} y2={1140} stroke={C.white} strokeWidth={6} />
          <circle cx={540} cy={910} r={80} fill="none" stroke={C.white} strokeWidth={6} />
          <rect x={160} y={820} width={110} height={180} fill="none" stroke={C.white} strokeWidth={6} />
          <rect x={810} y={820} width={110} height={180} fill="none" stroke={C.white} strokeWidth={6} />
          <Texto x={540} y={1240} size={42} color={C.yellow}>
            un campo de fútbol de superficie
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.campo} color={C.yellow} />
    </>
  );
};

// E. En el estómago, el veneno choca con las paredes y se queda pegado
export const Estomago: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pega = interpolate(t, [T.choca, T.pegado + 0.4], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.estomago, T.asi], [1, 1.05])}>
      <path
        d="M 420 420 Q 400 560 300 640 Q 160 760 220 980 Q 300 1220 560 1200 Q 860 1170 880 900 Q 890 700 700 640 Q 560 600 540 420 Z"
        fill="#5A2A3A"
        stroke="#C85A78"
        strokeWidth={12}
      />
      {[0, 1, 2].map((k) => (
        <Grano key={k} x={[400, 640, 520][k]} y={[860, 920, 1060][k]} r={95} poros={1} semilla={`est${k}`} />
      ))}
      {new Array(18).fill(0).map((_, k) => {
        const g = k % 3;
        const gx = [400, 640, 520][g];
        const gy = [860, 920, 1060][g];
        const a = random(`v${k}`) * Math.PI * 2;
        const libreX = 300 + random(`vx${k}`) * 480 + Math.sin(t * 2 + k) * 30;
        const libreY = 700 + random(`vy${k}`) * 420 + Math.cos(t * 2 + k) * 30;
        const px = gx + Math.cos(a) * 100;
        const py = gy + Math.sin(a) * 100;
        return (
          <circle
            key={k}
            cx={interpolate(pega, [0, 1], [libreX, px])}
            cy={interpolate(pega, [0, 1], [libreY, py])}
            r={16}
            fill={VENENO}
            stroke="#2A4A1A"
            strokeWidth={3}
          />
        );
      })}
      <Texto x={540} y={1330} size={42} color={VENENO} op={aparece(t, T.pegado)}>
        el veneno se queda pegado
      </Texto>
    </Lienzo>
  );
};

// F. No pasa a la sangre y sale del cuerpo con el carbón
export const Sangre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = interpolate(t, [T.sale, T.pero], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.pero], [1, 1.04])}>
      {/* pared del intestino y vaso sanguíneo */}
      <rect x={60} y={560} width={960} height={260} rx={30} fill="#3A2440" />
      <rect x={60} y={900} width={960} height={180} rx={90} fill="#7A1A2A" opacity={aparece(t, T.sangre - 0.3)} />
      {new Array(8).fill(0).map((_, k) => (
        <circle
          key={k}
          cx={100 + ((k * 130 + t * 140) % 900)}
          cy={990}
          r={34}
          fill={C.red}
          opacity={aparece(t, T.sangre - 0.3)}
        />
      ))}
      <rect x={60} y={840} width={960} height={40} fill="#C85A78" opacity={0.7} />
      <g transform={`translate(${interpolate(sale, [0, 1], [540, 1180])} 690)`}>
        <Grano x={0} y={0} r={100} poros={1} semilla="sale" />
        {new Array(6).fill(0).map((_, k) => (
          <circle
            key={k}
            cx={Math.cos(k) * 104}
            cy={Math.sin(k) * 104}
            r={16}
            fill={VENENO}
          />
        ))}
      </g>
      <g opacity={aparece(t, T.sangre)}>
        <line x1={480} y1={820} x2={600} y2={900} stroke={C.white} strokeWidth={12} />
        <line x1={600} y1={820} x2={480} y2={900} stroke={C.white} strokeWidth={12} />
      </g>
      <Texto x={540} y={1200} size={42} color={C.white} op={aparece(t, T.sangre)}>
        no llega a la sangre
      </Texto>
      <Texto x={540} y={1280} size={38} color={C.cyan} op={aparece(t, T.sale)}>
        sale del cuerpo con el carbón
      </Texto>
    </Lienzo>
  );
};

// G. Hay que darlo pronto, lo decide un médico, y no atrapa todo
export const Limite: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lista = aparece(t, T.ademas);
  const items = ["alcohol", "hierro", "lejía"];
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.porEso], [1, 1.04])}>
      <g opacity={1 - lista}>
        <g transform="translate(330 760)">
          <circle r={150} fill="#120F22" stroke={C.yellow} strokeWidth={12} />
          <line x1={0} y1={0} x2={0} y2={-110} stroke={C.white} strokeWidth={10} strokeLinecap="round" transform={`rotate(${(t - T.pero) * 140})`} />
          <circle r={12} fill={C.white} />
        </g>
        <Texto x={330} y={1000} size={40} color={C.yellow}>
          pronto
        </Texto>
        <g opacity={aparece(t, T.solo)}>
          <Tarjeta x={560} y={600} w={340} h={320}>
            <Cruz x={730} y={720} s={1} />
          </Tarjeta>
          <Texto x={730} y={870} size={36} color={C.white}>
            un médico
          </Texto>
          <Texto x={730} y={1000} size={34} color={C.white}>
            nunca por tu cuenta
          </Texto>
        </g>
      </g>
      <g opacity={lista}>
        <Grano x={540} y={760} r={190} poros={1} semilla="lim" />
        {items.map((it, k) => {
          const u = interpolate(t, [T.alcohol + k * 0.6, T.escapan + 0.6 + k * 0.3], [0, 1], clamp);
          return (
            <g key={it} opacity={aparece(t, T.alcohol + k * 0.6)}>
              <rect x={interpolate(u, [0, 1], [80, 640])} y={1000 + k * 110} width={340} height={80} rx={40} fill={C.card} stroke={C.red} strokeWidth={4} />
              <Texto x={interpolate(u, [0, 1], [250, 810])} y={1053 + k * 110} size={38} color={C.red}>
                {it}
              </Texto>
            </g>
          );
        })}
        <Texto x={540} y={1440} size={40} color={C.red} op={aparece(t, T.escapan)}>
          se le escapan
        </Texto>
      </g>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <VasoHospital t={t} brillo={1} />
    </Lienzo>
  );
};
