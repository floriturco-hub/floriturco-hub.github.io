import narracion from "../../guion/chile/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Aceite,
  Alarma,
  Bucle,
  Cierre,
  Encaja,
  Gancho,
  Leche,
  Sensor,
  T,
} from "./Escenas";

export const DURACION_CHILE_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const ChileAgua: React.FC = () => (
  <Short
    carpeta="chile"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho: chile", desde: 0, hasta: T.no, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.no, hasta: T.capsa, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Sensor", desde: T.capsa, hasta: T.encaja, render: (t0) => <Sensor t0={t0} /> },
      { nombre: "Encaja", desde: T.encaja, hasta: T.cerebro, render: (t0) => <Encaja t0={t0} /> },
      { nombre: "Alarma", desde: T.cerebro, hasta: T.pero, render: (t0) => <Alarma t0={t0} /> },
      { nombre: "Aceite", desde: T.pero, hasta: T.leche, render: (t0) => <Aceite t0={t0} /> },
      { nombre: "Leche", desde: T.leche, hasta: T.porque, render: (t0) => <Leche t0={t0} /> },
      { nombre: "Cierre", desde: T.porque, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Falsa alarma de calor", T.abre, T.cerebro, C.yellow],
      ["El agua la esparce", T.reparte, T.leche, C.red],
      ["Mejor: leche", T.leche + 0.4, T.porque, C.white],
    ]}
    tics={[0.46, T.capsaicina, T.grados, T.abre, T.fuego, T.atrapan]}
  />
);
