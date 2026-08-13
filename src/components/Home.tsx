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
  // API接続先：OrderAdminAPI/OrderProgram/GetSakeList
  // カートに追加ボタンを要素に追加し、購入処理につなぐ

  //   取得したデータを保存する配列をuseStateで作成
  const [sakes, setSakes] = useState<Sake[]>([]);
  // 画面表示とともにフェッチ
  useEffect(() => {
    fetch(
      "https://lyzfi7vcic.execute-api.ap-northeast-1.amazonaws.com/OrderProgramStage/OrderProgram/GetSakeList",
    )
      .then((res) => res.json())
      .then((data) => setSakes(data));
  }, []);
  return (
    <div className="Home">
      <h1>商品一覧</h1>
      <ul>
        {/* 表示用に酒の配列を解体 */}
        {sakes.map((sakes) => (
          // 酒IDを基準にリスト表示
          <li key={sakes.sakeId}>
            <span>{sakes.name}</span> -
            <span>{sakes.price.toLocaleString()}円</span>
            {/* 文字列化して表示 */}
            <button>カートに追加</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
