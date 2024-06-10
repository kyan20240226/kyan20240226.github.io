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
      "back","back2","back3",// 背景画像用
      "title","start","timeup", //
      "help",
      "tips",
      "button_new",
      "BGM01","SE00","SE01","SE02","SE03","SE04","SE05","SE06",
      // ＝＝ゲーム個別＝＝
      "h_normal","h_jack","h_queen","h_king",
      "s_normal","s_jack","s_queen","s_king",
      "d_normal","d_jack","d_queen","d_king",
      "c_normal","c_jack","c_queen","c_king",
      "base",
      "succes_s","succes_h",
      "succes_d","succes_c",
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
    gFunc.dbg_message(sLabel_debug_msg, "デバッグメッセージ", 0, system.dbg);


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
        ver: 4,
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
        auto: 0,
        drag: 1,
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
      var bgm01 = scene1.asset.getAudioById("BGM01"); //
      var se00 = scene1.asset.getAudioById("SE00"); // 開始時カウントダウン
      var se01 = scene1.asset.getAudioById("SE01"); //
      var se02 = scene1.asset.getAudioById("SE02"); //
      var se03 = scene1.asset.getAudioById("SE03"); //
      var se04 = scene1.asset.getAudioById("SE04"); //
      var se05 = scene1.asset.getAudioById("SE05"); //
      var se06 = scene1.asset.getAudioById("SE06"); //
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


      // 公開用・時間無制限モード用の時間表記
      var gLabel_time = gEntity.gLabel_time(scene1, gConst, gConst.font001, "");
      layer.L[4].append(gLabel_time);
      // 関数:フレーム数をh:mm:ss表記にしてreturnする
      var change_time = function(time) {
        let ss=Math.floor(time/30)%60;
        if (ss < 10) { ss = "0"+ss }
        let mm=Math.floor(time/(30*60))%60;
        if (mm < 10) { mm = "0"+mm }
        let h=Math.floor(time/(30*60*60))%60;
        // let text = ""+Math.floor(ctrl.time/30);
        return h+":"+mm+":"+ss;
      }


      
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
      if (system.extra == 2) { title = system.title_extra2 }
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
      tSprite_start.onPointUp.add(() => {
        last_time = 0; // 待ち時間を強制的に0にしているだけ
      });

      // 説明メッセージ用ラベル

      var tLabel_guide_msg1 = gEntity.tLabel_guide_msg(scene1, gConst, gConst.font000, 80, 240, 36, "2色を対象にしたスパイダーです");
      layer.S1[3].append(tLabel_guide_msg1);
      var tLabel_guide_msg2 = gEntity.tLabel_guide_msg(scene1, gConst, gConst.font000, 140, 330, 28, "同じ色を13枚順番にそろえると消えます");
      layer.S1[3].append(tLabel_guide_msg2);
      var tLabel_guide_msg3 = gEntity.tLabel_guide_msg(scene1, gConst, gConst.font000, 140, 380, 28, "違う色の上に置くことはできますが");
      layer.S1[3].append(tLabel_guide_msg3);
      var tLabel_guide_msg4 = gEntity.tLabel_guide_msg(scene1, gConst, gConst.font000, 140, 410, 28, "まとめて動かすことができるのは同じ色のみです");
      layer.S1[3].append(tLabel_guide_msg4);      

      if (system.extra == 1) {
        tLabel_guide_msg1.text = "　※ 2color spiderの１色版です";
        tLabel_guide_msg2.text = "";
        tLabel_guide_msg3.text = "";
        tLabel_guide_msg4.text = "";
        tLabel_guide_msg1.invalidate();
        tLabel_guide_msg2.invalidate();
        tLabel_guide_msg3.invalidate();
        tLabel_guide_msg4.invalidate();
        gConst.ctrl.suit = 1;
      }
      if (system.extra == 2) {
        tLabel_guide_msg1.text = "2color spiderの４色版です";
        tLabel_guide_msg2.text = "同じ色を13枚順番にそろえると消えます";
        tLabel_guide_msg3.text = "違う色の上に置くことはできますが";
        tLabel_guide_msg4.text = "まとめて動かすことができるのは同じ色のみです";
        tLabel_guide_msg1.invalidate();
        tLabel_guide_msg2.invalidate();
        tLabel_guide_msg3.invalidate();
        tLabel_guide_msg4.invalidate();
        gConst.ctrl.suit = 4;
      }

    }






    // ～～～～ゲーム関連～～～～

    // ＝＝変数宣言＝＝
    if (system.dbg >= 0) { // 折り畳み用
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

    // ＝＝開始／終了／メッセージ関係＝＝
    if (system.dbg >= 0) { // 折り畳み用
      var jud_finish = 0;
      var finish_step = 0;
      var timeup_step = 0;
      var losstime_cnt = 0;

      // Readyカウントダウン用ラベル
      var gLabel_ready_countdown = gEntity.gLabel_ready_countdown(scene1, gConst, gConst.font003, "3");
      layer.S2[40].append(gLabel_ready_countdown);

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
      if (system.opem == 0) layer.S2[10].append(gRect_back_countdown);

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



    // ～～～～ゲーム個別～～～～

    // ＝＝管理＝＝
    if (system.dbg >= 0) { // 折り畳み用
      var ctrl = {
        draw: 0, // 前回ドロー実施時のg.game.ageを保存する
        succes_s: 0, // 完成したスペードのセット数
        succes_h: 0, // 完成したハートのセット数
        succes_c: 0, // 完成したクラブのセット数
        succes_d: 0, // 完成したダイヤのセット数
        succes_step: 0, //
        succes_x: 0,
        succes_y: 0,
        score_refresh: 0, // リフレッシュ時にスコア表示も更新する場合のフラグ
        do: -1, // undo/redo用カウンタ
        undo: 0, // undo実施フラグ
        dbg: 0, // ★★デバッグ用★★
        auto: 1, // 自動配置利用フラグ
        drag: 1,
        display: 0, // unactive詳細確認中フラグ
        show_display: 0, // ディスプレイ表示案内を表示したフラグ
        click: 0, // ゲーム開始後、操作を行ったかどうかのフラグ
      }
      var redo = {} // 戻し用redoログ
      var redo2 = {} // 戻し用redoログその２
    
      // クリア標示用のラベル
      var gLabel_success = gEntity.gLabel_success(scene1, gConst, gConst.font003, "ゲームクリア！！", 0);
      layer.S2[40].append(gLabel_success);
      var gLabel_success2 = gEntity.gLabel_success(scene1, gConst, gConst.font003, "", 1);
      layer.S2[40].append(gLabel_success2);

      // 成功セット数標示ヘッダ用の画像
      var gSprite_succes_s = gEntity.gSprite_succes(scene1, gConst, 0);
      layer.S2[32].append(gSprite_succes_s);
      var gSprite_succes_h = gEntity.gSprite_succes(scene1, gConst, 1);
      if (gConst.ctrl.suit >= 2) layer.S2[32].append(gSprite_succes_h);
      var gSprite_succes_c = gEntity.gSprite_succes(scene1, gConst, 2);
      if (gConst.ctrl.suit == 4) layer.S2[32].append(gSprite_succes_c);
      var gSprite_succes_d = gEntity.gSprite_succes(scene1, gConst, 3);
      if (gConst.ctrl.suit == 4) layer.S2[32].append(gSprite_succes_d);
      // 成功セット数標示用のラベル
      var gLabel_success_cnt_s = gEntity.gLabel_success_cnt(scene1, gConst, gConst.font000, 0, "0");
      layer.S2[32].append(gLabel_success_cnt_s);
      var gLabel_success_cnt_h = gEntity.gLabel_success_cnt(scene1, gConst, gConst.font000, 1, "0");
      if (gConst.ctrl.suit >= 2) layer.S2[32].append(gLabel_success_cnt_h);
      var gLabel_success_cnt_c = gEntity.gLabel_success_cnt(scene1, gConst, gConst.font000, 2, "0");
      if (gConst.ctrl.suit == 4) layer.S2[32].append(gLabel_success_cnt_c);
      var gLabel_success_cnt_d = gEntity.gLabel_success_cnt(scene1, gConst, gConst.font000, 3, "0");
      if (gConst.ctrl.suit == 4) layer.S2[32].append(gLabel_success_cnt_d);

    }

    // ＝＝レイアウト全般＝＝
    if (system.dbg >= 0) { // 折り畳み用
      // カード枠の画像
      var gSprite_card_baseList = {};
      for (let i=1; i<=10; i++) {
        const gSprite_card_base = { entity: gEntity.gSprite_card_base(scene1, gConst, i) };
        gSprite_card_baseList[i] = gSprite_card_base;
        layer.S2[20].append(gSprite_card_baseList[i].entity);        
      }
    }
    
    // ＝＝カード関係＝＝
    if (system.dbg >= 0) { // 折り畳み用
      // カード用の画像とラベルを準備
      var gSprite_cardList = {};
      var gLabel_cardList = {};
      var gRect_cardList = {};
      for (let i=1; i<=104; i++) {
        const gSprite_card = { entity: gEntity.gSprite_card(scene1, gConst, i) };
        gSprite_cardList[i] = gSprite_card;
        layer.S2[21].append(gSprite_cardList[i].entity); //仮配置 
        const gLabel_card = { entity: gEntity.gLabel_card(scene1, gConst, gConst.font000, i) };
        gLabel_cardList[i] = gLabel_card;
        layer.S2[21].append(gLabel_cardList[i].entity); //仮配置 
        const gRect_card = { entity: gEntity.gRect_card(scene1, gConst, i) };
        gRect_cardList[i] = gRect_card;
        layer.S2[21].append(gRect_cardList[i].entity); //仮配置 
      }
      // カード関係の変数
      var card = {
        init: {}, // 初期配置
        col: {}, // カードidに対する現在位置・場所
        row: {}, // カードidに対する現在位置・高さ
        click: {}, // クリック状態管理
        click_x: {}, // クリック位置x
        click_y: {}, // クリック位置y
        step: {}, // 移動アニメーション時のステップ用
        prev_x: {}, // 移動アニメーション時の移動開始元起点座標
        prev_y: {}, // 移動アニメーション時の移動開始元起点座標
        open: {}, // 開く・閉じるを伴うアニメーションのフラグ
        status: {}, // ステータス管理 0:山, 1:ドロー中, 2:裏, 3:オープン中, 4:表, 5:ホールド, 6:移動, 9:完成
        catch_x: {}, // 移動中にホールドした場合
        catch_y: {}, // 移動中にホールドした場合
      };
      var cardList = {};

      // 初期配置用の配列を作成
      var sort1 = function(n) {
        let a={};
        for (let i=0; i<n; i++) { a[i] = i }
        for (let i=n; i>0; i--) {
          let ind = Math.floor(random.generate()*i);
          let data = a[ind];
          for (let j=ind; j<i-1; j++) { a[j] = a[j+1] }
          a[i-1] = data; 
        }
        return a;
      };

      // エクストラモードのときの設定パラメータ上書き
      if (system.extra == 1) { 
        ctrl.auto = 1;
        gConst.time_main = 120;
        gConst.ctrl.speed.move = 4;
      }

      // ★★デバッグ★★
      if (system.dbg == 2) {
        let num = [
            0,  1, 92,  3,  4,  5,  6,  7,  8,  9,
           10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
           20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
           30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
           40, 41, 42, 43, 44, 45, 46, 47, 48, 49,

           50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
           60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
           70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
           80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
           90, 91,  2, 93, 94, 95, 96, 97, 98, 99,
          100,101,103,102,
        ];
        for (let i=0; i<104; i++) {
          card.init[i] = num[i];
        }     
      }
      // 初期配置用データは本来はこれ
      if (system.dbg == 0) { 
        card.init = sort1(104);
      }
      // ついでにここでデバッグ時の時間を1800に変更する
      else {
        gConst.time_main = 1800;
      }


      // ＝＝山札セット＝＝
      cardList[0] = {
        card: {}, //
        last: 50, // 残りカード枚数
        height: 50,
      };
      for (let i=1; i<=50; i++) {
        let id=card.init[i-1]+1;
        // カードデータに現在位置をセット
        card.col[id] = 0;
        card.row[id] = i;
        card.click[id] = 0;
        card.step[id] = 0;
        card.prev_x[id] = 0;
        card.prev_y[id] = 0;
        card.open[id] = 0;
        card.status[id] = 0; // 0:場
        // カードリストデータを作成
        cardList[0].card[i] = {
          no: id,
          num: (id-1)%13+1,
          suit: Math.ceil(id/52)-1,
          open: 0, //0:うら,1:おもて
          active: 0, //1:クリック可能
          anime: 0, // アニメーション中フラグ
          x: gConst.card.base_x[0], // 現在の配置状況における表示座標
          y: 500-15*Math.floor((i-1)/10), // 現在の配置状況における表示座標
        }
        // スートの指定
        if (gConst.ctrl.suit == 1) { cardList[0].card[i].suit = 0 }
        if (gConst.ctrl.suit == 2) { cardList[0].card[i].suit = Math.ceil(id/52)-1 }
        if (gConst.ctrl.suit == 4) { cardList[0].card[i].suit = Math.ceil(id/26)-1 }
        // カード画像を更新
        gSprite_cardList[id].entity.srcX = gConst.card.srcX1;
        gSprite_cardList[id].entity.x = cardList[0].card[i].x;
        gSprite_cardList[id].entity.y = cardList[0].card[i].y;
        gSprite_cardList[id].entity.scaleX = -0.5;
        gSprite_cardList[id].entity.modified();
        layer.S2[21].append(gSprite_cardList[id].entity);         
        gLabel_cardList[id].entity.x = cardList[0].card[i].x;
        gLabel_cardList[id].entity.y = cardList[0].card[i].y-100;
        gLabel_cardList[id].entity.scaleX = -1;
        gLabel_cardList[id].entity.modified();
        layer.S2[21].append(gLabel_cardList[id].entity); 
        gRect_cardList[id].entity.x = cardList[0].card[i].x;
        gRect_cardList[id].entity.y = cardList[0].card[i].y;
        gRect_cardList[id].entity.scaleX = -0.5;
        gRect_cardList[id].entity.modified();
        layer.S2[21].append(gRect_cardList[id].entity); 
      }
      // ＝＝場札セット＝＝
      for (let i=1; i<=10; i++) {
        cardList[i] = {
          card: {}, 
          last: 0, // うらカードの残り枚数
          height: 0, // うら／おもて合わせた枚数
          lock: 0, // 処理中における操作ロックフラグ
          active: 1, // 処理可能な枚数
          refresh: 0, // リフレッシュ実施フラグ
          score: 0, // 現在のスコア
          display: 0, // 詳細表示対象とするかどうかのフラグ
        };  
      }
      // cardList[col].card[row]に関して念のためrow=100まで先に定義しておく
      for (let col=1; col<=10; col++) {
        for (let row=1; row<=100; row++) {
          cardList[col].card[row] = {
            no: 0,
            num: 0,
            suit: 0,
            open: 0,
            active: 0, //1:クリック可能
            anime: 0, // アニメーション中フラグ
            x: gConst.card.base_x[col], // 現在の配置状況における表示座標
            y: gConst.layout.base_y+(row-1)*gConst.layout.closed_height, // 現在の配置状況における表示座標  
          }
        } 
      }
      for (let i=51; i<=104; i++) {
        let id=card.init[i-1]+1;
        let col=(i-1)%10+1;
        let row=cardList[col].height+1;
        // カードデータに現在位置をセット
        card.col[id] = col;
        card.row[id] = row;
        card.click[id] = 0;
        card.step[id] = 0;
        card.prev_x[id] = 0;
        card.prev_y[id] = 0;
        card.open[id] = 0;
        if (i < 95) card.status[id] = 2; // 0:うら
        else        card.status[id] = 4; // 0:おもて
        // カードリストデータを作成
        cardList[col].height = row;
        if (i < 95) cardList[col].last += 1; // うらのやつのときはlastもカウントアップ
        cardList[col].card[row].no = id;
        cardList[col].card[row].num = (id-1)%13+1;
        cardList[col].card[row].suit = Math.ceil(id/52)-1;
        // スートの指定
        if (gConst.ctrl.suit == 1) { cardList[col].card[row].suit = 0 }
        if (gConst.ctrl.suit == 2) { cardList[col].card[row].suit = Math.ceil(id/52)-1 }
        if (gConst.ctrl.suit == 4) { cardList[col].card[row].suit = Math.ceil(id/26)-1 }
        // カードが表のやつはデータを変更
        if (i >= 95) {
          cardList[col].card[row].open = 1;
          cardList[col].card[row].active = 1;
        }
        // カード画像を更新
        //  ※数字のopacity設定は最初のrefreshで実施される
        let scale_direction=-1;
        if (i >= 95) { 
          scale_direction = 1;
          gSprite_cardList[id].entity.srcX = gConst.card.srcX2;
        } else {
          gSprite_cardList[id].entity.srcX = gConst.card.srcX1;
        }
        gRect_cardList[id].entity.x = cardList[col].card[row].x;
        gRect_cardList[id].entity.y = cardList[col].card[row].y;
        gRect_cardList[id].entity.scaleX = 0.5*scale_direction;
        gRect_cardList[id].entity.modified();
        gLabel_cardList[id].entity.x = cardList[col].card[row].x;
        gLabel_cardList[id].entity.y = cardList[col].card[row].y-100;
        gLabel_cardList[id].entity.scaleX = 1*scale_direction;
        gLabel_cardList[id].entity.modified();
        gSprite_cardList[id].entity.x = cardList[col].card[row].x;
        gSprite_cardList[id].entity.y = cardList[col].card[row].y;
        gSprite_cardList[id].entity.scaleX = 0.5*scale_direction;
        gSprite_cardList[id].entity.modified();
        layer.S2[21].append(gSprite_cardList[id].entity);         
        layer.S2[21].append(gLabel_cardList[id].entity); 
        layer.S2[21].append(gRect_cardList[id].entity); 
      }
    }

    // ＝＝カード処理＝＝
    if (system.dbg >= 0) { // 折り畳み用

      // ライト表現の台紙
      var gRect_light = gEntity.gRect_light(scene1, gConst);
      layer.S2[31].append(gRect_light);
      // 詳細確認時フィルタの台紙
      var gRect_filter = gEntity.gRect_filter(scene1, gConst);
      layer.S2[35].append(gRect_filter);

      // 自動切り替え処理
      var auto = function() {
        if (ctrl.auto == 0) {
          ctrl.auto = 1;
          gSprite_button_auto.opacity = 1;
          gSprite_button_drag.show();
        } else {
          ctrl.auto = 0;
          gSprite_button_auto.opacity = 0.2
          gSprite_button_drag.hide();
        }
        // ローカルストレージに保存
        if (gConst.jud_localstorage == 1) {
          localstorage_data.auto = ctrl.auto;
          let localstorage_set = JSON.stringify(localstorage_data);
          localStorage.setItem(system.game, localstorage_set);
        }
      }

      // ドラッグ替え処理
      var drag = function() {
        if (ctrl.drag == 0 || ctrl.drag == 2) {
          ctrl.drag = 1;
          gSprite_button_drag.opacity = 1;
        } else {
          ctrl.drag = 2;
          gSprite_button_drag.opacity = 0.2
        }
        // ローカルストレージに保存
        if (gConst.jud_localstorage == 1) {
          localstorage_data.drag = ctrl.drag;
          let localstorage_set = JSON.stringify(localstorage_data);
          localStorage.setItem(system.game, localstorage_set);
        }
      }



      // ドロー処理
      var card_draw = function() {
        // mainで、すべてのcolumnがロック状態でないときのみ実行できる。
        if (scene_status != gConst.scene_main) { return }
        for (let col=1; col<=10; col++) {
          if (cardList[col].lock > 0) { return }
        }
        // 山札がすでにないときはreturn
        if (cardList[0].last == 0) { return } 
        // 連続クリック制御を入れている場合、前回より一定のフレームが経過していない場合はreturn
        if (g.game.age < ctrl.draw+gConst.ctrl.draw) {
          return ;
        } else {
          // スコア表示更新フラグ
          ctrl.score_refresh = 1;
          // 実行制御を登録
          ctrl.draw = g.game.age;
          // 山から10枚を各columnに１枚ずつ配る
          for (let col=1; col<=10; col++) {
            let id=cardList[0].card[cardList[0].last-col+1].no;
            // 各columnのheightをカウントアップ
            cardList[col].height += 1;
            // 配布する先の高さをrowとしてセット
            let row=cardList[col].height;
            // 配布するカードを表にしてレイヤーを変更
            gSprite_cardList[id].entity.scaleX = 0;
            gLabel_cardList[id].entity.scaleX = 0;
            gRect_cardList[id].entity.scaleX = 0;
            gSprite_cardList[id].entity.srcX = gConst.card.srcX2;
            gSprite_cardList[id].entity.modified();
            layer.S2[30].append(gSprite_cardList[id].entity);         
            layer.S2[30].append(gLabel_cardList[id].entity); 
            layer.S2[30].append(gRect_cardList[id].entity);      
            // 配布する配置先のデータを作成
            cardList[col].card[row].no = id;
            cardList[col].card[row].num = cardList[0].card[cardList[0].last-col+1].num;
            cardList[col].card[row].suit = cardList[0].card[cardList[0].last-col+1].suit;
            cardList[col].card[row].open = 1;
            cardList[col].card[row].active = 1;
            // 配布するカードのデータを更新
            card.col[id] = col;
            card.row[id] = row;
            card.step[id] = gConst.ctrl.speed.move;
            card.status[id] = 1;
            card.prev_x[id] = gSprite_cardList[id].entity.x; 
            card.prev_y[id] = gSprite_cardList[id].entity.y; 
            card.open[id] = 1;
            // その他column情報中心に更新
            // アクティブはいったん0にしてリフレッシュ結果を待つ
            cardList[col].refresh = 1;
            cardList[col].active = 0;
          }
          // 山札は10枚減らす
          cardList[0].last -= 10;
          cardList[0].height -= 10;
          // SEを鳴らす
          se01.stop();
          se01.play();
        }
      }

      // 各カードに対してクリック処理が発生した場合
      for (let i=1; i<=104; i++) {
        // クリック(down)の場合
        gSprite_cardList[i].entity.onPointDown.add(ev => {
          // main時以外は処理しない
          if (scene_status != gConst.scene_main) { return }
          // クリックフラグをセット
          ctrl.click = 1;
          // クリック情報をいったん確認
          let click_x = ev.point.x;
          let click_y = ev.point.y;
          gFunc.dbg_message(sLabel_debug_msg, "x:"+Math.floor(100*click_x)+", y:"+Math.floor(100*click_y), 0, system.dbg);          
          // スコアプラス表示を消す
          gLabel_score_plus.text = "";
          gLabel_score_plus.invalidate();
          // クリックしたカードの配置情報をセット
          let col=card.col[i];
          let row=card.row[i];

          // 確認中フラグがセットされているときのクリックには何もせずに終わる
          if (ctrl.display > 0) { return }
          // 対象カードがopen&unactiveだった場合はcolumnカード一覧表示を行う
          if (cardList[col].display == 1  && ctrl.display == 0 && cardList[col].card[row].open == 1 && cardList[col].card[row].active == 0) {
            // 確認中フラグ
            ctrl.display = i; // フラグにはクリックされたカード自体をセット
            // 全体フィルタを表示
            gRect_filter.show();
            // ホールド中のカードがあった場合は離す:ロック状態のcolumnが対象になる
            for (let hold_col=1; hold_col<=10; hold_col++) {
              if (cardList[hold_col].lock == 1) {
                for (let h=1; h<=cardList[hold_col].height; h++) {
                  let id=cardList[hold_col].card[h].no;
                  // カードがstatus=5(ホールド)のときが対象
                  if (card.status[id] == 5) {
                    gLabel_cardList[id].entity.x = cardList[hold_col].card[h].x;
                    gLabel_cardList[id].entity.y = cardList[hold_col].card[h].y-100;
                    gLabel_cardList[id].entity.modified();
                    gSprite_cardList[id].entity.x = cardList[hold_col].card[h].x;
                    gSprite_cardList[id].entity.y = cardList[hold_col].card[h].y;
                    gSprite_cardList[id].entity.modified();
                    // データも修正
                    card.status[id] = 4;
                  }
                }    
              }
            }
            // 対象columnのカード一覧をフィルタ上に表示する
            for (let h=1; h<=cardList[col].height; h++) {
              let id=cardList[col].card[h].no;
              // scaleXを念のために直す
              gSprite_cardList[id].entity.scaleX = 0.5;
              gLabel_cardList[id].entity.scaleX = 1;
              gRect_cardList[id].entity.scaleX = 1;
              let x= 300 + 110*Math.floor((h-1)/10) +  5*((h-1)%10);
              let y= 200 +   5*Math.floor((h-1)/10) + 30*((h-1)%10);
              gSprite_cardList[id].entity.x = x;
              gSprite_cardList[id].entity.y = y;
              gLabel_cardList[id].entity.x = x;
              gLabel_cardList[id].entity.y = y - 100;
              gRect_cardList[id].entity.x = x;
              gRect_cardList[id].entity.y = y;
              gSprite_cardList[id].entity.modified();
              gLabel_cardList[id].entity.modified();
              gRect_cardList[id].entity.modified();
              layer.S2[35].append(gSprite_cardList[id].entity);         
              layer.S2[35].append(gLabel_cardList[id].entity); 
              layer.S2[35].append(gRect_cardList[id].entity);                    
            }
            return ;
          }

          // 対象カードが山札のときはドロー処理のみを実施する
          if (col == 0) { card_draw(); return }
          // 対象カードがクリック不可の場合は処理を行わない
          if (cardList[col].lock == 1) { return } // 対象のcolumnがロック
          if (cardList[col].card[row].open == 0) { return } // 対象がうら
          if (cardList[col].card[row].active == 0) { return } // 対象がアクティブでない
          // if (cardList[col].card[row].step > 0) { return } // 対象がアニメーション中
          // クリック情報をセット
          card.click[i] = 1; //クリック状態フラグ
          gFunc.dbg_message(sLabel_debug_msg, "クリック "+i, 0, system.dbg);
          // クリックしたcolumnをロックする
          cardList[col].lock += 1;
          // 対象カードのレイヤーをいったん上にもってくる
          for (let h=row; h<=cardList[col].height; h++) {
            let id=cardList[col].card[h].no;
            layer.S2[30].append(gSprite_cardList[id].entity);         
            layer.S2[30].append(gLabel_cardList[id].entity); 
            layer.S2[30].append(gRect_cardList[id].entity); 
            // 対象がオープン中/移動中などのときは移動をキャンセル⇒即時反映
            card.step[id] = 0;
            // ついでにステータスもホールド(card.status=5)にする
            card.status[id] = 5;
            card.open[id] = 0;
            // scaleが回転している場合も直す
            gSprite_cardList[id].entity.scaleX = 0.5;
            gLabel_cardList[id].entity.scaleX = 1;
            gRect_cardList[id].entity.scaleX = 1;
            gSprite_cardList[id].entity.modified();
            gLabel_cardList[id].entity.modified();
            gRect_cardList[id].entity.modified();
            // キャッチしたときの座標を保存
            // card.catch_x[id] = gSprite_cardList[id].entity.x;
            // card.catch_y[id] = gSprite_cardList[id].entity.y;
            card.catch_x[id] = gSprite_cardList[i].entity.x;
            card.catch_y[id] = gSprite_cardList[i].entity.y+(h-row)*gConst.layout.opened_height;
          }  
          // ★★デバッグ★★ ホールド中のカードのnumを表示         
          gFunc.dbg_message(sLabel_debug_msg, "num:"+cardList[col].card[row].num, 0, system.dbg);          
        });  
        // クリック(move)の場合
        gSprite_cardList[i].entity.onPointMove.add(ev => {
          // main時以外は処理しない
          if (scene_status != gConst.scene_main) { return }
          // 自動でドラッグオフのときはリターン
          if (ctrl.auto == 1 && ctrl.drag == 2) { return }
          // クリック情報をいったん確認
          let move_x = ev.startDelta.x;
          let move_y = ev.startDelta.y;
          gFunc.dbg_message(sLabel_debug_msg, "x:"+Math.floor(100*move_x)+", y:"+Math.floor(100*move_y), 0, system.dbg);          
          // クリック状態フラグが立っていない場合は処理を行わない
          gFunc.dbg_message(sLabel_debug_msg, "i:"+i+", click:"+card.click[i], 0, system.dbg);          
          if (card.click[i] == 0) { return }
          // クリックしたカードの配置情報をセット
          let col=card.col[i];
          let row=card.row[i];
          // move分を移動させる(対象カードより上に乗ってるやつすべて)
          for (let h=row; h<=cardList[col].height; h++) {
            let id=cardList[col].card[h].no;
            // gLabel_cardList[id].entity.x = cardList[col].card[h].x+move_x;
            // gLabel_cardList[id].entity.y = cardList[col].card[h].y-100+move_y;
            gLabel_cardList[id].entity.x = card.catch_x[id]+move_x;
            gLabel_cardList[id].entity.y = card.catch_y[id]-100+move_y;
            gLabel_cardList[id].entity.modified();
            // gSprite_cardList[id].entity.x = cardList[col].card[h].x+move_x;
            // gSprite_cardList[id].entity.y = cardList[col].card[h].y+move_y;
            gSprite_cardList[id].entity.x = card.catch_x[id]+move_x;
            gSprite_cardList[id].entity.y = card.catch_y[id]+move_y;
            gSprite_cardList[id].entity.modified();
          }  

          // 現在の位置におけるターゲット場を計算して表示
          let target=1;
          for (let line=1; line<10; line++) {
            if (gLabel_cardList[i].entity.x > gConst.card.line_x[line]) { target += 1 }
          }
          gFunc.dbg_message(sLabel_debug_msg, "target:"+target, 0, system.dbg); 
        });  
        // クリック(up)の場合
        gSprite_cardList[i].entity.onPointUp.add(ev => {
          // main時以外は処理しない
          if (scene_status != gConst.scene_main) { return }
          // ※ロック状態が2以上(同フレームに同じcolumnからホールドしていた場合)は異常処理を検討
          // クリック情報をいったん確認
          let move_x = ev.startDelta.x;
          let move_y = ev.startDelta.y;
          gFunc.dbg_message(sLabel_debug_msg, "x:"+Math.floor(100*move_x)+", y:"+Math.floor(100*move_y), 0, system.dbg);          
          // 取り扱っているカードの配置情報
          let col=card.col[i];
          let row=card.row[i];

          // 詳細確認フラグが立っており、対象のカードでなかったときは何もせず終了
          if (ctrl.display > 0 && ctrl.display != i) { return }
          // 詳細確認フラグが立っており、対象のカードだったときは詳細表示を終了する
          if (ctrl.display > 0 && ctrl.display == i) { 
            // 確認中フラグ
            ctrl.display = 0;
            // 全体フィルタを消す
            gRect_filter.hide();
            // 対象columnのカード一覧を元の位置＆レイヤーに戻す
            for (let h=1; h<=cardList[col].height; h++) {
              let id=cardList[col].card[h].no;
              // そのまま移動
              gSprite_cardList[id].entity.x = cardList[col].card[h].x;
              gSprite_cardList[id].entity.y = cardList[col].card[h].y;
              gLabel_cardList[id].entity.x = cardList[col].card[h].x;
              gLabel_cardList[id].entity.y = cardList[col].card[h].y-100;
              gRect_cardList[id].entity.x = cardList[col].card[h].x;
              gRect_cardList[id].entity.y = cardList[col].card[h].y;
              gSprite_cardList[id].entity.modified();
              gLabel_cardList[id].entity.modified();
              gRect_cardList[id].entity.modified();
              layer.S2[21].append(gSprite_cardList[id].entity);         
              layer.S2[21].append(gLabel_cardList[id].entity); 
              layer.S2[21].append(gRect_cardList[id].entity);                    
            }
            // リフレッシュフラグ
            cardList[col].refresh = 2;
            return ;
          }

          // クリック状態フラグが立っていない場合は処理を行わない
          gFunc.dbg_message(sLabel_debug_msg, "i:"+i+", click:"+card.click[i], 0, system.dbg);       
          if (card.click[i] == 0) { return }
          // ＝＝離した地点から順に右回り１周して最初に置けるところを発見したらそこに置く＝＝
          let jud_set=0;          
          // クリック先のcolをtargetとして計算する
          let target=1;
          for (let line=1; line<10; line++) {
            if (gLabel_cardList[i].entity.x > gConst.card.line_x[line]) { target += 1 }
          }
          gFunc.dbg_message(sLabel_debug_msg, "target:"+target, 0, system.dbg);          
          // 各columnに対して処理を実施
          // 右回り最初におけるところと、置くと完成することになる列があった場合の設置先
          let normal_target=0;
          let second_target=0; // スペースよりカードがあるcolumnを優先する
          let special_target=-1; // columnのなかで１セット完成するところを優先する
          // ホールドしたカードが１セット作れる可能性があるかどうかのチェック
          if (ctrl.auto == 1 && cardList[col].card[cardList[col].height].num == 1) { special_target = 0 }
          // ※2色のときは自動を切ろう
          let check=10;
          // if (gConst.ctrl.suit == 2) check = 2;
          if (ctrl.auto == 0) check = 2;
          for (let c=0; c<check; c++) {
            let t=(c+target-1)%10+1; // 対象column
            // 2色のときは、となり片方だけチェック対象⇒２色ではなく、自動起動フラグで確認
            if (ctrl.auto == 0 && c == 1) {
              // ★1.0.3.0対応ここから★
              // targetが自身の列の場合の「となり」をドラッグ先候補にせず終了する・・・オートのほうの処理だけでいんじゃね？
              if (target == col) {
                gFunc.dbg_message(sLabel_debug_msg, "  1.0.3.0対応  ", 0, system.dbg);          
                // break; // やっぱり処理なしにしよう
              }
              // ★1.0.2.2対応ここまで★
              // 移動対象が決まった場合はfor文をbreakする
              if (target == 1 && gSprite_cardList[i].entity.x <= cardList[target].card[row].x) {
                gFunc.dbg_message(sLabel_debug_msg, "  1  ", 0, system.dbg);          
                break;
              } else if (target > 1 && gSprite_cardList[i].entity.x < cardList[target].card[row].x) {
                gFunc.dbg_message(sLabel_debug_msg, "  2  ", 0, system.dbg);          
                t = target-1;
              } else if (target < 10 && gSprite_cardList[i].entity.x > cardList[target].card[row].x) {
                gFunc.dbg_message(sLabel_debug_msg, "  3  ", 0, system.dbg);          
                t = target+1;
              } else {
                gFunc.dbg_message(sLabel_debug_msg, "  4  ", 0, system.dbg);          
                break;
              }
            }
            // gFunc.add_log(log[2].text, log[2].count++, g.game.age, "check: "+t, system.dbg);            
            let jud=1;
            let head=cardList[t].height;
            // NG: 対象のcolumnがロック（※自身のcolumnならロック状態で対象外になる）
            if (cardList[t].lock == 1) { jud = 0 } 
            // NG: 数字が続いていない
            if (head != 0 && cardList[t].card[head].num != cardList[col].card[row].num+1) { jud = 0 } 
            // NG: suitが異なる（オートでc>=2のとき）★1.0.3.0対応★オートのときはc>=1に変更
            if (head != 0 && ctrl.auto == 1 && c >= 1 && cardList[t].card[head].suit != cardList[col].card[row].suit & c > 0) { jud = 0 } 
            // gFunc.add_log(log[2].text, log[2].count++, g.game.age, "check:"+t+", head:"+head+", num;"+cardList[t].card[head].num+", suit:"+cardList[t].card[head].suit, system.dbg);            

            // 自動でドラッグオフのときはjudを切る
            if (c == 1 && ctrl.auto == 1 && ctrl.drag == 2) { jud = 0 }

            if (jud == 1) {
              jud_set = 1;
              // 最初の発見の場合は値をセット
              if (normal_target == 0) { normal_target = t }
              // 自動配置オフのときもしくはホールド対象にひとセット完成可能性がないときは、ターゲット決定としてbreakする
              gFunc.add_log(log[1].text, log[1].count++, g.game.age, "ctrl.auto:"+ctrl.auto, system.dbg);            
              // if (ctrl.auto == 0 || special_target == -1) { break } // 最後まで回す
              // second_targetがまだセットされていないときは、headが0より大きいときはセットする
              if (head > 0 && second_target == 0) { second_target = t }
              // ホールド枚数と場のアクティブ数の和が13の場合はspecial_targetをセット
              gFunc.add_log(log[1].text, log[1].count++, g.game.age, "cardList[col].card[row].num:"+cardList[col].card[row].num+", cardList[t].active:"+cardList[t].active, system.dbg);            
              if (cardList[col].card[row].num+cardList[t].active == 13) {
                special_target = t;
                break;
              }
            }          
          }
          // 設置先があった場合
          if (jud_set == 1) {
            gFunc.add_log(log[1].text, log[1].count++, g.game.age, "normal_target:"+normal_target+", special_target:"+special_target, system.dbg);            
            // 置けたときのSE
            se01.stop();
            se01.play();
            // 設置先ターゲット
            let t=normal_target;
            if      (special_target > 0) { t = special_target }
            else if (second_target > 0) { t = second_target }
            let head=cardList[t].height;
            // スコア表示更新フラグ
            ctrl.score_refresh = 1;
          
            // redoログ保存を開始
            //  ※いったん却下
            // カード関係のデータを更新
            for (let h=0; h<=cardList[col].height-row; h++) {
              let id=cardList[col].card[row+h].no;
              gFunc.add_log(log[2].text, log[2].count++, g.game.age, "col:"+col+", row:"+row+", h:"+h+" > id:"+id, system.dbg);            
              // redoログにstepを登録
              //  ※いったん却下
              // 各カードに移動設定を追加
              card.col[id] = t;
              card.row[id] = head+h+1;
              card.step[id] = gConst.ctrl.speed.move;
              card.status[id] = 6;
              card.prev_x[id] = card.catch_x[id]+move_x;
              card.prev_y[id] = card.catch_y[id]+move_y;
              // 移動先にデータを移す
              cardList[t].card[head+h+1].no = cardList[col].card[row+h].no;
              cardList[t].card[head+h+1].num = cardList[col].card[row+h].num;
              cardList[t].card[head+h+1].suit = cardList[col].card[row+h].suit;
              cardList[t].card[head+h+1].open = 1;
              cardList[t].card[head+h+1].active = 1;
              // cardList[t].card[head+h].y = cardList[col].card[row].y; // 仮の値
            }
            // columnの高さデータとactive枚数データを更新
            // 移動先
            gFunc.add_log(log[2].text, log[2].count++, g.game.age, "t:"+t+", cardList[t].active:"+cardList[t].active+", cardList[t].height:"+cardList[t].height, system.dbg);            
            cardList[t].active += cardList[col].height-row+1;
            cardList[t].height += cardList[col].height-row+1;
            cardList[t].refresh = 1;
            gFunc.add_log(log[2].text, log[2].count++, g.game.age, "t:"+t+", cardList[t].active:"+cardList[t].active+", cardList[t].height:"+cardList[t].height, system.dbg);            
            // 移動元
            gFunc.add_log(log[2].text, log[2].count++, g.game.age, "col:"+col+", cardList[col].active:"+cardList[col].active+", cardList[col].height:"+cardList[col].height, system.dbg);            
            cardList[col].active -= cardList[col].height-row+1;
            cardList[col].height -= cardList[col].height-row+1;
            cardList[col].refresh = 1;
            gFunc.add_log(log[2].text, log[2].count++, g.game.age, "col:"+col+", cardList[col].active:"+cardList[col].active+", cardList[col].height:"+cardList[col].height, system.dbg);            

            // 元のcolumnがlastだけの場合、新たな先頭をひっくり返す（即scaleX=0にしてレイヤー変更する）
            head = cardList[col].height;
            if (cardList[col].height > 0 && cardList[col].card[head].open == 0) {
              let id=cardList[col].card[head].no;
              // scaleX=0にしてレイヤー変更
              gSprite_cardList[id].entity.scaleX = 0;
              gLabel_cardList[id].entity.scaleX = 0;
              gRect_cardList[id].entity.scaleX = 0;
              gSprite_cardList[id].entity.srcX = gConst.card.srcX2;
              gSprite_cardList[id].entity.modified();
              layer.S2[21].append(gSprite_cardList[id].entity);         
              layer.S2[21].append(gLabel_cardList[id].entity); 
              layer.S2[21].append(gRect_cardList[id].entity);      
              // カードデータ(配置)を更新
              cardList[col].card[head].open = 1;
              cardList[col].card[head].active = 1;
              // カードデータ(個別)を更新
              card.step[id] = gConst.ctrl.speed.move;
              if (system.extra == 1) card.step[id] = 1;
              card.prev_x[id] = cardList[col].card[head].x-gConst.layout.card_x*(0); // その場で移動扱い
              card.prev_y[id] = cardList[col].card[head].y; // その場で移動扱い
              card.open[id] = 1;
              // if (system.extra == 1) { card.open[id] = 0 } // 1colorのときは回転アニメーションは入れない
              card.status[id] = 3; // 3:オープン中
              // columnデータを更新: うらが1枚減って、表&アクティブが1になる
              cardList[col].last -= 1;
              cardList[col].active += 1;            
            }
          } 
          // もし設置先がない場合は、元の位置に戻す(対象カードより上に乗ってるやつすべて)
          else if (jud_set == 0) {
            for (let h=row; h<=cardList[col].height; h++) {
              let id=cardList[col].card[h].no;
              gLabel_cardList[id].entity.x = cardList[col].card[h].x;
              gLabel_cardList[id].entity.y = cardList[col].card[h].y-100;
              gLabel_cardList[id].entity.modified();
              gSprite_cardList[id].entity.x = cardList[col].card[h].x;
              gSprite_cardList[id].entity.y = cardList[col].card[h].y;
              gSprite_cardList[id].entity.modified();
              // データも修正
              card.status[id] = 4;
            }
            cardList[col].refresh = 2;
            // 置けなかったときのSE
            // se05.stop();
            // se05.play().changeVolume(0.2);
          } else {
          }
          // クリック情報をリセット
          card.click[i] = 0; //クリック状態フラグ
          // columnのロック状態を解除
          cardList[col].lock = 0;
        });  
      }

      // ドローボタン用のラベル
      var gSprite_button_draw = gEntity.gSprite_button_draw(scene1, gConst, gConst.font002, "配る");
      layer.S2[31].append(gSprite_button_draw);
      // ドローボタン用のラベルをクリックしたとき
      gSprite_button_draw.onPointUp.add(ev => {
        card_draw();
      }); 

      // 自動配置ボタン用のラベル
      var gSprite_button_auto = gEntity.gSprite_button_auto(scene1, gConst, gConst.font002, "自動");
      layer.S2[31].append(gSprite_button_auto);
      // 自動配置ボタン用のラベルをクリックしたとき
      gSprite_button_auto.onPointUp.add(ev => {
        if (ctrl.auto == 0) {
          ctrl.auto = 1;
          gSprite_button_auto.opacity = 1;
          gSprite_button_drag.show();
        } else {
          ctrl.auto = 0;
          gSprite_button_auto.opacity = 0.2
          gSprite_button_drag.hide();
        }
        // ローカルストレージに保存
        if (gConst.jud_localstorage == 1) {
          localstorage_data.auto = ctrl.auto;
          let localstorage_set = JSON.stringify(localstorage_data);
          localStorage.setItem(system.game, localstorage_set);
          gFunc.add_log(log[1].text, log[1].count++, g.game.age, "set  localstorage_get.auto:"+localstorage_data.auto, system.dbg);
        }
      }); 
      // 自動配置フラグをログストレージから取得
      if (gConst.jud_localstorage == 1) {
        // ローカルストレージの値を利用する場合
        if (localstorage_data.auto >= 0) { ctrl.auto = localstorage_data.auto }
        gFunc.add_log(log[1].text, log[1].count++, g.game.age, "get  localstorage_get.auto:"+localstorage_data.auto, system.dbg);
      }  
      // ボタンの初期状態
      gFunc.add_log(log[1].text, log[1].count++, g.game.age, "init ctrl.auto:"+ctrl.auto, system.dbg);
      if (ctrl.auto == 0) { gSprite_button_auto.opacity = 0.2 }

      // ドラッグボタン用のラベル
      var gSprite_button_drag = gEntity.gSprite_button_drag(scene1, gConst, gConst.font002, "drag");
      // layer.S2[31].append(gSprite_button_drag);
      // 自動設定がoffのときは表示しない
      if (ctrl.auto == 0) { gSprite_button_drag.hide() }
      // ドラッグボタン用のラベルをクリックしたとき
      gSprite_button_drag.onPointUp.add(ev => {
        if (ctrl.drag == 0 || ctrl.drag == 2) {
          ctrl.drag = 1;
          gSprite_button_drag.opacity = 1;
        } else {
          ctrl.drag = 2;
          gSprite_button_drag.opacity = 0.2
        }
        // ローカルストレージに保存
        if (gConst.jud_localstorage == 1) {
          localstorage_data.drag = ctrl.drag;
          let localstorage_set = JSON.stringify(localstorage_data);
          localStorage.setItem(system.game, localstorage_set);
        }
      }); 
      // ドラッグフラグをログストレージから取得
      if (gConst.jud_localstorage == 1) {
        // ローカルストレージの値を利用する場合
        // if (localstorage_data.drag >= 1) { ctrl.drag = localstorage_data.drag }
        // gFunc.add_log(log[1].text, log[1].count++, g.game.age, "get  localstorage_get.drag:"+localstorage_data.drag, system.dbg);
      }  
      // 初期値に合わせて表示を切り替え
      if (ctrl.drag == 2) { gSprite_button_drag.opacity = 0.2 }


      // デバッグ用データ出力処理
      var dbg_output1 = function() {
        // log3をリセット
        // log[1].count = 0;
        log[3].count = 0;
        // 各columnの高さ情報
        for (let i=1; i<=10; i++) { gFunc.add_log(log[3].text, log[3].count++, g.game.age, "cardList[i].height:"+cardList[i].height, system.dbg) }
        // cardListにおける各ブロックの概要情報
        for (let row=1; row<=100; row++) {
          let text="<"+row+">";
          let jud=0; // データ存在した場合のフラグ
          for (let col=1; col<=10; col++) {
            if (row <= cardList[col].height) { 
              jud = 1;
              let id=cardList[col].card[row].no;
              let num=cardList[col].card[row].num;
              if (num < 10) { num = "_"+num }
              text = text+" "+card.status[id]+","+cardList[col].card[row].active+","+num+","+Math.floor(cardList[col].card[row].y);
            } else {
              text = text+" *,*,**,"+Math.floor(cardList[col].card[row].y);
            }
          }
          if (jud == 1) { gFunc.add_log(log[3].text, log[3].count++, g.game.age, text, system.dbg)  }
        }
        if (ctrl.dbg > 0) {
          let id=ctrl.dbg;
          gFunc.add_log(log[3].text, log[3].count++, g.game.age, "13下消えるやつ x:"+gLabel_cardList[id].entity.x+", y:"+gLabel_cardList[id].entity.y+", opa:"+gLabel_cardList[id].entity.opacity, system.dbg);
        }
        // cardListに対する各ブロックの詳細情報
        for (let col=1; col<=10; col++) {
          for (let row=1; row<=cardList[col].height; row++) {
            let id=cardList[col].card[row].no;
            let text="["+col+"/"+row+"]";
            text = text+" status:"+card.status[id];
            text = text+", active:"+cardList[col].card[row].active;
            text = text+", open:"+cardList[col].card[row].open;
            text = text+", suit:"+cardList[col].card[row].suit;
            text = text+", num:"+Math.abs(100+cardList[col].card[row].num);
            text = text+", x:"+Math.floor(1000+cardList[col].card[row].x);
            text = text+", y:"+Math.floor(1000+cardList[col].card[row].y);
            text = text+", no:"+Math.abs(1000+id);
            text = text+", card_x:"+Math.floor(1000+gSprite_cardList[id].entity.x);
            text = text+", card_y:"+Math.floor(1000+gSprite_cardList[id].entity.y);
            text = text+", card_opa:"+gSprite_cardList[id].entity.opacity;            
            gFunc.add_log(log[3].text, log[3].count++, g.game.age, text, system.dbg);
          }
        }        
        // cardに対するデータ
        for (let i=1; i<=104; i++) {
          let col=card.col[i];
          let row=card.row[i];
          let out_col=col;
          if (col < 10) { out_col = "_"+col }
          let out_row=row;
          if (row < 10) { out_row = "_"+row }
          let text="["+i+"]";
          let out_status=card.status[i];
          if (out_status < 10) { out_status = "_"+out_status }
          text = text+" status:"+out_status;
          text = text+" ("+out_col+"/"+out_row+")";
          text = text+", suit:"+cardList[col].card[row].suit;
          text = text+", num:"+Math.abs(100+cardList[col].card[row].num);
          text = text+", card_x:"+Math.floor(1000+gSprite_cardList[i].entity.x);
          text = text+", card_y:"+Math.floor(1000+gSprite_cardList[i].entity.y);
          text = text+", card_opa:"+gSprite_cardList[i].entity.opacity;            
          gFunc.add_log(log[3].text, log[3].count++, g.game.age, text, system.dbg);      
        }
      }     

      // デバッグ用データ出力ボタン１のラベル
      var gSprite_button_output1 = gEntity.gSprite_button_output1(scene1, gConst, gConst.font002, "out1");
      if (system.dbg == 2) { layer.S2[31].append(gSprite_button_output1) }
      // デバッグ用データ出力ボタン１のラベルをクリックしたとき
      gSprite_button_output1 .onPointUp.add(ev => {
        dbg_output1();
      });  

      // undo処理
      var undo1 = function() {
        if (scene_status != gConst.scene_main) { return }
        // SEを鳴らす
        se02.play();
        // 各columnデータの初期化と上書き
        cardList[0].last = 0;
        cardList[0].height = 0;
        cardList[0].refresh = 1;
        for (let col=1; col<=10; col++) {
          cardList[col].last = 0;
          cardList[col].height = 0;
          cardList[col].lock = 0;
          cardList[col].active = 0;
          cardList[col].refresh = 1; //undoデータ作成後に全columnでリフレッシュ処理を行う
        }
        // ctrl.doをダウン
        ctrl.do -= 1;        
        gFunc.dbg_message(sLabel_debug_msg, "undo実施: "+ctrl.do, 0, system.dbg);
        // undoフラグをセット
        ctrl.undo = 1;
        // スコア表示更新フラグ
        ctrl.score_refresh = 1;
        // 成功数を上書き
        ctrl.succes_s = redo[ctrl.do].succes_s;
        ctrl.succes_h = redo[ctrl.do].succes_h;
        ctrl.succes_c = redo[ctrl.do].succes_c;
        ctrl.succes_d = redo[ctrl.do].succes_d;
        // 各カードデータからの上書き
        for (let i=1; i<=104; i++) {
          let col=redo[ctrl.do].col[i];
          let row=redo[ctrl.do].row[i];
          // cardデータを上書き
          card.col[i] = col;
          card.row[i] = row;
          card.click[i] = 0;
          card.step[i] = 0;
          card.status[i] = redo[ctrl.do].status[i];  
          if (col >= 0) {
            card.prev_x[i] = cardList[col].card[row].x;
            card.prev_y[i] = cardList[col].card[row].y;
          } else {
            card.prev_x[i] = 0;
            card.prev_y[i] = 0;
          }
          card.open[i] = 0;
          // 中途半端なステータスのカードは４に変更する
          if (card.status[i] == 1 || card.status[i] == 3 || card.status[i] == 5 || card.status[i] == 6) { card.status[i] = 4 }
          card.catch_x[i] = 0;
          card.catch_y[i] = 0;
          // cardListデータを作成
          if (col >= 0) {
            cardList[col].card[row].no = i;
            cardList[col].card[row].num = (i-1)%13+1;
            cardList[col].card[row].suit = Math.ceil(i/52)-1;
            if (gConst.ctrl.suit == 1) { cardList[col].card[row].suit = 0 }
            if (gConst.ctrl.suit == 2) { cardList[col].card[row].suit = Math.ceil(i/52)-1; }
            if (gConst.ctrl.suit == 4) { cardList[col].card[row].suit = Math.ceil(i/26)-1; }
            cardList[col].card[row].active = 0; // リフレッシュで再設定（単体では決められないから
            // openフラグは各ステータスに合わせて決める・・・リフレッシュで再設定される？⇒たぶん山カードはリフレッシュされない
            if (card.status[i] == 0 || card.status[i] == 2) { cardList[col].card[row].open = 0 }
            else                                            { cardList[col].card[row].open = 1 }
            // 山札のとき
            if (card.status[i] == 0) { 
              cardList[col].last += 1; 
              cardList[col].height += 1; 
              cardList[col].card[row].x = gConst.card.base_x[0];
              cardList[col].card[row].y = 500-15*Math.floor((row-1)/10);
            }
            // 途中のとき 
            else if (card.status[i] <= 6) {
              if (card.status[i] == 2) { cardList[col].last += 1 }
              cardList[col].height += 1;
              cardList[col].card[row].x = gConst.card.base_x[col];
              cardList[col].card[row].y = gConst.layout.base_y+(row-1)*gConst.layout.closed_height; // リフレッシュで再設定
            }
            // 完成のとき 
            else {
              // 特に何もしない
            }
          }
        }
        // いったん表示
        for (let col=0; col<=10; col++) {
          // 場の分
          for (let row=1; row<=cardList[col].height; row++) {
            let id=cardList[col].card[row].no;
            // カードの表裏
            if (cardList[col].card[row].open == 1) {
              gSprite_cardList[id].entity.srcX = gConst.card.srcX2;
            } else {
              if (col == 0) {
                gSprite_cardList[id].entity.x = cardList[col].card[row].x;
                gSprite_cardList[id].entity.y = cardList[col].card[row].y;
                gLabel_cardList[id].entity.x = cardList[col].card[row].x;
                gLabel_cardList[id].entity.y = cardList[col].card[row].y-100;
              }
              gSprite_cardList[id].entity.srcX = gConst.card.srcX1;
              gSprite_cardList[id].entity.scaleX = 0.5;
            }
            gSprite_cardList[id].entity.modified();
            gLabel_cardList[id].entity.modified();
            gSprite_cardList[id].entity.show();       
            layer.S2[21].append(gSprite_cardList[id].entity);         
            layer.S2[21].append(gLabel_cardList[id].entity); 
            layer.S2[21].append(gRect_cardList[id].entity);          
          }
        }          
      }
      var undo2 = function() {
        if (scene_status != gConst.scene_main) { return }
        // SEを鳴らす
        se02.play();
        // ctrl.doをカウントダウン
        ctrl.do -= 1;
        gFunc.dbg_message(sLabel_debug_msg, "undo2実施: "+ctrl.do, 0, system.dbg);

        // デバッグ
        let card_tmp=redo2[ctrl.do].card;
        let cardList_tmp =redo2[ctrl.do].cardList;
        gFunc.add_log(log[1].text, log[1].count++, g.game.age, "undo2 デバッグ"+ctrl.do, system.dbg);
        // gFunc.add_log(log[1].text, log[1].count++, g.game.age, " redo2[ctrl.do].succes_s:"+redo2[ctrl.do].succes_s, system.dbg);
        // gFunc.add_log(log[1].text, log[1].count++, g.game.age, " card_tmp.status[100] :"+card_tmp.status[100], system.dbg);
        for (let i=0; i<=ctrl.do; i++) {
          gFunc.add_log(log[1].text, log[1].count++, g.game.age, "<"+i+"> "+redo2[i].cardList[10].height, system.dbg);
        }

        // cardとcardListを戻す
        card = redo2[ctrl.do].card;
        cardList = redo2[ctrl.do].cardList;
        // undoフラグをセット
        ctrl.undo = 1;
        // スコア表示更新フラグ
        ctrl.score_refresh = 1;
        // 成功数を上書き
        ctrl.succes_s = redo2[ctrl.do].succes_s;
        ctrl.succes_h = redo2[ctrl.do].succes_h;
        ctrl.succes_c = redo2[ctrl.do].succes_c;
        ctrl.succes_d = redo2[ctrl.do].succes_d;

        // データを整えて表示
        for (let col=0; col<=10; col++) {
          cardList[col].refresh = 1; //undoデータ作成後に全columnでリフレッシュ処理を行う          
          for (let row=1; row<=cardList[col].height; row++) {
            let id=cardList[col].card[row].no;
            // 中途半端なステータスのカードは４に変更する
            if (card.status[id] == 1 || card.status[id] == 3 || card.status[id] == 5 || card.status[id] == 6) { card.status[id] = 4 }
            // cardデータを作成
            card.catch_x[id] = 0;
            card.catch_y[id] = 0;
            card.click[id] = 0;
            card.step[id] = 0;
            card.prev_x[id] = cardList[col].card[1].x;
            card.prev_y[id] = cardList[col].card[1].y;
            card.open[id] = 0;
            // 表示
            if (cardList[col].card[row].open == 1) {
              gSprite_cardList[id].entity.srcX = gConst.card.srcX2;
            } else {
              if (col == 0) {
                gSprite_cardList[id].entity.x = cardList[col].card[row].x;
                gSprite_cardList[id].entity.y = cardList[col].card[row].y;
                gLabel_cardList[id].entity.x = cardList[col].card[row].x;
                gLabel_cardList[id].entity.y = cardList[col].card[row].y;
              }
              gSprite_cardList[id].entity.srcX = gConst.card.srcX1;
            }
            gSprite_cardList[id].entity.modified();
            gLabel_cardList[id].entity.modified();
            layer.S2[21].append(gSprite_cardList[id].entity);         
            layer.S2[21].append(gLabel_cardList[id].entity); 
            layer.S2[21].append(gRect_cardList[id].entity);          
          }
        }
        dbg_output1();                
      }

      // undoボタン
      var gSprite_button_undo = gEntity.gSprite_button_undo(scene1, gConst, gConst.font002, "戻る");
      layer.S2[31].append(gSprite_button_undo);
      // undoボタン用のラベルをクリックしたとき
      gSprite_button_undo.onPointUp.add(ev => {
        if (scene_status == gConst.scene_main && ctrl.do > 0) { undo1() }
        // if (scene_status == gConst.scene_main && ctrl.do > 0) { undo2() }
      }); 


      // キー入力
      window.addEventListener('keydown', (ev) => {
        // スペースでdraw
        if (ev.code == "KeyD") {
          card_draw();
        }
        // シフトでundo
        if (ev.code == "KeyA") {
          if (gConst.ctrl.dbg_undo == 1 && (ctrl.succes_s > 0 || ctrl.succes_h > 0 || ctrl.succes_c > 0 || ctrl.succes_d > 0)) { return }
          if (ctrl.do > 0) { undo1() }
        }
        // wで自動切換え
        if (ev.code == "KeyW") {
          auto();
        }
        // Eでドラッグ切り替え
        if (ev.code == "KeyE") {
          // drag();
        }
      });
  
    }

    // ～～～～定期処理～～～～
    scene1.setInterval(function() {

      // colum単位のリフレッシュ(配置情報からy座標を再計算など)
      // ついでに得点計算
      score_plus = 0;
      // 今回undo用redoを保存対象かどうかのフラグ
      let jud_redo=0;
      let jud_refresh=0;
      for (let col=1; col<=10; col++) {
        let score_cnt = 0;
        let score_col = 0;
        if (cardList[col].refresh > 0) {
          jud_refresh = 1;
          // gFunc.add_log(log[1].text, log[1].count++, g.game.age, "リフレッシュ＜"+col+"＞", system.dbg);                         
          // undo用redoを保存対象フラグを立てる
          if (cardList[col].refresh == 1) { jud_redo = 1 } //移動完了後の標示だけリフレッシュのときは実施しない
          // 先頭からアクティブ状態の枚数をカウントする
          cardList[col].active = 0;
          let jud_active=1;
          for (let i=cardList[col].height; i>0; i--) {
            let id=cardList[col].card[i].no;
            // gFunc.add_log(log[1].text, log[1].count++, g.game.age, "リフレッシュ ("+col+"/"+i+")", system.dbg);                                 
            // 先頭は必ずアクティブ
            if (i == cardList[col].height) {
              cardList[col].active = 1;
              cardList[col].card[i].active = 1;
            } 
            // ２枚目以降は、オープン&まだアクティブ&１つ前の数字から連続&スートが一緒ならアクティブ（※得点だけでいくとsuitが異なっても加点対象とする
            else if (cardList[col].card[i].open == 1 && jud_active == 1 && cardList[col].card[i].num == cardList[col].card[i+1].num+1 && cardList[col].card[i].suit == cardList[col].card[i+1].suit) {
              cardList[col].active += 1;
              cardList[col].card[i].active = 1;
              // スコアカウントとcolumnスコアにカウント（スートが同じなら10ポイント、異なるなら5ポイント
              score_cnt += 10;
              score_col += 10;
              // アクティブが13になったら１セット完成でカードロスト＆加点
              if (cardList[col].active == 13) {
                // ★★バグ対応★★ 
                if (gConst.ctrl.dbg_undo == 1) { gSprite_button_undo.hide() }
                // ライト表現開始
                ctrl.succes_step = gConst.ctrl.speed.move;
                gFunc.add_log(log[3].text, log[3].count++, g.game.age, "ctrl.succes_step:"+ctrl.succes_step, system.dbg);                                 
                // 収束ポイントの設定：画面上部中央画面外⇒定数になったのでアニメーション側に移動
                // 完成スート数をカウント
                if (cardList[col].card[i].suit == 0) { ctrl.succes_s += 1 }
                if (cardList[col].card[i].suit == 1) { ctrl.succes_h += 1 }
                if (cardList[col].card[i].suit == 2) { ctrl.succes_c += 1 }
                if (cardList[col].card[i].suit == 3) { ctrl.succes_d += 1 }
                // 各カードをロスト処理
                for (let j=i; j<=i+12; j++) {
                  let id=cardList[col].card[j].no;
                  // statusを「完成」に
                  card.status[id] = 9;
                  card.open[id] = 1;
                  card.step[id] = gConst.ctrl.speed.move; // アニメーションをつけたときは設定する
                  card.prev_x[id] = gSprite_cardList[id].entity.x;
                  card.prev_y[id] = gSprite_cardList[id].entity.y;
                  // colとrowを範囲外に指定
                  card.col[id] = -1;
                  card.row[id] = 0;
                  // rectを黄色にして表示
                  gRect_cardList[id].entity.opacity = 0.2;
                  gRect_cardList[id].entity.cssColor = "yellow";
                  gRect_cardList[id].entity.show();
                }
                // アクティブは0、高さは-13
                cardList[col].active = 0;
                cardList[col].height -= 13;
                // スコアプラスに+12, columnスコアに-12。スコアカウントはリセット
                score_cnt = 0;
                score_col -= 120;
                // 下にカードがあってまだcloseのときはオープン処理を行う
                if (i > 1 && cardList[col].card[i-1].open == 0) {
                  let id=cardList[col].card[i-1].no;
                  gFunc.add_log(log[1].text, log[1].count++, g.game.age, "13下消えるやつ x:"+gLabel_cardList[id].entity.x+", y:"+gLabel_cardList[id].entity.y+", opa:"+gLabel_cardList[id].entity.opacity, system.dbg);
                  // ★★デバッグ★★ あとでoutで出直するときに参照する用の変数にidセット
                  ctrl.dbg = id;
                  // scaleX=0にしてレイヤー変更
                  gSprite_cardList[id].entity.scaleX = 0;
                  gLabel_cardList[id].entity.scaleX = 0;
                  gRect_cardList[id].entity.scaleX = 0;
                  gSprite_cardList[id].entity.srcX = gConst.card.srcX2;
                  gSprite_cardList[id].entity.modified();
                  gLabel_cardList[id].entity.modified();
                  layer.S2[21].append(gSprite_cardList[id].entity);         
                  layer.S2[21].append(gLabel_cardList[id].entity); 
                  layer.S2[21].append(gRect_cardList[id].entity);      
                  // カードデータ(配置)を更新
                  cardList[col].card[i-1].open = 1;
                  cardList[col].card[i-1].active = 1;
                                  
                  // カードデータ(個別)を更新
                  card.step[id] = gConst.ctrl.speed.move;
                  card.prev_x[id] = cardList[col].card[i-1].x-gConst.layout.card_x*(0); // その場で移動扱い
                  card.prev_y[id] = cardList[col].card[i-1].y; // その場で移動扱い
                  card.open[id] = 1;
                  card.status[id] = 3; // 3:オープン中
                  // columnデータを更新: うらが1枚減って、表&アクティブが1になる
                  cardList[col].last -= 1;
                  cardList[col].active += 1;              
                }
                // クリア判定：成功スート数が合計８になった場合はクリアとなる
                if (ctrl.succes_h+ctrl.succes_s+ctrl.succes_c+ctrl.succes_d == 8) {
                  // score_plusに残り時間をプラスする
                  score_plus_clear = Math.floor(10*last_time/g.game.fps);
                  // クリア表示
                  gLabel_success.show();
                  gLabel_success2.text = "のこり"+Math.floor(last_time/g.game.fps)+"秒";
                  if (system.open == 1) {
                    gLabel_success2.text = "クリア時間 "+change_time(last_time);
                  }
                  gLabel_success2.invalidate();
                  gLabel_success2.show();
                  // タイムアップ表示を出さないようにする
                  jud_finish = 1;
                  // クリア用SE
                  se06.play();
                } else {
                  // 通常の成功SE
                  se04.play();
                }
              }
            } 
            // それ以外はinactive（closeでも便宜上inactive扱い)
            else {
              jud_active = 0;
              cardList[col].card[i].active = 0;
              // inactive部分のスコアチェック
              if (i < cardList[col].height && cardList[col].card[i+1].open == 1 && cardList[col].card[i].open == 1 && cardList[col].card[i].num == cardList[col].card[i+1].num+1) {
                // スコアカウント
                if (cardList[col].card[i].suit == cardList[col].card[i+1].suit) {
                  score_cnt += 10;
                  score_col += 10;  
                } else {
                  score_cnt += 5;
                  score_col += 5;  
                }
              } else {
                // スコアリセット
                score_cnt = 0;
              }
            }
          }
          // スコアプラスとcolumn用スコアを更新する
          score_plus += score_col-cardList[col].score;
          cardList[col].score = score_col;

          // 高さとopen&inacutive枚数で高さ調整が必要になるかどうか
          // 詳細表示フラグをいったんリセット
          cardList[col].display = 0;
          // height:ここまで積み上げて使用した高さ
          let height=gConst.layout.base_y+cardList[col].last*gConst.layout.closed_height;
          // cnt_inactive:対象columnにおけるopen&inactiveカードの枚数
          let cnt_inactive=cardList[col].height-(cardList[col].last+cardList[col].active);
          // height_size:openカード分をopend_intevalのまま並べたときに必要な高さサイズ
          let height_size=(cardList[col].height-cardList[col].last-1)*gConst.layout.opened_height;
          // 枠を超える高さが必要な場合はintervalを短く変更する
          // baseのインターバル:opened_height
          let interval_inactive=gConst.layout.opened_height; 
          let interval_active=gConst.layout.opened_height; 
          // inactiveが0枚で上限を超える場合（※パラメータとしてopened_height大きすぎ時の対応
          if (cnt_inactive == 0 && height_size > g.game.height-height) {
            // インターバルは可能heightをopened枚数(-1)で等分する
            interval_active = (g.game.height-height)/(cardList[col].height-cardList[col].last-1);
            // gFunc.add_log(log[1].text, log[1].count++, g.game.age, col+": 0 interval_inactive:"+interval_inactive+", interval_active:"+interval_active, system.dbg);                         
          }
          // inactiveが存在して、上限を超える場合
          else if (cnt_inactive > 0 && height_size > g.game.height-height) {
            // inactive側をopend_height_minまで下げれば枠に収まる場合
            if ((cardList[col].active-1)*gConst.layout.opened_height+cnt_inactive*gConst.layout.opened_height_min < g.game.height-height) {
              // active側を枚数で割る
              interval_inactive = (g.game.height-height-(cardList[col].active-1)*gConst.layout.opened_height)/cnt_inactive;
              // gFunc.add_log(log[1].text, log[1].count++, g.game.age, col+": 1 interval_inactive:"+interval_inactive+", interval_active:"+interval_active, system.dbg);                         
            }
            // active側をopend_height_minまで下げれば枠に収まる場合
            else if ((cardList[col].active-1+cnt_inactive)*gConst.layout.opened_height_min < g.game.height-height) {
              // inactive側はmin
              interval_inactive = gConst.layout.opened_height_min;
              // active側は枚数で割る
              interval_active = (g.game.height-height-cnt_inactive*gConst.layout.opened_height_min)/(cardList[col].active-1);
              // gFunc.add_log(log[1].text, log[1].count++, g.game.age, col+": 2 interval_inactive:"+interval_inactive+", interval_active:"+interval_active, system.dbg);                         
            }
            // それでも収まらない場合
            else {
              // 詳細表示フラグをセット
              cardList[col].display = 1;
              // tips表示
              if (ctrl.show_display == 0) { tips.id = 2 }
              ctrl.show_display = 1;
              // inactive側は枚数で割る
              interval_inactive = (g.game.height-height-(cardList[col].active-1)*gConst.layout.opened_height_min)/cnt_inactive;
              // active側はmin
              interval_active = gConst.layout.opened_height_min;
              // gFunc.add_log(log[1].text, log[1].count++, g.game.age, col+": 3 interval_inactive:"+interval_inactive+", interval_active:"+interval_active, system.dbg);                         
            }
          }
          
          // inactive分のy座標を登録          
          for (let r=1; r<=cnt_inactive; r++) {
            let row=cardList[col].last+r;
            cardList[col].card[row].y = height;
            height += interval_inactive;
            // gFunc.add_log(log[1].text, log[1].count++, g.game.age, " col:"+col+", row:"+row+", active: 0, cardList[col].card[row].y: "+cardList[col].card[row].y, system.dbg);                         
          }                      
          // active分のy座標を登録
          for (let r=1; r<=cardList[col].active; r++) {
            let row=cardList[col].height-cardList[col].active+r;
            cardList[col].card[row].y = height;
            height += interval_active;
            // gFunc.add_log(log[1].text, log[1].count++, g.game.age, " col:"+col+", row:"+row+", active: 1, cardList[col].card[row].y: "+cardList[col].card[row].y, system.dbg);                         
          }

          // 「表」のカード(card.status=4)について
          //    設置状態のカードについては移動設定を追加する
          //    レイヤーを再登録する          
          for (let row=1; row<=cardList[col].height; row++) {
            let id=cardList[col].card[row].no;
            // gFunc.add_log(log[1].text, log[1].count++, g.game.age, " リフレッシュ対象rowチェック:"+row, system.dbg);                         
            if (card.status[id] == 4) {
              // gFunc.add_log(log[1].text, log[1].count++, g.game.age, "  リフレッシュ実施:"+row, system.dbg);                         
              // リフレッシュフラグが1のときのみ、移動データをセット
              if (cardList[col].refresh == 1) {
                card.step[id] = gConst.ctrl.speed.move;
                card.prev_x[id] = gSprite_cardList[id].entity.x; 
                card.prev_y[id] = gSprite_cardList[id].entity.y; 
              }
              // レイヤー再設定
              layer.S2[21].append(gSprite_cardList[id].entity);         
              layer.S2[21].append(gLabel_cardList[id].entity); 
              layer.S2[21].append(gRect_cardList[id].entity);
            }
          }
        }
        cardList[col].refresh = 0;
      }
      // 表示(数字/フィルタの透過情報が中心)のリフレッシュ
      if (jud_refresh == 1) {
        for (let col=0; col<=10; col++) {
          // gFunc.add_log(log[1].text, log[1].count++, g.game.age, "表示リフレッシュ "+col, system.dbg);
          for (let row=1; row<=cardList[col].height; row++) {
            let id=cardList[col].card[row].no;
            if (ctrl.undo == 1) {
              card.step[id] = 1
            }
            // 状態に合わせてラベルのopacityを設定する
            if (card.status[id] == 0) gLabel_cardList[id].entity.opacity = 0; 
            if (card.status[id] == 1) gLabel_cardList[id].entity.opacity = 1; 
            if (card.status[id] == 2) gLabel_cardList[id].entity.opacity = 0; 
            if (card.status[id] == 3) gLabel_cardList[id].entity.opacity = 1; 
            if (card.status[id] == 4) gLabel_cardList[id].entity.opacity = 1; 
            if (card.status[id] == 5) gLabel_cardList[id].entity.opacity = 1; 
            if (card.status[id] == 6) gLabel_cardList[id].entity.opacity = 1; 
            if (card.status[id] == 9) gLabel_cardList[id].entity.opacity = 1; 
            // open&inactiveの場合はフィルタを表示する
            if (col != 0 && (cardList[col].card[row].active == 0 && cardList[col].card[row].open == 1)) {
              gRect_cardList[id].entity.opacity = 0.5;
              gRect_cardList[id].entity.scaleX = 0.5;
            } else {
              gRect_cardList[id].entity.opacity = 0;
            }
            gRect_cardList[id].entity.modified();
            // gFunc.add_log(log[2].text, log[2].count++, g.game.age, "アクティブ枚数:"+cardList[col].active, system.dbg);                         
          }
        }
      }

      // スコア更新
      if (ctrl.score_refresh == 1) {
        // 成功数の標示の更新
        gLabel_success_cnt_s.text = ""+ctrl.succes_s;
        gLabel_success_cnt_s.invalidate();
        gLabel_success_cnt_h.text = ""+ctrl.succes_h;
        gLabel_success_cnt_h.invalidate();
        gLabel_success_cnt_c.text = ""+ctrl.succes_c;
        gLabel_success_cnt_c.invalidate();
        gLabel_success_cnt_d.text = ""+ctrl.succes_d;
        gLabel_success_cnt_d.invalidate();
        // 成功数と各列のスコア計算結果から現在の得点を計算
        let score_now = (ctrl.succes_s+ctrl.succes_h+ctrl.succes_c+ctrl.succes_d)*500;
        for (let i=1; i<=10; i++) { score_now += cardList[i].score }
        // クリア残り時間加点分も加える
        score_now += score_plus_clear;
        // 前回までのスコアとの差を求める
        score_plus = score_now-score;
        // スコアプラスを標示
        gLabel_score_plus.text = "";
        gLabel_score_plus.invalidate();
        if (score_plus != 0) {
          // 獲得スコアを表示
          if (score_plus >= 0) { gLabel_score_plus.text = "+"+score_plus+"pt!" }
          else                 { gLabel_score_plus.text = score_plus+"pt!" }
          gLabel_score_plus.invalidate();
          // スコアを更新
          score = score_now;
          gLabel_score.text = ""+score;
          gLabel_score.invalidate();
          // ニコ生ゲーム時にスコアをサーバへ送信        
          if (gConst.jud_rensyu == 0) { g.game.vars.gameState = { score: score }; }
        }
        // ctrl.score_refreshを解除
        ctrl.score_refresh = 0;
        // 公開のときはクリアで得点表記を消す
        if (system.open == 1 && score >= 4000) {
          gLabel_score.hide();
          gLabel_score_plus.hide();
          gLabel_score_header.hide();
        }
      }
      // undo用redoを保存する（※undo実施後のリフレッシュの場合は保存しない。当然だが・・・）
      if (jud_redo == 1 && ctrl.undo == 0) {
        ctrl.do += 1;
        // redo:やりかたその１用
        redo[ctrl.do] = {
          status: {},
          col: {},
          row: {},
          score: score,
          score_col: {},
          succes_s: ctrl.succes_s,
          succes_h: ctrl.succes_h,
          succes_c: ctrl.succes_c,
          succes_d: ctrl.succes_d,
        };
        for (let col=1; col<=10; col++) {
          redo[ctrl.do].score_col[col] = cardList[col].score;
        }
        for (let i=1; i<=104; i++) {
          redo[ctrl.do].status[i] = card.status[i];
          redo[ctrl.do].col[i] = card.col[i];
          redo[ctrl.do].row[i] = card.row[i];
        }
        gFunc.dbg_message(sLabel_debug_msg, "undo用redoログ取得: "+ctrl.do, 0, system.dbg);
        // redo：やりかたその２用
        // コントロール系はその１にカードデータを追加する
        redo2[ctrl.do] = {
          status: {},
          col: {},
          row: {},
          score: score,
          score_col: {},
          succes_s: ctrl.succes_s,
          succes_h: ctrl.succes_h,
          succes_c: ctrl.succes_c,
          succes_d: ctrl.succes_d,
          card: {}, // 追加
          cardList: {}, // 追加
        }
        // スコア系もその１と同じ
        for (let col=1; col<=10; col++) {
          redo2[ctrl.do].score_col[col] = cardList[col].score;
        }
        // カードデータは配列情報そのまま
        redo2[ctrl.do].card = card;
        redo2[ctrl.do].cardList = cardList;
      }
      ctrl.undo = 0; // undoフラグを解除

    

      // カード単位のリフレッシュ
      for (let i=1; i<=104; i++) {
        // 移動中もしくはオープン/クローズ中(もどしで発生する)のアニメーション
        if (card.step[i] > 0) {
          card.step[i] -= 1;
          let x=0; 
          let y=0;
          if (card.col[i] >= 0) {
            x = cardList[card.col[i]].card[card.row[i]].x-(cardList[card.col[i]].card[card.row[i]].x-card.prev_x[i])*((card.step[i]/gConst.ctrl.speed.move)**3);
            y = cardList[card.col[i]].card[card.row[i]].y-(cardList[card.col[i]].card[card.row[i]].y-card.prev_y[i])*((card.step[i]/gConst.ctrl.speed.move)**3);
          } else {
            let d=(7-((i-1)%13+1))*30;
            if (card.step[i] >= gConst.ctrl.speed.move/2) {
              let per=(card.step[i]-(gConst.ctrl.speed.move/2))/(gConst.ctrl.speed.move/2)
              x = g.game.width/2-(g.game.width/2-card.prev_x[i])*per;
              y = g.game.height/2+d-(g.game.height/2+d-card.prev_y[i])*per;
            } else {
              let per=card.step[i]/(gConst.ctrl.speed.move/2)
              x = g.game.width/2;
              y = 0-(0-(g.game.height/2+d))*per;
            }
          }
          let scaleX_set=1;
          if (card.open[i] == 1)  scaleX_set = 1-(2*card.step[i]/gConst.ctrl.speed.move);
          if (card.open[i] == -1) scaleX_set = (2*card.step[i]/gConst.ctrl.speed.move)-1;
          if (card.open[i] != 0)  scaleX_set = Math.abs(Math.cos(2*(card.step[i]/gConst.ctrl.speed.move)*Math.PI))
          gSprite_cardList[i].entity.x = x;
          gSprite_cardList[i].entity.y = y;
          gLabel_cardList[i].entity.x = x;
          gLabel_cardList[i].entity.y = y-100;
          gRect_cardList[i].entity.x = x;
          gRect_cardList[i].entity.y = y;
          gSprite_cardList[i].entity.scaleX = scaleX_set*0.5;
          gSprite_cardList[i].entity.modified();
          gLabel_cardList[i].entity.scaleX = scaleX_set;
          gLabel_cardList[i].entity.modified();
          gRect_cardList[i].entity.scaleX = scaleX_set*0.5;
          gRect_cardList[i].entity.modified();

          // 今回の移動で完了のとき
          if (card.step[i] == 0) {
            // オープンフラグを0に(オープンが発生していたかどうかにかかわらず)
            card.open[i] = 0;
            // カードのステータスを更新
            if      (card.status[i] == 1) card.status[i] = 4;
            else if (card.status[i] == 3) card.status[i] = 4;
            else if (card.status[i] == 6) card.status[i] = 4;
            // 9のときは消える
            //  ⇒消さずに画面外に位置取ってみよう⇒アニメーション先をすでに画面外に変更したのでここでは不要
            else if (card.status[i] == 9) {
              card.status[i] = 10;
              gRect_cardList[i].entity.cssColor = "gray";
            }
            // リフレッシュフラグをセット(実施は次のフレーム)
            if (card.col[i] >= 0) { cardList[card.col[i]].refresh = 2 }
          }
        }
      }

      // ＝＝ライト表現＝＝
      if (ctrl.succes_step > 0) {
        ctrl.succes_step -= 1;
        gRect_light.opacity = 0.3*ctrl.succes_step/gConst.ctrl.speed.move;
        gFunc.add_log(log[3].text, log[3].count++, g.game.age, "ctrl.succes_step:"+ctrl.succes_step+", gRect_light.opacity: "+gRect_light.opacity, system.dbg);                                 
      }
              
      // ＝＝システム全体の状態遷移処理＝＝
      // カウントダウン
      if (system.dbg >= 0) { // 折り畳み用
        if (system.open == 1 && scene_status == gConst.scene_main) {
          last_time += 1;
          gLabel_time.text = change_time(last_time);
          gLabel_time.invalidate();
        }
        else {
          if (last_time > 0) { last_time -= 1 }
        }
        // 残り時間表示を更新する ※切り上げ切り捨てはtime_roundで指定
        if (gConst.time_round == 1) { sLabel_last_time.text = ""+Math.ceil(last_time/g.game.fps) }
        else                        { sLabel_last_time.text = ""+Math.floor(last_time/g.game.fps) }
        sLabel_last_time.invalidate();
      }

      // 状態ごとの処理
      if (system.dbg >= 0) { // 折り畳み用
        // title時間
        if (scene_status == gConst.scene_title) {
          // last_timeが0になったとき、遷移処理を行いステータスを更新する
          if (last_time <= 0) {
            // skipボタン(旧スタートボタン)をhelpアニメ中は非表示にする
            tSprite_start.hide(); 
            // ★1.0.3.0追加★ 背景を透過させる
            sSprite_back.opacity = 0.8;
            // 次のシーンへ
            scene_status = 100; // ステータスはhelpアニメ用の値
            last_time = 0; // helpアニメを利用しない場合は即時進ませるように0をセット
            // カウントダウン表示をいったん消す
            sLabel_last_time.hide();
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
          // last_timeが0になったとき、遷移処理を行いステータスを更新する
          if (last_time <= 0) {
            // カウントダウン表示を再表示
            // sLabel_last_time.show();
            // 戻る／リスタートのボタンを表示する
            if (gConst.use_setting == 1 && system.open == 1) {
              sSprite_button_back.show(); // 戻るボタン(※debugのときのみappendされている
              sSprite_button_restart.show(); // リスタートボタン(※debugのときのみappendされている
            }
            // レイヤー表示の切替
            layer.S[1].hide(); // シーン1(タイトル用)のレイヤーを非表示にする 
            layer.S[2].show(); // 
            // layer.S[2].show(); // シーン2(ゲーム用)のレイヤーを表示する
            // タイムアップで次に進む
            scene_status = gConst.scene_ready;
            last_time = gConst.time_ready*g.game.fps;
            // ★★デバッグ★★ tipsをひとつ表示
            tips.id = 1; 
            // 初期状態をundo用redoに保存させる
            for (let i=1; i<=10; i++) cardList[i].refresh = 1;
          }
        }
        // Ready時間
        if (scene_status == gConst.scene_ready) {
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
            // タイムアップで次に進む
            scene_status = gConst.scene_main;
            last_time = gConst.time_main*g.game.fps;
            // 公開モードのときは、時間表記を変更する
            if (system.open == 1) {
              sLabel_last_time.hide();
              last_time = 1;
              gLabel_time.text = change_time(last_time);
              gLabel_time.invalidate();
              gLabel_time.show();
            }
      
          }
        }
        // main時間
        if (scene_status == gConst.scene_main) {
          // BGMを開始する(gConst.bgm_start秒だけ遅らせてスタート)
          if (jud_bgm == 0 && last_time <= g.game.fps*(gConst.time_main-gConst.bgm_start)) { 
            jud_bgm = 1;
            // bgm01.stop();
            bgm01.play();
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
            bgm01.stop();
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
                tips.id = 100+Math.ceil(random.generate()*gConst.tips2.number);
                gFunc.add_log(log[1].text, log[1].count++, g.game.age, "tips2 id: "+tips.id, system.dbg);
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
      if (gConst.use_help == 2) {      
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

    }, 1000/g.game.fps);





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
      if (gConst.set_bgm == 1) { layer.L[4].append(sSprite_button_BGM) }
      // SEボタン用画像
      var sSprite_button_SE = gEntity.sSprite_button_setting(scene1, gConst, 0, 3, 1);
      if (gConst.se_button == 2) { 
        set_se = 0;
        g.game.audio.sound.volume = 0;
        sSprite_button_SE.srcX += gConst.button_src_interval;
      }
      if (gConst.set_se == 1) { layer.L[4].append(sSprite_button_SE) }  
      // バックボタン用画像
      var sSprite_button_back = gEntity.sSprite_button_setting(scene1, gConst, 0, 4, 5);
      if (system.dbg == 2 || gConst.jud_rensyu == 1) { layer.L[4].append(sSprite_button_back) }  
      sSprite_button_back.hide();
      // リスタートボタン用画像
      var sSprite_button_restart = gEntity.sSprite_button_setting(scene1, gConst, 0, 5, 3);
      layer.L[4].append(sSprite_button_restart);      
      if (system.open == 0) sSprite_button_restart.hide();

      // リスタートボタンで戻ってきた場合は、last_timeを1にセットしてタイトルを即飛ばす
      if (gConst.jud_restart == 2) {
        gConst.jud_restart = 0;
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
      var sSprite_button_help = gEntity.sSprite_button_setting(scene1, gConst, 0, 1, 1);
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