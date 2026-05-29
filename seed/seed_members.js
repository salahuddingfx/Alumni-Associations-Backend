require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('../models/member.model');

const members = [
  { name: { en: 'Md. Rafiqul Islam', bn: 'মোঃ রফিকুল ইসলাম' }, batch: '2008', pscBatch: '2003', bloodGroup: 'B+', profession: 'Software Engineer', currentOrganization: 'BJIT Limited', phone: '+880 1711 111111', email: 'rafiq.seed@example.com', gender: 'Male', isApproved: true, socialLinks: { facebook: 'https://facebook.com', linkedin: 'https://linkedin.com', twitter: '', website: '' } },
  { name: { en: 'Nusrat Jahan', bn: 'নুসরাত জাহান' }, batch: '2009', pscBatch: '2004', bloodGroup: 'A+', profession: 'Doctor', currentOrganization: 'Cox\'s Bazar Medical College', phone: '+880 1722 222222', email: 'nusrat.seed@example.com', gender: 'Female', isApproved: true, socialLinks: { facebook: 'https://facebook.com', linkedin: '', twitter: '', website: '' } },
  { name: { en: 'Md. Kamal Hossain', bn: 'মোঃ কামাল হোসেন' }, batch: '2007', pscBatch: '2002', bloodGroup: 'O+', profession: 'Civil Engineer', currentOrganization: 'LGED Bangladesh', phone: '+880 1733 333333', email: 'kamal.seed@example.com', gender: 'Male', isApproved: true, socialLinks: { facebook: '', linkedin: 'https://linkedin.com', twitter: '', website: '' } },
  { name: { en: 'Sultana Akter', bn: 'সুলতানা আক্তার' }, batch: '2010', pscBatch: '2005', bloodGroup: 'AB+', profession: 'Teacher', currentOrganization: 'Ukhia High School', phone: '+880 1744 444444', email: 'sultana.seed@example.com', gender: 'Female', isApproved: true, socialLinks: { facebook: '', linkedin: '', twitter: '', website: '' } },
  { name: { en: 'Md. Jubayer Ahmed', bn: 'মোঃ জুবায়ের আহমেদ' }, batch: '2011', pscBatch: '2006', bloodGroup: 'B-', profession: 'Businessman', currentOrganization: 'Ahmed Trading Co.', phone: '+880 1755 555555', email: 'jubayer.seed@example.com', gender: 'Male', isApproved: true, socialLinks: { facebook: 'https://facebook.com', linkedin: '', twitter: '', website: 'https://jubayer.com' } },
  { name: { en: 'Md. Sohel Rana', bn: 'মোঃ সোহেল রানা' }, batch: '2006', pscBatch: '2001', bloodGroup: 'A-', profession: 'Banker', currentOrganization: 'Dutch Bangla Bank', phone: '+880 1766 666666', email: 'sohel.seed@example.com', gender: 'Male', isApproved: true, socialLinks: { facebook: '', linkedin: 'https://linkedin.com', twitter: '', website: '' } },
  { name: { en: 'Taslima Begum', bn: 'তাসলিমা বেগম' }, batch: '2012', pscBatch: '2007', bloodGroup: 'O-', profession: 'Nurse', currentOrganization: 'Cox\'s Bazar Sadar Hospital', phone: '', email: 'taslima.seed@example.com', gender: 'Female', isApproved: true, socialLinks: { facebook: '', linkedin: '', twitter: '', website: '' } },
  { name: { en: 'Md. Nurul Absar', bn: 'মোঃ নুরুল আবসার' }, batch: '2005', pscBatch: '2000', bloodGroup: 'B+', profession: 'Lawyer', currentOrganization: 'Cox\'s Bazar District Court', phone: '+880 1788 888888', email: 'nurul.seed@example.com', gender: 'Male', isApproved: true, socialLinks: { facebook: 'https://facebook.com', linkedin: '', twitter: '', website: '' } },
  { name: { en: 'Salah Uddin Kader', bn: 'সালাহ উদ্দিন কাদের' }, batch: '2013', pscBatch: '2008', bloodGroup: 'AB-', profession: 'Full Stack Developer', currentOrganization: 'Dpian Tech', phone: '+880 1799 999999', email: 'salah.seed@example.com', gender: 'Male', isApproved: true, socialLinks: { facebook: 'https://facebook.com', linkedin: 'https://linkedin.com', twitter: 'https://twitter.com', website: 'https://dpian.dev' } },
  { name: { en: 'Md. Shahadat Hossain', bn: 'মোঃ শাহাদাত হোসেন' }, batch: '2009', pscBatch: '2004', bloodGroup: 'A+', profession: 'Pharmacist', currentOrganization: 'Square Pharmaceuticals', phone: '+880 1800 000001', email: 'shahadat.seed@example.com', gender: 'Male', isApproved: true, socialLinks: { facebook: '', linkedin: 'https://linkedin.com', twitter: '', website: '' } },
  { name: { en: 'Fatema Khanam', bn: 'ফাতেমা খানম' }, batch: '2011', pscBatch: '2006', bloodGroup: 'O+', profession: 'Accountant', currentOrganization: 'NBR Bangladesh', phone: '', email: 'fatema.seed@example.com', gender: 'Female', isApproved: true, socialLinks: { facebook: '', linkedin: '', twitter: '', website: '' } },
  { name: { en: 'Md. Asaduzzaman', bn: 'মোঃ আসাদুজ্জামান' }, batch: '2004', pscBatch: '1999', bloodGroup: 'B+', profession: 'Police Officer', currentOrganization: 'Bangladesh Police', phone: '+880 1811 111111', email: 'asad.seed@example.com', gender: 'Male', isApproved: true, socialLinks: { facebook: '', linkedin: '', twitter: '', website: '' } }
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Member.insertMany(members);
  console.log('Done. Inserted:', members.length, 'members');
  process.exit(0);
}).catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
