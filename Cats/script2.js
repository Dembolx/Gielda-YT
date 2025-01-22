// Dodaj funkcję do przycisku "Explore Now"
document.getElementById("exploreBtn").addEventListener("click", () => {
  window.scrollTo({
    top: document.getElementById("gallery").offsetTop,
    behavior: "smooth",
  });
});

// Obsługa przycisków w galerii
document.querySelectorAll(".action-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const catName = event.target
      .closest(".gallery-item")
      .querySelector("h3").innerText;
    alert(`You clicked on: ${catName}`);
  });
});
