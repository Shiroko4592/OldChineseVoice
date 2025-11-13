import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TranslationOutputProps {
  chineseText: string;
  romanization: string;
  isLoading?: boolean;
  onPlayAudio?: () => void;
  isPlayingAudio?: boolean;
}

export default function TranslationOutput({
  chineseText,
  romanization,
  isLoading = false,
  onPlayAudio,
  isPlayingAudio = false,
}: TranslationOutputProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${chineseText}\n${romanization}`);
    setCopied(true);
    toast({
      description: "번역 결과가 복사되었습니다.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center min-h-48">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">번역 중...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chineseText) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center min-h-48">
            <p className="text-muted-foreground">
              번역 결과가 여기에 표시됩니다
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">上古漢語</h2>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCopy}
              data-testid="button-copy"
            >
              <Copy className="w-4 h-4" />
            </Button>
            {onPlayAudio && (
              <Button
                size="icon"
                variant="ghost"
                onClick={onPlayAudio}
                disabled={isPlayingAudio}
                data-testid="button-play-audio"
              >
                {isPlayingAudio ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-3xl font-medium leading-relaxed" data-testid="text-chinese">
              {chineseText}
            </p>
          </div>
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">발음 (로마자 표기)</p>
            <p className="text-sm font-mono text-foreground/80" data-testid="text-romanization">
              {romanization}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
