'use client'

import { useEffect, useRef, useState } from 'react'
// We'll import Three.js dynamically to avoid conflicts with Spline's Three.js

export function ThreeJSFallback() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  
  useEffect(() => {
    if (!containerRef.current || isInitialized) return
    
    let cleanupFunction: () => void = () => {}
    let loadingTimeout: NodeJS.Timeout

    const initThree = async () => {
      try {
        // Dynamically import Three.js to avoid conflicts with Spline
        const THREE = await import('three')
        
        // Show loading indicator while importing
        setIsLoading(true)
        
        // Clear loading state after initialization or timeout
        loadingTimeout = setTimeout(() => {
          setIsLoading(false)
        }, 1500)
        
        let scene: THREE.Scene
        let camera: THREE.PerspectiveCamera
        let renderer: THREE.WebGLRenderer
        let avocado: THREE.Group
        let light: THREE.DirectionalLight
        let ambientLight: THREE.AmbientLight
        let frameId: number
        let eyesGroup: THREE.Group
        let mouth: THREE.Mesh
        let leftArmGroup: THREE.Group
        let rightArmGroup: THREE.Group
        let leftLegGroup: THREE.Group
        let rightLegGroup: THREE.Group
        let blinkTimer: NodeJS.Timeout

        // Mouse position tracking
        const mouse = {
          x: 0,
          y: 0,
          targetX: 0,
          targetY: 0
        }

        const handleMouseMove = (event: MouseEvent) => {
          if (!containerRef.current) return
          
          const rect = containerRef.current.getBoundingClientRect()
          // Calculate normalized coordinates (-1 to 1)
          mouse.targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1
          mouse.targetY = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
        }

        // Create a cuter avocado character similar to the reference image
        const createAvocado = () => {
          // Create an avocado group
          const group = new THREE.Group()
          
          // Create the main body of the avocado (more egg-shaped like reference)
          const bodyGeometry = new THREE.SphereGeometry(1, 32, 32)
          bodyGeometry.scale(0.9, 1.3, 0.8) // More egg-shaped
          
          // Improved avocado color with a richer green
          const bodyMaterial = new THREE.MeshStandardMaterial({
            color: '#44A348', // Richer avocado green
            roughness: 0.3,
            metalness: 0.1
          })
          
          const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
          body.position.y = 0.2 // Raise the body slightly for the legs
          group.add(body)
          
          // Add highlight to the avocado
          const highlightGeometry = new THREE.SphereGeometry(0.99, 32, 32)
          highlightGeometry.scale(0.9, 1.3, 0.8)
          
          const highlightMaterial = new THREE.MeshBasicMaterial({
            color: '#7DCB81', // Lighter green highlight
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
          })
          
          const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial)
          highlight.position.x = 0.1
          highlight.position.y = 0.1
          body.add(highlight)
          
          // Add prominent oval light reflection on top right
          const ovalLightGeometry = new THREE.SphereGeometry(0.3, 24, 24)
          ovalLightGeometry.scale(1, 0.6, 0.3)
          const ovalLightMaterial = new THREE.MeshBasicMaterial({
            color: '#FFFFFF',
            transparent: true,
            opacity: 0.9
          })
          const ovalLight = new THREE.Mesh(ovalLightGeometry, ovalLightMaterial)
          ovalLight.position.set(0.5, 0.7, 0.6)
          ovalLight.rotation.z = -0.3
          body.add(ovalLight)
          
          // Add the pit (seed) - larger and more in center like the reference
          const pitGeometry = new THREE.SphereGeometry(0.42, 32, 32)
          const pitMaterial = new THREE.MeshStandardMaterial({
            color: '#8B4513', // Richer brown for the pit
            roughness: 0.7,
            metalness: 0.2
          })
          
          const pit = new THREE.Mesh(pitGeometry, pitMaterial)
          pit.position.z = 0.65
          body.add(pit)
          
          // Add shading to the pit
          const pitHighlightGeometry = new THREE.SphereGeometry(0.41, 32, 32)
          const pitHighlightMaterial = new THREE.MeshBasicMaterial({
            color: '#A65F35',
            transparent: true,
            opacity: 0.4,
            side: THREE.BackSide
          })
          
          const pitHighlight = new THREE.Mesh(pitHighlightGeometry, pitHighlightMaterial)
          pitHighlight.position.y = 0.05
          pitHighlight.position.x = 0.05
          pit.add(pitHighlight)
          
          // Add small bump texture to the surface
          const bumpTexture = new THREE.TextureLoader().load(
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
          )
          bodyMaterial.bumpMap = bumpTexture
          bodyMaterial.bumpScale = 0.05
          
          // Add cute eyes - more cartoon-like as in the reference
          eyesGroup = new THREE.Group()
          eyesGroup.position.z = 0.75
          eyesGroup.position.y = 0.25
          
          // Left eye
          const leftEyeGroup = new THREE.Group()
          leftEyeGroup.position.x = -0.25
          
          // Eye white (larger, more cartoon-like)
          const leftEyeWhiteGeometry = new THREE.CircleGeometry(0.17, 32)
          const eyeWhiteMaterial = new THREE.MeshBasicMaterial({ color: '#FFFFFF' })
          const leftEyeWhite = new THREE.Mesh(leftEyeWhiteGeometry, eyeWhiteMaterial)
          leftEyeWhite.position.z = 0.01
          leftEyeGroup.add(leftEyeWhite)
          
          // Pupil (larger)
          const leftEyePupilGeometry = new THREE.CircleGeometry(0.08, 32)
          const eyePupilMaterial = new THREE.MeshBasicMaterial({ color: '#000000' })
          const leftEyePupil = new THREE.Mesh(leftEyePupilGeometry, eyePupilMaterial)
          leftEyePupil.position.z = 0.02
          leftEyeGroup.add(leftEyePupil)
          
          // Eye highlight
          const leftEyeHighlightGeometry = new THREE.CircleGeometry(0.03, 16)
          const eyeHighlightMaterial = new THREE.MeshBasicMaterial({ color: '#FFFFFF' })
          const leftEyeHighlight = new THREE.Mesh(leftEyeHighlightGeometry, eyeHighlightMaterial)
          leftEyeHighlight.position.z = 0.03
          leftEyeHighlight.position.x = 0.03
          leftEyeHighlight.position.y = 0.03
          leftEyeGroup.add(leftEyeHighlight)
          
          // Add eyelid for blinking animation
          const leftEyelidGeometry = new THREE.CircleGeometry(0.18, 32)
          const eyelidMaterial = new THREE.MeshBasicMaterial({ 
            color: '#44A348',
            transparent: true,
            opacity: 0
          })
          const leftEyelid = new THREE.Mesh(leftEyelidGeometry, eyelidMaterial)
          leftEyelid.position.z = 0.04
          leftEyelid.userData = { isEyelid: true }
          leftEyeGroup.add(leftEyelid)
          
          eyesGroup.add(leftEyeGroup)
          
          // Right eye (similar to left)
          const rightEyeGroup = new THREE.Group()
          rightEyeGroup.position.x = 0.25
          
          const rightEyeWhite = new THREE.Mesh(leftEyeWhiteGeometry.clone(), eyeWhiteMaterial)
          rightEyeWhite.position.z = 0.01
          rightEyeGroup.add(rightEyeWhite)
          
          const rightEyePupil = new THREE.Mesh(leftEyePupilGeometry.clone(), eyePupilMaterial)
          rightEyePupil.position.z = 0.02
          rightEyeGroup.add(rightEyePupil)
          
          const rightEyeHighlight = new THREE.Mesh(leftEyeHighlightGeometry.clone(), eyeHighlightMaterial)
          rightEyeHighlight.position.z = 0.03
          rightEyeHighlight.position.x = 0.03
          rightEyeHighlight.position.y = 0.03
          rightEyeGroup.add(rightEyeHighlight)
          
          // Add eyelid to right eye
          const rightEyelid = new THREE.Mesh(leftEyelidGeometry.clone(), eyelidMaterial.clone())
          rightEyelid.position.z = 0.04
          rightEyelid.userData = { isEyelid: true }
          rightEyeGroup.add(rightEyelid)
          
          eyesGroup.add(rightEyeGroup)
          body.add(eyesGroup)
          
          // Add expressive mouth with smile line
          const mouthGroup = new THREE.Group()
          mouthGroup.position.z = 0.76
          mouthGroup.position.y = -0.2
          
          // Create a more distinct smile shape
          const smilePath = new THREE.Shape()
          smilePath.moveTo(-0.25, 0)
          smilePath.quadraticCurveTo(0, -0.15, 0.25, 0)
          
          const smileGeometry = new THREE.ShapeGeometry(smilePath)
          const smileMaterial = new THREE.MeshBasicMaterial({ 
            color: '#000000',
            side: THREE.DoubleSide
          })
          
          mouth = new THREE.Mesh(smileGeometry, smileMaterial)
          
          // Add outline to the mouth for better visibility
          const points = smilePath.getPoints(20)
          const smileOutlineGeometry = new THREE.BufferGeometry().setFromPoints(points)
          const smileOutlineMaterial = new THREE.LineBasicMaterial({ 
            color: '#000000', 
            linewidth: 5
          })
          const smileOutline = new THREE.Line(smileOutlineGeometry, smileOutlineMaterial)
          smileOutline.position.z = 0.01
          mouth.add(smileOutline)
          
          mouthGroup.add(mouth)
          body.add(mouthGroup)
          
          // Add small blush circles on cheeks
          const blushGeometry = new THREE.CircleGeometry(0.1, 16)
          const blushMaterial = new THREE.MeshBasicMaterial({ 
            color: '#FF9999',
            transparent: true,
            opacity: 0.5
          })
          
          const leftBlush = new THREE.Mesh(blushGeometry, blushMaterial)
          leftBlush.position.set(-0.45, 0, 0.75)
          leftBlush.rotation.y = -0.4
          body.add(leftBlush)
          
          const rightBlush = new THREE.Mesh(blushGeometry, blushMaterial)
          rightBlush.position.set(0.45, 0, 0.75)
          rightBlush.rotation.y = 0.4
          body.add(rightBlush)
          
          // Add cartoon arms with rounded joints like in the reference
          const armMaterial = new THREE.MeshStandardMaterial({
            color: '#44A348', // Same as body color
            roughness: 0.3
          })
          
          // Left arm - positioned for visibility
          leftArmGroup = new THREE.Group()
          leftArmGroup.position.set(-0.8, 0.25, 0)
          body.add(leftArmGroup)
          
          // Upper arm (shoulder)
          const leftShoulderGeometry = new THREE.SphereGeometry(0.15, 16, 16)
          const leftShoulder = new THREE.Mesh(leftShoulderGeometry, armMaterial)
          leftArmGroup.add(leftShoulder)
          
          // Lower arm
          const leftLowerArmGeometry = new THREE.CapsuleGeometry(0.1, 0.4, 8, 8)
          const leftLowerArm = new THREE.Mesh(leftLowerArmGeometry, armMaterial)
          leftLowerArm.position.set(-0.3, -0.2, 0.2)
          leftLowerArm.rotation.z = 0.5
          leftLowerArm.rotation.x = -0.3
          leftArmGroup.add(leftLowerArm)
          
          // Hand (wrist joint)
          const leftHandGeometry = new THREE.SphereGeometry(0.12, 16, 16)
          const leftHand = new THREE.Mesh(leftHandGeometry, armMaterial)
          leftHand.position.set(-0.5, -0.35, 0.3)
          leftArmGroup.add(leftHand)
          
          // Add fingers to left hand
          const fingerMaterial = new THREE.MeshStandardMaterial({
            color: '#44A348'
          })
          
          for (let i = 0; i < 4; i++) {
            const fingerGeometry = new THREE.CapsuleGeometry(0.025, 0.12, 4, 4)
            const finger = new THREE.Mesh(fingerGeometry, fingerMaterial)
            
            // Position each finger with a slight fan pattern
            const angle = -0.3 + (i * 0.25)
            finger.position.set(
              -0.55 - 0.07 * Math.cos(angle),
              -0.4 - 0.07 * Math.sin(angle),
              0.35
            )
            finger.rotation.z = angle
            leftArmGroup.add(finger)
          }
          
          // Right arm - positioned for visibility
          rightArmGroup = new THREE.Group()
          rightArmGroup.position.set(0.8, 0.25, 0)
          body.add(rightArmGroup)
          
          // Upper arm (shoulder)
          const rightShoulderGeometry = new THREE.SphereGeometry(0.15, 16, 16)
          const rightShoulder = new THREE.Mesh(rightShoulderGeometry, armMaterial)
          rightArmGroup.add(rightShoulder)
          
          // Lower arm
          const rightLowerArmGeometry = new THREE.CapsuleGeometry(0.1, 0.4, 8, 8)
          const rightLowerArm = new THREE.Mesh(rightLowerArmGeometry, armMaterial)
          rightLowerArm.position.set(0.3, -0.2, 0.2)
          rightLowerArm.rotation.z = -0.5
          rightLowerArm.rotation.x = -0.3
          rightArmGroup.add(rightLowerArm)
          
          // Hand (wrist joint)
          const rightHandGeometry = new THREE.SphereGeometry(0.12, 16, 16)
          const rightHand = new THREE.Mesh(rightHandGeometry, armMaterial)
          rightHand.position.set(0.5, -0.35, 0.3)
          rightArmGroup.add(rightHand)
          
          // Add fingers to right hand
          for (let i = 0; i < 4; i++) {
            const fingerGeometry = new THREE.CapsuleGeometry(0.025, 0.12, 4, 4)
            const finger = new THREE.Mesh(fingerGeometry, fingerMaterial)
            
            // Position each finger with a slight fan pattern
            const angle = 0.3 - (i * 0.25)
            finger.position.set(
              0.55 + 0.07 * Math.cos(angle),
              -0.4 - 0.07 * Math.sin(angle),
              0.35
            )
            finger.rotation.z = angle
            rightArmGroup.add(finger)
          }
          
          // Add cartoon legs like in the reference image
          const legMaterial = new THREE.MeshStandardMaterial({
            color: '#44A348', // Same as body color
            roughness: 0.3
          })
          
          // Left leg
          leftLegGroup = new THREE.Group()
          leftLegGroup.position.set(-0.35, -1.2, 0)
          group.add(leftLegGroup)
          
          // Upper leg (hip)
          const leftHipGeometry = new THREE.SphereGeometry(0.15, 16, 16)
          const leftHip = new THREE.Mesh(leftHipGeometry, legMaterial)
          leftLegGroup.add(leftHip)
          
          // Lower leg
          const leftLowerLegGeometry = new THREE.CapsuleGeometry(0.12, 0.4, 8, 8)
          const leftLowerLeg = new THREE.Mesh(leftLowerLegGeometry, legMaterial)
          leftLowerLeg.position.set(0, -0.3, 0)
          leftLowerLeg.rotation.x = 0.2
          leftLegGroup.add(leftLowerLeg)
          
          // Foot
          const leftFootGeometry = new THREE.SphereGeometry(0.15, 16, 16)
          leftFootGeometry.scale(1.3, 0.6, 1.3)
          const leftFoot = new THREE.Mesh(leftFootGeometry, legMaterial)
          leftFoot.position.set(0, -0.55, 0.1)
          leftLegGroup.add(leftFoot)
          
          // Right leg
          rightLegGroup = new THREE.Group()
          rightLegGroup.position.set(0.35, -1.2, 0)
          group.add(rightLegGroup)
          
          // Upper leg (hip)
          const rightHipGeometry = new THREE.SphereGeometry(0.15, 16, 16)
          const rightHip = new THREE.Mesh(rightHipGeometry, legMaterial)
          rightLegGroup.add(rightHip)
          
          // Lower leg
          const rightLowerLegGeometry = new THREE.CapsuleGeometry(0.12, 0.4, 8, 8)
          const rightLowerLeg = new THREE.Mesh(rightLowerLegGeometry, legMaterial)
          rightLowerLeg.position.set(0, -0.3, 0)
          rightLowerLeg.rotation.x = 0.2
          rightLegGroup.add(rightLowerLeg)
          
          // Foot
          const rightFootGeometry = new THREE.SphereGeometry(0.15, 16, 16)
          rightFootGeometry.scale(1.3, 0.6, 1.3)
          const rightFoot = new THREE.Mesh(rightFootGeometry, legMaterial)
          rightFoot.position.set(0, -0.55, 0.1)
          rightLegGroup.add(rightFoot)
          
          // Add shadow beneath avocado
          const shadowGeometry = new THREE.CircleGeometry(1.5, 32)
          const shadowMaterial = new THREE.MeshBasicMaterial({
            color: '#000000',
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
          })
          
          const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial)
          shadow.rotation.x = -Math.PI / 2
          shadow.position.y = -1.8 // Lower to account for legs
          shadow.scale.set(1.2, 0.6, 1) // Wider oval shadow
          group.add(shadow)
          
          return group
        }

        const init = () => {
          // Create scene
          scene = new THREE.Scene()
          scene.background = new THREE.Color('#0a0a0a')

          // Create camera
          camera = new THREE.PerspectiveCamera(
            75, 
            containerRef.current!.clientWidth / containerRef.current!.clientHeight, 
            0.1, 
            1000
          )
          camera.position.z = 5

          // Create renderer
          renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
          })
          renderer.setSize(containerRef.current!.clientWidth, containerRef.current!.clientHeight)
          renderer.setPixelRatio(window.devicePixelRatio)
          containerRef.current!.appendChild(renderer.domElement)
          
          // Create avocado
          avocado = createAvocado()
          scene.add(avocado)

          // Add lighting
          light = new THREE.DirectionalLight(0xffffff, 1.8)
          light.position.set(3, 3, 5)
          scene.add(light)

          const backLight = new THREE.DirectionalLight(0x5555ff, 0.8)
          backLight.position.set(-5, -2, -5)
          scene.add(backLight)
          
          // Add a spotlight for more dramatic lighting
          const spotLight = new THREE.SpotLight(0xffffff, 1.5, 10, Math.PI / 6, 0.5, 1)
          spotLight.position.set(0, 2, 5)
          spotLight.target = avocado
          scene.add(spotLight)

          ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
          scene.add(ambientLight)
          
          // Set up blinking animation
          setupBlinking()

          // Start animation
          animate()
          
          // Add mouse event listener
          window.addEventListener('mousemove', handleMouseMove)
          
          // Initialization complete
          setIsLoading(false)
          clearTimeout(loadingTimeout)
        }
        
        // Set up random blinking
        const setupBlinking = () => {
          const blink = () => {
            if (!eyesGroup) return
            
            // Find eyelids
            eyesGroup.children.forEach(eyeGroup => {
              eyeGroup.children.forEach(child => {
                if (child.userData && child.userData.isEyelid) {
                  const eyelid = child as THREE.Mesh
                  const material = eyelid.material as THREE.MeshBasicMaterial
                  
                  // Animate opacity for blink
                  let opacity = 0
                  const blinkDuration = 150 // milliseconds
                  const interval = 10 // update interval
                  const steps = blinkDuration / interval
                  let step = 0
                  
                  const blinkInterval = setInterval(() => {
                    step++
                    if (step <= steps / 2) {
                      // Close eye
                      opacity = step / (steps / 2)
                    } else {
                      // Open eye
                      opacity = 1 - ((step - steps / 2) / (steps / 2))
                    }
                    
                    material.opacity = Math.max(0, Math.min(1, opacity))
                    
                    if (step >= steps) {
                      clearInterval(blinkInterval)
                    }
                  }, interval)
                }
              })
            })
            
            // Schedule next blink
            const nextBlinkTime = 2000 + Math.random() * 4000 // Random between 2-6 seconds
            blinkTimer = setTimeout(blink, nextBlinkTime)
          }
          
          // Start blinking after a short delay
          blinkTimer = setTimeout(blink, 1000 + Math.random() * 2000)
        }

        const animate = () => {
          try {
            frameId = requestAnimationFrame(animate)
            
            if (!avocado) return

            // Smoothly update mouse position
            mouse.x += (mouse.targetX - mouse.x) * 0.1
            mouse.y += (mouse.targetY - mouse.y) * 0.1
            
            // Move avocado based on mouse position (limited range)
            avocado.position.x = mouse.x * 1.5
            avocado.position.y = mouse.y * 1.5
            
            // Add subtle bob animation
            const time = Date.now() * 0.001 // convert to seconds
            avocado.position.y += Math.sin(time * 1.2) * 0.05
            
            // Gentle rotation based on mouse position 
            avocado.rotation.x = mouse.y * 0.1
            avocado.rotation.y = mouse.x * 0.2
            
            // Make the eyes follow the mouse
            if (eyesGroup) {
              // Eyes follow cursor - but limit the range
              const eyeMaxMove = 0.05
              eyesGroup.children.forEach((eye) => {
                // Only manipulate pupils, not eyelids
                const pupil = eye.children[1] // The pupil is the second child
                pupil.position.x = mouse.x * eyeMaxMove
                pupil.position.y = mouse.y * eyeMaxMove
              })
            }
            
            // Make the mouth animate based on vertical mouse position
            if (mouth) {
              // Make the mouth smile more when cursor is higher
              mouth.scale.y = 1 + mouse.y * 0.5
            }
            
            // Animate legs based on bob animation
            if (leftLegGroup && rightLegGroup) {
              // Make legs move in opposition (walking motion)
              const legBob = Math.sin(time * 3) * 0.05
              
              leftLegGroup.position.y = -1.2 + legBob
              rightLegGroup.position.y = -1.2 - legBob
              
              // Add slight rotation to simulate natural walking
              leftLegGroup.rotation.x = Math.sin(time * 3) * 0.1
              rightLegGroup.rotation.x = -Math.sin(time * 3) * 0.1
            }
            
            // Animate arms based on cursor position
            if (leftArmGroup && rightArmGroup) {
              // Wave the arms gently based on mouse position and walking motion
              const armWave = Math.sin(time * 3) * 0.1
              
              // Arms swing opposite to the legs
              leftArmGroup.rotation.z = 0.2 - armWave
              rightArmGroup.rotation.z = -0.2 + armWave
              
              // Arms move based on mouse position
              leftArmGroup.rotation.y = -mouse.x * 0.5
              rightArmGroup.rotation.y = -mouse.x * 0.5
              
              leftArmGroup.rotation.x = -mouse.y * 0.3
              rightArmGroup.rotation.x = -mouse.y * 0.3
            }
            
            renderer.render(scene, camera)
          } catch (error) {
            console.error('Error in animation loop:', error)
            cancelAnimationFrame(frameId)
          }
        }

        // Handle window resize
        const handleResize = () => {
          if (!containerRef.current || !camera || !renderer) return
          
          camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
          camera.updateProjectionMatrix()
          renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        }

        window.addEventListener('resize', handleResize)
        
        // Initialize everything
        init()
        
        // Mark as initialized to prevent duplicate setups
        setIsInitialized(true)
        
        // Define cleanup function for later use
        cleanupFunction = () => {
          window.removeEventListener('mousemove', handleMouseMove)
          window.removeEventListener('resize', handleResize)
          
          cancelAnimationFrame(frameId)
          clearTimeout(blinkTimer)
          
          if (renderer && containerRef.current) {
            containerRef.current.removeChild(renderer.domElement)
            renderer.dispose()
          }
          
          clearTimeout(loadingTimeout)
        }
      } catch (error) {
        console.error('Error initializing Three.js:', error)
        setHasError(true)
        setIsLoading(false)
        clearTimeout(loadingTimeout)
      }
    }
    
    // Start initialization
    initThree()
    
    // Cleanup function
    return () => {
      cleanupFunction()
    }
  }, [isInitialized])
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-black relative overflow-hidden flex items-center justify-center"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <span className="loader"></span>
        </div>
      )}
      
      {hasError && (
        <div className="text-center text-white">
          <p className="text-lg font-medium">Unable to initialize 3D</p>
          <p className="text-sm text-gray-400 mt-2">Try switching to 2D mode</p>
        </div>
      )}
      
      <div className="absolute bottom-6 text-center text-white z-10 pointer-events-none">
        <p className="text-sm font-medium">Move your cursor to interact!</p>
        <p className="text-xs text-gray-400 mt-1">I'll follow your movements</p>
      </div>
    </div>
  )
} 