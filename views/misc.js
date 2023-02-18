(() => {
  document.querySelectorAll(`.info.emus .emu`).forEach((el) => {
    el.onclick = async () => { await navigator.clipboard.writeText(el.alt) };
  });
  document.querySelectorAll(`label.donker`).forEach((el) => {
    el.onchange = () => { el.dataset.filename = `...` + el.children[0].value.slice(-20) };
  });
})();
