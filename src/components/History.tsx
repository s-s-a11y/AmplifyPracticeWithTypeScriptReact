"use client";
import { useEffect, useState } from "react";

type Order = {
  user_id: string;
  purchase_id: string;
  orders: [
    {
      product_name: string;
      price: string;
      amount: string;
      sum_price: string;
    },
  ];
  total_price: string;
  arrival_at: string;
};

export const History = () => {
  // 注文履歴表示ページ
  // t_users_purchasesテーブルからでデータを取得して表示する。
  // API接続先：未作成
  // 表示のみ

  //   注文履歴格納用State
  const [orders, setOrders] = useState<Order[]>([]);
  // 画面表示とともにフェッチして購入履歴を取得する。
  useEffect(() => {
    fetch(
      "https://lyzfi7vcic.execute-api.ap-northeast-1.amazonaws.com/OrderProgramStage/OrderProgram/CheckOrder",
    )
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div className="history">
      <h1>注文履歴</h1>
      <table border={1}>
        <tr>
          <th>注文番号</th>
          <th>注文内容</th>
          <th>合計金額</th>
          <th>到着予定日</th>
        </tr>
        {orders.map((order) => (
          <tr key={order.purchase_id}>
            <td>
              <span>{order.purchase_id}</span>
            </td>
            <td>
              {order.orders.map((pro) => (
                <span>
                  {pro.product_name} × {pro.amount}個
                </span>
              ))}
            </td>
            <td>
              <span>{order.total_price}</span>
            </td>
            <td>
              <span>{order.arrival_at}</span>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};
