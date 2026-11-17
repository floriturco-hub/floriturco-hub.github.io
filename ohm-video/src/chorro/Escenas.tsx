import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/chorro/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  abres: 1.68, // abres
  delgada: 4.82, // delgada
  gotas: 7.00, // gotas
  final: 7.78, // final
  acelera: 11.32, // acelera
  cantidad: 12.94, // cantidad
  adelgaza: 15.00, // adelgaza
  tension: 16.58, // tension
  tira: 18.64, // tira
  elastica: 20.42, // elastica
  largo: 21.82, // largo
  esferas: 23.90, // esferas
  ondulacion: 24.98, // ondulacion
  crece: 25.94, // crece
  estrangularlo: 26.62, // estrangularlo
  llama: 28.16, // llama
  inestabilidad: 28.42, // inestabilidad
  impresoras: 30.76, // impresoras
  identicas: 33.58, // identicas
  porEso: 34.42, // por
  fin: 35.96, // FIN
};

const AGUA = "#5AB8F0";

// Chorro desde (x, y0) hasta yb (rotura) y luego gotas; t anima las ondulaciones; abierto 0..1
const Chorro: React.FC<{ readonly x: number; readonly y0: number; readonly yb: number; readonly t: number; readonly r0?: number; readonly ond?: number; readonly gotas?: number }> = ({
  x,
  y0,
  yb,
  t,
  r0 = 34,
  ond = 1,
  gotas = 1,
}) => {
  const r = (y: number) => r0 / Math.sqrt(1 + (y - y0) / 120);
  const n = 50;
  const pts = (lado: number) =>
    new Array(n + 1)
      .fill(0)
      .map((_, i) => {
        const y = y0 + ((yb - y0) * i) / n;
        const crec = ((y - y0) / (yb - y0)) ** 3;
        const w = r(y) * (1 + ond * 0.5 * crec * Math.sin((y - t * 400) / 22));
        return `${x + lado * w} ${y}`;
      });
  const izq = pts(-1);
  const der = pts(1).reverse();
  const rg = r(yb) * 1.3;
  return (
    <g>
      <path d={`M ${izq.join(" L ")} L ${der.join(" L ")} Z`} fill={AGUA} />
      <g opacity={gotas}>
        {new Array(6).fill(0).map((_, k) => {
          const u = (t * 2.2 + k / 6) % 1;
          return <circle key={k} cx={x} cy={yb + 30 + u * 520} r={rg} fill={AGUA} />;
        })}
      </g>
    </g>
  );
};

const Llave: React.FC<{ readonly x: number; readonly y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 300} y={y - 80} width={340} height={70} rx={20} fill="#B8B8C4" />
    <rect x={x - 40} y={y - 60} width={80} height={60} rx={10} fill="#C8C8D4" />
    <rect x={x - 180} y={y - 160} width={60} height={90} rx={10} fill="#8A8A96" />
    <rect x={x - 230} y={y - 180} width={160} height={30} rx={14} fill="#C8C8D4" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Llave x={540} y={560} />
    <Chorro x={540} y0={560} yb={1150} t={t} />
    <Texto x={840} y={900} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este chorro se rompe?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.abres], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Abres la llave a chorrito: se adelgaza al caer y abajo se rompe en gotas + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const yb = interpolate(t, [T.abres, T.delgada], [600, 1150], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.abres, T.acelera], [1, 1.04])}>
      <Llave x={540} y={560} />
      <Chorro x={540} y0={560} yb={yb} t={t} ond={aparece(t, T.gotas)} gotas={aparece(t, T.gotas)} />
      <Texto x={790} y={820} size={34} color={C.white} op={aparece(t, T.delgada)}>
        cada vez más delgado
      </Texto>
      <Texto x={790} y={1300} size={34} color={AGUA} op={aparece(t, T.gotas)}>
        …y se rompe en gotas
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿qué máquina usa este truco?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.acelera], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Al caer, el agua acelera; pasa la misma cantidad por segundo, así que se adelgaza
export const Acelera: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.acelera, T.tension], [1, 1.04])}>
      <Llave x={540} y={560} />
      <Chorro x={540} y0={560} yb={1500} t={t} ond={0} gotas={0} />
      <g opacity={aparece(t, T.acelera)}>
        {[700, 1000, 1350].map((y, k) => (
          <g key={y}>
            <line x1={660} y1={y} x2={660} y2={y + 60 + k * 50} stroke={C.yellow} strokeWidth={8} />
            <path d={`M 645 ${y + 45 + k * 50} l 15 15 l 15 -15`} stroke={C.yellow} strokeWidth={8} fill="none" />
          </g>
        ))}
        <Texto x={820} y={1100} size={34} color={C.yellow}>
          más rápido
        </Texto>
      </g>
      <Texto x={300} y={900} size={32} color={C.white} op={aparece(t, T.cantidad)}>
        misma cantidad
      </Texto>
      <Texto x={300} y={950} size={32} color={C.white} op={aparece(t, T.cantidad)}>
        cada segundo
      </Texto>
      <Texto x={300} y={1300} size={36} color={AGUA} op={aparece(t, T.adelgaza)}>
        → más delgado
      </Texto>
    </Lienzo>
  );
};

// D. Tensión superficial: la superficie tira hacia adentro como una piel elástica
export const Tension: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.tension, T.largo], [1, 1.04])}>
        <circle cx={540} cy={950} r={260} fill={AGUA} opacity={0.8} />
        <circle cx={540} cy={950} r={260} fill="none" stroke="#C8E8FF" strokeWidth={12} />
        <g opacity={aparece(t, T.tira)}>
          {new Array(12).fill(0).map((_, k) => {
            const a = (k / 12) * Math.PI * 2;
            const p = 8 * Math.sin(t * 4);
            return (
              <path
                key={k}
                d={`M ${540 + Math.cos(a) * (330 + p)} ${950 + Math.sin(a) * (330 + p)} L ${540 + Math.cos(a) * (275 + p)} ${950 + Math.sin(a) * (275 + p)}`}
                stroke={C.yellow}
                strokeWidth={8}
              />
            );
          })}
        </g>
        <Texto x={540} y={560} size={44} color={C.yellow} op={aparece(t, T.tension)}>
          tensión superficial
        </Texto>
        <Texto x={540} y={1340} size={38} color={C.white} op={aparece(t, T.elastica)}>
          como una piel elástica
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.tension} color={C.yellow} />
    </>
  );
};

// E. Un chorro largo prefiere partirse en esferas: la ondulación crece hasta estrangularlo en gotas
export const Ondula: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const a = interpolate(t, [T.ondulacion, T.estrangularlo + 0.4], [0.02, 1], clamp);
  const roto = a > 0.98;
  const L = 160;
  return (
    <Lienzo zoom={interpolate(t, [T.largo, T.llama], [1, 1.04])}>
      {!roto ? (
        <path
          d={`M 100 ${960 - 70} ${new Array(81)
            .fill(0)
            .map((_, i) => {
              const x = 100 + i * 11;
              return `L ${x} ${960 - 70 * (1 + 0.95 * a * Math.cos(((x - 100) / L) * Math.PI * 2))}`;
            })
            .join(" ")} ${new Array(81)
            .fill(0)
            .map((_, i) => {
              const x = 980 - i * 11;
              return `L ${x} ${960 + 70 * (1 + 0.95 * a * Math.cos(((x - 100) / L) * Math.PI * 2))}`;
            })
            .join(" ")} Z`}
          fill={AGUA}
        />
      ) : (
        new Array(6).fill(0).map((_, k) => <circle key={k} cx={100 + k * L} cy={960} r={104} fill={AGUA} />)
      )}
      <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.esferas)}>
        mejor partirse en esferas
      </Texto>
      <Texto x={540} y={1260} size={38} color={C.cyan} op={aparece(t, T.crece)}>
        la ondulación crece…
      </Texto>
      <Texto x={540} y={1330} size={40} color={C.yellow} op={aparece(t, T.estrangularlo)}>
        …hasta estrangularlo
      </Texto>
    </Lienzo>
  );
};

// F. Inestabilidad de Plateau-Rayleigh
export const Nombre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.llama, T.impresoras], [1, 1.06])}>
        <Llave x={540} y={560} />
        <Chorro x={540} y0={560} yb={1100} t={t} />
        <Texto x={540} y={1460} size={44} color={C.yellow} op={aparece(t, T.inestabilidad)}>
          inestabilidad de Plateau-Rayleigh
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.inestabilidad} color={C.yellow} />
    </>
  );
};

// G. Las impresoras de inyección de tinta la usan para fabricar gotas idénticas
export const Impresora: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.impresoras, T.porEso], [1, 1.04])}>
      <rect x={140} y={1200} width={800} height={260} rx={20} fill="#E8E8EE" />
      <rect x={440} y={640} width={200} height={200} rx={20} fill="#3A3A44" />
      <rect x={520} y={840} width={40} height={40} fill="#1A1A22" />
      {new Array(8).fill(0).map((_, k) => {
        const u = (t * 2 + k / 8) % 1;
        return <circle key={k} cx={540} cy={890 + u * 300} r={14} fill="#3A6AE0" />;
      })}
      {new Array(12).fill(0).map((_, k) => (
        <circle key={k} cx={220 + k * 58} cy={1300} r={16} fill="#3A6AE0" opacity={aparece(t, T.identicas)} />
      ))}
      <Texto x={540} y={580} size={38} color={C.white} op={aparece(t, T.impresoras)}>
        impresora de inyección de tinta
      </Texto>
      <Texto x={540} y={1520} size={40} color={C.cyan} op={aparece(t, T.identicas)}>
        gotas idénticas
      </Texto>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
