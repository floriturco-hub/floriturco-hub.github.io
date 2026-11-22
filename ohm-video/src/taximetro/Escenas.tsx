import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/taximetro/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  andando: 3.16, // andando
  parado: 4.32, // parado
  final: 5.80, // final
  conectado: 9.18, // conectado
  pulsos: 10.74, // pulsos
  kilometro: 13.62, // kilometro
  cuenta: 14.48, // cuenta
  ficha: 17.52, // ficha
  pero: 18.18, // pero
  despacio: 19.26, // despacio
  detenido: 20.22, // detenido
  cambia: 22.74, // cambia
  tiempo: 24.32, // tiempo
  minuto: 26.72, // minuto
  cambio: 28.04, // cambio
  velocidad: 29.10, // velocidad
  mismo: 31.94, // mismo
  asi: 32.56, // asi
  fin: 34.50, // FIN
};

const AMARILLO = "#F8C820";
const VERDE = "#6AF89A";

const Taxi: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly rueda: number }> = ({ x, y, s, rueda }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -230 0 L -210 -70 L -110 -80 L -50 -150 L 110 -150 L 180 -80 L 230 -70 L 240 0 Z" fill={AMARILLO} />
    <path d="M -40 -138 L 100 -138 L 150 -84 L -90 -84 Z" fill="#8AC8F8" />
    <rect x={0} y={-182} width={70} height={32} rx={6} fill={C.white} />
    <Texto x={35} y={-158} size={20} color="#141030">
      TAXI
    </Texto>
    {[-130, 150].map((cx) => (
      <g key={cx} transform={`translate(${cx} 0) rotate(${rueda})`}>
        <circle cx={0} cy={0} r={48} fill="#111" />
        <circle cx={0} cy={0} r={20} fill="#5A5478" />
        <line x1={0} y1={-20} x2={0} y2={20} stroke="#8C88A8" strokeWidth={6} />
      </g>
    ))}
  </g>
);

const Pantalla: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly monto: number; readonly modo?: string }> = ({ x, y, s, monto, modo = "" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-220} y={-90} width={440} height={180} rx={20} fill="#1A1630" stroke="#5A5478" strokeWidth={8} />
    <rect x={-190} y={-60} width={380} height={100} rx={10} fill="#0E1A12" />
    <Texto x={0} y={15} size={64} color={VERDE}>
      {`$ ${monto.toFixed(2)}`}
    </Texto>
    <Texto x={0} y={74} size={26} color={C.grey}>
      {modo}
    </Texto>
  </g>
);

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <Pantalla x={540} y={900} s={1.4} monto={12.4} />
    <Texto x={540} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo sabe el taxi cuánto cobrarte?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.andando], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={AMARILLO} />
    </>
  );
};

// B. Sube andando y también parado en el tráfico + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const parado = t > T.parado;
  const x = parado ? 620 : interpolate(t, [T.andando - 0.6, T.parado], [200, 620], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.andando, T.conectado], [1, 1.04])}>
      <Pantalla x={540} y={560} s={0.9} monto={4.5 + Math.floor(t * 2) * 0.1} modo={parado ? "parado" : "andando"} />
      <rect x={0} y={1060} width={1080} height={120} fill="#2A2A38" />
      <g opacity={aparece(t, T.parado)}>
        <rect x={860} y={880} width={200} height={130} rx={20} fill={C.red} />
        <circle cx={900} cy={1010} r={30} fill="#111" />
        <circle cx={1020} cy={1010} r={30} fill="#111" />
      </g>
      <Taxi x={x} y={1010} s={0.9} rueda={parado ? 0 : t * 400} />
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.conectado], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          nunca cobra las dos a la vez
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Conectado al auto: pulsos mientras las ruedas giran, tantos por kilómetro; suma una ficha cada cierta distancia
export const Pulsos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const n = Math.floor(Math.max(0, t - T.pulsos) * 8);
  const fichas = Math.floor(n / 12);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.conectado, T.pero], [1, 1.04])}>
        <g transform={`translate(260 1050) rotate(${t * 300})`}>
          <circle cx={0} cy={0} r={150} fill="#111" />
          <circle cx={0} cy={0} r={60} fill="#5A5478" />
          <rect x={-8} y={-60} width={16} height={30} fill={C.yellow} />
        </g>
        <path d="M 260 1050 Q 260 780 540 760" stroke="#5A5478" strokeWidth={8} fill="none" opacity={aparece(t, T.conectado)} />
        {[0, 1, 2].map((k) => {
          const u = (t * 1.2 + k / 3) % 1;
          return <circle key={k} cx={260 + u * 280 * u} cy={1050 - 290 * Math.sqrt(u)} r={12} fill={C.yellow} opacity={aparece(t, T.pulsos)} />;
        })}
        <Pantalla x={720} y={680} s={0.8} monto={4.5 + fichas * 0.5} modo="por distancia" />
        <Texto x={720} y={900} size={36} color={C.yellow} op={aparece(t, T.pulsos)}>
          {`${n} pulsos`}
        </Texto>
        <Texto x={720} y={960} size={30} color={C.grey} op={aparece(t, T.kilometro)}>
          tantos por kilómetro
        </Texto>
        <g opacity={aparece(t, T.ficha)}>
          {new Array(Math.min(8, fichas)).fill(0).map((_, k) => (
            <circle key={k} cx={540 + k * 60} cy={1300} r={24} fill={AMARILLO} stroke="#B88A10" strokeWidth={5} />
          ))}
          <Texto x={700} y={1400} size={34} color={AMARILLO}>
            + una ficha por tramo
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.ficha} color={AMARILLO} />
    </>
  );
};

// D. Despacio o detenido casi no llegan pulsos: cambia de modo y cuenta el tiempo
export const Tiempo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const modoT = aparece(t, T.cambia);
  const seg = Math.max(0, t - T.tiempo);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pero, T.cambio], [1, 1.04])}>
        <rect x={0} y={1060} width={1080} height={120} fill="#2A2A38" />
        <Taxi x={540} y={1010} s={0.9} rueda={0} />
        <Texto x={540} y={1250} size={36} color={C.grey} op={aparece(t, T.detenido) * (1 - modoT)}>
          casi no llegan pulsos
        </Texto>
        <Pantalla x={540} y={560} s={0.9} monto={6 + Math.floor(seg / 1.5) * 0.3} modo={modoT > 0.5 ? "por tiempo" : "por distancia"} />
        <g opacity={aparece(t, T.tiempo)} transform="translate(860 780)">
          <circle cx={0} cy={0} r={80} fill={C.card} stroke={C.white} strokeWidth={6} />
          <line x1={0} y1={0} x2={Math.sin(seg * 2) * 60} y2={-Math.cos(seg * 2) * 60} stroke={C.yellow} strokeWidth={8} strokeLinecap="round" />
        </g>
        <Texto x={540} y={1250} size={36} color={C.yellow} op={aparece(t, T.minuto)}>
          fichas por minuto de espera
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.cambia} color={C.yellow} />
    </>
  );
};

// E. El cambio ocurre a una velocidad fija, donde los dos modos cobran lo mismo
export const Cruce: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const X = (v: number) => 180 + v * 7;
  const Y = (c: number) => 1200 - c * 5;
  return (
    <Lienzo zoom={interpolate(t, [T.cambio, T.asi], [1, 1.04])}>
      <line x1={180} y1={1200} x2={920} y2={1200} stroke={C.grey} strokeWidth={4} />
      <line x1={180} y1={1200} x2={180} y2={660} stroke={C.grey} strokeWidth={4} />
      <Texto x={920} y={1250} size={28} color={C.grey} anchor="end">
        velocidad
      </Texto>
      <Texto x={190} y={640} size={28} color={C.grey} anchor="start">
        cobro por minuto
      </Texto>
      <line x1={X(0)} y1={Y(40)} x2={X(100)} y2={Y(40)} stroke={C.yellow} strokeWidth={8} opacity={aparece(t, T.cambio)} />
      <line x1={X(0)} y1={Y(0)} x2={X(100)} y2={Y(100)} stroke={C.cyan} strokeWidth={8} opacity={aparece(t, T.cambio)} />
      <Texto x={X(8)} y={Y(40) - 20} size={28} color={C.yellow} anchor="start" op={aparece(t, T.cambio)}>
        por tiempo
      </Texto>
      <Texto x={X(70)} y={Y(70) + 60} size={28} color={C.cyan} anchor="start" op={aparece(t, T.cambio)}>
        por distancia
      </Texto>
      <g opacity={aparece(t, T.velocidad)}>
        <circle cx={X(40)} cy={Y(40)} r={20} fill={C.white} />
        <line x1={X(40)} y1={Y(40)} x2={X(40)} y2={1200} stroke={C.white} strokeWidth={4} strokeDasharray="12 8" />
      </g>
      <Texto x={540} y={1360} size={40} color={C.white} op={aparece(t, T.mismo)}>
        aquí cobran lo mismo
      </Texto>
    </Lienzo>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} />
    </Lienzo>
  );
};
