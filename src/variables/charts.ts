

// Sidebar

export const barChartDataSidebar = [
  {
    name: 'Credits Used',
    data: [297, 410, 540, 390, 617, 520, 490],
  },
];

export const barChartOptionsSidebar = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    style: {
      fontSize: '12px',
    },
    theme: 'dark',
  },
  xaxis: {
    categories: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    show: false,
    labels: {
      show: true,
      style: {
        colors: '#FFFFFF',
        fontSize: '12px',
        fontWeight: '500',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    color: 'black',
    labels: {
      show: true,
      style: {
        colors: '#CBD5E0',
        fontSize: '12px',
      },
    },
  },
  grid: {
    show: false,
    strokeDashArray: 5,
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: 'solid',
    colors: ['#FFFFFF'],
    opacity: 1,
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: '40px',
    },
  },
};

// Project Default Dashboards Default

export const lineChartDataUsage = [
  {
    name: 'Credits Used',
    data: [
      7420, 6504, 8342, 6024, 9592, 10294, 8842, 11695, 10423, 12045, 12494,
      16642,
    ],
  },
];

export const lineChartOptionsUsage = {
  chart: {
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      top: 13,
      left: 0,
      blur: 10,
      opacity: 0.1,
      color: '#4318FF',
    },
  },
  colors: ['#4318FF'],
  markers: {
    size: 0,
    colors: 'white',
    strokeColors: '#4318FF',
    strokeWidth: 2,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    shape: 'circle',
    radius: 2,
    offsetX: 0,
    offsetY: 0,
    showNullDataPoints: true,
  },
  tooltip: {
    theme: 'dark',
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    type: 'gradient',
  },
  xaxis: {
    categories: [
      'SEP',
      'OCT',
      'NOV',
      'DEC',
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
    ],
    labels: {
      style: {
        colors: '#718096',
        fontSize: '14px',
        fontWeight: '500',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  legend: {
    show: false,
  },
  dropShadow: {
    enabled: true,
    top: 0,
    left: 0,
    blur: 3,
    opacity: 0.5,
  },
  grid: {
    show: false,
    column: {
      colors: ['transparent'], // takes an array which will be repeated on columns
      opacity: 0.5,
    },
  },
};

// Données de transit moyen par région (mock data)
export const chartTransitData = [
  {
    name: 'Average Transit Time',
    data: [12, 9, 14, 20, 15] // Time in days
  }
];

// Options for the Transit Time Chart
export const chartTransitOptions = {
  chart: {
    type: 'bar',
    height: 350
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: true,
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['Europe', 'North America', 'Asia', 'South America', 'Africa'],
    title: {
      text: 'Time in Days'
    }
  },
  title: {
    text: 'Analysis of Average Transit Times by Region',
    align: 'center',
    style: {
      fontSize: '16px',
      color: '#333'
    }
  }
};


// Données fictives pour l'efficacité de l'optimisation des coûts
export const chartCostOptiData = [
  {
    name: 'Before Optimization',
    data: [80, 82, 85, 83, 88, 90] // Costs as a percentage of the initial budget
  },
  {
    name: 'After Optimization',
    data: [78, 75, 70, 68, 65, 60] // Significant cost reductions post-optimization
  }
];

// Options for the Cost Optimization Chart
// export const chartCostOptiOptions = {
//   chart: {
//     type: 'line',
//     height: 350,
//     zoom: {
//       enabled: true
//     }
//   },
//   dataLabels: {
//     enabled: false
//   },
//   stroke: {
//     curve: 'smooth'
//   },
//   title: {
//     text: 'Comparison of Cost Optimization Strategies’ Effectiveness',
//     align: 'center',
//     style: {
//       fontSize: '16px',
//       color: '#333'
//     }
//   },
//   xaxis: {
//     categories: ['Jan 2021', 'May 2021', 'Sept 2021', 'Jan 2022', 'May 2022', 'Sept 2022'],
//     title: {
//       text: 'Period'
//     }
//   },
//   yaxis: {
//     title: {
//       text: 'Costs as % of Budget'
//     }
//   },
//   legend: {
//     position: 'top',
//     horizontalAlign: 'right',
//     floating: true,
//     offsetY: -25,
//     offsetX: -5
//   },
//   markers: {
//     size: 5
//   }
// };

// Sidebar

export const lineChartDataSidebar = [
  {
    name: 'Balance',
    data: [10, 39, 80, 50, 10],
  },
  {
    name: 'Profit',
    data: [20, 60, 30, 40, 20],
  },
];

export const lineChartOptionsSidebar = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  markers: {
    size: 0,
    colors: '#868CFF',
    strokeColors: 'white',
    strokeWidth: 2,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    shape: 'circle',
    radius: 2,
    offsetX: 0,
    offsetY: 0,
    showNullDataPoints: true,
  },
  tooltip: {
    theme: 'dark',
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    type: 'gradient',
  },
  xaxis: {
    categories: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
    labels: {
      style: {
        colors: 'white',
        fontSize: '8px',
        fontWeight: '500',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  legend: {
    show: false,
  },
  grid: {
    show: false,
    column: {
      colors: ['transparent'], // takes an array which will be repeated on columns
      opacity: 0.5,
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      type: 'vertical',
      shadeIntensity: 0.1,
      opacityFrom: 0.3,
      opacityTo: 0.9,
      colorStops: [
        [
          {
            offset: 0,
            color: 'white',
            opacity: 1,
          },
          {
            offset: 100,
            color: 'white',
            opacity: 0,
          },
        ],
        [
          {
            offset: 0,
            color: '#6AD2FF',
            opacity: 1,
          },
          {
            offset: 100,
            color: '#6AD2FF',
            opacity: 0.2,
          },
        ],
      ],
    },
  },
};

export const chartostOptiOptions = {
  chart: {
    type: 'line',
    height: 350,
    zoom: {
      enabled: true
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  title: {
    text: 'Comparison of Cost Optimization Strategies’ Effectiveness',
    align: 'center',
    style: {
      fontSize: '16px',
      color: '#333'
    }
  },
  xaxis: {
    categories: ['Jan 2022', 'May 2022', 'Sept 2022', 'Jan 2023', 'May 2023', 'Sept 2023'],
    title: {
      text: 'Period'
    }
  },
  yaxis: {
    title: {
      text: 'Costs as % of Budget'
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5
  },
  markers: {
    size: 5
  }
};
