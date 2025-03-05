
/********* GLOBAL STATE *********/
let isHovered = false;
let animationStarted = false;

/********* COOKIE-FUNKTIONEN *********/
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/********* VERSIONSDATUM ERMITTELN *********/
// Wir gehen davon aus, dass im Element "#version-date" der Text im Format "Versionsdatum: 4.3.2025" steht.
const versionText = document.getElementById("version-date").textContent;
const versionDate = versionText.replace("Versionsdatum:", "").trim();

/********* NACHRICHTS-LOGIK *********/
function showHeartMessage() {
  // Hole den gespeicherten Wert aus dem Cookie
  const lastClick = getCookie("lastHeartClick");
  let message;
  if (lastClick === versionDate) {
    message = "Klick auf das Herz, um mehr zu erfahren!";
  } else {
    message = "Klick auf das Herz. Es gibt neue Sachen zu entdecken!";
  }
  
  // Erstelle das Nachrichten-Element und style es
  const messageElement = document.createElement("div");
  messageElement.id = "heartMessage";
  messageElement.textContent = message;
  messageElement.style.position = "fixed";
  messageElement.style.top = "85%"; // etwas oberhalb des Herzens
  messageElement.style.left = "50%";
  messageElement.style.transform = "translateX(-50%)";
  messageElement.style.fontSize = "18px";
  messageElement.style.fontFamily = "sans-serif";
  messageElement.style.padding = "10px 20px";
  messageElement.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
  messageElement.style.borderRadius = "5px";
  messageElement.style.zIndex = "11";
  
  document.body.appendChild(messageElement);
}

// Zeige die Nachricht, sobald der DOM geladen ist
document.addEventListener("DOMContentLoaded", showHeartMessage);


function showRubrikenMessage() {
  // Erstelle das Nachrichten-Element
  const rubMessage = document.createElement("div");
  rubMessage.id = "rubrikenMessage";
  rubMessage.textContent = "Klicke die Herzchen an, um die Rubriken zu entdecken!";
  rubMessage.style.position = "fixed";
  rubMessage.style.top = "85%"; // ähnlich wie beim Eingangs-Herz
  rubMessage.style.left = "50%";
  rubMessage.style.transform = "translateX(-50%)";
  rubMessage.style.fontSize = "18px";
  rubMessage.style.fontFamily = "sans-serif";
  rubMessage.style.padding = "10px 20px";
  rubMessage.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
  rubMessage.style.borderRadius = "5px";
  rubMessage.style.zIndex = "11";
  
  document.body.appendChild(rubMessage);
}

/********* HEART PULSATION *********/
const heart = document.querySelector('.heart');
const heartContainer = document.getElementById('heartContainer');
let heartPulse = gsap.to(heart, {
  scale: 1.2,
  duration: 0.5,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});

document.getElementById("heartScreen").addEventListener("mouseenter", () => {
  isHovered = true;
  heartPulse.timeScale(2);
  gsap.to(heartContainer, { scale: 2, duration: 0.5, ease: "power2.out" });
  gsap.to(heart, { filter: "drop-shadow(0 0 20px #ff6666)", duration: 0.5 });
});

document.getElementById("heartScreen").addEventListener("mouseleave", () => {
  isHovered = false;
  heartPulse.timeScale(1);
  gsap.to(heartContainer, { scale: 1, duration: 0.5, ease: "power2.out" });
  gsap.to(heart, { filter: "drop-shadow(0 0 0px #ff6666)", duration: 0.5 });
});

/********* CLOUD ANIMATIONS *********/
const cloudEmojis = ["☁️", "🌥️"];

function spawnCloud() {
  // Wenn der Tab nicht aktiv ist, überprüfe erneut in 1 Sekunde
  if (document.hidden) {
    setTimeout(spawnCloud, 1000);
    return;
  }
  
  // Erstelle und style die Wolke wie bisher
  const cloud = document.createElement("div");
  cloud.classList.add("cloud");
  cloud.textContent = cloudEmojis[Math.floor(Math.random() * cloudEmojis.length)];
  cloud.style.position = "absolute";
  cloud.style.top = (Math.random() * 70 + 10) + "vh";
  cloud.style.fontSize = (Math.random() * 20 + 30) + "px";
  document.getElementById("clouds").appendChild(cloud);
  
  const fromLeft = Math.random() < 0.5;
  let startX, endX;
  if (fromLeft) {
    startX = -100;
    endX = window.innerWidth + 100;
    cloud.style.left = startX + "px";
  } else {
    startX = window.innerWidth + 100;
    endX = -100;
    cloud.style.left = startX + "px";
  }
  let duration = Math.random() * 20 + 20;
 
  gsap.to(cloud, {
    x: endX - startX,
    duration: duration,
    ease: "linear",
    onComplete: () => { cloud.remove(); }
  });
  gsap.fromTo(cloud, {opacity: 0}, {opacity: 1, duration: 0.5, ease: "power1.in"});
  gsap.to(cloud, {opacity: 0, delay: duration - 3, duration: 3, ease: "power1.out"});
  
  // Starte den nächsten Cloud-Spawning mit einer zufälligen Verzögerung
  const nextDelay = (Math.random() * 2000 + 1000);
  setTimeout(spawnCloud, nextDelay);
}

spawnCloud();


// Global variable to hold the current message container
// Global variable to hold the static message container
let staticMessageContainer = null;
// Funktion, die die zusätzlichen Elemente (z. B. Logo und Rand-Herzen) einblendet
function showAdditionalElements() {
  // Blende das Logo ein (z. B. mit einer kleinen Verzögerung)
  gsap.to("#logo", { opacity: 1, duration: 1, ease: "power1.in", delay: 0.1 });
  
  // Erstelle die Rand-Herzen und blende sie ein
  const heartsData = [
    { emoji: "💛", top: "20%", color: "#ffff00", lightColor: "#ffffe0", contentId: "content-yellow" },
    { emoji: "💙", top: "40%", color: "#0000ff", lightColor: "#add8e6", contentId: "content-blue" },
    { emoji: "💚", top: "80%", color: "#00ff00", lightColor: "#90ee90", contentId: "content-green" },
    { emoji: "💖", top: "60%", color: "#ff69b4", lightColor: "#ffc0cb", contentId: "content-pink" }
  ];

  heartsData.forEach((data) => {
    const leftHeart = document.createElement("div");
    leftHeart.textContent = data.emoji;
    leftHeart.style.position = "fixed";
    leftHeart.style.left = "10px";
    leftHeart.style.top = data.top;
    leftHeart.style.fontSize = "40px";
    leftHeart.style.cursor = "pointer";
    leftHeart.style.zIndex = "15";
    leftHeart.style.opacity = "0"; // Start hidden for fade-in
    document.body.appendChild(leftHeart);
    
    // Einblende-Effekt für das Rand-Herz
    gsap.to(leftHeart, { opacity: 1, duration: 1, ease: "power1.in", delay: 0.2 });

    // Hover-Effekte
    leftHeart.addEventListener("mouseenter", () => {
      gsap.to(leftHeart, { scale: 1.5, duration: 0.3, ease: "power1.out" });
    });
    leftHeart.addEventListener("mouseleave", () => {
      gsap.to(leftHeart, { scale: 1, duration: 0.3, ease: "power1.out" });
    });
    
    // Klick-Funktionalität des Rand-Herzens
    leftHeart.addEventListener("click", () => {
      // Beispiel: Anzeige eines statischen Nachrichten-Containers
      if (!staticMessageContainer) {
        staticMessageContainer = document.createElement("div");
        staticMessageContainer.id = "staticMessageContainer";
        staticMessageContainer.style.position = "fixed";
        staticMessageContainer.style.top = "18%";
        staticMessageContainer.style.left = "16.67%";
        staticMessageContainer.style.width = "66.67%";
        staticMessageContainer.style.bottom = "0";
        staticMessageContainer.style.backgroundColor = "white";
        staticMessageContainer.style.overflowY = "auto";
        staticMessageContainer.style.padding = "20px";
        staticMessageContainer.style.borderRadius = "10px";
        staticMessageContainer.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
        staticMessageContainer.style.opacity = "0";
        staticMessageContainer.style.zIndex = "20";
        document.body.appendChild(staticMessageContainer);
        gsap.to(staticMessageContainer, { opacity: 1, duration: 1 });
      }
      
      const contentEl = document.getElementById(data.contentId);
      if (contentEl) {
        staticMessageContainer.innerHTML = contentEl.innerHTML;
      } else {
        staticMessageContainer.innerHTML = `<p>Error: Content not found</p>`;
      }
      
      // Beispielhafter Hintergrundfarben-Wechsel
      gsap.to(document.body, {
        backgroundColor: data.lightColor,
        duration: 2,
        ease: "power2.inOut"
      });
    });
  });
}

// Modifizierte Event-Listener-Funktion für das große Herz:
document.getElementById("heartScreen").addEventListener("click", (e) => {
  if (animationStarted) return;
  animationStarted = true;
  
  // Aktualisiere den Cookie, etc.
  setCookie("lastHeartClick", versionDate, 365);
  
  // Blende die Herz-Nachricht aus (sofern vorhanden)
  gsap.to("#heartMessage", {
    opacity: 0,
    duration: 1,
    ease: "power1.out",
    onComplete: () => {
      const msgEl = document.getElementById("heartMessage");
      if (msgEl) msgEl.remove();
    }
  });
  
  // Animation: Großes Herz vergrößern und verblassen lassen
  gsap.to(heartContainer, {
    scale: 10,
    duration: 1.5,
    ease: "power2.inOut",
    onComplete: () => {
      // Verberge das große Herz (falls festivalForm nicht benötigt wird)
      document.getElementById("heartScreen").style.display = "none";
      
      // Jetzt werden die zusätzlichen Elemente (Logo & Rand-Herzen) eingeblendet
      showAdditionalElements();
	  showRubrikenMessage();
    }
  });
  gsap.to(heart, {
    opacity: 0,
    duration: 1.5,
    ease: "power2.inOut"
  });
});












