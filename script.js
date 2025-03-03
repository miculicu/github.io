
/********* GLOBAL STATE *********/
let isHovered = false;
let animationStarted = false;

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
  
  const nextDelay = (Math.random() * 2000 + 1000);
  setTimeout(spawnCloud, nextDelay);
}
spawnCloud();
// Global variable to hold the current message container
// Global variable to hold the static message container
let staticMessageContainer = null;

document.getElementById("heartScreen").addEventListener("click", (e) => {
  // Prevent multiple activations
  if (animationStarted) return;
  animationStarted = true;
  
  // Define hearts with emoji, position, full color, a lighter tone, and the ID of associated content
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
    
    // Fade in effect for the heart
    gsap.to(leftHeart, { opacity: 1, duration: 1, ease: "power1.in" });
    
    // Hover effect: enlarge on mouseenter and revert on mouseleave
    leftHeart.addEventListener("mouseenter", () => {
      gsap.to(leftHeart, { scale: 1.5, duration: 0.3, ease: "power1.out" });
    });
    leftHeart.addEventListener("mouseleave", () => {
      gsap.to(leftHeart, { scale: 1, duration: 0.3, ease: "power1.out" });
    });
    
    // When a left heart is clicked...
    leftHeart.addEventListener("click", () => {
      // If the static container does not exist, create it
      if (!staticMessageContainer) {
        staticMessageContainer = document.createElement("div");
        staticMessageContainer.id = "staticMessageContainer";
        staticMessageContainer.style.position = "fixed";
        // Position: start at 1/3 of the viewport from the top and stretch to the bottom
        staticMessageContainer.style.top = "18%";
        staticMessageContainer.style.left = "16.67%"; // centers a 66.67% width container
        staticMessageContainer.style.width = "66.67%";
        staticMessageContainer.style.bottom = "0";
        staticMessageContainer.style.backgroundColor = "white";
        staticMessageContainer.style.overflowY = "auto"; // scrollable vertically
        staticMessageContainer.style.padding = "20px";
        // Optional: set a border radius and shadow if desired
        staticMessageContainer.style.borderRadius = "10px";
        staticMessageContainer.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
        staticMessageContainer.style.opacity = "0";
        staticMessageContainer.style.zIndex = "20";
        document.body.appendChild(staticMessageContainer);
        gsap.to(staticMessageContainer, { opacity: 1, duration: 1 });
      }
      
      // Update the content of the static container with the hidden HTML block
      const contentEl = document.getElementById(data.contentId);
      if (contentEl) {
        staticMessageContainer.innerHTML = contentEl.innerHTML;
      } else {
        staticMessageContainer.innerHTML = `<p>Error: Content not found</p>`;
      }
      
      // Animate the background color gently to the heart's light color
      gsap.to(document.body, {
        backgroundColor: data.lightColor,
        duration: 2,
        ease: "power2.inOut"
      });
    });
  });
  
  gsap.to("#logo", { opacity: 1, duration: 1, ease: "power1.in" });
   
  // Animate main heart expansion and fade out
  gsap.to(heartContainer, {
    scale: 10,
    duration: 1.5,
    ease: "power2.inOut",
    onComplete: () => {
      // Hide the main heart screen and show the festival form (or next content)
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










