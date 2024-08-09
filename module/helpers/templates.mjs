 /**
  *@return {Promise}
  */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([
    "systems/teeth/templates/actor/parts/abilities.hbs",
    "systems/teeth/templates/actor/parts/attributes.hbs",
    "systems/teeth/templates/actor/parts/claims.hbs",
    "systems/teeth/templates/actor/parts/cohorts.hbs",
    "systems/teeth/templates/actor/parts/contacts.hbs",
    "systems/teeth/templates/actor/parts/injury.hbs",
    "systems/teeth/templates/actor/parts/inventory.hbs",
    "systems/teeth/templates/actor/parts/hunter-notes.hbs",
    "systems/teeth/templates/actor/parts/corruption-mutation.hbs",
    "systems/teeth/templates/actor/parts/stress-behaviour.hbs",
    "systems/teeth/templates/actor/parts/upgrades.hbs",

    "systems/teeth/templates/item/parts/linked-item.hbs",
  ]);
};
