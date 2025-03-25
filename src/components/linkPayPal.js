/* global paypal */
import { useEffect } from 'react';

function PayPalLoginButton({ onAuthCodeReceived, userInfo }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.paypalobjects.com/js/external/api.js';
    script.async = true;
    script.onload = () => {
      paypal.use(['login'], function(login) {
        login.render({
          appid: 'AZgMf_Zy17XeqIle9E2NleYPsW-YCjQxFZAtO1PGQ-KB35FtYs5hkdO83wkr-wZlRcfg-WnRj0PXHDYx',
          authend: 'sandbox',
          scopes: 'https://uri.paypal.com/services/paypalattributes',
          containerid: 'linkPayPal',
          responseType: 'code',
          locale: 'en-us',
          buttonType: 'CWP',
          buttonShape: 'pill',
          buttonSize: 'sm',
          fullPage: 'false',
          //returnurl: 'https://driveu.online/editprofile',
          nonce: '111111',
          onComplete: function(data) {
            if (data && data.auth_code) {
              localStorage.setItem('firebaseUid', userInfo.firebaseUid);
              localStorage.setItem('name', userInfo.name);
              localStorage.setItem('email', userInfo.email);
              localStorage.setItem('phoneNumber', userInfo.phoneNumber);
              localStorage.setItem('school', userInfo.school);
              localStorage.setItem('driver', userInfo.driver);
              localStorage.setItem('carMake', userInfo.carMake);
              localStorage.setItem('carModel', userInfo.carModel);
              localStorage.setItem('carColor', userInfo.carColor);
              localStorage.setItem('carPlate', userInfo.carPlate);
              onAuthCodeReceived(data.auth_code);
            }
          }
        });
      });
    };
    document.body.appendChild(script);
  }, [onAuthCodeReceived, userInfo]);

  return <span id="linkPayPal" />;
}

export default PayPalLoginButton;