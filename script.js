const SELECTORS = Object.freeze({
  brand: ".brand",
  newTags: "#new-tags",
  completedTags: "#done-tags",
  courseGrid: "#course-grid",
  categoryList: "#category-list",
  profilePanel: "#profile-panel",
  profileOpen: ".profile-open-trigger",
  profileLaunch: ".profile-launch-trigger",
  profileToggle: ".profile-toggle",
  profileStickerToggle: ".profile-sticker-toggle",
  profileDetail: "#profile-detail",
  profileUserCopy: ".profile-user-section p",
});

const HOVER_COLOR_TOKENS = Object.freeze([
  "--yellow",
  "--green",
  "--pink",
  "--orange",
  "--gold",
  "--lavender",
  "--cyan",
  "--lime",
]);

const HOVER_TARGETS = Object.freeze([
  "a:not(.profile-contact-card)",
  "button:not(.avatar):not(.profile-sticker-toggle)",
  ".token",
  ".mini-token",
  ".course-card",
  ".category-list li",
]);

const ACTIVATION_KEYS = new Set(["Enter", " "]);
const SELECTION_KEYS = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
  "PageUp",
  "PageDown",
]);
const PROFILE_OPEN_FOCUS_DELAY = 940;
const PROFILE_CLOSE_DURATION = 1180;
const PROFILE_COLOR_SWEEP_DELAY = 1320;
const PROFILE_COLOR_SWEEP_STEP = 130;
const SCRAMBLE_DURATION = 300;
const SCRAMBLE_UPDATE_INTERVAL = 48;
const SCRAMBLE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&+*/<>?";

const DATA = Object.freeze({
  newTags: [
    { label: "U", tone: "yellow" },
    { label: "P", tone: "lavender" },
    { label: "B", tone: "pink" },
    { label: "V", tone: "green" },
    { label: "X", tone: "gold" },
    { label: "I", tone: "cyan" },
    { label: "S", tone: "lime" },
    { label: "A", tone: "orange" },
  ],
  completedTags: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  courses: [
    {
      count: "1",
      label: "Work",
      title: ["Paylux", "UIUX"],
      tags: [{ label: "U", type: "yellow" }, { label: "1", tone: "neutral" }],
      image: "src/paylux.png",
      variant: "strategy",
    },
    {
      count: "2",
      label: "Work",
      title: ["SJA", "EXP"],
      tags: [{ label: "X", tone: "gold" }, { label: "1", tone: "neutral" }],
      image: "src/SJA.png",
      variant: "brain",
    },
    {
      count: "3",
      label: "Work",
      title: ["Religio", "Graphic"],
      tags: [{ label: "B", tone: "pink" }, { label: "1", tone: "orange" }],
      image: "src/religio.png",
      variant: "extra",
    },
    {
      count: "5",
      label: "Work",
      title: ["VVL", "VI"],
      tags: [{ label: "V", tone: "green" }, { label: "1", tone: "orange" }],
      image: "src/VVL.png",
      variant: "brain",
    },
    {
      count: "7",
      label: "Work",
      title: ["One Stone", "Brand"],
      tags: [{ label: "V", tone: "green" }, { label: "2", tone: "orange" }],
      image: "src/onestone.png",
      variant: "extra",
    },
    {
      count: "4",
      label: "Work",
      title: ["CF", "UIUX"],
      tags: [{ label: "U", tone: "yellow" }, { label: "2", tone: "orange" }],
      image: "src/commerceFlow.png",
      variant: "brain",
    },
    {
      count: "9",
      label: "Work",
      title: ["Line Gift", "UIUX"],
      tags: [{ label: "U", tone: "yellow" }, { label: "3", tone: "orange" }],
      image: "src/lineGift.png",
      variant: "extra",
    },
    {
      count: "2",
      label: "Work",
      title: ["Pipeliner", "UIUX"],
      tags: [{ label: "P", tone: "yellow" }, { label: "1", tone: "orange" }],
      image: "src/pipeLiner.png",
      variant: "brain",
    },
  ],
  categories: [
    { mark: "S", name: "System", detail: "Design is not decoration. It is the creation of systems that organize complexity into clarity." },
    { mark: "U", name: "Uniform", detail: "Consistency builds trust. A uniform structure allows experiences to feel seamless and intuitive." },
    { mark: "Z", name: "Zero", detail: "Remove the unnecessary. Zero noise, zero friction, zero visual excess." },
    { mark: "I", name: "Interval", detail: "Good design lives in spacing, rhythm, and timing \u2014 the intervals between elements define the experience." },
    { mark: "Y", name: "Yield", detail: "Design should produce outcomes. Every interaction must yield meaning, efficiency, or emotion." },
    { mark: "U", name: "Utility", detail: "Aesthetic without function is incomplete. Utility transforms visuals into usable experiences." },
    { mark: "E", name: "Edge", detail: "Innovation happens at the edge \u2014 between technology, culture, and human behavior." },
  ],
});

const ARCHIVE_NO_TONE = "light";
const PROJECT_CATEGORY_TONES = DATA.newTags.map(({ tone }) => tone).filter(Boolean);
const PROJECT_CATEGORY_TONE_BY_LABEL = new Map(
  DATA.newTags.map(({ label, tone }) => [label, tone])
);

const getStableToneIndex = (label) => (
  Array.from(label).reduce((total, character) => total + character.charCodeAt(0), 0)
  % PROJECT_CATEGORY_TONES.length
);

const getProjectCategoryTone = (label) => (
  PROJECT_CATEGORY_TONE_BY_LABEL.get(label)
  || PROJECT_CATEGORY_TONES[getStableToneIndex(label)]
  || "neutral"
);

const getCourseTagTone = ({ label, tone }, index) => {
  if (index === 0) {
    return getProjectCategoryTone(label);
  }

  if (index === 1) {
    return ARCHIVE_NO_TONE;
  }

  return tone || "neutral";
};

const FILTER_TYPES = Object.freeze({
  projectCategory: "project-category",
  archiveNo: "archive-no",
});

const getCourseProjectCategory = ({ tags = [] }) => tags[0]?.label || "";
const getCourseArchiveNo = ({ tags = [] }) => tags[1]?.label || "";

const courseMatchesFilter = (course, filter) => {
  if (!filter) {
    return true;
  }

  if (filter.type === FILTER_TYPES.projectCategory) {
    return getCourseProjectCategory(course) === filter.value;
  }

  if (filter.type === FILTER_TYPES.archiveNo) {
    return getCourseArchiveNo(course) === filter.value;
  }

  return true;
};

const queryRequired = (selector, scope = document) => {
  const element = scope.querySelector(selector);

  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }

  return element;
};

const setAttributes = (element, attributes = {}) => {
  Object.entries(attributes).forEach(([name, value]) => {
    if (value !== null && value !== undefined) {
      element.setAttribute(name, String(value));
    }
  });

  return element;
};

const createElement = (tagName, options = {}) => {
  const element = document.createElement(tagName);
  const { className, textContent, attributes } = options;

  if (className) {
    element.className = className;
  }

  if (textContent !== undefined) {
    element.textContent = textContent;
  }

  return setAttributes(element, attributes);
};

const renderList = (host, items, createItem) => {
  const fragment = document.createDocumentFragment();

  items.forEach((item, index) => {
    fragment.appendChild(createItem(item, index));
  });

  host.replaceChildren(fragment);
};

const createToken = (label, className = "", attributes = {}) => (
  createElement("button", {
    className: `token ${className}`.trim(),
    textContent: label,
    attributes: {
      type: "button",
      "aria-pressed": "false",
      ...attributes,
    },
  })
);

const createCourseStat = ({ count, label }) => {
  const stat = createElement("div", { className: "course-stat" });
  const statMain = createElement("span", { className: "stat-main", textContent: count });
  const statSub = createElement("span", { className: "stat-sub", textContent: "/12" });
  const statLabel = createElement("span", { className: "stat-label", textContent: label });

  stat.append(statMain, statSub, statLabel);
  return stat;
};

const createCourseTitle = ([primary, secondary]) => {
  const title = createElement("h2");
  const titleMuted = createElement("span", { textContent: secondary });

  title.append(primary, titleMuted);
  return title;
};

const createCourseTag = ({ label, type, tone }, index = 0) => (
  createElement("span", {
    className: type === "text" ? "small-number" : `mini-token ${getCourseTagTone({ label, tone }, index)}`,
    textContent: label,
  })
);

const createCourseCard = (course, index = 0) => {
  const card = createElement("article", {
    className: `course-card course-card-${course.variant}`,
    attributes: {
      style: `--card-index: ${index};`,
    },
  });
  const tags = createElement("div", { className: "course-tags" });
  const icon = course.image
    ? createElement("img", {
      className: "silhouette course-image",
      attributes: {
        src: course.image,
        alt: "",
        "aria-hidden": "true",
      },
    })
    : createElement("div", {
      className: `silhouette ${course.icon}`,
      attributes: { "aria-hidden": "true" },
    });

  renderList(tags, course.tags, createCourseTag);
  card.append(createCourseStat(course), createCourseTitle(course.title), tags, icon);

  return card;
};

const setFilterTokenState = (elements, activeFilter) => {
  [elements.newTags, elements.completedTags].forEach((host) => {
    host.querySelectorAll("[data-filter-type][data-filter-value]").forEach((token) => {
      const isActive = Boolean(
        activeFilter
        && token.dataset.filterType === activeFilter.type
        && token.dataset.filterValue === activeFilter.value
      );

      token.classList.toggle("is-active", isActive);
      token.setAttribute("aria-pressed", String(isActive));
    });
  });
};

const renderFilteredCourses = ({ elements, data, activeFilter }) => {
  const courses = data.courses.filter((course) => courseMatchesFilter(course, activeFilter));

  elements.courseGrid.classList.add("is-filtering");
  renderList(elements.courseGrid, courses, createCourseCard);
  applyRandomHover(elements.courseGrid);
};

const setupCourseFilters = ({ elements, data }) => {
  let activeFilter = null;

  const applyFilter = (nextFilter) => {
    activeFilter = nextFilter;
    renderFilteredCourses({ elements, data, activeFilter });
    setFilterTokenState(elements, activeFilter);
  };

  const handleFilterClick = (event) => {
    const token = event.target.closest("[data-filter-type][data-filter-value]");

    if (!token || (!elements.newTags.contains(token) && !elements.completedTags.contains(token))) {
      return;
    }

    const nextFilter = {
      type: token.dataset.filterType,
      value: token.dataset.filterValue,
    };
    const isSameFilter = Boolean(
      activeFilter
      && activeFilter.type === nextFilter.type
      && activeFilter.value === nextFilter.value
    );

    applyFilter(isSameFilter ? null : nextFilter);
  };

  elements.newTags.addEventListener("click", handleFilterClick);
  elements.completedTags.addEventListener("click", handleFilterClick);
};

const closeCategoryItems = (host) => {
  host.querySelectorAll("li").forEach((item) => {
    item.classList.remove("is-open");
    item.setAttribute("aria-expanded", "false");
  });
};

const toggleCategoryItem = (host, activeItem) => {
  const isOpen = activeItem.classList.contains("is-open");

  closeCategoryItems(host);

  if (!isOpen) {
    activeItem.classList.add("is-open");
    activeItem.setAttribute("aria-expanded", "true");
  }
};

const createCategoryItem = (category, host) => {
  const item = createElement("li", {
    attributes: {
      tabindex: "0",
      role: "button",
      "aria-expanded": "false",
    },
  });
  const mark = createElement("span", {
    className: "category-mark",
    textContent: category.mark,
  });
  const name = createElement("span", {
    className: "category-name",
    textContent: category.name,
  });
  const detail = createElement("p", {
    className: "category-detail",
    textContent: category.detail,
  });

  item.append(mark, name, detail);
  item.addEventListener("click", () => toggleCategoryItem(host, item));
  item.addEventListener("keydown", (event) => {
    if (ACTIVATION_KEYS.has(event.key)) {
      event.preventDefault();
      toggleCategoryItem(host, item);
    }
  });

  return item;
};

const readHoverColors = () => {
  const styles = getComputedStyle(document.documentElement);

  return HOVER_COLOR_TOKENS
    .map((name) => styles.getPropertyValue(name).trim())
    .filter(Boolean);
};

const assignRandomSelectionColor = () => {
  const colors = readHoverColors();

  if (!colors.length) {
    return;
  }

  const color = colors[Math.floor(Math.random() * colors.length)];
  document.documentElement.style.setProperty("--selection-ink", color);
};

const setupRandomSelectionColor = () => {
  assignRandomSelectionColor();
  document.addEventListener("selectstart", assignRandomSelectionColor);
  document.addEventListener("keydown", (event) => {
    if (event.shiftKey && SELECTION_KEYS.has(event.key)) {
      assignRandomSelectionColor();
    }
  });
};

const assignRandomHoverColor = (element, colors) => {
  if (!colors.length) {
    return;
  }

  const color = colors[Math.floor(Math.random() * colors.length)];
  element.style.setProperty("--hover-fill", color);
};

const applyRandomHover = (scope = document) => {
  const colors = readHoverColors();

  scope.querySelectorAll(HOVER_TARGETS.join(",")).forEach((element) => {
    element.classList.add("random-hover");
    element.addEventListener("mouseenter", () => assignRandomHoverColor(element, colors));
    element.addEventListener("focus", () => assignRandomHoverColor(element, colors));
  });
};

const scrambleAnimations = new WeakMap();

const easeOutCubic = (value) => 1 - (1 - value) ** 3;

const getRandomScrambleCharacter = () => (
  SCRAMBLE_CHARACTERS[Math.floor(Math.random() * SCRAMBLE_CHARACTERS.length)]
);

const getRandomPaletteColor = (colors) => (
  colors.length ? colors[Math.floor(Math.random() * colors.length)] : "#85847f"
);

const createScrambledText = (target, revealedCount = 0) => (
  Array.from(target, (character, index) => (
    index < revealedCount ? character : getRandomScrambleCharacter()
  )).join("")
);

const shouldRevealScrambleWord = (element) => (
  element.matches(":hover") || document.activeElement === element
);

const animateScrambleWord = (element, shouldReveal) => {
  const target = element.dataset.text || element.textContent.trim();
  const animationId = (scrambleAnimations.get(element) || 0) + 1;
  const startedAt = performance.now();
  let lastRenderedStep = -1;

  if (!shouldReveal) {
    const colors = readHoverColors();
    element.style.setProperty("--scramble-idle-color", getRandomPaletteColor(colors));
  }

  scrambleAnimations.set(element, animationId);
  element.classList.toggle("is-revealed", shouldReveal);

  const tick = (now) => {
    if (scrambleAnimations.get(element) !== animationId) {
      return;
    }

    const progress = Math.min((now - startedAt) / SCRAMBLE_DURATION, 1);
    const eased = easeOutCubic(progress);
    const revealedCount = shouldReveal
      ? Math.floor(eased * target.length)
      : Math.floor((1 - eased) * target.length);
    const renderStep = Math.floor((now - startedAt) / SCRAMBLE_UPDATE_INTERVAL);

    if (renderStep !== lastRenderedStep || progress >= 1) {
      element.textContent = createScrambledText(target, revealedCount);
      lastRenderedStep = renderStep;
    }

    if (progress < 1) {
      window.requestAnimationFrame(tick);
      return;
    }

    element.textContent = shouldReveal ? target : createScrambledText(target);
  };

  window.requestAnimationFrame(tick);
};

const setupScrambleWords = (scope = document) => {
  const colors = readHoverColors();

  scope.querySelectorAll(".profile-scramble-word").forEach((element) => {
    const target = element.dataset.text || element.textContent.trim();

    element.dataset.text = target;
    element.style.setProperty("--scramble-idle-color", getRandomPaletteColor(colors));
    element.textContent = createScrambledText(target);

    element.addEventListener("mouseenter", () => animateScrambleWord(element, true));
    element.addEventListener("focus", () => animateScrambleWord(element, true));
    element.addEventListener("mouseleave", () => {
      if (!shouldRevealScrambleWord(element)) {
        animateScrambleWord(element, false);
      }
    });
    element.addEventListener("blur", () => {
      window.setTimeout(() => {
        if (!shouldRevealScrambleWord(element)) {
          animateScrambleWord(element, false);
        }
      }, 0);
    });
  });
};

const profileColorSweepTimers = new WeakMap();

const clearProfileColorSweep = (element) => {
  (profileColorSweepTimers.get(element) || []).forEach((timer) => {
    window.clearTimeout(timer);
    window.clearInterval(timer);
  });
  profileColorSweepTimers.set(element, []);
};

const resetProfileColorSweep = (element) => {
  clearProfileColorSweep(element);
  element.querySelectorAll(".profile-color-letter").forEach((letter) => {
    letter.classList.remove("is-colored");
    letter.style.removeProperty("--profile-letter-color");
  });
};

const setupProfileColorSweep = (element) => {
  const text = element.textContent.replace(/\s+/g, " ").trim();
  const fragment = document.createDocumentFragment();

  Array.from(text).forEach((character) => {
    if (/[A-Za-z]/.test(character)) {
      fragment.appendChild(createElement("span", {
        className: "profile-color-letter",
        textContent: character,
      }));
      return;
    }

    fragment.appendChild(document.createTextNode(character));
  });

  element.replaceChildren(fragment);
};

const animateProfileColorSweep = (element) => {
  const colors = readHoverColors();
  const letters = Array.from(element.querySelectorAll(".profile-color-letter"));
  const timers = [];
  let letterIndex = 0;
  let activeLetter = null;

  resetProfileColorSweep(element);

  if (!letters.length) {
    return;
  }

  const clearActiveLetter = () => {
    if (!activeLetter) {
      return;
    }

    activeLetter.classList.remove("is-colored");
    activeLetter.style.removeProperty("--profile-letter-color");
    activeLetter = null;
  };

  const lightNextLetter = () => {
    clearActiveLetter();

    if (letterIndex >= letters.length) {
      letterIndex = 0;
      return;
    }

    activeLetter = letters[letterIndex];
    activeLetter.style.setProperty("--profile-letter-color", getRandomPaletteColor(colors));
    activeLetter.classList.add("is-colored");
    letterIndex += 1;
  };

  lightNextLetter();
  timers.push(window.setInterval(lightNextLetter, PROFILE_COLOR_SWEEP_STEP));
  profileColorSweepTimers.set(element, timers);
};

let profileCloseFocusTimer = 0;
let profileReturnTimer = 0;
let profileColorSweepStartTimer = 0;

const setProfileDetailState = (elements, isOpen) => {
  elements.profilePanel.classList.toggle("is-profile-open", isOpen);
  document.body.classList.toggle("profile-detail-open", isOpen);
  elements.profileOpen.setAttribute("aria-expanded", String(isOpen));
  elements.profileLaunch.setAttribute("aria-expanded", String(isOpen));
  elements.profileToggle.setAttribute("aria-expanded", String(isOpen));
  elements.profileStickerToggle.setAttribute("aria-expanded", String(isOpen));
  elements.profileDetail.setAttribute("aria-hidden", String(!isOpen));
};

const openProfileDetail = (elements) => {
  window.clearTimeout(profileCloseFocusTimer);
  window.clearTimeout(profileReturnTimer);
  window.clearTimeout(profileColorSweepStartTimer);
  elements.profilePanel.classList.remove("is-profile-closing");
  document.body.classList.remove("profile-detail-closing");
  setProfileDetailState(elements, true);
  profileCloseFocusTimer = window.setTimeout(() => {
    elements.profileToggle.focus({ preventScroll: true });
  }, PROFILE_OPEN_FOCUS_DELAY);
  profileColorSweepStartTimer = window.setTimeout(() => {
    animateProfileColorSweep(elements.profileUserCopy);
  }, PROFILE_COLOR_SWEEP_DELAY);
};

const closeProfileDetail = (elements, returnFocusTarget = elements.profileOpen) => {
  window.clearTimeout(profileCloseFocusTimer);
  window.clearTimeout(profileReturnTimer);
  window.clearTimeout(profileColorSweepStartTimer);
  resetProfileColorSweep(elements.profileUserCopy);

  if (!isProfileDetailOpen(elements)) {
    return;
  }

  elements.profilePanel.classList.add("is-profile-closing");
  document.body.classList.add("profile-detail-closing");
  elements.profileOpen.setAttribute("aria-expanded", "false");
  elements.profileLaunch.setAttribute("aria-expanded", "false");
  elements.profileToggle.setAttribute("aria-expanded", "false");
  elements.profileStickerToggle.setAttribute("aria-expanded", "false");
  elements.profileDetail.setAttribute("aria-hidden", "true");

  profileReturnTimer = window.setTimeout(() => {
    elements.profilePanel.classList.remove("is-profile-closing");
    document.body.classList.remove("profile-detail-closing");
    setProfileDetailState(elements, false);
    returnFocusTarget.focus({ preventScroll: true });
  }, PROFILE_CLOSE_DURATION);
};

const isProfileDetailOpen = ({ profilePanel }) => (
  profilePanel.classList.contains("is-profile-open")
);

const isProfileDetailClosing = ({ profilePanel }) => (
  profilePanel.classList.contains("is-profile-closing")
);

const setupProfileDetail = (elements) => {
  const toggleProfileDetail = () => {
    if (isProfileDetailOpen(elements)) {
      closeProfileDetail(elements);
      return;
    }

    openProfileDetail(elements);
  };

  elements.profileOpen.addEventListener("click", toggleProfileDetail);
  elements.profileLaunch.addEventListener("click", () => {
    if (!isProfileDetailOpen(elements) && !isProfileDetailClosing(elements)) {
      openProfileDetail(elements);
    }
  });
  elements.profileToggle.addEventListener("click", toggleProfileDetail);
  elements.profileStickerToggle.addEventListener("click", toggleProfileDetail);
  elements.brand.addEventListener("click", (event) => {
    event.preventDefault();

    if (isProfileDetailOpen(elements) && !isProfileDetailClosing(elements)) {
      closeProfileDetail(elements, elements.brand);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isProfileDetailOpen(elements)) {
      closeProfileDetail(elements);
    }
  });
};

const getAppElements = (scope = document) => ({
  brand: queryRequired(SELECTORS.brand, scope),
  newTags: queryRequired(SELECTORS.newTags, scope),
  completedTags: queryRequired(SELECTORS.completedTags, scope),
  courseGrid: queryRequired(SELECTORS.courseGrid, scope),
  categoryList: queryRequired(SELECTORS.categoryList, scope),
  profilePanel: queryRequired(SELECTORS.profilePanel, scope),
  profileOpen: queryRequired(SELECTORS.profileOpen, scope),
  profileLaunch: queryRequired(SELECTORS.profileLaunch, scope),
  profileToggle: queryRequired(SELECTORS.profileToggle, scope),
  profileStickerToggle: queryRequired(SELECTORS.profileStickerToggle, scope),
  profileDetail: queryRequired(SELECTORS.profileDetail, scope),
  profileUserCopy: queryRequired(SELECTORS.profileUserCopy, scope),
});

const renderApp = ({ elements, data }) => {
  renderList(elements.newTags, data.newTags, (tag) => (
    createToken(tag.label, tag.tone, {
      "aria-label": `Project category ${tag.label}`,
      "data-filter-type": FILTER_TYPES.projectCategory,
      "data-filter-value": tag.label,
    })
  ));
  renderList(elements.completedTags, data.completedTags, (label) => (
    createToken(label, "light", {
      "aria-label": `Archive number ${label}`,
      "data-filter-type": FILTER_TYPES.archiveNo,
      "data-filter-value": label,
    })
  ));
  renderList(elements.courseGrid, data.courses, createCourseCard);
  renderList(elements.categoryList, data.categories, (category) => (
    createCategoryItem(category, elements.categoryList)
  ));
};

const App = {
  init(scope = document) {
    const elements = getAppElements(scope);

    renderApp({ elements, data: DATA });
    setupCourseFilters({ elements, data: DATA });
    setupProfileColorSweep(elements.profileUserCopy);
    setupProfileDetail(elements);
    setupScrambleWords(scope);
    setupRandomSelectionColor();
    applyRandomHover(scope);
  },
};

App.init();
