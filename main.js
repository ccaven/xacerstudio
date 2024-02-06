/*  xacerstudio

Plan: Stick with our strengths

Next steps:
    1) Add interactible elements for each category
        [DONE] computer + vision: GitHub gists, repositories
        [DONE] computer + learning: same
        human + vision: link to writeup of viva vestibular
        human + learning: link to Rethinking the Online Classroom
    2) Simplify interactions:
        [DONE] Mouse movement (not drag) minorly changes camera angle
        Mobile device rotation changes camera angle
        [DONE] Auto-rotate travels in an infinity pattern
    3) Ensure the page works on mobile devices
        Slide elements in when they do not fit inside the window
        Test on phone

Simple experience:
    1) Readable text
    2) Simple 3D geometries and lighting
    3) Accessible on mobile devices

Interaction methods:
    1) Scroll to move through the scene
    2) Mouse click to select items
  
Avoid:
    1) Physics simulations
    2) Fast camera movement

Key elements:
    1) Main interests: vision + learning in computers + humans
    2) Link to GitHub repositories and gists
    3) Link to blog, when exists (blog.xacer.dev)

*/

import * as THREE from './src/three.js';
import { TextGeometry } from './src/TextGeometry.js';
import { FontLoader, Font } from './src/FontLoader.js';
import { InteractionManager } from './src/Interactive.js';

const run = true;

const canvas = (function initializeCanvas() {

    /** @type {HTMLCanvasElement} */
    const canvas = document.createElement("canvas");

    canvas.style.backgroundColor = "black";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";

    document.body.appendChild(canvas);

    return canvas;

}) ();

const renderer = (function initializeRenderer() {

    const antialias = true;
    const precision = "highp";
    const premultipliedAlpha= true;
    const preserveDrawingDuffer = true;
    const powerPreference = "high-performance";
    const failIfMajorPerformanceCaveat = false;
    const depth = true;
    const logarithmicDepthBuffer = false;

    const renderer = new THREE.WebGLRenderer({ 
        antialias, 
        precision, 
        premultipliedAlpha, 
        canvas,
        preserveDrawingDuffer,
        powerPreference,
        failIfMajorPerformanceCaveat,
        depth,
        logarithmicDepthBuffer
    });

    return renderer;
}) ();

const camera = (function initializeCamera() {

    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 20;

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    return camera;

}) ();

/** @type {Font} */
const hackFont = await (function initializeHackFont() {
    const filename = "./Hack_Regular.json";
    return new Promise((resolve) => {
        const loader = new FontLoader();
        loader.load(filename, font => {
            resolve(font);
        });
    });
}) ();

const titilliumFont = await (function initializeTitilliumFont() {
    const filename = "./Titillium Web ExtraLight_Regular.json";
    return new Promise((resolve) => {
        const loader = new FontLoader();
        loader.load(filename, font => {
            resolve(font);
        });
    });
}) ();

const titilliumLightFont = await (function initializeTitilliumFont() {
    const filename = "./Titillium Web Light_Regular.json";
    return new Promise((resolve) => {
        const loader = new FontLoader();
        loader.load(filename, font => {
            resolve(font);
        });
    });
}) ();

const titilliumRegularFont = await (function initializeTitilliumFont() {
    const filename = "./Titillium Web_Regular.json";
    return new Promise((resolve) => {
        const loader = new FontLoader();
        loader.load(filename, font => {
            resolve(font);
        });
    });
}) ();

const interpolations = (function initializeInterpolations() {

    /** @param {number} x */
    function smoothstep(x) {
        return x * x * (3 - 2 * x);
    }

    /** @param {number} x */
    function easeOut(x) {
        return x * x * x;
    }

    /** @param {number} x */
    function easeIn(x) {
        return 1.0 - easeOut(1 - x);
    }

    return { smoothstep, easeIn, easeOut };

}) ();

/** @type {{[key: string]: THREE.Texture} & {[key: string]: { url: string } }} */
const images = await (async function initializeImages() {
    const filenames = [
        "./images/autoencoding_3d_scenes.png",
        "./images/rnn_unet.png",
        "./images/separable_kernels.png",
        "./images/wave_features.png",
        "./images/wire_together_fire_together.png"
    ];

    const links = [
        "https://gist.github.com/ccaven/9ab7ddee25de2df54e2532f0738a78ff",
        "https://gist.github.com/ccaven/f60555712fb00e2002736f31a35ff832",
        "https://gist.github.com/ccaven/eda2a120005c0c49ea769c28f0efd2a0",
        "https://gist.github.com/ccaven/2164aadf529ae4e2a9a51f65957ac7df",
        "https://gist.github.com/ccaven/0f2a36a0eab0b68ad0e21b5fbdacd6ea"
    ];

    const loader = new THREE.TextureLoader();

    const textures = await Promise.all(filenames.map(filename => {

        return new Promise(resolve => {

            loader.load(filename, texture => {
                resolve(texture);

            });

        });

    }));

    const textureDict = {};

    for (let i = 0; i < textures.length; i ++) {
        textureDict[filenames[i]] = textures[i];
        textureDict[filenames[i]].url = links[i];
    }

    return textureDict;
}) ();

const scene = (function initializeScene() {

    const scene = new THREE.Scene();

    scene.background = new THREE.Color("#080808");

    const interactionManager = new InteractionManager(
        renderer,
        camera,
        canvas
    );    
    
    const box = (function createBox() {

        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
        const material = new THREE.MeshLambertMaterial({color: 0xd4aa48});
        const box = new THREE.Mesh(geometry, material);

        box.rotateX(Math.PI * 0.35);
        box.rotateY(Math.PI * 0.15);

        // scene.add(box);

        return box;

    }) ();

    const stars = (function createStars() {

        const geometry = new THREE.IcosahedronGeometry(0.01, 1);

        // const geometry = new THREE.BoxGeometry(0.01, 0.01, 0.01);

        const geometryCount = 10_000;
        const material = new THREE.MeshLambertMaterial({ color: "#ffffff" })

        const instancedMesh = new THREE.InstancedMesh(geometry, material, geometryCount);

        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3();
        const rotation = new THREE.Euler();
        const scale = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();

        function randomMatrix() {

            position.x = Math.random() * 16 - 8;
			position.y = Math.random() * 16 - 8;
			position.z = Math.random() * 16 - 8;

			rotation.x = Math.random() * 2 * Math.PI;
			rotation.y = Math.random() * 2 * Math.PI;
			rotation.z = Math.random() * 2 * Math.PI;

			quaternion.setFromEuler( rotation );

			scale.x = scale.y = scale.z = 0.5 + ( Math.random() * 0.5 );

			return matrix.compose( position, quaternion, scale );
        }

        for (let i = 0; i < geometryCount; i ++) {
            instancedMesh.setMatrixAt(i, randomMatrix());
        }
        
        scene.add(instancedMesh);

        return instancedMesh;

    }) ();

    const hemisphereLight = (function createHemisphereLight() {

        const groundColor = "#eeca00";
        const skyColor = "#ff9dbe"
        const intensity = 5;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);

        scene.add(light);

        return light;

    }) ();

    function createText(text, color, args = {}) {
        const geometry = new TextGeometry(text, {
            font: titilliumRegularFont,
            size: 0.5,
            height: 0.1,
            ...args
        });

        geometry.center();

        const material = new THREE.MeshLambertMaterial({ color });

        const mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);

        return mesh;
    }

    const computerVision = (function createComputerVision() {
        // Link to Github gist
        const textures = [
            images["./images/autoencoding_3d_scenes.png"],
            images["./images/rnn_unet.png"],
            images["./images/separable_kernels.png"]
        ];

        const group = new THREE.Group();

        for (let i = 0; i < textures.length; i ++) {

            let texture = textures[i];

            const planeGeometry = new THREE.PlaneGeometry(
                texture.image.width * 0.01, 
                texture.image.height * 0.01
            );

            const material = new THREE.MeshBasicMaterial({ map: texture });

            const mesh = new THREE.Mesh(planeGeometry, material);

            mesh.scale.setX(8);
            mesh.scale.setY(1);

            mesh.position.setY(i);

            interactionManager.add(mesh);

            let meshScale = 1.0;
            let targetMeshScale = 1.0;
            mesh.addEventListener("mouseover", event => {
                targetMeshScale = 1.2;
            });
            mesh.addEventListener("mouseout", event => {
                targetMeshScale = 1.0;
            });
            mesh.addEventListener("click", event => {
                // Open link
                window.open(texture.url, "_blank").focus();
            });

            function updateMeshScale() {
                meshScale += (targetMeshScale - meshScale) / 10.0;
                mesh.scale.setScalar(meshScale);
                requestAnimationFrame(updateMeshScale);
            }
            
            requestAnimationFrame(updateMeshScale);

            group.add(mesh);

        }

        scene.add(group);

        const startPosition = new THREE.Vector3(0, -20, -5);
        const targetPosition = new THREE.Vector3(0, -3.5, 0);

        /** @param {number} localTime */
        function setPosition(localTime) {
            group.position.copy(startPosition).lerp(targetPosition, localTime);
        }

        return { group, setPosition };

    }) ();

    const humanVision = (function createHumanVision() {}) ();

    const computerLearning = (function createComputerVision() {
        // Link to Github gist
        const textures = [
            images["./images/wire_together_fire_together.png"],
            images["./images/wave_features.png"]
        ];

        const group = new THREE.Group();

        for (let i = 0; i < textures.length; i ++) {

            let texture = textures[i];

            const planeGeometry = new THREE.PlaneGeometry(
                texture.image.width * 0.01, 
                texture.image.height * 0.01
            );

            const material = new THREE.MeshBasicMaterial({ map: texture });

            const mesh = new THREE.Mesh(planeGeometry, material);

            mesh.scale.setX(8);
            mesh.scale.setY(1);

            mesh.position.setY(i);

            interactionManager.add(mesh);

            let meshScale = 1.0;
            let targetMeshScale = 1.0;
            mesh.addEventListener("mouseover", event => {
                targetMeshScale = 1.2;
            });
            mesh.addEventListener("mouseout", event => {
                targetMeshScale = 1.0;
            });
            mesh.addEventListener("click", event => {
                // Open link
                window.open(texture.url, "_blank").focus();
            });

            function updateMeshScale() {
                meshScale += (targetMeshScale - meshScale) / 10.0;
                mesh.scale.setScalar(meshScale);
                requestAnimationFrame(updateMeshScale);
            }
            
            requestAnimationFrame(updateMeshScale);

            group.add(mesh);

        }

        scene.add(group);

        const startPosition = new THREE.Vector3(0, -20, -5);
        const targetPosition = new THREE.Vector3(0, -2.5, 0);

        /** @param {number} localTime */
        function setPosition(localTime) {
            group.position.copy(startPosition).lerp(targetPosition, localTime);
        }

        return { group, setPosition };

    }) ();

    const humanLearning = (function createHumanLearning() {


        
    }) ();

    const perSceneObjects = [
        [],
        [computerVision],
        [],
        [computerLearning],
        [],
    ];

    const xacerstudio = createText("xacerstudio", "#ffffff", {
        font: titilliumLightFont,
        height: 0.05,
        size: 0.6
    });

    const vision = createText("vision", "#ffbbbb");
    vision.translateY(-1);
    vision.translateX(-2);
    vision.translateZ(0.5);

    const learning = createText("learning", "#bbffbb");
    learning.translateY(1);
    learning.translateX(2);
    learning.translateZ(0.5);
    
    const computer = createText("computer", "#bbbbff");
    computer.translateY(2);
    computer.translateX(-1);
    computer.translateZ(-0.5);

    const human = createText("human", "#ffffbb");
    human.translateY(-2);
    human.translateX(1);
    human.translateZ(-0.5);

    const texts = [
        vision, learning, computer, human, xacerstudio
    ];

    const combos = [
        [2, 0], // computer vision
        [3, 0], // human vision
        [2, 1], // computer learning
        [3, 1],  // human learning
    ];

    const targetPositions = (function initializeTargetPositions() {

        // First is home position

        /** @type {THREE.Vector3[][]} */
        let positions = [];

        positions.push([
            vision.position.clone(),
            learning.position.clone(),
            computer.position.clone(),
            human.position.clone(),
            xacerstudio.position.clone()
        ]);

        vision.position.multiplyScalar(5)

        for (let i = 0; i < combos.length; i ++) {

            // Add the in-between position
            positions.push(positions[0].map((p, j) => {
                if (j == 4) {
                    return new THREE.Vector3(
                        (Math.random() - 0.5) * 4,
                        (Math.random() - 0.5) * 4,
                        (Math.random() - 0.5) * 4
                    );
                }
                return p.clone().multiplyScalar(10);
            }));

            // Add the new positions
            positions.push(positions[0].map((p, j) => {
                let ci = combos[i].indexOf(j)
                let zcoords = [-0.5, 0, 0.5, 0];
                if (j == 4) {
                    return p.clone().setZ(zcoords[(2 + i) % 3]);
                }
                if (ci >= 0) {

                    return new THREE.Vector3(
                        -1+ci*2, -ci*0.5, zcoords[(ci + i) % 3]
                    );
                } else {
                    return p.clone().multiplyScalar(10);
                }
            }));

        }

        return positions;

    }) ();

    let currentState = 0;
    let targetCurrentState = 0;

    function setPositions() {
        // Interpolate between floor(currentState) and ceil(currentState)
        if (currentState % 1 == 0) {
            let sceneIdx = Math.floor(currentState / 2);

            perSceneObjects.forEach((objs, i) => {
                if (i == sceneIdx) {
                    objs.forEach(o => o.setPosition(1));
                } else {
                    objs.forEach(o => o.setPosition(0));
                }
            });

            texts.forEach((obj, i) => {
                obj.position.copy(targetPositions[currentState][i]);
            });
        } else {
            let a = Math.floor(currentState);
            let b = Math.ceil(currentState);
            
            perSceneObjects.forEach((objs, i) => {
                let localTime = 1.0 - Math.min(Math.abs(currentState / 2 - i), 1.0);
                objs.forEach(o => o.setPosition(localTime));
            });

            texts.forEach((obj, i) => {
                let k = currentState - a;
                if (i == 4) {
                    k = interpolations.smoothstep(k);
                } else {
                    if (b % 2 == 0) {
                        k = interpolations.easeIn(k);
                    } else {
                        k = interpolations.easeOut(k);
                    }
                }

                obj.position.set(
                    targetPositions[a][i].x * (1 - k) + targetPositions[b][i].x * k,
                    targetPositions[a][i].y * (1 - k) + targetPositions[b][i].y * k,
                    targetPositions[a][i].z * (1 - k) + targetPositions[b][i].z * k
                );
            });
        }

        if (currentState > 0) {
            let k = Math.min(currentState, 1);

            xacerstudio.position.setY(k);
        }
    }

    setPositions();

    /** @param {(current: number) => number} updater */
    function updateCurrentState(updater) {
        targetCurrentState = updater(targetCurrentState);
        targetCurrentState = Math.max(targetCurrentState, 0);
        targetCurrentState = Math.min(targetCurrentState, targetPositions.length - 1);
        setPositions();
    }

    function correctionLoop() {
        currentState += (targetCurrentState - currentState) / 10;
        if (Math.abs(currentState - targetCurrentState) < 0.001) {
            currentState = targetCurrentState;
        }
        setPositions();
        requestAnimationFrame(correctionLoop);
    }

    requestAnimationFrame(correctionLoop);

    return { scene, box, updateCurrentState, updateInteractionManager: interactionManager.update };

}) ();

const animation = (function initializeAnimationLoop() {

    function resizeCanvasAndCamera() {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        return needResize;
    }

    camera.translateZ(8);

    let timeSinceWheel = 0;
    canvas.addEventListener("wheel", (event) => {
        scene.updateCurrentState(c => c + event.deltaY / 500.0);
        timeSinceWheel = 0;
    });

    function applyWheelCorrection(dt) {
        timeSinceWheel += dt;
        let threshold = 0.2;
        if (timeSinceWheel > threshold) {
            let speed = Math.min(timeSinceWheel - threshold, threshold) * 0.1;
            scene.updateCurrentState(c => {
                let target = Math.round(c*0.5)*2;
                let delta = target - c;
                if (Math.abs(delta) < speed) return target;
                if (delta > 0) return c + speed;
                return c - speed;
            });
        }
    }

    let then = performance.now();

    let mouseYawOffset = 0;
    let mousePitchOffset = 0;
    let mouseAngleMultiplier = 0.2;
    canvas.addEventListener("mousemove", event => {
        mouseYawOffset = (event.pageX - canvas.width / 2) / canvas.width * mouseAngleMultiplier;
        mousePitchOffset = (event.pageY - canvas.height / 2) / canvas.width * mouseAngleMultiplier;
    });

    
    const updateCamera = (function createCameraUpdater() {
        // Run an infinity pattern so the background stars are always moving
        // but the camera never wraps around the text

        let cameraTime = 0;
        let cameraPosition = new THREE.Vector3();
        
        const cameraFrequency = 0.05;
        const cameraYawAmplitude = 0.2;
        const cameraPitchAmplitude = 0.05;

        function updateCamera(dt) {
            let yaw = Math.sin(cameraTime * cameraFrequency) * cameraYawAmplitude + mouseYawOffset;
            let pitch = Math.sin(cameraTime * cameraFrequency * 2) * cameraPitchAmplitude + mousePitchOffset;

            cameraPosition.set(0, 0, 8);
            cameraPosition.applyEuler(new THREE.Euler(pitch, yaw, 0));

            camera.position.copy(cameraPosition);
            camera.lookAt(0, 0, 0);

            cameraTime += dt;
        }

        return updateCamera;
    }) ();

    function loop() {
        let now = performance.now();
        let dt = (now - then) * 0.001;
        then = now;

        if (resizeCanvasAndCamera()) console.log("Resized canvas.");

        applyWheelCorrection(dt);

        updateCamera(dt);

        renderer.render(scene.scene, camera);

        scene.updateInteractionManager();

        requestAnimationFrame(loop);

    };

    return { loop };

}) ();

if (run) {
    requestAnimationFrame(animation.loop);
}

