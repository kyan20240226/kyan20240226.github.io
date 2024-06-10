window.gLocalAssetContainer["system"] = function(g) { (function(exports, require, module, __filename, __dirname) {
module.exports = {
  // ゲームタイトル
  title: "テトラパズル",
  // バージョン情報
  version: "0.2.2.1",
  // プログラムレベル（0:通常, 1:ログ取得, 2:デバッグ)
  dbg: 0,
  test: 0,
  // 練習モード公開レベル (0:なし, 1:デバッグモードのみ公開, 2:デバッグモード・アツマール公開, 3:公開）
  rensyu: 3,
  // マルチ対応かどうか
  mult: 0,
  // エクストラモードか
  extra: 0,
  // エクストラモードの時のタイトル名
  title_extra: "かけざんタイルズ",
  title_extra2: "",

  // 公開モード
  open: 1,

  // データ作成モード
  mode: 0, // 0:通常, 1:データ作成モード

  // ゲームID (ローカルストレージをゲームごとに使用するための振り分け用
  //   user 　　　ゲーム製作者名     
  //   １桁目　　 ゲーム種別
  //      1:ランキング,2:マルチ
  //   ２～４桁目 ゲームID
  //      ※ローカルフォルダで振るIDをそのまま利用しよう
  //   ※エクストラモードフラグ(なしか'1'か）はプログラム内で追記される
  game: "kyan0047-",

};

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}