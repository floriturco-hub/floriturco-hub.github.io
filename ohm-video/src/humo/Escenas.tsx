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

// Instantes clave (s) de public/audio/humo/narracion.wav (voz x1,12), sacados con Whisper
export const T = {
  muchos: 1.92,
  americio: 4.72,
  millonesima: 6.58,
  alfa: 8.84,
  placas: 12.36,
  electrones: 15.32,
  iones: 18.56,
  corriente: 22.66,
  vigila: 26.2,
  tostada: 27.36,
  humo: 29.22,
  pegan: 30.98,
  cae: 35.36,
  alarma: 36.38,
  peligroso: 37.6,
  centimetros: 40.52,
  papel: 42.12,
  nada: 44.72,
  otros: 46.0,
  luz: 47.16,
  vidas: 50.08,
  sueno: 51.28,
  fin: 53.5,
};

// Símbolo de radiación (trébol)
const Trebol: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly rot?: number;
  readonly op?: number;
}> = ({ x, y, r, rot = 0, op = 1 }) => {
  const sector = (a0: number) => {
    const a1 = a0 + Math.PI / 3;
    const ri = r * 0.3;
    return `M ${Math.cos(a0) * ri} ${Math.sin(a0) * ri} L ${Math.cos(a0) * r} ${Math.sin(a0) * r} A ${r} ${r} 0 0 1 ${Math.cos(a1) * r} ${Math.sin(a1) * r} L ${Math.cos(a1) * ri} ${Math.sin(a1) * ri} A ${ri} ${ri} 0 0 0 ${Math.cos(a0) * ri} ${Math.sin(a0) * ri} Z`;
  };
  return (
    <g opacity={op} transform={`translate(${x} ${y}) rotate(${rot})`}>
      <circle r={r * 1.15} fill={C.yellow} />
      {[0, 1, 2].map((k) => (
        <path
          key={k}
          d={sector(-Math.PI / 2 - Math.PI / 6 + (k * 2 * Math.PI) / 3)}
          fill="#1A1636"
        />
      ))}
      <circle r={r * 0.2} fill="#1A1636" />
    </g>
  );
};

// Detector de techo (disco)
const Detector: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly led: number;
  readonly ledColor?: string;
}> = ({ x, y, s, led, ledColor = C.red }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-200} y={-40} width={400} height={40} fill="#C8C4D8" />
    <path
      d="M -180 0 L 180 0 Q 170 70 0 80 Q -170 70 -180 0 Z"
      fill="#E8E6F0"
    />
    {[-120, -60, 0, 60, 120].map((dx) => (
      <rect
        key={dx}
        x={dx - 18}
        y={20}
        width={36}
        height={8}
        rx={4}
        fill="#8C88A8"
      />
    ))}
    <circle cx={0} cy={50} r={10} fill={ledColor} opacity={led} />
  </g>
);

// Cámara de ionización: dos placas, fuente, iones y medidor
const CamaraIones: React.FC<{
  readonly t: number;
  readonly fuente: number;
  readonly placas: number;
  readonly alfa: number;
  readonly iones: number;
  readonly medidor: number;
  readonly humo: number;
}> = ({ t, fuente, placas, alfa, iones, medidor, humo }) => {
  const corriente = 1 - 0.85 * humo;
  return (
    <g>
      <g opacity={placas}>
        <rect x={180} y={570} width={720} height={30} rx={8} fill={C.red} />
        <rect x={180} y={1100} width={720} height={30} rx={8} fill={C.cyan} />
        <Texto x={150} y={600} color={C.red} size={60}>
          +
        </Texto>
        <Texto x={150} y={1132} color={C.cyan} size={60}>
          -
        </Texto>
      </g>
      <g opacity={fuente}>
        <rect x={190} y={810} width={60} height={80} rx={8} fill="#8C88A8" />
        <Trebol x={220} y={850} r={22} />
      </g>
      {new Array(14).fill(0).map((_, k) => {
        const f = (t * 1.6 + random(`a${k}`)) % 1;
        const a = (random(`aa${k}`) - 0.5) * 1.2;
        const len = 380 + 120 * random(`al${k}`);
        const d = f * len;
        return (
          <line
            key={k}
            x1={250 + Math.cos(a) * d}
            y1={850 + Math.sin(a) * d}
            x2={250 + Math.cos(a) * (d + 40)}
            y2={850 + Math.sin(a) * (d + 40)}
            stroke={C.yellow}
            strokeWidth={8}
            strokeLinecap="round"
            opacity={alfa * (1 - f)}
          />
        );
      })}
      {new Array(30).fill(0).map((_, k) => {
        const pegado = humo > random(`ip${k}`) * 0.9;
        const f = pegado
          ? random(`if${k}`) * 0.3
          : (t * 0.45 + random(`i${k}`)) % 1;
        const x = 300 + random(`ix${k}`) * 560;
        const y0 = 830 + random(`iy${k}`) * 40;
        const pos = k % 2 === 0;
        const y = pos ? y0 + f * (1090 - y0) : y0 - f * (y0 - 610);
        return (
          <g key={k} opacity={iones}>
            <circle
              cx={x}
              cy={y}
              r={14}
              fill={pos ? C.red : C.cyan}
              opacity={0.85}
            />
            <text
              x={x}
              y={y + 7}
              textAnchor="middle"
              fontSize={20}
              fontWeight={700}
              fill="#0B091D"
            >
              {pos ? "+" : "-"}
            </text>
          </g>
        );
      })}
      {humo > 0
        ? new Array(9)
            .fill(0)
            .map((_, k) => (
              <circle
                key={k}
                cx={320 + random(`hx${k}`) * 520 + 20 * Math.sin(t + k)}
                cy={680 + random(`hy${k}`) * 360}
                r={50 + 20 * random(`hr${k}`)}
                fill="#8C88A8"
                opacity={humo * 0.45}
              />
            ))
        : null}
      <g opacity={medidor}>
        <path
          d="M 400 1360 A 140 140 0 0 1 680 1360"
          stroke={C.grey}
          strokeWidth={10}
          fill="none"
        />
        <line
          x1={540}
          y1={1360}
          x2={540 + Math.cos(Math.PI - corriente * 2.4 - 0.37) * 120}
          y2={1360 - Math.sin(Math.PI - corriente * 2.4 - 0.37) * 120}
          stroke={humo > 0.5 ? C.red : C.cyan}
          strokeWidth={10}
          strokeLinecap="round"
        />
        <circle cx={540} cy={1360} r={14} fill={C.white} />
        <Texto x={540} y={1420} color={C.grey} size={30}>
          corriente
        </Texto>
      </g>
    </g>
  );
};

// A. Gancho: radiación en el techo
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.muchos], [1.08, 1])}>
        <rect x={0} y={0} width={1080} height={420} fill="#1A1636" />
        <Detector x={540} y={460} s={1.4} led={0.5 + 0.5 * Math.sin(t * 6)} />
        <Trebol
          x={540}
          y={1000}
          r={190 * interpolate(t, [0.8, 1.1], [0.6, 1], clamp)}
          rot={t * 20}
          op={aparece(t, 0.9)}
        />
      </Lienzo>
      <Flash t={t} d={1.0} color={C.yellow} />
    </>
  );
};

// B. Una pizca de americio-241
export const Americio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.muchos, T.alfa], [1, 1.05])}>
      <g opacity={1 - aparece(t, T.americio) * 0.75}>
        <Detector x={540} y={520} s={1.6} led={1} />
      </g>
      <g opacity={aparece(t, T.muchos) * (1 - aparece(t, T.americio))}>
        <Texto x={540} y={820} color={C.white} size={48}>
          detector de humo
        </Texto>
        <Texto x={540} y={900} color={C.grey} size={36}>
          ¿qué lleva dentro?
        </Texto>
      </g>
      <g opacity={aparece(t, T.americio)}>
        <circle
          cx={540}
          cy={860}
          r={170}
          fill="#241E44"
          stroke="#6A5A9A"
          strokeWidth={6}
        />
        <rect x={470} y={800} width={140} height={110} rx={14} fill="#8C88A8" />
        <Trebol x={540} y={855} r={36} />
        <Texto x={540} y={1100} color={C.yellow} size={64}>
          americio-241
        </Texto>
      </g>
      <Tarjeta x={180} y={1170} w={720} h={170} op={aparece(t, T.millonesima)}>
        <Texto x={540} y={1262} color={C.yellow} size={56}>
          {"< 0,000001 g"}
        </Texto>
        <Texto x={540} y={1312} color={C.grey} size={26}>
          menos de una millonésima de gramo
        </Texto>
      </Tarjeta>
    </Lienzo>
  );
};

// C. Partículas alfa, iones y corriente constante
export const Ionizacion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.alfa, T.tostada], [1, 1.03])}>
      <CamaraIones
        t={t}
        fuente={1}
        placas={aparece(t, T.placas)}
        alfa={aparece(t, T.alfa)}
        iones={aparece(t, T.iones)}
        medidor={aparece(t, T.corriente)}
        humo={0}
      />
      <Texto
        x={540}
        y={480}
        color={C.yellow}
        size={42}
        op={aparece(t, T.alfa) * (1 - aparece(t, T.electrones))}
      >
        partículas alfa
      </Texto>
      <Texto
        x={540}
        y={480}
        color={C.cyan}
        size={42}
        op={aparece(t, T.electrones)}
      >
        el aire se vuelve iones
      </Texto>
    </Lienzo>
  );
};

// Tostada humeante
const Tostada: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly t: number;
}> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y})`}>
    <path
      d="M -70 60 L -70 -30 Q -90 -80 -40 -80 Q 0 -100 40 -80 Q 90 -80 70 -30 L 70 60 Z"
      fill="#5A3A20"
      stroke="#2A1A10"
      strokeWidth={6}
    />
    {[0, 1, 2].map((k) => (
      <path
        key={k}
        d={`M ${-40 + k * 40} -100 q 20 -40 0 -80 q -20 -40 0 -80`}
        stroke="#8C88A8"
        strokeWidth={10}
        fill="none"
        opacity={0.6}
        transform={`translate(${6 * Math.sin(t * 3 + k)} 0)`}
      />
    ))}
  </g>
);

// D. El humo atrapa los iones: cae la corriente y suena la alarma
export const Humo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const humo = interpolate(t, [T.humo, T.cae], [0, 1], suave);
  const alarma = t > T.alarma ? 0.5 + 0.5 * Math.sign(Math.sin(t * 14)) : 0;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.tostada, T.peligroso], [1, 1.03])}>
        <rect
          x={0}
          y={0}
          width={1080}
          height={1920}
          fill={C.red}
          opacity={alarma * 0.12}
        />
        <CamaraIones
          t={t}
          fuente={1}
          placas={1}
          alfa={1}
          iones={1}
          medidor={1}
          humo={humo}
        />
        <g opacity={aparece(t, T.tostada) * (1 - aparece(t, T.alarma))}>
          <Tostada x={900} y={460} t={t} />
        </g>
        <Texto
          x={540}
          y={480}
          color={C.red}
          size={90}
          op={aparece(t, T.alarma)}
        >
          ¡BIIP!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.alarma} color={C.red} />
    </>
  );
};

// E. ¿Peligroso? Las alfa recorren centímetros y un papel las frena
export const Seguro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const papel = aparece(t, T.papel);
  const alcance = papel > 0.5 ? 250 : 520;
  return (
    <Lienzo zoom={interpolate(t, [T.peligroso, T.otros], [1, 1.04])}>
      <Texto
        x={540}
        y={520}
        color={C.white}
        size={60}
        op={aparece(t, T.peligroso)}
      >
        ¿peligroso?
      </Texto>
      <rect x={140} y={820} width={80} height={120} rx={10} fill="#8C88A8" />
      <Trebol x={180} y={880} r={26} />
      {new Array(10).fill(0).map((_, k) => {
        const f = (t * 1.4 + random(`s${k}`)) % 1;
        const a = (random(`sa${k}`) - 0.5) * 0.6;
        const d = f * alcance;
        return (
          <line
            key={k}
            x1={230 + Math.cos(a) * d}
            y1={880 + Math.sin(a) * d}
            x2={230 + Math.cos(a) * (d + 40)}
            y2={880 + Math.sin(a) * (d + 40)}
            stroke={C.yellow}
            strokeWidth={8}
            strokeLinecap="round"
            opacity={1 - f}
          />
        );
      })}
      <g opacity={aparece(t, T.centimetros) * (1 - papel)}>
        <line
          x1={230}
          y1={1060}
          x2={790}
          y2={1060}
          stroke={C.white}
          strokeWidth={4}
        />
        <line
          x1={230}
          y1={1040}
          x2={230}
          y2={1080}
          stroke={C.white}
          strokeWidth={4}
        />
        <line
          x1={790}
          y1={1040}
          x2={790}
          y2={1080}
          stroke={C.white}
          strokeWidth={4}
        />
        <Texto x={510} y={1130} color={C.white} size={40}>
          unos centímetros
        </Texto>
      </g>
      <g opacity={papel}>
        <rect x={500} y={700} width={26} height={360} fill={C.white} />
        <Texto x={513} y={1130} color={C.white} size={40}>
          una hoja de papel
        </Texto>
      </g>
      <Texto x={540} y={1320} color={C.cyan} size={44} op={aparece(t, T.nada)}>
        a ti no te llega
      </Texto>
    </Lienzo>
  );
};

// F. Otros detectores usan luz
export const Otros: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.otros, T.sueno], [1, 1.04])}>
      <g opacity={aparece(t, T.luz)}>
        <rect x={160} y={780} width={100} height={100} rx={14} fill="#8C88A8" />
        <circle cx={260} cy={830} r={26} fill={C.white} />
        <line
          x1={286}
          y1={830}
          x2={860}
          y2={830}
          stroke={C.white}
          strokeWidth={10}
          opacity={0.5}
        />
        <rect
          x={680}
          y={1000}
          width={100}
          height={100}
          rx={14}
          fill="#8C88A8"
        />
        <Texto x={540} y={720} color={C.white} size={40}>
          detector de luz
        </Texto>
        {new Array(6).fill(0).map((_, k) => (
          <circle
            key={k}
            cx={500 + 40 * Math.sin(t + k)}
            cy={830 + 30 * Math.cos(t * 1.3 + k)}
            r={24}
            fill="#8C88A8"
            opacity={0.5}
          />
        ))}
        <line
          x1={520}
          y1={850}
          x2={720}
          y2={990}
          stroke={C.white}
          strokeWidth={6}
          strokeDasharray="14 10"
          opacity={0.7}
        />
      </g>
      <g
        opacity={aparece(t, T.vidas)}
        transform={`translate(540 1260) scale(${1 + 0.05 * Math.sin(t * 6)})`}
      >
        <path
          d="M 0 60 C -120 -20 -90 -110 0 -60 C 90 -110 120 -20 0 60 Z"
          fill={C.red}
        />
      </g>
    </Lienzo>
  );
};

// G. Cierre: la radiación vigila tu sueño
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.sueno, T.fin + 0.5], [1, 1.05])}>
      <rect x={0} y={0} width={1080} height={420} fill="#1A1636" />
      <Detector
        x={540}
        y={460}
        s={1.4}
        led={t % 2 < 0.2 ? 1 : 0.2}
        ledColor="#5AC878"
      />
      <path
        d="M 640 820 A 130 130 0 1 0 760 1000 A 100 100 0 1 1 640 820 Z"
        fill={C.yellow}
        opacity={aparece(t, T.sueno)}
      />
      {[0, 1, 2].map((k) => (
        <Texto
          key={k}
          x={420 - k * 60}
          y={1000 - k * 70 - ((t * 20) % 20)}
          color={C.white}
          size={40 + k * 14}
          op={aparece(t, T.sueno + 0.3 + k * 0.3) * 0.8}
        >
          z
        </Texto>
      ))}
    </Lienzo>
  );
};
