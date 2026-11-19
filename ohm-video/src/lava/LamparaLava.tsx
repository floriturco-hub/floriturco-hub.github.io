import narracion from "../../guion/lava/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Apagada,
  Bucle,
  Calor,
  Ciclo,
  Cierre,
  Enfria,
  Gancho,
  Liquidos,
  T,
} from "./Escenas";

export const DURACION_LAVA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const LamparaLava: React.FC = () => (
  <Short
    carpeta="lava"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.sube, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.sube, hasta: T.dentro, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Líquidos", desde: T.dentro, hasta: T.abajo, render: (t0) => <Liquidos t0={t0} /> },
      { nombre: "Calor", desde: T.abajo, hasta: T.arriba, render: (t0) => <Calor t0={t0} /> },
      { nombre: "Enfría", desde: T.arriba, hasta: T.llegar, render: (t0) => <Enfria t0={t0} /> },
      { nombre: "Ciclo", desde: T.llegar, hasta: T.si, render: (t0) => <Ciclo t0={t0} /> },
      { nombre: "Apagada", desde: T.si, hasta: T.porEso, render: (t0) => <Apagada t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Agua + cera", T.cera, T.abajo, C.white],
      ["Densidad: sube y baja", T.ligera, T.arriba, C.yellow],
      ["Convección", T.ciclo, T.si, C.cyan],
    ]}
    tics={[0.6, T.cera, T.expande, T.cae, T.ciclo, T.dormida]}
  />
);
