import TranslationOutput from "../TranslationOutput";

export default function TranslationOutputExample() {
  return (
    <TranslationOutput
      chineseText="安寧乎汝"
      romanization="ʔaːn neːŋ ɡaː njaʔ"
      onPlayAudio={() => console.log("Playing audio...")}
      isPlayingAudio={false}
    />
  );
}
