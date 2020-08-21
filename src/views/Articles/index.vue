<template>
  <div class="article">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="from">
        <!-- 数据筛选表单 -->
        <el-form ref="form" :model="form" label-width="40px" size="mini">
          <el-form-item label="状态">
            <!-- 接口需要的数据是0 1 2 3 4 -->
            <!-- 既要保证传递过去的数据符合接口要求，又要保证前端页面显示的内容 -->
            <el-radio-group v-model="form.status">
              <el-radio :label="null">全部</el-radio>
              <el-radio :label="0">草稿</el-radio>
              <el-radio :label="1">待审核</el-radio>
              <el-radio :label="2">审核通过</el-radio>
              <el-radio :label="3">审核失败</el-radio>
              <el-radio :label="4">已删除</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道">
            <el-select v-model="form.channelId" placeholder="请选择频道">
              <!-- value是接口需要的数据 -->
              <!-- v-for循环渲染数组列表-->
              <el-option
                v-for="item in channels"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="form.date"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :default-time="['12:00:00']"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSearch">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- /数据筛选表单 -->
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">根据条件筛选到{{total_count}}条</div>

      <!-- data属性控制了要渲染的实际数据 -->
      <!-- el-table-column代表表格的每一列，label代表表头文字，prop代表渲染的数据字段名 -->
      <!--注意点：表格按列渲染的 -->
      <el-table :data="tableData" style="width: 100%">
        <!--封面需要的数据不能直接通过属性名获取到，我们需要进入到对象里面才可以获取到  -->
        <!-- 如何取到呢？ -->
        <!-- 通过 -->
        <el-table-column label="封面" width="180">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover.images[0]"
              fit="contain "
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="180"></el-table-column>
        <el-table-column prop="status" label="状态">
          <!-- 不同的状态码渲染不同的视图，使用v-if/v-show完成 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===0">草稿</el-tag>
            <el-tag v-else-if="scope.row.status===1" type="info">待审核</el-tag>
            <el-tag v-else-if="scope.row.status===2" type="success">审核通过</el-tag>
            <el-tag v-else-if="scope.row.status===3" type="warning">审核失败</el-tag>
            <el-tag v-else-if="scope.row.status===4" type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              circle
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            ></el-button>
            <el-button
              circle
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"
              type="danger"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- total:总页数，total/pageSize=pageNum -->
      <!-- current-change 当前页码改变时触发的事件 -->
      <!-- size-change 每页显示的条数改变时触发 -->
      <el-pagination
        background
        layout="total,  prev, pager, next, jumper"
        :current-page="curPage"
        class="pageCount"
        :total="total_count"
        @current-change="handleSizeChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { articleList, getChannel ,delArticle} from "@/api/article";

export default {
  data() {
    return {
      form: {
        status: null, //文章状态
        channelId: null, //选择频道
        begin_pubdat: "",
        end_pubdate: "",
        date: null,
      },
      channels: [], //频道列表
      tableData: [],
      total_count: 0,
      curPage:JSON.parse(localStorage.getItem("curpage"))||1//控制当前页码
    };
  },
  methods: {
    // 点击查询
    doSearch() {
      this.getList();
    },

    // 获取文章列表,把返回的数据赋值给表格绑定的响应式数据tableData
    getList() {
      // date数据为空null的话，会报错
      if (this.form.date === null) {
        this.form.begin_pubdat = "";
        this.form.end_pubdate = "";
      } else {
        this.form.begin_pubdat=this.form.date[0];
        this.form.end_pubdate=this.form.date[1];
      }

      articleList({
        page: this.curPage,
        status: this.form.status,
        channel_id: this.form.channelId,
        begin_pubdate: this.form.begin_pubdat,
        end_pubdate: this.form.end_pubdate,
      }).then((res) => {
        this.tableData = res.data.data.results;
        this.total_count = res.data.data.total_count;
      });
    },

    // 从服务器获取频道列表
    hgetChannel() {
      getChannel().then((res) => {
        this.channels = res.data.data.channels;
      });
    },

    //页码改变时要做的事情
    // 1、data中的cuePage修改为当前页码
    // 2、重新渲染数据到页面
    handleSizeChange(val) {
      // 默认传入的值就是当前页
      // 形参val接收到的就是当前页
      // console.log(val);
      // 改变data中绑定的响应式数据中的当前值
      this.curPage = val;
      // 重新渲染数据到页面
      this.getList();
      localStorage.setItem('curpage',JSON.stringify(val))
    },

    // 编辑文章
    handleEdit(index, row) {
      //index: scope.$index 从0开始代表当前操作的数据是第几项
      //row: scope.row  代表数据列表中的每一项数据
      console.log(row, index);
      //点击编辑跳转到编辑路由，并传递参数
      this.$router.push({
        path: "editArticle",
        query: {
          id: row.id,
        },
      });
    },

    // 删除文章
    // 删除文章失败
    // 发现问题：接口返回的数据：1294526296142905344
    //          前端发送请求的数据：1294526296142905300
    // 原因：json字符串转为js对象超过数值显示的范围会出现精度问题
    // axios请求内部默认使用JSON.parse转换json字符串为对象
    handleDelete(index, row) {
      console.log(row.id);
      // 获取id数据
      let id=row.id.toString()
      delArticle(id).then(res=>{
        this.getList();
        console.log('删除成功');
      })
    },
  },
  mounted() {
    this.getList();
    this.hgetChannel();
  },
};
</script>

<style lang="less" scoped>
.box-card {
  margin-bottom: 20px;
  .from {
    margin-top: 20px;
  }
}
.pageCount {
  margin-top: 10px;
}
</style>