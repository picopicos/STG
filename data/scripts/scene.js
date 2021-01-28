class SceneManager {
    constructor(){
        this.scene = {};
        this.active_scene = null;
        this.start_time_ms = null;
        this.frame = null;
    }

    add(scene_name, update_function){
        this.scene[scene_name] = update_function;
    }

    use(scene_name){
        if(this.scene.hasOwnProperty(scene_name)) !== true){
            return;
        }
        this.active_scene = this.scene[scene_name];
        this.start_time_ms = Date.now();
        this.frame = -1;
    }

    update(){
        let active_time_s = (Date.now() - this.start_time_ms) / 1000;
        this.active_scene(active_time_s);
        this.frame++;
    }
}
