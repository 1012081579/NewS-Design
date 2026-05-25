const newTags = [
  { label: "4", tone: "yellow" },
  { label: "A", tone: "lavender" },
  { label: "E", tone: "pink" },
  { label: "II", tone: "green" },
  { label: "P", tone: "gold" },
  { label: "L", tone: "gray" },
  { label: "Q", tone: "gray" },
  { label: "7", tone: "orange" },
];

const completedTags = ["1", "8", "Q", "R", "O", "X", "2", "T", "C"];

const courses = [
  {
    count: "12",
    label: "Done",
    title: ["Strategy", "Session"],
    tags: [{ label: "2", type: "text" }, { label: "T", tone: "neutral" }],
    icon: "bottle",
    variant: "strategy",
  },
  {
    count: "3",
    label: "Lessons",
    title: ["Brain", "Upgrade"],
    tags: [{ label: "Q", tone: "neutral" }, { label: "7", tone: "orange" }],
    icon: "suitcase",
    variant: "brain",
  },
  {
    count: "8",
    label: "Lessons",
    title: ["Focus", "Sprint"],
    tags: [{ label: "A", tone: "neutral" }, { label: "4", tone: "orange" }],
    icon: "pillar",
    variant: "extra",
  },
  {
    count: "5",
    label: "Lessons",
    title: ["Market", "Signal"],
    tags: [{ label: "M", tone: "neutral" }, { label: "9", tone: "orange" }],
    icon: "suitcase",
    variant: "brain",
  },
  {
    count: "7",
    label: "Lessons",
    title: ["Audio", "Flow"],
    tags: [{ label: "F", tone: "neutral" }, { label: "2", tone: "orange" }],
    icon: "pillar",
    variant: "extra",
  },
  {
    count: "4",
    label: "Lessons",
    title: ["Brand", "System"],
    tags: [{ label: "B", tone: "neutral" }, { label: "6", tone: "orange" }],
    icon: "bottle",
    variant: "brain",
  },
  {
    count: "9",
    label: "Lessons",
    title: ["Creative", "Drill"],
    tags: [{ label: "C", tone: "neutral" }, { label: "3", tone: "orange" }],
    icon: "suitcase",
    variant: "extra",
  },
  {
    count: "2",
    label: "Lessons",
    title: ["Research", "Lab"],
    tags: [{ label: "R", tone: "neutral" }, { label: "8", tone: "orange" }],
    icon: "pillar",
    variant: "brain",
  },
  {
    count: "6",
    label: "Lessons",
    title: ["Growth", "Map"],
    tags: [{ label: "G", tone: "neutral" }, { label: "1", tone: "orange" }],
    icon: "bottle",
    variant: "extra",
  },
  {
    count: "10",
    label: "Lessons",
    title: ["Design", "Edge"],
    tags: [{ label: "D", tone: "neutral" }, { label: "5", tone: "orange" }],
    icon: "suitcase",
    variant: "brain",
  },
  {
    count: "1",
    label: "Lesson",
    title: ["Launch", "Mode"],
    tags: [{ label: "L", tone: "neutral" }, { label: "0", tone: "orange" }],
    icon: "pillar",
    variant: "extra",
  },
  {
    count: "11",
    label: "Lessons",
    title: ["Final", "Review"],
    tags: [{ label: "V", tone: "neutral" }, { label: "2", tone: "orange" }],
    icon: "bottle",
    variant: "brain",
  },
];

const categories = [
  { mark: "S", name: "System", detail: "Design is not decoration. It is the creation of systems that organize complexity into clarity." },
  { mark: "U", name: "Uniform", detail: "Consistency builds trust. A uniform structure allows experiences to feel seamless and intuitive." },
  { mark: "Z", name: "Zero", detail: "Remove the unnecessary. Zero noise, zero friction, zero visual excess." },
  { mark: "I", name: "Interval", detail: "Good design lives in spacing, rhythm, and timing — the intervals between elements define the experience." },
  { mark: "Y", name: "Yield", detail: "Design should produce outcomes. Every interaction must yield meaning, efficiency, or emotion." },
  { mark: "U", name: "Utility", detail: "Aesthetic without function is incomplete. Utility transforms visuals into usable experiences." },
  { mark: "E", name: "Edge", detail: "Innovation happens at the edge — between technology, culture, and human behavior." },
];

function createToken(label, className = "") {
  const token = document.createElement("span");
  token.className = `token ${className}`.trim();
  token.textContent = label;
  return token;
}

function renderNewTags() {
  const host = document.querySelector("#new-tags");
  newTags.forEach((tag) => {
    host.appendChild(createToken(tag.label, tag.tone));
  });
}

function renderCompletedTags() {
  const host = document.querySelector("#done-tags");
  completedTags.forEach((label) => {
    host.appendChild(createToken(label, "light"));
  });
}

function renderCourses() {
  const host = document.querySelector("#course-grid");
  courses.forEach((course) => {
    const card = document.createElement("article");
    const stat = document.createElement("div");
    const statMain = document.createElement("span");
    const statSub = document.createElement("span");
    const statLabel = document.createElement("span");
    const title = document.createElement("h2");
    const titleMuted = document.createElement("span");
    const tags = document.createElement("div");
    const icon = document.createElement("div");

    card.className = `course-card course-card-${course.variant}`;
    stat.className = "course-stat";
    statMain.className = "stat-main";
    statSub.className = "stat-sub";
    statLabel.className = "stat-label";
    tags.className = "course-tags";
    icon.className = `silhouette ${course.icon}`;
    icon.setAttribute("aria-hidden", "true");

    statMain.textContent = course.count;
    statSub.textContent = "/12";
    statLabel.textContent = course.label;
    title.append(course.title[0], titleMuted);
    titleMuted.textContent = course.title[1];

    course.tags.forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = tag.type === "text" ? "small-number" : `mini-token ${tag.tone}`;
      tagElement.textContent = tag.label;
      tags.appendChild(tagElement);
    });

    stat.append(statMain, statSub, statLabel);
    card.append(stat, title, tags, icon);
    host.appendChild(card);
  });
}

function renderCategories() {
  const host = document.querySelector("#category-list");
  categories.forEach((category) => {
    const item = document.createElement("li");
    const mark = document.createElement("span");
    const name = document.createElement("span");
    const detail = document.createElement("p");

    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-expanded", "false");
    mark.className = "category-mark";
    mark.textContent = category.mark;
    name.className = "category-name";
    name.textContent = category.name;
    detail.className = "category-detail";
    detail.textContent = category.detail;

    item.append(mark, name, detail);
    item.addEventListener("click", () => toggleCategory(item));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleCategory(item);
      }
    });
    host.appendChild(item);
  });
}

function toggleCategory(activeItem) {
  const isOpen = activeItem.classList.contains("is-open");

  document.querySelectorAll(".category-list li").forEach((item) => {
    item.classList.remove("is-open");
    item.setAttribute("aria-expanded", "false");
  });

  if (!isOpen) {
    activeItem.classList.add("is-open");
    activeItem.setAttribute("aria-expanded", "true");
  }
}

function readHoverColors() {
  const styles = getComputedStyle(document.documentElement);
  const names = [
    "--yellow",
    "--green",
    "--pink",
    "--orange",
    "--gold",
    "--lavender",
  ];

  return names.map((name) => styles.getPropertyValue(name).trim()).filter(Boolean);
}

function applyRandomHover() {
  const colors = readHoverColors();
  const selectors = [
    "a",
    "button",
    ".token",
    ".mini-token",
    ".course-card",
    ".category-list li",
  ];

  document.querySelectorAll(selectors.join(",")).forEach((element) => {
    element.classList.add("random-hover");

    const setRandomFill = () => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      element.style.setProperty("--hover-fill", color);
    };

    element.addEventListener("mouseenter", setRandomFill);
    element.addEventListener("focus", setRandomFill);
  });
}

renderNewTags();
renderCompletedTags();
renderCourses();
renderCategories();
applyRandomHover();
