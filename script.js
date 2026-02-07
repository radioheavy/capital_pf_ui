const welcomeModes = {
  growth: {
    title: 'AGGRESSIVE GROWTH',
    risk: 'RISK: HIGH',
    expected: '+8.4%',
    focus: 'TECH // ENERGY',
    equity: '$84,230',
    change: '+12.4% MTD',
    trend: 'up',
    bars: [
      { height: 36, value: '+3.2%' },
      { height: 58, value: '+5.8%' },
      { height: 28, value: '-1.4%' },
      { height: 78, value: '+8.1%' },
      { height: 67, value: '+6.7%' },
      { height: 49, value: '+4.5%' }
    ]
  },
  balanced: {
    title: 'BALANCED CORE',
    risk: 'RISK: MEDIUM',
    expected: '+5.2%',
    focus: 'INDEX // DIVIDEND',
    equity: '$76,940',
    change: '+7.1% MTD',
    trend: 'up',
    bars: [
      { height: 31, value: '+2.1%' },
      { height: 45, value: '+3.3%' },
      { height: 40, value: '+1.1%' },
      { height: 56, value: '+4.2%' },
      { height: 54, value: '+3.8%' },
      { height: 48, value: '+3.0%' }
    ]
  },
  defensive: {
    title: 'DEFENSIVE SHIELD',
    risk: 'RISK: LOW',
    expected: '+2.8%',
    focus: 'BONDS // UTILITIES',
    equity: '$69,115',
    change: '+3.4% MTD',
    trend: 'up',
    bars: [
      { height: 26, value: '+1.4%' },
      { height: 30, value: '+1.8%' },
      { height: 34, value: '+2.2%' },
      { height: 38, value: '+2.7%' },
      { height: 35, value: '+2.1%' },
      { height: 32, value: '+1.6%' }
    ]
  }
};

const welcomeTerminalMessages = [
  'ALLOCATION DIFF CHECKED // NO DRIFT',
  'STOP-LOSS TABLE UPDATED FOR 12 POSITIONS',
  'MACRO CALENDAR EVENT LOCKED // 14:30 UTC',
  'ENERGY BASKET MOMENTUM SIGNAL CONFIRMED',
  'HEDGE CORRIDOR REBALANCED BY 1.2%',
  'VOLATILITY THRESHOLD SET TO ADAPTIVE MODE'
];

const welcomeState = {
  initialized: false,
  mode: 'growth',
  telemetry: {
    latency: 4,
    users: 1248,
    fills: 324
  },
  terminalLines: [
    'BOOTSTRAP COMPLETE',
    'MARKET DATA STREAM VERIFIED',
    'WATCHLIST SYNCHRONIZED (42 SYMBOLS)',
    'RISK ENGINE STATUS: STABLE',
    'WAITING FOR NEXT EVENT...'
  ],
  terminalCursor: 0,
  telemetryTimer: null,
  terminalTimer: null
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function isWelcomeActive() {
  const welcomePage = document.getElementById('page-welcome');
  return Boolean(welcomePage && welcomePage.classList.contains('active'));
}

function updateWelcomeBars(bars, resetAnimation = false) {
  const chartBars = document.querySelectorAll('.welcome-chart-bar');
  chartBars.forEach((bar, index) => {
    const entry = bars[index];
    if (!entry) return;

    const targetHeight = clamp(entry.height, 12, 90);
    const isNegative = entry.value.startsWith('-');
    bar.dataset.value = entry.value;
    bar.classList.toggle('negative', isNegative);

    if (resetAnimation) {
      bar.style.height = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bar.style.height = targetHeight + '%';
        });
      });
    } else {
      bar.style.height = targetHeight + '%';
    }
  });
}

function applyWelcomeMode(modeName, resetAnimation = false) {
  const mode = welcomeModes[modeName];
  if (!mode) return;

  welcomeState.mode = modeName;
  document.querySelectorAll('.welcome-mode-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.mode === modeName);
  });

  const title = document.getElementById('welcome-mode-title');
  const risk = document.getElementById('welcome-mode-risk');
  const expected = document.getElementById('welcome-mode-yield');
  const focus = document.getElementById('welcome-mode-focus');
  const equity = document.getElementById('welcome-equity-value');
  const change = document.getElementById('welcome-equity-change');

  if (title) title.textContent = mode.title;
  if (risk) risk.textContent = mode.risk;
  if (expected) expected.textContent = mode.expected;
  if (focus) focus.textContent = mode.focus;
  if (equity) equity.textContent = mode.equity;
  if (change) {
    change.textContent = mode.change;
    change.classList.toggle('up', mode.trend === 'up');
    change.classList.toggle('down', mode.trend === 'down');
  }

  updateWelcomeBars(mode.bars, resetAnimation);
}

function renderWelcomeTerminal() {
  const feed = document.getElementById('welcome-terminal-feed');
  if (!feed) return;

  feed.innerHTML = welcomeState.terminalLines
    .map((line, index) => {
      const blink = index === welcomeState.terminalLines.length - 1 ? ' wt-blink' : '';
      return '<div class="welcome-terminal-line' + blink + '"><span class="wt-green">></span> ' + line + '</div>';
    })
    .join('');
}

function rotateWelcomeTerminalLine() {
  if (!isWelcomeActive()) return;

  const nextLine = welcomeTerminalMessages[welcomeState.terminalCursor % welcomeTerminalMessages.length];
  welcomeState.terminalCursor += 1;
  welcomeState.terminalLines.shift();
  welcomeState.terminalLines.push(nextLine);
  renderWelcomeTerminal();
}

function updateWelcomeTelemetry() {
  if (!isWelcomeActive()) return;

  const drift = () => (Math.random() < 0.5 ? -1 : 1);
  welcomeState.telemetry.latency = clamp(welcomeState.telemetry.latency + drift(), 3, 11);
  welcomeState.telemetry.users = clamp(welcomeState.telemetry.users + Math.floor((Math.random() - 0.5) * 28), 1120, 1480);
  welcomeState.telemetry.fills = clamp(welcomeState.telemetry.fills + Math.floor((Math.random() - 0.5) * 16), 280, 420);

  const latencyEl = document.querySelector('[data-live-metric="latency"]');
  const usersEl = document.querySelector('[data-live-metric="users"]');
  const fillsEl = document.querySelector('[data-live-metric="fills"]');

  if (latencyEl) latencyEl.textContent = String(welcomeState.telemetry.latency).padStart(2, '0') + 'MS';
  if (usersEl) usersEl.textContent = welcomeState.telemetry.users.toLocaleString('en-US');
  if (fillsEl) fillsEl.textContent = String(welcomeState.telemetry.fills);
}

function initializeWelcomeExperience() {
  if (welcomeState.initialized) return;
  if (!document.getElementById('page-welcome')) return;

  document.querySelectorAll('.welcome-mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyWelcomeMode(btn.dataset.mode || 'growth');
    });
  });

  renderWelcomeTerminal();
  applyWelcomeMode(welcomeState.mode, true);
  updateWelcomeTelemetry();

  welcomeState.telemetryTimer = setInterval(updateWelcomeTelemetry, 3200);
  welcomeState.terminalTimer = setInterval(rotateWelcomeTerminalLine, 2600);
  welcomeState.initialized = true;
}

function activateWelcomeExperience() {
  initializeWelcomeExperience();
  applyWelcomeMode(welcomeState.mode, true);
}

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  const page = document.getElementById('page-' + name);
  if (!page) return;
  page.classList.add('active');

  const tabs = document.querySelectorAll('.nav-tab');
  const indexMap = {
    welcome: 0,
    login: 1,
    register: 2,
    dashboard: 3,
    explore: 4,
    wallet: 5,
    profile: 6,
    project: 7,
    deposit: 8,
    withdraw: 9,
    error: 10,
    success: 11,
    search: 12,
    filters: 13,
    notifications: 14,
    news: 15
  };
  const index = indexMap[name] ?? 0;
  if (tabs[index]) tabs[index].classList.add('active');

  if (name === 'welcome') {
    activateWelcomeExperience();
  }

  const ticker = document.querySelector('.ticker');
  if (ticker) {
    if (name === 'register' || name === 'deposit' || name === 'withdraw') {
      ticker.style.background = 'var(--orange)';
      ticker.style.color = 'var(--white)';
    } else if (name === 'error') {
      ticker.style.background = '#cc0000';
      ticker.style.color = 'var(--white)';
    } else if (name === 'success') {
      ticker.style.background = 'var(--green)';
      ticker.style.color = 'var(--black)';
    } else if (name === 'search') {
      ticker.style.background = '#c8b832';
      ticker.style.color = 'var(--black)';
    } else if (name === 'filters') {
      ticker.style.background = 'var(--green)';
      ticker.style.color = 'var(--black)';
    } else {
      ticker.style.background = 'var(--lime)';
      ticker.style.color = 'var(--black)';
    }
  }

  window.scrollTo(0, 0);
}

function togglePassword() {
  const input = document.getElementById('reg-password');
  const icon = document.getElementById('eye-icon');
  if (input.type === 'password') {
    input.type = 'text';
    icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
  } else {
    input.type = 'password';
    icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>';
  }
}

// Deposit page functionality
function setDepositAmount(amount) {
  const input = document.getElementById('deposit-input');
  if (!input) return;
  if (amount === 'max') {
    input.value = '14250';
  } else {
    const current = parseInt(input.value) || 0;
    input.value = current + amount;
  }
  updateDepositSummary();
}

function selectFundSource(el) {
  document.querySelectorAll('.deposit-source-item').forEach(item => {
    item.classList.remove('selected');
  });
  el.classList.add('selected');
  updateDepositSummary();
}

function updateDepositSummary() {
  const input = document.getElementById('deposit-input');
  const amount = parseFloat(input.value) || 0;
  const selected = document.querySelector('.deposit-source-item.selected');
  let feeRate = 0;
  if (selected) {
    const feeText = selected.getAttribute('data-fee');
    feeRate = parseFloat(feeText) || 0;
  }
  const fee = amount * (feeRate / 100);
  const total = amount + fee;

  const subtotalEl = document.getElementById('deposit-subtotal');
  const feeEl = document.getElementById('deposit-fee');
  const totalEl = document.getElementById('deposit-total');
  if (subtotalEl) subtotalEl.textContent = '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (feeEl) feeEl.textContent = '$' + fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (totalEl) totalEl.textContent = '$' + total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Withdraw page functionality
function setWithdrawAmount(amount) {
  const input = document.getElementById('withdraw-input');
  if (!input) return;
  if (amount === 'max') {
    input.value = '14250';
  } else {
    const current = parseInt(input.value) || 0;
    input.value = current + amount;
  }
  updateWithdrawSummary();
}

function selectWithdrawDest(el) {
  document.querySelectorAll('.withdraw-dest-item').forEach(item => {
    item.classList.remove('selected');
  });
  el.classList.add('selected');
  updateWithdrawSummary();
}

function updateWithdrawSummary() {
  const input = document.getElementById('withdraw-input');
  const amount = parseFloat(input.value) || 0;
  const selected = document.querySelector('.withdraw-dest-item.selected');
  let feeRate = 0;
  if (selected) {
    feeRate = parseFloat(selected.getAttribute('data-fee')) || 0;
  }
  const fee = amount * (feeRate / 100);
  const total = amount + fee;

  const subtotalEl = document.getElementById('withdraw-subtotal');
  const feeEl = document.getElementById('withdraw-fee');
  const feePctEl = document.getElementById('withdraw-fee-pct');
  const totalEl = document.getElementById('withdraw-total');
  if (subtotalEl) subtotalEl.textContent = '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (feeEl) feeEl.textContent = '$' + fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (feePctEl) feePctEl.textContent = feeRate;
  if (totalEl) totalEl.textContent = '$' + total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Password strength indicator
document.addEventListener('DOMContentLoaded', () => {
  initializeWelcomeExperience();

  const regPw = document.getElementById('reg-password');
  if (regPw) {
    regPw.addEventListener('input', (e) => {
      const val = e.target.value;
      const bars = document.querySelectorAll('.password-strength span');
      const strength = Math.min(5, Math.floor(val.length / 2));
      bars.forEach((bar, i) => {
        bar.classList.toggle('active', i < strength);
      });
    });
  }

  const depositInput = document.getElementById('deposit-input');
  if (depositInput) {
    depositInput.addEventListener('input', updateDepositSummary);
  }

  const withdrawInput = document.getElementById('withdraw-input');
  if (withdrawInput) {
    withdrawInput.addEventListener('input', updateWithdrawSummary);
  }

});
