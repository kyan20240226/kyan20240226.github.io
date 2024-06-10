window.gLocalAssetContainer["main"] = function(g) { (function(exports, require, module, __filename, __dirname) {
exports.main = void 0;


// main関数
function main(param) {
  g.game.pushScene(createScene1(param));
}


// createScene関数
function createScene1(param) {
  // 同配牌モード
  // let random = param.random;

  // シーンの宣言
  var scene1 = new g.Scene({
    game: g.game,
    assetIds: [
    ]
  });

  // シーンのオンロード
  scene1.onLoad.add(function () {
    
    // rectを１個だけ作っておく
    let rect1 = new g.FilledRect({
      scene: scene1,
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      cssColor: "red"
    });
    scene1.append(rect1);

    // ～～～～定期処理～～～～
    // scene1.setInterval(function() {
    scene1.update.add(() => {

    });
    // }, 1000/g.game.fps);

    // ～～～～テンプレ適宜追加分～～～～


  });

  // 作成したシーンを返す
  return scene1;
}


exports.main = main;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}