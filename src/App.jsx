import { useEffect, useMemo, useState } from "react";
import aohLogo from "./assets/aoh-logo-exact.png";
import honoreeCollage from "./assets/honorees-collage.png";

const navItems = [
  ["Home", "home"],
  ["About", "about"],
  ["Honorees", "honorees"],
  ["Scripture", "scripture"],
  ["Details", "details"],
  ["Register", "register"]
];

const eventStart = new Date("2026-09-03T10:00:00-04:00").getTime();

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);
}

function Reveal({ children, className = "" }) {
  return (
    <div className={`reveal ${className}`.trim()} data-reveal>
      {children}
    </div>
  );
}

function SectionHeading({ eyebrow, title, center = false }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-xs font-extrabold uppercase tracking-[0.34em] text-[#98711b]">{eyebrow}</p>
      <h2 className="mt-3 font-display text-5xl font-semibold leading-[0.95] text-plum md:text-6xl">
        {title}
      </h2>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(18,9,34,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex w-[min(1180px,calc(100%-1.5rem))] items-center justify-between py-3">
        <a href="#home" className="flex items-center gap-3">
          <img src={aohLogo} alt="AOH Church of God logo" className="h-12 w-12 rounded-full bg-white/90 object-contain p-1" />
          <div className="hidden sm:block">
            <p className="font-display text-xl font-semibold text-white">National Women&apos;s Conference</p>
            <p className="text-xs uppercase tracking-[0.24em] text-[#f1ddb0]">Apostolic Overcoming Holy Church of God, Inc.</p>
          </div>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map(([label, id]) => (
            <a key={id} href={`#${id}`} className="text-sm font-semibold text-white/88 transition hover:text-[#f2dfb6] focus-visible:text-[#f2dfb6]">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#register"
            className="hidden rounded-full bg-gradient-to-r from-[#fff1c7] to-[#d3a038] px-5 py-3 text-sm font-extrabold text-[#2b183d] shadow-glow transition hover:-translate-y-0.5 sm:inline-flex"
          >
            Register Now
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/8 text-white lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Open site navigation"
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-current"></span>
              <span className="block h-0.5 w-5 bg-current"></span>
              <span className="block h-0.5 w-5 bg-current"></span>
            </div>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[rgba(18,9,34,0.94)] lg:hidden">
          <nav className="mx-auto flex w-[min(1180px,calc(100%-1.5rem))] flex-col py-3">
            {navItems.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-white/88 transition hover:bg-white/8 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
            <a
              href="#register"
              className="mt-2 inline-flex justify-center rounded-full bg-gradient-to-r from-[#fff1c7] to-[#d3a038] px-5 py-3 text-sm font-extrabold text-[#2b183d]"
              onClick={() => setOpen(false)}
            >
              Register Now
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function Hero() {
  const [countdown, setCountdown] = useState(() => getCountdown());

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const countdownCards = useMemo(
    () => [
      ["Days", countdown.days],
      ["Hours", countdown.hours],
      ["Minutes", countdown.minutes],
      ["Seconds", countdown.seconds]
    ],
    [countdown]
  );

  return (
    <section id="home" className="relative overflow-hidden px-3 pb-20 pt-8 md:px-6 md:pb-24">
      <div className="hero-floral absolute inset-0"></div>
      <div
        className="absolute inset-0 opacity-20 blur-2xl"
        style={{
          backgroundImage: `url(${honoreeCollage})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover"
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,5,23,0.28),rgba(10,5,23,0.56))]" aria-hidden="true"></div>

      <div className="relative mx-auto grid w-[min(1180px,100%)] gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
        <Reveal className="rounded-[2rem] border border-white/10 bg-white/7 p-7 shadow-glow backdrop-blur-xl md:p-10">
          <p className="font-script text-4xl text-[#fff0c3] md:text-5xl">Women of grace. Women of purpose.</p>
          <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.34em] text-[#f0d89d]">
            National Women&apos;s Conference 2026
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl font-semibold leading-[0.93] text-white md:text-8xl">
            Women of God, Clothed in Righteousness
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/86">
            “I will greatly rejoice in the Lord, my soul shall be joyful in my God; for He hath clothed me
            with the garments of salvation…” <span className="font-semibold text-[#f2dfb6]">Isaiah 61:10</span>
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.35rem] border border-white/10 bg-white/8 p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#e9d49d]">Dates</p>
              <p className="mt-2 text-lg font-semibold text-white">September 3-5, 2026</p>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-white/8 p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#e9d49d]">Daily Times</p>
              <p className="mt-2 text-lg font-semibold text-white">10:00 AM and 7:00 PM</p>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-white/8 p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#e9d49d]">City</p>
              <p className="mt-2 text-lg font-semibold text-white">Dayton, Ohio</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#register"
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#fff1c7] to-[#d3a038] px-7 py-4 text-base font-extrabold text-[#2a153d] shadow-glow transition hover:-translate-y-0.5"
            >
              Register Now
            </a>
            <a
              href="#details"
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/18 bg-white/6 px-7 py-4 text-base font-bold text-white transition hover:-translate-y-0.5 hover:border-white/40"
            >
              Conference Details
            </a>
          </div>
        </Reveal>

        <Reveal className="rounded-[2rem] border border-white/10 bg-[rgba(18,12,48,0.78)] p-6 shadow-glow backdrop-blur-xl md:p-7">
          <div className="overflow-hidden rounded-[1.6rem] border border-white/14 bg-white/6 p-3">
            <img
              src={honoreeCollage}
              alt="Collage honoring women of excellence connected to the conference."
              className="h-[320px] w-full rounded-[1.2rem] object-cover object-center shadow-soft md:h-[420px]"
            />
          </div>

          <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.3em] text-[#f0d89d]">Countdown to Conference</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {countdownCards.map(([label, value]) => (
              <div key={label} className="rounded-[1.2rem] border border-white/10 bg-white/8 p-4 text-center">
                <div className="font-display text-5xl font-semibold leading-none text-white">{String(value).padStart(2, "0")}</div>
                <div className="mt-2 text-xs font-extrabold uppercase tracking-[0.24em] text-white/70">{label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="bg-[linear-gradient(180deg,#fffdfd,#f7f0ff)] px-3 py-20 text-plum md:px-6">
      <div className="mx-auto w-[min(1180px,100%)]">
        <Reveal className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="About the Gathering" title="A Gathering of Faith, Strength, and Sisterhood" />
            <div className="mt-8 h-1 w-28 rounded-full bg-gradient-to-r from-[#dcb457] to-[#f1e2b1]"></div>
            <div className="mt-8 space-y-6 text-lg leading-8 text-[#564669]">
              <p>
                Join women from across the nation for a powerful and uplifting time in the presence of God.
                The National Women&apos;s Conference is designed to inspire, empower, and strengthen women
                in their walk with Christ.
              </p>
              <p>
                Through dynamic teaching, heartfelt worship, and meaningful fellowship, you will be
                encouraged to walk boldly in righteousness and embrace your divine purpose.
              </p>
              <p>
                Come expecting renewal, connection, and transformation as we gather together under the
                theme: <span className="font-semibold text-plum">“Women of God, Clothed in Righteousness.”</span>
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {[
              ["Inspire", "Messages rooted in truth, dignity, and a holy sense of calling."],
              ["Empower", "A conference atmosphere that strengthens women to walk boldly with Christ."],
              ["Connect", "Fellowship that creates room for sisterhood, prayer, and encouragement."]
            ].map(([title, body]) => (
              <article key={title} className="rounded-[1.8rem] border border-[#eadccf] bg-white p-6 shadow-soft">
                <div className="mb-4 h-1.5 w-16 rounded-full bg-gradient-to-r from-[#d6a944] to-[#f5dfaa]"></div>
                <h3 className="font-display text-3xl font-semibold text-plum">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[#5b4c69]">{body}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Honorees() {
  return (
    <section id="honorees" className="px-3 py-20 md:px-6">
      <div className="mx-auto w-[min(1180px,100%)]">
        <Reveal className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative mx-auto w-full max-w-[34rem]">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(232,200,124,0.42),transparent_58%)] blur-2xl" aria-hidden="true"></div>
            <div className="relative rounded-[2.6rem] border border-white/12 bg-white/8 p-4 shadow-glow backdrop-blur-xl">
              <div className="rounded-[2.2rem] border-4 border-[#eed38c] bg-white/12 p-3">
                <img
                  src={honoreeCollage}
                  alt="Honoring Women of Excellence collage featuring conference women leaders."
                  className="aspect-square w-full rounded-[2rem] object-cover object-center"
                />
              </div>
            </div>
          </div>

          <div className="text-white">
            <SectionHeading eyebrow="Honoring Women of Excellence" title="A legacy of wisdom, leadership, and faith." />
            <div className="mt-7 space-y-6 text-lg leading-8 text-white/82">
              <p>
                We celebrate the wisdom, leadership, and faith of the remarkable women who continue to
                impact lives through ministry, service, and dedication to God&apos;s work.
              </p>
              <p>
                Their legacy and commitment serve as a powerful example of grace, strength, and unwavering faith.
              </p>
            </div>
            <div className="mt-8 rounded-[1.8rem] border border-white/12 bg-white/8 p-6 shadow-glow">
              <p className="font-script text-4xl text-[#f4dfaa]">Grace in service. Strength in calling.</p>
              <p className="mt-3 text-sm uppercase tracking-[0.26em] text-white/70">
                This section is prepared to feature the uploaded honoree collage in a soft framed presentation.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Scripture() {
  return (
    <section id="scripture" className="bg-[linear-gradient(180deg,#f9f1ff,#efe3ff)] px-3 py-20 md:px-6">
      <div className="mx-auto w-[min(1180px,100%)]">
        <Reveal className="relative overflow-hidden rounded-[2.4rem] border border-[#eadcbf] bg-[linear-gradient(140deg,#251247,#20407f)] p-8 shadow-glow md:p-12">
          <div className="absolute inset-0 opacity-16" aria-hidden="true">
            <div className="absolute left-1/2 top-10 h-[78%] w-8 -translate-x-1/2 rounded-full bg-white/70"></div>
            <div className="absolute left-1/2 top-[38%] h-8 w-[58%] -translate-x-1/2 rounded-full bg-white/70"></div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,230,160,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(153,109,233,0.22),transparent_28%)]" aria-hidden="true"></div>
          <div className="relative mx-auto max-w-4xl text-center text-white">
            <p className="font-script text-4xl text-[#f4dfaa] md:text-5xl">Clothed in Righteousness</p>
            <h2 className="mt-4 font-display text-5xl font-semibold leading-[1.02] text-white md:text-6xl">
              A promise to rejoice in the covering of God.
            </h2>
            <blockquote className="mt-8 text-xl leading-9 text-white/90 md:text-3xl md:leading-[1.5]">
              “I will greatly rejoice in the Lord, my soul shall be joyful in my God; for He hath clothed me
              with the garments of salvation, He hath covered me with the robe of righteousness…”
            </blockquote>
            <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.32em] text-[#f4dfaa]">Isaiah 61:10</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Details() {
  const cards = [
    {
      title: "Dates",
      text: "September 3-5, 2026",
      icon: <CalendarIcon />
    },
    {
      title: "Times",
      text: "10:00 AM Day Sessions and 7:00 PM Evening Services",
      icon: <ClockIcon />
    },
    {
      title: "Location",
      text: "Mt. Zion AOH Church of God, 12 College Street, Dayton, Ohio 45402",
      icon: <PinIcon />
    },
    {
      title: "Hosted By",
      text: "Apostolic Overcoming Holy Church of God, Inc.",
      icon: <ChurchIcon />
    }
  ];

  return (
    <section id="details" className="bg-white px-3 py-20 text-plum md:px-6">
      <div className="mx-auto w-[min(1180px,100%)]">
        <Reveal>
          <SectionHeading eyebrow="Conference Information" title="Everything you need to plan your visit." center />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <article key={card.title} className="rounded-[1.8rem] border border-[#ece0d4] bg-[#fffdfa] p-6 shadow-soft">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#f6e8be,#d9ab42)] text-[#39234a] shadow-soft">
                  {card.icon}
                </div>
                <h3 className="mt-5 font-display text-3xl font-semibold text-plum">{card.title}</h3>
                <p className="mt-3 text-base leading-7 text-[#5b4c69]">{card.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="#register"
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#fff1c7] to-[#d3a038] px-8 py-4 text-base font-extrabold text-[#2b183d] shadow-glow transition hover:-translate-y-0.5"
            >
              Register Now
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function RegistrationForm() {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    churchName: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setSuccess("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateForm(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSuccess("");
      return;
    }

    setValues({
      fullName: "",
      email: "",
      phone: "",
      churchName: "",
      message: ""
    });
    setErrors({});
    setSuccess("Thank you for registering! We look forward to seeing you at the conference.");
  }

  const fields = [
    ["fullName", "Full Name", "text"],
    ["email", "Email Address", "email"],
    ["phone", "Phone Number", "tel"],
    ["churchName", "Church Name", "text"]
  ];

  return (
    <section id="register" className="relative overflow-hidden px-3 py-20 md:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_10%,rgba(177,117,235,0.18),transparent_24%),radial-gradient(circle_at_90%_8%,rgba(232,199,116,0.12),transparent_20%),linear-gradient(180deg,#f8f0ff,#fdfaf4)]" aria-hidden="true"></div>
      <div className="absolute inset-0 opacity-30" aria-hidden="true">
        <div className="mx-auto h-full w-[min(1180px,100%)] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(223,184,95,0.15),transparent_18%)]"></div>
      </div>
      <div className="relative mx-auto w-[min(1180px,100%)]">
        <Reveal className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="text-plum">
            <SectionHeading eyebrow="Register for the Conference" title="We&apos;re excited to welcome you." />
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#5a4b69]">
              Please complete the form below to reserve your place at this life-changing event.
            </p>
            <div className="mt-8 rounded-[1.8rem] border border-[#ecdcc2] bg-white/80 p-6 shadow-soft">
              <p className="font-script text-4xl text-[#8c6512]">A divine appointment awaits.</p>
              <p className="mt-3 text-sm uppercase tracking-[0.26em] text-[#735e81]">
                Worship. Growth. Connection. Renewal.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-[#ece0d4] bg-white p-7 shadow-glow md:p-9">
            <div className="grid gap-5 md:grid-cols-2">
              {fields.map(([name, label, type]) => (
                <label key={name} className="block">
                  <span className="mb-2 block text-sm font-bold text-plum">{label}</span>
                  <input
                    type={type}
                    name={name}
                    value={values[name]}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#ddcfeb] bg-[#fcfbff] px-4 py-3 text-[#2e2240] shadow-sm outline-none transition focus:border-[#c39b2f] focus:ring-4 focus:ring-[#f6e9c0]"
                  />
                  <span className="mt-2 block min-h-5 text-sm text-[#b54868]">{errors[name] || ""}</span>
                </label>
              ))}
            </div>

            <label className="mt-2 block">
              <span className="mb-2 block text-sm font-bold text-plum">Message optional</span>
              <textarea
                name="message"
                rows="5"
                value={values.message}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[#ddcfeb] bg-[#fcfbff] px-4 py-3 text-[#2e2240] shadow-sm outline-none transition focus:border-[#c39b2f] focus:ring-4 focus:ring-[#f6e9c0]"
              />
            </label>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#fff1c7] to-[#d3a038] px-8 py-4 text-base font-extrabold text-[#2b183d] shadow-glow transition hover:-translate-y-0.5"
              >
                Submit Registration
              </button>
              <p className="max-w-md text-sm font-semibold text-[#47674f]" aria-live="polite">
                {success}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="bg-[linear-gradient(180deg,#1a1034,#25134b)] px-3 py-20 md:px-6">
      <div className="mx-auto w-[min(1180px,100%)]">
        <Reveal className="rounded-[2.2rem] border border-white/10 bg-[linear-gradient(140deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] px-8 py-10 text-center shadow-glow md:px-14 md:py-14">
          <p className="font-script text-4xl text-[#f4dfaa] md:text-5xl">Don&apos;t Miss This Powerful Experience</p>
          <h2 className="mt-4 font-display text-5xl font-semibold leading-[0.98] text-white md:text-6xl">
            Step into worship, growth, and connection.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/82">
            This is more than a conference. It&apos;s a divine appointment. Come ready to be refreshed,
            renewed, and clothed in righteousness.
          </p>
          <a
            href="#register"
            className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#fff1c7] to-[#d3a038] px-8 py-4 text-base font-extrabold text-[#2b183d] shadow-glow transition hover:-translate-y-0.5"
          >
            Secure Your Spot Today
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#12091f] px-3 py-10 md:px-6">
      <div className="mx-auto grid w-[min(1180px,100%)] gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-7 text-white/82 shadow-glow md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex justify-center md:justify-start">
          <img src={aohLogo} alt="AOH Church of God logo" className="h-28 w-28 rounded-full bg-white/90 object-contain p-2" />
        </div>
        <div className="text-center md:text-left">
          <p className="font-display text-3xl font-semibold text-white">Apostolic Overcoming Holy Church of God, Inc.</p>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.24em] text-[#f0d89d]">Established March 16, 1916</p>
          <p className="mt-4 text-base text-white/76">Mt. Zion AOH Church of God, Dayton, Ohio</p>
          <p className="mt-2 text-sm text-white/60">© 2026 National Women&apos;s Conference. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export function App() {
  useReveal();

  return (
    <div className="font-body text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-plum"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Honorees />
        <Scripture />
        <Details />
        <RegistrationForm />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}

function getCountdown() {
  const remaining = Math.max(eventStart - Date.now(), 0);
  return {
    days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
    hours: Math.floor((remaining / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((remaining / (1000 * 60)) % 60),
    seconds: Math.floor((remaining / 1000) % 60)
  };
}

function validateForm(values) {
  const nextErrors = {};

  if (!values.fullName.trim()) {
    nextErrors.fullName = "Full name is required.";
  }

  if (!values.email.trim()) {
    nextErrors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    nextErrors.email = "Enter a valid email address.";
  }

  if (!values.phone.trim()) {
    nextErrors.phone = "Phone number is required.";
  } else if (!/^(?:\+1\s?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/.test(values.phone.trim())) {
    nextErrors.phone = "Enter a valid phone number.";
  }

  if (!values.churchName.trim()) {
    nextErrors.churchName = "Church name is required.";
  }

  return nextErrors;
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current stroke-[1.9]">
      <path d="M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current stroke-[1.9]">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5l3 2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current stroke-[1.9]">
      <path d="M12 20s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ChurchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current stroke-[1.9]">
      <path d="M12 3v5M9.5 6h5M6 20V10.5L12 7l6 3.5V20M9 20v-4h6v4M4 20h16" />
    </svg>
  );
}
