/* ---------------------------------------------
    ロード完了と実行をまとめる
--------------------------------------------- */
(() => {
'use strict';

/* 変数定義 */
window.Is_key_down         = {};

const CANVAS_WIDTH         = 960;
const CANVAS_HEIGHT        = 720;
const STAGE_WIDTH          = 960;
const STAGE_HEIGHT         = 720;

let util                   = null;
let canvas                 = null;
let ctx                    = null;

let start_time_ms          = null;
let now_time_s             = null;
let scene                  = null;

let player                 = null;
let shot_array             = [];
let enemy_array            = [];
let enemy_shot_array       = [];
const SHOT_MAX_COUNT       = 10;
const ENEMY_MAX_COUNT      = 10;
const ENEMY_SHOT_MAX_COUNT = 50;

window.addEventListener('load', () => {
    initialize();
    load();
}, false);

/* 関数定義 */
/* canvas利用に必要な初期設定 */
function initialize(){
    // utilityへの参照を省略
    util             = new Canvas2DUtility(document.body.querySelector('#main-canvas'));
    canvas           = util.canvas;
    ctx              = util.context;

    canvas.width     = CANVAS_WIDTH;
    canvas.height    = CANVAS_HEIGHT;
    ctx.stage_width  = STAGE_WIDTH;
    ctx.stage_height = STAGE_HEIGHT;
}

/* データ＆設定のロードから描画関数へ */
function load(){
    let ready = true;

    player = new Player(ctx, 0, 0, 64, 64, 64, 10);
    for(let i = 0; i < SHOT_MAX_COUNT; i++){
        shot_array[i] = new Shot(ctx, 0, 0, 32, 32);
        shot_array[i].setImage('./assets/img/shot_lv1.png');
        shot_array[i].setHitboxTargets(enemy_array);
    }
    for(let i = 0; i < ENEMY_SHOT_MAX_COUNT; i++){
        enemy_shot_array[i] = new Shot(ctx, 0, 0, 14, 14);
        enemy_shot_array[i].setImage('./assets/img/enemy_shot.png');
        enemy_shot_array[i].setHitboxTargets([player]);  // 引数は配列なので注意
    }
    for(let i = 0; i < ENEMY_MAX_COUNT; i++){
        enemy_array[i] = new Enemy(ctx, 0, 0, 64, 64);
        enemy_array[i].setImage('./assets/img/enemy.png');
        // enemy_shot_arrayは敵の種類に関わらず同じものを利用する
        enemy_array[i].setShotArray(enemy_shot_array);
        enemy_array[i].setHitboxTargets([player]);  // 引数は配列なので注意
    }
    for(let i = 0; i < SHOT_MAX_COUNT; i++){
        shot_array[i].setHitboxTargets(enemy_array);
    }
    player.setShotArray(shot_array);
    scene = new SceneManager();

    // 画像をまとめて参照
    player.setImage('./assets/img/player.png');

    // 読み込みが必要なものをここに置く
    // 例) ready === ready && XXX.ready
    ready === ready && player.ready;
    shot_array.map((v)       => {ready === ready && v.ready;});
    enemy_array.map((v)      => {ready === ready && v.ready;});
    enemy_shot_array.map((v) => {ready === ready && v.ready;});

    if(ready === true){
        setEventSetting();
        setSceneSetting();
        start_time_ms = Date.now();
        render();
    } else {
        setTimeout(load, 100);
    }
}

/* キー押下イベント */
function setEventSetting(){
    window.addEventListener('keydown', (event) => {
        Is_key_down[`key_${event.key}`] = true;
    }, false);
    window.addEventListener('keyup', (event) => {
        Is_key_down[`key_${event.key}`] = false;
    }, false);
}

/* シーン管理 */
function setSceneSetting(){
    scene.add('intro', (time) => {
        if(time > 2.0){
            scene.use('invade');
        }
    });

    scene.add('invade', (time) => {
        if(scene.run_frame === 0){
            for(let i = 0; i < ENEMY_MAX_COUNT; ++i){
                if(enemy_array[i].life <= 0){
                    enemy_array[i].setDirectionVector(0.0, 1.0);
                    enemy_array[i].set(CANVAS_WIDTH / 4, -enemy_array[i].height, 2, 'default');
                    break;
                }
            }
        }

        // 経過後,シーンを再利用する
        if(scene.run_frame === 180){
            scene.use('invade');
        }
    })

    // 初期シーンの設定
    scene.use('intro');
}

/* 描画＆更新 */
function render(){
    util.drawRect(0, 0, canvas.width, canvas.height, '#2982A3');
    let now_time_s = (Date.now() - start_time_ms) / 1000;

    player.update();
    shot_array.map((v)       => {v.update();});
    enemy_array.map((v)      => {v.update();});
    enemy_shot_array.map((v) => {v.update();});
    scene.update();

    requestAnimationFrame(render);
}

})();
