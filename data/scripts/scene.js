class SceneManager {
    constructor(){
        this.scene         = {};
        this.active_scene  = null;
        this.start_time_ms = null;
        this.run_frame     = null;
    }

    add(scene_name, scene_function){
        this.scene[scene_name] = scene_function;
    }

    use(scene_name){
        if(this.scene.hasOwnProperty(scene_name) !== true){
            console.log('invalid scene');
            return;
        }
        this.active_scene  = this.scene[scene_name];
        this.start_time_ms = Date.now();
        this.run_frame     = -1;
    }

    // 毎フレーム、シーン経過時間(秒)をactive_sceneに渡す
    update(){
        let active_time_s = (Date.now() - this.start_time_ms) / 1000;
        this.active_scene(active_time_s);
        this.run_frame++;
    }
}
