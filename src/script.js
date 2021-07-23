import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as dat from 'dat.gui'
import * as Stats from 'stats.js'
import { gsap } from 'gsap'





/**
 * Base
 */

//constants 
let xSlider = null
let ySlider = null
let zSlider = null

let xHolder = null
let yHolder = null
let zHolder = null

let coordsMap = []

let GanGo = false
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//scene

const scene = new THREE.Scene()

//Screen pos
const containmentUnit = document.getElementById('container')



/**
 * loaders
 */
//loading bar/loading manager

//const loadingBarElement = document.querySelector('.loading-bar')

let sceneReady = false
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () =>
    {
        // Wait a little
        window.setTimeout(() =>
        {
            // Animate overlay
            //gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

            // Update loadingBarElement
            //loadingBarElement.classList.add('ended')
            //loadingBarElement.style.transform = ''
            //scene.remove(overlay)
        }, 500)

        window.setTimeout(() =>
        {
            sceneReady = true
        }, 2000)
    },

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) =>
    {
        // Calculate the progress and update the loadingBarElement
        //const progressRatio = itemsLoaded / itemsTotal
        //loadingBarElement.style.transform = `scaleX(${progressRatio})`
    }
)

const gltfLoader = new GLTFLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)
const textureLoader = new THREE.TextureLoader(loadingManager)

/**
 * debug
 */
// Debug
let keyControl = false
const gui = new dat.GUI()
const debugObject = {
    keyControl: false
}



/**
 * cameras
 */
const cam0 = new THREE.PerspectiveCamera(30, 3/2, 0.1, 2000)
cam0.position.set(-6,6,-6)
cam0.lookAt(1,0,1)
scene.add(cam0)


const cam1 = new THREE.OrthographicCamera(-4,4,4,-4, 0.1, 13)
cam1.position.set(2.5,2.5,2.5)
cam1.rotation.x = -Math.PI/2
cam1.rotation.z = Math.PI



const cam2 = new THREE.OrthographicCamera(-4,4,4,-4, 0.1, 10)
cam2.position.set(2.5,-3,-2.5)
cam2.rotation.y = Math.PI



const cam3 = new THREE.OrthographicCamera(-4,4,4,-4, 0.1, 10)
cam3.rotation.y = -Math.PI/2
cam3.position.set(-2.5,-3,2.5)



const cam4 = new THREE.OrthographicCamera(-6,6,6,-6, 0.1, 20)
cam4.position.set(-4,3,-4)
cam4.lookAt(0,-1,0)



scene.add(cam1)

//const cam1fold = gui.addFolder('cam1fold')
//cam1fold.add(cam1.rotation, 'x').min(-Math.PI).max(Math.PI).step(Math.PI/2)
//cam1fold.add(cam1.position, 'x').min(-10).max(10).step(0.1)
//cam1fold.add(cam1.position, 'y').min(-10).max(10).step(0.1)
//cam1fold.add(cam1.position, 'z').min(-10).max(10).step(0.1)

scene.add(cam2)

//const cam2fold = gui.addFolder('cam2fold')
//cam2fold.add(cam2.rotation, 'y').min(-Math.PI).max(Math.PI).step(Math.PI/2)
//cam2fold.add(cam2.position, 'x').min(-10).max(10).step(0.1)
//cam2fold.add(cam2.position, 'y').min(-10).max(10).step(0.1)
//cam2fold.add(cam2.position, 'z').min(-10).max(10).step(0.1)

scene.add(cam3)

//const cam3fold = gui.addFolder('cam3fold')
//cam3fold.add(cam3.rotation, 'y').min(-Math.PI).max(Math.PI).step(Math.PI/2)
//cam3fold.add(cam3.position, 'x').min(-10).max(10).step(0.1)
//cam3fold.add(cam3.position, 'y').min(-10).max(10).step(0.1)
//cam3fold.add(cam3.position, 'z').min(-10).max(10).step(0.1)

scene.add(cam4)

//const cam4fold = gui.addFolder('cam4fold')
//cam4fold.add(cam4.rotation, 'y').min(-Math.PI).max(Math.PI).step(Math.PI/2)
//cam4fold.add(cam4.position, 'x').min(-10).max(10).step(0.1)
//cam4fold.add(cam4.position, 'y').min(-10).max(10).step(0.1)
//cam4fold.add(cam4.position, 'z').min(-10).max(10).step(0.1)

const helper1 = new THREE.CameraHelper(cam1)
const helper2 = new THREE.CameraHelper(cam2)
const helper3 = new THREE.CameraHelper(cam3)
const helper4 = new THREE.CameraHelper(cam4)

//scene.add(helper1)
//scene.add(helper2)
//scene.add(helper3)
//scene.add(helper4)

const cams = [
    cam0,
    cam1,
    cam2,
    cam3,
    cam4
]


/**
 * misc
 */


// Stats
const statistacs = new Stats()
statistacs.showPanel(0)
document.body.appendChild( statistacs.dom )

//const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
//const overlayMaterial = new THREE.ShaderMaterial(
//    {
//    //wireframe: true,
//    transparent: true,
//    uniforms:
//    {
//        uAlpha: { value: 1 }
//    },
//    vertexShader: `
//        void main()
//        {
//            gl_Position = vec4(position, 1.0);
//        }
//    `,
//    fragmentShader: `
//        uniform float uAlpha;
//
//        void main()
//        {
//            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
//        }
//    `
//
//})
//const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
//scene.add(overlay)
//


/**
 * Update Materials
 */

const updateAllMaterials = () =>
{
    //scene.background = scene.environment
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * textures
 */
const dotTexture = textureLoader.load('/textures/Standard-Cube-Map(2)/dot/1.png')
const pointTexture = textureLoader.load('/textures/Standard-Cube-Map(2)/dot/9.png')

/**
 * Environment Map
 */

 const environmentMap = cubeTextureLoader.load([
    '/textures/Standard-Cube-Map(2)/px.png',
    '/textures/Standard-Cube-Map(2)/nx.png',
    '/textures/Standard-Cube-Map(2)/py.png',
    '/textures/Standard-Cube-Map(2)/ny.png',
    '/textures/Standard-Cube-Map(2)/pz.png',
    '/textures/Standard-Cube-Map(2)/nz.png',
])

//scene.background = environmentMap
//scene.environment = environmentMap
//debugObject.envMapIntensity = 2
//gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)
//environmentMap.encoding = THREE.sRGBEncoding

/**
 * Objects
 */

//cursor 
let location = [0,0,0]
const pointMat = new THREE.PointsMaterial()
pointMat.color = new THREE.Color('red')
pointMat.size = 2
pointMat.sizeAttenuation = true
pointMat.transparent = true
pointMat.alphaMap = pointTexture
pointMat.depthWrite = false
pointMat.blending = THREE.AdditiveBlending
const pointGeo = new THREE.BufferGeometry()
pointGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( location, 3 ) )
const gripPoint = new THREE.Points(pointGeo,pointMat)
scene.add(gripPoint)
console.log(gripPoint.position)


const minimum = new THREE.Vector3(0.75, -6.58, -0.376)
const maximum = new THREE.Vector3(5.46, -4.575, 4.66)

gripPoint.position.clamp(minimum, maximum)

gripPoint.position.x = 5.46
gripPoint.position.y = -4.575
gripPoint.position.z = -0.376

//gripPointPos.add(gripPoint.position, 'x').max(10).min(-10).step(0.01)
//gripPointPos.add(gripPoint.position, 'y').max(10).min(-10).step(0.01)
//gripPointPos.add(gripPoint.position, 'z').max(10).min(-10).step(0.01)


//location points* geometry is initialized in controls
const maxPoints = 500

const locGeo = new THREE.BufferGeometry()
const pointsMap = new Float32Array(maxPoints*3)
locGeo.setAttribute('position', new THREE.BufferAttribute( pointsMap , 3))

locGeo.setDrawRange(0, coordsMap.length)

const locMatt = new THREE.PointsMaterial()
locMatt.size = 0.5
locMatt.sizeAttenuation = true
locMatt.color = new THREE.Color('yellow')
locMatt.transparent = true
locMatt.alphaMap = dotTexture
locMatt.depthWrite = false
locMatt.blending = THREE.AdditiveBlending

const locPoints = new THREE.Points(locGeo,locMatt)

scene.add(locPoints)

const updateLocGeo = () =>
{
    locGeo.setDrawRange(0, coordsMap.length)

    for(let n in coordsMap)
    {
        locGeo.attributes.position.array[n * 3    ] = coordsMap[n].x + 0.082
        locGeo.attributes.position.array[n * 3 + 1] = coordsMap[n].y - 3.6
        locGeo.attributes.position.array[n * 3 + 2] = coordsMap[n].z - 0.251
    }
    locGeo.attributes.position.needsUpdate = true
}

updateLocGeo()

const sliderx = gui.addFolder('slider x')
const holderx = gui.addFolder('holder x')
const slidery = gui.addFolder('slider y')
const holdery = gui.addFolder('holder y')
const sliderz = gui.addFolder('slider z')
const holderz = gui.addFolder('holder z')

gltfLoader.load(
    'models/allpieces/x/holder/holders.gltf',
    (gltf) => 
    {
        const object = gltf.scene.children[0].children[0].children[0]
        xHolder = object
        let geom = []
        for(let child in object.children)
        {
            geom.push(object.children[child].children[0].geometry)
        }
        
        geom.splice(32,2)
        const BigObject = BufferGeometryUtils.mergeBufferGeometries(geom)
        object.geometry = BigObject
        scene.add(object)
        object.scale.set(10,10,10)
        object.rotation.x = Math.PI
        holderx.add(xHolder.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotation')
        holderx.add(xHolder.position, 'y').min(0).max(5).step(0.001).name('y')
        holderx.add(xHolder.position, 'x').min(0).max(5).step(0.001).name('x')
        holderx.add(xHolder.position, 'z').min(0).max(5).step(0.001).name('z')
        
        updateAllMaterials()
        renderAllScreens()
    }
)

gltfLoader.load(
    'models/allpieces/x/slider/sliders.gltf',
    (gltf) => 
    {
        const object = gltf.scene.children[0].children[0].children[0]
        xSlider = object
        let geom = []
        for(let child in object.children)
        {
            geom.push(object.children[child].children[0].geometry)
        }
        geom.splice(55,1)
        
        const BigObject = BufferGeometryUtils.mergeBufferGeometries(geom)
        object.geometry = BigObject
        scene.add(object)
        object.scale.set(10,10,10)
        object.rotation.x = Math.PI
        sliderx.add(xSlider.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotation')
        sliderx.add(xSlider.position, 'y').min(0).max(5).step(0.001).name('y')
        sliderx.add(xSlider.position, 'x').min(0).max(5).step(0.001).name('x')
        sliderx.add(xSlider.position, 'z').min(0).max(5).step(0.001).name('z')
        
        updateAllMaterials()
        renderAllScreens()
    }
)

gltfLoader.load(
    'models/allpieces/y/holder/holder.gltf',
    (gltf) => 
    {
        const object = gltf.scene.children[0].children[0].children[0]
        yHolder = object
        let geom = []
        for(let child in object.children)
        {
            geom.push(object.children[child].children[0].geometry)
        }
        
        const BigObject = BufferGeometryUtils.mergeBufferGeometries(geom)
        object.geometry = BigObject
        scene.add(object)
        object.scale.set(10,10,10)
        object.rotation.x = Math.PI
        holdery.add(yHolder.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotation')
        holdery.add(yHolder.position, 'y').min(0).max(5).step(0.001).name('y')
        holdery.add(yHolder.position, 'x').min(0).max(5).step(0.001).name('x')
        holdery.add(yHolder.position, 'z').min(0).max(5).step(0.001).name('z')



        updateAllMaterials()
        renderAllScreens()
    }
)

gltfLoader.load(
    'models/allpieces/y/slider/slider.gltf',
    (gltf) => 
    {
        const object = gltf.scene.children[0].children[0].children[0]
        ySlider = object
        let geom = []
        for(let child in object.children)
        {
            geom.push(object.children[child].children[0].geometry)
        }
        
        const BigObject = BufferGeometryUtils.mergeBufferGeometries(geom)
        object.geometry = BigObject
        scene.add(object)
        object.scale.set(10,10,10)
        object.rotation.x = Math.PI
        slidery.add(ySlider.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotation')
        slidery.add(ySlider.position, 'y').min(0).max(5).step(0.001).name('y')
        slidery.add(ySlider.position, 'x').min(0).max(5).step(0.001).name('x')
        slidery.add(ySlider.position, 'z').min(0).max(5).step(0.001).name('z')

        updateAllMaterials()
        renderAllScreens()
    }
)

gltfLoader.load(
    'models/allpieces/z/holder/zHolderWoBrace.gltf',
    (gltf) => 
    {
        const object = gltf.scene.children[0].children[0].children[0]
        zHolder = object
        let geom = []
        for(let child in object.children)
        {
            geom.push(object.children[child].children[0].geometry)
        }
        
        const BigObject = BufferGeometryUtils.mergeBufferGeometries(geom)
        object.geometry = BigObject
        scene.add(object)
        object.scale.set(10,10,10)
        object.position.x = 2.5775*2
        object.position.y = -0.5*2
        object.position.z = -0.0775*2



        object.rotation.x = -Math.PI/2
        object.rotation.y = Math.PI

        holderz.add(zHolder.rotation, 'z').min(- Math.PI).max(Math.PI).step(0.001).name('rotation')
        holderz.add(zHolder.position, 'y').min(-1).max(-0.1).step(0.0001).name('y')
        holderz.add(zHolder.position, 'x').min(2.4).max(2.6).step(0.0001).name('x')
        holderz.add(zHolder.position, 'z').min(-0.1).max(0.1).step(0.0001).name('oz')

        updateAllMaterials()
        renderAllScreens()
    }
)

gltfLoader.load(
    'models/allpieces/z/slider/pokingbit.gltf',
    (gltf) => 
    {
        const object = gltf.scene.children[0].children[0].children[0]
        zSlider = object
        
        let geom = []
        for(let child in object.children)
        {
            geom.push(object.children[child].children[0].geometry)
        }
        
        const BigObject = BufferGeometryUtils.mergeBufferGeometries(geom)
        object.geometry = BigObject
        scene.add(object)
        object.scale.set(10,10,10)

        object.rotation.y = Math.PI/2
    
        object.position.x = 2.6875*2
        object.position.y = -0.493*2
        object.position.z = -0.0755*2

        sliderz.add(zSlider.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotation')
        sliderz.add(zSlider.rotation, 'x').min(- Math.PI).max(Math.PI).step(0.001).name('rotation')
        sliderz.add(zSlider.position, 'y').min(-1.5).max(-1.4).step(0.0001).name('y')
        sliderz.add(zSlider.position, 'x').min(2.65).max(2.7).step(0.0001).name('x')
        sliderz.add(zSlider.position, 'z').min(-0.1).max(-0.05).step(0.0001).name('poke z')

        console.log(BigObject)
        updateAllMaterials()
        renderAllScreens()
    }
)


/**
 * movement
 */

const clock = new THREE.Clock

//keyboard controller
let keyPressed = {}



gui.add(debugObject, 'keyControl').listen()

const moveX = (distance) =>
{
    zSlider.position.y += distance
}

const moveY = (distance) =>
{
    ySlider.position.x += distance
    zSlider.position.x += distance
    zHolder.position.x += distance
}

const moveZ = (distance) =>
{
    xSlider.position.z += distance
    ySlider.position.z += distance
    zSlider.position.z += distance
    zHolder.position.z += distance
    yHolder.position.z += distance
}

const moveArm = (xdist,ydist,zdist) =>
{
    moveX(xdist)
    moveY(ydist)
    moveZ(zdist)
}

const boogie = (keyPressedArray) =>
{    
    const tpassed = clock.getDelta()
    
    if ((keyPressedArray['q'] || keyPressedArray[',']) && (-0.493*2 > zSlider.position.y))
    {
        moveY(2 * tpassed) 
    }
    if ((keyPressedArray['e'] || keyPressedArray['.']) && (-1.493*2 < zSlider.position.y))
    {
        moveY(-2 * tpassed)
    }
    if ((keyPressedArray['d'] || keyPressedArray['ArrowRight']) && (-2.356*2 < ySlider.position.x))
    {
        moveX(-2 * tpassed)
    }
    if ((keyPressedArray['a'] || keyPressedArray['ArrowLeft']) && (0 > ySlider.position.x))
    {
        moveX(2 * tpassed)
    }
    if ((keyPressedArray['s'] || keyPressedArray['ArrowUp']) && (0 < xSlider.position.z))
    {
        moveZ(-2 * tpassed)
    }
    if ((keyPressedArray['w'] || keyPressedArray['ArrowDown']) && (2.5*2 > xSlider.position.z))
    {
        moveZ(2 * tpassed)
    }
}



const boogieCon = (keyPressedArray) =>
{
    const tpassed = clock.getDelta()+0.1

    if ((keyPressedArray['q'] || keyPressedArray[',']) && gripPoint.position.y < -4.575)
    {
        gripPoint.position.y += 2 * tpassed
    }
    if ((keyPressedArray['e'] || keyPressedArray['.']) && gripPoint.position.y > -6.58)
    {
        gripPoint.position.y -= 2 * tpassed
    }
    if ((keyPressedArray['d'] || keyPressedArray['ArrowRight']) && gripPoint.position.x > 0.75)
    {
        gripPoint.position.x -= 2 * tpassed
    }
    if ((keyPressedArray['a'] || keyPressedArray['ArrowLeft']) && gripPoint.position.x < 5.46)
    {
        gripPoint.position.x += 2 * tpassed
    }
    if ((keyPressedArray['s'] || keyPressedArray['ArrowDown']) && gripPoint.position.z > -0.376)
    {
        gripPoint.position.z -= 2 * tpassed
    }
    if ((keyPressedArray['w'] || keyPressedArray['ArrowUp']) && gripPoint.position.z < 4.66)
    {
        gripPoint.position.z += 2 * tpassed
    }
    if (keyPressedArray['p'])
    {
        const posit = new THREE.Vector3(gripPoint.position.x - 0.082, gripPoint.position.y + 3.6, gripPoint.position.z + 0.251)

        coordsMap.push(posit)

        console.log(coordsMap)
    
        updateLocGeo()
        console.log(coordsMap)
        console.log(gripPoint.position)
       
    }
    if (keyPressedArray['i'])
    {
        console.log(zSlider.geometry)
    }
    if (keyPressedArray['r'])
    {
        console.log(coordsMap)
        
        clock.start()

        GanGo = true
    }
}


window.addEventListener('keydown', (press) => 
{
    
    if (keyControl)
    {
        keyPressed[press.key] = true
        boogie(keyPressed)
        
    }
    else
    {
        keyPressed[press.key] = true
        boogieCon(keyPressed)
        
    }
    renderAllScreens()
})

window.addEventListener('keyup', (press) => 
{
    if (keyControl)
    {
        keyPressed[press.key] = false
        boogie(keyPressed)
        
    }
    else
    {
        keyPressed[press.key] = false
        //boogieCon(keyPressed)
    }
    renderAllScreens()
})

/**
 * Lights
 */

const directionalLight1 = new THREE.DirectionalLight('#ffffff', 3)
directionalLight1.position.set(-2.5,2,2.5)
directionalLight1.castShadow = true
directionalLight1.shadow.camera.far = 15
directionalLight1.shadow.mapSize.set(1024,1024)
directionalLight1.shadow.normalBias = 0.05
scene.add(directionalLight1)
const directionalLight2 = new THREE.DirectionalLight('#ffffff', 3)
directionalLight2.position.set(2.5,2,-2.5)
directionalLight2.castShadow = true
directionalLight2.shadow.camera.far = 15
directionalLight2.shadow.mapSize.set(1024,1024)
directionalLight2.shadow.normalBias = 0.05
scene.add(directionalLight2)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    antialias: true
})

renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true 
renderer.shadowMap.type = THREE.PCFSoftShadowMap
//renderer.toneMapping = THREE.ReinhardToneMapping
//renderer.toneMappingExposure = 3

//gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

/**
 * Animate function for gantry and rendering for screens 
 */

const canvas0 = document.getElementById('canvas0')
const canvas1 = document.getElementById('canvas1')
const canvas2 = document.getElementById('canvas2')
const canvas3 = document.getElementById('canvas3')
const canvas4 = document.getElementById('canvas4')

const view = [
    canvas0,
    canvas1,
    canvas2,
    canvas3,
    canvas4,
]

const con0 = canvas0.getContext('2d')
const con1 = canvas1.getContext('2d')
const con2 = canvas2.getContext('2d')
const con3 = canvas3.getContext('2d')
const con4 = canvas4.getContext('2d')

const contexts = [
    con0,
    con1,
    con2,
    con3,
    con4
]


for (let i in view)
{
    const canvas = view[i]
    const rect = canvas.getBoundingClientRect()
    const viewHeight = rect.height
    const viewWidth = rect.width

    canvas.width = viewWidth
    canvas.height = viewHeight 
}

const renderAllScreens = () =>
{
    for(let vis in view)
    {
        const context =  contexts[vis] 
        const canvas = view[vis]
        const camera = cams[vis]
        const viewWidth = canvas.width
        const viewHeight = canvas.height

        renderer.setSize(viewWidth, viewHeight, true)

        renderer.render(scene, camera)

        
        context.drawImage(renderer.domElement, 0, 0)
    }
}
renderAllScreens()
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    for (let i in view)
    {
        const canvas = view[i]
        const rect = canvas.getBoundingClientRect()
        const viewHeight = rect.height
        const viewWidth = rect.width

        canvas.width = viewWidth
        canvas.height = viewHeight
    }
    renderAllScreens()
})

const followzSlide = () =>
{
    zHolder.position.x = zSlider.position.x - 0.22
    ySlider.position.x = zSlider.position.x - 2.6875*2
    //relative to poker holder
    zHolder.position.z = zSlider.position.z - 0.004
    ySlider.position.z = zHolder.position.z + 0.0775*2
    yHolder.position.z = ySlider.position.z
    xSlider.position.z = yHolder.position.z
}

/**
 * Animate
 */

const tick = () =>
{
    //stats begin
    statistacs.begin()
    clock.getElapsedTime()

    // render all Screens and move gantry
    if(GanGo == true && zSlider != null)
    {
        zSlider.position.lerp(coordsMap[0], clock.getElapsedTime()/5)
        
        followzSlide()
        
        renderAllScreens()

        console.log('spoon1')

        if(zSlider.position.distanceTo(coordsMap[0]) > 0 && zSlider.position.distanceTo(coordsMap[0]) < 0.005 )
        {
            zSlider.position.copy(coordsMap[0])
            followzSlide()

            console.log(coordsMap[0])

            coordsMap.shift()

            updateLocGeo()

            console.log('spoon2')

            console.log(coordsMap[0])

            renderAllScreens()
            
            clock.start()
        }
        if(coordsMap.length == 0)
        {
            GanGo = false
        }
    }

    //stats end
    statistacs.end()
    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
    
}

tick()