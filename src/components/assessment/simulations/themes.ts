export interface AttentionConfig {
  targets: string[];
  distractor: string;
  instruction: string;
  stageName: string;
}

export interface MemoryConfig {
  items: string[];
  instruction: string;
  stageName: string;
}

export interface SortingConfig {
  items: { emoji: string; rule: string }[];
  categories: string[];
  instruction: string;
  stageName: string;
}

export interface PuzzleConfig {
  colors: string[];
  instruction: string;
  stageName: string;
}

export interface ChoiceConfig {
  paths: { emoji: string; name: string; description: string }[];
  bonusPrompt: string;
  instruction: string;
  stageName: string;
}

export interface SimulationTheme {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  attention: AttentionConfig;
  memory: MemoryConfig;
  sorting: SortingConfig;
  puzzle: PuzzleConfig;
  choice: ChoiceConfig;
}

export const THEMES: SimulationTheme[] = [
  {
    id: "whisker-trail",
    name: "Whisker Trail",
    emoji: "\u{1F332}",
    color: "emerald",
    description: "Help animals cross a forest trail",
    attention: {
      targets: ["\u{1F430}", "\u{1F43B}", "\u{1F98C}", "\u{1F43F}\u{FE0F}", "\u{1F994}"],
      distractor: "\u{1F985}",
      instruction: "Tap every animal — but watch out for the eagle!",
      stageName: "Trail Watch",
    },
    memory: {
      items: ["\u{1F34E}", "\u{1F344}", "\u{1F330}", "\u{1F347}", "\u{1F33B}", "\u{1F36F}", "\u{1FAB5}"],
      instruction: "Remember the objects in the basket!",
      stageName: "Memory Basket",
    },
    sorting: {
      items: [
        { emoji: "\u{1F430}", rule: "small" }, { emoji: "\u{1F43F}\u{FE0F}", rule: "small" },
        { emoji: "\u{1F994}", rule: "small" }, { emoji: "\u{1F43B}", rule: "big" },
        { emoji: "\u{1F98C}", rule: "big" }, { emoji: "\u{1F43A}", rule: "big" },
      ],
      categories: ["Small Gate", "Big Gate"],
      instruction: "Sort the animals through the correct gate!",
      stageName: "Secret Rule Gate",
    },
    puzzle: {
      colors: ["\u{1F7E2}", "\u{1F534}", "\u{1F535}", "\u{1F7E1}"],
      instruction: "Crack the forest lock code!",
      stageName: "Sticky Lock",
    },
    choice: {
      paths: [
        { emoji: "\u{1F30A}", name: "River Path", description: "Follow the flowing river through the valley" },
        { emoji: "\u{1F33F}", name: "Meadow Path", description: "Cross the sunny meadow with wildflowers" },
        { emoji: "\u{26F0}\u{FE0F}", name: "Hill Path", description: "Climb over the rocky hill for a view" },
      ],
      bonusPrompt: "Want to explore a hidden cave?",
      instruction: "Choose your trail through the forest!",
      stageName: "Trail Fork",
    },
  },
  {
    id: "star-voyage",
    name: "Star Voyage",
    emoji: "\u{1F680}",
    color: "violet",
    description: "Navigate through outer space",
    attention: {
      targets: ["\u{2B50}", "\u{1FA90}", "\u{1F31F}", "\u{1F4AB}", "\u{2604}\u{FE0F}"],
      distractor: "\u{2622}\u{FE0F}",
      instruction: "Collect the stars — avoid the radioactive asteroid!",
      stageName: "Asteroid Watch",
    },
    memory: {
      items: ["\u{2B50}", "\u{1F319}", "\u{1FA90}", "\u{1F6F8}", "\u{1F310}", "\u{2604}\u{FE0F}", "\u{1F31F}"],
      instruction: "Remember the star coordinates!",
      stageName: "Star Coordinates",
    },
    sorting: {
      items: [
        { emoji: "\u{1F47D}", rule: "friendly" }, { emoji: "\u{1F916}", rule: "friendly" },
        { emoji: "\u{1F47E}", rule: "friendly" }, { emoji: "\u{1F9E0}", rule: "hostile" },
        { emoji: "\u{1F480}", rule: "hostile" }, { emoji: "\u{1F525}", rule: "hostile" },
      ],
      categories: ["Friendly Pod", "Hostile Pod"],
      instruction: "Sort the aliens into the right pods!",
      stageName: "Alien Rule Gate",
    },
    puzzle: {
      colors: ["\u{1F7E3}", "\u{1F7E0}", "\u{26AA}", "\u{1F535}"],
      instruction: "Fix the airlock code!",
      stageName: "Airlock Repair",
    },
    choice: {
      paths: [
        { emoji: "\u{1F30C}", name: "Nebula Route", description: "Fly through the colorful nebula clouds" },
        { emoji: "\u{1FA90}", name: "Asteroid Belt", description: "Navigate the tricky asteroid field" },
        { emoji: "\u{1F311}", name: "Dark Side", description: "Explore the dark side of the moon" },
      ],
      bonusPrompt: "Want to investigate a mysterious signal?",
      instruction: "Choose your route through the star system!",
      stageName: "Star-System Routes",
    },
  },
  {
    id: "ocean-expedition",
    name: "Ocean Expedition",
    emoji: "\u{1F30A}",
    color: "cyan",
    description: "Explore the deep ocean",
    attention: {
      targets: ["\u{1F41F}", "\u{1F420}", "\u{1F421}", "\u{1F419}", "\u{1F990}"],
      distractor: "\u{1FABC}",
      instruction: "Tap the fish — avoid the jellyfish!",
      stageName: "Fish Watch",
    },
    memory: {
      items: ["\u{1F48E}", "\u{1FA99}", "\u{1F451}", "\u{1F52E}", "\u{1F3FA}", "\u{26D3}\u{FE0F}", "\u{1F4FF}"],
      instruction: "Remember the treasure in order!",
      stageName: "Treasure Sequence",
    },
    sorting: {
      items: [
        { emoji: "\u{1F41F}", rule: "warm" }, { emoji: "\u{1F420}", rule: "warm" },
        { emoji: "\u{1F990}", rule: "warm" }, { emoji: "\u{1F419}", rule: "cold" },
        { emoji: "\u{1F421}", rule: "cold" }, { emoji: "\u{1F988}", rule: "cold" },
      ],
      categories: ["Warm Cave", "Cold Cave"],
      instruction: "Sort the creatures into coral caves!",
      stageName: "Sea-Creature Rule",
    },
    puzzle: {
      colors: ["\u{1F535}", "\u{1F7E2}", "\u{26AA}", "\u{1F7E1}"],
      instruction: "Untangle the anchor chain!",
      stageName: "Anchor Puzzle",
    },
    choice: {
      paths: [
        { emoji: "\u{1F3DD}\u{FE0F}", name: "Coral Reef", description: "Swim through the vibrant coral reef" },
        { emoji: "\u{1F30A}", name: "Deep Current", description: "Ride the powerful deep ocean current" },
        { emoji: "\u{1F3F4}\u{200D}\u{2620}\u{FE0F}", name: "Shipwreck", description: "Explore the old sunken shipwreck" },
      ],
      bonusPrompt: "Want to dive into the underwater cave?",
      instruction: "Choose your ocean current!",
      stageName: "Current Routes",
    },
  },
  {
    id: "lost-valley",
    name: "Lost Valley Expedition",
    emoji: "\u{1F3D4}\u{FE0F}",
    color: "amber",
    description: "Lead a rescue expedition",
    attention: {
      targets: ["\u{1F4A7}", "\u{26A0}\u{FE0F}", "\u{1F321}\u{FE0F}", "\u{1F50B}", "\u{1F4E1}"],
      distractor: "\u{274C}",
      instruction: "Monitor the signals — ignore the false alarms!",
      stageName: "Long Travel Monitoring",
    },
    memory: {
      items: ["\u{1FA9C}", "\u{1F52C}", "\u{1F4E1}", "\u{1F9EF}", "\u{1F50B}", "\u{1F527}", "\u{1F4A1}"],
      instruction: "Remember what the robot must carry!",
      stageName: "Robot Load",
    },
    sorting: {
      items: [
        { emoji: "\u{1F33F}", rule: "safe" }, { emoji: "\u{1F4A7}", rule: "safe" },
        { emoji: "\u{26F3}", rule: "safe" }, { emoji: "\u{1F525}", rule: "danger" },
        { emoji: "\u{26A1}", rule: "danger" }, { emoji: "\u{1F32A}\u{FE0F}", rule: "danger" },
      ],
      categories: ["Safe Route", "Danger Route"],
      instruction: "Sort the route signs — which are safe?",
      stageName: "Route Consequence",
    },
    puzzle: {
      colors: ["\u{1F7E0}", "\u{1F534}", "\u{1F7E2}", "\u{26AA}"],
      instruction: "Repair the expedition vehicle!",
      stageName: "Vehicle Setback",
    },
    choice: {
      paths: [
        { emoji: "\u{1F3D5}\u{FE0F}", name: "Base Camp", description: "Set up camp and gather more supplies" },
        { emoji: "\u{1F97E}", name: "Mountain Pass", description: "Push through the narrow mountain pass" },
        { emoji: "\u{1F6F6}", name: "River Crossing", description: "Build a raft to cross the river" },
      ],
      bonusPrompt: "Want to search the abandoned outpost?",
      instruction: "Choose your rescue lead!",
      stageName: "Rescue Lead",
    },
  },
  {
    id: "mystery-agency",
    name: "Mystery Agency",
    emoji: "\u{1F50D}",
    color: "rose",
    description: "Solve a detective mystery",
    attention: {
      targets: ["\u{1F4DC}", "\u{1F5DD}\u{FE0F}", "\u{1F4CE}", "\u{1F50E}", "\u{1F4F8}"],
      distractor: "\u{1F4A3}",
      instruction: "Collect the evidence — ignore the decoy!",
      stageName: "Evidence Intake",
    },
    memory: {
      items: ["\u{1F453}", "\u{1F3A9}", "\u{1F45C}", "\u{1F4F1}", "\u{1F528}", "\u{1F510}", "\u{1F58A}\u{FE0F}"],
      instruction: "Remember the witness description!",
      stageName: "Witness Memory",
    },
    sorting: {
      items: [
        { emoji: "\u{1F575}\u{FE0F}", rule: "suspect" }, { emoji: "\u{1F977}", rule: "suspect" },
        { emoji: "\u{1F9D1}\u{200D}\u{1F4BC}", rule: "suspect" }, { emoji: "\u{1F46E}", rule: "clear" },
        { emoji: "\u{1F9D1}\u{200D}\u{1F3EB}", rule: "clear" }, { emoji: "\u{1F468}\u{200D}\u{1F3ED}", rule: "clear" },
      ],
      categories: ["Suspect", "Cleared"],
      instruction: "Sort the people — who is a suspect?",
      stageName: "Suspect Rule",
    },
    puzzle: {
      colors: ["\u{1F534}", "\u{1F535}", "\u{1F7E2}", "\u{1F7E1}"],
      instruction: "Crack the combination lock!",
      stageName: "Combination Lock",
    },
    choice: {
      paths: [
        { emoji: "\u{1F3E0}", name: "Old Mansion", description: "Investigate the abandoned mansion" },
        { emoji: "\u{1F3ED}", name: "Factory", description: "Search the closed-down factory" },
        { emoji: "\u{1F6A2}", name: "Harbor", description: "Check the boats at the harbor" },
      ],
      bonusPrompt: "Want to follow a secret tip?",
      instruction: "Choose your investigation lead!",
      stageName: "Investigation Leads",
    },
  },
];
