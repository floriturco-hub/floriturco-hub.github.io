import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/ceramica/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  ceramica: 2.72, // ceramica
  oxida: 3.80, // oxida
  filo: 5.18, // filo
  cae: 6.30, // cae
  parte: 6.94, // parte
  final: 7.82, // final
  hueso: 9.58, // hueso
  circonio: 11.52, // circonio
  oxigeno: 13.78, // oxigeno
  oxido: 15.76, // oxido
  oxidar: 17.40, // oxidar
  duro: 19.00, // duro
  desgasta: 21.36, // desgasta
  metal: 22.42, // metal
  deslizan: 23.52, // deslizan
  dobla: 25.32, // dobla
  enlaces: 27.86, // enlaces
  grieta: 31.44, // grieta
  corre: 31.82, // corre
  huesos: 34.18, // huesos
  mejor: 35.84, // mejor
  porEso: 37.28, // por
  fin: 39.20, // FIN
};

const CER = "#F4F4F0";

// Cuchillo: hoja blanca y mango negro; roto 0..1 separa las dos mitades
const Cuchillo: React.FC<{ readonly x: number; readonly y: number; readonly rot?: number; readonly roto?: number; readonly s?: number; readonly hoja?: string }> = ({ x, y, rot = 0, roto = 0, s = 1, hoja = CER }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <g transform={`translate(${-30 * roto} ${20 * roto}) rotate(${-8 * roto})`}>
      <rect x={-330} y={-30} width={200} height={60} rx={20} fill="#2A2A2A" />
      <path d="M -130 -40 L 30 -40 L 30 40 L -130 30 Z" fill={hoja} />
    </g>
    <g transform={`translate(${40 * roto} ${30 * roto}) rotate(${12 * roto})`}>
      <path d="M 30 -40 L 250 -40 Q 320 -30 340 20 L 30 40 Z" fill={hoja} />
    </g>
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Cuchillo x={500} y={1000} rot={-10 + 2 * Math.sin(t * 2)} roto={0.6} s={1.05} />
    <Texto x={880} y={620} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este cuchillo se rompe así?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.ceramica], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Nunca se oxida y dura años con filo, pero si se cae, se parte + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const y = interpolate(t, [T.cae, T.parte], [1000, 1380], clamp);
  const roto = interpolate(t, [T.parte, T.parte + 0.2], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.ceramica, T.circonio], [1, 1.04])}>
        <rect x={0} y={1440} width={1080} height={20} fill="#4A5060" />
        <Cuchillo x={560} y={y} rot={interpolate(t, [T.cae, T.parte], [0, 12], clamp)} roto={roto} s={1.1} />
        <Texto x={300} y={760} size={34} color="#5AD08A" op={aparece(t, T.oxida)}>
          no se oxida
        </Texto>
        <Texto x={760} y={760} size={34} color="#5AD08A" op={aparece(t, T.filo)}>
          filo por años
        </Texto>
        <Texto x={560} y={1540} size={44} color={C.orange} op={roto}>
          ¡crac!
        </Texto>
        <g opacity={aparece(t, T.final)}>
          <Texto x={540} y={470} color={C.white} size={34}>
            ¿por qué no cortar hueso?: al final
          </Texto>
          <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
          <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.circonio], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
        </g>
      </Lienzo>
      <Flash t={t} d={T.parte} color={C.white} />
    </>
  );
};

// C. Es óxido de circonio: ya está unido al oxígeno, no tiene nada más que oxidar
export const Oxido: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.circonio, T.duro], [1, 1.04])}>
      <Texto x={540} y={640} size={52} color={C.white} op={aparece(t, T.circonio)}>
        ZrO2
      </Texto>
      <Texto x={540} y={710} size={34} color={C.grey} op={aparece(t, T.circonio)}>
        óxido de circonio
      </Texto>
      {/* red: Zr (grande) y O (pequeño) */}
      {new Array(4).fill(0).map((_, i) =>
        new Array(3).fill(0).map((_, j) => (
          <g key={`${i}-${j}`} opacity={aparece(t, T.oxigeno)}>
            <circle cx={300 + i * 160} cy={900 + j * 160} r={40} fill="#B8C0D0" />
            <circle cx={380 + i * 160} cy={980 + j * 160} r={24} fill={C.cyan} opacity={j < 2 ? 1 : 0} />
          </g>
        )),
      )}
      <Texto x={540} y={1420} size={36} color={C.cyan} op={aparece(t, T.oxido)}>
        ya está unido al oxígeno
      </Texto>
      <Texto x={540} y={1490} size={36} color={C.yellow} op={aparece(t, T.oxidar)}>
        no tiene nada más que oxidar
      </Texto>
    </Lienzo>
  );
};

// D. Más duro que el acero: su filo casi no se desgasta
export const Duro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.duro, T.metal], [1, 1.04])}>
      <Cuchillo x={560} y={900} s={1.2} />
      <Cuchillo x={560} y={1200} s={1.2} hoja="#9AA2B4" />
      <Texto x={200} y={820} size={30} color={C.white}>
        cerámica
      </Texto>
      <Texto x={200} y={1120} size={30} color={C.grey}>
        acero
      </Texto>
      <Texto x={540} y={640} size={40} color={C.yellow} op={aparece(t, T.duro)}>
        más dura que el acero
      </Texto>
      <Texto x={540} y={1420} size={36} color="#5AD08A" op={aparece(t, T.desgasta)}>
        el filo casi no se desgasta
      </Texto>
    </Lienzo>
  );
};

// Red de átomos: desliz = desplazamiento de las filas de arriba; grieta 0..1
const Red: React.FC<{ readonly desliz: number; readonly grieta: number; readonly col: string }> = ({ desliz, grieta, col }) => (
  <g>
    {new Array(7).fill(0).map((_, i) =>
      new Array(6).fill(0).map((_, j) => {
        const dx = j < 3 ? desliz * 110 : 0;
        const gx = grieta > 0 && j >= 3 ? 0 : 0;
        const sep = grieta > 0 && i >= 3 ? grieta * 40 : 0;
        return <circle key={`${i}-${j}`} cx={230 + i * 105 + dx + sep + gx} cy={780 + j * 105} r={40} fill={col} />;
      }),
    )}
    {grieta > 0 ? <path d={`M 540 ${760} L ${560} ${760 + 640 * grieta}`} stroke={C.orange} strokeWidth={8} /> : null}
  </g>
);

// E. En un metal los átomos se deslizan y se dobla antes de romperse
export const Metal: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const d = interpolate(t, [T.deslizan, T.dobla + 0.5], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.metal, T.enlaces], [1, 1.04])}>
        <Red desliz={d} grieta={0} col="#9AA2B4" />
        <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.metal)}>
          en un metal…
        </Texto>
        <Texto x={540} y={1440} size={38} color={C.cyan} op={aparece(t, T.deslizan)}>
          los átomos se deslizan: se dobla
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.deslizan} color={C.cyan} />
    </>
  );
};

// F. En la cerámica los enlaces son rígidos; una grieta corre de lado a lado
export const Grieta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const g = interpolate(t, [T.grieta, T.corre + 0.4], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.enlaces, T.huesos], [1, 1.04])}>
        <Red desliz={0} grieta={g} col={CER} />
        <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.enlaces)}>
          cerámica: enlaces rígidos
        </Texto>
        <Texto x={540} y={1440} size={40} color={C.orange} op={aparece(t, T.corre)}>
          la grieta corre de lado a lado
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.corre} color={C.orange} />
    </>
  );
};

// G. Con huesos o comida congelada, mejor uno de acero
export const Consejo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.huesos, T.porEso], [1, 1.04])}>
      <g opacity={aparece(t, T.huesos)}>
        <path d="M 260 900 L 820 900" stroke="#F0E8D8" strokeWidth={60} strokeLinecap="round" />
        {[260, 820].map((x) => (
          <g key={x}>
            <circle cx={x} cy={870} r={40} fill="#F0E8D8" />
            <circle cx={x} cy={930} r={40} fill="#F0E8D8" />
          </g>
        ))}
        <rect x={420} y={1040} width={240} height={160} rx={20} fill="#C8E8FF" opacity={0.6} />
        <Texto x={540} y={1130} size={30} color="#1A2A3A">
          congelado
        </Texto>
      </g>
      <Cuchillo x={560} y={1360} s={0.9} hoja="#9AA2B4" />
      <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.huesos)}>
        huesos o comida congelada
      </Texto>
      <Texto x={540} y={1490} size={40} color={C.yellow} op={aparece(t, T.mejor)}>
        mejor uno de acero
      </Texto>
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
