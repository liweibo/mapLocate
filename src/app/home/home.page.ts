import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
declare var RemoGeoLocation: any;
declare var AMap;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('map_container') map_container: ElementRef;
  map: any;//地图对象
  mapline: any[] = [];
  preVal: any[] = [];
  count: number = 0;
  private timer;
  private timer1;

  // 定位结果
  locationRe: any = [];
  constructor(private geolocation: Geolocation) {
    // var remoGeo = new RemoGeoLocation();
    // console.log("-1-1:" + remoGeo._getSeq());

  }
  ionViewDidEnter() {
    this.loca();
    this.timer = setInterval(() => {
      this.locaRE();
    }, 5000)
  }


  //首次定位 并不断画大地线。
  loca() {
    var map = new AMap.Map(this.map_container.nativeElement, {
      resizeEnable: true
    });
    var options = {
      'enableHighAccuracy': true,//是否使用高精度定位，默认:true
      'timeout': 10000,          //超过10秒后停止定位，默认：5s
      'zoomToAccuracy': true,   //定位成功后是否  自动调整地图视野到定位点
      'showButton': true,//是否显示定位按钮
      'buttonPosition': 'RB',//定位按钮的位置
      'buttonOffset': new AMap.Pixel(10, 20),//定位按钮距离对应角落的距离
      'showMarker': true,//是否显示定位点
      'markerOptions': {//自定义定位点样式，同Marker的Options
        'offset': new AMap.Pixel(-18, -36),
        'content': '<img src="https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png" style="width:36px;height:36px"/>'
      },
    }




    AMap.plugin('AMap.Geolocation', function () {
      var geolocation = new AMap.Geolocation(options);

      // ios环境切换到使用远程https定位
      if (AMap.UA.ios && document.location.protocol !== 'https:') {

        //使用远程定位，见 remogeo.js
        var remoGeo = new RemoGeoLocation();

        //替换方法
        navigator.geolocation.getCurrentPosition = function () {
          return remoGeo.getCurrentPosition.apply(remoGeo, arguments);
        };

        //替换方法
        navigator.geolocation.watchPosition = function () {
          return remoGeo.watchPosition.apply(remoGeo, arguments);
        };
      }

      map.addControl(geolocation);
      geolocation.getCurrentPosition(function (status, result) {
        if (status == 'complete') {
        } else {
        }
      });
    });
    //画大地线
    this.timer1 = setInterval(() => {
      console.log("划线...........");
      var polyline = new AMap.Polyline({
        path: this.mapline,            // 设置线覆盖物路径
        strokeColor: '#3366FF',   // 线颜色
        strokeOpacity: 1,         // 线透明度
        strokeWeight: 2,          // 线宽
        strokeStyle: 'solid',     // 线样式
        strokeDasharray: [10, 5], // 补充线样式
        geodesic: true            // 绘制大地线
      });
      polyline.setMap(map);
    }, 5000)
  }

  //定位
  locaRE() {
    var options = {
      'enableHighAccuracy': true,//是否使用高精度定位，默认:true
      'timeout': 10000,          //超过10秒后停止定位，默认：5s
      'zoomToAccuracy': true,   //定位成功后是否  自动调整地图视野到定位点
      'showButton': true,//是否显示定位按钮
      'buttonPosition': 'RB',//定位按钮的位置
      'buttonOffset': new AMap.Pixel(10, 20),//定位按钮距离对应角落的距离
      'showMarker': true,//是否显示定位点
      'markerOptions': {//自定义定位点样式，同Marker的Options
        'offset': new AMap.Pixel(-18, -36),
        'content': '<img src="https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png" style="width:36px;height:36px"/>'
      },
    }
    let that = this;


    AMap.plugin('AMap.Geolocation', function () {
      var geolocation = new AMap.Geolocation(options);
      geolocation.getCurrentPosition(function (status, result) {
        if (status == 'complete') {
          if (that.count == 0) {
            that.preVal = result.position;
            that.mapline.push(that.preVal);
            console.log("定位结果..shuzu111：" + that.mapline);
            that.count++;
          }
          var nowVal = result.position;
          if (that.preVal.toString() != nowVal.toString()) {
            that.mapline.push(nowVal);
            that.preVal = nowVal;
            console.log("定位结果..shuzu：" + that.mapline);
          }

        } else {
        }
      });
    });
  }

  ionViewDidLeave() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.timer1) {
      clearInterval(this.timer1);
    }
  }
}
