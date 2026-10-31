// "Real or scam?": swipe or tap through a shuffled round of SCENARIOS.

function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// A round mixes real and scam messages so "always scam" never wins.
function pickRound(n) {
  const real = shuffle(SCENARIOS.filter((s) => !s.fake));
  const fake = shuffle(SCENARIOS.filter((s) => s.fake));
  const realCount = Math.min(real.length, Math.max(3, Math.round(n * CONFIG.game.realShare)));
  return shuffle([...real.slice(0, realCount), ...fake.slice(0, n - realCount)]);
}

function levelOf(score) {
  const l = CONFIG.game.levels;
  if (score >= l.good) return 'good';
  if (score >= l.mid) return 'mid';
  return 'bad';
}

function createGame(getLang) {
  const $ = (id) => document.getElementById(id);
  const card = $('msgCard');
  let round = [];
  let index = 0;
  let score = 0;
  let answered = null; // null while waiting, else { pick, correct }

  const s = () => CONFIG.strings[getLang()];

  function start() {
    round = pickRound(CONFIG.game.rounds);
    index = 0;
    score = 0;
    answered = null;
    $('gamePlay').hidden = false;
    $('gameResult').hidden = true;
    render();
  }

  function renderCard() {
    const lang = getLang();
    const m = round[index];
    const g = s().game;
    card.className = 'msg';
    card.style.transform = '';
    $('msgSender').textContent = m.sender[lang];
    $('msgChannel').textContent = g[m.channel];
    $('msgAvatar').textContent = m.sender[lang].trim().charAt(0).toUpperCase() || '؟';
    $('msgAvatar').className = `avatar ${m.channel}`;
    $('msgText').textContent = m.text[lang];
    $('msgLink').textContent = m.link;
    $('msgLink').hidden = !m.link;
    $('gameProgress').textContent = g.progress(index + 1, round.length);
    $('gameBar').style.width = `${((index + (answered ? 1 : 0)) / round.length) * 100}%`;
  }

  function renderFeedback() {
    const g = s().game;
    const m = round[index];
    const show = !!answered;
    $('gameAsk').hidden = show;
    $('feedback').hidden = !show;
    if (!show) return;
    $('feedback').className = `feedback ${answered.correct ? 'is-right' : 'is-wrong'}`;
    $('fbTitle').textContent = `${answered.correct ? '✓' : '✗'} ${answered.correct ? g.right : g.wrong}`;
    $('fbKind').textContent = m.fake ? g.wasFake : g.wasReal;
    $('fbClues').replaceChildren(...m.clues[getLang()].map((c) => {
      const li = document.createElement('li');
      li.textContent = c;
      return li;
    }));
    $('nextBtn').textContent = index + 1 < round.length ? g.next : g.finish;
    card.classList.add(m.fake ? 'is-fake' : 'is-real', 'answered');
  }

  function renderResult() {
    const g = s().game;
    const level = levelOf(score);
    $('gamePlay').hidden = true;
    $('gameResult').hidden = false;
    $('gameResult').dataset.level = level;
    $('gameScore').textContent = String(score);
    $('gameOutOf').textContent = `/${round.length}`;
    $('gameLevel').textContent = g.levels[level];
    $('gameLine').textContent = g.resultLine(score, round.length);
    const arc = $('gameArc');
    arc.style.strokeDashoffset = '100';
    arc.getBoundingClientRect();
    arc.style.strokeDashoffset = String(100 - (score / round.length) * 100);
  }

  function render() {
    if (!round.length) return;
    if (index >= round.length) return renderResult();
    renderCard();
    renderFeedback();
  }

  function choose(pickFake) {
    if (answered || index >= round.length) return;
    const m = round[index];
    const correct = pickFake === m.fake;
    if (correct) score++;
    answered = { pickFake, correct };
    render();
  }

  function next() {
    index++;
    answered = null;
    render();
    if (index < round.length) card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  // Swipe toward a button to pick it: real sits first in the row, so it is on the right in RTL.
  function bindSwipe() {
    let startX = null;
    let dx = 0;
    card.addEventListener('pointerdown', (e) => {
      if (answered) return;
      startX = e.clientX;
      dx = 0;
      card.setPointerCapture(e.pointerId);
      card.classList.add('dragging');
    });
    card.addEventListener('pointermove', (e) => {
      if (startX === null) return;
      dx = e.clientX - startX;
      card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
      const realOnRight = s().dir === 'rtl';
      const leaning = Math.abs(dx) > 24 ? ((dx > 0) === realOnRight ? 'lean-real' : 'lean-fake') : '';
      card.classList.toggle('lean-real', leaning === 'lean-real');
      card.classList.toggle('lean-fake', leaning === 'lean-fake');
    });
    const end = () => {
      if (startX === null) return;
      startX = null;
      card.classList.remove('dragging', 'lean-real', 'lean-fake');
      card.style.transform = '';
      if (Math.abs(dx) >= CONFIG.game.swipeThreshold) {
        const realOnRight = s().dir === 'rtl';
        choose((dx > 0) !== realOnRight);
      }
    };
    card.addEventListener('pointerup', end);
    card.addEventListener('pointercancel', end);
  }

  $('chooseReal').addEventListener('click', () => choose(false));
  $('chooseFake').addEventListener('click', () => choose(true));
  $('nextBtn').addEventListener('click', next);
  $('againBtn').addEventListener('click', start);
  bindSwipe();

  return { start, render, needsStart: () => !round.length || index >= round.length };
}
