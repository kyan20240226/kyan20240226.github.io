window.gLocalAssetContainer["gEntity"] = function(g) { (function(exports, require, module, __filename, __dirname) {
// ＝＝＝＝個別＝＝＝＝


// ＜ローカル＞時間表記
module.exports.gLabel_time = function(scene, gConst, font, text) {
  return new g.Label({
    scene: scene,
    local: true,
    text: ""+text,
    font: font,
    fontSize: 30,
    x: 820, //50,
    y: 20,
    // anchorX: 1,
    // touchable: true,
    hidden: true,
  });
};





// タイトル画面の案内メッセージ
module.exports.tLabel_guide_msg = function(scene, gConst, font, x, y, size, text) {
  return new g.Label({
    scene: scene,
    font: font,
    fontSize: size,
    text: ""+text,
    //textColor: "white",
    x: x,
    y: y,
  });
};

// 場のカード枠の画像
module.exports.gSprite_card_base = function(scene, gConst, i) {
  return new g.Sprite({
    scene: scene,
    src: scene.asset.getImageById("base"),
    x: gConst.card.base_x[i],
    y: gConst.layout.base_y,
    scaleX: 0.5,
    scaleY: 0.5,
    anchorX: 0.5,
    anchorY: 1,
    // hidden: true,
  });
};

// カード画像
module.exports.gSprite_card = function(scene, gConst, i) {
  let suit=0; // 0:スペード, 1:ハート
  if      (gConst.ctrl.suit == 2 && i > 52) { suit = 1 }
  else if (gConst.ctrl.suit == 4 && i > 78) { suit = 3 }
  else if (gConst.ctrl.suit == 4 && i > 52) { suit = 2 }
  else if (gConst.ctrl.suit == 4 && i > 26) { suit = 1 }
  
  let src="";
  if      (suit == 0 && i%13 ==  0) { src = "s_king" }
  else if (suit == 0 && i%13 == 12) { src = "s_queen" }
  else if (suit == 0 && i%13 == 11) { src = "s_jack" }
  else if (suit == 0 )               { src = "s_normal" }
  else if (suit == 1 && i%13 ==  0) { src = "h_king" }
  else if (suit == 1 && i%13 == 12) { src = "h_queen" }
  else if (suit == 1 && i%13 == 11) { src = "h_jack" }
  else if (suit == 1)               { src = "h_normal" }
  else if (suit == 2 && i%13 ==  0) { src = "c_king" }
  else if (suit == 2 && i%13 == 12) { src = "c_queen" }
  else if (suit == 2 && i%13 == 11) { src = "c_jack" }
  else if (suit == 2)               { src = "c_normal" }
  else if (suit == 3 && i%13 ==  0) { src = "d_king" }
  else if (suit == 3 && i%13 == 12) { src = "d_queen" }
  else if (suit == 3 && i%13 == 11) { src = "d_jack" }
  else if (suit == 3)               { src = "d_normal" }
  return new g.Sprite({
    scene: scene,
    src: scene.asset.getImageById(src),
    srcX: gConst.card.srcX2,
    srcY: gConst.card.srcY,    
    width: gConst.card.width,
    height: gConst.card.height,    
    x: gConst.card.base_x[1+(i-1)%10], //仮設置
    y: gConst.layout.base_y+(Math.ceil(i/10)-1)*30, // 仮設置
    scaleX: 0.5,
    scaleY: 0.5,
    anchorX: 0.5,
    anchorY: 1,
    // hidden: true,
    touchable: true,
  });
};
// カード数字のラベル
module.exports.gLabel_card = function(scene, gConst, font, i) {
  let text=i%13;
  if      (text ==  0) { text = "K" }
  else if (text == 12) { text = "Q" }
  else if (text == 11) { text = "J" }
  else if (text ==  1) { text = "A" }
  else                 { text = ""+text }
  let textColor="black";
  if (gConst.ctrl.suit == 2 && i > 52) { textColor = "red" }
  return new g.Label({
    scene: scene,
    font: font,
    fontSize: 26,
    text: text,
    textColor: textColor,
    x: gConst.card.base_x[1+(i-1)%10], //仮設置
    y: gConst.layout.base_y+(Math.ceil(i/10)-1)*30-100, // 仮設置
    anchorX: 0.5,
    opacity: 0,
    // anchorY: 1,
  });
};
// カードフィルタの台紙
module.exports.gRect_card = function(scene, gConst, i) {
  return new g.FilledRect({
    scene: scene,
    cssColor: "gray",
    width: gConst.card.width,
    height: gConst.card.height,    
    x: gConst.card.base_x[1+(i-1)%10], //仮設置
    y: gConst.layout.base_y+(Math.ceil(i/10)-1)*30, // 仮設置
    scaleX: 0.5,
    scaleY: 0.5,
    anchorX: 0.5,
    anchorY: 1,
    opacity: 0,
    // touchable: true,
    // hidden: true,
  });
};

// ドローボタン用のラベル
module.exports.gSprite_button_draw = function(scene, gConst, font, text) {
  return new g.Label({
    scene: scene,
    font: font,
    fontSize: 32,
    text: ""+text,
    x: gConst.card.base_x[0] ,
    y: 360,
    anchorX: 0.5,
    touchable: true,
  });
};

// 戻る用のラベル
module.exports.gSprite_button_undo = function(scene, gConst, font, text) {
  return new g.Label({
    scene: scene,
    font: font,
    fontSize: 32,
    text: ""+text,
    x: gConst.card.base_x[0] ,
    y: 270,
    anchorX: 0.5,
    touchable: true,
  });
};

// 自動用のラベル
module.exports.gSprite_button_auto = function(scene, gConst, font, text) {
  return new g.Label({
    scene: scene,
    font: font,
    fontSize: 32,
    text: ""+text,
    x: gConst.card.base_x[0] ,
    y: 180, //120,
    anchorX: 0.5,
    touchable: true,
  });
};
// ドラッグ用のラベル
module.exports.gSprite_button_drag = function(scene, gConst, font, text) {
  return new g.Label({
    scene: scene,
    font: font,
    fontSize: 32,
    text: ""+text,
    x: gConst.card.base_x[0] ,
    y: 160,
    anchorX: 0.5,
    scaleX: 0.8,
    touchable: true,
  });
};

// デバッグ用データ出力ボタン１のラベル
module.exports.gSprite_button_output1 = function(scene, gConst, font, text) {
  return new g.Label({
    scene: scene,
    font: font,
    fontSize: 32,
    text: ""+text,
    x: gConst.card.base_x[0] ,
    y: 500,
    anchorX: 0.5,
    touchable: true,
  });
};
// クリア標示用のラベル
module.exports.gLabel_success = function(scene, gConst, font, text, n) {
  return new g.Label({
    scene: scene,
    text: text,
    font: font,
    fontSize: 50-20*n,
    x: g.game.width/2,
    y: g.game.height/2+50*n,
    // x: gConst.layout.base_x+0.5*gConst.mainfield.width,
    // y: gConst.layout.base_y+0.5*gConst.mainfield.height-100,
    anchorX: 0.5,
    anchorY: 0.5,
    hidden: true,
  });
};

// ライト表現
module.exports.gRect_light = function(scene, gConst) {
  return new g.FilledRect({
    scene: scene,
    cssColor: "yellow",
    width: g.game.width,
    height: g.game.height,
    opacity: 0,
  });
};

// 成功セット数標示ヘッダ用の画像
module.exports.gSprite_succes = function(scene, gConst, suit) {
  let src="succes_s";
  if (suit == 1) { src="succes_h" }
  if (suit == 2) { src="succes_c" }
  if (suit == 3) { src="succes_d" }
  return new g.Sprite({
    scene: scene,
    src: scene.asset.getImageById(src),
    x: 730-suit*70,
    y: 20,
    scaleX: 0.2,
    scaleY: 0.2,
    // anchorX: 0.5,
    // anchorY: 1,
    // hidden: true,
  });
};

// 成功セット数標示用のラベル
module.exports.gLabel_success_cnt = function(scene, gConst, font, suit, text) {
  let textColor = "black";
  if (suit == 1) { textColor = "red" }
  if (suit == 2) { textColor = "#2A8BB8" }
  if (suit == 3) { textColor = "#A8A000" }
  return new g.Label({
    scene: scene,
    text: ""+text,
    textColor: textColor,
    font: font,
    fontSize: 24,
    x: 768-suit*70,
    y: 24,
    // x: gConst.layout.base_x+0.5*gConst.mainfield.width,
    // y: gConst.layout.base_y+0.5*gConst.mainfield.height-100,
    // hidden: true,
  });
};

// 詳細確認時フィルタの台紙
module.exports.gRect_filter = function(scene, gConst) {
  return new g.FilledRect({
    scene: scene,
    cssColor: "gray",
    width: g.game.width,
    height: g.game.height,
    opacity: 0.8,
    hidden: true,
    touchable: true,
  });
};








// ＝＝＝＝テンプレ＝＝＝＝

// ～～レイアウト用パラメータ～～
const dbg_msg_color = "black"; 	// デバッグメッセージの色
const button_x = 10;		// ヘルプボタン等の右端側の空きスペース
const button_y = 25;		// ヘルプボタン等の上部側の空きスペース
const button_interval = 32;	// ヘルプボタン等の縦並びの間隔
const guide_x = 10;		// ガイド画面の基点x座標
const guide_y = 20;		// ガイド画面の基点y座標
const guide_width = 300;	// ガイド画像の横幅
const guide_height = 270;	// ガイド画像の高さ
const guide_space = 2;		// ガイド画像とガイド操作ボタンウインドウのあいだのスペース幅
const window_height = 28;	// ガイド操作ボタンウインドウの高さ
const window_width = 60;	// ガイド操作ボタンウインドウの各ウインドウの横幅
const window_interval = 5;	// ガイド操作ボタンウインドウの各ウインドウの横幅


// ～～共通～～

// ■デバッグメッセージ表示領域の作成
module.exports.sLabel_debug_msg = function(scene, font) {
  return new g.Label({
      scene: scene,
      text: "debug: 1234567890",
      font: font,
      fontSize: 20,
      textColor: "black", // gConst.dbg_msg_color,
      y: g.game.height,
      anchorY: 1,
  });
};
// ■ログ表示用台紙
module.exports.sRect_log = function(scene) {
  return new g.FilledRect({
    scene: scene,
    local: true,
    cssColor: "#FFFFFF",
    width: 900,
    height: 520,
    // x: 30,
    // y: 30,
    touchable: true,
    // hidden: true,
  });
};
// ■ログレコード表示用ラベル（単体）
module.exports.sLabel_log = function(scene, font, i) {
  return new g.Label({
    scene: scene,
    local: true,
    text: "<"+i+">", // サンプル表示
    font: font,
    fontSize: 12,
    textColor: "black",
    x: 20,
    // y: 50+16*(i%30),
    y: 20+16*i,
    // hidden: true,
  });
};
// ■設定ボタン用画像２（座標直接指定版）
module.exports.sSprite_button_setting2 = function(scene, gConst, a, b, x, y) {
  return new g.Sprite({
    scene: scene,
    local: true,
    src: scene.asset.getImageById("button_setting"),
    width: 27,
    height: 27,
    srcX: 1+a*30,
    srcY: 1+b*30,
    // とりあえず画面の中心に表示
    x: x,
    y: y,
    anchorX: 0.5,
    anchorY: 0.5,
    // hidden: true,
    touchable: true,
  });
};
// ☆メンテ中スクリーン
module.exports.sRect_mente = function(scene) {
  return new g.FilledRect({
    scene: scene,
    cssColor: "gray",
    width: g.game.width,
    height: g.game.height,
    opacity: 0.5,
    touchable: true,
  });
};
// ☆メンテ中メッセージ
module.exports.sLabel_mente = function(scene, font, text) {
  return new g.Label({
    scene: scene,
    x: g.game.width/2,
    y: g.game.height/2,
    text: ""+text,
    font: font,
    fontSize: 20,
    anchorX: 0.5,
    anchorY: 1,
    touchable: true,
  });
};
// ■ニコ生時の自己べ用ラベル
module.exports.sLabel_best = function(scene, font, text) {
  return new g.Label({
    scene: scene,
    x: 440,
    // y: 50,
    text: ""+text,
    font: font,
    fontSize: 15,
    // anchorX: 0.5,
    // anchorY: 1,
    // hidden: 1,
  });
};
// □TIPS画像
module.exports.sSprite_tips = function(scene, gConst) {
  return new g.Sprite({
    scene: scene,
    src: scene.asset.getImageById("tips"),
    x: gConst.tips1.x,
    y: gConst.tips1.y,
    scaleX: 0.25,
    scaleY: 0.25,
    anchorY: 0.5,
    hidden: true,
  });
};
// □TIPS台紙
module.exports.sRect_tips = function(scene, gConst) {
  return new g.FilledRect({
    scene: scene,
    cssColor: "snow",
    width: 100,
    height: 40,
    x: gConst.tips1.x,
    y: gConst.tips1.y,
    anchorY: 0.5,
    hidden: true,
  });
};
// □TIPSラベル
module.exports.sLabel_tips = function(scene, gConst, font, text) {
  return new g.Label({
    scene: scene,
    text: ""+text,
    // textColor: "black",
    font: font,
    fontSize: 30,
    x: gConst.tips1.x+50,
    y: gConst.tips1.y,
    anchorY: 0.5,
    hidden: true,
  });
};
// ■背景画像
module.exports.sSprite_back = function(scene, extra) {
  let src="back";
  if (extra == 1) { src = "back2" }
  if (extra == 2) { src = "back3" }
  return new g.Sprite({
    scene: scene,
    src: scene.asset.getImageById(src),
  });
};
// ■ゲーム背景
module.exports.sRect_back = function(scene, gConst) {
  return new g.FilledRect({
    scene: scene,
    cssColor: "white",
    width: g.game.width,
    height: g.game.height,
  });
};
// ■バージョン表示用のラベル
module.exports.sLabel_version = function(scene, font, system) {
  return new g.Label({
    scene: scene,
    text: system.version,
    font: font,
    fontSize: 15,
    x: g.game.width,
    anchorX: 1,
  });
};
// ■残り時間表示用のラベル
module.exports.sLabel_last_time = function(scene, font, text) {
  return new g.Label({
    scene: scene,
    text: ""+text,
    font: font,
    // fontSize: 15,
    x: 810, 
    // y: 80,
    hidden: true,
  });
};
// ■設定ボタン用画像
//   a: 画像データの横位置
//   b: 画像データの縦位置
//   c: 描写場所の縦位置
module.exports.sSprite_button_setting = function(scene, gConst, a, b, c) {
  return new g.Sprite({
    scene: scene,
    src: scene.asset.getImageById("button_setting"),
    width: 27,
    height: 27,
    srcX: 1+a*30,
    srcY: 1+b*30,
    // とりあえず画面の中心に表示
    x: g.game.width-button_x,
    y: button_y+c*button_interval,
    anchorX: 1,
    // anchorY: 0.5,
    // hidden: true,
    touchable: true,
  });
};
// ■詳細設定用台紙
module.exports.sRect_setting_back = function(scene, gConst) {
  return new g.FilledRect({
    scene: scene,
    cssColor: "#EEEEEE",
    x: g.game.width/2,
    y: button_y,
    width: g.game.width/2,
    height: g.game.height-button_y,
    opacity: 0.9,
    touchable: true,
  });
};
// ■詳細設定項目・項目用ラベル
module.exports.sLabel_setting_text = function(scene, font, system, gConst, c, text) {
  return new g.Label({
    scene: scene,
    text: ""+text,
    font: font,
    fontSize: 25,
    textColor: "dimgray",
    x: g.game.width/2+10,
    y: button_y+c*button_interval,
  });
};
// ■詳細設定項目・設定値用ラベル
module.exports.sLabel_setting_value = function(scene, font, system, gConst, c, text) {
  return new g.Label({
    scene: scene,
    text: ""+text,
    font: font,
    fontSize: 25,
    textColor: "midnightblue",
    x: g.game.width/2+250,
    y: button_y+c*button_interval,
    anchorX: 1,
  });
};
// ■詳細設定項目・変更用ボタン
//   a: 0:↑, 1:↓, 2:→
//   b: 描写場所の横位置
//   c: 描写場所の縦位置
module.exports.sSprite_button_updown = function(scene, gConst, a, b, c) {
  return new g.Sprite({
    scene: scene,
    src: scene.asset.getImageById("button_setting"),
    width: 27,
    height: 27,
    srcX: 1+1*30,
    srcY: 1+(4+a)*30,
    x: g.game.width/2+250+15+(1-b)*button_interval,
    y: button_y+c*button_interval,
    // anchorY: 0.5,
    // hidden: true,
    touchable: true,
  });
};
// ヘルプ画像（一枚もの利用時）
module.exports.sSprite_help1 = function(scene) {
  return new g.Sprite({
    scene: scene,
    src: scene.asset.getImageById("help"),
    // width: 874, //948,
    // height: 482, //481,
    // srcX: 1,
    // srcY: 58,
    // x: 820,// 949, // タイトル時の初期位置は少しずらす
    // y: 150,// 58, // タイトル時の初期位置は少しずらす
    scaleX: 0.6,
    scaleY: 0.6,
    anchorX: 1,
    touchable: true,
  });
};
// ■ヘルプ画面2（詳細複数ページ利用時の単体分）
module.exports.sSprite_help2 = function(scene, help_id) {
  return new g.Sprite({
    scene: scene,
    src: scene.asset.getImageById(help_id),
    // width: 900,
    // x: 13,
    // y: 25,
    hidden : true,
    touchable: true,
  });
};
// ■ヘルプ画面のページ情報のラベル
module.exports.sLabel_help_page = function(scene, font, gConst) {
  return new g.Label({
    scene: scene,
    text: "page",
    font: font,
    fontSize: 15,
    x: 895,
    y: 95,
    anchorX: 1,
  });
};


// ～～タイトル～～

// ■タイトル背景
module.exports.tRect_back = function(scene, gConst) {
  return new g.FilledRect({
    scene: scene,
    cssColor: gConst.title_back_color,
    width: g.game.width,
    height: g.game.height,
  });
};
// ■タイトル画像
module.exports.tSprite_title = function(scene) {
  return new g.Sprite({
    scene: scene,
    src: scene.asset.getImageById("title"),
    x: 60,
    y: 30,
  });
};
// ■タイトルラベル
module.exports.tLabel_title = function(scene, font, gConst, text) {
  return new g.Label({
    scene: scene,
    text: text,
    font: font,
    x: 60, //280, //60,
    y: 30, //180, //30,
  });
};
// ■スキップボタン(スタートボタン)用画像
module.exports.tSprite_start = function(scene) {
  return new g.Sprite({
    scene: scene,
    src: scene.asset.getImageById("start"),
    x: 650, // g.game.width*3/4-25, // 
    y: 30,
    touchable: true, 
  });
};
// ■更新情報表示用ボタンの画像
module.exports.tSprite_button_new = function(scene) {
  return new g.Sprite({
    scene: scene,
    src: scene.asset.getImageById("button_new"), // ("button_title_guide"), // ("title_guide"),
    x: g.game.width/4+25, // 700, // 65,
    y: 300, // 120,
    // width: 401,
    // height: 251,
    anchorX: 0.5,
    anchorY: 0.5,    
    touchable: true,     
  });
};
// ■更新情報表示用ボタンのラベル
module.exports.tLabel_button_new = function(scene, font, gConst, text) {
  return new g.Label({
    scene: scene,
    text: text,
    textColor: "gray",
    font: font,
    fontSize: 20,
    x: g.game.width/4+25, // 700, // 65,
    y: 300, // 120,
    anchorX: 0.5,
    anchorY: 0.5,    
  });
};
// ■更新情報表示の台紙
module.exports.tRect_new = function(scene) {
  return new g.FilledRect({
    scene: scene,
    cssColor: "snow",
    width: 800,
    height: 95,
    x: 50,
    y: 180,
  });
};
// ■更新情報表示のラベル
module.exports.tLabel_new = function(scene, font, color, line, text) {
  return new g.Label({
    scene: scene,
    text: text,
    textColor: color,
    font: font,
    fontSize: 20,
    x: 60, // 65,
    y: 185+30*line, // 120,
  });
};
// ■更新情報表示切替の各種ボタン
//   a (0:>、1:<)
module.exports.tSprite_button_new_setting = function(scene, gConst, a) {
  return new g.Sprite({
    scene: scene,
    src: scene.asset.getImageById("button_setting"),
    width: 27,
    height: 27,
    srcX: 1+30*1,
    srcY: 1+30*(6+3*a),
    x: 400-a*35, // 850-a*35,
    y: 180,
    anchorX: 1,
    anchorY: 0.5,
    touchable: true,
  });
};


// ～～ゲーム～～

// ■ゲーム背景
module.exports.gRect_back = function(scene, gConst) {
  return new g.FilledRect({
    scene: scene,
    cssColor: gConst.game_back_color,
    width: g.game.width,
    height: g.game.height,
  });
};
// ■Readyカウントダウン用ラベル
module.exports.gLabel_ready_countdown = function(scene, gConst, font, text) {
  return new g.Label({
    scene: scene,
    text: text,
    font: font,
    x: g.game.width/2,
    y: g.game.height/2,
    // x: gConst.layout.base_x+0.5*gConst.mainfield.width,
    // y: gConst.layout.base_y+0.5*gConst.mainfield.height-100,
    anchorX: 0.5,
    anchorY: 0.5,
    hidden: true,
  });
};
// ■スコア文字のラベル
module.exports.gLabel_score_header = function(scene, font) {
  return new g.Label({
    scene: scene,
    text: "score",
    font: font,
    fontSize: 25,
    x: 20,
    y: 50,
    anchorY: 1,
  });
};
// ■スコアのラベル
module.exports.gLabel_score = function(scene, font) {
  return new g.Label({
    scene: scene,
    text: "0", // "123456",
    font: font,
    x: 320,
    y: 50,
    anchorX: 1,
    anchorY: 1,
  });
};
// ■スコアプラスのラベル
module.exports.gLabel_score_plus = function(scene, font) {
  return new g.Label({
    scene: scene,
    text: "",
    font: font,
    fontSize: 35,
    x: 340, // 320,
    y:  50, // 90,
    // anchorX: 1,
    anchorY: 1,
    // hidden: true,
  });
};
// ■コンボ（継続）数表示のラベル　⇒ゲーム・テンプレへ
module.exports.gLabel_combo = function(scene, gConst, font, text) {
  return new g.Label({
    scene: scene,
    text: "",
    font: font,
    fontSize: 35,
    // x: gConst.layout.base_x+0.5*gConst.mainfield.width,
    y: 58,
    anchorX: 0.5,
    // anchorY: 0.5,
    // hidden: true,
  });
};
// ■ラストカウントダウン用ゲーム背景
module.exports.gRect_back_countdown = function(scene) {
  return new g.FilledRect({
    scene: scene,
    cssColor: "red", // "orange",
    width: g.game.width,
    height: g.game.height,
    opacity: 0,
    hidden: true,
  });
};
// ■TimeUp用画像
module.exports.gSprite_timeup = function(scene, gConst) {
  return new g.Sprite({
    scene: scene,
    src: scene.asset.getImageById("timeup"),
    x: g.game.width/2,
    y: g.game.height/2,
    // x: gConst.layout.base_x+0.5*gConst.mainfield.width,
    // y: gConst.layout.base_y+0.5*gConst.mainfield.height,
    anchorX: 0.5,
    anchorY: 0.5,
    scaleX: 0, // 表示開始時点ではサイズは０にする
    scaleY: 0, // 表示開始時点ではサイズは０にする
    opacity: 0, // 表示開始時点では透明にする
    touchable: true, 
  });
};
// 終了表示用ラベル
module.exports.gLabel_end = function(scene, font, text) {
  return new g.Label({
    scene: scene,
    x: g.game.width/2,
    y: 400,
    text: ""+text,
    font: font,
    anchorX: 0.5,
    anchorY: 0.5,
    touchable: true,
    hidden: true,
  });
};
// 終了表示用スクリーン
module.exports.gRect_end = function(scene) {
  return new g.FilledRect({
    scene: scene,
    cssColor: "gray",
    width: g.game.width,
    height: g.game.height,
    opacity: 0.5,
    hidden: true,
  });
};


})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}