import React, { useMemo } from "react";
import { useState } from "react";

import * as d3 from "d3";
import { HistogramInteractionData } from "./DoubleHistogram";
import Legend from "d3-color-legend";
import { HistogramTooltip } from "./HistogramTooltip";

// import Label from "react-d3-library";

const MARGIN = { top: 10, right: 50, bottom: 30, left: 50 };

type HistogramRendererProps = {
  id: string;
  label: string;
  bins: any[];
  x: any;
  y: any;
  maxFreq: Number;
  margin: { top: number, bottom: number, right: number, left: number };
  width: number;
  height: number;
  color: string;
  mean: number;
  stdev: number;
};

export const HistogramRenderer = ({
  id,
  label,
  bins,
  x,
  y,
  maxFreq,
  width,
  height,
  margin,
  color,
  mean,
  stdev
}: HistogramRendererProps) => {
  const [hoveredCell, setHoveredCell] = useState<HistogramInteractionData | null>(null);

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const allXGroups = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Append the svg object to the body of the page
  d3.select("#histogram_" + id).select("svg").remove()
  
  // Append the svg object to the body of the page
  const svg = d3.select("#histogram_" + id)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Background
  svg.append("rect").attr("width", width + margin.left + margin.right).attr("height", height).attr("opacity", "1").attr("fill", "white");

  // Bottom Axis
  svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x)).style("font-size", "20px");

  // Left Axis
  y.domain([0, maxFreq]);   // d3.hist has to be called before the Y axis obviously
  svg.append("g").call(d3.axisLeft(y)).style("font-size", "15px")

  svg.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", 1)
    .attr("transform", function(d) { 
      let minRectHeight = d.length ? Math.min(y(d.length), height - 5) : 0
      return "translate(" + x(d.x0) + "," + minRectHeight + ")"; })
    .attr("width", function(d) { return x(d.x1) - x(d.x0) ; })
    .attr("height", function(d) { 
      return d.length ? Math.max(height - y(d.length), 5) : 0 })
    .style("fill", color)
    .style("opacity", 1)
    .on("mouseover", (e) => {
      // console.log(e)
      if (e.fromElement && e.fromElement.__data__){
        setHoveredCell({
          label: label,
          bin: e.fromElement.__data__.x0,
          xPos: x(e.fromElement.__data__.x0),
          yPos: y(e.fromElement.__data__.length) - 15,
          sValue: e.fromElement.__data__.length,
        })
      } else {
        setHoveredCell(null)
      }
       } )
    .on("mouseleave", () => setHoveredCell(null) )
  
  // Legend
  svg.append("circle").attr("cx",.75*width - 15).attr("cy",30).attr("r", 6).style("fill", color)
  svg.append("text").attr("x", .75*width).attr("y", 32).text(label).style("font-size", "20px").attr("alignment-baseline","middle")

  svg.append("text").attr("x", .75*width  - 20).attr("y", 55).text("μ").style("font-size", "20px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", .75*width).attr("y", 55).text(`Mean: ${mean}`).style("font-size", "20px").attr("alignment-baseline","middle")

  svg.append("text").attr("x", .75*width  - 20).attr("y", 78).text("σ").style("font-size", "20px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", .75*width).attr("y", 78).text(`Stdev: ±${stdev}`).style("font-size", "20px").attr("alignment-baseline","middle")

  // Plot numbers above bars
  for (let i = 0; i <= 11; i++) {
    svg.append("text")
      .attr("x", x(i) + 22)
      .attr("y", Math.min(y(bins[i + 1].length) - 20, height - 20))
      .text(bins[i + 1].length)
      .style("font-size", "20px")
      .attr("alignment-baseline","middle")
      .attr("text-anchor", "middle")
  }

  // Bottom Label
  svg.append("text")
    .attr("x", width/2)
    .attr("y", height + 50)
    .text("Number of Goals Scored")
    .style("font-size", "30px")
    .attr("alignment-baseline","middle")
    .attr("text-anchor", "middle")
    .attr("fill", "white")

  // Side Label
  svg.append("text")
    .attr("x", 0)
    .attr("y", height/2)
    .text("Number of Games")
    .attr("transform", `rotate(-90, ${0},  ${250}) translate(-10, -85)`)
    .style("font-size", "30px")
    .attr("alignment-baseline","middle")
    .attr("text-anchor", "middle")
    .attr("fill", "white")

  return (
    <div style={{ position: "relative" }} id={"histogram_" + id}>
      <svg width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
      </g>
      </svg>
      <HistogramTooltip histogramInteractionData={hoveredCell} width={width} height={height} />
    </div>
  );

  
};