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

        this.image = new Image();
        this.image.addEventListener('load', () => {
            this.ready = true;
        }, false);
        // ロードミスを防ぐデバッグ用画像（後に消去）
        this.image.src = './image/test.png';

        this.angle = 270 * Math.PI / 180;
    }

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
        this.draw();
    }
}

class Player extends Entity{
    constructor(ctx, x, y, width, height, life){
        super(ctx, x, y, width, height, 0);
    }
}
