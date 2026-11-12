import narracion from "../../guion/veneno/narracion.json";
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
  Dispara,
  Final,
  Gancho,
  Gasta,
  Rompe,
  Sistema,
  T,
} from "./Escenas";

export const DURACION_VENENO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const VenenoSangre: React.FC = () => (
  <Short
    carpeta="veneno"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho: gota", desde: 0, hasta: T.pero, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.pero, hasta: T.tu, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Coagulación", desde: T.tu, hasta: T.algunos, render: (t0) => <Sistema t0={t0} /> },
      { nombre: "Procoagulante", desde: T.algunos, hasta: T.otros, render: (t0) => <Dispara t0={t0} /> },
      { nombre: "Anticoagulante", desde: T.otros, hasta: T.pero2, render: (t0) => <Rompe t0={t0} /> },
      { nombre: "Se gastan", desde: T.pero2, hasta: T.dos, render: (t0) => <Gasta t0={t0} /> },
      { nombre: "Hemorragia", desde: T.dos, hasta: T.porque, render: (t0) => <Final t0={t0} /> },
      { nombre: "Cierre", desde: T.porque, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Veneno procoagulante", T.disparan, T.otros, C.yellow],
      ["Veneno anticoagulante", T.rompen, T.pero2, C.white],
      ["Coagulopatía de consumo", T.acaban, T.dos, C.red],
    ]}
    tics={[1.64, T.cadena, T.disparan, T.rompen, T.noCoag, T.antiveneno]}
  />
);
