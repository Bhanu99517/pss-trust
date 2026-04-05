import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

const stats = [
  { number: '200+', label: 'Engineering Graduates and Employees in Reputed Organizations', color: 'text-emerald-600' },
  { number: '1,100+', label: 'Are Diploma Holders', color: 'text-emerald-600' },
  { number: '465+', label: 'Students studying Engineering and...', color: 'text-emerald-600' },
  { number: '14', label: 'We expanded to 7 branches', color: 'text-emerald-600' },
];

const supportServices = [
  "Education till the Graduation and Post Graduation",
  "One time meal, College fees, Exam fees, and Study materials",
  "Transportation Facility",
  "Provide Online and Offline Classes"
];

export default function Impact() {
  return (
    <div className="py-16 lg:py-24 bg-slate-50 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-indigo-900 mb-2">Our Impact</h2>
          <p className="text-base lg:text-lg text-slate-500 font-medium">Let the Numbers Speak</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4 lg:gap-6">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <span className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${stat.color} block mb-3 lg:mb-4`}>{stat.number}</span>
                  <div className="w-10 lg:w-12 h-1 bg-orange-400 mb-4 lg:mb-6"></div>
                  <p className="text-sm lg:text-base text-slate-700 font-medium leading-snug">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-slate-100"
          >
            <h3 className="text-xl lg:text-2xl font-bold text-indigo-900 mb-6 lg:mb-8">Our Support Services</h3>
            <ul className="space-y-4 lg:space-y-6">
              {supportServices.map((service, idx) => (
                <li key={idx} className="flex items-start gap-3 lg:gap-4">
                  <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600 shrink-0" />
                  <span className="text-base lg:text-lg text-slate-700 font-medium">{service}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
