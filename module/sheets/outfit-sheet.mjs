import { TeethActorSheet } from "./actor-sheet.mjs";

/**
 * Extend the TeethActorSheet
 * @extends {TeethActorSheet}
 */
export class TeethOutfitSheet extends TeethActorSheet
{

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["teeth", "sheet", "actor", "outfit"],
      width: 750,
      height: 900,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "general"
      }]
    });
  }

  /** @override */
  async getData() {
    const context = await super.getData();

    // Prepare outfit data and items.
    this._prepareItems(context);

    return context;
  }

    /**
   * @param {Object} actorData The actor to prepare.
   * @return {undefined}
   */
  _prepareItems(context) {
    let playbook;
    const boons = [];
    const purchases = [];
    const specPurchases = [];

    const playbookId = this.actor.system.playbook;
    const tier = this.actor.system.tier.value;

    for (const i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;

      if (i.type === 'outfitType') {
        if (i._id === playbookId) {
          playbook = i;
        }
      }
      else if (i.type === 'boon') {
        boons.push(i);
      }
      else if (i.type === 'purchase') {
        if (i.system.type === 'common') {
          purchases.push(i);
        } else {
          specPurchases.push(i);
        }
      }
    }

    const sortBoons = boons.sort((a,b) => a.system.tier - b.system.tier);
    const filteredBoons = sortBoons.filter((a) => a.system.tier <= tier);

    context.boons = filteredBoons;
    context.playbook = playbook;
    context.purchases = purchases;
    context.specPurchases = specPurchases;
  }

  /** @override */
  async _onDropActor(event, data) {
    if (!this.isEditable) return;
    const cls = getDocumentClass("Actor");
    const sourceActor = await cls.fromDropData(data);

    this.actor.addLinkedActor(sourceActor);
  }
}
