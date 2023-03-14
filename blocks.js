import * as items from './items.js';

class Block {
    constructor(name, solid, walkable, breakable, item_drop, color) {
        this.name = name;
        this.solid = solid;
        this.walkable = walkable;
        this.breakable = breakable;
        this.item_drop = item_drop;
        this.color = color;
    }
    get getSolid() { return this.solid; }
    set setSolid(value) { this.solid = value; }

    get getWalkable() { return this.walkable; }
    set setWalkable(value) { this.walkable = value; }

    get getBreakable() { return this.breakable; }
    set setBreakable(value) { this.breakable = value; }

    get getItemDrop() { return this.item_drop; }
    set setItemDrop(value) { this.item_drop = value; }

    get getColor() { return this.color; }
    set setColor(value) { this.color = value; }
}

export const _WATER_BLOCK = new Block('water', false, true, false, undefined, '#0840c2');
export const _GRASS_BLOCK = new Block('grass', true, true, false, undefined, '#489c17');
export const _STONE_BLOCK = new Block('stone', true, false, true, 'broken_stone_item', '#5e6263');
//export const _BROKEN_STONE_BLOCK = new Block('broken stone', true, true, false, undefined, '#383b3d');

export const BLOCK_MAP = {
    "water_block": _WATER_BLOCK,
    "grass_block": _GRASS_BLOCK,
    "stone_block": _STONE_BLOCK,
    //"3": _BROKEN_STONE_BLOCK,
};