(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["articles"],{"1e45":function(t,e,a){},2423:function(t,e,a){"use strict";a.d(e,"c",(function(){return n})),a.d(e,"f",(function(){return l})),a.d(e,"d",(function(){return o})),a.d(e,"a",(function(){return i})),a.d(e,"b",(function(){return s})),a.d(e,"e",(function(){return c}));var r=a("b775"),n=function(t){return Object(r["a"])({url:"/mp/v1_0/articles",method:"get",params:t})},l=function(){return Object(r["a"])({url:"/mp/v1_0/channels",method:"get"})},o=function(t){return Object(r["a"])({method:"delete",url:"/mp/v1_0/articles/".concat(t)})},i=function(t,e){return Object(r["a"])({method:"post",url:"/mp/v1_0/articles",params:{draft:t},data:e})},s=function(t){return Object(r["a"])({url:"/mp/v1_0/articles/".concat(t),method:"get"})},c=function(t,e,a){return Object(r["a"])({url:"/mp/v1_0/articles/".concat(t),method:"PUT",params:e,data:a})}},"25f0":function(t,e,a){"use strict";var r=a("6eeb"),n=a("825a"),l=a("d039"),o=a("ad6d"),i="toString",s=RegExp.prototype,c=s[i],u=l((function(){return"/a/b"!=c.call({source:"a",flags:"b"})})),d=c.name!=i;(u||d)&&r(RegExp.prototype,i,(function(){var t=n(this),e=String(t.source),a=t.flags,r=String(void 0===a&&t instanceof RegExp&&!("flags"in s)?o.call(t):a);return"/"+e+"/"+r}),{unsafe:!0})},"357b":function(t,e,a){"use strict";var r=a("1e45"),n=a.n(r);n.a},"76cf":function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"article"},[a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[a("el-breadcrumb-item",{attrs:{to:{path:"/"}}},[t._v("首页")]),a("el-breadcrumb-item",[t._v("内容管理")])],1)],1),a("div",{staticClass:"from"},[a("el-form",{ref:"form",attrs:{model:t.form,"label-width":"40px",size:"mini"}},[a("el-form-item",{attrs:{label:"状态"}},[a("el-radio-group",{model:{value:t.form.status,callback:function(e){t.$set(t.form,"status",e)},expression:"form.status"}},[a("el-radio",{attrs:{label:null}},[t._v("全部")]),a("el-radio",{attrs:{label:0}},[t._v("草稿")]),a("el-radio",{attrs:{label:1}},[t._v("待审核")]),a("el-radio",{attrs:{label:2}},[t._v("审核通过")]),a("el-radio",{attrs:{label:3}},[t._v("审核失败")]),a("el-radio",{attrs:{label:4}},[t._v("已删除")])],1)],1),a("el-form-item",{attrs:{label:"频道"}},[a("el-select",{attrs:{placeholder:"请选择频道"},model:{value:t.form.channelId,callback:function(e){t.$set(t.form,"channelId",e)},expression:"form.channelId"}},t._l(t.channels,(function(t){return a("el-option",{key:t.id,attrs:{label:t.name,value:t.id}})})),1)],1),a("el-form-item",{attrs:{label:"日期"}},[a("el-date-picker",{attrs:{type:"datetimerange","start-placeholder":"开始日期","end-placeholder":"结束日期","value-format":"yyyy-MM-dd","default-time":["12:00:00"]},model:{value:t.form.date,callback:function(e){t.$set(t.form,"date",e)},expression:"form.date"}})],1),a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:t.doSearch}},[t._v("查询")])],1)],1)],1)]),a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[t._v("根据条件筛选到"+t._s(t.total_count)+"条")]),a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.tableData}},[a("el-table-column",{attrs:{label:"封面",width:"180"},scopedSlots:t._u([{key:"default",fn:function(t){return[a("el-image",{staticStyle:{width:"100px",height:"100px"},attrs:{src:t.row.cover.images[0],fit:"contain "}})]}}])}),a("el-table-column",{attrs:{prop:"title",label:"标题",width:"180"}}),a("el-table-column",{attrs:{prop:"status",label:"状态"},scopedSlots:t._u([{key:"default",fn:function(e){return[0===e.row.status?a("el-tag",[t._v("草稿")]):1===e.row.status?a("el-tag",{attrs:{type:"info"}},[t._v("待审核")]):2===e.row.status?a("el-tag",{attrs:{type:"success"}},[t._v("审核通过")]):3===e.row.status?a("el-tag",{attrs:{type:"warning"}},[t._v("审核失败")]):4===e.row.status?a("el-tag",{attrs:{type:"danger"}},[t._v("已删除")]):t._e()]}}])}),a("el-table-column",{attrs:{prop:"pubdate",label:"发布时间"}}),a("el-table-column",{attrs:{label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{circle:"",type:"primary",size:"mini",icon:"el-icon-edit"},on:{click:function(a){return t.handleEdit(e.$index,e.row)}}}),a("el-button",{attrs:{circle:"",size:"mini",icon:"el-icon-delete",type:"danger"},on:{click:function(a){return t.handleDelete(e.$index,e.row)}}})]}}])})],1),a("el-pagination",{staticClass:"pageCount",attrs:{background:"",layout:"total,  prev, pager, next, jumper","current-page":t.curPage,total:t.total_count},on:{"current-change":t.handleSizeChange}})],1)],1)},n=[],l=(a("d3b7"),a("25f0"),a("2423")),o={data:function(){return{form:{status:null,channelId:null,begin_pubdat:"",end_pubdate:"",date:null},channels:[],tableData:[],total_count:0,curPage:JSON.parse(localStorage.getItem("curpage"))||1}},methods:{doSearch:function(){this.getList()},getList:function(){var t=this;null===this.form.date?(this.form.begin_pubdat="",this.form.end_pubdate=""):(this.form.begin_pubdat=this.form.date[0],this.form.end_pubdate=this.form.date[1]),Object(l["c"])({page:this.curPage,status:this.form.status,channel_id:this.form.channelId,begin_pubdate:this.form.begin_pubdat,end_pubdate:this.form.end_pubdate}).then((function(e){t.tableData=e.data.data.results,t.total_count=e.data.data.total_count}))},hgetChannel:function(){var t=this;Object(l["f"])().then((function(e){t.channels=e.data.data.channels}))},handleSizeChange:function(t){this.curPage=t,this.getList(),localStorage.setItem("curpage",JSON.stringify(t))},handleEdit:function(t,e){console.log(e,t),this.$router.push({path:"editArticle",query:{id:e.id}})},handleDelete:function(t,e){var a=this;console.log(e.id);var r=e.id.toString();Object(l["d"])(r).then((function(t){a.getList(),console.log("删除成功")}))}},mounted:function(){this.getList(),this.hgetChannel()}},i=o,s=(a("357b"),a("2877")),c=Object(s["a"])(i,r,n,!1,null,"1d531780",null);e["default"]=c.exports},ad6d:function(t,e,a){"use strict";var r=a("825a");t.exports=function(){var t=r(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.dotAll&&(e+="s"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e}}}]);
//# sourceMappingURL=articles.9fed0269.js.map