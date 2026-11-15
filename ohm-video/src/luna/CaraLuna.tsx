import narracion from "../../guion/luna/narracion.json";
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
  Dias,
  Freno,
  Frente,
  Gancho,
  Pasado,
  Ritmo,
  T,
} from "./Escenas";

export const DURACION_LUNA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CaraLuna: React.FC = () => (
  <Short
    carpeta="luna"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.siempre, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.siempre, hasta: T.la, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Ritmo", desde: T.la, hasta: T.asi, render: (t0) => <Ritmo t0={t0} /> },
      { nombre: "De frente", desde: T.asi, hasta: T.no, render: (t0) => <Frente t0={t0} /> },
      { nombre: "Pasado", desde: T.no, hasta: T.ese, render: (t0) => <Pasado t0={t0} /> },
      { nombre: "Freno", desde: T.ese, hasta: T.y, render: (t0) => <Freno t0={t0} /> },
      { nombre: "Días más largos", desde: T.y, hasta: T.porEso, render: (t0) => <Dias t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Rotación sincrónica", T.dias, T.asi, C.white],
      ["Acoplamiento de marea", T.sincronizado, T.y, C.yellow],
    ]}
    tics={[0.98, T.dias, T.frente, T.rugby, T.sincronizado, T.dias2]}
  />
);
