import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function Nav() {
  return (
    <nav className="flex w-full items-center justify-between bg-[#fcfcfc] px-10 py-[15px] border-b-2 border-[#3498db]">
       <div className="text-[32px] font-bold text-[#333333] tracking-[-1px]">
        hh<span className="text-[#2ecc71]">.</span>
      </div>
      <div className="flex gap-3">
        <a href="#" className="inline-block text-[16px] font-medium px-7 py-2.5 rounded-[25px] text-[#222222] border border-[#777777] bg-transparent transition-all duration-200 ease-in-out hover:bg-[#eeeeee]">
          Log in
        </a>
        <a href="#" className="inline-block text-[16px] font-medium px-7 py-2.5 rounded-[25px] text-white bg-[#222220] border border-[#222220] transition-all duration-200 ease-in-out hover:bg-[#333331]">
          Sign up
        </a>
      </div>
    </nav>
  )
}

function HeroSection() {
  return (
    <section className="min-h-screen w-full bg-[#fbfaf8] flex items-center justify-center p-6 md:p-12">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
        <div className="text-right flex flex-col items-end justify-center order-1">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#222222] leading-tight mb-6 tracking-tight">
            Stay<br />
            Informed,<br />
            Stay Inspired
          </h1>
          <p className="text-sm md:text-base text-[#666666] max-w-sm leading-relaxed font-light">
            Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.
          </p>
        </div>
        <div className="flex justify-center order-2">
          <div className="w-full max-w-[380px] aspect-[3/4] overflow-hidden rounded-[24px]">
          <img 
          src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg" 
          alt="Man with a cat on his shoulder in autumn forest" 
          class="w-full h-full object-cover"
          />
        </div>
     </div>

    <div className="text-left flex flex-col justify-center order-3 text-[#555555]">
      <span className="text-xs text-[#888888] uppercase tracking-wider mb-2 font-medium">-Author</span>
      <h2 className="text-2xl md:text-3xl font-bold text-[#222222] mb-4">Thompson P.</h2>
        <div className="space-y-4 text-sm md:text-base leading-relaxed font-light">
          <p>
          I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
          </p>
         <p>
          When I'm not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.
          </p>
        </div>
      </div>
    </div>
    </section>
  )
}

function App() {
  return (
    <> 
      <Nav />
      <HeroSection />
    </>
  )
}

export default App