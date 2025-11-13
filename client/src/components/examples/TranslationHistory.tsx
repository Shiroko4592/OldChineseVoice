import TranslationHistory from "../TranslationHistory";

export default function TranslationHistoryExample() {
  const mockTranslations = [
    {
      id: "1",
      koreanText: "안녕하세요",
      chineseText: "安寧乎汝",
      romanization: "ʔaːn neːŋ ɡaː njaʔ",
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      koreanText: "감사합니다",
      chineseText: "感謝",
      romanization: "kaːm sjaːʔ",
      createdAt: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: "3",
      koreanText: "좋은 하루 되세요",
      chineseText: "好日",
      romanization: "huːʔ nit",
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
    },
  ];

  return (
    <TranslationHistory
      translations={mockTranslations}
      onSelect={(t) => console.log("Selected:", t)}
      onClear={() => console.log("Clear history")}
    />
  );
}
