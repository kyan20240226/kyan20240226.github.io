window.gLocalAssetContainer["main"] = function(g) { (function(exports, require, module, __filename, __dirname) {
exports.main = void 0;

// ＝＝＝＝外部ファイル＝＝＝＝
// 全体のモード・情報など（外部ファイル
const system = require("./system");
  
// ゲーム用変数・関数等の宣言（外部ファイル
const gConst  = require("./gConst");   // 定数用
const gEntity = require("./gEntity");  // エンティティ用（画像とかラベルとか
const gFunc   = require("./gFunc");    // 関数用


// main関数
function main(param) {
  g.game.pushScene(createScene1(param));
}


// createScene関数
function createScene1(param) {
  // 同配牌モード
  const random = param.random;

  // シーンの宣言
  var scene1 = new g.Scene({
    game: g.game,
    assetIds: [
      // ＝＝テンプレ＝＝
      
      "button_setting", // 設定ボタン用
      "back", "back2",// 背景画像用
      "title","start","timeup", //
      // "help",
      "tips",
      "button_new",
      // "BGM01",
      "SE00","SE01","SE02","SE03","SE04","SE05","SE06",
      // ＝＝ゲーム個別＝＝
      "block","block2","player","object","stick",

      "block1","num1","select","button_line","button_all",
      "help01-01","help02-01","help03-01","help04-01","help05-01",
      "SE11",
    ]
  });

  // シーンのオンロード
  scene1.onLoad.add(function () {

    

    // 送信用スコアに初期値0を設定
    g.game.vars.gameState = { score: 0 };

    // シーン１にレイヤーを追加する
    const layer = gFunc.set_layer(scene1, gConst);
    // リスタートで戻ってきている場合はS1をhideする
    if (gConst.jud_restart == 2) { layer.S[1].hide() }

    // エクストラモードの判定
    if (system.extra == 1) { system.game = system.game+"1-" }

    // ＝＝デバッグ用メッセージ＝＝
    // デバッグメッセージのラベル
    const sLabel_debug_msg = gEntity.sLabel_debug_msg(scene1, gConst.font000);
    if (system.dbg == 2) { layer.L[5].append(sLabel_debug_msg) }
    gFunc.dbg_message(sLabel_debug_msg, "デバッグメッセージ  "+g.game.selfId, 0, system.dbg);


    // ＝＝デバッグ用ログデータ一式の変数宣言＝＝
    if (system.dbg >= 0) { // 折り畳み用
      var log = {}; // 各ログごとの管理変数グループ
      // log[0]にはログ全体の情報および表示中の情報をセット
      log[0] = {
        max: 3, // 用意するログ分類の数
        id: 0,  // 表示中のログ分類のID
        page: 0,  // 表示中のログのページNo
      }
      // log[1]以降には各ログの保存状態
      for (let log_no=1; log_no<=log[0].max; log_no++) {
        log[log_no] = {
          count: 0, // 記録したログの件数
          text: {}, // 記録したログの内容
        }
      }
      // ★★ログデータ作成テスト★★
      for (let log_no=1; log_no<=log[0].max; log_no++) {
        gFunc.add_log(log[log_no].text, log[log_no].count++, g.game.age, "ログ"+log_no+"取得開始", system.dbg);
        for (let i=0; i<=100; i++) {
          // gFunc.add_log(log[log_no].text, log[log_no].count++, g.game.age, ""+log_no+":"+i, system.dbg);
        }
      }    
    }

    // ＝＝ローカルストレージ関係＝＝
    if (system.dbg >= 0) { // 折り畳み用
      // ローカルストレージを利用するか／利用できるかの確認
      if (gConst.jud_localstorage == 1 && navigator.cookieEnabled == false) { 
        gConst.jud_localstorage = 0;
      }
      try {
        localStorage;
      } catch (err) {
        gConst.jud_localstorage = 0
      }  

      // ローカルストレージの準備
      var localstorage_data = {
        ver: 1,
        best: 0,
        bgm_volume: 0,
        se_volume: 0,
        status_layout_color: 0,
        bgm_button: 0,
        se_button: 0,
        bgm_volume: 0,
        tips1_cnt: {},
        check_news: {},
        // 以降ゲーム用の個別追加
      }
      gFunc.add_log(log[1].text, log[1].count++, g.game.age, "ローカルストレージ定義 ver: "+localstorage_data.ver, system.dbg);

      // localstorageから各種設定値を取得する
      if (gConst.jud_localstorage == 1) {
        // 一度ローカルストレージを利用している場合は置き換える(※バージョンが古い時は破棄)
        if (localStorage.getItem(system.game)) {
          let data = JSON.parse(localStorage.getItem(system.game));
          gFunc.add_log(log[1].text, log[1].count++, g.game.age, "取得データ ver: "+data.ver, system.dbg);
          if (data.ver == localstorage_data.ver) { localstorage_data = data }
        }
      }
      // localstorage_data.tips1_cnt[1] = 1;
      gFunc.add_log(log[1].text, log[1].count++, g.game.age, "データ ver: "+localstorage_data.ver, system.dbg);
    }

    // ＝＝BGM・SE関係＝＝
    if (system.dbg >= 0) { // 折り畳み用
      // 通常のときはBGMを利用しない
      if (system.extra == 0) { gConst.set_bgm = 0 }

      // localstorageから各種設定値を取得する
      if (gConst.jud_localstorage == 1) {
        // ローカルストレージの値を利用する場合
        if (localstorage_data.bgm_volume >= 1) { gConst.bgm_volume = localstorage_data.bgm_volume }
        if (localstorage_data.se_volume >= 1) { gConst.se_volume = localstorage_data.se_volume }
        if (localstorage_data.bgm_button >= 1) { gConst.bgm_button = localstorage_data.bgm_button }
        else                                   { gConst.bgm_button = gConst.set_bgm }
        if (localstorage_data.se_button >= 1) { gConst.se_button = localstorage_data.se_button }
        else                                  { gConst.se_button = gConst.set_se }
        gFunc.add_log(log[1].text, log[1].count++, g.game.age, "get  localstorage_get.bgm_volume:"+localstorage_data.bgm_volume, system.dbg);
        gFunc.add_log(log[1].text, log[1].count++, g.game.age, "get  localstorage_get.se_volume:"+localstorage_data.se_volume, system.dbg);
        gFunc.add_log(log[1].text, log[1].count++, g.game.age, "get  localstorage_get.bgm_button:"+localstorage_data.bgm_button, system.dbg);
        gFunc.add_log(log[1].text, log[1].count++, g.game.age, "get  localstorage_get.se_button:"+localstorage_data.se_button, system.dbg);
      }  

      // 使用するBGM/SEの定義
      // var bgm01 = scene1.asset.getAudioById("BGM01"); //
      var se00 = scene1.asset.getAudioById("SE00"); // 開始時カウントダウン
      var se01 = scene1.asset.getAudioById("SE01"); //
      var se02 = scene1.asset.getAudioById("SE02"); //
      var se03 = scene1.asset.getAudioById("SE03"); //
      var se04 = scene1.asset.getAudioById("SE04"); //
      var se05 = scene1.asset.getAudioById("SE05"); //
      var se06 = scene1.asset.getAudioById("SE06"); //
      var se11 = scene1.asset.getAudioById("SE11"); //
      // var se07 = scene1.asset.getAudioById("SE07"); // タイトル⇒ゲーム時

      // BGM/SE関係の変数宣言
      var set_bgm = gConst.set_bgm;	
      var set_se = gConst.set_se;	
      var bgm_count = 0;
      var jud_bgm = 0;		

      // 全体音量の初期化
      if (gConst.set_bgm == 1) { g.game.audio.music.volume = gConst.bgm_volume/10 }
      else                     { g.game.audio.music.volume = 0 }
      if (gConst.set_se == 1) { g.game.audio.sound.volume = gConst.se_volume/10 }
      else                    { g.game.audio.sound.volume = 0 }        
    }

    // ＝＝システム共通＝＝
    if (system.dbg >= 0) { // 折り畳み用
      // 変数宣言
      var scene_status = gConst.scene_title;  // シーンステータス。初期値は「タイトル」
      if (system.test > 0) { scene_status = -1 }  // test>=1:メンテ中が有効のときはカウントダウンしないstatusで開始
      var last_time = gConst.time_title*g.game.fps;	// シーンステータスのカウントダウン。初期値は「タイトル」の時間

      // バージョン情報のラベル
      var sLabel_version = gEntity.sLabel_version(scene1, gConst.font001, system);
      layer.L[4].append(sLabel_version);

      // 残り時間のラベル
      var sLabel_last_time = gEntity.sLabel_last_time(scene1, gConst.font001, "");
      layer.L[4].append(sLabel_last_time);
      
      // 背景のエンティティ
      if (gConst.back == 1) {
        var sRect_back = gEntity.sRect_back(scene1);
        layer.L[1].append(sRect_back);
      }
      // 背景の画像
      if (gConst.back == 2) {
        var sSprite_back = gEntity.sSprite_back(scene1, system.extra);
        layer.L[1].append(sSprite_back);
      }
    }

    // ＝＝タイトル関係＝＝
    if (system.dbg >= 0) { // 折り畳み用
      // タイトルのラベル
      let title=system.title;
      if (system.extra == 1) { title = system.title_extra }
      var tLabel_title = gEntity.tLabel_title(scene1, gConst.font001, gConst, title);
      layer.S1[2].append(tLabel_title);
      // タイトルの画像
      if (gConst.title == 2) {
        var tLabel_title = gEntity.tLabel_title(scene1, gConst.font001, gConst, system.title);
        layer.S1[2].append(tLabel_title);
      }

      // skipボタン(旧スタートボタン)用画像
      var tSprite_start = gEntity.tSprite_start(scene1, gConst);
      layer.S1[3].append(tSprite_start);  
      // skipボタンをクリックしたとき
      tSprite_start.onPointUp.add(ev => {    // (ev => {       (() => {
        gFunc.add_log(log[1].text, log[1].count++, g.game.age, "ユーザID "+ev.player.id, system.dbg);
        last_time = 0; // 待ち時間を強制的に0にしているだけ
      });

      // 説明メッセージ用ラベル
      var tLabel_guide_msg1 = gEntity.tLabel_guide_msg(scene1, gConst, gConst.font002, 200, 330, 24, "内側の隣り合う数字が同じになるように並べ変えてください。");
      layer.S1[3].append(tLabel_guide_msg1);
      var tLabel_guide_msg2 = gEntity.tLabel_guide_msg(scene1, gConst, gConst.font002, 150, 330, 28, "");
      layer.S1[3].append(tLabel_guide_msg2);
      var tLabel_guide_msg3 = gEntity.tLabel_guide_msg(scene1, gConst, gConst.font002, 150, 380, 28, "");
      layer.S1[3].append(tLabel_guide_msg3);
      var tLabel_guide_msg4 = gEntity.tLabel_guide_msg(scene1, gConst, gConst.font002, 150, 430, 28, "");
      layer.S1[3].append(tLabel_guide_msg4);      

      // エクストラで説明を変更する場合に使用　※すべりでは不要と思われる
      if (system.extra == 1) { 
        tLabel_guide_msg1.text = "";
        tLabel_guide_msg2.text = "消すことができるルールは通常カラタイと同じです。";
        tLabel_guide_msg3.text = "得点は、消えるタイルの数字の掛け算になります。";
        tLabel_guide_msg4.text = "失敗は減点で、少しずつ大きくなります。";
        tLabel_guide_msg1.invalidate();
        tLabel_guide_msg2.invalidate();
        tLabel_guide_msg3.invalidate();
        tLabel_guide_msg4.invalidate();
        // gConst.ctrl.suit = 1;
      }

    }


    // ～～～～ゲーム関連～～～～

    // ＝＝変数宣言＝＝
    if (system.dbg >= 0) { // 折り畳み用
      // エクストラ時に定数を強制修正する場合
      if (system.extra == 1) {
        // ゲーム時間を60に
        gConst.time_main = 90;
        // さいころサイズ
        gConst.size.block *= gConst.floor.max_col/gConst.floor.max_col2;
        // 盤面サイズ
        gConst.floor.max_col = gConst.floor.max_col2;
        gConst.floor.max_raw = gConst.floor.max_raw2;
        /*
        // 初期配置個数と内容
        gConst.block.init.num = gConst.block.init.num2;
        gConst.block.init.num_sum = gConst.block.init.num_sum2;
        // 最大サイコロの目
        gConst.block.max = gConst.block.max2;
        // さいころの移動速度
        gConst.block.speed = gConst.block.speed2;
        // ヘルプページ
        gConst.help2.page = 5;
        */
      }
      // 二次定数の生成処理（個別）
      gFunc.set_const(gConst); // 必要ならば
      // ★★デバッグ★★ 二次定数等の計算結果の表示
      // gFunc.add_log(log[1].text, log[1].count++, g.game.age, "base_x: "+gConst.layout.base_x, system.dbg);

      // 各種変数
      var jud_action = 0;
      var jud_success = 0;	// 成功演出フラグ

      // ワーク変数
      if (system.dbg >= 0) { // 折り畳み用
        var a;  var b;  var c;
        var a1; var b1;
        var x;  var y;  var z;
      }


  
    }

    // ＝＝スコア関係＝＝
    if (system.dbg >= 0) { // 折り畳み用
      var score = 0;
      var score_plus = 0;
      var score_plus_step = 0; // 表示管理用
      var score_plus_clear = 0;
      var combo = 0;

      // スコア文字のラベル
      var gLabel_score_header = gEntity.gLabel_score_header(scene1, gConst.font001);
      layer.S2[40].append(gLabel_score_header);
      // スコアのラベル
      var gLabel_score = gEntity.gLabel_score(scene1, gConst.font001);
      layer.S2[40].append(gLabel_score);
      // スコアプラスのラベル
      var gLabel_score_plus = gEntity.gLabel_score_plus(scene1, gConst.font001);
      layer.S2[40].append(gLabel_score_plus);

      // コンボ数表示のラベル
      var gLabel_combo = gEntity.gLabel_combo(scene1, gConst, gConst.font001, "0 combo");
      layer.S2[40].append(gLabel_combo);
    }

    // ＝＝表示／開始／終了／メッセージ関係＝＝
    if (system.dbg >= 0) { // 折り畳み用
      var jud_finish = 0;
      var finish_step = 0;
      var timeup_step = 0;
      var losstime_cnt = 0;

      // ready時のスクリーン
      var gRect_ready_screen = gEntity.gRect_ready_screen(scene1, gConst);
      if (gConst.use_ready_screen == 1) layer.S2[40].append(gRect_ready_screen);

      // Readyカウントダウン用ラベル
      var gLabel_ready_countdown = gEntity.gLabel_ready_countdown(scene1, gConst, gConst.font003, "3");
      layer.S2[40].append(gLabel_ready_countdown);

      // クリア用ラベル
      var gLabel_success1 = gEntity.gLabel_success(scene1, gConst, gConst.font003, "", 0);
      layer.S2[40].append(gLabel_success1);
      var gLabel_success2 = gEntity.gLabel_success(scene1, gConst, gConst.font003, "", 1);
      layer.S2[40].append(gLabel_success2);

      // 終了のラベル(timeup前の全消し用)
      var gLabel_end = gEntity.gLabel_end(scene1, gConst.font001, "終了");
      layer.S2[40].append(gLabel_end);
      // 終了メッセージをクリックしたとき
      gLabel_end.onPointUp.add(ev => {
        if (finish_step <= 0) {
          gLabel_end.hide();
        }    
      });

      // ラストカウントダウン用ゲーム背景
      var gRect_back_countdown = gEntity.gRect_back_countdown(scene1);
      layer.S2[10].append(gRect_back_countdown);

      // TimeUp用画像
      var gSprite_timeup = gEntity.gSprite_timeup(scene1, gConst);
      layer.S2[40].append(gSprite_timeup);
      // TimeUp用画像をクリックしたとき
      gSprite_timeup.onPointUp.add(ev => {
        if (timeup_step <= 0) {
          gSprite_timeup.hide();
        }    
      });
    }

    // ＝＝＝＝花吹雪用＝＝＝＝
    if (gConst.use_kamifubuki == 1) {
      var kamifubuki = {
        jud: 0,
        step: 0,
      }
      var kamifubukiList = {}
      for (let i=1; i<=gConst.kamifubuki.number; i++) {
        kamifubukiList[i] = {
          scale: 0.1*(1+(7*i)%10),
          angle: (30*i)%360,
          x: (g.game.width-gConst.kamifubuki.posi_width)/2+gConst.kamifubuki.posi_x*i%gConst.kamifubuki.posi_width,
          y: gConst.kamifubuki.posi_y*i%gConst.kamifubuki.posi_height,
        }
      }
      // 紙吹雪の台紙の準備
      var gRect_kamifubukiList = {};
      for (let i=1; i<=gConst.kamifubuki.number; i++) {
        const gRect_kamifubuki = { entity: gEntity.gRect_kamifubuki(scene1, gConst, i, kamifubukiList[i]) }
        gRect_kamifubukiList[i] = gRect_kamifubuki;
        layer.S2[30].append(gRect_kamifubukiList[i].entity);
      }
    }



    // ～～～～ゲーム個別～～～～


    // ＝＝管理＝＝
    if (system.dbg >= 0) { // 折り畳み用
      // ゲーム全体管理
      var ctrl = {
        mode_click: 0, // クリックモード 0:up, 1:down
        status: 0, // ゲーム管理用ステータス
        level: 1,
        max_col: 0, // 現在のステージにおけるブロック横幅数
        max_raw: 0, // 現在のステージにおけるブロック縦幅数
        fail_cnt: 0, // 失敗操作のカウント（減点率に影響）
        success: 0,
        point: 0, // 消した数のかうんと
        change: 0, // 表示切替ボタン
        step: 0, // 待ち時間などで使用
        auto_levelup: 1, // クリア時にオートで大きくするかどうか
      }
      // 現在のステージ設定
      var stage = { 
        no: 0,
        col: 0,
        raw: 0,
        step: 0, // ステージクリアアニメーション
        score: 0, // そのステージ開始時点のスコア
      }
      // エクストラモードのときはタイル絵はパターン２（数字だけ）固定
      // if (system.extra == 1)  ctrl.change = 2;
    }


    // ＝＝タイトルのモード選択など＝＝
    if (system.dbg >= 0) { // 折り畳み用
      // クリックdown選択ボタン
      var tLabel_click_up = gEntity.tLabel_click(scene1, gConst, gConst.font001, "クリックup", 0);
      // layer.S1[3].append(tLabel_click_up);
      // クリックdown選択ボタン
      var tLabel_click_down = gEntity.tLabel_click(scene1, gConst, gConst.font001, "クリックdown", 1);
      // layer.S1[3].append(tLabel_click_down);

      // クリックモードの選択結果
      var select_click_mode = function(mode_click) {
        gFunc.add_log(log[1].text, log[1].count++, g.game.age, "クリックモードの指定:"+mode_click, system.dbg);
        ctrl.mode_click = mode_click;
        if (mode_click == 1) {
          tLabel_click_up.opacity = 0.3;
          tLabel_click_down.opacity = 1;
        } else {
          tLabel_click_up.opacity = 1;
          tLabel_click_down.opacity = 0.3;
        }
      }
      // クリックモードの初期状態をセット
      select_click_mode(ctrl.mode_click);

      // クリックモードのボタンをクリックしたとき
      tLabel_click_up.onPointDown.add(ev => {
        select_click_mode(0);
      });
      tLabel_click_down.onPointDown.add(ev => {
        select_click_mode(1);
      });
    }

    // ＝＝レイアウト全般＝＝
    if (system.dbg >= 0) { // 折り畳み用
      // メインフィールドの台紙・ブロックの台紙・ブロックの画像・数字の画像
      var gRect_field1List = {}  // フィールド左の台紙
      var gRect_field2List = {}  // フィールド⇒の台紙
      var gRect_blockList = {}   // ブロックの台紙
      var gSprite_block1List = {} // ブロックの画像
      var gSprite_block2List = {} // ブロックの画像
      var gSprite_block3List = {} // ブロックの画像
      var gSprite_block4List = {} // ブロックの画像
      var gSprite_num1List = {}   // 数字の画像
      var gSprite_num2List = {}   // 数字の画像
      var gSprite_num3List = {}   // 数字の画像
      var gSprite_num4List = {}   // 数字の画像
      var gSprite_button_line1List = {}  // line選択ボタン(col選択)の画像
      var gSprite_button_line2List = {}  // line選択ボタン(raw選択)の画像
      let cnt=0; // 各ブロックの仮の数値用
      var cnt_n = function() { 
        cnt = (cnt+1)%10;
        return cnt;
      }
      for (let c=1; c<=gConst.floor.max_col; c++) {
        const gSprite_button_line1 = { entity: gEntity.gSprite_button_line(scene1, gConst, 1) }
        gSprite_button_line1List[c] = gSprite_button_line1;
        layer.S2[20].append(gSprite_button_line1List[c].entity); 
      }
      for (let r=1; r<=gConst.floor.max_raw; r++) {
        const gSprite_button_line2 = { entity: gEntity.gSprite_button_line(scene1, gConst, 0) }
        gSprite_button_line2List[r] = gSprite_button_line2;
        layer.S2[20].append(gSprite_button_line2List[r].entity); 
      }
      for (let col=1; col<=gConst.floor.max_col; col++) {
        for (let raw=1; raw<=gConst.floor.max_raw; raw++) {
          let ind=(raw-1)*gConst.floor.max_col+col;
          // フィールド左右の台紙
          const gRect_field1 = { entity: gEntity.gRect_field(scene1, gConst, (col+raw)%2, ind, 1) }
          gRect_field1List[ind] = gRect_field1;
          layer.S2[20].append(gRect_field1List[ind].entity); 
          const gRect_field2 = { entity: gEntity.gRect_field(scene1, gConst, (col+raw)%2, ind, 2) }
          gRect_field2List[ind] = gRect_field2;
          layer.S2[20].append(gRect_field2List[ind].entity); 
          // ブロックの台紙
          const gRect_block = { entity: gEntity.gRect_block(scene1, gConst, ind) }
          gRect_blockList[ind] = gRect_block;
          layer.S2[20].append(gRect_blockList[ind].entity); 

          // ブロックの画像用の数字
          let num1=cnt_n();
          let num2=cnt_n();
          let num3=cnt_n();
          let num4=cnt_n();
          
          // ブロックの画像
          const gSprite_block1 = { entity: gEntity.gSprite_block(scene1, gConst, num1, ind, 1) }
          gSprite_block1List[ind] = gSprite_block1; 
          layer.S2[21].append(gSprite_block1List[ind].entity);   
          const gSprite_block2 = { entity: gEntity.gSprite_block(scene1, gConst, num2, ind, 2) }
          gSprite_block2List[ind] = gSprite_block2; 
          layer.S2[21].append(gSprite_block2List[ind].entity);   
          const gSprite_block3 = { entity: gEntity.gSprite_block(scene1, gConst, num3, ind, 3) }
          gSprite_block3List[ind] = gSprite_block3; 
          layer.S2[21].append(gSprite_block3List[ind].entity);   
          const gSprite_block4 = { entity: gEntity.gSprite_block(scene1, gConst, num4, ind, 4) }
          gSprite_block4List[ind] = gSprite_block4; 
          layer.S2[21].append(gSprite_block4List[ind].entity);   

          // ブロックの数字画像
          const gSprite_num1 = { entity: gEntity.gSprite_num(scene1, gConst, num1, ind, 1) }
          gSprite_num1List[ind] = gSprite_num1; 
          layer.S2[21].append(gSprite_num1List[ind].entity);   
          const gSprite_num2 = { entity: gEntity.gSprite_num(scene1, gConst, num2, ind, 2) }
          gSprite_num2List[ind] = gSprite_num2; 
          layer.S2[21].append(gSprite_num2List[ind].entity);   
          const gSprite_num3 = { entity: gEntity.gSprite_num(scene1, gConst, num3, ind, 3) }
          gSprite_num3List[ind] = gSprite_num3; 
          layer.S2[21].append(gSprite_num3List[ind].entity);   
          const gSprite_num4 = { entity: gEntity.gSprite_num(scene1, gConst, num4, ind, 4) }
          gSprite_num4List[ind] = gSprite_num4; 
          layer.S2[21].append(gSprite_num4List[ind].entity);   

        }
      }

      // all移動ボタンの画像
      var gSprite_button_all = gEntity.gSprite_button_all(scene1, gConst);
      layer.S2[20].append(gSprite_button_all); 

      // ゲーム中のガイドメッセージ用のラベル
      var gLabel_guide = gEntity.gLabel_guide(scene1, gConst, gConst.font002, "内側の隣り合う数字が同じになるように並べ変えてください。");
      layer.S2[30].append(gLabel_guide);

    }



    // ＝＝プレーヤー操作関係＝＝
    if (system.dbg >= 0) { // 折り畳み用
      // 未選択状態
      // 　クリックdown:  その位置を選択状態にする
      // 　長押し:        その位置にブロックが存在するとき、ブロックを初期位置に飛ばす
      // 選択状態
      //   クリックdown:  先の選択状態のブロックと入れ替えを実施する
      //
      // メイン操作のクリック情報管理
      var click = {
        cnt: 0, // イベント発生回数num
        current: 0, // 処理済みイベントnum 
        field: {}, // どっちのフィールドをクリックしたか
        col: {}, // クリックしたブロック
        raw: {}, // クリックしたブロック
        ope: {}, // 発生したイベントの種別
        // ind: 0, // クリックイベント実施時に、クリックしたブロックに存在するブロックのind
      }
      var select = {
        field: 0, // どっちのフィールドを選択したか
        col: 0, // 選択しているフィールド
        raw: 0, // 選択しているフィールド
        ind: 0, // 選択しているフィールドに存在しているブロックind
      }

      // 関数:クリックイベント情報を追加する
      var add_clickEvent = function(field, col, raw, ope) {
        // main意外ではreturnする
        if (scene_status != gConst.scene_main) return;
        // イベント件数のカウントアップ
        click.cnt += 1;
        // クリック情報を登録
        click.field[click.cnt] = field;
        click.col[click.cnt] = col;
        click.raw[click.cnt] = raw;
        click.ope[click.cnt] = ope;
        // イベント情報をログに追加
        gFunc.add_log(log[2].text, log[2].count++, g.game.age, "クリックイベント "+click.cnt+":   ("+click.field[click.cnt]+" / "+click.col[click.cnt]+" / "+click.raw[click.cnt]+" / "+click.ope[click.cnt]+")", system.dbg);
      }

      // フィールドをクリックしたとき
      for (let col=1; col<=gConst.floor.max_col; col++) {
        for (let raw=1; raw<=gConst.floor.max_raw; raw++) {
          let ind=(raw-1)*gConst.floor.max_col+col;
          // 左側(出題側)の場合
          gRect_field1List[ind].entity.onPointDown.add(ev => {
            add_clickEvent(1, col, raw, 1);
          });
          gRect_field1List[ind].entity.onPointUp.add(ev => {
            // add_clickEvent(1, col, raw, 2);
          });
          // 右側(回答側)の場合
          gRect_field2List[ind].entity.onPointDown.add(ev => {
            add_clickEvent(2, col, raw, 1);
          });
          gRect_field2List[ind].entity.onPointUp.add(ev => {
            // add_clickEvent(2, col, raw, 2);
          });
        }
      }

      // line選択ボタンを押したとき
      for (let c=1; c<=gConst.floor.max_col; c++) {
        gSprite_button_line1List[c].entity.onPointDown.add(ev => {
          add_clickEvent(3, c, 0, 1);
        });
        gSprite_button_line1List[c].entity.onPointUp.add(ev => {
          // add_clickEvent(0, c, 0, 2);
        });
      }
      for (let r=1; r<=gConst.floor.max_raw; r++) {
        gSprite_button_line2List[r].entity.onPointDown.add(ev => {
          add_clickEvent(3, 0, r, 1);
        });
        gSprite_button_line2List[r].entity.onPointUp.add(ev => {
          // add_clickEvent(0, 0, r, 2);
        });
      }

      // ALL移動ボタンを押したとき
      gSprite_button_all.onPointDown.add(ev => {
        add_clickEvent(4, 0, 0, 1);
      });



      // ブロック選択対象表示用の画像
      var gSprite_select = gEntity.gSprite_select(scene1, gConst);
      layer.S2[30].append(gSprite_select);

      // line選択対象表示用の画像
      var gSprite_selectList = {}
      for (let i=1; i<=3; i++) {
        const gSprite_select0 = { entity: gEntity.gSprite_select(scene1, gConst) }
        gSprite_selectList[i] = gSprite_select0; 
        layer.S2[30].append(gSprite_selectList[i].entity);     
      }
  
    }

    // ＝＝ゲームデータ＝＝
    if (system.dbg >= 0) { // 折り畳み用
      // フィールドリストデータ
      var fieldList1 = {}
      var fieldList2 = {}
      for (let col=1; col<=gConst.floor.max_col; col++) {
        fieldList1[col] = {};
        fieldList2[col] = {};
        for (let raw=1; raw<=gConst.floor.max_raw; raw++) {
          fieldList1[col][raw] = { 
            ind: 0,
            x: 0,
            y: 0,
          }
          fieldList2[col][raw] = { 
            ind: 0,
            x: 0,
            y: 0,
          }
        }
      }

      // ブロックリストデータ
      var blockList = {}
      for (let i=1; i<=gConst.floor.max_col*gConst.floor.max_raw; i++) {
        blockList[i] = {
          field: 0, // ブロックがあるfield
          col: 0, // ブロックがあるfieldのcol
          raw: 0, // ブロックがあるfieldのcol
          num1: 0, // ブロックの１(右)の数字
          num2: 0, // ブロックの２(下)の数字
          num3: 0, // ブロックの３(左)の数字
          num4: 0, // ブロックの４(上)の数字
          status: 0, // 0:未処理, 1:処理済み
          step: 0, // アニメーション用
          prev_field: 0,
          prev_col: 0,
          prev_raw: 0, 
        }
      }

      // data
      var data = {
        id: 0, // 何番目の問題を選択したか
        shuffle1: {}, // 数字のシャッフル
        shuffle2: {}, // ブロックのシャッフル
      }

      // 指定範囲の数字をシャッフルして返す
      var shuffle = function(min, max, op) {
        let data = {};
        data[0] = 0;
        for (let i=op; i<max-min+1+op; i++) { data[i] = min+i-op }
        let last=max-min+1;
        for (let i=op; i<max-min+1+op; i++) {
          // 残りから選択
          let ind=Math.floor(random.generate()*last)+op;
          let a=data[ind];
          for (let j=ind; j<last-1+op; j++) { data[j] = data[j+1] }
          data[last-1+op] = a;
          last -= 1;
        }
        return data;
      }

      // 関数:フィールドの作成
      var make_field = function() {
        // 未処理のクリック情報をskipする
        click.current = click.cnt;
        // 選択データをリセットする
        select.field = 0;
        select.col = 0;
        select.raw = 0;
        select.ind = 0;
        gSprite_select.hide();
        // フィールドの基礎情報の作成とフィールド台紙の作成
        gFunc.add_log(log[1].text, log[1].count++, g.game.age, "make_field開始時点 stage.col:"+stage.col+", stage.raw:"+stage.raw, system.dbg);
        for (let col=1; col<=gConst.floor.max_col; col++) {
          for (let raw=1; raw<=gConst.floor.max_raw; raw++) {
            let ind=(raw-1)*gConst.floor.max_col+col;
            gFunc.add_log(log[1].text, log[1].count++, g.game.age, "col:"+col+", raw:"+raw, system.dbg);
            // ind情報を初期化
            fieldList1[col][raw].ind = 0;
            fieldList2[col][raw].ind = 0;
            // 今回のステージのサイズ外のときは次へ
            if (col > stage.col || raw > stage.raw) {
              gRect_field1List[ind].entity.hide();
              gRect_field2List[ind].entity.hide();
              fieldList1[col][raw].x = 0;
              fieldList1[col][raw].y = 0;
              fieldList2[col][raw].x = 0;
              fieldList2[col][raw].y = 0;
              continue;
            }
            // 位置情報の計算
            fieldList1[col][raw].x = 450-(stage.col+0.9-col)*gConst.size.block;
            fieldList1[col][raw].y = 300-(stage.raw/2+0.5-raw)*gConst.size.block;
            fieldList2[col][raw].x = 450+(col-0.1)*gConst.size.block;
            fieldList2[col][raw].y = 300-(stage.raw/2+0.5-raw)*gConst.size.block;
            gFunc.add_log(log[1].text, log[1].count++, g.game.age, "("+fieldList1[col][raw].x+"/"+fieldList1[col][raw].y+"/"+fieldList2[col][raw].x+"/"+fieldList2[col][raw].y+")", system.dbg);
            // フィールド台紙を更新
            gRect_field1List[ind].entity.x = fieldList1[col][raw].x;
            gRect_field1List[ind].entity.y = fieldList1[col][raw].y;
            gRect_field1List[ind].entity.modified();
            gRect_field1List[ind].entity.show();
            gRect_field2List[ind].entity.x = fieldList2[col][raw].x;
            gRect_field2List[ind].entity.y = fieldList2[col][raw].y;
            gRect_field2List[ind].entity.modified();
            gRect_field2List[ind].entity.show();
          }
        }
        // line選択ボタンの作成
        for (let c=1; c<=gConst.floor.max_col; c++) {
          gSprite_button_line1List[c].entity.hide();
          if (c <= stage.col) {
            gSprite_button_line1List[c].entity.x = fieldList2[c][1].x;
            gSprite_button_line1List[c].entity.y = fieldList2[1][1].y-90;
            gSprite_button_line1List[c].entity.modified();
            // gSprite_button_line1List[c].entity.show();
          }
        }
        for (let r=1; r<=gConst.floor.max_raw; r++) {
          gSprite_button_line2List[r].entity.hide();
          if (r <= stage.raw) {
            gSprite_button_line2List[r].entity.x = fieldList2[1][1].x-90;
            gSprite_button_line2List[r].entity.y = fieldList2[1][r].y;
            gSprite_button_line2List[r].entity.modified();
            // gSprite_button_line2List[r].entity.show();
          }
        }
        // all移動ボタンの作成
        gSprite_button_all.x = 450-(stage.col/2+0.9-0.5)*gConst.size.block;
        gSprite_button_all.y = fieldList2[1][1].y-90;
        gSprite_button_all.modified();
        gSprite_button_all.show();

          

        // 問題の選択
        data.id = Math.floor(random.generate()*gConst.data_num[ctrl.level]);
        // 数字のシャッフル
        for (let i=0; i<=9; i++) { data.shuffle1[i] = i }
        if (system.mode == 0) { data.shuffle1 = shuffle(0, 9, 0) }
        // data.shuffle1 = shuffle(0, 9, 0)
        for (let i=0; i<=9; i++) gFunc.add_log(log[1].text, log[1].count++, g.game.age, ""+data.shuffle1[i], system.dbg);

        // ブロックのシャッフル
        for (let i=0; i<=gConst.floor.max_col*gConst.floor.max_raw; i++) { data.shuffle2[i] = i }
        let max=stage.col*stage.raw-1;
        if (system.mode == 0) { data.shuffle2 = shuffle(0, max, 0) }
        for (let i=0; i<=max; i++) gFunc.add_log(log[1].text, log[1].count++, g.game.age, ""+data.shuffle2[i], system.dbg);

        // ブロックの初期状態データの作成と画像の作成
        gFunc.add_log(log[1].text, log[1].count++, g.game.age, "stage.col:"+stage.col+" / stage.raw:"+stage.raw, system.dbg);
        for (let i=1; i<=gConst.floor.max_col*gConst.floor.max_raw; i++) {
          let col=(i-1)%stage.col+1;
          let raw=Math.ceil(i/stage.col);
          gFunc.add_log(log[1].text, log[1].count++, g.game.age, "col:"+col+" / raw:"+raw, system.dbg);
          // 今回のステージのサイズ外のときは次へ
          if (col > stage.col || raw > stage.raw) {
            gRect_blockList[i].entity.hide();
            gSprite_block1List[i].entity.hide();
            gSprite_block2List[i].entity.hide();
            gSprite_block3List[i].entity.hide();
            gSprite_block4List[i].entity.hide();
            gSprite_num1List[i].entity.hide()
            gSprite_num2List[i].entity.hide()
            gSprite_num3List[i].entity.hide()
            gSprite_num4List[i].entity.hide()
            continue;
          }
          gFunc.add_log(log[1].text, log[1].count++, g.game.age, "col:"+col+" / raw:"+raw, system.dbg);
          // ブロックデータを作成する
          fieldList1[col][raw].ind = i;
          blockList[i].field = 1;
          blockList[i].col = col;
          blockList[i].raw = raw;
          if (ctrl.level == 1) {
            blockList[i].num1 = data.shuffle1[gConst.data1[data.id][data.shuffle2[i-1]][0]]; 
            blockList[i].num2 = data.shuffle1[gConst.data1[data.id][data.shuffle2[i-1]][1]];
            blockList[i].num3 = data.shuffle1[gConst.data1[data.id][data.shuffle2[i-1]][2]];
            blockList[i].num4 = data.shuffle1[gConst.data1[data.id][data.shuffle2[i-1]][3]];  
          } else if (ctrl.level == 2) {
            blockList[i].num1 = data.shuffle1[gConst.data2[data.id][data.shuffle2[i-1]][0]]; 
            blockList[i].num2 = data.shuffle1[gConst.data2[data.id][data.shuffle2[i-1]][1]];
            blockList[i].num3 = data.shuffle1[gConst.data2[data.id][data.shuffle2[i-1]][2]];
            blockList[i].num4 = data.shuffle1[gConst.data2[data.id][data.shuffle2[i-1]][3]];  
          } else if (ctrl.level == 3) {
            blockList[i].num1 = data.shuffle1[gConst.data3[data.id][data.shuffle2[i-1]][0]]; 
            blockList[i].num2 = data.shuffle1[gConst.data3[data.id][data.shuffle2[i-1]][1]];
            blockList[i].num3 = data.shuffle1[gConst.data3[data.id][data.shuffle2[i-1]][2]];
            blockList[i].num4 = data.shuffle1[gConst.data3[data.id][data.shuffle2[i-1]][3]];  
          }
          // テストモードのときはテストデータをセットする
          if (system.mode == 1) {
            blockList[i].num1 = test.fieldList1[col][raw].num1;
            blockList[i].num2 = test.fieldList1[col][raw].num2;
            blockList[i].num3 = test.fieldList1[col][raw].num3;
            blockList[i].num4 = test.fieldList1[col][raw].num4;
          }
          blockList[i].status = 0;
          blockList[i].step = 0;
          // ブロックの画像を指定する
          gRect_blockList[i].entity.x = fieldList1[col][raw].x;
          gRect_blockList[i].entity.y = fieldList1[col][raw].y;
          gRect_blockList[i].entity.modified();
          gRect_blockList[i].entity.show();
          gSprite_block1List[i].entity.srcY = gConst.block.src.y+blockList[i].num1*gConst.block.src.cyc;
          gSprite_block1List[i].entity.x = fieldList1[col][raw].x;
          gSprite_block1List[i].entity.y = fieldList1[col][raw].y;
          gSprite_block1List[i].entity.modified();
          gSprite_block1List[i].entity.show();
          gSprite_block2List[i].entity.srcY = gConst.block.src.y+blockList[i].num2*gConst.block.src.cyc;
          gSprite_block2List[i].entity.x = fieldList1[col][raw].x;
          gSprite_block2List[i].entity.y = fieldList1[col][raw].y;
          gSprite_block2List[i].entity.modified();
          gSprite_block2List[i].entity.show();
          gSprite_block3List[i].entity.srcY = gConst.block.src.y+blockList[i].num3*gConst.block.src.cyc;
          gSprite_block3List[i].entity.x = fieldList1[col][raw].x;
          gSprite_block3List[i].entity.y = fieldList1[col][raw].y;
          gSprite_block3List[i].entity.modified();
          gSprite_block3List[i].entity.show();
          gSprite_block4List[i].entity.srcY = gConst.block.src.y+blockList[i].num4*gConst.block.src.cyc;
          gSprite_block4List[i].entity.x = fieldList1[col][raw].x;
          gSprite_block4List[i].entity.y = fieldList1[col][raw].y;
          gSprite_block4List[i].entity.modified();
          gSprite_block4List[i].entity.show();
          gSprite_num1List[i].entity.srcY = gConst.num.src.y+blockList[i].num1*gConst.num.src.cyc;
          gSprite_num1List[i].entity.x = fieldList1[col][raw].x+gConst.num.delta;
          gSprite_num1List[i].entity.y = fieldList1[col][raw].y;
          gSprite_num1List[i].entity.modified();
          gSprite_num1List[i].entity.show();
          gSprite_num2List[i].entity.srcY = gConst.num.src.y+blockList[i].num2*gConst.num.src.cyc;
          gSprite_num2List[i].entity.x = fieldList1[col][raw].x;
          gSprite_num2List[i].entity.y = fieldList1[col][raw].y+gConst.num.delta;
          gSprite_num2List[i].entity.modified();
          gSprite_num2List[i].entity.show();
          gSprite_num3List[i].entity.srcY = gConst.num.src.y+blockList[i].num3*gConst.num.src.cyc;
          gSprite_num3List[i].entity.x = fieldList1[col][raw].x-gConst.num.delta;
          gSprite_num3List[i].entity.y = fieldList1[col][raw].y;
          gSprite_num3List[i].entity.modified();
          gSprite_num3List[i].entity.show();
          gSprite_num4List[i].entity.srcY = gConst.num.src.y+blockList[i].num4*gConst.num.src.cyc;
          gSprite_num4List[i].entity.x = fieldList1[col][raw].x;
          gSprite_num4List[i].entity.y = fieldList1[col][raw].y-gConst.num.delta;
          gSprite_num4List[i].entity.modified();
          gSprite_num4List[i].entity.show();
        }

        // ★デバッグ★ 選択対象用画像の表示
        // gSprite_select.x = fieldList1[1][1].x;
        // gSprite_select.y = fieldList1[1][1].y;
        // gSprite_select.modified();
        // gSprite_select.show();
      }

      // 関数:ゲームデータの初期値の作成
      var make_gamedata = function() {
        // ＝＝第１ステージのフィールドを作成＝＝
        // ステージの指定
        stage.no = 1;
        // そのステージにおける縦横サイズの指定
        stage.col = 2; //gConst.floor.max_col;
        stage.raw = 2; //gConst.floor.max_raw;
        if (ctrl.level >= 2) { stage.col = 3 }
        if (ctrl.level == 3) { stage.raw = 3 }
        // ステージデータ作成を実行
        gFunc.add_log(log[1].text, log[1].count++, g.game.age, "make_gamedataでmake_field実行 ("+stage.col+"/"+stage.raw+")", system.dbg);
        make_field(stage.no);
      }
    }

    // ＝＝処理関係＝＝
    if (system.dbg >= 0) { // 折り畳み用
      // 関数:選択状態をセット
      var set_select = function(field, col, raw, ind) {
        gFunc.add_log(log[2].text, log[2].count++, g.game.age, "set_select:"+field+"/"+col+"/"+raw+"/"+ind, system.dbg);
        // selectデータをセット
        select.field = field;
        select.col = col;
        select.raw = raw;
        // select画像を表示
        if (field == 3) {
          if (select.col > 0) {
            for (let r=1; r<=stage.raw; r++) {
              gSprite_selectList[r].entity.x = fieldList2[col][r].x;
              gSprite_selectList[r].entity.y = fieldList2[col][r].y;
              gSprite_selectList[r].entity.modified();
              gSprite_selectList[r].entity.show();              
            }
          }
          if (select.raw > 0) {
            for (let c=1; c<=stage.col; c++) {
              gSprite_selectList[c].entity.x = fieldList2[c][raw].x;
              gSprite_selectList[c].entity.y = fieldList2[c][raw].y;
              gSprite_selectList[c].entity.modified();
              gSprite_selectList[c].entity.show();              
            }
          }

        } else if (field == 1) {
          gSprite_select.x = fieldList1[col][raw].x;
          gSprite_select.y = fieldList1[col][raw].y;
          select.ind = fieldList1[col][raw].ind;
          gSprite_select.modified();
          gSprite_select.show();        
        } else if (field == 2) {
          gSprite_select.x = fieldList2[col][raw].x;
          gSprite_select.y = fieldList2[col][raw].y;
          select.ind = fieldList2[col][raw].ind;
          gSprite_select.modified();
          gSprite_select.show();
        }  
      }
      // 関数:選択状態をリセット
      var reset_select = function() {
        gFunc.add_log(log[2].text, log[2].count++, g.game.age, "reset_select", system.dbg);
        // selectデータをリセット
        select.field = 0;
        select.col = 0;
        select.raw = 0;
        gSprite_select.hide();
        gSprite_selectList[1].entity.hide();              
        gSprite_selectList[2].entity.hide();              
        gSprite_selectList[3].entity.hide();              
      }
      // 関数:ブロックを移動させる
      var move_block = function(field, col, raw, ind, a) {
        // a=0: 指定されたブロックを初期位置に戻す。
        // a=1: セレクト状態にあるブロックを。空白のイベント先に移動させる
        // a=2: 空白のセレクト状態の場所に、イベントで指定されたブロックを移動させる
        // a=3: セレクト状態にあるブロックとイベントで指定されたブロックを交換する
        // a=4: 左でセレクト状態にあるブロックを右で指定したブロックに動かし、指定されたブロックを初期位置に戻す。
        // a=5: 左で指定したブロックを右でセレクト状態にあるブロックに動かし、右でセレクト状態にあるブロックを初期位置に戻す。
        gFunc.add_log(log[2].text, log[2].count++, g.game.age, "move_block: "+field+"/"+col+"/"+raw+"/"+ind+"/"+a, system.dbg);
        // ★デバッグ★
        // return;
        // ctrl.stepをセット
        ctrl.step = gConst.game.speed_move;
        // セレクト側をイベント先に動かす（※イベント先は右(field2)しかありえない
        if (a == 1 || a == 3 || a == 4) {
          gFunc.add_log(log[2].text, log[2].count++, g.game.age, " 処理1:  セレクト側をイベント先に動かす", system.dbg);
          blockList[select.ind].prev_field = blockList[select.ind].field;
          blockList[select.ind].prev_col = blockList[select.ind].col;
          blockList[select.ind].prev_raw = blockList[select.ind].raw;
          blockList[select.ind].field = field; 
          blockList[select.ind].col = col; 
          blockList[select.ind].raw = raw; 
          blockList[select.ind].step = gConst.game.speed_move; 
          if (field == 1) { fieldList1[col][raw].ind = select.ind }
          if (field == 2) { fieldList2[col][raw].ind = select.ind }
          gFunc.add_log(log[2].text, log[2].count++, g.game.age, " 動かした先:"+ind+"/"+fieldList1[col][raw].ind+"/"+fieldList2[col][raw].ind, system.dbg);
        }
        // イベント側をセレクト場所に動かす
        if (a == 2 || a == 3 || a == 5) {
          gFunc.add_log(log[2].text, log[2].count++, g.game.age, " 処理2:  イベント側をセレクト場所に動かす", system.dbg);
          blockList[ind].prev_field = blockList[ind].field;
          blockList[ind].prev_col = blockList[ind].col;
          blockList[ind].prev_raw = blockList[ind].raw;
          blockList[ind].field = select.field; 
          if (select.field == 3) { blockList[ind].field = 2 }
          blockList[ind].col = select.col; 
          blockList[ind].raw = select.raw; 
          blockList[ind].step = gConst.game.speed_move; 
          if (select.field == 1) { fieldList1[select.col][select.raw].ind = ind }
          if (select.field == 2 || select.field == 3) { fieldList2[select.col][select.raw].ind = ind }
        }
        // 指定されたブロックが初期位置に戻る場合
        if (a == 4) {
          gFunc.add_log(log[2].text, log[2].count++, g.game.age, " 処理3:  指定されたブロックが初期位置に戻る場合", system.dbg);
          let reset_col=(ind-1)%stage.raw+1;
          let reset_raw=Math.ceil(ind/stage.raw);
          gFunc.add_log(log[2].text, log[2].count++, g.game.age, "  reset_col:"+reset_col+", reset_raw:"+reset_raw, system.dbg);
          blockList[ind].prev_field = blockList[ind].field;
          blockList[ind].prev_col = blockList[ind].col;
          blockList[ind].prev_raw = blockList[ind].raw;
          blockList[ind].field = 1; 
          blockList[ind].col = reset_col; 
          blockList[ind].raw = reset_raw; 
          blockList[ind].step = gConst.game.speed_move; 
          fieldList1[reset_col][reset_raw].ind = ind;
        }
        // 選択ブロックが初期位置に戻る場合
        if (a == 0 || a == 5) {
          gFunc.add_log(log[2].text, log[2].count++, g.game.age, " 処理3.1:  選択ブロックが初期位置に戻る場合", system.dbg);
          let reset_col=(select.ind-1)%stage.raw+1;
          let reset_raw=Math.ceil(select.ind/stage.raw);
          gFunc.add_log(log[2].text, log[2].count++, g.game.age, "  reset_col:"+reset_col+", reset_raw:"+reset_raw, system.dbg);
          blockList[select.ind].prev_field = blockList[select.ind].field;
          blockList[select.ind].prev_col = blockList[select.ind].col;
          blockList[select.ind].prev_raw = blockList[select.ind].raw;
          blockList[select.ind].field = 1; 
          blockList[select.ind].col = reset_col; 
          blockList[select.ind].raw = reset_raw; 
          blockList[select.ind].step = gConst.game.speed_move; 
          fieldList1[reset_col][reset_raw].ind = select.ind;
        }
        // セレクト側のブロックが無くなる場合
        if (a == 0 || a == 1 || a == 4) {
          gFunc.add_log(log[2].text, log[2].count++, g.game.age, " 処理4:  セレクト側のブロックが無くなる場合", system.dbg);
          if (select.field == 1) { fieldList1[select.col][select.raw].ind = 0 }
          if (select.field == 2 || select.field == 3) { fieldList2[select.col][select.raw].ind = 0 }
        }
        // イベント側のブロックが無くなる場合
        if (a == 2 || a == 5) {
          gFunc.add_log(log[2].text, log[2].count++, g.game.age, " 処理5:  イベント側のブロックが無くなる場合", system.dbg);
          if (field == 1) { fieldList1[col][raw].ind = 0 }
          if (field == 2) { fieldList2[col][raw].ind = 0 }
        }
        // レイヤーを変更する
        if (ind > 0) {
          layer.S2[21].append(gRect_blockList[ind].entity)
          layer.S2[21].append(gSprite_block1List[ind].entity);
          layer.S2[21].append(gSprite_block2List[ind].entity);
          layer.S2[21].append(gSprite_block3List[ind].entity);
          layer.S2[21].append(gSprite_block4List[ind].entity);
          layer.S2[21].append(gSprite_num1List[ind].entity);
          layer.S2[21].append(gSprite_num2List[ind].entity);
          layer.S2[21].append(gSprite_num3List[ind].entity);
          layer.S2[21].append(gSprite_num4List[ind].entity);
        }
        if (select.ind > 0) {
          layer.S2[21].append(gRect_blockList[select.ind].entity)
          layer.S2[21].append(gSprite_block1List[select.ind].entity);
          layer.S2[21].append(gSprite_block2List[select.ind].entity);
          layer.S2[21].append(gSprite_block3List[select.ind].entity);
          layer.S2[21].append(gSprite_block4List[select.ind].entity);
          layer.S2[21].append(gSprite_num1List[select.ind].entity);
          layer.S2[21].append(gSprite_num2List[select.ind].entity);
          layer.S2[21].append(gSprite_num3List[select.ind].entity);
          layer.S2[21].append(gSprite_num4List[select.ind].entity);
        }
        // 選択状態を解除する ※line入れ替えの時は呼び出し元で選択状態の解除を実施する
        if (select.field < 3) {
          select.field = 0;
          select.col = 0;
          select.raw = 0;
          select.ind = 0;
          gSprite_select.hide();
        }
      }
      // 関数:line単位でブロックを入れ替える
      var move_line = function(col, raw) {
        // 入れ替えがcol指定の場合
        if (col > 0) {
          for (let r=1; r<=stage.raw; r++) {
            // select情報を単体に置き換える
            select.raw = r;
            select.ind = fieldList2[select.col][r].ind;
            // 入れ替え実施内容の判定
            if (select.ind >  0 && fieldList2[col][r].ind >  0) { move_block(2, col, r, fieldList2[col][r].ind, 3) }
            if (select.ind == 0 && fieldList2[col][r].ind >  0) { move_block(2, col, r, fieldList2[col][r].ind, 2) }
            if (select.ind >  0 && fieldList2[col][r].ind == 0) { move_block(2, col, r, fieldList2[col][r].ind, 1) }
          }
        }
        // 入れ替えがraw指定の場合
        else if (raw > 0) {
          for (let c=1; c<=stage.col; c++) {
            // select情報を単体に置き換える
            select.col = c;
            select.ind = fieldList2[c][select.raw].ind;
            // 入れ替え実施内容の判定
            if (select.ind >  0 && fieldList2[c][raw].ind >  0) { move_block(2, c, raw, fieldList2[c][raw].ind, 3) }
            if (select.ind == 0 && fieldList2[c][raw].ind >  0) { move_block(2, c, raw, fieldList2[c][raw].ind, 2) }
            if (select.ind >  0 && fieldList2[c][raw].ind == 0) { move_block(2, c, raw, fieldList2[c][raw].ind, 1) }
          }
        }
        // select状態をリセットする
        reset_select();
      }
      // 関数: ブロックをすべて移動させる
      var move_all = function() {
        for (let c=1; c<=stage.col; c++) {
          for (let r=1; r<=stage.raw; r++) {
            // select情報を単体に置き換える
            select.col = c;
            select.raw = r;
            select.ind = fieldList1[c][r].ind;
            // 移動実施
            move_block(2, c, r, 0, 1)
          }
        }
      }
      // select状態をリセットする
      reset_select();
    }


    // ＝＝リセットボタンその他＝＝
    if (system.dbg >= 0) { // 折り畳み用
      // リセットボタン用のラベル
      var gLabel_reset1 = gEntity.gLabel_reset(scene1, gConst, gConst.font001, "reset1", 1);
      layer.S2[30].append(gLabel_reset1);
      var gLabel_reset2 = gEntity.gLabel_reset(scene1, gConst, gConst.font001, "reset2", 2);
      layer.S2[30].append(gLabel_reset2);
      var gLabel_reset3 = gEntity.gLabel_reset(scene1, gConst, gConst.font001, "reset3", 3);
      layer.S2[30].append(gLabel_reset3);

      // resetをクリックしたとき
      gLabel_reset1.onPointDown.add(ev => {
        if (scene_status == gConst.scene_main) {
          // スコアを戻す
          score_plus = stage.score-score;
          // レベルと縦横サイズを指定しフィールドデータを作成する
          ctrl.level = 1;
          stage.col = 2;
          stage.raw = 2;
          make_field(stage.no);
        }
      });
      gLabel_reset2.onPointDown.add(ev => {
        if (scene_status == gConst.scene_main) {
          // スコアを戻す
          score_plus = stage.score-score;
          // レベルと縦横サイズを指定しフィールドデータを作成する
          ctrl.level = 2;
          stage.col = 3;
          stage.raw = 2;
          make_field(stage.no);
        }
      });
      gLabel_reset3.onPointDown.add(ev => {
        if (scene_status == gConst.scene_main) {
          // スコアを戻す
          score_plus = stage.score-score;
          // レベルと縦横サイズを指定しフィールドデータを作成する
          ctrl.level = 3;
          stage.col = 3;
          stage.raw = 3;
          make_field(stage.no);
        }
      });

      // 自動レベルアップoffのボタン gLabel_levelup_off
      var gLabel_levelup_off = gEntity.gLabel_levelup_off(scene1, gConst, gConst.font001, "自動upオフ");
      layer.S2[30].append(gLabel_levelup_off);
      // 自動レベルアップoffのボタンをクリックしたとき
      gLabel_levelup_off.onPointDown.add(ev => {
        if (scene_status == gConst.scene_main) {
          // スコアを戻す
          if (ctrl.auto_levelup == 1) {
            ctrl.auto_levelup = 0;
            gLabel_levelup_off.opacity = 1;
          } else {
            ctrl.auto_levelup = 1;
            gLabel_levelup_off.opacity = 0.3;
          }
        }
      });


    }


    // ＝＝キーボード対応＝＝
    if (system.dbg >= 0) { // 折り畳み用
      // キーボード入力があったとき
      window.addEventListener('keydown', (ev) => {
        // keyA: モードの切り替え
        if (ev.code == "KeyA")  return;
      });      
    }
    

    // ＝＝テストデータ作製関係＝＝
    if (system.dbg >= 0) { // 折り畳み用
      var test = {
        level: 3, 
        no: 0, // 何種類目のテストデータか
        cnt: 0, // テストデータに対する何番目の並び方か
        result: 0, // テストデータのテスト結果。最初の並び以外でクリア対象が発見された段階でカウントアップされる
        fieldList1: {}, // テスト用のブロックリストデータ
        fieldList2: {}, // テスト用のブロックリストデータ
        col: 2,
        raw: 2,
        pattern1: {}, // テストパターンの数字の並び
        pattern2: {}, // テストパターンの数字の並び
        pattern3: {}, // テストパターンの数字の並び
      }
      if (test.level >= 2) { test.col=3 }
      if (test.level == 3) { test.raw=3 }
      // テスト用のブロックデータ
      for (let col=1; col<=gConst.floor.max_col; col++) {
        test.fieldList1[col] = {}
        test.fieldList2[col] = {}
        for (let raw=1; raw<=gConst.floor.max_raw; raw++) {
          test.fieldList1[col][raw] = { num1: 0, num2: 0, num3: 0, num4: 0 }  
          test.fieldList2[col][raw] = { num1: 0, num2: 0, num3: 0, num4: 0 }  
        }
      }

      // 関数:テストデータの作成
      var make_test = function() {
        for (let col=1; col<=test.col; col++) {
          for (let raw=1; raw<=test.raw; raw++) {
            let range=10;
            // num1を決める
            test.fieldList1[col][raw].num1 = Math.floor(random.generate()*range);
            // num2を決める
            test.fieldList1[col][raw].num2 = Math.floor(random.generate()*range);
            // num3を決める
            if (col == 1) { test.fieldList1[col][raw].num3 = Math.floor(random.generate()*range) }
            else          { test.fieldList1[col][raw].num3 = test.fieldList1[col-1][raw].num1 }
            // num4を決める
            if (raw == 1) { test.fieldList1[col][raw].num4 = Math.floor(random.generate()*range) }
            else          { test.fieldList1[col][raw].num4 = test.fieldList1[col][raw-1].num2 }
            gFunc.add_log(log[1].text, log[1].count++, g.game.age, "["+col+"]["+raw+"](1) "+test.fieldList1[col][raw].num1, system.dbg);
            gFunc.add_log(log[1].text, log[1].count++, g.game.age, "["+col+"]["+raw+"](2) "+test.fieldList1[col][raw].num2, system.dbg);
            gFunc.add_log(log[1].text, log[1].count++, g.game.age, "["+col+"]["+raw+"](3) "+test.fieldList1[col][raw].num3, system.dbg);
            gFunc.add_log(log[1].text, log[1].count++, g.game.age, "["+col+"]["+raw+"](4) "+test.fieldList1[col][raw].num4, system.dbg);
          }
        }
      }
      
      // 関数: 数字を決めて次へ

      // テストパターンデータを作成する

    }



    // ～～～～定期処理～～～～
    // scene1.setInterval(function() {
    scene1.update.add(() => {

      // ＝＝テストデータ作成モード＝＝
      if (scene_status == 2.1) {
        gFunc.dbg_message(sLabel_debug_msg, g.game.age+" テスト準備 "+scene_status, 0, system.dbg);
        // テストデータの作成
        make_test();
        // テストデータで画像データを作成する
        ctrl.level = test.level;
        stage.no = 1;
        stage.col = test.col;
        stage.raw = test.raw;
        make_field(stage.no);
        // 次の状態
        scene_status = 2.2;
        if (test.level == 3) { scene_status = 2.5 }
      }
      if (scene_status == 2.2) {
        // 次のテストパターン
        test.cnt += 1;
        let list={};
        let len=4;
        if (test.level == 2) { len = 6 }
        if (test.level == 3) { len = 9 }
        // パターンをベースにfieldList2へ値をセットする
        for (let i=0; i<len; i++) {
          let ind;
          if (test.level == 1) { ind = gConst.pattern1[test.cnt][i] }
          if (test.level == 2) { ind = gConst.pattern2[test.cnt][i] }
          if (test.level == 3) { ind = gConst.pattern3[test.cnt][i] }
          let col1=ind%stage.raw+1;
          let raw1=Math.floor(ind/stage.raw)+1;
          let col2=i%stage.raw+1;
          let raw2=Math.floor(i/stage.raw)+1;
          gFunc.add_log(log[3].text, log[3].count++, g.game.age, col1+"/"+raw1+"   "+col2+"/"+raw2, system.dbg);
          
          test.fieldList2[col2][raw2].num1 = test.fieldList1[col1][raw1].num1;
          test.fieldList2[col2][raw2].num2 = test.fieldList1[col1][raw1].num2;
          test.fieldList2[col2][raw2].num3 = test.fieldList1[col1][raw1].num3;
          test.fieldList2[col2][raw2].num4 = test.fieldList1[col1][raw1].num4;          
        }

        // セットしたfieldList2にチェックをかける
        let jud=1;
        for (let c=1; c<=stage.col; c++) {
          for (let r=1; r<=stage.raw; r++) {
            // 右とチェック
            if (c < stage.col) {
              if (test.fieldList2[c][r].num1 != test.fieldList2[c+1][r].num3) { jud = 0 }
            }
            // 下とチェック
            if (r < stage.raw) {
              if (test.fieldList2[c][r].num2 != test.fieldList2[c][r+1].num4) { jud = 0 } 
            }
          }
        }
        if (jud == 1) { test.result += 1 }
        // テスト対象パターン数
        let max_pattern=24-1;
        if (test.level == 2) { max_pattern=720-1 }
        gFunc.dbg_message(sLabel_debug_msg, "テスト結果 "+test.cnt+"/"+max_pattern+"  result:"+test.result, 0, system.dbg);
        if (test.cnt >= max_pattern) {
          // 結果をメッセージ表示してストップ
          scene_status = 2.3;
        }
      }

      // ＝＝プレーヤー操作＝＝
      if (scene_status == gConst.scene_main && ctrl.step <= 0 && stage.step == 0) {
        // 今回のフレームで処理すべきイベントが発生しているか
        let jud_ev=0;
        // ゲーム時間内のとき、未処理のイベントがある場合は、１つイベントを実行する
        if (click.current < click.cnt) {
          // all移動ボタンは非表示にする
          gSprite_button_all.hide();
          // 実施するclick.currentをカウントアップ
          click.current += 1;
          gFunc.add_log(log[2].text, log[2].count++, g.game.age, "イベント実行("+click.current+"/"+click.cnt+")", system.dbg);
          // これから扱うクリック情報
          let click_field = click.field[click.current];
          let click_col = click.col[click.current];
          let click_raw = click.raw[click.current];
          let click_ind = 0;
          // クリック情報の場所に今あるブロック
          if      (click_field == 1) { click_ind = fieldList1[click_col][click_raw].ind }
          else if (click_field == 2) { click_ind = fieldList2[click_col][click_raw].ind }
          if (click_field == 3) {
            gFunc.add_log(log[2].text, log[2].count++, g.game.age, " line選択: "+click_col+"/"+click_raw, system.dbg);
          } else if (click_field == 4) {
            gFunc.add_log(log[2].text, log[2].count++, g.game.age, " all移動実行", system.dbg);        
          } else {
            gFunc.add_log(log[2].text, log[2].count++, g.game.age, " イベント先の情報:"+fieldList1[click_col][click_raw].ind+"/"+fieldList2[click_col][click_raw].ind, system.dbg);
            gFunc.add_log(log[2].text, log[2].count++, g.game.age, " イベント情報:"+click_field+"/"+click_col+"/"+click_raw+"/"+click_ind, system.dbg);
            gFunc.add_log(log[2].text, log[2].count++, g.game.age, " 選択前の状態:"+select.field+"/"+select.col+"/"+select.raw+"/"+select.ind, system.dbg);  
          }
          // イベントはonPointUpだったとき
          if (click.ope[click.current] == 2) {
            gFunc.add_log(log[2].text, log[2].count++, g.game.age, "onPointUpのイベント", system.dbg);
          }
          // 未選択状態だったとき
          else if (select.field == 0) {
            // ALL移動を実施
            if (click_field == 4) {
              move_all();
            }
            // 左・ブロックなしをクリック
            else if (click_field == 1 && click_ind == 0) {
              // ⇒何もなし・ぶ
              // se02.play();
            }
            // 左・ブロックありをクリック
            else if (click_field == 1 && click_ind > 0) {
              // ⇒選択になる・ぴ。
              set_select(click_field, click_col, click_raw, click_ind);
            }
            // 右・ブロックなしをクリック
            else if (click_field == 2 && click_ind == 0) {
              // ⇒選択になる・ぴ。
              set_select(click_field, click_col, click_raw, click_ind);
            }
            // 右・ブロックありをクリック
            else if (click_field == 2 && click_ind > 0) {
              // ⇒選択になる・ぴ。
              set_select(click_field, click_col, click_raw, click_ind);
            }
            // line選択(col)or(raw)を選択
            else if (click_field == 3) {
              // ⇒line選択状態になる・ぴ
              set_select(click_field, click_col, click_raw, 0);
            }
          }
          //　選択あり：左・ブロックありだったとき
          else if (select.field == 1 && select.ind > 0) {
            // 選択状態のフィールドをクリック
            if (select.field == click_field && select.col == click_col && select.raw == click_raw) {
              // ⇒選択解除になる・ぶ
              reset_select();
            }
            // 左・ブロックなしをクリック
            else if (click_field == 1 && click_ind == 0) {
              // ⇒選択解除になる・ぶ
              reset_select();
            }
            // 左・ブロックありをクリック
            else if (click_field == 1 && click_ind > 0) {
              // ⇒選択が切り替わる・ぴ
              set_select(click_field, click_col, click_raw, click_ind);
            }
            // 右・ブロックなしをクリック
            else if (click_field == 2 && click_ind == 0) {
              // ⇒選択状態にあったブロックがクリックした場所へ・しゃっ
              move_block(click_field, click_col, click_raw, click_ind, 1);
            }
            // 右・ブロックありをクリック
            else if (click_field == 2 && click_ind > 0) {
              // ⇒選択状態にあったブロックがクリックした場所へ・しゃっ & クリックした場所にあったブロックが左の初期位置に戻る・音無し
              move_block(click_field, click_col, click_raw, click_ind, 4);
            }
            // line選択(col)or(raw)を選択
            else if (click_field == 3) {
              // ⇒現在の単体選択が消え、line選択状態になる・ぴ
              reset_select();
              set_select(click_field, click_col, click_raw, 0);
            }
          }
          //　選択あり：右・ブロックなしだったとき
          else if (select.field == 2 && select.ind == 0) {
            // 選択状態のフィールドをクリック
            if (select.field == click_field && select.col == click_col && select.raw == click_raw) {
              // ⇒選択解除になる・ぶ
              reset_select();
            }
            // 左・ブロックなしをクリック
            else if (click_field == 1 && click_ind == 0) {
              // ⇒選択解除になる・ぶ
              reset_select();
            }
            // 左・ブロックありをクリック
            else if (click_field == 1 && click_ind > 0) {
              // ⇒クリックした場所にあったブロックが選択状態の場所へ・しゃっ
              move_block(click_field, click_col, click_raw, click_ind, 2);
            }
            // 右・ブロックなしをクリック
            else if (click_field == 2 && click_ind == 0) {
              // ⇒選択になる・ぴ。
              set_select(click_field, click_col, click_raw, click_ind);
            }
            // 右・ブロックありをクリック
            else if (click_field == 2 && click_ind > 0) {
              // ⇒クリックした場所にあったブロックが選択状態の場所へ・しゃっ
              move_block(click_field, click_col, click_raw, click_ind, 2);
            }
            // line選択(col)or(raw)を選択
            else if (click_field == 3) {
              // ⇒現在の単体選択が消え、line選択状態になる・ぴ
              reset_select();
              set_select(click_field, click_col, click_raw, 0);
            }
          } 
          //　選択あり：右・ブロックありだったとき
          else if (select.field == 2 && select.ind > 0) {
            // 選択状態のフィールドをクリック
            if (select.field == click_field && select.col == click_col && select.raw == click_raw) {
              // ⇒選択解除になる・ぶ
              reset_select();
            }
            // 左・ブロックなしをクリック
            else if (click_field == 1 && click_ind == 0) {
              // ⇒選択状態にあったブロックが左の初期配置場所へ・しゃっ
              move_block(click_field, click_col, click_raw, click_ind, 0);
            }
            // 左・ブロックありをクリック
            else if (click_field == 1 && click_ind > 0) {
              // ⇒
              move_block(click_field, click_col, click_raw, click_ind, 5);
            }
            // 右・ブロックなしをクリック
            else if (click_field == 2 && click_ind == 0) {
              // ⇒選択状態にあったブロックがクリックした場所へ・しゃっ
              move_block(click_field, click_col, click_raw, click_ind, 1);
            }
            // 右・ブロックありをクリック
            else if (click_field == 2 && click_ind > 0) {
              // ⇒選択状態にあったブロックがクリックした場所へ・しゃっ & 　クリックした場所にあったブロックが選択状態の場所へ・音無し
              move_block(click_field, click_col, click_raw, click_ind, 3);
            }
            // line選択(col)or(raw)を選択
            else if (click_field == 3) {
              // ⇒現在の単体選択が消え、line選択状態になる・ぴ
              reset_select();
              set_select(click_field, click_col, click_raw, 0);
            }
          } 
          //　line選択あり状態だったとき
          else if (select.field == 3) {
            // 左をクリック
            if (click_field == 1) {
              // ⇒line選択を解除
              reset_select();
            }
            // 右・選択状態内のブロックをクリック
            else if (click_field == 2 && (click_col == select.col || click_raw == select.raw)) {
              // ⇒line選択を解除
              reset_select();
            }
            // 右・選択状態外のブロックをクリック
            else if (click_field == 2) {
              // ⇒入れ替え実施
              if (select.col > 0) move_line(click_col, 0);
              if (select.raw > 0) move_line(0, click_raw);
            }
            // line選択・縦横逆側をクリック
            else if (click_field == 3 && select.col*click_col == 0 && select.raw*click_raw == 0) {
              // ⇒line選択を変更する
              set_select(click_field, click_col, click_raw, 0);
            }
            // line選択・現在と同じものをクリック
            else if (click_field == 3 && select.col == click_col && select.raw == click_raw) {
              // ⇒line選択を解除
              reset_select();
            }
            // line選択・現在と違う列（行）をクリック
            else if (click_field == 3) {
              // ⇒入れ替え実施
              move_line(click_col, click_raw);
            }


          }
          // ★★デバッグ★★　状態をログ出力
          // log[3].count = 1;
          gFunc.add_log(log[3].text, log[3].count++, g.game.age, "現在の状態", system.dbg);
          for (let r=1; r<=3; r++) {
            let text = "";
            let t = "";
            for (let c=1; c<=3; c++) {
              t = "";
              let ind1=fieldList1[c][r].ind;
              if (ind1 > 0) { t = "["+ind1+"]"+blockList[ind1].num1+blockList[ind1].num2+blockList[ind1].num3+blockList[ind1].num4+" " }
              else          { t = "["+ind1+"]"+"//// " }
              text = ""+text+t;
              // gFunc.add_log(log[3].text, log[3].count++, g.game.age, ""+t+" > "+text, system.dbg);
            }
            text = text+"______";
            for (let c=1; c<=3; c++) {
              t = "";
              let ind1=fieldList2[c][r].ind;
              if (ind1 > 0) { t = "["+ind1+"]"+blockList[ind1].num1+blockList[ind1].num2+blockList[ind1].num3+blockList[ind1].num4+" " }
              else          { t = "["+ind1+"]"+"//// " }
              text = ""+text+t;
              // gFunc.add_log(log[3].text, log[3].count++, g.game.age, ""+t+" > "+text, system.dbg);
             }
            gFunc.add_log(log[3].text, log[3].count++, g.game.age, ""+text, system.dbg);
          }
        }
      }

      // ＝＝画面表示更新＆クリアチェック＝＝
      if (system.dbg >= 0) { // 折り畳み用
        // ブロックのアニメーション
        if (ctrl.step > 0) {
          ctrl.step -= 1;
          for (let i=1; i<=stage.col*stage.raw; i++) {
            if (blockList[i].step > 0) {
              blockList[i].step -= 1;
              let x1=fieldList1[blockList[i].prev_col][blockList[i].prev_raw].x;
              let y1=fieldList1[blockList[i].prev_col][blockList[i].prev_raw].y;
              if (blockList[i].prev_field == 2) { x1 = fieldList2[blockList[i].prev_col][blockList[i].prev_raw].x }
              if (blockList[i].prev_field == 2) { y1 = fieldList2[blockList[i].prev_col][blockList[i].prev_raw].y }
              let x2=fieldList1[blockList[i].col][blockList[i].raw].x;
              let y2=fieldList1[blockList[i].col][blockList[i].raw].y;
              if (blockList[i].field == 2) { x2 = fieldList2[blockList[i].col][blockList[i].raw].x }
              if (blockList[i].field == 2) { y2 = fieldList2[blockList[i].col][blockList[i].raw].y }
              let x=x2-(x2-x1)*blockList[i].step/gConst.game.speed_move;
              let y=y2-(y2-y1)*blockList[i].step/gConst.game.speed_move;
              if (ctrl.step <= 0 || blockList[i].step <= 0) {
                blockList[i].step
                x = x2;
                y = y2;
              }
              gRect_blockList[i].entity.x = x;
              gRect_blockList[i].entity.y = y;
              gSprite_block1List[i].entity.x = x;
              gSprite_block1List[i].entity.y = y;
              gSprite_block2List[i].entity.x = x;
              gSprite_block2List[i].entity.y = y;
              gSprite_block3List[i].entity.x = x;
              gSprite_block3List[i].entity.y = y;
              gSprite_block4List[i].entity.x = x;
              gSprite_block4List[i].entity.y = y;
              gSprite_num1List[i].entity.x = x+gConst.num.delta;
              gSprite_num1List[i].entity.y = y;
              gSprite_num2List[i].entity.x = x;
              gSprite_num2List[i].entity.y = y+gConst.num.delta;
              gSprite_num3List[i].entity.x = x-gConst.num.delta;
              gSprite_num3List[i].entity.y = y;
              gSprite_num4List[i].entity.x = x;
              gSprite_num4List[i].entity.y = y-gConst.num.delta;
              gRect_blockList[i].entity.modified();
              gSprite_block1List[i].entity.modified();
              gSprite_block2List[i].entity.modified();
              gSprite_block3List[i].entity.modified();
              gSprite_block4List[i].entity.modified();
              gSprite_num1List[i].entity.modified();
              gSprite_num2List[i].entity.modified();
              gSprite_num3List[i].entity.modified();
              gSprite_num4List[i].entity.modified();
            }
          }
          // クリアチェックを実施する
          if (ctrl.step <= 0) {
            // line選択ボタンを有効化
            for (let c=1; c<=gConst.floor.max_col; c++) {
              if (c <= stage.col) gSprite_button_line1List[c].entity.show();
            }
            for (let r=1; r<=gConst.floor.max_raw; r++) {
              if (r <= stage.raw) gSprite_button_line2List[r].entity.show();
            }    
            // クリアチェック
            ctrl.step = 0;
            let jud=1;
            let cnt=0;
            gFunc.add_log(log[3].text, log[3].count++, g.game.age, "～～チェック開始～～"+stage.col+"/"+stage.raw, system.dbg);
            for (let c=1; c<=stage.col; c++) {
              for (let r=1; r<=stage.raw; r++) {
                gFunc.add_log(log[3].text, log[3].count++, g.game.age, "～～チェック～～"+c+"/"+r, system.dbg);
                // ブロックがあるかどうか
                if (fieldList2[c][r].ind == 0) { jud = 0; continue }
                // 右とチェック
                if (c < stage.col) {
                  if (fieldList2[c+1][r].ind == 0) { jud = 0 }
                  else if (blockList[fieldList2[c][r].ind].num1 != blockList[fieldList2[c+1][r].ind].num3) { jud = 0 }
                  else { cnt += 1 } 
                }
                // 下とチェック
                if (r < stage.raw) {
                  if (fieldList2[c][r+1].ind == 0) { jud = 0 }
                  else if (blockList[fieldList2[c][r].ind].num2 != blockList[fieldList2[c][r+1].ind].num4) { jud = 0 } 
                  else { cnt += 1 } 
                }
              }
            }
            // jud=1のときクリア
            if (jud == 1) {
              gFunc.dbg_message(sLabel_debug_msg, "クリア！", 0, system.dbg);
              // クリア用のSEを鳴らす
              se06.play();     
              // 紙吹雪
              kamifubuki.jud = 1;
              // スコア計算
              if (ctrl.level == 1) { score_plus = stage.score+ 200 - score + Math.floor( 1*last_time/g.game.fps) }
              if (ctrl.level == 2) { score_plus = stage.score+1000 - score + Math.floor( 5*last_time/g.game.fps) }
              if (ctrl.level == 3) { score_plus = stage.score+5000 - score + Math.floor(30*last_time/g.game.fps) }
              // ステージ用スコアの設定
              stage.score = score+score_plus;
              // クリア用のstage.stepに値を設定
              stage.step = 30;
            } else {
              score_plus = stage.score+cnt*10 - score;
              gFunc.dbg_message(sLabel_debug_msg, "継続: "+cnt, 0, system.dbg);            
            }            
          }  
        }
      } 

      // スコア更新があった場合
      if (score_plus != 0) {
        score_plus_step = 150;
        if (score_plus > 0) { 
          gLabel_score_plus.text = "+"+score_plus;
          if (ctrl.fever > 1) { gLabel_score_plus.text = "+"+score_plus+"★"+ctrl.fever }
        } else {
          gLabel_score_plus.text = ""+score_plus;
        }
        gLabel_score_plus.invalidate();        
        score += score_plus;
        gLabel_score.text = ""+score;
        gLabel_score.invalidate();
        g.game.vars.gameState = { score: score }; 
        score_plus = 0;
      }
      // スコアプラス表示を消す
      if (score_plus_step > 0) {
        score_plus_step -= 1;
        gLabel_score_plus.opacity = score_plus_step / 150;
      }

      // ＝＝ゲーム管理＝＝
      if (system.dbg >= 0) { // 折り畳み用
        // ステージクリア表示中のとき
        if (scene_status == gConst.scene_main && stage.step > 0) {
          stage.step -= 1;
          if (stage.step <= 0) {
            // レベルを１つ上げる
            if (ctrl.auto_levelup == 1 ) { ctrl.level += 1 }
            if (ctrl.level > 3) { ctrl.level = 3 }
            // ステージの初期化
            stage.no += 1;
            if (ctrl.level == 1) { stage.col = 2; stage.raw = 2 }
            if (ctrl.level == 2) { stage.col = 3; stage.raw = 2 }
            if (ctrl.level == 3) { stage.col = 3; stage.raw = 3 }
            gFunc.add_log(log[1].text, log[1].count++, g.game.age, "make_field呼び出し直前 stage.col:"+stage.col+", stage.raw:"+stage.raw, system.dbg);
            make_field(stage.no);
            // ガイドメッセージを更新する
            if (stage.no == 2) {
              gLabel_guide.text = "リセットボタンで盤面のサイズも変更可能です。";
            } else if (stage.no >= 3) {
              gLabel_guide.text = "";
            }
            gLabel_guide.invalidate();
          }
        }
      }

      // ＝＝ロジック外の演出アニメーション関係＝＝
      if (system.dbg >= 0) { // 折り畳み用
        // ＝＝＝＝紙吹雪エフェクト＝＝＝＝
        if (gConst.use_kamifubuki == 1 && kamifubuki.jud == 1) {
          kamifubuki.step += 1;
          for (let i=1; i<=gConst.kamifubuki.number; i++) {
            // 徐々に透明化
            let opa=1-kamifubuki.step/60;
            if (opa < 0) { opa = 0 }
            gRect_kamifubukiList[i].entity.opacity = opa;
            // 横に動く距離
            kamifubukiList[i].x += kamifubukiList[i].scale*(i%10-5+gConst.kamifubuki.move*Math.sin(Math.PI*kamifubukiList[i].angle/180));
            // 落ちる距離
            kamifubukiList[i].y += kamifubukiList[i].scale*gConst.kamifubuki.speed_drop;
            // angleの更新
            kamifubukiList[i].angle += gConst.kamifubuki.speed_width;
            // 下まで行ってループする場合
            if (kamifubukiList[i].y > g.game.height) {
              kamifubukiList[i].x = (g.game.width-gConst.kamifubuki.posi_width)/2+gConst.kamifubuki.posi_x*i%gConst.kamifubuki.posi_width;
              kamifubukiList[i].y = -gConst.kamifubuki.posi_height/5;            
            }
            // はためき（scaleY)
            gRect_kamifubukiList[i].entity.scaleY = kamifubukiList[i].scale * Math.sin(Math.PI*kamifubukiList[i].angle/90);
            // 角度（angle）
            gRect_kamifubukiList[i].entity.angle = kamifubukiList[i].angle;
            // 画像の位置情報
            gRect_kamifubukiList[i].entity.x = kamifubukiList[i].x;
            gRect_kamifubukiList[i].entity.y = kamifubukiList[i].y;
            // 画像の更新
            gRect_kamifubukiList[i].entity.modified();
          }
          if (kamifubuki.step >= 60) {
            kamifubuki.step = 0;
            kamifubuki.jud = 0;
          }
        }

        // ＝＝ライト表現＝＝
        if (ctrl.succes_step > 0) {
          ctrl.succes_step -= 1;
          gRect_light.opacity = 0.3*ctrl.succes_step/30;
          gFunc.add_log(log[3].text, log[3].count++, g.game.age, "ctrl.succes_step:"+ctrl.succes_step+", gRect_light.opacity: "+gRect_light.opacity, system.dbg);                                 
        }          
      }
              
      // ＝＝システム全体の状態遷移処理＝＝
      // カウントダウン
      if (system.dbg >= 0) { // 折り畳み用
        if (system.mode == 0 && last_time > 0) { last_time -= 1 }
      }

      // 状態ごとの処理
      if (system.dbg >= 0) { // 折り畳み用
        // title時間
        if (scene_status == gConst.scene_title) {
          // データ作成モードのときは一気に残り時間を落とす
          if (system.mode == 1) { last_time = 0 }
          // last_timeが0になったとき、遷移処理を行いステータスを更新する
          if (last_time <= 0) {
            // skipボタン(旧スタートボタン)をhelpアニメ中は非表示にする
            tSprite_start.hide(); 
            // 次のシーンへ
            scene_status = 100; // ステータスはhelpアニメ用の値
            last_time = 0; // helpアニメを利用しない場合は即時進ませるように0をセット
            // カウントダウン表示をいったん消す
            sSprite_back.opacity = 0.5;
            // sLabel_last_time.hide();
            // helpアニメを利用する場合
            if (gConst.use_title_anime == 1 && gConst.use_help == 1) {
              // se07.play();
              help1.jud = 1;
              help1.step = gConst.help1.step_max;
              last_time = 30; // フレーム数を指定
              // リスタートで戻ってきていたときはstepとlast_timeを0にする
              if (gConst.jud_restart == 2) {
                help1.step = 1;
                last_time = 0;
              }
            }
            // 自己べ利用の場合は自己べ結果の表示を消す
            if (gConst.use_best == 1) { sLabel_best.hide() }
          }
        }
        // ヘルプを消すアニメーションの後にreadyへ
        if (scene_status == 100) {
          // データ作成モードのときは一気に残り時間を落とす
          if (system.mode == 1) { last_time = 0 }
          // last_timeが0になったとき、遷移処理を行いステータスを更新する
          if (last_time <= 0) {
            // カウントダウン表示を再表示
            // sLabel_last_time.show();
            // 戻る／リスタートのボタンを表示する
            if (gConst.use_setting == 1) {
              sSprite_button_back.show(); // 戻るボタン(※debugのときのみappendされている
              sSprite_button_restart.show(); // リスタートボタン(※debugのときのみappendされている
            }
            // タイトル上のパラメータを使ってゲームデータを作成する
            if (system.mode == 0) make_gamedata();
            // レイヤー表示の切替
            layer.S[1].hide(); // シーン1(タイトル用)のレイヤーを非表示にする 
            layer.S[2].show(); // 
            // layer.S[2].show(); // シーン2(ゲーム用)のレイヤーを表示する
            // タイムアップで次:readyに進む
            scene_status = gConst.scene_ready;
            last_time = gConst.time_ready*g.game.fps;
            sLabel_last_time.hide();
          }
        }
        // Ready時間
        if (scene_status == gConst.scene_ready) {
          // データ作成モードのときは一気に残り時間を落とす
          if (system.mode == 1) { last_time = 0 }
          // 3秒前からReadyカウントダウン表示開始
          if (last_time <= 3*g.game.fps) {
            // 3秒前でReadyカウントダウン表示開始＆SE00を鳴らす。
            if (last_time == 3*g.game.fps) { 
              se00.stop();
              se00.play();
              // se00.play().changeVolume(gConst.se00_volume_def);  // 音量調整が必要な場合はこちらを利用する
              gLabel_ready_countdown.show();
            } else if (last_time == 2*g.game.fps) {
              gLabel_ready_countdown.text = "2";
            } else if (last_time == 1*g.game.fps) {
              gLabel_ready_countdown.text = "1";
            }
            // アニメーション
            if (last_time%g.game.fps >= g.game.fps/2) {
              gLabel_ready_countdown.scaleX = 2*(g.game.fps-last_time%g.game.fps)/g.game.fps;
              gLabel_ready_countdown.scaleY = 2*(g.game.fps-last_time%g.game.fps)/g.game.fps;
            }
            else if (last_time%g.game.fps == 0) {
              gLabel_ready_countdown.scaleX = 0;
              gLabel_ready_countdown.scaleY = 0;
            }
            gLabel_ready_countdown.invalidate();
          }
          // last_timeが0になったとき、遷移処理を行いステータスを更新する
          if (last_time <= 0) {
            sLabel_last_time.show();
            // Readyカウントダウン表示を消す
            gLabel_ready_countdown.hide();
            // gRect_ready_screenを消す
            gRect_ready_screen.hide();
            // タイムアップで次に進む
            scene_status = gConst.scene_main;
            last_time = gConst.time_main*g.game.fps;
            sLabel_last_time.show();
            // データ作成モードのときは特別な状態へ
            if (system.mode == 1) { scene_status += 0.1 }
          }
        }
        // main時間
        if (scene_status == gConst.scene_main) {
          // ★★すべりのエクストラ用★★
          if (system.extra == 1) {
            /*
            // フィーバータイムチェック: 3秒前に秒読み
            if (last_time == (3+gConst.ctrl.fever_time[ctrl.fever])*g.game.fps) {
              se11.play().changeVolume(0.1);
            }
            if (last_time == (0.5+gConst.ctrl.fever_time[ctrl.fever])*g.game.fps) {
              se11.stop();
            }
            // フィーバータイム開始
            if (last_time < gConst.ctrl.fever_time[ctrl.fever]*g.game.fps) {
              ctrl.fever += 1;
              // 何かしらフィーバー演出の開始を:ライト表現を
              ctrl.succes_step = 30;
              // フィーバーメッセージ
              ctrl.fever_msg_step = 30;
              gLabel_story_msg1.text = "スコア "+ctrl.fever+" 倍！！";
              gLabel_story_msg1.x = 450; //gConst.eyecatch.x1+gConst.eyecatch.x;
              gLabel_story_msg1.y = 200;
              gLabel_story_msg1.anchorX = 0.5;
              gLabel_story_msg1.invalidate();
              gLabel_story_msg1.show();    
            }
            // 何かしらフィーバー演出の継続を
            if (ctrl.fever_msg_step > 0) {
              ctrl.fever_msg_step -= 1;
              let x=450; //gConst.eyecatch.x1+gConst.eyecatch.x*(ctrl.fever_msg_step/30); //gConst.eyecatch.time
              if (ctrl.fever_msg_step < 20) { 
                gLabel_story_msg1.opacity = ctrl.fever_msg_step/20;
              }
              gLabel_story_msg1.x = x; //gConst.eyecatch.x1+gConst.eyecatch.x*(ctrl.fever_msg_step/gConst.eyecatch.time);
              gLabel_story_msg1.invalidate();
              if (ctrl.fever_msg_step <= 0) { 
                gLabel_story_msg1.hide();
                gLabel_story_msg1.opacity = 1;
              }
            } 
            */ 
          }
          // BGMを開始する(gConst.bgm_start秒だけ遅らせてスタート)
          if (jud_bgm == 0 && last_time <= g.game.fps*(gConst.time_main-gConst.bgm_start)) { 
            jud_bgm = 1;
            // bgm01.stop();
            // bgm01.play();
            // bgm01.play().changeVolume(gConst.bgm01_volume_def); // 音量調整が必要な場合はこちらを利用する
          }
          // ラスト５秒描写の追加
          if (last_time <= 5*g.game.fps && last_time != 0) {
            if (last_time%g.game.fps == 0) { 
              gRect_back_countdown.opacity += 0.1;
              gRect_back_countdown.modified();
              gRect_back_countdown.show();
            } else if (last_time%g.game.fps == g.game.fps/2) { 
              gRect_back_countdown.hide();
            }
          }
          // BGMをラスト３秒で徐々に小さくする
          if (g.game.audio.music.volume != 0) {
            if (last_time <= 3*g.game.fps && last_time != 0) {
              g.game.audio.music.volume = (last_time/(3*g.game.fps)) * gConst.bgm_volume/10;
            } 
          }
          // last_timeが0になったとき、遷移処理を行いステータスを更新する
          if (last_time <= 0) {
            // タイムアップ表示準備 ←今回はタイムアップ画像は使わない
            if (jud_finish == 0) { timeup_step = g.game.fps*3 } // finish表示しているときはtimeup表示は行わない
            // BGM停止(※ラスト３秒停止を使わず、終了でstopさせたい場合)
            // bgm01.stop();
            // 残り時間表記は非表示にする
            sLabel_last_time.hide();
            // ステータスを更新して次へ
            scene_status = gConst.scene_losstime; // タイムアップで次に進む
            last_time = gConst.time_losstime*g.game.fps;
          }    
        }
        // losstime時間
        if (scene_status == gConst.scene_losstime) {
          // ロスタイムカウント：ブザービーター中はカウントしない
          if (jud_action == 0) { losstime_cnt += 1 }
          // タイムアップ表示アニメーション
          if (timeup_step > 0) {
            timeup_step -= 1;
            gSprite_timeup.scaleX = 1-timeup_step/(3*g.game.fps);
            gSprite_timeup.scaleY = 1-timeup_step/(3*g.game.fps);
            gSprite_timeup.opacity = 0.8*(1-timeup_step/(3*g.game.fps)); 
            gSprite_timeup.modified();
          }
          // スコア確定の3秒後
          if (losstime_cnt == 3*g.game.fps) {
            // tips利用の場合でtips2に登録がある場合は表示
            if (gConst.use_tips >= 1) {
              if (gConst.tips2.number > 0) {
                // tips.id = 100+Math.ceil(random.generate()*gConst.tips2.number);
                // gFunc.add_log(log[1].text, log[1].count++, g.game.age, "tips2 id: "+tips.id, system.dbg);
              }
            }
            // 自己べ利用の場合は自己べ結果の表示
            if (gConst.use_best == 1) {
              // スコアプラスと表示が被るのでそっちは消す
              gLabel_score_plus.hide();
              // 自己べの表示
              if (best.jud == 1) {
                sLabel_best.text = "自己ベ更新！";
                // sLabel_best.font = font06; // fontの変更をする場合
                sLabel_best.fontSize = 20;
              }
              sLabel_best.x = 350;
              sLabel_best.y = 50;
              sLabel_best.anchorY = 1;
              sLabel_best.invalidate();
              sLabel_best.show();
            }
          }
        }
        // after時間
        //   さらに何かあれば。（元々はアツマールのランキング自動表示用で今は何もなし
        if (scene_status == gConst.scene_after) {
        }
      }

      // カウントダウン結果として表示
      if (system.dbg >= 0) { // 折り畳み用
        if (gConst.time_round == 1) { sLabel_last_time.text = ""+Math.ceil(last_time/g.game.fps) }
        else                        { sLabel_last_time.text = ""+Math.floor(last_time/g.game.fps) }
        sLabel_last_time.invalidate();
      }

      // tips表示中の処理
      if (gConst.use_tips >= 1) {
        // 表示IDが設定されているとき
        if (tips.id > 0) {
          // tips1で表示回数maxを超えているときは表示せず終了
          if (tips.id < 100 && tips.cnt1 <= gConst.tips1.times[tips.id]) {
            tips.id = 0;
            tips.status = 0;
          }
          // tips.idの指定が行われたときの表示処理
          else if (tips.id > 0 && tips.status == 0) {
            tips.status = 1;
            // tips1の場合
            if (tips.id < 100) { // 場面ごとのtips
              sLabel_tips.text = ""+gConst.tips1.text[tips.id];
              sRect_tips.width = gConst.tips1.width[tips.id];
              // データの更新
              tips.cnt1[tips.id] += 1;
              tips.step = gConst.tips1.times[tips.id]*g.game.fps;
              // ★★コメント風の対応★★ 表示時間(フレーム数)の指定
              // tips.step = gConst.tips1.step_max;
              // tips.step = gConst.lost.time*(1+gConst.lost.len/g.game.width);
              tips.step = 150;
              // ★★コメント風の対応★★ テキストの初期位置
              sLabel_tips.x = g.game.width;
              // ローカルストレージに登録
              if (gConst.jud_localstorage == 1) {
                localstorage_data.tips1_cnt[tips.id] = tips.cnt1[tips.id]+1;
                let localstorage_set = JSON.stringify(localstorage_data);
                localStorage.setItem(system.game, localstorage_set);
                gFunc.add_log(log[1].text, log[1].count++, g.game.age, "tips.id:"+tips.id+" ("+tips.cnt1[tips.id]+")", system.dbg);
              }
            }
            // tips2の場合 
            else { // 終了後のtips
              sLabel_tips.text = ""+gConst.tips2.text[tips.id%100];
              sRect_tips.width = gConst.tips2.width;
            }
            sLabel_tips.invalidate();
            sLabel_tips.show();
            sRect_tips.show();
            sSprite_tips.show();
          }
          // 表示時間カウントダウン
          else if (tips.id > 0 && tips.id < 100 && tips.status == 1) {
            tips.step -= 1;
            // ★★コメント風の対応：さらに初期表示制御★★ まだ未操作の間は表示を続ける
            if (ctrl.click == 0 && tips.step < 30) { tips.step = 30 }
            // ★★コメント風の対応★★ スクロールさせる
            if (tips.step > 135 || tips.step < 30) {
              sLabel_tips.x -= g.game.width/gConst.tips1.time;
              sLabel_tips.invalidate();
            }
            // 表示を終了
            if (tips.step <= 0) {
              // 表示を消去
              sLabel_tips.text = "";
              sLabel_tips.invalidate();
              sLabel_tips.hide();
              sRect_tips.hide();
              sSprite_tips.hide();
              // データのリセット
              tips.id = 0;
              tips.status = 0;  
            }
            // gFunc.dbg_message(sLabel_debug_msg, "tips.step: "+tips.step, 0, system.dbg);
          }
        }
      }

      // help・一枚ものを利用している場合のアニメーション処理
      if (gConst.use_help == 1) {      
        if (help1.step > 0) {
          help1.step -= 1;
          let scale;
          if (help1.jud == 1) { 
            scale = help1.step/gConst.help1.step_max;
          } else { 
            scale = 1-help1.step/gConst.help1.step_max;
          }
          sSprite_help1.x = sSprite_button_help.x-(sSprite_button_help.x-help1.x)*scale;
          sSprite_help1.y = sSprite_button_help.y-(sSprite_button_help.y-help1.y)*scale;
          sSprite_help1.scaleX = scale*help1.scale;
          sSprite_help1.scaleY = scale*help1.scale;
          sSprite_help1.modified();
        }
      }

      // help・詳細（複数ページ）を利用している場合のアニメーション処理
      if (gConst.use_help == 3) {      
        if (help2.cut_step > 0 & help2.jud == 1) {
          help2.cut_step -= 1;
          if (help2.cut_step == 0) {
            help2.cut_step = gConst.help2.waite[help2.page];
            sSprite_help2List[help2.page][help2.cut].entity.hide();
            if (help2.cut == gConst.help2.cut[help2.page]) { help2.cut = 1 }
            else                                           { help2.cut += 1 }
            sSprite_help2List[help2.page][help2.cut].entity.show();
          }
        }          
      }

      // newsの表示切替＆既読処理
      if (gConst.use_news == 1) {
        if (news.jud == 1) {
          news.jud = 0;
          // 日付を比較。新しいものの場合は色を変える
          let date1 = new Date();
          let date2 = new Date(gConst.news.date[news.n][0], gConst.news.date[news.n][1]-1, gConst.news.date[news.n][2]);
          date2.setDate(date2.getDate() + 2); 
          if (date1.getTime() < date2.getTime()) { // 更新情報が１日以内の場合
            tLabel_new0.textColor = "red";
          } else {
            date2.setDate(date2.getDate() + 7); 
            if (date1.getTime() < date2.getTime()) { // 更新情報が１週以内の場合
              tLabel_new0.textColor = "blue";
            } else {
              tLabel_new0.textColor = "gray";
            }
          }
          // テキストの更新
          tLabel_new0.text = ""+gConst.news.id[news.n];
          tLabel_new1.text = ""+gConst.news.msg1[news.n];
          tLabel_new2.text = ""+gConst.news.msg2[news.n];
          tLabel_new0.invalidate();
          tLabel_new1.invalidate();
          tLabel_new2.invalidate();
          // 既読情報を更新する
          if (news.check[news.n] != 1) {
            news.check[news.n] = 1;
            //ローカルストレージに既読情報を記録
            let id = gConst.news.id[news.n];
            if (gConst.jud_localstorage == 1) {
              localstorage_data.check_news[id] = 1;
              let localstorage_set = JSON.stringify(localstorage_data);
              localStorage.setItem(system.game, localstorage_set);
            }
            // ボタンの未読件数表示を更新
            news.unread_cnt = 0;
            for (let i=1; i<=gConst.news.number; i++) {
              if (news.check[i] == 0) { news.unread_cnt += 1 }
            }
            let text = "お知らせ";
            if (news.unread_cnt > 0) {
              text = "お知らせ ("+news.unread_cnt+")";
              tLabel_button_new.textColor = "crimson";
            } else {
              tLabel_button_new.textColor = "gray";
            }
            tLabel_button_new.text = ""+text;
            tLabel_button_new.invalidate();
          }
    
        }
      }

      // 自己べの更新監視
      if (gConst.use_best == 1) {
        // ゲーム開始以降、scoreがbestを超えているかどうかを監視する
        if (scene_status >= gConst.scene_title && score > best.score) {
          best.jud = 1;
          best.score = score;
          // ローカルストレージに自己べを登録する
          if (gConst.jud_localstorage == 1) {
            localstorage_data.best = best.score;
            let localstorage_set = JSON.stringify(localstorage_data);
            localStorage.setItem(system.game, localstorage_set);
          }
        }
      }

    });
    // }, 1000/g.game.fps);





    // ～～～～テンプレ適宜追加分～～～～

    // ＝＝デバッグ用メッセージの画面上表示機能の利用＝＝
    if (gConst.use_add_log == 1) { // 折り畳み兼用
      // 各ログ区分用ボタンの画像
      var sSprite_button_logList = {}
      for (let i=1; i<=log[0].max; i++) {
        const sSprite_button_log = { entity: gEntity.sSprite_button_setting2(scene1, gConst, 1, 8, 936, 270+30*i) }
        sSprite_button_logList[i] = sSprite_button_log;
        if (system.dbg > 0) { layer.L[4].append(sSprite_button_logList[i].entity) } 
      }

      // 各ログ区分用ボタンをクリックした時
      for (let log_no=1; log_no<=log[0].max; log_no++) {
        sSprite_button_logList[log_no].entity.onPointUp.add(() => {
          // 表示中の場合は閉じる
          if (log[0].id == log_no) {
            log[0].id = 0;
            layer.L5_log.hide();
          }
          // 非表示または他のログが表示中の場合は開く
          else {
            log[0].id = log_no;
            log[0].page = 0;
            // ログを表示
            layer.L5_log.show();
            // １ページ目をセット
            for (let i=0; i<30; i++) {
              if (i < log[log_no].count) { sLabel_logList[i].entity.text = ""+log[log_no].text[i] }
              else                       { sLabel_logList[i].entity.text = "<"+i+">" }
              sLabel_logList[i].entity.invalidate();
            }
          }
        });
      }

      // ログ表示用台紙
      const sRect_log = gEntity.sRect_log(scene1);
      layer.L5_log.append(sRect_log);
      // ログ表示用ラベル
      var sLabel_logList = {};
      // for (let i=0; i<=gConst.result_max; i++) {
      for (let i=0; i<30; i++) { // 1画面には30行の表示
        const sLabel_log = { entity: gEntity.sLabel_log(scene1, gConst.font000, i) }
        sLabel_logList[i] = sLabel_log;
        layer.L5_log.append(sLabel_logList[i].entity);
      }
      // ログのprevボタンの画像
      var sSprite_button_log_prev = gEntity.sSprite_button_setting2(scene1, gConst, 1, 9, 825, 20);
      layer.L5_log.append(sSprite_button_log_prev);
      // ログのnextボタンの画像
      var sSprite_button_log_next = gEntity.sSprite_button_setting2(scene1, gConst, 1, 6, 855, 20);
      layer.L5_log.append(sSprite_button_log_next);
      // ログのcloseボタンの画像
      var sSprite_button_log_close = gEntity.sSprite_button_setting2(scene1, gConst, 1, 8, 885, 20);
      layer.L5_log.append(sSprite_button_log_close);

      // ログのprevボタンをクリックした時
      sSprite_button_log_prev.onPointUp.add(() => {
        // 次のページ判定。最後尾に飛ぶかどうか。
        if (log[0].page == 0) {
          log[0].page = Math.ceil(log[log[0].id].count/30)-1;
          if (log[0].page < 0) { log[0].page = 0 }
        } else { 
          log[0].page -= 1;
        }
        // log_page_nのページ分を表示
        for (let i=0; i<30; i++) {
          if (30*log[0].page+i < log[log[0].id].count) { sLabel_logList[i].entity.text = ""+log[log[0].id].text[30*log[0].page+i] }
          else                                         { sLabel_logList[i].entity.text = "<"+i+">" }
          sLabel_logList[i].entity.invalidate();
        } 
        // gFunc.dbg_message(sLabel_debug_msg, "ログprev "+log[0].page, 0, system.dbg);
      });
      // ログのnextボタンをクリックした時
      sSprite_button_log_next.onPointUp.add(() => {
        // 次のページ判定。1ページに戻るかどうか。
        if (log[log[0].id].count < 30*(log[0].page+1)) { log[0].page = 0 }
        else                                           { log[0].page += 1 }
        // log_page_nのページ分を表示
        for (let i=0; i<30; i++) {
          if (30*log[0].page+i < log[log[0].id].count) { sLabel_logList[i].entity.text = ""+log[log[0].id].text[30*log[0].page+i] }
          else                                         { sLabel_logList[i].entity.text = "<"+i+">" }
          sLabel_logList[i].entity.invalidate();
        } 
        // gFunc.dbg_message(sLabel_debug_msg, "ログnext "+log[0].page, 0, system.dbg);
      });
      // ログのcloseボタンをクリックした時
      sSprite_button_log_close.onPointUp.add(() => {
        log[0].id = 0;
        layer.L5_log.hide();
      });
    }

    // ＝＝設定ボタンの利用＝＝
    if (gConst.use_setting == 1) { // 折り畳み兼用
      // BGMボタン用画像
      var sSprite_button_BGM = gEntity.sSprite_button_setting(scene1, gConst, 0, 2, 2);
      if (gConst.bgm_button == 2) { 
        set_bgm = 0;
        g.game.audio.music.volume = 0;
        sSprite_button_BGM.srcX += gConst.button_src_interval;
      }
      // if (gConst.set_bgm == 1) { layer.L[4].append(sSprite_button_BGM) }
      // SEボタン用画像
      var sSprite_button_SE = gEntity.sSprite_button_setting(scene1, gConst, 0, 3, 1);
      if (gConst.se_button == 2) { 
        set_se = 0;
        g.game.audio.sound.volume = 0;
        sSprite_button_SE.srcX += gConst.button_src_interval;
      }
      // if (gConst.set_se == 1) { layer.L[4].append(sSprite_button_SE) }  
      // バックボタン用画像
      var sSprite_button_back = gEntity.sSprite_button_setting(scene1, gConst, 0, 4, 5);
      if (system.dbg == 2 || gConst.jud_rensyu == 1) { layer.L[4].append(sSprite_button_back) }  
      sSprite_button_back.hide();
      // リスタートボタン用画像
      var sSprite_button_restart = gEntity.sSprite_button_setting(scene1, gConst, 0, 5, 1);
      if (system.dbg == 2 || gConst.jud_rensyu == 1) { layer.L[4].append(sSprite_button_restart) }      
      if (system.open == 1) layer.L[4].append(sSprite_button_restart)
      sSprite_button_restart.hide();

      // リスタートボタンで戻ってきた場合は、last_timeを1にセットしてタイトルを即飛ばす
      if (gConst.jud_restart == 2) {
        // gConst.jud_restart = 0;
        last_time = 1;
      }
        
      // BGMボタンが押されたとき
      sSprite_button_BGM.onPointUp.add(() => {
        // 現在オン状態の場合はオフに切り替える
        if (set_bgm == 1) {
          set_bgm = 0;
          gConst.bgm_button = 2;
          jud_bgm = 0;
          sSprite_button_BGM.srcX += gConst.button_src_interval;
          // BGM全体の音量を０にする
          g.game.audio.music.volume = 0;
        } else {
          set_bgm = 1;
          gConst.bgm_button = 1;
          sSprite_button_BGM.srcX -= gConst.button_src_interval;
          // BGM全体の音量を現在のvolumeの値にする
          g.game.audio.music.volume = gConst.bgm_volume/10;
        }
        sSprite_button_BGM.modified();
        // ローカルストレージに値を保存
        if (gConst.jud_localstorage == 1) {
          localstorage_data.bgm_button = gConst.bgm_button;
          let localstorage_set = JSON.stringify(localstorage_data);
          localStorage.setItem(system.game, localstorage_set);
        }
      });  
      // SEボタンが押されたとき
      sSprite_button_SE.onPointUp.add(() => {
        // 現在オン状態の場合はオフに切り替える
        if (set_se == 1) {
          set_se = 0;
          gConst.se_button = 2;
          sSprite_button_SE.srcX += gConst.button_src_interval;
          // SE全体の音量を０にする
          g.game.audio.sound.volume = 0;
        } else {
          set_se = 1;
          gConst.se_button = 1;
          sSprite_button_SE.srcX -= gConst.button_src_interval;
          // SE全体の音量を現在のvolumeの値にする
          g.game.audio.sound.volume = gConst.se_volume/10;
        }
        sSprite_button_SE.modified();
        // ローカルストレージに値を保存
        if (gConst.jud_localstorage == 1) {
          localstorage_data.se_button = gConst.se_button;
          let localstorage_set = JSON.stringify(localstorage_data);
          localStorage.setItem(system.game, localstorage_set);
        }
      });  
      // 戻るボタンをクリックしたとき
      sSprite_button_back.onPointUp.add(() => {
        g.game.vars.gameState = { score: 0 };
        gConst.jud_restart = 1;
        // bgm01.stop();
        se00.stop();
        g.game.replaceScene(createScene1(param));
      });  
      // リスタートボタンをクリックしたとき
      sSprite_button_restart.onPointUp.add(() => {
        g.game.vars.gameState = { score: 0 };
        gConst.jud_restart = 2;
        // bgm01.stop();
        se00.stop();
        g.game.replaceScene(createScene1(param));
      });
    }

    // ＝＝詳細設定の利用＝＝
    if (gConst.use_setting2 == 1) { // 折り畳み兼用
      var jud_setting = 0;	// 詳細設定表示フラグ

      // 詳細設定ボタン用画像
      var sSprite_button_setting = gEntity.sSprite_button_setting(scene1, gConst, 0, 0, 0);
      layer.L[4].append(sSprite_button_setting);  
      // 詳細設定ボタンが押されたとき
      sSprite_button_setting.onPointUp.add(() => {
        // 現在オン状態の場合はオフに切り替える
        if (jud_setting == 1) {
          jud_setting = 0;
          sSprite_button_setting.srcX -= gConst.button_src_interval;
          layer.L4_setting.hide();
        } else {
          jud_setting = 1;
          sSprite_button_setting.srcX += gConst.button_src_interval;
          layer.L4_setting.show();
        }
      });
  
      // 詳細設定用台紙
      var sRect_setting_back = gEntity.sRect_setting_back(scene1, gConst);
      layer.L4_setting.append(sRect_setting_back);
  
      // 詳細設定・BGMボリュームの項目用ラベル
      var sLabel_setting_text_BGM = gEntity.sLabel_setting_text(scene1, gConst.font000, system, gConst, 2, "BGM_Volume:");
      layer.L4_setting.append(sLabel_setting_text_BGM);
      // 詳細設定・BGMボリュームの設定値用ラベル
      var sLabel_setting_value_BGM = gEntity.sLabel_setting_value(scene1, gConst.font000, system, gConst, 2, gConst.bgm_volume);
      layer.L4_setting.append(sLabel_setting_value_BGM);
      // 詳細設定・BGMボリュームのUP用ボタン
      var sSprite_setting_up_BGM = gEntity.sSprite_button_updown(scene1, gConst, 0, 0, 2);
      layer.L4_setting.append(sSprite_setting_up_BGM);  
      // 詳細設定・BGMボリュームのdown用ボタン
      var sSprite_setting_down_BGM = gEntity.sSprite_button_updown(scene1, gConst, 1, 1, 2);
      layer.L4_setting.append(sSprite_setting_down_BGM);
      // BGMボリュームUPボタンが押されたとき
      sSprite_setting_up_BGM.onPointUp.add(() => {
        if (gConst.bgm_volume < 9) {
          gConst.bgm_volume += 1;
          sLabel_setting_value_BGM.text = ""+gConst.bgm_volume;
          sLabel_setting_value_BGM.invalidate();
        }
        // BGMボタン自体がonの場合のみ、実際の音量を変更する
        if (set_bgm == 1) { g.game.audio.music.volume = gConst.bgm_volume/10 }
        // ローカルストレージに値を保存
        if (gConst.jud_localstorage == 1) {
          localstorage_data.bgm_volume = gConst.bgm_volume;
          let localstorage_set = JSON.stringify(localstorage_data);
          localStorage.setItem(system.game, localstorage_set);
        }
      });  
      // BGMボリュームdownボタンが押されたとき
      sSprite_setting_down_BGM.onPointUp.add(() => {
        if (gConst.bgm_volume > 1) {
          gConst.bgm_volume -= 1;
          sLabel_setting_value_BGM.text = ""+gConst.bgm_volume;
          sLabel_setting_value_BGM.invalidate();
        }
        // BGMボタン自体がonの場合のみ、実際の音量を変更する
        if (set_bgm == 1) { g.game.audio.music.volume = gConst.bgm_volume/10 }
        // ローカルストレージに値を保存
        if (gConst.jud_localstorage == 1) {
          localstorage_data.bgm_volume = gConst.bgm_volume;
          let localstorage_set = JSON.stringify(localstorage_data);
          localStorage.setItem(system.game, localstorage_set);
        }
      });
    
      // 詳細設定・SEボリュームの項目用ラベル
      var sLabel_setting_text_SE = gEntity.sLabel_setting_text(scene1, gConst.font000, system, gConst, 3, "SE_Volume:");
      layer.L4_setting.append(sLabel_setting_text_SE);  
      // 詳細設定・SEボリュームの設定値用ラベル
      var sLabel_setting_value_SE = gEntity.sLabel_setting_value(scene1, gConst.font000, system, gConst, 3, gConst.se_volume);
      layer.L4_setting.append(sLabel_setting_value_SE);  
      // 詳細設定・SEボリュームのUP用ボタン
      var sSprite_setting_up_SE = gEntity.sSprite_button_updown(scene1, gConst, 0, 0, 3);
      layer.L4_setting.append(sSprite_setting_up_SE);  
      // 詳細設定・SEボリュームのdown用ボタン
      var sSprite_setting_down_SE = gEntity.sSprite_button_updown(scene1, gConst, 1, 1, 3);
      layer.L4_setting.append(sSprite_setting_down_SE);
      // SEボリュームUPボタンが押されたとき
      sSprite_setting_up_SE.onPointUp.add(() => {
        if (gConst.se_volume < 9) {
          gConst.se_volume += 1;
          sLabel_setting_value_SE.text = ""+gConst.se_volume;
          sLabel_setting_value_SE.invalidate();
        }
        // SEボタン自体がonの場合のみ、実際の音量を変更する
        if (set_se == 1) { g.game.audio.sound.volume = gConst.se_volume/10 }
        // ローカルストレージに値を保存
        if (gConst.jud_localstorage == 1) {
          localstorage_data.se_volume = gConst.se_volume;
          let localstorage_set = JSON.stringify(localstorage_data);
          localStorage.setItem(system.game, localstorage_set);
        }
      });  
      // SEボリュームdownボタンが押されたとき
      sSprite_setting_down_SE.onPointUp.add(() => {
        if (gConst.se_volume > 1) {
          gConst.se_volume -= 1;
          sLabel_setting_value_SE.text = ""+gConst.se_volume;
          sLabel_setting_value_SE.invalidate();
        }
        // SEボタン自体がonの場合のみ、実際の音量を変更する
        if (set_se == 1) { g.game.audio.sound.volume = gConst.se_volume/10 }
        // ローカルストレージに値を保存
        if (gConst.jud_localstorage == 1) {
          localstorage_data.se_volume = gConst.se_volume;
          let localstorage_set = JSON.stringify(localstorage_data);
          localStorage.setItem(system.game, localstorage_set);
        }
      });
    
    }

    // ＝＝メンテの利用＝＝
    if (gConst.use_mente == 1) { // 折り畳み兼用
      // ☆メンテ中スクリーン
      var sRect_mente = gEntity.sRect_mente(scene1);
      if (system.test > 0) { layer.L[5].append(sRect_mente) }

      // ☆メンテ中メッセージ
      var sLabel_mente = gEntity.sLabel_mente(scene1, gConst.font001, "メンテ中");
      if (system.test > 0) { layer.L[5].append(sLabel_mente) }  
      // ☆メンテ中メッセージが押されたとき
      sLabel_mente.onPointUp.add(() => {
        if (system.test > 1) { 
          scene_status = gConst.scene_title;
          sRect_mente.hide();
          sLabel_mente.hide();
        }
      });
    }

    // ＝＝ヘルプの利用＝＝
    if (gConst.use_help >= 1) { // 折り畳み兼用
      // helpボタンの画像
      var sSprite_button_help = gEntity.sSprite_button_setting(scene1, gConst, 0, 1, 3);
      layer.L[4].append(sSprite_button_help);
      // helpボタンがクリックされたとき
      sSprite_button_help.onPointUp.add(ev => {
        if (gConst.use_help == 1) {      
          if      (help1.jud == 1) { help1.jud = 2 }  
          else if (help1.jud == 2) { help1.jud = 1 }
          if (help1.jud != 0) { help1.step = gConst.help1.step_max }
        }
        else if (gConst.use_help == 2) {
          if (gConst.help2.page > 0) {
            if (help2.jud == 1) { 
              help2.jud = 0;
              help2.step = 0;
              // ヘルプの階層を非表示
              layer.L4_help.hide();
              // ヘルプの画像を非表示
              sSprite_help2List[help2.page][help2.cut].entity.hide();
            } else if (help2.jud == 0) { 
              help2.jud = 1; 
              help2.cut = 1;
              help2.cut_step = gConst.help2.waite[help2.page];
              // ヘルプの画像を表示
              sSprite_help2List[help2.page][1].entity.show();
              // ページラベルを表示
              sLabel_help_page.text = "page "+help2.page+" / "+gConst.help2.page;
              sLabel_help_page.invalidate();
              // ヘルプの階層を表示
              layer.L4_help.show();
            } 
          }
          gFunc.dbg_message(sLabel_debug_msg, "help2 jud:"+help2.jud+", page:"+help2.page+", cut:"+help2.cut, 0, system.dbg);
          // gFunc.dbg_message(sLabel_debug_msg, "aaaa", 0, system.dbg);
        } 
      });

      // help・一枚ものを利用する場合
      if (gConst.use_help == 1) {      
        // 変数
        var help1 = {
          jud: 0,
          step: 0,
          scale: 1,
          x: gConst.help1.x,
          y: gConst.help1.y,
        }

        // help・一枚ものの画像
        var sSprite_help1 = gEntity.sSprite_help1(scene1);
        // ＝＝表示サイズと位置を調整＝＝
        // タイトル画面における表示位置/範囲
        let set_x=gConst.help1.x; // anchorX=1として右端を基準
        let set_y=gConst.help1.y;
        let set_width=(set_x-g.game.width/2)*2;
        let set_height=g.game.height-set_y;
        // 用意した画像のサイズ
        let width=sSprite_help1.width;
        let height=sSprite_help1.height
        // 画面サイズ比より高さが大きい時
        if (height/width < set_width/set_height) {
          // 縮尺は高さ基準
          help1.scale = set_height/height;
          // 位置はxを再設定
          help1.x = g.game.width/2+(width/2)*set_height/height;
        }
        // 画面サイズ比より横幅が大きい時
        else {
          // 縮尺は横幅基準
          help1.scale = set_width/width;
          // 位置はyを再設定
          help1.y = g.game.height-height*set_width/width;
        }
        sSprite_help1.x = help1.x;
        sSprite_help1.y = help1.y;         
        sSprite_help1.scaleX = help1.scale;
        sSprite_help1.scaleY = help1.scale;
        layer.L[4].append(sSprite_help1);
        // ★★デバッグ★★
        // gFunc.dbg_message(sLabel_debug_msg, "help1 x:"+sSprite_help1.x+", y:"+sSprite_help1.y, 0, system.dbg);
        // help・一枚ものがクリックされたとき
        sSprite_help1.onPointUp.add(ev => {
          if      (help1.jud == 1) { help1.jud = 2 }  
          else if (help1.jud == 2) { help1.jud = 1 }
          if (help1.jud != 0) { help1.step = gConst.help1.step_max }
        });
      }

      // help・詳細(複数ページ)を利用する場合
      if (gConst.use_help == 2) {  
        // gFunc.add_log(log[1].text, log[1].count++, g.game.age, "help_id確認: "+gConst.help2.id[1][1], system.dbg);
        // 変数
        var help2 = {
          jud: 0,
          page: 1,
          cut: 0,
          cut_step: 0,
        } 
        // ヘルプ画像のリスト
        var sSprite_help2List = {};
        for (let i=1; i<=gConst.help2.page; i++) {
          sSprite_help2List[i] = {};
          for (let j=1; j<=gConst.help2.cut[i]; j++) {
            const sSprite_help2 = { entity: gEntity.sSprite_help2(scene1, gConst.help2.id[i][j]) }
            sSprite_help2List[i][j] = sSprite_help2;
            layer.L4_help.append(sSprite_help2List[i][j].entity);
          }
        }

        // ヘルプ画面のページ情報のラベル
        var sLabel_help_page = gEntity.sLabel_help_page(scene1, gConst.font001, gConst);
        layer.L4_help.append(sLabel_help_page);
    
        // ヘルプ用prevボタンの画像
        var sSprite_help_prev = gEntity.sSprite_button_setting2(scene1, gConst, 1, 9, 810, 72);
        layer.L4_help.append(sSprite_help_prev);
        // ヘルプ用nextボタンの画像
        var sSprite_help_next = gEntity.sSprite_button_setting2(scene1, gConst, 1, 6, 845, 72);
        layer.L4_help.append(sSprite_help_next);
        // ヘルプ用closeボタンの画像
        var sSprite_help_close = gEntity.sSprite_button_setting2(scene1, gConst, 1, 8, 880, 72);
        layer.L4_help.append(sSprite_help_close);

        // ヘルプ用prevボタンをクリックしたとき
        sSprite_help_prev.onPointUp.add(ev => {
          // 現在のページを非表示
          sSprite_help2List[help2.page][help2.cut].entity.hide();
          // データを次のページに更新
          if (help2.page == 1) { help2.page = gConst.help2.page }
          else                 { help2.page -= 1 }
          help2.cut = 1;
          help2.cut_step = gConst.help2.waite[help2.page];
          // 次のページを表示
          sSprite_help2List[help2.page][1].entity.show();
          // ページラベルを更新
          sLabel_help_page.text = "page "+help2.page+" / "+gConst.help2.page;
          sLabel_help_page.invalidate();
        });
        // ヘルプ用nextボタンをクリックしたとき
        sSprite_help_next.onPointUp.add(ev => {
          // 現在のページを非表示
          sSprite_help2List[help2.page][help2.cut].entity.hide();
          // データを次のページに更新
          if (help2.page == gConst.help2.page) { help2.page = 1 }
          else                                 { help2.page += 1 }
          help2.cut = 1;
          help2.cut_step = gConst.help2.waite[help2.page];
          // 次のページを表示
          sSprite_help2List[help2.page][1].entity.show();
          // ページラベルを更新
          sLabel_help_page.text = "page "+help2.page+" / "+gConst.help2.page;
          sLabel_help_page.invalidate();
        });
        // ヘルプ用closeボタンをクリックしたとき
        sSprite_help_close.onPointUp.add(ev => {
          help2.jud = 0;
          help2.step = 0;
          // ヘルプの階層を非表示
          layer.L4_help.hide();
          // ヘルプの画像を非表示
          sSprite_help2List[help2.page][help2.cut].entity.hide();
        });
      }      
    }

    // ＝＝tipsの利用＝＝
    if (gConst.use_tips >= 1) {
      var tips = {
        id: 0, //表示中のid
        status: 0, // ？？？
        step: 0, // tips1の表示のこり時間
        cnt1: {}, // 通算表示回数
        cnt2: {}, // 今回表示回数制御用    
      }
      // localstorageからtips表示履歴記録を取得する
      for (let i=1; i<=gConst.tips1.number; i++) {
        // データの初期化
        tips.cnt1[i] = 0;
        tips.cnt2[i] = 0;
        // ローカルストレージのデータが存在するときは上書き
        if (gConst.jud_localstorage == 1) {
          if (localstorage_data.tips1_cnt[i] >= 1) { tips.cnt1[i] = localstorage_data.tips1_cnt[i] }
          gFunc.add_log(log[1].text, log[1].count++, g.game.age, "get  localstorage_data.tips_jud[i] (i:"+i+"): "+localstorage_data.tips1_cnt[i], system.dbg);
        }
      }

      // tips表示用エンティティの一式
      var sRect_tips = gEntity.sRect_tips(scene1, gConst);
      var sSprite_tips = gEntity.sSprite_tips(scene1, gConst);
      var sLabel_tips = gEntity.sLabel_tips(scene1, gConst, gConst.font001, "テストテスト");
      // layer.L[4].append(sRect_tips);
      // layer.L[4].append(sSprite_tips);
      layer.L[4].append(sLabel_tips);
    }

    // ＝＝更新情報の利用＝＝
    if (gConst.use_news == 1) {
      var news = {
        n: gConst.news.number,
        jud: 0,
        unread_cnt: 0,
        check: {},
      }
      // ローカルストレージから既読情報を取得する  
      for (let i=1; i<=gConst.news.number; i++) {
        news.check[i] = 0;
        let id=gConst.news.id[i];
        if (gConst.jud_localstorage == 1) {
          if (localstorage_data.check_news[id] >= 1) { news.check[i] = localstorage_data.check_news[id] }
          gFunc.add_log(log[1].text, log[1].count++, g.game.age, "get  localstorage_data.check_news[id] (news_id:"+id+"): "+localstorage_data.check_news[id], system.dbg);
        }
        if (news.check[i] == 0) { news.unread_cnt += 1 }
      }

      // 更新情報表示用ボタンの画像
      var tSprite_button_new = gEntity.tSprite_button_new(scene1);
      layer.S1[4].append(tSprite_button_new);
      // 更新情報表示用ボタンのラベル
      var tLabel_button_new = gEntity.tLabel_button_new(scene1, gConst.font000, gConst, "お知らせ");
      let text = "お知らせ";
      if (news.unread_cnt > 0) {
        text = "お知らせ ("+news.unread_cnt+")";
        tLabel_button_new.textColor = "crimson";
      }
      tLabel_button_new.text = ""+text;
      tLabel_button_new.invalidate();
      layer.S1[4].append(tLabel_button_new);

      // お知らせボタンを押したとき
      tSprite_button_new.onPointUp.add(() => {
        news.jud = 1;
        tSprite_button_new_prev.hide();
        if (gConst.news.number <= 1) { tSprite_button_new_next.hide() }
        else                         { tSprite_button_new_next.show() }
        layer.S1_new.show();
        tLabel_new0.text = ""+gConst.news.id[news.n];
        tLabel_new1.text = ""+gConst.news.msg1[news.n];
        tLabel_new2.text = ""+gConst.news.msg2[news.n];
        tLabel_new0.invalidate();
        tLabel_new1.invalidate();
        tLabel_new2.invalidate();
      });
  
    
      // 更新情報表示の台紙
      var tRect_new = gEntity.tRect_new(scene1);
      layer.S1_new.append(tRect_new);
  
      // 更新情報表示のラベル
      var tLabel_new0 = gEntity.tLabel_new(scene1, gConst.font000, "black", 0, ""+gConst.news.id[news.n]);
      var tLabel_new1 = gEntity.tLabel_new(scene1, gConst.font000, "gray", 1, ""+gConst.news.msg1[news.n]);
      var tLabel_new2 = gEntity.tLabel_new(scene1, gConst.font000, "gray", 2, ""+gConst.news.msg2[news.n]);
      layer.S1_new.append(tLabel_new0);
      layer.S1_new.append(tLabel_new1);
      layer.S1_new.append(tLabel_new2);
    
      // 更新情報表示切替ボタンの画像
      var tSprite_button_new_prev = gEntity.tSprite_button_new_setting(scene1, gConst, 1);
      var tSprite_button_new_next = gEntity.tSprite_button_new_setting(scene1, gConst, 0);
      layer.S1_new.append(tSprite_button_new_prev);
      layer.S1_new.append(tSprite_button_new_next);
  
      // 更新情報prevを押したとき
      tSprite_button_new_prev.onPointUp.add(() => {
        if (news.n < gConst.news.number) {  
          news.jud = 1;
          if (news.n == 1) { tSprite_button_new_next.show() }
          news.n += 1;
          if (news.n == gConst.news.number) { tSprite_button_new_prev.hide() }
          news.jud = 1;
          tLabel_new0.text = ""+gConst.news.id[news.n];
          tLabel_new1.text = ""+gConst.news.msg1[news.n];
          tLabel_new2.text = ""+gConst.news.msg2[news.n];
          tLabel_new0.invalidate();
          tLabel_new1.invalidate();
          tLabel_new2.invalidate();
        }
      });
      // 更新情報nextを押したとき
      tSprite_button_new_next.onPointUp.add(() => {
        if (news.n > 1) {
          news.jud = 1;
          if (news.n == gConst.news.number) { tSprite_button_new_prev.show() }
          news.n -= 1;
          if (news.n == 1) { tSprite_button_new_next.hide() }
          tLabel_new0.text = ""+gConst.news.id[news.n];
          tLabel_new1.text = ""+gConst.news.msg1[news.n];
          tLabel_new2.text = ""+gConst.news.msg2[news.n];
          tLabel_new0.invalidate();
          tLabel_new1.invalidate();
          tLabel_new2.invalidate();
        }
      });
    
    }

    // ＝＝自己べの利用＝＝
    if (gConst.use_best == 1) {
      var best = {
        jud: 0, // 今回自己べを更新したかどうか
        score: 0, // 現在の自己ベのスコア(現プレイ中の値の場合も含む)
      }
      // ローカルストレージからこれまでの自己べを取得する
      if (gConst.jud_localstorage == 1) {
        if (localstorage_data.best >= 1) { best.score = localstorage_data.best }
        gFunc.add_log(log[1].text, log[1].count++, g.game.age, "get  localstorage_data.best: "+localstorage_data.best, system.dbg);
      }

      // 自己ベスト表記用のラベル
      var sLabel_best = gEntity.sLabel_best(scene1, gConst.font001, "自己ベ "+best.score);
      layer.L[4].append(sLabel_best);
      if (best.score == 0) { sLabel_best.hide() }
    }

  });

  // 作成したシーンを返す
  return scene1;
}


exports.main = main;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}