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

// Instantes clave (s) de public/audio/dedos/narracion.wav (voz x1,12), sacados con Whisper
export const T = {
  nudillo: 1.82,
  capsula: 4.1,
  sinovial: 5.2,
  refresco: 8.24,
  estiras: 9.92,
  presion: 14.08,
  cavidad: 16.42,
  cavitacion: 18.1,
  quince: 20.1,
  resonancia: 23.82,
  coincidio: 25.32,
  colapso: 27.84,
  debate: 31.4,
  enseguida: 32.62,
  veinte: 35.3,
  artritis: 41.64,
  medico: 42.88,
  ninguna: 46.2,
  fisica: 48.84,
  fin: 51.2,
};

const HUESO = "#E8DCC8";

// Articulación: dos huesos, cápsula y líquido; sep separa los huesos, burbuja 0..1
const Articulacion: React.FC<{
  readonly t: number;
  readonly sep: number;
  readonly burbuja: number;
  readonly gas?: number;
  readonly rotulos?: number;
}> = ({ t, sep, burbuja, gas = 1, rotulos = 0 }) => {
  const g = 30 + sep * 150;
  return (
    <g>
      <rect
        x={100}
        y={790}
        width={440 - g / 2}
        height={180}
        rx={90}
        fill={HUESO}
      />
      <rect
        x={540 + g / 2}
        y={790}
        width={440 - g / 2}
        height={180}
        rx={90}
        fill={HUESO}
      />
      <ellipse
        cx={540}
        cy={880}
        rx={150 + sep * 30}
        ry={150}
        fill="#7AA8D8"
        opacity={0.35}
      />
      <ellipse
        cx={540}
        cy={880}
        rx={150 + sep * 30}
        ry={150}
        fill="none"
        stroke="#C88AA8"
        strokeWidth={10}
      />
      {new Array(14).fill(0).map((_, k) => (
        <circle
          key={k}
          cx={540 + (random(`gx${k}`) - 0.5) * 220 + 4 * Math.sin(t * 2 + k)}
          cy={880 + (random(`gy${k}`) - 0.5) * 220}
          r={5}
          fill={C.white}
          opacity={0.7 * gas}
        />
      ))}
      <circle
        cx={540}
        cy={880}
        r={burbuja * 70}
        fill="#E8F4FF"
        opacity={0.85}
        stroke={C.white}
        strokeWidth={4}
      />
      <g opacity={rotulos}>
        <Texto x={540} y={680} color="#C88AA8" size={34}>
          cápsula
        </Texto>
        <Texto x={540} y={1100} color="#7AA8D8" size={34}>
          líquido sinovial
        </Texto>
        <Texto x={250} y={760} color={HUESO} size={30}>
          hueso
        </Texto>
        <Texto x={830} y={760} color={HUESO} size={30}>
          hueso
        </Texto>
      </g>
    </g>
  );
};

// A. Gancho: el crac es una burbuja
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const b = interpolate(t, [0.85, 1.0], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.nudillo], [1.15, 1.05])} cy={880}>
        <Articulacion t={t} sep={b} burbuja={b} gas={1 - b * 0.6} />
        <Texto x={540} y={600} color={C.yellow} size={110} op={aparece(t, 1.0)}>
          ¡CRAC!
        </Texto>
      </Lienzo>
      <Flash t={t} d={1.0} />
    </>
  );
};

// B. Articulación con líquido y gas disuelto, como un refresco
export const Nudillo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.nudillo, T.estiras], [1, 1.03])}>
      <Articulacion t={t} sep={0} burbuja={0} rotulos={aparece(t, T.capsula)} />
      <g opacity={aparece(t, T.refresco)} transform="translate(540 1300)">
        <rect
          x={-60}
          y={-60}
          width={120}
          height={200}
          rx={30}
          fill="#5A2E1A"
          opacity={0.85}
        />
        <rect x={-30} y={-100} width={60} height={50} rx={10} fill={C.red} />
        {new Array(6).fill(0).map((_, k) => (
          <circle
            key={k}
            cx={(random(`rf${k}`) - 0.5) * 80}
            cy={100 - ((t * 60 + k * 30) % 150)}
            r={6}
            fill={C.white}
            opacity={0.7}
          />
        ))}
      </g>
      <Texto
        x={540}
        y={1490}
        color={C.white}
        size={36}
        op={aparece(t, T.refresco)}
      >
        gas disuelto, como un refresco
      </Texto>
    </Lienzo>
  );
};

// C. Al estirar cae la presión: cavitación
export const Cavitacion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sep = interpolate(t, [T.estiras, T.presion + 0.6], [0, 1], suave);
  const b = interpolate(t, [T.cavidad, T.cavidad + 0.15], [0, 1], clamp);
  const pres = interpolate(t, [T.presion, T.cavidad], [1, 0.15], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.estiras, T.quince], [1, 1.04])}>
        <Articulacion t={t} sep={sep} burbuja={b} gas={1 - b * 0.6} />
        <g opacity={aparece(t, T.presion)}>
          <rect
            x={890}
            y={420}
            width={60}
            height={260}
            rx={20}
            fill="#1A1636"
            stroke={C.grey}
            strokeWidth={6}
          />
          <rect
            x={900}
            y={430 + 240 * (1 - pres)}
            width={40}
            height={240 * pres}
            rx={14}
            fill={C.cyan}
          />
          <Texto x={920} y={720} color={C.cyan} size={28}>
            presión
          </Texto>
        </g>
        <Texto
          x={540}
          y={600}
          color={C.yellow}
          size={90}
          op={aparece(t, T.cavidad)}
        >
          ¡crac!
        </Texto>
        <Texto
          x={540}
          y={1200}
          color={C.white}
          size={48}
          op={aparece(t, T.cavitacion)}
        >
          cavitación
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.cavidad} />
    </>
  );
};

// D. 2015: resonancia magnética; el debate sigue
export const Resonancia: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const colapso = interpolate(
    t,
    [T.colapso, T.colapso + 0.6],
    [1, 0.55],
    clamp,
  );
  return (
    <Lienzo zoom={interpolate(t, [T.quince, T.enseguida], [1, 1.03])}>
      <Tarjeta x={340} y={420} w={400} h={140} op={aparece(t, T.quince)}>
        <Texto x={540} y={512} color={C.yellow} size={66}>
          2015
        </Texto>
      </Tarjeta>
      <g opacity={aparece(t, T.quince + 0.8)}>
        <circle
          cx={540}
          cy={880}
          r={260}
          fill="none"
          stroke="#C8C4D8"
          strokeWidth={70}
        />
        <circle
          cx={540}
          cy={880}
          r={260}
          fill="none"
          stroke={C.grey}
          strokeWidth={4}
        />
        <rect x={360} y={840} width={360} height={80} rx={40} fill="#E8B8A0" />
        <circle
          cx={540}
          cy={880}
          r={34 * aparece(t, T.coincidio) * colapso}
          fill="#E8F4FF"
          stroke={C.white}
          strokeWidth={3}
        />
        <Texto x={540} y={1210} color={C.white} size={36}>
          resonancia magnética
        </Texto>
      </g>
      <Texto
        x={540}
        y={1330}
        color={C.cyan}
        size={40}
        op={aparece(t, T.coincidio)}
      >
        crac = aparece la burbuja
      </Texto>
      <Texto
        x={540}
        y={1410}
        color={C.orange}
        size={40}
        op={aparece(t, T.debate)}
      >
        ¿o su colapso? debate abierto
      </Texto>
    </Lienzo>
  );
};

// E. 20 minutos para que el gas se disuelva
export const Espera: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const d = interpolate(t, [T.veinte, T.artritis - 0.3], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.enseguida, T.artritis], [1, 1.03])}>
      <Articulacion
        t={t}
        sep={0.3 * (1 - d)}
        burbuja={1 - d}
        gas={0.4 + 0.6 * d}
      />
      <Tarjeta x={290} y={420} w={500} h={160} op={aparece(t, T.veinte)}>
        <Texto x={540} y={522} color={C.yellow} size={66}>
          {`${Math.round(d * 20)} min`}
        </Texto>
      </Tarjeta>
      <Texto
        x={540}
        y={1220}
        color={C.white}
        size={42}
        op={aparece(t, T.veinte + 0.8)}
      >
        el gas vuelve a disolverse
      </Texto>
    </Lienzo>
  );
};

// Mano esquemática
const Mano: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly espejo?: boolean;
}> = ({ x, y, espejo = false }) => (
  <g transform={`translate(${x} ${y}) scale(${espejo ? -1 : 1} 1)`}>
    <rect x={-90} y={-40} width={180} height={200} rx={50} fill="#E8B8A0" />
    {[0, 1, 2, 3].map((k) => (
      <rect
        key={k}
        x={-85 + k * 45}
        y={-200 + Math.abs(k - 1.5) * 20}
        width={38}
        height={180}
        rx={19}
        fill="#E8B8A0"
      />
    ))}
    <rect
      x={70}
      y={-10}
      width={38}
      height={130}
      rx={19}
      fill="#E8B8A0"
      transform="rotate(-30 90 60)"
    />
  </g>
);

// F. ¿Artritis? 60 años tronando una sola mano
export const Artritis: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.artritis, T.fisica], [1, 1.03])}>
      <Texto
        x={540}
        y={470}
        color={C.white}
        size={52}
        op={aparece(t, T.artritis)}
      >
        ¿artritis?
      </Texto>
      <g opacity={aparece(t, T.medico)}>
        <Mano x={320} y={860} />
        <Mano x={760} y={860} espejo />
        <Texto x={320} y={1100} color={C.yellow} size={34}>
          60 años tronando
        </Texto>
        <Texto x={760} y={1100} color={C.grey} size={34}>
          nunca
        </Texto>
      </g>
      <g opacity={aparece(t, T.ninguna)}>
        {[320, 760].map((x) => (
          <path
            key={x}
            d={`M ${x - 60} 1220 L ${x - 15} 1265 L ${x + 70} 1170`}
            stroke="#5AC878"
            strokeWidth={20}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        <Texto x={540} y={1380} color="#5AC878" size={44}>
          ninguna con artritis
        </Texto>
      </g>
    </Lienzo>
  );
};

// G. Cierre: física, no huesos rotos
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const b = 0.6 + 0.4 * Math.abs(Math.sin(t * 1.5));
  return (
    <Lienzo zoom={interpolate(t, [T.fisica, T.fin + 0.5], [1, 1.05])}>
      <Articulacion t={t} sep={0.6} burbuja={b} />
      <Texto
        x={540}
        y={1220}
        color={C.yellow}
        size={54}
        op={aparece(t, T.fisica + 0.5)}
      >
        burbuja, no hueso roto
      </Texto>
    </Lienzo>
  );
};
