import narracion from "../../guion/clasificadora/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Analisis,
  Bucle,
  Cierre,
  Disparo,
  Escaneo,
  Gancho,
  T,
} from "./Escenas";

export const DURACION_CLASIFICADORA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const ClasificadoraPapas: React.FC = () => (
  <Short
    carpeta="clasificadora"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.clasificadora, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.clasificadora, hasta: T.banda, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Escaneo", desde: T.banda, hasta: T.computadora, render: (t0) => <Escaneo t0={t0} /> },
      { nombre: "Analisis", desde: T.computadora, hasta: T.valvula, render: (t0) => <Analisis t0={t0} /> },
      { nombre: "Disparo", desde: T.valvula, hasta: T.asi, render: (t0) => <Disparo t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Expulsión neumática", T.valvula, T.asi, C.cyan],
    ]}
    tics={[0.6, T.mancha, T.milesimas]}
  />
);
