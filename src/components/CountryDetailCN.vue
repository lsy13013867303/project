<template>
  <div class="centered-container">
    <el-container>
      <el-header style="height: auto;">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ countryInfo.country }} 国家详情</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-main>
        <h1>{{ countryInfo.country }} 国家详情</h1>
        <h2>国家简介</h2>
        <p>{{ countryInfo.description }}</p>
        <h2>国家获奖总计</h2>
        <div class="medal-info">
          <p>
            <img src="@/assets/gold-medal.png" alt="Gold Medal" class="medal-icon" />
            <span class="medal-text">金牌: {{ countryInfo.gold }}</span>
          </p>
          <p>
            <img src="@/assets/silver-medal.png" alt="Silver Medal" class="medal-icon" />
            <span class="medal-text">银牌: {{ countryInfo.silver }}</span>
          </p>
          <p>
            <img src="@/assets/bronze-medal.png" alt="Bronze Medal" class="medal-icon" />
            <span class="medal-text">铜牌: {{ countryInfo.bronze }}</span>
          </p>
        </div>

        <h2>参与运动项目</h2>
        <div class="table-container">
          <div class="table-wrapper">
            <el-table :data="countryInfo.sports">
              <el-table-column prop="name" label="项目名称"></el-table-column>
              <el-table-column label="金牌数">
                <template slot-scope="scope">
                  <div class="medal-cell">
                    <img src="@/assets/gold-medal.png" alt="Gold Medal" class="medal-icon" />
                    <span class="medal-text">{{ scope.row.gold }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="银牌数">
                <template slot-scope="scope">
                  <div class="medal-cell">
                    <img src="@/assets/silver-medal.png" alt="Silver Medal" class="medal-icon" />
                    <span class="medal-text">{{ scope.row.silver }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="铜牌数">
                <template slot-scope="scope">
                  <div class="medal-cell">
                    <img src="@/assets/bronze-medal.png" alt="Bronze Medal" class="medal-icon" />
                    <span class="medal-text">{{ scope.row.bronze }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <h2>评论</h2>
        <div class="comments-container">
          <el-row :gutter="20">
            <el-col :span="24">
              <div class="input-group">
                <label for="author">姓名：</label>
                <el-input v-model="newCommentAuthor" id="author" placeholder="请输入评论人姓名" class="narrow-input"></el-input>
              </div>
              <div class="input-group">
                <label for="content">评论内容：</label>
                <el-input v-model="newCommentContent" id="content" type="textarea" placeholder="写下您的评论..." class="narrow-input"></el-input>
              </div>
              <div class="button-container">
                <el-button @click="addComment" class="small-button">发表评论</el-button>
              </div>
            </el-col>
          </el-row>
          <h2>评论列表</h2>
          <div class="comments-list" ref="commentsList">
            <div v-for="(comment, index) in comments" :key="index" class="comment-item">
              <el-row :gutter="10">
                <el-col :span="4" class="comment-avatar-col">
                  <img src="@/assets/default-avatar.png" alt="Default Avatar" class="comment-avatar" />
                </el-col>
                <el-col :span="20" class="comment-details-col">
                  <div class="comment-author-time">
                    <span class="comment-author-label">user name:</span>
                    <span class="comment-author">{{ comment.author }}</span>
                    <span class="comment-time-label">date:</span>
                    <span class="comment-time">{{ comment.time }}</span>
                  </div>
                  <p class="comment-content">{{ comment.content }}</p>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { useCommentStore } from '@/store';
import axios from 'axios';
import moment from 'moment';

export default {
  props: ['id'],
  data() {
    return {
      countryInfo: {},
      newCommentAuthor: '',
      newCommentContent: '',
      comments: []
    };
  },
  created() {
    this.loadCountryInfo();
    this.loadComments();
  },
  methods: {
    async loadCountryInfo() {
      try {
        const response = await axios.get(`/data/olympics.json`);
        this.countryInfo = response.data.find(country => country.id === parseInt(this.id));
      } catch (error) {
        console.error('Error loading country info:', error);
      }
    },
    loadComments() {
      const commentStore = useCommentStore();
      this.comments = commentStore.getComments(this.id);
    },
    addComment() {
      const commentStore = useCommentStore();
      const newComment = {
        author: this.newCommentAuthor,
        content: this.newCommentContent,
        time: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      if (!newComment.author || !newComment.content) {
        //element-ui的提示框
        this.$message.error('请输入评论人和评论内容');
        return;
      }
      commentStore.addComment(this.id, newComment);
      this.comments = commentStore.getComments(this.id);
      this.newCommentAuthor = '';
      this.newCommentContent = '';
    }
  }
};
</script>

<style scoped>
.centered-container {
  width: 70%;
  margin: 0 auto;
  text-align: center; /* 确保所有内容居中对齐 */
}

h1, h2 {
  text-align: center;
}

p {
  text-align: center;
  margin: 10px 0;
}

.medal-info p {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.medal-icon {
  width: 30px;
  height: 30px;
  margin-right: 5px;
}

.medal-text {
  vertical-align: middle;
}

.table-container {
  margin-top: 20px;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.table-wrapper {
  width: 80%; /* 调整表格宽度 */
  margin: 0 auto; /* 表格居中 */
  text-align: center; /* 确保表格内容居中对齐 */
}

.el-table {
  width: 100%; /* 确保表格占满 table-wrapper 的宽度 */
  text-align: center;
}

.medal-cell {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.el-input, .el-textarea {
  width: 100%;
  margin-bottom: 10px;
}

.narrow-input {
  width: 60%; /* 缩小宽度到60% */
  margin: 0 auto; /* 居中对齐 */
}

.small-button {
  width: 30%; /* 缩小宽度到30% */
  background-color: #4CAF50; /* 设置背景颜色 */
  color: white; /* 设置文字颜色 */
  margin-top: 10px; /* 设置顶部间距 */
}

.button-container {
  display: flex;
  justify-content: center; /* 按钮水平居中 */
  margin-top: 10px; /* 设置顶部间距 */
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.input-group label {
  width: 20%; /* 标签宽度 */
  text-align: right; /* 标签右对齐 */
  margin-right: 10px; /* 标签与输入框之间的间距 */
}

.comments-container {
  margin-top: 20px;
}

.comments-list {
  border: 1px solid #e0e0e0;
  padding: 10px;
  margin: 20px auto;
  width: 70%;
}

.comment-item {
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 0;
}

.comment-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-avatar-col {
  display: flex;
  align-items: center;
  justify-content: center;
}

.comment-details-col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.comment-author-time {
  display: flex;
  align-items: center; /* 垂直居中 */
  margin-top: 5px;
}

.comment-author-label {
  font-weight: bold;
  color: #333; /* 姓名颜色 */
  margin-right: 5px;
}

.comment-author {
  font-weight: bold;
  color: #f3a238; /* 姓名标签颜色 */
  margin-right: 10px; /* 评论人和时间之间的间距 */
}

.comment-time-label {
  font-weight: bold;
  color: #333; /* 姓名颜色 */
  margin-right: 5px;
  margin-left: 60px;
}

.comment-time {
  font-size: 0.8em;
  color: #ff9d9d; /* 时间颜色 */
}

.comment-content {
  margin: 10px;
  padding: 0;
  word-break: break-word;
  text-align: left; /* 评论内容靠左对齐 */
  max-height: 100px; /* 设置最大高度 */
  overflow-y: auto; /* 超出部分显示滚动条 */
}
</style>
