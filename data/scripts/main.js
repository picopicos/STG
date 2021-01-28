/* ---------------------------------------------
    ロード完了と実行をまとめる
--------------------------------------------- */
(() => {
'use strict';

// 変数定義
window.Is_key_down = {};
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 720;
const STAGE_WIDTH = 960;
const STAGE_HEIGHT = 720;
const SHOT_MAX_COUNT = 10;
const ENEMY_MAX_COUNT = 10;
let util = null;
let canvas = null;
let ctx = null;
let player = null;
let start_time_ms = null;
let now_time_s = null;
let shot_array = [];
let enemy_array = [];

window.addEventListener('load', () => {
    initialize();
    load();
}, false);

function initialize(){
    // utilityへの参照を省略
    util = new Canvas2DUtility(document.body.querySelector('#main-canvas'));
    canvas = util.canvas;
    ctx = util.context;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    ctx.stage_width = STAGE_WIDTH;
    ctx.stage_height = STAGE_HEIGHT;
}

function load(){
    let ready = true;

    player = new Player(ctx, 0, 0, 64, 64);
    for(let i = 0; i < SHOT_MAX_COUNT; i++){
        shot_array[i] = new Shot(ctx, 0, 0, 32, 32);
        shot_array[i].setImage('./assets/img/shot.png');
    }
    for(let i = 0; i < ENEMY_MAX_COUNT; i++){
        enemy_array[i] = new Enemy(ctx, 0, 0, 48, 48);
        enemy_array[i].setImage('./assets/img/enemy.png');
    }
    player.setShotArray(shot_array);

    // 画像をまとめて参照
    player.setImage('./assets/img/player.png');

    // 読み込みが必要なものをここに置く
    // 例) ready === ready && XXX.ready
    ready === ready && player.ready;
    shot_array.map((v) => {ready === ready && v.ready;});
    enemy_array.map((v) => {ready === ready && v.ready;});

    if(ready === true){
        eventSetting();
        start_time_ms = Date.now();
        render();
    } else {
        setTimeout(load, 100);
    }
}

function eventSetting(){
    window.addEventListener('keydown', (event) => {
        Is_key_down[`key_${event.key}`] = true;
    }, false);
    window.addEventListener('keyup', (event) => {
        Is_key_down[`key_${event.key}`] = false;
    }, false);
}

function render(){
    util.drawRect(0, 0, canvas.width, canvas.height, '#eeeeee');
    let now_time_s = (Date.now() - start_time_ms) / 1000;

    player.update();
    shot_array.map((v) => {v.update();});
    enemy_array.map((v) => {v.update();});

    requestAnimationFrame(render);
}

})();
