import {useGLTF, OrbitControls, useTexture, Center} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import {useEffect, useState} from "react";

enum ColorStyle {
    Color,BW
}

// create a raycaster to show/hide the html elements
const raycaster = new THREE.Raycaster();
export default function Experience() {

    const [style,setStyle] = useState(ColorStyle.Color)
    // the html elements in 3d space
    let points:{position: THREE.Vector3, element:any}[] = []

    // Import the blender object
    const {nodes} = useGLTF('./torii-v3.glb')

    // set the points once when the screen is prepared
    useEffect(() => {
        points = [
            {
                position: new THREE.Vector3(0.2, 0.5, -0.2),
                element: document.querySelector('.point-0')
            },
            {
                position: new THREE.Vector3(0.5, -0.5, 1.1),
                element: document.querySelector('.point-1')
            },
            {
                position: new THREE.Vector3(1.2, -0.5, 0),
                element: document.querySelector('.point-2')
            },
        ]
    },[style])

    useFrame((state) => {
        // handle each point html every frame
        for(const point of points) {
            // get point's position
            const screenPosition = point.position.clone()
            // Projects this vector from world space into the camera's normalized device coordinate (NDC) space.
            screenPosition.project(state.camera)

            // set raycaster in the direction of point from the camera
            raycaster.setFromCamera(new THREE.Vector2(screenPosition.x,screenPosition.y),state.camera)

            // check if there are any intersections
            const intersects = raycaster.intersectObjects(state.scene.children,true)

            // hide or show the html element based on whether the point is behind something or not
            if(intersects.length === 0) {
                point.element.classList.add('visible')
            } else {
                const intersectionDistance = intersects[0].distance
                const pointDistance = point.position.distanceTo(state.camera.position)
                if (pointDistance > intersectionDistance) {
                    point.element.classList.remove('visible')
                } else {
                    point.element.classList.add('visible')
                }
            }

            // calculate where the point moves
            const translateX = screenPosition.x * window.innerWidth *0.5
            const translateY = - screenPosition.y * window.innerHeight * 0.5

            // move the html with the 3d model
            point.element.style.transform = `translate(${translateX}px, ${translateY}px)`

        }
    })

    // Load the baked texture
    const bakedTexture = useTexture('./torii-v3.jpg')
    const bakedTextureBw = useTexture('./torii-bw-v3.jpg')
    bakedTexture.flipY = false
    bakedTextureBw.flipY = false

    return <>
        {/*<color args={['#9fafd1']} attach='background'/>*/}
        {/* Controls that specify camera movement and where it can go */}
        <OrbitControls
            makeDefault
            autoRotate={true}
            // enableZoom={false}
            minPolarAngle={0}
            maxPolarAngle={Math.PI/2}
            enablePan={false}
        />
        <Center>
            {/* @ts-expect-error the baked node has a geometry prop*/}
            <mesh geometry={ nodes.baked.geometry } scale={0.6} onClick={() => { setStyle(style === ColorStyle.Color ? ColorStyle.BW : ColorStyle.Color)}}>
                <meshBasicMaterial map={ style === ColorStyle.Color ? bakedTexture : bakedTextureBw } />
            </mesh>
        </Center>
</>
}