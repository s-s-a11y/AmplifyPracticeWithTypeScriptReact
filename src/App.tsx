"use client";
import { UserRegist } from "./components/UserRegist";
import { useEffect, useState } from "react";
import "./App.css";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { Cart } from "./components/Cart";

function App() {
  // アプリケーションのおおもとになる骨子

  // 表示するコンポーネントを決定するStateを設定
  const [currentView, setCurrentView] = useState<string>("login");
  // ログインしているユーザーの名前を扱う
  const [loginUserName, setLoginUserName] = useState<string | null>(null);

  // 画面表示と同時にセッションストレージから情報を取得
  useEffect(() => {
    const loginUser = sessionStorage.getItem("loginUserName");
    const cartItems = sessionStorage.getItem("cart");
    // 条件分岐：ログインしているユーザー名が存在するならばホーム画面を表示
    if (loginUser != null) {
      // 条件分岐：かつカートにアイテムが入っているならばカート確認画面を表示
      if (cartItems != null) {
        setCurrentView("cart");
      } else {
        setCurrentView("home");
      }
    }
    // 取得したユーザー名をセッションストレージに保存。
    setLoginUserName(loginUser);
  }, []);

  // 描画するコンポーネントを決定する処理
  const renderView = () => {
    // currentViewStateに伴ってSwitch文で切り替え
    switch (currentView) {
      case "userRegist":
        return <UserRegist />;
      case "login":
        return <Login />;
      case "home":
        return <Home />;
      case "cart":
        return <Cart />;
    }
  };

  // ログアウト処理：セッションストレージの内容を削除しStateも初期化する。
  const logout = () => {
    sessionStorage.clear();
    setLoginUserName(null);
    // ログイン画面を表示する。
    setCurrentView("login");
  };
  return (
    <>
      <section id="center">
        <nav>
          {/* ログインしているユーザーがいないときのみ表示するボタン */}
          {!loginUserName && (
            <div>
              <button onClick={() => setCurrentView("login")}>ログイン</button>{" "}
              |{" "}
              <button onClick={() => setCurrentView("userRegist")}>
                新規ユーザー登録
              </button>
            </div>
          )}
          {/* ログインしているユーザーがいるときのみ表示するボタン */}
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
