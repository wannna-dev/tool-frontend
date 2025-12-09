import * as THREE from "three";
import gsap from "gsap";
import { Object3D, Object3DEventMap } from "three";
import { sources } from "./sources";
import Resources from "./Resources.js";

import faceVertexShader from "./shaders/vertex.glsl";
import faceFragmentShader from "./shaders/fragment.glsl";

interface Source {
  name: string;
  path: string;
  type: string;
}

export default class Output {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private targetElement: HTMLDivElement;
  private resources: Resources;
  private videoTexture!: THREE.VideoTexture;
  private videoTexture2!: THREE.VideoTexture;
  private sizes!: { width: number; height: number };
  private isMobile!: boolean;
  private facesMesh!: THREE.Mesh;
  private raycaster!: THREE.Raycaster;
  private mouse!: THREE.Vector2;
  private isHovering!: boolean;
  private lastIntersected!: Object3D<Object3DEventMap> | null;
  private webcamVideo!: HTMLVideoElement;
  private webcamTexture!: THREE.VideoTexture;
  private isWebcam!: boolean;
  private webcamStream!: MediaStream;
  private faceMaterial!: THREE.ShaderMaterial;

  constructor({ window, targetElement }: { window: Window; targetElement: HTMLDivElement }) {
    this.targetElement = targetElement;

    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    this.isMobile = this.sizes.width <= 768;

    // ✅ Now `sources` is correctly an array of Source
    this.resources = new Resources(sources as Source[]);
    this.resources.on("ready", () => {
      this.init();
    });
  }

  private init(): void {
    this.setScene();

    this.setCamera();
    this.setRenderer();
    this.setLights();
    this.setFace();
    this.setRaycaster();
    this.setResizeListener();
    this.startRenderLoop();
    
  }

  /** Setup scene */
  private setScene(): void {
    this.scene = new THREE.Scene();
  }

  /** Setup camera */
  private setCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
    this.scene.add(this.camera);
  }

  /** Setup renderer */
  private setRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.targetElement.appendChild(this.renderer.domElement);
  }

  /** Setup lights */
  private setLights(): void {
    const light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(light);
  }

  /** Setup face */
  private setFace(): void {
    const faces = this.resources.items;
    const randomFace = Object.values(faces)[Math.floor(Math.random() * Object.values(faces).length)];
    this.videoTexture = randomFace as THREE.VideoTexture; // assuming 'faces' is a video texture

    const randomFace2 = Object.values(faces)[Math.floor(Math.random() * Object.values(faces).length)];
    this.videoTexture2 = randomFace2 as THREE.VideoTexture; // assuming 'faces' is a video texture

    const video1 = this.videoTexture.image as HTMLVideoElement;
    const video2 = this.videoTexture2.image as HTMLVideoElement;
    
    video1.loop = false;
    video2.loop = false;
    
    this.setupVideoListeners(video1, 0);
    this.setupVideoListeners(video2, 1);
    
    // Start by playing the first video
    this.playVideo(video1);
      


    const facesGeometry = new THREE.CircleGeometry( this.isMobile ? 2 : 3, 128 ); 
    const facesMaterial = new THREE.ShaderMaterial({
      vertexShader: faceVertexShader,
      fragmentShader: faceFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: this.videoTexture },
        uTexture2: { value: this.videoTexture2 },
        uRadius: { value: 0.45 },
        uRefraction: { value: -0.62 },
        uChromatic: { value: 0.1 },
        uCurve: { value: 8.0 },
        uFresnelPower: { value: 7.66 },
        uFresnelIntensity: { value: 0.0 }, // 0.3
        uMix: { value: 0.0 },
        uFresnelColor: { value: new THREE.Color().setHex(0xffffff) },
        uAspect: {value: new THREE.Vector2(1, this.sizes.width / this.sizes.height)},
      },
    });
    this.facesMesh = new THREE.Mesh(facesGeometry, facesMaterial);
    this.facesMesh.position.x = this.isMobile ? 0 : 2.5;
    this.facesMesh.position.y = this.isMobile ? 1 : 0;
    this.scene.add(this.facesMesh);
    this.facesMesh.scale.set(0, 0, 0);

    gsap.to(this.facesMesh.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1,
      ease: "power2.inOut",
    });
  }

  private setRaycaster(): void {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.isHovering = false;
    this.lastIntersected = null;

    // Añadir event listeners
    document.addEventListener('mousemove', this._onMouseMove.bind(this), { passive: true });
    /* document.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false }); */
    document.addEventListener('click', this._onClick.bind(this), false);
    /* document.addEventListener('touchstart', this._onClick.bind(this), { passive: true }); */
  }

  // Normalizar coordenadas del mouse/touch
  updateMousePosition(clientX: number, clientY: number): void {
    if (!this.renderer) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  };

  private activeVideoIndex = 0; // 0 = videoTexture, 1 = videoTexture2
  private isTransitioning = false;

  private _onMouseMove (event: MouseEvent): void {
    this.updateMousePosition(event.clientX, event.clientY);
    this.checkIntersection();
  };

  private checkIntersection(): void {
    if (!this.renderer || !this.facesMesh) return;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects([this.facesMesh]);
    if (intersects.length > 0) {
      const intersected = intersects[0].object;
      
      // Solo ejecutar si cambió el estado o si es un click
      if (!this.isHovering) {
        this.isHovering = true;
        this.lastIntersected = intersected;
        
        if (intersected.name === 'wanna' || intersected === this.facesMesh) {
          this.expandFace();
          document.body.style.cursor = 'pointer';
        }
      }
    } else {
      document.body.style.cursor = 'default';
      if (this.isHovering) {
        this.isHovering = false;
        this.lastIntersected = null;
        this.shrinkFace();
      }
    }
  }

  private expandFace(): void {
    const tl = gsap.timeline();
    tl.to((this.facesMesh.material as THREE.ShaderMaterial).uniforms.uRadius, {
      value: 0.5,
      // duration: 1,
      ease: "power2.inOut",
    });
    tl.to((this.facesMesh.material as THREE.ShaderMaterial).uniforms.uRefraction, {
      value: 1,
      // duration: 1,
      ease: "power2.inOut",
    }, "<");
  }

  private shrinkFace(): void {
    const tl = gsap.timeline();
    tl.to((this.facesMesh.material as THREE.ShaderMaterial).uniforms.uRadius, {
      value: 0.45,
      // duration: 1,
      ease: "power2.inOut",
    });
    tl.to((this.facesMesh.material as THREE.ShaderMaterial).uniforms.uRefraction, {
      value: -0.62,
      // duration: 1,
      ease: "power2.inOut",
    }, "<");
  }

  private setWebcam(): void {
    // Si ya está activa, desactivar
    if (this.isWebcam) {
      // Animar uMix a 0
        gsap.to((this.facesMesh.material as THREE.ShaderMaterial).uniforms.uMix, {
        value: 0,
        duration: 1,
        ease: "power2.inOut",
      });
  
      // Detener el stream de la webcam
      if (this.webcamStream) {
        this.webcamStream.getTracks().forEach(track => track.stop());
        this.webcamStream = {} as MediaStream;
      }
  
      // Pausar el video si existe
      if (this.webcamVideo) {
        this.webcamVideo.pause();
        this.webcamVideo.srcObject = null;
      }
  
      this.isWebcam = false;
      return;
    }

    // Si no está activa, activar
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("Webcam not supported on this device/browser");
      return;
    }

    // Request access to webcam
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        // Guardar referencia al stream para poder detenerlo después
        this.webcamStream = stream as MediaStream;
  
        // Create a video element (o reutilizar si ya existe)
        if (!this.webcamVideo) {
          this.webcamVideo = document.createElement("video");
          this.webcamVideo.autoplay = true;
          this.webcamVideo.muted = true;
          this.webcamVideo.playsInline = true;
        }
        
        this.webcamVideo.srcObject = stream;
  
        this.webcamVideo.addEventListener("loadedmetadata", () => {
          this.webcamVideo.play();
  
          // Create a THREE.VideoTexture from the video element
          if (!this.webcamTexture) {
            this.webcamTexture = new THREE.VideoTexture(this.webcamVideo);
            this.webcamTexture.minFilter = THREE.LinearFilter;
            this.webcamTexture.magFilter = THREE.LinearFilter;
            this.webcamTexture.format = THREE.RGBAFormat;
            // this.webcamTexture.encoding = THREE.sRGBEncoding;
  
            // Update the shader uniform
            if (this.facesMesh.material) {
              (this.facesMesh.material as THREE.ShaderMaterial).uniforms.uTexture2.value = this.webcamTexture;
            }
          }
  
          this.isWebcam = true;
  
          // Animar uMix a 1
          gsap.to((this.facesMesh.material as THREE.ShaderMaterial).uniforms.uMix, {
            value: 1,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
              this.shrinkFace();
            }
          });
  
          console.log("✅ Webcam texture applied to faceMaterial");
        }, { once: true }); // Solo ejecutar una vez
      })
      .catch((err) => {
        console.error("Failed to access webcam", err);
      });

  }

  private _onClick(): void {
    if (!this.renderer || !this.facesMesh) return;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects([this.facesMesh]);
    if (intersects.length > 0) {
      const intersected = intersects[0].object;
      if (intersected.name === 'wanna' || intersected === this.facesMesh) {
        this.setWebcam();
      }
    }
  }

  private playVideo(video: HTMLVideoElement) {
    video.currentTime = 0;
    video.play().catch(err => console.warn("Video play error:", err));
  }

  private setupVideoListeners(video: HTMLVideoElement, index: number) {
    video.addEventListener("ended", () => {
      console.log(`🎥 Video ${index + 1} ended`);
      if (!this.isTransitioning) this.swapVideos();
    });
  }

  private swapVideos() {
    if (this.isWebcam) return;
    const faces = this.resources.items;
    const mat = this.facesMesh.material as THREE.ShaderMaterial;

    // Prevent overlapping transitions
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // Toggle which one is active
    this.activeVideoIndex = this.activeVideoIndex === 0 ? 1 : 0;

    const nextTexture =
      Object.values(faces)[Math.floor(Math.random() * Object.values(faces).length)] as THREE.VideoTexture;

    nextTexture.minFilter = THREE.LinearFilter;
    nextTexture.magFilter = THREE.LinearFilter;
    nextTexture.format = THREE.RGBAFormat;
    nextTexture.generateMipmaps = false;

    const nextVideo = nextTexture.image as HTMLVideoElement;
    nextVideo.loop = false;
    this.setupVideoListeners(nextVideo, this.activeVideoIndex);

    // Assign to the correct uniform
    if (this.activeVideoIndex === 0) {
      mat.uniforms.uTexture.value = nextTexture;
    } else {
      mat.uniforms.uTexture2.value = nextTexture;
    }

    // Fade in the new one
    const targetMix = this.activeVideoIndex === 0 ? 0 : 1;

    const tl = gsap.timeline({
      onStart: () => this.playVideo(nextVideo),
      onComplete: () => {
        this.isTransitioning = false;
      }
    });

    // Crossfade: uMix = 0 → show Texture1, uMix = 1 → show Texture2
    tl.to(mat.uniforms.uMix, {
      value: targetMix,
      duration: 0.1,
      ease: "power2.inOut"
    });
  }

  /** Setup resize listener */
  private setResizeListener(): void {
    window.addEventListener("resize", () => {
      this.isMobile = window.innerWidth <= 768;
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();

      // Update face mesh
      if (this.facesMesh) {
        this.facesMesh.position.x = this.isMobile ? 0 : 2.5;
        this.facesMesh.position.y = this.isMobile ? 1 : 0;
        this.facesMesh.geometry = new THREE.CircleGeometry( this.isMobile ? 2 : 3, 128 );
      }
    });
  }

  /** Main render loop */
  private startRenderLoop(): void {

    const animate = () => {
      requestAnimationFrame(animate);

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }
}
