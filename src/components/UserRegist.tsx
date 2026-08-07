"use client";
import { useForm, SubmitHandler } from "react-hook-form";

// 登録用のデータをまとめるタイプを作成
type UserRegistFormInput = {
  userName: string;
  password: string;
  age: number;
  birthday: string;
  address: string;
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
      "https://lyzfi7vcic.execute-api.ap-northeast-1.amazonaws.com/OrderProgramStage/OrderProgram/UserRegist",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    )
      .then((res) => {
        if (res.ok) {
          alert("登録しました！");
        }
      })
      .catch((err) => console.error("登録エラー:", err));
  };

  return (
    <div>
      <h1>ユーザー登録</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>名前</label>
        <input
          type="text"
          {...register("userName", {
            required: "名前は必須入力です",
            maxLength: {
              value: 30,
              message: "名前は30文字以内で入力してください",
            },
          })}
        />
        {errors.userName && (
          <p className="error_message">{errors.userName.message}</p>
        )}
        <label>パスワード</label>
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
        {errors.password && (
          <p className="error_message">{errors.password.message}</p>
        )}
        <label>年齢</label>
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
        {errors.age && <p className="error_message">{errors.age.message}</p>}
        <label>誕生日</label>
        <input
          type="datetime"
          {...register("birthday", {
            required: "誕生日は必須入力です",
          })}
        />
        {errors.birthday && (
          <p className="error_message">{errors.birthday.message}</p>
        )}
        <label>住所</label>
        <input
          type="text"
          {...register("address", {
            required: "住所は必須入力です",
          })}
        />
        {errors.address && (
          <p className="error_message">{errors.address.message}</p>
        )}
        <br></br>
        <button type="submit">登録</button>
      </form>
    </div>
  );
};
