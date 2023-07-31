"use strict"
/*
  http://www.thothchildren.com/chapter/5b9133ff2787593b86372157
  ↑このアルゴリズムのイメージ
*/


// 関節数と長さを変数で変更可能
const Length = 600;
const Number = 2;

// キャンバスの初期化
const c = document.querySelector("canvas");
const ctx = c.getContext("2d");
c.width = 800;
c.height = 450;

// カーソルの位置を受け取る変数
let MousePos = {
  x: 0,
  y: 0
}

// カーソルの位置を取得
c.addEventListener("mousemove", function (element) {
  MousePos.x = element.pageX;
  MousePos.y = element.pageY;
})

// 計算用の変数の初期化
let PastTargetPosX = 0;
let PastTargetPosY = 0;
let PastPosX = 0;
let PastPosY = 0;

let IK = {

  // 初期化
  initialize: function (PosX, PosY, TargetPosX, TargetPosY, Number, Length, isFixed) {
    this.PosX = PosX || 0;
    this.PosY = PosY || 0;
    this.TargetPosX = TargetPosX || 0;
    this.TargetPosY = TargetPosY || 0;
    this.Number = Number || 1;
    this.Length = Length || 10;
    this.isFixed = isFixed || false;
    this.Array = [];
    for (let i = 0; i < Number; i++) {
      const Objects = {
        BasePosX: i * this.Length + PosX,
        BasePosY: PosY,
        Rad: Math.PI * 0.5
      };
      this.Array.push(Objects);
    }
  },

  // ゴール位置の設定
  set: function (TargetPosX, TargetPosY) {
    this.TargetPosX = TargetPosX;
    this.TargetPosY = TargetPosY;
  },

  // 計算の実行
  execute: function () {

    // 変数の初期化
    PastTargetPosX = this.TargetPosX;
    PastTargetPosY = this.TargetPosY;
    PastPosX = this.PosX;
    PastPosY = this.PosY;

    // 描画の設定
    ctx.strokeStyle = "lightgray";
    ctx.lineWidth = "2";

    // アームの先端をくっつけていく（Forward）
    for (let i = 0; i < this.Number; i++) {
      this.Array[i].Rad = Math.PI / 2 + Math.atan2(PastTargetPosY - this.Array[i].BasePosY, PastTargetPosX - this.Array[i].BasePosX)
      this.Array[i].BasePosX = PastTargetPosX + this.Length * Math.cos(Math.PI / 2 + this.Array[i].Rad);
      this.Array[i].BasePosY = PastTargetPosY + this.Length * Math.sin(Math.PI / 2 + this.Array[i].Rad);

      // アームを描画
      ctx.beginPath();
      ctx.moveTo(this.Array[i].BasePosX - 10 * Math.cos(this.Array[i].Rad), this.Array[i].BasePosY - 10 * Math.sin(this.Array[i].Rad));
      ctx.lineTo(this.Array[i].BasePosX + 10 * Math.cos(this.Array[i].Rad), this.Array[i].BasePosY + 10 * Math.sin(this.Array[i].Rad));
      ctx.lineTo(this.Array[i].BasePosX + this.Length * Math.sin(this.Array[i].Rad), this.Array[i].BasePosY - this.Length * Math.cos(this.Array[i].Rad));
      ctx.lineTo(this.Array[i].BasePosX - 10 * Math.cos(this.Array[i].Rad), this.Array[i].BasePosY - 10 * Math.sin(this.Array[i].Rad));
      ctx.lineTo(this.Array[i].BasePosX + 10 * Math.cos(this.Array[i].Rad), this.Array[i].BasePosY + 10 * Math.sin(this.Array[i].Rad));
      ctx.stroke();
      ctx.closePath();
      PastTargetPosX = this.Array[i].BasePosX;
      PastTargetPosY = this.Array[i].BasePosY;
    }
    ctx.strokeStyle = "gray";
    ctx.lineWidth = "5";
    ctx.fillStyle = "white";

    // アームの根元からくっつけていく（Backward）
    for (let i = this.Number - 1; i >= 0; i--) {
      this.Array[i].BasePosX = PastPosX;
      this.Array[i].BasePosY = PastPosY;
      ctx.beginPath();
      ctx.moveTo(this.Array[i].BasePosX - 10 * Math.cos(this.Array[i].Rad), this.Array[i].BasePosY - 10 * Math.sin(this.Array[i].Rad));
      ctx.lineTo(this.Array[i].BasePosX + 10 * Math.cos(this.Array[i].Rad), this.Array[i].BasePosY + 10 * Math.sin(this.Array[i].Rad));
      ctx.lineTo(this.Array[i].BasePosX + this.Length * Math.sin(this.Array[i].Rad), this.Array[i].BasePosY - this.Length * Math.cos(this.Array[i].Rad));
      ctx.lineTo(this.Array[i].BasePosX - 10 * Math.cos(this.Array[i].Rad), this.Array[i].BasePosY - 10 * Math.sin(this.Array[i].Rad));
      ctx.lineTo(this.Array[i].BasePosX + 10 * Math.cos(this.Array[i].Rad), this.Array[i].BasePosY + 10 * Math.sin(this.Array[i].Rad));
      ctx.stroke();
      ctx.fill();
      ctx.closePath();

      PastPosX = this.Array[i].BasePosX - this.Length * Math.cos(Math.PI / 2 + this.Array[i].Rad);
      PastPosY = this.Array[i].BasePosY - this.Length * Math.sin(Math.PI / 2 + this.Array[i].Rad);
    }
  }
}

// 初期化
IK.initialize(0, c.height / 2, c.width / 2, c.height / 2, Number, Length / Number, true)

function draw() {
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.beginPath();
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.closePath();
  IK.set(MousePos.x, MousePos.y)

  // 反復回数（多ければ多いほど安定する）
  for (let i = 0; i < 1; i++) {
    IK.execute();
  }
}

// ループ
(function loop() {
  draw();
  window.requestAnimationFrame(loop);
})();
