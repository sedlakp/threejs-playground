
import {Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'

function App() {

  return (
      <>
        <Canvas
            camera={ {
                fov: 45,
                near: 0.1,
                far: 200,
                position: [ 1, 2, 6 ]
            } }
        >
            <Experience />
        </Canvas>
        <div className='point point-0'>
            <div className='label'>1</div>
            <div className='text'>
                Torii - Usually found at the entrance of a Shinto shrine
            </div>
        </div>
          <div className='point point-1'>
            <div className='label'>2</div>
            <div className='text'>
                Old stone path
            </div>
        </div>
          <div className='point point-2'>
            <div className='label'>3</div>
            <div className='text'>
                A freshly cut grass
            </div>
        </div>
      </>
  )
}

export default App
