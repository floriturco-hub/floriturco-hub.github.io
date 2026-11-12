import narracion from "../../guion/cafe/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Adenosina,
  Aviso,
  Bucle,
  Cafeina,
  Cierre,
  Gancho,
  Golpe,
  Horas,
  Oculto,
  T,
} from "./Escenas";

export const DURACION_CAFE_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CafeSueno: React.FC = () => (
  <Short
    carpeta="cafe"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho: café", desde: 0, hasta: T.y, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.y, hasta: T.mientras, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Adenosina", desde: T.mientras, hasta: T.cuando, render: (t0) => <Adenosina t0={t0} /> },
      { nombre: "Aviso", desde: T.cuando, hasta: T.cafeina, render: (t0) => <Aviso t0={t0} /> },
      { nombre: "Cafeína", desde: T.cafeina, hasta: T.cansancio, render: (t0) => <Cafeina t0={t0} /> },
      { nombre: "Oculto", desde: T.cansancio, hasta: T.cinco, render: (t0) => <Oculto t0={t0} /> },
      { nombre: "Horas", desde: T.cinco, hasta: T.va, render: (t0) => <Horas t0={t0} /> },
      { nombre: "Golpe", desde: T.va, hasta: T.porque, render: (t0) => <Golpe t0={t0} /> },
      { nombre: "Cierre", desde: T.porque, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Receptor de adenosina", T.encendiera, T.cafeina, C.white],
      ["La cafeína lo bloquea", T.tapa, T.cansancio, C.yellow],
      ["Vida media: ~5 horas", T.mitad - 0.8, T.va, C.white],
      ["Bajón de cafeína", T.desplomas, T.porque, C.red],
    ]}
    tics={[0.44, T.caloria, T.encendiera, T.tapa, T.mitad, T.golpe]}
  />
);
