<!-- 获取位置的界面 -->
<template>
  <view class='objView'>
    <u-row class="myInfoRow">
      <u-col span='12' style="font-size:17px">
        经度：{{longitude}} &nbsp&nbsp 纬度：{{latitude}}
      </u-col>
    </u-row>
    <u-row class="myInfoRow">
      <u-col span='12'>
        <textarea v-show="geocode" disabled=true type="primary" :value='position' placeholder="未加载出位置信息"> </textarea>
      </u-col>
    </u-row>
    <u-row>
      <u-col span='6'>
        <u-button type="success" shape="square" @click="changePosition">刷新当前位置</u-button>
      </u-col>
      <u-col span='6'>
        <u-button type="success" shape="square" @click="returnPosition">返回定位位置</u-button>
      </u-col>
    </u-row><br />
    <u-row>
      <!-- style内嵌标签的写法才能让app端地图全屏展示 -->
      <u-col span='12'>
        <map id="myMap" ref="myMap" :longitude="longitude" :latitude="latitude" :scale="scale" @tap='clickmap'
          :markers='covers' style="width: 100%; height: 100vh;">
        </map>
      </u-col>
    </u-row>
  </view>
</template>

<script>
  //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
  //例如：import 《组件名称》 from '《组件路径》';

  export default {
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
      //这里存放数据
      return {
        id: 0,
        longitude: 0, //记录实时点击位置
        latitude: 0,
        originalLongitude: 0, //记录用户当前真实位置随时返回
        originalLatitude: 0,
        scale: '16',
        //是否解析地址信息
        geocode: true,
        // 定位标记
        covers: [{
          longitude: this.longitude,
          latitude: this.latitude,
          iconPath: '../../static/imgs/nowPosition.png',
          width: 30,
          height: 30,
          label: {
            content: '当前位置',
            textAlign: 'center',
            color: '#FB3109'
          }
        }],
        //获取的地址信息
        position: '',
        //记录用户当前真实位置随时返回
        originalPosition: ''
      };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {

    },
    //方法集合
    methods: {
      //点击地图时触发
      clickmap(info) {
        //console.log('点击地图时候触发',info),
        uni.chooseLocation({
          success: (res) => {
            this.position = '位置名称:' + res.name + '  详细地址:' + res.address;
            this.longitude = res.longitude;
            this.latitude = res.latitude;
            //为标记点经纬度重新赋值【在data中赋坐标的方式无效】
            this.covers[0].longitude = res.longitude;
            this.covers[0].latitude = res.latitude;
            // console.log('位置名称：' + res.name);
            // console.log('详细地址：' + res.address);
            // console.log('纬度：' + res.latitude);
            // console.log('经度：' + res.longitude);
          },
          fail: (err) => {
            uni.showToast({
              title: '获取位置失败'
            });
          }
        });
      },
      //返回原始定位位置
      returnPosition() {
        this.position = this.originalPosition;
        this.longitude = this.originalLongitude;
        this.latitude = this.originalLatitude;
        //为标记点经纬度重新赋值【在data中赋坐标的方式无效】
        this.covers[0].longitude = this.originalLongitude;
        this.covers[0].latitude = this.originalLatitude;
      },
      //点击更改坐标
      changePosition() {
        this.longitude = this.longitude;
        this.latitude = this.latitude;
        console.log('坐标刷新成功');
        uni.showToast({
          title: '坐标刷新成功'
        });
      },
      //获取定位信息
      getLocation() {
        uni.showLoading({
          title: '正在获取定位'
        });
        uni.getLocation({
          type: "gcj02",
          timeout: '1000',
          geocode: this.geocode,
          success: (res) => {
            uni.hideLoading();
            this.longitude = res.longitude;
            this.latitude = res.latitude;
            //把原始定位另存一份，便于返回
            this.originalLongitude = res.longitude;
            this.originalLatitude = res.latitude;
            //为标记点经纬度重新赋值【在data中赋坐标的方式无效】
            this.covers[0].longitude = res.longitude;
            this.covers[0].latitude = res.latitude;
            //将地址信息进行存储
            let {
              address
            } = res
            let {
              country,
              province,
              city,
              district,
              street,
              streetNum,
              poiName
            } = address;
            // console.log('获取定位数据成功',res)
            //拼接地址
            let myPosition = country + '-' + province + '-' + city + '-' + district + '-' + street + '-' +
              streetNum + '-' + poiName;
            this.position = myPosition;
            //把原始定位另存一份，便于返回
            this.originalPosition = myPosition;
            //console.log(this.country,city)
          },
          fail: (err) => {
            uni.hideLoading();
            uni.showModal({
              title: '提示',
              content: '位置信息获取失败（请确定定位功能是否打开）',
              showCancel: false
            });
          }
        }, );
      }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      //获取位置信息
      this.getLocation();
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
      //获取当前地图的信息
      // let myMapInfo=this.$refs.myMap
      // console.log(myMapInfo)
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>


<style lang='css' scoped>
  #myMap {
    width: 750rpx;
  }

  /* 信息栏高度 */
  .myInfoRow {
    height: 50px;
  }

  /* 让地址栏通栏展示 */
  textarea {
    width: 100%;
  }
</style>