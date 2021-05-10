import {
  XYPlot, HorizontalBarSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, ChartLabel
} from 'react-vis';

export default function FactorsCharts(props) {
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
    <div className="grid grid-rows-3 grid-cols-2 gap-4 -ml-10">
      <XYPlot
        height={300}
        width= {690}
        margin={{left: 220, top: 25}}
        yType="ordinal"
        >
        <VerticalGridLines style={{stroke: '#E5E7EB'}}/>
        <HorizontalGridLines />
        <XAxis style={{text: {fill: '#E5E7EB'}}}/>
        <YAxis style={{text: {fill: '#E5E7EB'}}}/>
        <ChartLabel 
          text="Country vs Economy"
          includeMargin={false}
          xPercent={0.28}
          yPercent={0.06}
          style={{
            textAnchor: 'start',
            fill: '#E5E7EB'
          }}
        />
        <HorizontalBarSeries data={economyData} />
      </XYPlot>
      <XYPlot
        height={300}
        width= {690}
        margin={{left: 220, top: 25, right: 10}}
        yType="ordinal">
        <VerticalGridLines style={{stroke: '#E5E7EB'}}/>
        <HorizontalGridLines />
        <XAxis style={{text: {fill: '#E5E7EB'}}}/>
        <YAxis style={{text: {fill: '#E5E7EB'}}}/>
        <ChartLabel 
          text="Country vs Economy"
          includeMargin={false}
          xPercent={0.28}
          yPercent={0.06}
          style={{
            textAnchor: 'start',
            fill: '#E5E7EB'
          }}
        />
        <HorizontalBarSeries data={familyData} />
      </XYPlot>
      <XYPlot
        height={300}
        width= {690}
        margin={{left: 220, top: 25}}
        yType="ordinal">
        <VerticalGridLines style={{stroke: '#E5E7EB'}}/>
        <HorizontalGridLines />
        <XAxis style={{text: {fill: '#E5E7EB'}}}/>
        <YAxis style={{text: {fill: '#E5E7EB'}}}/>
        <ChartLabel 
          text="Country vs Family"
          includeMargin={false}
          xPercent={0.28}
          yPercent={0.06}
          style={{
            textAnchor: 'start',
            fill: '#E5E7EB'
          }}
        />
        <HorizontalBarSeries data={healthData} />
      </XYPlot>
      <XYPlot
        height={300}
        width= {690}
        margin={{left: 220, top: 25, right: 10}}
        yType="ordinal">
        <VerticalGridLines style={{stroke: '#E5E7EB'}}/>
        <HorizontalGridLines />
        <XAxis style={{text: {fill: '#E5E7EB'}}}/>
        <YAxis style={{text: {fill: '#E5E7EB'}}}/>
        <ChartLabel 
          text="Country vs Health"
          includeMargin={false}
          xPercent={0.28}
          yPercent={0.06}
          style={{
            textAnchor: 'start',
            fill: '#E5E7EB'
          }}
        />
        <HorizontalBarSeries data={freedomData} />
      </XYPlot>
      <XYPlot
        height={300}
        width= {690}
        margin={{left: 220, top: 25}}
        yType="ordinal">
        <VerticalGridLines style={{stroke: '#E5E7EB'}}/>
        <HorizontalGridLines />
        <XAxis style={{text: {fill: '#E5E7EB'}}}/>
        <YAxis style={{text: {fill: '#E5E7EB'}}}/>
        <ChartLabel 
          text="Country vs Freedom"
          includeMargin={false}
          xPercent={0.28}
          yPercent={0.06}
          style={{
            textAnchor: 'start',
            fill: '#E5E7EB'
          }}
        />
        <HorizontalBarSeries data={generosityData} />
      </XYPlot>
      <XYPlot
        height={300}
        width= {690}
        margin={{left: 220, top: 25, right: 10}}
        yType="ordinal">
        <VerticalGridLines style={{stroke: '#E5E7EB'}}/>
        <HorizontalGridLines />
        <XAxis style={{text: {fill: '#E5E7EB'}}}/>
        <YAxis style={{text: {fill: '#E5E7EB'}}}/>
        <ChartLabel 
          text="Country vs Generosity"
          includeMargin={false}
          xPercent={0.28}
          yPercent={0.06}
          style={{
            textAnchor: 'start',
            fill: '#E5E7EB'
          }}
        />
        <HorizontalBarSeries data={trustData} />
      </XYPlot>
    </div>
  );
}
