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
      "help",
      "tips",
      "button_new",
      "BGM01","SE00","SE01","SE02","SE03","SE04","SE05","SE06",
      // ＝＝ゲーム個別＝＝
      "block","player","object","stick",
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

      var tLabel_guide_msg1 = gEntity.tLabel_guide_msg(scene1, gConst, gConst.font000, 80, 240, 32, "タイルトラバースの練習用です。");
      layer.S1[3].append(tLabel_guide_msg1);
      var tLabel_guide_msg2 = gEntity.tLabel_guide_msg(scene1, gConst, gConst.font000, 140, 330, 24, "３方向が囲まれたタイルをクリックしてください。");
      layer.S1[3].append(tLabel_guide_msg2);
      var tLabel_guide_msg3 = gEntity.tLabel_guide_msg(scene1, gConst, gConst.font000, 140, 370, 24, "「easy」を押すと、動かせるタイルにスコアが表示されます。");
      layer.S1[3].append(tLabel_guide_msg3);
      var tLabel_guide_msg4 = gEntity.tLabel_guide_msg(scene1, gConst, gConst.font000, 140, 410, 24, "「back」で１つ前、「reset」で最初に戻ります。");
      layer.S1[3].append(tLabel_guide_msg4);      

      if (system.extra == 1) {
        tLabel_guide_msg1.text = "３方向が囲まれているタイルをすべらせるゲームです";
        tLabel_guide_msg2.text = "すべった距離が得点になります。";
        tLabel_guide_msg3.text = "誤クリックは５回目以降は１秒のフリーズがあります";
        tLabel_guide_msg4.text = "";
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
      // エクストラモード時の変数差し替えなど
      if (system.extra == 1) {
        // ゲーム時間を変更
        gConst.time_main = gConst.time_main2;
        // タイル割合を変更
        gConst.floor.rate = gConst.floor.rate2;
        // タイルの移動速度を変更
        gConst.block.speed = gConst.block.speed2;
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



    // ～～～～ゲーム個別～～～～


    // ＝＝管理＝＝
    if (system.dbg >= 0) { // 折り畳み用
      var ctrl = {
        easy: 0, // イージーモードかどうか
        status: 0, // ゲーム管理用ステータス
        step: 0, // ゲーム管理用カウンタ
        posi_init_col: 2, // フロア開始時点のキャラ位置の仮データ
        posi_init_raw: 2, // フロア開始時点のキャラ位置の仮データ
        floor: 1, // 現在の階層
        max_col: 0, // 現在のフロアにおけるブロック横幅数
        max_raw: 0, // 現在のフロアにおけるブロック縦幅数
        tile_num: 0, // そのフロアにおけるタイル総数
        tile_init: {},
        wall_col: 0, // 現在のフロアにおける壁候補横幅数（奇数の個数
        wall_raw: 0, // 現在のフロアにおける壁候補縦幅数（奇数の個数
        way_col: 0, // 現在のフロアにおける通路候補横幅数（偶数の個数
        way_raw: 0, // 現在のフロアにおける通路候補縦幅数（偶数の個数
        miss_cnt: 0, // ミス回数のカウンタ
        miss_step: 0, // ミス時のカバー表示管理用
      }
      // エクストラモード時の初期値など
      if (system.extra == 1) {
        ctrl.easy = 1; // 開始時のみイージーモードで点数が入るとイージーモード終了
      }

    }

    // ＝＝レイアウト全般＝＝
    if (system.dbg >= 0) { // 折り畳み用
      // ストーリー用幕の台紙
      var gRect_story_cover = gEntity.gRect_story_cover(scene1);
      layer.S2[35].append(gRect_story_cover);
      // ストーリー用メッセージのラベル
      var gLabel_story_msg1 = gEntity.gLabel_story_msg1(scene1, gConst.font003, 0, "メッセージ０");
      layer.S2[35].append(gLabel_story_msg1);
    }


    // ＝＝フロアデータ・エンティティ＝＝
    if (system.dbg >= 0) { // 折り畳み用
      var click = {
        jud: 0,
        x: 0,
        y: 0,
      }
      // フィールド用の台紙
      var gRect_field = gEntity.gRect_field(scene1, gConst);
      layer.S2[20].append(gRect_field);
      // フィールド用台紙へのクリックでブロックへのアクション
      gRect_field.onPointDown.add(ev => {
        if (scene_status == gConst.scene_main) {
          // クリック状態判定フラグをセット
          click.jud = 1;
          // クリックしたポイントの情報を保存する
          click.x = ev.point.x;
          click.y = ev.point.y;
          gFunc.dbg_message(sLabel_debug_msg, "クリック "+click.x+"/"+click.y, 0, system.dbg);
        }        
      });

      // ブロックデータ
      var block = {
        col: 1, // 表示中のブロックの起点ID
        raw: 1, // 表示中のブロックの起点ID
        score: 0, // scan_score結果の格納用     
        direct: 0, // scan_score結果の格納用     
      }
      // ブロックリストデータ
      var blockList = {}
      for (let col=1; col<=gConst.floor.max_col; col++) {
        blockList[col] = {};
        for (let raw=1; raw<=gConst.floor.max_raw; raw++) {
          blockList[col][raw] = {
            ind: 0,
            status: 0,
            step: 0,
            prev_x: 0,
            prev_y: 0,
          }
        }
      }
      // ブロック位置データの作成（※ステージサイズを可変としたためここでの値は仮となる
      for (let col=1; col<=gConst.floor.max_col; col++) {
        gConst.block.x[col] = {};
        gConst.block.y[col] = {};
        for (let raw=1; raw<=gConst.floor.max_raw; raw++) {
          gConst.block.x[col][raw] = gConst.size.block*(col-0.5);
          gConst.block.y[col][raw] = gConst.size.block*(raw-0.5);
        }
      }

      // タイル画像
      var gSprite_blockList = {}
      for (let col=1; col<=gConst.floor.max_col; col++) {
        // gSprite_blockList[col] = {};
        for (let raw=1; raw<=gConst.floor.max_raw; raw++) {
          let ind=(raw-1)*gConst.floor.max_col+col;
          const gSprite_block = { entity: gEntity.gSprite_block(scene1, gConst, ind%16, 0, 0) }
          gSprite_blockList[ind] = gSprite_block;
          layer.S2[20].append(gSprite_blockList[ind].entity); 
          // ★★デバッグ★★ (1,1)から仮配置
          gSprite_blockList[ind].entity.x = 25+(gConst.size.block+2)*col;  //gConst.block.x[col][raw]+(gConst.layout.base.x-player.x);
          gSprite_blockList[ind].entity.y = 50+(gConst.size.block+2)*raw; //gConst.block.y[col][raw]+(gConst.layout.base.y-player.y);
          gSprite_blockList[ind].entity.modified();
          gFunc.add_log(log[2].text, log[2].count++, g.game.age, "タイル画像 "+ind, system.dbg);
        }
      }

      // 関数:フィールドの作成
      var make_field = function(reset) {
        // 現在のステージの基準位置
        let base_x = gConst.layout.base.x-0.5*ctrl.max_col*(gConst.size.block+2);
        let base_y = gConst.layout.base.y-0.5*ctrl.max_raw*(gConst.size.block+2);        

        // フィールド台紙を作成
        gRect_field.x = base_x;
        gRect_field.y = base_y;
        // gRect_field.scaleX = (ctrl.max_col/gConst.floor.max_col)*(gConst.size.block+2);
        // gRect_field.scaleY = (ctrl.max_raw/gConst.floor.max_raw)*(gConst.size.block+2);
        gRect_field.modified();

        // 現在のステージの縦横サイズにおける位置データを作成する
        for (let col=1; col<=ctrl.max_col; col++) {
          for (let raw=1; raw<=ctrl.max_raw; raw++) {
            gConst.block.x[col][raw] = base_x+(gConst.size.block+2)*(col-0.5);
            gConst.block.y[col][raw] = base_y+(gConst.size.block+2)*(raw-0.5);  
            // ついでにブロックデータも初期化
            blockList[col][raw].ind = 0; // そのブロックに存在するタイル
            blockList[col][raw].status = 0; // ブロックが存在する場合、未使用か使用済みか（※1以上のときは獲得したスコア数
            blockList[col][raw].step = 0; // アニメーション中の場合のステップ用
            blockList[col][raw].prev_x = 0; // アニメーション中の場合の移動元座標
            blockList[col][raw].prev_y = 0; // アニメーション中の場合の移動元座標
          }
        }
        // タイルの配置を決める
        let last_posi={}; // 設置可能な位置の残り
        for (let i=1; i<=ctrl.max_col*ctrl.max_raw; i++) { last_posi[i] = i }
        let last=ctrl.max_col*ctrl.max_raw;
        for (let i=1; i<=ctrl.tile_num; i++) {
          // resetフラグが立っているときはtile_initの値をそのまま使用する
          if (reset == 1) {
            let data=ctrl.tile_init[i];
            let col=1+(data-1)%ctrl.max_col;
            let raw=Math.ceil(data/ctrl.max_col);
            blockList[col][raw].ind = data;
          } else {
            // 残りから選択
            let ind=Math.floor(random.generate()*last)+1;
            if (ind > last) { ind = last }
            gFunc.add_log(log[2].text, log[2].count++, g.game.age, "random:"+ind+" ("+last+")", system.dbg);
            let data=last_posi[ind];
            for (let j=ind; j<last; j++) { last_posi[j] = last_posi[j+1] }
            last_posi[last] = data; 
            // 選択した位置にタイルをセット
            let col=1+(data-1)%ctrl.max_col;
            let raw=Math.ceil(data/ctrl.max_col);
            blockList[col][raw].ind = data;
            // let col=1+(i-1)%ctrl.max_col;
            // let raw=Math.ceil(i/ctrl.max_col);
            // blockList[col][raw].ind = i;
            gFunc.add_log(log[2].text, log[2].count++, g.game.age, "i:"+i+" => "+data+" ("+col+"/"+raw+")", system.dbg);
            // リセット用initにデータをセット
            ctrl.tile_init[i] = data;   
          }
          // 残りタイル数を減らして次へ
          last -= 1;
        }
      }

      // 関数:ブロックのスコアと方向を求める
      var scan_score = function(col, raw) {
        let s=[0,0,0,0,0];
        // 左をチェック
        let c=col;
        let r=raw;
        while (c > 1) {
          c -= 1;
          if (blockList[c][r].ind == 0) { s[1] += 1 }
          else                          { break }
        }
        // 右をチェック
        c=col;
        r=raw;
        while (c < ctrl.max_col) {
          c += 1;
          if (blockList[c][r].ind == 0) { s[2] += 1 }
          else                          { break }
        }
        // 上をチェック
        c=col;
        r=raw;
        while (r > 1) {
          r -= 1;
          if (blockList[c][r].ind == 0) { s[3] += 1 }
          else                          { break }
        }
        // 下をチェック
        c=col;
        r=raw;
        while (r < ctrl.max_raw) {
          r += 1;
          if (blockList[c][r].ind == 0) { s[4] += 1 }
          else                          { break }
        }
        // スコアと方向をチェック
        block.score = 0;
        block.direct = 0;
        for (let d=1; d<=4; d++) {
          if (s[d] > 0) {
            if (block.score > 0) {
              block.score = 0;
              block.direct = 0;      
              return;
            } else {
              block.score = s[d];
              block.direct = d;
            }
          }
        }
      }      

      // 関数:ブロック情報表示のリフレッシュ
      var refresh_block = function() {
        // 各タイルをいったん非表示
        for (let i=1; i<=ctrl.tile_num; i++) gSprite_blockList[i].entity.hide();
        // 各ブロックに対して
        for (let col=1; col<=ctrl.max_col; col++) {
          for (let raw=1; raw<=ctrl.max_raw; raw++) {
            // ブロック上にタイルが存在しない場合
            if (blockList[col][raw].ind == 0) {
              continue ; 
            }
            // ブロック上にタイルが存在する場合
            else {
              let ind=blockList[col][raw].ind;
              // ステータスが「未処理」の場合、現状におけるスコアを計算し画像を差し替える
              if (blockList[col][raw].status == 0) {
                scan_score(col, raw);
                if (ctrl.easy == 0) { block.score = 0 }
                gSprite_blockList[ind].entity.srcX = gConst.block.src.x;
                gSprite_blockList[ind].entity.srcY = gConst.block.src.y+gConst.block.src.cyc*block.score;                
              }
              // ステータスが「処理済み」の場合、セットされているスコアに合わせた画像に差し替える
              else {
                gSprite_blockList[ind].entity.srcX = gConst.block.src.x+gConst.block.src.cyc*1;
                gSprite_blockList[ind].entity.srcY = gConst.block.src.y+gConst.block.src.cyc*blockList[col][raw].status;                
              }
              // 描写位置を更新する
              if (blockList[col][raw].step > 0) {
                blockList[col][raw].step -= 1;
                gSprite_blockList[ind].entity.x = gConst.block.x[col][raw]-(gConst.block.x[col][raw]-blockList[col][raw].prev_x)*(blockList[col][raw].step/gConst.block.speed);   
                gSprite_blockList[ind].entity.y = gConst.block.y[col][raw]-(gConst.block.y[col][raw]-blockList[col][raw].prev_y)*(blockList[col][raw].step/gConst.block.speed);  
              } else {
                gSprite_blockList[ind].entity.x = gConst.block.x[col][raw];
                gSprite_blockList[ind].entity.y = gConst.block.y[col][raw];
              }
              gSprite_blockList[ind].entity.modified();
              gSprite_blockList[ind].entity.show();
            }
          }
        }
        // 未処理のうちスコアが１以上のものの個数（enable値）を更新する
      }

    }

    // ＝＝アクション関係＝＝
    if (system.dbg >= 0) { // 折り畳み用
      // REDO（UNDO用データ）
      var redo = {
        cnt: 0,
        cnt_max: 0,
      }
      var redoList = {};

      // イージーボタン
      var gLabel_easy = gEntity.gLabel_easy(scene1, gConst, gConst.font001, "easy");
      layer.S2[34].append(gLabel_easy);
      if (system.extra == 1) gLabel_easy.hide();
      // リセットボタン
      var gLabel_reset = gEntity.gLabel_reset(scene1, gConst, gConst.font001, "reset");
      layer.S2[34].append(gLabel_reset);
      if (system.extra == 1) gLabel_reset.hide();
      // 戻るボタン
      var gLabel_back = gEntity.gLabel_back(scene1, gConst, gConst.font001, "back");
      layer.S2[34].append(gLabel_back);
      if (system.extra == 1) gLabel_back.hide();

      // イージーボタンを押したとき
      gLabel_easy.onPointDown.add(ev => {
        if (scene_status == gConst.scene_main) {
          if (ctrl.easy == 0) {
            ctrl.easy = 1;
            gLabel_easy.opacity = 1;         
          } else {
            ctrl.easy = 0;
            gLabel_easy.opacity = 0.6;         
          }
          // refresh_block();
        }        
      });
      // リセットボタンを押したとき
      gLabel_reset.onPointDown.add(ev => {
        if (scene_status == gConst.scene_main) {
          // スコアをリセット
          score_plus = -score;
          // ブロックリストデータを初期化する
          make_field(1);
          // 画面表示もリフレッシュ       
          // refresh_block();
        }        
      });
      // 戻るボタンを押したとき
      gLabel_back.onPointDown.add(ev => {
        if (scene_status == gConst.scene_main) {
          // redo.cntが0のときは何もしない
          if (redo.cnt == 0) return;
          // SEを鳴らす
          se01.play();
          // 盤面をひとつ戻した値に更新する
          redo.cnt -= 1;
          if (redo.cnt == 0) {
            make_field(1);
            score_plus = -score;
          } else {
            for (let col=1; col<=ctrl.max_col; col++) {
              for (let raw=1; raw<=ctrl.max_raw; raw++) {
                blockList[col][raw].ind = redoList[redo.cnt].blockList[col][raw].ind;
                blockList[col][raw].status = redoList[redo.cnt].blockList[col][raw].status;
                blockList[col][raw].step = 0;
                blockList[col][raw].prev_x = 0;
                blockList[col][raw].prev_y = 0;
              }
            }   
            score_plus = -redoList[redo.cnt].score_plus; 
          }
          // 画面表示もリフレッシュ       
          // refresh_block();
        }        
      });

    }


    // ～～～～定期処理～～～～
    scene1.setInterval(function() {

   
      // ＝＝ゲーム管理＝＝
      if (scene_status == gConst.scene_main) {
        // ctrl.status=0: 各種初期設定
        if (ctrl.status == 0) {
          // フロアデータ作成＆アイキャッチ作成へ
          ctrl.status = 1;
        }
        // ctrl.status=1: フロアデータ作成＆アイキャッチ作成
        if (ctrl.status == 1) {
          // フロアデータ用の縦横サイズ
          ctrl.max_col = gConst.floor.max_col;
          ctrl.max_raw = gConst.floor.max_raw;
          if (ctrl.floor < gConst.floor.max) {
            // ctrl.max_col = gConst.floor.col[ctrl.floor];
            // ctrl.max_raw = gConst.floor.raw[ctrl.floor];
          }
          // 設置するタイルの数
          ctrl.tile_num=Math.floor(gConst.floor.rate*ctrl.max_col*ctrl.max_raw); // フロアに設置するブロックの残り個数
          gFunc.dbg_message(sLabel_debug_msg, "ctrl.tile_num: "+ctrl.tile_num, 0, system.dbg);

          // ブロックデータをセットする
          make_field(0);

          // ブロック描写の更新
          refresh_block();

          // アイキャッチ作成・表示
          gRect_story_cover.show();
          gLabel_story_msg1.text = "Ready"; //"stage "+ctrl.floor
          gLabel_story_msg1.x = gConst.eyecatch.x1+gConst.eyecatch.x;
          gLabel_story_msg1.invalidate();
          gLabel_story_msg1.show();
          // フロアアイキャッチ表示中へ
          ctrl.status = 2;
          ctrl.step = gConst.step.eyecatch;
        }
        // ctrl.status=2: フロアアイキャッチ表示中
        if (ctrl.status == 2) {
          // 管理用残りstepをダウン
          ctrl.step -= 1;
          let step = ctrl.step-(gConst.eyecatch.time1-gConst.eyecatch.time);
          if (step >= 0) {
            let x=gConst.eyecatch.x1+gConst.eyecatch.x*(step/gConst.eyecatch.time);
            gLabel_story_msg1.x = gConst.eyecatch.x1+gConst.eyecatch.x*(step/gConst.eyecatch.time);
            gLabel_story_msg1.invalidate();
          }
          // step=0で次のフロア攻略へ
          if (ctrl.step <= 0) {
            // アイキャッチを非表示
            gRect_story_cover.hide();
            gLabel_story_msg1.hide();
            // フロア攻略中（メイン）へ
            ctrl.status = 3;
            // ★★デバッグ★★ 一定時間経過で次のフロアへ
            ctrl.step = 150;
          }
        }
        // ctrl.status=3: フロア攻略中
        if (ctrl.status == 3) {
          refresh_block();

          // ★★デバッグ★★ 一定時間経過で次のフロアへ
          ctrl.step -= 1
          // gFunc.dbg_message(sLabel_debug_msg, "ctrl.step: "+ctrl.step, 0, system.dbg);
          if (ctrl.step <= 0) {
            // フロアクリアへ
            // ctrl.status = 4; // ★★攻略判定の実装が完成したらコメントアウトする★★
          }
        }
        // ctrl.status=4: フロアクリア⇒status1へ
        if (ctrl.status == 4) {
          ctrl.floor += 1;
          // 次のフロアのデータ作成＆アイキャッチへ
          ctrl.status = 1;
        }
        // ctrl.status=9: タイムアップ処理        
      }


      // ＝＝アクション管理＝＝
      if (click.jud == 1) {
        click.jud = 0;
        // スコアの初期化
        score_plus = 0;
        // クリック位置からタイルNoを取得する
        let col=Math.ceil(click.x/(gConst.size.block+2));
        let raw=Math.ceil(click.y/(gConst.size.block+2));
        let ind=blockList[col][raw].ind;
        gFunc.dbg_message(sLabel_debug_msg, "クリック ("+col+"/"+raw+")⇒ "+ind, 0, system.dbg);
        // クリック先が未実行タイルの場合はスコアを取得して。1以上なら処理を実施する
        if (blockList[col][raw].ind == 0) return;
        if (blockList[col][raw].status > 0) return;
        scan_score(col, raw);
        if (block.score == 0) {
          // ★★ペナルティ処理や失敗SE
          se02.play();
          if (system.extra == 1) {
            ctrl.miss_cnt += 1;
            if (ctrl.miss_cnt >= 5) { ctrl.miss_step = 30 }
          }
        } else {
          // SEを鳴らす
          if (block.score == 1) { se03.play() }
          else                  { se04.play() }          
          // アニメーション開始と処理
          let next_col=col;
          let next_raw=raw;
          if      (block.direct == 1) { next_col -= block.score }
          else if (block.direct == 2) { next_col += block.score }
          else if (block.direct == 3) { next_raw -= block.score }
          else if (block.direct == 4) { next_raw += block.score }
          // 所属しているタイルを更新
          blockList[next_col][next_raw].ind = blockList[col][raw].ind;
          blockList[next_col][next_raw].status = block.score;
          blockList[next_col][next_raw].step = gConst.block.speed;
          blockList[next_col][next_raw].prev_x = gConst.block.x[col][raw];
          blockList[next_col][next_raw].prev_y = gConst.block.y[col][raw];
          blockList[col][raw].ind = 0;
          blockList[col][raw].status = 0;
          blockList[col][raw].step = 0;
          blockList[col][raw].prev_x = 0;
          blockList[col][raw].prev_y = 0;
          // スコアプラスをセット
          score_plus = block.score;
          // REDO（UNDO用データ）を作成する
          redo.cnt += 1;
          // redo.cntが今回初めての回数のときはデータ領域を作成する
          if (redo.cnt > redo.cnt_max) {
            redo.cnt_max += 1;
            redoList[redo.cnt] = {
              score_plus: 0,
              blockList: {},      
            }
            for (let c=1; c<=ctrl.max_col; c++) {
              redoList[redo.cnt].blockList[c] = {};
              for (let r=1; r<=ctrl.max_raw; r++) {
                redoList[redo.cnt].blockList[c][r] = {
                  ind: 0,
                  status: 0,
                }
              }
            }    
          }
          // データをセット
          redoList[redo.cnt].score_plus = block.score;
          for (let c=1; c<=ctrl.max_col; c++) {
            for (let r=1; r<=ctrl.max_raw; r++) {
              redoList[redo.cnt].blockList[c][r].ind = blockList[c][r].ind;
              redoList[redo.cnt].blockList[c][r].status = blockList[c][r].status;
            }
          }
        }
        // refresh_block(); 
      }

      // ＝＝画面描写の更新＝＝
      if (scene_status == gConst.scene_main) {
      }

      // ＝＝ミス時のペナルティカバー表示管理
      if (ctrl.miss_step > 0) {
        ctrl.miss_step -= 1;
        gRect_story_cover.opacity = 0.5;
        gRect_story_cover.show();
        if (ctrl.miss_step <= 0) {
          gRect_story_cover.hide();
        }
      }

      // スコア更新があった場合
      if (score_plus != 0) {
        score_plus_step = 60;
        if (score_plus > 0) { gLabel_score_plus.text = "+"+score_plus }
        else                { gLabel_score_plus.text = ""+score_plus }
        gLabel_score_plus.invalidate();        
        score += score_plus;
        gLabel_score.text = ""+score;
        gLabel_score.invalidate();
        g.game.vars.gameState = { score: score }; 
        score_plus = 0;
        // エクストラモードのときイージーモードを終了
        if (system.extra == 1) { ctrl.easy = 0 }
      }
      // スコアプラス表示を消す
      if (score_plus_step > 0) {
        score_plus_step -= 1;
        gLabel_score_plus.opacity = score_plus_step / 30;
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
        if (ctrl.status != 2 && last_time > 0) { last_time -= 1 }
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
            // 次のシーンへ
            scene_status = 100; // ステータスはhelpアニメ用の値
            last_time = 0; // helpアニメを利用しない場合は即時進ませるように0をセット
            // カウントダウン表示をいったん消す
            sSprite_back.opacity = 0.2;
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
          // last_timeが0になったとき、遷移処理を行いステータスを更新する
          if (last_time <= 0) {
            // カウントダウン表示を再表示
            // sLabel_last_time.show();
            // 戻る／リスタートのボタンを表示する
            if (gConst.use_setting == 1) {
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
            // ★★今回readyは無し。アイキャッチのみとする★★
            scene_status = gConst.scene_main;
            last_time = gConst.time_main*g.game.fps;
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
      var sSprite_button_restart = gEntity.sSprite_button_setting(scene1, gConst, 0, 5, 4);
      if (system.dbg == 2 || gConst.jud_rensyu == 1) { layer.L[4].append(sSprite_button_restart) }      
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