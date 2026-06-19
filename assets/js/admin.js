const FALLBACK_ADMIN_CONTENT = {
  site: {
    conventionTitle: "AOH Women's Convention",
    conventionTheme: '"Called for Such a Time as This"',
    scripture: "Esther 4:14",
    dates: "September 3–5, 2026",
    times: "Convention begins at 3:00 PM on Thursday",
    location: "Dayton, Ohio",
    registrationLink: "#register",
    footerFounded: "Founded March 18, 1916",
    countdownTarget: "2026-09-03T15:00:00",
    footerInfo:
      "An annual gathering of women of the Apostolic Overcoming Holy Church of God, rising together in faith, leadership, and sisterhood."
  },
  hero: {
    heading: "AOH Women's Convention",
    subtitle: "Apostolic Overcoming Holy Church of God, Incorporated",
    tagline: "Empowered. Equipped. Encouraged.",
    themeText: '"Called for Such a Time as This"',
    badgeDates: "September 3–5, 2026",
    badgeLocation: "Dayton, Ohio",
    primaryButtonText: "Register Now",
    primaryButtonLink: "#register",
    secondaryButtonText: "Learn More",
    secondaryButtonLink: "#about",
    scriptureText: "Arise.\nShine.\nImpact.",
    scriptureReference: "Matthew 5:16"
  },
  about: {
    lead: "A gathering for every woman called for such a time as this.",
    paragraphs: [
      "The AOH Women's Convention brings together women of the Apostolic Overcoming Holy Church of God from across the country for three days of worship, teaching, and sisterhood. This year we gather in Dayton, Ohio — a city of new beginnings — to be empowered, equipped, and encouraged for the work ahead.",
      "Whether you're a first-time guest or a lifelong member, you'll find anointed teaching, real fellowship, and space to hear from God about your next season."
    ]
  },
  schedule: {
    heading: "Three days in Dayton",
    intro: "A full weekend of worship, workshops, and fellowship — September 3–5, 2026.",
    days: []
  },
  hotel: {
    heading: "Plan your stay in Dayton",
    intro:
      "Everything you need to know to get here, stay comfortable, and make the most of the weekend.",
    bookingLink: "",
    cards: [
      {
        title: "Host Hotel",
        text:
          'A discounted group room block is reserved under "AOH Women\'s Convention." Book early — the block typically sells out by mid-August.',
        tag: "Details Coming Soon"
      }
    ]
  },
  contact: {
    heading: "Questions about the convention?",
    email: "info@aohwomensconvention.org",
    phone: "(217) 555-0126",
    address: "Downtown Dayton, Ohio — full address coming soon"
  },
  media: {}
};

let currentContent = structuredClone(FALLBACK_ADMIN_CONTENT);

async function requireSession() {
  const response = await fetch("/api/login", { credentials: "include" });
  const result = await response.json();
  if (!result.loggedIn) {
    window.location.href = "/login.html?redirect=/admin.html";
    throw new Error("Not signed in");
  }
}

async function loadContent() {
  const response = await fetch("/api/content?mode=preview", { credentials: "include" });
  if (!response.ok) throw new Error("Failed to load preview content");
  const result = await response.json();
  currentContent = result.content;
}

function setValue(name, value) {
  const field = document.querySelector(`[name="${name}"]`);
  if (field) field.value = value ?? "";
}

function getValue(name) {
  return document.querySelector(`[name="${name}"]`)?.value || "";
}

function renderScheduleEditor() {
  const container = document.getElementById("scheduleEditor");
  container.innerHTML = "";

  currentContent.schedule.days.forEach((day, dayIndex) => {
    const card = document.createElement("div");
    card.className = "schedule-day-card";
    card.innerHTML = `
      <div class="schedule-day-head">
        <label><span>Day Label</span><input data-day-label="${dayIndex}" type="text" value="${day.label || ""}"></label>
        <button type="button" class="admin-link" data-remove-day="${dayIndex}">Delete Day</button>
      </div>
      <div class="schedule-items" data-items="${dayIndex}"></div>
      <button type="button" class="admin-secondary small" data-add-item="${dayIndex}">Add Schedule Item</button>
    `;
    container.appendChild(card);

    const itemsContainer = card.querySelector(`[data-items="${dayIndex}"]`);
    (day.items || []).forEach((item, itemIndex) => {
      const itemRow = document.createElement("div");
      itemRow.className = "schedule-item-row";
      itemRow.innerHTML = `
        <label><span>Time</span><input data-time="${dayIndex}:${itemIndex}" type="text" value="${item.time || ""}"></label>
        <label><span>Speaker / Title</span><input data-title="${dayIndex}:${itemIndex}" type="text" value="${item.title || ""}"></label>
        <label class="full"><span>Description</span><textarea data-description="${dayIndex}:${itemIndex}" rows="3">${item.description || ""}</textarea></label>
        <button type="button" class="admin-link" data-remove-item="${dayIndex}:${itemIndex}">Delete Item</button>
      `;
      itemsContainer.appendChild(itemRow);
    });
  });
}

function populateForm() {
  setValue("site.conventionTitle", currentContent.site.conventionTitle);
  setValue("hero.subtitle", currentContent.hero.subtitle);
  setValue("site.conventionTheme", currentContent.site.conventionTheme);
  setValue("site.scripture", currentContent.site.scripture);
  setValue("site.dates", currentContent.site.dates);
  setValue("site.times", currentContent.site.times || "");
  setValue("site.location", currentContent.site.location);
  setValue("site.registrationLink", currentContent.site.registrationLink);
  setValue("site.footerFounded", currentContent.site.footerFounded);
  setValue("site.countdownTarget", currentContent.site.countdownTarget);
  setValue("hero.heading", currentContent.hero.heading);
  setValue("hero.tagline", currentContent.hero.tagline);
  setValue("hero.themeText", currentContent.hero.themeText);
  setValue("hero.badgeDates", currentContent.hero.badgeDates);
  setValue("hero.badgeLocation", currentContent.hero.badgeLocation);
  setValue("hero.primaryButtonText", currentContent.hero.primaryButtonText);
  setValue("hero.primaryButtonLink", currentContent.hero.primaryButtonLink);
  setValue("hero.secondaryButtonText", currentContent.hero.secondaryButtonText);
  setValue("hero.secondaryButtonLink", currentContent.hero.secondaryButtonLink);
  setValue("hero.scriptureText", currentContent.hero.scriptureText);
  setValue("hero.scriptureReference", currentContent.hero.scriptureReference);
  setValue("schedule.heading", currentContent.schedule.heading);
  setValue("schedule.intro", currentContent.schedule.intro);
  setValue("hotel.heading", currentContent.hotel.heading);
  setValue("hotel.intro", currentContent.hotel.intro);
  setValue("hotel.cards.0.title", currentContent.hotel.cards?.[0]?.title);
  setValue("hotel.cards.0.tag", currentContent.hotel.cards?.[0]?.tag);
  setValue("hotel.cards.0.text", currentContent.hotel.cards?.[0]?.text);
  setValue("hotel.bookingLink", currentContent.hotel.bookingLink);
  setValue("contact.heading", currentContent.contact.heading);
  setValue("contact.email", currentContent.contact.email);
  setValue("contact.phone", currentContent.contact.phone);
  setValue("contact.address", currentContent.contact.address);
  setValue("about.lead", currentContent.about.lead);
  setValue("about.paragraphs.0", currentContent.about.paragraphs?.[0]);
  setValue("about.paragraphs.1", currentContent.about.paragraphs?.[1]);
  setValue("site.footerInfo", currentContent.site.footerInfo);
  renderScheduleEditor();
  updateOverview();
}

function updateOverview(message) {
  document.getElementById("websiteStatus").textContent = message || "Draft ready";
  document.getElementById("lastUpdated").textContent =
    currentContent.site.lastUpdated || new Date().toLocaleString();
}

function collectContent() {
  currentContent.site.conventionTitle = getValue("site.conventionTitle");
  currentContent.hero.subtitle = getValue("hero.subtitle");
  currentContent.site.conventionTheme = getValue("site.conventionTheme");
  currentContent.site.scripture = getValue("site.scripture");
  currentContent.site.dates = getValue("site.dates");
  currentContent.site.times = getValue("site.times");
  currentContent.site.location = getValue("site.location");
  currentContent.site.registrationLink = getValue("site.registrationLink");
  currentContent.site.footerFounded = getValue("site.footerFounded");
  currentContent.site.countdownTarget = getValue("site.countdownTarget");
  currentContent.hero.heading = getValue("hero.heading");
  currentContent.hero.tagline = getValue("hero.tagline");
  currentContent.hero.themeText = getValue("hero.themeText");
  currentContent.hero.badgeDates = getValue("hero.badgeDates");
  currentContent.hero.badgeLocation = getValue("hero.badgeLocation");
  currentContent.hero.primaryButtonText = getValue("hero.primaryButtonText");
  currentContent.hero.primaryButtonLink = getValue("hero.primaryButtonLink");
  currentContent.hero.secondaryButtonText = getValue("hero.secondaryButtonText");
  currentContent.hero.secondaryButtonLink = getValue("hero.secondaryButtonLink");
  currentContent.hero.scriptureText = getValue("hero.scriptureText");
  currentContent.hero.scriptureReference = getValue("hero.scriptureReference");
  currentContent.schedule.heading = getValue("schedule.heading");
  currentContent.schedule.intro = getValue("schedule.intro");
  currentContent.hotel.heading = getValue("hotel.heading");
  currentContent.hotel.intro = getValue("hotel.intro");
  currentContent.hotel.cards[0].title = getValue("hotel.cards.0.title");
  currentContent.hotel.cards[0].tag = getValue("hotel.cards.0.tag");
  currentContent.hotel.cards[0].text = getValue("hotel.cards.0.text");
  currentContent.hotel.bookingLink = getValue("hotel.bookingLink");
  currentContent.contact.heading = getValue("contact.heading");
  currentContent.contact.email = getValue("contact.email");
  currentContent.contact.phone = getValue("contact.phone");
  currentContent.contact.address = getValue("contact.address");
  currentContent.about.lead = getValue("about.lead");
  currentContent.about.paragraphs[0] = getValue("about.paragraphs.0");
  currentContent.about.paragraphs[1] = getValue("about.paragraphs.1");
  currentContent.site.footerInfo = getValue("site.footerInfo");
  currentContent.site.lastUpdated = new Date().toISOString();
  return currentContent;
}

async function saveContent(action) {
  const status = document.getElementById("adminStatus");
  status.textContent = action === "publish" ? "Publishing changes..." : "Saving draft...";
  const response = await fetch("/api/content", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload: collectContent() })
  });
  const result = await response.json();
  status.textContent = result.message || "Saved.";
  currentContent = result.content || currentContent;
  updateOverview(action === "publish" ? "Published" : "Draft saved");
}

function setupMediaPreview() {
  const fileInput = document.getElementById("mediaFile");
  const preview = document.getElementById("mediaPreview");
  fileInput.addEventListener("change", () => {
    const [file] = fileInput.files || [];
    if (!file) {
      preview.textContent = "No file selected";
      return;
    }
    if (file.type === "application/pdf") {
      preview.textContent = `${file.name} (${Math.round(file.size / 1024)} KB PDF)`;
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      preview.innerHTML = `<img src="${reader.result}" alt="Upload preview">`;
    };
    reader.readAsDataURL(file);
  });
}

async function uploadMedia() {
  const status = document.getElementById("adminStatus");
  const fileInput = document.getElementById("mediaFile");
  const [file] = fileInput.files || [];
  if (!file) {
    status.textContent = "Choose a file to upload.";
    return;
  }

  const formData = new FormData();
  formData.set("file", file);
  formData.set("category", document.getElementById("mediaCategory").value);
  formData.set("mediaKey", document.getElementById("mediaKeySelect").value);

  status.textContent = "Uploading file...";
  const response = await fetch("/api/upload", {
    method: "POST",
    credentials: "include",
    body: formData
  });
  const result = await response.json();
  if (!response.ok || !result.success) {
    status.textContent = result.error || "Upload failed.";
    return;
  }

  currentContent.media[result.mediaKey] = result.url;
  document.getElementById("uploadedMediaUrl").value = result.url;
  document.getElementById("mediaUrlInput").value = result.url;
  status.textContent = result.deduplicated
    ? "Existing file reused. Draft media slot updated."
    : "Upload complete. Draft media slot updated.";
}

function setupScheduleActions() {
  document.getElementById("scheduleEditor").addEventListener("input", (event) => {
    const labelIndex = event.target.getAttribute("data-day-label");
    if (labelIndex != null) {
      currentContent.schedule.days[Number(labelIndex)].label = event.target.value;
      return;
    }
    const key = event.target.getAttribute("data-time") || event.target.getAttribute("data-title") || event.target.getAttribute("data-description");
    if (!key) return;
    const [dayIndex, itemIndex] = key.split(":").map(Number);
    const item = currentContent.schedule.days[dayIndex].items[itemIndex];
    if (event.target.hasAttribute("data-time")) item.time = event.target.value;
    if (event.target.hasAttribute("data-title")) item.title = event.target.value;
    if (event.target.hasAttribute("data-description")) item.description = event.target.value;
  });

  document.getElementById("scheduleEditor").addEventListener("click", (event) => {
    const removeDay = event.target.getAttribute("data-remove-day");
    if (removeDay != null) {
      currentContent.schedule.days.splice(Number(removeDay), 1);
      renderScheduleEditor();
      return;
    }

    const addItem = event.target.getAttribute("data-add-item");
    if (addItem != null) {
      currentContent.schedule.days[Number(addItem)].items.push({
        time: "",
        title: "",
        description: ""
      });
      renderScheduleEditor();
      return;
    }

    const removeItem = event.target.getAttribute("data-remove-item");
    if (removeItem != null) {
      const [dayIndex, itemIndex] = removeItem.split(":").map(Number);
      currentContent.schedule.days[dayIndex].items.splice(itemIndex, 1);
      renderScheduleEditor();
    }
  });

  document.getElementById("addScheduleDay").addEventListener("click", () => {
    currentContent.schedule.days.push({
      key: `day${currentContent.schedule.days.length + 1}`,
      label: `New Day ${currentContent.schedule.days.length + 1}`,
      items: []
    });
    renderScheduleEditor();
  });
}

function setupActions() {
  document.getElementById("saveDraftButton").addEventListener("click", () => saveContent("save-draft"));
  document.getElementById("publishButton").addEventListener("click", () => saveContent("publish"));

  const preview = () => window.open("/?preview=1", "_blank", "noopener");
  document.getElementById("previewButton").addEventListener("click", preview);
  document.getElementById("previewButtonBottom").addEventListener("click", preview);

  document.getElementById("uploadButton").addEventListener("click", uploadMedia);
  document.getElementById("copyMediaUrl").addEventListener("click", async () => {
    const value = document.getElementById("uploadedMediaUrl").value || document.getElementById("mediaUrlInput").value;
    if (!value) return;
    await navigator.clipboard.writeText(value);
    document.getElementById("adminStatus").textContent = "Media URL copied.";
  });

  document.getElementById("mediaKeySelect").addEventListener("change", (event) => {
    document.getElementById("mediaUrlInput").value = currentContent.media[event.target.value] || "";
  });

  document.getElementById("logoutButton").addEventListener("click", async () => {
    await fetch("/api/login?action=logout", { credentials: "include" });
    window.location.href = "/login.html";
  });
}

async function init() {
  await requireSession();
  await loadContent();
  if (!currentContent.schedule.days.length) {
    currentContent.schedule.days = [
      { key: "day1", label: "Thursday · Sept 3", items: [] },
      { key: "day2", label: "Friday · Sept 4", items: [] },
      { key: "day3", label: "Saturday · Sept 5", items: [] }
    ];
  }
  populateForm();
  setupScheduleActions();
  setupMediaPreview();
  setupActions();
}

init();
