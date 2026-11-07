import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/oidos/narracion.wav (voz x1,07), sacados con Whisper
export const T = {
  detras: 1.92,
  medio: 4.88,
  vibre: 6.76,
  iguales: 8.7,
  sube: 10.3,
  baja: 12.44,
  expande: 14.6,
  aterrizar: 17.18,
  dentro: 20.76,
  doler: 22.58,
  alberca: 23.94,
  metros: 26.42,
  veinte: 28.72,
  estirado: 29.92,
  apagado: 32.28,
  duele: 34.94,
  solucion: 35.66,
  tubo: 36.62,
  eustaquio: 39.56,
  cerrada: 41.78,
  bostezar: 42.66,
  abren: 44.74,
  igualan: 47.68,
  pop: 48.54,
  equilibrio: 49.44,
  fin: 52.2,
};

const PIEL = "#8C88A8";

// Corte esquemático del oído: conducto, tímpano, oído medio y trompa de Eustaquio.
// bulto: +1 tímpano hacia fuera, -1 hacia dentro. fuera/dentro: densidad de aire (1 = normal).
export const Oido: React.FC<{
  readonly t: number;
  readonly bulto: number;
  readonly fuera: number;
  readonly dentro: number;
  readonly trompa?: number;
  readonly resaltaTrompa?: number;
  readonly flujo?: number;
  readonly dolor?: number;
}> = ({
  t,
  bulto,
  fuera,
  dentro,
  trompa = 0,
  resaltaTrompa = 0,
  flujo = 0,
  dolor = 0,
}) => {
  const nF = Math.round(16 * fuera);
  const nD = Math.round(12 * dentro);
  const anchoTrompa = 8 + 40 * trompa;
  return (
    <g>
      {/* conducto auditivo */}
      <path
        d="M 40 700 L 470 740 L 470 900 L 40 940"
        fill="#1A1636"
        stroke={PIEL}
        strokeWidth={8}
      />
      {new Array(nF).fill(0).map((_, k) => (
        <circle
          key={k}
          cx={
            70 +
            ((((random(`fx${k}`) * 380 + t * 40 * (random(`fv${k}`) - 0.5)) %
              380) +
              380) %
              380)
          }
          cy={760 + random(`fy${k}`) * 120 + 8 * Math.sin(t * 3 + k)}
          r={9}
          fill={C.cyan}
          opacity={0.8}
        />
      ))}
      {/* oído medio */}
      <rect
        x={490}
        y={660}
        width={330}
        height={320}
        rx={70}
        fill="#241E44"
        stroke={PIEL}
        strokeWidth={8}
      />
      {/* huesecillos */}
      <path
        d="M 520 820 L 600 770 L 660 800 L 720 760"
        stroke="#C8C4D8"
        strokeWidth={14}
        strokeLinecap="round"
        fill="none"
        opacity={0.6}
      />
      {new Array(nD).fill(0).map((_, k) => (
        <circle
          key={k}
          cx={530 + random(`dx${k}`) * 260 + 6 * Math.sin(t * 2 + k)}
          cy={700 + random(`dy${k}`) * 240 + 6 * Math.cos(t * 3 + k)}
          r={9}
          fill={C.yellow}
          opacity={0.8}
        />
      ))}
      {/* trompa de Eustaquio */}
      <path
        d="M 720 975 Q 760 1150 900 1360"
        stroke={resaltaTrompa > 0 ? C.cyan : PIEL}
        strokeWidth={anchoTrompa + 16}
        fill="none"
        strokeLinecap="round"
        opacity={0.5 + 0.5 * resaltaTrompa}
      />
      <path
        d="M 720 975 Q 760 1150 900 1360"
        stroke="#241E44"
        strokeWidth={anchoTrompa}
        fill="none"
        strokeLinecap="round"
      />
      {flujo > 0
        ? new Array(6).fill(0).map((_, k) => {
            const f = (t * 0.8 + k / 6) % 1;
            const u = 1 - f;
            const x = (1 - u) ** 2 * 720 + 2 * (1 - u) * u * 760 + u * u * 900;
            const y =
              (1 - u) ** 2 * 975 + 2 * (1 - u) * u * 1150 + u * u * 1360;
            return (
              <circle
                key={k}
                cx={x}
                cy={y}
                r={9}
                fill={C.cyan}
                opacity={flujo}
              />
            );
          })
        : null}
      {/* tímpano */}
      <path
        d={`M 480 720 Q ${480 - bulto * 110} 820 480 920`}
        stroke={dolor > 0 ? C.red : C.white}
        strokeWidth={12}
        fill="none"
        strokeLinecap="round"
      />
      <circle
        cx={480 - bulto * 55}
        cy={820}
        r={50 + 20 * dolor}
        fill={C.red}
        opacity={dolor * 0.35}
      />
    </g>
  );
};

const Rotulos: React.FC<{ readonly op: number; readonly trompa?: number }> = ({
  op,
  trompa = 0,
}) => (
  <g opacity={op}>
    <Texto x={430} y={640} color={C.white} size={32}>
      tímpano
    </Texto>
    <line
      x1={460}
      y1={655}
      x2={478}
      y2={715}
      stroke={C.white}
      strokeWidth={3}
    />
    <Texto x={660} y={1030} color={C.yellow} size={32} op={1 - trompa}>
      oído medio
    </Texto>
    <Texto x={230} y={1010} color={C.cyan} size={32}>
      aire de fuera
    </Texto>
  </g>
);

// A. Gancho: el tímpano se dobla
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const b = Math.sin(t * 5) * 0.9;
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.detras], [1.25, 1.1])} cy={820}>
        <Oido
          t={t}
          bulto={b}
          fuera={1 + 0.4 * b}
          dentro={1}
          dolor={Math.abs(b)}
        />
      </Lienzo>
      <Flash t={t} d={1.0} color={C.red} />
    </>
  );
};

// B. Oído medio: misma presión a los dos lados
export const Camara: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const vib = aparece(t, T.vibre) * Math.sin(t * 30) * 0.12;
  return (
    <Lienzo zoom={interpolate(t, [T.detras, T.sube], [1.05, 1.1])} cy={860}>
      <Oido t={t} bulto={vib} fuera={1} dentro={1} />
      <Rotulos op={aparece(t, T.medio)} />
      <g opacity={aparece(t, T.vibre)}>
        {[0, 1, 2].map((k) => (
          <path
            key={k}
            d={`M ${200 + k * 70 - ((t * 120) % 70)} 770 q 30 50 0 100`}
            stroke={C.white}
            strokeWidth={5}
            fill="none"
            opacity={0.5}
          />
        ))}
      </g>
      <Texto
        x={420}
        y={1250}
        color={C.cyan}
        size={56}
        op={aparece(t, T.iguales)}
      >
        P fuera = P dentro
      </Texto>
    </Lienzo>
  );
};

// Avioncito
const Avion: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly rot: number;
}> = ({ x, y, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path
      d="M -90 0 Q -70 -18 60 -12 Q 100 -6 100 0 Q 100 6 60 12 Q -70 18 -90 0 Z"
      fill="#C8C4D8"
    />
    <path d="M -10 -6 L -40 -60 L -20 -60 L 30 -6 Z" fill="#8C88A8" />
    <path d="M -10 6 L -40 50 L -20 50 L 30 6 Z" fill="#8C88A8" />
    <path d="M -80 -4 L -100 -40 L -86 -40 L -66 -6 Z" fill="#8C88A8" />
  </g>
);

// C. El avión sube (tímpano fuera) y baja (tímpano dentro)
export const Vuelo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const subir = interpolate(t, [T.baja, T.expande + 0.6], [0, 1], suave);
  const bajar = interpolate(t, [T.aterrizar, T.dentro + 0.6], [0, 1], suave);
  const bulto = subir - 2 * bajar;
  const fuera = 1 - 0.45 * subir + 0.9 * bajar;
  const alt = subir - bajar;
  return (
    <Lienzo zoom={1}>
      <Avion
        x={interpolate(t, [T.sube, T.alberca], [180, 900], clamp)}
        y={420 - 180 * alt}
        rot={bajar > 0 && bajar < 1 ? 12 : subir < 1 ? -14 : 0}
      />
      <Texto
        x={540}
        y={560}
        color={C.white}
        size={38}
        op={aparece(t, T.baja) * (1 - aparece(t, T.aterrizar))}
      >
        cabina: menos presión
      </Texto>
      <Texto
        x={540}
        y={560}
        color={C.white}
        size={38}
        op={aparece(t, T.aterrizar + 0.4)}
      >
        aterrizaje: más presión
      </Texto>
      <g transform="translate(0 120)">
        <Oido
          t={t}
          bulto={bulto}
          fuera={fuera}
          dentro={1}
          dolor={aparece(t, T.doler) * bajar}
        />
      </g>
      <Texto
        x={360}
        y={1300}
        color={C.yellow}
        size={44}
        op={aparece(t, T.expande) * (1 - aparece(t, T.aterrizar))}
      >
        tímpano hacia fuera
      </Texto>
      <Texto
        x={360}
        y={1300}
        color={C.orange}
        size={44}
        op={aparece(t, T.dentro)}
      >
        tímpano hacia dentro
      </Texto>
    </Lienzo>
  );
};

// D. Alberca: 2 m de agua, +20 % de presión
export const Alberca: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const prof = interpolate(t, [T.metros, T.veinte], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.alberca, T.estirado], [1, 1.04])}>
      <rect
        x={140}
        y={560}
        width={800}
        height={720}
        rx={30}
        fill="#1E5A8A"
        opacity={0.6 * aparece(t, T.alberca)}
      />
      <path
        d={`M 140 560 ${new Array(8)
          .fill(0)
          .map((_, j) => `q 50 ${j % 2 ? 16 : -16} 100 0`)
          .join(" ")}`}
        stroke="#7AC8F0"
        strokeWidth={8}
        fill="none"
        opacity={aparece(t, T.alberca)}
      />
      <g opacity={aparece(t, T.alberca + 0.3)}>
        <line
          x1={230}
          y1={560}
          x2={230}
          y2={1160}
          stroke={C.white}
          strokeWidth={4}
        />
        {[0, 1, 2].map((m) => (
          <g key={m}>
            <line
              x1={210}
              y1={560 + m * 300}
              x2={250}
              y2={560 + m * 300}
              stroke={C.white}
              strokeWidth={4}
            />
            <Texto
              x={290}
              y={572 + m * 300}
              color={C.white}
              size={30}
              anchor="start"
            >
              {`${m} m`}
            </Texto>
          </g>
        ))}
        <g transform={`translate(620 ${600 + prof * 560})`}>
          <circle r={60} fill="#C8C4D8" />
          <rect
            x={-56}
            y={-20}
            width={112}
            height={34}
            rx={14}
            fill="#1A1636"
            opacity={0.8}
          />
          {[0, 1, 2].map((k) => (
            <circle
              key={k}
              cx={30 + 10 * k}
              cy={-90 - ((t * 120 + k * 50) % 200)}
              r={8}
              fill="none"
              stroke={C.white}
              strokeWidth={3}
            />
          ))}
        </g>
      </g>
      <Tarjeta x={290} y={1320} w={500} h={150} op={aparece(t, T.veinte)}>
        <Texto x={540} y={1420} color={C.yellow} size={70}>
          {`+${Math.round(interpolate(t, [T.veinte, T.veinte + 1], [0, 20], clamp))} %`}
        </Texto>
      </Tarjeta>
    </Lienzo>
  );
};

// E. Tímpano estirado: oyes apagado y duele
export const Estirado: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const dolor = aparece(t, T.duele) * (0.6 + 0.4 * Math.sin(t * 8));
  return (
    <Lienzo
      zoom={interpolate(t, [T.estirado, T.solucion], [1.05, 1.12])}
      cy={840}
    >
      <Oido t={t} bulto={-1} fuera={1.8} dentro={1} dolor={dolor} />
      {[0, 1, 2].map((k) => (
        <path
          key={k}
          d={`M ${200 + k * 70 - ((t * 120) % 70)} 770 q 30 50 0 100`}
          stroke={C.white}
          strokeWidth={5}
          fill="none"
          opacity={0.15}
        />
      ))}
      <Texto
        x={540}
        y={1180}
        color={C.grey}
        size={48}
        op={aparece(t, T.apagado)}
      >
        oyes apagado
      </Texto>
      <Texto x={540} y={1280} color={C.red} size={60} op={aparece(t, T.duele)}>
        duele
      </Texto>
    </Lienzo>
  );
};

// F. La trompa de Eustaquio se abre al bostezar: ¡pop!
export const Trompa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const abre = interpolate(
    t,
    [T.abren, T.abren + 0.4, T.pop, T.pop + 0.4],
    [0, 1, 1, 0],
    clamp,
  );
  const iguala = interpolate(t, [T.abren, T.igualan + 0.3], [0, 1], suave);
  return (
    <>
      <Lienzo
        zoom={interpolate(t, [T.solucion, T.equilibrio], [1, 1.04])}
        cy={900}
      >
        <Oido
          t={t}
          bulto={-1 + iguala}
          fuera={1.8 - 0.8 * iguala}
          dentro={1 + 0.8 * iguala}
          trompa={abre}
          resaltaTrompa={aparece(t, T.tubo)}
          flujo={abre}
        />
        <Rotulos op={0.6} trompa={1} />
        <Texto
          x={720}
          y={1430}
          color={C.cyan}
          size={36}
          op={aparece(t, T.eustaquio)}
        >
          trompa de Eustaquio
        </Texto>
        <Texto
          x={720}
          y={1480}
          color={C.grey}
          size={30}
          op={aparece(t, T.cerrada) * (1 - aparece(t, T.abren))}
        >
          (cerrada)
        </Texto>
        <Texto
          x={300}
          y={1250}
          color={C.yellow}
          size={44}
          op={aparece(t, T.bostezar)}
        >
          bostezar / tragar
        </Texto>
        <g
          opacity={aparece(t, T.pop)}
          transform={`translate(330 560) scale(${interpolate(t, [T.pop, T.pop + 0.25], [1.5, 1], clamp)})`}
        >
          <Texto x={0} y={0} color={C.yellow} size={110}>
            ¡pop!
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.pop} color={C.yellow} />
    </>
  );
};

// G. Cierre: equilibrio
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo
      zoom={interpolate(t, [T.equilibrio, T.fin + 0.5], [1.05, 1.12])}
      cy={860}
    >
      <Oido t={t} bulto={Math.sin(t * 30) * 0.08} fuera={1} dentro={1} />
      <Texto
        x={540}
        y={1250}
        color={C.yellow}
        size={60}
        op={aparece(t, T.equilibrio)}
      >
        equilibrio
      </Texto>
    </Lienzo>
  );
};
