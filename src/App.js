import './App.css';
import { useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import Webcam from 'react-webcam';
import { drawMesh } from './utilites'

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  //  Load function
  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8

    })
    setInterval(() => {
      detect(net)
    }, 50)
  }

  //  Detect function
  const detect = async (net) => {
    if (
      typeof webcamRef.current !== 'undefined'
      && webcamRef.current !== null
      && webcamRef.current.video.readyState === 4
    ) {
      // Get video Properties 
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      //  Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoWidth;

      // Canvas set properties
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      //  Make detection 
      const face = await net.estimateFaces(video);
      console.log(face);

      // Get canvas context Method for Drawing
      const ctx = canvasRef.current.getContext('2d');
      drawMesh(face, ctx);
    }
  }
  runFacemesh();
  return (
    <div className="App">
      <div className='App-header'>
        <Webcam
          ref={webcamRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
            left: 0,
            right: 0,
            zIndex: 9,
            width: 640,
            height: 480
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
            left: 0,
            right: 0,
            zIndex: 9,
            width: 640,
            height: 480
          }}
        />
      </div>
    </div>
  );
}

export default App;
