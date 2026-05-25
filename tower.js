import { tile_size, rows, columns, tower_stats } from "./config.js";
import { ctx } from "./main.js";
import { Projectile } from "./projectile.js";

export let projectiles = [];

export class Tower{

    constructor(type,x,y){
        this.type = tower_stats[type];

        this.x = x*tile_size;
        this.y = y*tile_size;
        this.img = new Image();
        this.img.src = this.type.img;

        this.fire_timer = 0;
        this.fire_rate = this.type.speed;

        this.angle = -Math.PI/2;
    }

    attack(enemy,deltaTime){

        this.fire_timer+=deltaTime;
        if(this.fire_timer>=1/this.fire_rate){
            let angle = Math.atan2(enemy.y - this.y,enemy.x - this.x);
            let barrel_x = this.x + tile_size/2 + Math.cos(angle) * tile_size;
            let barrel_y = this.y + tile_size/2 + Math.sin(angle) * tile_size;
            let projectile = new Projectile(this.type.damage,barrel_x,barrel_y,enemy,this.type.color);
            projectiles.push(projectile);
            this.fire_timer=0;
        }


    }

    upgrade(){
        // more dmg, more range
    }

    update(){
        
    }

    draw(target){

        let line_length = tile_size;
        let x = this.x + tile_size/2; // start x, srodek tower
        let y = this.y + tile_size/2; // start y

        if(target){
            let x2 = target.x + tile_size/2;
            let y2 = target.y + tile_size/2;
            this.angle = Math.atan2(y2-y, x2-x); // y, x
        }

        let to_x = x + line_length*Math.cos(this.angle); // end
        let to_y = y + line_length*Math.sin(this.angle);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 6;
        ctx.lineCap = "square";
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(to_x,to_y);
        ctx.stroke();
        

        if(this.type.img===""){
            ctx.fillStyle = this.type.color;
            ctx.fillRect(this.x,this.y,tile_size,tile_size);
        }
        else{
            ctx.drawImage(this.img,this.x,this.y,tile_size,tile_size);
        }

    }



}