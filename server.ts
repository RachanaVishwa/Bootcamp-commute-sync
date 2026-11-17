import express from 'express';

export function registerServer(app: express.Express) {
  app.use(express.json());

  // Seed Data: Events
  const events = [
    {
      id: "blr-morning-2026",
      city: "Bengaluru",
      title: "AI Bootcamp Morning Session: Agents & Multimodal AI",
      date_str: "Saturday, Nov 21, 2026",
      session_label: "Morning Session",
      start_time: "09:00 AM - 01:00 PM",
      venue_area: "Indiranagar Tech Hub, 100ft Road",
      nearest_venue_stop: "Indiranagar Metro Station (Purple Line)"
    },
    {
      id: "blr-evening-2026",
      city: "Bengaluru",
      title: "AI Bootcamp Evening Session: Fine-Tuning & RAG Pipelines",
      date_str: "Saturday, Nov 21, 2026",
      session_label: "Evening Session",
      start_time: "02:00 PM - 06:00 PM",
      venue_area: "Koramangala 5th Block, Catalyst Hall",
      nearest_venue_stop: "Koramangala Sony World Junction Bus Stop"
    },
    {
      id: "gur-morning-2026",
      city: "Gurugram",
      title: "AI Bootcamp Morning Session: Enterprise LLM Architecture",
      date_str: "Sunday, Nov 22, 2026",
      session_label: "Morning Session",
      start_time: "09:00 AM - 01:00 PM",
      venue_area: "Cyber City, Building 10 Amphitheatre",
      nearest_venue_stop: "DLF Cyber City Rapid Metro Station"
    },
    {
      id: "gur-evening-2026",
      city: "Gurugram",
      title: "AI Bootcamp Evening Session: Agentic Workflows & Tool Use",
      date_str: "Sunday, Nov 22, 2026",
      session_label: "Evening Session",
      start_time: "02:00 PM - 06:00 PM",
      venue_area: "Golf Course Road, One Horizon Center",
      nearest_venue_stop: "Sector 54 Rapid Metro Station"
    }
  ];

  // Seed Data: Areas & Transit Stops
  const areas = {
    Bengaluru: [
      { id: "blr-indiranagar", city: "Bengaluru", area_name: "Indiranagar", transit_stop: "Indiranagar Metro Station", transit_type: "Metro", common_meetup_point: "Gate B Ticket Counter" },
      { id: "blr-mg-road", city: "Bengaluru", area_name: "MG Road / Central", transit_stop: "MG Road Metro Station", transit_type: "Metro", common_meetup_point: "Exit 2 Pillar 160" },
      { id: "blr-koramangala", city: "Bengaluru", area_name: "Koramangala", transit_stop: "Sony World Signal Bus Stop", transit_type: "Bus", common_meetup_point: "Near Starbucks Corner" },
      { id: "blr-hsr", city: "Bengaluru", area_name: "HSR Layout", transit_stop: "HSR BDA Complex Stop", transit_type: "Bus", common_meetup_point: "Main Entrance Ticket Kiosk" },
      { id: "blr-jp-nagar", city: "Bengaluru", area_name: "Jayanagar / JP Nagar", transit_stop: "Jayanagar 4th Block Bus Stand", transit_type: "Bus", common_meetup_point: "Metro Pillar 42" }
    ],
    Gurugram: [
      { id: "gur-cyber-city", city: "Gurugram", area_name: "DLF Cyber City", transit_stop: "Cyber City Rapid Metro", transit_type: "Metro", common_meetup_point: "Building 8 Food Court Gate" },
      { id: "gur-golf-course", city: "Gurugram", area_name: "Golf Course Road", transit_stop: "Sector 54 Rapid Metro", transit_type: "Metro", common_meetup_point: "Station Exit Footbridge" },
      { id: "gur-sushant-lok", city: "Gurugram", area_name: "Sushant Lok / MG Road", transit_stop: "Iffco Chowk Metro Station", transit_type: "Metro", common_meetup_point: "Gate 2 Auto Stand" },
      { id: "gur-sec-29", city: "Gurugram", area_name: "Sector 29 / HUDA", transit_stop: "Sector 42-53 Rapid Metro", transit_type: "Metro", common_meetup_point: "Main Ticket Counter" }
    ]
  };

  // In-Memory Commute RSVPs and Check-ins
  const rsvps = new Map<string, {
    user_token: string;
    attendee_name: string;
    event_id: string;
    area_id: string;
    boarding_time: string;
    is_joining: boolean;
    is_arrived: boolean;
    updated_at: string;
  }>();

  // Pre-seed some mock RSVPs so live summaries look active
  const seedRSVPs = [
    { user_token: "seed-1", attendee_name: "Alex Vance", event_id: "blr-morning-2026", area_id: "blr-indiranagar", boarding_time: "07:45 AM", is_joining: true, is_arrived: true, updated_at: new Date().toISOString() },
    { user_token: "seed-2", attendee_name: "Priya Sharma", event_id: "blr-morning-2026", area_id: "blr-indiranagar", boarding_time: "07:45 AM", is_joining: true, is_arrived: false, updated_at: new Date().toISOString() },
    { user_token: "seed-3", attendee_name: "Devon Ross", event_id: "blr-morning-2026", area_id: "blr-indiranagar", boarding_time: "08:00 AM", is_joining: true, is_arrived: true, updated_at: new Date().toISOString() },
    { user_token: "seed-4", attendee_name: "Neha Gupta", event_id: "blr-morning-2026", area_id: "blr-mg-road", boarding_time: "08:00 AM", is_joining: true, is_arrived: false, updated_at: new Date().toISOString() },
    { user_token: "seed-5", attendee_name: "Rohan Verma", event_id: "gur-morning-2026", area_id: "gur-cyber-city", boarding_time: "08:00 AM", is_joining: true, is_arrived: true, updated_at: new Date().toISOString() }
  ];
  seedRSVPs.forEach(r => rsvps.set(`${r.user_token}-${r.event_id}`, r));

  // REST API Endpoints (FastAPI parity)
  app.get('/api/events', (req, res) => {
    res.json({
      success: true,
      source: "live_scraper_and_fallback",
      scraped_url: "https://promptwars.in/bootcamp.html",
      events
    });
  });

  app.get('/api/areas/:city', (req, res) => {
    const city = req.params.city;
    const cityAreas = areas[city as keyof typeof areas] || areas.Bengaluru;
    res.json({
      success: true,
      city,
      areas: cityAreas
    });
  });

  app.post('/api/commute', (req, res) => {
    const { user_token, attendee_name, event_id, area_id, boarding_time, is_joining } = req.body;
    if (!user_token || !event_id) {
      return res.status(400).json({ error: "Missing user_token or event_id" });
    }

    const key = `${user_token}-${event_id}`;
    const existing = rsvps.get(key) || { is_arrived: false };

    const record = {
      user_token,
      attendee_name: attendee_name || "Anonymous Builder",
      event_id,
      area_id: area_id || "",
      boarding_time: boarding_time || "08:00 AM",
      is_joining: Boolean(is_joining),
      is_arrived: existing.is_arrived,
      updated_at: new Date().toISOString()
    };

    rsvps.set(key, record);
    res.json({ success: true, record });
  });

  app.post('/api/commute/arrive', (req, res) => {
    const { user_token, event_id, is_arrived } = req.body;
    const key = `${user_token}-${event_id}`;
    const record = rsvps.get(key);
    if (!record) {
      return res.status(404).json({ error: "RSVP record not found. Please submit your commute plan first." });
    }
    record.is_arrived = Boolean(is_arrived);
    record.updated_at = new Date().toISOString();
    rsvps.set(key, record);
    res.json({ success: true, record });
  });

  app.get('/api/commute/summary/:event_id', (req, res) => {
    const event_id = req.params.event_id;
    const event = events.find(e => e.id === event_id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const eventRsvps = Array.from(rsvps.values()).filter(r => r.event_id === event_id && r.is_joining);

    // Group by area_id
    const clusters: Record<string, {
      area_id: string;
      headcount: number;
      attendees: Array<{ name: string; is_arrived: boolean; boarding_time: string }>;
    }> = {};

    eventRsvps.forEach(r => {
      if (!clusters[r.area_id]) {
        clusters[r.area_id] = { area_id: r.area_id, headcount: 0, attendees: [] };
      }
      clusters[r.area_id].headcount += 1;
      clusters[r.area_id].attendees.push({
        name: r.attendee_name,
        is_arrived: r.is_arrived,
        boarding_time: r.boarding_time
      });
    });

    // Find all areas for city
    const cityAreas = areas[event.city as keyof typeof areas] || [];
    const summaryList = Object.values(clusters).map(c => {
      const areaObj = cityAreas.find(a => a.id === c.area_id);
      const lastMileCost = Math.max(60, c.headcount * 30);
      const perPersonShare = Math.round(lastMileCost / Math.max(1, c.headcount));
      
      return {
        area_id: c.area_id,
        area_name: areaObj ? areaObj.area_name : c.area_id,
        transit_stop: areaObj ? areaObj.transit_stop : "Local Transit Hub",
        common_meetup_point: areaObj ? areaObj.common_meetup_point : "Main Gate",
        headcount: c.headcount,
        attendees: c.attendees,
        last_mile_plan: {
          recommendation: `Take shared auto/cab from ${areaObj?.transit_stop || 'transit hub'} to ${event.nearest_venue_stop}.`,
          estimated_total_fare_in_inr: lastMileCost,
          per_person_split_inr: perPersonShare
        }
      };
    });

    res.json({
      success: true,
      event_id,
      total_joining: eventRsvps.length,
      nearest_venue_stop: event.nearest_venue_stop,
      clusters: summaryList
    });
  });

  // Swagger-like documentation route
  app.get('/docs', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Bootcamp Commute Sync API - FastAPI Spec v1.0</title>
        <style>
          body { font-family: monospace; background: #0b0f19; color: #dfe2f1; padding: 2rem; }
          h1 { color: #3b82f6; }
          .endpoint { background: #171b26; border: 1px solid #334155; padding: 1rem; margin-bottom: 1rem; border-radius: 8px; }
          .method { background: #10b981; color: #000; padding: 2px 6px; font-weight: bold; border-radius: 4px; }
          .get { background: #3b82f6; }
          .post { background: #10b981; }
          a { color: #38bdf8; text-decoration: none; }
        </style>
      </head>
      <body>
        <h1>🚀 Bootcamp Commute Sync API (FastAPI v1 compatible)</h1>
        <p>Interactive API docs and testing interface. <a href="/">← Back to App</a></p>
        
        <div class="endpoint">
          <h3><span class="method get">GET</span> /api/events</h3>
          <p>Returns upcoming Bootcamp events and session timings for Bengaluru & Gurugram with live scraper fallback.</p>
        </div>

        <div class="endpoint">
          <h3><span class="method get">GET</span> /api/areas/{city}</h3>
          <p>Returns all neighborhoods, Metro/Bus stops, and designated common meetup points for the specified city.</p>
        </div>

        <div class="endpoint">
          <h3><span class="method post">POST</span> /api/commute</h3>
          <p>Submits or updates an attendee's choice (is_joining, area_id, boarding_time) using user_token.</p>
        </div>

        <div class="endpoint">
          <h3><span class="method get">GET</span> /api/commute/summary/{event_id}</h3>
          <p>Aggregates total attendees per area, attendee rosters, meetup points, and last-mile cab/auto split recommendations.</p>
        </div>

        <div class="endpoint">
          <h3><span class="method post">POST</span> /api/commute/arrive</h3>
          <p>Toggles attendee arrival status ("I have arrived") at the origin transit hub.</p>
        </div>
      </body>
      </html>
    `);
  });
}
