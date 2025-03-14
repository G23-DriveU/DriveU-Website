import '../styles/Home.css';
import driveImage from '../images/drive.png';

const Home = () => {
    return (  
        <div className="home">
            <img src={driveImage} alt="DriveU" className="driveu" />
            <h2>Where <span className="teal-text">carpools</span> meets pleasure</h2>
            <h3>We are here to create innovative carpool experiences for college students.</h3>
            <div className="signupbox">
                <h2>Want to start making some quick lunch money?</h2>
                <h2>Sign up <span className="blue-text">today</span>!</h2>
            </div>
            <div className="bottom">
                <div className="c1">
                    <h3>Drivers are able to book in rides at specific times.</h3>
                </div>
                <div className="c2">
                    <h3>Riders can sign up to ride with them.</h3>
                </div>
                <div className="c3">
                    <h3>Happy driving!</h3>
                </div>
            </div>
        </div>
    );
}
 
export default Home;