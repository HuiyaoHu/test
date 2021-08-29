// View website by typing in PS C:\Users\huiya\Desktop\3jsProject\threejs-webpack-starter> npm run dev

import './style.css'
import * as THREE from 'three'          // Import the entire three.js core library
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'          // control panel GUI

// TextureLoader
const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load('/textures/NormalMap.png')          // Normal map gives 3D texture to geometry

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects (body)
const geometry = new THREE.SphereGeometry(0.5, 64, 64)

// Materials (clothing)

const material = new THREE.MeshStandardMaterial()          // MeshStandardMaterial (more properties) or MeshBasicMaterial
material.metalness = 0.7
material.roughness = 0.2
material.color = new THREE.Color(0x292929)
material.normalMap = normalTexture          // add texture that is set up in textureLoader

// Mesh (ties body and clothing together)
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

// Lights

    // Light 1
    const pointLight1 = new THREE.PointLight(0xffffff, 0.1)          // add white point light
    pointLight1.position.x = 2
    pointLight1.position.y = 3
    pointLight1.position.z = 4
    scene.add(pointLight1)    
    
    // Light 2
    const pointLight2 = new THREE.PointLight(0xff0000, 2)           // add red point light
    pointLight2.position.set(-2.9,2.1,-1.65)                         // set x, y, z all at once
    pointLight2.intensity = 10
    scene.add(pointLight2)
        
        // Light 2 GUI
        const light2 = gui.addFolder('Light 2')
        light2.add(pointLight2.position,'x').min(-6).max(6).step(0.01)         // add gui slider for xyz position
        light2.add(pointLight2.position,'y').min(-3).max(3).step(0.01)
        light2.add(pointLight2.position,'z').min(-3).max(3).step(0.01)
        light2.add(pointLight2, 'intensity').min(0).max(10).step(0.01)

        const light2Color = {
            color: 0xff0000
        }
        light2.addColor(light2Color,'color')         // change color GUI
            .onChange(() => {
                pointLight2.color.set(light2Color.color)
            })
        
        // const pointLightHelper = new THREE.PointLightHelper(pointLight2, 1) 
        // scene.add(pointLightHelper)


    // Light 3
    const pointLight3 = new THREE.PointLight(0xd3f0, 2)                // add blue point light (will not be overwritten by GUI)
    pointLight3.position.set(3,-1.05,-1.12)                         // set x, y, z all at once
    pointLight3.intensity = 10
    scene.add(pointLight3)

        // Light 3 GUI
        const light3 = gui.addFolder('Light 3')
        light3.add(pointLight3.position,'x').min(-6).max(6).step(0.01)         // add gui slider for xyz position
        light3.add(pointLight3.position,'y').min(-3).max(3).step(0.01)
        light3.add(pointLight3.position,'z').min(-3).max(3).step(0.01)
        light3.add(pointLight3, 'intensity').min(0).max(10).step(0.01)


        const light3Color = {
            color: 0xd3f0
        }
        light3.addColor(light3Color,'color')         // change color GUI
            .onChange(() => {
                pointLight3.color.set(light3Color.color)
            })


        // const pointLightHelper3 = new THREE.PointLightHelper(pointLight3, 1)
        // scene.add(pointLightHelper3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes (resize canvas element when window is resized)
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera (perspective or ortho)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer (set and forget)
 */
 const renderer = new THREE.WebGLRenderer({
    canvas: canvas, 
    alpha: true         // make canvas transparent (i.e. use the website color as background)
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate (vanilla javascript)
 */

document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowX = window.innerWidth / 2;          // affects movement of the sphere
const windowY = window.innerHeight / 2;

function onDocumentMouseMove(event) {           // smoother movement when minus windowX
    mouseX = (event.clientX - windowX)          // event.clientX gets the horizontal coordinate of mouse
    mouseY = (event.clientY - windowY)          // event.clientY gets the vertical coordinate of mouse
}

const updateSphere = (event) => {                // resize the sphere when scrolling
    sphere.position.y = window.scrollY * .001    // multiply by 0.001 to prevent the sphere from moving too far off
}

window.addEventListener('scroll', updateSphere);

const clock = new THREE.Clock()

const tick = () =>
{
    targetX = mouseX * .001
    targetY = mouseY * .001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 2 * elapsedTime            // automatic rotation

    sphere.rotation.y += .9 * (targetX - sphere.rotation.y)
    sphere.rotation.x += .05 * (targetY - sphere.rotation.x)
    sphere.position.z += -.2 * (targetY - sphere.rotation.x)       // enlarge the sphere when mouse move off centre from the screen

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()