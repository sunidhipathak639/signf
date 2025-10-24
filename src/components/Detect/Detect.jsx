import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Detect.css";
import { v4 as uuidv4 } from "uuid";
import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import {
  drawConnectors,
  drawLandmarks,
  // HAND_CONNECTIONS,
} from "@mediapipe/drawing_utils";

import { HAND_CONNECTIONS } from "@mediapipe/hands";

import Webcam from "react-webcam";
import { SignImageData } from "../../data/SignImageData";
import { useDispatch, useSelector } from "react-redux";
import { addSignData } from "../../redux/actions/signdataaction";
import ProgressBar from "./ProgressBar/ProgressBar";

let startTime = "";

const Detect = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [gestureOutput, setGestureOutput] = useState("");
  const [gestureRecognizer, setGestureRecognizer] = useState(null);
  const [runningMode, setRunningMode] = useState("IMAGE");
  const [progress, setProgress] = useState(0);

  const requestRef = useRef();

  const [detectedData, setDetectedData] = useState([]);

  const user = useSelector((state) => state.auth?.user);

  const { accessToken } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    let intervalId;
    if (webcamRunning) {
      intervalId = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * SignImageData.length);
        const randomImage = SignImageData[randomIndex];
        setCurrentImage(randomImage);
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [webcamRunning]);

  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "production"
  ) {
    console.log = function () {};
  }

  const predictWebcam = useCallback(() => {
    if (runningMode === "IMAGE") {
      setRunningMode("VIDEO");
      gestureRecognizer.setOptions({ runningMode: "VIDEO" });
    }

    let nowInMs = Date.now();
    const results = gestureRecognizer.recognizeForVideo(
      webcamRef.current.video,
      nowInMs
    );

    const canvasCtx = canvasRef.current.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set video width
    webcamRef.current.video.width = videoWidth;
    webcamRef.current.video.height = videoHeight;

    // Set canvas height and width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    // Draw the results on the canvas, if any.
    if (results.landmarks) {
      for (const landmarks of results.landmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5,
        });

        drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
      }
    }
    if (results.gestures.length > 0) {
      setDetectedData((prevData) => [
        ...prevData,
        {
          SignDetected: results.gestures[0][0].categoryName,
        },
      ]);

      setGestureOutput(results.gestures[0][0].categoryName);
      setProgress(Math.round(parseFloat(results.gestures[0][0].score) * 100));
    } else {
      setGestureOutput("");
      setProgress("");
    }

    if (webcamRunning === true) {
      requestRef.current = requestAnimationFrame(predictWebcam);
    }
  }, [webcamRunning, runningMode, gestureRecognizer, setGestureOutput]);

  const animate = useCallback(() => {
    requestRef.current = requestAnimationFrame(animate);
    predictWebcam();
  }, [predictWebcam]);

  const enableCam = useCallback(() => {
    if (!gestureRecognizer) {
      alert("Please wait for gestureRecognizer to load");
      return;
    }

    if (webcamRunning === true) {
      setWebcamRunning(false);
      cancelAnimationFrame(requestRef.current);
      setCurrentImage(null);

      const endTime = new Date();

      const timeElapsed = (
        (endTime.getTime() - startTime.getTime()) /
        1000
      ).toFixed(2);

      // Remove empty values
      const nonEmptyData = detectedData.filter(
        (data) => data.SignDetected !== "" && data.DetectedScore !== ""
      );

      //to filter continous same signs in an array
      const resultArray = [];
      let current = nonEmptyData[0];

      for (let i = 1; i < nonEmptyData.length; i++) {
        if (nonEmptyData[i].SignDetected !== current.SignDetected) {
          resultArray.push(current);
          current = nonEmptyData[i];
        }
      }

      resultArray.push(current);

      //calculate count for each repeated sign
      const countMap = new Map();

      for (const item of resultArray) {
        const count = countMap.get(item.SignDetected) || 0;
        countMap.set(item.SignDetected, count + 1);
      }

      const sortedArray = Array.from(countMap.entries()).sort(
        (a, b) => b[1] - a[1]
      );

      const outputArray = sortedArray
        .slice(0, 5)
        .map(([sign, count]) => ({ SignDetected: sign, count }));

      // object to send to action creator
      const data = {
        signsPerformed: outputArray,
        id: uuidv4(),
        username: user?.name,
        userId: user?.userId,
        createdAt: String(endTime),
        secondsSpent: Number(timeElapsed),
      };

      dispatch(addSignData(data));
      setDetectedData([]);
    } else {
      setWebcamRunning(true);
      startTime = new Date();
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [
    webcamRunning,
    gestureRecognizer,
    animate,
    detectedData,
    user?.name,
    user?.userId,
    dispatch,
  ]);

  useEffect(() => {
    async function loadGestureRecognizer() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            process.env.REACT_APP_FIREBASE_STORAGE_TRAINED_MODEL_25_04_2023,
        },
        numHands: 2,
        runningMode: runningMode,
      });
      setGestureRecognizer(recognizer);
    }
    loadGestureRecognizer();
  }, [runningMode]);

  return (
    <div className="detect-page">
      <div className="detect-container">
        {accessToken ? (
          <>
            {/* Header Section */}
            <div className="detect-header" >
              <h1 className="detect-title gradient__text">Sign Language Detection</h1>
              <p className="detect-subtitle">Practice your sign language skills with real-time detection</p>
            </div>

            {/* Main Content Grid */}
            <div className="detect-content-grid">
              {/* Camera Section */}
              <div className="camera-section">
                <div className="camera-card">
                  <div className="camera-header">
                    <h3>Live Camera Feed</h3>
                    <div className="camera-status">
                      <div className={`status-indicator ${webcamRunning ? 'active' : 'inactive'}`}></div>
                      <span>{webcamRunning ? 'Recording' : 'Stopped'}</span>
                    </div>
                  </div>
                  
                  <div className="camera-container">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      className="webcam"
                    />
                    <canvas ref={canvasRef} className="canvas-overlay" />
                  </div>

                  <div className="camera-controls">
                    <button 
                      className={`control-btn ${webcamRunning ? 'stop-btn' : 'start-btn'}`}
                      onClick={enableCam}
                    >
                      <span className="btn-icon">{webcamRunning ? '⏹' : '▶'}</span>
                      {webcamRunning ? "Stop Detection" : "Start Detection"}
                    </button>
                  </div>
                </div>

                {/* Detection Results */}
                <div className="detection-results">
                  <div className="result-card">
                    <h4>Detected Sign</h4>
                    <div className="gesture-display">
                      {gestureOutput ? (
                        <span className="gesture-text">{gestureOutput}</span>
                      ) : (
                        <span className="no-gesture">No sign detected</span>
                      )}
                    </div>
                  </div>
                  
                  {progress && (
                    <div className="confidence-card">
                      <h4>Confidence Level</h4>
                      <ProgressBar progress={progress} />
                      <span className="confidence-text">{progress}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Practice Image Section */}
              <div className="practice-section">
                <div className="practice-card">
                  <div className="practice-header">
                    <h3>Practice Image</h3>
                    <p>Try to replicate this sign</p>
                  </div>
                  
                  <div className="practice-image-container">
                    {currentImage ? (
                      <div className="image-wrapper">
                        <img 
                          src={currentImage.url} 
                          alt={`Practice sign ${currentImage.name}`}
                          className="practice-image"
                        />
                        <div className="image-overlay">
                          <span className="image-label">Practice This Sign</span>
                        </div>
                        <div className="sign-name-display">
                          <h4 className="sign-name">{currentImage.name}</h4>
                        </div>
                      </div>
                    ) : (
                      <div className="no-image-placeholder">
                        <div className="placeholder-icon">📷</div>
                        <h4>Ready to Practice?</h4>
                        <p>Click "Start Detection" to begin practicing with random sign images</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="login-required">
            <div className="login-card">
              <div className="login-icon">🔐</div>
              <h1 className="gradient__text">Authentication Required</h1>
              <p>
                We save your detection data to track your progress and learning journey. 
                Please log in to access the sign language detection feature.
              </p>
              <div className="login-features">
                <div className="feature-item">
                  <span className="feature-icon">📊</span>
                  <span>Track your progress</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>Personalized learning</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📈</span>
                  <span>Performance analytics</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detect;
