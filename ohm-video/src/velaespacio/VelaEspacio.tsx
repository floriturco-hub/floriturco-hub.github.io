import narracion from "../../guion/velaespacio/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Apaga,
  Bucle,
  Cierre,
  Conveccion,
  Esfera,
  Gancho,
  T,
} from "./Escenas";

export const DURACION_VELAESPACIO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const VelaEspacio: React.FC = () => (
  <Short
    carpeta="velaespacio"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.tierra, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.tierra, hasta: T.sube, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Conveccion", desde: T.sube, hasta: T.espacio, render: (t0) => <Conveccion t0={t0} /> },
      { nombre: "Esfera", desde: T.espacio, hasta: T.fria, render: (t0) => <Esfera t0={t0} /> },
      { nombre: "Apaga", desde: T.fria, hasta: T.porEso, render: (t0) => <Apaga t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Convección", T.sube, T.espacio, C.orange],
      ["Difusión", T.oxigeno, T.fria, C.yellow],
    ]}
    tics={[0.6, T.esfera2, T.apaga]}
  />
);
