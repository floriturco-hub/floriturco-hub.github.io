import narracion from "../../guion/martillo/narracion.json";
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
  Gancho,
  Hierro,
  Iman1,
  Tierra,
  Zonas,
  T,
} from "./Escenas";

export const DURACION_MARTILLO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const ImanMartillo: React.FC = () => (
  <Short
    carpeta="martillo"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.golpeas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.golpeas, hasta: T.dominios, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Dominios", desde: T.dominios, hasta: T.apuntan, render: (t0) => <Zonas t0={t0} /> },
      { nombre: "Imán golpeado", desde: T.apuntan, hasta: T.comun, render: (t0) => <Iman1 t0={t0} /> },
      { nombre: "Hierro", desde: T.comun, hasta: T.si, render: (t0) => <Hierro t0={t0} /> },
      { nombre: "Campo terrestre", desde: T.si, hasta: T.porEso, render: (t0) => <Tierra t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Dominios magnéticos", T.dominios, T.comun, C.white],
      ["Campo magnético terrestre", T.campo, T.porEso, C.cyan],
    ]}
    tics={[0.7, T.sacude, T.quedan]}
  />
);
