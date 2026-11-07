<script setup>
import FloatingCards from "@/components/FloatingCards.vue";
import RecordCard from '@/components/Record-card.vue'
import { computed, ref, onMounted, watch } from "vue";

const records = ref([]);

async function fetchRecords() {
  try {
    const response = await fetch('http://localhost:8989/api/records');

    if(!response.ok) {
      throw new Error('Failed to fetch records');
    }

    const data = await response.json();
    records.value = data;
  } catch (error) {
    console.error('获取记录失败:', error);
  }
}

onMounted(fetchRecords);


const recentRecords = computed(() => {
  return [...records.value]
    .sort((a, b) => {
      return b.date[0].localeCompare(a.date[0])
    })
    .slice(0, 3)
})

</script>

<template>

<main class="Home-container">
  <section class="First-section">
    <div class="Left-container">

        <span class="top-highlight">PERSONAL PROJECT · VOLUNTEERHUB</span>

        <h1>Every Hour Counts<br>
            <span>Every Effort Matters</span>
        </h1>

        <p class="description"> A personal website to track volunteer service, 
        document meaningful experiences.
        </p>

        <RecordCard />
    </div>

    <div class="Right-container">
        <FloatingCards />
    </div>
    
  </section>

  <section class="Second-section">
    <div class="recent-header">
        <div>
          <h2>Recent Activity</h2>
        </div>

        <span>ADD</span>
    </div>

    <div class="activity-list">
        <!-- 活动记录 -->
      <div
          v-for="record in recentRecords" 
          :key="record.id" 
          class="activity-item"> <!-- 加一层list的div -->

        <div class="activity-info"> <!-- 加item的div-->
            <h3>{{ record.organization }}</h3>
            <span class="activity-detail"> <!--再加一层垂直排列-->
              {{ record.activity }} · {{ record.date[0] }}
            </span>
        </div>

          <strong>{{ record.hours }} hrs</strong> <!--这段单发-->
      </div>
    </div>
  </section>
</main>
</template>

<style scoped>
.Home-container {
  display: flex;
  display: flex;
  flex-direction: column;

  width: 100%;
  min-height: calc(100vh - 106px);
  box-sizing: border-box;
}

.Left-container,
.Right-container {
  min-width: 0;
}

.top-highlight {
    color: #ed8b0c;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 2px;
    margin: 20px 0 0 20px;
}


.Left-container h1 {
  font-size: clamp(38px, 3.6vw, 56px);
  line-height: 1.08;
  letter-spacing: -1.5px;
  margin: 20px 0 0 20px;
}

.Left-container h1 span {
  display: block;
  color: #ed8b0c;
}

.description {
  margin: 20px 0 0 20px;
  max-width: 440px;
  color: #6b7280;
  font-size: 16px;
  line-height: 1.8;
}

.First-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 32px;

  width: 100%;
  min-height: calc(100vh - 106px);
  padding: 32px;
  box-sizing: border-box;
}


.Second-section {
  width: 100%;
  min-height: 100vh;
  padding: 70px 5% 90px;
  
  box-sizing: border-box;
  background: #f7f8fa;
  font-family: Arial, Helvetica, sans-serif;
}

/* Header */
.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1250px;
  margin: 0 auto 38px;
}

.recent-header h2 {
  margin: 0;
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -1px;
  color: #202124;
}

.recent-header p {
  margin: 10px 0 0;
  color: #8a8f98;
  font-size: 16px;
}

.recent-header > span {
  padding: 13px 24px;
  border-radius: 9px;
  background: #ed8b0c;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.recent-header > span:hover {
  background: #d87900;
  transform: translateY(-2px);
}

/* Activity list */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1250px;
  margin: 0 auto;
}

/* Activity card */
.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 100px;
  padding: 24px 30px;
  box-sizing: border-box;

  background: white;
  border: 1px solid #eceef1;
  border-radius: 14px;

  transition: all 0.2s ease;
}

.activity-item:hover {
  border-color: #ed8b0c;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

/* Organization */
.activity-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.activity-info h3 {
  margin: 0;
  color: #252525;
  font-size: 20px;
  font-weight: 650;
}

/* Activity + date */
.activity-detail {
  color: #9298a2;
  font-size: 15px;
}

/* Hours */
.activity-item strong {
  color: #ed8b0c;
  font-size: 20px;
  font-weight: 600;
  white-space: nowrap;
}

/* Mobile */
@media (max-width: 600px) {
  .Second-section {
    padding: 50px 20px;
  }

  .recent-header h2 {
    font-size: 27px;
  }

  .activity-item {
    min-height: 85px;
    padding: 18px;
  }

  .activity-info h3 {
    font-size: 17px;
  }

  .activity-detail {
    font-size: 13px;
  }
}


</style> 
