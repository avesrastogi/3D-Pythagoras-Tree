

//JS

function Scene() {
    var self = this;
    var W, H;
    var camera, scene, renderer;
    var geometry, material, mesh;
    var pointLight, ambientLight;
    var mouseX = 0;
    var mouseY = 0;
    var nbmesh = 1;
    var edge_w = 100;
    var edge_h = 150;
    var levels = 8;        //for faster movement lower the value

    this.init = function() {
        //SET
        scene = new THREE.Scene();
        W = window.innerWidth;
        H = window.innerHeight;

        //LIGHTS
        pointLight = new;
        THREE.PointLight(0xD0D0D0, 2, 1000);
        pointLight.position.z = 100;
        pointLight.position.y = 100;
        pointLight.position.x = 500;
        scene.add(pointLight);
        ambientLight = new THREE.AmbientLight(0x404040);

        //CAMERA
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.x = 500;

        //CAST 
        geometry = new THREE.CubeGeometry(edge_w, edge_h, edge_w);

        var mesh;
        var color;

        color = new THREE.Color("rgb(135,90,0)");
        material = new THREE.MeshPhongMaterial( {
            color: color, 
            wireframe = false;
        });

        mesh = new THREE.Mesh(geometry, material);
        
        scene.add(mesh);

        mesh.matrix.makeTranslation(0, -125, 0);
        mesh.matriAutoUpdate = false;


        function tree(n, mat, c) {
            if(n>0) {
                var new_mat = new THREE.Matrix4();
                var new_mat2 = new THREE.Matrix4();
                var new_mat_t0 = new THREE.Matrix4();
                var new_mat_t = new THREE.Matrix4();
                var new_mat_r = new THREE.Matrix4();
                var new_mat_r2 = new THREE.Matrix4();
                var new_mat_s = new THREE.Matrix4();
                var mat2 = mat.clone();
                var col1 = c.clone();
                var col2 = c.clone();
                
                col1.g += 0.64/levels;
                material = new THREE.MeshPhongMaterial( {
                    color: col1,
                    wireframe: false
                });

                new_mat_t0.makeTranslation(edge_w/2, 0, 0);
                new_mat_t.makeTranslation(0, edge_h, 0);
                new_mat_r.makeRotationZ(-Math.PI/4);
                new_mat_r2.makeRotationY(Math.PI/2);
                new_mat_s.makeScale(0.75, 0.75, 0.75);
                new_mat.multiply(new_mat_r2);
                new_mat.multiply(new_mat_t0);
                new_mat.multiply(new_mat_r);
                new_mat.multiply(new_mat_s);
                new_mat.multiply(new_mat_t);
                new_mat.multiply(mat);
                mesh.matrix.copy(new_mat);
                mesh.matriAutoUpdate = false;
                mesh.updateMatrix = false;
                scene.add(mesh);
                tree(n-1, mesh.matrix.clone(), col1);

                col2.g +=0.64/levels;
                material = new THREE.MeshPhongMaterial({
                    color: col2,
                    wireframe : false;
                });
                mesh = new THREE.Mesh(geometry, material);
                new_mat_t0.makeTranslation(-edge_w/2, 0, 0);
                new_mat_t.makeTranslation(0, edge_h, 0);
                new_mat_r.makeRotationZ(Math.PI/4);
                new_mat_r2.makeRotationY(Math.PI/2);

                new_mat_s.makeScale(0.75,0.75,0.75);
                new_mat2.multiply(new_mat_r2);
                new_mat2.multiply(new_mat_t0);
                new_mat2.multiply(new_mat_r);
                new_mat2.multiply(new_mat_s);
                new_mat2.multiply(new_mat_t);
                new_mat2.multiply(mat);
                mesh.matrix.copy(new_mat2);
                mesh.matriAutoUpdate = false;
                mesh.updateMatrix = false;
                scene.add(mesh);
                tree(n-1, mesh.matrix.clone(), col2);
            }
        }

        tree(levels, mesh.matrix, color);

        //ACTIO
        renderer = new THREE.webGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.querySelector('.scene').appendChild(renderer.domElement);
        window.addEventListener("resize", this.onresize);
        document.addEventListener("mousemove", this.onmousemove);
    }

    this.animate = function() {
        requestAnimationFrame(self.animate);
        camera.position.z += (mouseX - camera.position.z) * .05;
        camera.position.y += (-mouseY - camera.position.y) * .05;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }

    this.onresize = function() {
        W = window.innerWidth
        H = window.innerHeight
        camera.aspect = W/H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H, true);
        renderer.render(scene, camera);
    }

    this.onmousemove = function(e) {
        mouseX = (event.clientX - W/2);
        mouseY = (event.clientY - H/2);
    }

    this.init();
    this.animate();

}

var s = new Scene();