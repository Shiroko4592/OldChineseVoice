import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Languages } from "lucide-react";

interface TranslationInputProps {
  value: string;
  onChange: (value: string) => void;
  onTranslate: () => void;
  isLoading?: boolean;
}

export default function TranslationInput({
  value,
  onChange,
  onTranslate,
  isLoading = false,
}: TranslationInputProps) {
  const charCount = value.length;
  const maxChars = 500;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">한국어</h2>
          </div>
          {value && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onChange("")}
              data-testid="button-clear-input"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="번역할 한국어 텍스트를 입력하세요..."
          className="min-h-48 text-lg resize-none focus-visible:ring-1"
          maxLength={maxChars}
          data-testid="input-korean-text"
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground" data-testid="text-char-count">
            {charCount} / {maxChars}
          </span>
          <Button
            onClick={onTranslate}
            disabled={!value.trim() || isLoading}
            data-testid="button-translate"
            className="min-w-32"
          >
            {isLoading ? "번역 중..." : "번역하기"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
