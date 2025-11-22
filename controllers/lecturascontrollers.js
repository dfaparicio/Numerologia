import {
  lecturaPrincipal,
  lecturaDiaria,
  lecturasdeUnUsuario,
  lecturaPorId,
} from "../models/lecturasmodels.js";

//IA
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

console.log(
  "🔑 GEMINI_API_KEY:",
  process.env.GEMINI_API_KEY ? "Cargada ✅" : "No cargada ❌"
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function respuestaIA(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
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
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1;
  const año = fecha.getFullYear();

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

  const diaReducido = reducir(dia);
  const mesReducido = reducir(mes);
  const añoReducido = reducir(
    año
      .toString()
      .split("")
      .reduce((a, b) => a + parseInt(b), 0)
  );

  const suma = diaReducido + mesReducido + añoReducido;

  const caminoDeVida = reducir(suma);

  return caminoDeVida;
}

function extraerJSON(texto) {
  const inicio = texto.indexOf("{");
  const fin = texto.lastIndexOf("}");

  if (inicio === -1 || fin === -1) {
    throw new Error("La IA no devolvió un JSON válido.");
  }

  const jsonLimpio = texto.slice(inicio, fin + 1);

  try {
    return JSON.parse(jsonLimpio);
  } catch (e) {
    console.error("JSON devuelto por IA (corrupto):", jsonLimpio);
    throw new Error("JSON inválido al parsear.");
  }
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

    if (resultado.lecturaExistente) {
      return res.status(200).json({
        msg: "La lectura principal ya fue generada previamente.",
        id: resultado.lecturaExistente.id,
        contenido: JSON.parse(resultado.lecturaExistente.contenido),
      });
    }

    const numeroCamino = calcularCaminoDeVida(
      resultado.usuario.fecha_nacimiento
    );
    
    const prompt = `
Eres un numerólogo profesional experto en numerología pitagórica. 
Usa el siguiente número de Camino de Vida ya calculado:

- Nombre: "${resultado.usuario.nombre}"

Genera una interpretación profunda y totalmente personalizada.

Devuelve ÚNICAMENTE un JSON VÁLIDO con esta estructura EXACTA:

{
  "nombre": "${resultado.usuario.nombre}",
  "numeroCamino": ${numeroCamino},
  "descripcion": "",
  "talentos": "",
  "desafios": "",
  "mensajeEspiritual": ""
}

REGLAS:
- Cada campo debe contener entre 3 y 7 frases completas.
- No menciones que eres una IA.
- NO escribas nada fuera del JSON.
`;

    const contenidoIA = await respuestaIA(prompt);

    const contenidoJSON = extraerJSON(contenidoIA);

    const idLectura = await resultado.crear(
      usuario_id,
      "principal",
      JSON.stringify(contenidoJSON)
    );

    res.status(201).json({
      msg: `Lectura principal generada con éxito.`,
      id: idLectura,
      contenido: contenidoJSON,
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

    const lecturaHoy = await resultado.obtenerLecturaDiariaHoy(usuario_id);
    if (lecturaHoy) {
      return res.status(200).json({
        msg: "La lectura diaria ya fue generada hoy.",
        id: lecturaHoy.id,
        contenido: JSON.parse(lecturaHoy.contenido),
      });
    }

    const fechaHoy = new Date().toISOString().split("T")[0];

    const prompt = `
Eres un numerólogo experto en numerología pitagórica.  
Genera una lectura diaria basada en esta lectura principal:

---
${lecturaPrincipal.contenido}
---

Devuelve SOLO un JSON VÁLIDO con esta forma:

{
  "fecha": "${fechaHoy}",
  "mensaje": "",
  "energiaDelDia": "",
  "consejo": ""
}

REGLAS:
- Todo debe relacionarse con la energía numerológica del usuario.
- No menciones que eres una IA.
- NO escribas nada fuera del JSON.
`;

    const contenidoIA = await respuestaIA(prompt);
    const contenidoJSON = extraerJSON(contenidoIA);

    const idLectura = await resultado.crear(
      usuario_id,
      "diaria",
      JSON.stringify(contenidoJSON)
    );

    res.status(201).json({
      msg: "Lectura diaria generada exitosamente.",
      id: idLectura,
      contenido: contenidoJSON,
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

    if (!lectura) {
      return res.status(404).json({ msg: "Lectura no encontrada." });
    }

    let contenidoParseado = lectura.contenido;
    try {
      contenidoParseado =
        typeof lectura.contenido === "string"
          ? JSON.parse(lectura.contenido)
          : lectura.contenido;
    } catch (e) {
      console.warn("Contenido no era JSON o estaba corrupto");
    }

    return res.status(200).json({
      msg: `Lectura encontrada del usuario ${
        lectura.usuario?.nombre || "desconocido"
      }`,
      lectura: {
        ...lectura,
        contenido: contenidoParseado,
      },
    });
  } catch (error) {
    console.error("Error al obtener lectura:", error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
}
