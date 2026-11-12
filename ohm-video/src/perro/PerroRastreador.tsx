import narracion from "../../guion/perro/narracion.json";
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
  Compara,
  Gancho,
  Gradiente,
  Nariz,
  Olor,
  Sigue,
  T,
} from "./Escenas";

export const DURACION_PERRO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const PerroRastreador: React.FC = () => (
  <Short
    carpeta="perro"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho: pisadas", desde: 0, hasta: T.y, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.y, hasta: T.cada, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Olor", desde: T.cada, hasta: T.vieja, render: (t0) => <Olor t0={t0} /> },
      { nombre: "Gradiente", desde: T.vieja, hasta: T.perro, render: (t0) => <Gradiente t0={t0} /> },
      { nombre: "Compara", desde: T.perro, hasta: T.logra, render: (t0) => <Compara t0={t0} /> },
      { nombre: "Nariz", desde: T.logra, hasta: T.asi, render: (t0) => <Nariz t0={t0} /> },
      { nombre: "Sigue", desde: T.asi, hasta: T.porque, render: (t0) => <Sigue t0={t0} /> },
      { nombre: "Cierre", desde: T.porque, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Gradiente de olor", T.nueva, T.perro, C.yellow],
      ["50 veces más receptores", T.contra, T.fosa, C.white],
      ["Olfato estéreo", T.separado, T.asi, C.cyan],
    ]}
    tics={[1.12, T.cinco, T.evaporarse, T.nueva, T.receptores, T.fugitivo]}
  />
);
