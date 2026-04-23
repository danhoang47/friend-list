import { renderGroup } from "./render.js";
import { moveFriend } from "./store.js";

let dragInfo = null;

export function setup() {
  const main = document.querySelector("main");

  main.addEventListener("dragstart", (e) => {
    const card = e.target.closest(".card");
    
    if (!card) return;

    // We can use e.dataTransfer.setData to carry this
    // but I prefer relying on a module-scoped variable
    dragInfo = {
      id: parseInt(card.dataset.id),
      from: card.closest(".group").dataset.group
    };
 
    card.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
  });

  main.addEventListener("dragend", (e) => {
    const card = e.target.closest(".card");

    if (card) card.classList.remove("dragging");

    document.querySelectorAll(".drag-over").forEach((el) => el.classList.remove("drag-over"));
    
    dragInfo = null;
  });

  main.addEventListener("dragover", (e) => {
    e.preventDefault();

    const group = e.target.closest(".group");

    if (group) group.classList.add("drag-over");
  });

  main.addEventListener("dragleave", (e) => {
    const group = e.target.closest(".group");

    if (group && !group.contains(e.relatedTarget)) {
      group.classList.remove("drag-over");
    }
  });

  main.addEventListener("drop", (e) => {
    e.preventDefault();

    const group = e.target.closest(".group");

    if (!group) return;

    group.classList.remove("drag-over");

    if (!dragInfo) return;

    const to = group.dataset.group;

    if (to === dragInfo.from) return;

    // Update the global store based on dragInfo
    moveFriend(dragInfo.id, dragInfo.from, to);
    // We call renderGroup again, to re-render
    // the "from" group and the "to" group of draggable card
    renderGroup(dragInfo.from);
    renderGroup(to);
  });
}
