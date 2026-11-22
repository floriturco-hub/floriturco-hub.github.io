import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/aspas/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  aerogeneradores: 3.06, // aerogeneradores
  final: 5.42, // final
  energia: 8.94, // energia
  revuelve: 10.18, // revuelve
  aprovecha: 13.00, // aprovecha
  agregan: 15.06, // agregan
  equilibrio: 19.08, // equilibrio
  vertical: 20.02, // vertical
  torre: 21.66, // torre
  arriba: 22.54, // arriba
  sacude: 25.24, // sacude
  reparten: 26.68, // reparten
  suave: 29.86, // suave
  existen: 31.72, // existen
  rapido: 33.10, // rapido
  ruido: 34.10, // ruido
  porEso: 35.58, // por
  fin: 37.76, // FIN
};

const BLANCO = "#E8ECF4";

// Aerogenerador: n aspas, ángulo a (grados), buje en (x,y), sacudida dx
const Molino: React.FC<{ readonly x: number; readonly y: number; readonly n: number; readonly a: number; readonly s?: number; readonly dx?: number }> = ({ x, y, n, a, s = 1, dx = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -22 0 L 22 0 L 34 700 L -34 700 Z" fill={BLANCO} />
    <g transform={`translate(${dx} 0)`}>
      <rect x={-50} y={-30} width={120} height={60} rx={24} fill={BLANCO} />
      <g transform={`rotate(${a})`}>
        {new Array(n).fill(0).map((_, k) => (
          <path key={k} transform={`rotate(${(360 / n) * k})`} d="M -14 0 Q -26 -200 0 -380 Q 18 -200 14 0 Z" fill={BLANCO} />
        ))}
      </g>
      <circle cx={0} cy={0} r={26} fill="#C8D0DC" />
    </g>
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Molino x={540} y={900} n={3} a={t * 60} />
    <Texto x={880} y={560} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este molino tiene tres aspas?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.aerogeneradores], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Casi todos los aerogeneradores tienen tres aspas + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.aerogeneradores, T.energia], [1, 1.04])}>
      {[200, 540, 880].map((x, k) => (
        <Molino key={x} x={x} y={900 + (k % 2) * 80} n={3} a={t * 60 + k * 40} s={0.55} />
      ))}
      <Texto x={540} y={1460} size={40} color={C.white} op={aparece(t, T.aerogeneradores)}>
        casi todos: tres aspas
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿y los de dos aspas?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.energia], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Más aspas no dan mucha más energía; cada una revuelve el aire; cuatro o más agregan peso y costo
export const Energia: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const vals = [0.7, 0.92, 1, 1.02, 1.03];
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.energia, T.equilibrio], [1, 1.04])}>
        <Texto x={540} y={640} size={38} color={C.white} op={aparece(t, T.energia)}>
          energía según el número de aspas
        </Texto>
        {vals.map((v, k) => {
          const h = 420 * v * aparece(t, T.energia + k * 0.15);
          return (
            <g key={k}>
              <rect x={190 + k * 150} y={1200 - h} width={100} height={h} rx={12} fill={k === 2 ? C.yellow : C.cyan} opacity={k > 2 ? 0.5 : 1} />
              <Texto x={240 + k * 150} y={1260} size={36} color={C.white}>
                {String(k + 1)}
              </Texto>
            </g>
          );
        })}
        <Texto x={540} y={1360} size={34} color={C.cyan} op={aparece(t, T.revuelve)}>
          cada aspa revuelve el aire de la siguiente
        </Texto>
        <Texto x={540} y={1440} size={34} color={C.orange} op={aparece(t, T.agregan)}>
          4 o más: más peso y costo por muy poco
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.aprovecha} color={C.yellow} />
    </>
  );
};

// D. Con dos: en vertical, una pasa frente a la torre y la otra arriba con más viento; el rotor se sacude
export const Dos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const a = interpolate(t, [T.equilibrio, T.vertical + 0.4], [-60, 0], clamp) + (t > T.sacude ? (t - T.sacude) * 120 : 0);
  const sac = aparece(t, T.sacude) * 14 * Math.sin(t * 25);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.equilibrio, T.reparten], [1, 1.04])}>
        <Molino x={540} y={1000} n={2} a={a} s={0.9} dx={sac} />
        <g opacity={aparece(t, T.arriba)}>
          {[0, 1, 2, 3].map((k) => (
            <path key={k} d={`M 80 ${680 + k * 160} l ${200 - k * 40} 0 m -14 -12 l 14 12 l -14 12`} stroke={C.cyan} strokeWidth={6 + (3 - k) * 2} fill="none" />
          ))}
          <Texto x={190} y={640} size={28} color={C.cyan}>
            más viento arriba
          </Texto>
        </g>
        <Texto x={760} y={1250} size={30} color={C.yellow} op={aparece(t, T.torre)}>
          frente a la torre
        </Texto>
        <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.equilibrio)}>
          con dos: el equilibrio
        </Texto>
        <Texto x={800} y={1400} size={44} color={C.orange} op={aparece(t, T.sacude)}>
          ¡se sacude!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.sacude} color={C.orange} />
    </>
  );
};

// E. Tres aspas reparten el peso igual en cualquier posición: giro suave
export const Tres: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.reparten, T.existen], [1, 1.04])}>
      <Molino x={540} y={1000} n={3} a={t * 70} s={0.9} />
      <Texto x={540} y={600} size={38} color={C.white} op={aparece(t, T.reparten)}>
        tres: el peso se reparte igual
      </Texto>
      <Texto x={800} y={1400} size={44} color="#5AD08A" op={aparece(t, T.suave)}>
        giro suave
      </Texto>
    </Lienzo>
  );
};

// F. Los de dos sí existen, pero giran más rápido, hacen más ruido y vibran más
export const Existen: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.existen, T.porEso], [1, 1.04])}>
      <Molino x={540} y={1000} n={2} a={t * 200} s={0.9} dx={6 * Math.sin(t * 30)} />
      <Texto x={540} y={600} size={38} color={C.white} op={aparece(t, T.existen)}>
        los de dos sí existen…
      </Texto>
      <Texto x={260} y={1580} size={34} color={C.yellow} op={aparece(t, T.rapido)}>
        más rápido
      </Texto>
      <Texto x={540} y={1580} size={34} color={C.yellow} op={aparece(t, T.ruido)}>
        más ruido
      </Texto>
      <Texto x={820} y={1580} size={34} color={C.yellow} op={aparece(t, T.ruido + 0.6)}>
        más vibración
      </Texto>
    </Lienzo>
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
