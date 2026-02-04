'use client';

import React, { useReducer, useRef, useEffect } from 'react';
import './TiltCarousel.css';

interface Slide {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

interface SlideState {
  slideIndex: number;
}

type SlideAction = { type: 'NEXT' } | { type: 'PREV' };

interface SlideProps {
  slide: Slide;
  offset: number;
}

const slides: Slide[] = [
  {
    title: "Machu Picchu",
    subtitle: "Peru",
    description: "Adventure is never far away",
    image: "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
  },
  {
    title: "Chamonix",
    subtitle: "France",
    description: "Let your dreams come true",
    image: "https://images.unsplash.com/photo-1581836499506-4a660b39478a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
  },
  {
    title: "Mimisa Rocks",
    subtitle: "Australia",
    description: "A piece of heaven",
    image: "https://images.unsplash.com/photo-1566522650166-bd8b3e3a2b4b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
  },
  {
    title: "Four",
    subtitle: "Australia",
    description: "A piece of heaven",
    image: "https://images.unsplash.com/flagged/photo-1564918031455-72f4e35ba7a6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
  },
  {
    title: "Five",
    subtitle: "Australia",
    description: "A piece of heaven",
    image: "https://images.unsplash.com/photo-1579130781921-76e18892b57b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
  }
];

// Custom hook untuk tilt effect
function useTilt(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !active) {
      return;
    }

    const state = {
      rect: undefined as DOMRect | undefined,
      mouseX: undefined as number | undefined,
      mouseY: undefined as number | undefined
    };

    const el = ref.current;

    const handleMouseMove = (e: MouseEvent) => {
      if (!el) return;
      
      if (!state.rect) {
        state.rect = el.getBoundingClientRect();
      }
      
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
      
      const px = (state.mouseX - state.rect.left) / state.rect.width;
      const py = (state.mouseY - state.rect.top) / state.rect.height;

      el.style.setProperty("--px", px.toString());
      el.style.setProperty("--py", py.toString());
    };

    el.addEventListener("mousemove", handleMouseMove);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
    };
  }, [active]);

  return ref;
}

// Reducer untuk mengelola state slides
const slidesReducer = (state: SlideState, action: SlideAction): SlideState => {
  switch (action.type) {
    case "NEXT":
      return {
        ...state,
        slideIndex: (state.slideIndex + 1) % slides.length
      };
    case "PREV":
      return {
        ...state,
        slideIndex: state.slideIndex === 0 ? slides.length - 1 : state.slideIndex - 1
      };
    default:
      return state;
  }
};

// Komponen Slide individual
const SlideComponent: React.FC<SlideProps> = ({ slide, offset }) => {
  const active = offset === 0;
  const ref = useTilt(active);

  return (
    <div
      ref={ref}
      className="slide"
      data-active={active || undefined}
      style={{
        // @ts-ignore - CSS custom properties
        '--offset': offset,
        '--dir': offset === 0 ? 0 : offset > 0 ? 1 : -1
      }}
    >
      <div
        className="slideBackground"
        style={{
          backgroundImage: `url('${slide.image}')`
        }}
      />
      <div
        className="slideContent"
        style={{
          backgroundImage: `url('${slide.image}')`
        }}
      >
        <div className="slideContentInner">
          <h2 className="slideTitle">{slide.title}</h2>
          <h3 className="slideSubtitle">{slide.subtitle}</h3>
          <p className="slideDescription">{slide.description}</p>
        </div>
      </div>
    </div>
  );
};

// Komponen utama TiltCarousel
const TiltCarousel: React.FC = () => {
  const initialState: SlideState = {
    slideIndex: 0
  };

  const [state, dispatch] = useReducer(slidesReducer, initialState);

  return (
    <div className="slides">
      <button onClick={() => dispatch({ type: "PREV" })} aria-label="Previous slide">
        ‹
      </button>

      {[...slides, ...slides, ...slides].map((slide, i) => {
        const offset = slides.length + (state.slideIndex - i);
        return <SlideComponent slide={slide} offset={offset} key={i} />;
      })}

      <button onClick={() => dispatch({ type: "NEXT" })} aria-label="Next slide">
        ›
      </button>
    </div>
  );
};

export default TiltCarousel;
