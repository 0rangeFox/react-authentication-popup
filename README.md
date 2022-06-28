<h1 align="center"><img src="https://cdn.iconscout.com/icon/free/png-32/typescript-1174965.png" /> React Authentication Popup</h1>
<h6 align="center"><a href="https://www.npmjs.com/package/react-authentication-popup" ><img src="https://img.shields.io/npm/v/react-authentication-popup.svg?style=flat-square" /></a></h6>

> A React library with Authentication Popup to login through OAuth2 or self-auth, supports Authorization Code and Implicit Grant flows.

## 🔖 Description
The following library allows us to create authentication popup where is able to retrieve the "token" from internal/external authentication page. This library was not made by me, but by [Benoît Hubert](https://github.com/bhubr), this is just maintenance and improvements of the [library](https://github.com/bhubr/react-simple-oauth2-login).

## 💾 Installation
```bash
# NPM
npm install react-authentication-popup

# Yarn
yarn add react-authentication-popup
```

## ⌨️ Code example
```typescript jsx
import React, { FunctionComponent, useLayoutEffect, useState } from 'react';
import AuthenticationPopup, { ResponseLocationType } from 'react-authentication-popup';

const OAuthTest: FunctionComponent = () => {

  const [token, setToken] = useState<string>('');
  const [isAuthenticating, setAuthenticatingStatus] = useState<boolean>(false);
  const isAuthenticated: boolean = token.length > 0;

  const onRequest = () => setAuthenticatingStatus(true);
  const onSuccess = (response: any) => setToken(response);
  const onFailure = () => setAuthenticatingStatus(false);

  useLayoutEffect(() => {
    if (isAuthenticated) setAuthenticatingStatus(false);
  }, [isAuthenticated]);

  return (
    <div>
      {!isAuthenticated && (
        <AuthenticationPopup
          authorizationUrl="http://localhost:3000/login"
          responseType={ResponseLocationType.TOKEN}
          onRequest={onRequest}
          onSuccess={onSuccess}
          onFailure={onFailure}
          render={({ onClick }) => (
            <button onClick={onClick}>Authenticate</button>
          )}
          isCrossOrigin
        />
      ) || <span>Authenticated with token: {token}</span>}
    </div>
  );

}
```

## 🤝 Contributing
This project will always remain open source and any kind of contribution is welcome. By participating in this project, you agree to keep common sense and contribute in a positive way.

## 📰 Credits
A special thanks to [Benoît Hubert](https://github.com/bhubr) who had the idea to start this project and to their contributors who also invested the time in making the improvements and bugfixes.

## 📝 License
Copyright © 2022 [João Fernandes](https://github.com/0rangeFox). <br/>
This project is [MIT](https://github.com/0rangeFox/react-authentication-popup/blob/master/LICENSE) licensed.
