# DevRel Visualization Components

This directory contains visualization components for the DevRel whitepaper project, implementing unique visualization patterns inspired by industry references.

## Reference-Inspired Components

### Evil Martians Inspired
- `HorizonMetrics`: Temporal metric analysis using horizon charts
- `BubbleInsights`: Resource impact analysis using bubble charts

### DevRel Agency Inspired
- `DeveloperProgressFlow`: Developer journey visualization using Sankey diagrams

### DZone Inspired
- `CareerPathway`: Career progression visualization using Treemaps

### Google Cloud Inspired
- `CustomDataViz`: Multi-dimensional DevRel metrics using radar charts

### DevRel Book Framework
- `DevRelEcosystem`: Framework visualization using Sankey diagrams

### Market Impact Analysis
- `MarketImpactFlow`: Market trends using combined bar and line charts

## Core Components

- `CareerPath`: Career progression visualization
- `CommunityGraph`: Community interaction patterns
- `SkillsMatrix`: Developer skills analysis
- `MetricsDashboard`: Key performance indicators

## Implementation Details

- Built using Recharts for consistent styling and responsive design
- TypeScript for type safety
- Interactive tooltips for detailed information
- Mobile-responsive design
- Error boundaries for robust error handling

## Usage

```tsx
import { DevRelEcosystem, CareerPathway } from './visualizations';

function App() {
  return (
    <div>
      <DevRelEcosystem />
      <CareerPathway />
    </div>
  );
}
```
