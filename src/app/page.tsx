import TreeComponent from '../components/TreeComponent';


// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.

export default function Home() {
  return (
    <TreeComponent />
  );
}
