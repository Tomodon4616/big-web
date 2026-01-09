// Load projects from JSON
fetch("projects.json")
    .then(response => response.json())
    .then(data => {
        const timeline = document.getElementById("timeline-items");

        // Clear any existing items to prevent duplicates
        timeline.innerHTML = '';

        data.projects.forEach((project, index) => {
            // Alternate sides
            let side = index % 2 === 0 ? "left" : "right";

            const item = document.createElement("div");
            item.className = `timeline-item ${side}`;

            item.innerHTML = `
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div class="tech-list">
                    ${project.technologies
                        .map(t => `<span class="tech-badge">${t}</span>`)
                        .join("")}
                </div>
                <p class="date">${project.date}</p>
            `;

            timeline.appendChild(item);
        });
    })
    .catch(err => console.error("Error loading projects:", err));

// Fade-in observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: .2 }
);

// Also fade-in sections
document.querySelectorAll("section").forEach(sec => {
    sec.classList.add("fade-target");
    observer.observe(sec);
});


// Smooth slowed-down scrolling
document.addEventListener("wheel", (event) => {

    // If the page is too short, don't block scrolling
    if (document.body.scrollHeight <= window.innerHeight) return;

    event.preventDefault();

    const speed = 1; // your scroll slowing factor
    window.scrollBy({
        top: event.deltaY * speed,
        behavior: "smooth"
    });

}, { passive: false });


let plots = [];
let current = 0;
const img = document.getElementById("plot-display");

fetch("plots.json")
  .then(r => r.json())
  .then(data => {
    plots = data.plots;
    if (plots.length > 0) startRotation();
  });

function startRotation() {
  // Initial image
  img.src = plots[current];
  img.style.opacity = 1;

  setInterval(() => {
    // Fade out
    img.style.opacity = 0;

    // After fade-out, swap image, fade in
    setTimeout(() => {
      current = (current + 1) % plots.length;
      img.src = plots[current];
      img.style.opacity = 1;
    }, 1000);  // wait for fade-out to finish
  }, 5000);    // time each stays on screen
}

