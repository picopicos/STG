/* ---------------------------------------------
    座標を持つプレイヤー、敵、弾などを一括管理する
--------------------------------------------- */
class Position{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    set(x, y){
        if(x !== null){this.x = x;}
        if(y !== null){this.y = y;}
    }
    distance(target){
        let x = this.x - target.x;
        let y = this.y - target.y;
        return Math.sqrt(x * x + y * y);
    }
}

class Entity{
    constructor(ctx, x, y, width, height, hitbox = width, life = 0){
        this.ctx       = ctx;
        this.image     = new Image();
        this.image.src = null;
        this.ready     = false;
        this.image.addEventListener('load', () => {
            this.ready = true;
        }, false);

        this.width     = width;
        this.height    = height;
        this.hitbox    = hitbox;
        this.position  = new Position(x,y);
        this.direction_vector = new Position(0.0, -1.0);
        this.angle     = 0.5 * Math.PI;  // 右を0ラジアンとする。

        this.speed_dpf = 1.5;
        this.life      = life;           // エンティティの生存フラグ(0で削除、1以上で出現)
    }

    setDirectionVector(x, y){
        this.direction_vector.set(x, y);
    }

    setDirectionVectorFromAngle(angle){
        this.angle = angle;
        let sin    = Math.sin(angle);
        let cos    = Math.sin(angle);
        this.direction_vector.set(cos, sin);
    }

    setSpeed(speed_dpf){
        if(speed_dpf != null && speed_dpf > 0){
            this.speed_dpf = speed_dpf;
        }
    }

    setHitboxTargets(targets){
        if(targets != null && Array.isArray(targets) === true && targets.length > 0){
            this.hitbox_target_array = targets;
        }
    }

    // 画像の一括参照用
    setImage(image_path){
        this.image.src = image_path;
    }

    draw(){
        let offsetX = this.width / 2;
        let offsetY = this.height / 2;
        this.ctx.drawImage(
            this.image,
            this.position.x - offsetX,
            this.position.y - offsetY,
            this.width,
            this.height
        );
    }

    rotationDraw(){
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(0.5 * Math.PI - this.angle);
        let offsetX = this.width / 2;
        let offsetY = this.height / 2;
        this.ctx.drawImage(
            this.image,
            -offsetX,
            -offsetY,
            this.width,
            this.height
        );
        this.ctx.restore();
    }
}

class Player extends Entity{
    constructor(ctx, x, y, width, height, hitbox = width, life = 0){
        super(ctx, x, y, width, height, hitbox, life);
        this.position.set(this.ctx.stage_width / 2, this.ctx.stage_height - 2 * height)

        this.shot_array = null;  // ショットの弾１つ１つは配列に割り当てられる
        this.shot_check_counter = 0;
        this.shot_cool_time = 10;
    }

    setShotArray(shot_array){
        this.shot_array = shot_array;
    }

    update(){
        if(this.life <= 0){return;}
        if(window.Is_key_down.key_ArrowLeft === true){
            this.position.x -= this.speed_dpf;
        }
        if(window.Is_key_down.key_ArrowRight === true){
            this.position.x += this.speed_dpf;
        }
        if(window.Is_key_down.key_ArrowUp === true){
            this.position.y -= this.speed_dpf;
        }
        if(window.Is_key_down.key_ArrowDown === true){
            this.position.y += this.speed_dpf;
        }
        let tx = Math.min(Math.max(this.position.x, 0), this.ctx.stage_width);
        let ty = Math.min(Math.max(this.position.y, 0), this.ctx.stage_height);
        this.position.set(tx, ty);
        this.rotationDraw();


        // 生成可能なショット(最大数＆クールタイム条件)を走査し１つずつ生成する
        if(window.Is_key_down.key_z === true){
            if(this.shot_check_counter >= 0){
                for(let i = 0; i < this.shot_array.length; i++){
                    if(this.shot_array[i].life <= 0){
                        this.shot_array[i].set(this.position.x, this.position.y);
                        this.shot_check_counter = -this.shot_cool_time;
                        break;
                    }
                }
            }
        }
        this.shot_check_counter++;

    }
}

class Shot extends Entity{
    constructor(ctx, x, y, width, height, hitbox){
        super(ctx, x, y, width, height, hitbox, 0);
        this.speed_dpf    = 10;
        this.attack       = 1;
        this.hitbox_target_array = []; // 衝突判定の対象(Characterクラス)
    }

    set(x, y){
        this.position.set(x, y);
        this.life = true;
    }

    setAttack(attack){
        if(attack != null && attack > 0){
            this.attack = attack;
        }
    }

    update(){
        if(this.life <= 0){return;}
        if(this.position.y + this.height < 0 || this.position.y - this.height > this.ctx.canvas.height){
            this.life = 0;
        }

        this.position.x += this.direction_vector.x * this.speed_dpf;
        this.position.y += this.direction_vector.y * this.speed_dpf;

        // 当たり判定処理
        if(this.hitbox_target_array != null){
            this.hitbox_target_array.map((v) => {
                if(this.life <= 0 || v.life <= 0){return;}
                let dist = this.position.distance(v.position);
                if(dist <= (this.hitbox + v.hitbox) / 4){
                    v.life -= this.attack;
                    this.life = 0;
                }
            })
        }

        this.rotationDraw();
    }
}

class Enemy extends Entity{
    constructor(ctx, x, y, width, height, hitbox){
        super(ctx, x, y, width, height, hitbox, 0);
        this.type       = 'default';
        this.frame      = 0;
        this.speed_dpf  = 1;
        this.shot_array = null;
        this.angle      = 1.5 * Math.PI;
        this.collision_attack = 1;
    }
    set(x, y, life = 1, type = 'default'){
        this.position.set(x,y);
        this.life       = life;
        this.type       = type;
        this.frame      = 0;
    }
    setShotArray(shot_array){
        this.shot_array = shot_array;
    }
    fire(x = 0.0, y = 1.0){
        console.log(this.shot_array.length);
        // 生成可能なショット(最大数)を走査し１つずつ生成する
        for(let i = 0; i < this.shot_array.length; i++){
            if(this.shot_array[i].life <= 0){
                this.shot_array[i].set(this.position.x, this.position.y);
                this.shot_array[i].setSpeed(2.0);
                this.shot_array[i].setDirectionVector(x, y);
                break;
            }
        }
    }
    update(){
        if(this.life <= 0){return;}
        switch(this.type){
            case 'default':
            default:
            if(this.frame === 150){
                this.fire();
            }
            this.position.x += this.direction_vector.x * this.speed_dpf;
            this.position.y += this.direction_vector.y * this.speed_dpf;
            if(this.position.y - this.height > this.ctx.canvas.height){
                this.life = 0;
            }
            break;
        }

        if(this.hitbox_target_array != null){
            this.hitbox_target_array.map((v) => {
                if(this.life <= 0 || v.life <= 0){return;}
                let dist = this.position.distance(v.position);
                if(dist <= (this.hitbox + v.hitbox) / 4){
                    v.life -= this.collision_attack;
                }
            })
        }

        this.rotationDraw();
        this.frame++;
    }
}
