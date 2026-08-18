"use client";

import { useEffect, useState } from "react";

// 注文履歴に登録するための注文物テンプレート
type Order = {
  product_name: string;
  price: number;
  amount: number;
  sum_price: number;
};

export const Cart = () => {
  // カート確認画面
  // カート内に登録した内容と合計金額を表示
  // API接続先：OrderAdminAPI/OrderProgram/RegistOrder
  // レスポンス：発送完了メッセージ

  //   カート内のデータおよびユーザーデータを取得するState
  const [cartItem, setCartItem] = useState<Order[]>([]);
  const [userId, setUserId] = useState<number>(0);
  const [userName, setUserName] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>();

  //   メッセージ格納用State
  const [message, setMessage] = useState<string>("");

  //   カート内の合計金額を計算する処理
  const calcTotalPrice = () => {
    let total_price = 0;
    let i = 0;
    while (i < cartItem.length) {
      total_price = total_price + cartItem[i].sum_price;
      i++;
    }
    return total_price;
  };

  // 画面表示とともにカート内アイテムとログインしているユーザーに関するデータを取得
  useEffect(() => {
    // セッションストレージからカート内容を取得
    const jsoncart = sessionStorage.getItem("cart");
    // 条件分岐：取得したカート内容が空でない場合、配列に格納。空の場合メッセージを作成。
    if (jsoncart) {
      setCartItem(JSON.parse(jsoncart));
      setTotalPrice(calcTotalPrice());
    } else {
      setMessage("カートが空です");
    }
    // セッションストレージからログインしているユーザーのIDと名前を取得、こちらも同様nullかどうかで条件分岐
    const userId = sessionStorage.getItem("loginUserId");
    if (userId) {
      setUserId(Number(userId));
    }
    const userName = sessionStorage.getItem("loginUserName");
    if (userName) {
      setUserName(userName);
    }
  }, []);

  //   APIに対してデータを投げて注文履歴を保存する処理
  const saveOrder = () => {
    const orders = cartItem;
    const RegistOrder = {
      user_id: userId,
      user_name: userName,
      orders: orders,
      total_price: totalPrice,
    };
    fetch(
      // APIGatewayでステージングしたPOSTメソッドのURLを指定
      "https://lyzfi7vcic.execute-api.ap-northeast-1.amazonaws.com/OrderProgramStage/OrderProgram/RegistOrder",
      {
        method: "POST",
        // HeaderにJson形式であることを示す。
        headers: {
          "Content-Type": "application/json",
        },
        // 入力データをJson形式の文字列に変換して送信。
        body: JSON.stringify(RegistOrder),
      },
    )
      // 登録成功のレスポンスが返ってきた場合、「登録しました！」とアラートを表示。
      .then((res) => {
        if (res.ok) {
          alert("購入が完了しました！");
        }
      })
      //   エラーが起きた場合にはコンソールに登録エラーと表示する。
      .catch((err) => console.error("購入エラー:", err));
  };

  return (
    <div className="cart">
      <h1>カート確認画面</h1>
      {cartItem.length > 0 && (
        <table>
          <tr>
            <th>名称</th>
            <th>価格</th>
            <th>数量</th>
            <th>合計価格</th>
          </tr>
          {cartItem.map((order) => (
            <tr key={order.product_name}>
              <td>
                <span>{order.product_name}</span>
              </td>
              <td>
                <span>{order.price}円</span>
              </td>
              <td>
                <span>{order.amount}</span>
              </td>
              <td>
                <span>{order.sum_price}円</span>
              </td>
            </tr>
          ))}
        </table>
      )}
      {cartItem.length === 0 && (
        <div className="message">
          <p>{message}</p>
        </div>
      )}
      <span>合計：{String(totalPrice)}</span>
      <br />
      <button onClick={() => saveOrder()}>購入する</button>
    </div>
  );
};
