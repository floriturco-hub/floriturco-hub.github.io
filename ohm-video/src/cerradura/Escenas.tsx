import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/cerradura/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  cualquiera: 2.02, // cualquiera
  gira: 4.24, // gira
  tuya: 5.08, // tuya
  final: 6.42, // final
  cilindro: 10.04, // cilindro
  pernos: 11.72, // pernos
  partida: 12.78, // partida
  resorte: 14.10, // resorte
  cruce: 17.20, // cruce
  linea: 17.70, // linea
  trabado: 20.42, // trabado
  dientes: 21.46, // dientes
  altura: 22.74, // altura
  corte: 25.40, // corte
  alineados: 27.78, // alineados
  libre: 29.34, // libre
  gira2: 29.98, // gira
  maestra: 31.10, // maestra
  extra: 34.12, // extra
  alturas: 35.20, // alturas
  asi: 36.56, // asi
  fin: 37.92, // FIN
};

const LATON = "#E0B040";
const ACERO = "#B8B8C4";
const SHEAR = 1000;
const FONDO = 1200;
const LK = [100, 160, 80, 140, 120];
const XS = [300, 420, 540, 660, 780];

// Corte de la cerradura de pernos. key: 0 = sin llave, 1 = llave correcta metida; malo = llave equivocada; maestro = perno extra
const Cilindro: React.FC<{ readonly t: number; readonly llave: number; readonly malo?: number; readonly marcar?: number; readonly maestro?: number }> = ({ t, llave, malo = 0, marcar = 0, maestro = 0 }) => {
  const desfase = [40, -50, 30, -30, 50];
  return (
    <g>
      <rect x={200} y={640} width={700} height={620} rx={20} fill="#4A4A56" />
      <rect x={220} y={SHEAR} width={660} height={FONDO - SHEAR + 40} rx={10} fill="#6A6A78" />
      {XS.map((x, i) => {
        const kh = (200 - LK[i]) + malo * desfase[i];
        const yApoyo = llave > 0 ? interpolate(llave, [0, 1], [FONDO - 20, FONDO - kh]) : FONDO - 20;
        const topK = yApoyo - LK[i];
        const topD = topK - 130;
        const resorte = topD - 660;
        const cruza = topK < SHEAR - 4 || topK > SHEAR + 4;
        return (
          <g key={i}>
            <rect x={x - 26} y={660} width={52} height={yApoyo - 660} fill="#2A2A34" />
            <path d={`M ${x} 660 ${new Array(8).fill(0).map((_, k) => `L ${x + (k % 2 ? -18 : 18)} ${660 + ((k + 1) * resorte) / 8}`).join(" ")}`} stroke={C.cyan} strokeWidth={5} fill="none" />
            <rect x={x - 22} y={topD} width={44} height={130} rx={8} fill={ACERO} stroke={marcar && cruza ? C.red : "none"} strokeWidth={6} />
            <rect x={x - 22} y={topK} width={44} height={LK[i]} rx={8} fill={LATON} />
            {maestro > 0 && i === 2 ? <rect x={x - 22} y={topK - 30} width={44} height={30} rx={6} fill={C.orange} opacity={maestro} /> : null}
          </g>
        );
      })}
      <line x1={180} y1={SHEAR} x2={920} y2={SHEAR} stroke={marcar > 0 ? C.yellow : "#8A8A96"} strokeWidth={marcar > 0 ? 6 : 3} strokeDasharray="16 10" opacity={0.5 + 0.5 * marcar} />
      {llave > 0 ? (
        <path
          d={`M ${-500 + llave * 600} ${FONDO} L ${-500 + llave * 600} ${FONDO + 40} L ${280 + (llave - 1) * 600 + 600} ${FONDO + 40} ${XS.map((x, i) => {
            const kh = (200 - LK[i]) + malo * desfase[i];
            const xx = x + (llave - 1) * 600;
            return `L ${xx + 50} ${FONDO} L ${xx} ${FONDO - kh} L ${xx - 50} ${FONDO}`;
          })
            .reverse()
            .join(" ")} Z`}
          fill={malo > 0 ? "#8A8A96" : "#C8C8D4"}
        />
      ) : null}
      {void t}
    </g>
  );
};

// Vista frontal de la cerradura (cilindro que gira)
const Frente: React.FC<{ readonly x: number; readonly y: number; readonly ang: number; readonly s?: number }> = ({ x, y, ang, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={0} r={120} fill="#4A4A56" />
    <circle cx={0} cy={0} r={90} fill="#8A8A96" />
    <g transform={`rotate(${ang})`}>
      <rect x={-10} y={-60} width={20} height={90} rx={6} fill="#1A1A22" />
    </g>
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Cilindro t={t} llave={1} />
    <Texto x={540} y={560} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo sabe que es tu llave?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.cualquiera], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Una llave cualquiera entra pero no gira; la tuya sí + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tuya = aparece(t, T.tuya);
  return (
    <Lienzo zoom={interpolate(t, [T.cualquiera, T.cilindro], [1, 1.04])}>
      <g opacity={1 - tuya}>
        <Frente x={540} y={950} ang={aparece(t, T.gira) * 8 * Math.sin(t * 20)} s={2} />
        <Texto x={540} y={1300} size={44} color={C.red} op={aparece(t, T.gira)}>
          llave equivocada: no gira ✗
        </Texto>
      </g>
      <g opacity={tuya}>
        <Frente x={540} y={950} ang={interpolate(t, [T.tuya + 0.3, T.tuya + 1], [0, 90], clamp)} s={2} />
        <Texto x={540} y={1300} size={44} color="#5AD08A">
          tu llave: gira ✓
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿y la llave maestra?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.cilindro], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Dentro del cilindro: columnas de pernos partidas en dos, con un resorte; si un perno cruza la línea, queda trabado
export const Pernos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cilindro, T.dientes], [1, 1.04])}>
        <Cilindro t={t} llave={0} marcar={aparece(t, T.linea)} />
        <Texto x={1000} y={760} size={28} color={C.cyan} op={aparece(t, T.resorte)}>
          resorte
        </Texto>
        <Texto x={540} y={1360} size={34} color={ACERO} op={aparece(t, T.partida)}>
          cada perno está partido en dos
        </Texto>
        <Texto x={540} y={570} size={34} color={C.yellow} op={aparece(t, T.linea)}>
          línea de corte
        </Texto>
        <Texto x={540} y={1430} size={44} color={C.red} op={aparece(t, T.trabado)}>
          ¡trabado!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.trabado} color={C.red} />
    </>
  );
};

// D. Los dientes de tu llave suben cada perno hasta que su corte queda en la línea: todo alineado, gira
export const Dientes: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const k = interpolate(t, [T.dientes, T.corte], [0, 1], clamp);
  const al = aparece(t, T.alineados);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.dientes, T.maestra], [1, 1.04])}>
        <Cilindro t={t} llave={Math.max(0.001, k)} marcar={al} />
        <Texto x={540} y={570} size={36} color={C.white} op={aparece(t, T.altura) * (1 - al)}>
          cada diente, a la altura exacta
        </Texto>
        <Texto x={540} y={570} size={42} color="#5AD08A" op={al}>
          todos en la línea ✓
        </Texto>
        <g opacity={aparece(t, T.libre)}>
          <Frente x={540} y={1450} ang={interpolate(t, [T.gira2, T.gira2 + 0.6], [0, 90], clamp)} s={0.8} />
        </g>
      </Lienzo>
      <Flash t={t} d={T.alineados} color="#5AD08A" />
    </>
  );
};

// E. Llave maestra: algunos pernos tienen un corte extra, dos alturas que sirven
export const Maestra: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.maestra, T.asi], [1, 1.04])}>
      <Cilindro t={t} llave={1} maestro={aparece(t, T.extra)} marcar={1} />
      <Texto x={540} y={570} size={44} color={C.yellow} op={aparece(t, T.maestra)}>
        llave maestra
      </Texto>
      <Texto x={540} y={1360} size={36} color={C.orange} op={aparece(t, T.extra)}>
        un corte extra en el perno
      </Texto>
      <Texto x={540} y={1430} size={38} color={C.white} op={aparece(t, T.alturas)}>
        dos alturas que abren
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
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
