import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import {
  Altura,
  Cierre,
  Forma,
  Gancho,
  Investigacion,
  Ruta,
  Sobreenfriada,
  Sobrevelocidad,
  T,
} from "./Escenas";

export const DURACION_JETFLORIDA_S = duracionShort(T.fin);

// Noticia: accidente del Learjet 60 en Palm Beach (1 nov 2026). Tono sobrio: sin tics de choque.
export const JetFlorida: React.FC = () => (
  <Short
    carpeta="jetflorida"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: 77 segundos",
        desde: 0,
        hasta: T.domingo,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "La noticia",
        desde: T.domingo,
        hasta: T.altura,
        render: (t0) => <Ruta t0={t0} />,
      },
      {
        nombre: "A 35.000 pies",
        desde: T.altura,
        hasta: T.fenomeno,
        render: (t0) => <Altura t0={t0} />,
      },
      {
        nombre: "Agua sobreenfriada",
        desde: T.fenomeno,
        hasta: T.forma,
        render: (t0) => <Sobreenfriada t0={t0} />,
      },
      {
        nombre: "Forma del ala",
        desde: T.forma,
        hasta: T.pidieron,
        render: (t0) => <Forma t0={t0} />,
      },
      {
        nombre: "Sobrevelocidad",
        desde: T.pidieron,
        hasta: T.encontraron,
        render: (t0) => <Sobrevelocidad t0={t0} />,
      },
      {
        nombre: "Investigación",
        desde: T.encontraron,
        hasta: T.cada,
        render: (t0) => <Investigacion t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.cada,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡11 km en 77 segundos!", 0, T.domingo, C.yellow, 56],
      ["Texas - Bahamas: 9 a bordo", T.murieron, T.altura, C.white],
      ["-47 °C a 35.000 pies", T.menos47, T.hielo, C.cyan],
      ["Turbulencia y hielo", T.hielo, T.sobreenfriada, C.white],
      ["Agua sobreenfriada", T.sobreenfriada, T.chocan, C.cyan],
      ["Se congela al chocar", T.congelan, T.forma, C.cyan],
      ["Cambia la forma del ala", T.forma, T.pidieron, C.white],
      ["Sobrevelocidad", T.sobrevelocidad, T.piezas, C.red],
      ["Piezas de la cola, lejos", T.encontraron, T.causa, C.yellow],
      ["Aún sin causa oficial", T.causa, T.cada, C.white],
      ["Entender para volar más seguro", T.cada, T.fin + 0.5, C.yellow, 42],
    ]}
    tics={[]}
  />
);
