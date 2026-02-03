export const blueprintChartColors = {
  cyan: '#00FFFF',
  cyanLight: 'rgba(0, 255, 255, 0.6)',
  cyanDim: 'rgba(0, 255, 255, 0.3)',
  red: '#FF3333',
  redLight: 'rgba(255, 51, 51, 0.6)',
  white: '#FFFFFF',
  whiteDim: 'rgba(255, 255, 255, 0.5)',
  background: '#003366',
  grid: 'rgba(255, 255, 255, 0.08)',
}

export const blueprintColorScale = [
  '#00FFFF',
  '#FF3333',
  'rgba(0, 255, 255, 0.6)',
  'rgba(255, 51, 51, 0.6)',
  'rgba(255, 255, 255, 0.6)',
  'rgba(0, 200, 200, 0.8)',
  'rgba(255, 100, 100, 0.6)',
  'rgba(100, 200, 255, 0.6)',
]

export const nivoTheme = {
  background: 'transparent',
  text: { fill: 'rgba(255,255,255,0.7)', fontSize: 11, fontFamily: 'Roboto Mono, monospace' },
  axis: {
    domain: { line: { stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 } },
    ticks: {
      line: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 },
      text: { fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'Roboto Mono, monospace' },
    },
    legend: { text: { fill: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: 'Roboto Mono, monospace' } },
  },
  grid: { line: { stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 } },
  legends: { text: { fill: 'rgba(255,255,255,0.6)', fontSize: 10, fontFamily: 'Roboto Mono, monospace' } },
  tooltip: {
    container: {
      background: '#001a33',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: 0,
      color: '#FFFFFF',
      fontSize: 11,
      fontFamily: 'Roboto Mono, monospace',
    },
  },
  labels: { text: { fill: '#FFFFFF', fontSize: 10, fontFamily: 'Roboto Mono, monospace' } },
}

export const rechartsColors = {
  stroke: blueprintColorScale,
  fill: blueprintColorScale.map(c => c.replace(')', ', 0.3)').replace('rgb', 'rgba').replace('rgba(a', 'rgba(')),
  axisStroke: 'rgba(255,255,255,0.15)',
  axisTickFill: 'rgba(255,255,255,0.5)',
  gridStroke: 'rgba(255,255,255,0.06)',
  tooltipBg: '#001a33',
  tooltipBorder: 'rgba(255,255,255,0.15)',
}

export const d3Colors = {
  scale: blueprintColorScale,
  axis: 'rgba(255,255,255,0.15)',
  text: 'rgba(255,255,255,0.6)',
  highlight: '#FF3333',
  data: '#00FFFF',
}
