/********* GLOBAL STATE *********/
let isHovered = false;
let animationStarted = false;

/********* COOKIE FUNCTIONS *********/
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

/********* VERSION DATE *********/
// Assuming the #version-date element contains text like "Version: 5.3.2025"
const versionText = document.getElementById("version-date").textContent;
const versionDate = versionText.replace("Version:", "").trim();

/********* MESSAGE LOGIC *********/
function showHeartMessage() {
  const lastClick = getCookie("lastHeartClick");
  let message;
  if (lastClick === versionDate) {
    message = "Klick auf das Herz, um mehr zu erfahren!";
  } else {
    message = "Klick auf das Herz. Es gibt neue Sachen zu entdecken!";
  }
  
  const messageElement = document.createElement("div");
  messageElement.id = "heartMessage";
  messageElement.textContent = message;
  messageElement.style.position = "fixed";
  messageElement.style.top = "auto";
  messageElement.style.bottom = "10px";
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

function showRubrikenMessage() {
  const rubMessage = document.createElement("div");
  rubMessage.id = "rubrikenMessage";
  rubMessage.textContent = "Klicke die verschiedenen Herzchen an!";
  rubMessage.style.position = "fixed";
  messageElement.style.top = "auto";
  messageElement.style.bottom = "10px";
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
// Define two sets of cloud emojis: default and rainy clouds
const defaultClouds = ["☁️", "🌥️"];
const rainyClouds = ["🌧️"];
// Start with default clouds
let currentClouds = defaultClouds;

function spawnCloud() {
  if (document.hidden) {
    setTimeout(spawnCloud, 1000);
    return;
  }
  
  const cloud = document.createElement("div");
  cloud.classList.add("cloud");
  // Use currentClouds array for the cloud emoji
  cloud.textContent = currentClouds[Math.floor(Math.random() * currentClouds.length)];
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
  
  const nextDelay = Math.random() * 2000 + 1000;
  setTimeout(spawnCloud, nextDelay);
}
spawnCloud();

/********* ADDITIONAL ELEMENTS *********/
let staticMessageContainer = null;

function showAdditionalElements() {
  // Fade in the logo
  gsap.to("#logo", { opacity: 1, duration: 1, ease: "power1.in", delay: 0.1 });
  
  // Data for the side hearts (emoji, vertical position, background color, and associated content)
const heartsData = [
  { emoji: "💛", top: "20%", lightColor: "#fff3b8", contentId: "content-yellow", label: "Erklärung" },
  { emoji: "💙", top: "40%", lightColor: "#b3e0ff", contentId: "content-blue",    label: "Orientierung" },
  { emoji: "💚", top: "80%", lightColor: "#b3e6b3", contentId: "content-green",   label: "Info" },
  { emoji: "💖", top: "60%", lightColor: "#ffb3e6", contentId: "content-pink",    label: "Kontakt" }
];

  
  heartsData.forEach((data) => {
    const leftHeart = document.createElement("div");
    //leftHeart.textContent = data.emoji;
    leftHeart.style.position = "fixed";
    leftHeart.style.left = "10px";
    leftHeart.style.top = data.top;
    leftHeart.style.display    = "inline-flex";    // <-- so emoji + text sit side by side
    leftHeart.style.alignItems = "center";
    leftHeart.style.fontSize = "40px";
    leftHeart.style.cursor = "pointer";
    leftHeart.style.zIndex = "15";
    leftHeart.style.opacity = "0"; // Start hidden for fade-in
    document.body.appendChild(leftHeart);
    
      // the emoji
    const icon = document.createElement("span");
    icon.textContent      = data.emoji;
    icon.style.fontSize   = "40px";
    leftHeart.appendChild(icon);

    // the label
    const label = document.createElement("span");
    label.textContent     = data.label;
    label.style.marginLeft  = "8px";           // space between icon & text
    label.style.fontSize    = "22px";          // adjust to taste
    label.style.fontWeight = "bold";
    label.style.color       = data.lightColor; // same pastel you already have
    label.style.webkitTextStroke = "0.5px black";
    leftHeart.appendChild(label);

    gsap.to(leftHeart, { opacity: 1, duration: 1, ease: "power1.in", delay: 0.2 });
    

    leftHeart.addEventListener("mouseenter", () => {
      gsap.to(leftHeart, { scale: 1.5, duration: 0.3, ease: "power1.out" });
    });
    leftHeart.addEventListener("mouseleave", () => {
      gsap.to(leftHeart, { scale: 1, duration: 0.3, ease: "power1.out" });
    });
    
    leftHeart.addEventListener("click", () => {
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
        // For the pink heart, check if the form has already been submitted
        if (data.contentId === "content-pink" && document.cookie.indexOf("formSubmitted=true") !== -1) {
          staticMessageContainer.innerHTML = "<p>Danke! Du hast das Anmeldeformular ausgefüllt</p>";
        } else {
          staticMessageContainer.innerHTML = contentEl.innerHTML;
        }
      } else {
        staticMessageContainer.innerHTML = `<p>Error: Content not found</p>`;
      }
      
      // Always reset scroll position to the top
      staticMessageContainer.scrollTop = 0;
      
      // If this is the pink heart (registration form), attach event listeners
      if (data.contentId === "content-pink" && document.cookie.indexOf("formSubmitted=true") === -1) {
        const regForm = staticMessageContainer.querySelector("#registrationForm");
        if (regForm) {
          // Change event: adjust background and cloud type based on attendance
          regForm.addEventListener("change", function() {
            const attendance = regForm.elements["attendance"].value;
            if (attendance === "nein") {
              currentClouds = rainyClouds;
              gsap.to(document.body, { backgroundColor: "#808080", duration: 2, ease: "power2.inOut" });
            } else if (attendance === "ja") {
              currentClouds = defaultClouds;
              gsap.to(document.body, { backgroundColor: "#ffc0cb", duration: 2, ease: "power2.inOut" });
            }
          });
          // Submit event: send the form via AJAX and set a cookie on success
          regForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const formData = new FormData(regForm);
            fetch(regForm.action, {
              method: regForm.method,
              headers: {
                'Accept': 'application/json'
              },
              body: formData
            }).then(response => {
              if(response.ok) {
                setCookie("formSubmitted", "true", 365);
                staticMessageContainer.innerHTML = "<p>Danke! Du hast das Anmeldeformular ausgefüllt</p>";
              } else {
                alert("Fehler beim Absenden des Formulars. Bitte versuche es später erneut.");
              }
            }).catch(error => {
              alert("Fehler beim Absenden des Formulars. Bitte versuche es später erneut.");
            });
          });
        }
      }
      
      // Animate background color based on the heart's assigned light color
      gsap.to(document.body, {
        backgroundColor: data.lightColor,
        duration: 2,
        ease: "power2.inOut"
      });
    });
  });
}

/********* BIG HEART CLICK EVENT *********/
document.getElementById("heartScreen").addEventListener("click", (e) => {
  if (animationStarted) return;
  animationStarted = true;
  
  // Update cookie with the current version date
  setCookie("lastHeartClick", versionDate, 365);
  
  // Fade out the heart message
  gsap.to("#heartMessage", {
    opacity: 0,
    duration: 0.5,
    ease: "power1.out",
    onComplete: () => {
      const msgEl = document.getElementById("heartMessage");
      if (msgEl) msgEl.remove();
    }
  });
  
  // Use matchMedia for a more reliable mobile check
  if (window.matchMedia("(max-width: 600px)").matches) {
    // For smartphones: fade out the heart only
    gsap.to(heart, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        document.getElementById("heartScreen").style.display = "none";
        showAdditionalElements();
        showRubrikenMessage();
      }
    });
  } else {
    // For larger devices: perform the full scaling and fade animation
    gsap.to(heartContainer, {
      scale: 10,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        document.getElementById("heartScreen").style.display = "none";
        showAdditionalElements();
        showRubrikenMessage();
      }
    });
    gsap.to(heart, {
      opacity: 0,
      duration: 1.5,
      ease: "power2.inOut"
    });
  }
});


/********* DOMContentLoaded *********/
document.addEventListener("DOMContentLoaded", showHeartMessage);
