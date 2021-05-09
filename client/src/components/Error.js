export default function Error() {
  return (
    <div className="grid place-items-center mt-10">
      {/* Error image sourced from https://clipart.world*/}
      <img className="max-w-lg" src="sad_earth.png" alt="Error - Sad Earth" />
      <label className="text-2xl text-gray-200">Oops! Something went wrong.</label>
    </div>
  );
}
