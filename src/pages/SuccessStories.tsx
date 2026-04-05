import React from 'react';
import { motion } from 'motion/react';
import { Quote, GraduationCap, Briefcase, Award } from 'lucide-react';

const stories = [
  {
    name: "Akula Kalyani",
    education: "JNTUH Campus-ECE",
    fatherProfession: "Security guard",
    joinedYear: "2006",
    studied: "9th, 10th, Diploma, and B. Tech JNTUH",
    company: "Xilinx",
    designation: "Software Engineer 2",
    package: "20 LPA",
    siblings: "1 Elder brother physically handicapped",
    maritalStatus: "Married, Husband working as Software Engineer",
    image: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/ed1ab243-8f4b-4d5d-8b4b-7116552e3388.jpeg"
  },
  {
    name: "Sravan Kumar",
    education: "B.Tech Mechanical Engineering",
    fatherProfession: "Daily Wage Laborer",
    joinedYear: "2008",
    studied: "10th, Intermediate, and B.Tech",
    company: "Tata Motors",
    designation: "Senior Design Engineer",
    package: "15 LPA",
    siblings: "2 Younger sisters (both studying)",
    maritalStatus: "Single",
    image: "https://picsum.photos/seed/sravan/400/400"
  },
  {
    name: "Priyanka Sharma",
    education: "B.Tech Computer Science",
    fatherProfession: "Small Scale Farmer",
    joinedYear: "2010",
    studied: "Schooling, Diploma, and B.Tech",
    company: "Accenture",
    designation: "Data Analyst",
    package: "12 LPA",
    siblings: "1 Younger brother",
    maritalStatus: "Single",
    image: "https://picsum.photos/seed/priyanka/400/400"
  },
  {
    name: "Venkatesh Rao",
    education: "B.Tech Civil Engineering",
    fatherProfession: "Tailor",
    joinedYear: "2007",
    studied: "High School and B.Tech",
    company: "L&T Construction",
    designation: "Project Manager",
    package: "18 LPA",
    siblings: "No siblings",
    maritalStatus: "Married",
    image: "https://picsum.photos/seed/venkatesh/400/400"
  }
];

export default function SuccessStories() {
  return (
    <div className="min-h-screen bg-white py-16 lg:py-24 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-teal-900 mb-8">Success Stories</h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-1 w-16 bg-orange-400 rounded-full"></div>
            <GraduationCap className="w-8 h-8 text-slate-900" />
            <div className="h-1 w-16 bg-orange-400 rounded-full"></div>
          </div>
        </div>

        <div className="space-y-8">
          {stories.map((story, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 p-6 lg:p-10 w-[320px] sm:w-full pl-6 sm:pl-6 lg:p-10 ml-[-5px] sm:ml-0 mr-0"
            >
              <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-12">
                {/* Image Frame similar to the image */}
                <div className="relative w-full max-w-[320px] aspect-square shrink-0">
                  <img 
                    src={story.image} 
                    alt={story.name} 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 w-[286.4px] sm:w-full ml-[-7px] sm:ml-0">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-teal-900 mb-6 border-b border-slate-100 pb-4">
                    {story.name} ({story.education})
                  </h2>

                  <div className="flex flex-col gap-3 text-slate-800 mt-[-25px]">
                    <div className="flex items-start text-xs md:text-sm lg:text-base">
                      <span className="w-[135px] md:w-[160px] lg:w-[175px] font-medium shrink-0">• Father's Profession</span>
                      <span className="w-[10px] shrink-0">:</span>
                      <span className="flex-1">{story.fatherProfession}</span>
                    </div>
                    <div className="flex items-start text-xs md:text-sm lg:text-base">
                      <span className="w-[135px] md:w-[160px] lg:w-[175px] font-medium shrink-0">• Joined in Trust</span>
                      <span className="w-[10px] shrink-0">:</span>
                      <span className="flex-1">{story.joinedYear}</span>
                    </div>
                    <div className="flex items-start text-xs md:text-sm lg:text-base">
                      <span className="w-[135px] md:w-[160px] lg:w-[175px] font-medium shrink-0">• Studied</span>
                      <span className="w-[10px] shrink-0">:</span>
                      <span className="flex-1">{story.studied}</span>
                    </div>
                    <div className="flex items-start text-xs md:text-sm lg:text-base">
                      <span className="w-[135px] md:w-[160px] lg:w-[175px] font-medium shrink-0">• Currently Working at</span>
                      <span className="w-[10px] shrink-0">:</span>
                      <span className="flex-1">{story.company}</span>
                    </div>
                    <div className="flex items-start text-xs md:text-sm lg:text-base">
                      <span className="w-[135px] md:w-[160px] lg:w-[175px] font-medium shrink-0">• Designation</span>
                      <span className="w-[10px] shrink-0">:</span>
                      <span className="flex-1">{story.designation}</span>
                    </div>
                    <div className="flex items-start text-xs md:text-sm lg:text-base">
                      <span className="w-[135px] md:w-[160px] lg:w-[175px] font-medium shrink-0">• Package per Annum</span>
                      <span className="w-[10px] shrink-0">:</span>
                      <span className="flex-1">{story.package}</span>
                    </div>
                    <div className="flex items-start text-xs md:text-sm lg:text-base">
                      <span className="w-[135px] md:w-[160px] lg:w-[175px] font-medium shrink-0">• Siblings</span>
                      <span className="w-[10px] shrink-0">:</span>
                      <span className="flex-1">{story.siblings}</span>
                    </div>
                    <div className="flex items-start text-xs md:text-sm lg:text-base">
                      <span className="w-[135px] md:w-[160px] lg:w-[175px] font-medium shrink-0">• Marital Status</span>
                      <span className="w-[10px] shrink-0">:</span>
                      <span className="flex-1">{story.maritalStatus}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 bg-indigo-900 rounded-3xl p-8 lg:p-16 text-center text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <GraduationCap className="w-16 h-16 mx-auto mb-6 text-emerald-400" />
            <h2 className="text-2xl lg:text-4xl font-bold mb-6">Join Our Mission of Transformation</h2>
            <p className="text-indigo-100 max-w-2xl mx-auto mb-10 text-lg">
              Every success story is a testament to the power of collective support. Help us create more stories like these.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg">
                Support a Student
              </button>
              <button className="px-8 py-4 bg-indigo-700 text-white font-bold rounded-xl hover:bg-indigo-600 transition-all border border-indigo-500">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
