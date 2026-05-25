import { tile_size, rows, columns } from "./config.js";
import { ctx } from "./main.js";

export class Projectile{
    constructor(damage,x,y,target,color){
        this.color = color;
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.speed = 900;
        this.target = target;
        this.dead = false;
        console.log("created projectile");
    }

    update(deltaTime){
        if(this.target.dead){
            this.dead = true;
            return;
        }

        let dx = this.target.x - this.x;
        let dy = this.target.y - this.y;
        let distance = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));

        if(distance<5){
            this.target.take_damage(this.damage);
            this.dead=true;
            return;
        }

        this.x += (dx/distance) * this.speed * deltaTime;
        this.y += (dy/distance) * this.speed * deltaTime;
    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,6,0,2*Math.PI);
        ctx.fill();
    }


}