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
    image: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/976fd28d-8f32-435a-acea-0d4333088197.jpg"
  },
      // 1
  {
    name: "AKULA MOUNIKA ",
    education: "9th, 10th, Diploma & B.Tech",
    fatherProfession: "Auto Driver",
    joinedYear: "2006",
    studied: "10th, Intermediate, and B.Tech",
    company: "Pega Systems India",
    designation: " Software Engineer 2",
    package: "12 LPA",
    siblings: "1 Younger Sister",
    maritalStatus: " Married",
    image: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/1ed7b5aa-b66f-44c3-9447-5e8bb875a2c9.png"
  },
      // 2
   {
    name: "Ala Sravanthi",
    education: "B.Tech CBIT - ECE",
    fatherProfession: "Father is a  Tailor",
    joinedYear: "2006",
    studied: "10th, Intermediate, and B.Tech",
    company: "Bank Of America",
    designation: " Software Engineer 2",
    package: " 20 LPA",
    siblings: " 1 Elder brother physically handicapped",
    maritalStatus: "Married, Husband working as Software Engineer",
    image: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/8b530164-279c-4a82-b164-6ddfa02bcb1b.png"
  },
  // 3
   {
    name: "Ganna Swathi",
    education: "B.Tech CVSR - CIVIL",
    fatherProfession: "Deceased father was a daily wage worker",
    joinedYear: " : 2006",
    studied: "Schooling, Diploma, and B.Tech",
    company: "Rural Water Supply, Govt of Telangan",
    designation: "AE (Assistant Engineer)",
    package: " 10 LPA",
    siblings: " 1 Elder brother",
    maritalStatus: "Married, Husband working as Software Engineer",
    image: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/a026f84a-864a-4f5d-b23e-dee845a5d9f0.png"
  },
  // 4
  {
    name: "M. Swapna",
    education: "B.Tech CBIT - ECE",
    fatherProfession: "Deceased Father was a Daily wages worker",
    joinedYear: "2006",
    studied: "High School and B.Tech",
    company: "Capgemini",
    designation: " Software Engineer",
    package: "10 LPA",
    siblings: "1 Elder brother",
    maritalStatus: "Married, Husband working as Software Engineer",
    image: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/e31b1d5a-3acd-475d-a42c-1e55ed1c047b.png"
  },
      // 5
  {
    name: "MUDHIGUNDA SANGEETHA",
    education: "9th, 10th, Diploma & B.Tech",
    fatherProfession: "Daily Wage Worker",
    joinedYear: "2005",
    studied: "High School and B.Tech",
    company: " @ TCS",
    designation: " UI DEVELOPER",
    package: "13 LPA",
    siblings: "1 Elder Brother & Younger Sister",
    maritalStatus: "Married",
    image: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/55a4a666-2981-4bdc-8737-e5a5b966b211.png"
  },
      // 6
  {
    name: "Sharanamma",
    education: "B.Tech DRK - ECE",
    fatherProfession: "Father’ is a Daily wage worker",
    joinedYear: "2006",
    studied: "10th, Intermediate, and B.Tech",
    company: "Self employed",
    package: " 6 LPA",
    siblings: "  1 Younger brother",
    maritalStatus: " Married, Husband working in private company",
    image: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/8a6a2556-bf36-46b5-9d23-656807e35200.png"
  },
  // 7
  {
    name: "PUJARI NAGALAXMI",
    education: "Engineering at VNR VJIET (ECE) JNTU",
    fatherProfession: "Daily Wage Worker",
    joinedYear: "2005",
    studied: "9th, 10th, Diploma & B.Tech",
    company: "SR.ENGG @ TCS",
    package: " 12 LPA",
    siblings: " 2 Younger Sisters",
    maritalStatus: " Married",
    image: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/1c322a1f-0a20-46a5-b404-d94451f8274c.png"
  },
  // 8
  {
    name: "DOLA KUMARI",
    education: "Engineering at GRIET (CIVIL) JNTU",
    fatherProfession: "Father’ is a Daily wage worker",
    joinedYear: "2006",
    studied: "10th, Intermediate, and B.Tech",
    company: "Self employed",
    package: "6.2 LPA",
    siblings: "  1 Younger brother",
    maritalStatus: " Married",
    image: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/d021d2b9-df0d-4596-9121-c6e04b3a8e5a.png"
  },
  // 9
 {
    name: "P Chamanthi ",
    education: " IIIT Basara-ECE",
    fatherProfession: "Father is a Daily wages worker",
    joinedYear: "2007",
    studied: "10th, Intermediate, and B.Tech",
    company: "Pega Systems India",
    designation: " Software Engineer 2",
    package: "26 LPA",
    siblings: " 1 Younger sister and 1 Elder sister",
    maritalStatus: " Single",
    image: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/8d9a38bc-c471-49b8-ab12-69df98b2efa2.png"
  },
  // 10
  {
    name: "AKULA MOUNIKA",
    education: "CSE",
    fatherProfession: "Auto Driver",
    joinedYear: "2006",
    studied: "9th, 10th, Diploma & B.Tech",
    company: "SR.ENGG @ AMD",
    package: "26 LPA",
    siblings: "1 Younger Sister",
    maritalStatus: " Married",
    image: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/2b01a171-ab6e-4c90-b1e6-9df3f998795f.png"
  },
  // 11
  {
    name: "MD BHASHEERA",
    education: "Engineering at SNIST (ECE) JNTU",
    fatherProfession: "Father’ is a Daily wage worker",
    joinedYear: "2006",
    studied: "10th, diploma, and B.Tech",
    company: "Self employed",
    package: " 12 LPA",
    siblings: "1 Younger Brother & 1 Elder Sisterr",
    maritalStatus: "Single",
    image: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/a8590aec-6694-44da-84d6-ca90b19ac299.png"
  },
  // 12
  {
    name: "ALETI CHANDRASHEKAR",
    education: "Engineering at CMR (ECE) JNTU",
    fatherProfession: "Auto Driver",
    joinedYear: "2006",
    studied: "9th, 10th, Diploma & B.Tech",
    company: "SC @ PALO ALTONETWORKS ATSINGAPORE",
    package: "45 LPA",
    siblings: "1 Elder Sister & 1 Younger Brother",
    maritalStatus: " Married",
    image: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/5ad856bb-3b82-4871-9823-19f1455facd4.png"
  },
  // 13
  {
    name: "KONDAPALLY SWATHI",
    education: "Engineering at CMR (ECE)JNTU",
    fatherProfession: "Father’ is a Daily wage worker",
    joinedYear: "2006",
    studied: "10th, diploma, and B.Tech",
    company: "SW.ENGG @ CONTROL X",
    package: " 6.5 LPA",
    siblings: " 1 Younger Brother & 1 Younger Sister",
    maritalStatus: " Married",
    image: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/6d74a363-5220-40a8-b15c-bb4325b4944e.png"
  },
  // 14
  {
    name: "CHINMAMITI VANI",
    education: "Bellevue College of Nursing",
    fatherProfession: "Father’ is a Daily wage worker",
    joinedYear: "2006",
    studied: "9th, 10th, Inter Nursing",
    company: "Self employed",
    package: "4.2 LPA",
    siblings: "1 Elder Sister",
    maritalStatus: " Married",
    image: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/841e6330-ae90-4993-b69a-60c93eb4079c.png"
  },
  // 15
  {
    name: "DOLA PALGUNA",
    education: "Engineering at VNR VJIET (CIVIL) JNTUE",
    fatherProfession: "Father’ is a Daily wage worker",
    joinedYear: "2006",
    studied: "10th, diploma , and B.Tech",
    company: "QS @ AVS CONSTRUCTIONS",
    package: " 7.6 LPA",
    siblings: "1 Elder Sister",
    maritalStatus: " Married",
    image: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/6387d99f-143f-49ac-b272-9fe31bc093c5.png"
  },
  // 16
 
  // 21
  // 22
  // 23
  // 24
  // 24
  // 25
  // 26
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
              className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 p-6 lg:p-10 w-full sm:w-full pl-6 sm:pl-6 lg:p-10 mx-auto sm:mx-0"
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

                <div className="flex-1 w-full">
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
