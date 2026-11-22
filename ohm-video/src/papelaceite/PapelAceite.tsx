import narracion from "../../guion/papelaceite/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Aceite,
  Agua,
  Bucle,
  Calcar,
  Cierre,
  Disperso,
  Gancho,
  T,
} from "./Escenas";

export const DURACION_PAPELACEITE_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const PapelAceite: React.FC = () => (
  <Short
    carpeta="papelaceite"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.gota, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.gota, hasta: T.red, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Disperso", desde: T.red, hasta: T.huecos, render: (t0) => <Disperso t0={t0} /> },
      { nombre: "Aceite", desde: T.huecos, hasta: T.agua, render: (t0) => <Aceite t0={t0} /> },
      { nombre: "Agua", desde: T.agua, hasta: T.calcar2, render: (t0) => <Agua t0={t0} /> },
      { nombre: "Calcar", desde: T.calcar2, hasta: T.porEso, render: (t0) => <Calcar t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Dispersión de la luz", T.desvia, T.huecos, C.yellow],
      ["Índice de refracción parecido", T.celulosa2, T.agua, C.cyan],
    ]}
    tics={[0.6, T.desvia, T.atraviesa]}
  />
);
