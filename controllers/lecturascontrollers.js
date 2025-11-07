
















/************** IA ***************/
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function respuestaIA(prompt) {
  try {
    const consulta = await model.generateContent(prompt);
    const respuesta = await consulta.respuesta;
    return respuesta.text();
  } catch (error) {
    console.error("Error al consultar Gemini:", error);
    return "Ocurrió un error al interpretar el texto.";
  }
}
