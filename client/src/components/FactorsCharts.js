import {
  XYPlot, HorizontalBarSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis
} from 'react-vis';

function FactorsCharts(props) {
  const start = props.pageSize * props.currentPage;
  const end = start + props.pageSize;
  let data = props.data;
  data = data.slice(start, end);

  let [economyData, familyData, healthData, freedomData, 
    generosityData, trustData] = [[], [], [], [], [], [], [], [], []]

  if (data.length !== 0) {
    data.forEach((item) => {
      economyData.push({
        x: Number(item['economy']),
        y: item['country']
      });
      familyData.push({
        x: Number(item['family']),
        y: item['country']
      });
      healthData.push({
        x: Number(item['health']),
        y: item['country']
      });
      freedomData.push({
        x: Number(item['freedom']),
        y: item['country']
      });
      generosityData.push({
        x: Number(item['generosity']),
        y: item['country']
      });
      trustData.push({
        x: Number(item['trust']),
        y: item['country']
      });
    })
  }

  return (
    <div className="grid grid-rows-3 grid-cols-2 -ml-16">
      <XYPlot
        height={300}
        width= {700}
        margin={{left: 200}}
        yType="ordinal"
        >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <HorizontalBarSeries data={economyData} />
      </XYPlot>
      <XYPlot
        height={300}
        width= {700}
        margin={{left: 200}}
        yType="ordinal">
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <HorizontalBarSeries data={familyData} />
      </XYPlot>
      <XYPlot
        height={300}
        width= {700}
        margin={{left: 200}}
        yType="ordinal">
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <HorizontalBarSeries data={healthData} />
      </XYPlot>
      <XYPlot
        height={300}
        width= {700}
        margin={{left: 200}}
        yType="ordinal">
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <HorizontalBarSeries data={freedomData} />
      </XYPlot>
      <XYPlot
        height={300}
        width= {700}
        margin={{left: 200}}
        yType="ordinal">
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <HorizontalBarSeries data={generosityData} />
      </XYPlot>
      <XYPlot
        height={300}
        width= {700}
        margin={{left: 200}}
        yType="ordinal">
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <HorizontalBarSeries data={trustData} />
      </XYPlot>
    </div>
  );
}

export default FactorsCharts;
