import {
  lecturaPrincipal,
  lecturaDiaria,
  lecturasdeUnUsuario,
  lecturaPorId,
} from "../models/lecturasmodels.js";

/************** IA ***************/
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

console.log("🔑 GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Cargada ✅" : "No cargada ❌");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // usa 1.5-flash, no 2.5

export async function respuestaIA(prompt) {
  try {
    const consulta = await model.generateContent(prompt);
    return consulta.response.text();
  } catch (error) {
    console.error("❌ Error al consultar Gemini:", error);
    return "Ocurrió un error al interpretar el texto.";
  }
}



// ========================================
// CÓMO CALCULAR TU NÚMERO DE CAMINO DE VIDA
// ========================================
//
// Paso 1. Escribe tu fecha de nacimiento completa.
// Por ejemplo: 14 de julio de 2001 → 14 / 07 / 2001.
//
// Paso 2. Reduce cada parte a un solo dígito
// (excepto si te da 11, 22 o 33, que son números maestros).
//
// Día: 14 → 1 + 4 = 5
// Mes: 07 → 7
// Año: 2001 → 2 + 0 + 0 + 1 = 3
//
// Paso 3. Suma los resultados:
// 5 + 7 + 3 = 15
//
// Paso 4. Reduce a un solo dígito:
// 1 + 5 = 6
//
// Tu camino de vida es el 6.
//

export function calcularCaminoDeVida(fecha_nacimiento) {
  const fecha = new Date(fecha_nacimiento);
  const dia = fecha.getDate(); // Día de nacimiento (ej. 14)
  const mes = fecha.getMonth() + 1; // Mes (0-based, por eso +1)
  const año = fecha.getFullYear(); // Año completo (ej. 2001)

  // Función auxiliar para reducir un número a un solo dígito
  // (excepto si es 11, 22 o 33 → números maestros)
  const reducir = (num) => {
    if ([11, 22, 33].includes(num)) return num;
    while (num > 9) {
      num = num
        .toString()
        .split("")
        .reduce((a, b) => a + parseInt(b), 0);
    }
    return num;
  };

  // Reducción de cada parte de la fecha
  const diaReducido = reducir(dia);
  const mesReducido = reducir(mes);
  const añoReducido = reducir(
    año
      .toString()
      .split("")
      .reduce((a, b) => a + parseInt(b), 0)
  );

  // Suma total de los tres componentes
  const suma = diaReducido + mesReducido + añoReducido;

  // Reducción final para obtener el número de Camino de Vida
  const caminoDeVida = reducir(suma);

  return caminoDeVida;
}

export async function generarlecturaprincipal(req, res) {
  try {
    const { usuario_id } = req.params;
    const resultado = await lecturaPrincipal(usuario_id);

    if (!resultado.usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    if (resultado.usuario.estado !== "activo") {
      return res.status(403).json({
        msg: "El usuario no tiene una membresía activa. No puede generar lecturas.",
      });
    }

 
    if (resultado.existe) {
      return res.status(200).json({
        msg: "La lectura principal ya fue generada previamente.",
        numeroCamino: resultado.existe.numero_camino,
        contenido: resultado.existe.contenido,
      });
    }

    const numeroCamino = calcularCaminoDeVida(
      resultado.usuario.fecha_nacimiento
    );

    const prompt = `
Eres un astrólogo y numerólogo experto. Genera una lectura espiritual personalizada
para ${resultado.usuario.nombre}, nacido el ${resultado.usuario.fecha_nacimiento}.
Su número de camino de vida según la numerología pitagórica es el ${numeroCamino}.
Describe los principales rasgos, talentos y desafíos de este número de forma inspiradora.
`;

    const contenido = await respuestaIA(prompt);

    const idLectura = await resultado.crear(
      usuario_id,
      "principal",
      contenido
    );

    res.status(201).json({
      msg: `Lectura principal generada con éxito para ${resultado.usuario.nombre}`,
      id: idLectura,
      numeroCamino,
      contenido,
    });
  } catch (error) {
    console.error("Error al generar lectura principal:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
}


export async function generarlecturadiaria(req, res) {
  try {
    const { usuario_id } = req.params;
    const resultado = await lecturaDiaria(usuario_id);

    if (!resultado.usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado." });
    }

    if (resultado.usuario.estado.toLowerCase() !== "activo") {
      return res.status(403).json({
        msg: "El usuario no está activo, no puede generar lectura diaria.",
      });
    }
    const lecturaPrincipal = await resultado.obtenerLecturaPrincipal(
      usuario_id
    );

    if (!lecturaPrincipal) {
      return res.status(400).json({
        msg: "Primero debes generar la lectura principal antes de crear la diaria.",
      });
    }

    const prompt = `
Eres un astrólogo numerólogo experto.
Basándote en la siguiente lectura principal de ${resultado.usuario.nombre}:
---
${lecturaPrincipal.contenido}
---
Genera una lectura diaria breve, positiva y personalizada
que complemente la lectura anterior, brindando inspiración,
reflexión y energía para el día de hoy.
`;

    const contenido = await respuestaIA(prompt);

    const idLectura = await resultado.crear(usuario_id, "diaria", contenido);

    res.status(201).json({
      msg: "Lectura diaria generada con base en la lectura principal.",
      id: idLectura,
      contenido,
    });
  } catch (error) {
    console.error("Error al generar lectura diaria:", error);
    res.status(500).json({ msg: "Error interno del servidor." });
  }
}

export async function obtenerlecturasdeunusuario(req, res) {
  try {
    const { usuario_id } = req.params;
    const lecturas = await lecturasdeUnUsuario(usuario_id);

    if (!lecturas.length)
      return res
        .status(404)
        .json({ msg: "El usuario no tiene lecturas registradas." });

    res.status(201).json({
      msg: "El usuario tiene estas lecturas registradas",
      lecturas,
      numerolecturas: lecturas.length,
    });
  } catch (error) {
    console.error("Error al obtener lecturas:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
}

export async function obtenerlecturaporid(req, res) {
  try {
    const { id } = req.params;
    const lectura = await lecturaPorId(id);

    if (!lectura)
      return res.status(404).json({ msg: "Lectura no encontrada." });

    res.status(201).json({
      msg: `Lecturas enocntradas del usuario ${lectura.usuario.nombre}`,
      lectura,
      numerolecturas: lectura.length,
    });
  } catch (error) {
    console.error("Error al obtener lectura:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
}
