<template>
  <div class="fans-container">
    <el-card>
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- tabs组件 -->
      <!-- v-model绑定的是当前激活的选项卡 -->
      <!-- type 代表tab选项卡的类型 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="list">
          <!-- 列表 -->
          <!-- 注意点：key绑定的值不是一个有效的string或者num的时候会报错，这里绑定的id值是个大数，会被认为不是一个数字 -->
          <div class="fans_list">
            <div class="fans_item" v-for="item in fansList" :key="item.id">
              <el-avatar :size="80" :src="item.photo"></el-avatar>
              <p>{{item.name}}</p>
              <el-button type="primary" plain size="small">+关注</el-button>
            </div>
          </div>
          <!-- 分页 -->
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :current-page='curPage'
            @current-change="changePage"
            :total="total"
          ></el-pagination>
        </el-tab-pane>

        <el-tab-pane label="粉丝画像" name="img">
          <!-- 准备一个具备宽高的容器 -->
          <div ref="main" style="width: 600px;height:400px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getFans ,fnasCount} from "@/api/fans"
import echarts from 'echarts'

export default {
  data() {
    return {
      fansList: [], //粉丝列表依赖的数据
      activeName: "list", //tab选项卡当前激活项
      pageSize: 20,//每页显示条数，后端要求每页最少显示20条
      total: 0,//总条数
      curPage:1 //当前页码数
    };
  },
  methods: {
    //获取数据渲染到页面
    hgetFans() {
      getFans({
        page:this.curPage,
        per_page: this.pageSize,
      }).then((res) => {
        let list = res.data.data.results;
        let newList = list.map((item) => {
          return {
            ...item,
            id: item.id.toString()
          };
        });
        this.fansList = newList;
        this.total=res.data.data.total_count
      });
    },

    // 当前页码改变时触发的事件
    changePage(val) {
      this.curPage=val;
      this.hgetFans()
    },

    //获取图表需要的真实的数据
    hfansCount(){
      fnasCount().then(res=>{
        // 传递真实的数据
        this.initCharts(res.data.data.age)
      })
    },

    // 初始化图表
    initCharts(ageObj){
      let x=[];
      let y=[];
      //ageObj的键是图表x轴需要的
      // ageObj的值是图表y轴需要的 
      // 遍历对象的键，
      Object.keys(ageObj).forEach(key=>{
        y.push(ageObj[key]);

        // 对键进行处理
        key=key.replace(/(gt)/g,'大于');
        key=key.replace(/(le)/g,'小于');
        x.push(key);
       
      });

      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(this.$refs.main);
      // 指定图表的配置项和数据
      let option = {
            tooltip: {},
            xAxis: {
                data:x
            },
            yAxis: {},
            series: [{
                name: '年龄',
                type: 'bar',
                data: y
            }]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  },
  mounted() {
    this.hgetFans()
    this.hfansCount()
  },
};
</script>

<style scoped lang='less'>
.fans_list {
  .fans_item {
    width: 120px;
    height: 170px;
    border: 1px dashed #ddd;
    text-align: center;
    padding-top: 10px;
    display: inline-block;
    margin-right: 30px;
    margin-bottom: 30px;
    p {
      margin: 10px 0;
    }
  }
}
</style>