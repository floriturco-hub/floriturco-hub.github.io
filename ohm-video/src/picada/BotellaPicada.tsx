import narracion from "../../guion/picada/narracion.json";
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
  Cupula,
  Gancho,
  Presion,
  Sedimentos,
  Soplador,
  Volumen,
  T,
} from "./Escenas";

export const DURACION_PICADA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const BotellaPicada: React.FC = () => (
  <Short
    carpeta="picada"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.botellas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.botellas, hasta: T.llama, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Picada", desde: T.llama, hasta: T.resistencia, render: (t0) => <Soplador t0={t0} /> },
      { nombre: "Cúpula", desde: T.resistencia, hasta: T.champan2, render: (t0) => <Cupula t0={t0} /> },
      { nombre: "Presión", desde: T.champan2, hasta: T.sedimentos, render: (t0) => <Presion t0={t0} /> },
      { nombre: "Sedimentos", desde: T.sedimentos, hasta: T.menos, render: (t0) => <Sedimentos t0={t0} /> },
      { nombre: "Volumen", desde: T.menos, hasta: T.paraEso, render: (t0) => <Volumen t0={t0} /> },
      { nombre: "Cierre", desde: T.paraEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["La picada", T.llama, T.resistencia, C.yellow],
      ["Resiste la presión", T.presion, T.sedimentos, C.white],
    ]}
    tics={[0.6, T.llama, T.presion, T.mililitros]}
  />
);
