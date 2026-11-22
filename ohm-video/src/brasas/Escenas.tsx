import { interpolate, random } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/brasas/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  madera: 2.04, // madera
  llamas: 2.76, // llamas
  humo: 3.84, // humo
  carbon2: 4.54, // carbon
  brilla: 5.22, // brilla
  pero: 6.36, // pero
  final: 7.92, // final
  calentarse: 10.32, // calentarse
  suelta: 11.48, // suelta
  vapor: 12.54, // vapor
  alquitranes: 13.26, // alquitranes
  esos: 15.18, // esos
  arden: 16.40, // arden
  llama: 17.84, // llama
  amarillo: 18.62, // amarillo
  hollin: 19.34, // hollin
  humo2: 21.08, // humo
  quemarse: 22.46, // quemarse
  vegetal: 23.66, // vegetal
  oxigeno: 25.62, // oxigeno
  expulsar: 26.42, // expulsar
  queda: 27.88, // queda
  quemarlo: 30.02, // quemarlo
  superficie: 32.64, // superficie
  sin: 33.44, // sin
  brilla2: 35.68, // brilla
  porEso: 36.34, // por
  fin: 38.20, // FIN
};

const MADERA = "#8A5A2A";

const Llama: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly t: number; readonly op: number }> = ({ x, y, s, t, op }) => (
  <g opacity={op} transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((k) => {
      const h = 220 + Math.sin(t * 9 + k * 2) * 30;
      const dx = (k - 1) * 70;
      return (
        <g key={k}>
          <path d={`M ${dx - 60} 0 Q ${dx - 50} ${-h * 0.6} ${dx + Math.sin(t * 7 + k) * 20} ${-h} Q ${dx + 50} ${-h * 0.6} ${dx + 60} 0 Z`} fill={C.orange} />
          <path d={`M ${dx - 30} 0 Q ${dx - 25} ${-h * 0.4} ${dx} ${-h * 0.65} Q ${dx + 25} ${-h * 0.4} ${dx + 30} 0 Z`} fill={C.yellow} />
        </g>
      );
    })}
  </g>
);

const Humo: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly op: number }> = ({ x, y, t, op }) => (
  <g opacity={op}>
    {new Array(6).fill(0).map((_, k) => {
      const u = (t * 0.35 + k / 6) % 1;
      return <circle key={k} cx={x + Math.sin(u * 6 + k) * 40} cy={y - u * 300} r={30 + u * 50} fill="#8C88A8" opacity={0.5 * (1 - u)} />;
    })}
  </g>
);

const Leno: React.FC<{ readonly x: number; readonly y: number; readonly rot: number }> = ({ x, y, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-170} y={-36} width={340} height={72} rx={36} fill={MADERA} />
    <ellipse cx={170} cy={0} rx={22} ry={36} fill="#C8945A" />
  </g>
);

// Trozos de carbón; brillo = 0-1
const Carbon: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly brillo: number; readonly t: number }> = ({ x, y, s, brillo, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {new Array(6).fill(0).map((_, k) => {
      const px = (k % 3) * 110 - 110;
      const py = Math.floor(k / 3) * -70;
      const g = brillo * (0.6 + 0.4 * Math.sin(t * 3 + k));
      return (
        <g key={k}>
          <polygon points={`${px - 60},${py + 30} ${px - 40},${py - 30} ${px + 30},${py - 40} ${px + 60},${py + 10} ${px + 30},${py + 40}`} fill="#1A1416" stroke={`rgba(255,${Math.round(80 + 60 * g)},40,${g})`} strokeWidth={10} />
          <circle cx={px} cy={py} r={18} fill={C.red} opacity={g * 0.7} />
        </g>
      );
    })}
  </g>
);

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Carbon x={540} y={1000} s={1.4} brillo={1} t={t} />
    <Texto x={540} y={700} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué el carbón no hace llama?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.madera], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.orange} />
    </>
  );
};

// B. La madera arde con llamas y humo; el carbón solo brilla al rojo + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.madera, T.calentarse], [1, 1.04])}>
      <g transform="translate(-230 0)">
        <Humo x={540} y={700} t={t} op={aparece(t, T.humo)} />
        <Llama x={540} y={1050} s={0.9} t={t} op={aparece(t, T.llamas)} />
        <Leno x={540} y={1080} rot={15} />
        <Leno x={540} y={1080} rot={-15} />
        <Texto x={540} y={1220} size={36} color={MADERA}>
          madera
        </Texto>
      </g>
      <g transform="translate(250 0)" opacity={aparece(t, T.carbon2)}>
        <Carbon x={540} y={1080} s={0.8} brillo={aparece(t, T.brilla)} t={t} />
        <Texto x={540} y={1220} size={36} color={C.grey}>
          carbón
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.calentarse], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          de dónde salen las llamas
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Al calentarse, la madera suelta gases: vapor, alquitranes y otros compuestos
export const Gases: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tipos = [
    ["#8AC8F8", T.vapor],
    ["#8A5A2A", T.alquitranes],
    ["#C8C4D8", T.alquitranes + 0.8],
  ] as const;
  return (
    <Lienzo zoom={interpolate(t, [T.calentarse, T.esos], [1, 1.04])}>
      <rect x={140} y={1050} width={800} height={180} rx={30} fill={MADERA} />
      <rect x={140} y={1040} width={800} height={30} fill={C.orange} opacity={0.4 + 0.3 * Math.sin(t * 6)} />
      {new Array(24).fill(0).map((_, k) => {
        const tipo = tipos[k % 3];
        const u = (t * 0.4 + random(`g${k}`)) % 1;
        return (
          <circle
            key={k}
            cx={180 + random(`x${k}`) * 720 + Math.sin(u * 8 + k) * 20}
            cy={1030 - u * 520}
            r={12 + (k % 3) * 4}
            fill={tipo[0]}
            opacity={aparece(t, tipo[1]) * aparece(t, T.suelta) * (1 - u * 0.6)}
          />
        );
      })}
      <g opacity={aparece(t, T.suelta)}>
        <Texto x={240} y={480} size={32} color="#8AC8F8" op={aparece(t, T.vapor)}>
          vapor
        </Texto>
        <Texto x={540} y={480} size={32} color="#C8945A" op={aparece(t, T.alquitranes)}>
          alquitranes
        </Texto>
        <Texto x={840} y={480} size={32} color="#C8C4D8" op={aparece(t, T.alquitranes + 0.8)}>
          otros
        </Texto>
      </g>
      <Texto x={540} y={1330} size={38} color={C.white} op={aparece(t, T.suelta)}>
        la madera suelta gases
      </Texto>
    </Lienzo>
  );
};

// D. Esos gases arden en el aire y forman la llama; amarillo = hollín al rojo, humo = lo no quemado
export const Llamas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.esos, T.vegetal], [1, 1.04])}>
        <Humo x={540} y={620} t={t} op={aparece(t, T.humo2)} />
        <Llama x={540} y={1150} s={1.5} t={t} op={aparece(t, T.arden)} />
        <rect x={190} y={1150} width={700} height={90} rx={30} fill={MADERA} />
        <g opacity={aparece(t, T.hollin)}>
          {new Array(10).fill(0).map((_, k) => (
            <circle key={k} cx={460 + random(`h${k}`) * 160} cy={850 + random(`v${k}`) * 250} r={7} fill={C.white} />
          ))}
        </g>
        <Texto x={540} y={1330} size={38} color={C.yellow} op={aparece(t, T.amarillo) * (1 - aparece(t, T.humo2))}>
          amarillo: hollín al rojo vivo
        </Texto>
        <Texto x={540} y={1330} size={38} color={C.grey} op={aparece(t, T.humo2)}>
          humo: lo que no se quemó
        </Texto>
        <Texto x={540} y={500} size={36} color={C.white} op={aparece(t, T.arden) * (1 - aparece(t, T.humo2))}>
          los gases arden: la llama
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.arden} color={C.orange} />
    </>
  );
};

// E. El carbón vegetal se hace calentando madera sin oxígeno para expulsar los gases antes
export const Horno: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const neg = interpolate(t, [T.expulsar, T.queda + 0.5], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.vegetal, T.quemarlo], [1, 1.04])}>
      <rect x={240} y={700} width={600} height={500} rx={30} fill="#3A3650" stroke="#5A5478" strokeWidth={10} />
      <rect x={480} y={560} width={80} height={140} fill="#3A3650" stroke="#5A5478" strokeWidth={8} />
      <rect x={280} y={1100} width={520} height={60} fill={C.orange} opacity={0.5} />
      <g opacity={1 - neg}>
        <Leno x={540} y={1000} rot={0} />
        <Leno x={540} y={920} rot={0} />
      </g>
      <g opacity={neg}>
        <Carbon x={540} y={1000} s={0.9} brillo={0} t={t} />
      </g>
      <g opacity={aparece(t, T.expulsar) * (1 - neg * 0.7)}>
        {new Array(8).fill(0).map((_, k) => {
          const u = (t * 0.5 + k / 8) % 1;
          return <circle key={k} cx={520 + (k % 3) * 20} cy={680 - u * 260} r={12} fill={k % 2 ? "#8AC8F8" : "#C8945A"} opacity={1 - u} />;
        })}
      </g>
      <g opacity={aparece(t, T.oxigeno)}>
        <Texto x={540} y={1300} size={40} color={C.red}>
          sin oxígeno
        </Texto>
      </g>
      <Texto x={540} y={1380} size={40} color={C.white} op={aparece(t, T.queda)}>
        queda casi solo carbono
      </Texto>
    </Lienzo>
  );
};

// F. Al quemarlo, el oxígeno reacciona en su superficie: sin gases, casi no hay llama, solo brilla
export const Superficie: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.quemarlo, T.porEso], [1, 1.04])}>
        <rect x={140} y={1000} width={800} height={240} rx={20} fill="#1A1416" />
        <rect x={140} y={990} width={800} height={30} fill={C.red} opacity={aparece(t, T.superficie) * (0.6 + 0.3 * Math.sin(t * 4))} />
        {new Array(8).fill(0).map((_, k) => {
          const u = (t * 0.6 + k / 8) % 1;
          const x = 200 + k * 95;
          const baja = u < 0.5;
          const y = baja ? 600 + u * 2 * 380 : 980 - (u - 0.5) * 2 * 380;
          return (
            <g key={k} opacity={aparece(t, T.oxigeno > 0 ? T.quemarlo : 0)}>
              <circle cx={x - 14} cy={y} r={14} fill={baja ? C.cyan : "#8C88A8"} />
              <circle cx={x + 14} cy={y} r={14} fill={baja ? C.cyan : "#8C88A8"} />
              {baja ? null : <circle cx={x} cy={y - 18} r={12} fill="#1A1416" stroke="#8C88A8" strokeWidth={3} />}
            </g>
          );
        })}
        <Texto x={240} y={560} size={32} color={C.cyan} op={aparece(t, T.quemarlo)}>
          oxígeno
        </Texto>
        <Texto x={540} y={1330} size={38} color={C.red} op={aparece(t, T.superficie) * (1 - aparece(t, T.sin))}>
          reacciona en la superficie
        </Texto>
        <Texto x={540} y={1330} size={40} color={C.red} op={aparece(t, T.sin)}>
          sin gases: solo brilla
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.brilla2} color={C.red} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
