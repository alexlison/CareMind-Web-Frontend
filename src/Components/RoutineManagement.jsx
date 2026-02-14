import React, { useState } from 'react';
import { 
  Clock, 
  Pill, 
  Activity, 
  Plus, 
  Edit2, 
  Trash2,
  Bell,
  Sun,
  Moon,
  Coffee,
  Image as ImageIcon,
  ChevronRight,
  FileText
} from 'lucide-react';

const RoutineManagement = () => {
  const [activeTab, setActiveTab] = useState('routines');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Dummy data for routines
  const routinesData = [
    {
      id: 1,
      title: 'Morning Walk',
      type: 'exercise',
      scheduledTime: '07:00 AM',
      frequency: 'Daily',
      status: 'active',
      patientName: 'John Smith',
      icon: Sun,
      description: 'Morning walk in the garden for 30 minutes. Take water bottle and wear comfortable shoes.',
      lastCompleted: 'Today, 7:15 AM'
    },
    {
      id: 2,
      title: 'Breakfast',
      type: 'meal',
      scheduledTime: '08:30 AM',
      frequency: 'Daily',
      status: 'active',
      patientName: 'John Smith',
      icon: Coffee,
      description: 'Breakfast with medication. Include fruits and avoid sugary foods.',
      lastCompleted: 'Today, 8:45 AM'
    },
    {
      id: 3,
      title: 'Physical Therapy',
      type: 'therapy',
      scheduledTime: '10:00 AM',
      frequency: 'Mon, Wed, Fri',
      status: 'active',
      patientName: 'John Smith',
      icon: Activity,
      description: 'Leg exercises with therapist. Focus on balance and strength training.',
      lastCompleted: 'Yesterday, 10:30 AM'
    },
    {
      id: 4,
      title: 'Lunch',
      type: 'meal',
      scheduledTime: '12:30 PM',
      frequency: 'Daily',
      status: 'active',
      patientName: 'John Smith',
      icon: Coffee,
      description: 'Lunch with family. Ensure proper portions and include vegetables.',
      lastCompleted: 'Yesterday, 12:45 PM'
    },
    {
      id: 5,
      title: 'Evening Snack',
      type: 'meal',
      scheduledTime: '04:00 PM',
      frequency: 'Daily',
      status: 'inactive',
      patientName: 'John Smith',
      icon: Coffee,
      description: 'Light evening snack like fruits or nuts. Avoid heavy meals.',
      lastCompleted: '2 days ago'
    },
    {
      id: 6,
      title: 'Evening Walk',
      type: 'exercise',
      scheduledTime: '06:00 PM',
      frequency: 'Daily',
      status: 'active',
      patientName: 'John Smith',
      icon: Moon,
      description: 'Evening walk with family members. Good for digestion and relaxation.',
      lastCompleted: 'Yesterday, 6:20 PM'
    }
  ];

  // Dummy data for medicines
  const medicinesData = [
    {
      id: 1,
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      timing: ['08:00 AM', '08:00 PM'],
      purpose: 'Diabetes',
      instructions: 'Take with food. Swallow whole with water. Do not chew or crush.',
      status: 'active',
      patientName: 'John Smith',
      image: null,
      lastTaken: 'Today, 8:05 AM'
    },
    {
      id: 2,
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      timing: ['08:00 AM'],
      purpose: 'Blood Pressure',
      instructions: 'Take in morning on empty stomach. Drink plenty of water.',
      status: 'active',
      patientName: 'John Smith',
      image: null,
      lastTaken: 'Today, 8:10 AM'
    },
    {
      id: 3,
      name: 'Donepezil',
      dosage: '5mg',
      frequency: 'Once daily',
      timing: ['09:00 PM'],
      purpose: 'Dementia',
      instructions: 'Take before bedtime. May cause dizziness. Avoid alcohol.',
      status: 'active',
      patientName: 'John Smith',
      image: null,
      lastTaken: 'Yesterday, 9:15 PM'
    },
    {
      id: 4,
      name: 'Vitamin D',
      dosage: '1000 IU',
      frequency: 'Once daily',
      timing: ['10:00 AM'],
      purpose: 'Supplement',
      instructions: 'Take with meal for better absorption. Store in cool dry place.',
      status: 'active',
      patientName: 'John Smith',
      image: null,
      lastTaken: 'Yesterday, 10:30 AM'
    },
    {
      id: 5,
      name: 'Aspirin',
      dosage: '81mg',
      frequency: 'Once daily',
      timing: ['08:00 AM'],
      purpose: 'Blood thinner',
      instructions: 'Low dose aspirin. Take with food to avoid stomach upset.',
      status: 'inactive',
      patientName: 'John Smith',
      image: null,
      lastTaken: '5 days ago'
    }
  ];

  // Status badge component
  const StatusBadge = ({ status }) => {
    return status === 'active' ? (
      <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
        Active
      </span>
    ) : (
      <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
        Inactive
      </span>
    );
  };

  return (
    <div className="w-full">
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-[#2d9134] bg-opacity-10 p-2 rounded-lg">
            {activeTab === 'routines' ? (
              <Activity className="w-6 h-6 text-[#2d9134]" />
            ) : (
              <Pill className="w-6 h-6 text-[#2d9134]" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {activeTab === 'routines' ? 'Routine Management' : 'Medicine Management'}
          </h2>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#2d9134] to-[#359a3a] hover:from-[#1B5E20] hover:to-[#2E7D32] text-white px-4 py-2 rounded-xl font-semibold transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add {activeTab === 'routines' ? 'Routine' : 'Medicine'}
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 mb-6 bg-white p-1 rounded-xl border border-gray-200 w-fit">
        <button
          onClick={() => setActiveTab('routines')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'routines'
              ? 'bg-[#2d9134] text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="font-medium">Routines</span>
        </button>
        <button
          onClick={() => setActiveTab('medicines')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'medicines'
              ? 'bg-[#2d9134] text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span className="font-medium">Medicines</span>
        </button>
      </div>

      {/* Items count */}
      <div className="mb-4 text-sm text-gray-500">
        Showing {activeTab === 'routines' ? routinesData.length : medicinesData.length} items
      </div>

      {/* Routines Grid */}
      {activeTab === 'routines' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {routinesData.map((routine) => (
            <div
              key={routine.id}
              className="bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                {/* Header with icon and actions */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${
                      routine.type === 'exercise' ? 'bg-green-100' :
                      routine.type === 'meal' ? 'bg-orange-100' :
                      'bg-purple-100'
                    }`}>
                      <routine.icon className={`w-5 h-5 ${
                        routine.type === 'exercise' ? 'text-green-600' :
                        routine.type === 'meal' ? 'text-orange-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{routine.title}</h3>
                      <p className="text-sm text-gray-500">for {routine.patientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setSelectedItem(routine);
                        setShowEditModal(true);
                      }}
                      className="p-2 text-gray-500 hover:text-[#2d9134] hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Time and frequency */}
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{routine.scheduledTime}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{routine.frequency}</span>
                </div>

                {/* Description Card */}
                <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                    <p className="text-sm text-gray-700 leading-relaxed">{routine.description}</p>
                  </div>
                </div>

                {/* Status and Last completed */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Bell className="w-3 h-3" />
                    <span>Last: {routine.lastCompleted}</span>
                  </div>
                  <StatusBadge status={routine.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Medicines Grid */}
      {activeTab === 'medicines' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {medicinesData.map((medicine) => (
            <div
              key={medicine.id}
              className="bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                {/* Header with image and actions */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {medicine.image ? (
                        <img src={medicine.image} alt={medicine.name} className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-blue-200">
                          <ImageIcon className="w-6 h-6 text-blue-400" />
                          <span className="text-[10px] text-blue-400 mt-1">No Image</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{medicine.name}</h3>
                      <p className="text-sm text-gray-500">{medicine.dosage}</p>
                      <p className="text-xs text-gray-400 mt-1">for {medicine.patientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setSelectedItem(medicine);
                        setShowEditModal(true);
                      }}
                      className="p-2 text-gray-500 hover:text-[#2d9134] hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Medicine details grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-xs font-medium text-gray-600">Timings</span>
                    </div>
                    <div className="space-y-1">
                      {medicine.timing.map((time, index) => (
                        <div key={index} className="text-sm font-medium text-gray-700 bg-white px-2 py-1 rounded-lg border border-gray-100">
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-3 h-3 text-gray-500" />
                      <span className="text-xs font-medium text-gray-600">Purpose</span>
                    </div>
                    <div className="text-sm font-medium text-gray-700 bg-white px-2 py-1 rounded-lg border border-gray-100">
                      {medicine.purpose}
                    </div>
                    <div className="text-xs text-gray-500 mt-2 bg-white px-2 py-1 rounded-lg border border-gray-100">
                      {medicine.frequency}
                    </div>
                  </div>
                </div>

                {/* Instructions Card */}
                <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-xs font-medium text-dark-500 block mb-1">Instructions</span>
                      <p className="text-sm text-gray-700 leading-relaxed">{medicine.instructions}</p>
                    </div>
                  </div>
                </div>

                {/* Status and Last taken */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Bell className="w-3 h-3" />
                    <span>Last: {medicine.lastTaken}</span>
                  </div>
                  <StatusBadge status={medicine.status} />
                </div>

                {/* View details link */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Click to view full details</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modals - Placeholders for now */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4">
              Add {activeTab === 'routines' ? 'New Routine' : 'New Medicine'}
            </h3>
            <p className="text-gray-500">Modal content for adding {activeTab === 'routines' ? 'routine' : 'medicine'} will go here.</p>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#2d9134] text-white rounded-lg hover:bg-[#1B5E20]">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4">
              Edit {activeTab === 'routines' ? 'Routine' : 'Medicine'}
            </h3>
            <p className="text-gray-500">Editing: {selectedItem?.name || selectedItem?.title}</p>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#2d9134] text-white rounded-lg hover:bg-[#1B5E20]">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineManagement;