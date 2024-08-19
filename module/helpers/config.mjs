export const TEETH = {
  attributeLinks: {
    insight: ["scout", "doctor", "surveil", "devise"],
    prowess: ["aim", "manoeuvre", "fight", "wreck"],
    resolve: ["study", "command", "evoke", "persuade"]
  },
  load: {
    "3": "TEETH.Load.Light",
    "5": "TEETH.Load.Normal",
    "6": "TEETH.Load.Heavy"
  },
  statusTypes: {
    allied: "TEETH.Status.Allied",
    friendly: "TEETH.Status.Friendly",
    neutral: "TEETH.Status.Neutral",
    unfriendly: "TEETH.Status.Unfriendly",
    enemy: "TEETH.Status.Enemy"
  },
  toolType: {
    common: "TEETH.Tool.Common",
    special: "TEETH.Tool.Special"
  },
  purchaseType: {
    common: "TEETH.Purchase.Common",
    special: "TEETH.Purchase.Special"
  },

  supportedLinks: {
    hunter: {npc: "contacts"},
    outfit: {
      hunter: "members",
      npc: "contacts",
      faction: "relatedFactions",
      clock: "goals"
    },
    faction: {
      faction: "relatedFactions",
      npc: "members",
      clock: "goals"
    }
  },

  relationshipClasses: ["rival", "neutral", "friend", "special"],

  hunterClasses: {
    bruiser: "TEETH.Hunters.Bruiser",
    captain: "TEETH.Hunters.Captain",
    keeper: "TEETH.Hunters.Keeper",
    outrider: "TEETH.Hunters.Outrider",
    sapper: "TEETH.Hunters.Sapper"
  },

  backgrounds: {
    NewMoney: "TEETH.Backgrounds.NewMoney",
    OldBlood: "TEETH.Backgrounds.OldBlood",
    Soldiery: "TEETH.Backgrounds.Soldiery",
    Peasantfolk: "TEETH.Backgrounds.Peasantfolk",
    Scholastic: "TEETH.Backgrounds.Scholastic",
    Traveller: "TEETH.Backgrounds.Traveller"
  },

  vices: {
    faith: "TEETH.Vices.Faith",
    gambling: "TEETH.Vices.Gambling",
    luxury: "TEETH.Vices.Luxury",
    Obligation: "TEETH.Vices.Obligation",
    Pleasure: "TEETH.Vices.Pleasure",
    Stupor: "TEETH.Vices.Stupor",
    Weird: "TEETH.Vices.Weird"
  },

  disciplines: {
    elementalism: "TEETH.DisciplineList.Elementalism",
    mesmerism: "TEETH.DisciplineList.Mesmerism",
    transmogrification: "TEETH.DisciplineList.Transmogrification",
    cosmism: "TEETH.DisciplineList.Cosmism",
    conjuration: "TEETH.DisciplineList.Conjuration"
  },
  methods: {
    touch: "TEETH.MethodList.Touch",
    memento: "TEETH.MethodList.Memento",
    device: "TEETH.MethodList.Device",
    encircle: "TEETH.MethodList.Encircle",
    concoction: "TEETH.MethodList.Concoction"
  },

  erraticBehaviours: [
      "TEETH.Behaviours.Singing",
      "TEETH.Behaviours.Indignance",
      "TEETH.Behaviours.Dancing",
      "TEETH.Behaviours.Grovelling",
      "TEETH.Behaviours.Horror",
      "TEETH.Behaviours.Misery",
      "TEETH.Behaviours.Rancour"
  ],

  rolls: {
    type: {
      action: "TEETH.Roll.Type.Action",
      resistance: "TEETH.Roll.Type.Resistance",
      fortune: "TEETH.Roll.Type.Fortune",
      wilderness: "TEETH.Roll.Type.Wilderness",
      engagement: "TEETH.Roll.Type.Engagement",
      vice: "TEETH.Roll.Type.IndulgeVice"
    },
    attributes: {
      insight: "TEETH.Insight",
      prowess: "TEETH.Prowess",
      resolve: "TEETH.Resolve"
    },
    actions: {
      scout: "TEETH.Scout",
      doctor: "TEETH.Doctor",
      surveil: "TEETH.Surveil",
      devise: "TEETH.Devise",
      aim: "TEETH.Aim",
      manoeuvre: "TEETH.Manoeuvre",
      fight: "TEETH.Fight",
      wreck: "TEETH.Wreck",
      study: "TEETH.Study",
      command: "TEETH.Command",
      evoke: "TEETH.Evoke",
      persuade: "TEETH.Persuade"
    },
    position: {
      controlled: "TEETH.Roll.Position.Controlled",
      risky: "TEETH.Roll.Position.Risky",
      desperate: "TEETH.Roll.Position.Desperate"
    },
    effect: {
      zero: "TEETH.Roll.Effect.Zero",
      poor: "TEETH.Roll.Effect.Poor",
      limited: "TEETH.Roll.Effect.Limited",
      reasonable: "TEETH.Roll.Effect.Reasonable",
      suberb: "TEETH.Roll.Effect.Superb"
    },
    fortuneRollResult: {
      fail: "Zero",
      mixed: "Limited",
      success: "Reasonable",
      critical: "Superb"
    },
    effectSequence: ["zero", "poor", "limited", "reasonable", "superb"]
  },

  clockTypes: {
    4: 4,
    6: 6,
    8: 8,
    10: 10,
    12: 12,
    16: 16
  }
};
