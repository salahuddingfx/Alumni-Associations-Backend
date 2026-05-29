/**
 * 🌱 PRACTON ALUMNI ASSOCIATION — DATABASE SEED SCRIPT
 * 
 * Seeds: Settings (general, hero slides, timeline, advisors),
 *        Events, Notices, Committee Members, Blogs
 * 
 * Run with: node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Setting = require('../models/setting.model');
const Event = require('../models/event.model');
const Notice = require('../models/notice.model');
const Committee = require('../models/committee.model');
const Blog = require('../models/blog.model');
const Partner = require('../models/partner.model');

// ─── SETTINGS DATA ─────────────────────────────────────────────────────────────

const generalSettings = {
  key: 'general_settings',
  value: {
    schoolNameEn: 'Dhuapalong Govt. Primary School',
    schoolNameBn: 'ধোয়াপালং সরকারি প্রাথমিক বিদ্যালয়',
    siteTitleEn: 'Practon Alumni Association',
    siteTitleBn: 'প্রাক্তন শিক্ষার্থী পরিষদ',
    email: 'info@practonalumni.org',
    phone: '+880 1711 234567',
    addressEn: 'Dhuapalong, Ukhia, Cox\'s Bazar, Bangladesh',
    addressBn: 'ধোয়াপালং, উখিয়া, কক্সবাজার, বাংলাদেশ',
    facebook: 'https://facebook.com/practonalumni',
    linkedin: 'https://linkedin.com/company/practonalumni',
    youtube: 'https://youtube.com/@practonalumni',
    introVideoUrl: 'https://www.youtube.com/embed/9ycVq2kU7L0',
    bkash: '+880 1711 234567',
    nagad: '+880 1811 234567',
    rocket: '+880 1911 234567',
    eventDefaultFee: 1500,
    eventBatchFees: [
      { batches: '2000, 2001, 2002', fee: 800 },
      { batches: '2003, 2004, 2005', fee: 1000 },
      { batches: '2006, 2007, 2008', fee: 1200 },
      { batches: '2009, 2010, 2011', fee: 1500 },
    ],
    digitalFeeType: 'percentage',
    digitalFeeValue: 2,
  }
};

const heroSlides = {
  key: 'hero_slides',
  value: {
    slides: [
      {
        titleEn: 'Welcome to Practon Alumni Association',
        titleBn: 'প্রাক্তন শিক্ষার্থী পরিষদে আপনাকে স্বাগতম',
        subtitleEn: 'Connecting generations of Dhuapalong Primary School alumni across the globe.',
        subtitleBn: 'ধোয়াপালং প্রাথমিক বিদ্যালয়ের সকল প্রাক্তন শিক্ষার্থীদের একত্রিত করার প্রয়াস।',
        btnTextEn: 'Join Our Community',
        btnTextBn: 'আমাদের সাথে যোগ দিন',
        image: '',
      },
      {
        titleEn: 'Grand Alumni Reunion 2026',
        titleBn: 'বার্ষিক প্রাক্তন পুনর্মিলনী ২০২৬',
        subtitleEn: 'The biggest gathering of alumni families — save the date for December 2026!',
        subtitleBn: 'সকল প্রাক্তনদের মহামিলনমেলা — ডিসেম্বর ২০২৬ তারিখ মনে রাখুন!',
        btnTextEn: 'View Events',
        btnTextBn: 'ইভেন্ট দেখুন',
        image: '',
      },
      {
        titleEn: 'Welfare & Scholarship Fund',
        titleBn: 'কল্যাণ ও বৃত্তি তহবিল',
        subtitleEn: 'We support our fellow alumni and meritorious current students in times of need.',
        subtitleBn: 'বিপদে পড়া সদস্য ও মেধাবী শিক্ষার্থীদের পাশে থাকার অঙ্গীকার।',
        btnTextEn: 'Donate Now',
        btnTextBn: 'অনুদান দিন',
        image: '',
      }
    ]
  }
};

const timelineEvents = {
  key: 'timeline_events',
  value: {
    events: [
      {
        year: 'January 2025',
        titleEn: 'Foundation & Setup',
        titleBn: 'সংগঠনের শুভ সূচনা',
        descEn: 'The initial foundation of Practon Alumni Association was laid with a historic inaugural meeting of core founding members.',
        descBn: 'আমাদের সকল প্রাক্তন শিক্ষার্থীদের ঐক্যবদ্ধ করার লক্ষ্যে পরিষদের আনুষ্ঠানিকভাবে যাত্রা ও ভিত্তিপ্রস্তর স্থাপন।'
      },
      {
        year: 'Eid-ul-Adha 2025',
        titleEn: 'First Reunion & Meetup',
        titleBn: 'প্রথম পুনর্মিলনী ও গেট-টুগেদার',
        descEn: 'Our first historic grand reunion and meetup held during the festive season of Eid-ul-Adha, bringing smiles to many faces.',
        descBn: 'পবিত্র ঈদুল আজহার বরকতময় ছুটিতে আমাদের প্রথম ঐতিহাসিক পুনর্মিলনী ও সবার সাথে এক প্রাণবন্ত মিটআপ।'
      },
      {
        year: 'September 2025',
        titleEn: 'Advisory Panel Selection',
        titleBn: 'উপদেষ্টা পরিষদ ও আহ্বায়ক কমিটি গঠন',
        descEn: 'Selection of our respected advisory panel and operational core committee to guide the association\'s direction.',
        descBn: 'সংগঠনের সঠিক দিকনির্দেশনা ও দৈনন্দিন কার্যক্রম পরিচালনায় সম্মানিত উপদেষ্টা পরিষদ গঠন।'
      },
      {
        year: 'December 2025',
        titleEn: 'Constitution Drafted',
        titleBn: 'খসড়া গঠনতন্ত্র অনুমোদন',
        descEn: 'Formulation and approval of the association constitution to guide operations transparently and democratically.',
        descBn: 'পরিষদকে নিয়মতান্ত্রিক ও স্বচ্ছ উপায়ে পরিচালনার লক্ষ্যে খসড়া গঠনতন্ত্র প্রণয়ন ও সদস্যদের অনুমোদন।'
      },
      {
        year: 'January 2026',
        titleEn: 'Alumni Welfare Fund',
        titleBn: 'কল্যাণ ও সেবা তহবিল চালুকরণ',
        descEn: 'Established welfare funds to support batchmates and meritorious current students in emergency scenarios.',
        descBn: 'বিপদে পড়া প্রাক্তন সদস্য এবং মেধাবী ছাত্র-ছাত্রীদের তাৎক্ষণিক সাহায্যার্থে বিশেষ কল্যাণ তহবিল গঠন।'
      },
      {
        year: 'March 2026',
        titleEn: 'Global Network Connect',
        titleBn: 'গ্লোবাল মেম্বার ডিরেক্টরি',
        descEn: 'Initiated the registration phase to catalog directory profiles of members residing across Bangladesh and the globe.',
        descBn: 'সারা বিশ্বে ছড়িয়ে থাকা সদস্যদের এক ছাদের নিচে আনতে বৈশ্বিক মেম্বার ডিরেক্টরি চালুকরণ।'
      },
      {
        year: 'May 2026',
        titleEn: 'MERN Stack Web Portal',
        titleBn: 'ডিজিটাল ওয়েব পোর্টাল উদ্বোধন',
        descEn: 'Salah Uddin Kader (Dpian) engineered the modern, secure MERN Stack digital platform to connect all alumni online.',
        descBn: 'সালাহ উদ্দিন কাদের (Dpian) কর্তৃক আধুনিক ও সিকিউরড এমইআরএন স্ট্যাক ডিজিটাল প্ল্যাটফর্মের ডিজাইন ও কোডিং।'
      },
      {
        year: 'December 2026',
        titleEn: 'Grand Reunion Planning',
        titleBn: 'বার্ষিক গ্র্যান্ড রিইউনিয়ন পরিকল্পনা',
        descEn: 'Finalizing structural blueprints for the grand annual reunion ceremony to bring all alumni together once again.',
        descBn: 'পরবর্তী চমৎকার ও জাঁকজমকপূর্ণ বার্ষিক পুনর্মিলনী মিলনমেলার সুনির্দিষ্ট পরিকল্পনা ও রূপরেখা নির্ধারণ।'
      }
    ]
  }
};

const advisorMessages = {
  key: 'advisor_messages',
  value: {
    advisors: [
      {
        titleEn: 'Message from the Chief Advisor',
        titleBn: 'প্রধান উপদেষ্টার বাণী',
        messageEn: '"The bond between alumni is a priceless treasure. Through this association, I hope every graduate will find their roots, reconnect with their past, and build a prosperous future for our beloved school and community."',
        messageBn: '"প্রাক্তন শিক্ষার্থীদের বন্ধন একটি অমূল্য সম্পদ। এই পরিষদের মাধ্যমে প্রতিটি গ্র্যাজুয়েট যেন তাদের শিকড়ের সাথে পুনরায় সংযুক্ত হতে এবং আমাদের প্রিয় বিদ্যালয় ও সমাজের জন্য একটি সমৃদ্ধ ভবিষ্যৎ গড়তে পারে।"',
        nameEn: 'Prof. Dr. Abdul Karim Chowdhury',
        nameBn: 'অধ্যাপক ড. আব্দুল করিম চৌধুরী',
        roleEn: 'Chief Advisor',
        roleBn: 'প্রধান উপদেষ্টা'
      },
      {
        titleEn: 'Message from the President',
        titleBn: 'সভাপতির বার্তা',
        messageEn: '"This association is built on the foundation of love, unity and shared memories. I invite every alumnus to actively participate and contribute to our collective mission of giving back to our roots."',
        messageBn: '"প্রাক্তন পরিষদ শুধু একটি সংগঠন নয়, এটি ভালোবাসা ও ঐক্যের উপর গড়ে ওঠা একটি আন্দোলন। আসুন সবাই একসাথে আমাদের বিদ্যালয় ও সমাজকে আরও উন্নত করি।"',
        nameEn: 'Engr. Md. Ashraful Islam',
        nameBn: 'ইঞ্জিনিয়ার মোঃ আশরাফুল ইসলাম',
        roleEn: 'President',
        roleBn: 'সভাপতি'
      },
      {
        titleEn: 'Message from the General Secretary',
        titleBn: 'সাধারণ সম্পাদকের বার্তা',
        messageEn: '"Our shared memories from Dhuapalong Primary School are the threads that bind us together. Let us weave a stronger network through active participation, collaboration and mutual support."',
        messageBn: '"ধোয়াপালং প্রাথমিক বিদ্যালয়ে কাটানো দিনগুলো আমাদের একে অপরের সাথে গভীরভাবে যুক্ত করে। সক্রিয় অংশগ্রহণ ও পারস্পরিক সহযোগিতার মাধ্যমে আমরা একটি শক্তিশালী নেটওয়ার্ক গড়ে তুলব।"',
        nameEn: 'Md. Salimullah',
        nameBn: 'মোঃ সালিমুল্লাহ',
        roleEn: 'General Secretary',
        roleBn: 'সাধারণ সম্পাদক'
      }
    ]
  }
};

// ─── EVENTS DATA ──────────────────────────────────────────────────────────────

const events = [
  {
    title: {
      en: 'Grand Alumni Reunion 2026 — Homecoming Gala Night',
      bn: 'বার্ষিক প্রাক্তন পুনর্মিলনী ২০২৬ — হোমকামিং গালা নাইট'
    },
    description: {
      en: 'The most awaited event of the year — our Grand Annual Alumni Reunion brings together hundreds of graduates from all batches for an unforgettable evening of celebration, networking, and nostalgia. Enjoy cultural programs, award ceremonies, delicious dinner, and batch photo sessions. All alumni and their families are welcome!',
      bn: 'বছরের সবচেয়ে প্রতীক্ষিত অনুষ্ঠান — বার্ষিক প্রাক্তন পুনর্মিলনীতে সকল ব্যাচের শত শত গ্র্যাজুয়েট একত্রিত হবে স্মরণীয় এক সন্ধ্যার জন্য। সাংস্কৃতিক অনুষ্ঠান, পুরস্কার বিতরণী, রাতের ভোজ এবং ব্যাচ ফটো সেশনে অংশ নিন। সকল প্রাক্তন ও তাদের পরিবার আমন্ত্রিত!'
    },
    date: new Date('2026-12-26T18:00:00.000Z'),
    location: {
      en: 'Dhuapalong Community Hall, Cox\'s Bazar',
      bn: 'ধোয়াপালং কমিউনিটি হল, কক্সবাজার'
    },
    category: 'reunion',
    capacity: 500,
    isFeatured: true,
    banner: '',
  },
  {
    title: {
      en: 'Eid Reunion & Summer Meetup 2026',
      bn: 'ঈদ পুনর্মিলনী ও সামার মিটআপ ২০২৬'
    },
    description: {
      en: 'Celebrate Eid with your school family! Join us for our annual Eid gathering — an informal meetup where alumni reconnect over food, fun, and memories. Open to all batches. No registration fee for this event.',
      bn: 'আপনার স্কুল পরিবারের সাথে ঈদ উদযাপন করুন! আমাদের বার্ষিক ঈদ মিটআপে যোগ দিন — একটি অনানুষ্ঠানিক আড্ডায় খাবার ও মজার মাধ্যমে পুরনো বন্ধুদের সাথে স্মৃতিচারণ। সকল ব্যাচের জন্য উন্মুক্ত।'
    },
    date: new Date('2026-06-15T11:00:00.000Z'),
    location: {
      en: 'Dhuapalong Government Primary School Premises',
      bn: 'ধোয়াপালং সরকারি প্রাথমিক বিদ্যালয় প্রাঙ্গণ'
    },
    category: 'social',
    capacity: 200,
    isFeatured: true,
    banner: '',
  },
  {
    title: {
      en: 'Alumni Career & Tech Seminar 2026',
      bn: 'প্রাক্তনী ক্যারিয়ার ও প্রযুক্তি সেমিনার ২০২৬'
    },
    description: {
      en: 'A professional development seminar featuring alumni who have excelled in their careers. Sessions will cover topics including entrepreneurship, digital skills, overseas opportunities, and financial planning. Perfect for students and young alumni.',
      bn: 'নিজ কর্মক্ষেত্রে সফল প্রাক্তনীদের নিয়ে একটি পেশাদার উন্নয়ন সেমিনার। উদ্যোক্তা, ডিজিটাল দক্ষতা, বিদেশে সুযোগ এবং আর্থিক পরিকল্পনা বিষয়ে আলোচনা থাকবে। শিক্ষার্থী এবং তরুণ প্রাক্তনীদের জন্য আদর্শ।'
    },
    date: new Date('2026-09-10T09:00:00.000Z'),
    location: {
      en: 'Ukhia Upazila Parishad Conference Hall',
      bn: 'উখিয়া উপজেলা পরিষদ সম্মেলন কক্ষ'
    },
    category: 'seminar',
    capacity: 150,
    isFeatured: false,
    banner: '',
  }
];

// ─── NOTICES DATA ──────────────────────────────────────────────────────────────

const notices = [
  {
    title: {
      en: 'Registration Open — Grand Annual Reunion 2026',
      bn: 'রেজিস্ট্রেশন চালু — বার্ষিক প্রাক্তন পুনর্মিলনী ২০২৬'
    },
    content: {
      en: 'Registration for the Grand Annual Alumni Reunion 2026 is now officially open! All alumni are requested to register as early as possible to secure their seats. The event will be held on December 26, 2026 at Dhuapalong Community Hall. Limited seats available. Registration deadline: December 10, 2026.',
      bn: 'বার্ষিক প্রাক্তন পুনর্মিলনী ২০২৬-এ নিবন্ধন এখন আনুষ্ঠানিকভাবে চালু হয়েছে! সকল প্রাক্তনীকে আসন নিশ্চিত করতে দ্রুত নিবন্ধন করার অনুরোধ করা হচ্ছে। অনুষ্ঠানটি ২৬ ডিসেম্বর ২০২৬ তারিখে ধোয়াপালং কমিউনিটি হলে অনুষ্ঠিত হবে। আসন সংখ্যা সীমিত। নিবন্ধনের শেষ তারিখ: ১০ ডিসেম্বর ২০২৬।'
    },
    priority: 'high',
    isSticky: true,
    isPublished: true,
    publishDate: new Date('2026-05-01T00:00:00.000Z'),
    targetBatch: '',
    targetChapter: ''
  },
  {
    title: {
      en: 'Member Verification — Submit Your Profile Today',
      bn: 'সদস্য যাচাইকরণ — আজই আপনার প্রোফাইল জমা দিন'
    },
    content: {
      en: 'All registered members are requested to complete their online profile on the portal. Your profile requires verification by the administration team before you can access all member benefits including the digital ID card, event registration, and directory listing. Please log in to your dashboard and complete all required fields.',
      bn: 'সকল নিবন্ধিত সদস্যদের পোর্টালে তাদের অনলাইন প্রোফাইল সম্পূর্ণ করার অনুরোধ জানানো হচ্ছে। ডিজিটাল আইডি কার্ড, ইভেন্ট রেজিস্ট্রেশন এবং ডিরেক্টরি তালিকাসহ সমস্ত সদস্য সুবিধা পেতে প্রশাসন দলের যাচাইকরণ প্রয়োজন। আপনার ড্যাশবোর্ডে লগইন করে সমস্ত প্রয়োজনীয় ফিল্ড পূরণ করুন।'
    },
    priority: 'high',
    isSticky: true,
    isPublished: true,
    publishDate: new Date('2026-05-15T00:00:00.000Z'),
    targetBatch: '',
    targetChapter: ''
  },
  {
    title: {
      en: 'Welfare Fund Donation Drive — May 2026',
      bn: 'কল্যাণ তহবিল অনুদান সংগ্রহ — মে ২০২৬'
    },
    content: {
      en: 'Our annual welfare fund donation drive is underway. This year, we aim to collect donations to support 10 meritorious students from current batches with educational scholarships and provide emergency assistance to 3 alumni families in need. Every contribution matters. Please donate via bKash, Nagad, or through the portal.',
      bn: 'আমাদের বার্ষিক কল্যাণ তহবিল অনুদান সংগ্রহ চলছে। এ বছর আমরা বর্তমান ব্যাচের ১০ জন মেধাবী শিক্ষার্থীকে শিক্ষা বৃত্তি এবং ৩টি অসহায় প্রাক্তনী পরিবারকে জরুরি সহায়তা প্রদানের লক্ষ্যমাত্রা নির্ধারণ করেছি। প্রতিটি অবদানই গুরুত্বপূর্ণ। বিকাশ, নগদ বা পোর্টালের মাধ্যমে অনুদান দিন।'
    },
    priority: 'medium',
    isSticky: false,
    isPublished: true,
    publishDate: new Date('2026-05-20T00:00:00.000Z'),
    targetBatch: '',
    targetChapter: ''
  },
  {
    title: {
      en: 'Eid Meetup 2026 — Date Confirmed',
      bn: 'ঈদ মিটআপ ২০২৬ — তারিখ নিশ্চিত'
    },
    content: {
      en: 'The Eid Reunion & Summer Meetup 2026 has been confirmed for June 15, 2026 at the school premises. This will be a casual gathering — no formal registration required. Bring your family and enjoy a day of fun, food, and nostalgia. Lunch will be provided. Do share this notice with fellow alumni.',
      bn: 'ঈদ পুনর্মিলনী ও সামার মিটআপ ২০২৬ ১৫ জুন ২০২৬ তারিখে বিদ্যালয় প্রাঙ্গণে নিশ্চিত করা হয়েছে। এটি একটি অনানুষ্ঠানিক আড্ডা — কোনো আনুষ্ঠানিক নিবন্ধনের প্রয়োজন নেই। আপনার পরিবার নিয়ে আসুন এবং আনন্দ, খাবার ও স্মৃতিময় একটি দিন উপভোগ করুন। দুপুরের খাবার প্রদান করা হবে।'
    },
    priority: 'medium',
    isSticky: false,
    isPublished: true,
    publishDate: new Date('2026-05-22T00:00:00.000Z'),
    targetBatch: '',
    targetChapter: ''
  },
  {
    title: {
      en: 'New Website Portal — Announcement & Guide',
      bn: 'নতুন ওয়েবসাইট পোর্টাল — ঘোষণা ও গাইড'
    },
    content: {
      en: 'We are proud to announce the official launch of the Practon Alumni Association web portal — a modern, secure platform built for all alumni. You can now register as a member, view your digital ID card, register for events, donate to the welfare fund, read news and announcements, and much more. Visit the website and create your account today!',
      bn: 'আমরা গর্বের সাথে জানাচ্ছি যে প্রাক্তন শিক্ষার্থী পরিষদের অফিসিয়াল ওয়েব পোর্টাল চালু হয়েছে — সকল প্রাক্তনীর জন্য তৈরি একটি আধুনিক ও সুরক্ষিত প্ল্যাটফর্ম। এখন আপনি সদস্য হিসেবে নিবন্ধন, ডিজিটাল আইডি কার্ড দেখা, ইভেন্টে রেজিস্ট্রেশন, কল্যাণ তহবিলে অনুদান এবং আরও অনেক কিছু করতে পারবেন।'
    },
    priority: 'low',
    isSticky: false,
    isPublished: true,
    publishDate: new Date('2026-05-28T00:00:00.000Z'),
    targetBatch: '',
    targetChapter: ''
  }
];

// ─── COMMITTEE MEMBERS DATA ────────────────────────────────────────────────────

const committeeMembers = [
  {
    name: { en: 'Prof. Dr. Abdul Karim Chowdhury', bn: 'অধ্যাপক ড. আব্দুল করিম চৌধুরী' },
    role: { en: 'Chief Advisor', bn: 'প্রধান উপদেষ্টা' },
    type: 'advisor',
    priority: 1,
    image: '',
    socialLinks: { facebook: '', linkedin: '', email: 'chief.advisor@practonalumni.org' },
    isActive: true,
  },
  {
    name: { en: 'Md. Nurul Alam', bn: 'মোঃ নুরুল আলম' },
    role: { en: 'Senior Advisor', bn: 'সিনিয়র উপদেষ্টা' },
    type: 'advisor',
    priority: 2,
    image: '',
    socialLinks: { facebook: '', linkedin: '', email: '' },
    isActive: true,
  },
  {
    name: { en: 'Engr. Md. Ashraful Islam', bn: 'ইঞ্জিনিয়ার মোঃ আশরাফুল ইসলাম' },
    role: { en: 'President', bn: 'সভাপতি' },
    type: 'president',
    priority: 1,
    image: '',
    socialLinks: { facebook: 'https://facebook.com', linkedin: '', email: 'president@practonalumni.org' },
    isActive: true,
  },
  {
    name: { en: 'Md. Salimullah', bn: 'মোঃ সালিমুল্লাহ' },
    role: { en: 'General Secretary', bn: 'সাধারণ সম্পাদক' },
    type: 'secretary',
    priority: 1,
    image: '',
    socialLinks: { facebook: 'https://facebook.com', linkedin: '', email: 'secretary@practonalumni.org' },
    isActive: true,
  },
  {
    name: { en: 'Md. Rafiqul Islam', bn: 'মোঃ রফিকুল ইসলাম' },
    role: { en: 'Joint Secretary', bn: 'যুগ্ম সম্পাদক' },
    type: 'executive',
    priority: 2,
    image: '',
    socialLinks: { facebook: '', linkedin: '', email: '' },
    isActive: true,
  },
  {
    name: { en: 'Md. Kamal Hossain', bn: 'মোঃ কামাল হোসেন' },
    role: { en: 'Treasurer', bn: 'কোষাধ্যক্ষ' },
    type: 'executive',
    priority: 3,
    image: '',
    socialLinks: { facebook: '', linkedin: '', email: '' },
    isActive: true,
  },
  {
    name: { en: 'Md. Sohel Rana', bn: 'মোঃ সোহেল রানা' },
    role: { en: 'Organizing Secretary', bn: 'সাংগঠনিক সম্পাদক' },
    type: 'executive',
    priority: 4,
    image: '',
    socialLinks: { facebook: '', linkedin: '', email: '' },
    isActive: true,
  },
  {
    name: { en: 'Salah Uddin Kader (Dpian)', bn: 'সালাহ উদ্দিন কাদের (দ্বীপান)' },
    role: { en: 'ICT & Digital Secretary', bn: 'তথ্যপ্রযুক্তি ও ডিজিটাল সম্পাদক' },
    type: 'executive',
    priority: 5,
    image: '',
    socialLinks: { facebook: 'https://facebook.com', linkedin: 'https://linkedin.com', email: 'ict@practonalumni.org' },
    isActive: true,
  },
  {
    name: { en: 'Md. Jubayer Ahmed', bn: 'মোঃ জুবায়ের আহমেদ' },
    role: { en: 'Cultural Secretary', bn: 'সাংস্কৃতিক সম্পাদক' },
    type: 'executive',
    priority: 6,
    image: '',
    socialLinks: { facebook: '', linkedin: '', email: '' },
    isActive: true,
  },
  {
    name: { en: 'Nusrat Jahan', bn: 'নুসরাত জাহান' },
    role: { en: 'Women Affairs Secretary', bn: 'মহিলা বিষয়ক সম্পাদক' },
    type: 'executive',
    priority: 7,
    image: '',
    socialLinks: { facebook: '', linkedin: '', email: '' },
    isActive: true,
  }
];

// ─── BLOG POSTS DATA ───────────────────────────────────────────────────────────

const blogs = [
  {
    title: {
      en: 'Memories That Never Fade: A Tribute to Our School Days',
      bn: 'যে স্মৃতি কখনো মুছে যায় না: আমাদের স্কুল জীবনের প্রতি শ্রদ্ধার্ঘ'
    },
    content: {
      en: `The corridors of Dhuapalong Government Primary School hold more than just lessons — they hold decades of laughter, friendship, and dreams. For many of us, those years were the most formative of our lives. The smell of chalk dust, the sound of the school bell, the Saturday morning assembly — these are memories that alumni carry across continents.\n\nThe Practon Alumni Association was born out of this longing — a desire to reconnect, to remember, and to give back. As we grow this community, we invite every alumnus to share their stories, their successes, and most importantly, their presence.`,
      bn: `ধোয়াপালং সরকারি প্রাথমিক বিদ্যালয়ের করিডোরগুলো শুধু পাঠ্যক্রম ধারণ করে না — এগুলো ধারণ করে দশকের পর দশকের হাসি, বন্ধুত্ব এবং স্বপ্ন। আমাদের অনেকের জন্য, সেই বছরগুলো ছিল জীবনের সবচেয়ে গঠনমূলক। চকের ধুলোর গন্ধ, স্কুলের ঘণ্টার শব্দ, শনিবার সকালের অ্যাসেম্বলি — এই স্মৃতিগুলো প্রাক্তনীরা বিশ্বের এক প্রান্ত থেকে আরেক প্রান্তে বহন করে চলে।\n\nপ্রাক্তন পরিষদ এই আকুলতা থেকেই জন্ম নিয়েছে — পুনরায় সংযুক্ত হওয়ার, স্মরণ করার এবং ফিরিয়ে দেওয়ার ইচ্ছা থেকে।`
    },
    slug: 'memories-that-never-fade-school-days',
    author: 'Salah Uddin Kader',
    category: 'memories',
    readTime: 4,
    isFeatured: true,
    thumbnail: ''
  },
  {
    title: {
      en: 'How Alumni Networks Can Transform Lives and Communities',
      bn: 'কিভাবে প্রাক্তনী নেটওয়ার্ক জীবন ও সমাজকে বদলে দিতে পারে'
    },
    content: {
      en: `Strong alumni networks are not just about nostalgia — they are powerful engines of opportunity and community development. Across the world, alumni associations have helped graduates find jobs, launch businesses, access scholarships, and support each other through hardship.\n\nThe Practon Alumni Association aims to be exactly that kind of network. Through our digital platform, committee structure, events, and welfare fund, we are building infrastructure that can create real, measurable impact for every member and for the broader Dhuapalong community.`,
      bn: `শক্তিশালী প্রাক্তনী নেটওয়ার্ক শুধু স্মৃতিচারণের জায়গা নয় — এগুলো সুযোগ ও সমাজ উন্নয়নের শক্তিশালী ইঞ্জিন। সারা বিশ্বে, প্রাক্তনী সংগঠনগুলো গ্র্যাজুয়েটদের চাকরি খুঁজে পেতে, ব্যবসা শুরু করতে, বৃত্তি পেতে এবং কঠিন সময়ে একে অপরকে সমর্থন করতে সাহায্য করেছে।\n\nপ্রাক্তন পরিষদ ঠিক সেই ধরনের নেটওয়ার্ক হওয়ার লক্ষ্য রাখে। আমাদের ডিজিটাল প্ল্যাটফর্ম, কমিটি কাঠামো, ইভেন্ট এবং কল্যাণ তহবিলের মাধ্যমে আমরা এমন অবকাঠামো তৈরি করছি যা প্রতিটি সদস্য এবং বৃহত্তর ধোয়াপালং সম্প্রদায়ের জন্য বাস্তব প্রভাব তৈরি করতে পারে।`
    },
    slug: 'how-alumni-networks-transform-lives',
    author: 'Editorial Team',
    category: 'news',
    readTime: 5,
    isFeatured: true,
    thumbnail: ''
  },
  {
    title: {
      en: 'The Digital Alumni Portal — A New Era for Our Association',
      bn: 'ডিজিটাল প্রাক্তনী পোর্টাল — আমাদের পরিষদের নতুন যুগ'
    },
    content: {
      en: `We are thrilled to announce the launch of the Practon Alumni Association digital portal — a state-of-the-art platform designed to serve thousands of alumni efficiently and securely. Built with modern MERN Stack technology by our very own ICT Secretary Salah Uddin Kader (Dpian), the portal features member profiles, digital ID cards, event management, donation systems, notice boards, and much more.\n\nThis is just the beginning. Over the coming months, we will be rolling out new features including batch WhatsApp group integrations, GPS chapter mapping, alumni achievement spotlights, and scholarship application portals. Stay tuned!`,
      bn: `আমরা প্রাক্তন শিক্ষার্থী পরিষদের ডিজিটাল পোর্টাল লঞ্চের ঘোষণা দিতে পেরে অত্যন্ত আনন্দিত। আমাদের নিজস্ব আইসিটি সম্পাদক সালাহ উদ্দিন কাদের (দ্বীপান) কর্তৃক আধুনিক এমইআরএন স্ট্যাক প্রযুক্তি দিয়ে নির্মিত এই প্ল্যাটফর্মে রয়েছে সদস্য প্রোফাইল, ডিজিটাল আইডি কার্ড, ইভেন্ট ম্যানেজমেন্ট, ডোনেশন সিস্টেম, নোটিশ বোর্ড এবং আরও অনেক কিছু।\n\nএটি শুধু শুরু। আগামী মাসগুলোতে আমরা ব্যাচ হোয়াটসঅ্যাপ গ্রুপ ইন্টিগ্রেশন, জিপিএস চ্যাপ্টার ম্যাপিং, প্রাক্তনীদের অর্জনের গল্প এবং বৃত্তি আবেদন পোর্টালসহ নতুন ফিচার চালু করব।`
    },
    slug: 'digital-alumni-portal-new-era',
    author: 'Salah Uddin Kader',
    category: 'announcement',
    readTime: 3,
    isFeatured: false,
    thumbnail: ''
  }
];

// ─── PARTNERS DATA ─────────────────────────────────────────────────────────────

const partners = [
  {
    name: {
      en: 'Dhuapalong Union Parishad',
      bn: 'ধোয়াপালং ইউনিয়ন পরিষদ'
    },
    logo: '/uploads/partner_union_parishad.png',
    type: 'local_gov',
    website: 'https://dhuapalongup.coxsbazar.gov.bd',
    isActive: true,
    priority: 1
  },
  {
    name: {
      en: 'Ukhia Development Forum',
      bn: 'উখিয়া ডেভেলপমেন্ট ফোরাম'
    },
    logo: '/uploads/partner_ukhia_forum.png',
    type: 'ngo_partner',
    website: 'https://ukhiadf.org',
    isActive: true,
    priority: 2
  },
  {
    name: {
      en: "Cox's Bazar Education Trust",
      bn: 'কক্সবাজার এডুকেশন ট্রাস্ট'
    },
    logo: '/uploads/partner_edu_trust.png',
    type: 'scholarship_sponsor',
    website: 'https://coxsbazaredutrust.org',
    isActive: true,
    priority: 3
  },
  {
    name: {
      en: 'Dpian ICT Solutions',
      bn: 'দ্বীপান আইসিটি সলিউশনস'
    },
    logo: '/uploads/partner_dpian_ict.png',
    type: 'tech_partner',
    website: 'https://dpian.tech',
    isActive: true,
    priority: 4
  }
];


// ─── MAIN SEED FUNCTION ───────────────────────────────────────────────────────

async function seed() {
  await connectDB();
  console.log('\n🌱 Connected to database. Starting seed...\n');

  // ── SETTINGS ──
  const settingsToSeed = [generalSettings, heroSlides, timelineEvents, advisorMessages];
  for (const s of settingsToSeed) {
    await Setting.findOneAndUpdate({ key: s.key }, { value: s.value }, { upsert: true, new: true });
    console.log(`  ✅ Setting seeded: ${s.key}`);
  }

  // ── EVENTS ──
  const existingEventCount = await Event.countDocuments();
  if (existingEventCount === 0) {
    await Event.insertMany(events);
    console.log(`  ✅ ${events.length} events seeded`);
  } else {
    console.log(`  ⏭️  Events already exist (${existingEventCount} found), skipping...`);
  }

  // ── NOTICES ──
  const existingNoticeCount = await Notice.countDocuments();
  if (existingNoticeCount === 0) {
    await Notice.insertMany(notices);
    console.log(`  ✅ ${notices.length} notices seeded`);
  } else {
    console.log(`  ⏭️  Notices already exist (${existingNoticeCount} found), skipping...`);
  }

  // ── COMMITTEE ──
  const existingCommitteeCount = await Committee.countDocuments();
  if (existingCommitteeCount === 0) {
    await Committee.insertMany(committeeMembers);
    console.log(`  ✅ ${committeeMembers.length} committee members seeded`);
  } else {
    console.log(`  ⏭️  Committee already exists (${existingCommitteeCount} found), skipping...`);
  }

  // ── BLOGS ──
  const existingBlogCount = await Blog.countDocuments();
  if (existingBlogCount === 0) {
    await Blog.insertMany(blogs);
    console.log(`  ✅ ${blogs.length} blog posts seeded`);
  } else {
    console.log(`  ⏭️  Blogs already exist (${existingBlogCount} found), skipping...`);
  }

  // ── PARTNERS ──
  const existingPartnerCount = await Partner.countDocuments();
  if (existingPartnerCount === 0) {
    await Partner.insertMany(partners);
    console.log(`  ✅ ${partners.length} partners seeded`);
  } else {
    console.log(`  ⏭️  Partners already exist (${existingPartnerCount} found), skipping...`);
  }

  console.log('\n🎉 Seed completed successfully!\n');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
