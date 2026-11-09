import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, mono, useT } from "../theme";

// Instantes clave (s) de public/audio/impresora/narracion.wav (voz x1,10), sacados con Whisper
export const T = {
  inyeccion: 1.96,
  agujeros: 4.16,
  cabello: 5.48,
  resistencia: 7.5,
  calienta: 10.38,
  trescientos: 11.12,
  hierve: 12.58,
  burbuja: 14.16,
  gota: 15.4,
  miles: 17.84,
  cuatro: 19.56,
  cian: 21.08,
  puntitos: 23.62,
  mezcla: 25.56,
  laser: 27.56,
  estatica: 30.18,
  tambor: 32.48,
  borra: 34.18,
  toner: 37.02,
  pega: 39.1,
  papel: 40.68,
  rodillo: 41.76,
  doscientos: 42.52,
  funde: 44.46,
  caliente: 45.76,
  una: 47.56,
  otra: 48.94,
  fin: 51.2,
};

const CIAN = "#08C8E8";
const MAGENTA = "#E83AA8";
const AMARILLO = "#F8D848";
const NEGRO = "#1A1626";
const TINTA = "#3A6AE8";

// Corte de una boquilla: cámara de tinta, resistencia, burbuja y gota.
// ciclo 0..1: calentar (0-0.3), burbuja (0.3-0.55), gota sale (0.55-1)
const Boquilla: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly ciclo: number;
  readonly rotulos?: number;
}> = ({ x, y, s, ciclo, rotulos = 0 }) => {
  const calor = interpolate(ciclo, [0, 0.3, 0.6], [0, 1, 0], clamp);
  const burb = interpolate(ciclo, [0.25, 0.55, 0.7], [0, 1, 0], clamp);
  const gota = interpolate(ciclo, [0.5, 1], [0, 1], clamp);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-220} y={-260} width={440} height={260} rx={20} fill="#3A3A4A" />
      <rect
        x={-190}
        y={-230}
        width={380}
        height={200}
        rx={14}
        fill={TINTA}
        opacity={0.85}
      />
      {/* boquilla */}
      <rect x={-30} y={-30} width={60} height={60} fill="#3A3A4A" />
      <rect x={-14} y={-30} width={28} height={60} fill={TINTA} />
      {/* resistencia */}
      <rect
        x={-120}
        y={-250}
        width={240}
        height={26}
        rx={6}
        fill={
          calor > 0.05
            ? `rgba(232,${Math.round(65 + (1 - calor) * 120)},79,1)`
            : "#8C88A8"
        }
      />
      <ellipse
        cx={0}
        cy={-200}
        rx={150 * burb}
        ry={80 * burb}
        fill="#E8F0FF"
        opacity={0.85}
      />
      {gota > 0 ? (
        <circle cx={0} cy={40 + gota * 360} r={18} fill={TINTA} />
      ) : null}
      <g opacity={rotulos}>
        <Texto x={0} y={-290} color={C.red} size={34}>
          resistencia
        </Texto>
        <Texto x={0} y={-110} color={C.white} size={34}>
          tinta
        </Texto>
        <Texto x={50} y={20} color={C.white} size={34} anchor="start">
          boquilla
        </Texto>
      </g>
    </g>
  );
};

// A. Gancho: la impresora hierve tinta
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.inyeccion], [1.08, 1])}>
        <Boquilla
          x={540}
          y={820}
          s={1.6}
          ciclo={interpolate(t, [0.2, 1.4], [0, 1], clamp)}
        />
        <rect x={140} y={1380} width={800} height={20} fill="#F0EEF8" />
        <Texto x={540} y={300} color={C.red} size={80} op={aparece(t, 0.6)}>
          300 °C
        </Texto>
      </Lienzo>
      <Flash t={t} d={1.0} color={C.red} />
    </>
  );
};

// Impresora de escritorio
const Impresora: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly carro?: number;
}> = ({ x, y, s, carro = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -200 -150 L 200 -150 L 180 -230 L -180 -230 Z" fill="#F0EEF8" />
    <rect x={-300} y={-150} width={600} height={220} rx={30} fill="#C8C4D8" />
    <rect x={-240} y={-100} width={480} height={30} rx={10} fill="#2A2440" />
    <rect
      x={-220 + carro * 380}
      y={-112}
      width={60}
      height={54}
      rx={8}
      fill="#5A5670"
    />
    <rect x={-220} y={70} width={440} height={60} rx={8} fill="#F0EEF8" />
  </g>
);

// B. Cabezal: miles de agujeros más finos que un cabello
export const Cabezal: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.inyeccion, T.calienta], [1, 1.03])}>
      <Impresora x={540} y={600} s={1.1} carro={(Math.sin(t * 2) + 1) / 2} />
      <g opacity={aparece(t, T.agujeros)}>
        <line
          x1={540}
          y1={520}
          x2={540}
          y2={820}
          stroke={C.grey}
          strokeWidth={3}
          strokeDasharray="8 8"
        />
        <rect x={140} y={840} width={800} height={260} rx={20} fill="#3A3A4A" />
        {new Array(4)
          .fill(0)
          .map((_, f) =>
            new Array(24)
              .fill(0)
              .map((__, k) => (
                <circle
                  key={`${f}-${k}`}
                  cx={180 + k * 31 + (f % 2) * 15}
                  cy={890 + f * 55}
                  r={7}
                  fill={[CIAN, MAGENTA, AMARILLO, NEGRO][f]}
                />
              )),
          )}
      </g>
      <g opacity={aparece(t, T.cabello)}>
        <rect x={140} y={1150} width={800} height={40} rx={20} fill="#6A4A3A" />
        <Texto x={540} y={1250} color={C.grey} size={34}>
          un cabello
        </Texto>
      </g>
      <Texto
        x={540}
        y={1360}
        color={C.red}
        size={40}
        op={aparece(t, T.resistencia)}
      >
        y detrás de cada uno, una resistencia
      </Texto>
    </Lienzo>
  );
};

// C. Calor, burbuja y gota: miles de veces por segundo
export const Burbuja: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rapido = t > T.miles;
  const ciclo = rapido
    ? (t * 3) % 1
    : interpolate(t, [T.calienta, T.gota + 1.2], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.calienta, T.cuatro], [1, 1.03])}>
      <Boquilla x={500} y={760} s={1.3} ciclo={ciclo} rotulos={1} />
      <rect x={140} y={1300} width={800} height={20} fill="#F0EEF8" />
      <Tarjeta x={290} y={180} w={500} h={140} op={aparece(t, T.trescientos)}>
        <Texto x={540} y={272} color={C.red} size={60}>
          {`${Math.round(interpolate(t, [T.trescientos, T.trescientos + 0.8], [20, 300], clamp))} °C`}
        </Texto>
      </Tarjeta>
      <Texto
        x={540}
        y={1400}
        color={C.cyan}
        size={40}
        op={aparece(t, T.burbuja) * (1 - aparece(t, T.miles))}
      >
        la burbuja dispara la gota
      </Texto>
      <Texto
        x={540}
        y={1400}
        color={C.yellow}
        size={44}
        op={aparece(t, T.miles)}
      >
        miles de veces por segundo
      </Texto>
    </Lienzo>
  );
};

// D. Cuatro tintas y puntitos que el ojo mezcla
export const Puntos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cols = [CIAN, MAGENTA, AMARILLO, NEGRO];
  const nombres = ["cian", "magenta", "amarillo", "negro"];
  const zoom = interpolate(t, [T.mezcla, T.mezcla + 1.5], [1, 0.25], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.cuatro, T.laser], [1, 1.03])}>
      {cols.map((c, k) => (
        <g key={c} opacity={aparece(t, T.cian + k * 0.4)}>
          <circle
            cx={210 + k * 220}
            cy={500}
            r={70}
            fill={c}
            stroke={k === 3 ? C.grey : "none"}
            strokeWidth={4}
          />
          <Texto
            x={210 + k * 220}
            y={620}
            color={k === 3 ? C.grey : c}
            size={30}
          >
            {nombres[k]}
          </Texto>
        </g>
      ))}
      <g
        opacity={aparece(t, T.puntitos)}
        transform={`translate(540 1000) scale(${zoom * 3})`}
      >
        {new Array(22).fill(0).map((_, i) =>
          new Array(22).fill(0).map((__, j) => {
            const u = i / 21;
            const v = j / 21;
            const r1 = 4 * (1 - v) * (0.6 + 0.4 * Math.sin(u * 3));
            const r2 = 4 * v;
            return (
              <g key={`${i}-${j}`}>
                <circle
                  cx={(i - 10.5) * 12}
                  cy={(j - 10.5) * 12}
                  r={r1}
                  fill={MAGENTA}
                  opacity={0.85}
                />
                <circle
                  cx={(i - 10.5) * 12 + 4}
                  cy={(j - 10.5) * 12 + 4}
                  r={r2}
                  fill={AMARILLO}
                  opacity={0.85}
                />
                <circle
                  cx={(i - 10.5) * 12 + 2}
                  cy={(j - 10.5) * 12 - 3}
                  r={2.5 * u}
                  fill={CIAN}
                  opacity={0.8}
                />
              </g>
            );
          }),
        )}
      </g>
      <Texto
        x={540}
        y={1440}
        color={C.yellow}
        size={42}
        op={aparece(t, T.mezcla)}
      >
        tu ojo los mezcla
      </Texto>
    </Lienzo>
  );
};

// Tambor con cargas negativas; borrado: arcos donde el láser quitó la carga
const Tambor: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly rot: number;
  readonly carga: number;
  readonly borrado: number;
  readonly toner: number;
}> = ({ x, y, r, rot, carga, borrado, toner }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#3A6A4A" stroke="#8C88A8" strokeWidth={8} />
    <g transform={`rotate(${rot})`}>
      {new Array(36).fill(0).map((_, k) => {
        const a = (k / 36) * Math.PI * 2;
        const letra = k % 6 === 1 || k % 6 === 2 || k % 6 === 4;
        const sinCarga = letra && borrado > k / 36;
        return (
          <g key={k}>
            {!sinCarga ? (
              <text
                x={Math.cos(a) * (r - 36)}
                y={Math.sin(a) * (r - 36) + 12}
                textAnchor="middle"
                fill={C.cyan}
                fontSize={34}
                fontWeight={700}
                fontFamily={mono}
                opacity={carga}
              >
                -
              </text>
            ) : (
              <circle
                cx={Math.cos(a) * (r + 14)}
                cy={Math.sin(a) * (r + 14)}
                r={14}
                fill={NEGRO}
                stroke="#5A5670"
                strokeWidth={2}
                opacity={toner}
              />
            )}
          </g>
        );
      })}
    </g>
  </g>
);

// E. Láser: electricidad estática en un tambor
export const Laser: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const borrado = interpolate(t, [T.borra, T.toner - 0.3], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.laser, T.toner], [1, 1.03])}>
      <Texto x={540} y={440} color={C.white} size={48} op={aparece(t, T.laser)}>
        impresora láser
      </Texto>
      <Texto
        x={540}
        y={510}
        color={C.cyan}
        size={38}
        op={aparece(t, T.estatica)}
      >
        imprime con electricidad estática
      </Texto>
      <Tambor
        x={540}
        y={920}
        r={260}
        rot={t * 20}
        carga={aparece(t, T.tambor)}
        borrado={borrado}
        toner={0}
      />
      <g opacity={aparece(t, T.borra)}>
        <rect x={880} y={560} width={120} height={70} rx={14} fill="#5A5670" />
        <line
          x1={900}
          y1={620}
          x2={540 + Math.cos(-0.6) * 260}
          y2={920 + Math.sin(-0.6) * 260}
          stroke={C.red}
          strokeWidth={8}
          opacity={0.6 + 0.4 * Math.sin(t * 30)}
        />
      </g>
      <Texto x={540} y={1300} color={C.red} size={40} op={aparece(t, T.borra)}>
        el láser borra la carga de las letras
      </Texto>
    </Lienzo>
  );
};

// F. Tóner, papel y rodillo caliente
export const Toner: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const avance = interpolate(t, [T.papel, T.caliente], [0, 1], clamp);
  const fundido = aparece(t, T.funde);
  return (
    <Lienzo zoom={interpolate(t, [T.toner, T.una], [1, 1.03])}>
      <Tambor
        x={360}
        y={700}
        r={200}
        rot={t * 20}
        carga={1}
        borrado={1}
        toner={aparece(t, T.pega)}
      />
      <Texto x={360} y={460} color={C.grey} size={34} op={aparece(t, T.toner)}>
        tóner: polvo finísimo
      </Texto>
      {/* papel que avanza */}
      <g
        transform={`translate(${-500 + avance * 900} 0)`}
        opacity={aparece(t, T.papel)}
      >
        <rect x={0} y={910} width={560} height={14} fill="#F0EEF8" />
        <text
          x={280}
          y={985}
          textAnchor="middle"
          fill="#E8E6F0"
          fontFamily={mono}
          fontWeight={700}
          fontSize={48}
          opacity={0.8}
        >
          HOLA
        </text>
      </g>
      {/* rodillos de fusión */}
      <g opacity={aparece(t, T.rodillo)}>
        {[860, 960].map((y, k) => (
          <circle
            key={y}
            cx={800}
            cy={y + (k ? 14 : -14)}
            r={60}
            fill={`rgba(232,${Math.round(112 - 60 * fundido)},60,1)`}
            stroke="#8C88A8"
            strokeWidth={6}
          />
        ))}
        <Tarjeta x={640} y={1080} w={320} h={130} op={aparece(t, T.doscientos)}>
          <Texto x={800} y={1165} color={C.orange} size={56}>
            200 °C
          </Texto>
        </Tarjeta>
      </g>
      <g opacity={aparece(t, T.caliente)}>
        {[0, 1, 2].map((k) => (
          <path
            key={k}
            d={`M ${880 + k * 50} 880 q 16 -30 0 -60 q -16 -30 0 -60`}
            stroke={C.orange}
            strokeWidth={8}
            fill="none"
            opacity={0.6 + 0.4 * Math.sin(t * 6 + k)}
          />
        ))}
      </g>
      <Texto
        x={540}
        y={1340}
        color={C.orange}
        size={42}
        op={aparece(t, T.funde)}
      >
        lo derrite y lo funde al papel
      </Texto>
      <Texto
        x={540}
        y={1420}
        color={C.yellow}
        size={42}
        op={aparece(t, T.caliente)}
      >
        por eso sale caliente
      </Texto>
    </Lienzo>
  );
};

// G. Cierre: una hierve tinta, la otra dibuja con luz y estática
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.una, T.fin + 0.5], [1, 1.05])}>
      <g opacity={aparece(t, T.una)}>
        <path
          d="M 300 560 Q 380 680 380 740 A 80 80 0 0 1 220 740 Q 220 680 300 560 Z"
          fill={TINTA}
        />
        {[0, 1, 2].map((k) => (
          <circle
            key={k}
            cx={280 + k * 22}
            cy={720 - ((t * 60 + k * 20) % 60)}
            r={8}
            fill="#E8F0FF"
            opacity={0.8}
          />
        ))}
        <Texto x={300} y={920} color={TINTA} size={40}>
          hierve tinta
        </Texto>
      </g>
      <g opacity={aparece(t, T.otra)}>
        <line
          x1={640}
          y1={560}
          x2={900}
          y2={800}
          stroke={C.red}
          strokeWidth={10}
          opacity={0.7 + 0.3 * Math.sin(t * 30)}
        />
        <path
          d="M 820 560 L 760 680 L 820 680 L 760 800"
          stroke={C.yellow}
          strokeWidth={10}
          fill="none"
          strokeLinejoin="round"
        />
        <Texto x={780} y={920} color={C.yellow} size={40}>
          luz y estática
        </Texto>
      </g>
    </Lienzo>
  );
};
