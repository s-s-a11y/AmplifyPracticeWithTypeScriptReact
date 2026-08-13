"use client";
import { useForm, type SubmitHandler } from "react-hook-form";

// 登録用のデータをまとめるタイプを作成
type LoginFormInput = {
  user_name: string;
  password: string;
};

export const Login = () => {
  // ECサイトにおけるユーザーログインを行う
  // API接続先：OrderAdminAPI/OrderProgram/UserLogin
  // インプットデータ：{ユーザー名、パスワード}
  // アウトプット：ユーザーログイン可否
  // リンク指定：ユーザー登録ページ

  //   React-hook-formの構成
  const {
    register, // 入力項目をRHFに「登録」するための関数
    handleSubmit, // バリデーションチェックを通った後、送信を実行する関数
    formState: { errors }, // バリデーションエラーの情報がリアルタイムに詰まるオブジェクト
  } = useForm<LoginFormInput>();

  const onSubmit: SubmitHandler<LoginFormInput> = (data) => {
    fetch(
      // APIGatewayでステージングしたPOSTメソッドのURLを指定
      "https://lyzfi7vcic.execute-api.ap-northeast-1.amazonaws.com/OrderProgramStage/OrderProgram/UserLogin",
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
          alert("ログイン成功！");
        }
      })
      //   エラーが起きた場合にはコンソールに登録エラーと表示する。
      .catch((err) => console.error("認証エラー:", err));
  };

  return (
    <div className="user_login">
      <h1>ログイン</h1>
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
          })}
        />
        <br />
        {/* バリデーションエラーをメッセージとして表示。 */}
        {errors.password && (
          <p className="error_message">{errors.password.message}</p>
        )}
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
};
