import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import TranslationInput from "@/components/TranslationInput";
import TranslationOutput from "@/components/TranslationOutput";
import TranslationHistory from "@/components/TranslationHistory";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Translation } from "@shared/schema";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [currentTranslation, setCurrentTranslation] = useState<{
    chineseText: string;
    romanization: string;
  } | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { toast } = useToast();

  const { data: translations = [] } = useQuery<Translation[]>({
    queryKey: ["/api/translations"],
  });

  const translateMutation = useMutation({
    mutationFn: async (koreanText: string) => {
      const res = await apiRequest("POST", "/api/translate", { koreanText });
      return await res.json();
    },
    onSuccess: (data: Translation) => {
      if (!data.chineseText?.trim() || !data.romanization?.trim()) {
        toast({
          title: "번역 오류",
          description: "번역 결과가 불완전합니다. 다시 시도해주세요.",
          variant: "destructive",
        });
        return;
      }
      setCurrentTranslation({
        chineseText: data.chineseText.trim(),
        romanization: data.romanization.trim(),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/translations"] });
    },
    onError: (error) => {
      toast({
        title: "번역 실패",
        description: "번역 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
      console.error("Translation error:", error);
    },
  });

  const clearHistoryMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", "/api/translations");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translations"] });
      toast({
        description: "번역 기록이 삭제되었습니다.",
      });
    },
  });

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleTranslate = () => {
    if (inputText.trim()) {
      translateMutation.mutate(inputText);
    }
  };

  const handlePlayAudio = async () => {
    if (!currentTranslation?.chineseText || !currentTranslation.chineseText.trim()) {
      toast({
        title: "재생 불가",
        description: "재생할 번역 결과가 없습니다.",
        variant: "destructive",
      });
      return;
    }

    setIsPlayingAudio(true);
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentTranslation.chineseText }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "재생 실패",
          description: "오디오 재생 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      };

      await audio.play();
    } catch (error) {
      setIsPlayingAudio(false);
      toast({
        title: "재생 실패",
        description: "오디오 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      console.error("Audio playback error:", error);
    }
  };

  const handleSelectHistory = (translation: Translation) => {
    if (!translation.chineseText?.trim() || !translation.romanization?.trim()) {
      toast({
        title: "오류",
        description: "번역 데이터가 손상되었습니다.",
        variant: "destructive",
      });
      return;
    }
    setInputText(translation.koreanText);
    setCurrentTranslation({
      chineseText: translation.chineseText,
      romanization: translation.romanization,
    });
  };

  const handleClearHistory = () => {
    clearHistoryMutation.mutate();
  };

  const formattedTranslations = translations;

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
            isLoading={translateMutation.isPending}
          />
          <TranslationOutput
            chineseText={currentTranslation?.chineseText || ""}
            romanization={currentTranslation?.romanization || ""}
            isLoading={translateMutation.isPending}
            onPlayAudio={handlePlayAudio}
            isPlayingAudio={isPlayingAudio}
          />
        </div>

        <div className="max-w-2xl mx-auto">
          <TranslationHistory
            translations={formattedTranslations}
            onSelect={handleSelectHistory}
            onClear={handleClearHistory}
          />
        </div>
      </main>
    </div>
  );
}
