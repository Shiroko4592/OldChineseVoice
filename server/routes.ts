import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTranslationSchema } from "@shared/schema";
import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const openAIResponseSchema = z.object({
  chineseText: z.string().trim().min(1, "Chinese text is required"),
  romanization: z.string().trim().min(1, "Romanization is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/translate", async (req, res) => {
    try {
      const { koreanText } = req.body;
      
      if (!koreanText || typeof koreanText !== "string" || !koreanText.trim()) {
        return res.status(400).json({ error: "Korean text is required and cannot be empty" });
      }

      const prompt = `You are an expert in Old Chinese (上古漢語, also called Archaic Chinese or Old Sinitic) language and historical linguistics. 

Translate the following Korean text into Old Chinese (上古漢語):
"${koreanText}"

Provide your response in the following JSON format:
{
  "chineseText": "the Old Chinese translation using appropriate classical Chinese characters",
  "romanization": "the romanized pronunciation using Baxter-Sagart reconstruction system or similar scholarly reconstruction"
}

Important guidelines:
- Use appropriate classical Chinese characters that would have been used in the Old Chinese period (roughly 1000 BCE - 200 CE)
- The romanization should reflect the reconstructed Old Chinese pronunciation, not modern Mandarin
- Use scholarly romanization conventions (like Baxter-Sagart system)
- Keep the translation natural and authentic to the Old Chinese period
- Only respond with valid JSON, no additional text`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert in Old Chinese linguistics and translation. You always respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const responseContent = completion.choices[0].message.content;
      if (!responseContent) {
        return res.status(502).json({ 
          error: "Translation service returned empty response" 
        });
      }

      let parsedResult;
      try {
        parsedResult = JSON.parse(responseContent);
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", parseError);
        return res.status(502).json({ 
          error: "Translation service returned invalid response format" 
        });
      }

      const validationResult = openAIResponseSchema.safeParse(parsedResult);
      if (!validationResult.success) {
        console.error("OpenAI response validation failed:", validationResult.error);
        return res.status(502).json({ 
          error: "Translation service returned incomplete data",
          details: validationResult.error.errors
        });
      }

      const { chineseText, romanization } = validationResult.data;
      
      const translationData = insertTranslationSchema.parse({
        koreanText,
        chineseText,
        romanization,
      });
      
      const translation = await storage.createTranslation(translationData);

      res.json(translation);
    } catch (error) {
      console.error("Translation error:", error);
      if (error instanceof Error) {
        res.status(500).json({ error: `Translation failed: ${error.message}` });
      } else {
        res.status(500).json({ error: "Translation failed" });
      }
    }
  });

  app.post("/api/text-to-speech", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text is required" });
      }

      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: text,
        speed: 0.85,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length,
      });
      res.send(buffer);
    } catch (error) {
      console.error("TTS error:", error);
      res.status(500).json({ error: "Text-to-speech generation failed" });
    }
  });

  app.get("/api/translations", async (_req, res) => {
    try {
      const translations = await storage.getTranslations();
      res.json(translations);
    } catch (error) {
      console.error("Get translations error:", error);
      res.status(500).json({ error: "Failed to fetch translations" });
    }
  });

  app.delete("/api/translations", async (_req, res) => {
    try {
      await storage.clearTranslations();
      res.json({ success: true });
    } catch (error) {
      console.error("Clear translations error:", error);
      res.status(500).json({ error: "Failed to clear translations" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
