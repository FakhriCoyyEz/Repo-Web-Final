'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    // Particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 1500
    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: '#6b8afd',
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    })

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    camera.position.z = 2

    // Mouse movement
    let mouseX = 0
    let mouseY = 0

    const animate = () => {
      requestAnimationFrame(animate)
      
      particlesMesh.rotation.y += 0.001
      particlesMesh.rotation.x += 0.0005

      // Mouse follow effect
      particlesMesh.rotation.y += mouseX * 0.05
      particlesMesh.rotation.x += -mouseY * 0.05

      renderer.render(scene, camera)
    }

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) - 0.5
      mouseY = (event.clientY / window.innerHeight) - 0.5
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-0 pointer-events-none overflow-hidden" 
      style={{ opacity: 0.6 }}
    />
  )
}
