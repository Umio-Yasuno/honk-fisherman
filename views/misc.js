(() => {
  document.querySelectorAll(`.info.emus .emu`).forEach((el) => {
    el.onclick = async () => { await navigator.clipboard.writeText(el.alt) };
  });
})();
