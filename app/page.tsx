import React from 'react';
import Link from 'next/link';
import { MoveRight, Plus, Instagram, Send, MessageCircle, Pin, Video } from 'lucide-react';
import localFont from 'next/font/local';
import TopNav from './components/TopNav';
import { getAllProducts } from '@/lib/productsRepo';
import ScrollReveal from './components/ScrollReveal';

const logoTextFont = localFont({
  src: '../public/another_danger.otf',
  display: 'swap',
});

// Mock Data for Advantages & FAQs
const advantages = [
  "Official merch direction inspired by Dark Phantom visuals",
  "Limited-batch drops to keep every release rare",
  "Premium print and material quality across all pieces",
  "Fast support for order updates and sizing questions",
  "Worldwide shipping with secure checkout flow"
];

const faqs = [
  "When does the next Dark Phantom drop go live?",
  "How do I know which size to choose?",
  "Do you ship internationally?",
  "How long does order processing usually take?",
  "Will sold-out items restock?",
  "How should I wash and care for merch pieces?"
];

// Mock Data for Timeline
const timelineStages = [
  {
    title: "Drop announce\nand preview",
    align: "right",
    bullets: [
      "Dark Phantom announces the release window across socials",
      "We publish previews and product details for each item",
      "You pick your gear before the drop sells out"
    ]
  },
  {
    title: "Choose your\nmerch setup",
    align: "left",
    bullets: [
      "Pick your style, size, and preferred colorway",
      "Add your shipping info and place your order securely",
      "You get an instant confirmation after checkout"
    ]
  },
  {
    title: "Order\nprocessing",
    align: "right",
    bullets: [
      "Each order is reviewed and prepared by the team",
      "You receive status updates as your order moves forward",
      "Tracking becomes available as soon as shipment is ready"
    ]
  },
  {
    title: "Quality\ncheck",
    align: "left",
    bullets: [
      "Every item is inspected before packing",
      "Final packaging is secured for safe delivery"
    ]
  },
  {
    title: "Delivery",
    align: "right",
    bullets: [
      "Your order ships to your address with tracking",
      "You receive your Dark Phantom merch ready to wear"
    ]
  }
];

export default async function LandingPage() {
  const products = (await getAllProducts()).slice(0, 4);

  return (
    <div id="top" className="min-h-screen bg-[#f5f5f5] text-black flex flex-col font-sans overflow-x-hidden">
      
      {/* Top Navigation */}
      <TopNav />

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-start w-full h-[78vh] md:h-[95vh] bg-white overflow-hidden">
        <ScrollReveal direction="down" className="absolute inset-0 flex items-center justify-center overflow-hidden z-0 pointer-events-none">
          <h2 className={`${logoTextFont.className} w-full px-4 md:px-6 -translate-y-2 md:-translate-y-8 text-center text-[clamp(4rem,22vw,16vw)] text-[#1a1a1a] leading-[0.9] tracking-tight select-none`} style={{ transform: 'scaleY(1.25)' }}>
            ALREADY DEAD
          </h2>
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={0.2} className="relative z-10 w-full max-w-3xl h-full mt-0 flex justify-center items-start">
          <img src="/hero_pic.png" alt="Model wearing custom jeans" className="w-auto h-[96%] md:h-[108%] max-h-none object-contain object-top" />
        </ScrollReveal>
        
        {/* Adjusted to full width with px-6 padding */}
        <ScrollReveal direction="up" delay={0.4} className="absolute bottom-4 md:bottom-6 w-full px-4 md:px-6 z-20">
          <button className="w-full bg-[#1a1a1a] hover:bg-black text-white rounded-[20px] flex items-center justify-between px-6 md:px-8 py-4 md:py-5 transition-all duration-300">
            <span className="text-base md:text-lg font-medium tracking-wider">SHOP DARK PHANTOM MERCH</span>
            <MoveRight className="w-6 h-6 text-gray-400" />
          </button>
        </ScrollReveal>
      </main>

      {/* Products Section */}
      {/* Adjusted to full width with px-6 padding */}
      <section className="w-full px-4 md:px-6 mx-auto mt-8 md:mt-12 mb-14 md:mb-20 flex flex-col gap-4">
        {/* Ticker */}
        <ScrollReveal direction="left">
          <div className="w-full border-[3px] border-black rounded-xl py-3 flex overflow-hidden bg-white select-none">
            <div className="flex whitespace-nowrap text-xs font-bold tracking-[0.2em] text-black/80">
              {Array.from({ length: 15 }).map((_, i) => (
                <span key={i} className="mx-3">/ DARK PHANTOM DROP</span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* 4-Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full auto-rows-fr">
          {/* Left Sidebar (Spans 2 rows) */}
          <ScrollReveal direction="left" delay={0.1} className="relative lg:col-span-1 lg:row-span-2 border-[3px] border-black rounded-xl bg-white overflow-hidden flex items-center justify-center min-h-[500px]">
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <span className={`${logoTextFont.className} -rotate-90 text-[110px] tracking-tight text-[#1a1a1a] leading-none whitespace-nowrap`}>PHANTOM DROP</span>
             </div>
             <div className="absolute w-[70%] h-[55%] bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-300 shadow-xl opacity-95 flex items-center justify-center border-x-[2px] border-zinc-200" style={{ clipPath: 'polygon(4% 1%, 98% 3%, 96% 99%, 0% 96%)' }}>
                <div className="absolute inset-0 bg-white opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px]"></div>
                <span className={`${logoTextFont.className} -rotate-90 text-white text-5xl tracking-wide drop-shadow-md z-10`}>PHANTOM DROP</span>
             </div>
          </ScrollReveal>

          {/* Product Cards */}
          {products.map((product, index) => (
            <ScrollReveal direction="up" delay={0.1 + (index * 0.1)} key={product.id} className="border-[3px] border-black rounded-xl bg-white flex flex-col relative aspect-square lg:aspect-auto min-h-[360px] p-2 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex-1 w-full flex items-center justify-center p-6 relative bg-white rounded-t-lg">
                <img src={product.image} alt={product.title} className="max-w-full max-h-[200px] object-contain drop-shadow-sm" />
                <span className="absolute bottom-2 left-2 text-[11px] font-bold text-gray-400 tracking-wider">DROP PRICE</span>
                <Plus className="absolute bottom-2 right-2 w-5 h-5 text-gray-400 cursor-pointer hover:text-black transition-colors" />
              </div>
              <div className="pb-4 px-4 flex flex-col items-center justify-end text-center mt-auto">
                <h4 className={`${logoTextFont.className} text-[16px] tracking-wide mb-1 text-black`}>{product.title}</h4>
                <p className="text-gray-400 text-[13px] mb-1">{product.color}</p>
                <div className="text-[13px]">
                  <span className="font-bold text-black">${product.price}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}

          {/* Bottom Right CTA Card */}
          <ScrollReveal direction="right" delay={0.3} className="border-[3px] border-black rounded-xl bg-white flex items-center justify-center p-6 min-h-[360px]">
            <Link href="/catalog" className="bg-[#1a1a1a] hover:bg-black text-white rounded-xl px-6 py-4 flex items-center gap-3 transition-colors shadow-lg">
              <span className="text-sm font-semibold tracking-wider">VIEW ALL MERCH</span>
              <MoveRight className="w-5 h-5" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ & ADVANTAGES SECTION */}
      <section className="w-full bg-[#1a1a1a] py-10 md:py-16 px-4 md:px-6 flex flex-col items-center border-y-[3px] border-black">
        {/* Adjusted to full width max-w-none */}
        <ScrollReveal direction="up" className="w-full flex justify-between items-start mb-10">
          <span className="text-gray-400 font-bold tracking-widest text-sm hidden md:block mt-4">WHY US</span>
          <h2 className={`${logoTextFont.className} text-white text-4xl md:text-7xl lg:text-[6rem] tracking-tight text-center leading-[0.9] uppercase`}>DARK PHANTOM<br />STORE FAQ</h2>
          <span className="text-gray-400 font-bold tracking-widest text-sm hidden md:block mt-4">FAQ</span>
        </ScrollReveal>
        
        {/* Adjusted to full width max-w-none */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <ScrollReveal direction="left" delay={0.1} className="bg-white border-[3px] border-black rounded-2xl flex flex-col">
              <h3 className={`${logoTextFont.className} text-3xl md:text-4xl p-6 tracking-tight uppercase`}>Why Fans Choose Us</h3>
              <ul className="flex flex-col divide-y-[3px] divide-black border-t-[3px] border-black">
                {advantages.map((adv, index) => (
                  <li key={index} className="p-4 md:px-6 font-medium text-[15px] flex items-center gap-3">
                    <span className="text-gray-400 font-bold">/</span> {adv}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={0.2} className="bg-white border-[3px] border-black rounded-2xl flex flex-col">
              <h3 className={`${logoTextFont.className} text-3xl md:text-4xl p-6 tracking-tight uppercase leading-[1.1]`}>Answers to common<br />drop questions</h3>
              <ul className="flex flex-col divide-y-[3px] divide-black border-t-[3px] border-black">
                {faqs.map((faq, index) => (
                  <li key={index} className="p-4 md:px-6 font-medium text-[15px] flex justify-between items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <span>{faq}</span>
                    <Plus className="w-6 h-6 flex-shrink-0 text-black" strokeWidth={2} />
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
          <div className="flex flex-col gap-4">
            <ScrollReveal direction="right" delay={0.1} className="bg-[#a3a3a3] border-[3px] border-black rounded-2xl overflow-hidden flex-1 relative min-h-[400px] lg:min-h-full">
               <div className="absolute inset-0 w-full h-full bg-top bg-cover bg-no-repeat" style={{ backgroundImage: 'url(/faqs.png)' }} />
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2} className="bg-white border-[3px] border-black rounded-2xl p-2 md:p-3">
              <button className="w-full bg-[#1a1a1a] hover:bg-black text-white py-5 rounded-xl text-sm font-semibold tracking-wider transition-colors">NEED HELP WITH YOUR ORDER?</button>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* --- NEW STAGES OF WORK SECTION --- */}
      {/* Adjusted to full width with px-6 padding */}
      <section className="w-full px-4 md:px-6 mx-auto mt-8 md:mt-12 mb-10 md:mb-12 flex flex-col lg:flex-row gap-4">
        
        {/* Left Side: Timeline Block */}
        <div className="flex-1 bg-white border-[3px] border-black rounded-2xl relative overflow-hidden flex flex-col justify-between p-6 md:p-10 z-0">
          
          {/* Faint Background graphic */}
          <ScrollReveal direction="none" className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none z-0">
             <span className={`${logoTextFont.className} -rotate-12 text-[180px] leading-none whitespace-nowrap text-black`}>PROCESS</span>
          </ScrollReveal>

          {/* Timeline Wrapper */}
          <div className="relative z-10 max-w-4xl mx-auto w-full mb-16 mt-4">
            {/* The Center Line (Hidden on mobile, absolute center on desktop) */}
            <ScrollReveal direction="down" className="hidden md:block absolute left-1/2 top-2 bottom-2 w-0.5 bg-gray-300 transform -translate-x-1/2 z-0"></ScrollReveal>
            
            <div className="flex flex-col gap-12 relative z-10">
              {timelineStages.map((stage, i) => (
                <ScrollReveal 
                  key={i} 
                  direction={stage.align === 'left' ? 'right' : 'left'} 
                  delay={0.1}
                  className={`relative flex flex-col md:flex-row items-center w-full ${stage.align === 'left' ? 'md:justify-start' : 'md:justify-end'}`}
                >
                  <div className="hidden md:block absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-gray-400 z-10" />
                  
                  {/* Timeline Content Block */}
                  <div className={`w-full md:w-[45%] flex flex-col ${stage.align === 'left' ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} relative`}>
                    <h4 className={`${logoTextFont.className} text-2xl whitespace-pre-line mb-4 tracking-tight leading-snug`}>{stage.title}</h4>
                    <div className="text-gray-600 text-[13px] md:text-[14px] flex flex-col gap-2 font-medium">
                      {stage.bullets.map((bullet, idx) => (
                        <p key={idx} className="whitespace-pre-line leading-relaxed">
                           <span className="text-gray-400 font-bold">/</span> {bullet}
                        </p>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Catalog CTA inside Timeline */}
          <ScrollReveal direction="up" className="relative z-10 mt-auto pt-4 border-t border-gray-100">
             <Link href="/catalog" className="w-full bg-[#1a1a1a] hover:bg-black text-white rounded-[16px] px-6 py-4 flex items-center justify-between transition-colors shadow-sm">
                <span className="text-sm font-semibold tracking-wider">MERCH</span>
                <MoveRight className="w-5 h-5 text-gray-400" />
              </Link>
          </ScrollReveal>
        </div>

        {/* Right Side: Stages Duct Tape Banner */}
        <ScrollReveal direction="right" delay={0.2} className="w-full lg:w-[280px] bg-white border-[3px] border-black rounded-2xl relative overflow-hidden flex items-center justify-center min-h-[260px] md:min-h-[500px]">
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <span className={`${logoTextFont.className} rotate-90 text-[64px] md:text-[110px] tracking-tight text-[#1a1a1a] leading-none whitespace-nowrap`}>
               ORDER JOURNEY
             </span>
           </div>
           
           {/* CSS Duct Tape Graphic */}
           <div 
                className="absolute w-[88%] md:w-[85%] h-[34%] md:h-[40%] bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-300 shadow-xl opacity-95 flex items-center justify-center border-y-[2px] border-zinc-200" 
              style={{ clipPath: 'polygon(2% 4%, 99% 1%, 97% 98%, 0% 95%)' }}
           >
              <div className="absolute inset-0 bg-white opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px]"></div>
                <span className={`${logoTextFont.className} rotate-90 text-white text-[28px] md:text-4xl tracking-wide drop-shadow-md z-10 whitespace-nowrap`}>
                ORDER JOURNEY
              </span>
           </div>
        </ScrollReveal>
      </section>

      {/* --- NEW FOOTER --- */}
      {/* Adjusted to full width with px-6 padding */}
      <footer className="w-full px-4 md:px-6 mx-auto mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Column 1: Newsletter & Socials */}
        <ScrollReveal direction="up" delay={0.1} className="bg-white border-[3px] border-black rounded-2xl p-8 flex flex-col justify-between min-h-[300px]">
          <div>
            <h4 className="font-bold text-lg mb-2">Join The Drop List</h4>
            <p className="text-sm text-gray-600 mb-8 max-w-[250px]">
              Get first alerts for Dark Phantom drops, restocks, and exclusive merch news
            </p>
            <div className="w-full border-b-[2px] border-gray-300 pb-2 mb-6">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full text-sm outline-none text-black placeholder-gray-500 bg-transparent"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#1a1a1a] rounded-md flex items-center justify-center text-white hover:bg-black cursor-pointer"><MessageCircle className="w-4 h-4" /></div>
              <div className="w-8 h-8 bg-[#1a1a1a] rounded-md flex items-center justify-center text-white hover:bg-black cursor-pointer"><Pin className="w-4 h-4" /></div>
              <div className="w-8 h-8 bg-[#1a1a1a] rounded-md flex items-center justify-center text-white hover:bg-black cursor-pointer"><Instagram className="w-4 h-4" /></div>
              <div className="w-8 h-8 bg-[#1a1a1a] rounded-md flex items-center justify-center text-white hover:bg-black cursor-pointer"><Video className="w-4 h-4" /></div>
              <div className="w-8 h-8 bg-[#1a1a1a] rounded-md flex items-center justify-center text-white hover:bg-black cursor-pointer"><Send className="w-4 h-4" /></div>
            </div>
          </div>
          <div className="mt-8">
             <p className="text-xs text-gray-400 font-medium">DARK PHANTOM STORE | US 2026 All Rights Reserved</p>
          </div>
        </ScrollReveal>

        {/* Column 2: Links */}
        <ScrollReveal direction="up" delay={0.2} className="bg-white border-[3px] border-black rounded-2xl p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between cursor-pointer group">
            <h4 className="font-bold text-sm tracking-wider">ABOUT DARK PHANTOM</h4>
            <Plus className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
          </div>
          <div className="flex items-center justify-between cursor-pointer group">
            <h4 className="font-bold text-sm tracking-wider">SHIPPING AND RETURNS</h4>
            <Plus className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
          </div>
        </ScrollReveal>

        {/* Column 3: Contact & Scroll Top */}
        <ScrollReveal direction="up" delay={0.3} className="bg-white border-[3px] border-black rounded-2xl p-8 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <h4 className="font-bold text-sm tracking-wider">CONTACT SUPPORT</h4>
            <div className="flex flex-col items-end text-black">
              <Plus className="w-6 h-6" />
            </div>
          </div>
        </ScrollReveal>

      </footer>
    </div>
  );
}