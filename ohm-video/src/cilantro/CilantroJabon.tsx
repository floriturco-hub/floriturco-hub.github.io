import narracion from "../../guion/cilantro/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Aldehidos,
  Bucle,
  Cierre,
  Gancho,
  Gen,
  Machacar,
  ReceptorOR,
  Sabor,
  Siete,
  T,
} from "./Escenas";

export const DURACION_CILANTRO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CilantroJabon: React.FC = () => (
  <Short
    carpeta="cilantro"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho: cilantro", desde: 0, hasta: T.y, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.y, hasta: T.tiene, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Aldehídos", desde: T.tiene, hasta: T.para, render: (t0) => <Aldehidos t0={t0} /> },
      { nombre: "Receptor", desde: T.para, hasta: T.hay, render: (t0) => <ReceptorOR t0={t0} /> },
      { nombre: "Gen", desde: T.hay, hasta: T.ellas, render: (t0) => <Gen t0={t0} /> },
      { nombre: "Sabor", desde: T.ellas, hasta: T.siete, render: (t0) => <Sabor t0={t0} /> },
      { nombre: "Uno de cada siete", desde: T.siete, hasta: T.buena, render: (t0) => <Siete t0={t0} /> },
      { nombre: "Machacar", desde: T.buena, hasta: T.porque, render: (t0) => <Machacar t0={t0} /> },
      { nombre: "Cierre", desde: T.porque, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Es genético", T.gen, T.ellas, C.yellow],
      ["Entre 4 y 21 % según el país", T.siete + 1.4, T.buena, C.white],
      ["Truco: machácalo", T.machacas, T.porque, C.cyan],
    ]}
    tics={[1.5, T.aldehidos, T.or6a2 + 0.4, T.fuerza, T.soloJabon, T.enzimas]}
  />
);
