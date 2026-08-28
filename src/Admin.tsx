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

// 新規商品登録用 フォーム入力型
type ProductFormValues = {
  name: string;
  price: number;
  maker: string;
  maker_address: string;
  rice_name: string;
  rice_percentage: string;
  mainCategory: string;
  subCategory: string;
};

// POST送信用の商品データ型
type SakeRegistFormInput = Omit<
  ProductFormValues,
  "mainCategory" | "subCategory"
> & {
  category_code: string;
};

// ★ 管理者権限付与 フォーム入力型
type AddAdminRoleInput = {
  user_name: string;
};

// 日次売り上げ表示型
type sale = {
  target_date: string;
  total_sales: number;
};

export const Admin = () => {
  const [sales, setSales] = useState<sale[]>([]);

  // ★ 1. 商品登録用 フォームフック
  const {
    register: registerProduct,
    handleSubmit: handleSubmitProduct,
    watch: watchProduct,
    setValue: setValueProduct,
    formState: { errors: errorsProduct },
  } = useForm<ProductFormValues>({
    defaultValues: {
      mainCategory: "01",
      subCategory: "001",
    },
  });

  // ★ 2. 管理者権限付与用 フォームフック（複数フォームがあるため分離）
  const {
    register: registerAdmin,
    handleSubmit: handleSubmitAdmin,
    reset: resetAdminForm,
    formState: { errors: errorsAdmin },
  } = useForm<AddAdminRoleInput>();

  const selectedMainCategory = watchProduct("mainCategory");

  useEffect(() => {
    if (selectedMainCategory && INNER_CATEGORIES[selectedMainCategory]) {
      setValueProduct(
        "subCategory",
        INNER_CATEGORIES[selectedMainCategory][0].id,
      );
    }
  }, [selectedMainCategory, setValueProduct]);

  useEffect(() => {
    fetch(
      "https://lyzfi7vcic.execute-api.ap-northeast-1.amazonaws.com/OrderProgramStage/OrderProgram/GetDailySales",
    )
      .then((res) => res.json())
      .then((data) => setSales(data));
  }, []);

  // 商品登録 Submit
  const onProductSubmit: SubmitHandler<ProductFormValues> = (data) => {
    const { mainCategory, subCategory, ...rest } = data;
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
        if (res.ok) alert("商品を登録しました！");
      })
      .catch((err) => console.error("商品登録エラー:", err));
  };

  // ★ 管理者権限付与 Submit
  const onAdminSubmit: SubmitHandler<AddAdminRoleInput> = (data) => {
    fetch(
      "https://lyzfi7vcic.execute-api.ap-northeast-1.amazonaws.com/OrderProgramStage/OrderProgram/SetAdminRole",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // { "user_name": "入力された名前" } を送信
      },
    )
      .then((res) => {
        if (res.ok) {
          alert(`${data.user_name} に管理者権限を付与しました！`);
          resetAdminForm(); // フォーム入力をクリア
        } else {
          alert("権限の付与に失敗しました");
        }
      })
      .catch((err) => console.error("管理者権限付与エラー:", err));
  };

  return (
    <div className="admin">
      {/* 日次売上表示 */}
      <div className="dailysales">
        <h2>日次売り上げ一覧</h2>
        <table border={1}>
          <thead>
            <tr>
              <th>日付</th>
              <th>合計売上</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.target_date}>
                <td>
                  <span>{sale.target_date}</span>
                </td>
                <td>
                  <span>{sale.total_sales}円</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 新規商品登録 */}
      <div className="addproduct">
        <h2>新規商品登録</h2>
        <form onSubmit={handleSubmitProduct(onProductSubmit)}>
          <label>商品名称 ※必須入力</label>
          <input
            type="text"
            {...registerProduct("name", { required: "商品名称は必須入力です" })}
          />
          {errorsProduct.name && (
            <p className="error_message">{errorsProduct.name.message}</p>
          )}
          <br />

          <label>価格 ※必須入力、0以上</label>
          <input
            type="number"
            {...registerProduct("price", {
              required: "価格は必須入力です",
              min: { value: 0, message: "0以上の値を入力してください" },
            })}
          />
          {errorsProduct.price && (
            <p className="error_message">{errorsProduct.price.message}</p>
          )}
          <br />

          <label>カテゴリー ※必須</label>
          <select {...registerProduct("mainCategory")}>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <br />

          <label>カテゴリー詳細 ※必須</label>
          <select {...registerProduct("subCategory")}>
            {INNER_CATEGORIES[selectedMainCategory]?.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
          <br />

          <label>製造元</label>
          <input type="text" {...registerProduct("maker")} />
          <br />
          <label>製造元住所</label>
          <input type="text" {...registerProduct("maker_address")} />
          <br />
          <label>酒米名</label>
          <input type="text" {...registerProduct("rice_name")} />
          <br />
          <label>精米歩合</label>
          <input type="text" {...registerProduct("rice_percentage")} />
          <br />
          <br />

          <button type="submit">登録</button>
        </form>
      </div>

      {/* ★ 管理者権限付与フォーム */}
      <div className="setadmin">
        <h2>管理者権限の付与</h2>
        <form onSubmit={handleSubmitAdmin(onAdminSubmit)}>
          <label>ユーザー名 ※必須</label>
          <input
            type="text"
            {...registerAdmin("user_name", {
              required: "ユーザー名は必須入力です",
              maxLength: {
                value: 30,
                message: "ユーザー名は30文字以内で入力してください",
              },
            })}
          />
          <br />
          {errorsAdmin.user_name && (
            <p className="error_message">{errorsAdmin.user_name.message}</p>
          )}
          <button type="submit">権限付与</button>
        </form>
      </div>
    </div>
  );
};
