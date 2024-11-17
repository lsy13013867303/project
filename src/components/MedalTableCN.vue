<template>
  <div>
    <el-header>
      <h1>奥运会奖牌榜</h1>
    </el-header>
    <div class="centered-container">
      <el-container>
        <el-main>
          <el-row :gutter="10">
            <el-col :span="6">
              <span>每页显示的国家数量</span>
            </el-col>
            <el-col :span="12">
              <el-input v-model="pageSize" type="number" placeholder="每页显示的国家数量">
                <template #append>
                  <el-button type="primary">确定</el-button>
                </template>
              </el-input>
            </el-col>
          </el-row>
          <el-table style="margin-top: 30px" :data="paginatedMedals">
            <el-table-column prop="country" label="国家" width="180">
              <template slot-scope="scope">
                <div class="flex-center">
                  <img :src="scope.row.icon" height="30" width="30" alt="Country Flag" />
                  <a href="#" @click.prevent="goToCountryDetail(scope.row.id)">{{ scope.row.country }}</a>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="gold" label="金牌">
              <template slot-scope="scope">
                <div class="flex-center">
                  <img src="@/assets/gold-medal.png" height="30" width="30" alt="Gold Medal" />
                  <span>{{ scope.row.gold }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="silver" label="银牌">
              <template slot-scope="scope">
                <div class="flex-center">
                  <img src="@/assets/silver-medal.png" height="30" width="30" alt="Silver Medal" />
                  <span>{{ scope.row.silver }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="bronze" label="铜牌">
              <template slot-scope="scope">
                <div class="flex-center">
                  <img src="@/assets/bronze-medal.png" height="30" width="30" alt="Bronze Medal" />
                  <span>{{ scope.row.bronze }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      medals: [],
      pageSize: 10,
      currentPage: 1
    };
  },
  computed: {
    paginatedMedals() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.medals.slice(start, end);
    }
  },
  methods: {
    async loadMedals() {
      try {
        const response = await axios.get('/data/olympics.json');
        this.medals = response.data;
      } catch (error) {
        console.error('Error loading medal data:', error);
      }
    },
    goToCountryDetail(id) {
      console.log(`Going to country detail page for ID: ${id}`);
      this.$router.replace({ name: 'CountryDetail', params: { id: id } });
    },
    handlePageChange(page) {
      this.currentPage = page;
    }
  },
  created() {
    this.loadMedals();
  }
};
</script>
<style scoped>
.centered-container {
  width: 70%;
  margin: 0 auto;
}
.el-row {
  display: flex;
  align-items: center;
}
.flex-center {
  display: flex;
  align-items: center;
  gap: 8px; /* 图片和文字之间的间距 */
}
</style>
