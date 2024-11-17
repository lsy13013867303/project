<template>
  <div class="centered-container">
    <el-container>
      <el-header style="height: auto; text-align: center;">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
          <el-breadcrumb-item>{{ countryInfo.country }} Country Details</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-main>
        <h1>{{ countryInfo.country }} Country Details</h1>
        <h2>Country Overview</h2>
        <p>{{ countryInfo.description }}</p>
        <h2>Total Medals Won</h2>
        <div class="medal-info">
          <p>
            <img src="@/assets/gold-medal.png" alt="Gold Medal" class="medal-icon" />
            <span class="medal-text">Gold: {{ countryInfo.gold }}</span>
          </p>
          <p>
            <img src="@/assets/silver-medal.png" alt="Silver Medal" class="medal-icon" />
            <span class="medal-text">Silver: {{ countryInfo.silver }}</span>
          </p>
          <p>
            <img src="@/assets/bronze-medal.png" alt="Bronze Medal" class="medal-icon" />
            <span class="medal-text">Bronze: {{ countryInfo.bronze }}</span>
          </p>
        </div>

        <h2>Sports Participated In</h2>
        <div class="table-container">
          <div class="table-wrapper">
            <el-table border :data="pagedSports">
              <el-table-column prop="name" label="Sport Name" align="center"></el-table-column>
              <el-table-column label="Gold Medals" align="center">
                <template slot-scope="scope">
                  <div class="medal-cell">
                    <img src="@/assets/gold-medal.png" alt="Gold Medal" class="medal-icon" />
                    <span class="medal-text">{{ scope.row.gold }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Silver Medals" align="center">
                <template slot-scope="scope">
                  <div class="medal-cell">
                    <img src="@/assets/silver-medal.png" alt="Silver Medal" class="medal-icon" />
                    <span class="medal-text">{{ scope.row.silver }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Bronze Medals" align="center">
                <template slot-scope="scope">
                  <div class="medal-cell">
                    <img src="@/assets/bronze-medal.png" alt="Bronze Medal" class="medal-icon" />
                    <span class="medal-text">{{ scope.row.bronze }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
                layout="prev, pager, next"
                :total="countryInfo.sports.length"
                :page-size="pageSize"
                :current-page.sync="currentPage"
                @current-change="handlePageChange"
            ></el-pagination>
          </div>
        </div>
        <h2>Comments</h2>
        <div class="comments-container">
          <el-row :gutter="20">
            <el-col :span="24">
              <div class="input-group">
                <label for="author">Name:</label>
                <el-input v-model="newCommentAuthor" id="author" placeholder="Enter your name" class="narrow-input"></el-input>
              </div>
              <div class="input-group">
                <label for="content">Comment:</label>
                <el-input v-model="newCommentContent" id="content" type="textarea" placeholder="Write your comment..." class="narrow-input"></el-input>
              </div>
              <div class="button-container">
                <el-button @click="addComment" class="small-button">Post Comment</el-button>
              </div>
            </el-col>
          </el-row>
          <h2>Comments List</h2>
          <div class="comments-list" ref="commentsList">
            <div v-for="(comment, index) in comments" :key="index" class="comment-item">
              <el-row :gutter="10">
                <el-col :span="4" class="comment-avatar-col">
                  <img src="@/assets/default-avatar.png" alt="Default Avatar" class="comment-avatar" />
                </el-col>
                <el-col :span="20" class="comment-details-col">
                  <div class="comment-author-time">
                    <span class="comment-author-label">User Name:</span>
                    <span class="comment-author">{{ comment.author }}</span>
                    <span class="comment-time-label">Date:</span>
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
      comments: [],
      pageSize: 10, // 每页显示的记录数
      currentPage: 1 // 当前页码
    };
  },
  computed: {
    pagedSports() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.countryInfo.sports.slice(start, end);
    }
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
        // element-ui的提示框
        this.$message.error('Please enter both the author and the comment content');
        return;
      }
      commentStore.addComment(this.id, newComment);
      this.comments = commentStore.getComments(this.id);
      this.newCommentAuthor = '';
      this.newCommentContent = '';
    },
    handlePageChange(page) {
      this.currentPage = page;
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

.el-pagination {
  margin-top: 20px;
  text-align: center;
}

.el-row {
  display: flex;
  align-items: center;
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
