class Item {
    constructor(display_name) {
        this.display_name = display_name;
    }

    get getDisplayName() { return this.display_name; }
    set setDisplayName(value) { this.display_name = value; }
}

export const _BROKEN_STONE_ITEM = new Item("Broken Stone");

export const ITEM_MAP = {
    "broken_stone_item": _BROKEN_STONE_ITEM
};