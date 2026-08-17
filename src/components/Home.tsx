"use client";

import { useEffect, useState } from "react";

// 表示するための酒テンプレート
type Sake = {
  sakeId: number;
  name: string;
  price: number;
  amount: 0;
};
// カートに登録するための注文物テンプレート
type Order = {
  name: string;
  price: number;
  amount: number;
  sum_price: number;
};

export const Home = () => {
  // 商品一覧ページ
  // m-sake2テーブルの全件を取得し表示する。
  // API接続先：OrderAdminAPI/OrderProgram/GetSakeList
  // カートに追加ボタンを要素に追加し、購入処理につなぐ

  //   取得した酒データを保存する配列をuseStateで作成
  const [sakes, setSakes] = useState<Sake[]>([]);
  //   カート保存用Order型データ配列
  const [cartItems, setCartItems] = useState<Order[]>([]);
  // 画面表示とともにフェッチ
  useEffect(() => {
    fetch(
      "https://lyzfi7vcic.execute-api.ap-northeast-1.amazonaws.com/OrderProgramStage/OrderProgram/GetSakeList",
    )
      .then((res) => res.json())
      .then((data) => setSakes(data));
  }, []);

  //   cartItemsに対しての商品追加処理
  const handleAddCart = (name: string, price: number, amount: number) => {
    // 登録対象のOrder型データの作成
    let preOrder = {
      name: name,
      price: price,
      amount: amount,
      sum_price: amount * price,
    };
    // Order型配列cartItemsに追加
    setCartItems([...cartItems, preOrder]);
  };

  const handleGoCart = () => {
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
  };

  return (
    <div className="Home">
      <h1>商品一覧</h1>
      <button onClick={() => handleGoCart()}>カート画面へ</button>
      <table border={1}>
        <tr>
          <th>酒名</th>
          <th>価格</th>
          <th>数量</th>
          <th>操作</th>
        </tr>
        {/* 表示用に酒の配列を一要素ずつ扱う */}
        {sakes.map((sakes) => (
          <tr key={sakes.sakeId}>
            {/* // 酒IDを基準にリスト表示 */}
            <td>
              <span>{sakes.name}</span>
            </td>
            <td>
              <span>{sakes.price}円</span>
            </td>
            <td>
              <span>
                <input
                  //   type="number"
                  value={sakes.amount}
                />
              </span>
            </td>
            <td>
              <span>
                {/* 文字列化して表示 */}
                <button
                  onClick={() =>
                    handleAddCart(sakes.name, sakes.price, sakes.amount)
                  }
                >
                  カートに追加
                </button>
              </span>{" "}
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};
