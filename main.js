function observeScroll(el) {
  let timeout;

  el.addEventListener('scroll', () => {
    el.classList.add('scrolling');

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      el.classList.remove('scrolling');
    }, 500);
  });
}

document.querySelectorAll('*').forEach((el) => {
  const style = getComputedStyle(el);
  const overflowY = style.overflowY;
  const overflowX = style.overflowX;

  if (['auto', 'scroll'].includes(overflowY) || ['auto', 'scroll'].includes(overflowX)) {
    observeScroll(el);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-tabs]').forEach((tabsContainer) => {
    const buttons = tabsContainer.querySelectorAll('.tab-btn');
    const panels = tabsContainer.querySelectorAll('.tab-panel');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');

        // Remove active states
        buttons.forEach((b) => b.classList.remove('active'));
        panels.forEach((p) => p.classList.remove('active'));

        // Activate clicked button and panel
        btn.classList.add('active');
        tabsContainer.querySelector('#' + target).classList.add('active');
      });
    });
  });
});

const chartIds = ['totalRevenue', 'totalHome', 'bplChart', 'govtSubsChart', 'enterpriseSubsChart'];

const labels = Array.from({ length: 50 }, (_, i) => i);

// Generate wavy data with slight offset to avoid overlap
const generateWaveData = (offset = 0) => labels.map((x) => Math.sin(x * 0.2 + offset) * 10 + 20);

chartIds.forEach((id, index) => {
  const canvas = document.getElementById(id);

  if ([undefined, null, ''].includes(canvas)) return;

  const ctx = canvas.getContext('2d');

  const pinkGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  pinkGradient.addColorStop(0, 'rgba(250, 120, 133, 0.4)');
  pinkGradient.addColorStop(1, 'rgba(250, 120, 133, 0)');

  const tealGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  tealGradient.addColorStop(0, 'rgba(13, 231, 185, 0.4)');
  tealGradient.addColorStop(1, 'rgba(13, 231, 185, 0)');

  const usePink = true;

  const selectedGradient = usePink ? pinkGradient : tealGradient;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          data: generateWaveData(index * 0.5), // slight phase shift
          borderColor: usePink ? '#FA7885' : '#0DE7B9',
          borderWidth: 2,
          cubicInterpolationMode: 'monotone',
          fill: true,
          backgroundColor: selectedGradient,
          tension: 0.5,
          pointRadius: 0,
          pointHoverRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false // hides the legend box
        }
      },
      interaction: {
        intersect: false
      },
      scales: {
        x: {
          display: false
        },
        y: {
          display: false
        }
      }
    }
  });
});

const liveSubscribersChart = document.getElementById('liveSubscribersChart');

if (![undefined, null, ''].includes(liveSubscribersChart)) {
  const liveSubscribersChartCtx = getContext('2d');

  new Chart(liveSubscribersChartCtx, {
    type: 'doughnut',
    data: {
      labels: ['Unallocated', 'Sale', 'Sport'],
      datasets: [
        {
          data: [30, 40, 30],
          backgroundColor: ['#0DE7B9', '#6B6F85', '#F4B900'],
          borderWidth: 0,
          borderRadius: 25,
          circumference: 180,
          rotation: 270,
          cutout: '90%',
          spacing: 40
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      }
    },
    plugins: [
      {
        id: 'centerText',
        beforeDraw(chart) {
          const { width } = chart;
          const { height } = chart;
          const ctx = chart.ctx;
          ctx.restore();
          const fontSize = 20;
          ctx.font = `bold ${fontSize}px sans-serif`;
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';

          // Title
          ctx.fillStyle = '#ddd';
          ctx.fillText('Live', width / 2, height / 1.8 - 15);

          // Value
          ctx.font = `bold 28px sans-serif`;
          ctx.fillStyle = '#fff';
          ctx.fillText('21,5550', width / 2, height / 1.8 + 15);
          ctx.save();
        }
      }
    ]
  });
}

const newSubsChart = document.getElementById('newSubsChart');

if (![undefined, null, ''].includes(newSubsChart)) {
  const newSubsChartCtx = newSubsChart.getContext('2d');

  new Chart(newSubsChartCtx, {
    type: 'line',
    data: {
      labels: Array.from({ length: 60 }, (_, i) => i + 1),
      datasets: [
        {
          label: 'Signal',
          data: labels.map((x) => {
            const rad = (x / 60) * Math.PI * 4; // 2 full waves
            return 50 + 18 * Math.sin(rad) + 6 * Math.sin(rad * 2);
          }),
          borderColor: '#8D0247',
          borderWidth: 3.5,
          fill: false,
          tension: 0.5, // makes it wavy
          pointRadius: 0, // no dots
          cubicInterpolationMode: 'monotone' // smooth curve
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(12, 18, 32, 0.9)',
          titleColor: '#cfe6ff',
          bodyColor: '#e6f5ff',
          borderColor: 'rgba(255,255,255,.2)',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#7f93b6' }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.06)' },
          ticks: { color: '#7f93b6' }
        }
      }
    }
  });
}

const dropdowns = Array.from(document.querySelectorAll('.filter-dropdown'));

function getChecks(root) {
  return Array.from(root.querySelectorAll('.menu input[type="checkbox"]'));
}
function selectedValues(root) {
  return getChecks(root)
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);
}
function setCount(root) {
  const btn = root.querySelector('.filter-btn');
  const countEl = btn.querySelector('.count');
  const n = selectedValues(root).length;
  if (n) {
    countEl.textContent = n;
    btn.classList.add('has-count');
  } else {
    countEl.textContent = '0';
    btn.classList.remove('has-count');
  }
}
function openMenu(root) {
  closeAll();
  const btn = root.querySelector('.filter-btn');
  const menu = root.querySelector('.menu');
  menu.classList.add('open');
  btn.setAttribute('aria-expanded', 'true');
}
function closeMenu(root) {
  const btn = root.querySelector('.filter-btn');
  const menu = root.querySelector('.menu');
  menu.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
}
function closeAll() {
  dropdowns.forEach(closeMenu);
}

// Init each dropdown
dropdowns.forEach((root) => {
  const btn = root.querySelector('.filter-btn');
  const menu = root.querySelector('.menu');
  const clearBtn = root.querySelector('.clear');
  const applyBtn = root.querySelector('.apply');

  setCount(root);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.contains('open');
    isOpen ? closeMenu(root) : openMenu(root);
  });

  // Keep clicks inside menu from closing it
  menu.addEventListener('click', (e) => e.stopPropagation());

  // Clear
  clearBtn.addEventListener('click', () => {
    getChecks(root).forEach((cb) => (cb.checked = false));
    setCount(root);
    // Emit immediate change if you want live updates
    root.dispatchEvent(
      new CustomEvent('filterchange', {
        detail: { id: root.dataset.filterId || null, values: selectedValues(root), action: 'clear' },
        bubbles: true
      })
    );
  });

  // Apply
  applyBtn.addEventListener('click', () => {
    setCount(root);
    root.dispatchEvent(
      new CustomEvent('filterchange', {
        detail: { id: root.dataset.filterId || null, values: selectedValues(root), action: 'apply' },
        bubbles: true
      })
    );
    closeMenu(root);
  });

  // Optional: live count as user checks boxes
  menu.addEventListener('change', () => setCount(root));
});

// Global outside-click + Escape to close
document.addEventListener('click', closeAll);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAll();
});

// Example listener (remove in production)
document.addEventListener('filterchange', (e) => {
  console.log('Filter changed:', e.detail);
});

// Values are in thousands to match tick labels (0..100k)
const barData = [62, 12, 8, 18, 14, 26, 11, 31, 13, 26, 12, 27, 7, 16];
const lineData = [36, 11, 7, 16, 13, 25, 10, 22, 9, 13, 11, 25, 6, 12];

const districtChart = document.getElementById('districtChart');

if (![undefined, null, ''].includes(districtChart)) {
  const districtChartCtx = districtChart.getContext('2d');

  // Custom plugin to draw a horizontal line at a given value
  const thresholdValue = 25; // 25k
  const thresholdPlugin = {
    id: 'thresholdLine',
    afterDatasetsDraw(chart, args, pluginOptions) {
      const {
        districtChartCtx,
        chartArea,
        scales: { y }
      } = chart;
      const yPos = y.getPixelForValue(thresholdValue);
      districtChartCtx.save();
      districtChartCtx.strokeStyle = pluginOptions.color || '#1486FF';
      districtChartCtx.lineWidth = pluginOptions.lineWidth || 3;
      districtChartCtx.beginPath();
      districtChartCtx.moveTo(chartArea.left, yPos);
      districtChartCtx.lineTo(chartArea.right, yPos);
      districtChartCtx.stroke();
      districtChartCtx.restore();
    }
  };

  new Chart(districtChartCtx, {
    type: 'bar',
    data: {
      labels: [
        'DIS 1',
        'DIS 2',
        'DIS 3',
        'DIS 4',
        'DIS 5',
        'DIS 6',
        'DIS 7',
        'DIS 8',
        'DIS 9',
        'DIS 10',
        'DIS 11',
        'DIS 12',
        'DIS 13',
        'DIS 14'
      ],
      datasets: [
        {
          // Background bars
          type: 'bar',
          data: barData,
          borderSkipped: false,
          borderRadius: 12,
          barPercentage: 0.52,
          categoryPercentage: 0.8,
          backgroundColor: (context) => {
            const { chart, dataIndex } = context;
            const { ctx, chartArea } = chart;
            if (!chartArea) return '#E9EDF3';
            // Highlight DIS 8 (index 7) with a vertical gradient
            if (dataIndex === 7) {
              const grad = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              grad.addColorStop(0, 'rgba(122,12,56,0.85)');
              grad.addColorStop(0.55, 'rgba(122,12,56,0.35)');
              grad.addColorStop(1, 'rgba(122,12,56,0.00)');
              return grad;
            }
            return 'rgba(10,15,30,0.06)'; // soft grey bars
          }
        },
        {
          // Line on top
          type: 'line',
          data: lineData,
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--maroon').trim() || '#7A0C38',
          backgroundColor: 'transparent',
          borderWidth: 3,
          tension: 0.25,
          pointRadius: 5,
          pointHoverRadius: 6,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: getComputedStyle(document.documentElement).getPropertyValue('--maroon').trim() || '#7A0C38',
          pointBorderWidth: 3
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: '#1f2937',
            font: { size: 12 }
          }
        },
        y: {
          suggestedMin: 0,
          suggestedMax: 100,
          grid: {
            color: (ctx) => (ctx.tick.value === 0 ? 'transparent' : 'rgba(0,0,0,0.06)'),
            borderDash: [4, 4]
          },
          ticks: {
            color: '#6b7280',
            callback: (v) => (v === 0 ? '0' : v + 'k')
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.type === 'line' ? 'Line' : 'Value'}: ${ctx.parsed.y}k`
          }
        },
        thresholdLine: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--threshold').trim() || '#1486FF',
          lineWidth: 3
        }
      },
      interaction: { intersect: false, mode: 'index' }
    },
    plugins: [thresholdPlugin]
  });
}
