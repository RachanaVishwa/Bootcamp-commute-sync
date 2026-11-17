/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin, Clock, CheckCircle2, XCircle, Sparkles,
  Navigation, ExternalLink,
  Coffee, Compass
} from 'lucide-react';

interface EventItem {
  id: string;
  city: string;
  title: string;
  date_str: string;
  session_label: string;
  start_time: string;
  venue_area: string;
  nearest_venue_stop: string;
}

interface AreaItem {
  id: string;
  city: string;
  area_name: string;
  transit_stop: string;
  transit_type: string;
  common_meetup_point: string;
}

interface Attendee {
  name: string;
  is_arrived: boolean;
  boarding_time: string;
}

interface ClusterSummary {
  area_id: string;
  area_name: string;
  transit_stop: string;
  common_meetup_point: string;
  headcount: number;
  attendees: Attendee[];
  last_mile_plan: {
    recommendation: string;
    estimated_total_fare_in_inr: number;
    per_person_split_inr: number;
  };
}

// ─── Inline fallback data (used immediately on first render; API overwrites) ──
const FALLBACK_AREAS: Record<string, AreaItem[]> = {
  Bengaluru: [
    { id: "blr-indiranagar", city: "Bengaluru", area_name: "Indiranagar", transit_stop: "Indiranagar Metro Station", transit_type: "Metro", common_meetup_point: "Gate B Ticket Counter" },
    { id: "blr-mg-road",     city: "Bengaluru", area_name: "MG Road / Central", transit_stop: "MG Road Metro Station", transit_type: "Metro", common_meetup_point: "Exit 2 Pillar 160" },
    { id: "blr-koramangala", city: "Bengaluru", area_name: "Koramangala", transit_stop: "Sony World Signal Bus Stop", transit_type: "Bus", common_meetup_point: "Near Starbucks Corner" },
    { id: "blr-hsr",         city: "Bengaluru", area_name: "HSR Layout", transit_stop: "HSR BDA Complex Stop", transit_type: "Bus", common_meetup_point: "Main Entrance Ticket Kiosk" },
    { id: "blr-jp-nagar",    city: "Bengaluru", area_name: "Jayanagar / JP Nagar", transit_stop: "Jayanagar 4th Block Bus Stand", transit_type: "Bus", common_meetup_point: "Metro Pillar 42" },
  ],
  Gurugram: [
    { id: "gur-cyber-city",  city: "Gurugram", area_name: "DLF Cyber City", transit_stop: "Cyber City Rapid Metro", transit_type: "Metro", common_meetup_point: "Building 8 Food Court Gate" },
    { id: "gur-golf-course", city: "Gurugram", area_name: "Golf Course Road", transit_stop: "Sector 54 Rapid Metro", transit_type: "Metro", common_meetup_point: "Station Exit Footbridge" },
    { id: "gur-sushant-lok", city: "Gurugram", area_name: "Sushant Lok / MG Road", transit_stop: "Iffco Chowk Metro Station", transit_type: "Metro", common_meetup_point: "Gate 2 Auto Stand" },
    { id: "gur-sec-29",      city: "Gurugram", area_name: "Sector 29 / HUDA", transit_stop: "Sector 42-53 Rapid Metro", transit_type: "Metro", common_meetup_point: "Main Ticket Counter" },
  ],
};

const FALLBACK_EVENTS: EventItem[] = [
  { id: "blr-morning-2026", city: "Bengaluru", title: "AI Bootcamp Morning Session: Agents & Multimodal AI", date_str: "Saturday, Nov 21, 2026", session_label: "Morning Session", start_time: "09:00 AM - 01:00 PM", venue_area: "Indiranagar Tech Hub, 100ft Road", nearest_venue_stop: "Indiranagar Metro Station (Purple Line)" },
  { id: "blr-evening-2026", city: "Bengaluru", title: "AI Bootcamp Evening Session: Fine-Tuning & RAG Pipelines", date_str: "Saturday, Nov 21, 2026", session_label: "Evening Session", start_time: "02:00 PM - 06:00 PM", venue_area: "Koramangala 5th Block, Catalyst Hall", nearest_venue_stop: "Koramangala Sony World Junction Bus Stop" },
  { id: "gur-morning-2026", city: "Gurugram", title: "AI Bootcamp Morning Session: Enterprise LLM Architecture", date_str: "Sunday, Nov 22, 2026", session_label: "Morning Session", start_time: "09:00 AM - 01:00 PM", venue_area: "Cyber City, Building 10 Amphitheatre", nearest_venue_stop: "DLF Cyber City Rapid Metro Station" },
  { id: "gur-evening-2026", city: "Gurugram", title: "AI Bootcamp Evening Session: Agentic Workflows & Tool Use", date_str: "Sunday, Nov 22, 2026", session_label: "Evening Session", start_time: "02:00 PM - 06:00 PM", venue_area: "Golf Course Road, One Horizon Center", nearest_venue_stop: "Sector 54 Rapid Metro Station" },
];

export default function App() {
  // Persistent user token
  const [userToken, setUserToken] = useState<string>('');
  const [attendeeName, setAttendeeName] = useState<string>('');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  // City & Events — pre-seeded with fallback so UI is never blank
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [events, setEvents] = useState<EventItem[]>(FALLBACK_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState<string>(FALLBACK_EVENTS[0].id);
  const [areas, setAreas] = useState<AreaItem[]>(FALLBACK_AREAS['Bengaluru']);

  // Commute Form State — pre-select first fallback area so dropdown is never blank
  const [isJoining, setIsJoining] = useState<boolean | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<string>(FALLBACK_AREAS['Bengaluru'][0].id);
  const [boardingTime, setBoardingTime] = useState<string>('07:45 AM');
  const [isArrived, setIsArrived] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Summary State
  const [summaryData, setSummaryData] = useState<{
    total_joining: number;
    nearest_venue_stop: string;
    clusters: ClusterSummary[];
  } | null>(null);

  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);

  // Initialize user token & name
  useEffect(() => {
    let token = localStorage.getItem('bootcamp_user_token');
    if (!token) {
      token = 'user-' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('bootcamp_user_token', token);
    }
    setUserToken(token);

    let savedName = localStorage.getItem('bootcamp_attendee_name');
    if (!savedName) {
      savedName = 'Builder ' + Math.floor(Math.random() * 900 + 100);
      localStorage.setItem('bootcamp_attendee_name', savedName);
    }
    setAttendeeName(savedName);
  }, []);

  // Fetch events from API (fallback data already in state, so UI shows immediately)
  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.events.length > 0) {
          setEvents(data.events);
          // Don't change selectedEventId — keep the pre-selected one unless it changed
        }
      })
      .catch(() => { /* silent: fallback events already in state */ });
  }, []);

  // Whenever selected event changes, load areas for that city
  useEffect(() => {
    const activeEvent = events.find(e => e.id === selectedEventId);
    const city = activeEvent ? activeEvent.city : 'Bengaluru';

    // Immediately apply fallback for that city so dropdown is NEVER empty/loading
    const fallback = FALLBACK_AREAS[city] ?? FALLBACK_AREAS['Bengaluru'];
    setAreas(fallback);
    setSelectedAreaId(prev =>
      fallback.some(a => a.id === prev) ? prev : fallback[0].id
    );

    // Then try to load from API and silently update if successful
    fetch(`/api/areas/${city}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.areas.length > 0) {
          setAreas(data.areas);
          setSelectedAreaId(prev =>
            data.areas.some((a: AreaItem) => a.id === prev) ? prev : data.areas[0].id
          );
        }
      })
      .catch(() => { /* silent: fallback already applied above */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEventId, events.length]);

  // Fetch summary when event changes
  const fetchSummary = useCallback((eventId: string) => {
    if (!eventId) return;
    setLoadingSummary(true);
    fetch(`/api/commute/summary/${eventId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setSummaryData(data);
        setLoadingSummary(false);
      })
      .catch(err => {
        console.error("Error fetching summary:", err);
        setLoadingSummary(false);
      });
  }, []);

  useEffect(() => {
    fetchSummary(selectedEventId);
  }, [selectedEventId, fetchSummary]);

  const handleSaveRSVP = (joining: boolean) => {
    setIsJoining(joining);
    setIsSubmitting(true);

    fetch('/api/commute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_token: userToken,
        attendee_name: attendeeName,
        event_id: selectedEventId,
        area_id: selectedAreaId,
        boarding_time: boardingTime,
        is_joining: joining
      })
    })
      .then(res => res.json())
      .then(() => {
        setIsSubmitting(false);
        fetchSummary(selectedEventId);
      })
      .catch(err => {
        console.error("Error saving RSVP:", err);
        setIsSubmitting(false);
      });
  };

  const handleToggleArrival = () => {
    // Must have RSVPd YES first — if not, auto-submit RSVP then mark arrived
    if (!isJoining) {
      handleSaveRSVP(true);
      return;
    }
    const nextArrived = !isArrived;
    setIsArrived(nextArrived);

    fetch('/api/commute/arrive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_token: userToken,
        event_id: selectedEventId,
        is_arrived: nextArrived
      })
    })
      .then(res => res.json())
      .then(() => fetchSummary(selectedEventId))
      .catch(err => console.error("Error updating arrival:", err));
  };

  const activeEvent = events.find(e => e.id === selectedEventId);
  const filteredEvents = selectedCity === 'All' 
    ? events 
    : events.filter(e => e.city === selectedCity);

  const currentArea = areas.find(a => a.id === selectedAreaId);
  const userCluster = summaryData?.clusters.find(c => c.area_id === selectedAreaId);

  const boardingTimeSlots = ["07:30 AM", "07:45 AM", "08:00 AM", "08:15 AM", "08:30 AM", "01:15 PM"];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#dfe2f1] flex flex-col justify-between selection:bg-blue-500 selection:text-white pb-16">
      
      {/* TOP BAR CONTRACT */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0b0f19]/80 border-b border-[#1e293b] px-6 py-4 flex items-center justify-between gap-8">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              Commute Sync
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Antigravity Engine
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#events" className="hover:text-white transition-colors whitespace-nowrap">Events</a>
          <a href="#huddle" className="hover:text-white transition-colors whitespace-nowrap">Huddle Manifest</a>
          <a href="#coordination" className="hover:text-white transition-colors whitespace-nowrap">Peer Board</a>
          <a href="/docs" target="_blank" className="hover:text-white transition-colors whitespace-nowrap flex items-center gap-1">
            API Docs <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {/* Attendee Name Profile Pill */}
          <div className="flex items-center gap-2 bg-[#171b26] border border-[#334155] rounded-full px-3 py-1 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {isEditingName ? (
              <input
                type="text"
                value={attendeeName}
                onChange={(e) => setAttendeeName(e.target.value)}
                onBlur={() => {
                  setIsEditingName(false);
                  localStorage.setItem('bootcamp_attendee_name', attendeeName);
                }}
                autoFocus
                className="bg-transparent text-white outline-none w-28 font-medium"
              />
            ) : (
              <span 
                onClick={() => setIsEditingName(true)} 
                className="cursor-pointer font-medium text-slate-200 hover:text-blue-400 transition-colors"
                title="Click to edit name"
              >
                {attendeeName}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Configuration & RSVP */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* City & Event Picker Card */}
          <section className="bg-[#171b26]/90 backdrop-blur-xl border border-[#334155] rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">Bootcamp Schedule</span>
                <h1 className="text-2xl font-bold text-white mt-1">Select City & Session</h1>
              </div>
              
              {/* City Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#0b0f19] p-1 rounded-full border border-[#334155]">
                {['All', 'Bengaluru', 'Gurugram'].map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                      selectedCity === city 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Cards Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="events">
              {filteredEvents.map((evt) => {
                const isSelected = evt.id === selectedEventId;
                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEventId(evt.id)}
                    className={`cursor-pointer rounded-xl p-4 border transition-all relative ${
                      isSelected 
                        ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10' 
                        : 'bg-[#0b0f19] border-[#334155] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[#171b26] text-blue-400 border border-[#334155]">
                        {evt.city}
                      </span>
                      <span className="text-xs text-slate-400">{evt.session_label}</span>
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2">{evt.title}</h3>
                    <div className="space-y-1 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{evt.start_time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="truncate">{evt.venue_area}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* RSVP Binary Decision & Configuration Card */}
          <section className="bg-[#171b26]/90 backdrop-blur-xl border border-[#334155] rounded-2xl p-6 shadow-2xl space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Commute Coordination</span>
              <h2 className="text-xl font-bold text-white mt-1">Are you joining this bootcamp session in person?</h2>
            </div>

            {/* Binary RSVP Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleSaveRSVP(true)}
                className={`flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-semibold transition-all shadow-lg ${
                  isJoining === true
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-emerald-500/25 ring-2 ring-emerald-400'
                    : 'bg-[#0b0f19] border border-[#334155] text-slate-300 hover:border-emerald-500/50 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>YES, Count Me In!</span>
              </button>

              <button
                onClick={() => handleSaveRSVP(false)}
                className={`flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-semibold transition-all ${
                  isJoining === false
                    ? 'bg-slate-800 text-white border border-slate-600'
                    : 'bg-[#0b0f19] border border-[#334155] text-slate-400 hover:border-slate-500 hover:text-white'
                }`}
              >
                <XCircle className="w-5 h-5 text-slate-400" />
                <span>NO, I'm Good</span>
              </button>
            </div>

            {/* STATE FEEDBACK: NO */}
            {isJoining === false && (
              <div className="bg-[#0b0f19] border border-[#334155] rounded-xl p-4 flex items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-center gap-3">
                  <Compass className="w-5 h-5 text-slate-400 shrink-0" />
                  <p className="text-sm text-slate-300">Hope you have your way figured out! Safe travels to the venue.</p>
                </div>
                <button 
                  onClick={() => handleSaveRSVP(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4 whitespace-nowrap font-medium"
                >
                  Changed your mind? Edit selection
                </button>
              </div>
            )}

            {/* STATE FEEDBACK: YES - Configuration Form */}
            {isJoining === true && (
              <div className="space-y-6 pt-2 border-t border-[#334155] animate-fade-in">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3 text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-sm font-medium">It's a great event to learn and network! Let's get your origin transit details synced.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Origin Area Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Origin Neighborhood / Area</label>
                    <select
                      value={selectedAreaId}
                      onChange={(e) => {
                        setSelectedAreaId(e.target.value);
                        // Auto-save so the headcount pill and roster update immediately
                        if (isJoining && userToken && selectedEventId) {
                          setTimeout(() => {
                            fetch('/api/commute', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                user_token: userToken,
                                attendee_name: attendeeName,
                                event_id: selectedEventId,
                                area_id: e.target.value,
                                boarding_time: boardingTime,
                                is_joining: true
                              })
                            })
                              .then(r => r.json())
                              .then(() => fetchSummary(selectedEventId))
                              .catch(err => console.error(err));
                          }, 0);
                        }
                      }}
                      className="w-full bg-[#0b0f19] border border-[#334155] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      {areas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.area_name} — {area.transit_stop}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Boarding Time Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Estimated Departure Window</label>
                    <select
                      value={boardingTime}
                      onChange={(e) => {
                        setBoardingTime(e.target.value);
                        if (isJoining && userToken && selectedEventId) {
                          setTimeout(() => {
                            fetch('/api/commute', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                user_token: userToken,
                                attendee_name: attendeeName,
                                event_id: selectedEventId,
                                area_id: selectedAreaId,
                                boarding_time: e.target.value,
                                is_joining: true
                              })
                            })
                              .then(r => r.json())
                              .then(() => fetchSummary(selectedEventId))
                              .catch(err => console.error(err));
                          }, 0);
                        }
                      }}
                      className="w-full bg-[#0b0f19] border border-[#334155] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      {boardingTimeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Live Community Headcount Pill for selected area */}
                {userCluster && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        🔥 {userCluster.headcount} BUILDERS BOARDING FROM {userCluster.area_name.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">Synced in real-time</span>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN: Event-Day Huddle Manifest & Arrival Check-in */}
        <div className="lg:col-span-5 space-y-6" id="huddle">
          
          {/* Huddle Manifest Card */}
          <div className="bg-[#171b26]/90 backdrop-blur-xl border border-[#334155] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">EVENT-DAY HUDDLE MANIFEST</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold">
                T-60 MIN
              </span>
            </div>

            {isJoining !== true ? (
              <div className="text-center py-12 space-y-3">
                <Coffee className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="font-semibold text-white">RSVP 'YES' to Unlock Huddle Manifest</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Select your neighborhood and boarding time to view fellow attendees and last-mile split recommendations.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Origin Meetup Landmark */}
                <div className="bg-[#0b0f19] border border-[#334155] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Designated Meetup Point</span>
                    <span className="text-xs text-emerald-400 font-semibold">{boardingTime}</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {currentArea?.common_meetup_point || 'Main Gate Ticket Counter'}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {currentArea?.transit_stop || 'Metro Station'}
                      </p>
                    </div>
                  </div>

                  {/* Arrival Toggle Check-in Button */}
                  <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between">
                    <div className="text-xs text-slate-300">
                      {isArrived ? (
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> You are checked in at meetup point!
                        </span>
                      ) : (
                        <span>Reached the transit meetup point?</span>
                      )}
                    </div>
                    <button
                      onClick={handleToggleArrival}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        isArrived 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                          : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md'
                      }`}
                    >
                      {isArrived ? '✓ I Have Arrived' : 'Click: I Have Arrived'}
                    </button>
                  </div>
                </div>

                {/* Group Roster from Hub */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span>HUB PEER ROSTER ({userCluster?.headcount || 0} joining)</span>
                    <span>Arrival Status</span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {userCluster?.attendees && userCluster.attendees.length > 0 ? (
                      userCluster.attendees.map((att, idx) => (
                        <div key={idx} className="bg-[#0b0f19] border border-[#334155] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center border border-blue-500/30">
                              {att.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-semibold text-white">{att.name}</span>
                              <span className="block text-[10px] text-slate-400">Boarding at {att.boarding_time}</span>
                            </div>
                          </div>
                          <div>
                            {att.is_arrived ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium text-[10px]">
                                Arrived at Stop
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                                En Route
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-4">No other builders registered for this stop yet. Be the first!</p>
                    )}
                  </div>
                </div>

                {/* Last-Mile Cab Split Action Card */}
                {userCluster?.last_mile_plan && (
                  <div className="border border-dashed border-[#334155] rounded-xl p-4 bg-[#0b0f19]/50 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                      <Navigation className="w-4 h-4" />
                      <span>LAST-MILE CAB & AUTO SPLIT</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {userCluster.last_mile_plan.recommendation}
                    </p>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1e293b]">
                      <span className="text-slate-400">Est. Shared Cost:</span>
                      <span className="font-bold text-white">
                        ₹{userCluster.last_mile_plan.per_person_split_inr} / person <span className="text-[10px] text-slate-400">(Total ~₹{userCluster.last_mile_plan.estimated_total_fare_in_inr})</span>
                      </span>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Quick Venue Info Card */}
          {activeEvent && (
            <div className="bg-[#171b26]/90 backdrop-blur-xl border border-[#334155] rounded-2xl p-6 shadow-2xl space-y-3" id="coordination">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">VENUE DROP-OFF TARGET</span>
              <h3 className="font-bold text-white text-base">{activeEvent.venue_area}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Nearest Venue Stop: <strong>{activeEvent.nearest_venue_stop}</strong></span>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* FOOTER BADGE */}
      <footer className="mt-auto py-6 text-center text-xs text-slate-500 border-t border-[#1e293b] flex items-center justify-center gap-4">
        <span>FastAPI v1 • Swagger Docs [/docs]</span>
        <span>•</span>
        <a href="/docs" target="_blank" className="text-blue-400 hover:underline flex items-center gap-1">
          View API Docs <ExternalLink className="w-3 h-3" />
        </a>
      </footer>

    </div>
  );
}
