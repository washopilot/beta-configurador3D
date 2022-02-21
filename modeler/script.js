var theModel;

const MODEL_PATH = './modeler/modelo.gltf';

// const TRAY_1 = document.getElementById('tray-slide');

const colors = [
  { color: '000000' },
  { color: '0000FF' },
  { color: '808080' },
  { color: '008000' },
  { color: '800080' },
  { color: 'FF0000' },
  { color: 'FFFFFF' },
];

const BACKGROUND_COLOR = 0xf1f1f1;
// Init the scene
const scene = new THREE.Scene();
// Set background
scene.background = new THREE.Color(BACKGROUND_COLOR);
scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);

var container = document.querySelector('#c');

// Init the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.shadowMap.enabled = true;
// renderer.setPixelRatio(window.devicePixelRatio);

var cameraFar = 3;

container.appendChild(renderer.domElement);

// Add a camera
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = cameraFar;
camera.position.x = 4;
camera.position.y = 10;

// Initial material
const INITIAL_MTL = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 10 });

const INITIAL_MAP = [
  { childID: 'bandejas', mtl: INITIAL_MTL },
  { childID: 'fondos', mtl: INITIAL_MTL },
  { childID: 'parantes', mtl: INITIAL_MTL },
];

// Init the object loader
var loader = new THREE.GLTFLoader();
THREE.DRACOLoader.setDecoderPath('./modeler/draco/gltf/');
loader.setDRACOLoader(new THREE.DRACOLoader());

loader.load(
  MODEL_PATH,
  function (gltf) {
    theModel = gltf.scene;

    theModel.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });

    // Set the models initial scale
    theModel.scale.set(0.1, 0.1, 0.1);
    // theModel.rotation.y = Math.PI;

    // Offset the y position a bit
    theModel.position.y = -1;

    // Set initial textures
    for (let object of INITIAL_MAP) {
      initColor(theModel, object.childID, object.mtl);
    }

    // Add the model to the scene
    scene.add(theModel);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Function - Add the textures to the models
function initColor(parent, type, mtl) {
  // console.log(parent, type, mtl);

  parent.traverse((o) => {
    if (o.isMesh) {
      if (o.name.includes(type)) {
        o.material = mtl;
        o.nameID = type; // Set a new property to identify this object
      }
    }
  });
}

// Add lights
var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.51);
hemiLight.position.set(0, 50, 0);
// Add hemisphere light to scene
scene.add(hemiLight);

var dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
dirLight.position.set(8, 12, 8);
// dirLight.castShadow = true;
// dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
// Add directional Light to scene
scene.add(dirLight);
// const helper = new THREE.DirectionalLightHelper( dirLight, 5 );
// scene.add( helper );

const pointLight = new THREE.PointLight(0xffffff, 0.3, 200);
pointLight.position.set(20, 5, 0);
scene.add(pointLight);
// const sphereSize = 1;
// const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
// scene.add( pointLightHelper );

// const ambientLight = new THREE.AmbientLight(0x202020); // soft white light
// scene.add(ambientLight);

// Floor
var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
var floorMaterial = new THREE.MeshPhongMaterial({
  color: 0xdddddd,
  shininess: 0,
});
var grid = new THREE.GridHelper(5000, 1000, 0x000000, 0x000000);
grid.material.opacity = 0.2;
grid.material.transparent = true;

var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -0.5 * Math.PI;
floor.receiveShadow = true;
floor.position.y = -1;
scene.add(floor);

grid.position.y = -1;
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add(grid);

// Add controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 3;
controls.enableDamping = true;
controls.enablePan = true;
controls.dampingFactor = 0.1;
controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
controls.autoRotateSpeed = 0.2; // 30

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);

  // renderer.setSize($(container).width(), $(container).height());
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
}

animate();

// Function - New resizing method
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  var width = container.offsetWidth;
  var height = container.offsetHeight;
  var canvasPixelWidth = canvas.width / window.devicePixelRatio;
  var canvasPixelHeight = canvas.height / window.devicePixelRatio;
  const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

// Function - Build Colors
function buildColors(colors, tray) {
  for (let [i, color] of colors.entries()) {
    // console.log(i, color);
    let swatch1 = document.createElement('input');
    swatch1.setAttribute('type', 'radio');
    swatch1.setAttribute('name', tray);
    swatch1.setAttribute('id', tray + i);
    swatch1.setAttribute('value', color.color);

    let swatch2 = document.createElement('label');
    swatch2.setAttribute('for', tray + i);

    let span = document.createElement('span');
    // span.classList.add(color.name);
    span.style.background = '#' + color.color;

    swatch2.append(span);

    // swatch.classList.add('tray__swatch');
    // swatch.style.background = '#' + color.color;

    // if (color.texture) {
    //   swatch.style.backgroundImage = 'url(' + color.texture + ')';
    // } else {
    //   swatch.style.background = '#' + color.color;
    // }

    // swatch.setAttribute('data-key', i);
    // console.log(swatch1);
    // console.log(TRAY);
    let tray_element = document.getElementById(tray);
    // console.log(tray_element);
    tray_element.append(swatch1);
    tray_element.append(swatch2);
  }
}

buildColors(colors, 'bandejas');
buildColors(colors, 'fondos');
buildColors(colors, 'parantes');

// Escuchas de seleccianamiento j-query
$(document).ready(function () {
  $('input[type=radio]').click(function () {
    // console.log(this.value, this.name);
    selectSwatch(this.value, this.name);
  });
});

// Funcion de seleccion de color
function selectSwatch(color, activeOption) {
  let new_mtl;
  new_mtl = new THREE.MeshPhongMaterial({
    color: parseInt('0x' + color),
  });
  setMaterial(theModel, activeOption, new_mtl);
}

// Funcion de actualizador de material
function setMaterial(parent, type, mtl) {
  parent.traverse((o) => {
    if (o.isMesh && o.nameID != null) {
      if (o.nameID == type) {
        o.material = mtl;
      }
    }
  });
}
