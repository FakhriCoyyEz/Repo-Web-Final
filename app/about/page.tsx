"use client";

import { useEffect } from 'react'
import Link from 'next/link'
import anime from 'animejs'
import * as anime from 'animejs';
import Link from "next/link";
import { Navbar } from '@/components/navbar';
import "./style-card.css";
export default function About() {
 <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js"></script>
  return (
    <>
      <Navbar />
      <h1 className="ml5">
        <span className="text-wrapper">
          <span className="line line1"></span>
          <span className="letters letters-left">Signal</span>
          <span className="letters ampersand">&amp;</span>
          <span className="letters letters-right">Noise</span>
          <span className="line line2"></span>
        </span>
      </h1>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js"></script>
      <main className="page-content">
        <div className="card">
          <div className="content">
            <h2 className="title">Muhammad Fakhri Zabir S.</h2>
            <p className="copy">Fullstack Web Programmer</p>
            <a
              className="btn"
              href="https://github.com/FakhriCoyyEz"
              target="_blank"
            >
              My Page
            </a>
          </div>
        </div>

        <div className="card">
          <div className="content">
            <h2 className="title">Kaysan Ali</h2>
            <p className="copy">Frontend Dev.</p>
            <a
              className="btn"
              href="https://github.com/yegthu"
              target="_blank"
            >
              My Page
            </a>
          </div>
        </div>

        <script src="/app/about/script-card.js"></script>
      </main>
    </>
  );
}
