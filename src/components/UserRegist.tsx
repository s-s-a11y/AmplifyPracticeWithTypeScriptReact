"use client";
import { useForm, type SubmitHandler } from "react-hook-form";

// 登録用のデータをまとめるタイプを作成
type UserRegistFormInput = {
  user_name: string;
  password: string;
  age: number;
  birthday: string;
  users_address: string;
};

export const UserRegist = () => {
  // ECサイトにおけるユーザー登録を行う
  // API接続先：OrderAdminAPI/OrderProgram/UserRegist
  // インプットデータ：{ユーザー名、パスワード、年齢(20以上)、誕生日、住所}
  // アウトプット：ユーザー登録可否

  //   React-hook-formの構成
  const {
    register, // 入力項目をRHFに「登録」するための関数
    handleSubmit, // バリデーションチェックを通った後、送信を実行する関数
    formState: { errors }, // バリデーションエラーの情報がリアルタイムに詰まるオブジェクト
  } = useForm<UserRegistFormInput>();

  //   フォームのsubmitを検知してAPIをたたきに行く。
  const onSubmit: SubmitHandler<UserRegistFormInput> = (data) => {
    fetch(
      // APIGatewayでステージングしたPOSTメソッドのURLを指定
      "https://lyzfi7vcic.execute-api.ap-northeast-1.amazonaws.com/OrderProgramStage/OrderProgram/UserRegist",
      {
        method: "POST",
        // HeaderにJson形式であることを示す。
        headers: {
          "Content-Type": "application/json",
        },
        // 入力データをJson形式の文字列に変換して送信。
        body: JSON.stringify(data),
      },
    )
      // 登録成功のレスポンスが返ってきた場合、「登録しました！」とアラートを表示。
      .then((res) => {
        if (res.ok) {
          alert("登録しました！");
        }
      })
      //   エラーが起きた場合にはコンソールに登録エラーと表示する。
      .catch((err) => console.error("登録エラー:", err));
  };

  return (
    <div className="user_regist">
      <h1>ユーザー登録</h1>
      {/* 入力欄を作成。ボタン押下でhandleSubmitを起動する。 */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>名前</label>
        {/* 必須入力、30文字以内 */}
        <input
          type="text"
          {...register("user_name", {
            required: "名前は必須入力です",
            maxLength: {
              value: 30,
              message: "名前は30文字以内で入力してください",
            },
          })}
        />
        <br />
        {/* バリデーションエラーをメッセージとして表示。 */}
        {errors.user_name && (
          <p className="error_message">{errors.user_name.message}</p>
        )}
        <label>パスワード</label>
        {/* 必須入力、30文字以内 */}
        <input
          type="password"
          {...register("password", {
            required: "パスワードは必須入力です",
            maxLength: {
              value: 30,
              message: "パスワードは30文字以内で入力してください",
            },
            minLength: {
              value: 8,
              message: "パスワードは8文字以上で入力してください",
            },
          })}
        />
        <br />
        {/* バリデーションエラーをメッセージとして表示。 */}
        {errors.password && (
          <p className="error_message">{errors.password.message}</p>
        )}
        <label>年齢</label>
        {/* 必須入力、20歳未満利用禁止 */}
        <input
          type="number"
          {...register("age", {
            required: "年齢は必須入力です",
            min: {
              value: 20,
              message: "20歳未満の方はご利用できません",
            },
          })}
        />
        <br />
        {/* バリデーションエラーをメッセージとして表示。 */}
        {errors.age && <p className="error_message">{errors.age.message}</p>}
        <label>誕生日</label>
        {/* 必須入力 */}
        <input
          type="datetime"
          {...register("birthday", {
            required: "誕生日は必須入力です",
          })}
        />
        <br />
        {/* バリデーションエラーをメッセージとして表示。 */}
        {errors.birthday && (
          <p className="error_message">{errors.birthday.message}</p>
        )}
        <label>住所</label>
        {/* 必須入力 */}
        <input
          type="text"
          {...register("users_address", {
            required: "住所は必須入力です",
          })}
        />
        <br />
        {/* バリデーションエラーをメッセージとして表示。 */}
        {errors.users_address && (
          <p className="error_message">{errors.users_address.message}</p>
        )}
        <br></br>
        {/* ボタン押下でsubmitHundlerへ */}
        <button type="submit">登録</button>
      </form>
    </div>
  );
};
