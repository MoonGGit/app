import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Success from '../components/loading/Success';
import Loading from '../components/loading/Loading';
import Fail from '../components/loading/Fail';
import ModalWrapper from '../components/util/ModalWrapper';
import SignIn from '../components/account/SignIn';
import SignUp from '../components/account/SignUp';
import styles from '../scss/app.scss';

const rootElement = document.getElementById('root');

// ReactDOM.render(<App />, rootElement);
// ReactDOM.render(<Loading isVisible={true} />, rootElement);
ReactDOM.render(
	<ModalWrapper
		isVisible={true}
		headerText={'로그인'}
		headerStyle={styles['c-account-modal-header']}
		handleCloseModal={() => console.log('click')}
	>
		<SignUp handleReturnLogin={() => console.log('good')} />
		{/* <SignIn /> */}
	</ModalWrapper>,
	rootElement,
);
