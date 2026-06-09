"use client"

import Link from "next/link"
import { FiArrowRight, FiChevronDown, FiMapPin, FiZap, FiCreditCard, FiPackage, FiStar, FiUsers } from "react-icons/fi"

const FEATURES = [
  { icon: FiMapPin, title: "Real-time GPS Tracking", desc: "Track your ride or delivery in real-time with live GPS updates" },
  { icon: FiZap, title: "Instant Matching", desc: "Get matched with the nearest driver in seconds" },
  { icon: FiCreditCard, title: "Seamless Payments", desc: "Pay with credit card, mobile money, or cash" },
  { icon: FiPackage, title: "Package Delivery", desc: "Send packages anywhere in the city with ease" },
]

const STATS = [
  { value: "10K+", label: "Rides Completed" },
  { value: "500+", label: "Active Drivers" },
  { value: "4.8", label: "Average Rating" },
  { value: "50+", label: "Cities Covered" },
]

const STEPS = [
  { num: "01", icon: "📍", title: "Book", desc: "Enter your pickup and dropoff locations" },
  { num: "02", icon: "🚗", title: "Ride", desc: "Get matched with a nearby driver instantly" },
  { num: "03", icon: "💳", title: "Pay", desc: "Pay seamlessly with your preferred method" },
]

const TESTIMONIALS = [
  { name: "Sarah Mensah", role: "Regular Rider", text: "Glide has transformed my daily commute. Fast, reliable, and the drivers are always professional.", rating: 5 },
  { name: "John Adjei", role: "Driver Partner", text: "Driving with Glide gives me the flexibility to earn on my own schedule. Great platform!", rating: 5 },
  { name: "Esi Ofori", role: "Delivery User", text: "I use Glide Delivery for my small business. Packages always arrive on time and tracking is seamless.", rating: 5 },
]

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1120] via-[#0F172A] to-[#1E3A5F]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-sky-500 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(59,130,246,0.15) 1px, transparent 0)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Now available in Accra
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            <span className="text-white">Your Ride,</span>
            <span className="block gradient-text">Your Way.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Fast, reliable rides and deliveries at your fingertips
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group px-8 py-4 gradient-btn rounded-full text-lg inline-flex items-center gap-2 hover:scale-105 transition-all"
            >
              Get Started <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 border border-gray-700 text-gray-300 font-semibold rounded-full text-lg hover:bg-white/5 transition-all inline-flex items-center gap-2"
            >
              Learn More <FiChevronDown className="animate-bounce" />
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <FiChevronDown size={24} className="text-gray-500" />
        </div>
      </section>

      {/* Stats */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-10">
          <div className="glass-card rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-8 p-8">
            {STATS.map((stat, i) => (
              <div key={stat.label} className={`text-center ${i < 3 ? "border-r border-dark-border/50" : ""}`}>
                <p className="text-3xl md:text-4xl font-extrabold gradient-text">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <span className="text-blue-400 text-sm font-medium tracking-widest uppercase">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Why Choose Glide?</h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">Everything you need for seamless urban transportation</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="glass-card rounded-2xl p-6 hover:border-blue-500/30 transition-all hover:-translate-y-1 group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <f.icon size={24} className="text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <span className="text-blue-400 text-sm font-medium tracking-widest uppercase">Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">How It Works</h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">Three simple steps to get moving</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25 animate-float">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <span className="text-sm font-bold text-blue-400 tracking-widest">{step.num}</span>
                <h3 className="text-xl font-bold text-white mt-2 mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-blue-400 text-sm font-medium tracking-widest uppercase">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">What People Say</h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">Trusted by thousands of riders and drivers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-6 hover:border-blue-500/20 transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FiStar key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-sky-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-sky-500/10 to-blue-600/20" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Glide?</h2>
          <p className="text-gray-400 text-lg mb-8">Join thousands of happy riders and drivers today</p>
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 px-10 py-4 gradient-btn rounded-full text-lg hover:scale-105 transition-all"
          >
            Get Started Free <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-lighter border-t border-dark-border py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <span className="text-2xl font-bold gradient-text">Glide</span>
              <p className="text-sm text-gray-500 mt-2">Your ride, your way.</p>
            </div>
            {[
              { title: "Product", links: [{ label: "Ride", href: "/rider" }, { label: "Delivery", href: "/delivery" }, { label: "Drive", href: "/driver" }] },
              { title: "Company", links: [{ label: "About", href: "#" }, { label: "Blog", href: "#" }, { label: "Careers", href: "#" }] },
              { title: "Support", links: [{ label: "Help Center", href: "#" }, { label: "Safety", href: "#" }, { label: "Terms", href: "#" }] },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-gray-300 mb-3">{section.title}</h4>
                <ul className="space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-gray-500 hover:text-blue-400 transition-colors">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-dark-border pt-6 text-sm text-center text-gray-500">
            &copy; 2024 Glide. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
