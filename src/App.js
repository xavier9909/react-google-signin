import React, { useState, useEffect } from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import './App.css';
import { isEmpty, split } from 'lodash';

function App() {
	const [isLoggedIn, setLoginStatus] = useState(false);

	const getAllUsers = async () => {
		const data = await axios.get('/user/authenticated/getAll');
		console.log(data);
	}


	const responseGoogle = async (response) => {
		const bodyObject = {
			authId: response.tokenId
		};
		try {
			if (isEmpty(response.errors)) {
				await axios.post('/login/user', bodyObject);
				setLoginStatus(true);
			}
		}
		catch (e) {
			console.log(e);
		}
	}


	const logout = async () => {
		try {
			await axios.get('/logout/user');
			setLoginStatus(false);
		}
		catch (e) {
			console.log(e);
		}
	}

	useEffect(() => {
		async function getStatus() {
			try {
				const data = await axios.get('/user/checkLoginStatus');
				console.log(data);
				if (isEmpty(data.error)) {
					setLoginStatus(true);
				}
			}
			catch (e) {
				console.log(e);
				try {
					
				} catch (error) {
					
				}
				setLoginStatus(false);
			}
		}
		getStatus();
	}, [])

	return (
		<div className="App">
			<header className="App-header">
			<input/>
			<br/>
			<inpit/>
				<p>Google Login Raect/Node/Express</p>
			</header>
			<body>
				<GoogleLogin
					clientId=""
					render={renderProps => (
						<button className='btn g-sigin'
							onClick={renderProps.onClick}
							disabled={renderProps.disabled}
						>
						
						
						
							<p>Continue with Google</p>
						</button>
					)}
					buttonText="Login"
					onSuccess={responseGoogle}
					onFailure={responseGoogle}
					cookiePolicy={'single_host_origin'}
				/>
				<button onClick={getAllUsers}>Get All Users in db</button>
				{isLoggedIn &&
					<button onClick={logout}>Logout</button>
				}
			</body>
		</div>
	);
}

export default App;
