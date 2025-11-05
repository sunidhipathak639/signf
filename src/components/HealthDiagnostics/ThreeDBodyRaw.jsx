import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const ThreeDBodyRaw = ({ onSelectPart, modelUrl = 'https://threejs.org/examples/models/gltf/Xbot.glb', showControls = false }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const mixerRef = useRef(null);
  const actionsRef = useRef({});
  const clockRef = useRef(new THREE.Clock());
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const [playingAdditive, setPlayingAdditive] = useState(true);
  const baseActionRef = useRef(null);
  const runActionRef = useRef(null);
  const walkActionRef = useRef(null);
  const onSelectPartRef = useRef(onSelectPart);
  const [baseKeys, setBaseKeys] = useState({ stand: null, walk: null, run: null, pushups: null });
  const [additiveCategories, setAdditiveCategories] = useState([]);
  const [selectedBase, setSelectedBase] = useState('walk');
  const [additiveValues, setAdditiveValues] = useState({});
  const [timeScale, setTimeScale] = useState(1);
  const [hoveredPart, setHoveredPart] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const hoveredPartRef = useRef(null);
  const selectedPartRef = useRef(null);
  const [hoverLabel, setHoverLabel] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const levelSets = [
    { label: 'Off', v: 0 },
    { label: 'Subtle', v: 0.25 },
    { label: 'Normal', v: 0.5 },
    { label: 'Strong', v: 0.75 },
    { label: 'Max', v: 1 }
  ];
  const speedPresets = [0.75, 1, 1.25, 1.5, 2];

  useEffect(() => {
    onSelectPartRef.current = onSelectPart;
  }, [onSelectPart]);

  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 600;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 2, 6);
    cameraRef.current = camera;

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 5, 5);
    scene.add(dir);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enableRotate = true;
    controlsRef.current = controls;
    renderer.domElement.style.touchAction = 'none';

    const parts = [
      { name: 'head', pos: [0, 2.4, 0], scale: [0.9, 1, 0.9] },
      { name: 'neck', pos: [0, 1.7, 0], scale: [0.4, 0.5, 0.4] },
      { name: 'chest', pos: [0, 1.1, 0], scale: [1.6, 1.2, 0.8] },
      { name: 'abdomen', pos: [0, 0.2, 0], scale: [1.3, 1, 0.7] },
      { name: 'pelvis', pos: [0, -0.6, 0], scale: [1.2, 0.7, 0.7] },
      { name: 'leftUpperArm', pos: [-1.4, 1.1, 0], scale: [0.5, 1, 0.5] },
      { name: 'rightUpperArm', pos: [1.4, 1.1, 0], scale: [0.5, 1, 0.5] },
      { name: 'leftForearm', pos: [-1.4, 0.1, 0], scale: [0.45, 1, 0.45] },
      { name: 'rightForearm', pos: [1.4, 0.1, 0], scale: [0.45, 1, 0.45] },
      { name: 'leftThigh', pos: [-0.5, -1.6, 0], scale: [0.7, 1.3, 0.7] },
      { name: 'rightThigh', pos: [0.5, -1.6, 0], scale: [0.7, 1.3, 0.7] },
      { name: 'leftShin', pos: [-0.5, -2.7, 0], scale: [0.6, 1.2, 0.6] },
      { name: 'rightShin', pos: [0.5, -2.7, 0], scale: [0.6, 1.2, 0.6] },
      { name: 'leftFoot', pos: [-0.5, -3.4, 0.2], scale: [0.8, 0.3, 1.2] },
      { name: 'rightFoot', pos: [0.5, -3.4, 0.2], scale: [0.8, 0.3, 1.2] }
    ];

    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, transparent: true, opacity: 0 });
    const hoverMaterial = new THREE.MeshStandardMaterial({ color: 0x00bcd4, transparent: true, opacity: 0 });
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    const group = new THREE.Group();
    group.position.set(0, -1.2, 0);
    scene.add(group);

    parts.forEach(p => {
      const mesh = new THREE.Mesh(geometry, baseMaterial.clone());
      mesh.name = p.name;
      mesh.position.set(p.pos[0], p.pos[1], p.pos[2]);
      mesh.scale.set(p.scale[0], p.scale[1], p.scale[2]);
      const edgeGeom = new THREE.EdgesGeometry(geometry);
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x00bcd4 });
      edgeMat.depthTest = false;
      edgeMat.transparent = true;
      edgeMat.opacity = 1;
      const edge = new THREE.LineSegments(edgeGeom, edgeMat);
      edge.renderOrder = 2;
      edge.visible = false;
      mesh.add(edge);
      group.add(mesh);
    });

    const updateHighlight = (hoverName, selectedName) => {
      group.children.forEach(m => {
        const edge = m.children && m.children.find(c => c.type === 'LineSegments');
        if (selectedName && m.name === selectedName) {
          if (edge) {
            edge.visible = true;
            edge.material.color.set(0xff5a00);
          }
          m.material.opacity = 0.2;
        } else if (hoverName && m.name === hoverName) {
          if (edge) {
            edge.visible = true;
            edge.material.color.set(0x00bcd4);
          }
          m.material.opacity = 0.1;
        } else {
          if (edge) edge.visible = false;
          m.material.opacity = 0;
        }
      });
    };

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      gltf => {
        const model = gltf.scene;
        model.traverse(o => {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });
        model.scale.set(1.4, 1.4, 1.4);
        model.position.set(0, -1.2, 0);
        scene.add(model);
        const mixer = new THREE.AnimationMixer(model);
        mixerRef.current = mixer;
        const clips = gltf.animations || [];
        const actions = {};
        const norm = s => s.toLowerCase().replace(/[_\-\s]/g, '');
        clips.forEach(clip => {
          const isBase = ['idle','walk','run'].some(k => norm(clip.name).includes(norm(k)));
          const c = isBase ? clip : THREE.AnimationUtils.makeClipAdditive(clip);
          const a = mixer.clipAction(c);
          a.enabled = true;
          actions[clip.name] = a;
        });
        actionsRef.current = actions;
        const findBySyns = syns => Object.keys(actions).find(n => syns.some(s => norm(n).includes(norm(s)))) || null;
        const findAllBySyns = syns => Object.keys(actions).filter(n => syns.some(s => norm(n).includes(norm(s))));
        const standKey = findBySyns(['stand','standing','idle']);
        const walkKey = findBySyns(['walk','walking']);
        const runKey = findBySyns(['run','running']);
        const pushupsKey = findBySyns(['pushups','pushup','push_up','push-ups']);
        setBaseKeys({ stand: standKey, walk: walkKey, run: runKey, pushups: pushupsKey });
        const headshakeClips = findAllBySyns(['headshake','shakehead','no']);
        const sneakClips = findAllBySyns(['sneak_pose','sneak']);
        const sadClips = findAllBySyns(['sad_pose','sad']);
        const agreeClips = findAllBySyns(['agree']);
        const categories = [];
        if (headshakeClips.length) categories.push({ key: 'headshake', label: 'Head Shake', clips: headshakeClips });
        if (sneakClips.length) categories.push({ key: 'sneak_pose', label: 'Sneak Pose', clips: sneakClips });
        if (sadClips.length) categories.push({ key: 'sad_pose', label: 'Sad Pose', clips: sadClips });
        if (agreeClips.length) categories.push({ key: 'agree', label: 'Agree', clips: agreeClips });
        setAdditiveCategories(categories);
        const initValues = {};
        categories.forEach(cat => {
          initValues[cat.key] = 0;
          cat.clips.forEach(n => {
            actions[n].setEffectiveWeight(0);
            actions[n].play();
          });
        });
        setAdditiveValues(initValues);
        const initialKey = standKey || walkKey || runKey || pushupsKey || null;
        if (initialKey && actions[initialKey]) {
          const a = actions[initialKey];
          a.reset();
          a.play();
          baseActionRef.current = a;
          if (initialKey === standKey) setSelectedBase('stand');
          else if (initialKey === walkKey) setSelectedBase('walk');
          else if (initialKey === runKey) setSelectedBase('run');
          else if (initialKey === pushupsKey) setSelectedBase('pushups');
        }
      }
    );

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(group.children);
      const hoverName = intersects.length ? intersects[0].object.name : null;
      hoveredPartRef.current = hoverName;
      setHoveredPart(hoverName);
      setHoverLabel(hoverName);
      setHoverPos({ x: e.clientX, y: e.clientY });
      updateHighlight(hoverName, selectedPartRef.current);
    };

    let downX = 0;
    let downY = 0;
    const onPointerDown = (e) => {
      downX = e.clientX;
      downY = e.clientY;
    };

    const onClick = (e) => {
      const dx = Math.abs(e.clientX - downX);
      const dy = Math.abs(e.clientY - downY);
      if (dx > 4 || dy > 4) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(group.children);
      if (intersects.length > 0) {
        const sel = intersects[0].object.name;
        selectedPartRef.current = sel;
        setSelectedPart(sel);
        updateHighlight(hoveredPartRef.current, sel);
        onSelectPartRef.current && onSelectPartRef.current(sel);
      } else {
        selectedPartRef.current = null;
        setSelectedPart(null);
        updateHighlight(hoveredPartRef.current, null);
        onSelectPartRef.current && onSelectPartRef.current(null);
      }
    };

    const onMouseLeave = () => {
      hoveredPartRef.current = null;
      setHoveredPart(null);
      setHoverLabel(null);
      updateHighlight(null, selectedPartRef.current);
    };

    renderer.domElement.addEventListener('mousemove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('mouseleave', onMouseLeave);

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
      renderer.domElement.removeEventListener('mousemove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('mouseleave', onMouseLeave);
      controls.dispose();
      renderer.dispose();
      while (group.children.length) {
        const child = group.children.pop();
        child.geometry.dispose();
        child.material.dispose();
      }
      container.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (mixerRef.current) mixerRef.current.timeScale = timeScale;
  }, [timeScale]);

  useEffect(() => {
  }, [additiveCategories]);

  const toggleAdditive = () => {
    setPlayingAdditive(v => {
      const mixer = mixerRef.current;
      if (!mixer) return !v;
      const walk = walkActionRef.current;
      const run = runActionRef.current;
      if (walk) walk.setEffectiveWeight(v ? 0 : 0.4);
      if (run) run.setEffectiveWeight(v ? 0 : 0.2);
      return !v;
    });
  };

  const setBase = name => {
    const actions = actionsRef.current;
    const targetKey = baseKeys[name] || name;
    if (!actions[targetKey]) return;
    Object.values(baseKeys).forEach(k => {
      if (k && actions[k]) actions[k].fadeOut(0.2);
    });
    const n = actions[targetKey];
    n.reset();
    n.fadeIn(0.2);
    n.play();
    setSelectedBase(name);
  };

  const handleCategoryWeight = (catKey, value) => {
    const actions = actionsRef.current;
    const cat = additiveCategories.find(c => c.key === catKey);
    if (!cat) return;
    cat.clips.forEach(n => {
      if (actions[n]) {
        actions[n].setEffectiveWeight(value);
        actions[n].play();
      }
    });
    setAdditiveValues(v => ({ ...v, [catKey]: value }));
  };

  const resetAdditives = () => {
    const actions = actionsRef.current;
    const values = {};
    additiveCategories.forEach(cat => {
      values[cat.key] = 0;
      cat.clips.forEach(n => {
        if (actions[n]) {
          actions[n].setEffectiveWeight(0);
          actions[n].play();
        }
      });
    });
    setAdditiveValues(values);
  };

  return (
    <div style={{ width: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: 560, background: '#0a0a0a', borderRadius: 8 }} />
      {showControls && (
        <div style={{ paddingTop: 12 }}>
          <div style={{ background: '#121212', border: '1px solid #262626', borderRadius: 10, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ color: '#e5e5e5', fontWeight: 600, letterSpacing: 0.2 }}>Controls</div>
              <button onClick={resetAdditives} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #2f2f2f', background: '#161616', color: '#d4d4d4', cursor: 'pointer' }}>Reset Filters</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 10, alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: '#b0b0b0' }}>Selected Part</span>
              <span style={{ color: '#e5e5e5', textAlign: 'right' }}>{selectedPart || 'None'}</span>
            </div>
            {hoverLabel && (
              <div style={{ position: 'fixed', left: hoverPos.x + 12, top: hoverPos.y + 12, background: '#111111', border: '1px solid #2f2f2f', color: '#e5e5e5', padding: '4px 8px', borderRadius: 6, fontSize: 12, pointerEvents: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.35)' }}>
                {hoverLabel}
              </div>
            )}
            <div style={{ color: '#b0b0b0', marginBottom: 6 }}>Actions</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {baseKeys.stand && (
                <button onClick={() => setBase('stand')} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #2f2f2f', background: selectedBase==='stand' ? '#1a1a1a' : '#101010', color: '#e5e5e5', cursor: 'pointer' }}>Stand</button>
              )}
              {baseKeys.walk && (
                <button onClick={() => setBase('walk')} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #2f2f2f', background: selectedBase==='walk' ? '#1a1a1a' : '#101010', color: '#e5e5e5', cursor: 'pointer' }}>Walk</button>
              )}
              {baseKeys.run && (
                <button onClick={() => setBase('run')} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #2f2f2f', background: selectedBase==='run' ? '#1a1a1a' : '#101010', color: '#e5e5e5', cursor: 'pointer' }}>Running</button>
              )}
              {baseKeys.pushups && (
                <button onClick={() => setBase('pushups')} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #2f2f2f', background: selectedBase==='pushups' ? '#1a1a1a' : '#101010', color: '#e5e5e5', cursor: 'pointer' }}>Push Ups</button>
              )}
            </div>
            <div style={{ color: '#b0b0b0', marginBottom: 6 }}>Additive Filters</div>
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 10, alignItems: 'center' }}>
              {additiveCategories.map(cat => (
                <React.Fragment key={cat.key}>
                  <span style={{ color: '#d4d4d4' }}>{cat.label}</span>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    {levelSets.map(level => {
                      const active = (additiveValues[cat.key] || 0) === level.v;
                      return (
                        <button
                          key={level.label}
                          onClick={() => handleCategoryWeight(cat.key, level.v)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 16,
                            border: active ? '1px solid #4a4a4a' : '1px solid #2a2a2a',
                            background: active ? '#1d1d1d' : '#0f0f0f',
                            color: active ? '#e5e5e5' : '#c9c9c9',
                            cursor: 'pointer',
                            minWidth: 68,
                            textAlign: 'center'
                          }}
                        >
                          {level.label}
                        </button>
                      );
                    })}
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div style={{ color: '#b0b0b0', marginTop: 12, marginBottom: 6 }}>General Speed</div>
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 56px', gap: 10, alignItems: 'center' }}>
              <span style={{ color: '#d4d4d4' }}>Time Scale</span>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                {speedPresets.map(p => {
                  const active = timeScale === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setTimeScale(p)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 16,
                        border: active ? '1px solid #4a4a4a' : '1px solid #2a2a2a',
                        background: active ? '#1d1d1d' : '#0f0f0f',
                        color: active ? '#e5e5e5' : '#c9c9c9',
                        cursor: 'pointer',
                        minWidth: 56,
                        textAlign: 'center'
                      }}
                    >
                      {p}x
                    </button>
                  );
                })}
              </div>
              <span style={{ color: '#9e9e9e', textAlign: 'right' }}>{timeScale.toFixed(2)}x</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeDBodyRaw;