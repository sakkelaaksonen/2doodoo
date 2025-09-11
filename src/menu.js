export default function Menu() {
  const menuBtn = document.getElementById('menu-btn');
  const menuPanel = document.getElementById('menu-panel');

  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    menuPanel.classList.toggle('open');
  });

  // // Update navi list name
  // function updateNaviListName(name) {
  //   document.getElementById('navi-listname').textContent = name || 'Todos';
  // }

  // // Listen for list selection changes
  // const selector = document.getElementById('todo-list-selector');
  // if (selector) {
  //   selector.addEventListener('change', () => {
  //     const selected = selector.options[selector.selectedIndex]?.textContent;
  //     updateNaviListName(selected);
  //   });
  //   // Initial set
  //   const selected = selector.options[selector.selectedIndex]?.textContent;
  //   updateNaviListName(selected);
  // }
}
