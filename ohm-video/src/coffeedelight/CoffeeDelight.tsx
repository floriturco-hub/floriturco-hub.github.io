import narracion from "../../guion/coffeedelight/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bolsillo,
  Bucle,
  Cerebro,
  Cierre,
  Gancho,
  Nariz,
  Retronasal,
  Variantes,
  T,
} from "./Escenas";

export const DURACION_COFFEE_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CoffeeDelight: React.FC = () => (
  <Short
    carpeta="coffeedelight"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.tienda, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.tienda, hasta: T.sabor, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Nariz", desde: T.sabor, hasta: T.aroma, render: (t0) => <Nariz t0={t0} /> },
      { nombre: "Retronasal", desde: T.aroma, hasta: T.cerebro, render: (t0) => <Retronasal t0={t0} /> },
      { nombre: "Cerebro", desde: T.cerebro, hasta: T.clasico2, render: (t0) => <Cerebro t0={t0} /> },
      { nombre: "Variantes", desde: T.clasico2, hasta: T.bolsillo, render: (t0) => <Variantes t0={t0} /> },
      { nombre: "Bolsillo", desde: T.bolsillo, hasta: T.porEso, render: (t0) => <Bolsillo t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Olfato retronasal", T.retronasal, T.clasico2, C.yellow],
      ["@mi_colombina  #CoffeeDelightLover", T.bolsillo, T.fin, C.white],
    ]}
    tics={[0.6, T.retronasal, T.clasico2]}
  />
);
