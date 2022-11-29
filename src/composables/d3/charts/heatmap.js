/* eslint-disable no-unused-vars */
import * as d3 from 'd3';
import useChartState from '@/composables/charts/useChartState';
import { doDebounce } from '@/composables/utils/useDebounce';

const { setTimeRange } = useChartState();

function defineAxis({
  xType = d3.scaleLinear(),
  yType = d3.scaleLinear(),
  xDomain,
  yDomain,
  margin,
  width,
  height,
}) {
  const x = xType.domain(xDomain).range([margin.left, width - margin.right]);
  const y = yType.domain(yDomain).range([margin.top, height - margin.bottom]);
  return { x, y };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function naiveHeatmap(
  {
    width = 400,
    height = 900,
    margin = {
      top: 10,
      right: 30,
      bottom: 10,
      left: 30,
    },
    heatmapColor = d3.interpolateRdPu,
    // d3.interpolateCubehelixLong('#f0f9e8', '#08306b')
    // d3.interpolateHslLong(d3.hsl(0, 0, 0.5), d3.hsl(0, 0, 0.9))
    // d3.interpolateLab('#ffffff', '#ff0000')
  },
  data,
) {
  if (data.value.length === 0) {
    return d3.create('svg');
  }
  const color = d3.scaleSequentialPow(
    [0, data.value.length ? d3.max(d3.max(data.value)) : 0],
    heatmapColor,
  );

  const { x, y } = defineAxis({
    xDomain: [0, data.value[0].length],
    yDomain: [0, data.value.length],
    ...arguments[0],
  });

  const svg = d3
    .create('svg')
    .attr('viewBox', [0, 0, width, height])
    .attr('width', width)
    .attr('height', height);

  svg
    .append('g')
    .selectAll('g')
    .data(data.value)
    .join('g')
    .attr('cy', (d, i) => y(1) + (y(2) - y(1)) * i)
    .attr('transform', (d, i) => {
      return `translate(0,${y(1) + (y(2) - y(1)) * i})`;
    })
    .selectAll('rect')
    .data((d) => d)
    .join('rect')
    .attr('isCell', true)
    .attr('x', (d, i) => {
      return x(1) + (x(2) - x(1)) * i;
    })
    .attr('cy', function (d, i, g) {
      return this.parentNode.getAttribute('cy');
    })
    .attr('width', (d, i) => x(2) - x(1) - 1)
    .attr('height', (d, i) => y(2) - y(1) - 1)
    .attr('fill', (d) => color(d));

  return svg;
}

export function brushedHeatmap(
  {
    width = 400,
    height = 900,
    margin = {
      top: 20,
      right: 30,
      bottom: 40,
      left: 30,
    },
    heatmapColor = d3.interpolateRdPu,
  },
  data,
) {
  let svg = naiveHeatmap(...arguments);

  // A dict to indicate whether a cell is selected
  let isSelected = {};

  if (data.value.length === 0) {
    return svg;
  }

  const { x, y } = defineAxis({
    xDomain: [0, data.value[0].length],
    yDomain: [0, data.value.length],
    ...arguments[0],
  });

  const brushstart = () => {
    svg.node().focus();
  };

  const brushmove = doDebounce((event) => {
    const selection = event.selection;
    if (!selection) {
      return;
    }
    const [[x0, y0], [x1, y1]] = selection;
    svg.selectAll('rect').each((d, i, g) => {
      const node = d3.select(g[i]);
      if (!node.attr('isCell')) {
        return;
      }
      const currentX = node.attr('x');
      const currentY = node.attr('cy');

      if (
        currentX >= x0 &&
        currentX <= x1 &&
        currentY >= y0 &&
        currentY <= y1
      ) {
        isSelected[`${currentX},${currentY}`] = true;
        node.attr('filter', 'brightness(50%)');
      } else {
        if (isSelected[`${currentX},${currentY}`]) {
          node.attr('filter', 'brightness(100%)');
          isSelected[`${currentX},${currentY}`] = false;
        }
      }
    });
  }, 50);

  const brushend = (event) => {
    const selection = event.selection;
    if (!selection) {
      return;
    }
    const [[x0, y0], [x1, y1]] = selection;

    // Convert pixel coordinates to data coordinates
    let xRange = [x.invert(x0), x.invert(x1)];
    let yRange = [y.invert(y0), y.invert(y1)];

    // Make sure xRange, yRange are non-negative integers
    xRange = xRange.map((d) =>
      clamp(Math.round(d), 0, data.value[0].length - 1),
    );
    yRange = yRange.map((d) => clamp(Math.round(d), 0, data.value.length - 1));

    setTimeRange(xRange, yRange);
  };

  let brush = d3
    .brush()
    .extent([
      [0, 0],
      [width, height],
    ])
    .on('start', brushstart)
    .on('brush', brushmove)
    .on('end', brushend);

  svg.call(brush);

  return svg;
}
