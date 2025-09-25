import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 px-6 md:px-16 lg:px-24">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center">
        About Quickstay
      </h1>
      <p className="text-gray-600 text-lg md:text-xl mt-6 text-center max-w-3xl mx-auto">
        Quickstay is your premier destination for luxurious and exclusive
        accommodations around the world. Our mission is to provide seamless
        booking experiences for discerning travelers, whether you're seeking
        boutique hotels, lavish resorts, or unique stays that create
        unforgettable memories.
      </p>

      <div className="mt-16 grid md:grid-cols-2 gap-10 items-center">
        <img
          src={assets.abouticon}
          alt="Luxury Hotel"
          className="w-full rounded-xl shadow-lg"
        />
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Our Story
          </h2>
          <p className="text-gray-600">
            Founded with the goal of making premium stays accessible, Quicstay
            combines cutting-edge technology with personalized service. Our
            curated properties ensure comfort, safety, and a memorable
            experience every time.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800">
            Why Choose Us
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Handpicked luxury accommodations worldwide</li>
            <li>Seamless booking experience</li>
            <li>Exceptional customer service</li>
            <li>Exclusive offers for registered users</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
