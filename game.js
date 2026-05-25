import { tile_size, rows, columns } from "./config.js";
import { ctx } from "./main.js";

export class Game {
    constructor(grid){
        this.grid = grid;        

        this.img_metal_path = new Image();
        this.img_metal_path.src = "tiles/128x128/Metal/Metal_18-128x128.png"
        this.img_dirt_grass = new Image(); // 0
        this.img_dirt_grass.src = "tiles/128x128/Dirt/Dirt_20-128x128.png";
        this.img_tower_block = new Image(); // 0
        this.img_tower_block.src = "tiles/128x128/Tile/Tile_11-128x128.png";

        console.log("game created");
    }
    update() {

    }
    draw() {
        for(let i=0;i<rows;i++){
            for(let j=0;j<columns;j++){
                if (this.grid[i][j] === 1) {
                    ctx.drawImage(this.img_metal_path,j*tile_size,i*tile_size,tile_size,tile_size);
                } 
                else if (this.grid[i][j] === 2) {
                    ctx.drawImage(this.img_tower_block,j*tile_size,i*tile_size,tile_size,tile_size);
                } 
                else {
                    ctx.drawImage(this.img_dirt_grass,j*tile_size,i*tile_size,tile_size,tile_size);
                }
            }
        }
    }

}