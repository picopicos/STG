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
}

class Entity{
    constructor(ctx, x, y, width, height, life){
        this.ctx = ctx;
        this.position = new Position(x,y);
        this.width = width;
        this.height = height;
        this.life = life;  // エンティティの生存フラグ(0で削除、1以上で出現)
        this.speed = 1.5;

        this.image = new Image();
        this.ready = false;
        this.image.addEventListener('load', () => {
            this.ready = true;
        }, false);
        this.image.src = './image/test.png';  // ロードミスを防ぐデバッグ用画像（後に消去）

        this.angle = 270 * Math.PI / 180;
    }

    // 画像の一括参照用
    setImage(imagePath){
        this.image.src = imagePath;
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

}

class Player extends Entity{
    constructor(ctx, x, y, width, height, life){
        super(ctx, x, y, width, height, 0);

        this.shotArray = null;  // ショットの弾１つ１つは配列に割り当てられる
        this.shot_check_counter = 0;
        this.shot_cool_time = 10;
    }

    setShotArray(shotArray){
        this.shotArray = shotArray;
    }

    update(){
        if(window.Is_key_down.key_ArrowLeft === true){
            this.position.x -= this.speed;
        }
        if(window.Is_key_down.key_ArrowRight === true){
            this.position.x += this.speed;
        }
        if(window.Is_key_down.key_ArrowUp === true){
            this.position.y -= this.speed;
        }
        if(window.Is_key_down.key_ArrowDown === true){
            this.position.y += this.speed;
        }
        let tx = Math.min(Math.max(this.position.x, 0), this.ctx.stage_width);
        let ty = Math.min(Math.max(this.position.y, 0), this.ctx.stage_height);
        this.position.set(tx, ty);
        this.draw();


        // 生成可能なショット(最大数＆クールタイム条件)を走査し１つずつ生成する
        if(window.Is_key_down.key_z === true){
            if(this.shot_check_counter >= 0){
                for(let i = 0; i < this.shotArray.length; i++){
                    if(this.shotArray[i].life <= 0){
                        this.shotArray[i].generate(this.position.x, this.position.y);
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
    constructor(ctx, x, y, width, height){
        super(ctx, x, y, width, height, 0);
        this.speed = 10;
    }

    generate(x, y){
        this.position.set(x, y);
        this.life = true;
    }

    update(){
        if(this.life <= 0){return;}
        if(this.position.y + this.height < 0){
            this.life = 0;
        }

        this.position.y -= this.speed;
        this.draw();
    }
}

class Enemy extends Entity{
    constructor(ctx, x, y, width, height){
        super(ctx, x, y, width, height, 0);
        this.speed = 3;
    }

    set(x, y, life = 1){
        this.position.set(x,y);
        this.life = life;
    }

    update(){
        if(this.life <= 0){return;}
        if(this.position.y - this.height > this.ctx.canvas.height){
            this.life = 0;
        }

        this.position.x += this.speed;
        this.position.y += this.speed;

        this.draw();
    }
}
