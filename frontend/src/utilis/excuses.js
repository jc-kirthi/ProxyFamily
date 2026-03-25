export const relatives = [
  { id: 1, name: "Aunty Radha", type: "aunty", relation: "Father's Sister", urgency: "high", image: "https://api.dicebear.com/7.x/notionists/svg?seed=Mia" },
  { id: 2, name: "Uncle Shankar", type: "uncle", relation: "Mother's Brother", urgency: "medium", image: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix" },
  { id: 3, name: "Cousin Priya", type: "cousin", relation: "Aunty's Daughter", urgency: "low", image: "https://api.dicebear.com/7.x/notionists/svg?seed=Aneka" },
  { id: 4, name: "Bua Ji", type: "aunty", relation: "Paternal Aunt", urgency: "critical", image: "https://api.dicebear.com/7.x/notionists/svg?seed=Sophia" },
  { id: 5, name: "Mamaji", type: "uncle", relation: "Maternal Uncle", urgency: "high", image: "https://api.dicebear.com/7.x/notionists/svg?seed=Jude" }
];

// 5 generic 'Savage but Respectful' excuses — recorded by user in Voice Identity
const GENERIC_EXCUSES = [
  "I'm currently prioritizing my peace over this conversation. Pls respect the boundaries. Slay!",
  "Your feedback is being archived for a time when I actually asked for it. Stay blessed!",
  "I'm in my 'Main Character' era and this side-quest doesn't fit the plot. Brb!",
  "Low aura move, family. Let's keep the energy positive or not at all. Period.",
  "I'm literally in the middle of a life-changing event. My AI proxy will take it from here. Cya!"
];

export const excuses = {
  aunty: GENERIC_EXCUSES,
  uncle: GENERIC_EXCUSES,
  cousin: GENERIC_EXCUSES
};

// Sequential text queue — mirrors audioHelper voiceQueueIndex (0-indexed)
let excuseQueueIndex = 0;
export const resetExcuseQueue = () => { excuseQueueIndex = 0; };

// Returns the next excuse text in order (wraps after 5)
export const getNextExcuse = () => {
  const sampleNum = (excuseQueueIndex % GENERIC_EXCUSES.length) + 1; // 1-based
  const excuse = GENERIC_EXCUSES[excuseQueueIndex % GENERIC_EXCUSES.length];
  excuseQueueIndex++;
  return { text: excuse, sampleNum };
};

export const getRandomExcuse = (type) => {
  const list = excuses[type] || GENERIC_EXCUSES;
  const index = Math.floor(Math.random() * list.length);
  return { text: list[index], index };
};
