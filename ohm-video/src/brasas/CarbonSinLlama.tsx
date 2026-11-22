import narracion from "../../guion/brasas/narracion.json";
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
  Gases,
  Horno,
  Llamas,
  Superficie,
  T,
} from "./Escenas";

export const DURACION_BRASAS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CarbonSinLlama: React.FC = () => (
  <Short
    carpeta="brasas"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.madera, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.madera, hasta: T.calentarse, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Pirólisis", desde: T.calentarse, hasta: T.esos, render: (t0) => <Gases t0={t0} /> },
      { nombre: "Llama", desde: T.esos, hasta: T.vegetal, render: (t0) => <Llamas t0={t0} /> },
      { nombre: "Carbón vegetal", desde: T.vegetal, hasta: T.quemarlo, render: (t0) => <Horno t0={t0} /> },
      { nombre: "Brasa", desde: T.quemarlo, hasta: T.porEso, render: (t0) => <Superficie t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Pirólisis", T.suelta, T.esos, C.orange],
      ["Combustión en fase gaseosa", T.arden, T.vegetal, C.yellow],
      ["Combustión superficial", T.superficie, T.porEso, C.red],
    ]}
    tics={[0.7, T.arden, T.brilla2]}
  />
);
