const webhookUrl = 'https://discord.com/api/webhooks/1470517225969549435/Kh62XbLJ7YyCYmKcmVCkRD8m7kHIPgdF6en33zHJPuDG5IdTRnSf9_UxMQbf4FAr5Xp_';

async function sendToDiscord(answer) {
    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: `💖 **Walentynki update:** Użytkownik kliknął: **${answer}**` })
        });
    } catch (e) { console.error("Błąd webhooka:", e); }
}

const messages = [
    "Jesteś pewna?", "Na pewno??", "Pysiu, proszę...", 
    "Jeśli powiesz nie, moje serce pęknie...", "Będę zdruzgotany...", 
    "Tylko się droczę, powiedz tak! ❤️"
];

let messageIndex = 0;

function handleNoClick() {
    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');
    
    // Zmiana tekstu przycisku NIE
    noButton.textContent = messages[messageIndex];
    sendToDiscord(`NIE (komunikat: "${messages[messageIndex]}")`);
    messageIndex = (messageIndex + 1) % messages.length;

    // Powiększanie przycisku TAK
    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = `${currentSize * 1.4}px`;
    yesButton.style.padding = `${parseFloat(window.getComputedStyle(yesButton).paddingTop) * 1.2}px ${parseFloat(window.getComputedStyle(yesButton).paddingLeft) * 1.2}px`;
}

async function handleYesClick() {
    await sendToDiscord("TAK! 🌹✨");
    window.location.href = "jfgq76rd7v.html";
}

// Obsługa muzyki
window.addEventListener('DOMContentLoaded', () => {
    const bgm = document.getElementById('bgm');
    if (bgm) {
        bgm.volume = 0.6;
        const savedTime = sessionStorage.getItem('bgmCurrentTime');
        if (savedTime) bgm.currentTime = parseFloat(savedTime);
        bgm.play().catch(() => console.log("Czekam na kliknięcie, by włączyć muzykę"));
    }
    setInterval(() => {
        if (bgm && !bgm.paused) sessionStorage.setItem('bgmCurrentTime', bgm.currentTime);
    }, 1000);

});
