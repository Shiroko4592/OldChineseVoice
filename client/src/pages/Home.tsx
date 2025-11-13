import { useState } from "react";
import TranslationInput from "@/components/TranslationInput";
import TranslationOutput from "@/components/TranslationOutput";
import TranslationHistory from "@/components/TranslationHistory";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

interface Translation {
  id: string;
  koreanText: string;
  chineseText: string;
  romanization: string;
  createdAt: Date;
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [currentTranslation, setCurrentTranslation] = useState<{
    chineseText: string;
    romanization: string;
  } | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [history, setHistory] = useState<Translation[]>([
    {
      id: "1",
      koreanText: "안녕하세요",
      chineseText: "安寧乎汝",
      romanization: "ʔaːn neːŋ ɡaː njaʔ",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
  ]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    
    setTimeout(() => {
      const mockTranslation = {
        id: Date.now().toString(),
        koreanText: inputText,
        chineseText: "示例漢字",
        romanization: "dek sliːl qhaːns tsɯʔ",
        createdAt: new Date(),
      };

      setCurrentTranslation({
        chineseText: mockTranslation.chineseText,
        romanization: mockTranslation.romanization,
      });

      setHistory((prev) => [mockTranslation, ...prev]);
      setIsTranslating(false);
    }, 1500);
  };

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    console.log("Playing audio for:", currentTranslation?.chineseText);
    
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 2000);
  };

  const handleSelectHistory = (translation: Translation) => {
    setInputText(translation.koreanText);
    setCurrentTranslation({
      chineseText: translation.chineseText,
      romanization: translation.romanization,
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">上古漢語 번역기</h1>
            <p className="text-sm text-muted-foreground mt-1">
              한국어를 상고한어로 번역하세요
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <TranslationInput
            value={inputText}
            onChange={setInputText}
            onTranslate={handleTranslate}
            isLoading={isTranslating}
          />
          <TranslationOutput
            chineseText={currentTranslation?.chineseText || ""}
            romanization={currentTranslation?.romanization || ""}
            isLoading={isTranslating}
            onPlayAudio={handlePlayAudio}
            isPlayingAudio={isPlayingAudio}
          />
        </div>

        <div className="max-w-2xl mx-auto">
          <TranslationHistory
            translations={history}
            onSelect={handleSelectHistory}
            onClear={handleClearHistory}
          />
        </div>
      </main>
    </div>
  );
}
