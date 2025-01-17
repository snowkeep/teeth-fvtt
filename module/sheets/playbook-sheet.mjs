import { TeethItemSheet } from "./item-sheet.mjs";

/**
 * Extend the basic TeethItemSheet
 * @extends {TeethItemSheet}
 */
export class TeethPlaybookSheet extends TeethItemSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      dragDrop: [
        {dragSelector: ".item", dropSelector: ".playbook"},
        {dragSelector: ".item", dropSelector: ".outfitType"}
      ]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;
    // Delete linked item
    html.find('.link-delete').click(this._onRemoveLink.bind(this));
  }

  /* -------------------------------------------- */
  /*  Drag & Drop                                 */
  /* -------------------------------------------- */

  /** @inheritdoc */
  async _onDrop(event) {
    super._onDrop(event);
    if (!this.isEditable) return;
    const data = TextEditor.getDragEventData(event);

    if (data.type === "Item") {
      const item = await fromUuid(data.uuid);
      let key = "";

      switch (item.type) {
        case 'abilityHunter':
          if (this.item.type == "playbook") key = "abilities";
          break;
        case 'tool':
          if (this.item.type == "playbook") key = "inventory";
          break;
        case 'boon':
          if (this.item.type == "outfitType") key = "boons";
          break;
        case 'purchase':
          if (this.item.type == "outfitType") key = "purchases";
      }

      if (key && this.item.system[key]) {
        const container = this.item.system[key];
        const itemExist = container.some(existingItem => existingItem.id === item.id);

        if (!itemExist) {
          const path = "system." + key;
          const link = {
            id: item.id,
            uuid: item.uuid,
            type: item.type,
            name: item.name,
            title: game.i18n.localize("TYPES.Item." + item.type),
            docType: "Item"
          }
          container.push(link);
          await this.item.update({ [path]: container });
        } else {
          ui.notifications.warn(game.i18n.localize("TEETH.Errors.Item.ExistsId"));
        }
      } else {
        ui.notifications.warn(game.i18n.format("TEETH.Errors.Item.NotSupported", {item: item.name}));
      }
    } else if (data.type === "Actor") {
      const actor = await fromUuid(data.uuid);
      if (actor.type === "npc") {
        const container = this.item.system.contacts;
        const actorExist = container.some(existingActor => existingActor.id === actor.id);

        if (!actorExist) {
          const link = {
            id: actor.id,
            uuid: actor.uuid,
            type: actor.type,
            name: actor.name,
            title: game.i18n.localize("TYPES.Actor." + actor.type),
            docType: "Actor"
          }
          container.push(link);
          await this.item.update({ "system.contacts": container });
        } else {
          ui.notifications.warn(game.i18n.localize("TEETH.Errors.Item.ExistsId"));
        }
      } else {
        ui.notifications.warn(game.i18n.format("TEETH.Errors.Actor.NotSupported", {actor: actor.name}));
      }
    }
  }

  _onRemoveLink(event) {
    const button = event.currentTarget;
    const parent = $(button.parentNode);
    const link = parent.find(".content-link");
    const targetId = link[0].dataset.id;

    const block = button.closest(".linked-items");
    const key = block.dataset.array;
    const path = "system." + key;
    const newArray = this.item.system[key].filter(link => link.id !== targetId);

    this.item.update({ [path]: newArray });
  }
}
