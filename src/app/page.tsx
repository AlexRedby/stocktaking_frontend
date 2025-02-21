import TreeComponent from '../components/TreeComponent';
import GraphComponent from '../components/GraphComponent';


// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GraphComponent />
    </div>
    //<TreeComponent />
  );
}
