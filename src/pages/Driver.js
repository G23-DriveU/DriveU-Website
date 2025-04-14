import '../styles/Driver.css';
import driveImage from '../images/drive.png';

const Driver = () => {
    return (
        <div className="driver">
            <h2>Welcome to</h2>
            <img src={driveImage} alt="DriveU" className="driveu" />             
            <p>
                At DriveU, our mission is to provide a safe, reliable,
                and rewarding driving experience. We connect drivers with passengers
                efficiently and offer flexible schedules, fair earning, and strong support.
                Our goal is to make driving with DriveU a positive and fulfilling experience.
            </p>
            <div className="signupbox-driver">
                <h2>Want to start making some quick lunch money?</h2>
                <h2>Sign up <span className="blue-text">today</span>!</h2>
            </div>
            <div className="driverbottom">
                <p>
                    At DriveU, our goal is to create a safe and reliable platform for our drivers.
                    We strive to connect drivers with passengers quickly, offer flexible work
                    schedules, and ensure fair pay. We are committed to supporting our drivers
                    and making their experience with DriveU both positive and rewarding.
                </p>
            </div>
        </div>
    )
}

export default Driver;