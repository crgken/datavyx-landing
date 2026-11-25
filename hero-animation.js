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
  const phrases = ['Save this for me.', 'First testers:', 'Individual ChatGPT users.'];
  const retrievalSpeed = .8;
  const retrievalStart = 5880;
  const flightEnd = 760;
  const iconInterval = 850 / retrievalSpeed + 150;
  const answerStart = retrievalStart + (resultIcons.length - 1) * iconInterval + flightEnd / retrievalSpeed + 150;
  const cycleDuration = answerStart + 4200;
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
    points = { note: center(note), folder: center(folder), results: resultIcons.map(center) };
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

    const expand = ease(phase(time, answerStart, answerStart + 460));
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
      const local = (time - (retrievalStart + index * iconInterval)) * retrievalSpeed;
      icon.style.opacity = phase(local, 0, 100);
      if (local > 0 && local < flightEnd) {
        const progress = ease(phase(local, 120, flightEnd));
        const arc = Math.sin(Math.PI * progress);
        const pop = Math.sin(Math.PI * phase(local, 0, 200));
        const [targetX, targetY] = points.results[index];
        const x = (to[0] - targetX) * (1 - progress);
        const y = (to[1] - targetY) * (1 - progress) - 45 * arc - 12 * pop;
        icon.style.transform = `translate(${x}px, ${y}px) rotate(${-15 * arc}deg)`;
      } else {
        icon.style.transform = 'none';
      }
      read = Math.max(read, phase(local, 0, 100) * (1 - phase(local, 180, 320)));
    });

    const save = phase(time, 3270, 3530) * (1 - phase(time, 3920, 4180));
    const bounce = Math.sin(Math.PI * phase(time, 3890, 4190));
    front.style.transform = `perspective(140px) rotateX(${-36 * (save + read)}deg) scale(${1 + .06 * bounce})`;
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
    if (motion.matches) render(answerStart + 460);
    else if (!document.hidden) frameId = requestAnimationFrame(frame);
  }

  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  measure();
  new ResizeObserver(measure).observe(scene);
  sync();
})();
