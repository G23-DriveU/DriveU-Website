import '../styles/Home.css';
import driveImage from '../images/drive.png';
import homeBanner from '../images/homeBanner.png';
import car1 from '../images/car1.png';
import people1 from '../images/people1.png';
import steeringWheel from '../images/steeringWheel.png';

const Home = () => {
    return (  
        <div className="home">
            <img src={driveImage} alt="DriveU" className="driveu" />
            <h2>Where <span className="teal-text">carpools</span> meet convenience</h2>
            <h3>We are here to create innovative carpool experiences for college students.</h3>
            <img src={homeBanner} alt="DriveU" className="home-banner"/>
            <div className="signupbox">
                <h2>Want to start making some quick lunch money?</h2>
                <h2>Sign up <span className="blue-text">today</span>!</h2>
            </div>
            <div className="bottom">
                <div className="c1">
                    <img src={car1} alt="Car" />
                    <h3>Drivers are able to book in rides at specific times.</h3>
                </div>
                <div className="c2">
                    <img src={people1} alt="People" />
                    <h3>Riders can sign up to ride with them.</h3>
                </div>
                <div className="c3">
                    <img src={steeringWheel} alt="Steering Wheel" />
                    <h3>Happy driving!</h3>
                </div>
            </div>
        </div>
    );
}
 
export default Home;