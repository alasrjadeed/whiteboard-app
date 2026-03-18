import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';

export const Pricing = () => {
  const [isYearly, setIsYearly] = useState(true);

  const plans = [
    {
      name: 'Free',
      price: '0',
      period: '/ month',
      yearly: null,
      desc: 'Start Teaching - Good for testing the platform',
      features: [
        'Session expiration: 3 hours',
        'Student limit: 30 / session',
        'Active sessions: 1',
        'Lobby protection',
        'Clever integration',
        'Basic whiteboard tools',
      ],
      cta: 'Start for free',
      popular: false,
      color: 'bg-gray-500'
    },
    {
      name: 'Starter (Lite)',
      price: isYearly ? '0.99' : '1.99',
      period: '/ month',
      yearly: '11.88',
      desc: 'Best for small teachers and tutors',
      features: [
        'Session expiration: 24 hours',
        'Student limit: 40 / session',
        'Active sessions: 3',
        'Lobby protection',
        'Clever integration',
        'Download student work as ZIP',
        'Auto load teacher whiteboard',
        'Focus Mode',
      ],
      cta: 'Get Starter',
      popular: false,
      color: 'bg-blue-500'
    },
    {
      name: 'Pro',
      price: isYearly ? '2.99' : '4.99',
      period: '/ month',
      yearly: '35.88',
      desc: 'Perfect for schools and serious teachers',
      features: [
        'Session expiration: 60 days',
        'Student limit: 60 / session',
        'Active sessions: 20',
        'Lobby protection',
        'Clever integration',
        'Download student work as ZIP',
        'Auto load teacher whiteboard',
        'Focus Mode',
        'Upload PDFs as background',
        'Invite co-teachers',
        'Library: Save & reuse boards',
        'Assignments & grading',
        'Instant feedback',
        'Join student session',
      ],
      cta: 'Get Pro',
      popular: true,
      color: 'bg-purple-500'
    },
    {
      name: 'Premium',
      price: isYearly ? '7.99' : '9.99',
      period: '/ month',
      yearly: '95.88',
      desc: 'Best for institutes & academies',
      features: [
        'Session expiration: 365 days',
        'Student limit: 150 / session',
        'Active sessions: 100',
        'All Pro features',
        'Priority server performance',
        'Premium support',
        'Early access to new features',
      ],
      cta: 'Get Premium',
      popular: false,
      color: 'bg-amber-500'
    }
  ];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-600 uppercase tracking-widest">Pricing Plans</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Start using AsarBoard for free today
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Account plans unlock additional features for longer sessions, more students, and advanced tools.
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="relative flex rounded-full bg-gray-100 p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200">
            <button
              onClick={() => setIsYearly(false)}
              className={`${
                !isYearly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              } px-4 py-2 rounded-full transition-all`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`${
                isYearly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              } px-4 py-2 rounded-full transition-all`}
            >
              Yearly billing <span className="text-emerald-600 ml-1">Save ~17%</span>
            </button>
          </div>
        </div>

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4 lg:gap-x-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex flex-col justify-between rounded-3xl p-8 ring-1 transition-all ${
                plan.popular
                  ? 'bg-gray-900 ring-gray-900 text-white shadow-2xl scale-105 z-10'
                  : 'bg-white ring-gray-200 text-gray-900 hover:ring-emerald-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className={`text-lg font-semibold leading-8 ${plan.popular ? 'text-emerald-400' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold leading-5 text-emerald-400">
                      Most popular
                    </span>
                  )}
                </div>
                <p className={`mt-4 text-sm leading-6 ${plan.popular ? 'text-gray-300' : 'text-gray-500'}`}>
                  {plan.desc}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight">${plan.price}</span>
                  <span className={`text-sm font-semibold leading-6 ${plan.popular ? 'text-gray-300' : 'text-gray-500'}`}>
                    {plan.period}
                  </span>
                </p>
                {isYearly && plan.price !== '0' && plan.yearly && (
                  <p className={`mt-1 text-xs ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                    Billed yearly ${plan.yearly}
                  </p>
                )}
                <ul className="mt-8 space-y-3 text-sm leading-6 xl:mt-10">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className={`h-6 w-5 flex-none ${plan.popular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className={`mt-8 block rounded-full px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all ${
                  plan.popular
                    ? 'bg-emerald-500 text-white shadow-sm hover:bg-emerald-400 focus-visible:outline-emerald-500'
                    : 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline-emerald-600'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Prices excluding VAT (where applicable). Subscriptions are billed annually or monthly.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full text-sm font-medium">
              <Info className="w-4 h-4" />
              We offer a FREE 14 day trial for Premium!
            </div>
            <button className="text-emerald-600 font-semibold hover:text-emerald-700 underline underline-offset-4">
              Purchase organisation license
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
