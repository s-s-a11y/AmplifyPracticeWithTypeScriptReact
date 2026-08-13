"use client";

import { useEffect, useState } from "react";

type Sake = {
  sakeId: number;
  name: string;
  price: number;
};

export const Home = () => {
  // 商品一覧ページ
  // m-sake2テーブルの全件を取得し表示する。
  // カートに追加ボタンを要素に追加し、購入処理につなぐ

  const [sakes, setSakes] = useState<Sake[]>([]);

  useEffect(() => {
    fetch(
      "https://lyzfi7vcic.execute-api.ap-northeast-1.amazonaws.com/OrderProgramStage/OrderProgram/GetSakeList",
    )
      .then((res) => res.json())
      .then((data) => setSakes(data));
  });
  return (
    <div className="Home">
      <h1>商品一覧</h1>
      <ul>
        {sakes.map((sakes) => (
          <li key={sakes.sakeId}></li>
        ))}
      </ul>
    </div>
  );
};
