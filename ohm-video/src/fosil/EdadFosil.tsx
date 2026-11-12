import narracion from "../../guion/fosil/narracion.json";
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
  Comer,
  Cuenta,
  Dino,
  Gancho,
  Medio,
  Medir,
  T,
} from "./Escenas";

export const DURACION_FOSIL_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const EdadFosil: React.FC = () => (
  <Short
    carpeta="fosil"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho: reloj", desde: 0, hasta: T.nunca, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.nunca, hasta: T.vivimos, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Comer carbono", desde: T.vivimos, hasta: T.morir, render: (t0) => <Comer t0={t0} /> },
      { nombre: "Cuenta atrás", desde: T.morir, hasta: T.midiendo, render: (t0) => <Cuenta t0={t0} /> },
      { nombre: "Medir", desde: T.midiendo, hasta: T.dino, render: (t0) => <Medir t0={t0} /> },
      { nombre: "Dinosaurio", desde: T.dino, hasta: T.medio, render: (t0) => <Dino t0={t0} /> },
      { nombre: "Entre dos fechas", desde: T.medio, hasta: T.porque, render: (t0) => <Medio t0={t0} /> },
      { nombre: "Cierre", desde: T.porque, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Carbono 14: radiactivo", T.radiactivo, T.morir, C.yellow],
      ["Cada 5.700 años, la mitad", T.mitad, T.midiendo, C.white],
      ["Datación por radiocarbono", T.murio, T.pero, C.cyan],
      ["Relojes de millones de años", T.relojes, T.medio, C.white],
      ["Edad del fósil", T.entre, T.porque, C.yellow],
    ]}
    tics={[1.0, T.c14, T.cada, T.cincuenta, T.potasio, T.entre]}
  />
);
