import narracion from "../../guion/agujeros/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Angulos,
  Bucle,
  Cierre,
  Gancho,
  Miopia,
  Nitido,
  Trampa,
  T,
} from "./Escenas";

export const DURACION_AGUJEROS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const LentesAgujeritos: React.FC = () => (
  <Short
    carpeta="agujeros"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.sin, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.sin, hasta: T.si, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Miopía", desde: T.si, hasta: T.ese, render: (t0) => <Miopia t0={t0} /> },
      { nombre: "Agujerito", desde: T.ese, hasta: T.con, render: (t0) => <Angulos t0={t0} /> },
      { nombre: "Nítido", desde: T.con, hasta: T.la, render: (t0) => <Nitido t0={t0} /> },
      { nombre: "Trampa", desde: T.la, hasta: T.porEso, render: (t0) => <Trampa t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Lentes estenopeicos", T.sin + 0.5, T.si, C.white],
      ["Círculo de desenfoque", T.circulo, T.ese, C.red],
      ["Menos ángulos = más nitidez", T.nitida - 1, T.la, C.yellow],
    ]}
    tics={[1.14, T.circulo, T.haz, T.nitida, T.luz, T.no]}
  />
);
