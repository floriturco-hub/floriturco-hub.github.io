import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/fantasma/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  pierde: 2.46, // pierde
  mueve: 5.42, // mueve
  pica: 6.18, // pica
  final: 8.14, // final
  mapa: 11.26, // mapa
  falta: 13.02, // falta
  zona: 14.04, // zona
  sensaciones: 16.58, // sensaciones
  cara: 19.42, // cara
  mejilla: 21.02, // mejilla
  fantasma: 22.72, // fantasma
  ordenes: 24.86, // ordenes
  responde: 26.20, // responde
  calambre: 28.30, // calambre
  espejo: 31.16, // espejo
  reflejo: 32.74, // reflejo
  perdida: 34.46, // perdida
  dolor: 36.40, // dolor
  asi: 37.42, // asi
  fin: 39.10, // FIN
};

const PIEL = "#E0A888";
const FANT = "#8AC8F0";

// Mano abierta (dedos ondulando con dedos 0..1)
const Mano: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly fantasma?: boolean; readonly cierre?: number; readonly t?: number; readonly espejo?: boolean }> = ({
  x,
  y,
  s = 1,
  fantasma = false,
  cierre = 0,
  t = 0,
  espejo = false,
}) => {
  const col = fantasma ? FANT : PIEL;
  return (
    <g transform={`translate(${x} ${y}) scale(${espejo ? -s : s} ${s})`} opacity={fantasma ? 0.55 + 0.15 * Math.sin(t * 3) : 1}>
      <rect x={-70} y={-60} width={140} height={150} rx={40} fill={col} stroke={fantasma ? "#fff" : "none"} strokeWidth={fantasma ? 3 : 0} strokeDasharray="10 8" />
      {[-48, -16, 16, 48].map((dx, k) => {
        const h = (120 - k * 8) * (1 - cierre * 0.7) + (cierre === 0 ? 8 * Math.sin(t * 4 + k) : 0);
        return <rect key={k} x={dx - 14} y={-60 - h} width={28} height={h + 10} rx={14} fill={col} stroke={fantasma ? "#fff" : "none"} strokeWidth={fantasma ? 3 : 0} strokeDasharray="10 8" />;
      })}
      <rect x={60} y={-20} width={70} height={30} rx={15} fill={col} transform="rotate(-30 60 -5)" stroke={fantasma ? "#fff" : "none"} strokeWidth={fantasma ? 3 : 0} strokeDasharray="10 8" />
    </g>
  );
};

// Brazo con muñón a la derecha
const Brazo: React.FC<{ readonly y: number }> = ({ y }) => (
  <g>
    <rect x={0} y={y - 60} width={460} height={120} rx={60} fill={PIEL} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Brazo y={1000} />
    <rect x={460} y={950} width={220} height={100} rx={50} fill={FANT} opacity={0.3} stroke="#fff" strokeWidth={3} strokeDasharray="10 8" />
    <g transform="rotate(90 780 1000)">
      <Mano x={780} y={1000} fantasma t={t} />
    </g>
    <Texto x={780} y={680} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo duele una mano que no existe?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.pierde], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={FANT} />
    </>
  );
};

// B. Quien pierde un brazo sigue sintiendo la mano: la mueve, le pica, le duele + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.pierde, T.mapa], [1, 1.04])}>
      <Inicio t={t} q={0} />
      <Texto x={300} y={1260} size={36} color={FANT} op={aparece(t, T.mueve)}>
        la mueve
      </Texto>
      <g opacity={aparece(t, T.pica)}>
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M ${720 + k * 40} ${780 + 10 * Math.sin(t * 15 + k)} l 10 -20 l 10 20`} stroke={C.orange} strokeWidth={5} fill="none" />
        ))}
        <Texto x={540} y={1330} size={36} color={C.orange}>
          le pica, le duele
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          el truco del espejo: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.mapa], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// Mapa del cuerpo en el cerebro (franja de zonas)
const ZONAS = ["pie", "pierna", "tronco", "brazo", "mano", "cara", "boca"];
const Mapa: React.FC<{ readonly t: number; readonly mano: number; readonly invade?: number }> = ({ t, mano, invade = 0 }) => (
  <g>
    <path d="M 140 1000 C 140 760 940 760 940 1000" stroke="#E8A0B0" strokeWidth={110} fill="none" />
    {ZONAS.map((z, k) => {
      const a = Math.PI - (k + 0.5) * (Math.PI / ZONAS.length);
      const x = 540 + Math.cos(a) * 400;
      const y = 1000 - Math.sin(a) * 240;
      const esMano = z === "mano";
      const brillo = esMano ? mano * (0.6 + 0.4 * Math.sin(t * 6)) : z === "cara" ? invade : 0;
      return (
        <g key={z}>
          <circle cx={x} cy={y} r={46} fill={esMano ? FANT : z === "cara" ? C.orange : "#C87A90"} opacity={0.3 + 0.7 * brillo} />
          <Texto x={x} y={y + 90} size={28} color={C.white}>
            {z}
          </Texto>
        </g>
      );
    })}
  </g>
);

// C. El cerebro tiene un mapa del cuerpo; la zona de la mano sigue ahí produciendo sensaciones
export const MapaEsc: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.mapa, T.cara], [1, 1.04])}>
        <Mapa t={t} mano={aparece(t, T.zona)} />
        <Texto x={540} y={600} size={42} color={C.yellow} op={aparece(t, T.mapa)}>
          el mapa del cuerpo en tu cerebro
        </Texto>
        <Texto x={540} y={1300} size={38} color={FANT} op={aparece(t, T.falta)}>
          falta la mano… su zona sigue ahí
        </Texto>
        <Texto x={540} y={1370} size={36} color={C.white} op={aparece(t, T.sensaciones)}>
          y sigue produciendo sensaciones
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.zona} color={FANT} />
    </>
  );
};

// D. En el mapa la mano está junto a la cara: tocar la mejilla se siente en la mano fantasma
export const Vecinos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const toca = aparece(t, T.mejilla);
  return (
    <Lienzo zoom={interpolate(t, [T.cara, T.ordenes], [1, 1.04])}>
      <Mapa t={t} mano={toca} invade={aparece(t, T.cara)} />
      <path d="M 740 840 Q 700 780 640 820" stroke={C.yellow} strokeWidth={6} fill="none" strokeDasharray="12 8" opacity={toca} />
      <Texto x={540} y={600} size={38} color={C.orange} op={aparece(t, T.cara)}>
        la mano está junto a la cara
      </Texto>
      <Texto x={540} y={1300} size={38} color={C.white} op={toca}>
        tocar la mejilla…
      </Texto>
      <Texto x={540} y={1370} size={40} color={FANT} op={aparece(t, T.fantasma)}>
        …se siente en la mano fantasma
      </Texto>
    </Lienzo>
  );
};

// E. El cerebro manda órdenes a una mano que no responde: se siente como un calambre
export const Ordenes: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cal = aparece(t, T.calambre);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.ordenes, T.espejo], [1, 1.04])}>
        <g transform="translate(260 760) scale(0.8)">
          <path d="M -200 40 C -240 -80 -120 -200 0 -180 C 120 -220 250 -100 210 20 C 240 120 120 170 40 140 C -20 190 -160 170 -200 40 Z" fill="#E8A0B0" />
        </g>
        {new Array(4).fill(0).map((_, k) => {
          const u = (t * 1 + k / 4) % 1;
          return <circle key={k} cx={400 + u * 360} cy={820 + u * 200} r={12} fill={C.yellow} opacity={aparece(t, T.ordenes) * (1 - u * 0.3)} />;
        })}
        <Mano x={800} y={1100} fantasma cierre={cal} t={t} />
        <Texto x={540} y={600} size={38} color={C.yellow} op={aparece(t, T.ordenes)}>
          órdenes: «¡muévete!»
        </Texto>
        <Texto x={800} y={1320} size={38} color={C.red} op={aparece(t, T.responde)}>
          sin respuesta ✗
        </Texto>
        <Texto x={540} y={1420} size={42} color={C.orange} op={cal}>
          se siente como un calambre
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.calambre} color={C.orange} />
    </>
  );
};

// F. Ramachandran: un espejo entre los brazos; el reflejo de la mano sana parece la perdida y el dolor baja
export const Espejo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const dolor = 1 - 0.75 * interpolate(t, [T.perdida, T.dolor + 0.8], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.espejo, T.asi], [1, 1.04])}>
        <rect x={180} y={720} width={720} height={500} rx={20} fill="#2A2440" stroke="#4A4270" strokeWidth={6} />
        <line x1={540} y1={700} x2={540} y2={1240} stroke="#C8E8FF" strokeWidth={14} opacity={aparece(t, T.espejo)} />
        <Mano x={380} y={1050} t={t} s={0.9} />
        <g opacity={aparece(t, T.reflejo)}>
          <Mano x={700} y={1050} t={t} s={0.9} espejo />
        </g>
        <Texto x={380} y={1290} size={30} color={PIEL}>
          mano sana
        </Texto>
        <Texto x={700} y={1290} size={30} color={FANT} op={aparece(t, T.perdida)}>
          «la mano perdida»
        </Texto>
        <g opacity={aparece(t, T.perdida)}>
          <Texto x={540} y={1400} size={34} color={C.white}>
            dolor
          </Texto>
          <rect x={290} y={1430} width={500} height={30} rx={10} fill="#2A2440" />
          <rect x={290} y={1430} width={500 * dolor} height={30} rx={10} fill={C.red} />
        </g>
        <Texto x={540} y={620} size={40} color="#C8E8FF" op={aparece(t, T.espejo)}>
          el espejo de Ramachandran
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.espejo} color="#C8E8FF" />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
