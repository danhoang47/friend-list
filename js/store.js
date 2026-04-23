const groupMeta = {
  work: { name: "Work", color: "#10b981" },
  school: { name: "School", color: "#f59e0b" },
  facebook: { name: "Facebook", color: "#3b82f6" }
};

const colorPool = ["#ec4899", "#8b5cf6", "#06b6d4", "#ef4444", "#84cc16", "#14b8a6"];
let nextColor = 0;

const friends = {
  work: [
    { id: 1, name: "Alex Turner" },
    { id: 2, name: "Sarah Chen" },
    { id: 3, name: "Marcus Rivera" },
    { id: 4, name: "Priya Patel" }
  ],
  school: [
    { id: 5, name: "Jordan Lee" },
    { id: 6, name: "Emma Wilson" },
    { id: 7, name: "Liam Murphy" },
    { id: 8, name: "Sofia Garcia" }
  ],
  facebook: [
    { id: 9, name: "Chris Nguyen" },
    { id: 10, name: "Mia Thompson" },
    { id: 11, name: "David Kim" },
    { id: 12, name: "Olivia Brown" }
  ]
};

export function moveFriend(id, from, to) {
  const idx = friends[from].findIndex((f) => f.id === id);
  if (idx < 0) return;
  const moved = friends[from].splice(idx, 1)[0];
  friends[to].push(moved);
}

export function getGroupKeys() {
  return Object.keys(friends);
}

export function getGroupColor(key) {
  return groupMeta[key] ? groupMeta[key].color : "#6b7280";
}

export function getGroupName(key) {
  return groupMeta[key] ? groupMeta[key].name : key;
}

export function getFriends(group) {
  return friends[group];
}

export function filterFriends(group, query) {
  return friends[group].filter((f) => f.name.toLowerCase().includes(query));
}

export function addGroup(name) {
  // the name passed in will be the key in the store
  const key = name.toLowerCase().replace(/\s+/g, "-");
  if (friends[key]) return null;
  
  // empty list for new group 
  friends[key] = [];
  // modulo to get the color for new group out of the list
  groupMeta[key] = {
    name: name,
    color: colorPool[nextColor % colorPool.length]
  };

  nextColor++;
  
  return key;
}

export function addFriend(group, name) {
  if (!friends[group]) return false;
  
  const allFriends = Object.values(friends).flat();
  const maxId = allFriends.reduce((max, f) => Math.max(max, f.id), 0);
  
  friends[group].push({ id: maxId + 1, name });
  return true;
}

export function removeFriend(group, id) {
  if (!friends[group]) return false;
  const index = friends[group].findIndex(f => f.id == id);
  if (index > -1) {
    friends[group].splice(index, 1);
    return true;
  }
  return false;
}