import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const Skeleton3DView = ({ modelUrl = 'https://threejs.org/examples/models/gltf/Soldier.glb' }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const mixerRef = useRef(null);
  const actionsRef = useRef({});
  const clockRef = useRef(new THREE.Clock());
  const [baseKeys, setBaseKeys] = useState({ idle: null, walk: null, run: null });
  const [additiveKeys, setAdditiveKeys] = useState([]);
  const [selectedBase, setSelectedBase] = useState('idle');
  const [weights, setWeights] = useState({});
  const [timeScale, setTimeScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 320;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4.5);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 5, 5);
    scene.add(dir);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = true;

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      gltf => {
        const model = gltf.scene;
        model.scale.set(1.4, 1.4, 1.4);
        model.position.set(0, -1.0, 0);
        model.visible = false;
        scene.add(model);

        const helper = new THREE.SkeletonHelper(model);
        helper.material.linewidth = 1;
        helper.material.color = new THREE.Color(0x00bcd4);
        scene.add(helper);

        const mixer = new THREE.AnimationMixer(model);
        mixerRef.current = mixer;
        const clips = gltf.animations || [];
        const actions = {};
        clips.forEach(clip => {
          const a = mixer.clipAction(clip);
          a.enabled = true;
          actions[clip.name] = a;
        });
        actionsRef.current = actions;
        const norm = s => s.toLowerCase().replace(/[_\-\s]/g, '');
        const findBy = key => {
          const k = Object.keys(actions).find(n => norm(n).includes(norm(key)));
          return k || null;
        };
        const idleKey = findBy('idle');
        const walkKey = findBy('walk');
        const runKey = findBy('run');
        setBaseKeys({ idle: idleKey, walk: walkKey, run: runKey });
        const baseSet = new Set([idleKey, walkKey, runKey].filter(Boolean));
        const additive = Object.keys(actions).filter(n => !baseSet.has(n));
        setAdditiveKeys(additive);
        const initWeights = {};
        additive.forEach(n => {
          initWeights[n] = 0;
          actions[n].setEffectiveWeight(0);
          actions[n].play();
        });
        setWeights(initWeights);
        if (idleKey) {
          actions[idleKey].reset();
          actions[idleKey].play();
          setSelectedBase('idle');
        } else if (clips[0]) {
          actions[clips[0].name].reset();
          actions[clips[0].name].play();
          setSelectedBase(clips[0].name);
        }
      }
    );

    const onResize = () => {
      const w = container.clientWidth;
      const h = height;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    const animate = () => {
      const delta = clockRef.current.getDelta();
      if (mixerRef.current) mixerRef.current.update(delta);
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [modelUrl]);

  useEffect(() => {
    if (mixerRef.current) mixerRef.current.timeScale = timeScale;
  }, [timeScale]);

  const handleBase = key => {
    const actions = actionsRef.current;
    if (!actions) return;
    const current = Object.values(baseKeys).find(k => k && actions[k] && actions[k].isRunning());
    const targetKey = baseKeys[key] || key;
    if (!targetKey || !actions[targetKey]) return;
    const n = actions[targetKey];
    if (current && actions[current] && current !== targetKey) {
      actions[current].fadeOut(0.3);
    }
    n.reset();
    n.fadeIn(0.3);
    n.play();
    setSelectedBase(key);
  };

  const handleWeight = (name, value) => {
    const actions = actionsRef.current;
    if (!actions || !actions[name]) return;
    actions[name].setEffectiveWeight(value);
    actions[name].play();
    setWeights(w => ({ ...w, [name]: value }));
  };

  return (
    <div>
      <div ref={containerRef} style={{ width: '100%', height: 320, background: '#0a0a0a', borderRadius: 8 }} />
      <div style={{ paddingTop: 8 }}>
        <div style={{ color: '#ffffff', fontWeight: 600, marginBottom: 6 }}>Controls</div>
        <div style={{ color: '#b0b0b0', marginBottom: 6 }}>Base Actions</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <button onClick={() => setSelectedBase('none')} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #333', background: selectedBase==='none' ? '#1f1f1f' : '#0f0f0f', color: '#b0b0b0' }}>None</button>
          <button disabled={!baseKeys.idle} onClick={() => handleBase('idle')} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #333', background: selectedBase==='idle' ? '#1f1f1f' : '#0f0f0f', color: baseKeys.idle ? '#b0b0b0' : '#555' }}>idle</button>
          <button disabled={!baseKeys.walk} onClick={() => handleBase('walk')} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #333', background: selectedBase==='walk' ? '#1f1f1f' : '#0f0f0f', color: baseKeys.walk ? '#b0b0b0' : '#555' }}>walk</button>
          <button disabled={!baseKeys.run} onClick={() => handleBase('run')} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #333', background: selectedBase==='run' ? '#1f1f1f' : '#0f0f0f', color: baseKeys.run ? '#b0b0b0' : '#555' }}>run</button>
        </div>
        <div style={{ color: '#b0b0b0', marginBottom: 6 }}>Additive Action Weights</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
          {additiveKeys.map(name => (
            <React.Fragment key={name}>
              <span style={{ color: '#b0b0b0', alignSelf: 'center' }}>{name}</span>
              <input type="range" min={0} max={1} step={0.01} value={weights[name] || 0} onChange={e => handleWeight(name, parseFloat(e.target.value))} />
            </React.Fragment>
          ))}
        </div>
        <div style={{ color: '#b0b0b0', marginTop: 12, marginBottom: 6 }}>General Speed</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
          <span style={{ color: '#b0b0b0', alignSelf: 'center' }}>modify time scale</span>
          <input type="range" min={0} max={2} step={0.01} value={timeScale} onChange={e => setTimeScale(parseFloat(e.target.value))} />
        </div>
      </div>
    </div>
  );
};

export default Skeleton3DView;