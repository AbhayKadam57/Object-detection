import React, { useEffect } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { useRef } from "react";

const ObjectDetectio = () => {
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const setupCamera = async () => {
      if (navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          videoRef.current.srcObject = stream;
        } catch (e) {
          console.log("Error accessing camera", e);
        }
      }
    };

    const detectObjects = async () => {
      const model = await cocoSsd.load();

      console.log("model loaded");

      const detectFrame = () => {
        if (videoRef.current.readyState === 4) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          model.detect(video).then((prediction) => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            prediction.forEach((prediction) => {
              context.strokeStyle = "yellow";
              context.lineWidth = 4;

              context.strokeRect(
                prediction.bbox[0],
                prediction.bbox[1],
                prediction.bbox[2],
                prediction.bbox[3]
              );
              context.fillStyle = "red";
              console.log(
                `${prediction.class} (${Math.round(prediction.score * 100)}%)`
              );
              context.fillText(
                `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
                prediction.bbox[0],
                prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
              );
            });
          });
        }
      };

      requestAnimationFrame(detectFrame);
    };

    setupCamera();
    detectObjects();
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <h1>Hello</h1>
      <video
        ref={videoRef}
        autoPlay
        muted
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
      />
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
      />
    </div>
  );
};

export default ObjectDetectio;
