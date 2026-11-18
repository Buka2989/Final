// Trait order: courage, strategy, teamwork, creativity.
const questions = [
  {
    category: "Teamwork",
    text: "A group project starts tomorrow. What is your first move?",
    options: [
      { text: "Take the lead and divide up the work.", scores: [3, 2, 2, 1] },
      { text: "Make a plan before anyone starts.", scores: [0, 3, 2, 1] },
      { text: "Check what everyone needs help with.", scores: [1, 1, 3, 1] },
      { text: "Pitch an idea nobody has tried before.", scores: [2, 1, 1, 3] }
    ]
  },
  {
    category: "Everyday life",
    text: "Your friends have a free Saturday. You suggest…",
    options: [
      { text: "A spontaneous trip somewhere new.", scores: [3, 0, 2, 3] },
      { text: "Our favourite place, with the whole group.", scores: [1, 1, 3, 0] },
      { text: "An escape room with a proper challenge.", scores: [1, 3, 2, 2] },
      { text: "Making something: music, art, or a small game.", scores: [1, 2, 1, 3] }
    ]
  },
  {
    category: "Under pressure",
    text: "A plan goes wrong at the last minute. You…",
    options: [
      { text: "Stay calm and work out what changed.", scores: [0, 3, 2, 1] },
      { text: "Make a quick decision and get moving.", scores: [3, 2, 1, 0] },
      { text: "Make sure nobody feels left on their own.", scores: [2, 1, 3, 0] },
      { text: "Improvise a completely different solution.", scores: [2, 1, 0, 3] }
    ]
  },
  {
    category: "Motivation",
    text: "Which compliment would mean the most to you?",
    options: [
      { text: "You always have my back.", scores: [2, 1, 3, 0] },
      { text: "You see things in a different way.", scores: [1, 2, 1, 3] },
      { text: "You make difficult things look simple.", scores: [1, 3, 1, 1] },
      { text: "You are brave enough to go for it.", scores: [3, 0, 1, 2] }
    ]
  },
  {
    category: "Decisions",
    text: "You have to learn a new skill. How do you begin?",
    options: [
      { text: "Jump in and learn by trying.", scores: [3, 0, 1, 2] },
      { text: "Find a guide and follow a clear routine.", scores: [1, 3, 1, 0] },
      { text: "Learn with a friend and help each other.", scores: [1, 2, 3, 1] },
      { text: "Experiment and develop my own approach.", scores: [2, 2, 0, 3] }
    ]
  },
  {
    category: "Friendship",
    text: "A friend comes to you after a difficult day. You…",
    options: [
      { text: "Listen and remind them I am here for them.", scores: [1, 1, 3, 1] },
      { text: "Help them break the problem into small steps.", scores: [1, 3, 2, 0] },
      { text: "Encourage them to face the issue directly.", scores: [3, 2, 2, 1] },
      { text: "Find an unexpected way to make them smile.", scores: [2, 1, 2, 3] }
    ]
  },
  {
    category: "Your style",
    text: "In a game, what feels most satisfying?",
    options: [
      { text: "A bold move that changes everything.", scores: [3, 1, 1, 2] },
      { text: "A carefully planned strategy working out.", scores: [1, 3, 1, 1] },
      { text: "Helping the whole team win together.", scores: [2, 1, 3, 0] },
      { text: "Winning with an unusual combination.", scores: [2, 2, 0, 3] }
    ]
  },
  {
    category: "Conflict",
    text: "Two teammates disagree. What do you do?",
    options: [
      { text: "Hear both sides and look for common ground.", scores: [0, 3, 3, 1] },
      { text: "Say what I think and help make a decision.", scores: [3, 2, 2, 0] },
      { text: "Support the person who is being overlooked.", scores: [2, 1, 3, 0] },
      { text: "Suggest a third option neither considered.", scores: [1, 2, 1, 3] }
    ]
  },
  {
    category: "Curiosity",
    text: "You discover a mysterious door in an adventure game. You…",
    options: [
      { text: "Open it. That is where the adventure is.", scores: [3, 0, 1, 3] },
      { text: "Look for clues before touching anything.", scores: [0, 3, 1, 2] },
      { text: "Wait until the whole party is ready.", scores: [1, 2, 3, 0] },
      { text: "Try to find a secret entrance around it.", scores: [2, 2, 0, 3] }
    ]
  },
  {
    category: "Habits",
    text: "A deadline is getting close. Your usual approach is…",
    options: [
      { text: "Work through my checklist, one task at a time.", scores: [2, 3, 1, 0] },
      { text: "Bring everyone together for a final push.", scores: [3, 1, 3, 1] },
      { text: "Finish my part and help someone who is behind.", scores: [1, 2, 3, 0] },
      { text: "Find a clever way to simplify the whole task.", scores: [1, 2, 0, 3] }
    ]
  },
  {
    category: "Values",
    text: "What matters most when you join a new team?",
    options: [
      { text: "Trust: people look out for one another.", scores: [1, 1, 3, 0] },
      { text: "Direction: we know what we want to achieve.", scores: [2, 3, 1, 0] },
      { text: "Freedom: unusual ideas are welcome.", scores: [1, 2, 0, 3] },
      { text: "Energy: people are ready to take a chance.", scores: [3, 0, 2, 3] }
    ]
  },
  {
    category: "The final move",
    text: "Pick the motto that sounds most like you.",
    options: [
      { text: "Be the person others can rely on.", scores: [2, 1, 3, 0] },
      { text: "Think ahead. Stay calm. Make it count.", scores: [0, 3, 2, 1] },
      { text: "A little courage can change everything.", scores: [3, 1, 2, 1] },
      { text: "There is always another way to do it.", scores: [1, 2, 0, 3] }
    ]
  }
];

const characters = [
  {
    "id": "knight",
    "name": "Knight",
    "role": "The loyal protector",
    "elixir": 3,
    "profile": [
      65,
      45,
      95,
      30
    ],
    "description": "You are the friend everyone can count on. You keep your promises, stand up for your people, and make a team feel safe.",
    "strength": "Consistency. You show up even when the excitement wears off.",
    "growth": "Your needs matter too. You can say no without letting your team down."
  },
  {
    "id": "archers",
    "name": "Archers",
    "role": "The thoughtful teammate",
    "elixir": 3,
    "profile": [
      30,
      85,
      90,
      45
    ],
    "description": "You notice what others miss. Patient, observant, and collaborative, you prefer a well-timed move to a dramatic entrance.",
    "strength": "Perspective. You listen closely and connect the dots.",
    "growth": "Share your ideas sooner. They do not have to be perfect to be useful."
  },
  {
    "id": "wizard",
    "name": "Wizard",
    "role": "The creative spark",
    "elixir": 5,
    "profile": [
      60,
      75,
      40,
      95
    ],
    "description": "You bring imagination to every challenge. You love exploring possibilities and turning a small idea into something people remember.",
    "strength": "Originality. You can find a fresh route through a familiar problem.",
    "growth": "Give your best idea enough time to become a finished project."
  },
  {
    "id": "mini-pekka",
    "name": "Mini P.E.K.K.A",
    "role": "The focused achiever",
    "elixir": 4,
    "profile": [
      85,
      85,
      35,
      25
    ],
    "description": "Once you pick a goal, you commit. You value clear plans, practical progress, and the satisfaction of getting things done.",
    "strength": "Focus. You turn a difficult task into a series of manageable steps.",
    "growth": "Leave room for other approaches. Efficiency is not the only thing a team needs."
  },
  {
    "id": "hog-rider",
    "name": "Hog Rider",
    "role": "The fearless adventurer",
    "elixir": 4,
    "profile": [
      100,
      25,
      60,
      80
    ],
    "description": "You are usually the first to say: let's try it. Your energy gets people moving, and a little uncertainty makes life more interesting.",
    "strength": "Initiative. You give the group the push it needs to begin.",
    "growth": "Pause for a quick plan before you charge into your next adventure."
  },
  {
    "id": "valkyrie",
    "name": "Valkyrie",
    "role": "The confident leader",
    "elixir": 4,
    "profile": [
      90,
      60,
      85,
      45
    ],
    "description": "When things get messy, you step forward. You are direct, protective, and willing to make a hard decision for the people around you.",
    "strength": "Courage. You face uncomfortable situations instead of avoiding them.",
    "growth": "Make space for quieter voices before making the final call."
  },
  {
    "id": "goblins",
    "name": "Goblins",
    "role": "The playful wildcard",
    "elixir": 2,
    "profile": [
      65,
      55,
      25,
      100
    ],
    "description": "You question the obvious answer and enjoy a clever shortcut. Curious and spontaneous, you make ordinary days a little less predictable.",
    "strength": "Resourcefulness. You spot possibilities where others only see rules.",
    "growth": "Think about how a surprise will land before you spring it on someone."
  },
  {
    "id": "ice-wizard",
    "name": "Ice Wizard",
    "role": "The calm strategist",
    "elixir": 3,
    "profile": [
      20,
      100,
      65,
      55
    ],
    "description": "You stay composed under pressure. You like understanding the whole situation before acting and help others slow down when things get tense.",
    "strength": "Clarity. You separate a real problem from the noise around it.",
    "growth": "Sometimes a good decision now is more useful than a perfect decision later."
  }
];
