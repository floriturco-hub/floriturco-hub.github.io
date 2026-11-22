import narracion from "../../guion/pieseis/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Cierre,
  Contra,
  Gancho,
  Lado,
  Sincronia,
  Truco,
  T,
} from "./Escenas";

export const DURACION_PIESEIS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const PieSeis: React.FC = () => (
  <Short
    carpeta="pieseis"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.sentado, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.sentado, hasta: T.contra, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Contra", desde: T.contra, hasta: T.controla, render: (t0) => <Contra t0={t0} /> },
      { nombre: "Lado", desde: T.controla, hasta: T.sincronizar, render: (t0) => <Lado t0={t0} /> },
      { nombre: "Sincronia", desde: T.sincronizar, hasta: T.truco, render: (t0) => <Sincronia t0={t0} /> },
      { nombre: "Truco", desde: T.truco, hasta: T.porEso, render: (t0) => <Truco t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Acoplamiento motor", T.sincronizar, T.truco, C.yellow],
    ]}
    tics={[0.6, T.solo, T.copiando]}
  />
);
