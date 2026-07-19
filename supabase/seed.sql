-- Seed data for Galaxy Workforce MVP
-- This file should be run after the main migration

-- Insert categories
insert into categories (name_en, name_bn, slug, icon, description_en, description_bn, typical_rate_min, typical_rate_max, currency, sort_order) values
('Web Development', 'ওয়েব ডেভেলপমেন্ট', 'web-development', 'Code', 'Build websites and web applications', 'ওয়েবসাইট এবং ওয়েব অ্যাপ্লিকেশন তৈরি করুন', 500, 5000, 'BDT', 1),
('Mobile Development', 'মোবাইল ডেভেলপমেন্ট', 'mobile-development', 'Smartphone', 'Create iOS and Android apps', 'আইওএস এবং অ্যান্ড্রয়েড অ্যাপ তৈরি করুন', 800, 8000, 'BDT', 2),
('UI/UX Design', 'ইউআই/ইউএক্স ডিজাইন', 'ui-ux-design', 'Palette', 'Design beautiful user interfaces', 'সুন্দর ইউজার ইন্টারফেস ডিজাইন করুন', 400, 4000, 'BDT', 3),
('Graphic Design', 'গ্রাফিক ডিজাইন', 'graphic-design', 'Image', 'Logos, branding, and marketing materials', 'লোগো, ব্র্যান্ডিং এবং মার্কেটিং মেটিরিয়াল', 300, 3000, 'BDT', 4),
('Digital Marketing', 'ডিজিটাল মার্কেটিং', 'digital-marketing', 'TrendingUp', 'SEO, social media, and ads', 'এসইও, সোশ্যাল মিডিয়া এবং বিজ্ঞাপন', 400, 4000, 'BDT', 5),
('Content Writing', 'কনটেন্ট রাইটিং', 'content-writing', 'FileText', 'Blog posts, articles, and copywriting', 'ব্লগ পোস্ট, আর্টিকেল এবং কপিরাইটিং', 200, 2000, 'BDT', 6),
('Video & Animation', 'ভিডিও এবং অ্যানিমেশন', 'video-animation', 'Video', 'Video editing and motion graphics', 'ভিডিও এডিটিং এবং মোশন গ্রাফিক্স', 600, 6000, 'BDT', 7),
('Data Entry', 'ডেটা এন্ট্রি', 'data-entry', 'Database', 'Data processing and management', 'ডেটা প্রসেসিং এবং ম্যানেজমেন্ট', 150, 1000, 'BDT', 8),
('Virtual Assistant', 'ভার্চুয়াল অ্যাসিস্টেন্ট', 'virtual-assistant', 'UserCog', 'Administrative support and scheduling', 'প্রশাসনিক সহায়তা এবং শিডিউলিং', 200, 1500, 'BDT', 9),
('Translation', 'অনুবাদ', 'translation', 'Languages', 'Document and content translation', 'ডকুমেন্ট এবং কনটেন্ট অনুবাদ', 300, 2500, 'BDT', 10);

-- Note: Actual user accounts will be created via Supabase Auth
-- This seed file provides reference data only
-- Demo accounts are documented in DEMO_ACCOUNTS.md