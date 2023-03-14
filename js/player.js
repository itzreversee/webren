class Player {
    constructor(name, color, max_hp, max_stamina, curr_hp, curr_stamina, position_x, position_y, inventory, last_rotation) {
        this.name = name;
        this.color = color;
        this.max_hp = max_hp;
        this.max_stamina = max_stamina;
        this.curr_hp = curr_hp;
        this.curr_stamina = curr_stamina;
        this.position_x = position_x;
        this.position_y = position_y;
        this.inventory = inventory;
        this.last_rotation = last_rotation;
        this.overworked = false;
    }
    get getName() { return this.name; }
    set setName(value) { this.name = value; }
    
    get getColor() { return this.color; }
    set setColor(value) { this.color = value; }
    
    get getMaxHp() { return this.max_hp; }
    set setMaxHp(value) { this.max_hp = value; }
    
    get getMaxStamina() { return this.max_stamina; }
    set setMaxStamina(value) { this.max_stamina = value; }
    
    get getCurrHp() { return this.curr_hp; }
    set setCurrHp(value) { this.curr_hp = value; }
    
    get getCurrStamina() { return this.curr_stamina; }
    set setCurrStamina(value) { this.curr_stamina = value; }
    
    get getPositionX() { return this.position_x; }
    set setPositionX(value) { this.position_x = value; }
    
    get getPositionY() { return this.position_y; }
    set setPositionY(value) { this.position_y = value; }
    
    get getInventory() { return this.inventory; }
    set setInventory(value) { this.inventory = value; }
    
    get getLastRotation() { return this.last_rotation; }
    set setLastRotation(value) { this.last_rotation = value; }

    get getOverworked() { return this.overworked; }
    set setOverworked(value) { this.overworked = value; }

    move(x, y) {
        this.position_x += x;
        this.position_y += y;
    }

    addToInventory(item) {
        this.inventory.push(item);
    }

    tickStamina() {
        if (this.curr_stamina <= 0) { this.overworked = true;}

        if (this.curr_stamina < this.max_stamina) {
            this.curr_stamina = parseFloat((this.curr_stamina + 0.2).toFixed(2));
        } else if (this.curr_stamina > this.max_stamina) { 
            this.curr_stamina = this.max_stamina; 
            this.overworked = false;
        } else if (this.curr_stamina == this.max_stamina) { 
            this.overworked = false; 
        }
    }

    subtractStamina(value) {
        this.curr_stamina -= value;
    }
    
    addStamina(value) {
        this.curr_stamina += value;
    }

};

export var player = new Player(
    'reversee',
    '#FFAAFF',
    100,
    150,
    100,
    150,
    4,
    4,
    Array(),
    0
);