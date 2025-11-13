import { useState } from "react";
import TranslationInput from "../TranslationInput";

export default function TranslationInputExample() {
  const [text, setText] = useState("안녕하세요");

  return (
    <TranslationInput
      value={text}
      onChange={setText}
      onTranslate={() => console.log("Translate:", text)}
      isLoading={false}
    />
  );
}
