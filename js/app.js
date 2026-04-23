import { debounce } from "./debounce.js";
import { setup as setupDrag } from "./drag.js";
import { render, renderGroup } from "./render.js";
import { addGroup, getGroupColor, addFriend, getGroupKeys, getGroupName, removeFriend } from "./store.js";

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

function setupAddFriend() {
  const btn = document.getElementById("open-add-friend");
  const modal = document.getElementById("add-friend-modal");
  const input = document.getElementById("friend-name-input");
  const select = document.getElementById("friend-group-select");

  const createFriend = () => {
    const name = input.value.trim();
    const groupKey = select.value;
    if (!name || !groupKey) return;

    if (addFriend(groupKey, name)) {
      modal.close();
      renderGroup(groupKey);
    }
  };

  btn.addEventListener("click", () => {
    input.value = "";
    
    // Populate select with current groups
    select.innerHTML = "";
    const groupKeys = getGroupKeys();
    groupKeys.forEach(key => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = getGroupName(key);
      select.appendChild(option);
    });

    if (groupKeys.length > 0) {
      modal.showModal();
    } else {
      alert("Please create a group first!");
    }
  });

  document.getElementById("friend-modal-cancel").addEventListener("click", () => modal.close());
  document.getElementById("friend-modal-create").addEventListener("click", createFriend);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") createFriend();
  });
}

function setupRemoveFriend() {
  document.querySelector("main").addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-remove");
    if (!btn) return;
    
    e.stopPropagation();
    const id = btn.dataset.id;
    const group = btn.dataset.group;
    
    if (removeFriend(group, id)) {
      renderGroup(group);
    }
  });
}

render();
setupDrag();
setupSearch();
setupBackgroundChange();
setupCreateGroup();
setupAddFriend();
setupRemoveFriend();
