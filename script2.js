document.addEventListener("DOMContentLoaded", () => {
  const galleryItems = document.querySelectorAll(".gallery-item");

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      alert("You clicked on: " + item.querySelector("h3").textContent);
    });
  });
});
