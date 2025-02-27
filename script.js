/********* GLOBAL STATE *********/
let isHovered = false;
let animationStarted = false;

/********* BACKGROUND COLOR ANIMATION *********/
const bgTimeline = gsap.timeline({repeat: -1, yoyo: true});
bgTimeline.to(document.body, {
  backgroundColor: "#ff6666",
  duration: 15,
  ease: "none"
});
function updateBgSpeed() {
  bgTimeline.timeScale(isHovered ? 2 : 1);
}

/********* HEART PULSATION *********/
const heart = document.querySelector('.heart');
const heartContainer = document.getElementById('heartContainer');
let heartPulse = gsap.to(heart, {
  scale: 1.1,
  duration: 0.5,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});

document.getElementById("heartScreen").addEventListener("mouseenter", () => {
  isHovered = true;
  updateBgSpeed();
  heartPulse.timeScale(2);
  gsap.to(heartContainer, { scale: 2, duration: 0.5, ease: "power2.out" });
  gsap.to(heart, { filter: "drop-shadow(0 0 20px #ff6666)", duration: 0.5 });
});
document.getElementById("heartScreen").addEventListener("mouseleave", () => {
  isHovered = false;
  updateBgSpeed();
  heartPulse.timeScale(1);
  gsap.to(heartContainer, { scale: 1, duration: 0.5, ease: "power2.out" });
  gsap.to(heart, { filter: "drop-shadow(0 0 0px #ff6666)", duration: 0.5 });
});

/********* CLOUD ANIMATIONS *********/
const cloudEmojis = ["☁️", "🌥️"];
function spawnCloud() {
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
  if (isHovered) { duration /= 1.5; }
  gsap.to(cloud, {
    x: endX - startX,
    duration: duration,
    ease: "linear",
    onComplete: () => { cloud.remove(); }
  });
  gsap.fromTo(cloud, {opacity: 0}, {opacity: 1, duration: 0.5, ease: "power1.in"});
  gsap.to(cloud, {opacity: 0, delay: duration - 3, duration: 3, ease: "power1.out"});
  
  const nextDelay = (Math.random() * 2000 + 1000);
  setTimeout(spawnCloud, nextDelay);
}
spawnCloud();

/********* HEART CLICK ANIMATION & PARTICLE EFFECT *********/
document.getElementById("heartScreen").addEventListener("click", (e) => {
  // Spawn heart particles at the click position
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.textContent = "❤️";
    particle.style.position = "fixed";
    particle.style.left = e.clientX + "px";
    particle.style.top = e.clientY + "px";
    particle.style.fontSize = "20px";
    particle.style.zIndex = "12";
    document.body.appendChild(particle);
    gsap.to(particle, {
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      duration: 1.2,
      ease: "power2.out"
    });
  }
  
  // Prevent multiple activations
  if (animationStarted) return;
  animationStarted = true;
  
  // Animate the heart expansion and fade out
  gsap.to(heartContainer, {
    scale: 10,
    duration: 1.5,
    ease: "power2.inOut",
    onComplete: () => {
      document.getElementById("heartScreen").style.display = "none";
      document.getElementById("festivalForm").style.display = "block";
    }
  });
  gsap.to(heart, {
    opacity: 0,
    duration: 1.5,
    ease: "power2.inOut"
  });
});



/********* FORM SUBMISSION, GOOGLE SHEETS, CONFETTI & BALLOON CELEBRATION *********/
document.getElementById("dateForm").addEventListener("submit", (e) => {
  e.preventDefault();

  // Gather selected festival dates from checkboxes
  let selectedDates = [];
  document.querySelectorAll('input[name="festivalDate"]:checked').forEach((checkbox) => {
    selectedDates.push(checkbox.value);
  });

  if (selectedDates.length === 0) {
    alert("Bitte wähle mindestens ein Datum!");
    return;
  }

  // Send the data to Google Sheets via your Apps Script Web App URL
  fetch("https://script.google.com/macros/s/AKfycbzYrDz9u7O5lvIroOsTsM2Vl-GR-xaAHvDOkc-CEAd31D3O6vlFAs-E0V-CHEucsMWBIw/exec", {
    method: "POST",
    mode: "no-cors", // Use no-cors mode for Apps Script web apps
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      festivalDate: selectedDates.join(", ")
    })
  })
    .then(() => {
      console.log("Data sent to Google Sheets");
    })
    .catch((error) => {
      console.error("Error sending data:", error);
    });

  // Hide the form immediately after submission
  document.getElementById("festivalForm").style.display = "none";

  // Launch confetti using canvas-confetti
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  // Create balloon effect from the bottom upward
  for (let i = 0; i < 10; i++) {
    let balloon = document.createElement("div");
    balloon.textContent = "🎈";
    balloon.style.position = "fixed";
    balloon.style.left = Math.random() * window.innerWidth + "px";
    balloon.style.bottom = "-50px";
    balloon.style.fontSize = (Math.random() * 30 + 30) + "px";
    balloon.style.opacity = 1;
    balloon.style.zIndex = "20";
    document.body.appendChild(balloon);
    gsap.to(balloon, {
      y: -window.innerHeight - 50,
      opacity: 0,
      duration: Math.random() * 3 + 3,
      ease: "power1.out",
      onComplete: () => { balloon.remove(); }
    });
  }

  // After the celebration, show the thank you message after a short delay
  setTimeout(() => {
    document.getElementById("thankYou").style.display = "block";
  }, 3000);
});
