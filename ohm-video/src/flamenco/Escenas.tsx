import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/flamenco/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  flamencos: 2.04, // flamencos
  grises: 2.94, // grises
  rosa: 4.48, // rosa
  comen: 5.54, // comen
  final: 6.36, // final
  comen2: 8.78, // comen
  algas: 9.04, // algas
  camarones: 9.98, // camarones
  carotenoides: 11.00, // carotenoides
  zanahorias: 13.56, // zanahorias
  digerirlos: 14.68, // digerirlos
  higado: 15.56, // higado
  sangre: 17.36, // sangre
  grasas: 18.40, // grasas
  llegan: 19.42, // llegan
  plumas: 20.56, // plumas
  tinen: 22.24, // tinen
  polluelos: 24.14, // polluelos
  pigmentos: 26.96, // pigmentos
  sin: 27.64, // sin
  palidas: 30.66, // palidas
  zoologicos: 31.98, // zoologicos
  comida: 33.36, // comida
  porEso: 34.02, // por
  fin: 35.76, // FIN
};

const ROSA = "#F27AA0";
const GRIS = "#B8B8C4";
const NARANJA = "#F08A2A";

const mezcla = (a: string, b: string, k: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * k)).join(",")})`;
};

// Flamenco de perfil mirando a la derecha
const Flamenco: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly col?: string; readonly t?: number }> = ({ x, y, s = 1, col = ROSA, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <line x1={-10} y1={60} x2={-10} y2={420} stroke={col} strokeWidth={14} />
    <path d="M -10 230 L 40 260 L -10 290" stroke={col} strokeWidth={12} fill="none" />
    <line x1={-10} y1={420} x2={40} y2={430} stroke={col} strokeWidth={12} strokeLinecap="round" />
    <ellipse cx={-30} cy={0} rx={170} ry={95} fill={col} />
    <path d="M -200 -20 L -260 10 L -190 40 Z" fill={col} />
    <path d={`M 110 -30 C 200 -100 60 -230 120 -320 C 150 -${370 + 5 * Math.sin(t * 2)} 230 -360 230 -330`} stroke={col} strokeWidth={34} fill="none" strokeLinecap="round" />
    <circle cx={215} cy={-335} r={34} fill={col} />
    <path d="M 240 -350 L 300 -330 L 290 -280 Q 280 -300 245 -315 Z" fill="#222" />
    <circle cx={212} cy={-342} r={7} fill="#222" />
  </g>
);

const Polluelo: React.FC<{ readonly x: number; readonly y: number; readonly s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <line x1={-10} y1={60} x2={-10} y2={180} stroke="#5A5A66" strokeWidth={12} />
    <line x1={20} y1={60} x2={20} y2={180} stroke="#5A5A66" strokeWidth={12} />
    <ellipse cx={0} cy={0} rx={110} ry={85} fill={GRIS} />
    <circle cx={90} cy={-100} r={55} fill={GRIS} />
    <path d="M 140 -110 L 180 -95 L 140 -80 Z" fill="#222" />
    <circle cx={100} cy={-110} r={7} fill="#222" />
  </g>
);

const Camaron: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly r?: number }> = ({ x, y, s = 1, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M -50 0 Q -40 -40 10 -36 Q 50 -30 50 0 Q 30 10 20 30 L 0 10 Q -30 20 -50 0 Z" fill={NARANJA} />
    <line x1={45} y1={-10} x2={90} y2={-40} stroke={NARANJA} strokeWidth={3} />
    <circle cx={35} cy={-14} r={4} fill="#222" />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Flamenco x={480} y={980} s={1.1} t={t} />
    <Texto x={250} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este flamenco es rosa?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.flamencos], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Nacen grises y blancos; su rosa viene de lo que comen + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.flamencos, T.comen2], [1, 1.04])}>
      <Polluelo x={260} y={1050} s={1.1} />
      <Texto x={260} y={1330} size={36} color={C.grey} op={aparece(t, T.grises)}>
        al nacer: gris
      </Texto>
      <g opacity={aparece(t, T.rosa)}>
        <Flamenco x={720} y={960} s={0.75} t={t} />
        <Texto x={760} y={1330} size={36} color={ROSA}>
          adulto: rosa
        </Texto>
      </g>
      <Texto x={540} y={1430} size={40} color={C.yellow} op={aparece(t, T.comen)}>
        el rosa viene de lo que comen
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿y si cambian de dieta?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.comen2], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Comen algas y camarones llenos de carotenoides (como las zanahorias)
export const Comida: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.comen2, T.digerirlos], [1, 1.04])}>
        <rect x={80} y={1000} width={920} height={400} fill="#2A5A7A" opacity={0.5} />
        <g opacity={aparece(t, T.algas)}>
          {new Array(9).fill(0).map((_, k) => (
            <path
              key={k}
              d={`M ${150 + k * 95} 1400 q ${20 * Math.sin(t * 2 + k)} -80 0 -160 q ${-20 * Math.sin(t * 2 + k)} -60 0 -120`}
              stroke={k % 2 ? "#C86A3A" : "#8AA83A"}
              strokeWidth={14}
              fill="none"
              strokeLinecap="round"
            />
          ))}
          <Texto x={250} y={960} size={36} color="#8AA83A">
            algas
          </Texto>
        </g>
        <g opacity={aparece(t, T.camarones)}>
          {[0, 1, 2, 3].map((k) => (
            <Camaron key={k} x={300 + k * 160 + 20 * Math.sin(t + k)} y={1100 + (k % 2) * 80} s={1.1} r={k * 15 - 20} />
          ))}
          <Texto x={760} y={960} size={36} color={NARANJA}>
            camarones
          </Texto>
        </g>
        <g opacity={aparece(t, T.carotenoides)}>
          <Texto x={540} y={620} size={48} color={NARANJA}>
            carotenoides
          </Texto>
          {new Array(10).fill(0).map((_, k) => (
            <circle key={k} cx={300 + k * 55} cy={700 + 15 * Math.sin(t * 3 + k)} r={12} fill={NARANJA} />
          ))}
        </g>
        <g opacity={aparece(t, T.zanahorias)} transform="translate(540 1520)">
          <path d="M -120 -20 L 100 0 L -120 20 Z" fill={NARANJA} />
          <path d="M -120 -10 L -170 -40 M -120 0 L -175 0 M -120 10 L -170 40" stroke="#5AA83A" strokeWidth={10} />
          <Texto x={240} y={12} size={32} color={C.white}>
            = zanahoria
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.carotenoides} color={NARANJA} />
    </>
  );
};

// D. El hígado los transforma y los manda a la sangre con las grasas
export const Higado: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.digerirlos, T.llegan], [1, 1.04])}>
      <ellipse cx={300} cy={760} rx={130} ry={90} fill="#C86A8A" opacity={aparece(t, T.digerirlos)} />
      <Texto x={300} y={900} size={32} color={C.white} op={aparece(t, T.digerirlos)}>
        digestión
      </Texto>
      <g opacity={aparece(t, T.higado)}>
        <path d="M 600 680 Q 820 640 860 760 Q 820 860 640 840 Q 560 780 600 680 Z" fill="#8A2A3A" />
        <Texto x={730} y={620} size={34} color={C.white}>
          hígado
        </Texto>
        <path d="M 430 760 L 580 760" stroke={NARANJA} strokeWidth={8} strokeDasharray="14 10" strokeDashoffset={-t * 60} />
      </g>
      <g opacity={aparece(t, T.sangre)}>
        <rect x={100} y={1120} width={880} height={160} rx={80} fill="#8A1A2A" />
        <path d="M 730 850 L 730 1110" stroke="#8A1A2A" strokeWidth={40} />
        {new Array(12).fill(0).map((_, k) => {
          const u = (t * 0.25 + k / 12) % 1;
          return <circle key={k} cx={980 - u * 880} cy={1200 + 30 * Math.sin(k * 2)} r={k % 3 === 0 ? 20 : 12} fill={k % 3 === 0 ? "#F0E0A0" : NARANJA} opacity={k % 3 === 0 ? aparece(t, T.grasas) : 1} />;
        })}
        <Texto x={540} y={1360} size={38} color={C.white}>
          a la sangre
        </Texto>
        <Texto x={540} y={1430} size={34} color="#F0E0A0" op={aparece(t, T.grasas)}>
          junto con las grasas
        </Texto>
      </g>
    </Lienzo>
  );
};

// Pluma que crece y se tiñe
const Pluma: React.FC<{ readonly x: number; readonly y: number; readonly h: number; readonly k: number }> = ({ x, y, h, k }) => (
  <g>
    <path d={`M ${x} ${y} Q ${x - 60} ${y - h * 0.5} ${x} ${y - h} Q ${x + 60} ${y - h * 0.5} ${x} ${y} Z`} fill={mezcla("#E8E8EE", "#F25A80", k)} />
    <line x1={x} y1={y + 20} x2={x} y2={y - h} stroke="#fff" strokeWidth={4} opacity={0.6} />
  </g>
);

// E. Llegan a la piel y a las plumas que crecen y las tiñen de rosa o rojo
export const Plumas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const crece = interpolate(t, [T.plumas, T.tinen + 0.6], [0.3, 1], clamp);
  const tinte = interpolate(t, [T.tinen, T.tinen + 1], [0.1, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.llegan, T.polluelos], [1, 1.04])}>
        <rect x={100} y={1100} width={880} height={120} fill={mezcla("#E0B090", "#F0A0A0", tinte * 0.6)} />
        <rect x={100} y={1220} width={880} height={60} rx={30} fill="#8A1A2A" opacity={aparece(t, T.llegan)} />
        {new Array(8).fill(0).map((_, k) => {
          const u = (t * 0.3 + k / 8) % 1;
          return <circle key={k} cx={130 + u * 820} cy={1250} r={10} fill={NARANJA} opacity={aparece(t, T.llegan)} />;
        })}
        {[0, 1, 2, 3, 4].map((k) => (
          <Pluma key={k} x={220 + k * 160} y={1100} h={(260 + (k % 2) * 60) * crece} k={tinte} />
        ))}
        <Texto x={540} y={1380} size={38} color={C.white} op={aparece(t, T.llegan)}>
          piel y plumas que crecen
        </Texto>
        <Texto x={540} y={560} size={46} color={ROSA} op={aparece(t, T.tinen)}>
          ¡se tiñen de rosa!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.tinen} color={ROSA} />
    </>
  );
};

// F. Los polluelos son grises: aún no han comido suficientes pigmentos
export const Polluelos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.polluelos, T.sin], [1, 1.04])}>
      <Polluelo x={540} y={950} s={1.8} />
      <g opacity={aparece(t, T.pigmentos)}>
        <Texto x={540} y={1330} size={38} color={C.white}>
          pigmentos acumulados
        </Texto>
        <rect x={290} y={1360} width={500} height={30} rx={10} fill="#2A2440" />
        <rect x={290} y={1360} width={500 * 0.12} height={30} rx={10} fill={NARANJA} />
      </g>
    </Lienzo>
  );
};

// G. Sin pigmentos, las plumas nuevas salen pálidas; en los zoológicos se los añaden a la comida
export const SinPigmento: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pal = interpolate(t, [T.sin, T.palidas + 0.5], [0, 1], clamp);
  const zoo = interpolate(t, [T.comida, T.porEso], [0, 1], clamp);
  const col = mezcla(ROSA, "#E8DCE0", pal * (1 - zoo));
  return (
    <Lienzo zoom={interpolate(t, [T.sin, T.porEso], [1, 1.04])}>
      <Flamenco x={420} y={940} s={0.9} col={col} t={t} />
      <Texto x={540} y={1430} size={40} color={C.grey} op={aparece(t, T.palidas) * (1 - aparece(t, T.zoologicos))}>
        plumas nuevas: pálidas
      </Texto>
      <g opacity={aparece(t, T.zoologicos)}>
        <path d="M 680 1300 L 960 1300 L 930 1380 L 710 1380 Z" fill="#5A5A66" />
        {new Array(8).fill(0).map((_, k) => (
          <circle key={k} cx={720 + k * 30} cy={1290 - (k % 2) * 14} r={12} fill={NARANJA} />
        ))}
        <Texto x={540} y={1470} size={38} color={NARANJA}>
          zoológicos: pigmento en la comida
        </Texto>
      </g>
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
