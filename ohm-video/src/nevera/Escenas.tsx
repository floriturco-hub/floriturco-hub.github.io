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

// Instantes clave (s) de public/audio/nevera/narracion.wav (voz x1,09), sacados con Whisper
export const T = {
  zona: 2.36,
  entre: 4.5,
  duplican: 7.12,
  una: 9.54,
  millones: 12.18,
  peligrosa: 13.74,
  esperar: 16.44,
  error: 19.2,
  seguro: 19.78,
  horas: 21.88,
  recipientes: 22.58,
  nevera: 25.78,
  frena: 27.8,
  sobras: 30.08,
  recalentar: 32.82,
  toxinas: 34.96,
  arroz: 37.92,
  frio: 40.32,
  tomate: 41.82,
  pan: 43.26,
  papa: 44.98,
  cierre: 47.04,
  calor: 48.52,
  tibio: 49.96,
  fin: 51.3,
};

const VERDE = "#7AC85A";
const AZUL = "#5AA8E8";

// Bacteria
const Bacteria: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly t: number;
  readonly op?: number;
  readonly muerta?: boolean;
  readonly lenta?: boolean;
}> = ({ x, y, s, t, op = 1, muerta = false, lenta = false }) => (
  <g
    opacity={op}
    transform={`translate(${x} ${y}) rotate(${(lenta ? 0.2 : 1) * Math.sin(t * 3 + x) * 20}) scale(${s})`}
  >
    <ellipse rx={36} ry={18} fill={muerta ? "#5A5670" : VERDE} />
    <path
      d={`M 36 0 q 14 ${(lenta ? 2 : 8) * Math.sin(t * 10 + y)} 28 0`}
      stroke={muerta ? "#5A5670" : VERDE}
      strokeWidth={5}
      fill="none"
    />
    {muerta ? (
      <g stroke="#1A1630" strokeWidth={4}>
        <line x1={-18} y1={-8} x2={-8} y2={2} />
        <line x1={-8} y1={-8} x2={-18} y2={2} />
        <line x1={4} y1={-8} x2={14} y2={2} />
        <line x1={14} y1={-8} x2={4} y2={2} />
      </g>
    ) : (
      <>
        <circle cx={-12} cy={-3} r={4} fill="#1A3A10" />
        <circle cx={8} cy={-3} r={4} fill="#1A3A10" />
      </>
    )}
  </g>
);

// Plato de sopa tibia
const Plato: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly t: number;
  readonly vapor?: number;
}> = ({ x, y, s, t, vapor = 0.3 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((k) => {
      const u = (t * 0.6 + k / 3) % 1;
      return (
        <path
          key={k}
          d={`M ${-40 + k * 40} -60 q 15 -30 0 -60 q -15 -30 0 -60`}
          stroke="#E8E6F0"
          strokeWidth={8}
          fill="none"
          opacity={vapor * Math.sin(u * Math.PI)}
          transform={`translate(0 ${-u * 40})`}
          strokeLinecap="round"
        />
      );
    })}
    <path
      d="M -180 -40 L 180 -40 Q 160 80 0 90 Q -160 80 -180 -40 Z"
      fill="#E8E6F0"
    />
    <ellipse cx={0} cy={-40} rx={180} ry={30} fill="#E8B848" />
  </g>
);

// A. Gancho: comida tibia = incubadora
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const n = Math.min(24, Math.floor(2 ** (t * 2.2)));
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.zona], [1.08, 1])}>
        <Plato x={540} y={1000} s={1.6} t={t} />
        {new Array(n).fill(0).map((_, k) => (
          <Bacteria
            key={k}
            x={260 + random(`gb${k}`) * 560}
            y={700 + random(`gby${k}`) * 260}
            s={0.9}
            t={t}
          />
        ))}
        <Texto x={540} y={1300} color={C.red} size={60} op={aparece(t, 1.0)}>
          35 °C
        </Texto>
      </Lienzo>
      <Flash t={t} d={1.0} color={C.red} />
    </>
  );
};

// Termómetro con las tres zonas
const Termometro: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly op: number;
  readonly marca?: number;
}> = ({ x, y, op, marca }) => (
  <g opacity={op} transform={`translate(${x} ${y})`}>
    <rect
      x={-40}
      y={-420}
      width={80}
      height={480}
      rx={40}
      fill="#1A1636"
      stroke={C.grey}
      strokeWidth={6}
    />
    <rect x={-26} y={-400} width={52} height={120} rx={12} fill={C.orange} />
    <rect x={-26} y={-280} width={52} height={220} fill={C.red} />
    <rect x={-26} y={-60} width={52} height={90} rx={12} fill={AZUL} />
    <circle cx={0} cy={80} r={60} fill={AZUL} stroke={C.grey} strokeWidth={6} />
    {marca !== undefined ? (
      <line
        x1={-70}
        y1={marca}
        x2={70}
        y2={marca}
        stroke={C.white}
        strokeWidth={6}
      />
    ) : null}
  </g>
);

// B. Zona de peligro 4-60 °C y bacterias que se duplican
export const Zona: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const gen = Math.floor(interpolate(t, [T.una, T.millones], [0, 21], clamp));
  const cuenta = 2 ** gen;
  const visibles = Math.min(40, cuenta);
  return (
    <Lienzo zoom={interpolate(t, [T.zona, T.peligrosa], [1, 1.03])}>
      <Termometro x={240} y={980} op={aparece(t, T.zona)} />
      <g opacity={aparece(t, T.entre)}>
        <Texto x={330} y={712} color={C.orange} size={30} anchor="start">
          60 °C
        </Texto>
        <Texto x={330} y={932} color={AZUL} size={30} anchor="start">
          4 °C
        </Texto>
        <Texto x={330} y={830} color={C.red} size={40} anchor="start">
          zona de peligro
        </Texto>
      </g>
      <Tarjeta x={520} y={420} w={460} h={150} op={aparece(t, T.duplican)}>
        <Texto x={750} y={510} color={C.white} size={40}>
          x2 cada 20 min
        </Texto>
      </Tarjeta>
      {new Array(visibles).fill(0).map((_, k) => (
        <Bacteria
          key={k}
          x={720 + random(`zb${k}`) * 250}
          y={680 + random(`zby${k}`) * 420}
          s={0.7}
          t={t}
          op={aparece(t, T.una)}
        />
      ))}
      <Tarjeta x={520} y={1150} w={460} h={170} op={aparece(t, T.una)}>
        <Texto x={750} y={1225} color={VERDE} size={52}>
          {cuenta.toLocaleString("es")}
        </Texto>
        <Texto x={750} y={1285} color={C.grey} size={28}>
          {`${Math.round(((gen * 20) / 60) * 10) / 10} h`}
        </Texto>
      </Tarjeta>
    </Lienzo>
  );
};

// C. No esperes a que se enfríe: nevera antes de 2 h, en recipientes bajos
export const Enfriar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const reparto = aparece(t, T.recipientes);
  return (
    <Lienzo zoom={interpolate(t, [T.peligrosa, T.nevera], [1, 1.03])}>
      <Texto
        x={540}
        y={440}
        color={C.red}
        size={46}
        op={aparece(t, T.peligrosa)}
      >
        lo tibio es lo más peligroso
      </Texto>
      <g opacity={aparece(t, T.esperar)}>
        <Texto x={540} y={560} color={C.grey} size={40}>
          «esperar a que se enfríe»
        </Texto>
        <line
          x1={150}
          y1={545}
          x2={930}
          y2={545}
          stroke={C.red}
          strokeWidth={8}
          opacity={aparece(t, T.error)}
        />
      </g>
      <Tarjeta x={340} y={630} w={400} h={150} op={aparece(t, T.horas)}>
        <Texto x={540} y={725} color={C.yellow} size={58}>
          {"< 2 h"}
        </Texto>
      </Tarjeta>
      {/* olla grande vs recipientes bajos */}
      <g opacity={(1 - reparto) * aparece(t, T.seguro)}>
        <rect x={380} y={880} width={320} height={300} rx={30} fill="#8C88A8" />
        <rect x={350} y={860} width={380} height={40} rx={14} fill="#C8C4D8" />
        <Texto x={540} y={1250} color={C.grey} size={36}>
          olla grande: tarda horas
        </Texto>
      </g>
      <g opacity={reparto}>
        {[0, 1, 2].map((k) => (
          <g key={k}>
            <rect
              x={150 + k * 280}
              y={1000}
              width={220}
              height={90}
              rx={18}
              fill="#C8E8F8"
              opacity={0.85}
            />
            <rect
              x={160 + k * 280}
              y={1030}
              width={200}
              height={50}
              rx={12}
              fill="#E8B848"
            />
          </g>
        ))}
        <Texto x={540} y={1180} color={AZUL} size={40}>
          recipientes bajos: se enfría rápido
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. La nevera solo frena: sobras 3-4 días
export const Nevera: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.nevera, T.recalentar], [1, 1.03])}>
      <rect x={240} y={420} width={600} height={880} rx={40} fill="#C8D8E8" />
      <rect x={270} y={450} width={540} height={820} rx={24} fill="#E8F4FF" />
      {[700, 950].map((y) => (
        <rect key={y} x={270} y={y} width={540} height={10} fill="#A8C8E0" />
      ))}
      <Tarjeta x={560} y={470} w={230} h={110} op={aparece(t, T.nevera)}>
        <Texto x={675} y={542} color={AZUL} size={48}>
          4 °C
        </Texto>
      </Tarjeta>
      {new Array(8).fill(0).map((_, k) => (
        <Bacteria
          key={k}
          x={330 + (k % 4) * 130}
          y={820 + Math.floor(k / 4) * 250}
          s={0.9}
          t={t * 0.15}
          lenta
          op={aparece(t, T.frena)}
        />
      ))}
      <Texto
        x={540}
        y={1380}
        color={C.white}
        size={42}
        op={aparece(t, T.frena)}
      >
        no las mata: las frena
      </Texto>
      <Texto
        x={540}
        y={1460}
        color={C.yellow}
        size={44}
        op={aparece(t, T.sobras)}
      >
        sobras: 3-4 días
      </Texto>
    </Lienzo>
  );
};

// E. Recalentar no elimina todas las toxinas (arroz)
export const Toxinas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const calor = interpolate(
    t,
    [T.recalentar + 0.5, T.toxinas + 0.5],
    [0, 1],
    suave,
  );
  return (
    <Lienzo zoom={interpolate(t, [T.recalentar, T.frio], [1, 1.03])}>
      {/* llama */}
      <g
        opacity={aparece(t, T.recalentar)}
        transform={`translate(540 1180) scale(${1 + 0.05 * Math.sin(t * 12)})`}
      >
        <path
          d="M 0 0 C -90 -60 -60 -200 0 -280 C 60 -200 90 -60 0 0 Z"
          fill={C.orange}
        />
        <path
          d="M 0 0 C -50 -40 -30 -140 0 -190 C 30 -140 50 -40 0 0 Z"
          fill={C.yellow}
        />
      </g>
      {/* plato de arroz con bacterias y toxinas */}
      <g transform="translate(540 760)">
        <path
          d="M -220 0 L 220 0 Q 200 120 0 130 Q -200 120 -220 0 Z"
          fill="#E8E6F0"
        />
        <ellipse cx={0} cy={0} rx={220} ry={34} fill="#F8F4E8" />
        {new Array(30).fill(0).map((_, k) => (
          <ellipse
            key={k}
            cx={(random(`ar${k}`) - 0.5) * 360}
            cy={-8 + (random(`ary${k}`) - 0.5) * 30}
            rx={10}
            ry={5}
            fill="#FFFFFF"
          />
        ))}
      </g>
      {new Array(6).fill(0).map((_, k) => (
        <Bacteria
          key={k}
          x={320 + k * 90}
          y={600 + (k % 2) * 50}
          s={0.8}
          t={t}
          muerta={calor > 0.6}
        />
      ))}
      {new Array(10).fill(0).map((_, k) => (
        <circle
          key={k}
          cx={300 + random(`tx${k}`) * 480}
          cy={560 + random(`ty${k}`) * 140}
          r={10}
          fill="#C85AE8"
          opacity={aparece(t, T.toxinas)}
        />
      ))}
      <Texto
        x={540}
        y={460}
        color="#C85AE8"
        size={44}
        op={aparece(t, T.toxinas)}
      >
        las toxinas resisten el calor
      </Texto>
      <Texto
        x={540}
        y={1340}
        color={C.yellow}
        size={40}
        op={aparece(t, T.arroz)}
      >
        arroz horas fuera de la nevera
      </Texto>
    </Lienzo>
  );
};

// Iconos de alimentos
const Tomate: React.FC<{ readonly x: number; readonly y: number }> = ({
  x,
  y,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={80} fill={C.red} />
    <path
      d="M -30 -70 L 0 -50 L 30 -70 L 10 -60 L 0 -90 L -10 -60 Z"
      fill={VERDE}
    />
  </g>
);
const Pan: React.FC<{ readonly x: number; readonly y: number }> = ({
  x,
  y,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <path
      d="M -110 40 L -110 -20 Q -110 -80 0 -80 Q 110 -80 110 -20 L 110 40 Z"
      fill="#C8904A"
    />
    {[-50, 0, 50].map((dx) => (
      <path
        key={dx}
        d={`M ${dx - 15} -60 l 30 30`}
        stroke="#8A5A2A"
        strokeWidth={6}
      />
    ))}
  </g>
);
const Papa: React.FC<{ readonly x: number; readonly y: number }> = ({
  x,
  y,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse rx={100} ry={70} fill="#B8905A" />
    {[
      [-40, -20],
      [30, 10],
      [-10, 30],
    ].map(([cx, cy], k) => (
      <circle key={k} cx={cx} cy={cy} r={6} fill="#7A5A30" />
    ))}
  </g>
);

// F. No todo va al frío: tomate, pan y papa
export const Fuera: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const filas = [
    ["tomate", "pierde sabor", T.tomate, 0],
    ["pan", "se endurece antes", T.pan, 1],
    ["papa", "almidón = azúcar", T.papa, 2],
  ] as const;
  return (
    <Lienzo zoom={interpolate(t, [T.frio, T.cierre], [1, 1.03])}>
      <Texto x={540} y={430} color={C.white} size={48} op={aparece(t, T.frio)}>
        no todo va al frío
      </Texto>
      {filas.map(([nom, efecto, d, k]) => (
        <g key={nom} opacity={aparece(t, d)}>
          {k === 0 ? (
            <Tomate x={240} y={620 + k * 280} />
          ) : k === 1 ? (
            <Pan x={240} y={620 + k * 280} />
          ) : (
            <Papa x={240} y={620 + k * 280} />
          )}
          <Texto
            x={400}
            y={610 + k * 280}
            color={C.white}
            size={48}
            anchor="start"
          >
            {nom}
          </Texto>
          <Texto
            x={400}
            y={665 + k * 280}
            color={AZUL}
            size={34}
            anchor="start"
          >
            {efecto}
          </Texto>
        </g>
      ))}
    </Lienzo>
  );
};

// G. Cierre: frío para frenar, calor para matar, lo tibio nunca
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.cierre, T.fin + 0.5], [1, 1.05])}>
      <g opacity={aparece(t, T.cierre)} transform="translate(540 560)">
        {[0, 60, 120].map((a) => (
          <line
            key={a}
            x1={-70}
            y1={0}
            x2={70}
            y2={0}
            stroke={AZUL}
            strokeWidth={14}
            strokeLinecap="round"
            transform={`rotate(${a + t * 10})`}
          />
        ))}
      </g>
      <Texto x={540} y={720} color={AZUL} size={50} op={aparece(t, T.cierre)}>
        frío: frena
      </Texto>
      <g
        opacity={aparece(t, T.calor)}
        transform={`translate(540 960) scale(${0.55 + 0.03 * Math.sin(t * 12)})`}
      >
        <path
          d="M 0 0 C -90 -60 -60 -200 0 -280 C 60 -200 90 -60 0 0 Z"
          fill={C.orange}
        />
        <path
          d="M 0 0 C -50 -40 -30 -140 0 -190 C 30 -140 50 -40 0 0 Z"
          fill={C.yellow}
        />
      </g>
      <Texto
        x={540}
        y={1030}
        color={C.orange}
        size={50}
        op={aparece(t, T.calor)}
      >
        calor: mata
      </Texto>
      <g opacity={aparece(t, T.tibio)}>
        <Texto x={540} y={1300} color={C.red} size={64}>
          tibio: nunca
        </Texto>
        <line
          x1={260}
          y1={1330}
          x2={820}
          y2={1330}
          stroke={C.red}
          strokeWidth={8}
        />
      </g>
    </Lienzo>
  );
};
