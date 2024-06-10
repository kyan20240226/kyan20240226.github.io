window.gLocalAssetContainer["gConst"] = function(g) { (function(exports, require, module, __filename, __dirname) {
// font000: 通常用縁なし
//  黒100
const font000 = new g.DynamicFont({
  game: g.game, 
  fontFamily: "sans-serif",
  fontWeight: "bold",
  size: 100,
  fontColor: "black",
});
// font001: タイトル用
//  白50/黒10
const font001 = new g.DynamicFont({
  game: g.game, 
  fontFamily: "sans-serif",
  fontWeight: "bold",
  size: 50,
  fontColor: "white",
  strokeWidth: 10,
  strokeColor: "black",
});
// font002: タイトル説明用
//  黒50/城10
const font002 = new g.DynamicFont({
  game: g.game, 
  fontFamily: "sans-serif",
  fontWeight: "bold",
  size: 50,
  fontColor: "black",
  strokeWidth: 10,
  strokeColor: "white",
});
// font003: カウントダウン用用
//  橙80/白10
const font003 = new g.DynamicFont({
  game: g.game, 
  fontFamily: "sans-serif",
  fontWeight: "bold",
  size: 120,
  fontColor: "lightyellow",
  strokeWidth: 20,
  strokeColor: "gray",
});


module.exports = {

  // ～～ゲーム用（個別）～～

  // ゲームコントロール
  ctrl: {
  },

  // レイアウト
  layout: {
    base_x: 40,
    base_y: 165,
    card_x: 72,
    card_y: 101,
    num: 105, // カードにおける数字位置の高さ
    interval: 8,
    closed_height: 10,
    opened_height: 50,
    opened_height_min: 24, // 最低限維持する幅
    succes_point_x: 480, //
    succes_point_y: 270+50, //
  },
  // カード関係
  card: {
    srcX1: 1,
    srcX2: 147,
    srcY: 1,
    base_x: {},
    line_x: {}, // 移動させるときに対象の場を仕切るx座標
    width: 144,
    height: 202, 
  },
  // ゲームコントロール関係
  ctrl: {
    speed: {
      move: 6, // カード移動に必要なフレーム数
    },
    draw: 5, // 連続ドロー制御のフレーム数(0なら実質制御なし)
    suit: 2, // 2:2色。1:1色。
    dbg_undo: 0, // バグ対応のundo制限を行うかどうか
  },








  // ～～全体共通～～

	// ローカルストレージを使うかどうか
  jud_localstorage: 0,

  // フォント定義
  font000: font000, // 黒100
  font001: font001, // 白50/黒10
  font002: font002, // 黒50/白10
  font003: font003, // 橙80/白10

  // テンプレ適宜追加分の利用フラグ
  use_add_log: 1,
  use_setting: 1,
  use_setting2: 0,
  use_mente: 0,
  use_title_anime: 1,
  use_help: 0,  // 0:なし, 1:一枚もの, 2:詳細(複数ページ)
  use_tips: 1,  
  use_news: 0,
  use_best: 0,

  // テンプレ利用パターン選択フラグ
  back: 2, // 0:なし, 1:台紙, 2:画像
  title: 1, // 0:なし, 1:ラベル, 2:画像

  // シーンの定義
  scene_title: 0,	// タイトル表示時間
  scene_ready: 1,	// タイトルから遷移後、ゲームがスタートするまでの時間
  scene_main: 2,	// ゲーム時間
  scene_losstime: 3, 	// タイムアップ後、ランキングの自動表示までの待ち時間（ゲーム処理完了後にカウント
  scene_after: 4,	// アツマールの場合はランキングの自動表示
  // 時間表示の設定：切り上げか切り捨てか
  time_round: 1, // 1:切り上げ, 0:切り捨て 
  // 時間の定義
  time_title: 8, 	// タイトルの時間
  time_ready: 4, //1/g.game.fps, //5, 	// 開始前の準備時間
  time_main: 180,	// ゲームの制限時間　★今作ではmain⇒losstimeの制御は行わず別ハンドラを準備する
  time_losstime: 60,	// 終了後のロスタイム
  // 設定ボタン関係の定義
  button_src_interval: 30,	// 設定ボタン画像ファイル内のボタン表示間隔
  // 全体管理パラメータ
  set_bgm: 0,		// ゲーム側でBGMを用意／公開している場合に１
  set_se: 1,		// ゲームがでSEを養子／後悔している場合は１
  bgm_button: 1,	// ＜値はダミー＞プレーヤーがBGMのオンオフを選択した結果。全シーンで共用する
  se_button: 1,  	// ＜値はダミー＞プレーヤーがSEのオンオフを選択した結果。全シーンで共用する。
  bgm01_volume_def: 0.3,	// BGM01ボリュームのプログラム内調整用
  se00_volume_def: 1,		// SE00ボリュームのプログラム内調整用
  bgm_volume: 5,	// BGMボリューム。
  se_volume: 5,		// SEボリューム
  bgm_start: 1, // main開始後、実際にBGMが開始する時間（秒単位）

  jud_rensyu: 0,	// ＜値はダミー＞通常モードが練習モードか選択した結果
  jud_restart: 0,	// ＜値はダミー＞タイトル画面に戻った際のフラグ

  // ヘルプ一枚ものを利用する場合の各種定数
  help1: {
    x: 820,
    y: 120,
    step_max: 15,
  },

  // ヘルプ詳細（複数ページ）を利用する場合の各種定数など
  help2: {
    page: 3,
    cut: [0,3,2,2],
    waite: [0,30,30,30],
    id: ["", 
      ["","help01-01","help01-02","help01-03"],
      ["","help02-01","help02-02"],
      ["","help03-01","help03-02"],
    ],    
  },

  // tips1情報の各種データ
  tips1: {
    step_max: 900,
    x: 0,
    y: 515,
    width: 100,
    number: 2,
    text: [
      "tips1-00(ダミー)",
      "キーボード対応　W:自動　A:戻る　D:配る", //"tips1-01",
      // "キーボード対応　W:自動　E:drag　A:戻る　D:配る", //"tips1-01",
      // "「戻る」はキーA、「配る」はキーDで実施できます", //"tips1-01",
      // "バグ発生/対応中により、undo機能を一時的に制限しています",
      "カードが多い列は、暗いカードをクリックで詳細表示できます", //"tips1-02",
      "さいころのロストが続いているときは、空いているいるところに１つずつゆっくりなげこんでみよう", //"tips1-02",
      "コンボを伸ばすために、投射を止めることも大事だぞ", //,
      "コンボはさいころを投げるとリセットされてしまうぞ", //,
    ],
    len: 1500, // メッセージの最大長さの想定
    time: 15, // 画面内に文字が存在する時間(全体ではなく１文字で)
    times: [
      , // 表示時間
      5,4,3,2,10, 10,10,10,10,10,
    ],
    max: [
      , // 表示回数上限
      1000,1000,1000,1000,1000, 20,20,3,3,3,
    ],
    width: [
      , // 表示時の台紙サイズ
      700,800,700,800,700, 700,800,100,100,100,
    ],  
  },

  // tips2情報の各種データ
  tips2: {
    // x: 0,
    // y: 180,
    width: 900,
    number: 1,
    text: [
      "tips2-00(ダミー)",
      "tips2-01",
    ],
  },

  // 更新情報の各種データ
  news: {
    number: 2,
    date: [
      [,,,],
      [2023, 5, 1, 1],
      [2023, 10, 19, 1],
    ],
    id: [
      "ダミーデータ",
      "2023/5/1(0.0.0.0)",
      "2023/10/19(0.0.0.1)",
    ],
    msg1: [
      "ダミーデータ",
      "～を更新しました１。",
      "～を更新しました２。",
    ],
    msg2: [
      "ダミーデータ",
      "（※～～１）",
      "（※～～２）",
    ],
  },


};


})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}