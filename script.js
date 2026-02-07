function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  document.getElementById('page-' + name).classList.add('active');

  const tabs = document.querySelectorAll('.nav-tab');
  const indexMap = { welcome: 0, login: 1, register: 2, dashboard: 3, explore: 4, wallet: 5, profile: 6, project: 7, deposit: 8, withdraw: 9, error: 10, success: 11, search: 12, filters: 13, notifications: 14 };
  const index = indexMap[name] || 0;
  if (tabs[index]) tabs[index].classList.add('active');

  // Re-trigger bar animations on welcome page
  if (name === 'welcome') {
    document.querySelectorAll('.chart-bar').forEach(bar => {
      bar.style.animation = 'none';
      bar.offsetHeight;
      bar.style.animation = '';
    });
  }

  // Update ticker color based on page
  const ticker = document.querySelector('.ticker');
  if (name === 'register') {
    ticker.style.background = 'var(--orange)';
    ticker.style.color = 'var(--white)';
  } else if (name === 'deposit') {
    ticker.style.background = 'var(--orange)';
    ticker.style.color = 'var(--white)';
  } else if (name === 'withdraw') {
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
