import * as blocks from './blocks.js';
import * as items from './items.js';
import { player } from './player.js';   

window.addEventListener('DOMContentLoaded',launch);

// -- Constants
const _name = 'Web Ren';
const _version = '1.0';

const title = _name + ' | ' + _version;

// -- Game variables

const mapWidth = 64;
const mapHeight = 64;
const blockSize = 10;

var map = [...Array(mapWidth)].map(e => Array(mapHeight));

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var frames = 0;
var frames_last_second = 0;

var show_inventory = false;

// -- Functions

function launch() {
    document.title = title;
    document.addEventListener('keydown', (event) => onKeyDown(event), false);
    document.addEventListener('keyup', (event) => onKeyUp(event), false);
    initHud();
    generateMap();
    var loop_trigger = window.setInterval(doLoop, 1);
    var fps_trigger = window.setInterval(onFpsTrigger, 1000);
}

function generateMap() {
    perlin.seed();
    for (var x = 0; x < mapWidth; x++) {
        for (var y = 0; y < mapHeight; y++) {
            let pno = perlin.get(x / blockSize / 3.5, y / blockSize / 3.5);
            var id = 'water_block';
            if (pno > -0 && pno < 0.2) {
                id = 'grass_block';
            } else if (pno > 0.2) { id = 'stone_block';}
            map[x][y] = id;
        }
    }
}

function doLoop() {
    render();

    player.tickStamina();
    updateHud();
    
    frames++;

}

function render() {
    ctx.clearRect(0, 0, mapWidth * blockSize, mapHeight * blockSize);
    for (var x = 0; x < mapWidth; x++) {
        for (var y = 0; y < mapHeight; y++) {
            ctx.fillStyle = blocks.BLOCK_MAP[map[x][y]].color;
            ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        }
    }
    //player render
    ctx.fillStyle = player.getColor;
    ctx.fillRect(player.getPositionX * blockSize, player.getPositionY * blockSize, blockSize, blockSize);
}

// HUD
var hud_fps = document.getElementById("hud_fps");
var hud_name = document.getElementById("hud_name");
var hud_hp = document.getElementById("hud_hp");
var hud_stamina = document.getElementById("hud_stamina");
var hud_position = document.getElementById("hud_position");
var hud_inventory = document.getElementById("hud_inventory");

function initHud() {
    hud_fps.textContent = "FPS";
    hud_name.textContent = `logged in as: ${player.getName}`;
    hud_hp.textContent = `HP: ${player.getCurrHp} \\ ${player.getMaxHp} `;
    hud_stamina.textContent = `Stamina: ${player.getCurrStamina} \\ ${player.getMaxStamina}`;
    hud_position.textContent = `Position: ${player.getPositionX} | ${player.getPositionY}`;
}

function updateHud() {
    hud_fps.textContent = "FPS: " + frames_last_second;
    hud_position.textContent = `Position: ${player.getPositionX} | ${player.getPositionY}`;
    if (player.getOverworked) {
        hud_stamina.textContent = `Stamina: Overworked! | ${player.getCurrStamina} / ${player.getMaxStamina}`;
    } else {
        hud_stamina.textContent = `Stamina: ${player.getCurrStamina} / ${player.getMaxStamina}`;
    }

    // inventory 
    
    if (show_inventory) {
        hud_inventory.textContent = `Inventory: `; 
        for (const element of player.getInventory) {
            hud_inventory.textContent += `${items.ITEM_MAP[element].getDisplayName} \r\n`; 
        }     
    } else {
        hud_inventory.textContent = `Inventory Hidden (press i)`; 
    }
    
}

// -- Functions -- Listeners

function onKeyDown(event) {
    var name = event.key;
    var code = event.code;

    actionUpdate(name);
    movementUpdate(name);

    //alert(`Key down: ${name} \r\n Key code: ${code}`);
}

function onKeyUp(event) {
    var name = event.key;
    var code = event.code;

    //alert(`Key up: ${name} \r\n Key code: ${code}`);
}

function movementUpdate(key) {
    var ppx = Math.floor(player.getPositionX);
    var ppy = Math.floor(player.getPositionY);
    var speed = 1;
    if(key == 'w') {
        player.setLastRotation = 0;
        if (ppy - 1 < 0) { return; }
        if (blocks.BLOCK_MAP[map[ppx][ppy - 1]].walkable == true) {
            player.move(0, -speed);
        }
        
    } else if (key == 's') {
        player.setLastRotation = 1;
        if (ppy + 1 == mapHeight) { return; }
        if (blocks.BLOCK_MAP[map[ppx][ppy + 1]].walkable == true) {
            player.move(0, speed);
        }
    }
    if (key == 'a') {
        player.setLastRotation = 2;
        if (ppx - 1 < 0) { return; }
        if (blocks.BLOCK_MAP[map[ppx - 1][ppy]].walkable == true) {
            player.move(-speed, 0);
        }
    } else if (key == 'd') {
        player.setLastRotation = 3;
        if (ppx + 1 == mapWidth) { return; }
        if (blocks.BLOCK_MAP[map[ppx + 1][ppy]].walkable == true) {
            player.move(speed, 0);
        }
    }

    if (player.getPositionX <= 0) { player.setPositionX = 0; }
    if (player.getPositionX >= mapWidth) { player.setPositionX(mapWidth - 1); }
    
    if (player.getPositionY <= 0) { player.setPositionY = 0; }
    if (player.getPositionY >= mapWidth) { player.setPositionY(mapWidth - 1); }

}

function actionUpdate(key) {
    switch (key) {
        case 'i':
            if (show_inventory) show_inventory = false;
            else show_inventory = true;
            break;
        case 'e':
            blockBreakCheck();
            break;
        default: break;
    }
}

function blockBreakCheck() {
    var ppx = Math.floor(player.getPositionX);
    var ppy = Math.floor(player.getPositionY);
    if (player.getPositionY + 1 > mapHeight || player.getPositionY - 1 < 0) { return; }
    if (player.getPositionX == 0 && player.getLastRotation == 2) return;
    if (player.getPositionX + 1 == mapWidth && player.getLastRotation == 3) return;
    if (player.getPositionY == mapHeight - 1 && player.getLastRotation == 1) return;
    if (player.getCurrStamina <= 0 || player.getOverworked) return;

    // stone
    if (player.getLastRotation == 0 && blocks.BLOCK_MAP[map[ppx][ppy - 1]].getBreakable) {
        player.addToInventory(blocks.BLOCK_MAP[map[ppx][ppy - 1]].getItemDrop);
        map[ppx][ppy - 1] = 'grass_block';
        player.subtractStamina(20);
    } else if (player.getLastRotation == 1 && blocks.BLOCK_MAP[map[ppx][ppy + 1]].getBreakable) {
        player.addToInventory(blocks.BLOCK_MAP[map[ppx][ppy + 1]].getItemDrop);
        map[ppx][ppy + 1] = 'grass_block';
        player.subtractStamina(20);
    } else if (player.getLastRotation == 2 && blocks.BLOCK_MAP[map[ppx - 1][ppy]].getBreakable) {
        player.addToInventory(blocks.BLOCK_MAP[map[ppx - 1][ppy]].getItemDrop);
        map[ppx - 1][ppy] = 'grass_block';
        player.subtractStamina(20);
    } else if (player.getLastRotation == 3 && blocks.BLOCK_MAP[map[ppx + 1][ppy]].getBreakable) {
        player.addToInventory(blocks.BLOCK_MAP[map[ppx + 1][ppy]].getItemDrop);
        map[ppx + 1][ppy] = 'grass_block';
        player.subtractStamina(20);
    }
}

function onFpsTrigger() {
    frames_last_second = frames;
    console.log(`FPS: ${frames_last_second}`);
    frames = 0;
}