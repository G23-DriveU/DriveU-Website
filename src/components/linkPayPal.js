/* global paypal */
import { useEffect } from 'react';

// const saveFormDataToCookie = (userInfo) => {
//   const formData = {
//     firebaseUid: userInfo.firebaseUid,
//     name: userInfo.name,
//     email: userInfo.email,
//     phoneNumber: userInfo.phoneNumber,
//     school: userInfo.school,
//     driver: userInfo.driver,
//     carMake: userInfo.carMake,
//     carModel: userInfo.carModel,
//     carColor: userInfo.carColor,
//     carPlate: userInfo.carPlate,
//   };
//   document.cookie = `formData=${encodeURIComponent(JSON.stringify(formData))}; path=/;`;
// };

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
          returnurl: 'https://driveu.online/editprofile',
          nonce: '111111',
          onComplete: function(data) {
            if (data && data.auth_code) {
              // saveFormDataToCookie(userInfo);
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