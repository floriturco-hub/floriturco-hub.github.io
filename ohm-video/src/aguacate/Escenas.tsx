import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/aguacate/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  cortas: 2.08, // cortas
  manzana: 3.48, // manzana
  superficie: 5.14, // superficie
  final: 7.00, // final
  cortarlo: 9.46, // cortarlo
  rompes: 9.96, // rompes
  mezcla: 12.28, // mezcla
  enzima: 12.86, // enzima
  fenoles: 14.50, // fenoles
  separados: 16.02, // separados
  oxigeno: 17.24, // oxigeno
  transforma: 18.62, // transforma
  unen: 20.14, // unen
  melanina: 22.24, // melanina
  podrido: 23.86, // podrido
  reaccion: 24.84, // reaccion
  limon: 26.42, // limon
  acido: 27.66, // acido
  cubrirlo: 29.26, // cubrirlo
  oxigeno2: 30.86, // oxigeno
  semilla: 31.84, // semilla
  resto: 34.12, // resto
  porEso: 35.86, // por
  fin: 37.82, // FIN
};

const PULPA = "#D8E08A";
const CAFE = "#8A6A3A";
const ENZ = "#5AC8A8";
const FEN = "#E8A0E0";

const mezcla = (a: string, b: string, k: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * k)).join(",")})`;
};

// Medio aguacate; cafe 0..1; semilla 0/1; tapada = zona bajo la semilla que sigue verde
const Aguacate: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly cafe: number; readonly semilla?: number }> = ({ x, y, s = 1, cafe, semilla = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 -300 C 140 -300 200 -120 220 40 C 240 220 130 320 0 320 C -130 320 -240 220 -220 40 C -200 -120 -140 -300 0 -300 Z" fill="#2A4A1A" />
    <path d="M 0 -270 C 120 -270 175 -110 195 40 C 212 200 115 290 0 290 C -115 290 -212 200 -195 40 C -175 -110 -120 -270 0 -270 Z" fill={mezcla(PULPA, CAFE, cafe)} />
    <circle cx={0} cy={80} r={120} fill={PULPA} opacity={cafe > 0 ? 1 - semilla : 0} />
    <circle cx={0} cy={80} r={100} fill="#8A5A2A" opacity={semilla} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Aguacate x={540} y={1000} s={1.2} cafe={0.85 + 0.1 * Math.sin(t * 2)} />
    <Texto x={880} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este aguacate se pone café?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.cortas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Cortas un aguacate o una manzana y en minutos se pone café + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cafe = interpolate(t, [T.superficie - 0.5, T.final], [0, 0.85], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.cortas, T.cortarlo], [1, 1.04])}>
      <Aguacate x={340} y={1000} s={0.85} cafe={cafe} />
      <g opacity={aparece(t, T.manzana)}>
        <circle cx={800} cy={1000} r={190} fill="#C83A3A" />
        <circle cx={800} cy={1000} r={170} fill={mezcla("#F8F0C8", CAFE, cafe)} />
        <path d="M 790 860 l 10 -30 m -40 50 l 40 -50" stroke="#5A3A1A" strokeWidth={8} />
      </g>
      <Texto x={540} y={1360} size={40} color={CAFE} op={aparece(t, T.superficie)}>
        en minutos: café
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿sirve dejarle la semilla?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.cortarlo], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Al cortarlo rompes células: se mezclan una enzima y los fenoles, antes separados
export const Celulas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rompe = aparece(t, T.rompes);
  const mez = interpolate(t, [T.mezcla, T.separados], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.cortarlo, T.oxigeno], [1, 1.04])}>
      {[0, 1].map((k) => {
        const cx = 340 + k * 400;
        return (
          <g key={k}>
            <rect x={cx - 160} y={760} width={320} height={360} rx={40} fill="none" stroke="#8AA83A" strokeWidth={8} strokeDasharray={rompe ? "60 40" : "0"} />
            <rect x={cx - 120} y={800} width={110} height={280} rx={20} fill="none" stroke="#C8E870" strokeWidth={5} opacity={1 - mez} />
            {new Array(6).fill(0).map((_, j) => (
              <circle key={j} cx={cx - 65 + mez * ((j % 3) * 60 + 20) + 6 * Math.sin(t * 3 + j)} cy={840 + j * 40} r={14} fill={ENZ} opacity={aparece(t, T.enzima)} />
            ))}
            {new Array(6).fill(0).map((_, j) => (
              <circle key={j} cx={cx + 70 - mez * ((j % 3) * 60 + 30) + 6 * Math.cos(t * 3 + j)} cy={860 + j * 40} r={12} fill={FEN} opacity={aparece(t, T.fenoles)} />
            ))}
          </g>
        );
      })}
      <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.rompes)}>
        rompes millones de células
      </Texto>
      <Texto x={340} y={1220} size={34} color={ENZ} op={aparece(t, T.enzima)}>
        ● enzima
      </Texto>
      <Texto x={740} y={1220} size={34} color={FEN} op={aparece(t, T.fenoles)}>
        ● fenoles
      </Texto>
      <Texto x={540} y={1320} size={38} color={C.yellow} op={mez}>
        ¡ahora se mezclan!
      </Texto>
    </Lienzo>
  );
};

// D. Con oxígeno, la enzima transforma los fenoles y se unen en pigmentos cafés (como la melanina)
export const Pigmento: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tr = interpolate(t, [T.transforma, T.unen], [0, 1], clamp);
  const une = interpolate(t, [T.unen, T.melanina], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.oxigeno, T.podrido], [1, 1.04])}>
        {new Array(6).fill(0).map((_, k) => {
          const u = (t * 0.6 + k / 6) % 1;
          return (
            <g key={k} opacity={aparece(t, T.oxigeno) * (1 - u)}>
              <circle cx={200 + k * 140} cy={560 + u * 260} r={16} fill={C.red} />
              <circle cx={228 + k * 140} cy={560 + u * 260} r={16} fill={C.red} />
            </g>
          );
        })}
        {new Array(8).fill(0).map((_, k) => {
          const x0 = 220 + (k % 4) * 210;
          const y0 = 960 + Math.floor(k / 4) * 160;
          const xf = 300 + k * 70;
          const yf = 1040 + 20 * Math.sin(k);
          return (
            <circle key={k} cx={x0 + (xf - x0) * une} cy={y0 + (yf - y0) * une} r={22 + une * 4} fill={mezcla("#E8A0E0", "#6A4A2A", tr)} />
          );
        })}
        {une > 0.95 ? <path d="M 300 1040 L 790 1040" stroke="#6A4A2A" strokeWidth={14} /> : null}
        <Texto x={540} y={1320} size={42} color={CAFE} op={aparece(t, T.unen)}>
          pigmentos cafés
        </Texto>
        <Texto x={540} y={1400} size={34} color={C.white} op={aparece(t, T.melanina)}>
          parecidos a la melanina
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.unen} color={CAFE} />
    </>
  );
};

// E. No está podrido: es química. El limón apaga la enzima; el plástico le quita el oxígeno
export const Remedios: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.podrido, T.semilla], [1, 1.04])}>
      <g opacity={1 - aparece(t, T.limon)}>
        <Texto x={540} y={860} size={52} color={C.grey}>
          ¿podrido? ✗
        </Texto>
        <Texto x={540} y={980} size={52} color={C.yellow} op={aparece(t, T.reaccion)}>
          reacción química ✓
        </Texto>
      </g>
      <g opacity={aparece(t, T.limon)}>
        <ellipse cx={300} cy={900} rx={160} ry={120} fill="#F0E040" />
        <ellipse cx={300} cy={900} rx={130} ry={95} fill="#F8F0A0" />
        <Texto x={300} y={1100} size={34} color="#F0E040">
          limón
        </Texto>
        <Texto x={300} y={1160} size={30} color={C.white} op={aparece(t, T.acido)}>
          el ácido apaga la enzima
        </Texto>
      </g>
      <g opacity={aparece(t, T.cubrirlo)}>
        <Aguacate x={780} y={920} s={0.5} cafe={0} />
        <rect x={650} y={760} width={260} height={320} rx={30} fill="#C8E8FF" opacity={0.3} stroke="#E8F4FF" strokeWidth={4} />
        <Texto x={780} y={1160} size={30} color="#C8E8FF" op={aparece(t, T.oxigeno2)}>
          plástico: sin oxígeno
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. La semilla solo protege la parte que tapa: el resto se pone café igual
export const Semilla: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const quita = aparece(t, T.resto);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.semilla, T.porEso], [1, 1.04])}>
        <Aguacate x={540} y={1000} s={1.1} cafe={0.85} semilla={1 - quita} />
        <circle cx={540 + 300 * quita} cy={1088 - 420 * quita} r={110} fill="#8A5A2A" opacity={quita} />
        <Texto x={540} y={580} size={38} color={C.white} op={aparece(t, T.semilla)}>
          ¿y la semilla?
        </Texto>
        <Texto x={540} y={1440} size={38} color={CAFE} op={quita}>
          solo protege lo que tapa
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.resto} color={CAFE} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
