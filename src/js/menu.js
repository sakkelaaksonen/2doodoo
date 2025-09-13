export default function Menu() {
  const menuBtn = document.getElementById("menu-btn");
  const menuPanel = document.getElementById("menu-panel");

  menuBtn.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));
    menuPanel.classList.toggle("open");
  });

  const closeBtn = document.getElementById("menu-close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      menuBtn.setAttribute("aria-expanded", "false");
      menuPanel.classList.remove("open");
      menuBtn.focus();
    });
  }
  
  // Close menu when clicking outside
  // document.addEventListener("click", (event) => {
  //   if (!menuPanel.contains(event.target) && event.target !== menuBtn) {
  //     menuBtn.setAttribute("aria-expanded", "false");
  //     menuPanel.classList.remove("open");
  //   }
  // });

  return { menuBtn, menuPanel };
}
