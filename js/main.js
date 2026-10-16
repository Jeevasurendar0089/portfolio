/* Portfolio interactions: nav, scroll state, tabs, architecture diagrams, reveals, copy email. */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Navigation ---------- */
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const links = navLinks ? [...navLinks.querySelectorAll('a[href^="#"]')] : [];
  const progress = document.getElementById("scrollProgress");

  const setMenu = (open) => {
    navLinks?.classList.toggle("is-open", open);
    menuToggle?.setAttribute("aria-expanded", String(open));
    menuToggle?.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  };

  menuToggle?.addEventListener("click", () => setMenu(!navLinks.classList.contains("is-open")));
  links.forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks?.classList.contains("is-open")) { setMenu(false); menuToggle?.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (navLinks?.classList.contains("is-open") && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) setMenu(false);
  });

  let ticking = false;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window) {
    const sections = links.map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => {
          const on = l.getAttribute("href") === `#${entry.target.id}`;
          l.classList.toggle("active", on);
          if (on) l.setAttribute("aria-current", "true"); else l.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 60}ms`;
      io.observe(el);
    });
  }

  /* ---------- Tabs (WAI-ARIA pattern) ---------- */
  document.querySelectorAll("[data-tabs]").forEach((wrap) => {
    const tabs = [...wrap.querySelectorAll('[role="tab"]')];
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(tab, false));
      tab.addEventListener("keydown", (e) => {
        const map = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in map)) return;
        e.preventDefault();
        select(tabs[(map[e.key] + tabs.length) % tabs.length], true);
      });
    });
  });

  /* ---------- Architecture diagrams ---------- */
  // Every description below is taken from the resume.
  const DETAILS = {
    bpos: ["Windows POS app · offline + online", "Built the billing system as a Windows laptop application and a web application, with offline and online support so billing keeps running when the internet drops."],
    bqr: ["QR table ordering", "Customers scan a QR code to place their orders themselves."],
    bvendor: ["Online order vendors", "Integrated online-order APIs from local vendors so external orders arrive in the same billing and kitchen flow."],
    bapi: ["Node.js / Express APIs", "Node.js and Express.js APIs for bill orders, food management and KOT handling."],
    bws: ["WebSockets · live kitchen status", "KOT management with real-time kitchen status pushed over WebSockets."],
    bgst: ["GST invoices", "Generates GST invoices for customer bills."],
    bpayu: ["PayU payments", "Integrated PayU for online payment handling."],
    bdash: ["Revenue dashboard · reports", "A high-level revenue dashboard and global report management for the owners."],
    broles: ["Franchises · master roles", "Franchise support with master-level role management across outlets."],
    bdata: ["PostgreSQL · Redis · Nginx cache", "PostgreSQL for persistent data, with Redis and Nginx caching for speed."],
    bdeploy: ["DigitalOcean · Linux · Nginx", "Deployed on DigitalOcean Linux servers behind Nginx."],

    hportal: ["Management portal", "Designed and built the centralized Hospitality Infotainment Management Portal hotels use to manage in-room TV content and services for every room."],
    hsvc: ["Node.js services & APIs", "Built the backend services and APIs behind content, guest-service and device workflows for HEPI TV Hospitality."],
    hsdk: ["Dynamic SDK reflection", "Developed dynamic SDK reflection capabilities for HEPI TV applications."],
    hlaunch: ["Android TV / STB launcher", "Built the HEPI TV Web Application Launcher for Android TV and AOSP-based set-top boxes."],
    htep: ["Samsung TEP Hospitality Mode", "Integrated HEPI TV with Samsung TEP Hospitality Mode launchers so the product runs natively on Samsung hotel TVs."],

    cdn: ["CDN", "Operated the production CDN, configuring VPN, Linux Netplan networking and point-to-point links between CDN and origin servers."],
    nginx: ["Nginx HTTP cache", "Second tier of a two-tier cache: Nginx caches HTTP responses to cut repeat load on origin systems."],
    apigw: ["API Gateway", "Delivered the API layer on API Gateway and Lambda, removing always-on servers from the request path."],
    lambda: ["AWS Lambda", "Production REST APIs run on Lambda behind API Gateway — no always-on servers in the request path."],
    svc: ["Node.js microservices", "Architected the platform as independently deployable Node.js microservices, designed for scalability and fault tolerance. Every service deploys and scales independently."],
    sqs: ["SQS queues", "Decoupled services with SQS queues, with retries and failure handling so that one failing service does not stall the rest."],
    ws: ["WebSocket channels", "WebSocket channels for real-time communication between services, alongside SQS for asynchronous work."],
    redis: ["Redis cache", "First tier of a two-tier cache: Redis for application data, cutting repeat load on origin systems."],
    net: ["VPN · Netplan · origin links", "Configured VPN, Linux Netplan networking and point-to-point links between CDN and origin servers."],
    ops: ["CI/CD · CloudWatch", "Automated builds and deployments through CI/CD, and added CloudWatch monitoring for operational visibility."],

    pflows: ["Recharges · STB orders · food orders", "Payment flows across HEPI TV and IPTV: TV recharges, buying new set-top boxes, in-room food orders paid directly by guests, and operator and customer self-recharge of subscriptions and individual channels."],
    porder: ["Order & billing APIs", "Node.js order and billing APIs behind recharges, STB purchases, food orders and e-commerce order handling."],
    przp: ["Razorpay", "Integrated Razorpay using the Razorpay Node.js SDK and REST APIs for payment handling."],
    ppayu: ["PayU", "Integrated PayU payment handling for billing software."],
    pwh: ["Webhook management", "Managed payment gateway webhooks to keep order and payment status in sync."],
    pqueue: ["Queues · failed-transaction handling", "Handled error and failed transactions, using queue management for reliable payment processing."],

    ext: ["Internal & third-party systems", "Built Node.js and Express.js microservices that connect internal and third-party systems through REST APIs."],
    rest: ["REST APIs", "REST APIs are the integration surface between internal services and third-party systems."],
    auth: ["JWT · role-based authorization", "Secured every API with JWT-based authentication and role-based authorization."],
    express: ["Node.js / Express.js microservices", "Built Node.js and Express.js microservices for the integration platform."],
    kafka: ["Kafka event bus", "Introduced Kafka for event-driven communication between services, replacing direct service-to-service dependencies."],
    pg: ["PostgreSQL", "Designed PostgreSQL persistence and optimized slow queries to improve API performance."],
    mongo: ["MongoDB", "MongoDB is part of the platform's data layer alongside PostgreSQL."],

    iam: ["IAM · VPC · Security groups", "Locked down AWS environments with IAM, VPC and security groups on least-privilege principles."],
    deploy: ["EC2 · Lambda · S3 · RDS · API Gateway", "Deployed cloud applications on AWS using EC2, Lambda, S3, RDS and API Gateway, designing for availability, resiliency, performance and cost optimization."],
    docker: ["Docker", "Containerized backend services with Docker across development and production."],
    pm2: ["PM2", "Ran backend services under PM2 across development and production."],
    cicd: ["CI/CD + automated tests", "Implemented CI/CD pipelines with automated testing for builds and deployments."],
    playwright: ["Playwright tests", "Automated end-to-end testing with Playwright, run as part of the CI/CD pipeline."],
    monitor: ["Prometheus · Grafana", "Monitored production services with Prometheus metrics and Grafana dashboards."],
    perf: ["Performance tuning", "Analysed and optimized the performance of backend APIs and database operations."],
    review: ["Code reviews", "Code reviews are part of how I own quality across all platforms."]
  };

  document.querySelectorAll(".case").forEach((caseEl) => {
    const nodes = [...caseEl.querySelectorAll(".node")];
    const panel = caseEl.querySelector(".node-detail");
    const title = caseEl.querySelector("[data-detail-title]");
    const text = caseEl.querySelector("[data-detail-text]");
    nodes.forEach((node) => {
      node.addEventListener("click", () => {
        const d = DETAILS[node.dataset.key];
        if (!d) return;
        nodes.forEach((n) => n.setAttribute("aria-pressed", String(n === node)));
        title.textContent = d[0];
        text.textContent = d[1];
        if (!reduceMotion) {
          panel.classList.remove("is-updating");
          void panel.offsetWidth; // restart animation
          panel.classList.add("is-updating");
        }
      });
    });
  });

  /* ---------- Copy email ---------- */
  const copyEmail = document.getElementById("copyEmail");
  copyEmail?.addEventListener("click", async () => {
    const email = copyEmail.dataset.email;
    const original = copyEmail.textContent;
    try {
      await navigator.clipboard.writeText(email);
      copyEmail.textContent = "Copied ✓";
      setTimeout(() => { copyEmail.textContent = original; }, 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });

  const year = document.getElementById("currentYear");
  if (year) year.textContent = String(new Date().getFullYear());
})();
