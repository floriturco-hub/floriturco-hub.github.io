import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { Escena } from "../components/Escena";
import { Etiqueta } from "../components/Etiqueta";
import { Fondo } from "../components/Fondo";
import { Logo } from "../scenes/Logo";
import { C } from "../theme";
import {
  Boton,
  Cierre,
  Gancho,
  Harvard,
  Libros,
  Mapa,
  Origen,
  Prueba,
  Realidad,
  T,
} from "./Escenas";
import { SABOR } from "./Piezas";

export const INICIO_LOGO_LENGUA = T.fin + 0.5;
export const DURACION_LENGUA_S = INICIO_LOGO_LENGUA + 6.5;
const D = INICIO_LOGO_LENGUA - 61.5;

export const MapaLengua: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fondo />
      <Escena nombre="Gancho: falso" desde={0} hasta={T.segun}>
        {(t0) => <Gancho t0={t0} />}
      </Escena>
      <Escena nombre="El mapa" desde={T.segun} hasta={T.pero}>
        {(t0) => <Mapa t0={t0} />}
      </Escena>
      <Escena nombre="Prueba del azúcar" desde={T.pero} hasta={T.donde}>
        {(t0) => <Prueba t0={t0} />}
      </Escena>
      <Escena nombre="1901" desde={T.donde} hasta={T.decadas}>
        {(t0) => <Origen t0={t0} />}
      </Escena>
      <Escena nombre="Harvard" desde={T.decadas} hasta={T.libros}>
        {(t0) => <Harvard t0={t0} />}
      </Escena>
      <Escena nombre="Libros" desde={T.libros} hasta={T.realidad}>
        {(t0) => <Libros t0={t0} />}
      </Escena>
      <Escena nombre="Realidad" desde={T.realidad} hasta={T.cada}>
        {(t0) => <Realidad t0={t0} />}
      </Escena>
      <Escena nombre="Botón gustativo" desde={T.cada} hasta={T.asi}>
        {(t0) => <Boton t0={t0} />}
      </Escena>
      <Escena nombre="Cierre" desde={T.asi} hasta={INICIO_LOGO_LENGUA}>
        {(t0) => <Cierre t0={t0} />}
      </Escena>
      <Escena
        nombre="Logo"
        desde={INICIO_LOGO_LENGUA}
        hasta={DURACION_LENGUA_S}
      >
        {(t0) => <Logo t0={t0} inicio={INICIO_LOGO_LENGUA} />}
      </Escena>

      <Etiqueta
        texto="El mapa del colegio"
        desde={0.15}
        hasta={T.falso - 0.1}
        y={1560}
        color={C.white}
        tamano={52}
      />
      <Etiqueta
        texto="Es falso"
        desde={T.falso}
        hasta={T.pizca - 0.1}
        y={1560}
        color={C.red}
        tamano={64}
      />
      <Etiqueta
        texto="Compruébalo con azúcar"
        desde={T.pizca - 0.6}
        hasta={T.segun - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Según el mapa"
        desde={T.segun}
        hasta={T.pero - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Azúcar al fondo"
        desde={T.pon}
        hasta={T.notas - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Sabe dulce igual"
        desde={T.notas}
        hasta={T.donde - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="¿De dónde salió?"
        desde={T.donde}
        hasta={T.minimas - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Diferencias mínimas"
        desde={T.minimas}
        hasta={T.decadas - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Datos exagerados"
        desde={T.grafica}
        hasta={T.libros - 0.1}
        y={1560}
        color={C.orange}
      />
      <Etiqueta
        texto="Zonas exclusivas"
        desde={T.exclusivas}
        hasta={T.realidad - 0.1}
        y={1560}
        color={C.red}
      />
      <Etiqueta
        texto="La realidad"
        desde={T.realidad}
        hasta={T.miles - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Miles de botones gustativos"
        desde={T.miles}
        hasta={T.paladar - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="También paladar y garganta"
        desde={T.paladar}
        hasta={T.cada - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Cada uno: los 5 sabores"
        desde={T.cinco}
        hasta={T.umami - 0.1}
        y={1560}
        color={C.yellow}
      />
      <Etiqueta
        texto="Umami: caldo y queso"
        desde={T.umami}
        hasta={T.asi - 0.1}
        y={1560}
        color={SABOR.umami}
      />
      <Etiqueta
        texto="Tu lengua no tiene barrios"
        desde={T.barrios - 0.4}
        hasta={T.rincon - 0.1}
        y={1560}
        color={C.white}
      />
      <Etiqueta
        texto="Cada rincón lo saborea todo"
        desde={T.rincon}
        hasta={T.fin + 0.4}
        y={1560}
        color={C.yellow}
        tamano={48}
      />

      <Audio src={staticFile("audio/lengua/narracion.wav")} />
      <Audio
        src={staticFile("audio/musica.mp3")}
        volume={(f) =>
          interpolate(
            f / fps,
            [
              0,
              1.5,
              INICIO_LOGO_LENGUA - 0.3,
              INICIO_LOGO_LENGUA + 0.7,
              DURACION_LENGUA_S - 1.5,
              DURACION_LENGUA_S,
            ],
            [0, 0.1, 0.1, 0.225, 0.225, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {[T.falso, T.notas, T.grafica, T.exclusivas, T.umami, T.barrios].map(
        (tc) => (
          <Sequence
            key={tc}
            name="Tic"
            from={Math.round(tc * fps)}
            durationInFrames={Math.round(0.3 * fps)}
          >
            <Audio src={staticFile("audio/choque.wav")} volume={0.45} />
          </Sequence>
        ),
      )}
      <Sequence
        name="SFX logo"
        from={Math.round((62.35 + D) * fps)}
        durationInFrames={Math.round(2.9 * fps)}
      >
        <Audio src={staticFile("audio/sfx_logo.wav")} volume={0.7} />
      </Sequence>
      <Sequence
        name="Voz: Frecuencia Cero"
        from={Math.round((63.75 + D) * fps)}
        durationInFrames={Math.round(1.7 * fps)}
      >
        <Audio src={staticFile("audio/frecuencia_cero.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};
