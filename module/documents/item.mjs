//
/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export default class TeethItem extends Item {
  prepareData() {
    super.prepareData();
  }

  /**
   * Handle clickable show description.
   * @param {Event} event   The originating click event
   * @private
   */
  async show() {
    const item = this;

    const renderData = {
      name: item.name,
      type: game.i18n.localize("TYPES.Item." + item.type),
      description: item.system.description
    };

    const message = await renderTemplate("systems/teeth/templates/apps/rollItem.hbs", renderData);
    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: message
    };
    ChatMessage.create(chatData);
  }
}
