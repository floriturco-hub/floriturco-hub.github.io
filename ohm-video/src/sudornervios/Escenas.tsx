import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/sudornervios/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  gimnasio: 2.38, // gimnasio
  huele: 3.36, // huele
  nervios: 4.62, // nervios
  apesta: 5.66, // apesta
  final: 7.50, // final
  tienes: 9.54, // tienes
  tipos: 10.08, // tipos
  ejercicio: 12.00, // ejercicio
  ecrinas: 13.18, // ecrinas
  repartidas: 13.92, // repartidas
  agua: 16.86, // agua
  sal: 17.44, // sal
  enfriarte: 17.94, // enfriarte
  pero: 18.78, // pero
  estres: 19.08, // estres
  apocrinas: 20.06, // apocrinas
  axilas: 21.70, // axilas
  espeso: 23.46, // espeso
  proteinas: 24.40, // proteinas
  grasas: 25.24, // grasas
  porSi: 26.00, // por
  noHuele: 26.82, // huele
  bacterias: 28.52, // bacterias
  comen: 29.86, // comen
  sueltan: 31.72, // sueltan
  porEso: 33.64, // por
  fin: 35.18, // FIN
};

const PIEL = "#C89A7A";
const VERDE = "#8AC84A";

const Gota: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly col?: string; readonly op?: number }> = ({ x, y, s = 1, col = "#7AC8F0", op = 1 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M 0 -40 C 20 -10 30 5 30 18 A 30 30 0 0 1 -30 18 C -30 5 -20 -10 0 -40 Z" fill={col} opacity={op} />
);

const Peste: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly op?: number; readonly s?: number }> = ({ x, y, t, op = 1, s = 1 }) => (
  <g opacity={op} transform={`translate(${x} ${y}) scale(${s})`}>
    {[-50, 0, 50].map((dx, k) => {
      const u = (t * 0.8 + k * 0.33) % 1;
      return (
        <path
          key={k}
          d={`M ${dx} ${-u * 120} q 15 -20 0 -40 q -15 -20 0 -40 q 15 -20 0 -40`}
          stroke={VERDE}
          strokeWidth={9}
          fill="none"
          strokeLinecap="round"
          opacity={Math.sin(u * Math.PI)}
        />
      );
    })}
  </g>
);

// Persona de frente con un brazo levantado
const Persona: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly camisa?: string }> = ({ x, y, s = 1, camisa = "#4A6AC8" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-230} r={80} fill={PIEL} />
    <rect x={-110} y={-140} width={220} height={300} rx={50} fill={camisa} />
    <rect x={110} y={-370} width={60} height={250} rx={30} fill={PIEL} transform="rotate(10 140 -130)" />
    <rect x={-170} y={-120} width={60} height={250} rx={30} fill={PIEL} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Persona x={500} y={1100} s={1.4} />
    <Peste x={680} y={880} t={t} s={1.3} />
    <Texto x={280} y={680} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este sudor apesta?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.gimnasio], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Sudor de gimnasio casi no huele; sudor de nervios apesta en minutos + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.gimnasio, T.tienes], [1, 1.04])}>
      <g opacity={aparece(t, T.gimnasio)}>
        <rect x={180} y={700} width={180} height={30} rx={10} fill="#8A8A96" />
        <rect x={150} y={670} width={40} height={90} rx={8} fill="#5A5A66" />
        <rect x={350} y={670} width={40} height={90} rx={8} fill="#5A5A66" />
        <Gota x={220} y={860} s={1.2} />
        <Gota x={320} y={900} s={0.9} />
        <Texto x={270} y={1040} size={36} color={C.white}>
          gimnasio
        </Texto>
        <Texto x={270} y={1100} size={34} color="#5AD08A" op={aparece(t, T.huele)}>
          casi no huele
        </Texto>
      </g>
      <g opacity={aparece(t, T.nervios)}>
        <rect x={680} y={640} width={200} height={260} rx={10} fill="#E8E8EE" />
        {[0, 1, 2, 3].map((k) => (
          <rect key={k} x={710} y={680 + k * 50} width={140} height={12} rx={6} fill="#B8B8C4" />
        ))}
        <Texto x={840} y={890} size={60} color={C.red}>
          ✗
        </Texto>
        <Gota x={720} y={960} s={1} col="#C8D07A" />
        <Peste x={800} y={900} t={t} op={aparece(t, T.apesta)} s={0.8} />
        <Texto x={780} y={1040} size={36} color={C.white}>
          examen
        </Texto>
        <Texto x={780} y={1100} size={34} color={VERDE} op={aparece(t, T.apesta)}>
          ¡apesta!
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿quién produce el olor?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.tienes], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// Corte de piel con dos glándulas
const Piel: React.FC<{ readonly ecr: number; readonly apo: number }> = ({ ecr, apo }) => (
  <g>
    <rect x={100} y={700} width={880} height={60} fill="#E0B090" />
    <rect x={100} y={760} width={880} height={560} fill="#D89A8A" opacity={0.5} />
    <g opacity={ecr}>
      <path d="M 330 700 L 330 1080" stroke="#7AC8F0" strokeWidth={10} />
      <path d="M 330 1080 q 40 20 0 40 q -40 20 0 40 q 40 20 0 40" stroke="#7AC8F0" strokeWidth={14} fill="none" />
      <Texto x={330} y={1300} size={36} color="#7AC8F0">
        ecrina
      </Texto>
    </g>
    <g opacity={apo}>
      <path d="M 720 700 L 720 800" stroke="#5A3A2A" strokeWidth={8} />
      <path d="M 735 840 L 760 1060" stroke="#C8D07A" strokeWidth={12} />
      <ellipse cx={780} cy={1140} rx={70} ry={60} fill="#C8D07A" />
      <Texto x={760} y={1300} size={36} color="#C8D07A">
        apocrina
      </Texto>
      <Texto x={720} y={680} size={28} color={C.grey}>
        pelo
      </Texto>
    </g>
  </g>
);

// C. Tienes dos tipos de glándulas de sudor
export const Glandulas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.tienes, T.ejercicio], [1, 1.04])}>
      <Piel ecr={aparece(t, T.tipos)} apo={aparece(t, T.tipos + 0.4)} />
      <Texto x={540} y={540} size={48} color={C.yellow} op={aparece(t, T.tipos)}>
        2 tipos de glándulas
      </Texto>
    </Lienzo>
  );
};

// D. Ejercicio: ecrinas por todo el cuerpo; sudor de agua y sal para enfriarte
export const Ecrinas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.ejercicio, T.pero], [1, 1.04])}>
      <g opacity={1 - aparece(t, T.agua)}>
        <Persona x={540} y={1050} s={1.2} camisa="#2A2440" />
        {new Array(40).fill(0).map((_, k) => (
          <circle key={k} cx={540 + ((k * 73) % 360) - 180} cy={780 + ((k * 131) % 520)} r={8} fill="#7AC8F0" opacity={aparece(t, T.repartidas + (k % 10) * 0.05)} />
        ))}
        <Texto x={540} y={1400} size={40} color="#7AC8F0" op={aparece(t, T.ecrinas)}>
          ecrinas: por todo el cuerpo
        </Texto>
      </g>
      <g opacity={aparece(t, T.agua)}>
        <Gota x={540} y={900} s={5} />
        <Texto x={540} y={960} size={50} color="#0A3A5A">
          H₂O
        </Texto>
        <Texto x={540} y={1030} size={38} color="#0A3A5A" op={aparece(t, T.sal)}>
          + sal
        </Texto>
        <Texto x={540} y={1250} size={42} color={C.cyan} op={aparece(t, T.enfriarte)}>
          para enfriarte ❄
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. El estrés activa las apocrinas (axilas): sudor espeso con proteínas y grasas
export const Apocrinas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const esp = aparece(t, T.espeso);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pero, T.porSi], [1, 1.04])}>
        <g opacity={1 - esp}>
          <Persona x={540} y={1100} s={1.2} camisa="#2A2440" />
          <path d="M 300 560 L 250 660 L 300 660 L 250 760" stroke={C.yellow} strokeWidth={12} fill="none" opacity={aparece(t, T.estres)} />
          <circle cx={690} cy={960} r={40} fill="#C8D07A" opacity={aparece(t, T.axilas)} />
          <circle cx={385} cy={960} r={40} fill="#C8D07A" opacity={aparece(t, T.axilas)} />
          <Texto x={540} y={1420} size={40} color="#C8D07A" op={aparece(t, T.apocrinas)}>
            apocrinas: en las axilas
          </Texto>
        </g>
        <g opacity={esp}>
          <Gota x={540} y={900} s={5} col="#C8D07A" />
          {new Array(7).fill(0).map((_, k) => (
            <circle key={k} cx={470 + (k % 3) * 70} cy={880 + Math.floor(k / 3) * 60} r={18} fill={k % 2 ? "#E8A040" : "#F0E0A0"} opacity={aparece(t, k % 2 ? T.grasas : T.proteinas)} />
          ))}
          <Texto x={540} y={1250} size={40} color="#E8A040" op={aparece(t, T.proteinas)}>
            proteínas + grasas
          </Texto>
          <Texto x={540} y={600} size={40} color="#C8D07A">
            más espeso
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.estres} color={C.yellow} />
    </>
  );
};

// Bacteria
const Bacteria: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly k: number }> = ({ x, y, t, k }) => (
  <g transform={`translate(${x} ${y}) rotate(${k * 40 + Math.sin(t * 3 + k) * 10})`}>
    <rect x={-50} y={-20} width={100} height={40} rx={20} fill="#9A5AC8" />
    <circle cx={22} cy={-4} r={5} fill="#fff" />
    <path d={`M -50 0 q -20 ${10 * Math.sin(t * 8 + k)} -40 0`} stroke="#9A5AC8" strokeWidth={5} fill="none" />
  </g>
);

// F. Por sí solo no huele: las bacterias se comen proteínas y grasas y sueltan compuestos apestosos
export const Bacterias: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const come = interpolate(t, [T.comen, T.sueltan], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.porSi, T.porEso], [1, 1.04])}>
        <rect x={100} y={1100} width={880} height={300} fill="#E0B090" />
        {new Array(8).fill(0).map((_, k) => (
          <circle key={k} cx={200 + k * 95} cy={1070} r={18} fill={k % 2 ? "#E8A040" : "#F0E0A0"} opacity={1 - Math.min(1, come * 1.5 - k * 0.05)} />
        ))}
        <Texto x={540} y={720} size={42} color="#5AD08A" op={aparece(t, T.noHuele) * (1 - aparece(t, T.bacterias))}>
          sin olor… todavía
        </Texto>
        {new Array(5).fill(0).map((_, k) => (
          <g key={k} opacity={aparece(t, T.bacterias + k * 0.1)}>
            <Bacteria x={220 + k * 160 + Math.sin(t + k) * 20} y={1010 + (k % 2) * 20} t={t} k={k} />
          </g>
        ))}
        <Texto x={540} y={1480} size={40} color="#C89AF0" op={aparece(t, T.bacterias)}>
          bacterias de tu piel
        </Texto>
        <Peste x={360} y={940} t={t} op={aparece(t, T.sueltan)} />
        <Peste x={720} y={940} t={t + 0.4} op={aparece(t, T.sueltan)} />
        <Texto x={540} y={600} size={42} color={VERDE} op={aparece(t, T.sueltan)}>
          compuestos apestosos
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.bacterias} color="#C89AF0" />
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
