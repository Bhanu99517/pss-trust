import React from 'react';
import { motion } from 'motion/react';

const TEAM_PHOTO = "https://v0-ngo-app-for-studies.vercel.app/images/trustees-group.png";

export default function About() {
  return (
    <div className="bg-white py-16 lg:py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start"
      >
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-indigo-900 mb-6 lg:mb-8">About Us</h2>
          <div className="space-y-4 lg:space-y-6 text-base lg:text-lg text-slate-600 leading-relaxed">
            <p>
              Potukuchi Somasundara Social Welfare and Charitable Trust (PSS Trust) is a registered Non-Governmental Organization (Reg No: 95/2003) established on August 15, 2003. Founded by Dr. (H.C) P. Srinivas in honor of his father, the late P. Somasundara Sastry—a distinguished recipient of the National Best Teacher Award from Andhra Pradesh—the Trust is dedicated to continuing his legacy of educational excellence and social service.
            </p>
            <p>
              Our primary focus is on children from families living below the poverty line, including children of migrant workers and daily wagers. These students often face significant socio-economic barriers that hinder their pursuit of secondary and higher education. Without timely intervention, these challenges lead to high dropout rates among boys and early marriages among girls, perpetuating a cycle of poverty. PSS Trust steps in to bridge these gaps, providing the necessary support and mentorship to ensure every child has the opportunity to reach their full potential.
            </p>
            <p>
              Over the past two decades, PSS Trust has evolved into a beacon of hope for thousands of students. We don't just provide financial aid; we offer a comprehensive support system that includes counseling, skill development, and career guidance, ensuring our students are not just educated, but also employable and empowered. Our mission is to transform BPL families from beneficiaries of government subsidies into dignified, tax-paying citizens through quality education and sustainable employment.
            </p>
          </div>

          <div className="mt-8 lg:mt-12">
            <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4">Our Mission:</h3>
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-5 lg:p-6 rounded-r-xl italic text-indigo-900 text-lg lg:text-xl">
              "The Vision and the Mission of the PSS Trust is to transform the BPL families who remain as beneficiaries of the Government subsidies to dignified Tax paying civilians through education and employment."
            </div>
          </div>
        </div>

        <div className="relative mt-8 lg:mt-0">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
            <img src={TEAM_PHOTO} alt="PSS Trust Team" className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
            <div className="p-4 lg:p-6 text-center">
              <h4 className="text-lg lg:text-xl font-bold text-indigo-900">PSS Trust Team</h4>
              <p className="text-sm lg:text-base text-indigo-600 font-medium">(Trustees & Leadership)</p>
            </div>
          </div>
          <div className="hidden lg:block absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-100 rounded-full -z-10"></div>
        </div>
      </motion.div>
    </div>
  );
}
