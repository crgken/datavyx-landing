// Adapted from the user-provided preview (1).html. This is a local illustrative example.
(() => {
  const root = document.querySelector('.hero-demo');
  if (!root) return;
  const scene = root.querySelector('.demo-scene');
  const note = root.querySelector('.demo-note');
  const lines = [...root.querySelectorAll('.demo-line')];
  const question = root.querySelector('.demo-question');
  const answer = root.querySelector('.demo-answer');
  const newChat = root.querySelector('.demo-new-chat');
  const folder = root.querySelector('.demo-folder');
  const front = root.querySelector('.demo-front');
  const paper = root.querySelector('.demo-paper');
  const resultIcons = [...root.querySelectorAll('.demo-result-icon')];
  const cta = root.querySelector('.demo-cta');
  const phrases = ['Save this for me.', 'First testers:', 'Individual ChatGPT users.'];
  const retrievalSpeed = .8;
  const retrievalDelay = resultIcons.length * 850 * (1 / retrievalSpeed - 1);
  const cycleDuration = 14000 + retrievalDelay;
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => value * value * (3 - 2 * value);
  const phase = (time, start, end) => clamp((time - start) / (end - start));

  function type(element, text, progress) {
    const value = text.slice(0, Math.floor(text.length * progress));
    if (element.textContent !== value) element.textContent = value;
    element.classList.toggle('demo-typing', progress > 0 && progress < 1);
  }

  function center(element) {
    const stage = scene.getBoundingClientRect();
    const parent = element.offsetParent.getBoundingClientRect();
    return [parent.left + element.offsetLeft + element.offsetWidth / 2 - stage.left,
            parent.top + element.offsetTop + element.offsetHeight / 2 - stage.top];
  }

  let points;
  function measure() {
    points = { note: center(note), folder: center(folder), answer: center(answer) };
    points.folder[1] += 12;
  }

  function render(time) {
    lines.forEach((line, i) => {
      const start = 160 + i * 710;
      type(line, phrases[i], phase(time, start, start + 570));
    });

    const pack = ease(phase(time, 2360, 2780));
    note.style.transform = `scale(${1 - .88 * pack}, ${1 - .58 * pack})`;
    note.style.opacity = 1 - pack;
    root.classList.toggle('has-saved', time >= 4190);

    newChat.hidden = time < 4350;
    question.style.opacity = phase(time, 4350, 4550);
    type(question, 'Who are our first testers?', phase(time, 4500, 5650));

    const expand = ease(phase(time, 9800 + retrievalDelay, 10260 + retrievalDelay));
    const spring = Math.sin(Math.PI * expand) * .12;
    answer.style.opacity = expand;
    answer.style.transform = `scale(${.22 + .78 * expand + spring}, ${.55 + .45 * expand})`;

    const from = points.note;
    const to = points.folder;
    const fly = ease(phase(time, 3060, 3940));
    const arc = Math.sin(Math.PI * fly);
    const pop = Math.sin(Math.PI * phase(time, 2730, 3070));
    const x = from[0] + (to[0] - from[0]) * fly;
    const y = from[1] + (to[1] - from[1]) * fly - 45 * arc - 19 * pop;
    const tilt = 15 * arc - 9 * pop;
    paper.style.opacity = phase(time, 2540, 2750) * (1 - phase(time, 3760, 3990));
    paper.style.transform = `translate(${x - 15}px, ${y - 19}px) rotate(${tilt}deg) scale(${1 + .24 * pop})`;

    let read = 0;
    resultIcons.forEach((icon, index) => {
      // Slow only retrieval flights by 20%, preserving the 150 ms gap between icons.
      const local = (time - (5880 + index * (850 / retrievalSpeed + 150))) * retrievalSpeed;
      const active = local >= 0 && local < 850;
      const progress = ease(phase(local, 120, 760));
      const arc = Math.sin(Math.PI * progress);
      const pop = Math.sin(Math.PI * phase(local, 0, 200));
      const x = points.folder[0] + (points.answer[0] - points.folder[0]) * progress;
      const y = points.folder[1] + (points.answer[1] - points.folder[1]) * progress - 45 * arc - 12 * pop;
      icon.style.opacity = active ? phase(local, 0, 100) * (1 - phase(local, 720, 850)) : 0;
      icon.style.transform = `translate(${x - 14}px, ${y - 16.5}px) rotate(${-15 * arc}deg)`;
      read = Math.max(read, phase(local, 0, 100) * (1 - phase(local, 180, 320)));
    });

    const save = phase(time, 3270, 3530) * (1 - phase(time, 3920, 4180));
    const bounce = Math.sin(Math.PI * phase(time, 3890, 4190));
    front.style.transform = `perspective(140px) rotateX(${-36 * (save + read)}deg) scale(${1 + .06 * bounce})`;
    cta.classList.toggle('is-ready', time >= 10580 + retrievalDelay);
  }


  let elapsed = 0;
  let lastFrame = null;
  let frameId;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');

  function frame(now) {
    if (lastFrame !== null) elapsed += now - lastFrame;
    lastFrame = now;
    render(elapsed % cycleDuration);
    frameId = requestAnimationFrame(frame);
  }

  function stop() {
    cancelAnimationFrame(frameId);
    lastFrame = null;
  }

  function sync() {
    stop();
    root.classList.toggle('is-animated', !motion.matches);
    if (motion.matches) render(11000 + retrievalDelay);
    else if (!document.hidden) frameId = requestAnimationFrame(frame);
  }

  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  measure();
  new ResizeObserver(measure).observe(scene);
  sync();
})();
