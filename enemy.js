import { tile_size, rows,columns } from "./config.js";
import { ctx,canvas,money } from "./main.js"

export class Enemy {
    constructor(path, type, wave){
        //this.id = id;
        this.pathIndex = 0;
        this.path = path; // [[x_1,y_1],[x_2,y_2]...]

        this.sprite_sheet = new Image();
        this.sprite_sheet.src = type.animation_img;
        this.x = path[0].x * tile_size; // 0 * 50
        this.y = path[0].y * tile_size; // 1 * 50

        this.speed = type.speed;
        this.hp = type.hp;
        this.max_hp = type.hp;
        this.wave = wave;

        this.dead = false;
        this.breach = false;

        // animacja
        //this.frame = 0;
        this.frame = 6; // od konca bo jest odwrocone zdjecie
        this.frameTimer = 0;
        this.frameSpeed = 0.5; // 

        this.png_position_x = 0;
        this.png_position_y = 0;

    }
    update(deltaTime) {
        if (this.pathIndex >= this.path.length) return;
        let target = this.path[this.pathIndex];

        let target_x = target.x * tile_size;
        let target_y = target.y * tile_size;
        let dx = target_x - this.x; // odleglosc x od target_x
        let dy = target_y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);

        // jeśli doszedł do punktu
        if (distance < 2) {
            this.pathIndex++;

            // koniec 
            if (this.pathIndex >= this.path.length) {
                if(!this.dead){
                    console.log("enemy reached end");
                    this.dead = true;
                    this.breach = true;
                    return "breach";
                }
                
                return;
            }
        } else {
            // ruch w kierunku punktu
            if (distance === 0) return;
            this.x += (dx / distance) * this.speed * deltaTime;
            this.y += (dy / distance) * this.speed * deltaTime;
        }


        this.frameTimer += deltaTime;

        if (this.frameTimer >= 0.1) {
            this.frame--;
            this.frameTimer -= 0.1;

            // if (this.frame >= 6) { // liczba klatek w sprite sheet
            //     this.frame = 0;
            // }
            if(this.frame <= 0){
                this.frame=6;
            }
        }

    }
    draw() {
        //this.update();
        ctx.drawImage(
            this.sprite_sheet,
            this.frame*48-48,0,48,48, // co wycinamy , -48 bo po odwroceniu animacji byla o 1 za duzo klatka
            this.x,this.y,tile_size,tile_size // gdzie rysujemy
        );
        this.draw_healthBar();
        //console.log(this.frame);
    }

    draw_healthBar() {
        const barWidth = tile_size;
        const barHeight = 6;
        const x = this.x;
        const y = this.y; // nad głową

        const healthPercent = this.hp / this.max_hp;

        // tło (czerwone)
        ctx.fillStyle = "red";
        ctx.fillRect(x, y, barWidth, barHeight);

        // zdrowie (zielone)
        ctx.fillStyle = "lime";
        ctx.fillRect(x, y, barWidth * healthPercent, barHeight);

        // obramowanie
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, barWidth, barHeight);
    }

    take_damage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.hp = 0;
            this.dead = true;
            //money+=30; //read only
        }
        //console.log(this.id+" hurt");
    }
}