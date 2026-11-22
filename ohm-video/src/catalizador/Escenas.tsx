import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/catalizador/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  va: 2.0,
  humo: 4.04,
  final: 5.08,
  el: 7.3,
  monoxido: 9.36,
  restos: 10.72,
  oxidos: 12.38,
  convertidor: 13.72,
  panal: 15.32,
  canalitos: 16.44,
  metales: 18.16,
  platino: 19.38,
  al: 21.52,
  tocan: 22.56,
  aceleran: 23.88,
  asi: 25.92,
  co2: 27.02,
  aire: 29.58,
  y: 30.48,
  oro: 32.54,
  gramo: 33.1,
  porEso: 35.88,
  fin: 37.42,
};

const METAL = "#8A86A8";
const HUMO = "#4A4A50";
const PLATINO = "#E8E6F0";
const ORO = "#E8C048";

// Auto de perfil con el convertidor marcado
const Auto: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly marca: number }> = ({ x, y, s, marca }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -380 0 L -340 -100 L -180 -120 L -100 -200 L 160 -200 L 260 -110 L 380 -90 L 400 0 Z" fill="#4A5A8A" />
    <rect x={-80} y={-185} width={110} height={70} rx={8} fill="#2A2640" />
    <rect x={50} y={-185} width={110} height={70} rx={8} fill="#2A2640" />
    <circle cx={-230} cy={10} r={60} fill="#1A1620" />
    <circle cx={250} cy={10} r={60} fill="#1A1620" />
    <rect x={-150} y={40} width={300} height={16} fill={METAL} />
    <rect x={-60} y={24} width={140} height={48} rx={20} fill={C.orange} opacity={0.5 + 0.5 * marca} />
    <circle cx={10} cy={48} r={90} fill={C.orange} opacity={0.15 * marca} />
  </g>
);

// A. Gancho: ¿por qué roban esta pieza de tu auto?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const m = interpolate(t, [0.5, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.va], [1.12, 1])}>
        <Auto x={540} y={860} s={1.2} marca={m} />
        <path d="M 552 1000 L 552 1130" stroke={C.orange} strokeWidth={6} strokeDasharray="12 10" opacity={m} />
        <Texto x={552} y={1300} size={110} color={C.yellow} op={interpolate(t, [0.8, 1.1], [0, 1], clamp)}>
          ?
        </Texto>
      </Lienzo>
      <Flash t={t} d={0.72} color={C.orange} />
    </>
  );
};

// Convertidor de perfil con humo entrando y saliendo
const Convertidor: React.FC<{ readonly t: number; readonly limpio: number }> = ({ t, limpio }) => (
  <g>
    <rect x={60} y={780} width={260} height={60} fill={METAL} />
    <rect x={760} y={780} width={260} height={60} fill={METAL} />
    <rect x={300} y={700} width={480} height={220} rx={80} fill={C.orange} />
    {new Array(12).fill(0).map((_, k) => {
      const u = (t * 0.4 + k / 12) % 1;
      const x = 60 + u * 1000;
      const sucio = x < 540;
      return <circle key={k} cx={x} cy={810 + Math.sin(k * 2.3 + t) * 20} r={18 + u * 10} fill={sucio || limpio < 0.5 ? HUMO : "#C8E0F0"} opacity={x > 300 && x < 780 ? 0 : 0.8} />;
    })}
  </g>
);

// B. Va escondida bajo el carro y limpia el humo del motor + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.va, T.el], [1, 1.05])}>
      <Convertidor t={t} limpio={aparece(t, T.humo)} />
      <Texto x={540} y={640} size={40} color={C.orange} op={aparece(t, T.va + 0.4)}>
        convertidor catalítico
      </Texto>
      <Texto x={180} y={920} size={30} color={C.grey} op={aparece(t, T.humo)}>
        humo
      </Texto>
      <Texto x={900} y={920} size={30} color="#C8E0F0" op={aparece(t, T.humo)}>
        más limpio
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.el], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={38}>
          qué buscan los ladrones: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Molécula con etiqueta
const Mol: React.FC<{ readonly x: number; readonly y: number; readonly tipo: string; readonly color: string; readonly s?: number; readonly op?: number }> = ({
  x,
  y,
  tipo,
  color,
  s = 1,
  op = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <circle cx={-22} cy={0} r={30} fill={color} />
    <circle cx={22} cy={0} r={26} fill={color} opacity={0.8} />
    <Texto x={0} y={80} size={34} color={color}>
      {tipo}
    </Texto>
  </g>
);

// C. Gases peligrosos: monóxido de carbono, gasolina sin quemar y óxidos de nitrógeno
export const Gases: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.el, T.convertidor], [1, 1.04])}>
      <Texto x={540} y={560} size={40} color={C.red} op={aparece(t, T.el + 0.4)}>
        gases peligrosos
      </Texto>
      <Mol x={220} y={820} tipo="CO" color={C.red} s={1.4} op={aparece(t, T.monoxido)} />
      <Mol x={540} y={820} tipo="HC" color={C.orange} s={1.4} op={aparece(t, T.restos)} />
      <Mol x={860} y={820} tipo="NOx" color={C.yellow} s={1.4} op={aparece(t, T.oxidos)} />
      <Texto x={220} y={1060} size={26} color={C.grey} op={aparece(t, T.monoxido)}>
        monóxido
      </Texto>
      <Texto x={540} y={1060} size={26} color={C.grey} op={aparece(t, T.restos)}>
        gasolina sin quemar
      </Texto>
      <Texto x={860} y={1060} size={26} color={C.grey} op={aparece(t, T.oxidos)}>
        óxidos de nitrógeno
      </Texto>
    </Lienzo>
  );
};

// D. Un panal de cerámica con miles de canalitos cubiertos de platino, paladio y rodio
export const Panal: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const metal = aparece(t, T.metales);
  return (
    <Lienzo zoom={interpolate(t, [T.convertidor, T.al], [1, 1.04])}>
      <circle cx={540} cy={820} r={330} fill="#C8B898" opacity={aparece(t, T.panal - 0.4)} />
      {new Array(13).fill(0).map((_, i) =>
        new Array(13).fill(0).map((__, j) => {
          const x = 540 + (i - 6) * 48;
          const y = 820 + (j - 6) * 48;
          if ((x - 540) ** 2 + (y - 820) ** 2 > 300 ** 2) return null;
          return (
            <g key={`${i}${j}`} opacity={aparece(t, T.canalitos)}>
              <rect x={x - 18} y={y - 18} width={36} height={36} fill="#2A2640" stroke={metal > 0.5 ? PLATINO : "#C8B898"} strokeWidth={metal > 0.5 ? 5 : 2} />
            </g>
          );
        }),
      )}
      <Texto x={540} y={1240} size={38} color={C.white} op={aparece(t, T.panal)}>
        panal de cerámica
      </Texto>
      <g opacity={aparece(t, T.platino)}>
        <Texto x={240} y={1330} size={34} color={PLATINO}>
          platino
        </Texto>
        <Texto x={540} y={1330} size={34} color="#C8D0E0" op={aparece(t, T.platino + 0.8)}>
          paladio
        </Texto>
        <Texto x={840} y={1330} size={34} color="#E8D8F0" op={aparece(t, T.platino + 1.4)}>
          rodio
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. Los gases tocan esos metales, que aceleran reacciones químicas sin gastarse
export const Reaccion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const u = ((t - T.al) * 0.5) % 1;
  return (
    <Lienzo zoom={interpolate(t, [T.al, T.asi], [1, 1.04])}>
      <rect x={100} y={980} width={880} height={60} fill="#C8B898" />
      <rect x={100} y={960} width={880} height={20} fill={PLATINO} />
      {[0, 1, 2].map((k) => {
        const uu = (u + k / 3) % 1;
        const x = 160 + uu * 760;
        const toca = uu > 0.45;
        return (
          <g key={k}>
            <Mol x={x} y={toca ? 900 - (uu - 0.45) * 500 : 700 + uu * 400} tipo="" color={toca ? "#C8E0F0" : C.red} />
            {toca && uu < 0.55 ? <circle cx={x} cy={930} r={50} fill={C.yellow} opacity={0.4} /> : null}
          </g>
        );
      })}
      <Texto x={540} y={1180} size={38} color={C.white} op={aparece(t, T.aceleran)}>
        aceleran la reacción
      </Texto>
      <Texto x={540} y={1250} size={34} color={PLATINO} op={aparece(t, T.aceleran + 1)}>
        y el metal no se gasta
      </Texto>
    </Lienzo>
  );
};

// F. Así salen dióxido de carbono, agua y nitrógeno, como el del aire
export const Salida: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = interpolate(t, [T.asi + 0.3, T.co2 + 0.6], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.asi, T.y], [1, 1.04])}>
        {[
          ["CO", "CO₂", C.red],
          ["HC", "H₂O", C.orange],
          ["NOx", "N₂", C.yellow],
        ].map(([a, b, col], k) => (
          <g key={a}>
            <Mol x={240} y={600 + k * 240} tipo={a} color={col} />
            <path d={`M 360 ${600 + k * 240} L 700 ${600 + k * 240}`} stroke={C.white} strokeWidth={6} opacity={sale} />
            <path d={`M 700 ${580 + k * 240} L 730 ${600 + k * 240} L 700 ${620 + k * 240} Z`} fill={C.white} opacity={sale} />
            <Mol x={860} y={600 + k * 240} tipo={b} color="#C8E0F0" op={sale} />
          </g>
        ))}
        <Texto x={540} y={1360} size={36} color="#C8E0F0" op={aparece(t, T.aire)}>
          nitrógeno, como el del aire
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.co2 + 0.6} color="#C8E0F0" />
    </>
  );
};

// G. Algunos de esos metales valen más que el oro: un gramo de rodio, cientos de dólares
export const Oro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const crece = interpolate(t, [T.oro - 0.6, T.gramo + 0.6], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.y, T.porEso], [1, 1.04])}>
      <Texto x={540} y={540} size={34} color={C.grey}>
        precio por gramo (aprox.)
      </Texto>
      <rect x={260} y={1100 - 220} width={180} height={220} rx={12} fill={ORO} />
      <Texto x={350} y={1160} size={34} color={ORO}>
        oro
      </Texto>
      <rect x={640} y={1100 - 480 * crece} width={180} height={480 * crece} rx={12} fill="#E8D8F0" />
      <Texto x={730} y={1160} size={34} color="#E8D8F0">
        rodio
      </Texto>
      <Tarjeta x={190} y={1230} w={700} h={130} op={aparece(t, T.gramo)}>
        <Texto x={540} y={1310} size={40} color={C.yellow}>
          cientos de dólares el gramo
        </Texto>
      </Tarjeta>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Auto x={540} y={860} s={1.2} marca={q} />
      <path d="M 552 1000 L 552 1130" stroke={C.orange} strokeWidth={6} strokeDasharray="12 10" opacity={q} />
      <Texto x={552} y={1300} size={110} color={C.yellow} op={q}>
        ?
      </Texto>
    </Lienzo>
  );
};
