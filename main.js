/*  xacerstudio

Plan: Stick with our strengths

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

import { OrbitControls } from './src/OrbitControls.js';
import { TextGeometry } from './src/TextGeometry.js';
import { FontLoader, Font } from './src/FontLoader.js';

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

const scene = (function initializeScene() {

    const scene = new THREE.Scene();

    scene.background = new THREE.Color("#080808");
    
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

    const xacerstudio = createText("xacerstudio", "#ffffff", {
        font: titilliumLightFont,
        height: 0.05
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
        [3, 1],  // human learning
        [2, 1], // computer learning
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
            texts.forEach((obj, i) => {
                obj.position.copy(targetPositions[currentState][i]);
            });
        } else {
            let a = Math.floor(currentState);
            let b = Math.ceil(currentState);
            

            

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
        setPositions();
        requestAnimationFrame(correctionLoop);
    }

    requestAnimationFrame(correctionLoop);

    return { scene, box, updateCurrentState };

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

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.1;
    controls.enableZoom = false;

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

    function loop() {
        let now = performance.now();
        let dt = (now - then) * 0.001;
        then = now;

        if (resizeCanvasAndCamera()) console.log("Resized canvas.");

        applyWheelCorrection(dt);

        controls.update();        

        renderer.render(scene.scene, camera);

        requestAnimationFrame(loop);

    };

    return { loop };

}) ();

if (run) {
    requestAnimationFrame(animation.loop);
}

