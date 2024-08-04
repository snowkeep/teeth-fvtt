import * as models from './data/_module.mjs';
import { TeethActor, BitdItem } from "./documents/_module.mjs";

// Import Actor Sheet
import { TeethActorSheet } from "./sheets/actor-sheet.mjs";
import { TeethHunterSheet } from "./sheets/hunter-sheet.mjs";
import { BitdCrewSheet } from "./sheets/crew-sheet.mjs";
import { BitdFactionSheet } from "./sheets/faction-sheet.mjs";
import { BitdClockSheet } from "./sheets/clock-sheet.mjs";

// Import Item Sheet
import { BitdItemSheet } from "./sheets/item-sheet.mjs";
import { BitdPlaybookSheet } from "./sheets/playbook-sheet.mjs";

// Import modules
import { preprocessChatMessage, renderChatMessage } from "./applications/chat-portraits.mjs";
import { createRollDialog } from "./applications/roll.mjs";
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { registerHandlebarsHelpers } from "./helpers/handlebars-helpers.mjs";
import { TEETH } from './helpers/config.mjs';

Hooks.once('init', async function() {

  game.bitd = {
    TeethActor,
    BitdItem
  };

  CONFIG.TEETH = TEETH;

  // Define custom Entity classes and Data Models
  CONFIG.Actor.documentClass = TeethActor;
  CONFIG.Actor.dataModels = {
    'hunter': models.HunterData,
    'crew': models.CrewData,
    'faction': models.FactionData,
    'npc': models.NpcData,
    'clock': models.ClockData
  };

  CONFIG.Item.documentClass = BitdItem;
  CONFIG.Item.dataModels = {
    'playbook': models.PlaybookData,
    'crewType': models.CrewTypeData,
    'abilityHunter': models.AbilityHunterData,
    'abilityCrew': models.AbilityCrewData,
    'claim': models.ClaimData,
    'cohort': models.CohortData,
    'tool': models.ToolData,
    'upgrade': models.UpgradeData
  };


  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("bitd", TeethActorSheet, { makeDefault: true });
  Actors.registerSheet("bitd", TeethHunterSheet, { types: ["hunter"], makeDefault: true });
  Actors.registerSheet("bitd", BitdCrewSheet, { types: ["crew"], makeDefault: true });
  Actors.registerSheet("bitd", BitdFactionSheet, { types: ["faction"], makeDefault: true });
  Actors.registerSheet("bitd", BitdClockSheet, { types: ["clock"], makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("bitd", BitdItemSheet, { makeDefault: true });
  Items.registerSheet("bitd", BitdPlaybookSheet, { types: ["playbook", "crewType"], makeDefault: true });

  registerHandlebarsHelpers();

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

// Preprocess chat message before it is created hook
Hooks.on("preCreateChatMessage", preprocessChatMessage);

// Render chat message hook
Hooks.on("renderChatMessage", renderChatMessage);

// Add scene controls
Hooks.on("renderSceneControls", async (app, html) => {
  const diceRollButton = $(`
    <li class="scene-control" data-control="bitd-dice" title="BitD Dice Roller">
    <i class="fas fa-dice"></i>
    </li>
  `);
  diceRollButton.click( async function() {
    await createRollDialog("fortune");
  });
  html.children().first().append( diceRollButton );
});