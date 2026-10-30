import { Easing, interpolate } from "remotion";
import { Cara } from "../components/Cara";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Pantalla de un directo a tamaño grande (espacio de pantalla): contador, comentarios, corazones y los cuatro pasos
const X = 230;
const Y = 360;
const ANCHO = 620;
const ALTO = 1140;

const COMENTARIOS = [
  { nombre: "Ana", texto: "¿cómo empiezo?" },
  { nombre: "Leo", texto: "¡primera vez aquí!" },
  { nombre: "Sofi", texto: "me encanta este tema" },
  { nombre: "Dani", texto: "¿a qué hora vuelves?" },
  { nombre: "Mar", texto: "saludos desde Lima" },
  { nombre: "Iván", texto: "explica lo del sueño" },
  { nombre: "Carla", texto: "¡qué buen directo!" },
  { nombre: "Tomás", texto: "te sigo desde ya" },
];

const miles = (v: number) => {
  if (v >= 1000) {
    return `${(v / 1000).toFixed(1).replace(".", ",")} K`;
  }
  return String(Math.round(v));
};

export const Pantalla: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const o = interpolate(t, [T.live - 0.1, T.live + 0.5, T.dinero - 0.5, T.dinero], [0, 1, 1, 0], clamp);
  if (o <= 0) {
    return null;
  }
  const escala = interpolate(t, [T.live - 0.1, T.live + 0.5], [0.7, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });

  // Espectadores: suben cuando la gente se queda
  const vistas = interpolate(t, [T.live, T.queda, T.mostrar + 1.5, T.estrategia, T.dinero], [12, 40, 1240, 1500, 3800], clamp);
  const alcance = interpolate(t, [T.mostrar - 0.2, T.mostrar + 0.4, T.crecimiento, T.crecimiento + 0.4], [0, 1, 1, 0], clamp);

  // Comentarios que suben
  const comentarios = interpolate(t, [T.comenta - 0.2, T.comenta + 0.3], [0, 1], clamp);
  const desplaza = Math.max(0, t - T.comenta) * 1.1;

  // Los cuatro pasos dentro del directo
  const paso1 = interpolate(t, [T.tema - 0.1, T.tema + 0.4], [0, 1], clamp);
  const paso2 = interpolate(t, [T.horario - 0.1, T.horario + 0.4], [0, 1], clamp);
  const paso3 = interpolate(t, [T.saluda - 0.1, T.saluda + 0.4, T.cuatro, T.cuatro + 0.4], [0, 1, 1, 0], clamp);
  const paso4 = interpolate(t, [T.recorta - 0.1, T.recorta + 0.4], [0, 1], clamp);
  const pasoActivo = t >= T.cuatro ? 4 : t >= T.tres ? 3 : t >= T.dos ? 2 : t >= T.uno ? 1 : 0;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="fondo-pantalla-lv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A2A6A" />
          <stop offset="1" stopColor="#120E28" />
        </linearGradient>
        <clipPath id="pantalla-lv">
          <rect x={X + 16} y={Y + 16} width={ANCHO - 32} height={ALTO - 32} rx={46} />
        </clipPath>
      </defs>
      <g opacity={o} transform={`translate(540 ${Y + ALTO / 2}) scale(${escala}) translate(-540 ${-(Y + ALTO / 2)})`}>
        {/* Marco del teléfono */}
        <rect x={X} y={Y} width={ANCHO} height={ALTO} rx={60} fill="#0A0818" stroke="#C8C4D8" strokeWidth={6} />
        <g clipPath="url(#pantalla-lv)">
          <rect x={X} y={Y} width={ANCHO} height={ALTO} fill="url(#fondo-pantalla-lv)" />
          {/* El creador en cámara */}
          <path d="M 400 1500 C 400 1200, 470 1130, 560 1120 C 660 1120, 720 1200, 720 1500 Z" fill="#C8603A" />
          <Cara x={540} y={980} escala={1.35} ojos={1} />
          <circle cx={710} cy={760} r={120} fill="none" stroke="#FFF8E6" strokeWidth={6} opacity={0.12} />

          {/* Barra superior: LIVE, espectadores */}
          <rect x={X + 40} y={Y + 50} width={110} height={44} rx={12} fill="#E8414F" />
          <text x={X + 95} y={Y + 81} textAnchor="middle" fill="#FFFFFF" fontFamily={mono} fontSize={26} fontWeight={700}>
            LIVE
          </text>
          <rect x={X + 162} y={Y + 50} width={170} height={44} rx={12} fill="rgba(0,0,0,0.45)" />
          <circle cx={X + 188} cy={Y + 72} r={9} fill="none" stroke="#FFFFFF" strokeWidth={3} />
          <circle cx={X + 188} cy={Y + 72} r={3} fill="#FFFFFF" />
          <text x={X + 208} y={Y + 82} fill="#FFFFFF" fontFamily={mono} fontSize={26} fontWeight={700}>
            {miles(vistas)}
          </text>

          {/* Paso 1: título con tema claro */}
          <g opacity={paso1}>
            <rect x={X + 40} y={Y + 110} width={ANCHO - 80} height={60} rx={14} fill={pasoActivo === 1 ? C.yellow : "rgba(0,0,0,0.45)"} />
            <text x={X + 60} y={Y + 150} fill={pasoActivo === 1 ? "#1A1430" : "#FFFFFF"} fontFamily={mono} fontSize={28} fontWeight={700}>
              Ciencia en 60 s: ¿por qué...?
            </text>
          </g>
          {/* Paso 2: horario fijo */}
          <g opacity={paso2}>
            <rect x={X + 40} y={Y + 184} width={300} height={52} rx={14} fill={pasoActivo === 2 ? C.yellow : "rgba(0,0,0,0.45)"} />
            <rect x={X + 56} y={Y + 196} width={28} height={28} rx={4} fill="none" stroke={pasoActivo === 2 ? "#1A1430" : "#FFFFFF"} strokeWidth={3} />
            <line x1={X + 56} y1={Y + 205} x2={X + 84} y2={Y + 205} stroke={pasoActivo === 2 ? "#1A1430" : "#FFFFFF"} strokeWidth={3} />
            <text x={X + 96} y={Y + 220} fill={pasoActivo === 2 ? "#1A1430" : "#FFFFFF"} fontFamily={mono} fontSize={24} fontWeight={700}>
              martes 20:00
            </text>
          </g>

          {/* Alcance: flechas hacia otras personas */}
          {alcance > 0 ? (
            <g opacity={alcance}>
              {[0, 1, 2, 3, 4].map((k) => {
                const p = (t * 0.8 + k / 5) % 1;
                return (
                  <g key={k} transform={`translate(${X + ANCHO - 80} ${Y + 700 - p * 400})`} opacity={1 - p}>
                    <circle r={18} fill={C.cyan} />
                    <circle cy={-6} r={6} fill="#0A0818" />
                    <path d="M -10 10 q 10 -10 20 0" fill="#0A0818" />
                  </g>
                );
              })}
            </g>
          ) : null}

          {/* Corazones */}
          {new Array(8).fill(0).map((_, i) => {
            const p = (t * 0.5 + i / 8) % 1;
            const x = X + ANCHO - 70 + Math.sin(p * 8 + i) * 22;
            const y = Y + ALTO - 220 - p * 420;
            return (
              <path
                key={i}
                d={`M ${x} ${y + 12} C ${x - 22} ${y - 4}, ${x - 12} ${y - 22}, ${x} ${y - 8} C ${x + 12} ${y - 22}, ${x + 22} ${y - 4}, ${x} ${y + 12} Z`}
                fill={i % 3 === 0 ? C.yellow : "#FF5A8A"}
                opacity={(1 - p) * comentarios}
              />
            );
          })}

          {/* Comentarios */}
          <g opacity={comentarios}>
            {COMENTARIOS.map((c, i) => {
              const fila = i - desplaza;
              if (fila < -0.5 || fila > 4.5) {
                return null;
              }
              const y = Y + ALTO - 130 - (4 - fila) * 62;
              const resaltado = pasoActivo === 3 && c.nombre === "Ana";
              return (
                <g key={i} opacity={interpolate(fila, [-0.5, 0.3, 4, 4.5], [0, 1, 1, 0], clamp)}>
                  <rect x={X + 36} y={y - 36} width={c.texto.length * 15 + c.nombre.length * 15 + 60} height={48} rx={24} fill={resaltado ? C.yellow : "rgba(0,0,0,0.45)"} />
                  <text x={X + 56} y={y - 3} fill={resaltado ? "#1A1430" : C.yellow} fontFamily={mono} fontSize={22} fontWeight={700}>
                    {c.nombre}
                  </text>
                  <text x={X + 66 + c.nombre.length * 14} y={y - 3} fill={resaltado ? "#1A1430" : "#FFFFFF"} fontFamily={mono} fontSize={22}>
                    {c.texto}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Paso 3: respuesta por el nombre */}
          <g opacity={paso3}>
            <rect x={X + 150} y={Y + 560} width={320} height={70} rx={35} fill={C.yellow} />
            <path d={`M ${X + 200} ${Y + 628} l -20 30 l 50 -30 Z`} fill={C.yellow} />
            <text x={X + 310} y={Y + 606} textAnchor="middle" fill="#1A1430" fontFamily={mono} fontSize={32} fontWeight={700}>
              ¡Hola, Ana!
            </text>
          </g>

          {/* Paso 4: recortar momentos y subirlos como videos */}
          {paso4 > 0 ? (
            <g opacity={paso4}>
              <g transform={`translate(${X + ANCHO / 2} ${Y + 420}) rotate(${Math.sin(t * 10) * 15})`}>
                <circle cx={-18} cy={30} r={14} fill="none" stroke="#FFFFFF" strokeWidth={5} />
                <circle cx={18} cy={30} r={14} fill="none" stroke="#FFFFFF" strokeWidth={5} />
                <line x1={-10} y1={18} x2={20} y2={-40} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
                <line x1={10} y1={18} x2={-20} y2={-40} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
              </g>
              {[0, 1, 2].map((k) => {
                const p = interpolate(t, [T.recorta + 0.4 + k * 0.4, T.recorta + 1.4 + k * 0.4], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
                return (
                  <g key={k} opacity={p} transform={`translate(${X + ANCHO / 2 + p * (k - 1) * 170} ${Y + 470 + p * 90})`}>
                    <rect x={-56} y={-90} width={112} height={180} rx={14} fill="#1A1430" stroke={C.yellow} strokeWidth={4} />
                    <polygon points="-14,-18 20,0 -14,18" fill={C.yellow} />
                  </g>
                );
              })}
            </g>
          ) : null}
        </g>
      </g>
    </svg>
  );
};
