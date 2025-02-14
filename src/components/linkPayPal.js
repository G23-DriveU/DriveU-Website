/* global paypal */
import { useEffect } from 'react';

function PayPalLoginButton() {
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
          returnurl: 'https://driveu.online/signup',
          nonce: '111111'
        });
      });
    };
    document.body.appendChild(script);
  }, []);

  return <span id="linkPayPal" />;
}

export default PayPalLoginButton;