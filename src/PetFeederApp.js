import React, { useState, useRef, useEffect } from "react";

const BellIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-600 hover:text-gray-800"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
    />
  </svg>
);

const PetFeederApp = () => {
  const [dispenseTimes, setDispenseTimes] = useState([]);
  const [newTime, setNewTime] = useState("");
  const [newWeightThreshold, setNewWeightThreshold] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [waterLevel, setWaterLevel] = useState(50); // Water level in percentage
  const [foodLeft, setFoodLeft] = useState(500); // Food left in grams

  const bellRef = useRef();

  // Close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const addDispenseTime = () => {
    if (newTime) {
      setDispenseTimes([
        ...dispenseTimes,
        { time: newTime, weightThreshold: newWeightThreshold },
      ]);
      setNewTime("");
      setNewWeightThreshold(0);
    }
  };

  const deleteDispenseTime = (index) => {
    setDispenseTimes(dispenseTimes.filter((_, i) => i !== index));
  };

  const rotateCylinderManually = () => {
    const weightDispensed = Math.floor(Math.random() * 100) + 1;
    const timestamp = new Date().toLocaleTimeString();
    setNotifications((prev) => [
      ...prev,
      `Cylinder rotated manually at ${timestamp}: ${weightDispensed} grams dispensed.`,
    ]);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-6 relative">
        <h1 className="text-2xl font-bold text-gray-800">Pet Feeder Control</h1>
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="p-2 rounded hover:bg-gray-200 focus:outline-none"
            aria-label="Toggle notifications"
          >
            <BellIcon />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 max-h-64 overflow-y-auto bg-white rounded shadow-lg border border-gray-300 z-50">
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-3">Notifications</h2>
                <ul>
                  {notifications.length === 0 ? (
                    <li className="text-gray-500">No notifications yet.</li>
                  ) : (
                    notifications.map((note, index) => (
                      <li key={index} className="mb-2 text-gray-700">
                        {note}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Food Control */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Food Control</h2>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={rotateCylinderManually}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Rotate Cylinder Manually
          </button>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">
            Set Dispense Times and Weight Threshold:
          </label>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-full"
            />
            <input
              type="number"
              placeholder="Weight (grams)"
              value={newWeightThreshold}
              onChange={(e) => setNewWeightThreshold(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 w-full"
            />
            <button
              onClick={addDispenseTime}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              +
            </button>
          </div>
          <ul>
            {dispenseTimes.map((entry, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2"
              >
                <span>
                  {entry.time} - {entry.weightThreshold}g
                </span>
                <button
                  onClick={() => deleteDispenseTime(index)}
                  className="bg-red-500 hover:bg-red-600 text-white p-1 rounded focus:outline-none"
                  aria-label="Delete dispense time"
                >
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Water Level */}
      <div className="bg-white shadow rounded p-4 mb-8">
        <h2 className="text-lg font-semibold mb-2">Water Level</h2>
        <div className="w-full bg-gray-200 rounded h-6 overflow-hidden">
          <div
            className="bg-blue-500 h-6 rounded"
            style={{ width: `${waterLevel}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-500">Current Water Level: {waterLevel}%</p>
      </div>

      {/* Food Left in Bowl */}
      <div className="bg-white shadow rounded p-4 mb-8">
        <h2 className="text-lg font-semibold mb-2">Food Left in Bowl</h2>
        <p className="mt-2 text-sm text-gray-500">{foodLeft} grams</p>
      </div>
    </div>
  );
};

export default PetFeederApp;
