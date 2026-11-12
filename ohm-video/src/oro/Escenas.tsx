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

// Instantes clave (s) de public/audio/oro/narracion.wav (voz x1,15), sacados con Whisper
export const T = {
  pepitas: 2.44,
  micro: 5.78,
  gramos: 7.54,
  cucharadita: 10.06,
  sacan: 13.46,
  trituran: 15.04,
  harina: 17.32,
  agua: 18.84,
  cianuro: 19.9,
  oxigeno: 21.88,
  disuelve: 22.54,
  invisible: 26.0,
  carbon: 26.88,
  poros: 29.54,
  lavan: 32.42,
  electricidad: 34.34,
  mil: 35.88,
  lingote: 37.86,
  toxico: 39.24,
  destruir: 42.48,
  rio: 45.92,
  brillo: 47.18,
  fin: 49.4,
};

const GRIS = "#6A6680";
const GRIS_OSC = "#3E3A52";
const ORO = "#F8C848";

// Roca poligonal irregular
const Roca: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly semilla: string;
  readonly fill?: string;
}> = ({ x, y, r, semilla, fill = GRIS }) => {
  const n = 9;
  const pts = new Array(n)
    .fill(0)
    .map((_, k) => {
      const a = (k / n) * Math.PI * 2;
      const rr = r * (0.75 + 0.35 * random(`${semilla}${k}`));
      return `${x + Math.cos(a) * rr},${y + Math.sin(a) * rr * 0.8}`;
    })
    .join(" ");
  return (
    <polygon
      points={pts}
      fill={fill}
      stroke={GRIS_OSC}
      strokeWidth={6}
      strokeLinejoin="round"
    />
  );
};

// Lingote trapezoidal con brillo
const Lingote: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly t: number;
  readonly op?: number;
}> = ({ x, y, s, t, op = 1 }) => {
  const brillo = (t * 0.6) % 1;
  return (
    <g opacity={op} transform={`translate(${x} ${y}) scale(${s})`}>
      <polygon points="-160,60 160,60 120,-40 -120,-40" fill="#D8A830" />
      <polygon points="-120,-40 120,-40 100,-70 -100,-70" fill="#FFE08A" />
      <polygon
        points={`${-160 + brillo * 320},60 ${-130 + brillo * 320},60 ${-90 + brillo * 260},-40 ${-110 + brillo * 260},-40`}
        fill="#FFF6D0"
        opacity={0.6}
      />
    </g>
  );
};

// A. Gancho: un anillo sale de una montaña de roca
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sube = interpolate(t, [0, 1.2], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.pepitas], [1.08, 1])}>
        {new Array(14).fill(0).map((_, k) => (
          <Roca
            key={k}
            x={200 + (k % 5) * 170 + (Math.floor(k / 5) % 2) * 80}
            y={1260 - Math.floor(k / 5) * 120}
            r={110}
            semilla={`m${k}`}
          />
        ))}
        <g transform={`translate(540 ${880 - sube * 220})`} opacity={sube}>
          <circle r={110} fill="none" stroke={ORO} strokeWidth={34} />
          <circle
            r={110}
            fill="none"
            stroke="#FFF1B0"
            strokeWidth={6}
            opacity={0.6}
          />
          <path d="M -30 -150 L 0 -190 L 30 -150 L 0 -118 Z" fill={C.cyan} />
          {[0, 1, 2, 3].map((k) => {
            const a = t * 2 + k * 1.6;
            return (
              <circle
                key={k}
                cx={Math.cos(a) * 170}
                cy={Math.sin(a) * 170}
                r={8 + 4 * Math.sin(t * 6 + k)}
                fill="#FFF1B0"
                opacity={0.7}
              />
            );
          })}
        </g>
        <Texto x={540} y={1430} color={C.grey} size={40} op={aparece(t, 1.2)}>
          toneladas de roca
        </Texto>
      </Lienzo>
      <Flash t={t} d={1.0} color={ORO} />
    </>
  );
};

// B. No hay pepitas: oro microscópico, gramos por tonelada
export const Microscopico: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lupa = aparece(t, T.micro);
  const dato = aparece(t, T.gramos);
  const cuchara = aparece(t, T.cucharadita);
  return (
    <Lienzo zoom={interpolate(t, [T.pepitas, T.sacan], [1, 1.04])}>
      <g opacity={1 - cuchara}>
        <Roca x={400} y={720} r={260} semilla="grande" />
        <Texto
          x={400}
          y={420}
          color={C.white}
          size={44}
          op={aparece(t, T.pepitas)}
        >
          sin pepitas
        </Texto>
        <g opacity={lupa}>
          <line
            x1={560}
            y1={760}
            x2={700}
            y2={860}
            stroke="#6A5A9A"
            strokeWidth={4}
          />
          <circle
            cx={800}
            cy={960}
            r={180}
            fill="#4A4660"
            stroke="#6A5A9A"
            strokeWidth={6}
          />
          {new Array(10).fill(0).map((_, k) => (
            <circle
              key={k}
              cx={800 + (random(`px${k}`) - 0.5) * 260}
              cy={960 + (random(`py${k}`) - 0.5) * 260}
              r={5 + 4 * random(`pr${k}`)}
              fill={ORO}
              opacity={0.6 + 0.4 * Math.sin(t * 5 + k)}
            />
          ))}
          <Texto x={800} y={1190} color={ORO} size={34}>
            granos invisibles
          </Texto>
        </g>
      </g>
      <Tarjeta x={140} y={1240} w={800} h={200} op={dato * (1 - cuchara)}>
        <Texto x={540} y={1340} color={ORO} size={64}>
          {`${Math.round(interpolate(t, [T.gramos, T.gramos + 1.5], [0, 5], clamp))} g`}
        </Texto>
        <Texto x={540} y={1400} color={C.grey} size={30}>
          por cada 1000 kg de roca
        </Texto>
      </Tarjeta>
      <g opacity={cuchara}>
        <path
          d="M 120 1150 Q 540 560 960 1150 Z"
          fill="#B8A890"
          opacity={0.85}
        />
        <Texto x={540} y={1240} color={C.grey} size={36}>
          1 tonelada de arena
        </Texto>
        <g transform="translate(540 560)">
          <ellipse cx={0} cy={0} rx={70} ry={40} fill="#C8C4D8" />
          <rect x={60} y={-10} width={220} height={20} rx={10} fill="#C8C4D8" />
          <ellipse cx={0} cy={-6} rx={50} ry={22} fill={C.white} />
        </g>
        <Texto x={540} y={470} color={C.white} size={36}>
          una cucharadita
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Trituran y muelen la roca hasta dejarla como harina
export const Molienda: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const giro = t * 160;
  return (
    <Lienzo zoom={interpolate(t, [T.sacan, T.agua], [1, 1.04])}>
      <Texto x={540} y={420} color={C.white} size={48} op={aparece(t, T.sacan)}>
        ¿cómo lo sacan?
      </Texto>
      {new Array(6).fill(0).map((_, k) => {
        const f = (t * 0.5 + k / 6) % 1;
        return (
          <g key={k} opacity={aparece(t, T.trituran) * (f < 0.8 ? 1 : 0)}>
            <Roca
              x={460 + (k % 3) * 80}
              y={500 + f * 300}
              r={40}
              semilla={`c${k}`}
            />
          </g>
        );
      })}
      {[-1, 1].map((s) => (
        <g
          key={s}
          transform={`translate(${540 + s * 115} 860) rotate(${giro * -s})`}
        >
          <circle r={110} fill={GRIS_OSC} stroke="#8A8A9A" strokeWidth={8} />
          {new Array(8).fill(0).map((_, k) => (
            <rect
              key={k}
              x={-14}
              y={-128}
              width={28}
              height={30}
              fill="#8A8A9A"
              transform={`rotate(${k * 45})`}
            />
          ))}
        </g>
      ))}
      {new Array(40).fill(0).map((_, k) => {
        const f = (t * 0.7 + random(`h${k}`)) % 1;
        return (
          <circle
            key={k}
            cx={540 + (random(`hx${k}`) - 0.5) * 80 * (1 + f * 2)}
            cy={1000 + f * 280}
            r={4}
            fill="#C8C4D8"
            opacity={aparece(t, T.harina) * (1 - f)}
          />
        );
      })}
      <path
        d="M 380 1360 Q 540 1220 700 1360 Z"
        fill="#C8C4D8"
        opacity={aparece(t, T.harina)}
      />
      <Texto
        x={540}
        y={1440}
        color={C.grey}
        size={36}
        op={aparece(t, T.harina)}
      >
        polvo fino como harina
      </Texto>
    </Lienzo>
  );
};

// Tanque con pulpa; el oro se disuelve
const Tanque: React.FC<{
  readonly t: number;
  readonly disuelto: number;
  readonly burbujas: number;
}> = ({ t, disuelto, burbujas }) => (
  <g>
    <path
      d="M 200 560 L 200 1300 Q 200 1360 260 1360 L 820 1360 Q 880 1360 880 1300 L 880 560"
      fill="none"
      stroke="#8A8A9A"
      strokeWidth={10}
    />
    <rect
      x={210}
      y={680}
      width={660}
      height={670}
      rx={40}
      fill="#2E5A6A"
      opacity={0.7}
    />
    {new Array(22).fill(0).map((_, k) => {
      const x = 260 + random(`gx${k}`) * 560;
      const y = 740 + random(`gy${k}`) * 560 + Math.sin(t * 2 + k) * 10;
      return (
        <g key={k}>
          <circle cx={x} cy={y} r={18} fill={GRIS} />
          <circle
            cx={x + 8 + disuelto * 30 * (random(`gd${k}`) - 0.5)}
            cy={y - 6 - disuelto * 40}
            r={6}
            fill={ORO}
            opacity={1 - disuelto}
          />
        </g>
      );
    })}
    {new Array(14).fill(0).map((_, k) => {
      const f = (t * 0.6 + random(`b${k}`)) % 1;
      return (
        <circle
          key={k}
          cx={260 + random(`bx${k}`) * 560}
          cy={1330 - f * 640}
          r={10}
          fill="none"
          stroke={C.white}
          strokeWidth={3}
          opacity={burbujas * (1 - f) * 0.8}
        />
      );
    })}
    <rect
      x={210}
      y={680}
      width={660}
      height={670}
      rx={40}
      fill={ORO}
      opacity={disuelto * 0.12}
    />
  </g>
);

// D. Agua + cianuro + oxígeno disuelven el oro
export const Cianuro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const disuelto = interpolate(
    t,
    [T.disuelve, T.invisible + 0.5],
    [0, 1],
    suave,
  );
  return (
    <Lienzo zoom={interpolate(t, [T.agua, T.carbon], [1, 1.04])}>
      <g opacity={aparece(t, T.agua)}>
        <Tanque t={t} disuelto={disuelto} burbujas={aparece(t, T.oxigeno)} />
      </g>
      <Texto x={340} y={480} color={C.cyan} size={40} op={aparece(t, T.agua)}>
        agua
      </Texto>
      <Texto
        x={540}
        y={480}
        color={C.white}
        size={40}
        op={aparece(t, T.cianuro)}
      >
        + cianuro
      </Texto>
      <Texto
        x={780}
        y={480}
        color={C.white}
        size={40}
        op={aparece(t, T.oxigeno)}
      >
        + O2
      </Texto>
      <Texto x={540} y={1450} color={ORO} size={40} op={aparece(t, T.disuelve)}>
        el oro se disuelve
      </Texto>
    </Lienzo>
  );
};

// E. Carbón activado, electricidad, fundición, lingote
export const Carbon: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const carga = interpolate(t, [T.poros, T.lavan], [0, 1], clamp);
  const pasos = aparece(t, T.lavan);
  const ling = aparece(t, T.lingote);
  return (
    <Lienzo zoom={interpolate(t, [T.carbon, T.toxico], [1, 1.04])}>
      <g opacity={1 - pasos}>
        <Texto
          x={540}
          y={440}
          color={C.white}
          size={44}
          op={aparece(t, T.carbon)}
        >
          carbón activado
        </Texto>
        {new Array(9).fill(0).map((_, k) => {
          const cx = 300 + (k % 3) * 240;
          const cy = 640 + Math.floor(k / 3) * 240;
          return (
            <g key={k} opacity={aparece(t, T.carbon)}>
              <circle
                cx={cx}
                cy={cy}
                r={95}
                fill="#1E1C26"
                stroke="#4A4660"
                strokeWidth={6}
              />
              {new Array(6).fill(0).map((__, j) => (
                <circle
                  key={j}
                  cx={cx + Math.cos(j + k) * 50}
                  cy={cy + Math.sin(j * 2 + k) * 50}
                  r={9}
                  fill={ORO}
                  opacity={carga > j / 6 ? 1 : 0}
                />
              ))}
            </g>
          );
        })}
        <Texto x={540} y={1400} color={ORO} size={40} op={aparece(t, T.poros)}>
          sus poros atrapan el oro
        </Texto>
      </g>
      <g opacity={pasos * (1 - ling * 0.6)}>
        {(
          [
            ["1. lavar el carbón", T.lavan, C.white],
            ["2. electricidad", T.electricidad, C.cyan],
            ["3. fundir a 1064 °C", T.mil, C.orange],
          ] as const
        ).map(([txt, d, col], k) => (
          <Texto
            key={txt}
            x={540}
            y={560 + k * 120}
            color={col}
            size={50}
            op={0.25 + 0.75 * aparece(t, d)}
          >
            {txt}
          </Texto>
        ))}
      </g>
      <Lingote x={540} y={1120} s={1.6} t={t} op={ling} />
    </Lienzo>
  );
};

// F. El cianuro es muy tóxico
export const Toxico: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rojo = interpolate(t, [T.rio, T.rio + 1], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.toxico, T.brillo], [1, 1.04])}>
      <g opacity={aparece(t, T.toxico)} transform="translate(540 640)">
        <polygon
          points="0,-200 190,140 -190,140"
          fill="none"
          stroke={C.red}
          strokeWidth={20}
          strokeLinejoin="round"
        />
        <Texto x={0} y={90} color={C.red} size={170}>
          !
        </Texto>
      </g>
      <Texto
        x={540}
        y={920}
        color={C.white}
        size={44}
        op={aparece(t, T.destruir)}
      >
        hay que destruirlo
      </Texto>
      <g opacity={aparece(t, T.rio)}>
        {[0, 1, 2].map((k) => (
          <path
            key={k}
            d={`M 60 ${1150 + k * 70} ${new Array(8)
              .fill(0)
              .map(
                (_, j) =>
                  `Q ${60 + j * 125 + 62} ${1150 + k * 70 + (j % 2 ? 30 : -30) + Math.sin(t * 3 + k) * 8} ${60 + (j + 1) * 125} ${1150 + k * 70}`,
              )
              .join(" ")}`}
            fill="none"
            stroke={rojo > 0.5 ? "#8A3A4A" : "#3A8AC8"}
            strokeWidth={14}
            strokeLinecap="round"
            opacity={0.9}
          />
        ))}
        <Texto x={540} y={1420} color={C.red} size={40} op={rojo}>
          un río envenenado
        </Texto>
      </g>
    </Lienzo>
  );
};

// G. Cierre: de roca gris a lingote
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const f = interpolate(t, [T.brillo + 0.3, T.fin], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.brillo, T.fin + 0.5], [1, 1.05])}>
      <g opacity={1 - f}>
        <Roca x={540} y={880} r={240} semilla="final" />
      </g>
      <Lingote x={540} y={900} s={1.8} t={t} op={f} />
      <Texto x={540} y={1200} color={C.grey} size={44} op={1 - f}>
        roca gris
      </Texto>
      <Texto x={540} y={1200} color={ORO} size={54} op={f}>
        brillo de oro
      </Texto>
    </Lienzo>
  );
};
