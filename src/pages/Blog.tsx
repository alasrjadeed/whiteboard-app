import React from 'react';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';

export const Blog = () => {
  const posts = [
    {
      title: "10 Tips for Engaging Remote Students",
      excerpt: "Keeping students focused during remote learning can be a challenge. Here are 10 proven strategies...",
      date: "March 10, 2026",
      author: "Sarah Johnson",
      image: "https://picsum.photos/seed/blog1/800/400"
    },
    {
      title: "Using AsarBoard for Math Instruction",
      excerpt: "Discover how our Math Editor and graph tools can transform your mathematics classroom...",
      date: "March 5, 2026",
      author: "David Chen",
      image: "https://picsum.photos/seed/blog2/800/400"
    },
    {
      title: "New Feature: Co-teaching is here!",
      excerpt: "We are excited to announce our most requested feature: shared sessions for co-teachers...",
      date: "February 28, 2026",
      author: "Team AsarBoard",
      image: "https://picsum.photos/seed/blog3/800/400"
    },
    {
      title: "Mastering the Assignment System",
      excerpt: "Learn how to create, collect, and grade assignments efficiently with AsarBoard's new assignment feature...",
      date: "March 12, 2026",
      author: "Emily Rodriguez",
      image: "https://picsum.photos/seed/blog4/800/400"
    },
    {
      title: "Public Chat: Best Practices for Class Discussions",
      excerpt: "Make the most of the public chat feature with these tips for facilitating meaningful class conversations...",
      date: "March 11, 2026",
      author: "Michael Thompson",
      image: "https://picsum.photos/seed/blog5/800/400"
    },
    {
      title: "Export Professional PDF Reports",
      excerpt: "Create stunning progress reports for parents and administrators with the PDF export feature...",
      date: "March 9, 2026",
      author: "Jessica Lee",
      image: "https://picsum.photos/seed/blog6/800/400"
    },
    {
      title: "10 Creative Uses for Templates",
      excerpt: "Discover how to use our 10+ pre-made templates to save time and enhance your lessons...",
      date: "March 8, 2026",
      author: "Robert Kim",
      image: "https://picsum.photos/seed/blog7/800/400"
    },
    {
      title: "Attendance Tracking Made Simple",
      excerpt: "Automate your attendance taking and export CSV reports with just one click...",
      date: "March 7, 2026",
      author: "Amanda White",
      image: "https://picsum.photos/seed/blog8/800/400"
    },
    {
      title: "Video & Voice Chat: Teaching While Drawing",
      excerpt: "Learn how to use the integrated video and voice chat to explain concepts while drawing on the whiteboard...",
      date: "March 6, 2026",
      author: "Chris Martinez",
      image: "https://picsum.photos/seed/blog9/800/400"
    }
  ];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-600 uppercase tracking-widest">Blog</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Tips, Tricks & Updates
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Check out the AsarBoard blog for the latest news and creative ways to use the service in your classroom.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-start"
            >
              <div className="relative w-full">
                <img
                  src={post.image}
                  alt={post.title}
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time dateTime={post.date} className="text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </time>
                  <span className="text-gray-500 flex items-center gap-1">
                    <User className="w-3 h-3" /> {post.author}
                  </span>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-emerald-600 transition-colors">
                    <a href="#">
                      <span className="absolute inset-0" />
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{post.excerpt}</p>
                </div>
                <div className="mt-6">
                  <a href="#" className="text-sm font-semibold leading-6 text-emerald-600 flex items-center gap-1 hover:gap-2 transition-all">
                    Read more <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
