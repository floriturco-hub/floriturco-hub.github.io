import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/embarazo/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  solo: 2.38,
  respuesta: 4.38,
  final: 5.96,
  durante: 8.64,
  hcg: 11.48,
  la: 12.72,
  servilleta: 14.96,
  primero: 16.32,
  oro: 18.72,
  pegan: 19.66,
  mas: 21.64,
  linea: 22.66,
  atrapa: 24.42,
  acumulan: 26.74,
  prueba: 28.2,
  un: 28.76,
  control: 30.26,
  sobrantes: 31.54,
  esa: 32.9,
  funciono: 34.62,
  porEso: 35.68,
  fin: 37.86,
};

const ROJO = "#D8344E";
const HCG = C.purpleLight;
const TIRA = "#F2EFE6";

// Cassette de prueba con ventana; t1/t2 = intensidad de las rayas T y C
const Cassette: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly rT: number; readonly rC: number }> = ({ x, y, s, rT, rC }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-120} y={-420} width={240} height={840} rx={60} fill={C.white} />
    <circle cx={0} cy={260} r={50} fill="#D8D4E0" />
    <rect x={-50} y={-260} width={100} height={340} rx={16} fill={TIRA} stroke="#C8C4D0" strokeWidth={4} />
    <rect x={-40} y={-200} width={80} height={14} rx={4} fill={ROJO} opacity={rC} />
    <rect x={-40} y={-80} width={80} height={14} rx={4} fill={ROJO} opacity={rT} />
    <text x={-80} y={-188} fontSize={26} fontWeight={700} fill="#8A86A8" fontFamily="JetBrains Mono">
      C
    </text>
    <text x={-80} y={-68} fontSize={26} fontWeight={700} fill="#8A86A8" fontFamily="JetBrains Mono">
      T
    </text>
  </g>
);

// A. Gancho: ¿cómo dibuja esta prueba dos rayas?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const r = interpolate(t, [0.6, 1.2], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.solo], [1.12, 1])}>
        <Cassette x={540} y={900} s={1.1} rT={r} rC={r} />
        <Texto x={820} y={600} size={110} color={C.yellow} op={r}>
          ?
        </Texto>
      </Lienzo>
      <Flash t={t} d={1.16} color={ROJO} />
    </>
  );
};

// B. Pones unas gotas y en minutos aparece la respuesta + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const gota = ((t - T.solo) * 1.2) % 1;
  return (
    <Lienzo zoom={interpolate(t, [T.solo, T.durante], [1, 1.05])}>
      <Cassette x={420} y={820} s={0.8} rT={0} rC={0} />
      <path d={`M 420 ${500 + gota * 500} q 18 30 0 40 q -18 -10 0 -40 Z`} fill="#F0E08A" opacity={1 - gota} transform="scale(1)" />
      <g opacity={aparece(t, T.respuesta - 0.6)} transform="translate(780 760)">
        <circle r={110} fill="none" stroke={C.yellow} strokeWidth={10} />
        <line x1={0} y1={0} x2={0} y2={-80} stroke={C.white} strokeWidth={8} strokeLinecap="round" transform={`rotate(${(t - T.respuesta) * 120})`} />
        <Texto x={0} y={170} size={34} color={C.yellow}>
          minutos
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
        <Texto x={540} y={1400} color={C.white} size={38}>
          para qué sirve la otra raya: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Molécula de hCG
const Hormona: React.FC<{ readonly x: number; readonly y: number; readonly s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={-10} cy={0} r={14} fill={HCG} />
    <circle cx={12} cy={-4} r={11} fill={HCG} />
  </g>
);

// Anticuerpo (Y) con partícula de oro opcional
const Anticuerpo: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly oro?: boolean; readonly rot?: number; readonly color?: string }> = ({
  x,
  y,
  s = 1,
  oro = false,
  rot = 0,
  color = C.cyan,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 0 30 L 0 0 L -18 -24 M 0 0 L 18 -24" stroke={color} strokeWidth={8} fill="none" strokeLinecap="round" />
    {oro ? <circle cx={0} cy={40} r={13} fill={ROJO} /> : null}
  </g>
);

// C. Durante el embarazo el cuerpo produce la hormona hCG
export const Hcg: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.durante, T.la], [1, 1.04])}>
      <circle cx={540} cy={800} r={260} fill="#3A2440" />
      {new Array(18).fill(0).map((_, k) => {
        const a = random(`h${k}`) * Math.PI * 2;
        const d = Math.sqrt(random(`hd${k}`)) * 220;
        return (
          <g key={k} opacity={aparece(t, T.durante + 0.6 + k * 0.08)}>
            <Hormona x={540 + Math.cos(a + t * 0.3) * d} y={800 + Math.sin(a + t * 0.3) * d} s={1.4} />
          </g>
        );
      })}
      <Texto x={540} y={1170} size={60} color={HCG} op={aparece(t, T.hcg)}>
        hCG
      </Texto>
      <Texto x={540} y={1240} size={32} color={C.grey} op={aparece(t, T.hcg)}>
        hormona del embarazo
      </Texto>
    </Lienzo>
  );
};

// Tira horizontal: zonas y líquido avanzando (frente 0..1)
const X0 = 80;
const X1 = 1000;
const XT = 600;
const XC = 780;
const Tira: React.FC<{ readonly frente: number; readonly rT: number; readonly rC: number }> = ({ frente, rT, rC }) => (
  <g>
    <rect x={X0} y={780} width={X1 - X0} height={140} rx={10} fill={TIRA} />
    <rect x={X0} y={780} width={180} height={140} fill="#D8D0C0" />
    <rect x={260} y={780} width={130} height={140} fill="#F0D8D8" />
    <rect x={880} y={780} width={120} height={140} fill="#D8D0C0" />
    <rect x={X0} y={780} width={(X1 - X0) * frente} height={140} fill="#F0E08A" opacity={0.35} />
    <rect x={XT - 12} y={780} width={24} height={140} fill={ROJO} opacity={0.12 + 0.88 * rT} />
    <rect x={XC - 12} y={780} width={24} height={140} fill={ROJO} opacity={0.12 + 0.88 * rC} />
    <text x={XT} y={970} textAnchor="middle" fontSize={30} fontWeight={700} fill={C.grey} fontFamily="JetBrains Mono">
      T
    </text>
    <text x={XC} y={970} textAnchor="middle" fontSize={30} fontWeight={700} fill={C.grey} fontFamily="JetBrains Mono">
      C
    </text>
  </g>
);

// D. La tira absorbe la orina, que avanza como por una servilleta
export const Avanza: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const frente = interpolate(t, [T.la + 0.3, T.primero], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.la, T.primero], [1, 1.04])}>
      <Tira frente={frente} rT={0} rC={0} />
      <Texto x={170} y={740} size={30} color={C.grey}>
        gotas
      </Texto>
      <path d="M 170 600 q 22 36 0 50 q -22 -14 0 -50 Z" fill="#F0E08A" />
      <Texto x={540} y={1120} size={38} color={C.white} op={aparece(t, T.servilleta - 0.6)}>
        avanza como en una servilleta
      </Texto>
    </Lienzo>
  );
};

// Partícula que fluye por la tira (x según tiempo), con hormona pegada o no
const flujo = (t: number, k: number, v: number) => X0 + 200 + (((t * v + k * 0.13) % 1) * (X1 - X0 - 200));

// E. Anticuerpos con partículas rojas de oro que se pegan a la hormona, si la hay
export const Oro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pegadas = aparece(t, T.pegan);
  return (
    <Lienzo zoom={interpolate(t, [T.primero, T.mas], [1, 1.04])}>
      <Tira frente={1} rT={0} rC={0} />
      {new Array(8).fill(0).map((_, k) => {
        const x = interpolate(((t - T.primero) * 0.12 + k * 0.125) % 1, [0, 1], [270, 560]);
        return (
          <g key={k} opacity={aparece(t, T.primero + 0.4)}>
            <Anticuerpo x={x} y={820 + (k % 3) * 30} s={0.9} oro />
            {k % 2 === 0 ? (
              <g opacity={pegadas}>
                <Hormona x={x} y={796 + (k % 3) * 30} s={0.8} />
              </g>
            ) : null}
          </g>
        );
      })}
      <Texto x={540} y={1120} size={36} color={ROJO} op={aparece(t, T.oro)}>
        anticuerpos con oro (rojo)
      </Texto>
      <Texto x={540} y={1190} size={36} color={HCG} op={pegadas}>
        se pegan a la hCG
      </Texto>
    </Lienzo>
  );
};

// F. Una línea con anticuerpos fijos atrapa la hormona: aparece la raya de prueba
export const LineaT: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rT = interpolate(t, [T.atrapa, T.prueba], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.mas, T.un], [1, 1.04])}>
        <Tira frente={1} rT={rT} rC={0} />
        {new Array(4).fill(0).map((_, k) => (
          <Anticuerpo key={k} x={XT} y={800 + k * 32} s={0.7} rot={180} color={C.white} />
        ))}
        {new Array(6).fill(0).map((_, k) => {
          const x = Math.min(XT - 26, flujo(t, k, 0.3));
          return (
            <g key={k} opacity={aparece(t, T.mas)}>
              <Anticuerpo x={x} y={820 + (k % 3) * 30} s={0.8} oro />
              <Hormona x={x} y={796 + (k % 3) * 30} s={0.7} />
            </g>
          );
        })}
        <Texto x={540} y={700} size={34} color={C.white} op={aparece(t, T.linea)}>
          anticuerpos fijos en la línea T
        </Texto>
        <Texto x={540} y={1120} size={40} color={ROJO} op={aparece(t, T.acumulan)}>
          raya de prueba
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.prueba} color={ROJO} />
    </>
  );
};

// G. La raya de control atrapa las partículas sobrantes: sale siempre, para avisar que funcionó
export const Control: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rC = interpolate(t, [T.sobrantes - 0.4, T.esa + 0.4], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.un, T.porEso], [1, 1.04])}>
      <Tira frente={1} rT={1} rC={rC} />
      {new Array(5).fill(0).map((_, k) => {
        const x = Math.min(XC - 26, Math.max(XT + 30, flujo(t, k, 0.25)));
        return (
          <g key={k} opacity={aparece(t, T.control)}>
            <Anticuerpo x={x} y={820 + (k % 3) * 30} s={0.8} oro />
          </g>
        );
      })}
      <Texto x={XC} y={700} size={34} color={C.white} op={aparece(t, T.control)}>
        raya de control
      </Texto>
      <Texto x={540} y={1120} size={40} color={C.yellow} op={aparece(t, T.esa)}>
        sale siempre
      </Texto>
      <Texto x={540} y={1190} size={36} color="#5AC878" op={aparece(t, T.funciono)}>
        = la prueba funcionó
      </Texto>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const r = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Cassette x={540} y={900} s={1.1} rT={r} rC={r} />
      <Texto x={820} y={600} size={110} color={C.yellow} op={r}>
        ?
      </Texto>
    </Lienzo>
  );
};
