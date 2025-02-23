import './Login.css';
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { PasswordInput } from "../../elements/PasswordValidate";
import { useDispatch } from "react-redux";
import getError from "../../elements/GetError";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { logIn } from '../../api/api';
import { loginSuccess } from '../../slices/usersSlice';
import { AppDispatch } from '../../store';


const Login: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const [ username, setUsername ] = useState<string>("");
	const [ password, setPassword ] = useState<string>("");
	const [ errorMessage, setErrorMessage ] = useState<string>('');
	const [ memory, setMemory ] = useState<boolean>(false);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	useEffect(() => {
		const effectUsername = localStorage.getItem('username');

		if (effectUsername) {
			setUsername(effectUsername);
			setMemory(true);
		}
	}, [])

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (memory) {
				localStorage.setItem('username', username);
			} else {
				localStorage.removeItem('username');
			}

			const response = await logIn(username, password);
			dispatch(loginSuccess(response.user));
			navigate('/folder');
		} catch (error) {
			console.error('Ошибка входа:', error);
			const errorMessage = getError(error as FetchBaseQueryError | SerializedError);
			setErrorMessage(errorMessage);
		} finally {
			setIsLoading(false); // Сбрасываем флаг загрузки
		}
	};

	return (
		<div className="container-login">
			<h2>Логин</h2>
			<form method="post" onSubmit={handleLogin}>
				<div className="form-group">
					<label htmlFor="username">Логин:</label>
					<input
						type="text"
						id='username'
						value={username}
						placeholder='Логин'
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>
				<div className="form-group">
					<PasswordInput password={password} setPassword={setPassword} confirm={true}/>
				</div>
				<div>
					<label>
						<input
							type="checkbox"
							checked={memory}
							onChange={(e) => setMemory(e.target.checked)}
						/>
						Запомнить логин
					</label>
				</div>
				<button type='submit' className='button-submit' disabled={isLoading}>Войти</button>
				{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
			</form>
			<div className="register">
                <p>Первый раз у нас? <NavLink to="/register">Регистрация</NavLink></p>
            </div>
		</div>
);
};


export default Login;
