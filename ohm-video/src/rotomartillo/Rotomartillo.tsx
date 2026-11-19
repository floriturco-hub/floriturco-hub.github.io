import narracion from "../../guion/rotomartillo/narracion.json";
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
  Concreto,
  Gancho,
  Normal,
  Piston,
  PolvoEsc,
  Punta,
  T,
} from "./Escenas";

export const DURACION_ROTOMARTILLO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const Rotomartillo: React.FC = () => (
  <Short
    carpeta="rotomartillo"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.taladro, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.taladro, hasta: T.concreto, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Concreto", desde: T.concreto, hasta: T.roto2, render: (t0) => <Concreto t0={t0} /> },
      { nombre: "Pistón", desde: T.roto2, hasta: T.pulveriza, render: (t0) => <Piston t0={t0} /> },
      { nombre: "Polvo", desde: T.pulveriza, hasta: T.punta, render: (t0) => <PolvoEsc t0={t0} /> },
      { nombre: "Carburo", desde: T.punta, hasta: T.taladro2, render: (t0) => <Punta t0={t0} /> },
      { nombre: "Taladro", desde: T.taladro2, hasta: T.asi, render: (t0) => <Normal t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Pistón percutor", T.piston, T.pulveriza, C.yellow],
      ["Pastilla de carburo", T.carburo, T.taladro2, C.yellow],
    ]}
    tics={[0.6, T.golpes, T.carburo]}
  />
);
