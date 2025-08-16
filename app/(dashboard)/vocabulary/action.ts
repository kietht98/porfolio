class IVocabulary {
  async initial() {
    const [adv, adj, noun] = await Promise.all([
      fetch("/api/vocabulary/adv")
        .then((resp) => resp?.json())
        .then((res) => res.data)
        .catch(() => []),
      fetch("/api/vocabulary/adj")
        .then((resp) => resp?.json())
        .then((res) => res.data)
        .catch(() => []),
      fetch("/api/vocabulary/noun")
        .then((resp) => resp?.json())
        .then((res) => res.data)
        .catch(() => []),
    ]);
    return [adv, adj, noun];
  }

  exportDocs(type: "adv" | "adj" | "noun") {
    fetch("/api/vocabulary/export", {
      method: "POST",
      body: JSON.stringify({ type: type }),
    })
      .then((resp) => resp.blob())
      .then((res) => {
        console.log("res", res);
        // Create a temporary link element
        const url = window.URL.createObjectURL(res);
        const link = document.createElement("a");
        link.href = url;
        link.download = type + ".txt"; // Specify the filename for download
        document.body.appendChild(link);

        // Programmatically click the link to trigger the download
        link.click();

        // Clean up
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => console.log(err));
  }
  speak({ contentEN, contentVN }: any) {
    // Create a SpeechSynthesisUtterance
    const utteranceEN = new SpeechSynthesisUtterance(
      contentEN ?? "Welcome to this tutorial!"
    );

    const utteranceVN = new SpeechSynthesisUtterance(
      contentVN ?? "Welcome to this tutorial!"
    );

    // Select a voice
    const voices = speechSynthesis.getVoices();
    utteranceEN.voice = voices[0]; // Choose a specific voice
    utteranceVN.voice = voices[3]; // Choose a specific voice
    utteranceVN.lang = "vi-VN";
    // Speak the text
    speechSynthesis.speak(utteranceEN);
    speechSynthesis.speak(utteranceVN);
  }
  showNotification(title: string, options: NotificationOptions) {
    if (Notification.permission === "granted") {
      new Notification(title, options);
    } else {
      console.log("No permission to display notifications");
    }
  }
  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async handleShowNotification(opt: any) {
    console.log("opt", opt);
    for (const key of opt) {
      await this.sleep(10000);
      this.speak({
        contentEN: `${key.phrase}`,
        contentVN: `${key.meaning}`,
      });

      this.showNotification("Vocabulary!", {
        dir: "rtl",
        body: `${JSON.stringify(key)}`,
        // Optional unique tag to prevent stacking
      });
    }
  }

  getVocabularyAdv() {
    return fetch("/api/vocabulary/adv")
      .then((res) => res.json())
      .then((resp) => resp?.data as any[])
      .catch((err) => []);
  }

  getVocabularyAdj() {
    return fetch("/api/vocabulary/adj")
      .then((res) => res.json())
      .then((resp) => resp?.data as any[])
      .catch((err) => []);
  }

  getVocabularyNoun() {
    return fetch("/api/vocabulary/noun")
      .then((res) => res.json())
      .then((resp) => resp?.data as any[])
      .catch((err) => []);
  }
}

export default IVocabulary;
