import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PopupWindow from './PopupWindow';
import { toQuery } from './utils';

class OAuth2Login extends Component {
  constructor(props) {
    super(props);
    this.onBtnClick = this.onBtnClick.bind(this);
    this.onRequest = this.onRequest.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  onBtnClick() {
    const {
      buttonText, authorizationUrl, clientId, scope, redirectUri, state,
    } = this.props;
    const payload = {
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
      response_type: 'code',
    };
    if (state) {
      payload.state = state;
    }
    const search = toQuery(payload);
    const width = 680;
    const height = 440;
    const left = window.screenX + ((window.outerWidth - width) / 2);
    const top = window.screenY + ((window.outerHeight - height) / 2.5);
    const popup = PopupWindow.open(
      buttonText,
      `${authorizationUrl}?${search}`,
      {
        height, width, top, left,
      },
    );
    this.popup = popup;

    this.onRequest();
    popup.then(
      (data) => this.onSuccess(data),
      (error) => this.onFailure(error),
    );
  }

  onRequest() {
    const { onRequest } = this.props;
    onRequest();
  }

  onSuccess(data) {
    if (!data.code) {
      return this.onFailure(new Error('\'code\' not found'));
    }

    const code = decodeURIComponent(data.code);
    const result = { code };
    if (data.scope) {
      result.scope = decodeURIComponent(data.scope);
    }

    const { onSuccess } = this.props;
    return onSuccess(result);
  }

  onFailure(error) {
    const { onRequest } = this.props;
    onRequest(error);
  }

  render() {
    const { className, buttonText, children } = this.props;
    const attrs = { onClick: this.onBtnClick };

    if (className) {
      attrs.className = className;
    }

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <button type="button" {...attrs}>{ children || buttonText }</button>;
  }
}

OAuth2Login.defaultProps = {
  buttonText: 'Login',
  scope: '',
  state: '',
  onRequest: () => {},
};

OAuth2Login.propTypes = {
  buttonText: PropTypes.string,
  authorizationUrl: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  clientId: PropTypes.string.isRequired,
  onRequest: PropTypes.func,
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
  redirectUri: PropTypes.string.isRequired,
  scope: PropTypes.string,
  state: PropTypes.string,
};

export default OAuth2Login;
