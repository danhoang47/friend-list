import { filterFriends, getFriends, getGroupColor, getGroupKeys, getGroupName } from "./store.js";

function getInitials(name) {
  return name.split(" ").map((w) => w[0]).join("");
}

function highlightMatch(name, query) {
  const idx = name.toLowerCase().indexOf(query);

  return name.slice(0, idx)
    + "<mark>" + name.slice(idx, idx + query.length) + "</mark>"
    + name.slice(idx + query.length);
}

function createCard(friend, group, index, filter) {
  const card = document.createElement("div");
  card.className = "card";
  card.draggable = true;
  card.dataset.id = friend.id;
  card.style.animationDelay = index * 60 + "ms";

  const nameHtml = filter ? highlightMatch(friend.name, filter) : friend.name;
  const color = getGroupColor(group);

  card.innerHTML =
    '<div class="avatar" style="background:' + color + '">' + getInitials(friend.name) + '</div>' +
    '<span class="name">' + nameHtml + '</span>' +
    '<button class="btn-remove" data-id="' + friend.id + '" data-group="' + group + '">&times;</button>' +
    '<span class="handle">⋮⋮</span>';

  return card;
}

// Painting all the groups currently shown in the page 
export function render(filter) {
  const main = document.querySelector("main");
  main.innerHTML = "";

  getGroupKeys().forEach((key) => {
    const section = document.createElement("section");
    section.className = "group";
    section.dataset.group = key;
    section.style.setProperty("--group-color", getGroupColor(key));

    const all = getFriends(key);
    const visible = filter ? filterFriends(key, filter) : all;

    const header = document.createElement("div");
    header.className = "group-header";
    header.innerHTML =
      '<span>' + getGroupName(key) + '</span>' +
      '<span class="count">' + all.length + '</span>';

    const list = document.createElement("div");
    list.className = "group-list";

    if (!visible.length) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = filter ? "No matches" : "Drop friends here";
      list.appendChild(empty);
    } else {
      visible.forEach((f, i) => {
        list.appendChild(createCard(f, key, i, filter));
      });
    }

    section.appendChild(header);
    section.appendChild(list);
    main.appendChild(section);
  });
}

// Render for specific group base on the key
export function renderGroup(key) {
  const section = document.querySelector('.group[data-group="' + key + '"]');
  if (!section) return;

  const list = section.querySelector(".group-list");
  // Querying this again to get the latest friend list 
  const all = getFriends(key);

  section.querySelector(".count").textContent = all.length;
  list.innerHTML = "";

  if (!all.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "Drop friends here";
    list.appendChild(empty);
  } else {
    all.forEach((f, i) => {
      const card = createCard(f, key, i, null);
      card.style.animation = "none";
      list.appendChild(card);
    });
  }
}
