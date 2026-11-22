import narracion from "../../guion/mosquito/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Acidos,
  Bacterias,
  Bucle,
  Calor,
  Cierre,
  Co2,
  Gancho,
  Grande,
  T,
} from "./Escenas";

export const DURACION_MOSQUITO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const MosquitoElige: React.FC = () => (
  <Short
    carpeta="mosquito"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho: dos camas", desde: 0, hasta: T.y, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.y, hasta: T.el, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "CO2", desde: T.el, hasta: T.al, render: (t0) => <Co2 t0={t0} /> },
      { nombre: "Calor y olor", desde: T.al, hasta: T.ese, render: (t0) => <Calor t0={t0} /> },
      { nombre: "Bacterias", desde: T.ese, hasta: T.quien, render: (t0) => <Bacterias t0={t0} /> },
      { nombre: "Grande", desde: T.quien, hasta: T.pero, render: (t0) => <Grande t0={t0} /> },
      { nombre: "Ácidos grasos", desde: T.pero, hasta: T.porque, render: (t0) => <Acidos t0={t0} /> },
      { nombre: "Cierre", desde: T.porque, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Solo pican las hembras", T.el + 0.3, T.co2, C.white],
      ["Microbiota de la piel", T.bacterias, T.mezcla, C.yellow],
      ["Ácidos carboxílicos", T.muchisimos, T.tres, C.red],
    ]}
    tics={[0.82, T.dulce, T.co2, T.olor, T.exhala, T.favoritas]}
  />
);
