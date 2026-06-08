"use client"

import Link from "next/link"
import { FiArrowRight, FiChevronDown } from "react-icons/fi"

const FEATURES = [
  { icon: "🚗", title: "Real-time GPS Tracking", desc: "Track your ride or delivery in real-time with live GPS updates" },
  { icon: "⚡", title: "Instant Matching", desc: "Get matched with the nearest driver in seconds" },
  { icon: "💳", title: "Seamless Payments", desc: "Pay with credit card, mobile money, or cash" },
  { icon: "📦", title: "Package Delivery", desc: "Send packages anywhere in the city with ease" },
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
  {
    name: "Sarah Mensah",
    role: "Regular Rider",
    text: "Glide has transformed my daily commute. Fast, reliable, and the drivers are always professional.",
    rating: 5,
  },
  {
    name: "John Adjei",
    role: "Driver Partner",
    text: "Driving with Glide gives me the flexibility to earn on my own schedule. Great platform!",
    rating: 5,
  },
  {
    name: "Esi Ofori",
    role: "Delivery User",
    text: "I use Glide Delivery for my small business. Packages always arrive on time and tracking is seamless.",
    rating: 5,
  },
]

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Your Ride, Your Way.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              Glide.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto">
            Fast, reliable rides and deliveries at your fingertips
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-primary font-bold rounded-full text-lg hover:shadow-2xl hover:scale-105 transition-all"
            >
              Get Started <FiArrowRight className="inline ml-1" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full text-lg hover:bg-white/10 transition-all"
            >
              Learn More <FiChevronDown className="inline ml-1 animate-bounce" />
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-extrabold text-primary">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Why Choose Glide?
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            Everything you need for seamless urban transportation
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
              >
                <span className="text-4xl">{f.icon}</span>
                <h3 className="text-lg font-bold text-gray-800 mt-4 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            How It Works
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            Three simple steps to get moving
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <span className="text-sm font-bold text-primary tracking-widest">{step.num}</span>
                <h3 className="text-xl font-bold text-gray-800 mt-2 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            What People Say
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            Trusted by thousands of riders and drivers
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Glide?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join thousands of happy riders and drivers today
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-white text-primary font-bold rounded-full text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Glide
              </span>
              <p className="text-sm mt-2">Your ride, your way.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/rider" className="hover:text-white transition-colors">Ride</Link></li>
                <li><Link href="/delivery" className="hover:text-white transition-colors">Delivery</Link></li>
                <li><Link href="/driver" className="hover:text-white transition-colors">Drive</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-white transition-colors cursor-pointer">About</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Blog</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Careers</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-white transition-colors cursor-pointer">Help Center</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Safety</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Terms</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-sm text-center">
            © 2024 Glide. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
