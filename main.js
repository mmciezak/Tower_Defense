import {Game} from "./game.js"
import {Enemy} from "./enemy.js"
import {Tower,projectiles} from "./tower.js"
import { tile_size,rows,columns,grid1,grid2,grid3,enemy_path1,enemy_path2,enemy_path3,enemy_stats } from "./config.js";

export const canvas = document.getElementById("canvas");
canvas.width = columns * tile_size;
canvas.height = rows * tile_size;

let money_display = document.getElementById("money");

let timer_display = document.getElementById("timer");
let preparation_time = 10; // 10 - 30
let preparation_timer = 0;
// let wave1_start = false;
// let wave2_start = false;
let wave = 0;
let prep = true; // na poczatku 30s preparation time i miedzy falami
let level_status = document.getElementById("level_status");
let level_number = document.getElementById("level_nr");
let level = 0; // level number ktory sie zmienia

let selected_tile=null;
let tower_menu = document.getElementById("tower_menu");

const tower_costs = {
    arrow: 50,
    cannon: 100,
    ice: 75,
};

let game = null;
let grid = grid1;
let enemy_path = enemy_path1;

//let projectiles = [];

let level_complete_message="Complete";
let lastTime = 0;
function loop(time){
    //timer_display.textContent = "00:"+preparation_timer;

    // let deltaTime = (time - lastTime) / 1000;
    // lastTime = time;

    let deltaTime = (time - lastTime) / 1000;
    lastTime = time;
    deltaTime = Math.min(deltaTime, 0.1); // zeby przy przelaczaniu kart sie nie psul czas

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    level_number.textContent = level+"";
    
    
    if(prep){
        preparation_timer+=deltaTime;
        let remaining=Math.ceil(preparation_time-preparation_timer);
        if(remaining>9) timer_display.textContent = "00:"+remaining;
        else timer_display.textContent = "00:0"+remaining;
        
        if(preparation_time<=preparation_timer && enemies_to_spawn.length>0){
            //wave1_start=true;
            wave++;
            level_status.textContent = "Wave "+wave;
            timer_display.textContent = "";
            prep=false;
        }
    
    }
    else{
        // spawn
        if(enemies_to_spawn.length > 0 && enemies_to_spawn[0].wave == wave) {
            spawn_timer += deltaTime;
            if(spawn_timer >= spawn_interval) {
                enemies.push(enemies_to_spawn.shift()); // delete
                spawn_timer = 0;
            }
        } else if(enemies_to_spawn.filter(e => e.wave == wave).length === 0 && enemies_to_spawn.length>0) {
            if(enemies.length === 0) {
                prep = true;
                preparation_timer = 0;
                level_status.textContent = "Preparation Stage: ";
            }

        }
        else{
            if(enemies.length<=0 && enemies_to_spawn.length<=0)
                level_status.textContent = level_complete_message;
        }
    }




    game.draw();
    enemies.forEach(enemy => {
        if(enemy.update(deltaTime)=="breach") 
        {
            enemies_survived++;
            if(enemies_survived >= health) {
                level_status.textContent = "You lose.";
                enemies_to_spawn=[];
            }
        }
        enemy.draw();
        //console.log(enemy.id, enemy.x, enemy.y)

    });

    towers.forEach(tower => {
        if(enemies.length>0){
            let distance=null;
            enemies.forEach(enemy => {
                let temp_distance = Math.abs(Math.sqrt(Math.pow(enemy.x-tower.x,2)+Math.pow(enemy.y-tower.y,2)));
                if(distance==null || distance.dist>temp_distance)
                    distance = {enemy:enemy,dist:temp_distance};
            });
            tower.draw();
            
            if(distance.dist<=tower.type.range){
                tower.draw(distance.enemy);
                tower.attack(distance.enemy,deltaTime);
            }
            
        }
        else{
            tower.draw();
        }

    });

    projectiles.forEach(projectile => {
        projectile.update(deltaTime);
        projectile.draw();
    });

    for(let i=projectiles.length-1;i>=0;i--){
        if(projectiles[i].dead){
            projectiles.splice(i,1);
        }
    }

    //enemies = enemies.filter(enemy => !enemy.dead);
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].dead) {
            
            if(!enemies[i].breach){
                money+=30;
                money_display.textContent = "money: $"+money;
            }
            enemies.splice(i, 1);
            
        }
    }

    if(enemies.length<=0){
        console.log(enemies_survived);
        if(enemies_survived>=health && enemies_to_spawn.length<=0){
            console.log("YOU LOSE");
            level_complete_message = "You lost.";
        }
        else if(enemies_survived<health && enemies_to_spawn.length<=0){
            console.log("YOU WIN");
            level_complete_message = "You win!";
        }
    }
    requestAnimationFrame(loop);
}



// klikniecie pola
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();

    let x = Math.floor((e.clientX - rect.left) / tile_size);
    let y = Math.floor((e.clientY - rect.top) / tile_size);

    //console.log("kliknięto:", y, x);

    if(grid[y][x]==2){
        selected_tile = {x,y};
        //console.log("tower");
        tower_menu.style.display = "flex";
        tower_menu.style.left = (rect.left + x * tile_size) + "px";
        tower_menu.style.top  = (rect.top  + y * tile_size + tile_size) + "px";



        return;
    }
    tower_menu.style.display = "none"; // zamknij menu

    enemies.forEach(enemy => {

        if(    
            e.clientX - rect.left >= enemy.x &&
            e.clientX - rect.left <= enemy.x + tile_size &&
            e.clientY - rect.top  >= enemy.y &&
            e.clientY - rect.top  <= enemy.y + tile_size)
        {
            //enemy.take_damage(50); // do testow
        }



    });
});


let towers = [];
document.querySelectorAll(".tower").forEach(tower=>{
    tower.addEventListener("click",()=>{
        let type = tower.dataset.type;
        if(!type) return;

        let cost = tower_costs[type];
        if(cost>money) {
            console.log("no money");
        }
        else {
            money-=cost;
            money_display.textContent = "money: $"+money;
            grid[selected_tile.y][selected_tile.x] = 3;
            console.log(`postawiono wieżę: ${type} na`, selected_tile);
            let tower = new Tower(type,selected_tile.x,selected_tile.y);
            towers.push(tower);
            
        }
        tower_menu.style.display ="none";

    })
})

export const ctx = canvas.getContext("2d");

// 0 = ziemia
// 1 = ścieżka
// 2 = blok (wieża)

//game.draw();


let enemies_to_spawn = [];
export let enemies = []; //
let enemies_survived = 0;
let spawn_interval = 2;
let spawn_timer = 0;
export let money = 100;
let health = 5;



//start screen
let start_screen = document.getElementById("start_screen");
let hud = document.getElementById("hud");
//let level_select = document.getElementById("level_selection");
document.querySelectorAll(".level_selection").forEach(level_btn => {
    level_btn.addEventListener("click",()=>{
        let level_nr = level_btn.dataset.type;
        level = level_nr;
        if(level_nr==1){
            grid = grid1;
            enemy_path = enemy_path1;
            game = new Game(grid);
            hud.style.display = "flex" // visible 
            canvas.style.display = "block";
            start_screen.style.display = "none";
            

            enemies_to_spawn = [
                // wave 1
                new Enemy(enemy_path,enemy_stats.orc,1),
                new Enemy(enemy_path,enemy_stats.orc,1),

                new Enemy(enemy_path,enemy_stats.wolf,1),
                new Enemy(enemy_path,enemy_stats.wolf,1),
                new Enemy(enemy_path,enemy_stats.bug,1),
                new Enemy(enemy_path,enemy_stats.bug,1),


                //wave 2
                new Enemy(enemy_path,enemy_stats.wolf,2),
                new Enemy(enemy_path,enemy_stats.wolf,2),
                new Enemy(enemy_path,enemy_stats.wolf,2),
                new Enemy(enemy_path,enemy_stats.bug,2),
                new Enemy(enemy_path,enemy_stats.bug,2),
                new Enemy(enemy_path,enemy_stats.bug,2),

                //wave 3
                new Enemy(enemy_path,enemy_stats.orc,3),
                new Enemy(enemy_path,enemy_stats.orc,3),
                new Enemy(enemy_path,enemy_stats.wolf,3),
                new Enemy(enemy_path,enemy_stats.wolf,3),
                new Enemy(enemy_path,enemy_stats.wolf,3),
                new Enemy(enemy_path,enemy_stats.orc,3),
                new Enemy(enemy_path,enemy_stats.orc,3),
                new Enemy(enemy_path,enemy_stats.bug,3),
                new Enemy(enemy_path,enemy_stats.bug,3),
                new Enemy(enemy_path,enemy_stats.bug,3),
                new Enemy(enemy_path,enemy_stats.orc,3),
                new Enemy(enemy_path,enemy_stats.orc,3),
            ]

            loop(0);
        }
        else if(level_nr==2){
            grid = grid2;
            enemy_path = enemy_path2;
            game = new Game(grid);
            hud.style.display = "flex" // visible 
            canvas.style.display = "block";
            start_screen.style.display = "none";

            enemies_to_spawn = [
                // wave 1
                new Enemy(enemy_path,enemy_stats.orc,1),
                new Enemy(enemy_path,enemy_stats.orc,1),

                new Enemy(enemy_path,enemy_stats.wolf,1),
                new Enemy(enemy_path,enemy_stats.wolf,1),
                new Enemy(enemy_path,enemy_stats.bug,1),
                new Enemy(enemy_path,enemy_stats.bug,1),


                //wave 2
                new Enemy(enemy_path,enemy_stats.wolf,2),
                new Enemy(enemy_path,enemy_stats.wolf,2),
                new Enemy(enemy_path,enemy_stats.wolf,2),
                new Enemy(enemy_path,enemy_stats.bug,2),
                new Enemy(enemy_path,enemy_stats.bug,2),
                new Enemy(enemy_path,enemy_stats.bug,2),

                //wave 3
                new Enemy(enemy_path,enemy_stats.orc,3),
                new Enemy(enemy_path,enemy_stats.orc,3),
                new Enemy(enemy_path,enemy_stats.wolf,3),
                new Enemy(enemy_path,enemy_stats.wolf,3),
                new Enemy(enemy_path,enemy_stats.wolf,3),
                new Enemy(enemy_path,enemy_stats.orc,3),
                new Enemy(enemy_path,enemy_stats.orc,3),
                new Enemy(enemy_path,enemy_stats.bug,3),
                new Enemy(enemy_path,enemy_stats.bug,3),
                new Enemy(enemy_path,enemy_stats.bug,3),
                new Enemy(enemy_path,enemy_stats.orc,3),
                new Enemy(enemy_path,enemy_stats.orc,3),


            ]

            loop(0);
        }
        else if(level_nr==3){
            grid = grid3;
            enemy_path = enemy_path3;
            game = new Game(grid);
            hud.style.display = "flex" // visible 
            canvas.style.display = "block";
            start_screen.style.display = "none";

            spawn_interval=0.5;
            money=300;
            money_display.textContent="money: $"+money;
            enemies_to_spawn = []
            for(let i = 0; i < 100; i++) {
                enemies_to_spawn.push(new Enemy(enemy_path, enemy_stats.orc, 1));
            }
            for(let i = 0; i < 100; i++) {
                enemies_to_spawn.push(new Enemy(enemy_path, enemy_stats.wolf, 1));
            }
            for(let i = 0; i < 100; i++) {
                enemies_to_spawn.push(new Enemy(enemy_path, enemy_stats.bug, 1));
            }

            loop(0);
        }
    })
});


//start_screen.style.display = "none";
