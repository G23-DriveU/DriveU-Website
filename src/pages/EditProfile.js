import { useState } from 'react';
import '../styles/EditProfile.css';

const EditProfile = () => {
  const [driver, setDriver] = useState('');
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carColor, setCarColor] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [capacity, setCapacity] = useState('');

  return (
    <div className="editProfile">
      <h2>Edit Profile</h2>
      <form>
        <label>Name: </label>
        <input type="text" required />
        <label>Email: </label>
        <input type="email" required />
        <label>Phone Number: </label>
        <input type="tel" required />
        <label>School: </label>
        <input type="text" required />
        <label>Driver: </label>
        <select
          value={driver}
          onChange={(e) => setDriver(e.target.value)}
          required
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        {driver === 'yes' && (
          <>
            <label>Car Make: </label>
            <input
              type="text"
              value={carMake}
              onChange={(e) => setCarMake(e.target.value)}
              required
            />
            <label>Car Model: </label>
            <input
              type="text"
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              required
            />
            <label>Car Color: </label>
            <input
              type="text"
              value={carColor}
              onChange={(e) => setCarColor(e.target.value)}
              required
            />
            <label>License Plate Number: </label>
            <input
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              required
            />
            <label>Capacity: </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
          </>
        )}
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProfile;