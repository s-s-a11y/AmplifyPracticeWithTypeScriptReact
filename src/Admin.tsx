"use client";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

// カテゴリーの定義データ
const CATEGORIES = [
  { id: "01", name: "日本酒" },
  { id: "02", name: "ワイン" },
  { id: "03", name: "ビール" },
  { id: "04", name: "ウイスキー" },
  { id: "05", name: "焼酎" },
];

const INNER_CATEGORIES: Record<string, { id: string; name: string }[]> = {
  "01": [
    { id: "001", name: "純米酒" },
    { id: "002", name: "純米吟醸酒" },
    { id: "003", name: "純米大吟醸酒" },
  ],
  "02": [
    { id: "001", name: "赤" },
    { id: "002", name: "白" },
    { id: "003", name: "ロゼ" },
  ],
  "03": [
    { id: "001", name: "ラガービール" },
    { id: "002", name: "ピルスナー" },
    { id: "003", name: "ヴァイツェン" },
  ],
  "04": [
    { id: "001", name: "スコッチ" },
    { id: "002", name: "バーボン" },
    { id: "003", name: "ジャパニーズ" },
  ],
  "05": [
    { id: "001", name: "芋" },
    { id: "002", name: "麦" },
    { id: "003", name: "米" },
  ],
};

// フォームの入力型（画面上のセレクトボックス用）
type FormValues = {
  name: string;
  price: number;
  maker: string;
  maker_address: string;
  rice_name: string;
  rice_percentage: string;
  mainCategory: string; // 大カテゴリ (例: "01")
  subCategory: string; // 詳細カテゴリ (例: "001")
};

// POST送信用のデータ型
type SakeRegistFormInput = Omit<FormValues, "mainCategory" | "subCategory"> & {
  category_code: string; // 結合した5桁 (例: "01001")
};

// 日次売り上げを表示するためのタイプ
type sale = {
  target_date: string;
  total_sales: number;
};

export const Admin = () => {
  // ECサイトにおける管理画面
  // 日次売り上げ一覧表示と新規商品登録欄表示を行う。
  // インプットデータ：{名称、価格、カテゴリーコード、他任意項目}
  // アウトプット：登録可否メッセージ

  // 日次売り上げ一覧表示用State
  const [sales, setSales] = useState<sale[]>([]);

  //   React-hook-formの構成
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      mainCategory: "01",
      subCategory: "001",
    },
  });

  // 選択されている大カテゴリをリアルタイム監視
  const selectedMainCategory = watch("mainCategory");

  // 大カテゴリが変更されたら、詳細カテゴリの選択値を最初の要素にリセット
  useEffect(() => {
    if (selectedMainCategory && INNER_CATEGORIES[selectedMainCategory]) {
      setValue("subCategory", INNER_CATEGORIES[selectedMainCategory][0].id);
    }
  }, [selectedMainCategory, setValue]);

  // 画面表示とともにフェッチ
  useEffect(() => {
    fetch(
      "https://lyzfi7vcic.execute-api.ap-northeast-1.amazonaws.com/OrderProgramStage/OrderProgram/GetDailySales",
    )
      .then((res) => res.json())
      .then((data) => setSales(data));
  }, []);

  // Submit処理：大・詳細を結合して category_code に整形
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const { mainCategory, subCategory, ...rest } = data;

    // 2つの値を結合して5桁の文字列を生成（例: "01" + "001" = "01001"）
    const postData: SakeRegistFormInput = {
      ...rest,
      category_code: `${mainCategory}${subCategory}`,
    };

    fetch(
      "https://lyzfi7vcic.execute-api.ap-northeast-1.amazonaws.com/OrderProgramStage/OrderProgram/SaveNewSake",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      },
    )
      .then((res) => {
        if (res.ok) alert("登録しました！");
      })
      .catch((err) => console.error("登録エラー:", err));
  };

  return (
    <div className="admin">
      <div className="dailysales">
        <h2>日次売り上げ一覧</h2>
        <table border={1}>
          <tr>
            <th>日付</th>
            <th>合計売上</th>
          </tr>
          {/* 表示用に売り上げの配列を一要素ずつ扱う */}
          {sales.map((sale) => (
            <tr key={sale.target_date}>
              {/* // 対象日を基準にリスト表示 */}
              <td>
                <span>{sale.target_date}</span>
              </td>
              <td>
                <span>{sale.total_sales}円</span>
              </td>
            </tr>
          ))}
        </table>
      </div>
      <div className="addproduct">
        <h2>新規商品登録</h2>
        {/* 入力欄を作成。ボタン押下でhandleSubmitを起動する。 */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>商品名称 ※必須入力</label>
          <input
            type="text"
            {...register("name", { required: "商品名称は必須入力です" })}
          />
          {errors.name && (
            <p className="error_message">{errors.name.message}</p>
          )}
          <br />

          <label>価格 ※必須入力、0以上</label>
          <input
            type="number"
            {...register("price", {
              required: "価格は必須入力です",
              min: { value: 0, message: "0以上の値を入力してください" },
            })}
          />
          {errors.price && (
            <p className="error_message">{errors.price.message}</p>
          )}
          <br />

          {/* ★ カテゴリー選択セレクトボックス (大分類) */}
          <label>カテゴリー ※必須</label>
          <select {...register("mainCategory")}>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <br />

          {/* ★ カテゴリー詳細セレクトボックス (小分類) */}
          <label>カテゴリー詳細 ※必須</label>
          <select {...register("subCategory")}>
            {INNER_CATEGORIES[selectedMainCategory]?.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
          <br />

          <label>製造元</label>
          <input type="text" {...register("maker")} />
          <br />
          <label>製造元住所</label>
          <input type="text" {...register("maker_address")} />
          <br />
          <label>酒米名</label>
          <input type="text" {...register("rice_name")} />
          <br />
          <label>精米歩合</label>
          <input type="text" {...register("rice_percentage")} />
          <br />
          <br />

          <button type="submit">登録</button>
        </form>
      </div>
    </div>
  );
};
