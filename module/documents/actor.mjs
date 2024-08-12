/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export default class TeethActor extends Actor {

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    const prototypeToken = {
      actorLink: true,
      disposition: CONST.TOKEN_DISPOSITIONS.NEUTRAL
    }

    if (this.type === "hunter" || this.type === "outfit") {
      prototypeToken.disposition = CONST.TOKEN_DISPOSITIONS.FRIENDLY;
    } else if (this.type === "clock") {
      prototypeToken.displayName = CONST.TOKEN_DISPLAY_MODES.ALWAYS;
    }

    this.updateSource({ prototypeToken });
  }

  async _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);

    this.prototypeToken.actorLink = true;

  }

  _onCreateDescendantDocuments(parent, collection, documents, data, options, userId) {
    super._onCreateDescendantDocuments(parent, collection, documents, data, options, userId);

    if (game.user.id === userId) {
      const target = {
        actor: "hunter",
        item: "playbook",
        forLoad: ["abilities", "inventory"]
      }

      if (this.type == "outfit") {
        target.actor = "outfit",
        target.item = "outfitType",
        target.forLoad = ["abilities", "boons", "purchases"]
      }

      for (const dataItem of data) {
        if (dataItem.type == target.item && this.type == target.actor) {
          for (const i of this.items) {
            if (i.type === target.item && i._id != dataItem._id) {
              const itemToDelete = this.items.get(i._id);
              itemToDelete.delete();
            }
          }
          this.update({ "system.playbook": dataItem._id });

          this._preCreateContainer(dataItem, target.forLoad);
        }
      }
    }
  }

  async _preCreateContainer(container, forLoad) {
    const systemData = this.system;
    const toCreate = [];

    for (const array of forLoad) {
      if (array === "inventory") {
        // Load default items
        const itemPack = game.packs.get('teeth.items');
        await itemPack.getIndex();
        const defaultFolder = itemPack.folders.find(p => p.name === "Default")._id;
        const defaultItems = itemPack.index.filter(p => p.folder === defaultFolder);

        for (const [ownerId, permissions] of Object.entries(this.ownership)) {
          if (permissions === 3 && game.userId === ownerId) {
            for (const item of defaultItems) {
              const addItem = await itemPack.getDocument(item._id);
              this.createEmbeddedDocuments('Item', [addItem]);
            }
          }
        }
      }
      if (array === "purchases") {
        // Load purchases
        const purchasePack = game.packs.get('teeth.purchases');
        const purchases = await purchasePack.getDocuments();
        for (const [ownerId, permissions] of Object.entries(this.ownership)) {
          if (permissions === 3 && game.userId === ownerId) {
            for (const purchase of purchases) {
              console.log(purchase._id);
              const addPurchase = await purchasePack.getDocument(purchase._id);
              this.createEmbeddedDocuments('Item', [addPurchase]);
            }
          }
        }
      }
      if (array === "boons") {
        // Load default items
        const boonPack = game.packs.get('teeth.boons');
        await boonPack.getIndex();
        const defaultFolder = boonPack.folders.find(p => p.name === "Default")._id;
        const defaultBoons = boonPack.index.filter(p => p.folder === defaultFolder);

        for (const [ownerId, permissions] of Object.entries(this.ownership)) {
          if (permissions === 3 && game.userId === ownerId) {
            for (const boon of defaultBoons) {
              const addBoon = await boonPack.getDocument(boon._id);
              this.createEmbeddedDocuments('Item', [addBoon]);
            }
          }
        }
      }

      const idArr = container.system[array];
      for (const itemData of idArr) {
        const item = await fromUuid(itemData.uuid);
        if (!this.items.find(i => i.name === item.name && i.type === item.type)) {
          toCreate.push(item)
        } else {
          ui.notifications.warn(game.i18n.localize("TEETH.Errors.Item.ExistsName"));
        }
      }
    }
    this.createEmbeddedDocuments('Item', toCreate)

    for (const contact of container.system.contacts) {
      this.importActor(contact, "contacts");
    }

    if (container.type === "playbook") {
      for (const action in systemData.actions) {
        const playbookValue = container.system.actions[action];
        const actorValue = systemData.actions[action].value;
        if (playbookValue > actorValue) {
          const path = "system.actions." + action + ".value";
          await this.update({ [path]: playbookValue });
        }
      }
    }
  }

  async addLinkedActor(actor) {
    if (!actor) return;

    const localizeType = game.i18n.localize("TYPES.Actor." + actor.type);
    const supported = CONFIG.TEETH.supportedLinks[this.type];
    const key = supported[actor.type];

    if (!key) return ui.notifications.error(game.i18n.format("TEETH.Errors.Actor.NotSupported", { type: localizeType, actor: actor.name }));

    const container = this.system[key];

    const idExist = container.some(existingActor => existingActor.id === actor.id);
    const nameExist = container.some(existingActor => existingActor.name === actor.name);

    if (idExist) return ui.notifications.error(game.i18n.localize("TEETH.Errors.Actor.ExistsId"));
    if (nameExist) ui.notifications.warn(game.i18n.localize("TEETH.Errors.Actor.ExistsName"));

    if (actor.pack) {
      ui.notifications.warn(game.i18n.localize("TEETH.Errors.Actor.InPack"));
      return this.importActor(actor, key);
    }

    const link = {
      id: actor.id,
      uuid: actor.uuid,
      name: actor.name
    }
    if (actor.type === "clock") link.progress = actor.system.progress;
    container.push(link);

    const path = "system." + key;
    await this.update({ [path] : container });
  }

  async importActor(sourceActor) {
    const dialog = new Dialog({
      title: game.i18n.localize("TEETH.ImportActor.Title"),
      content: game.i18n.format("TEETH.ImportActor.Description", { actor: sourceActor.name }),
      buttons: {
        import: {
          label: game.i18n.localize("TEETH.ImportActor.Submit"),
          icon: '<i class="fas fa-check"></i>',
          callback: async () => {
            const actor = await TeethActor.create(sourceActor);
            this.addLinkedActor(actor)
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize("TEETH.Roll.Cancel"),
          callback: () => {},
        },
      },
      default: "import",
      close: () => {}
    },
    {
      classes: ["dialog", "teeth-import-dialog"],
      width: 400,
      height: 100
    });

    dialog.render(true);
  }
}
