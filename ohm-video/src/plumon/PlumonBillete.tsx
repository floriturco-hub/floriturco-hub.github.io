import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import {
  Autentico,
  Cierre,
  Gancho,
  Limites,
  PapelNormal,
  Seguridad,
  T,
  UnaRaya,
  Yodo,
} from "./Escenas";

export const DURACION_PLUMON_S = duracionShort(T.fin);

export const PlumonBillete: React.FC = () => (
  <Short
    carpeta="plumon"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: plumón",
        desde: 0,
        hasta: T.raya,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "Una raya",
        desde: T.raya,
        hasta: T.yodo,
        render: (t0) => <UnaRaya t0={t0} />,
      },
      {
        nombre: "Yodo y almidón",
        desde: T.yodo,
        hasta: T.papel,
        render: (t0) => <Yodo t0={t0} />,
      },
      {
        nombre: "Papel normal",
        desde: T.papel,
        hasta: T.autenticos,
        render: (t0) => <PapelNormal t0={t0} />,
      },
      {
        nombre: "Auténtico",
        desde: T.autenticos,
        hasta: T.limites,
        render: (t0) => <Autentico t0={t0} />,
      },
      {
        nombre: "Límites",
        desde: T.limites,
        hasta: T.hilos,
        render: (t0) => <Limites t0={t0} />,
      },
      {
        nombre: "Seguridad",
        desde: T.hilos,
        hasta: T.final,
        render: (t0) => <Seguridad t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.final,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡Un plumón delata tu billete!", 0, T.raya, C.yellow, 52],
      ["Química de cocina", T.quimica, T.yodo, C.yellow],
      ["La tinta lleva yodo", T.yodo, T.mancha, C.white],
      ["Yodo + almidón = azul oscuro", T.mancha, T.papel, C.cyan],
      ["Papel normal: con almidón", T.pulpa, T.oscurece, C.white],
      ["Raya oscura: sospechoso", T.oscurece, T.autenticos, C.red],
      ["Billete real: algodón", T.algodon, T.amarilla, C.white],
      ["Raya amarilla: sin almidón", T.amarilla, T.limites, C.yellow],
      ["El truco tiene límites", T.limites, T.hilos, C.orange],
      ["Hilo, marca de agua, tinta", T.hilos, T.final, C.white],
      ["Raya amarilla: una sospecha menos", T.final, T.fin + 0.5, C.yellow, 40],
    ]}
    tics={[1.0, T.quimica, T.mancha, T.oscurece, T.amarilla]}
  />
);
