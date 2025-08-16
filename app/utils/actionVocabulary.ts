function speak({ contentEN, contentVN }: any) {
  // Create a SpeechSynthesisUtterance
  const utteranceEN = new SpeechSynthesisUtterance(
    contentEN ?? "Welcome to this tutorial!"
  );

  const utteranceVN = new SpeechSynthesisUtterance(
    contentVN ?? "Welcome to this tutorial!"
  );

  // Select a voice
  const voices = speechSynthesis.getVoices();
  console.log("voices", voices);

  utteranceEN.voice = voices[0]; // Choose a specific voice
  utteranceVN.voice = voices[3]; // Choose a specific voice
  utteranceVN.lang = "vi-VN";
  // Speak the text
  speechSynthesis.speak(utteranceEN);
  if (contentVN) {
    speechSynthesis.speak(utteranceVN);
  }
}
function showNotification(title: string, options: NotificationOptions) {
  if (Notification.permission === "granted") {
    new Notification(title, options);
  } else {
    console.log("No permission to display notifications");
  }
}
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function handleShowNotification(opt: any) {
  speak({
    contentEN: `${opt.phrase}`,
    contentVN: `${opt.meaning}`,
  });
}

export { speak, handleShowNotification, showNotification, sleep };
