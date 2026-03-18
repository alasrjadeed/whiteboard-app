import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Check, X, DollarSign, Calendar, Users, Clock } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';

const initialPlans = [
  {
    id: 1,
    name: 'Free',
    price: 0,
    period: 'month',
    users: ['Students', 'Teachers'],
    features: [
      'Session expiration: 3 hours',
      'Student limit: 30 / session',
      'Active sessions: 1',
      'Lobby protection',
      'Basic whiteboard tools',
    ],
    active: 1243,
    color: 'bg-gray-500'
  },
  {
    id: 2,
    name: 'Starter (Lite)',
    price: 0.99,
    yearlyPrice: 11.88,
    period: 'month',
    users: ['Students', 'Teachers'],
    features: [
      'Session expiration: 24 hours',
      'Student limit: 40 / session',
      'Active sessions: 3',
      'Download student work as ZIP',
      'Auto load teacher whiteboard',
      'Focus Mode',
    ],
    active: 456,
    color: 'bg-blue-500'
  },
  {
    id: 3,
    name: 'Pro',
    price: 2.99,
    yearlyPrice: 35.88,
    period: 'month',
    popular: true,
    users: ['Students', 'Teachers', 'Schools'],
    features: [
      'Session expiration: 60 days',
      'Student limit: 60 / session',
      'Active sessions: 20',
      'Upload PDFs as background',
      'Invite co-teachers',
      'Library: Save & reuse boards',
      'Assignments & grading',
      'Instant feedback',
    ],
    active: 678,
    color: 'bg-purple-500'
  },
  {
    id: 4,
    name: 'Premium',
    price: 7.99,
    yearlyPrice: 95.88,
    period: 'month',
    users: ['Institutes', 'Academies'],
    features: [
      'Session expiration: 365 days',
      'Student limit: 150 / session',
      'Active sessions: 100',
      'All Pro features',
      'Priority server performance',
      'Premium support',
      'Early access to new features',
    ],
    active: 166,
    color: 'bg-amber-500'
  }
];

export const AdminSubscriptions = () => {
  const [plans, setPlans] = useState(initialPlans);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<number | null>(null);

  const [newPlan, setNewPlan] = useState({
    name: '',
    price: 0,
    yearlyPrice: 0,
    period: 'month',
    users: ['Students'],
    features: [''],
    color: 'bg-blue-500',
  });

  const handleCreatePlan = () => {
    if (!newPlan.name || !newPlan.price) {
      alert('Please fill in required fields');
      return;
    }
    const newPlanEntry = {
      id: plans.length + 1,
      name: newPlan.name,
      price: newPlan.price,
      yearlyPrice: newPlan.yearlyPrice || 0,
      period: newPlan.period,
      users: newPlan.users,
      features: newPlan.features.filter(f => f.trim()),
      active: 0,
      color: newPlan.color,
    };
    setPlans([...plans, newPlanEntry]);
    setShowCreateModal(false);
    setNewPlan({ name: '', price: 0, yearlyPrice: 0, period: 'month', users: ['Students'], features: [''], color: 'bg-blue-500' });
  };

  const handleEditPlan = (plan: any) => {
    setSelectedPlan(plan);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    setPlans(plans.map(p => p.id === selectedPlan.id ? selectedPlan : p));
    setShowEditModal(false);
    setSelectedPlan(null);
  };

  const handleDeletePlan = () => {
    if (planToDelete !== null) {
      setPlans(plans.filter(p => p.id !== planToDelete));
      setShowDeleteConfirm(false);
      setPlanToDelete(null);
    }
  };

  const confirmDelete = (planId: number) => {
    setPlanToDelete(planId);
    setShowDeleteConfirm(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
            <p className="text-gray-500 mt-1">Manage pricing tiers and features</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
            <Plus size={18} />
            Create Plan
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{plans.reduce((sum, p) => sum + p.active, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$12,458</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Growth</p>
                <p className="text-2xl font-bold text-emerald-600">+22.1%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Subscription</p>
                <p className="text-2xl font-bold text-gray-900">8.5 mo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", plan.color)}>
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      {plan.popular && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                          Most Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{plan.active.toLocaleString()} active subscribers</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditPlan(plan)}
                    className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600"
                    title="Edit Plan"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => confirmDelete(plan.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                    title="Delete Plan"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-500">/{plan.period}</span>
                  )}
                </div>
                {plan.yearlyPrice && (
                  <p className="text-sm text-emerald-600 font-medium">
                    Billed yearly ${plan.yearlyPrice} (Save ~17%)
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Target Users */}
              <div className="pt-6 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Target Users:</p>
                <div className="flex flex-wrap gap-2">
                  {plan.users.map((user, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                      {user}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Plan Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Plan</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Pro Plan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Price ($) *
                    </label>
                    <input
                      type="number"
                      value={newPlan.price}
                      onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yearly Price ($)
                    </label>
                    <input
                      type="number"
                      value={newPlan.yearlyPrice}
                      onChange={(e) => setNewPlan({ ...newPlan, yearlyPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Theme
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-gray-500'].map(color => (
                      <button
                        key={color}
                        onClick={() => setNewPlan({ ...newPlan, color })}
                        className={cn(
                          "h-10 rounded-lg transition-all",
                          color,
                          newPlan.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Users
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Students', 'Teachers', 'Schools', 'Institutes', 'Academies'].map(user => (
                      <button
                        key={user}
                        onClick={() => setNewPlan({
                          ...newPlan,
                          users: newPlan.users.includes(user)
                            ? newPlan.users.filter(u => u !== user)
                            : [...newPlan.users, user]
                        })}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium transition-all",
                          newPlan.users.includes(user)
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                      >
                        {user}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="space-y-2">
                    {newPlan.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...newPlan.features];
                            newFeatures[index] = e.target.value;
                            setNewPlan({ ...newPlan, features: newFeatures });
                          }}
                          className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                          placeholder="Enter feature"
                        />
                        <button
                          onClick={() => {
                            const newFeatures = newPlan.features.filter((_, i) => i !== index);
                            setNewPlan({ ...newPlan, features: newFeatures });
                          }}
                          className="p-2.5 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setNewPlan({ ...newPlan, features: [...newPlan.features, ''] })}
                      className="w-full px-4 py-2.5 text-emerald-600 bg-emerald-50 rounded-xl font-medium hover:bg-emerald-100 transition-colors"
                    >
                      + Add Feature
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlan}
                  className="flex-1 px-4 py-2.5 text-white bg-emerald-600 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  Create Plan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Plan Modal */}
      <AnimatePresence>
        {showEditModal && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Plan</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    value={selectedPlan.name}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Price ($) *
                    </label>
                    <input
                      type="number"
                      value={selectedPlan.price}
                      onChange={(e) => setSelectedPlan({ ...selectedPlan, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yearly Price ($)
                    </label>
                    <input
                      type="number"
                      value={selectedPlan.yearlyPrice}
                      onChange={(e) => setSelectedPlan({ ...selectedPlan, yearlyPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Theme
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-gray-500'].map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedPlan({ ...selectedPlan, color })}
                        className={cn(
                          "h-10 rounded-lg transition-all",
                          color,
                          selectedPlan.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Users
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Students', 'Teachers', 'Schools', 'Institutes', 'Academies'].map(user => (
                      <button
                        key={user}
                        onClick={() => setSelectedPlan({
                          ...selectedPlan,
                          users: selectedPlan.users.includes(user)
                            ? selectedPlan.users.filter(u => u !== user)
                            : [...selectedPlan.users, user]
                        })}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium transition-all",
                          selectedPlan.users.includes(user)
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                      >
                        {user}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="space-y-2">
                    {selectedPlan.features.map((feature: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...selectedPlan.features];
                            newFeatures[index] = e.target.value;
                            setSelectedPlan({ ...selectedPlan, features: newFeatures });
                          }}
                          className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        />
                        <button
                          onClick={() => {
                            const newFeatures = selectedPlan.features.filter((_: any, i: number) => i !== index);
                            setSelectedPlan({ ...selectedPlan, features: newFeatures });
                          }}
                          className="p-2.5 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setSelectedPlan({ ...selectedPlan, features: [...selectedPlan.features, ''] })}
                      className="w-full px-4 py-2.5 text-emerald-600 bg-emerald-50 rounded-xl font-medium hover:bg-emerald-100 transition-colors"
                    >
                      + Add Feature
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-2.5 text-white bg-emerald-600 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Plan?</h3>
                <p className="text-gray-500">
                  Are you sure you want to delete this subscription plan? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePlan}
                  className="flex-1 px-4 py-2.5 text-white bg-red-600 rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Plan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

// Helper functions
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

function TrendingUp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
}
