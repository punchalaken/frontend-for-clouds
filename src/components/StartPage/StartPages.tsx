import { NavLink } from "react-router-dom";
import './StartPages.css';
import { RootState } from "../../store";
import { useSelector } from "react-redux";

export function StartPages() {
    const loginUser = useSelector((state: RootState) => state.users.loginUser);
    const activeState = useSelector((state: RootState) => state.users.activeState);

    return (
        <nav className="crud-menu">
            {activeState === 'auth' && loginUser ? (
                <div className="auth-name">
                    <h1>Добро пожаловать в наш сервис, уважаемый "{loginUser.username}"!</h1>
                    <h1>Перейти в фаловое хранилище!<NavLink to="/folder" className={'crud-menu__item'}>Clik!</NavLink></h1>
                </div>
            ) : (
                <div className="menu-login">
                    <h2 className="menu-login-welcome">Добро пожаловать на наш сервис облачного хранения данных!</h2>
                    <p className="menu-login-log-reg">Перед началом работы
                        <NavLink to="/login" className={'crud-menu__item'}>войдите</NavLink>
                        или
                        <NavLink to="/register" className={'crud-menu__item'}>зарегистрируйтесь</NavLink>
                    </p>
                </div>
            )}
        </nav>
    )
}
