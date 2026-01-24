'use client';

import Link from 'next/link';
import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Video, Users, XCircle, Plus } from 'lucide-react';

// Mock classes - Only assigned ones
const assignedClasses = [
  {
    id: 1,
    type: 'Demo',
    student: 'Arjun Patel',
    batchName: null,
    date: '2026-01-18',
    time: '10:00 AM',
    duration: '30 min',
    status: 'scheduled',
    meetingLink: 'https://zoom.us/j/123456789',
  },
  {
    id: 2,
    type: '1-1',
    student: 'Rohan Kumar',
    batchName: '1-1 Sessions',
    date: '2026-01-18',
    time: '02:00 PM',
    duration: '60 min',
    status: 'scheduled',
    meetingLink: 'https://zoom.us/j/987654321',
  },
  {
    id: 3,
    type: 'Group',
    student: 'Beginners Batch A',
    batchName: 'Beginners Batch A',
    date: '2026-01-18',
    time: '04:00 PM',
    duration: '90 min',
    status: 'scheduled',
    meetingLink: null,
  },
  {
    id: 4,
    type: 'Group',
    student: 'Intermediate Batch B',
    batchName: 'Intermediate Batch B',
    date: '2026-01-19',
    time: '10:00 AM',
    duration: '90 min',
    status: 'scheduled',
    meetingLink: 'https://zoom.us/j/456123789',
  },
  {
    id: 5,
    type: 'Group',
    student: 'Beginners Batch A',
    batchName: 'Beginners Batch A',
    date: '2026-01-20',
    time: '04:00 PM',
    duration: '90 min',
    status: 'scheduled',
    meetingLink: null,
  },
  {
    id: 6,
    type: 'Demo',
    student: 'Priya Singh',
    batchName: null,
    date: '2026-01-20',
    time: '03:00 PM',
    duration: '30 min',
    status: 'scheduled',
    meetingLink: null,
  },
];

// Mock blocked slots
const initialBlockedSlots = [
  { id: 1, date: '2026-01-19', time: '02:00 PM', duration: '2 hours', reason: 'Personal appointment' },
  { id: 2, date: '2026-01-21', time: '10:00 AM', duration: '4 hours', reason: 'Family event' },
];

export default function CoachSchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date('2026-01-18'));
  const [blockedSlots, setBlockedSlots] = useState(initialBlockedSlots);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockForm, setBlockForm] = useState({
    date: '',
    time: '',
    duration: '1 hour',
    reason: '',
  });
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [sessionDetailsModalOpen, setSessionDetailsModalOpen] = useState(false);
  const [markUnavailableMode, setMarkUnavailableMode] = useState(false);
  const [customReason, setCustomReason] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayDetailsModalOpen, setDayDetailsModalOpen] = useState(false);

  // Get all dates in the current month
  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const dates = [];
    // Add previous month's days to fill the first week
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const monthDates = getMonthDates(currentDate);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleBlockSlot = () => {
    if (!blockForm.date || !blockForm.time) return;

    const newBlock = {
      id: blockedSlots.length + 1,
      ...blockForm,
    };

    setBlockedSlots([...blockedSlots, newBlock]);
    setBlockModalOpen(false);
    setBlockForm({ date: '', time: '', duration: '1 hour', reason: '' });
  };

  const handleUnblock = (id: number) => {
    if (confirm('Remove this blocked time slot?')) {
      setBlockedSlots(blockedSlots.filter(b => b.id !== id));
    }
  };

  const getClassesForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return assignedClasses.filter(c => c.date === dateStr);
  };

  const getBlockedSlotsForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return blockedSlots.filter(b => b.date === dateStr);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="flex min-h-screen bg-primary-offwhite overflow-x-hidden">
      <Sidebar role="coach" />
      
      <div className="flex-1 min-w-0">
        <DashboardHeader userName="IM Ramesh Kumar" userRole="Coach" />
        
        <main className="p-3 sm:p-4 lg:p-6 min-w-0 w-full">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <Link href="/dashboard/coach">
              <Button variant="ghost" size="sm" className="mb-3">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-primary-blue mb-2">My Schedule</h1>
              <p className="text-gray-600 text-sm sm:text-base">View assigned classes and block unavailable time</p>
            </div>
          </div>

          {/* Calendar Navigation */}
          <Card className="mb-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="text-base sm:text-lg font-semibold text-primary-blue min-w-[140px] sm:min-w-[180px] text-center">
                  {currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </h3>
                <Button variant="outline" size="sm" onClick={handleNextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
            </div>
          </Card>

          {/* Month Calendar Grid */}
          <Card className="mb-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-full">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    {daysOfWeek.map(day => (
                      <th key={day} className="p-2 sm:p-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }).map((_, weekIdx) => (
                    <tr key={weekIdx} className="border-b">
                      {monthDates.slice(weekIdx * 7, (weekIdx + 1) * 7).map((date, dayIdx) => {
                        const classes = getClassesForDate(date);
                        const blocked = getBlockedSlotsForDate(date);
                        const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                        const today = isToday(date);

                        return (
                          <td
                            key={dayIdx}
                            onClick={() => {
                              setSelectedDate(date);
                              setDayDetailsModalOpen(true);
                            }}
                            className={`p-1 sm:p-2 h-[110px] sm:h-[130px] md:h-[150px] border-r cursor-pointer transition-all hover:bg-gray-50 ${
                              !isCurrentMonth ? 'bg-gray-50' : ''
                            } ${today ? 'bg-blue-50 border border-blue-300' : ''}`}
                          >
                            <div className="flex flex-col h-full overflow-hidden">
                              {/* Date Number */}
                              <div className={`text-sm sm:text-base md:text-lg font-bold mb-0.5 sm:mb-1 ${
                                isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                              } ${today ? 'text-primary-blue' : ''}`}>
                                {date.getDate()}
                              </div>

                              {/* Events */}
                              <div className="flex-1 space-y-0.5 sm:space-y-1 overflow-y-auto">
                                {/* Classes */}
                                {classes.slice(0, 2).map(cls => (
                                  <div
                                    key={cls.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedSession(cls);
                                      setSessionDetailsModalOpen(true);
                                      setMarkUnavailableMode(false);
                                    }}
                                    className={`p-0.5 sm:p-1 rounded text-[8px] sm:text-[10px] truncate cursor-pointer hover:opacity-80 ${
                                      cls.type === 'Demo'
                                        ? 'bg-orange-100 text-orange-900'
                                        : cls.type === '1-1'
                                        ? 'bg-blue-100 text-blue-900'
                                        : 'bg-green-100 text-green-900'
                                    }`}
                                    title={`${cls.type} - ${cls.student} at ${cls.time}`}
                                  >
                                    {cls.time} {cls.type}
                                  </div>
                                ))}

                                {/* Blocked Slots */}
                                {blocked.slice(0, 2).map(block => (
                                  <div
                                    key={block.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUnblock(block.id);
                                    }}
                                    className="p-0.5 sm:p-1 rounded text-[8px] sm:text-[10px] bg-red-100 text-red-900 cursor-pointer hover:opacity-80"
                                    title={block.reason}
                                  >
                                    Blocked
                                  </div>
                                ))}

                                {/* More indicator */}
                                {classes.length + blocked.length > 2 && (
                                  <div className="text-[8px] sm:text-[10px] text-gray-600 font-semibold">
                                    +{classes.length + blocked.length - 2} more
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Upcoming Classes List */}
          <Card className="mt-6">
            <h3 className="text-lg font-heading font-semibold text-primary-blue mb-4">Upcoming Classes</h3>
            <div className="space-y-3">
              {assignedClasses.slice(0, 5).map(cls => (
                <div key={cls.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-primary-offwhite rounded-lg">
                  <div className="flex items-start sm:items-center space-x-3 min-w-0 flex-1">
                    <div className="text-center flex-shrink-0">
                      <p className="text-xs text-gray-600">
                        {new Date(cls.date).toLocaleDateString('en-IN', { month: 'short' })}
                      </p>
                      <p className="text-lg font-bold text-primary-blue">
                        {new Date(cls.date).getDate()}
                      </p>
                    </div>
                    <div className="h-12 w-px bg-gray-300 hidden sm:block" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={cls.type === 'Demo' ? 'warning' : cls.type === '1-1' ? 'info' : 'success'}>
                          {cls.type}
                        </Badge>
                        <span className="text-sm font-semibold">{cls.time}</span>
                        <span className="text-xs text-gray-600">({cls.duration})</span>
                      </div>
                      <p className="font-semibold text-sm truncate">{cls.student}</p>
                      {cls.batchName && (
                        <p className="text-xs text-gray-600 truncate">{cls.batchName}</p>
                      )}
                    </div>
                  </div>
                  <div className="w-full sm:w-auto flex-shrink-0">
                    {cls.meetingLink ? (
                      <a href={cls.meetingLink} target="_blank" rel="noopener noreferrer" className="block">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full">
                          <Video className="w-4 h-4 mr-2" />
                          Join
                        </Button>
                      </a>
                    ) : (
                      <Button size="sm" variant="outline" className="w-full" disabled>
                        <Clock className="w-4 h-4 mr-2" />
                        Link Pending
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>

      {/* Day Details Modal */}
      {dayDetailsModalOpen && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-lg w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-heading font-bold text-primary-blue">
                {selectedDate.toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDayDetailsModalOpen(false);
                  setSelectedDate(null);
                }}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {getClassesForDate(selectedDate).length === 0 && getBlockedSlotsForDate(selectedDate).length === 0 ? (
                <p className="text-gray-500 text-center py-8">No sessions scheduled for this day</p>
              ) : (
                <>
                  {/* Classes */}
                  {getClassesForDate(selectedDate).map(cls => (
                    <div
                      key={cls.id}
                      onClick={() => {
                        setSelectedSession(cls);
                        setSessionDetailsModalOpen(true);
                        setDayDetailsModalOpen(false);
                        setMarkUnavailableMode(false);
                      }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        cls.type === 'Demo'
                          ? 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                          : cls.type === '1-1'
                          ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                          : 'bg-green-50 border-green-200 hover:bg-green-100'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge variant={cls.type === 'Demo' ? 'warning' : cls.type === '1-1' ? 'info' : 'success'}>
                            {cls.type}
                          </Badge>
                          <p className="font-bold text-lg mt-1">{cls.time}</p>
                        </div>
                        {cls.meetingLink && (
                          <div className="flex items-center text-green-600 space-x-1">
                            <Video className="w-4 h-4" />
                            <span className="text-xs font-semibold">Link ready</span>
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900">{cls.student}</p>
                      {cls.batchName && <p className="text-sm text-gray-600">{cls.batchName}</p>}
                      <p className="text-sm text-gray-600 mt-1">{cls.duration}</p>
                      <p className="text-xs text-gray-500 mt-2">Click to mark unavailable or view details</p>
                    </div>
                  ))}

                  {/* Blocked Slots */}
                  {getBlockedSlotsForDate(selectedDate).map(block => (
                    <div
                      key={block.id}
                      className="p-4 rounded-lg bg-red-50 border-2 border-red-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="error">Blocked</Badge>
                        <button
                          onClick={() => {
                            handleUnblock(block.id);
                            setDayDetailsModalOpen(false);
                          }}
                          className="text-red-600 hover:text-red-800 font-bold text-lg"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="font-bold text-lg text-gray-900">{block.time}</p>
                      <p className="text-sm text-gray-600">{block.duration}</p>
                      {block.reason && <p className="text-sm text-gray-700 italic mt-2">Reason: {block.reason}</p>}
                    </div>
                  ))}
                </>
              )}
            </div>

            <Button
              className="w-full mt-4"
              onClick={() => {
                setDayDetailsModalOpen(false);
                setSelectedDate(null);
              }}
            >
              Close
            </Button>
          </Card>
        </div>
      )}

      {/* Session Details Modal */}
      {sessionDetailsModalOpen && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <h3 className="text-xl font-heading font-bold text-primary-blue mb-4">
              {markUnavailableMode ? 'Mark Unavailability' : 'Session Details'}
            </h3>

            {!markUnavailableMode ? (
              <div className="space-y-4">
                {/* Session Information */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type:</span>
                    <Badge variant={
                      selectedSession.type === 'Demo' ? 'warning' : 
                      selectedSession.type === '1-1' ? 'info' : 'success'
                    }>
                      {selectedSession.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Student:</span>
                    <span className="font-medium">{selectedSession.student}</span>
                  </div>
                  {selectedSession.batchName && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Batch:</span>
                      <span className="font-medium">{selectedSession.batchName}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date(selectedSession.date).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Time:</span>
                    <span className="font-medium">{selectedSession.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="font-medium">{selectedSession.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge variant="success">{selectedSession.status}</Badge>
                  </div>
                  {selectedSession.meetingLink && (
                    <div>
                      <span className="text-sm text-gray-600 block mb-2">Meeting Link:</span>
                      <a 
                        href={selectedSession.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm break-all"
                      >
                        {selectedSession.meetingLink}
                      </a>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => setMarkUnavailableMode(true)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Mark Unavailable for This Time
                  </Button>
                  {selectedSession.meetingLink && (
                    <a href={selectedSession.meetingLink} target="_blank" rel="noopener noreferrer" className="block">
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <Video className="w-4 h-4 mr-2" />
                        Join Session
                      </Button>
                    </a>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSessionDetailsModalOpen(false);
                      setSelectedSession(null);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Unavailability Form */}
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Marking yourself unavailable will notify the admin and the student. 
                    The session on <strong>{selectedSession.date}</strong> at <strong>{selectedSession.time}</strong> will need to be rescheduled.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Unavailability *</label>
                  <select
                    value={blockForm.reason}
                    onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue mb-2"
                  >
                    <option value="">Select a reason</option>
                    <option value="Personal emergency">Personal emergency</option>
                    <option value="Medical appointment">Medical appointment</option>
                    <option value="Family event">Family event</option>
                    <option value="Technical issues">Technical issues</option>
                    <option value="Other">Other</option>
                  </select>
                  {blockForm.reason === 'Other' && (
                    <input
                      type="text"
                      placeholder="Please specify..."
                      value={customReason}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      onChange={(e) => setCustomReason(e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                  <textarea
                    rows={3}
                    value={additionalNotes}
                    placeholder="Any additional information..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setMarkUnavailableMode(false)}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      if (!blockForm.reason) {
                        alert('Please select a reason for unavailability');
                        return;
                      }
                      if (blockForm.reason === 'Other' && !customReason.trim()) {
                        alert('Please specify the reason');
                        return;
                      }
                      
                      // Build full reason text
                      const finalReason = blockForm.reason === 'Other' ? customReason : blockForm.reason;
                      const fullReason = additionalNotes.trim() 
                        ? `${finalReason} - ${additionalNotes}` 
                        : finalReason;
                      
                      // Add the blocked slot
                      const newBlock = {
                        id: blockedSlots.length + 1,
                        date: selectedSession.date,
                        time: selectedSession.time,
                        duration: selectedSession.duration,
                        reason: fullReason,
                      };
                      setBlockedSlots([...blockedSlots, newBlock]);
                      
                      // Close modals and reset
                      setSessionDetailsModalOpen(false);
                      setSelectedSession(null);
                      setMarkUnavailableMode(false);
                      setBlockForm({ date: '', time: '', duration: '1 hour', reason: '' });
                      setCustomReason('');
                      setAdditionalNotes('');
                      
                      alert('Unavailability submitted! The admin and student will be notified.');
                    }}
                    disabled={!blockForm.reason || (blockForm.reason === 'Other' && !customReason.trim())}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Submit Unavailability
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Block Time Modal */}
      {blockModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <h3 className="text-xl font-heading font-bold text-primary-blue mb-4">Block Unavailable Time</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={blockForm.date}
                  onChange={(e) => setBlockForm({ ...blockForm, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                <input
                  type="time"
                  value={blockForm.time}
                  onChange={(e) => setBlockForm({ ...blockForm, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                <select
                  value={blockForm.duration}
                  onChange={(e) => setBlockForm({ ...blockForm, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                >
                  <option value="30 min">30 minutes</option>
                  <option value="1 hour">1 hour</option>
                  <option value="2 hours">2 hours</option>
                  <option value="3 hours">3 hours</option>
                  <option value="4 hours">4 hours</option>
                  <option value="All day">All day</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                <select
                  value={blockForm.reason}
                  onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue mb-2"
                >
                  <option value="">Select a reason</option>
                  <option value="Personal appointment">Personal appointment</option>
                  <option value="Medical appointment">Medical appointment</option>
                  <option value="Family event">Family event</option>
                  <option value="Vacation/Leave">Vacation/Leave</option>
                  <option value="Professional commitment">Professional commitment</option>
                  <option value="Other">Other</option>
                </select>
                {blockForm.reason === 'Other' && (
                  <input
                    type="text"
                    placeholder="Please specify..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                  />
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setBlockModalOpen(false);
                    setBlockForm({ date: '', time: '', duration: '1 hour', reason: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={handleBlockSlot}
                  disabled={!blockForm.date || !blockForm.time}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Block Time
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
