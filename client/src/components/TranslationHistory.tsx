import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { type Translation } from "@shared/schema";

interface TranslationHistoryProps {
  translations: Translation[];
  onSelect: (translation: Translation) => void;
  onClear: () => void;
}

export default function TranslationHistory({
  translations,
  onSelect,
  onClear,
}: TranslationHistoryProps) {
  if (translations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5" />
            번역 기록
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            아직 번역 기록이 없습니다
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5" />
          번역 기록
        </CardTitle>
        <Button
          size="sm"
          variant="ghost"
          onClick={onClear}
          data-testid="button-clear-history"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-3">
            {translations.map((translation) => (
              <button
                key={translation.id}
                onClick={() => onSelect(translation)}
                className="w-full text-left p-4 rounded-lg border hover-elevate active-elevate-2 transition-colors"
                data-testid={`history-item-${translation.id}`}
              >
                <div className="space-y-2">
                  <p className="text-sm font-medium line-clamp-1">
                    {translation.koreanText}
                  </p>
                  <p className="text-lg line-clamp-1">
                    {translation.chineseText}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(translation.createdAt), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
