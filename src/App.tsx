import { useState, useEffect, useRef } from "react";

// Custom hook: Typewriter effect
function useTypewriter(text: string, speed = 36, startDelay = 500) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let index = 0;
    let intervalId: any = null;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        index++;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const prevXRef = useRef<number | null>(null);

  // Typewriter text
  const { displayed, done } = useTypewriter(
    "Innovating • Learning • Building the Future. Now, what are we building?",
    34,
    500
  );

  // Show action pills
  useEffect(() => {
    const timer = setTimeout(() => {
      setPillsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Video Scrubbing Engine
  useEffect(() => {
    const SENSITIVITY = 0.85;

    const handlePointerMove = (clientX: number) => {
      const video = videoRef.current;
      if (!video || !video.duration) return;

      if (prevXRef.current === null) {
        prevXRef.current = clientX;
        return;
      }

      const delta = clientX - prevXRef.current;
      prevXRef.current = clientX;

      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      let nextTarget = targetTimeRef.current + timeOffset;

      nextTarget = Math.max(0, Math.min(video.duration, nextTarget));
      targetTimeRef.current = nextTarget;

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        video.currentTime = nextTarget;
      }
    };

    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handlePointerMove(e.touches[0].clientX);
    };

    const resetPointer = () => {
      prevXRef.current = null;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", resetPointer);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", resetPointer);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", resetPointer);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", resetPointer);
    };
  }, []);

  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video) return;

    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.04) {
      video.currentTime = targetTimeRef.current;
    } else {
      isSeekingRef.current = false;
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("cse@pbcoe.edu.in");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#e5e5e5] text-black select-none">
      {/* 1. Background Video */}
      <video
        ref={videoRef}
        onSeeked={handleSeeked}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4"
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover object-[70%_center] z-0 pointer-events-none"
      />

      {/* 2. Top Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-10 px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <span
            className="text-[21px] sm:text-[26px] tracking-tight font-semibold text-black"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            PBCOE CSE®
          </span>
          <span className="text-[25px] sm:text-[30px] text-black select-none tracking-[-0.02em] leading-none">
            ✳︎
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center text-[22px] text-black font-normal">
          <button
            onClick={() => setActiveModal("labs")}
            className="hover:opacity-60 transition-opacity"
          >
            Labs
          </button>
          <span className="mx-1">,</span>
          <button
            onClick={() => setActiveModal("faculty")}
            className="hover:opacity-60 transition-opacity"
          >
            Faculty
          </button>
          <span className="mx-1">,</span>
          <button
            onClick={() => setActiveModal("courses")}
            className="hover:opacity-60 transition-opacity"
          >
            Courses
          </button>
          <span className="mx-1">,</span>
          <button
            onClick={() => setActiveModal("placements")}
            className="hover:opacity-60 transition-opacity"
          >
            Placements
          </button>
          <span className="mx-1">,</span>
          <button
            onClick={() => setActiveModal("hackathons")}
            className="hover:opacity-60 transition-opacity"
          >
            Hackathons
          </button>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <button
            onClick={() => setActiveModal("contact")}
            className="text-[22px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
          >
            Get in touch
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] focus:outline-none z-20"
          aria-label="Toggle navigation"
        >
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-opacity duration-300 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white/95 backdrop-blur-sm z-[9] flex flex-col justify-center px-8 gap-6 transition-all duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {[
          { label: "Labs & Infrastructure", id: "labs" },
          { label: "Faculty Profiles", id: "faculty" },
          { label: "Courses & Syllabus", id: "courses" },
          { label: "Placements Record", id: "placements" },
          { label: "Hackathons & Projects", id: "hackathons" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveModal(item.id);
              setMenuOpen(false);
            }}
            className="text-left text-[28px] font-medium text-black"
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={() => {
            setActiveModal("contact");
            setMenuOpen(false);
          }}
          className="text-left text-[28px] font-medium text-black underline underline-offset-2"
        >
          Get in touch
        </button>
      </div>

      {/* 3. Hero Section */}
      <main className="relative z-[1] h-screen w-full flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden">
        <div className="max-w-xl relative z-10">
          
          {/* Bright, Crisp College Identity (Blur Removed) */}
          <div className="select-none mb-4 sm:mb-5">
            <span className="inline-block text-[11px] sm:text-[12px] font-mono font-semibold tracking-wider uppercase bg-black text-white px-2.5 py-0.5 rounded-sm mb-2 shadow-sm">
              PBCOE • Nagpur
            </span>
            <h1
              className="font-medium text-black tracking-tight"
              style={{
                fontSize: "clamp(20px, 4.2vw, 28px)",
                lineHeight: 1.25,
              }}
            >
              Priyadarshini Bhagwati College of Engineering
            </h1>
            <p
              className="text-black/80 font-normal mt-0.5"
              style={{
                fontSize: "clamp(16px, 3.2vw, 22px)",
                lineHeight: 1.3,
              }}
            >
              Department of Computer Science & Engineering
            </p>
          </div>

          {/* Typewriter Text */}
          <p
            className="text-black mb-5 sm:mb-6 font-normal"
            style={{
              fontSize: "clamp(18px, 3.8vw, 24px)",
              lineHeight: 1.35,
              minHeight: "54px",
            }}
          >
            <span>{displayed}</span>
            {!done && (
              <span className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink" />
            )}
          </p>

          {/* Action Pills Grid */}
          <div
            className={`flex flex-wrap gap-y-1.5 transition-all duration-400 ease-out ${
              pillsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <button
              onClick={() => setActiveModal("labs")}
              className="inline-flex items-center justify-center bg-white text-black border border-black/15 shadow-sm rounded-full text-[13px] sm:text-[14px] font-medium px-4 sm:px-5 py-[0.35em] mx-[0.2em] mb-[0.3em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200"
            >
              Explore AI & Labs
            </button>

            <button
              onClick={() => setActiveModal("faculty")}
              className="inline-flex items-center justify-center bg-white text-black border border-black/15 shadow-sm rounded-full text-[13px] sm:text-[14px] font-medium px-4 sm:px-5 py-[0.35em] mx-[0.2em] mb-[0.3em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200"
            >
              Faculty Profiles
            </button>

            <button
              onClick={() => setActiveModal("courses")}
              className="inline-flex items-center justify-center bg-white text-black border border-black/15 shadow-sm rounded-full text-[13px] sm:text-[14px] font-medium px-4 sm:px-5 py-[0.35em] mx-[0.2em] mb-[0.3em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200"
            >
              Syllabus & Schemes
            </button>

            <button
              onClick={() => setActiveModal("placements")}
              className="inline-flex items-center justify-center bg-white text-black border border-black/15 shadow-sm rounded-full text-[13px] sm:text-[14px] font-medium px-4 sm:px-5 py-[0.35em] mx-[0.2em] mb-[0.3em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200"
            >
              Placement Statistics
            </button>

            <button
              onClick={() => setActiveModal("hackathons")}
              className="inline-flex items-center justify-center bg-white text-black border border-black/15 shadow-sm rounded-full text-[13px] sm:text-[14px] font-medium px-4 sm:px-5 py-[0.35em] mx-[0.2em] mb-[0.3em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200"
            >
              SIH & Hackathons
            </button>

            <button
              onClick={() => setActiveModal("studio")}
              className="inline-flex items-center justify-center bg-white text-black border border-black/15 shadow-sm rounded-full text-[13px] sm:text-[14px] font-medium px-4 sm:px-5 py-[0.35em] mx-[0.2em] mb-[0.3em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200"
            >
              Department Life
            </button>

            {/* Email Copy Pill */}
            <button
              onClick={copyEmail}
              className="inline-flex items-center justify-center gap-2 text-white bg-black/85 border border-black rounded-full text-[13px] sm:text-[14px] font-medium px-4 sm:px-5 py-[0.35em] mx-[0.2em] mb-[0.3em] whitespace-nowrap hover:bg-black transition-colors duration-200"
            >
              <span>
                Reach HOD:{" "}
                <span className="underline underline-offset-2">cse@pbcoe.edu.in</span>
              </span>
              <svg
                className="w-3.5 h-3.5 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              {copied && (
                <span className="text-[11px] bg-white text-black px-1.5 py-0.2 rounded font-mono font-bold">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* 4. Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border border-black/10 rounded-2xl p-6 sm:p-8 text-black shadow-2xl overflow-y-auto max-h-[85vh]">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-black/50 hover:text-black text-2xl font-light"
            >
              ✕
            </button>

            {activeModal === "labs" && (
              <div>
                <h3 className="text-2xl font-semibold mb-3">Computing & AI Labs</h3>
                <p className="text-black/70 text-sm leading-relaxed mb-4">
                  Modern GPU-enabled systems, IoT sensors, and high-speed network infrastructure for practical projects and research.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-neutral-100 rounded-lg">• Artificial Intelligence & Deep Learning Lab</div>
                  <div className="p-3 bg-neutral-100 rounded-lg">• IoT & Embedded Hardware Systems Lab</div>
                  <div className="p-3 bg-neutral-100 rounded-lg">• Cloud Computing & Web Architecture Workstations</div>
                </div>
              </div>
            )}

            {activeModal === "faculty" && (
              <div>
                <h3 className="text-2xl font-semibold mb-3">Faculty Directory</h3>
                <p className="text-black/70 text-sm leading-relaxed mb-4">
                  Distinguished faculty members with expertise across Machine Learning, Operating Systems, Database Architecture, and Algorithms.
                </p>
                <div className="p-3 bg-neutral-100 rounded-lg text-xs space-y-2">
                  <div><strong>Head of Department (HOD):</strong> Ph.D. in Computer Science & Engineering</div>
                  <div><strong>Senior Mentors:</strong> Specialized guidance for hackathons, IEEE research, and industry internships.</div>
                </div>
              </div>
            )}

            {activeModal === "courses" && (
              <div>
                <h3 className="text-2xl font-semibold mb-3">Curriculum & Schemes</h3>
                <p className="text-black/70 text-sm leading-relaxed mb-4">
                  B.Tech in Computer Science & Engineering under RTMNU affiliation with curriculum aligned to industry needs.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-neutral-100 rounded">• Data Structures & Algorithms</div>
                  <div className="p-2.5 bg-neutral-100 rounded">• DBMS & SQL Architecture</div>
                  <div className="p-2.5 bg-neutral-100 rounded">• Machine Learning & AI</div>
                  <div className="p-2.5 bg-neutral-100 rounded">• Full Stack Development</div>
                </div>
              </div>
            )}

            {activeModal === "placements" && (
              <div>
                <h3 className="text-2xl font-semibold mb-3">Placement Records</h3>
                <p className="text-black/70 text-sm leading-relaxed mb-4">
                  Dedicated Training and Placement Cell providing mock technical interviews, aptitude prep, and on-campus recruitments.
                </p>
                <div className="p-3 bg-neutral-100 rounded-lg text-xs">
                  Consistent placements across leading tech firms, IT consultancies, and product startups.
                </div>
              </div>
            )}

            {activeModal === "hackathons" && (
              <div>
                <h3 className="text-2xl font-semibold mb-3">Hackathons & Projects</h3>
                <p className="text-black/70 text-sm leading-relaxed mb-4">
                  Students actively compete in Smart India Hackathon (SIH), coding bootcamps, and build open-source software solutions.
                </p>
                <div className="p-3 bg-neutral-100 rounded-lg text-xs">
                  Multiple teams selected for national finals and regional developer competitions.
                </div>
              </div>
            )}

            {activeModal === "studio" && (
              <div>
                <h3 className="text-2xl font-semibold mb-3">Department Life & Culture</h3>
                <p className="text-black/70 text-sm leading-relaxed mb-4">
                  Active student technical clubs, annual tech fests, guest lectures from industry professionals, and hands-on workshops.
                </p>
              </div>
            )}

            {activeModal === "contact" && (
              <div>
                <h3 className="text-2xl font-semibold mb-3">PBCOE CSE Department</h3>
                <p className="text-black/70 text-sm leading-relaxed">
                  Priyadarshini Bhagwati College of Engineering, Harpur Nagar, Umred Road, Nagpur,
                  Maharashtra 440024.
                  <br />
                  <br />
                  <strong>Direct Email:</strong> cse@pbcoe.edu.in
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

   