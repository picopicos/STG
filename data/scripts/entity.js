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
        this.life = life;
        this.speed = 1.5;

        this.image = new Image();
        this.ready = false;
        this.image.addEventListener('load', () => {
            this.ready = true;
        }, false);
        // ロードミスを防ぐデバッグ用画像（後に消去）
        this.image.src = './image/test.png';

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

    update(){
        // TODO:移動処理
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
        this.draw();
    }
}

class Player extends Entity{
    constructor(ctx, x, y, width, height, life){
        super(ctx, x, y, width, height, 0);
    }
}
