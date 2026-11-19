import narracion from "../../guion/chip/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Banda,
  Bucle,
  Chip,
  Cierre,
  Desafio,
  Gancho,
  Riesgo,
  Telefono,
  UnaVez,
  T,
} from "./Escenas";

export const DURACION_CHIP_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const ChipTarjeta: React.FC = () => (
  <Short
    carpeta="chip"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.antes, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.antes, hasta: T.la, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Banda magnética", desde: T.la, hasta: T.el, render: (t0) => <Banda t0={t0} /> },
      { nombre: "Chip", desde: T.el, hasta: T.en, render: (t0) => <Chip t0={t0} /> },
      { nombre: "Desafío", desde: T.en, hasta: T.ese, render: (t0) => <Desafio t0={t0} /> },
      { nombre: "Una vez", desde: T.ese, hasta: T.tu, render: (t0) => <UnaVez t0={t0} /> },
      { nombre: "Teléfono", desde: T.tu, hasta: T.lo, render: (t0) => <Telefono t0={t0} /> },
      { nombre: "Riesgo", desde: T.lo, hasta: T.porEso, render: (t0) => <Riesgo t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Banda magnética: datos fijos", T.iguales, T.el, C.white],
      ["Criptografía", T.firmado, T.ese, C.yellow],
      ["Tokenización", T.nuevo, T.lo, C.cyan],
    ]}
    tics={[0.54, T.identica, T.clave, T.responde, T.noVale, T.internet]}
  />
);
