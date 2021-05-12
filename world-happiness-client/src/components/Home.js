export default function Home() {
  return (
    <div className="mt-6">
      <div className="flex">
        <div className="w-1/2 m-auto">
          {/* Hero image sourced from https://clipart.world*/}
          <img className="w-96 h-96 float-right" src="happy_earth.png" alt="Hero - Happy Earth" />
        </div>
        <div className="font-freckle-face w-1/2 m-auto text-7xl">
          <label className="bg-gradient-to-b from-blue-400 to-green-500 bg-clip-text text-transparent">
            World
          </label>
          <br/>
          <label className="bg-gradient-to-b from-blue-400 to-green-500 bg-clip-text text-transparent">
            Happiness
          </label>
        </div>
      </div>
      <div className="grid mt-4 mx-40 text-gray-200 text-2xl">
        <label className="text-center">
          Welcome to the World Happiness App!
          <br/>
          This application presents you with the latest data and statistics on World Happiness.
          All the data you see is sourced from the official World Happiness Report,an initiative of the United Nations,
          and has been cleaned up and organised an up for your browsing pleasure.
          <br/>
          Come, have a look around!
        </label>
      </div>
    </div>
  );
}
