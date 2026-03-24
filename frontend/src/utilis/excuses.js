export const relatives = [
  { id: 1, name: "Aunty Radha", type: "aunty", relation: "Father's Sister", urgency: "high", image: "https://api.dicebear.com/7.x/notionists/svg?seed=Mia" },
  { id: 2, name: "Uncle Shankar", type: "uncle", relation: "Mother's Brother", urgency: "medium", image: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix" },
  { id: 3, name: "Cousin Priya", type: "cousin", relation: "Aunty's Daughter", urgency: "low", image: "https://api.dicebear.com/7.x/notionists/svg?seed=Aneka" },
  { id: 4, name: "Bua Ji", type: "aunty", relation: "Paternal Aunt", urgency: "critical", image: "https://api.dicebear.com/7.x/notionists/svg?seed=Sophia" },
  { id: 5, name: "Mamaji", type: "uncle", relation: "Maternal Uncle", urgency: "high", image: "https://api.dicebear.com/7.x/notionists/svg?seed=Jude" }
];

export const excuses = {
  aunty: [
    "Sorry Aunty, I'm stuck in a tunnel. Network is very poor. Talk soon!",
    "Aunty, my phone is at 1%. I'll call you after it charges (in 3 days).",
    "I'm in a very serious blockchain meeting, Aunty. My salary depends on it!",
    "Aunty, I'm currently identifying as a full-time algorithm. Algorithms don't talk."
  ],
  uncle: [
    "Uncle, I just reached Bangalore. Network is terrible here.",
    "Uncle, my car broke down on the highway. I'm waiting for the mechanic.",
    "Uncle, I'm observing a digital fast today for world peace.",
    "I have a throat infection, Uncle. Doctor said 'No talking to relatives'."
  ],
  cousin: [
    "Bro/Sis, I'm in the middle of a global hackathon. Can't talk!",
    "I'm currently deflecting your call. Proxy Family rules, sorry!",
    "I'll call you back when I've found a job that pays more than your dad's expectations."
  ]
};

export const getRandomExcuse = (type) => {
  const list = excuses[type] || excuses.aunty;
  return list[Math.floor(Math.random() * list.length)];
};
