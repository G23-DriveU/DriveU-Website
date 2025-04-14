import '../styles/Rider.css';
import driveImage from '../images/drive.png';

const Rider = () => {
  return (
    <div className="rider">
            <h2>Welcome to</h2>
            <img src={driveImage} alt="DriveU" className="driveu" />
            <p>
                DriveU aims to make transportation easy, affordable, and inclusive for riders.
                It helps students find reliable rides that fit their needs and schedule while
                ensuring a safe and stress-free experience.
            </p>
            <div className="signupbox-rider">
                <h2>Want to start driving around and making new friends?</h2>
                <h2>Sign up <span className="blue-text">today</span>!</h2>
            </div>
            <div className="riderbottom">
                <p>
                At DriveU, our goal is to create a safe and reliable platform for our drivers.
                    We strive to connect drivers with passengers quickly, offer flexible work
                    schedules, and ensure fair pay. We are committed to supporting our drivers
                    and making their experience with DriveU both positive and rewarding.
                </p>
            </div>
        </div>
  );
}

export default Rider;