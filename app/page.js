'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars, Box, Torus } from '@react-three/drei'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Github, Linkedin, Mail, ExternalLink, Menu, X, Code, Palette, Database, Zap, Globe, Smartphone } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import * as THREE from 'three'

// Animated 3D Background Component
function AnimatedSphere() {
  const meshRef = useRef()
  
  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
  })
  
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 100, 200]} scale={2.5}>
        <MeshDistortMaterial
          color="#8b5cf6"
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0.2}
        />
      </Sphere>
    </Float>
  )
}

// Floating Geometric Shapes
function FloatingShapes() {
  const shapes = []
  
  for (let i = 0; i < 10; i++) {
    const ShapeComponent = i % 3 === 0 ? Box : i % 3 === 1 ? Sphere : Torus
    const position = [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    ]
    
    shapes.push(
      <Float key={i} speed={1 + Math.random() * 2} rotationIntensity={1} floatIntensity={2}>
        <ShapeComponent position={position} args={i % 3 === 2 ? [0.5, 0.2, 30] : [0.5, 32, 32]} scale={0.5}>
          <meshStandardMaterial
            color={['#8b5cf6', '#ec4899', '#06b6d4'][i % 3]}
            wireframe={i % 2 === 0}
            transparent
            opacity={0.6}
          />
        </ShapeComponent>
      </Float>
    )
  }
  
  return <>{shapes}</>
}

// Interactive Particles
function Particles({ count = 1000 }) {
  const points = useRef()
  const particlesPosition = new Float32Array(count * 3)
  
  for (let i = 0; i < count; i++) {
    particlesPosition[i * 3] = (Math.random() - 0.5) * 30
    particlesPosition[i * 3 + 1] = (Math.random() - 0.5) * 30
    particlesPosition[i * 3 + 2] = (Math.random() - 0.5) * 30
  }
  
  useFrame((state) => {
    points.current.rotation.y = state.clock.getElapsedTime() * 0.05
  })
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#8b5cf6" transparent opacity={0.8} sizeAttenuation />
    </points>
  )
}

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])
  
  // Typing animation
  const [text, setText] = useState('')
  const fullText = 'Full Stack Developer & Creative Designer'
  
  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      setText(fullText.slice(0, index))
      index++
      if (index > fullText.length) clearInterval(timer)
    }, 50)
    return () => clearInterval(timer)
  }, [])
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: 'Message Sent! 🚀',
          description: 'Thank you for reaching out. I\'ll get back to you soon!',
        })
        setFormData({ name: '', email: '', message: '' })
      } else {
        throw new Error(data.error || 'Failed to send message')
      }
    } catch (error) {
      toast({
        title: 'Oops! Something went wrong',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const skills = [
    { name: 'React & Next.js', icon: <Code className="w-6 h-6" />, level: 95, color: 'bg-blue-500' },
    { name: 'UI/UX Design', icon: <Palette className="w-6 h-6" />, level: 90, color: 'bg-purple-500' },
    { name: 'Node.js & APIs', icon: <Database className="w-6 h-6" />, level: 88, color: 'bg-green-500' },
    { name: '3D & Animations', icon: <Zap className="w-6 h-6" />, level: 85, color: 'bg-yellow-500' },
    { name: 'Web Performance', icon: <Globe className="w-6 h-6" />, level: 92, color: 'bg-cyan-500' },
    { name: 'Mobile Dev', icon: <Smartphone className="w-6 h-6" />, level: 87, color: 'bg-pink-500' }
  ]
  
  const projects = [
    {
      title: 'AI SaaS Platform',
      description: 'Full-stack AI-powered SaaS application with real-time collaboration and advanced analytics.',
      tech: ['Next.js', 'OpenAI', 'PostgreSQL', 'Stripe'],
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
      link: '#'
    },
    {
      title: 'E-Commerce Platform',
      description: 'Modern e-commerce solution with 3D product previews and seamless checkout experience.',
      tech: ['React', 'Three.js', 'Node.js', 'MongoDB'],
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
      link: '#'
    },
    {
      title: 'Portfolio CMS',
      description: 'Headless CMS for creative professionals with drag-and-drop builder and analytics.',
      tech: ['Next.js', 'GraphQL', 'Prisma', 'AWS'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      link: '#'
    },
    {
      title: 'Real-Time Chat App',
      description: 'WebSocket-based chat application with end-to-end encryption and media sharing.',
      tech: ['React', 'Socket.io', 'Redis', 'Express'],
      image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&h=600&fit=crop',
      link: '#'
    },
    {
      title: 'Fitness Tracker',
      description: 'Mobile-first fitness tracking app with AI-powered workout recommendations.',
      tech: ['React Native', 'TensorFlow', 'Firebase'],
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop',
      link: '#'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Real-time analytics dashboard with beautiful data visualizations and reporting.',
      tech: ['Vue.js', 'D3.js', 'Python', 'FastAPI'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      link: '#'
    }
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Custom Cursor Trail */}
      <motion.div
        className="fixed w-4 h-4 rounded-full bg-purple-500 pointer-events-none z-50 mix-blend-screen"
        animate={{ x: mousePosition.x - 8, y: mousePosition.y - 8 }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      />
      
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-40 backdrop-blur-md bg-slate-950/50 border-b border-purple-500/20"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Portfolio
            </motion.div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  whileHover={{ scale: 1.1, color: '#c084fc' }}
                  className="text-sm font-medium transition-colors hover:text-purple-400"
                >
                  {item}
                </motion.a>
              ))}
            </div>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 flex flex-col gap-4"
            >
              {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium hover:text-purple-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </motion.div>
          )}
        </div>
      </motion.nav>
      
      {/* Hero Section with 3D Background */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ec4899" />
            <AnimatedSphere />
            <FloatingShapes />
            <Particles />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          </Canvas>
        </div>
        
        <motion.div
          style={{ opacity, scale }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
          >
            John Doe
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-purple-300 mb-8 h-8"
          >
            {text}<span className="animate-pulse">|</span>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Crafting beautiful, performant web experiences with modern technologies and stunning 3D animations.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
            >
              View My Work
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            >
              Get In Touch
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex gap-6 justify-center mt-12"
          >
            {[Github, Linkedin, Mail].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Icon className="w-6 h-6" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
        
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-24 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              About Me
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <p className="text-lg text-gray-300 leading-relaxed">
                  I'm a passionate developer who loves creating innovative web experiences that push the boundaries of what's possible on the web. With expertise in modern frameworks and a keen eye for design, I transform ideas into reality.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  My journey in web development started 5+ years ago, and since then, I've worked with startups and established companies to build scalable, user-centric applications that make a difference.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.
                </p>
                
                <div className="flex gap-4 mt-8">
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">5+ Years Experience</Badge>
                  <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/50">50+ Projects</Badge>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50">Award Winner</Badge>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="h-96 rounded-2xl overflow-hidden relative"
              >
                <Canvas>
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[5, 5, 5]} />
                  <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                    <Torus args={[2, 0.5, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
                      <MeshDistortMaterial
                        color="#8b5cf6"
                        distort={0.3}
                        speed={2}
                        roughness={0.2}
                      />
                    </Torus>
                  </Float>
                  <OrbitControls enableZoom={false} autoRotate />
                </Canvas>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section id="skills" className="py-24 px-6 bg-slate-950/50">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Skills & Expertise
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
              >
                <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500"
                      >
                        {skill.icon}
                      </motion.div>
                      <h3 className="text-xl font-semibold">{skill.name}</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Proficiency</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-full ${skill.color} rounded-full`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className="py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Featured Projects
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm overflow-hidden group h-full">
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-purple-300">{project.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="outline" className="border-purple-500/50 text-purple-300">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    
                    <motion.a
                      href={project.link}
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      View Project <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-slate-950/50">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Get In Touch
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-8">
                <p className="text-center text-gray-300 mb-8 text-lg">
                  Have a project in mind or just want to say hi? Feel free to reach out!
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <Input
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-slate-800/50 border-purple-500/30 focus:border-purple-500"
                    />
                  </motion.div>
                  
                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-slate-800/50 border-purple-500/30 focus:border-purple-500"
                    />
                  </motion.div>
                  
                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <Textarea
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      className="bg-slate-800/50 border-purple-500/30 focus:border-purple-500 resize-none"
                    />
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'} 🚀
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-6 border-t border-purple-500/20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-400 text-center md:text-left">
              <p>&copy; 2024 John Doe. All rights reserved.</p>
              <p className="text-sm mt-1">Built with Next.js, Three.js & Love 💜</p>
            </div>
            
            <div className="flex gap-6">
              {[Github, Linkedin, Mail].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}