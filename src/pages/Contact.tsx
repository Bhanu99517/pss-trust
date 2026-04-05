import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

export default function Contact() {
  return (
    <div className="py-16 lg:py-24 bg-white px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-10 lg:mb-16"
      >
        Contact Us
      </motion.h2>
      
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8 lg:space-y-12"
        >
          <div className="flex gap-4 lg:gap-6">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 lg:w-6 lg:h-6 text-slate-900" />
            </div>
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-2 lg:mb-4">Phone:</h3>
              <div className="space-y-1 lg:space-y-2 text-slate-600 font-medium text-base lg:text-lg">
                <p>+91-9246106332</p>
                <p>+91-9346206332</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 lg:gap-6">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-slate-900" />
            </div>
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-2 lg:mb-4">E-mail:</h3>
              <div className="space-y-1 lg:space-y-2 text-slate-600 font-medium text-base lg:text-lg">
                <p>chairman@psstrust.org</p>
                <p>info@psstrust.org</p>
                <p>potukuchitrust@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 lg:gap-6">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-slate-900" />
            </div>
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-2 lg:mb-4">Location (Office):</h3>
              <div className="space-y-1 lg:space-y-2 text-slate-600 font-medium text-base lg:text-lg leading-relaxed">
                <p className="font-bold text-slate-900">PSS Trust:</p>
                <p>#2530/79, Watertank, Mathrusree Nagar,</p>
                <p>Miyapur, Hyderabad, Telangana 500049</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative group mt-8 lg:mt-0"
        >
          <div className="bg-slate-200 rounded-3xl overflow-hidden aspect-video shadow-2xl border-4 lg:border-8 border-white">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.0!2d78.3624744!3d17.495435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb921461526cbd%3A0x4cb154861ed67af4!2sPSS+TRUST+MIYAPUR!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute top-3 left-3 lg:top-4 lg:left-4 bg-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg shadow-md flex items-center gap-2 text-xs lg:text-sm font-bold text-blue-600">
              <a 
                href="https://maps.google.com/?cid=5526291152780032756" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Open in Maps <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
