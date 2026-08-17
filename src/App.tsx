"use client";
import { UserRegist } from "./components/UserRegist";
import { useEffect, useState } from "react";
import "./App.css";
import { Login } from "./components/Login";
import { Home } from "./components/Home";

function App() {
  const [currentView, setCurrentView] = useState<string>("login");
  const [loginUserName, setLoginUserName] = useState<string | null>(null);

  useEffect(() => {
    const loginUser = sessionStorage.getItem("loginUserName");
    setLoginUserName(loginUser);
  });

  const renderView = () => {
    switch (currentView) {
      case "userRegist":
        return <UserRegist />;
      case "login":
        return <Login />;
      case "home":
        return <Home />;
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setLoginUserName(null);
    setCurrentView("login");
  };
  return (
    <>
      <section id="center">
        <nav>
          {!loginUserName && (
            <div>
              <button onClick={() => setCurrentView("login")}>ログイン</button>{" "}
              |{" "}
              <button onClick={() => setCurrentView("userRegist")}>
                新規ユーザー登録
              </button>
            </div>
          )}
          {loginUserName && (
            <div>
              <button onClick={() => setCurrentView("home")}>HOME</button> |{" "}
              <button onClick={logout}>ログアウト</button>
            </div>
          )}
        </nav>
      </section>
      <div className="content-area">{renderView()}</div>
    </>
  );
}

export default App;
