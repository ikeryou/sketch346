import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Update } from '../libs/update';
import { Text } from './text';
import { Util } from '../libs/util';
import { Color } from 'three/src/math/Color';
import { Conf } from '../core/conf';
import { HSL } from '../libs/hsl';
// import { MousePointer } from '../core/mousePointer';
// import { MousePointer } from '../core/mousePointer';

export class Visual extends Canvas {

  private _con:Object3D;

  constructor(opt: any) {
    super(opt);

    this._con = new Object3D();
    this.mainScene.add(this._con);

    // this._con.rotation.x = Util.instance.radian(45);
    // this._con.rotation.z = Util.instance.radian(-45);

    const num = Conf.instance.TEXT_NUM;
    for(let i = 0; i < num; i++) {
      const col = new Color(0xff0000);
      const hsl = new HSL();
      col.getHSL(hsl);
      hsl.h = Util.instance.map(i, 0, 1, 0, num - 1);
      hsl.l = Util.instance.map(i, 0.5, 0.5, 0, num - 1);
      col.setHSL(hsl.h, hsl.s, hsl.l);

      this._con.add(new Text({
        id: i,
        color: col,
        useMask: true,
        // scale: Util.instance.random(1, 1.2),
        scale: Util.instance.map(i, 1, 1, 0, num - 1),
      }));
    }

    this._resize();
  }


  protected _update(): void {
    super._update();

    // const mx = MousePointer.instance.easeNormal.x;
    // const my = MousePointer.instance.easeNormal.y;
    // this._con.rotation.y = Util.instance.radian(mx * -40);
    // this._con.rotation.x = Util.instance.radian(my * -40);

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.render(this.mainScene, this.cameraPers);
  }


  public isNowRenderFrame(): boolean {
    return this.isRender && Update.instance.cnt % 2 == 0
  }


  _resize(): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    this.renderSize.width = w;
    this.renderSize.height = h;

    this._updateOrthCamera(this.cameraOrth, w, h);

    this.cameraPers.fov = 45;
    this._updatePersCamera(this.cameraPers, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();
  }
}
