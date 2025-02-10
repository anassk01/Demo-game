"use client";
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Building2, GraduationCap, Landmark, Globe, Settings, ChevronDown, Gamepad } from 'lucide-react';

// Image paths
const IMAGES = {
  hero: "/images/hero-bg.jpg",
  gamingCity: "/images/gaming-city.jpg",
  formation: "/images/formation.jpg",
  incubation: "/images/incubation.jpg",
  promotion: "/images/promotion.jpg",
  governance: "/images/governance.jpg",
  expo: "/images/expo.jpg"
};

// Parallax hook
const useParallax = (ref: React.RefObject<HTMLDivElement>, speed = 0.5) => {
    
    useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const scrolled = window.scrollY;
      const element = ref.current;
      const offset = element.offsetTop;
      const distance = scrolled - offset;
      element.style.transform = `translateY(${distance * speed}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref, speed]);
};

// Custom intersection observer hook with threshold array
const useIntersectionObserver = (
    ref: React.RefObject<HTMLDivElement>,
    options = { threshold: [0, 0.25, 0.5, 0.75, 1] }
  ) => {
  const [intersectionRatio, setIntersectionRatio] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersectionRatio(entry.intersectionRatio);
      },
      options
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref, options]);

  return intersectionRatio;
};

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  parallaxSpeed?: number;
}

const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  id,
  parallaxSpeed
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const intersectionRatio = useIntersectionObserver(sectionRef);
  
  if (parallaxSpeed) {
    useParallax(sectionRef, parallaxSpeed);
  }

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`min-h-screen py-20 relative ${className}`}
      style={{
        opacity: intersectionRatio,
        transform: `scale(${0.9 + (intersectionRatio * 0.1)})`,
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
      }}
    >
      {children}
    </section>
  );
};

interface StrategyCardProps {
  title: string;
  description: string[];
  icon: React.ElementType;
  image: string;
  color: string;
  index: number;
}

const StrategyCard: React.FC<StrategyCardProps> = ({
  title,
  description,
  icon: Icon,
  image,
  color,
  index
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const intersectionRatio = useIntersectionObserver(cardRef);

  return (
    <div
      ref={cardRef}
      className="relative group perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: `
          translateX(${(1 - intersectionRatio) * (index % 2 ? 100 : -100)}px)
          rotateY(${(1 - intersectionRatio) * (index % 2 ? 45 : -45)}deg)
        `,
        opacity: intersectionRatio,
        transition: 'all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1)'
      }}
    >
      <div className={`absolute inset-0 ${color} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl`} />
      <div className="bg-black/80 backdrop-blur-lg rounded-2xl overflow-hidden transform-gpu transition-transform duration-700 hover:scale-105">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-lg ${color} transform group-hover:scale-110 transition-transform`}>
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
          <ul className="space-y-2">
            {description.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 transform transition-all duration-300"
                style={{
                  transform: `translateX(${isHovered ? "8px" : "0"})`,
                  opacity: isHovered ? 1 : 0.7,
                  transitionDelay: `${idx * 50}ms`
                }}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${color} mt-2`} />
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const GamingStrategyMinistry: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = window.scrollY / totalScroll;
      setScrollProgress(currentProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const strategies = [
    {
      title: "Infrastructure d'Accueil",
      description: [
        "City Gaming Rabat de Création",
        "Déploiement d'une offre de service",
        "Créations d'autres zones dédiées"
      ],
      icon: Building2,
      image: IMAGES.gamingCity,
      color: "bg-blue-500"
    },
    {
      title: "Formation",
      description: [
        "Identification des formations",
        "Structuration de l'offre de formation",
        "Stratégie de déploiement"
      ],
      icon: GraduationCap,
      image: IMAGES.formation,
      color: "bg-purple-500"
    },
    {
      title: "Incubation et Soutien",
      description: [
        "Solutions de financement",
        "Attraction des investisseurs étrangers",
        "Structuration de l'incubation"
      ],
      icon: Landmark,
      image: IMAGES.incubation,
      color: "bg-pink-500"
    },
    {
      title: "Communication",
      description: [
        "Organisation du Morocco Gaming Expo",
        "Promotion nationale",
        "Promotion internationale"
      ],
      icon: Globe,
      image: IMAGES.promotion,
      color: "bg-green-500"
    },
    {
      title: "Gouvernance",
      description: [
        "Gouvernance interdépartementale",
        "Pilotage de la stratégie"
      ],
      icon: Settings,
      image: IMAGES.governance,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="bg-[#0a0a0a] text-white">
      {/* Progress bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* Hero Section */}
      <Section id="hero" className="flex items-center justify-center" parallaxSpeed={0.2}>
        <div ref={heroRef} className="absolute inset-0">
          <img
            src={IMAGES.hero}
            alt="Gaming Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
          <div className="mb-8">
            <Gamepad className="w-24 h-24 mx-auto text-purple-500 animate-float" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-gradient-text">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Stratégie du Ministère
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12">
            Pour développer l'industrie du gaming au Maroc
          </p>
          <ChevronDown className="w-12 h-12 mx-auto animate-bounce text-purple-500" />
        </div>
      </Section>

      {/* Strategies Section */}
      <Section id="strategies">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-8 [&>*:last-child]:md:col-span-2 [&>*:last-child]:md:w-[calc(50%-16px)] [&>*:last-child]:md:mx-auto">
            {strategies.map((strategy, index) => (
              <StrategyCard key={index} {...strategy} index={index} />
            ))}
          </div>
        </div>
      </Section>

      {/* Expo Section */}
      <Section id="expo" className="relative overflow-hidden" parallaxSpeed={0.3}>
        <div className="absolute inset-0">
          <img
            src={IMAGES.expo}
            alt="Morocco Gaming Expo"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Morocco Gaming Expo
            </span>
          </h2>
          <a
            href="https://moroccogamingexpo.ma"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105"
          >
            Découvrir l'événement
          </a>
        </div>
      </Section>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        @keyframes gradient-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient-text {
          background-size: 200% auto;
          animation: gradient-text 4s linear infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #9333ea, #db2777);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #a855f7, #ec4899);
        }
      `}</style>
    </div>
  );
};

export default GamingStrategyMinistry;