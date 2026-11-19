import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/queso/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  estirarse: 2.46, // estirarse
  pizza: 4.06, // pizza
  boca: 5.70, // boca
  final: 6.52, // final
  red: 10.48, // red
  caseinas: 11.72, // caseinas
  calcio: 13.08, // calcio
  grasa: 13.90, // grasa
  calentarse: 15.84, // calentarse
  derrite: 17.14, // derrite
  afloja: 18.30, // afloja
  hilos: 21.02, // hilos
  cerebro: 22.10, // cerebro
  senal: 24.08, // senal
  energia: 27.78, // energia
  porEso1: 28.18, // por
  anejado: 32.32, // anejado
  rotas: 34.04, // rotas
  separa: 37.02, // separa
  porEso: 38.24, // por
  fin: 40.22, // FIN
};

const QUESO = "#F8D060";
const MASA = "#D89A5A";

// Rebanada de pizza levantándose con hilos de queso; sube = 0..1
const Pizza: React.FC<{ readonly t: number; readonly sube: number; readonly x?: number; readonly y?: number }> = ({ t, sube, x = 540, y = 1100 }) => {
  const dy = -sube * 260;
  return (
    <g>
      <circle cx={x} cy={y + 220} r={330} fill={MASA} />
      <circle cx={x} cy={y + 220} r={300} fill="#C84A2A" />
      <circle cx={x} cy={y + 220} r={290} fill={QUESO} opacity={0.9} />
      {[0, 1, 2, 3, 4].map((k) => (
        <circle key={k} cx={x - 180 + k * 90} cy={y + 260 + (k % 2) * 60} r={26} fill="#A8323A" />
      ))}
      {new Array(7).fill(0).map((_, k) => {
        const dx = -70 + k * 23;
        return (
          <path
            key={k}
            d={`M ${x + dx} ${y + 40} C ${x + dx + 6 * Math.sin(t * 3 + k)} ${y + 40 + dy * 0.3}, ${x + dx * 0.7} ${y + dy * 0.8}, ${x + dx * 0.6} ${y + dy - 10}`}
            stroke={QUESO}
            strokeWidth={8 - Math.abs(dx) / 30}
            fill="none"
            opacity={sube > 0.05 ? 1 : 0}
          />
        );
      })}
      <path d={`M ${x - 120} ${y + dy - 20} L ${x + 120} ${y + dy - 20} L ${x} ${y + dy - 320} Z`} fill={MASA} />
      <path d={`M ${x - 100} ${y + dy - 30} L ${x + 100} ${y + dy - 30} L ${x} ${y + dy - 290} Z`} fill={QUESO} />
      <circle cx={x - 20} cy={y + dy - 110} r={20} fill="#A8323A" />
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Pizza t={t} sube={0.8 + 0.15 * Math.sin(t * 2)} />
    <Texto x={860} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este queso da tanta hambre?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.estirarse], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Ves estirarse el queso de una pizza y se te hace agua la boca + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.estirarse, T.red], [1, 1.04])}>
      <Pizza t={t} sube={interpolate(t, [T.estirarse, T.boca], [0, 1], clamp)} />
      <Texto x={540} y={1760} size={40} color={C.white} op={aparece(t, T.boca)}>
        se te hace agua la boca
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿por qué no todos se estiran?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.red], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// Red de caseínas: nodos y enlaces; estira = alargamiento horizontal; roto = cadenas cortadas
const Red: React.FC<{ readonly t: number; readonly estira: number; readonly roto?: number; readonly calcio?: number; readonly grasa?: number; readonly derretida?: number }> = ({
  t,
  estira,
  roto = 0,
  calcio = 1,
  grasa = 1,
  derretida = 0,
}) => {
  const nodos = new Array(20).fill(0).map((_, k) => {
    const i = k % 5;
    const j = Math.floor(k / 5);
    const cx = 540 + (i - 2) * (150 + estira * 60);
    const cy = 950 + (j - 1.5) * (150 - estira * 90) + 8 * Math.sin(t * 2 + k);
    return [cx, cy];
  });
  return (
    <g>
      {nodos.map(([x, y], k) => {
        const lados: number[] = [];
        if (k % 5 < 4) lados.push(k + 1);
        if (k < 15) lados.push(k + 5);
        return lados.map((m) => {
          const [x2, y2] = nodos[m];
          const corte = roto > 0 && (k * 7 + m) % 3 !== 0;
          const mx = (x + x2) / 2;
          const my = (y + y2) / 2;
          return corte ? (
            <g key={`${k}-${m}`}>
              <line x1={x} y1={y} x2={mx - (mx - x) * 0.75 * roto} y2={my - (my - y) * 0.75 * roto} stroke={QUESO} strokeWidth={10} />
              <line x1={x2} y1={y2} x2={mx + (x2 - mx) * 0.75 * roto} y2={my + (y2 - my) * 0.75 * roto} stroke={QUESO} strokeWidth={10} />
            </g>
          ) : (
            <line key={`${k}-${m}`} x1={x} y1={y} x2={x2} y2={y2} stroke={QUESO} strokeWidth={10} />
          );
        });
      })}
      {nodos.map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={14} fill="#E8E8EE" opacity={calcio} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <ellipse key={k} cx={400 + (k % 3) * 140 + estira * (k % 3 - 1) * 60} cy={880 + Math.floor(k / 3) * 150} rx={30 + derretida * 20} ry={30 - derretida * 12} fill="#F0B030" opacity={grasa} />
      ))}
    </g>
  );
};

// C. Red de proteínas (caseínas) unidas por calcio, con grasa y agua atrapadas
export const RedEsc: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.red, T.calentarse], [1, 1.04])}>
      <g opacity={aparece(t, T.red)}>
        <Red t={t} estira={0} calcio={aparece(t, T.calcio)} grasa={aparece(t, T.grasa)} />
      </g>
      <Texto x={540} y={600} size={42} color={QUESO} op={aparece(t, T.caseinas)}>
        red de caseínas
      </Texto>
      <Texto x={300} y={1320} size={34} color="#E8E8EE" op={aparece(t, T.calcio)}>
        ● calcio
      </Texto>
      <Texto x={760} y={1320} size={34} color="#F0B030" op={aparece(t, T.grasa)}>
        ● grasa y agua
      </Texto>
    </Lienzo>
  );
};

// D. Al calentarse la grasa se derrite y la red se afloja y se estira en hilos largos
export const Derrite: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const est = interpolate(t, [T.afloja, T.hilos + 0.6], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.calentarse, T.cerebro], [1, 1.04])}>
        <Red t={t} estira={est} derretida={aparece(t, T.derrite)} />
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M ${380 + k * 160} 1400 q 20 -30 0 -60 q -20 -30 0 -60`} stroke={C.orange} strokeWidth={8} fill="none" opacity={aparece(t, T.calentarse) * (0.6 + 0.4 * Math.sin(t * 6 + k))} />
        ))}
        <Texto x={540} y={600} size={38} color="#F0B030" op={aparece(t, T.derrite)}>
          la grasa se derrite
        </Texto>
        <Texto x={540} y={1520} size={42} color={QUESO} op={aparece(t, T.hilos)}>
          se estira en hilos largos
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.hilos} color={QUESO} />
    </>
  );
};

// E. El cerebro ve una señal de grasa, sal y sabor: mucha energía; se te hace agua la boca
export const Cerebro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.cerebro, T.anejado], [1, 1.04])}>
      <g transform="translate(540 800) scale(1.2)">
        <path d="M -200 40 C -240 -80 -120 -200 0 -180 C 120 -220 250 -100 210 20 C 240 120 120 170 40 140 C -20 190 -160 170 -200 40 Z" fill="#E8A0B0" />
        <path d="M -120 -100 q 40 40 0 80 M -20 -150 q 50 60 0 130 M 90 -120 q -40 60 10 120" stroke="#C87A90" strokeWidth={10} fill="none" />
      </g>
      <g opacity={aparece(t, T.senal)}>
        <Texto x={240} y={1150} size={38} color="#F0B030">
          grasa
        </Texto>
        <Texto x={540} y={1150} size={38} color="#E8E8EE">
          sal
        </Texto>
        <Texto x={840} y={1150} size={38} color={C.orange}>
          sabor
        </Texto>
      </g>
      <Texto x={540} y={1260} size={46} color={C.yellow} op={aparece(t, T.energia)}>
        = mucha energía
      </Texto>
      <g opacity={aparece(t, T.porEso1)}>
        <path transform="translate(540 1420) scale(1.6)" d="M 0 -40 C 20 -10 30 5 30 18 A 30 30 0 0 1 -30 18 C -30 5 -20 -10 0 -40 Z" fill="#7AC8F0" />
        <Texto x={540} y={1560} size={34} color={C.white}>
          saliva antes de probarlo
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. Un queso muy añejado tiene las proteínas rotas en pedazos cortos: se separa en grasa
export const Anejado: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sep = aparece(t, T.separa);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.anejado, T.porEso], [1, 1.04])}>
        <Red t={t} estira={0} roto={aparece(t, T.rotas)} grasa={1 - sep} />
        <ellipse cx={540} cy={1260} rx={360 * sep} ry={40 * sep} fill="#F0B030" opacity={0.85} />
        <Texto x={540} y={600} size={42} color={C.white} op={aparece(t, T.anejado)}>
          queso muy añejado
        </Texto>
        <Texto x={540} y={660} size={34} color={C.red} op={aparece(t, T.rotas)}>
          proteínas en pedazos cortos
        </Texto>
        <Texto x={540} y={1400} size={38} color="#F0B030" op={sep}>
          no se estira: suelta grasa
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.rotas} color={C.red} />
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
