"use client";

import { useEffect, useState } from "react";
import { Cart } from "./Cart";

// 表示するための酒テンプレート
type Sake = {
  sakeId: number;
  name: string;
  price: number;
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
  //   購入個数保存用State 酒IDと数量をそれぞれキーバリューとした辞書型データの配列
  const [amounts, setAmounts] = useState<{ [key: number]: number }>({});
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

  //   カート画面に遷移する処理
  const handleGoCart = () => {
    // cartItemsをjson化してsessionStorageに格納。
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
    return <Cart />;
  };

  //   入力された商品ごとの数量の更新処理
  const handleAmount = (sakeId: number, amount: number) => {
    // 第一引数にprev(直前の状態)を取得する
    setAmounts((prev) => ({
      // スプレッド構文によっていったん展開。
      ...prev,
      //   該当の酒IDをキーとするバリューを更新。
      [sakeId]: amount,
    }));
  };

  //   カートに商品を追加する処理　酒のデータすべて(ID、名前、値段)を引数に取る。
  const handleAddCart = (sake: Sake) => {
    // 現在入力済みのその商品の購入数を取得
    const currentAmount = amounts[sake.sakeId];
    // 既にカート内に商品が存在するかの確認　第一引数を指定することで直前情報を取得
    setCartItems((prevCart) => {
      // 名前を照合して登録済み商品の配列要素番号をカートから取得
      const existingIndex = prevCart.findIndex(
        // 条件は名称の一致
        (item) => item.name === sake.name,
      );
      //   条件分岐：すでにカートに入っている商品だった場合は数量と合計金額を合算
      if (existingIndex >= 0) {
        const updated = [...prevCart];
        // 登録済み数量と入力している数量を合算
        const newAmount = updated[existingIndex].amount + currentAmount;
        // 対象項目を更新
        updated[existingIndex] = {
          ...updated[existingIndex],
          amount: newAmount,
          sum_price: newAmount * sake.price,
        };
        // 更新した配列を返す。
        return updated;
        // 条件分岐：カートに初めて登録する商品だった場合
      } else {
        // 現状のカートの末尾に現在選択されている商品を登録して配列を返す。
        return [
          ...prevCart,
          {
            name: sake.name,
            price: sake.price,
            amount: currentAmount,
            sum_price: currentAmount * sake.price,
          },
        ];
      }
    });
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
        {sakes.map((sake) => (
          <tr key={sake.sakeId}>
            {/* // 酒IDを基準にリスト表示 */}
            <td>
              <span>{sake.name}</span>
            </td>
            <td>
              <span>{sake.price}円</span>
            </td>
            <td>
              <span>
                <input
                  type="number"
                  min={0}
                  value={amounts[sake.sakeId] ?? 0}
                  onChange={(e) =>
                    handleAmount(sake.sakeId, Number(e.target.value))
                  }
                />
              </span>
            </td>
            <td>
              <span>
                {/* 文字列化して表示 */}
                <button onClick={() => handleAddCart(sake)}>
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
