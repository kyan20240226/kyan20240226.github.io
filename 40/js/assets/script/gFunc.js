window.gLocalAssetContainer["gFunc"] = function(g) { (function(exports, require, module, __filename, __dirname) {
// 各種定数設定の計算処理
module.exports.set_const = function(gConst) {

  // ブロック描写用のscale
  gConst.block.scale = gConst.size.block/gConst.block.width;
  gConst.object.scale = gConst.size.block/gConst.object.width;
  // プレイヤー描写のscale
  gConst.player.scale = gConst.size.chara/gConst.player.width;
  // プレーヤー移動のspeed
  gConst.move.speed = gConst.size.chara/gConst.step.turn;

  // ブロックの標準位置情報


  return ;
};










// ログ記録
module.exports.add_log = function(log, i, time, text, dbg) {
  if (dbg > 0) { log[i] = "<"+i+">"+time+", "+text }
  return ;
};

// デバッグメッセージの更新
module.exports.dbg_message = function(Label_debug_msg, text, add, dbg) {
  if (dbg == 2) {
    if (add == 0) {
      Label_debug_msg.text = ""+text;
    } else {
      let label_text = Label_debug_msg.text;
      Label_debug_msg.text = label_text+text;
    } 
    Label_debug_msg.invalidate();
  }
  return ;
};

// レイヤー作成
module.exports.set_layer = function(scene, gConst) {
  // 使用する階層の宣言
  let layer = {
    L: {},
    S: {},
    S1: {},
    S2: {},
    L4_setting: 0,
    L4_help: 0,
    L4_helpList: {},
    L5_log: 0,
    S1_new: 0,
  }
  // 全体階層
  for (let i=1; i<=5; i++) { 
    layer.L[i] = new g.E({ scene: scene });
    scene.append(layer.L[i]);
  }
  // シーン用の階層：全体階層のL[2](ボディ層)にアペンドする
  for (let i=1; i<=5; i++) { 
    layer.S[i] = new g.E({ scene: scene });
    layer.L[2].append(layer.S[i]);
    if (i > 1) { layer.S[i].hide() } // シーン1以外はhideしておく
  }
  // 各シーン内の階層
  for (let i=1; i<=5; i++) { 
    layer.S1[i] = new g.E({ scene: scene });
    layer.S[1].append(layer.S1[i]);
  }
  for (let i=1; i<=50; i++) { 
    layer.S2[i] = new g.E({ scene: scene });
    layer.S[2].append(layer.S2[i]);
  }
  // L4への追加: 詳細設定
  layer.L4_setting = new g.E({ scene: scene });
  layer.L[4].append(layer.L4_setting);
  layer.L4_setting.hide();
  // L4への追加: ヘルプ一式
  layer.L4_help = new g.E({ scene: scene });
  layer.L[4].append(layer.L4_help);
  layer.L4_help.hide();
  for (let i=1; i<=gConst.help_page; i++) { 
    layer.L4_helpList[i] = new g.E({ scene: scene });
    layer.L4_help.append(layer.L4_helpList[i]);
    layer.L4_helpList[i].hide();
  }
  // L5への追加: ログ用
  layer.L5_log = new g.E({ scene: scene });
  layer.L[5].append(layer.L5_log);
  layer.L5_log.hide();
  // S1の4層への追加: タイトルの更新情報表示意識
  layer.S1_new = new g.E({ scene: scene }); // 
  layer.S1[4].append(layer.S1_new);
  layer.S1_new.hide();

  return layer;
};


// ランダムの数字列を生成
module.exports.sort0 = function(n) {
  let a={};
  for (let i=0; i<n; i++) { a[i] = i }
  for (let i=n; i>0; i--) {
    let ind = Math.floor(g.game.random.generate()*i);
    let data = a[ind];
    for (let j=ind; j<i-1; j++) { a[j] = a[j+1] }
    a[i-1] = data; 
  }
  return a;
};




})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}