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

const ctx = document.getElementById('liveSubscribersChart').getContext('2d');

new Chart(ctx, {
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
