import { UserRegist } from "./components/UserRegist";
import { useState } from "react";
import "./App.css";
import { Login } from "./components/Login";

function App() {
  const [currentView, setCurrentView] = useState<string>("home");
  const renderView = () => {
    switch (currentView) {
      case "userRegist":
        return <UserRegist />;
      case "login":
        return <Login />;
    }
    return (
      <>
        <section id="center">
          <nav>
            <button onClick={() => setCurrentView("login")}>ログイン</button> |{" "}
            <button onClick={() => setCurrentView("userRegist")}>
              新規ユーザー登録
            </button>{" "}
          </nav>
        </section>
        <div className="content-area">{renderView()}</div>
      </>
    );
  };
}

export default App;
