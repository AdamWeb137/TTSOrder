class MenuItem {
    constructor(name,read_name,img,options){
        this.name = name;
        this.read_name = read_name;
        this.img = "imgs/menu/"+img;
        this.display_img = (img == "") ? "none" : "block";
    }
}

class MealPart {
    constructor(type_name, choices){
        this.type_name = type_name;
        this.choices = choices;
    }
}

class Option {
    constructor(text, type="checkbox", def=true){
        this.text = text;
        this.type = type;
        this.value = def;
    }
}


const burger_king = [
    MealPart("Sandwich", [
        MenuItem("Whopper","number 1", "burgerking/whopper.png", [Option("Add Cheese")]),
        MenuItem("Spicy Ch'King Sandwich","number 6", "burgerking/whopper.png", [Option("Add Cheese")])
    ]),
];

const mealmaps = {
    "Burger King":burger_king
};