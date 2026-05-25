
class Game {
    constructor(grid){
        this.grid = grid;
        console.log("game created");
    }
    update() {

    }
    draw() {
        for(let i=0;i<rows;i++){
            for(let j=0;j<columns;j++){

                if (this.grid[i][j] === 1) {
                    //ctx.fillStyle = "#b78470"; // ścieżka
                    let image = new Image();
                    image.src = "PNG/Retina/towerDefense_tile034.png";
                    ctx.drawImage(image,j*tile_size,i*tile_size,tile_size,tile_size);
                } 
                else if (this.grid[i][j] === 2) {
                    //ctx.fillStyle = "gray"; // tower block
                    let image = new Image();
                    image.src = "PNG/Retina/towerDefense_tile042.png";
                    ctx.drawImage(image,j*tile_size,i*tile_size,tile_size,tile_size);
                } 
                else {
                    //ctx.fillStyle = "#6ead4e"; // trawa
                    let image = new Image();
                    image.src = "PNG/Retina/towerDefense_tile024.png";
                    ctx.drawImage(image,j*tile_size,i*tile_size,tile_size,tile_size);

                }

                // //ctx.fillStyle = "#6ead4e";
                // ctx.fillRect(j*tile_size,i*tile_size,tile_size,tile_size);

                // ctx.strokeStyle = "#41663287";
                // ctx.strokeRect(j*tile_size,i*tile_size,tile_size,tile_size);
            }

        }

        //console.log("grid draw");
    }
    loop() {}
}

class Enemy {
    constructor(path){
        this.pathIndex = 0;
        this.path = path;
        this.x = path[0].x * tile_size; // 0 * 50
        this.y = path[0].y * tile_size; // 1 * 50

        this.speed = 0.5;
        this.hp = 100;



        // animacja
        this.frame = 0;
        this.frameTimer = 0;
        this.frameSpeed = 0.5; // 

    }
    update() {
        if (this.pathIndex >= this.path.length) return;
        let target = this.path[this.pathIndex];

        let targetX = target.x * tile_size;
        let targetY = target.y * tile_size;

        let dx = targetX - this.x;
        let dy = targetY - this.y;

        let dist = Math.sqrt(dx * dx + dy * dy);

        // jeśli doszedł do punktu
        if (dist < 2) {
            this.pathIndex++;

            // koniec ścieżki
            if (this.pathIndex >= this.path.length) {
                console.log("enemy reached end");
                return;
            }
        } else {
            // ruch w kierunku punktu
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }

        this.frameTimer += this.frameSpeed;

        if (this.frameTimer >= 1) {
            this.frame++;
            this.frameTimer = 0;

            if (this.frame >= enemyFrames.length) {
                this.frame = 0;
            }
        }
    }
    draw() {
        //ctx.fillStyle = "red";
        //ctx.beginPath();
        //ctx.arc(this.x + 25, this.y + 25, 10, 0, Math.PI * 2);
        let img = enemyFrames[this.frame];
        //console.log(img);
        ctx.drawImage(
            img,
            this.x,
            this.y,
            tile_size,
            tile_size
        );
        //ctx.fill();
    }
}

class Tower {
    update(enemies) {}
    shoot(enemy) {}
}

class Projectile {
    update() {}
}

// fale wrogow
class WaveManager {
    spawnWave() {
        // generuj enemies
    }
}



let money = 100;
// game loop
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //game.update();
    game.draw();
    enemies.forEach(enemy => {
        enemy.update();
        enemy.draw();
    });
    
    requestAnimationFrame(loop);
}






// kolizje, pathfinding, ekonomia (money), stawianie wiezy

const tile_size = 50;
const rows = 10;
const columns = 20;

const canvas = document.getElementById("canvas");
canvas.width = columns * tile_size;
canvas.height = rows * tile_size;

// 
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();

    let x = Math.floor((e.clientX - rect.left) / tile_size);
    let y = Math.floor((e.clientY - rect.top) / tile_size);

    console.log("kliknięto:", y, x);
});

const ctx = canvas.getContext("2d");

let grid = []
// generowanie grida do mapy(tablica)
for(let i=0;i<rows;i++){
    let row = [];
    for(let j=0;j<columns;j++){
        row.push(0);
    }
    grid.push(row);
}

// 0 = ziemia
// 1 = ścieżka
// 2 = blok (wieża)
//przyklad mapy
// grid = [
//     [0,0,0,0,0,1,0,0,0,0],
//     [1,1,1,1,1,1,0,0,0,0],
//     [0,0,0,0,0,1,1,1,1,1],
//     [0,0,0,0,0,1,0,0,0,0],
//     [0,0,0,2,0,1,0,0,0,0],
//     [0,0,0,0,0,1,0,0,0,0],
//     [0,0,0,0,0,1,0,0,0,0],
//     [0,0,0,2,0,1,0,0,0,0],
//     [0,0,0,0,0,1,0,0,0,0],
//     [0,0,0,0,0,1,0,0,0,0],
// ];

// 1 - grass, 2 - tower, 
// 3 - side grass on the bottom, 
// 4 - side grass on the top, 
// 5 - side grass on the elft
// 6 - side grass on the right
// 7 - grass edge

// /PNG/Retina/towerDefense_tile034.png - gray path
// 
grid = [
[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,2,0,1,0,0,2,0,0,0,0,2,0,0,0,0,0,0],
[0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
[0,2,0,0,0,2,0,1,0,2,0,0,0,2,0,0,0,2,0,0],
[0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0],
[0,0,0,2,0,0,0,2,0,0,0,2,1,0,0,2,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
[0,2,0,0,0,2,0,0,0,2,0,0,1,2,0,0,0,2,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
];

// sciezka dla enemy dla tego grida
const enemy_path = [
    { x: 0, y: 0 },
    { x: 5, y: 0 },
    { x: 5, y: 2 },
    { x: 6, y: 2 },
    { x: 7, y: 2 },
    { x: 7, y: 3 },
    { x: 7, y: 4 },
    { x: 12, y: 4 },
    { x: 12, y: 5 },
    { x: 12, y: 9 },
    { x: 19, y: 9 }, // nie musza byc wszystkie tylko ostre katy

];

//drawGrid();
let game = new Game(grid);
game.draw();

// animation frames
enemyFrames = [];

for (let i = 0; i <= 17; i++) {
    let img = new Image();
    img.src = `assets/Monster_1/PNG/PNG_Sequences/fly/0_Monster_Fly_${i}.png`;
    enemyFrames.push(img);
}

let enemies = []
let enemy1 = new Enemy(enemy_path);
let enemy2 = new Enemy(enemy_path);
enemies.push(enemy1);
enemies.push(enemy2);

loop();

