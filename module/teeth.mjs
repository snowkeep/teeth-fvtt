import * as models from './data/_module.mjs';
import { TeethActor, TeethItem } from "./documents/_module.mjs";

// Import Actor Sheet
import { TeethActorSheet } from "./sheets/actor-sheet.mjs";
import { TeethHunterSheet } from "./sheets/hunter-sheet.mjs";
import { TeethOutfitSheet } from "./sheets/outfit-sheet.mjs";
import { TeethFactionSheet } from "./sheets/faction-sheet.mjs";
import { TeethClockSheet } from "./sheets/clock-sheet.mjs";

// Import Item Sheet
import { TeethItemSheet } from "./sheets/item-sheet.mjs";
import { TeethPlaybookSheet } from "./sheets/playbook-sheet.mjs";

// Import modules
import { preprocessChatMessage, renderChatMessage } from "./applications/chat-portraits.mjs";
import { createRollDialog } from "./applications/roll.mjs";
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { registerHandlebarsHelpers } from "./helpers/handlebars-helpers.mjs";
import { TEETH } from './helpers/config.mjs';

Hooks.once('init', async function() {

  game.teeth = {
    TeethActor,
    TeethItem
  };

  CONFIG.TEETH = TEETH;

  // Define custom Entity classes and Data Models
  CONFIG.Actor.documentClass = TeethActor;
  CONFIG.Actor.dataModels = {
    'hunter': models.HunterData,
    'outfit': models.OutfitData,
    'faction': models.FactionData,
    'npc': models.NpcData,
    'clock': models.ClockData
  };

  CONFIG.Item.documentClass = TeethItem;
  CONFIG.Item.dataModels = {
    'playbook': models.PlaybookData,
    'outfitType': models.OutfitTypeData,
    'abilityHunter': models.AbilityHunterData,
    'boon': models.BoonData,
    'tool': models.ToolData,
    'purchase': models.PurchaseData
  };


  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("teeth", TeethActorSheet, { makeDefault: true });
  Actors.registerSheet("teeth", TeethHunterSheet, { types: ["hunter"], makeDefault: true });
  Actors.registerSheet("teeth", TeethOutfitSheet, { types: ["outfit"], makeDefault: true });
  Actors.registerSheet("teeth", TeethFactionSheet, { types: ["faction"], makeDefault: true });
  Actors.registerSheet("teeth", TeethClockSheet, { types: ["clock"], makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("teeth", TeethItemSheet, { makeDefault: true });
  Items.registerSheet("teeth", TeethPlaybookSheet, { types: ["playbook", "outfitType"], makeDefault: true });

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
    <li class="scene-control" data-control="teeth-dice" title="TEETH Dice Roller">
    <i class="fas fa-dice"></i>
    </li>
  `);
  diceRollButton.click( async function() {
    await createRollDialog("fortune");
  });
  html.children().first().append( diceRollButton );
});
