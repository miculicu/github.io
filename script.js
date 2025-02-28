/********* UTILITY FUNCTIONS *********/
// Set a cookie with a given name, value, and expiration in seconds
function setCookie(name, value, seconds) {
  document.cookie = name + "=" + encodeURIComponent(value) + "; max-age=" + seconds + "; path=/";
}

// Check if a cookie exists (returns true if found)
function hasCookie(name) {
  return document.cookie.split(';').some(c => c.trim().startsWith(name + '='));
}

/********* INITIAL SETUP ON DOM LOAD *********/
document.addEventListener("DOMContentLoaded", function() {
  // If the user has already submitted, update UI immediately.
  if (hasCookie("submitted")) {
    document.getElementById("heartScreen").style.display = "none";
    document.getElementById("festivalForm").style.display = "none";
    // Set the message for users who already voted.
    document.getElementById("thankYou").innerHTML = "Du hast bereits abgestimmt! Mehr Informationen bald auf dieser Website. Stay tuna ;)";
    document.getElementById("thankYou").style.display = "block";
  }
});

// Set the target date for Tuesday, March 4th, 2025 (midnight)
const targetDate = new Date('March 4, 2025 00:00:00');

// Function to update the countdown timer
function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;
  
  // If the time is up, show a message and stop updating.
  if (diff <= 0) {
    document.getElementById('countdown').textContent = "Survey Closed";
    clearInterval(countdownInterval);
    return;
  }
  
  // Calculate remaining days, hours, minutes, and seconds
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  // Update the timer's content to include seconds
  document.getElementById('countdown').textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Update every second for smooth countdown
updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);


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

  // If user has already submitted (cookie exists), immediately show thank-you message.
  if (hasCookie("submitted")) {
    document.getElementById("heartScreen").style.display = "none";
    document.getElementById("festivalForm").style.display = "none";
    document.getElementById("thankYou").style.display = "block";
    return;
  }

  // Prevent multiple activations of the expansion animation
  if (animationStarted) return;
  animationStarted = true;
  
  // Animate heart expansion and fade out
  gsap.to(heartContainer, {
    scale: 10,
    duration: 1.5,
    ease: "power2.inOut",
    onComplete: () => {
      // Hide heart container and show the form if not already submitted.
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

/********* FORM SUBMISSION, CONFETTI, BALLOON CELEBRATION & COOKIE SETTING *********/
document.getElementById("dateForm").addEventListener("submit", function(e) {
  e.preventDefault(); // Prevent default form submission

  // Gather the form data (including the new name field)
  const form = e.target;
  const formData = new FormData(form);

  // Send the form data using fetch (using no-cors for Formspree)
  fetch(form.action, {
    method: "POST",
    body: formData,
    mode: "no-cors"  // Using no-cors mode so that the request is sent without CORS issues
  })
  .then(() => {
    console.log("Form data successfully sent.");
    // Set a cookie so the user is remembered as having submitted (1 year = 31536000 seconds)
    setCookie("submitted", "true", 31536000);
  })
  .catch((error) => {
    console.error("Error sending form data:", error);
  });

  // Hide the form
  document.getElementById("festivalForm").style.display = "none";

  // Launch confetti using canvas-confetti
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  // Create a balloon effect from the bottom upward
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

  // After the celebration, update the thank-you message for a first-time submission
  setTimeout(() => {
    document.getElementById("thankYou").innerHTML = "Danke! Mehr Informationen bald auf dieser Website. Stay tuna ;)";
    document.getElementById("thankYou").style.display = "block";
  }, 3000);
});
