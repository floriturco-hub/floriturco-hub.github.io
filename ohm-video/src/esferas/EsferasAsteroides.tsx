import narracion from "../../guion/esferas/narracion.json";
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
  Enorme,
  Gancho,
  Gravedad,
  Limite,
  Pequeno,
  T,
} from "./Escenas";

export const DURACION_ESFERAS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const EsferasAsteroides: React.FC = () => (
  <Short
    carpeta="esferas"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.planetas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.planetas, hasta: T.gravedad, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Gravedad", desde: T.gravedad, hasta: T.enorme, render: (t0) => <Gravedad t0={t0} /> },
      { nombre: "Esfera", desde: T.enorme, hasta: T.pequeno, render: (t0) => <Enorme t0={t0} /> },
      { nombre: "Asteroide", desde: T.pequeno, hasta: T.limite, render: (t0) => <Pequeno t0={t0} /> },
      { nombre: "Límite", desde: T.limite, hasta: T.porEso, render: (t0) => <Limite t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Equilibrio hidrostático", T.equilibrio, T.pequeno, C.yellow],
      ["Resistencia de la roca", T.aguanta, T.limite, C.white],
    ]}
    tics={[0.7, T.equilibrio, T.cuatrocientos]}
  />
);
