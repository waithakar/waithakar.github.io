/*
  CONTENT FILE
  Everything on the site is built from this one file. Edit the words here and
  refresh the page. You never need to touch the other files to add or change content.

  How it works
  Each block inside "stations" is one machine on the shop floor AND one section
  on the page. The crane visits them in the order they appear here.
  To add a project or a whole new section, copy a block, paste it where you want
  it in the list, and change the words. See README.md for the full field list.

  Rules of thumb
  1. Every block needs: id, group, station, machine, title.
  2. Leave out any field you do not need. Empty sections are skipped.
  3. Keep the commas between blocks and between items in a list.
  4. Text can include simple HTML such as <a href="...">a link</a> or <em>words</em>.
*/

window.SITE = {
  name: "Isaac Waithaka",
  role: "Mechanical engineering senior, University of Washington Tacoma",
  intro: "I design parts in CAD, check them by hand and with FEA, then build and measure them.",
  goal: "Looking for a new graduate mechanical engineering role in clean energy hardware, starting June 2027.",
  email: "issaka25473@gmail.com",
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/isaac-waithaka" },
    { label: "GitHub", url: "https://github.com/waithakar" }
  ],

  // To add a resume button, put your PDF in the assets folder and write its path here,
  // for example: resume: "assets/Isaac_Waithaka_Resume.pdf",
  resume: "",

  // The title block next to your name. Add or remove rows freely.
  facts: [
    ["Degree", "B.S. Mechanical Engineering"],
    ["Graduates", "June 2027"],
    ["School", "University of Washington Tacoma"],
    ["GPA", "3.76"],
    ["Based in", "Tacoma, WA"],
    ["Relocation", "Open"]
  ],

  // Footer title block. Bump the revision letter when you make a big update.
  revision: "C, November 2026",
  footnote: "Figures are from my course reports. Build photos of the printed gearbox and machined parts are coming.",

  stations: [

    /* ===================== PROJECTS ===================== */

    {
      id: "capstone",
      group: "Projects",
      station: "Capstone",
      machine: "gantry",
      tag: "Senior capstone",
      status: "Design in progress",
      title: "Alder Dam intake gate crane redesign",
      meta: "Team project for Tacoma Public Utilities, fall 2026 to spring 2027",
      tiles: [
        ["50 MW", "Alder Dam hydro plant, Tacoma Power"],
        ["3", "machinery systems: trolley, hoist, travel drive"],
        ["2027", "final design and small scale prototype"]
      ],
      text: [
        "Tacoma Power's Alder Dam on the Nisqually River uses a crane to raise and lower its intake gates. Our senior design team is redesigning the crane's trolley, hoist, and travel drive machinery as a plug and play replacement.",
        "We review the current machinery arrangement, give Tacoma Public Utilities alternative solutions to review, then prepare drawings, calculations, and analysis for the selected design and build a small scale prototype."
      ],
      listTitle: "My part so far",
      list: [
        "Testing whether our industry advisor's SolidWorks weldment library works for the trolley's structural frame layout."
      ],
      note: "The SolidWorks model and drawings go up here once the design is final in 2027. The crane at the top of this page is a nod to this project.",
      specs: [
        ["Site", "Alder Dam, 50 MW hydro plant (Tacoma Power)"],
        ["Hoist design", "Horsepower, motor, gear reduction and reducer, wire rope, rope drum"],
        ["Trolley design", "Frame and travel drive machinery"],
        ["Deliverables", "Drawings, calculations, analysis, small scale prototype"],
        ["Timeline", "Fall 2026 to spring 2027"]
      ]
    },

    {
      id: "hook",
      group: "Projects",
      station: "Lift hook",
      machine: "hook",
      tag: "TME 341",
      title: "Patient lift hook: design, hand calculations, and FEA",
      meta: "Mechanical Design I, team of 4, winter 2026",
      tiles: [
        ["38%", "lighter, 0.29 to 0.18 lbm"],
        ["2.03", "safety factor, 2.0 required"],
        ["17,325", "lbf/in stiffness, 1,000 required"],
        ["10.7%", "gap between hand calculation and FEA"]
      ],
      text: [
        "The hook is the load path between a patient lift's boom and the sling, hung between two 0.5 in pins 4 in apart. It had to carry 500 lbf with a safety factor of 2 and stay stiffer than 1,000 lbf/in, cut from 0.25 in nylon, aluminum, or acrylic plate."
      ],
      list: [
        "Treated the critical section as a tie plus a beam in bending and solved for its depth with a MATLAB root finder (h = 0.613 in).",
        "Ran the same geometry in SolidWorks Simulation: 24.9 ksi against 22.5 ksi by hand, a 10.7% gap we traced to the curved, irregular section. Raised h to 0.67 in to keep the safety factor.",
        "Removed material from low stress regions across four concepts, then checked waterjet tolerances, cut edge quality, and nesting on 1/4 in 6061 plate."
      ],
      specs: [
        ["Safety factor (von Mises)", "2.03 (2.0 required)"],
        ["Stiffness", "17,325 lbf/in (1,000 required)"],
        ["Mass", "0.18 lbm, down 38% from 0.29"],
        ["Hand calculation vs FEA", "10.7% difference"],
        ["Estimated unit cost", "$0.18"]
      ],
      figures: [
        {
          images: [
            { src: "assets/hook-concept-1.jpg", alt: "Concept 1: rectangular baseline hook shape" },
            { src: "assets/hook-concept-2.jpg", alt: "Concept 2: hook fitted to the design area" },
            { src: "assets/hook-concept-3.jpg", alt: "Concept 3: filleted hook with reinforced pin holes" },
            { src: "assets/hook-concept-4.jpg", alt: "Concept 4: tapered hook, deepest at mid length" }
          ],
          caption: "Team concepts 1 to 4. Concept 4 tapers so the section is deepest where the moment peaks."
        },
        { src: "assets/hook-fea-stress.jpg", alt: "Von Mises stress plot of the final hook under 500 lbf", caption: "Von Mises stress, final design, 500 lbf. Peak on the inner curve, where hand calculations predicted.", half: true },
        { src: "assets/hook-matlab-h.jpg", alt: "MATLAB plot of the stress function crossing zero at h equals 0.613 inches", caption: "MATLAB root finding for the section depth h.", half: true }
      ]
    },

    {
      id: "gearbox",
      group: "Projects",
      station: "Gearbox",
      machine: "gearbox",
      tag: "TME 342",
      title: "Planetary gearbox for a robotic elbow",
      meta: "Mechanical Design II, team of 9 in three sub teams. I led the three person gear team.",
      tiles: [
        ["80:1", "reduction over 3 stages"],
        ["100 W", "input at 4,000 RPM"],
        ["±0.1 mm", "backlash, set by tolerance study"],
        ["5 in", "cube envelope"]
      ],
      text: [
        "A three stage planetary gearbox for a robotic elbow joint, driven by a 100 W motor at 4,000 RPM and packed into a 5 x 5 x 5 in envelope."
      ],
      list: [
        "Sized each planetary stage, modeled the gears in SolidWorks, and 3D printed PLA prototypes.",
        "Ran tolerance studies on the printed gears that set ±0.1 mm backlash so the stages meshed in the assembled joint.",
        "Checked bending and contact safety factors to AGMA 2001-D04 in a parametric MATLAB script, comparing PLA with AISI 4140 steel.",
        "Gear dimensions were the reference the shaft and housing teams built around, so our numbers had to be settled first."
      ],
      specs: [
        ["Reduction", "80:1 over 3 stages"],
        ["Input", "100 W at 4,000 RPM"],
        ["Envelope", "5 x 5 x 5 in"],
        ["Gear module", "1.5 mm, FDM printed PLA"],
        ["Backlash", "±0.1 mm, set by tolerance study"],
        ["Rating check", "AGMA 2001-D04, PLA vs AISI 4140"]
      ],
      placeholder: "Photos of the printed gear stages are coming."
    },

    {
      id: "machining",
      group: "Projects",
      station: "Machining",
      machine: "mill",
      tag: "TME 345",
      title: "Machined multitool and plumb bob, inspected to the drawing",
      meta: "Machining, solo",
      tiles: [
        ["28", "features inspected"],
        ["8", "out of tolerance, each traced to a cause"],
        ["0.005 in", "tightest callout, taper runout"],
        ["3", "machines: CNC mill, manual mill, lathe"]
      ],
      text: [
        "A three part aluminum multitool (jaw, bottle opener arm, slotted driver arm) cut on CNC and manual mills and joined with press fit pins, and a steel plumb bob turned on a lathe with a 30 degree taper and a tapped 3/8-16 UNC blind hole."
      ],
      list: [
        "Inspected 28 features with calipers, micrometers, gauge pins, and a dial indicator. 8 were out of tolerance.",
        "Traced the flatness and parallelism misses to the mill table setup, and to measuring only at the end, when it was too late for a corrective pass.",
        "For a rebuild: measure after every operation and use a fly cutter on datum faces. For volume: fixture plates and full CNC for the arms, casting for the jaw, and in line measurement."
      ],
      specs: [
        ["Features inspected", "28"],
        ["Out of tolerance", "8"],
        ["Tightest callout", "Plumb bob taper runout, 0.005 in"],
        ["Machines", "CNC mill, manual mill, lathe"]
      ],
      figures: [
        { src: "assets/machining-jaw-drawing.jpg", alt: "Course drawing of the multitool jaw with GD&T callouts", caption: "Course drawing for the jaw. I machined to these callouts." },
        { src: "assets/machining-inspection.jpg", alt: "Inspection sheet with measured values and notes for each feature", caption: "My inspection sheet with measured values and notes." }
      ],
      placeholder: "Photos of the finished multitool and plumb bob are coming."
    },

    {
      id: "acoustic",
      group: "Projects",
      station: "Acoustic",
      machine: "printer",
      tag: "TME 311",
      title: "Hearing 3D print infill in the printer's sound",
      meta: "Computer Modeling, solo",
      tiles: [
        ["315 Hz", "band that takes over at 80% infill"],
        ["44 kHz", "recording rate, 1 m from the printer"],
        ["15 vs 80%", "infill settings compared"]
      ],
      text: [
        "Can a phone microphone tell two print settings apart? I recorded a Bambu A1 printing the same 40 x 20 x 10 mm prism at 15% and 80% infill, from 1 m away at 44 kHz, then analyzed the audio in MATLAB and Python."
      ],
      list: [
        "Compared the runs with FFT magnitude spectra, power spectral density, 1/3 octave band levels, and spectrograms.",
        "The 80 to 125 Hz bands stayed strong in both runs. At 80% infill, the 315 Hz band became dominant, consistent with constant back and forth infill motion exciting a mid frequency resonance.",
        "Next step: more trials, and pairing audio with accelerometer data to tie each band to an axis of motion."
      ],
      scope: true,
      figures: [
        { src: "assets/acoustic-octave-15.jpg", alt: "One third octave band levels at 15 percent infill", caption: "1/3 octave band levels, 15% infill.", half: true },
        { src: "assets/acoustic-octave-80.jpg", alt: "One third octave band levels at 80 percent infill with a tall 315 hertz band", caption: "80% infill. The 315 Hz band rises to the top.", half: true }
      ]
    },

    {
      id: "flume",
      group: "Projects",
      station: "Flume",
      machine: "flume",
      tag: "TME 332",
      title: "Breakwater shapes in a flow visualization flume",
      meta: "Fluid Mechanics, solo report",
      tiles: [
        ["5", "breakwater shapes, 3D printed"],
        ["3", "next steps: wave flume, wake imaging, CFD"]
      ],
      text: [
        "Five 3D printed breakwater geometries (semicircular, arc end, quarter circle, bumped, and cut faces) tested one at a time in a dye injected laminar flow flume, mounted in the same place and orientation for a fair comparison."
      ],
      list: [
        "Concave faces formed compact, intense recirculation zones. Bumped and cut faces spread the disturbance along the slope, like the rough armor on rubble mound breakwaters.",
        "Stated the limits plainly: steady laminar flow is not waves, so the next steps are a wave flume, image based wake measurements, and CFD."
      ],
      figures: [
        { src: "assets/flume-semicircle.jpg", alt: "Dye streamlines splitting around a yellow semicircular model", caption: "Semicircular model: flow splits and recirculates inside the curve." },
        { src: "assets/flume-bumps.jpg", alt: "Dye flow over a sloped model with spherical bumps", caption: "Bumped slope: smaller disturbances spread along the face." }
      ]
    },

    {
      id: "more",
      group: "Projects",
      station: "More work",
      machine: "bench",
      title: "More work",
      meta: "Smaller projects and work in progress",
      cards: [
        { tag: "Marine energy course, summer 2026", title: "Admiralty Inlet tidal array", text: "In a UW Tacoma course supported by the Pacific Marine Energy Center, our team analyzed tidal current data from Admiralty Inlet in Puget Sound and pitched a cross flow turbine array for the site." },
        { tag: "TME 320", title: "Materials testing lab", text: "Tensile, hardness, Charpy impact, and fatigue tests on 1018 steel, 1045 steel, and 6061 aluminum, comparing strength, toughness, and fatigue behavior." },
        { tag: "Personal project", status: "In progress", title: "ESP32 self balancing robot", text: "Comparing PID and ADRC balance control: both modeled in Simulink with sensor noise, center of gravity offset, and disturbance tests, with C++ firmware written in the Arduino IDE." }
      ]
    },

    /* ===================== EDUCATION ===================== */

    {
      id: "education",
      group: "Education",
      station: "Education",
      machine: "desk",
      title: "Education",
      tiles: [
        ["3.76", "GPA"],
        ["June 2027", "expected graduation"]
      ],
      entries: [
        {
          when: "Expected June 2027",
          title: "B.S. Mechanical Engineering",
          org: "University of Washington Tacoma",
          text: "GPA 3.76. Member of the UWT Engineering Club.",
          list: [
            "Relevant coursework: Mechanical Design I and II, Materials Science, Fluid Mechanics, Thermodynamics, Power Plant Engineering, Computer Modeling, Machining",
            "Topics covered: bolted joints and fasteners, thin wall pressure vessels, pumps, piping, and heat exchangers, fuel cells and electrolysis"
          ]
        },
        {
          when: "June 2024",
          title: "A.S. Mechanical Engineering",
          org: "Tacoma Community College"
        }
      ]
    },

    /* ===================== SKILLS ===================== */

    {
      id: "skills",
      group: "Skills",
      station: "Skills",
      machine: "toolboard",
      title: "Skills and credentials",
      groups: [
        { title: "CAD and analysis", text: "SolidWorks parts, assemblies, drawings, weldments, and Simulation. Fusion 360 (basic). MATLAB, Simulink, Python, C++, Excel." },
        { title: "Shop and inspection", text: "CNC and manual mill, lathe, FDM 3D printing, drilling and tapping. Calipers, micrometers, dial indicator, gauge pins." },
        { title: "Methods", text: "GD&T drawings, tolerance analysis, design for manufacturing, checking FEA against hand calculations, root cause analysis." },
        { title: "Certifications", text: "SolidWorks CSWA exam, Part 2 passed. MathWorks Simulink Onramp and Signal Processing Onramp." },
        { title: "Coursework topics", text: "Bolted joints and fasteners, thin wall pressure vessels, pumps, piping, heat exchangers, fuel cells and electrolysis, power plant engineering." },
        { title: "Languages", text: "English and Swahili, both fluent." }
      ]
    },

    /* ===================== EXPERIENCE ===================== */

    {
      id: "experience",
      group: "Experience",
      station: "Experience",
      machine: "locker",
      title: "Work experience",
      tiles: [
        ["2023", "working day and overnight shifts since"],
        ["5", "new staff trained on safety protocols"]
      ],
      entries: [
        {
          when: "July 2023 to present",
          title: "Direct Support Professional",
          org: "Ambitions of Washington, Tacoma, WA",
          list: [
            "Follow fire safety, seizure response, medication, and emergency protocols on day and overnight shifts and write incident reports.",
            "Trained about five new staff on safety and care protocols while carrying a full time engineering course load."
          ]
        }
      ]
    },

    /* ===================== ABOUT AND CONTACT ===================== */

    {
      id: "about",
      group: "About",
      station: "About",
      machine: "door",
      title: "About and contact",
      text: [
        "I'm a senior in mechanical engineering at the University of Washington Tacoma, graduating in June 2027 with a 3.76 GPA, after an associate degree from Tacoma Community College. I'm a member of the UWT Engineering Club.",
        "The work I want is clean energy hardware: electrolyzers, wind, tidal, and the test stands and fixtures that prove them out. My tidal energy course with the Pacific Marine Energy Center made that direction concrete.",
        "Since 2023 I've also worked day and overnight shifts as a direct support professional at Ambitions of Washington. That job runs on following safety protocols exactly and writing clear incident reports, and I've trained new staff on those protocols."
      ],
      specs: [
        ["Degree", "B.S. Mechanical Engineering, June 2027"],
        ["Also", "A.S. Mechanical Engineering, Tacoma Community College, 2024"],
        ["Location", "Tacoma, WA, open to relocation"],
        ["Available", "Full time from late June 2027"]
      ],
      contact: true
    }

  ]
};
