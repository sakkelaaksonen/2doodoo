export default function Menu() {
  const menuBtn = document.getElementById("menu-btn");
  const menuPanel = document.getElementById("menu-panel");

  menuBtn.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));
    menuPanel.classList.toggle("open");
  });

  return { menuBtn, menuPanel };
}
