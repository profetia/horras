/* eslint-disable no-unused-vars */
import * as d3 from 'd3';
import useChartState from '@/composables/charts/useChartState';
import { doDebounce } from '@/composables/utils/useDebounce';

const { setTimeRange } = useChartState();

export function defineAxis({
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
    xDomain: [0, data.value[0].length + 2],
    yDomain: [0, data.value.length + 2],
    ...arguments[0],
  });

  const svg = d3
    .create('svg')
    .attr('viewBox', [0, 0, width, height])
    .attr('width', width)
    .attr('height', height);

  svg
    .append('g')
    .attr('id', 'heatmap')
    .selectAll('g')
    .data(data.value)
    .join('g')
    .attr('cy', (d, i) => y(1) + (y(2) - y(1)) * i)
    .attr('transform', (d, i) => {
      return `translate(0,${y(1) + (y(2) - y(1)) * i})`;
    })
    .selectAll('.naives')
    .data((d) => d)
    .join('rect')
    .attr('class', 'naives')
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

  let draw_range = () => {
    let text = svg.append('g').attr('class', 'range');
    text
      .append('text')
      .attr('id', 'day_up')
      .attr('x', margin.left / 2 + 10)
      .attr('y', 40)
      .text('2017/5/1')
      .attr('text-anchor', 'middle');
    text
      .append('text')
      .attr('id', 'day_low')
      .attr('x', margin.left / 2 + 10)
      .attr('y', 60)
      .text('-2017/10/31')
      .attr('text-anchor', 'middle');
    text
      .append('text')
      .attr('id', 'hour')
      .attr('x', margin.left / 2 + 10)
      .attr('y', 80)
      .text('0-24')
      .attr('text-anchor', 'middle');
  };
  draw_range();
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
      svg.selectAll('.naives').attr('opacity', '1');
      return;
    }
    const [[x0, y0], [x1, y1]] = selection;
    svg.selectAll('.naives').each((d, i, g) => {
      const node = d3.select(g[i]);
      node.attr('opacity', '0.5');
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
        node.attr('opacity', '1');
        // node.attr('filter', 'brightness(50%)');
      } else {
        if (isSelected[`${currentX},${currentY}`]) {
          node.attr('opacity', '0.5');
          //node.attr('filter', 'brightness(100%)');
          isSelected[`${currentX},${currentY}`] = false;
        }
      }
    });
  }, 50);

  const brushend = (event) => {
    const selection = event.selection;
    if (!selection) {
      svg.select('#day_up').text(`2017/5/1`);

      svg.select('#day_low').text(`-2017/10/31`);
      svg.select('#hour').text(`0-24`);
      svg.selectAll('.naives').attr('opacity', '1');
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
    let xRange_time = [];
    let Month_day = [31, 30, 31, 31, 30, 31];
    xRange.forEach((d) => {
      let m = 0;
      let days = d + 1;
      while (days > Month_day[m]) {
        days -= Month_day[m];
        m += 1;
      }
      xRange_time.push({
        month: m + 5,
        day: days,
      });
    });
    svg
      .select('#day_up')
      .text(`2017/${xRange_time[0].month}/${xRange_time[0].day}`);

    svg
      .select('#day_low')
      .text(`-2017/${xRange_time[1].month}/${xRange_time[1].day}`);
    svg.select('#hour').text(`${yRange[0]}-${yRange[1] + 1}`);
    setTimeRange(xRange, yRange);
  };
  // console.log(margin);
  let brush = d3
    .brush()
    .extent([
      [margin.top, 0],
      [width - margin.right, height - margin.bottom],
    ])
    .on('start', brushstart)
    .on('brush', brushmove)
    .on('end', brushend);

  svg.select('#heatmap').call(brush);

  return svg;
}
