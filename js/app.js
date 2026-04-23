import { debounce } from "./debounce.js";
import { setup as setupDrag } from "./drag.js";
import { render } from "./render.js";
import { addGroup, getGroupColor } from "./store.js";

const SEARCH_DEBOUNCE_DURATION = 300

const debouncedRender = debounce((q) => render(q || null), SEARCH_DEBOUNCE_DURATION);

function setupSearch() {
  document.getElementById("search").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    debouncedRender(q);
  });
}

function setupBackgroundChange() {
  document.querySelector("main").addEventListener("click", (e) => {
    const group = e.target.closest(".group");
    if (!group) return;

    const color = getGroupColor(group.dataset.group);

    document.body.style.background = "color-mix(in srgb, " + color + " 8%, #0f0f1a)";
  });
}

function setupCreateGroup() {
  const btn = document.getElementById("add-group");
  const modal = document.getElementById("create-modal");
  const input = document.getElementById("group-name-input");

  const createGroup = () => {
    const name = input.value.trim();
    if (!name) return;

    const key = addGroup(name);
    if (!key) return;

    modal.close();
    render();
  };

  btn.addEventListener("click", () => {
    input.value = "";
    modal.showModal();
  });

  document.getElementById("modal-cancel").addEventListener("click", () => modal.close());
  document.getElementById("modal-create").addEventListener("click", createGroup);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") createGroup();
  });
}

render();
setupDrag();
setupSearch();
setupBackgroundChange();
setupCreateGroup();
